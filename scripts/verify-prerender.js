/* eslint-disable */
// Post-prerender invariant check.
//
// An external audit scored this site by reading its pre-JavaScript HTML, and
// found: no CTAs, no distinct project items, no testimonials, no images. All
// four were true of the HTML and false of the rendered site — because every
// route outside a short allowlist fell through Vercel's SPA rewrite and served
// the home page's markup. Eleven URLs, byte-identical.
//
// That class of bug is silent: the build succeeds, the site looks right in a
// browser, and only a crawler ever sees the problem. So it gets an assertion.
//
// Log-only by design. Like the prerender itself, this must never fail a deploy
// — a red build here would take the site down over a metadata regression. It
// prints loudly and exits 0; CI surfaces the warnings.
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const ROOT = path.join(__dirname, '..');
const BUILD = path.join(ROOT, 'build');
const SITEMAP = path.join(ROOT, 'public', 'sitemap.xml');
const ORIGIN = 'https://www.michael-kaminski.io';

const problems = [];
const note = (m) => problems.push(m);

function fileFor(routePath) {
  return routePath === '/'
    ? path.join(BUILD, 'index.html')
    : path.join(BUILD, ...routePath.split('/').filter(Boolean), 'index.html');
}

function textOf(html) {
  return html
    .replace(/<script[\s\S]*?<\/script>/g, '')
    .replace(/<style[\s\S]*?<\/style>/g, '')
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function main() {
  if (!fs.existsSync(SITEMAP)) return note('public/sitemap.xml missing');

  const locs = [...fs.readFileSync(SITEMAP, 'utf8').matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) =>
    m[1].replace(ORIGIN, '')
  );

  // 1. Every advertised URL must have its own prerendered file.
  const byHash = new Map();
  for (const loc of locs) {
    const f = fileFor(loc);
    if (!fs.existsSync(f)) {
      note(`MISSING PRERENDER: ${loc} is in the sitemap but has no file at ${path.relative(ROOT, f)}`);
      continue;
    }
    // 2. No two advertised URLs may serve identical content. This is the exact
    //    regression that produced the audit's findings.
    const body = textOf(fs.readFileSync(f, 'utf8'));
    const hash = crypto.createHash('md5').update(body).digest('hex');
    if (byHash.has(hash)) {
      note(`DUPLICATE CONTENT: ${loc} is byte-identical to ${byHash.get(hash)}`);
    } else {
      byHash.set(hash, loc);
    }
  }

  // 3. Per-page content floors, on every prerendered file (not just sitemap ones).
  const all = [];
  (function walk(dir) {
    for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
      const p = path.join(dir, e.name);
      if (e.isDirectory()) walk(p);
      else if (e.name === 'index.html' || e.name === '404.html') all.push(p);
    }
  })(BUILD);

  for (const f of all) {
    const html = fs.readFileSync(f, 'utf8');
    const rel = path.relative(BUILD, f);

    if (!/calendly\.com\/kaminski1337/.test(html)) {
      note(`NO CTA: ${rel} has no Calendly anchor`);
    }
    if (!/rel="canonical"/.test(html)) {
      note(`NO CANONICAL: ${rel}`);
    }
    for (const tag of html.match(/<img [^>]*>/g) || []) {
      if (!/\balt=/.test(tag)) note(`IMG WITHOUT ALT: ${rel} — ${tag.slice(0, 90)}`);
    }
    for (const block of html.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g) || []) {
      const json = block.replace(/^<script[^>]*>/, '').replace(/<\/script>$/, '');
      try {
        JSON.parse(json);
      } catch (err) {
        note(`INVALID JSON-LD: ${rel} — ${err.message}`);
      }
    }
    // FAQPage and ProfilePage are site-shell schema. Cloned onto every page,
    // they had twenty-odd URLs each claiming to be the same profile.
    if (rel !== 'index.html' && /"@type": ?"(FAQPage|ProfilePage)"/.test(html)) {
      note(`SHELL SCHEMA LEAKED: ${rel} carries FAQPage/ProfilePage`);
    }
  }

  // 4. The home page carries the proof surfaces the audit measured as zero.
  const home = fs.existsSync(fileFor('/')) ? fs.readFileSync(fileFor('/'), 'utf8') : '';
  const count = (re) => (home.match(re) || []).length;
  if (count(/<img /g) < 5) note(`HOME IMAGES: only ${count(/<img /g)} <img> on the home page`);
  if (count(/<blockquote/g) < 5) note(`HOME TESTIMONIALS: only ${count(/<blockquote/g)} blockquotes`);
  if (!/mailto:/.test(home)) note('HOME: no mailto: anchor');
}

try {
  main();
} catch (err) {
  console.warn(`verify-prerender: check itself failed (${err && err.message})`);
}

if (problems.length) {
  console.warn(`\nverify-prerender: ${problems.length} problem(s)\n` + problems.map((p) => `  ✗ ${p}`).join('\n') + '\n');
} else {
  console.log('verify-prerender: all routes present, distinct, and complete ✓');
}
