/* eslint-disable */
// Post-build prerender.
//
// The site is a CRA single-page app, so the HTML that leaves the server is a
// stub: <div id="root"></div> and nothing else. Search crawlers and every LLM
// crawler read that stub, which means the portfolio and the writing were
// effectively invisible to them.
//
// This script writes real prose INTO #root, after the normal build. React's
// createRoot() discards whatever is inside #root when it mounts, so humans
// still get the full SPA — the static markup exists only for the first paint
// and for anything that doesn't run JS. Because there is no hydration, the
// static markup has no parity requirement with React's output: the right
// target is clean semantic HTML, not a Tailwind replica.
//
// ── Why this file was rewritten (2026-08-25) ───────────────────────────────
// It used to cover only the home page, /writing, the articles, /clips and
// /changelog. Every other route in the sitemap fell through vercel.json's SPA
// rewrite to build/index.html and served *the home page's* markup and title —
// eleven URLs returning byte-identical content. An external audit read exactly
// that and reported "no CTAs detected", "could not identify distinct project
// items", "testimonial_count 0" and "images_count 0", none of which describe
// the rendered site.
//
// The fix is a single ROUTES table that both this script and
// generate-sitemap.js consume, so the sitemap and the prerenderer can no
// longer disagree about which pages exist. scripts/verify-prerender.js asserts
// that invariant after every build.
//
// No new dependencies, no headless browser. Runs as `postbuild`.
// If anything in here throws, it logs and exits 0: a failed prerender must
// never fail a deploy. Each route is additionally wrapped in its own try/catch
// so one bad route cannot take down the others.
const fs = require('fs');
const path = require('path');

const ORIGIN = 'https://www.michael-kaminski.io';
const ROOT = path.join(__dirname, '..');
const BUILD = path.join(ROOT, 'build');
const DATA = path.join(ROOT, 'src', 'data');

const CALENDLY = 'https://calendly.com/kaminski1337/15min';
const EMAIL = 'MKaminski1337@gmail.com';
const PHONE = '+14048388613';
const PHONE_HUMAN = '(404) 838-8613';
const LINKEDIN = 'https://www.linkedin.com/in/michaelxaxkaminski';
const GITHUB = 'https://github.com/MAKaminski';
const DEV = 'https://dev.to/makaminski1337';
const RESUME = '/docs/Kaminski Resume.pdf';

const esc = (s) =>
  String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

// ─── Data loading ──────────────────────────────────────────────────────────
// Every src/data/*.ts module is plain data plus TypeScript annotations. Slice
// out the array literal and evaluate it as JS rather than adding a TS toolchain
// to a build step. Each data file carries a PRERENDER CONTRACT header spelling
// out what is allowed inside the array; break it and the slice stops parsing.
function loadData(file, arrayExport, endSentinel, { required = false } = {}) {
  try {
    const src = fs.readFileSync(path.join(DATA, file), 'utf8');
    // Anchor both markers to the start of a line. Every data file's PRERENDER
    // CONTRACT header quotes these exact strings inside a comment, so a plain
    // indexOf() matches the documentation instead of the declaration — which
    // silently yields zero records and a page that prerenders empty.
    const at = (marker) => {
      const re = new RegExp('^' + marker.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'm');
      const m = re.exec(src);
      return m ? m.index : -1;
    };
    const start = at(arrayExport);
    const end = at(endSentinel);
    if (start === -1 || end === -1 || end <= start) {
      throw new Error(`could not locate the array literal in ${file}`);
    }
    const chunk = src
      .slice(start, end)
      .replace(/^(?:export )?const \w+(?:\s*:\s*[\w<>[\], |]+)?\s*=/, 'module.exports =');
    // eslint-disable-next-line no-eval
    const load = eval(`(function () { const module = { exports: {} }; ${chunk}; return module.exports; })`);
    const out = load();
    if (!Array.isArray(out) || (required && !out.length)) {
      throw new Error(`parsed no usable array from ${file}`);
    }
    return out;
  } catch (err) {
    if (required) throw err;
    console.warn(`prerender: ${file} skipped (${err && err.message})`);
    return [];
  }
}

// changelog.ts imports articles.ts and clips.ts, so it can't be sliced whole.
// Only the hand-written `shipped` array is plain data; the essay and clip
// entries are rebuilt here from the arrays already loaded, mirroring the
// derivation in changelog.ts.
const KIND_WEIGHT = { launch: 0, feature: 1, tool: 2, essay: 3, clip: 4 };
const KIND_LABELS = {
  launch: 'Site launch',
  feature: 'Feature',
  tool: 'Open source',
  essay: 'Essay',
  clip: 'Field clip',
};

