// PRERENDER CONTRACT — scripts/prerender.js slices this file between
//   `export const transactions: Transaction[] =`  and  `export const transactionTotals`
// and evaluates the slice as plain JavaScript. Inside the array literal:
//   no imports, no identifiers from other modules, no `as const`,
//   no enums / satisfies / type assertions, no template literals that
//   interpolate anything — plain string, number, boolean, array and
//   object literals only.
// Helpers and anything clever go BELOW the `export const transactionTotals` sentinel.

export type Transaction = {
  /** Human month-year the deal closed, e.g. "Jun 2024". */
  date: string;
  /** Deal size in USD millions. */
  value: number;
  company: string;
  /** "Debt" | "Equity" — the instrument class. */
  asset: string;
  /** Instrument detail, e.g. "144(a)", "S1", "Share Repurchase". */
  type: string;
  /** Counterparty. */
  entity: string;
};

export const transactions: Transaction[] = [
  {
    date: "Jun 2024",
    value: 400,
    company: "Momnt",
    asset: "Debt",
    type: "144(a)",
    entity: "Saluda Grade"
  },
  {
    date: "Sep 2023",
    value: 15,
    company: "Momnt",
    asset: "Equity",
    type: "Series B",
    entity: "TruStage Ventures"
  },
  {
    date: "May 2018",
    value: 1010,
    company: "GreenSky",
    asset: "Equity",
    type: "S1",
    entity: "Public Markets"
  },
  {
    date: "Dec 2017",
    value: 200,
    company: "GreenSky",
    asset: "Debt",
    type: "Debt Facility",
    entity: "PIMCO"
  },
  {
    date: "Apr 2016",
    value: 1000,
    company: "HD Supply",
    asset: "Debt",
    type: "Senior Unsecured",
    entity: "Public Markets"
  },
  {
    date: "Feb 2015",
    value: 825,
    company: "HD Supply",
    asset: "Equity",
    type: "Divestiture",
    entity: "Power Solutions"
  },
  {
    date: "Apr 2014",
    value: 90,
    company: "HD Supply",
    asset: "Equity",
    type: "Divestiture",
    entity: "Crown Bolt"
  },
  {
    date: "Apr 2014",
    value: 957,
    company: "HD Supply",
    asset: "Equity",
    type: "Secondary",
    entity: "Bain, Carlyle, Dublier & Rice"
  },
  {
    date: "May 2012",
    value: 4000,
    company: "Home Depot",
    asset: "Equity",
    type: "Share Repurchase",
    entity: "Goldman"
  },
  {
    date: "Oct 2011",
    value: 700,
    company: "Home Depot",
    asset: "Debt",
    type: "Line of Credit",
    entity: "Citi"
  },
  {
    date: "Sep 2011",
    value: 2000,
    company: "Home Depot",
    asset: "Debt",
    type: "Senior Unsecured",
    entity: "Public Markets"
  }
];

/**
 * Every total on the site derives from the array above.
 *
 * This exists because three different numbers used to describe the same table:
 * the computed sum ($11,197M), a hand-typed set of summary tiles that had not
 * been updated when the Momnt 144(a) was added (claiming 14 deals / $12,722M,
 * double-counting IPO and divestitures inside Equity and Debt), and a
 * "$10.8B+" headline figure in the hero that matched neither. Deriving them
 * makes that class of drift impossible.
 */
export const transactionTotals = () => {
  const totalM = transactions.reduce((sum, t) => sum + t.value, 0);
  const byAsset = transactions.reduce<Record<string, { count: number; value: number }>>(
    (acc, t) => {
      const bucket = acc[t.asset] || { count: 0, value: 0 };
      acc[t.asset] = { count: bucket.count + 1, value: bucket.value + t.value };
      return acc;
    },
    {}
  );
  return {
    count: transactions.length,
    totalM,
    /**
     * "$11.1B+" — the one headline figure. Floored, not rounded: the table
     * sums to $11,197M, so "$11.1B+" is true and "$11.2B+" would overstate it
     * by $3M. With a "+" suffix, flooring is the only honest direction.
     */
    headline: `$${(Math.floor(totalM / 100) / 10).toFixed(1)}B+`,
    byAsset,
  };
};
