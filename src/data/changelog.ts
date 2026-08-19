import { articles } from './articles';
import { clips } from './clips';

/**
 * The changelog — every sizable update to the profile, in one place.
 *
 * Two rules make this file worth having:
 *
 * 1. **Anything with its own data file derives itself.** Essays come from
 *    articles.ts and field clips from clips.ts, so a run of the daily writing
 *    routine lands on the changelog without anybody remembering to add it here.
 *    The sitemap learned this lesson the hard way (nine articles shipped
 *    unlisted because the file had to be hand-edited); the changelog does not
 *    get to repeat it.
 * 2. **Everything else is hand-written, dated, and linked.** Site launches and
 *    platform work have no data file to read, so they live in `shipped` below.
 *    Every entry carries the date it actually went live and a link you can
 *    click to check the claim.
 */

export type ChangeKind = 'launch' | 'essay' | 'clip' | 'feature' | 'tool';

export type ChangeLink = {
  label: string;
  href: string;
};

export type ChangeEntry = {
  /** ISO date the change went live. */
  date: string;
  kind: ChangeKind;
  title: string;
  summary: string;
  links?: ChangeLink[];
  tags?: string[];
};

export const KIND_LABELS: Record<ChangeKind, string> = {
  launch: 'Site launch',
  essay: 'Essay',
  clip: 'Field clip',
  feature: 'Feature',
  tool: 'Open source',
};

/**
 * Hand-maintained entries: launches and platform work.
 *
 * Dates are the real ones — first production deploy for a launch, the commit
 * date for platform work — not the day the entry was written.
 */
