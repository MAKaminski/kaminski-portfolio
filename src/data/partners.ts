// PRERENDER CONTRACT — scripts/prerender.js slices this file between
//   `export const partners: Partner[] =`  and  `export const partnerCount`
// and evaluates the slice as plain JavaScript. Inside the array literal:
//   no imports, no identifiers from other modules, no `as const`,
//   no enums / satisfies / type assertions, no template literals that
//   interpolate anything — plain string and number literals only.
// Helpers and anything clever go BELOW the `export const partnerCount` sentinel.

/**
 * Private-equity sponsors whose portfolio companies Michael has operated inside
 * or reported to. Kept as data so the home page marquee (Partners.tsx) and the
 * prerendered HTML (scripts/prerender.js) list the same firms with the same links.
 */
export interface Partner {
  name: string;
  /** Firm site the mark links out to. */
  href: string;
  /** White-on-transparent mark under /images/logos (ships at 2x), from the firm's own artwork. */
  src: string;
  width: number;
  height: number;
  /** Where the relationship came from, in one line. */
  context: string;
}

export const partners: Partner[] = [
  {
    name: "The Carlyle Group",
    href: "https://www.carlyle.com/",
    src: "/images/logos/carlyle.webp",
    width: 173,
    height: 24,
    context: "HD Supply sponsor group — $1.8B divestiture program and $500M CapEx portfolio analytics",
  },
  {
    name: "Clayton, Dubilier & Rice",
    href: "https://www.cdr-inc.com/",
    src: "/images/logos/cdr.webp",
    width: 93,
    height: 24,
    context: "HD Supply sponsor group — board-level reporting on strategic finance and divestitures",
  },
  {
    name: "Bain Capital",
    href: "https://www.baincapital.com/",
    src: "/images/logos/bain-capital.webp",
    width: 144,
    height: 24,
    context: "HD Supply sponsor group — value-creation and operational transformation work",
  },
];

export const partnerCount = partners.length;