function buildChangelog(articles, clips) {
  const shipped = loadData('changelog.ts', 'const shipped: ChangeEntry[] =', '/** Essays derive');
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

// ─── Head rewriting ────────────────────────────────────────────────────────
function setTag(html, re, replacement) {
  return re.test(html) ? html.replace(re, replacement) : html;
}

/**
 * public/index.html carries site-shell JSON-LD: Person, ProfilePage, FAQPage
 * and a Home-only BreadcrumbList. Every prerendered file is cloned from that
 * shell, so before this function stripped them, twenty-odd URLs each claimed
 * to be the same ProfilePage and each repeated the same four FAQ answers.
 * Person stays everywhere — it is the @id the rest of the graph points at.
 */
function stripShellSchema(html, { keepProfile }) {
  // Match on the parsed @type, not on the HTML comment above each block:
  // CRA's html-webpack-plugin minifies comments out of build/index.html, so
  // anchoring on "<!-- Structured Data: FAQ -->" silently matched nothing and
  // let every page keep the shell's schema. (verify-prerender.js caught this.)
  const drop = new Set(keepProfile ? ['BreadcrumbList'] : ['ProfilePage', 'FAQPage', 'BreadcrumbList']);
  return html.replace(
    /<script type="application\/ld\+json">([\s\S]*?)<\/script>/g,
    (match, body) => {
      try {
        const parsed = JSON.parse(body);
        const types = (Array.isArray(parsed) ? parsed : [parsed]).map((o) => o && o['@type']);
        // Drop only blocks made up entirely of shell types; never touch Person,
        // which is the @id every other schema on the site points at.
        if (types.length && types.every((t) => drop.has(t))) return '';
      } catch (err) {
        // Unparseable block: leave it alone rather than silently deleting it.
      }
      return match;
    }
  );
}

function breadcrumbLd(crumbs) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: crumbs.map((c, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: c.name,
      item: `${ORIGIN}${c.path}`,
    })),
  };
}

function rewriteHead(html, { title, description, canonical, type, jsonLd, image, crumbs, noindex, isHome }) {
  let out = stripShellSchema(html, { keepProfile: !!isHome });
  if (image) {
    const abs = image.startsWith('http') ? image : `${ORIGIN}${image}`;
    out = setTag(out, /<meta property="og:image" content="[^"]*"\s*\/?>/, `<meta property="og:image" content="${esc(abs)}">`);
    out = setTag(out, /<meta property="twitter:image" content="[^"]*"\s*\/?>/, `<meta property="twitter:image" content="${esc(abs)}">`);
  }
  out = setTag(out, /<title>[\s\S]*?<\/title>/, `<title>${esc(title)}</title>`);
  out = setTag(out, /<meta name="title" content="[^"]*"\s*\/?>/, `<meta name="title" content="${esc(title)}">`);
  out = setTag(out, /<meta name="description" content="[^"]*"\s*\/?>/, `<meta name="description" content="${esc(description)}">`);
  out = setTag(out, /<meta property="og:title" content="[^"]*"\s*\/?>/, `<meta property="og:title" content="${esc(title)}">`);
  out = setTag(out, /<meta property="og:description" content="[^"]*"\s*\/?>/, `<meta property="og:description" content="${esc(description)}">`);
  out = setTag(out, /<meta property="og:url" content="[^"]*"\s*\/?>/, `<meta property="og:url" content="${esc(canonical)}">`);
  out = setTag(out, /<meta property="og:type" content="[^"]*"\s*\/?>/, `<meta property="og:type" content="${esc(type)}">`);
  out = setTag(out, /<meta property="twitter:title" content="[^"]*"\s*\/?>/, `<meta property="twitter:title" content="${esc(title)}">`);
  out = setTag(out, /<meta property="twitter:description" content="[^"]*"\s*\/?>/, `<meta property="twitter:description" content="${esc(description)}">`);
  out = setTag(out, /<meta property="twitter:url" content="[^"]*"\s*\/?>/, `<meta property="twitter:url" content="${esc(canonical)}">`);
  if (noindex) {
    out = setTag(out, /<meta name="robots" content="[^"]*"\s*\/?>/, `<meta name="robots" content="noindex, follow">`);
  }

  const inject = [`<link rel="canonical" href="${esc(canonical)}">`];
  const blocks = [];
  if (crumbs && crumbs.length) blocks.push(breadcrumbLd(crumbs));
  if (Array.isArray(jsonLd)) blocks.push(...jsonLd);
  else if (jsonLd) blocks.push(jsonLd);
  for (const b of blocks) {
    inject.push(`<script type="application/ld+json">${JSON.stringify(b)}</script>`);
  }
  return out.replace('</head>', `${inject.join('')}</head>`);
}

function injectRoot(html, markup) {
  if (!html.includes('<div id="root"></div>')) {
    console.warn('prerender: #root stub not found — leaving HTML untouched');
    return html;
  }
  return html.replace('<div id="root"></div>', `<div id="root">${markup}</div>`);
}

// ─── Shared markup blocks ──────────────────────────────────────────────────
// These go on EVERY prerendered page. Before this existed, a crawler landing on
// any page found no navigation to any other page, and no way to make contact
// beyond a single mailto: on the home page.

const PAGE_STYLE =
  'max-width:52rem;margin:0 auto;padding:4rem 1.25rem;color:#e9e9e9;background:#060606;font-family:system-ui,sans-serif;line-height:1.6';

