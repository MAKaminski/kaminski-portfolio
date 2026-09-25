// PRERENDER CONTRACT — scripts/prerender.js slices this file between
//   `export const transactions: Transaction[] =`  and  `export const transactionTotals`
// and evaluates the slice as plain JavaScript. Inside the array literal:
//   no imports, no identifiers from other modules, no `as const`,
//   no enums / satisfies / type assertions, no template literals that
//   interpolate anything — plain string, number, boolean, array and
//   object literals only.
// Helpers and anything clever go BELOW the `export const transactionTotals` sentinel.

export type TransactionSource = {
  /** Public page that documents the deal: filing, press release or trade press. */
  url: string;
  /** Who published it, shown as the link text. */
  publisher: string;
  /** Headline of the source page. */
  title: string;
};

export type Transaction = {
  /** Human month-year the deal closed or was announced, e.g. "Jan 2024". */
  date: string;
  /** Deal size in USD millions. */
  value: number;
  company: string;
  /** "Debt" | "Equity" — the instrument class. */
  asset: string;
  /** Instrument detail, e.g. "IPO", "Senior Unsecured", "Share Repurchase". */
  type: string;
  /** Counterparty. */
  entity: string;
  /**
   * Which half of the finance career the deal belongs to, matching the
   * private-equity / venture-capital split in the Partners section:
   *   "corporate" — The Home Depot and PE-backed HD Supply
   *   "venture"   — venture-backed fintech: GreenSky and Momnt
   */
  track: "corporate" | "venture";
  /**
   * Public source for every figure in the row. Rows without one are first-hand
   * work that was never announced at the deal level: they stay in the table,
   * render without a link, and are left out of structured data and llms.txt.
   */
  source?: TransactionSource;
};

export const transactions: Transaction[] = [
  {
    date: "Jan 2024",
    value: 125,
    company: "Momnt",
    asset: "Debt",
    type: "144(a) Securitization",
    track: "venture",
    entity: "Saluda Grade",
    source: {
      url: "https://www.businesswire.com/news/home/20240109071454/en/Momnt-and-Saluda-Grade-Announce-Close-of-Inaugural-Securitization",
      publisher: "Business Wire",
      title: "Momnt and Saluda Grade Announce Close of Inaugural Securitization"
    }
  },
  {
    date: "Sep 2023",
    value: 15,
    company: "Momnt",
    asset: "Equity",
    type: "Series A Extension",
    track: "venture",
    entity: "TruStage Ventures",
    source: {
      url: "https://www.momnt.com/blog/momnt-announces-new-15-million-investment-continues-to-drive-fintech-innovation",
      publisher: "Momnt",
      title: "Momnt Announces New $15 Million Investment"
    }
  },
  {
    date: "May 2018",
    value: 1010,
    company: "GreenSky",
    asset: "Equity",
    type: "IPO",
    track: "venture",
    entity: "Public Markets",
    source: {
      url: "https://www.sec.gov/Archives/edgar/data/0001712923/000093041318001935/c88906_ex99-1.htm",
      publisher: "SEC EDGAR",
      title: "GreenSky, Inc. closes initial public offering (Form 8-K, Exhibit 99.1)"
    }
  },
  {
    date: "Dec 2017",
    value: 200,
    company: "GreenSky",
    asset: "Equity",
    type: "Growth Equity",
    track: "venture",
    entity: "PIMCO",
    source: {
      url: "https://www.ftpartners.com/transactions/greensky-pimco",
      publisher: "FT Partners",
      title: "GreenSky's $200 million investment from PIMCO"
    }
  },
  {
    date: "Apr 2016",
    value: 1000,
    company: "HD Supply",
    asset: "Debt",
    type: "Senior Unsecured",
    track: "corporate",
    entity: "Public Markets",
    source: {
      url: "https://globenewswire.com/news-release/2016/03/28/823369/0/en/HD-Supply-Inc-Announces-Pricing-of-Senior-Notes-Offering.html",
      publisher: "GlobeNewswire",
      title: "HD Supply, Inc. Announces Pricing of Senior Notes Offering"
    }
  },
  {
    date: "Oct 2015",
    value: 825,
    company: "HD Supply",
    asset: "Equity",
    type: "Divestiture",
    track: "corporate",
    entity: "Anixter (Power Solutions)",
    source: {
      url: "https://www.inddist.com/home/news/13768593/anixter-to-buy-hd-supplys-power-unit-for-825-million",
      publisher: "Industrial Distribution",
      title: "Anixter to Buy HD Supply's Power Unit for $825 Million"
    }
  },
  {
    date: "Dec 2014",
    value: 90,
    company: "HD Supply",
    asset: "Equity",
    type: "Divestiture",
    track: "corporate",
    entity: "The Home Depot (Crown Bolt)"
  },
  {
    date: "Apr 2014",
    value: 957,
    company: "HD Supply",
    asset: "Equity",
    type: "Secondary",
    track: "corporate",
    entity: "Bain, Carlyle, Clayton Dubilier & Rice"
  },
  {
    date: "May 2012",
    value: 4000,
    company: "Home Depot",
    asset: "Equity",
    type: "Share Repurchase",
    track: "corporate",
    entity: "Goldman"
  },
  {
    date: "Oct 2011",
    value: 700,
    company: "Home Depot",
    asset: "Debt",
    type: "Line of Credit",
    track: "corporate",
    entity: "Citi"
  },
  {
    date: "Mar 2011",
    value: 2000,
    company: "Home Depot",
    asset: "Debt",
    type: "Senior Unsecured",
    track: "corporate",
    entity: "Public Markets",
    source: {
      url: "https://ir.homedepot.com/news-releases/2011/03-28-2011",
      publisher: "The Home Depot",
      title: "The Home Depot Announces Pricing of $2 Billion Senior Notes Offering"
    }
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
 *
 * 2026-09-25: rows were checked against the public record and corrected where
 * they disagreed (Momnt securitization $400M -> $125M and Jun -> Jan 2024;
 * PIMCO was equity, not a debt facility; the Anixter and Crown Bolt closes
 * and the 2011 notes re-dated). The sum moved from $11,197M to $10,922M.
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
  const byTrack = TRACKS.map((t) => {
    const rows = transactions.filter((r) => r.track === t.key);
    return { ...t, rows, count: rows.length, value: rows.reduce((sum, r) => sum + r.value, 0) };
  });
  return {
    count: transactions.length,
    totalM,
    /**
     * "$10.9B+" — the one headline figure. Floored, not rounded: the table
     * sums to $10,922M, so "$10.9B+" is true and "$11.0B+" would overstate it
     * by $78M. With a "+" suffix, flooring is the only honest direction.
     */
    headline: `$${(Math.floor(totalM / 100) / 10).toFixed(1)}B+`,
    byAsset,
    byTrack,
  };
};

/** Display order and copy for the two tracks; `key` matches Transaction.track. */
export const TRACKS = [
  {
    key: 'corporate' as const,
    label: 'Corporate & private equity',
    blurb: 'Capital markets and corporate development at The Home Depot and PE-backed HD Supply.',
  },
  {
    key: 'venture' as const,
    label: 'Venture-backed fintech',
    blurb: 'Growth equity, an IPO and securitization at GreenSky and Momnt.',
  },
];
