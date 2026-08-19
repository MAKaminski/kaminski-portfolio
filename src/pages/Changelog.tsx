import React, { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowUpRight, Rocket, PenLine, Film, Wrench, Package } from 'lucide-react';
import Seo from '../components/Seo';
import Header from '../components/Header';
import Footer from '../components/Footer';
import {
  changelog,
  countsByKind,
  dayLabel,
  monthLabel,
  KIND_LABELS,
  type ChangeEntry,
  type ChangeKind,
} from '../data/changelog';

const KIND_ICONS: Record<ChangeKind, React.ComponentType<{ size?: number | string }>> = {
  launch: Rocket,
  feature: Wrench,
  tool: Package,
  essay: PenLine,
  clip: Film,
};

const FILTERS: { value: ChangeKind | 'all'; label: string }[] = [
  { value: 'all', label: 'Everything' },
  { value: 'launch', label: 'Launches' },
  { value: 'feature', label: 'Features' },
  { value: 'tool', label: 'Open source' },
  { value: 'essay', label: 'Essays' },
  { value: 'clip', label: 'Clips' },
];

const isInternal = (href: string) => href.startsWith('/');

const EntryLink: React.FC<{ href: string; label: string }> = ({ href, label }) => {
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

const EntryRow: React.FC<{ entry: ChangeEntry }> = ({ entry }) => {
  const Icon = KIND_ICONS[entry.kind];
  return (
    <motion.li
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      viewport={{ once: true, margin: '-40px' }}
      className="relative pl-10 sm:pl-14"
    >
      {/* Timeline node, sitting on the rail drawn by the parent <ol>. */}
      <span
        className="absolute left-0 top-1.5 flex h-7 w-7 items-center justify-center rounded-full border border-white/15 bg-ink-900 text-accent sm:left-2"
        aria-hidden
      >
        <Icon size={14} />
      </span>

      <div className="pb-10">
        <div className="mb-1.5 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs">
          <time dateTime={entry.date} className="font-mono text-white/45">
            {dayLabel(entry.date)}
          </time>
          <span className="rounded-full border border-white/10 bg-white/5 px-2.5 py-0.5 font-semibold uppercase tracking-wide text-white/60">
            {KIND_LABELS[entry.kind]}
          </span>
        </div>

        <h3 className="mb-2 text-lg font-bold leading-snug text-white sm:text-xl">{entry.title}</h3>
        <p className="max-w-2xl text-sm leading-relaxed text-white/65">{entry.summary}</p>

        {(entry.links?.length || entry.tags?.length) && (
          <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2">
            {entry.links?.map((link) => (
              <EntryLink key={link.href + link.label} href={link.href} label={link.label} />
            ))}
            {entry.tags?.map((tag) => (
              <span key={tag} className="text-[11px] font-medium text-white/35">
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>
    </motion.li>
  );
};

const Changelog: React.FC = () => {
  const [filter, setFilter] = useState<ChangeKind | 'all'>('all');

  const counts = useMemo(() => countsByKind(), []);

  // Group the visible entries by month so the timeline reads as a history
  // rather than one undifferentiated list.
  const months = useMemo(() => {
    const visible = filter === 'all' ? changelog : changelog.filter((e) => e.kind === filter);
    const grouped: { label: string; entries: ChangeEntry[] }[] = [];
    for (const entry of visible) {
      const label = monthLabel(entry.date);
      const last = grouped[grouped.length - 1];
      if (last && last.label === label) last.entries.push(entry);
      else grouped.push({ label, entries: [entry] });
    }
    return grouped;
  }, [filter]);

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'Changelog — Michael Kaminski',
    description:
      'Every sizable update to Michael Kaminski’s work: sites launched, essays published, field clips posted, and platform work shipped.',
    numberOfItems: changelog.length,
    itemListElement: changelog.slice(0, 50).map((entry, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: entry.title,
      description: entry.summary,
    })),
  };

  // Counts of *entries*, not of things in the world — a single launch entry can
  // cover two sites going live the same day, so "Launches" is the honest label
  // and the websites directory stays the count of record.
  const stats: { label: string; value: number }[] = [
    { label: 'Launches', value: counts.launch },
    { label: 'Essays published', value: counts.essay },
    { label: 'Features & tools', value: counts.feature + counts.tool },
    { label: 'Field clips', value: counts.clip },
  ];

  return (
    <div className="min-h-screen" style={{ background: 'var(--bg)' }}>
      <Seo
        title="Changelog | Michael Kaminski — What Shipped, and When"
        description="A running log of every sizable update: production sites launched on Vercel, essays published, field clips posted, and platform work shipped — each entry dated and linked to the thing itself."
        canonicalPath="/changelog"
        breadcrumbName="Changelog"
        jsonLd={jsonLd}
      />
      <Header />

      <main className="mx-auto max-w-4xl px-4 pb-20 pt-28 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-10"
        >
          <p className="mb-3 text-sm font-semibold uppercase tracking-[0.2em] text-accent">
            What shipped
          </p>
          <h1 className="mb-4 text-4xl font-bold text-white sm:text-5xl">Changelog</h1>
          <p className="max-w-2xl text-lg leading-relaxed text-white/70">
            Every sizable update in one place — a site going live, an essay published, a clip
            posted, a piece of platform work landing. Each entry is dated the day it actually
            shipped and links to the thing itself, so none of it has to be taken on faith.
          </p>
        </motion.div>

        {/* Counters. Derived, so they cannot drift from the list below. */}
        <div className="mb-10 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="rounded-xl border border-white/10 bg-white/[0.02] px-4 py-3"
            >
              <div className="text-2xl font-bold text-accent">{stat.value}</div>
              <div className="text-xs font-medium text-white/50">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Filters */}
        <div className="mb-12 flex flex-wrap gap-2" role="group" aria-label="Filter changelog">
          {FILTERS.map((option) => {
            const active = filter === option.value;
            return (
              <button
                key={option.value}
                type="button"
                onClick={() => setFilter(option.value)}
                aria-pressed={active}
                className={`rounded-full border px-4 py-1.5 text-sm font-semibold transition-colors duration-200 ${
                  active
                    ? 'border-accent bg-accent text-ink-900'
                    : 'border-white/10 bg-white/[0.02] text-white/60 hover:border-white/25 hover:text-white'
                }`}
              >
                {option.label}
              </button>
            );
          })}
        </div>

        {months.map((month) => (
          <section key={month.label} className="mb-4">
            <h2 className="mb-6 text-sm font-bold uppercase tracking-[0.18em] text-white/40">
              {month.label}
            </h2>
            {/* The rail: a hairline behind the timeline nodes. */}
            <ol className="relative border-l border-white/10 sm:ml-[15px]">
              {month.entries.map((entry) => (
                <EntryRow key={`${entry.date}-${entry.title}`} entry={entry} />
              ))}
            </ol>
          </section>
        ))}

        <div className="mt-10 rounded-2xl border border-white/10 bg-white/[0.02] p-8 text-center">
          <h2 className="mb-3 text-xl font-semibold text-white">Want to see the live versions?</h2>
          <p className="mx-auto mb-6 max-w-xl text-white/70">
            Every production site sits in the websites directory, and the tools that run on a
            desktop rather than a URL are in products.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <Link
              to="/websites"
              className="inline-flex items-center justify-center rounded-full bg-accent px-6 py-3 font-bold text-ink-900 transition-all duration-200 hover:brightness-90"
            >
              Browse websites
            </Link>
            <Link
              to="/products"
              className="inline-flex items-center justify-center rounded-full border border-white/15 px-6 py-3 font-bold text-white transition-colors duration-200 hover:border-accent hover:text-accent"
            >
              Browse products
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Changelog;