const NAV = [
  { href: '/', label: 'Home' },
  { href: '/projects', label: 'Projects' },
  { href: '/websites', label: 'Websites' },
  { href: '/products', label: 'Products' },
  { href: '/writing', label: 'Writing' },
  { href: '/clips', label: 'Field clips' },
  { href: '/changelog', label: 'Changelog' },
];

function navBlock(current) {
  const items = NAV.map((n) =>
    n.href === current
      ? `<li><strong>${esc(n.label)}</strong></li>`
      : `<li><a href="${esc(n.href)}">${esc(n.label)}</a></li>`
  ).join('');
  return `<nav aria-label="Primary"><ul>${items}</ul></nav>`;
}

// The Calendly anchor is deliberately the FIRST anchor inside <main>: the audit
// reported "Primary CTA: unknown", and first-anchor position is how an
// extractor decides which of several CTAs is primary. It is also an <a href>,
// not the <button onClick> the React header uses — a button is not a countable
// call to action to anything parsing HTML.
function ctaBlock() {
  return `<p class="cta"><a href="${CALENDLY}">Book a Call</a> ·
<a href="${esc(RESUME)}" download>Download Resume</a> ·
<a href="mailto:${EMAIL}">${EMAIL}</a> ·
<a href="tel:${PHONE}">${PHONE_HUMAN}</a> ·
<a href="${LINKEDIN}">LinkedIn</a> ·
<a href="${GITHUB}">GitHub</a> ·
<a href="${DEV}">DEV</a></p>`;
}

function img(src, alt, width, height, eager) {
  if (!src) return '';
  return `<img src="${esc(src)}" alt="${esc(alt)}" width="${width}" height="${height}"${
    eager ? '' : ' loading="lazy"'
  }>`;
}

function testimonialBlock(referrals) {
  if (!referrals.length) return '';
  const items = referrals
    .map(
      (r) => `<figure>
${img(r.avatar, `${r.name}, ${r.company}`, 96, 96)}
<blockquote cite="${esc(r.linkedinUrl)}">${esc(r.content)}</blockquote>
<figcaption>${esc(r.name)}${r.title ? ` — ${esc(r.title)}` : ''}${
        r.company ? `, ${esc(r.company)}` : ''
      } · <a href="${esc(r.linkedinUrl)}">LinkedIn</a></figcaption>
</figure>`
    )
    .join('');
  return `<section id="testimonials"><h2>What colleagues say</h2>${items}</section>`;
}

/** Wraps a page body in the shared shell: nav, CTA, content, CTA again. */
function page(current, inner) {
  return `
<main style="${PAGE_STYLE}">
${navBlock(current)}
${inner}
<hr>
${ctaBlock()}
</main>`;
}

