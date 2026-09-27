import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ChevronDown, ExternalLink, Rocket, Star, Target, TrendingUp } from 'lucide-react';
import { transactions, transactionTotals } from '../data/transactions';
import { orgLogos, needsLabel, type OrgLogo } from '../data/orgLogos';
import { track } from '../utils/track';
import { useSectionView } from '../hooks/useSectionView';

// Folded in from the old Career Highlights section, which sat directly below
// this one and told the same story at four times the height.
const HIGHLIGHTS = [
  {
    title: 'Scaled Superior 0→1→10',
    company: 'Superior Contracting & Maintenance',
    description: 'Startup to enterprise: strategic frameworks and operating cadence across every function.',
    icon: Rocket,
  },
  {
    title: 'Secondary + 3 divestitures at HD Supply',
    company: 'HD Supply',
    description: 'Over $1.8B of divestitures: planning, execution, and post-close integration.',
    icon: TrendingUp,
  },
  {
    title: 'IPO at GreenSky',
    company: 'GreenSky',
    description: 'S-1 preparation and execution through delivery and market analysis.',
    icon: Star,
  },
  {
    title: 'Go-to-market 0→1 at Fyxed',
    company: 'Fyxed',
    description: 'Built the GTM from zero: market presence and first customers.',
    icon: Target,
  },
];

/**
 * An organisation's own mark at a fixed height, linked to its site. Marks come
 * from experience.ts, partners.ts and ventureInvestors.ts via orgLogos.ts.
 */
const OrgMark: React.FC<{ logo: OrgLogo; height: number; placement: string }> = ({ logo, height, placement }) => (
  <a
    href={logo.href}
    target="_blank"
    rel="noopener"
    title={logo.name}
    onClick={() => track('Transaction Logo Clicked', { company: logo.name, placement })}
    className="inline-flex flex-shrink-0 opacity-80 transition-opacity hover:opacity-100"
  >
    <img
      src={logo.src}
      alt={logo.name}
      width={Math.round((logo.width * height) / logo.height)}
      height={height}
      loading="lazy"
      decoding="async"
      style={{ height }}
      className="w-auto"
    />
  </a>
);

/**
 * Marks for a company or counterparty cell, else the plain name. Each img alt
 * carries its firm's name; the text is printed too where the mark alone would not
 * read as it (see needsLabel).
 */
const OrgCell: React.FC<{ name: string; placement: string }> = ({ name, placement }) => {
  const logos = orgLogos(name);
  if (!logos.length) return <>{name}</>;
  return (
    <span className="inline-flex flex-wrap items-center gap-x-3 gap-y-1">
      {logos.map((l) => (
        <OrgMark key={l.name} logo={l} height={16} placement={placement} />
      ))}
      {needsLabel(name) && <span>{name}</span>}
    </span>
  );
};

/**
 * Track record: highlights, the deal totals by instrument, and the full deal
 * table one click away. The three summary tiles that used to open this section
 * (total value, deal count, years) repeated the hero's stat row and are gone;
 * every figure here is still derived from src/data/transactions.ts.
 */
