import React from 'react';
import { motion } from 'framer-motion';
import {
  Code,
  Database,
  Cloud,
  BarChart3,
  Settings,
  Globe,
  Award,
  Brain,
  ChevronDown,
} from 'lucide-react';
import Seo from '../components/Seo';
import Header from '../components/Header';
import Footer from '../components/Footer';
import TechLogo from '../components/TechLogos';
import {
  skillCategories,
  specializedAreas,
  totalSkillCount,
  SkillCategory,
} from '../data/skills';

const ICONS: Record<SkillCategory['icon'], React.ComponentType<{ className?: string }>> = {
  code: Code,
  database: Database,
  cloud: Cloud,
  chart: BarChart3,
  settings: Settings,
  globe: Globe,
  award: Award,
  brain: Brain,
};

const SkillsPage: React.FC = () => {
  const [openAccordion, setOpenAccordion] = React.useState<number | null>(0);

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'Skills & expertise — Michael Kaminski',
    itemListElement: [
      ...skillCategories.map((c, i) => ({
        '@type': 'ListItem',
        position: i + 1,
        name: c.title,
        description: c.skills.join(', '),
      })),
      ...specializedAreas.map((a, i) => ({
        '@type': 'ListItem',
        position: skillCategories.length + i + 1,
        name: a.title,
        description: a.items.join(', '),
      })),
    ],
  };

  return (
    <div className="min-h-screen" style={{ background: 'var(--bg)' }}>
      <Seo
        title="Skills & Expertise | Michael Kaminski — Fintech Finance & Engineering"
        description="The full technical and domain skill set behind 20+ years across fintech, payments, and lending — languages, cloud, data, AI, ERP and financial systems, plus deep accounting, compliance, treasury, and transaction expertise."
        canonicalPath="/skills"
        breadcrumbName="Skills"
        jsonLd={jsonLd}
      />
      <Header />

      <main className="mx-auto max-w-7xl px-4 pb-20 pt-28 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-12 max-w-3xl"
        >
          <p className="mb-3 text-sm font-semibold uppercase tracking-[0.2em] text-accent">
            Capabilities
          </p>
          <h1 className="mb-4 text-4xl font-bold text-white sm:text-5xl">
            Skills &amp; <span className="accent">Expertise</span>
          </h1>
          <p className="text-lg leading-relaxed text-white/70">
            {totalSkillCount}+ technologies, standards, and domains across two careers that
            usually stay separate — PE-grade finance and hands-on software engineering. The
            tooling is below; the domain depth is underneath it.
          </p>
        </motion.div>

        {/* Technical breadth */}
        <div className="mb-16 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {skillCategories.map((category, index) => {
            const Icon = ICONS[category.icon];
            return (
              <motion.div
                key={category.title}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.45, delay: (index % 3) * 0.06 }}
                viewport={{ once: true }}
                className="rilla-card group relative overflow-hidden p-6"
              >
                <div
                  className={`mb-4 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-r ${category.gradient} shadow-lg`}
                >
                  <Icon className="h-7 w-7 text-white" />
                </div>
                <h2 className="display mb-1 text-lg text-white">{category.title}</h2>
                <p className="mb-3 text-xs text-white/40">{category.skills.length} items</p>
                <div className="flex flex-wrap gap-2">
                  {category.skills.map((skill) => (
                    <span
                      key={skill}
                      className="flex items-center space-x-2 rounded-xl border border-white/10 bg-white/5 px-3 py-2 transition-colors duration-200 hover:bg-white/10"
                    >
                      <TechLogo name={skill} className="h-4 w-4" />
                      <span className="text-sm font-medium text-white/80">{skill}</span>
                    </span>
                  ))}
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Domain depth */}
        <div className="mb-10 text-center">
          <h2 className="display mb-3 text-4xl text-white">
            Specialized <span className="accent">Expertise</span>
          </h2>
          <p className="text-lg text-white/60">
            Deep domain knowledge in financial services, compliance, and enterprise systems
          </p>
        </div>

        <div className="space-y-4">
          {specializedAreas.map((area, index) => {
            const Icon = ICONS[area.icon];
            const isOpen = openAccordion === index;
            return (
              <div key={area.title} className="rilla-card overflow-hidden">
                <button
                  type="button"
                  className="flex w-full items-center justify-between p-6 text-left transition-colors duration-200 hover:bg-white/5 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent sm:p-8"
                  onClick={() => setOpenAccordion(isOpen ? null : index)}
                  aria-expanded={isOpen}
                  aria-controls={`area-panel-${index}`}
                >
                  <div className="flex items-center space-x-5">
                    <div
                      className={`inline-flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-2xl bg-gradient-to-r ${area.gradient} shadow-lg`}
                    >
                      <Icon className="h-7 w-7 text-white" />
                    </div>
                    <div>
                      <h3 className="display text-xl text-white sm:text-2xl">{area.title}</h3>
                      <p className="mt-1 text-sm text-white/50">
                        {area.items.length} areas of expertise
                      </p>
                    </div>
                  </div>
                  <motion.div
                    animate={{ rotate: isOpen ? 180 : 0 }}
                    transition={{ duration: 0.3 }}
                    className="flex-shrink-0"
                  >
                    <div className="rounded-xl bg-accent/15 p-3">
                      <ChevronDown className="h-6 w-6 text-accent" />
                    </div>
                  </motion.div>
                </button>

                <motion.div
                  id={`area-panel-${index}`}
                  initial={false}
                  animate={{ height: isOpen ? 'auto' : 0, opacity: isOpen ? 1 : 0 }}
                  transition={{ duration: 0.3, ease: 'easeInOut' }}
                  className="overflow-hidden"
                >
                  <div className="px-6 pb-8 sm:px-8">
                    <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
                      {area.items.map((item) => (
                        <div
                          key={item}
                          className="flex items-center space-x-3 rounded-xl border border-white/10 bg-white/5 p-4"
                        >
                          <div className="h-2.5 w-2.5 flex-shrink-0 rounded-full bg-accent" />
                          <span className="text-sm font-medium text-white/80">{item}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              </div>
            );
          })}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="mt-14 rounded-2xl border border-white/10 bg-white/[0.02] p-8 text-center"
        >
          <h2 className="mb-3 text-xl font-semibold text-white">Need this range on your team?</h2>
          <p className="mx-auto mb-6 max-w-xl text-white/70">
            Fractional CFO/CTO, product and engineering leadership, or full-time. Let&rsquo;s talk
            about what you&rsquo;re building.
          </p>
          <a
            href="https://calendly.com/kaminski1337/15min"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center rounded-full bg-accent px-6 py-3 font-bold text-ink-900 shadow-lg transition-all duration-200 hover:brightness-90"
          >
            Book a Call
          </a>
        </motion.div>
      </main>

      <Footer />
    </div>
  );
};

export default SkillsPage;