// ─── Home ──────────────────────────────────────────────────────────────────
function homeMarkup({ articles, referrals, transactions, jobs, projects, totals, about }) {
  const articleLinks = articles
    .map((a) => `<li><a href="/writing/${esc(a.slug)}">${esc(a.title)}</a> — ${esc(a.description)}</li>`)
    .join('');

  const projectCards = projects
    .map(
      (p) => `<article>
<h3><a href="/projects/${esc(p.slug)}">${esc(p.title)}</a></h3>
<p>${esc(p.summary)}</p>
<p><strong>My role:</strong> ${esc(p.role)}</p>
</article>`
    )
    .join('');

  const jobRows = jobs
    .map(
      (j) => `<li>
<strong>${j.link ? `<a href="${esc(j.link)}">${esc(j.company)}</a>` : esc(j.company)}</strong> —
${esc(j.title)} · <time>${esc(j.period)}</time><br>
${esc(j.description)}${j.exit ? `<br><em>${esc(j.exit)}</em>` : ''}
</li>`
    )
    .join('');

  const dealRows = transactions
    .map(
      (t) =>
        `<tr><td>${esc(t.date)}</td><td>${esc(t.company)}</td><td>${esc(t.type)}</td><td>${esc(
          t.asset
        )}</td><td>$${t.value.toLocaleString()}M</td><td>${esc(t.entity)}</td></tr>`
    )
    .join('');

  return page(
    '/',
    `
<h1>Michael Kaminski — I build AI agents that run in production</h1>
${img('/michael-kaminski.jpg', 'Michael Kaminski', 400, 400, true)}
<p>Agent infrastructure, MCP servers, and eval harnesses inside a regulated lender.
Python and TypeScript. Atlanta, relocating to New York City.</p>

<p><strong>What I'm looking for:</strong> senior product roles at the agent layer —
Technical Product Manager, Senior Product Owner, or PM for an agent platform — at teams
shipping AI agents into production, especially where the environment is regulated and the
evidence trail matters. Open to fractional and full-time.</p>

<p>I'm a technical product manager working at the agent layer. I took an AI agent
capability from prototype through security, legal, and compliance review to production
inside a regulated lender, and I build custom Model Context Protocol (MCP) servers,
multi-agent pipelines, and eval harnesses in Python and TypeScript. What is unusual about
the combination is that I can price a system and I can ship it: before the agent work I
spent years in corporate finance and strategy, and I have authored Terraform modules with
multi-environment remote state and operated production Kubernetes clusters.</p>


<p><strong>Latest:</strong> <a href="/writing/${esc(articles[0].slug)}">${esc(articles[0].title)}</a> — ${esc(articles[0].description)}</p>
<h2>About</h2>
${about.map((para) => `<p>${esc(para)}</p>`).join('')}
<p><a href="/about">More about how I got here, and the full role history</a></p>

<h2>What I work on</h2>
<ul>
<li>Agentic workflow design and multi-agent orchestration</li>
<li>Custom MCP servers and tool design an agent can actually call</li>
<li>Eval harness design and statistical gating for agent instruction changes</li>
<li>Human approval gates on irreversible agent actions</li>
<li>Terraform, Kubernetes, PostgreSQL, and the infrastructure agents run on</li>
</ul>

<h2>Selected projects</h2>
${projectCards}
<p><a href="/projects">All projects and case studies</a> ·
<a href="/websites">Live production sites</a> ·
<a href="/products">Open-source tools</a></p>

<h2>Experience</h2>
<ul>${jobRows}</ul>
<p><a href="${esc(RESUME)}" download>Download the full resume (PDF)</a></p>

<h2>Transactions — ${totals.count} deals, ${esc(totals.headline)}</h2>
<p>Capital markets and corporate development work from the finance half of the career.
Every figure below is a single named transaction; the total is their sum, not an estimate.</p>
<table>
<thead><tr><th>Date</th><th>Company</th><th>Type</th><th>Class</th><th>Value</th><th>Counterparty</th></tr></thead>
<tbody>${dealRows}</tbody>
<tfoot><tr><td colspan="4"><strong>Total</strong></td><td><strong>$${totals.totalM.toLocaleString()}M</strong></td><td></td></tr></tfoot>
</table>

<h2>Writing</h2>
<ul>${articleLinks}</ul>

${testimonialBlock(referrals)}

<h2>Get in touch</h2>
<p>Building something at the agent layer, or trying to get one through a review process?
The fastest path is the calendar link; email works just as well.</p>
<form action="mailto:${EMAIL}" method="post" enctype="text/plain">
<label for="name">Name</label> <input type="text" id="name" name="name">
<label for="email">Email</label> <input type="email" id="email" name="email">
<label for="message">Message</label> <textarea id="message" name="message"></textarea>
<button type="submit">Send</button>
</form>`
  );
}

// ─── Route markup builders ─────────────────────────────────────────────────
function projectsMarkup(projects, sites, products) {
  const cases = projects
    .map(
      (p) => `<article>
<h2><a href="/projects/${esc(p.slug)}">${esc(p.title)}</a></h2>
<p><em>${esc(p.domain)} · <time datetime="${esc(p.date)}">${esc(p.date)}</time></em></p>
${img(p.image, p.imageAlt || p.title, 800, 450)}
<p>${esc(p.summary)}</p>
<p><strong>My role:</strong> ${esc(p.role)}</p>
<ul>${p.outcome.map((o) => `<li><strong>${esc(o.metric)}</strong> — ${esc(o.detail)} <a href="${esc(o.source)}">${esc(o.sourceLabel)}</a></li>`).join('')}</ul>
<p><a href="/projects/${esc(p.slug)}">Read the full case study</a></p>
</article>`
    )
    .join('');

  const siteCards = sites
    .map(
      (s) => `<article>
<h3><a href="${esc(s.url)}">${esc(s.name)}</a></h3>
${img(s.image, `${s.name} — screenshot`, 640, 400)}
<p><em>${esc(s.category)}</em></p>
<p>${esc(s.description)}</p>
</article>`
    )
    .join('');

  const productCards = products
    .map(
      (p) => `<article>
<h3><a href="${esc(p.repoUrl)}">${esc(p.name)}</a></h3>
${img(p.image, `${p.name} — screenshot`, 640, 400)}
<p><em>${esc(p.category)}</em></p>
<p>${esc(p.description)}</p>
</article>`
    )
    .join('');

  return page(
    '/projects',
    `
<h1>Projects — Michael Kaminski</h1>
<p>Case studies first: the problem, the constraints, what I personally owned, what shipped,
and what came of it. Every number below links to where you can check it.</p>
${cases}
<h2>Live production sites (${sites.length})</h2>
<p>Sites running in production on Vercel. <a href="/websites">Full list with screenshots</a>.</p>
${siteCards}
<h2>Open-source tools (${products.length})</h2>
<p>Desktop tools and utilities on GitHub. <a href="/products">Full list</a>.</p>
${productCards}`
  );
}

