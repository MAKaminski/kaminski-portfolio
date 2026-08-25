// PRERENDER CONTRACT — scripts/prerender.js slices this file between
//   `export const jobTimeline: Job[] =`  and  `export const getJob`
// and evaluates the slice as plain JavaScript. Inside the array literal:
//   no imports, no identifiers from other modules, no `as const`,
//   no enums / satisfies / type assertions, no template literals that
//   interpolate anything — plain string, number, boolean, array and
//   object literals only.
// Helpers and anything clever go BELOW the `export const getJob` sentinel.

export type Job = {
  company: string;
  title: string;
  /** Display range, e.g. "2023 - 2025". */
  period: string;
  description: string;
  /** Optional: not every past venture still has a live site. */
  link?: string;
  /** How the chapter ended, or "Current role". */
  exit: string;
};

export const jobTimeline: Job[] = [
  {
    company: "Stellantis Financial Services",
    title: "Senior Product Owner",
    period: "2025 - Present",
    description: "Product ownership for consumer auto-finance platforms — servicing, payments, and lending systems. The AI agent work sits inside this role: agentic workflow design, custom MCP servers, eval harnesses, and human approval gates on irreversible actions, taken from prototype through security, legal, and compliance review into production.",
    link: "https://www.stellantis-fs.com/",
    exit: "Current role"
  },
  {
    company: "Fyxed",
    title: "Interim CEO",
    period: "2025 - 2025",
    description: "Interim CEO of Fyxed, a fintech company that provides a platform for small businesses to manage their finances.",
    link: "https://www.fyxed.com/",
    exit: "Established GTM strategy, built product, hired team, and scaled to $50k MRR"
  },
  {
    company: "Momnt",
    title: "Senior Manager, Product Engineering",
    period: "2023 - 2025",
    description: "Fintech platform development and credit reporting systems",
    link: "https://www.momnt.com/",
    exit: "Launched credit reporting, accounting engine product owner, departed after founders left - culture change"
  },
  {
    company: "Property Walk",
    title: "Founder",
    period: "2022 - 2023",
    description: "Founder of Property Walk, a real estate technology company that provides a platform for property managers to reduce service calls and overbillings of residential home services.",
    exit: "5k MRR, PMF not found"
  },
  {
    company: "Superior Contracting & Maintenance",
    title: "Co-Founder",
    period: "2018 - 2023",
    description: "Co-founder of Superior Contracting & Maintenance, a construction company that provides services to the residential and commercial sectors.",
    link: "https://www.superior-maintenance.com",
    exit: "Installed CEO & NetSuite ERP, left to focus on high-growth fintech"
  },
  {
    company: "GreenSky",
    title: "Product Manager, Credit & Strategy",
    period: "2016 - 2018",
    description: "Product management and strategy for the GreenSky credit platform",
    link: "https://www.greensky.com/",
    exit: "Post IPO, left to found Residential Services company with brother"
  },
  {
    company: "HD Supply",
    title: "Senior Analyst, Strategic Finance",
    period: "2015 - 2016",
    description: "Divestiture transactions and operational transformation",
    link: "https://www.hdsupply.com/",
    exit: "Post 2,500 FTE restructuring, changed focus to grow revenue, rather than enhance margins through OpEx cost out"
  },
  {
    company: "KPMG",
    title: "Senior Consultant, Advisory Services",
    period: "2014 - 2015",
    description: "Dispute advisory services, tax structuring, & data analytics",
    link: "https://www.kpmg.com/",
    exit: "Found wife in consulting, left for M&A work @ HD Supply"
  },
  {
    company: "ModularEquity / MEK Capital",
    title: "Founder, Managing Partner",
    period: "2011 - 2025",
    description: "Long-Only diversified investments across PE, Real Estate, Equities, & Debt, managing $3mm in capital",
    link: "https://www.modularequity.com/",
    exit: "Active Management"
  },
  {
    company: "Home Depot",
    title: "Senior Analyst, Merchandising Finance & Treasury",
    period: "2011 - 2014",
    description: "Share repurchase programs and financial strategy",
    link: "https://www.homedepot.com/",
    exit: "Departed to obtian diversified experiences within other companies/industries"
  }
];

export const getJob = (company: string): Job | undefined =>
  jobTimeline.find((j) => j.company === company);