const shipped: ChangeEntry[] = [
  {
    date: '2026-08-17',
    kind: 'feature',
    title: 'Added this changelog',
    summary:
      'A running log of every sizable update: sites launched, essays published, clips posted, platform work shipped. Essays and clips derive from their own data files, so the page updates itself when the writing routine runs.',
    links: [{ label: 'You are here', href: '/changelog' }],
    tags: ['React', 'TypeScript'],
  },
  {
    date: '2026-08-17',
    kind: 'launch',
    title: 'The Demand Test — nine ideas, fourteen days, zero spend',
    summary:
      'A public validation experiment running August 17–31: nine business ideas, each with its own landing page and its own pass/fail threshold — a booked call, a $1 refundable deposit, a written reply. One idea gets built on August 30, and the data behind the pick is published with it.',
    links: [{ label: 'ten-experiments.vercel.app', href: 'https://ten-experiments.vercel.app' }],
    tags: ['Next.js', 'Validation', 'Landing Pages'],
  },
  {
    date: '2026-08-17',
    kind: 'launch',
    title: 'Demand Desk — the funnel behind the demand test',
    summary:
      'The instrumentation half of the demand test: nine landing-page funnels compared side by side on one dashboard, so the August 30 decision is read off a chart rather than argued. Access is allowlisted; the public entry point is the sign-in screen.',
    links: [{ label: 'demand-desk-rho.vercel.app', href: 'https://demand-desk-rho.vercel.app' }],
    tags: ['Next.js', 'Analytics', 'Funnels'],
  },
  {
    date: '2026-08-17',
    kind: 'launch',
    title: 'DealPacket — one address in, a packet every party can read',
    summary:
      'Real-estate underwriting as an MCP server. One address returns ARV, rent estimates, comps and ownership, then renders the same packet five ways — investor, GC, lender, CPA, title — with the source and fetch timestamp printed next to every figure so the recipient can verify instead of trust.',
    links: [{ label: 'dealpacket.vercel.app', href: 'https://dealpacket.vercel.app' }],
    tags: ['MCP', 'Real Estate', 'Next.js'],
  },
  {
    date: '2026-08-17',
    kind: 'launch',
    title: 'The Genome of Games — an ontology of game mechanics',
    summary:
      '168 mechanics, 618 games, 394 studios and 4,366 inheritance links from 1962 to 2025. Mechanics are grouped by the design problem they solve rather than by genre, and every one traces its descent — contextual execution in Gears of War back to collision detection in Spacewar!.',
    links: [
      { label: 'genome-of-games.vercel.app', href: 'https://genome-of-games.vercel.app' },
      { label: 'Source', href: 'https://github.com/MAKaminski/genome-of-games' },
    ],
    tags: ['Data Viz', 'Ontology', 'Research'],
  },
  {
    date: '2026-08-17',
    kind: 'tool',
    title: 'launch-template — a new product launch in under fifteen minutes',
    summary:
      'A repo template that stands up a marketing site, analytics, database, payments and booking for a new idea in one command. One Vercel project per launch so each gets its own domain and deploy cadence; everything underneath is shared and joined by a single launch_slug. This is the machine the demand test runs on.',
    links: [{ label: 'MAKaminski/launch-template', href: 'https://github.com/MAKaminski/launch-template' }],
    tags: ['Next.js', 'PostHog', 'Supabase', 'Stripe'],
  },
  {
    date: '2026-08-17',
    kind: 'feature',
    title: 'Field clips get transcripts and VideoObject schema',
    summary:
      'A ten-second vertical video is opaque to every crawler that matters, so /clips writes the spoken line and the finding behind it into the static HTML and into VideoObject schema. Clips that tease an essay now attach to that essay in the prerendered markup too.',
    links: [{ label: '/clips', href: '/clips' }],
    tags: ['SEO', 'Schema.org', 'Video'],
  },
  {
    date: '2026-08-09',
    kind: 'feature',
    title: 'Prerendered the SPA so crawlers see prose, not a stub',
    summary:
      'The site is a CRA single-page app, so the HTML leaving the server was <div id="root"></div> and nothing else — the portfolio and the writing were effectively invisible to search and LLM crawlers. A postbuild step now writes real prose into #root for the home page, /writing and every essay, with no headless browser and no new dependencies.',
    links: [{ label: '/writing', href: '/writing' }],
    tags: ['SEO', 'AEO', 'Build'],
  },
  {
    date: '2026-08-09',
    kind: 'feature',
    title: 'Charts and per-article social cards for the essays',
    summary:
      'Essays got generated figures — a retention floor, an animated counter bug — plus a per-article OG card so a shared link carries the piece rather than the site-wide image. The figure generator is checked in, so the charts are reproducible rather than pasted screenshots.',
    tags: ['Matplotlib', 'OG Images'],
  },
  {
    date: '2026-08-02',
    kind: 'launch',
    title: 'Commitgraph — GitHub leaderboards that show the data',
    summary:
      'Worldwide, country and city rankings for the most active developers on GitHub. Existing ranking sites ship a paginated table of logins and one number; this one adds 371-day contribution heatmaps, rank-movement bump charts, a tile-grid world map, and a follower/contribution scatter that shows fame and output are different axes. It also labels what it does not know.',
    links: [
      { label: 'top-github-users-amber.vercel.app', href: 'https://top-github-users-amber.vercel.app' },
      { label: 'Source', href: 'https://github.com/MAKaminski/Top-Github-Users' },
    ],
    tags: ['Next.js', 'Data Viz', 'GitHub API'],
  },
  {
    date: '2026-08-02',
    kind: 'launch',
    title: 'YardLine and VendorLink go live',
    summary:
      'Two marketplaces in one week. YardLine is a roster-gated prospecting CRM for heavy-duty truck salvage yards around metro Atlanta; VendorLink pairs event organizers with local vendors through profiles, one-click applications, digital contracts and payment.',
    links: [
      { label: 'yard-line.vercel.app', href: 'https://yard-line.vercel.app' },
      { label: 'vendor-link-web.vercel.app', href: 'https://vendor-link-web.vercel.app' },
    ],
    tags: ['Next.js', 'Supabase', 'Marketplace'],
  },
  {
    date: '2026-08-02',
    kind: 'feature',
    title: 'A voice-capable digital twin on the home page',
    summary:
      'An ElevenLabs-backed twin that answers questions about the work out loud, with hands-free conversation mode, TTS-aware text so it reads numbers like a person, and a visible reason when a speech request is rejected instead of silent failure.',
    tags: ['ElevenLabs', 'Voice', 'Anthropic SDK'],
  },
  {
    date: '2026-07-28',
    kind: 'launch',
    title: 'COT Signal — CFTC positioning for Bitcoin and Ether',
    summary:
      'Weekly CME futures positioning read straight off the Commitments of Traders report: asset managers, hedge funds and dealers, net long against net short, with no interpretation layer between the filing and the chart.',
    links: [{ label: 'cot-signal.vercel.app', href: 'https://cot-signal.vercel.app' }],
    tags: ['Next.js', 'Futures', 'CFTC Data'],
  },
  {
    date: '2026-07-25',
    kind: 'feature',
    title: 'Added the Products directory',
    summary:
      'A home for the desktop tools and open-source utilities that live on GitHub rather than on a URL — the macOS monitor, the touchscreen daemon, the on-device context capture.',
    links: [{ label: '/products', href: '/products' }],
    tags: ['React'],
  },
  {
    date: '2026-07-24',
    kind: 'feature',
    title: 'Added the Websites directory',
    summary:
      'A directory of every production site running under the Kaminski Vercel account, each card linking straight to the live deploy. It has grown from four entries to twenty-one since.',
    links: [{ label: '/websites', href: '/websites' }],
    tags: ['React'],
  },
  {
    date: '2026-07-23',
    kind: 'feature',
    title: 'Rebuilt the site on a dark editorial theme',
    summary:
      'A full redesign: one dark palette with an electric-yellow accent, kinetic motion, a company-logo marquee in the hero, and role-specific landing pages that no longer leak a pastel background onto the home page when a role is persisted.',
    links: [{ label: 'Home', href: '/' }],
    tags: ['Tailwind', 'Framer Motion'],
  },
];