function projectMarkup(p) {
  return page(
    '/projects',
    `
<article>
<h1>${esc(p.title)}</h1>
<p><em>${esc(p.domain)} · <time datetime="${esc(p.date)}">${esc(p.date)}</time></em></p>
${img(p.image, p.imageAlt || p.title, 800, 450, true)}
<p><strong>${esc(p.summary)}</strong></p>

<h2>Problem</h2>
${p.problem}

<h2>Constraints</h2>
<ul>${p.constraints.map((c) => `<li>${esc(c)}</li>`).join('')}</ul>

<h2>My role</h2>
<p>${esc(p.role)}</p>

<h2>What shipped</h2>
<ul>${p.whatShipped.map((w) => `<li>${esc(w)}</li>`).join('')}</ul>

<h2>Outcome</h2>
<ul>${p.outcome
      .map(
        (o) =>
          `<li><strong>${esc(o.metric)}</strong> — ${esc(o.detail)} <a href="${esc(o.source)}">${esc(
            o.sourceLabel
          )}</a></li>`
      )
      .join('')}</ul>

${p.body || ''}

<h2>Stack</h2>
<p>${p.stack.map(esc).join(' · ')}</p>

<h2>Artifacts</h2>
<ul>${p.artifacts.map((a) => `<li><a href="${esc(a.href)}">${esc(a.label)}</a> (${esc(a.kind)})</li>`).join('')}</ul>
${p.outcomePending ? `<p><em>${esc(p.outcomePending)}</em></p>` : ''}
</article>
<p><a href="/projects">All projects</a> · <a href="/">Michael Kaminski</a></p>`
  );
}

function websitesMarkup(sites) {
  const cards = sites
    .map(
      (s) => `<article>
<h2><a href="${esc(s.url)}">${esc(s.name)}</a></h2>
${img(s.image, `${s.name} — screenshot`, 640, 400)}
<p><em>${esc(s.category)}</em></p>
<p>${esc(s.description)}</p>
<p>${s.tags.map((t) => esc(t)).join(' · ')}</p>
</article>`
    )
    .join('');
  return page(
    '/websites',
    `
<h1>Websites — ${sites.length} live production sites</h1>
<p>Sites running in production on Vercel, each one built and deployed end to end.
Screenshots link to the running site.</p>
${cards}`
  );
}

function productsMarkup(products) {
  const cards = products
    .map(
      (p) => `<article>
<h2><a href="${esc(p.repoUrl)}">${esc(p.name)}</a></h2>
${img(p.image, `${p.name} — screenshot`, 640, 400)}
<p><em>${esc(p.category)}</em></p>
<p>${esc(p.description)}</p>
<p>${p.tags.map((t) => esc(t)).join(' · ')}</p>
</article>`
    )
    .join('');
  return page(
    '/products',
    `
<h1>Products — ${products.length} open-source tools</h1>
<p>Desktop tools and utilities, source on GitHub.</p>
${cards}`
  );
}

function articleMarkup(a, clip) {
  const clipBlock = clip
    ? `<figure><video controls playsinline preload="none" poster="${esc(clip.poster)}" src="${esc(clip.src)}" width="${clip.width}" height="${clip.height}"></video>
<figcaption>${esc(clip.title)} · ${clip.durationSec}s — “${esc(clip.transcript)}” (<a href="/clips">all field clips</a>)</figcaption></figure>`
    : '';
  return page(
    '/writing',
    `
<article>
<h1>${esc(a.title)}</h1>
<p><time datetime="${esc(a.date)}">${esc(a.date)}</time> · ${a.readMinutes} min read · by Michael Kaminski</p>
<p><em>${esc(a.description)}</em></p>
${clipBlock}
${a.body}
</article>
<p><a href="/writing">All writing</a> · <a href="/projects">Projects</a> · <a href="/">Michael Kaminski</a></p>`
  );
}

// ─── Static route table ────────────────────────────────────────────────────
// scripts/generate-sitemap.js requires this same module, so the sitemap and the
// prerendered output cannot drift apart. Anything listed here MUST produce a
// file; verify-prerender.js fails loudly if it doesn't.
const staticRoutes = require('./routes');

