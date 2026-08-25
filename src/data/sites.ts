// PRERENDER CONTRACT — scripts/prerender.js slices this file between
//   `export const sites: Site[] =`  and  `export const getSite`
// and evaluates the slice as plain JavaScript. Inside the array literal:
//   no imports, no identifiers from other modules, no `as const`,
//   no enums / satisfies / type assertions, no template literals that
//   interpolate anything — plain string, number, boolean, array and
//   object literals only.
// Helpers and anything clever go BELOW the `export const getSite` sentinel.

export type Site = {
  name: string;
  url: string;
  /**
   * Screenshot under /images/sites. Optional: a site can go live here the day
   * it deploys, before a capture exists, and gets a typographic panel instead
   * of a broken image. Add the .webp later and the card picks it up.
   */
  image?: string;
  category: string;
  description: string;
  tags: string[];
};

// Live production sites deployed on Vercel under the Kaminski account.
// Each screenshot links directly to the running site.
export const sites: Site[] = [
  {
    name: 'Modular Equity',
    url: 'https://www.modularequity.com',
    image: '/images/sites/modularequity.webp',
    category: 'Private Equity · Real Estate',
    description:
      'Investor portal for a renovation-focused fund. Raises and reports on fix-and-flip deals with disciplined underwriting, transparent reporting, and a streamlined interest-to-subscription flow.',
    tags: ['Next.js', 'Fintech', 'Real Estate'],
  },
  {
    name: 'Lace Luxx',
    url: 'https://www.lace-luxx.com',
    image: '/images/sites/lace-luxx.webp',
    category: 'E-commerce · Live Shopping',
    description:
      'Luxury live-shopping storefront for authenticated designer handbags. Bid live on Whatnot or shop the collection any time, with a 100% authentication guarantee.',
    tags: ['Next.js', 'E-commerce', 'Whatnot'],
  },
  {
    name: 'The Demand Test',
    url: 'https://ten-experiments.vercel.app',
    category: 'Validation · Experiment',
    description:
      'A public, zero-spend validation run: nine business ideas, fourteen days, each with its own landing page and its own pass/fail threshold — a booked call, a $1 refundable deposit, a written reply. One gets built, and the data behind the pick gets published with it.',
    tags: ['Next.js', 'Landing Pages', 'Validation'],
  },
  {
    name: 'Demand Desk',
    url: 'https://demand-desk-rho.vercel.app',
    category: 'Analytics · Funnels',
    description:
      'The instrumentation behind the demand test — nine landing-page funnels compared side by side, so the decision at the end is read off a chart instead of argued. Access is allowlisted, so the public entry point is the sign-in screen.',
    tags: ['Next.js', 'Analytics', 'Supabase'],
  },
  {
    name: 'DealPacket',
    url: 'https://dealpacket.vercel.app',
    category: 'PropTech · MCP',
    description:
      'Real-estate underwriting as an MCP server. One address returns ARV, rent estimates, comps and ownership, then renders the same packet five ways — investor, GC, lender, CPA, title — with the source and fetch timestamp printed beside every figure.',
    tags: ['MCP', 'Real Estate', 'Next.js'],
  },
  {
    name: 'The Genome of Games',
    url: 'https://genome-of-games.vercel.app',
    category: 'Research · Data Viz',
    description:
      '168 game mechanics, 618 games, 394 studios and 4,366 inheritance links from 1962 to 2025 — grouped by the design problem each mechanic solves rather than by genre, with every one traced back through its ancestors.',
    tags: ['Data Viz', 'Ontology', 'Research'],
  },
  {
    name: 'Commitgraph',
    url: 'https://top-github-users-amber.vercel.app',
    category: 'Developer Data · Leaderboards',
    description:
      'Worldwide, country and city leaderboards for the most active developers on GitHub — with the contribution heatmaps, rank-movement bump charts, tile-grid maps and follower/output scatter that a table of follower counts cannot show.',
    tags: ['Next.js', 'Data Viz', 'GitHub API'],
  },
  {
    name: 'The Gamma Wall',
    url: 'https://gamma-wall.com',
    image: '/images/sites/gamma-wall.webp',
    category: 'Markets · Media',
    description:
      'Options-flow and market-structure publication. Live commentary on gamma walls, dealer positioning, and 0DTE flow, plus a daily pre-market tape and subscriber articles.',
    tags: ['Next.js', 'Options', 'Publishing'],
  },
  {
    name: 'COT Signal',
    url: 'https://cot-signal.vercel.app',
    image: '/images/sites/cot-signal.webp',
    category: 'Markets · Data',
    description:
      'Weekly CME futures positioning for Bitcoin and Ether, read straight off the CFTC Commitments of Traders report — asset managers, hedge funds, and dealers, net long against net short.',
    tags: ['Next.js', 'Futures', 'CFTC Data'],
  },
  {
    name: 'OurAI',
    url: 'https://our-ai-web.vercel.app',
    image: '/images/sites/our-ai-web.webp',
    category: 'AI · SaaS',
    description:
      'Multiplayer AI workspace where a team and AI agents ship one repo together over a shared live transcript — from idea intake to a human-approved, merged pull request.',
    tags: ['Next.js', 'AI Agents', 'SaaS'],
  },
  {
    name: 'VendorLink',
    url: 'https://vendor-link-web.vercel.app',
    image: '/images/sites/vendor-link-web.webp',
    category: 'Marketplace · SaaS',
    description:
      'Two-sided marketplace pairing event organizers with local vendors — profiles, one-click applications and invitations, digital contracts, and payment all in one flow.',
    tags: ['Next.js', 'Marketplace', 'Payments'],
  },
  {
    name: 'YardLine',
    url: 'https://yard-line.vercel.app',
    image: '/images/sites/yard-line.webp',
    category: 'B2B · CRM',
    description:
      'Supply-side prospecting CRM for heavy-duty truck salvage yards around metro Atlanta. Access is roster-gated behind a magic link, so the public entry point is the sign-in screen.',
    tags: ['Next.js', 'CRM', 'Supabase'],
  },
  {
    name: 'YieldFlow',
    url: 'https://yield-flow-ashen.vercel.app',
    image: '/images/sites/yield-flow.webp',
    category: 'Fintech · Analytics',
    description:
      'Bank-bonus yield optimizer. Ranks cash-bonus offers by risk-adjusted, after-tax annualized yield so every capital-day is put to work on the most efficient offer.',
    tags: ['React', 'Fintech', 'Analytics'],
  },
  {
    name: 'Alpha-Kite',
    url: 'https://alpha-kite-max.vercel.app',
    image: '/images/sites/alpha-kite-max.webp',
    category: 'Trading · Ops',
    description:
      'Operations console for an automated QQQ trading system — live status, signals, orders, positions, P&L, risk checks, and a manual kill switch over a Supabase backend.',
    tags: ['Next.js', 'Trading', 'Supabase'],
  },
  {
    name: 'K-Alpha Dashboard',
    url: 'https://k-alpha-frontend.vercel.app',
    image: '/images/sites/k-alpha-frontend.webp',
    category: 'Trading · Real-time',
    description:
      'Real-time QQQ trading dashboard with live options chains, SMA/VWAP crossover detection, and technical-indicator overlays for intraday decision-making.',
    tags: ['Next.js', 'Trading', 'Real-time'],
  },
  {
    name: 'Southeast Precision Partners',
    url: 'https://southern-precision-partners.vercel.app',
    image: '/images/sites/southern-precision-partners.webp',
    category: 'M&A · Holdco',
    description:
      'Acquisition holdco site targeting founder-led, lower-middle-market companies in the I-85 and I-77 corridors, with a live buy-box and a deal-submission flow.',
    tags: ['Next.js', 'M&A', 'Search Fund'],
  },
  {
    name: 'Next Generation Capital',
    url: 'https://nextgen-capital-lp.vercel.app',
    image: '/images/sites/nextgen-capital-lp.webp',
    category: 'Real Estate · Investor Network',
    description:
      'Investor-network site for an Atlanta build-to-rent and cottage-community investment company. Relationship-first by design — it states the thesis and opens an introduction, rather than running a public offering.',
    tags: ['Next.js', 'Real Estate', 'Investor Relations'],
  },
  {
    name: 'LaceLuxx Financials',
    url: 'https://laceluxx-financials.vercel.app',
    image: '/images/sites/laceluxx-financials.webp',
    category: 'Fintech · Reporting',
    description:
      'Financial-reporting dashboard for the Lace Luxx resale boutique — P&L, balance sheet, cash flow, inventory velocity, and buying-strategy analytics in one view.',
    tags: ['React', 'Dashboards', 'Analytics'],
  },
  {
    name: 'Camelot',
    url: 'https://camelot-tau.vercel.app',
    image: '/images/sites/camelot.webp',
    category: 'Trading',
    description:
      'Options-strategy execution dashboard that turns SMA/VWAP crossovers into ATM-strike orders, with live performance, contract math, and feature flags.',
    tags: ['FastAPI', 'Options', 'Automation'],
  },
  {
    name: 'Maverick RSVP',
    url: 'https://maverick-rsvp-site.vercel.app',
    image: '/images/sites/maverick-rsvp-site.webp',
    category: 'Events',
    description:
      'A lightweight event-RSVP microsite — a single-page invite with instant yes/no responses and a note field for the host.',
    tags: ['React', 'Events'],
  },
  {
    name: 'Sprunki vs Monsters',
    url: 'https://sprunki-vs-monster.vercel.app',
    image: '/images/sites/sprunki-vs-monster.webp',
    category: 'Game',
    description:
      'A tiny browser arcade game — slip past patrolling monsters’ cones of sight and win rhythm “beat battles” to clear the arena.',
    tags: ['Canvas', 'Game'],
  },
];

export const getSite = (name: string): Site | undefined =>
  sites.find((s) => s.name === name);
