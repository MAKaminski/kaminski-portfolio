// PRERENDER CONTRACT — scripts/prerender.js slices this file between
//   `export const papers: Paper[] =`  and  `export const getPaper`
// and evaluates the slice as plain JavaScript. Inside the array literal:
//   no imports, no identifiers from other modules, no `as const`,
//   no enums / satisfies / type assertions, no template literals that
//   interpolate anything — plain string, number, boolean, array and
//   object literals only.
// Helpers and anything clever go BELOW the `export const getPaper` sentinel.

export interface PaperFinding {
  /** The claim, carrying its unit. */
  metric: string;
  /** One sentence of context so the number is never free-floating. */
  detail: string;
}

export interface Paper {
  slug: string;
  title: string;
  /** One line under the title. */
  subtitle: string;
  /** ISO date the PDF was published. Exactly one paper per date. */
  date: string;
  /** Page count of the PDF, so the reader knows the commitment. */
  pages: number;
  /** <=160 chars. Doubles as the meta description on the index. */
  abstract: string;
  /** Under /docs/papers. The whole card links here. */
  pdf: string;
  /** Social card under /images/papers. Optional. */
  image?: string;
  /** Three to five, each sourced in the PDF itself. */
  findings: PaperFinding[];
  /** Where the underlying work lives: repos, live URLs, essays. */
  sources: { label: string; href: string }[];
  tags: string[];
}

