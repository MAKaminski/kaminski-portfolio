/* eslint-disable */
// Rebuilds public/sitemap.xml from scripts/routes.js plus every article in
// src/data/articles.ts and every case study in src/data/projects.ts.
//
// This exists because the hand-maintained version rotted: nine articles had
// shipped without ever being added, so they were live and unlisted. A sitemap
// that has to be edited by hand every time you publish is a sitemap that will
// be wrong.
//
// The route list used to live here as its own array, which rotted a second
// way: it advertised ten URLs that scripts/prerender.js never wrote files for,
// so Google was told about eleven pages that all served the home page's HTML.
// Both scripts now read scripts/routes.js. Runs automatically as `prebuild`.
const fs = require('fs');
const path = require('path');
const { indexedRoutes } = require('./routes');

const ORIGIN = 'https://www.michael-kaminski.io';
const ROOT = path.join(__dirname, '..');
const ARTICLES = path.join(ROOT, 'src', 'data', 'articles.ts');
const PROJECTS = path.join(ROOT, 'src', 'data', 'projects.ts');
const OUT = path.join(ROOT, 'public', 'sitemap.xml');

const source = fs.readFileSync(ARTICLES, 'utf8');
const slugs = [...source.matchAll(/^\s{4}slug: '([^']+)',$/gm)].map((m) => m[1]);
const dates = [...source.matchAll(/^\s{4}date: '([^']+)',$/gm)].map((m) => m[1]);

if (!slugs.length || slugs.length !== dates.length) {
  console.error(
    `generate-sitemap: parsed ${slugs.length} slugs and ${dates.length} dates from articles.ts — refusing to write a sitemap I don't trust.`
  );
  process.exit(1);
}

const projectSrc = fs.readFileSync(PROJECTS, 'utf8');
const projectSlugs = [...projectSrc.matchAll(/^\s{4}slug: '([^']+)',$/gm)].map((m) => m[1]);
const projectDates = [...projectSrc.matchAll(/^\s{4}date: '([^']+)',$/gm)].map((m) => m[1]);

if (!projectSlugs.length || projectSlugs.length !== projectDates.length) {
  console.error(
    `generate-sitemap: parsed ${projectSlugs.length} slugs and ${projectDates.length} dates from projects.ts — refusing to write a sitemap I don't trust.`
  );
  process.exit(1);
}

function todayIso() {
  return new Date().toISOString().slice(0, 10);
}

// Newest article dates the /writing index and the site root.
const newest = dates.slice().sort().reverse()[0];

const entries = [
  ...indexedRoutes.map((r) => ({
    loc: ORIGIN + r.path,
    lastmod: r.path === '/' || r.path === '/writing' ? newest : todayIso(),
    changefreq: r.changefreq,
    priority: r.priority,
  })),
  ...projectSlugs.map((slug, i) => ({
    loc: `${ORIGIN}/projects/${slug}`,
    lastmod: projectDates[i],
    changefreq: 'monthly',
    priority: '0.9',
  })),
  ...slugs.map((slug, i) => ({
    loc: `${ORIGIN}/writing/${slug}`,
    lastmod: dates[i],
    changefreq: 'monthly',
    priority: '0.7',
  })),
];

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
console.log(
  `Wrote sitemap.xml — ${indexedRoutes.length} routes + ${projectSlugs.length} case studies + ${slugs.length} articles`
);
