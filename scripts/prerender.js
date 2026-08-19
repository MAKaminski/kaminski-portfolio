/* eslint-disable */
// Post-build prerender.
//
// The site is a CRA single-page app, so the HTML that leaves the server is a
// stub: <div id="root"></div> and nothing else. Search crawlers and every LLM
// crawler read that stub, which means the portfolio and the writing were
// effectively invisible to them.
//
// This script writes real prose INTO #root for the home page and for every
// article, after the normal build. React's createRoot() discards whatever is
// inside #root when it mounts, so humans still get the full SPA — the static
// markup exists only for the first paint and for anything that doesn't run JS.
//
// No new dependencies, no headless browser. Runs as `postbuild`.
// If anything in here throws, it logs and exits 0: a failed prerender must
// never fail a deploy.
const fs = require('fs');
const path = require('path');

const ORIGIN = 'https://www.michael-kaminski.io';
const ROOT = path.join(__dirname, '..');
const BUILD = path.join(ROOT, 'build');
const ARTICLES = path.join(ROOT, 'src', 'data', 'articles.ts');
const CLIPS = path.join(ROOT, 'src', 'data', 'clips.ts');
const CHANGELOG = path.join(ROOT, 'src', 'data', 'changelog.ts');

const esc = (s) =>
  String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

// articles.ts is plain data plus TypeScript annotations. Slice out the array
// literal and evaluate it as JS rather than adding a TS toolchain to a build step.
function loadArticles() {
  const src = fs.readFileSync(ARTICLES, 'utf8');
  const start = src.indexOf('export const articles');
  const end = src.indexOf('const seenDates');
  if (start === -1 || end === -1 || end <= start) throw new Error('could not locate articles array');
  const chunk = src.slice(start, end).replace('export const articles: Article[] =', 'module.exports =');
  // eslint-disable-next-line no-eval
  const load = eval(`(function () { const module = { exports: {} }; ${chunk}; return module.exports; })`);
  const out = load();
  if (!Array.isArray(out) || !out.length) throw new Error('parsed zero articles');
  return out;
}

// Same slice-and-eval trick for clips.ts. Returns [] rather than throwing —
// the clips page is additive and must never take the article prerender down.
function loadClips() {
  try {
    const src = fs.readFileSync(CLIPS, 'utf8');
    const start = src.indexOf('export const clips');
    const end = src.indexOf('export const getClip');
    if (start === -1 || end === -1 || end <= start) return [];
    const chunk = src.slice(start, end).replace('export const clips: Clip[] =', 'module.exports =');
    // eslint-disable-next-line no-eval
    const load = eval(`(function () { const module = { exports: {} }; ${chunk}; return module.exports; })`);
    const out = load();
    return Array.isArray(out) ? out : [];
  } catch (err) {
    console.warn(`prerender: clips skipped (${err && err.message})`);
    return [];
  }
}

// changelog.ts imports articles.ts and clips.ts, so it can't be sliced whole.
// Only the hand-written `shipped` array is plain data; the essay and clip
// entries are rebuilt here from the arrays already loaded above, mirroring the
// derivation in changelog.ts. Fail-soft: the changelog is additive and must
// never take the article prerender down.
const KIND_WEIGHT = { launch: 0, feature: 1, tool: 2, essay: 3, clip: 4 };

function loadShipped() {
  try {
    const src = fs.readFileSync(CHANGELOG, 'utf8');
    const start = src.indexOf('const shipped: ChangeEntry[] =');
    const end = src.indexOf('/** Essays derive');
    if (start === -1 || end === -1 || end <= start) return [];
    const chunk = src.slice(start, end).replace('const shipped: ChangeEntry[] =', 'module.exports =');
    // eslint-disable-next-line no-eval
    const load = eval(`(function () { const module = { exports: {} }; ${chunk}; return module.exports; })`);
    const out = load();
    return Array.isArray(out) ? out : [];
  } catch (err) {
    console.warn(`prerender: changelog skipped (${err && err.message})`);
    return [];
  }
}

