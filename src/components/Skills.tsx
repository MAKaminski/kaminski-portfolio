import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Code, Database, Cloud, BarChart3, Settings, Globe, Award, Brain, ArrowUpRight } from 'lucide-react';
import { topSkills, skillCategories, totalSkillCount } from '../data/skills';

const ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  code: Code,
  database: Database,
  cloud: Cloud,
  chart: BarChart3,
  settings: Settings,
  globe: Globe,
  award: Award,
  brain: Brain,
};

/**
 * Homepage overview only — the four headline capabilities plus a link out.
 * The exhaustive listing lives at /skills (pages/SkillsPage) so the homepage
 * stays scannable; both read from src/data/skills.ts.
 */
const Skills: React.FC = () => (
  <section id="skills" className="relative overflow-hidden py-14 scroll-mt-20">
    <div className="relative mx-auto max-w-7xl section-padding">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        viewport={{ once: true }}
        className="mb-10 text-center"
      >
        <h2 className="display mb-4 text-5xl text-white md:text-6xl">
          Skills &amp; <span className="accent">Expertise</span>
        </h2>
        <p className="mx-auto max-w-3xl text-xl leading-relaxed text-white/60">
          Two careers that usually stay separate — PE-grade finance and hands-on engineering.
        </p>
      </motion.div>

      <div className="mb-10 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {topSkills.map((skill, index) => {
          const Icon = ICONS[skill.icon];
          return (
            <motion.div
              key={skill.label}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, delay: index * 0.07 }}
              viewport={{ once: true }}
              className="rilla-card p-6"
            >
              <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-accent/15">
                <Icon className="h-6 w-6 text-accent" />
              </div>
              <h3 className="display mb-2 text-lg text-white">{skill.label}</h3>
              <p className="text-sm leading-relaxed text-white/60">{skill.detail}</p>
            </motion.div>
          );
        })}
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
        className="text-center"
      >
        <p className="mb-5 text-sm text-white/40">
          {skillCategories.length} technical categories &middot; {totalSkillCount}+ technologies,
          standards, and domains
        </p>
        <Link
          to="/skills"
          className="inline-flex items-center gap-2 rounded-full border border-white/15 px-6 py-3 font-bold text-white transition-colors duration-200 hover:border-accent hover:text-accent"
        >
          See the full skill set <ArrowUpRight className="h-4 w-4" />
        </Link>
      </motion.div>
    </div>
  </section>
);

export default Skills;
