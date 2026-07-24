import React from 'react';
import { motion } from 'framer-motion';
import { ExternalLink, ArrowUpRight } from 'lucide-react';
import Seo from '../components/Seo';
import Header from '../components/Header';
import Footer from '../components/Footer';

type Site = {
  name: string;
  url: string;
  image: string;
  category: string;
  description: string;
  tags: string[];
};

// Live production sites deployed on Vercel under the Kaminski account.
// Each screenshot links directly to the running site.
const sites: Site[] = [
  {
    name: 'Modular Equity',
    url: 'https://www.modularequity.com',
    image: '/images/sites/modularequity.webp',
    category: 'Private Equity · Real Estate',
    description:
      'Investor portal for a renovation-focused fund. Raises and reports on fix-and-flip deals with disciplined underwriting, transparent reporting, and a streamlined interest-to-subscription flow.',
    tags: ['Next.js', 'Fintech', 'Real Estate'],
  },
  {
    name: 'Lace Luxx',
    url: 'https://www.lace-luxx.com',
    image: '/images/sites/lace-luxx.webp',
    category: 'E-commerce · Live Shopping',
    description:
      'Luxury live-shopping storefront for authenticated designer handbags. Bid live on Whatnot or shop the collection any time, with a 100% authentication guarantee.',
    tags: ['Next.js', 'E-commerce', 'Whatnot'],
  },
  {
    name: 'The Gamma Wall',
    url: 'https://gamma-wall.com',
    image: '/images/sites/gamma-wall.webp',
    category: 'Markets · Media',
    description:
      'Options-flow and market-structure publication. Live commentary on gamma walls, dealer positioning, and 0DTE flow, plus a daily pre-market tape and subscriber articles.',
    tags: ['Next.js', 'Options', 'Publishing'],
  },
  {
    name: 'OurAI',
    url: 'https://our-ai-web.vercel.app',
    image: '/images/sites/our-ai-web.webp',
    category: 'AI · SaaS',
    description:
      'Multiplayer AI workspace where a team and AI agents ship one repo together over a shared live transcript — from idea intake to a human-approved, merged pull request.',
    tags: ['Next.js', 'AI Agents', 'SaaS'],
  },
  {
    name: 'YieldFlow',
    url: 'https://yield-flow-ashen.vercel.app',
    image: '/images/sites/yield-flow.webp',
    category: 'Fintech · Analytics',
    description:
      'Bank-bonus yield optimizer. Ranks cash-bonus offers by risk-adjusted, after-tax annualized yield so every capital-day is put to work on the most efficient offer.',
    tags: ['React', 'Fintech', 'Analytics'],
  },
  {
    name: 'Alpha-Kite',
    url: 'https://alpha-kite-max.vercel.app',
    image: '/images/sites/alpha-kite-max.webp',
    category: 'Trading · Ops',
    description:
      'Operations console for an automated QQQ trading system — live status, signals, orders, positions, P&L, risk checks, and a manual kill switch over a Supabase backend.',
    tags: ['Next.js', 'Trading', 'Supabase'],
  },
  {
    name: 'K-Alpha Dashboard',
    url: 'https://k-alpha-frontend.vercel.app',
    image: '/images/sites/k-alpha-frontend.webp',
    category: 'Trading · Real-time',
    description:
      'Real-time QQQ trading dashboard with live options chains, SMA/VWAP crossover detection, and technical-indicator overlays for intraday decision-making.',
    tags: ['Next.js', 'Trading', 'Real-time'],
  },
  {
    name: 'Southeast Precision Partners',
    url: 'https://southern-precision-partners.vercel.app',
    image: '/images/sites/southern-precision-partners.webp',
    category: 'M&A · Holdco',
    description:
      'Acquisition holdco site targeting founder-led, lower-middle-market companies in the I-85 and I-77 corridors, with a live buy-box and a deal-submission flow.',
    tags: ['Next.js', 'M&A', 'Search Fund'],
  },
  {
    name: 'LaceLuxx Financials',
    url: 'https://laceluxx-financials.vercel.app',
    image: '/images/sites/laceluxx-financials.webp',
    category: 'Fintech · Reporting',
    description:
      'Financial-reporting dashboard for the Lace Luxx resale boutique — P&L, balance sheet, cash flow, inventory velocity, and buying-strategy analytics in one view.',
    tags: ['React', 'Dashboards', 'Analytics'],
  },
  {
    name: 'Camelot',
    url: 'https://camelot-tau.vercel.app',
    image: '/images/sites/camelot.webp',
    category: 'Trading',
    description:
      'Options-strategy execution dashboard that turns SMA/VWAP crossovers into ATM-strike orders, with live performance, contract math, and feature flags.',
    tags: ['FastAPI', 'Options', 'Automation'],
  },
  {
    name: 'Maverick RSVP',
    url: 'https://maverick-rsvp-site.vercel.app',
    image: '/images/sites/maverick-rsvp-site.webp',
    category: 'Events',
    description:
      'A lightweight event-RSVP microsite — a single-page invite with instant yes/no responses and a note field for the host.',
    tags: ['React', 'Events'],
  },
  {
    name: 'Sprunki vs Monsters',
    url: 'https://sprunki-vs-monster.vercel.app',
    image: '/images/sites/sprunki-vs-monster.webp',
    category: 'Game',
    description:
      'A tiny browser arcade game — slip past patrolling monsters’ cones of sight and win rhythm “beat battles” to clear the arena.',
    tags: ['Canvas', 'Game'],
  },
];