const Transactions: React.FC = () => {
  const [showDeals, setShowDeals] = useState(false);
  const ref = useSectionView<HTMLElement>('track_record');
  const totals = transactionTotals();
  const sourced = transactions.filter((t) => t.source).length;

  const toggleDeals = () => {
    if (!showDeals) track('Section Expanded', { section: 'track_record', item: 'deal_table' });
    setShowDeals((s) => !s);
  };

  return (
    <section ref={ref} id="transactions" className="section-padding scroll-mt-20" style={{ background: 'var(--bg)' }}>
      <div className="max-w-7xl mx-auto">
        <div className="mb-10">
          <h2 className="display text-4xl md:text-5xl text-white">
            Track <span className="accent">record</span>
          </h2>
          <p className="mt-3 text-lg text-white/60 max-w-2xl">
            {totals.count} named transactions totalling ${totals.totalM.toLocaleString()}M, split by track: corporate and
            private-equity finance, then venture-backed fintech.{' '}
            {sourced} link to the public filing or announcement.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          {HIGHLIGHTS.map((h) => (
            <div key={h.title} className="rilla-card p-5 flex gap-4">
              <div className="h-fit rounded-lg border border-accent/25 bg-accent/10 p-2.5">
                <h.icon className="w-5 h-5 text-accent" />
              </div>
              <div className="min-w-0">
                {orgLogos(h.company).map((l) => (
                  <div key={l.name} className="mb-2">
                    <OrgMark logo={l} height={20} placement="highlight" />
                  </div>
                ))}
                <h3 className="font-bold text-white">{h.title}</h3>
                <p className="mt-1 text-sm text-white/65">{h.description}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Derived from the table, never typed by hand (see transactionTotals). */}
        <div className="mt-4 grid gap-4 md:grid-cols-2">
          {totals.byTrack.map((t) => {
            const split = (asset: string) => t.rows.filter((r) => r.asset === asset).reduce((sum, r) => sum + r.value, 0);
            return (
              <div key={t.key} className="rilla-card p-5">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-white/55">{t.label}</p>
                <p className="mt-2 text-2xl font-bold text-accent">${t.value.toLocaleString()}M</p>
                <p className="text-xs text-white/50">
                  {t.count} transactions · equity ${split('Equity').toLocaleString()}M · debt ${split('Debt').toLocaleString()}M
                </p>
                <p className="mt-2 text-sm text-white/65">{t.blurb}</p>
              </div>
            );
          })}
        </div>

        <button
          type="button"
          onClick={toggleDeals}
          aria-expanded={showDeals}
          className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-accent hover:underline underline-offset-4"
        >
          {showDeals ? 'Hide' : 'See all'} {transactions.length} transactions
          <ChevronDown className={`w-4 h-4 transition-transform ${showDeals ? 'rotate-180' : ''}`} />
        </button>

        {showDeals && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25 }}
            className="mt-4 rilla-card overflow-hidden"
          >
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-white/[0.06] text-white/70">
                  <tr>
                    <th className="px-4 py-3 text-left font-semibold">Date</th>
                    <th className="px-4 py-3 text-left font-semibold">Value (MM)</th>
                    <th className="px-4 py-3 text-left font-semibold">Company</th>
                    <th className="px-4 py-3 text-left font-semibold">Asset</th>
                    <th className="px-4 py-3 text-left font-semibold">Type</th>
                    <th className="px-4 py-3 text-left font-semibold">Entity</th>
                    <th className="px-4 py-3 text-left font-semibold">Source</th>
                  </tr>
                </thead>
                {totals.byTrack.map((group) => (
                  <tbody key={group.key}>
                    <tr className="border-t border-white/10 bg-white/[0.03]">
                      <th colSpan={7} scope="rowgroup" className="px-4 py-2.5 text-left text-xs font-semibold uppercase tracking-[0.15em] text-white/70">
                        {group.label}
                        <span className="mt-1 block normal-case tracking-normal text-accent sm:ml-3 sm:mt-0 sm:inline">
                          {group.count} deals · ${group.value.toLocaleString()}M
                        </span>
                      </th>
                    </tr>
                    {group.rows.map((t) => (
                      <tr key={`${t.date}-${t.company}-${t.type}`} className="border-t border-white/10">
                        <td className="px-4 py-3 font-medium text-white whitespace-nowrap">{t.date}</td>
                        <td className="px-4 py-3 font-bold text-accent">${t.value.toLocaleString()}</td>
                        <td className="px-4 py-3 text-white/70 whitespace-nowrap">
                          <OrgCell name={t.company} placement="table_company" />
                        </td>
                        <td className="px-4 py-3">
                          <span
                            className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              t.asset === 'Equity'
                                ? 'border border-emerald-400/30 bg-emerald-400/10 text-emerald-300'
                                : 'border border-sky-400/30 bg-sky-400/10 text-sky-300'
                            }`}
                          >
                            {t.asset}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-white/70">{t.type}</td>
                        <td className="px-4 py-3 text-white/70">
                          <OrgCell name={t.entity} placement="table_entity" />
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap">
                          {t.source ? (
                            <a
                              href={t.source.url}
                              target="_blank"
                              rel="noopener"
                              title={t.source.title}
                              onClick={() =>
                                track('Transaction Source Clicked', {
                                  company: t.company,
                                  type: t.type,
                                  track: t.track,
                                  publisher: t.source?.publisher ?? '',
                                })
                              }
                              className="inline-flex items-center gap-1 text-accent hover:underline underline-offset-4"
                            >
                              {t.source.publisher}
                              <ExternalLink className="w-3.5 h-3.5" aria-hidden="true" />
                            </a>
                          ) : (
                            <span className="text-white/40" title="Not announced at the deal level">
                              First-hand
                            </span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                ))}
              </table>
            </div>
          </motion.div>
        )}
      </div>
    </section>
  );
};

export default Transactions;
