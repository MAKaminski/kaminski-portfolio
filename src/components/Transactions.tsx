import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ChevronDown, Rocket, Star, Target, TrendingUp } from 'lucide-react';
import { transactions, transactionTotals } from '../data/transactions';
import { track } from '../utils/track';
import { useSectionView } from '../hooks/useSectionView';

// Folded in from the old Career Highlights section, which sat directly below
// this one and told the same story at four times the height.
const HIGHLIGHTS = [
  {
    title: 'Scaled Superior 0→1→10',
    description: 'Startup to enterprise: strategic frameworks and operating cadence across every function.',
    icon: Rocket,
  },
  {
    title: 'Secondary + 3 divestitures at HD Supply',
    description: 'Over $1.8B of divestitures: planning, execution, and post-close integration.',
    icon: TrendingUp,
  },
  {
    title: 'IPO at GreenSky',
    description: 'S-1 preparation and execution through delivery and market analysis.',
    icon: Star,
  },
  {
    title: 'Go-to-market 0→1 at Fyxed',
    description: 'Built the GTM from zero: market presence and first customers.',
    icon: Target,
  },
];

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
            {totals.count} named transactions totalling ${totals.totalM.toLocaleString()}M across equity and debt.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          {HIGHLIGHTS.map((h) => (
            <div key={h.title} className="rilla-card p-5 flex gap-4">
              <div className="h-fit rounded-lg border border-accent/25 bg-accent/10 p-2.5">
                <h.icon className="w-5 h-5 text-accent" />
              </div>
              <div>
                <h3 className="font-bold text-white">{h.title}</h3>
                <p className="mt-1 text-sm text-white/65">{h.description}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Derived from the table, never typed by hand (see transactionTotals). */}
        <div className="mt-4 grid grid-cols-2 gap-4">
          {Object.entries(totals.byAsset).map(([type, summary]) => (
            <div key={type} className="rilla-card p-4">
              <p className="text-sm text-white/60">{type}</p>
              <p className="text-xl font-bold text-accent">${summary.value.toLocaleString()}M</p>
              <p className="text-xs text-white/50">{summary.count} transactions</p>
            </div>
          ))}
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
                  </tr>
                </thead>
                <tbody>
                  {transactions.map((t, index) => (
                    <tr key={index} className="border-t border-white/10">
                      <td className="px-4 py-3 font-medium text-white whitespace-nowrap">{t.date}</td>
                      <td className="px-4 py-3 font-bold text-accent">${t.value.toLocaleString()}</td>
                      <td className="px-4 py-3 text-white/70">{t.company}</td>
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
                      <td className="px-4 py-3 text-white/70">{t.entity}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>
        )}
      </div>
    </section>
  );
};

export default Transactions;
