/**
 * Career history, shared by the Experience list and the Gantt rail that runs
 * down its left-hand side (components/ExperienceTimeline).
 *
 * `period` stays the human-facing string; `start`/`end` are the machine-usable
 * years the chart lays out against. `end: null` means "Present".
 */

export interface Job {
  company: string;
  title: string;
  period: string;
  start: number;
  /** Exclusive-ish end year; null = ongoing. */
  end: number | null;
  description: string;
  link?: string;
  exit: string;
  /** Tailwind-independent hex so the chart, dots, and legend always agree. */
  color: string;
}

/**
 * Distinct hues chosen to stay legible on the near-black canvas and to remain
 * separable for the most common colour-vision deficiencies (no red/green pair
 * carries meaning on its own — position and label always do the real work).
 */
export const jobTimeline: Job[] = [
  {
    company: 'Stellantis Financial Services',
    title: 'Senior Product Owner',
    period: '2025 - Present',
    start: 2025,
    end: null,
    description:
      "Product ownership for consumer auto-finance platforms — servicing, payments, and lending systems at Stellantis' captive finance arm.",
    link: 'https://www.stellantis-fs.com/',
    exit: 'Current role',
    color: '#fff500',
  },
  {
    company: 'Fyxed',
    title: 'Interim CEO',
    period: '2025 - 2025',
    start: 2025,
    end: 2025,
    description:
      'Interim CEO of Fyxed, a fintech company that provides a platform for small businesses to manage their finances.',
    link: 'https://www.fyxed.com/',
    exit: 'Established GTM strategy, built product, hired team, and scaled to $50k MRR',
    color: '#f472b6',
  },
  {
    company: 'Momnt',
    title: 'Senior Manager, Product Engineering',
    period: '2023 - 2025',
    start: 2023,
    end: 2025,
    description: 'Fintech platform development and credit reporting systems',
    link: 'https://www.momnt.com/',
    exit: 'Launched credit reporting, accounting engine product owner, departed after founders left - culture change',
    color: '#38bdf8',
  },
  {
    company: 'Property Walk',
    title: 'Founder',
    period: '2022 - 2023',
    start: 2022,
    end: 2023,
    description:
      'Founder of Property Walk, a real estate technology company that provides a platform for property managers to reduce service calls and overbillings of residential home services.',
    exit: '5k MRR, PMF not found',
    color: '#c084fc',
  },
  {
    company: 'Superior Contracting & Maintenance',
    title: 'Co-Founder',
    period: '2018 - 2023',
    start: 2018,
    end: 2023,
    description:
      'Co-founder of Superior Contracting & Maintenance, a construction company that provides services to the residential and commercial sectors.',
    link: 'https://www.superior-maintenance.com',
    exit: 'Installed CEO & NetSuite ERP, left to focus on high-growth fintech',
    color: '#fb923c',
  },
  {
    company: 'GreenSky',
    title: 'Product Manager, Credit & Strategy',
    period: '2016 - 2018',
    start: 2016,
    end: 2018,
    description: 'Product management and strategy for the GreenSky credit platform',
    link: 'https://www.greensky.com/',
    exit: 'Post IPO, left to found Residential Services company with brother',
    color: '#4ade80',
  },
  {
    company: 'HD Supply',
    title: 'Senior Analyst, Strategic Finance',
    period: '2015 - 2016',
    start: 2015,
    end: 2016,
    description: 'Divestiture transactions and operational transformation',
    link: 'https://www.hdsupply.com/',
    exit: 'Post 2,500 FTE restructuring, changed focus to grow revenue, rather than enhance margins through OpEx cost out',
    color: '#facc15',
  },
  {
    company: 'KPMG',
    title: 'Senior Consultant, Advisory Services',
    period: '2014 - 2015',
    start: 2014,
    end: 2015,
    description: 'Dispute advisory services, tax structuring, & data analytics',
    link: 'https://www.kpmg.com/',
    exit: 'Found wife in consulting, left for M&A work @ HD Supply',
    color: '#818cf8',
  },
  {
    company: 'ModularEquity / MEK Capital',
    title: 'Founder, Managing Partner',
    period: '2011 - 2025',
    start: 2011,
    end: 2025,
    description:
      'Long-Only diversified investments across PE, Real Estate, Equities, & Debt, managing $3mm in capital',
    link: 'https://www.modularequity.com/',
    exit: 'Active Management',
    color: '#2dd4bf',
  },
  {
    company: 'Home Depot',
    title: 'Senior Analyst, Merchandising Finance & Treasury',
    period: '2011 - 2014',
    start: 2011,
    end: 2014,
    description: 'Share repurchase programs and financial strategy',
    link: 'https://www.homedepot.com/',
    exit: 'Departed to obtian diversified experiences within other companies/industries',
    color: '#f87171',
  },
];

/** Year the chart's axis starts at. */
export const timelineStart = Math.min(...jobTimeline.map((j) => j.start));

/**
 * Year the axis ends at. Ongoing roles extend to the current year, so the
 * "Present" bar keeps growing without anyone editing this file.
 */
export const timelineEnd = Math.max(
  ...jobTimeline.map((j) => j.end ?? new Date().getFullYear()),
  new Date().getFullYear()
);

/**
 * Shortest span, in years, that a bar is allowed to render as. A role held
 * inside a single calendar year (Fyxed, 2025-2025) would otherwise compute to
 * zero height and vanish.
 */
export const MIN_SPAN_YEARS = 0.35;

/**
 * The interval a job's bar actually *occupies on screen*, which is not always
 * the interval it was held for: a floored short role visually extends past its
 * own start. Lane assignment has to reason about the rendered interval or two
 * bars that merely touch in date terms will still collide as pixels.
 */
export function renderedSpan(job: Job): { from: number; to: number } {
  const to = job.end ?? timelineEnd;
  return { from: Math.min(job.start, to - MIN_SPAN_YEARS), to };
}

/**
 * Interval-partitioning: give every job the leftmost column that nothing
 * already in it overlaps. Concurrent roles therefore sit side by side instead
 * of stacking on top of each other, and the column count is the maximum number
 * of roles ever held at once.
 */
export function assignLanes(jobs: Job[]): { laneOf: Map<string, number>; laneCount: number } {
  const endOfLane: number[] = [];
  const laneOf = new Map<string, number>();
  const ordered = [...jobs].sort((a, b) => a.start - b.start || a.company.localeCompare(b.company));

  ordered.forEach((job) => {
    const { from, to } = renderedSpan(job);
    let lane = endOfLane.findIndex((end) => end <= from);
    if (lane === -1) {
      lane = endOfLane.length;
      endOfLane.push(to);
    } else {
      endOfLane[lane] = to;
    }
    laneOf.set(job.company, lane);
  });

  return { laneOf, laneCount: Math.max(endOfLane.length, 1) };
}
