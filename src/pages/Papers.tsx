import React from 'react';
import { motion } from 'framer-motion';
import { FileText, ArrowUpRight, Calendar, BookOpen } from 'lucide-react';
import { Link } from 'react-router-dom';
import Seo from '../components/Seo';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { papers, type Paper } from '../data/papers';
import ArticleLogos from '../components/ArticleLogos';

const SITE_URL = 'https://www.michael-kaminski.io';

const isInternal = (href: string) => href.startsWith('/');

const SourceLink: React.FC<{ href: string; label: string }> = ({ href, label }) => {
  const className =
    'inline-flex items-center gap-1 text-xs font-semibold text-accent/90 transition-colors hover:text-accent';
  return isInternal(href) ? (
    <Link to={href} className={className}>
      {label} <ArrowUpRight size={13} />
    </Link>
  ) : (
    <a href={href} target="_blank" rel="noopener noreferrer" className={className}>
      {label} <ArrowUpRight size={13} />
    </a>
  );
};

const PaperCard: React.FC<{ paper: Paper; index: number }> = ({ paper, index }) => (
  <motion.article
    initial={{ opacity: 0, y: 24 }}
    whileInView={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5, delay: (index % 2) * 0.08 }}
    viewport={{ once: true }}
    className="flex flex-col overflow-hidden rounded-2xl border border-white/10 bg-white/[0.02] transition-colors duration-300 hover:border-accent/60"
  >
    {paper.image && (
      <a href={paper.pdf} className="block aspect-[1200/630] overflow-hidden bg-ink-900">
        <img
          src={paper.image}
          alt={`${paper.title} — cover`}
          loading="lazy"
          width={1200}
          height={630}
          className="h-full w-full object-cover"
        />
      </a>
    )}
    <div className="flex flex-1 flex-col p-6 sm:p-8">
      <div className="mb-3 flex flex-wrap items-center gap-3 text-xs text-white/50">
        <span className="inline-flex items-center gap-1">
          <Calendar size={13} />
          <time dateTime={paper.date}>
            {new Date(paper.date + 'T00:00:00').toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </time>
        </span>
        <span className="inline-flex items-center gap-1">
          <BookOpen size={13} /> {paper.pages} pages
        </span>
      </div>
      <h2 className="mb-1 text-2xl font-bold leading-tight text-white">
        <a href={paper.pdf} className="hover:text-accent">
          {paper.title}
        </a>
      </h2>
      <p className="mb-4 text-sm font-medium text-accent/80">{paper.subtitle}</p>
      <ArticleLogos names={paper.logos} slug={paper.slug} linked event="Paper Logo Clicked" className="mb-5" />
      <p className="mb-5 text-sm leading-relaxed text-white/70">{paper.abstract}</p>

      <dl className="mb-6 space-y-3">
        {paper.findings.map((f) => (
          <div key={f.metric} className="rounded-xl border border-white/10 bg-white/[0.03] p-3">
            <dt className="text-sm font-bold text-white">{f.metric}</dt>
            <dd className="mt-0.5 text-xs leading-relaxed text-white/60">{f.detail}</dd>
          </div>
        ))}
      </dl>

      <div className="mt-auto flex flex-wrap items-center gap-x-4 gap-y-2">
        <a
          href={paper.pdf}
          className="inline-flex items-center gap-2 rounded-full bg-accent px-4 py-2 text-sm font-bold text-ink-900 transition-all hover:brightness-90"
        >
          <FileText size={15} /> Read the PDF
        </a>
        {paper.sources.map((s) => (
          <SourceLink key={s.href} href={s.href} label={s.label} />
        ))}
      </div>

      <div className="mt-5 flex flex-wrap gap-2">
        {paper.tags.map((tag) => (
          <span
            key={tag}
            className="rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-[11px] font-medium text-white/60"
          >
            {tag}
          </span>
        ))}
      </div>
    </div>
  </motion.article>
);

const Papers: React.FC = () => {
  const jsonLd = [
    {
      '@context': 'https://schema.org',
      '@type': 'CollectionPage',
      '@id': `${SITE_URL}/papers#collection`,
      name: 'Papers by Michael Kaminski',
      url: `${SITE_URL}/papers`,
      author: { '@id': `${SITE_URL}/#person` },
    },
    {
      '@context': 'https://schema.org',
      '@type': 'ItemList',
      name: 'Papers',
      numberOfItems: papers.length,
      itemListElement: papers.map((p, i) => ({
        '@type': 'ListItem',
        position: i + 1,
        item: {
          '@type': 'Report',
          name: p.title,
          description: p.abstract,
          datePublished: p.date,
          url: `${SITE_URL}${p.pdf}`,
          encodingFormat: 'application/pdf',
          author: { '@id': `${SITE_URL}/#person` },
          inLanguage: 'en',
        },
      })),
    },
  ];

  return (
    <div className="min-h-screen" style={{ background: 'var(--bg)' }}>
      <Seo
        title={`Papers — ${papers.length} Long-Form Write-Ups | Michael Kaminski`}
        description="White papers with the arithmetic shown: agent infrastructure, launch templates, and the measurement mistakes found in production systems. Each one is a PDF you can keep."
        canonicalPath="/papers"
        breadcrumbName="Papers"
        jsonLd={jsonLd}
      />
      <Header />
      <main className="mx-auto max-w-5xl px-4 pb-20 pt-28 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-12 max-w-3xl"
        >
          <p className="mb-3 text-sm font-semibold uppercase tracking-[0.2em] text-accent">
            Long form
          </p>
          <h1 className="mb-4 text-4xl font-bold text-white sm:text-5xl">Papers</h1>
          <p className="text-lg leading-relaxed text-white/70">
            The essays on this site are the short version. These are the long version: the
            method, the arithmetic, and the parts that went wrong, as PDFs you can keep. Every
            number in them is sourced to a repository, a live URL, or a measurement you can rerun.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          {papers.map((paper, index) => (
            <PaperCard key={paper.slug} paper={paper} index={index} />
          ))}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Papers;