// Long-form write-ups with the arithmetic shown. Each PDF is the artifact of
// record; the essays on /writing are the short version.
export const papers: Paper[] = [
  {
    slug: 'sites-that-differ-by-data-not-code',
    title: 'Sites That Differ by Data, Not Code',
    subtitle: 'A five-minute contract for trade-business websites, and the gates that make it honest',
    date: '2026-09-23',
    pages: 8,
    abstract:
      'A generator builds a lead-gen site for a trade business from one intake file, deploys it to the edge and verifies it live in 46.5 s. The content is the part that does not fit in five minutes yet.',
    pdf: '/docs/papers/sites-that-differ-by-data-not-code.pdf',
    image: '/images/papers/og-sites-that-differ-by-data-not-code.png',
    findings: [
      {
        metric: '46.5 s from template to verified live site',
        detail:
          'Measured 2026-09-21: database 2.2, bot-check widget 0.3, build 1.3, repo from template 17.6, deploy 11.2, verify 13.8. Content generation for a new business is the unproven half of the five-minute contract.',
      },
      {
        metric: '1,613 → 10,000+ words after the first launch was destroyed',
        detail:
          'The first site scored 21% of a reference site on content. The fix went into the kit, not the site; rewritten fixtures score 92+ where the reference scores 75.9.',
      },
      {
        metric: 'Three live-deploy defects invisible in the local build',
        detail:
          'A 307 on every internal link, pages 404ing while the home page was up, and a lead endpoint that accepted unverified leads for the width of one deploy step. Each is now a gate.',
      },
      {
        metric: 'Zero fabricated trust content, enforced by the schema',
        detail:
          'Reviews and credentials require client-supplied provenance; unsupplied hours, addresses and licence claims are omitted from the page and the JSON-LD, never inferred.',
      },
    ],
    sources: [
      { label: 'Field note: the statute rewrote the product', href: '/writing/the-statute-rewrote-the-product' },
      { label: 'Case study', href: '/projects/trade-site-generator' },
    ],
    tags: ['Astro', 'Cloudflare Workers', 'D1', 'Generators', 'SEO'],
  },
  {
    slug: 'one-database-many-connectors',
    title: 'One Database, Many Connectors',
    subtitle: 'An operating system for a small services business, and the agent desk that works its own queue',
    date: '2026-09-22',
    pages: 7,
    abstract:
      'A six-person maintenance company runs on one Postgres database, a static page and twelve serverless functions, with the rule that no tool ever talks to another tool. Three production incidents and the hand-over rule for an agent with a queue.',
    pdf: '/docs/papers/one-database-many-connectors.pdf',
    image: '/images/papers/og-one-database-many-connectors.png',
    findings: [
      {
        metric: '2,493 accounts → a 62 KB query string → a 400 that took a whole tab down',
        detail:
          'An optional Call button filtered the CRM mirror by every id on the board. The fix that matters: an optional feature can no longer fail the page it decorates. It returns empty and logs.',
      },
      {
        metric: '0 of 585 jobs carried a lead source; 72% of customers carry a phone',
        detail:
          'So paid-ad attribution matches on the last ten digits of the phone first, then email, and reports a funnel with null cost metrics until a denominator exists.',
      },
      {
        metric: '9 of 10 agent-owned tasks had no step the agent could take',
        detail:
          'They were parked as blocked, where nobody looks. The rule changed: hand the task to the person who holds the system, with the click path in the notes.',
      },
      {
        metric: 'Twelve serverless functions, all in use',
        detail:
          'The free plan’s cap is treated as a design pressure. Each shared endpoint is documented at the point of use with the same sentence, so the next person knows what to unbundle.',
      },
    ],
    sources: [
      { label: 'Case study', href: '/projects/transparent-maintenance-os' },
      { label: 'Field note: guard jobs are free', href: '/writing/guard-jobs-are-free' },
    ],
    tags: ['Supabase', 'Vercel', 'Agents', 'Operations', 'Attribution'],
  },
  {
    slug: 'the-demand-instrument',
    title: 'The Demand Instrument',
    subtitle: 'Nine ideas on one template, and the three ways a validation test gets misread',
    date: '2026-09-21',
    pages: 6,
    abstract:
      'Nine business ideas on nine landing pages built from one template, each with a pass/fail bar set before the traffic. The instrument, the funnel plumbing most templates get wrong, and a read model that refuses three misreads.',
    pdf: '/docs/papers/the-demand-instrument.pdf',
    image: '/images/papers/og-the-demand-instrument.png',
    findings: [
      {
        metric: 'One hosting project per launch; everything else shared, joined by one slug',
        detail:
          'Analytics, database, payments and scheduling are one account each. Running ten ideas costs roughly what running one does, and every launch stays comparable in a single view.',
      },
      {
        metric: 'Bars from 6 to 48 costly actions, set before the test',
        detail:
          'A booked call needs 6 of 400 views; a qualified email needs 32 to 48 of 800. The cheaper the proof, the higher the rate it has to clear.',
      },
      {
        metric: 'The webhook is the truth for purchase_completed',
        detail:
          'A browser event is spoofable, is missed when the tab closes before the redirect, and double-counts revenue when both fire. The browser’s distinct id rides through checkout so the server event lands on the same person.',
      },
      {
        metric: 'An unauthorised token gets zero rows from the database',
        detail:
          'Registration is open, so authorisation lives in Postgres: an allowlist table with deny-all row security and a definer-rights function with a pinned search path. No privileged key is deployed.',
      },
    ],
    sources: [
      { label: 'MAKaminski/launch-template', href: 'https://github.com/MAKaminski/launch-template' },
      { label: 'The Demand Test', href: 'https://ten-experiments.vercel.app' },
    ],
    tags: ['Next.js', 'PostHog', 'Supabase', 'Stripe', 'Validation'],
  },
];

export const getPaper = (slug: string): Paper | undefined => papers.find((p) => p.slug === slug);

/** Newest paper's date — feeds the /papers lastmod. */
export const latestPaperDate = (): string => papers[0]?.date ?? '';

// Exactly one paper per calendar date, same rule as articles.ts.
const seenPaperDates = new Map<string, string>();
for (const p of papers) {
  const prior = seenPaperDates.get(p.date);
  if (prior) throw new Error(`papers.ts: "${p.slug}" and "${prior}" share the date ${p.date}`);
  seenPaperDates.set(p.date, p.slug);
}