const hostOf = (url: string) => url.replace(/^https?:\/\//, '').replace(/\/$/, '');

const SiteCard: React.FC<{ site: Site; index: number }> = ({ site, index }) => (
  <motion.div
    initial={{ opacity: 0, y: 24 }}
    whileInView={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5, delay: (index % 3) * 0.08 }}
    viewport={{ once: true }}
    className="group flex flex-col overflow-hidden rounded-2xl border border-white/10 bg-white/[0.02] transition-colors duration-300 hover:border-accent/60"
  >
    {/* Screenshot — the whole image links to the live site */}
    <a
      href={site.url}
      target="_blank"
      rel="noopener noreferrer"
      className="relative block aspect-[16/10] overflow-hidden bg-ink-900"
      aria-label={`Open ${site.name} in a new tab`}
    >
      <img
        src={site.image}
        alt={`${site.name} homepage screenshot`}
        loading="lazy"
        width={1280}
        height={800}
        className="h-full w-full object-cover object-top transition-transform duration-500 group-hover:scale-[1.03]"
      />
      {/* Hover overlay with visit affordance */}
      <div className="absolute inset-0 flex items-center justify-center bg-ink-900/60 opacity-0 backdrop-blur-[2px] transition-opacity duration-300 group-hover:opacity-100">
        <span className="inline-flex items-center gap-2 rounded-full bg-accent px-4 py-2 text-sm font-bold text-ink-900">
          Visit site <ArrowUpRight size={16} />
        </span>
      </div>
      <span className="absolute left-3 top-3 rounded-full bg-ink-900/80 px-2.5 py-1 text-[11px] font-medium uppercase tracking-wide text-accent">
        {site.category}
      </span>
    </a>

    {/* Copy */}
    <div className="flex flex-1 flex-col p-5">
      <div className="mb-1 flex items-center justify-between gap-2">
        <a
          href={site.url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-lg font-bold text-white transition-colors duration-200 hover:text-accent"
        >
          {site.name}
        </a>
        <a
          href={site.url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-white/40 transition-colors duration-200 hover:text-accent"
          aria-label={`Open ${site.name}`}
        >
          <ExternalLink size={16} />
        </a>
      </div>
      <a
        href={site.url}
        target="_blank"
        rel="noopener noreferrer"
        className="mb-3 inline-block text-xs font-medium text-accent/80 hover:text-accent"
      >
        {hostOf(site.url)}
      </a>
      <p className="mb-4 flex-1 text-sm leading-relaxed text-white/70">{site.description}</p>
      <div className="flex flex-wrap gap-2">
        {site.tags.map((tag) => (
          <span
            key={tag}
            className="rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-[11px] font-medium text-white/60"
          >
            {tag}
          </span>
        ))}
      </div>
    </div>
  </motion.div>
);

const Websites: React.FC = () => {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'Websites built & hosted by Michael Kaminski',
    itemListElement: sites.map((s, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      url: s.url,
      name: s.name,
      description: s.description,
    })),
  };

  return (
    <div className="min-h-screen" style={{ background: 'var(--bg)' }}>
      <Seo
        title="Websites | Michael Kaminski — Live Products & Sites"
        description="A directory of live production websites and products designed, built, and hosted by Michael Kaminski — spanning fintech, trading, e-commerce, AI, and more."
        canonicalPath="/websites"
        breadcrumbName="Websites"
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
            Live Products
          </p>
          <h1 className="mb-4 text-4xl font-bold text-white sm:text-5xl">Websites</h1>
          <p className="text-lg leading-relaxed text-white/70">
            A directory of production sites and products I&rsquo;ve designed, built, and shipped —
            each one live on Vercel. From fintech dashboards and trading systems to e-commerce and
            AI tooling. Tap any screenshot to open the live site.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {sites.map((site, index) => (
            <SiteCard key={site.url} site={site} index={index} />
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="mt-14 rounded-2xl border border-white/10 bg-white/[0.02] p-8 text-center"
        >
          <h2 className="mb-3 text-xl font-semibold text-white">Have something to build?</h2>
          <p className="mx-auto mb-6 max-w-xl text-white/70">
            I design, engineer, and ship full-stack products end to end. Let&rsquo;s talk about
            what you want to launch.
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

export default Websites;
