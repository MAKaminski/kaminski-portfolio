/* eslint-disable */
// Rebuilds public/sitemap.xml from the routes below plus every article in
// src/data/articles.ts.
//
// This exists because the hand-maintained version rotted: nine articles had
// shipped without ever being added, so they were live and unlisted. A sitemap
// that has to be edited by hand every time you publish is a sitemap that will
// be wrong. Runs automatically as part of `npm run build`.
const fs = require('fs');
const path = require('path');

const ORIGIN = 'https://www.michael-kaminski.io';
const ROOT = path.join(__dirname, '..');
const ARTICLES = path.join(ROOT, 'src', 'data', 'articles.ts');
const OUT = path.join(ROOT, 'public', 'sitemap.xml');

// Static routes, mirroring the <Route> list in src/App.tsx.
const routes = [
  { path: '/', changefreq: 'weekly', priority: '1.0' },
  { path: '/cfo', changefreq: 'monthly', priority: '0.9' },
  { path: '/technology', changefreq: 'monthly', priority: '0.9' },
  { path: '/cpo', changefreq: 'monthly', priority: '0.9' },
  { path: '/strategy', changefreq: 'monthly', priority: '0.9' },
  { path: '/revenue', changefreq: 'monthly', priority: '0.9' },
  { path: '/client-outcomes', changefreq: 'monthly', priority: '0.8' },
  { path: '/websites', changefreq: 'monthly', priority: '0.8' },
  { path: '/products', changefreq: 'monthly', priority: '0.8' },
  { path: '/writing', changefreq: 'weekly', priority: '0.8' },
  { path: '/knowledge-graph', changefreq: 'monthly', priority: '0.7' },
  { path: '/jira-prd', changefreq: 'monthly', priority: '0.6' },
];

const source = fs.readFileSync(ARTICLES, 'utf8');
const slugs = [...source.matchAll(/^\s{4}slug: '([^']+)',$/gm)].map((m) => m[1]);
const dates = [...source.matchAll(/^\s{4}date: '([^']+)',$/gm)].map((m) => m[1]);

if (!slugs.length || slugs.length !== dates.length) {
  console.error(
    `generate-sitemap: parsed ${slugs.length} slugs and ${dates.length} dates from articles.ts — refusing to write a sitemap I don't trust.`
  );
  process.exit(1);
}

// Newest article dates the /writing index and the site root.
const newest = dates.slice().sort().reverse()[0];

const entries = [
  ...routes.map((r) => ({
    loc: ORIGIN + r.path,
    lastmod: r.path === '/' || r.path === '/writing' ? newest : todayIso(),
    changefreq: r.changefreq,
    priority: r.priority,
  })),
  ...slugs.map((slug, i) => ({
    loc: `${ORIGIN}/writing/${slug}`,
    lastmod: dates[i],
    changefreq: 'monthly',
    priority: '0.7',
  })),
];

function todayIso() {
  return new Date().toISOString().slice(0, 10);
}

const xml = [
  '<?xml version="1.0" encoding="UTF-8"?>',
  '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
  ...entries.map((e) =>
    [
      '  <url>',
      `    <loc>${e.loc}</loc>`,
      `    <lastmod>${e.lastmod}</lastmod>`,
      `    <changefreq>${e.changefreq}</changefreq>`,
      `    <priority>${e.priority}</priority>`,
      '  </url>',
    ].join('\n')
  ),
  '</urlset>',
  '',
].join('\n');

fs.writeFileSync(OUT, xml);
console.log(`Wrote sitemap.xml — ${routes.length} routes + ${slugs.length} articles`);
