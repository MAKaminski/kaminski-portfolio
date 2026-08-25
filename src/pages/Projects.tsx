import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowUpRight, ExternalLink } from 'lucide-react';
import Seo from '../components/Seo';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { projectsByDate, type Project } from '../data/projects';
import { sites } from '../data/sites';
import { products } from '../data/products';

const SITE_URL = 'https://www.michael-kaminski.io';

/**
 * Case-study card. Deliberately leads with role and outcome rather than with a
 * screenshot: the question this page exists to answer is "what did he own, and
 * what came of it", which the previous version of the site never stated
 * anywhere a reader (or a crawler) could find it.
 */
const CaseStudyCard: React.FC<{ project: Project; index: number }> = ({ project, index }) => (
  <motion.article
    initial={{ opacity: 0, y: 24 }}
    whileInView={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5, delay: (index % 3) * 0.08 }}
    viewport={{ once: true }}
    className="flex flex-col overflow-hidden rounded-2xl border border-white/10 bg-white/[0.02] p-6 transition-colors duration-300 hover:border-accent/60 sm:p-8"
  >
    <div className="mb-3 flex flex-wrap items-center gap-2">
      {project.tier === 'flagship' && (
        <span className="rounded-full bg-accent px-2.5 py-1 text-[11px] font-bold uppercase tracking-wide text-ink-900">
          Flagship
        </span>
      )}
      <span className="text-[11px] font-medium uppercase tracking-wide text-accent">{project.domain}</span>
      <time dateTime={project.date} className="text-[11px] text-white/40">
        {project.date}
      </time>
    </div>

    <h2 className="mb-3 text-2xl font-bold leading-tight text-white">
      <Link to={`/projects/${project.slug}`} className="hover:text-accent">
        {project.title}
      </Link>
    </h2>

    <p className="mb-4 text-white/70">{project.summary}</p>

    <p className="mb-4 text-sm text-white/60">
      <span className="font-semibold text-white/80">My role: </span>
      {project.role}
    </p>

    <ul className="mb-5 space-y-3">
      {project.outcome.map((o) => (
        <li key={o.metric} className="border-l-2 border-accent/40 pl-4">
          <p className="font-semibold text-white">{o.metric}</p>
          <p className="text-sm text-white/60">{o.detail}</p>
          <a
            href={o.source}
            className="mt-1 inline-flex items-center gap-1 text-sm font-medium text-accent hover:underline"
          >
            {o.sourceLabel} <ArrowUpRight size={13} />
          </a>
        </li>
      ))}
    </ul>

    <Link
      to={`/projects/${project.slug}`}
      className="mt-auto inline-flex items-center gap-2 font-semibold text-accent hover:underline"
    >
      Read the full case study <ArrowUpRight size={16} />
    </Link>
  </motion.article>
);

const Projects: React.FC = () => {
  const cases = projectsByDate();

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'Projects — Michael Kaminski',
    numberOfItems: cases.length + sites.length + products.length,
    itemListElement: [
      ...cases.map((p, i) => ({
        '@type': 'ListItem',
        position: i + 1,
        name: p.title,
        description: p.summary,
        url: `${SITE_URL}/projects/${p.slug}`,
      })),
      ...sites.map((s, i) => ({
        '@type': 'ListItem',
        position: cases.length + i + 1,
        name: s.name,
        description: s.description,
        url: s.url,
      })),
      ...products.map((p, i) => ({
        '@type': 'ListItem',
        position: cases.length + sites.length + i + 1,
        name: p.name,
        description: p.description,
        url: p.repoUrl,
      })),
    ],
  };

  return (
    <div className="min-h-screen bg-ink-900">
      <Seo
        title="Projects & Case Studies | Michael Kaminski"
        description={`Case studies in agent infrastructure and regulated lending, plus ${sites.length} live production sites and ${products.length} open-source tools. Every claim links to its source.`}
        canonicalPath="/projects"
        breadcrumbName="Projects"
        jsonLd={jsonLd}
      />
      <Header />

      <main className="section-padding pt-32">
        <div className="mx-auto max-w-6xl px-4">
          <header className="mb-14 max-w-3xl">
            <h1 className="mb-4 text-4xl font-bold text-white sm:text-5xl">Projects</h1>
            <p className="text-lg text-white/70">
              Case studies first: the problem, the constraints, what I personally owned, what shipped,
              and what came of it. Every number links to where you can check it.
            </p>
          </header>

          <div className="mb-20 grid gap-6 lg:grid-cols-2">
            {cases.map((p, i) => (
              <CaseStudyCard key={p.slug} project={p} index={i} />
            ))}
          </div>

          <section className="mb-16">
            <div className="mb-6 flex flex-wrap items-baseline justify-between gap-3">
              <h2 className="text-2xl font-bold text-white">
                Live production sites <span className="text-white/40">({sites.length})</span>
              </h2>
              <Link to="/websites" className="font-semibold text-accent hover:underline">
                See all with screenshots →
              </Link>
            </div>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {sites.map((s) => (
                <article
                  key={s.url}
                  className="rounded-xl border border-white/10 bg-white/[0.02] p-4 transition-colors hover:border-accent/50"
                >
                  <h3 className="mb-1 font-bold text-white">
                    <a href={s.url} target="_blank" rel="noopener noreferrer" className="hover:text-accent">
                      {s.name} <ExternalLink size={13} className="inline" />
                    </a>
                  </h3>
                  <p className="mb-2 text-[11px] uppercase tracking-wide text-accent">{s.category}</p>
                  <p className="text-sm text-white/60">{s.description}</p>
                </article>
              ))}
            </div>
          </section>

          <section>
            <div className="mb-6 flex flex-wrap items-baseline justify-between gap-3">
              <h2 className="text-2xl font-bold text-white">
                Open-source tools <span className="text-white/40">({products.length})</span>
              </h2>
              <Link to="/products" className="font-semibold text-accent hover:underline">
                See all →
              </Link>
            </div>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {products.map((p) => (
                <article
                  key={p.repoUrl}
                  className="rounded-xl border border-white/10 bg-white/[0.02] p-4 transition-colors hover:border-accent/50"
                >
                  <h3 className="mb-1 font-bold text-white">
                    <a href={p.repoUrl} target="_blank" rel="noopener noreferrer" className="hover:text-accent">
                      {p.name} <ExternalLink size={13} className="inline" />
                    </a>
                  </h3>
                  <p className="mb-2 text-[11px] uppercase tracking-wide text-accent">{p.category}</p>
                  <p className="text-sm text-white/60">{p.description}</p>
                </article>
              ))}
            </div>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Projects;