function buildChangelog(articles, clips) {
  const shipped = loadShipped();
  if (!shipped.length) return [];
  const essays = articles.map((a) => ({
    date: a.date,
    kind: 'essay',
    title: a.title,
    summary: a.description,
    links: [{ label: 'Read the essay', href: `/writing/${a.slug}` }],
  }));
  const clipEntries = clips.map((c) => ({
    date: c.uploadDate,
    kind: 'clip',
    title: c.title,
    summary: c.description,
    links: [{ label: 'Watch the clip', href: `/clips#${c.slug}` }],
  }));
  return [...shipped, ...essays, ...clipEntries].sort(
    (a, b) => b.date.localeCompare(a.date) || KIND_WEIGHT[a.kind] - KIND_WEIGHT[b.kind]
  );
}

const KIND_LABELS = {
  launch: 'Site launch',
  feature: 'Feature',
  tool: 'Open source',
  essay: 'Essay',
  clip: 'Field clip',
};

function setTag(html, re, replacement) {
  return re.test(html) ? html.replace(re, replacement) : html;
}

function rewriteHead(html, { title, description, canonical, type, jsonLd, image }) {
  let out = html;
  if (image) {
    const abs = image.startsWith('http') ? image : `${ORIGIN}${image}`;
    out = setTag(out, /<meta property="og:image" content="[^"]*"\s*\/?>/, `<meta property="og:image" content="${esc(abs)}">`);
    out = setTag(out, /<meta property="twitter:image" content="[^"]*"\s*\/?>/, `<meta property="twitter:image" content="${esc(abs)}">`);
  }
  out = setTag(out, /<title>[\s\S]*?<\/title>/, `<title>${esc(title)}</title>`);
  out = setTag(out, /<meta name="title" content="[^"]*"\s*\/?>/, `<meta name="title" content="${esc(title)}">`);
  out = setTag(
    out,
    /<meta name="description" content="[^"]*"\s*\/?>/,
    `<meta name="description" content="${esc(description)}">`
  );
  out = setTag(out, /<meta property="og:title" content="[^"]*"\s*\/?>/, `<meta property="og:title" content="${esc(title)}">`);
  out = setTag(
    out,
    /<meta property="og:description" content="[^"]*"\s*\/?>/,
    `<meta property="og:description" content="${esc(description)}">`
  );
  out = setTag(out, /<meta property="og:url" content="[^"]*"\s*\/?>/, `<meta property="og:url" content="${esc(canonical)}">`);
  out = setTag(out, /<meta property="og:type" content="[^"]*"\s*\/?>/, `<meta property="og:type" content="${esc(type)}">`);
  out = setTag(out, /<meta property="twitter:title" content="[^"]*"\s*\/?>/, `<meta property="twitter:title" content="${esc(title)}">`);
  out = setTag(
    out,
    /<meta property="twitter:description" content="[^"]*"\s*\/?>/,
    `<meta property="twitter:description" content="${esc(description)}">`
  );
  out = setTag(out, /<meta property="twitter:url" content="[^"]*"\s*\/?>/, `<meta property="twitter:url" content="${esc(canonical)}">`);

  const inject = [`<link rel="canonical" href="${esc(canonical)}">`];
  if (jsonLd) inject.push(`<script type="application/ld+json">${JSON.stringify(jsonLd)}</script>`);
  return out.replace('</head>', `${inject.join('')}</head>`);
}

function injectRoot(html, markup) {
  if (!html.includes('<div id="root"></div>')) {
    console.warn('prerender: #root stub not found — leaving HTML untouched');
    return html;
  }
  return html.replace('<div id="root"></div>', `<div id="root">${markup}</div>`);
}

