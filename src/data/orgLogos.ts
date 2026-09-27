import { jobTimeline } from './experience';
import { partners } from './partners';
import { ventureBackers } from './ventureInvestors';

/**
 * One lookup over every organisation mark the site already ships: employers
 * (experience.ts), PE partners (partners.ts) and venture investors
 * (ventureInvestors.ts). No new assets; each mark links where its source does.
 */
export interface OrgLogo {
  name: string;
  href: string;
  src: string;
  width: number;
  height: number;
}

const byName = new Map<string, OrgLogo>();
for (const j of jobTimeline) {
  if (j.logo && j.link) byName.set(j.company, { name: j.company, href: j.link, ...j.logo });
}
for (const p of [...partners, ...ventureBackers]) {
  byName.set(p.name, { name: p.name, href: p.href, src: p.src, width: p.width, height: p.height });
}

// Counterparty strings in transactions.ts name more than one firm, or name a
// firm with a qualifier; these resolve them to the marks above.
const aliases: Record<string, string[]> = {
  'Bain, Carlyle, Clayton Dubilier & Rice': ['Bain Capital', 'The Carlyle Group', 'Clayton, Dubilier & Rice'],
  'The Home Depot (Crown Bolt)': ['Home Depot'],
};

/** Every mark a name resolves to; empty when the site has none for it. */
export const orgLogos = (name: string): OrgLogo[] =>
  (aliases[name] ?? [name]).map((n) => byName.get(n)).filter((l): l is OrgLogo => Boolean(l));

// Marks that do not read as the firm's name at table size: a square icon, or an
// emblem whose name is set too small to survive being scaled down.
const iconLike = (l: OrgLogo) => l.width / l.height < 2 || l.name === 'Saluda Grade';

/**
 * Whether a cell should print the name beside its marks: when a mark is not a
 * legible wordmark, or when an alias dropped a qualifier the name carries
 * ("The Home Depot (Crown Bolt)").
 */
export const needsLabel = (name: string): boolean =>
  aliases[name]?.length === 1 || orgLogos(name).some(iconLike);