/** Essays derive from articles.ts — new writing lands here automatically. */
const essayEntries: ChangeEntry[] = articles.map((a) => ({
  date: a.date,
  kind: 'essay' as const,
  title: a.title,
  summary: a.description,
  links: [{ label: 'Read the essay', href: `/writing/${a.slug}` }],
  tags: [`${a.readMinutes} min read`, ...(a.series ? [a.series] : [])],
}));

/** Field clips derive from clips.ts, same reasoning. */
const clipEntries: ChangeEntry[] = clips.map((c) => ({
  date: c.uploadDate,
  kind: 'clip' as const,
  title: c.title,
  summary: c.description,
  links: [{ label: 'Watch the clip', href: `/clips#${c.slug}` }],
  tags: [`${c.durationSec}s`],
}));

/**
 * Every entry, newest first. Ties break by kind so a launch outranks the essay
 * published the same day — the bigger change reads first.
 */
const KIND_WEIGHT: Record<ChangeKind, number> = {
  launch: 0,
  feature: 1,
  tool: 2,
  essay: 3,
  clip: 4,
};

export const changelog: ChangeEntry[] = [...shipped, ...essayEntries, ...clipEntries].sort(
  (a, b) => b.date.localeCompare(a.date) || KIND_WEIGHT[a.kind] - KIND_WEIGHT[b.kind]
);

/** "2026-08-17" -> "August 2026". Used to group the timeline. */
export const monthLabel = (isoDate: string): string =>
  new Date(`${isoDate}T00:00:00Z`).toLocaleDateString('en-US', {
    month: 'long',
    year: 'numeric',
    timeZone: 'UTC',
  });

/** "2026-08-17" -> "Aug 17". The per-entry date stamp. */
export const dayLabel = (isoDate: string): string =>
  new Date(`${isoDate}T00:00:00Z`).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    timeZone: 'UTC',
  });

/** Newest change on the site — used for the /changelog lastmod and the SEO copy. */
export const latestChangeDate = (): string => changelog[0]?.date ?? '';

export const countsByKind = (): Record<ChangeKind, number> =>
  changelog.reduce(
    (acc, entry) => {
      acc[entry.kind] += 1;
      return acc;
    },
    { launch: 0, feature: 0, tool: 0, essay: 0, clip: 0 } as Record<ChangeKind, number>
  );