// Home-page prose. Mirrors the hero and the entity described in the Person
// schema; this is what a crawler reads before any JavaScript runs.
const HOME_MARKUP = `
<main style="max-width:52rem;margin:0 auto;padding:4rem 1.25rem;color:#e9e9e9;background:#060606;font-family:system-ui,sans-serif;line-height:1.6">
<h1>Michael Kaminski — I build AI agents that run in production</h1>
<p>Agent infrastructure, MCP servers, and eval harnesses inside a regulated lender. Python and TypeScript. Atlanta, relocating to New York City.</p>
<p>Michael Kaminski is a technical product manager working at the agent layer. He took an AI agent capability from prototype through security, legal, and compliance review to production inside a regulated lender, and builds custom Model Context Protocol (MCP) servers, multi-agent pipelines, and eval harnesses in Python and TypeScript.</p>
<p>He is currently Senior Product Owner, Collections &amp; Servicing at Stellantis Financial Services US, where the AI agent work sits inside that role. Earlier: Momnt (tech lead, credit analysis and accounting engine), GreenSky, HD Supply, KPMG, and The Home Depot. He also runs Modular Equity and founded Superior Contracting &amp; Maintenance.</p>
<h2>What he works on</h2>
<ul>
<li>Agentic workflow design and multi-agent orchestration</li>
<li>Custom MCP servers and tool design an agent can actually call</li>
<li>Eval harness design and statistical gating for agent instruction changes</li>
<li>Human approval gates on irreversible agent actions</li>
<li>Terraform, Kubernetes, PostgreSQL, and the infrastructure agents run on</li>
</ul>
<h2>Writing</h2>
<ul>__ARTICLE_LINKS__</ul>
<p>Contact: <a href="mailto:MKaminski1337@gmail.com">MKaminski1337@gmail.com</a> ·
<a href="https://www.linkedin.com/in/michaelxaxkaminski">LinkedIn</a> ·
<a href="https://github.com/MAKaminski">GitHub</a> ·
<a href="https://dev.to/makaminski1337">DEV</a></p>
</main>`;

function articleMarkup(a, clip) {
  const clipBlock = clip
    ? `<figure><video controls playsinline preload="none" poster="${esc(clip.poster)}" src="${esc(clip.src)}" width="${clip.width}" height="${clip.height}"></video>
<figcaption>${esc(clip.title)} · ${clip.durationSec}s — “${esc(clip.transcript)}” (<a href="/clips">all field clips</a>)</figcaption></figure>`
    : '';
  return `
<main style="max-width:52rem;margin:0 auto;padding:4rem 1.25rem;color:#e9e9e9;background:#060606;font-family:system-ui,sans-serif;line-height:1.6">
<article>
<h1>${esc(a.title)}</h1>
<p><time datetime="${esc(a.date)}">${esc(a.date)}</time> · ${a.readMinutes} min read · by Michael Kaminski</p>
<p><em>${esc(a.description)}</em></p>
${clipBlock}
${a.body}
</article>
<p><a href="/writing">All writing</a> · <a href="/">Michael Kaminski</a></p>
</main>`;
}

