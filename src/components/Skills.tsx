import React from 'react';
import { Code, Database, Cloud, BarChart3, Settings, Globe, ChevronDown, Award } from 'lucide-react';
import TechLogo from './TechLogos';
import { skillCategories, specializedAreas } from '../data/skills';
import { track } from '../utils/track';
import { useSectionView } from '../hooks/useSectionView';

const Skills: React.FC = () => {
  const ref = useSectionView<HTMLElement>('skills');
  // All collapsed: the tool list is the skim, the domain depth is on request.
  const [openAccordion, setOpenAccordion] = React.useState<number | null>(null);
  
  // Data lives in src/data/skills.ts so the prerendered HTML (scripts/prerender.js)
  // carries the same list a crawler would otherwise never see. Icons stay here.
  const ICONS: Record<string, React.ElementType> = {
    "Languages": Code, "Backend & Databases": Database, "Frontend": Code, "Cloud & DevOps": Cloud,
    "Data & Analytics": BarChart3, "AI & ML": Code, "ERP & Financial Systems": Settings,
    "SEO & Growth Analytics": BarChart3, "Product & Collaboration": Settings,
    "Systems Architecture": Database, "Accounting & Financial Standards": BarChart3,
    "Compliance & Security": Settings, "Financial Expertise": Award, "Transaction Experience": Globe,
  };
  // Which categories have their long tail open. The tail is always in the DOM
  // (hidden, not unmounted) so the page indexes the same whether or not anyone
  // clicks; the toggle only changes what a reader sees.
  const [expanded, setExpanded] = React.useState<Record<string, boolean>>({});
  const toggleMore = (title: string) => {
    if (!expanded[title]) track('Section Expanded', { section: 'skills', item: `${title} (more)` });
    setExpanded((e) => ({ ...e, [title]: !e[title] }));
  };

  const toggle = (i: number) => {
    if (openAccordion !== i) track('Section Expanded', { section: 'skills', item: specializedAreas[i].title });
    setOpenAccordion(openAccordion === i ? null : i);
  };

  return (
    <section ref={ref} id="skills" className="section-padding scroll-mt-20" style={{ background: 'var(--bg)' }}>
      <div className="max-w-7xl mx-auto">
        <div className="mb-10">
          <h2 className="display text-4xl md:text-5xl text-white">
            Skills &amp; <span className="accent">expertise</span>
          </h2>
          <p className="mt-3 text-lg text-white/60 max-w-2xl">
            The stack I ship with, and the finance and compliance depth behind it.
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-5">
          {/* Tools, one row per category */}
          <dl className="lg:col-span-3 rilla-card divide-y divide-white/10">
            {skillCategories.map((category) => (
              <div key={category.title} className="grid gap-2 p-4 sm:grid-cols-[10rem_1fr] sm:gap-4">
                <dt className="flex items-center gap-2 text-sm font-semibold text-white">
                  {React.createElement(ICONS[category.title] || Code, { className: 'w-4 h-4 text-accent' })}
                  {category.title}
                </dt>
                <dd className="flex flex-wrap gap-1.5">
                  {category.core.map((skill) => (
                    <span
                      key={skill}
                      className="inline-flex items-center gap-1.5 rounded-md border border-white/10 bg-white/5 px-2 py-1 text-xs font-medium text-white/80"
                    >
                      <TechLogo name={skill} className="w-3.5 h-3.5" />
                      {skill}
                    </span>
                  ))}
                  {category.more.map((skill) => (
                    <span
                      key={skill}
                      // Tailwind's display utilities outrank the `hidden` attribute, so
                      // the toggle swaps the class. The chip stays in the DOM either way.
                      className={`${expanded[category.title] ? 'inline-flex' : 'hidden'} items-center gap-1.5 rounded-md border border-white/10 bg-white/[0.03] px-2 py-1 text-xs font-medium text-white/60`}
                    >
                      <TechLogo name={skill} className="w-3.5 h-3.5" />
                      {skill}
                    </span>
                  ))}
                  {category.more.length > 0 && (
                    <button
                      type="button"
                      onClick={() => toggleMore(category.title)}
                      aria-expanded={!!expanded[category.title]}
                      className="inline-flex items-center gap-1 rounded-md border border-dashed border-white/15 px-2 py-1 text-xs font-medium text-accent/80 hover:border-accent/60 hover:text-accent"
                    >
                      {expanded[category.title] ? 'Show fewer' : `+${category.more.length} more`}
                    </button>
                  )}
                </dd>
              </div>
            ))}
          </dl>

          {/* Domain depth, collapsed */}
          <div className="lg:col-span-2">
            <h3 className="mb-3 text-sm font-semibold uppercase tracking-widest text-white/50">
              Specialized expertise
            </h3>
            <div className="rilla-card divide-y divide-white/10">
              {specializedAreas.map((area, i) => (
                <div key={area.title}>
                  <button
                    type="button"
                    onClick={() => toggle(i)}
                    aria-expanded={openAccordion === i}
                    className="flex w-full items-center justify-between gap-3 p-4 text-left hover:bg-white/[0.03]"
                  >
                    <span className="flex items-center gap-3">
                      {React.createElement(ICONS[area.title] || Award, { className: 'w-4 h-4 text-accent' })}
                      <span className="font-semibold text-white">{area.title}</span>
                      <span className="text-xs text-white/45">{area.items.length}</span>
                    </span>
                    <ChevronDown
                      className={`w-4 h-4 flex-shrink-0 text-accent transition-transform ${openAccordion === i ? 'rotate-180' : ''}`}
                    />
                  </button>
                  <ul className={`${openAccordion === i ? 'flex' : 'hidden'} flex-wrap gap-1.5 px-4 pb-4`}>
                    {area.items.map((item) => (
                      <li
                        key={item}
                        className="rounded-md border border-white/10 bg-white/5 px-2 py-1 text-xs font-medium text-white/80"
                      >
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Skills;
