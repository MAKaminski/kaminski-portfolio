import React from 'react';
import { motion } from 'framer-motion';
import { ArrowUpRight, Github, Target, AlertTriangle } from 'lucide-react';

/**
 * Home-page feature for the most recently launched side project.
 *
 * Deliberately states the open problem alongside the pitch. A launch panel that
 * only lists what works reads like marketing; the constraint is the more
 * interesting half of this particular build, and it's the half a technical
 * reader will actually evaluate.
 */

const SITE_URL = 'https://top-github-users-makaminski1337.vercel.app';
const REPO_URL = 'https://github.com/MAKaminski/Top-Github-Users';

// Straight off the committed snapshot manifest — data/manifest.json.
const stats = [
  { value: '6,593', label: 'developers ranked' },
  { value: '88', label: 'countries' },
  { value: '119', label: 'cities' },
  { value: '37.4M', label: 'contributions tracked' },
];

const LatestLaunch: React.FC = () => (
  <section id="latest-launch" className="section-padding" style={{ background: 'var(--bg)' }}>
    <div className="mx-auto max-w-7xl">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
        className="mb-10 text-center"
      >
        <p className="mb-3 text-sm font-semibold uppercase tracking-[0.2em] text-accent">
          Recently launched
        </p>
        <h2 className="display mb-4 text-4xl text-white md:text-5xl">
          Commitgraph
        </h2>
        <p className="mx-auto max-w-3xl text-xl" style={{ color: 'var(--secondary)' }}>
          Worldwide, country and city leaderboards for the most active developers on GitHub — built
          because every other site in this category is a paginated table of logins and one number.
        </p>
      </motion.div>

      <div className="grid gap-6 lg:grid-cols-5">
        {/* Screenshot */}
        <motion.a
          href={SITE_URL}
          target="_blank"
          rel="noopener noreferrer"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          // Pinned to the screenshot's own 16:10. Without it the grid stretches
          // this cell to match the taller text column and object-cover crops the
          // sides off the shot.
          className="group relative block aspect-[16/10] self-start overflow-hidden rounded-2xl border border-white/10 bg-ink-900 lg:col-span-3"
          aria-label="Open Commitgraph in a new tab"
        >
          <img
            src="/images/sites/commitgraph.webp"
            alt="Commitgraph homepage screenshot"
            loading="lazy"
            width={1280}
            height={800}
            className="h-full w-full object-cover object-top transition-transform duration-500 group-hover:scale-[1.02]"
          />
          <div className="absolute inset-0 flex items-center justify-center bg-ink-900/60 opacity-0 backdrop-blur-[2px] transition-opacity duration-300 group-hover:opacity-100">
            <span className="inline-flex items-center gap-2 rounded-full bg-accent px-4 py-2 text-sm font-bold text-ink-900">
              Visit site <ArrowUpRight size={16} />
            </span>
          </div>
        </motion.a>

        {/* Goal + limitation */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.08 }}
          viewport={{ once: true }}
          className="flex flex-col gap-6 lg:col-span-2"
        >
          <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-6">
            <div className="mb-3 flex items-center gap-2">
              <Target size={18} className="text-accent" />
              <h3 className="text-lg font-bold text-white">The goal</h3>
            </div>
            <p className="text-sm leading-relaxed text-white/70">
              Rank every developer on GitHub, worldwide and by country and city, and show the work
              behind the number — a 371-day contribution heatmap per profile, rank movement between
              snapshots, follower-to-contribution distribution, per-country density. Everything the
              data can&rsquo;t support is labelled as such rather than presented as fact.
            </p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-6">
            <div className="mb-3 flex items-center gap-2">
              <AlertTriangle size={18} className="text-accent" />
              <h3 className="text-lg font-bold text-white">The open problem</h3>
            </div>
            <p className="mb-3 text-sm leading-relaxed text-white/70">
              Coverage. GitHub passed{' '}
              <span className="font-semibold text-white">180 million developers</span> in the 2025
              Octoverse report; today&rsquo;s snapshot ranks 6,593 of them. Closing that gap is
              bounded entirely by the free API rate limit — one personal token is 5,000 REST
              requests or 5,000 GraphQL points per hour, and no amount of concurrency raises the
              ceiling.
            </p>
            <p className="mb-3 text-sm leading-relaxed text-white/70">
              One REST call per user is 5,000 profiles an hour, which puts full coverage at roughly
              four years. Batching 100 aliased users into a single GraphQL point is about 500,000
              an hour — the same free token, two weeks instead of four years.
            </p>
            <p className="text-sm leading-relaxed text-white/70">
              So the work is designing the call structure, not buying more quota: aggressive
              batching, conditional requests that return 304 and cost nothing, and prioritising who
              gets re-fetched and how often. Strictly inside the free tier and inside
              GitHub&rsquo;s terms — multiplying accounts or scraping HTML would &ldquo;solve&rdquo;
              it and are ruled out.
            </p>
          </div>
        </motion.div>
      </div>

      {/* Snapshot stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.15 }}
        viewport={{ once: true }}
        className="mt-6 grid grid-cols-2 gap-4 md:grid-cols-4"
      >
        {stats.map((s) => (
          <div
            key={s.label}
            className="rounded-2xl border border-white/10 bg-white/[0.02] p-5 text-center"
          >
            <p className="display text-3xl text-white">{s.value}</p>
            <p className="mt-1 text-xs uppercase tracking-wide text-white/50">{s.label}</p>
          </div>
        ))}
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        viewport={{ once: true }}
        className="mt-8 flex flex-col justify-center gap-4 sm:flex-row"
      >
        <a
          href={SITE_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center gap-2 rounded-full bg-accent px-6 py-3 font-bold text-ink-900 shadow-lg transition-all duration-200 hover:brightness-90"
        >
          Open Commitgraph <ArrowUpRight size={18} />
        </a>
        <a
          href={REPO_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center gap-2 rounded-full border border-white/20 px-6 py-3 font-semibold text-white transition-colors duration-200 hover:border-accent hover:text-accent"
        >
          <Github size={18} /> Read the source
        </a>
      </motion.div>
    </div>
  </section>
);

export default LatestLaunch;