function main() {
  const indexPath = path.join(BUILD, 'index.html');
  if (!fs.existsSync(indexPath)) throw new Error('build/index.html not found');
  const shell = fs.readFileSync(indexPath, 'utf8');

  const articles = loadData('articles.ts', 'export const articles', 'const seenDates', { required: true });
  const clips = loadData('clips.ts', 'export const clips', 'export const getClip');
  const sites = loadData('sites.ts', 'export const sites', 'export const getSite');
  const products = loadData('products.ts', 'export const products', 'export const getProduct');
  const referrals = loadData('referrals.ts', 'export const referrals', 'export const getReferral');
  const transactions = loadData('transactions.ts', 'export const transactions', 'export const transactionTotals');
  const jobs = loadData('experience.ts', 'export const jobTimeline', 'export const getJob');
  // Mirrors projectsByDate() in src/data/projects.ts: flagship first, then
  // newest. The static and mounted versions of /projects must agree on order.
  const about = loadData('about.ts', 'export const aboutParagraphs', 'export const aboutIntro');
  const projects = loadData('projects.ts', 'export const projects', 'export const getProject').sort(
    (a, b) =>
      Number(b.tier === 'flagship') - Number(a.tier === 'flagship') || b.date.localeCompare(a.date)
  );
  const entries = buildChangelog(articles, clips);

  const totalM = transactions.reduce((s, t) => s + t.value, 0);
  const totals = {
    count: transactions.length,
    totalM,
    headline: `$${(Math.floor(totalM / 100) / 10).toFixed(1)}B+`,
  };

  const clipForArticle = (slug) => clips.find((c) => c.relatedArticleSlug === slug);
  const written = [];

  // Writes build/<route>/index.html (or build/index.html for "/").
  function write(routePath, opts, markup) {
    const canonical = routePath === '/' ? `${ORIGIN}/` : `${ORIGIN}${routePath}`;
    const html = injectRoot(
      rewriteHead(shell, {
        canonical,
        type: 'website',
        isHome: routePath === '/',
        ...opts,
      }),
      markup
    );
    const dir = routePath === '/' ? BUILD : path.join(BUILD, ...routePath.split('/').filter(Boolean));
    fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(path.join(dir, 'index.html'), html);
    written.push(routePath);
  }

  // Each route is isolated: a throw in one logs and skips, rather than
  // aborting every route that would have been written after it.
  function safely(label, fn) {
    try {
      fn();
    } catch (err) {
      console.warn(`prerender: route ${label} skipped (${err && err.message})`);
    }
  }

  const reviewLd = referrals.map((r) => ({
    '@context': 'https://schema.org',
    '@type': 'Review',
    itemReviewed: { '@id': `${ORIGIN}/#person` },
    reviewBody: r.content,
    author: { '@type': 'Person', name: r.name, url: r.linkedinUrl },
    // No AggregateRating: every entry is hardcoded rating: 5, which is a
    // display device rather than a rating anyone submitted. Publishing that as
    // an aggregate would invent exactly the kind of metric this pass removed.
  }));

  // ── Home ──
  safely('/', () =>
    write(
      '/',
      {
        title: 'Michael Kaminski — AI Agents & Agent Infrastructure | Atlanta & NYC',
        description:
          'Michael Kaminski builds AI agents that run in production. Took an agent capability from prototype through security, legal, and compliance review inside a regulated lender. Custom MCP servers, multi-agent orchestration, and eval harnesses in Python and TypeScript.',
        type: 'profile',
        crumbs: [{ name: 'Home', path: '/' }],
        jsonLd: reviewLd,
      },
      homeMarkup({ articles, referrals, transactions, jobs, projects, totals, about })
    )
  );

  // ── /about ──
  safely('/about', () =>
    write(
      '/about',
      {
        title: 'About Michael Kaminski — Technical Product Manager, Agent Layer',
        description:
          'How I got from corporate finance to agent infrastructure, and why the two halves turn out to be the same job. Full role history with dates.',
        crumbs: [
          { name: 'Home', path: '/' },
          { name: 'About', path: '/about' },
        ],
        jsonLd: {
          '@context': 'https://schema.org',
          '@type': 'AboutPage',
          name: 'About Michael Kaminski',
          url: `${ORIGIN}/about`,
          mainEntity: { '@id': `${ORIGIN}/#person` },
        },
      },
      page(
        '/about',
        `
<h1>About Michael Kaminski</h1>
<p>Technical product manager at the agent layer. Atlanta, relocating to New York City.</p>
${about.map((para) => `<p>${esc(para)}</p>`).join('')}

<h2>Where I've worked</h2>
<ol>${jobs
          .map(
            (j) => `<li><strong>${j.link ? `<a href="${esc(j.link)}">${esc(j.company)}</a>` : esc(j.company)}</strong>
— ${esc(j.title)} · <time>${esc(j.period)}</time><br>${esc(j.description)}${
              j.exit ? `<br><em>${esc(j.exit)}</em>` : ''
            }</li>`
          )
          .join('')}</ol>

<h2>The finance half, in numbers</h2>
<p>${totals.count} named transactions totalling $${totals.totalM.toLocaleString()}M — ${esc(
          totals.headline
        )} — across equity, debt, an IPO and a $4,000M share repurchase. Every one is listed
with its date, counterparty and instrument on the <a href="/">home page</a>.</p>

<p><a href="/projects">Case studies</a> · <a href="/writing">Writing</a></p>`
      )
    )
  );

  // ── /projects index ──
  safely('/projects', () =>
    write(
      '/projects',
      {
        title: 'Projects & Case Studies | Michael Kaminski',
        description: `Case studies in agent infrastructure and regulated lending, plus ${sites.length} live production sites and ${products.length} open-source tools. Every claim links to its source.`,
        crumbs: [
          { name: 'Home', path: '/' },
          { name: 'Projects', path: '/projects' },
        ],
        jsonLd: {
          '@context': 'https://schema.org',
          '@type': 'ItemList',
          name: 'Projects — Michael Kaminski',
          numberOfItems: projects.length + sites.length + products.length,
          itemListElement: [...projects, ...sites, ...products].map((it, i) => ({
            '@type': 'ListItem',
            position: i + 1,
            name: it.title || it.name,
            description: it.summary || it.description,
          })),
        },
      },
      projectsMarkup(projects, sites, products)
    )
  );

  // ── /projects/:slug ──
  for (const p of projects) {
    safely(`/projects/${p.slug}`, () =>
      write(
        `/projects/${p.slug}`,
        {
          title: `${p.title} | Michael Kaminski`,
          description: p.summary,
          type: 'article',
          image: p.image,
          crumbs: [
            { name: 'Home', path: '/' },
            { name: 'Projects', path: '/projects' },
            { name: p.title, path: `/projects/${p.slug}` },
          ],
          jsonLd: {
            '@context': 'https://schema.org',
            '@type': 'CreativeWork',
            headline: p.title,
            description: p.summary,
            datePublished: p.date,
            about: p.domain,
            author: { '@id': `${ORIGIN}/#person` },
            publisher: { '@id': `${ORIGIN}/#person` },
            url: `${ORIGIN}/projects/${p.slug}`,
            inLanguage: 'en',
          },
        },
        projectMarkup(p)
      )
    );
  }

  // ── /websites ──
  safely('/websites', () =>
    write(
      '/websites',
      {
        title: `Websites — ${sites.length} Live Production Sites | Michael Kaminski`,
        description: `${sites.length} sites built and running in production on Vercel: fintech portals, e-commerce storefronts, dashboards, and knowledge graphs.`,
        image: sites[0] && sites[0].image,
        crumbs: [
          { name: 'Home', path: '/' },
          { name: 'Websites', path: '/websites' },
        ],
        jsonLd: {
          '@context': 'https://schema.org',
          '@type': 'ItemList',
          name: 'Live production sites',
          numberOfItems: sites.length,
          itemListElement: sites.map((s, i) => ({
            '@type': 'ListItem',
            position: i + 1,
            name: s.name,
            description: s.description,
            url: s.url,
          })),
        },
      },
      websitesMarkup(sites)
    )
  );

  // ── /products ──
  safely('/products', () =>
    write(
      '/products',
      {
        title: `Products — ${products.length} Open-Source Tools | Michael Kaminski`,
        description: `${products.length} desktop tools and open-source utilities on GitHub: monitoring, screenshot tooling, MCP servers, and automation.`,
        image: products[0] && products[0].image,
        crumbs: [
          { name: 'Home', path: '/' },
          { name: 'Products', path: '/products' },
        ],
        jsonLd: {
          '@context': 'https://schema.org',
          '@type': 'ItemList',
          name: 'Open-source tools',
          numberOfItems: products.length,
          itemListElement: products.map((p, i) => ({
            '@type': 'ListItem',
            position: i + 1,
            name: p.name,
            description: p.description,
            url: p.repoUrl,
          })),
        },
      },
      productsMarkup(products)
    )
  );

  // ── Articles ──
  const articleLinks = articles
    .map((a) => `<li><a href="/writing/${esc(a.slug)}">${esc(a.title)}</a> — ${esc(a.description)}</li>`)
    .join('');

  for (const a of articles) {
    safely(`/writing/${a.slug}`, () => {
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
      write(
        `/writing/${a.slug}`,
        {
          title: `${a.title} | Michael Kaminski`,
          description: a.description,
          type: 'article',
          image: a.ogImage,
          crumbs: [
            { name: 'Home', path: '/' },
            { name: 'Writing', path: '/writing' },
            { name: a.title, path: `/writing/${a.slug}` },
          ],
          jsonLd,
        },
        articleMarkup(a, clip)
      );
    });
  }

  // ── /writing index ──
  safely('/writing', () =>
    write(
      '/writing',
      {
        title: 'Writing — Agent Infrastructure & Evals | Michael Kaminski',
        description:
          'Field notes on AI agent infrastructure, MCP servers, eval harnesses, and shipping agents inside a regulated lender.',
        crumbs: [
          { name: 'Home', path: '/' },
          { name: 'Writing', path: '/writing' },
        ],
        jsonLd: [
          {
            '@context': 'https://schema.org',
            '@type': 'Blog',
            name: 'Writing — Michael Kaminski',
            description: 'Field notes on agent infrastructure, evals, and shipping AI agents into production.',
            url: `${ORIGIN}/writing`,
            author: { '@id': `${ORIGIN}/#person` },
          },
          {
            '@context': 'https://schema.org',
            '@type': 'ItemList',
            name: 'Essays',
            numberOfItems: articles.length,
            itemListElement: articles.map((a, i) => ({
              '@type': 'ListItem',
              position: i + 1,
              name: a.title,
              description: a.description,
              url: `${ORIGIN}/writing/${a.slug}`,
            })),
          },
        ],
      },
      page(
        '/writing',
        `
<h1>Writing — Michael Kaminski</h1>
<p>Field notes on agent infrastructure, evals, and building AI agents that run in production.</p>
<ul>${articleLinks}</ul>`
      )
    )
  );

  // ── /clips ──
  // The transcript is the point. A 10-second vertical video is opaque to every
  // crawler that matters, so the spoken line and the finding behind it are
  // written into the static markup and into VideoObject schema.
  if (clips.length) {
    safely('/clips', () =>
      write(
        '/clips',
        {
          title: 'Field Clips — Agent & Pipeline Infrastructure | Michael Kaminski',
          description:
            'Ten-second field clips on agent and pipeline infrastructure: statistical gates that never bind, and dealer-gamma levels that move on zero trades. Full transcripts on the page.',
          image: clips[0] && clips[0].poster,
          crumbs: [
            { name: 'Home', path: '/' },
            { name: 'Field clips', path: '/clips' },
          ],
          jsonLd: clips.map((c) => ({
            '@context': 'https://schema.org',
            '@type': 'VideoObject',
            '@id': `${ORIGIN}/clips#${c.slug}`,
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
          })),
        },
        page(
          '/clips',
          `
<h1>Field clips — Michael Kaminski</h1>
<p>One finding, ten seconds. Each clip compresses a single result from a system I run; the
full arithmetic is in the write-up underneath it.</p>
${clips
  .map(
    (c) => `<section id="${esc(c.slug)}">
<h2>${esc(c.title)}</h2>
<p><em>${esc(c.description)}</em></p>
${img(c.poster, `${c.title} — video poster frame`, 360, 640)}
<video controls playsinline preload="none" poster="${esc(c.poster)}" src="${esc(c.src)}" width="${c.width}" height="${c.height}"></video>
${c.context}
<h3>Transcript</h3>
<blockquote>${esc(c.transcript)}</blockquote>
${c.relatedArticleSlug ? `<p><a href="/writing/${esc(c.relatedArticleSlug)}">Read the full write-up</a></p>` : ''}
</section>`
  )
  .join('')}`
        )
      )
    );
  }

  // ── /changelog ──
  if (entries.length) {
    safely('/changelog', () =>
      write(
        '/changelog',
        {
          title: 'Changelog | Michael Kaminski — What Shipped, and When',
          description:
            'A running log of every sizable update: production sites launched on Vercel, essays published, field clips posted, and platform work shipped — each entry dated and linked.',
          crumbs: [
            { name: 'Home', path: '/' },
            { name: 'Changelog', path: '/changelog' },
          ],
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
        },
        page(
          '/changelog',
          `
<h1>Changelog — Michael Kaminski</h1>
<p>Every sizable update in one place: a site going live, an essay published, a clip posted,
a piece of platform work landing. Each entry is dated the day it shipped and links to the
thing itself.</p>
<ul>
${entries
  .map(
    (e) => `<li><time datetime="${esc(e.date)}">${esc(e.date)}</time> · ${esc(
      KIND_LABELS[e.kind] || e.kind
    )} — <strong>${esc(e.title)}</strong>: ${esc(e.summary)}${(e.links || [])
      .map((l) => ` <a href="${esc(l.href)}">${esc(l.label)}</a>`)
      .join('')}</li>`
  )
  .join('')}
</ul>`
        )
      )
    );
  }

  // ── Role pages: kept, prerendered, but noindex ──
  // These are a recruiter lens, not a second positioning. They stay reachable
  // and get real content instead of a clone of the home page, but they are out
  // of the sitemap and marked noindex so they cannot compete with / for the
  // "what does this person do" question.
  for (const r of staticRoutes.noindexRoutes) {
    safely(r.path, () =>
      write(
        r.path,
        {
          title: r.title,
          description: r.description,
          noindex: true,
          crumbs: [
            { name: 'Home', path: '/' },
            { name: r.name, path: r.path },
          ],
        },
        page(
          r.path,
          `
<h1>${esc(r.heading)}</h1>
<p>${esc(r.description)}</p>
<p>This is one lens on the same work. The through-line is on the
<a href="/">home page</a>, and the evidence is in
<a href="/projects">projects and case studies</a>.</p>`
        )
      )
    );
  }

  // ── 404 ──
  // Every URL on this site used to return HTTP 200 with the home page's HTML
  // and then render a blank screen, because App.tsx had no catch-all route.
  safely('404', () => {
    const html = injectRoot(
      rewriteHead(shell, {
        title: 'Not found | Michael Kaminski',
        description: 'That page does not exist.',
        canonical: `${ORIGIN}/`,
        type: 'website',
        noindex: true,
      }),
      page(
        '',
        `
<h1>That page doesn't exist</h1>
<p>The link may be stale, or the page may have moved. Everything currently published is
one of the links above.</p>`
      )
    );
    fs.writeFileSync(path.join(BUILD, '404.html'), html);
  });

  console.log(
    `prerender: ${written.length} routes — home, /projects (+${projects.length} case studies), ` +
      `/websites (${sites.length}), /products (${products.length}), /writing (+${articles.length} essays), ` +
      `/clips (${clips.length}), /changelog (${entries.length}), ${staticRoutes.noindexRoutes.length} role pages, 404`
  );
}

try {
  main();
} catch (err) {
  console.warn(`prerender: skipped (${err && err.message}) — build left intact`);
}
