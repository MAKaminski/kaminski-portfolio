import React from 'react';
import Marquee from './Marquee';
import { partners } from '../data/partners';
import { useSectionView } from '../hooks/useSectionView';

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
    </section>
  );
};

export default Partners;
