/* eslint-disable */
// The single source of truth for which non-article routes exist.
//
// This module exists because scripts/prerender.js and scripts/generate-sitemap.js
// used to keep two independent lists, and they drifted: the sitemap advertised
// /cfo, /technology, /cpo, /strategy, /revenue, /client-outcomes, /websites,
// /products, /knowledge-graph and /jira-prd to Google, while the prerenderer
// wrote files for none of them. Vercel's SPA rewrite then served build/index.html
// for every one — eleven URLs returning the home page's markup, title and
// og:type, with no canonical tag to disambiguate them.
//
// Both scripts now require this file. scripts/verify-prerender.js asserts after
// every build that each indexable route below produced a distinct file.

/** Routes that are prerendered AND submitted to Google. */
const indexedRoutes = [
  { path: '/', changefreq: 'weekly', priority: '1.0' },
  { path: '/projects', changefreq: 'weekly', priority: '0.9' },
  { path: '/websites', changefreq: 'monthly', priority: '0.8' },
  { path: '/products', changefreq: 'monthly', priority: '0.8' },
  { path: '/writing', changefreq: 'weekly', priority: '0.8' },
  { path: '/clips', changefreq: 'weekly', priority: '0.8' },
  { path: '/changelog', changefreq: 'weekly', priority: '0.7' },
];

/**
 * Role pages. Prerendered so they are never a clone of the home page, but kept
 * out of the sitemap and marked noindex.
 *
 * They are a recruiter lens on one body of work, not a second identity. Left
 * indexable they compete with / for "what does this person do" — which is
 * exactly the ambiguity the site is being cleaned up to remove. /cfo and
 * /revenue are gone entirely (see vercel.json redirects); they announced
 * "Fractional & Full-Time CFO for Fintech" on a site whose h1 says
 * "I build AI agents that run in production".
 */
const noindexRoutes = [
  {
    path: '/technology',
    name: 'Technology',
    heading: 'Technology — the engineering half',
    title: 'Technology & Engineering Leadership | Michael Kaminski',
    description:
      'The infrastructure side of the agent work: Terraform modules with multi-environment remote state, production Kubernetes, PostgreSQL, and the pipelines agents actually run on.',
  },
  {
    path: '/cpo',
    name: 'Product',
    heading: 'Product — the ownership half',
    title: 'Product Leadership | Michael Kaminski',
    description:
      'Product ownership at the agent layer: tool surfaces an agent can call, eval harnesses, approval gates on irreversible actions, and getting all of it through review.',
  },
  {
    path: '/strategy',
    name: 'Strategy',
    heading: 'Strategy — pricing the system and shipping it',
    title: 'Strategy | Michael Kaminski',
    description:
      'Where the finance background earns its keep: building the business case for agent infrastructure and then building the infrastructure.',
  },
  {
    path: '/knowledge-graph',
    name: 'Knowledge graph',
    heading: 'Knowledge graph',
    title: 'Knowledge Graph | Michael Kaminski',
    description:
      'An interactive graph of the skills, companies, and work described across this site.',
  },
  {
    path: '/jira-prd',
    name: 'PRD generator',
    heading: 'PRD generator',
    title: 'PRD Generator | Michael Kaminski',
    description: 'A small interactive tool that turns a problem statement into a structured PRD.',
  },
];

module.exports = { indexedRoutes, noindexRoutes };
