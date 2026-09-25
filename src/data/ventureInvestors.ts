// PRERENDER CONTRACT — scripts/prerender.js slices this file between
//   `export const ventureBackers: VentureBacker[] =`  and  `export const ventureBackerCount`
// and evaluates the slice as plain JavaScript. Inside the array literal:
//   no imports, no identifiers from other modules, no `as const`,
//   no enums / satisfies / type assertions, no template literals that
//   interpolate anything — plain string, number and boolean literals only.
// Helpers and anything clever go BELOW the `export const ventureBackerCount` sentinel.

/**
 * Venture and growth investors in the two venture-backed companies Michael
 * worked at, limited to firms that were on the cap table during his tenure:
 * GreenSky 2016-2018, Momnt 2023-2025 (dates from src/data/experience.ts).
 *
 * Every row is sourced from a public announcement, listed in `source`. Do not
 * add a firm here without one; a wrong investor name on a portfolio is worse
 * than a short list. Each firm also scrolls in the Venture capital logo strip,
 * linking out to `href`.
 */
export interface VentureBacker {
  name: string;
  href: string;
  /** The portfolio company this relationship came through. */
  company: 'GreenSky' | 'Momnt';
  /** When and how the firm invested, in one line. */
  context: string;
  /** Public source for the claim. */
  source: string;
  /** White-on-transparent mark under /images/logos (ships at 2x). */
  src: string;
  /** Rendered size in CSS px; required so the scrolling strip never reflows. */
  width: number;
  height: number;
}

export const ventureBackers: VentureBacker[] = [
  {
    name: "Saluda Grade",
    href: "https://www.saludagrade.com/",
    company: "Momnt",
    context:
      "Series A investor (2021) with a follow-on in 2023; bought Momnt-originated loans for the inaugural ~$125M securitization (Jan 2024).",
    source: "https://www.momnt.com/blog/momnt-and-saluda-grade-announce-close-of-inaugural-securitization",
    src: "/images/logos/saluda-grade.webp",
    width: 122,
    height: 36,
  },
  {
    name: "TruStage Ventures",
    href: "https://www.trustage.com/ventures",
    company: "Momnt",
    context: "Led Momnt's $15M round (Sep 2023); invested earlier as CMFG Ventures in the Series A.",
    source: "https://www.momnt.com/blog/momnt-announces-new-15-million-investment-continues-to-drive-fintech-innovation",
    src: "/images/logos/trustage-ventures.webp",
    width: 124,
    height: 26,
  },
  {
    name: "Rockefeller Asset Management",
    href: "https://www.rockco.com/",
    company: "Momnt",
    context: "New investor through a fund within the firm in Momnt's $15M round (Sep 2023).",
    source: "https://www.momnt.com/blog/momnt-announces-new-15-million-investment-continues-to-drive-fintech-innovation",
    src: "/images/logos/rockefeller.webp",
    width: 223,
    height: 32,
  },
  {
    name: "Yamaha Motor Ventures",
    href: "https://www.yamahamotor.vc/",
    company: "Momnt",
    context: "Existing investor participating in Momnt's $15M round (Sep 2023).",
    source: "https://www.momnt.com/blog/momnt-announces-new-15-million-investment-continues-to-drive-fintech-innovation",
    src: "/images/logos/yamaha-motor-ventures.webp",
    width: 170,
    height: 40,
  },
  {
    name: "Fintech Ventures Fund",
    href: "https://www.fintechv.com/",
    company: "Momnt",
    context: "Series A follow-on investor (2021).",
    source: "https://www.momnt.com/blog/momnt-closes-7-million-series-a-funding-round-led-by-saluda-grade",
    src: "/images/logos/fintech-ventures-fund.webp",
    width: 105,
    height: 42,
  },
  {
    name: "ICBA",
    href: "https://www.icba.org/",
    company: "Momnt",
    context: "Independent Community Bankers of America; Series A follow-on investor (2021).",
    source: "https://www.momnt.com/blog/momnt-closes-7-million-series-a-funding-round-led-by-saluda-grade",
    src: "/images/logos/icba.webp",
    width: 94,
    height: 24,
  },
  {
    name: "PIMCO",
    href: "https://www.pimco.com/",
    company: "GreenSky",
    context: "$200M equity investment (Dec 2017) at a ~$4.5B valuation, ahead of the 2018 IPO.",
    source: "https://www.ftpartners.com/transactions/greensky-pimco",
    src: "/images/logos/pimco.webp",
    width: 118,
    height: 22,
  },
  {
    name: "Fifth Third Bancorp",
    href: "https://www.53.com/",
    company: "GreenSky",
    context: "$50M investment and a $2B lending program (2016) at a $3.6B valuation.",
    source: "https://www.ftpartners.com/news/greensky-fifth-third-bank",
    src: "/images/logos/fifth-third.webp",
    width: 180,
    height: 24,
  },
  {
    name: "TPG",
    href: "https://www.tpg.com/",
    company: "GreenSky",
    context: "Earlier-round growth investor; on the cap table when I joined in 2016.",
    source: "https://en.wikipedia.org/wiki/GreenSky",
    src: "/images/logos/tpg.webp",
    width: 77,
    height: 32,
  },
  {
    name: "ICONIQ Capital",
    href: "https://www.iconiq.com/",
    company: "GreenSky",
    context: "Earlier-round growth investor; on the cap table when I joined in 2016.",
    source: "https://en.wikipedia.org/wiki/GreenSky",
    src: "/images/logos/iconiq.webp",
    width: 101,
    height: 24,
  },
  {
    name: "DST Global",
    href: "https://dst-global.com/",
    company: "GreenSky",
    context: "Earlier-round growth investor; on the cap table when I joined in 2016.",
    source: "https://en.wikipedia.org/wiki/GreenSky",
    src: "/images/logos/dst-global.webp",
    width: 60,
    height: 36,
  },
  {
    name: "Wellington Management",
    href: "https://www.wellington.com/",
    company: "GreenSky",
    context: "Earlier-round growth investor; on the cap table when I joined in 2016.",
    source: "https://en.wikipedia.org/wiki/GreenSky",
    src: "/images/logos/wellington.webp",
    width: 164,
    height: 34,
  },
  {
    name: "QED Investors",
    href: "https://www.qedinvestors.com/",
    company: "GreenSky",
    context: "Early venture investor; on the cap table when I joined in 2016.",
    source: "https://en.wikipedia.org/wiki/GreenSky",
    src: "/images/logos/qed.webp",
    width: 70,
    height: 36,
  },
];

export const ventureBackerCount = ventureBackers.length;

export const ventureCompanies = [
  { name: 'Momnt' as const, period: '2023-2025', note: 'Embedded lending; Series A and growth rounds, securitization and warehouse funding' },
  { name: 'GreenSky' as const, period: '2016-2018', note: 'Point-of-sale lending; late-stage growth equity through the May 2018 IPO' },
];
