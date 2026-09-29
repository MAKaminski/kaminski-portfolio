// PRERENDER CONTRACT — scripts/prerender.js slices this file between
//   `export const news: NewsItem[] =`  and  `export const latestNews`
// and evaluates the slice as plain JavaScript. Inside the array literal:
//   no imports, no identifiers from other modules, no `as const`,
//   no enums / satisfies / type assertions, no template literals that
//   interpolate anything — plain string and number literals only.
// Helpers and anything clever go BELOW the `export const latestNews` sentinel.

/**
 * What's new: the announcement banner at the top of the hero (Hero.tsx) and the
 * story section right under it (NewsStory.tsx) both read the first entry, and the
 * prerendered home page carries the same copy. Newest first.
 */
export interface NewsItem {
  /** In-page anchor for the story section, and the analytics key. */
  id: string;
  /** ISO date the news happened. */
  date: string;
  /** Short kicker on the banner pill. */
  tag: string;
  /** One line for the hero banner. */
  banner: string;
  headline: string;
  dek: string;
  points: { title: string; body: string }[];
  /** Optional chart or cover shown beside the story. Linked to the first link. */
  image?: { src: string; alt: string; width: number; height: number; mobileSrc?: string };
  /** Optional calls to action under the points; the first is the primary button. */
  links?: { label: string; href: string }[];
}

export const news: NewsItem[] = [
  {
    id: "cache-aware-routing",
    date: "2026-09-28",
    tag: "New",
    banner: "Paper: prompt caching erases most LLM routing savings",
    headline: "When caching meets routing",
    dek: "Routing easy turns to a cheaper model is reported to cut LLM cost 35 to 98%. Those numbers come from single-turn benchmarks priced at list rates. In a multi-turn voice agent with prompt caching, per-turn routing from Opus 5.5 to Haiku 4.5 saves 9.2%, not 51.3%.",
    points: [
      {
        title: "Cache first, route second",
        body: "Caching alone cut frontier-only cost 78.8%, from $0.3865 to $0.0819 per conversation. Any routing case should be measured against that, not list prices.",
      },
      {
        title: "A cheaper model can cost more",
        body: "Sonnet 5.5 reads its cache at the same $0.20/MTok as Opus 5.5, so routing to it raises cost 15.5% once the forced cache re-writes are counted.",
      },
      {
        title: "Route at the granularity of the cache",
        body: "Caches are per model. A whole conversation on Haiku 4.5 costs 70.0% less; per-turn switching pays to re-write the transcript every time it comes back.",
      },
    ],
    image: {
      src: "/images/papers/fig-routing-savings.png",
      mobileSrc: "/images/papers/fig-routing-savings-mobile.png",
      alt: "Two panels of savings versus hard-turn share. The list-price estimate sits between 26% and 61% for Haiku 4.5 and 16% and 40% for Sonnet 5.5; the cache-aware simulation runs from 18% down to -5% for Haiku and stays below zero for Sonnet.",
      width: 1440,
      height: 544,
    },
    links: [
      { label: "Read the paper (PDF, 6 pages)", href: "/docs/papers/when-caching-meets-routing.pdf" },
      { label: "Download the model", href: "/docs/papers/when-caching-meets-routing-source.zip" },
      { label: "All papers", href: "/papers" },
    ],
  },
  {
    id: "jev",
    date: "2026-09-15",
    tag: "New",
    banner: "Jev, TypeSafe's new probability model, now gates my agents",
    headline: "Jev is live in my agent stack",
    dek: "TypeSafe released Jev on September 15, 2026: a transformer with a classifier on top, so it answers with a probability instead of prose. I put it in front of agent tool calls as the gate that decides whether an action goes ahead.",
    points: [
      {
        title: "A typed answer in one pass",
        body: "A choice from a fixed set, a score, or a yes/no, each with a calibrated probability. No second call to check the first.",
      },
      {
        title: "No prose to parse",
        body: "The agent never asks an LLM to write the word \"approve\" and hopes the parser catches it. The decision is the output.",
      },
      {
        title: "The probability sets the route",
        body: "Confident calls proceed, uncertain ones go to a human approval gate, and the score lands in the evidence trail either way.",
      },
    ],
  },
];

export const latestNews: NewsItem = news[0];

/** "Sep 15, 2026", parsed as a calendar date so no timezone shifts the day. */
export const formatNewsDate = (iso: string): string => {
  const [y, m, d] = iso.split('-').map(Number);
  return new Date(Date.UTC(y, m - 1, d)).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    timeZone: 'UTC',
  });
};
