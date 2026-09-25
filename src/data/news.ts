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
}

export const news: NewsItem[] = [
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