function main() {
  const indexPath = path.join(BUILD, 'index.html');
  if (!fs.existsSync(indexPath)) throw new Error('build/index.html not found');
  const shell = fs.readFileSync(indexPath, 'utf8');
  const articles = loadArticles();
  const clips = loadClips();
  const clipForArticle = (slug) => clips.find((c) => c.relatedArticleSlug === slug);

  // Home
  const links = articles
    .map((a) => `<li><a href="/writing/${a.slug}">${esc(a.title)}</a> — ${esc(a.description)}</li>`)
    .join('');
  fs.writeFileSync(indexPath, injectRoot(shell, HOME_MARKUP.replace('__ARTICLE_LINKS__', links)));

  // Articles
  let written = 0;
  for (const a of articles) {
    const canonical = `${ORIGIN}/writing/${a.slug}`;
    const jsonLd = {
      '@context': 'https://schema.org',
      '@type': 'Article',
      headline: a.title,
      description: a.description,
      datePublished: a.date,
      dateModified: a.date,
      author: { '@id': `${ORIGIN}/#person` },
      publisher: { '@id': `${ORIGIN}/#person` },
      mainEntityOfPage: canonical,
      url: canonical,
      image: `${ORIGIN}${a.ogImage || '/og-image.jpg'}`,
      inLanguage: 'en',
    };
    // Mirror the runtime Article schema in src/pages/Article.tsx: when a field
    // clip teases this essay, the VideoObject hangs off the Article here too,
    // or the pre-JS HTML a crawler reads would disagree with the mounted app.
    const clip = clipForArticle(a.slug);
    if (clip) {
      jsonLd.video = {
        '@type': 'VideoObject',
        '@id': `${ORIGIN}/clips#${clip.slug}`,
        name: clip.title,
        description: clip.description,
        thumbnailUrl: [`${ORIGIN}${clip.poster}`],
        contentUrl: `${ORIGIN}${clip.src}`,
        uploadDate: clip.uploadDate,
        duration: `PT${clip.durationSec}S`,
        transcript: clip.transcript,
      };
    }
    const html = injectRoot(
      rewriteHead(shell, {
        title: `${a.title} | Michael Kaminski`,
        description: a.description,
        canonical,
        type: 'article',
        image: a.ogImage,
        jsonLd,
      }),
      articleMarkup(a, clip)
    );
    const dir = path.join(BUILD, 'writing', a.slug);
    fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(path.join(dir, 'index.html'), html);
    written += 1;
  }

  // /writing index
  const writingCanonical = `${ORIGIN}/writing`;
  const writingMarkup = `
<main style="max-width:52rem;margin:0 auto;padding:4rem 1.25rem;color:#e9e9e9;background:#060606;font-family:system-ui,sans-serif;line-height:1.6">
<h1>Writing — Michael Kaminski</h1>
<p>Field notes on agent infrastructure, evals, and building AI agents that run in production.</p>
<ul>${links}</ul>
</main>`;
  const writingHtml = injectRoot(
    rewriteHead(shell, {
      title: 'Writing | Michael Kaminski',
      description:
        'Field notes on AI agent infrastructure, MCP servers, eval harnesses, and shipping agents inside a regulated lender.',
      canonical: writingCanonical,
      type: 'website',
      jsonLd: null,
    }),
    writingMarkup
  );
  fs.mkdirSync(path.join(BUILD, 'writing'), { recursive: true });
  fs.writeFileSync(path.join(BUILD, 'writing', 'index.html'), writingHtml);

  // /clips — the transcript is the point. A 10-second vertical video is opaque
  // to every crawler that matters, so the spoken line and the finding behind it
  // are written into the static markup and into VideoObject schema.
  if (clips.length) {
    const clipsCanonical = `${ORIGIN}/clips`;
    const clipsJsonLd = clips.map((c) => ({
      '@context': 'https://schema.org',
      '@type': 'VideoObject',
      '@id': `${clipsCanonical}#${c.slug}`,
      name: c.title,
      description: c.description,
      thumbnailUrl: [`${ORIGIN}${c.poster}`],
      contentUrl: `${ORIGIN}${c.src}`,
      uploadDate: c.uploadDate,
      duration: `PT${c.durationSec}S`,
      width: c.width,
      height: c.height,
      transcript: c.transcript,
      inLanguage: 'en',
      isFamilyFriendly: true,
      creator: { '@id': `${ORIGIN}/#person` },
      publisher: { '@id': `${ORIGIN}/#person` },
    }));
    const clipsMarkup = `
<main style="max-width:52rem;margin:0 auto;padding:4rem 1.25rem;color:#e9e9e9;background:#060606;font-family:system-ui,sans-serif;line-height:1.6">
<h1>Field clips — Michael Kaminski</h1>
<p>One finding, ten seconds. Each clip compresses a single result from a system he runs; the full arithmetic is in the write-up underneath it.</p>
${clips
  .map(
    (c) => `<section id="${esc(c.slug)}">
<h2>${esc(c.title)}</h2>
<p><em>${esc(c.description)}</em></p>
<video controls playsinline preload="none" poster="${esc(c.poster)}" src="${esc(c.src)}" width="${c.width}" height="${c.height}"></video>
${c.context}
<h3>Transcript</h3>
<blockquote>${esc(c.transcript)}</blockquote>
${c.relatedArticleSlug ? `<p><a href="/writing/${esc(c.relatedArticleSlug)}">Read the full write-up</a></p>` : ''}
</section>`
  )
  .join('')}
<p><a href="/writing">All writing</a> · <a href="/">Michael Kaminski</a></p>
</main>`;
    const clipsHtml = injectRoot(
      rewriteHead(shell, {
        title: 'Field Clips — Agent & Pipeline Infrastructure | Michael Kaminski',
        description:
          'Ten-second field clips on agent and pipeline infrastructure: statistical gates that never bind, and dealer-gamma levels that move on zero trades. Full transcripts on the page.',
        canonical: clipsCanonical,
        type: 'website',
        image: clips[0] && clips[0].poster,
        jsonLd: clipsJsonLd,
      }),
      clipsMarkup
    );
    fs.mkdirSync(path.join(BUILD, 'clips'), { recursive: true });
    fs.writeFileSync(path.join(BUILD, 'clips', 'index.html'), clipsHtml);
  }

  // /changelog — the dated record of what shipped. Worth prerendering for the
  // same reason the essays are: it is the page that answers "is this person
  // still building?", and a crawler reading the SPA stub cannot see it.
  const entries = buildChangelog(articles, clips);
  if (entries.length) {
    const changelogCanonical = `${ORIGIN}/changelog`;
    const changelogMarkup = `
<main style="max-width:52rem;margin:0 auto;padding:4rem 1.25rem;color:#e9e9e9;background:#060606;font-family:system-ui,sans-serif;line-height:1.6">
<h1>Changelog — Michael Kaminski</h1>
<p>Every sizable update in one place: a site going live, an essay published, a clip posted, a piece of platform work landing. Each entry is dated the day it shipped and links to the thing itself.</p>
<ul>
${entries
  .map(
    (e) => `<li><time datetime="${esc(e.date)}">${esc(e.date)}</time> · ${esc(
      KIND_LABELS[e.kind] || e.kind
    )} — <strong>${esc(e.title)}</strong>: ${esc(e.summary)}${
      (e.links || [])
        .map((l) => ` <a href="${esc(l.href)}">${esc(l.label)}</a>`)
        .join('')
    }</li>`
  )
  .join('')}
</ul>
<p><a href="/websites">Websites</a> · <a href="/products">Products</a> · <a href="/writing">All writing</a> · <a href="/">Michael Kaminski</a></p>
</main>`;
    const changelogHtml = injectRoot(
      rewriteHead(shell, {
        title: 'Changelog | Michael Kaminski — What Shipped, and When',
        description:
          'A running log of every sizable update: production sites launched on Vercel, essays published, field clips posted, and platform work shipped — each entry dated and linked.',
        canonical: changelogCanonical,
        type: 'website',
        jsonLd: {
          '@context': 'https://schema.org',
          '@type': 'ItemList',
          name: 'Changelog — Michael Kaminski',
          numberOfItems: entries.length,
          itemListElement: entries.slice(0, 50).map((e, i) => ({
            '@type': 'ListItem',
            position: i + 1,
            name: e.title,
            description: e.summary,
          })),
        },
      }),
      changelogMarkup
    );
    fs.mkdirSync(path.join(BUILD, 'changelog'), { recursive: true });
    fs.writeFileSync(path.join(BUILD, 'changelog', 'index.html'), changelogHtml);
  }

  console.log(
    `prerender: home + /writing + ${written} articles + ${clips.length} clips + ${entries.length} changelog entries`
  );
}

try {
  main();
} catch (err) {
  console.warn(`prerender: skipped (${err && err.message}) — build left intact`);
}
