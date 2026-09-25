import React from 'react';
import Marquee from './Marquee';
import { partners } from '../data/partners';
import { useSectionView } from '../hooks/useSectionView';
import { ventureBackers, ventureCompanies } from '../data/ventureInvestors';
import { track } from '../utils/track';

/**
 * Private-equity partner experience: the sponsors whose portfolio companies
 * Michael operated inside. Its own scrolling strip, separate from the employer
 * marquee in the hero, because a sponsor relationship is a different claim from
 * an employer and reads differently to a PE-backed hiring team.
 */
const Partners: React.FC = () => {
  const ref = useSectionView<HTMLElement>('partners');
  return (
    <section ref={ref} id="partners" className="scroll-mt-20 border-y border-white/10" style={{ background: 'var(--bg)' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 pb-2">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-white/55">Private equity partner experience</p>
        <h2 className="display mt-2 text-3xl md:text-4xl text-white">
          Operated inside <span className="accent">sponsor-backed</span> companies
        </h2>
        <p className="mt-3 max-w-2xl text-white/60">
          Board packs, covenant math, divestiture programs, and value-creation plans built for the
          sponsors below, from the finance seat and later from the product and engineering seat.
        </p>
      </div>
      <div className="py-6">
        <Marquee items={partners} />
      </div>
      <ul className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-10 grid gap-3 md:grid-cols-3">
        {partners.map((p) => (
          <li
            key={p.name}
            className="rounded-2xl border border-white/10 bg-white/[0.03] p-4 transition-all duration-300 hover:-translate-y-1 hover:border-accent/60 hover:bg-accent/[0.06]"
          >
            <a href={p.href} target="_blank" rel="noopener noreferrer" className="font-semibold text-white hover:text-accent">
              {p.name}
            </a>
            <p className="mt-1 text-sm text-white/60">{p.context}</p>
          </li>
        ))}
      </ul>

      {/* Venture capital: investors in the two venture-backed companies, during
          Michael's tenure only (sourced per firm in data/ventureInvestors.ts). */}
      <div id="venture-capital" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12 scroll-mt-20">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-white/55">Venture capital</p>
        <h3 className="display mt-2 text-2xl md:text-3xl text-white">
          Built inside <span className="accent">venture-backed</span> fintechs
        </h3>
        <p className="mt-3 max-w-2xl text-white/60">
          The investors on the cap table while I was there: late-stage growth equity at GreenSky through
          its IPO, and Series A through securitization at Momnt.
        </p>

        {ventureBackers
          .filter((v) => v.featured)
          .map((v) => (
            <div key={v.name} className="mt-6 rounded-2xl border border-accent/40 bg-accent/[0.06] p-5">
              <p className="text-xs font-semibold uppercase tracking-widest text-accent">{v.company} · lead investor</p>
              <a
                href={v.href}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => track('Investor Link Clicked', { investor: v.name, company: v.company })}
                className="mt-1 inline-block text-xl font-bold text-white hover:text-accent"
              >
                {v.name}
              </a>
              <p className="mt-2 max-w-3xl text-sm text-white/70">{v.context}</p>
            </div>
          ))}

        <div className="mt-4 grid gap-4 md:grid-cols-2">
          {ventureCompanies.map((c) => (
            <div key={c.name} className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
              <p className="font-semibold text-white">
                {c.name} <span className="text-sm font-normal text-white/50">· {c.period}</span>
              </p>
              <p className="text-sm text-white/55">{c.note}</p>
              <ul className="mt-3 space-y-2">
                {ventureBackers
                  .filter((v) => v.company === c.name && !v.featured)
                  .map((v) => (
                    <li key={v.name} className="text-sm">
                      <a
                        href={v.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={() => track('Investor Link Clicked', { investor: v.name, company: v.company })}
                        className="font-semibold text-white hover:text-accent"
                      >
                        {v.name}
                      </a>
                      <span className="text-white/60"> — {v.context}</span>
                    </li>
                  ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Partners;
