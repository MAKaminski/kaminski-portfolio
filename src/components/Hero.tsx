import React, { Suspense, lazy, useState } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { transactionTotals } from '../data/transactions';
import { Download, Clock, ArrowUpRight, Linkedin, Github, MessagesSquare } from 'lucide-react';
import { Link } from 'react-router-dom';
import { track } from '../utils/track';
import { setVisitorProperties } from '../utils/posthog';
import { VISITOR_PATHS, VisitorPath } from '../data/visitorPaths';
import { useSectionView } from '../hooks/useSectionView';
import { latestNews, formatNewsDate } from '../data/news';
import Marquee from './Marquee';
import { PROFILES } from '../data/profiles';
import CountUp from './CountUp';
import SplitReveal from './SplitReveal';
import Magnetic from './Magnetic';
import Tilt from './Tilt';
import ResumeLink from './ResumeLink';
import ResumeEmailCapture from './ResumeEmailCapture';
// The twin (framer-motion panel + voice loop + audio APIs) is ~25 KB of source that
// nobody needs until they click. Its own Suspense boundary matters: without one the
// first render would suspend up to App's RouteFallback and paint "Loading" instead
// of the hero.
const DigitalTwin = lazy(() => import('./DigitalTwin'));

const RILLA_EASE = [0.445, 0.05, 0.55, 0.95] as const;

/** 2x the 440x520 layout box. Preloaded by scripts/prerender.js on the home shell only. */
export const HERO_PORTRAIT = '/images/484D0082-4587-4FEF-AE4B-E727C7BF176B_1_105_c-880x1040.webp';

const Hero: React.FC = () => {
  const sectionRef = useSectionView<HTMLElement>('hero');
  const { scrollY } = useScroll();
  const yGlow = useTransform(scrollY, [0, 700], [0, 160]);
  const yPortrait = useTransform(scrollY, [0, 700], [0, -70]);
  const yGrid = useTransform(scrollY, [0, 700], [0, 80]);
  // Drifts slower than the grid so the map sits behind it.
  const yMap = useTransform(scrollY, [0, 700], [0, 46]);
  const [twinOpen, setTwinOpen] = useState(false);
  const totals = transactionTotals();

  const stats = [
    { to: 20, suffix: '+', label: 'Years across finance & engineering' },
    { to: 3, suffix: '', label: 'Successful exits' },
    // Derived from src/data/transactions.ts, not typed by hand. This read
    // "$10.8B+" for a long time while the table beneath it summed to $11,197M.
    {
      prefix: '$',
      to: Math.floor(totals.totalM / 100) / 10,
      decimals: 1,
      suffix: 'B+',
      label: 'Transactions led',
    },
  ];

  // The fork in the road: which of the three visitor paths this person takes.
  // Tagged on the person too, so it can be compared with the contact intent
  // they pick later (same keys).
  const choosePath = (p: VisitorPath) => {
    track('Path Selected', { path: p.key, destination: p.href });
    setVisitorProperties({ visitor_path: p.key }, { first_visitor_path: p.key });
  };

  return (
    <section ref={sectionRef} className="relative overflow-hidden bg-ink-900 text-white pt-24 pb-10">
      {/* Spotlight + grid backdrop (parallax) */}
      <div className="pointer-events-none absolute inset-0">
        {/* Atlanta, drawn from real data: city neighborhood polygons, the interstates,
            the Chattahoochee, and a star on each company in the marquee below. Sits
            under the grid so it reads as aged paper rather than a second foreground. */}
        <motion.div style={{ y: yMap }} className="absolute inset-0 overflow-hidden">
          <img
            src="/images/atlanta-map.svg"
            alt=""
            aria-hidden="true"
            width={1600}
            height={1000}
            decoding="async"
            // Contained rather than cropped: at any larger scale the outlying stars
            // (Superior in Kennesaw, GreenSky in Sandy Springs) fall outside the hero,
            // which is the one thing this layer exists to show.
            className="absolute left-1/2 top-1/2 h-full w-full max-w-none -translate-x-1/2 -translate-y-1/2 object-contain opacity-[0.24]"
            style={{
              filter: 'sepia(0.4)',
              maskImage: 'radial-gradient(ellipse at 50% 45%, black 45%, transparent 80%)',
              WebkitMaskImage: 'radial-gradient(ellipse at 50% 45%, black 45%, transparent 80%)',
            }}
          />
        </motion.div>
        <motion.div
          style={{ y: yGrid }}
          className="absolute inset-0 opacity-[0.15]"
        >
          <div
            className="absolute inset-0"
            style={{
              backgroundImage:
                'linear-gradient(to right, rgba(255,255,255,0.6) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.6) 1px, transparent 1px)',
              backgroundSize: '64px 64px',
              maskImage: 'radial-gradient(ellipse at 50% 0%, black 30%, transparent 75%)',
              WebkitMaskImage: 'radial-gradient(ellipse at 50% 0%, black 30%, transparent 75%)',
            }}
          />
        </motion.div>
        <motion.div
          style={{ y: yGlow }}
          className="absolute -top-40 left-1/2 h-[520px] w-[720px] -translate-x-1/2 rounded-full bg-accent/20 blur-[140px]"
        />
      </div>

      <div className="relative max-w-7xl mx-auto section-padding">
        <div className="grid lg:grid-cols-12 gap-10 lg:gap-8 items-center">
          {/* Left — the statement */}
          <div className="lg:col-span-7">
            {/* What's new: the first thing above the name, linking to the story
                section directly under the hero (NewsStory.tsx). */}
            <motion.a
              href={`#${latestNews.id}`}
              onClick={() => track('News Banner Clicked', { item: latestNews.id })}
              className="group mb-6 inline-flex max-w-full items-center gap-3 rounded-full border border-accent/40 bg-accent/[0.08] py-1.5 pl-1.5 pr-4 text-sm text-white/85 transition hover:border-accent hover:bg-accent/[0.14] hover:text-white"
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: RILLA_EASE }}
            >
              <span className="relative inline-flex shrink-0 items-center gap-1.5 rounded-full bg-accent px-2.5 py-0.5 text-xs font-bold uppercase tracking-wider text-ink-900">
                <span className="relative flex h-1.5 w-1.5">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-ink-900/60" />
                  <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-ink-900" />
                </span>
                {latestNews.tag}
              </span>
              <span className="min-w-0 lg:whitespace-nowrap">
                {latestNews.banner}
                <span className="ml-2 whitespace-nowrap text-white/50">{formatNewsDate(latestNews.date)}</span>
              </span>
              <ArrowUpRight className="w-4 h-4 shrink-0 text-accent transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </motion.a>

            <motion.p
              className="mb-5 flex items-center gap-3 text-sm font-semibold tracking-[0.2em] text-white/60 uppercase"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: RILLA_EASE }}
            >
              <span className="h-2 w-2 rounded-full bg-accent" />
              Michael Kaminski · Atlanta
            </motion.p>

            <h1 className="display text-[11.5vw] leading-[0.9] sm:text-7xl lg:text-8xl xl:text-[6.4rem]">
              <SplitReveal
                immediate
                delay={0.15}
                lines={[
                  'I build',
                  <>AI <span className="accent">agents</span></>,
                  'that run in production',
                ]}
              />
            </h1>

            <motion.p
              className="mt-7 max-w-xl text-lg text-white/70"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, ease: RILLA_EASE, delay: 0.5 }}
            >
              Agent infrastructure, MCP servers, and eval harnesses inside a regulated lender.
              Python and TypeScript. Atlanta.
            </motion.p>

            {/* CTAs */}
            <motion.div
              className="mt-9 flex flex-wrap items-center gap-4"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: RILLA_EASE, delay: 0.6 }}
            >
              <Magnetic>
                <a
                  href="https://calendly.com/kaminski1337/15min"
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => track('Calendar Link Clicked', { source: 'Hero' })}
                  className="btn-pill-accent text-base"
                >
                  <Clock className="w-5 h-5" /> Book a Call
                </a>
              </Magnetic>
              <Magnetic>
                <ResumeLink source="Hero" className="btn-pill-ghost text-base">
                  <Download className="w-5 h-5" /> Resume
                </ResumeLink>
              </Magnetic>
              <div className="flex items-center gap-2 pl-1">
                <Magnetic strength={0.5}>
                  <a href={PROFILES.linkedin} target="_blank" rel="noopener noreferrer"
                     className="grid h-11 w-11 place-items-center rounded-full border border-white/15 text-white/80 transition hover:border-accent hover:text-accent" aria-label="LinkedIn">
                    <Linkedin className="w-5 h-5" />
                  </a>
                </Magnetic>
                <Magnetic strength={0.5}>
                  <a href="https://github.com/MAKaminski" target="_blank" rel="noopener noreferrer"
                     className="grid h-11 w-11 place-items-center rounded-full border border-white/15 text-white/80 transition hover:border-accent hover:text-accent" aria-label="GitHub">
                    <Github className="w-5 h-5" />
                  </a>
                </Magnetic>
              </div>
            </motion.div>

            <motion.button
              type="button"
              onClick={() => {
                setTwinOpen(true);
                track('Digital Twin Opened', { source: 'Hero' });
              }}
              className="mt-5 inline-flex items-center gap-2 text-sm font-medium text-white/60 hover:text-accent transition-colors"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, ease: RILLA_EASE, delay: 0.65 }}
            >
              <MessagesSquare className="w-4 h-4" /> Or ask my digital twin anything
            </motion.button>

            <motion.div
              className="mt-3"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, ease: RILLA_EASE, delay: 0.7 }}
            >
              <ResumeEmailCapture source="Hero" />
            </motion.div>

            {/* Stats */}
            <motion.div
              className="mt-10 grid grid-cols-3 gap-6 max-w-xl"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: RILLA_EASE, delay: 0.7 }}
            >
              {stats.map((s, i) => (
                <div
                  key={i}
                  data-cursor
                  className={`${i % 2 ? 'float-delayed' : 'float'} rounded-xl px-2 py-1 -mx-2 transition-colors hover:bg-white/[0.04]`}
                >
                  <div className="display accent text-4xl sm:text-5xl">
                    <CountUp to={s.to} prefix={s.prefix} suffix={s.suffix} decimals={s.decimals} />
                  </div>
                  <div className="mt-2 text-xs sm:text-sm text-white/65 leading-snug">{s.label}</div>
                </div>
              ))}
            </motion.div>
          </div>

          {/* Right — portrait (clip-path reveal + parallax) */}
          <div className="lg:col-span-5">
            <motion.div className="relative mx-auto max-w-sm" style={{ y: yPortrait }}>
              <div className="absolute -inset-3 rounded-[26px] bg-accent/20 blur-2xl pulse-slow" />
              {/* The portrait is the mobile LCP element. It used to be revealed with a
                  clip-path inset that left it with zero painted area until 1.35 s after
                  mount, which is where the 6.9 s LCP came from. An accent panel that
                  slides off the top gives the same reveal without deferring LCP:
                  occlusion doesn't count against paint, clipping does. */}
              <div className="relative overflow-hidden rounded-[22px]">
                <picture>
                  <source srcSet={HERO_PORTRAIT} type="image/webp" />
                  <img
                    src="/images/484D0082-4587-4FEF-AE4B-E727C7BF176B_1_105_c.jpeg"
                    alt="Michael Kaminski"
                    width={440}
                    height={520}
                    decoding="async"
                    {...({ fetchpriority: 'high' } as Record<string, string>)}
                    className="w-full rounded-[22px] object-cover border-4 border-accent shadow-2xl"
                  />
                </picture>
                <motion.div
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-0 bg-accent"
                  initial={{ y: '0%' }}
                  animate={{ y: '-101%' }}
                  transition={{ duration: 0.8, ease: RILLA_EASE, delay: 0.2 }}
                />
              </div>
              <motion.div
                className="absolute -bottom-4 -left-4"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, ease: RILLA_EASE, delay: 1 }}
              >
                <Magnetic strength={0.4}>
                  <div className="float-delayed rounded-full bg-accent px-5 py-2 text-sm font-bold text-ink-900 shadow-lg">
                    Open to fractional &amp; full-time
                  </div>
                </Magnetic>
              </motion.div>
            </motion.div>

          </div>
        </div>
      </div>

      {/* Start here — one card per visitor path */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12">
        <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-white/55">Start here</p>
        <div className="grid gap-3 md:grid-cols-3">
          {VISITOR_PATHS.map((p) => {
            const inner = (
              <>
                <span className="block font-semibold text-white">{p.label}</span>
                <span className="mt-1 block text-sm text-white/60">{p.blurb}</span>
                <span className="mt-3 inline-flex items-center gap-1 text-sm font-semibold text-accent">
                  {p.cta} <ArrowUpRight className="w-4 h-4" />
                </span>
              </>
            );
            const cls =
              'block h-full rounded-2xl border border-white/15 bg-white/[0.04] p-5 transition-all duration-300 hover:border-accent/60 hover:bg-accent/[0.06] hover:shadow-[0_0_30px_rgba(255,245,0,0.12)]';
            return (
              <Tilt key={p.key}>
                {p.href.startsWith('/#') ? (
                  <a href={p.href.slice(1)} onClick={() => choosePath(p)} className={cls}>
                    {inner}
                  </a>
                ) : (
                  <Link to={p.href} onClick={() => choosePath(p)} className={cls}>
                    {inner}
                  </Link>
                )}
              </Tilt>
            );
          })}
        </div>
      </div>

      {/* Company marquee (scroll-velocity skew) */}
      <div className="relative mt-10 border-y border-white/10 py-6">
        {/* Sizes are each mark's natural size at 1x (assets ship at 2x), fitted to a shared
            box so wide wordmarks and square marks carry the same optical weight. */}
        <Marquee
          items={[
            {
              name: 'Stellantis Financial Services',
              src: '/images/logos/stellantis-fs.webp',
              href: 'https://www.stellantis-fs.com/',
              width: 178,
              height: 37,
            },
            {
              name: 'GreenSky',
              src: '/images/logos/greensky.webp',
              href: 'https://www.greensky.com/',
              width: 175,
              height: 46,
            },
            {
              name: 'Home Depot',
              src: '/images/logos/home-depot.webp',
              href: 'https://www.homedepot.com/',
              width: 46,
              height: 46,
            },
            {
              name: 'HD Supply',
              src: '/images/logos/hd-supply.webp',
              href: 'https://www.hdsupply.com/',
              width: 200,
              height: 27,
            },
            {
              name: 'KPMG',
              src: '/images/logos/kpmg.webp',
              href: 'https://www.kpmg.com/',
              width: 118,
              height: 46,
            },
            {
              name: 'Momnt',
              src: '/images/logos/momnt.webp',
              href: 'https://www.momnt.com/',
              width: 200,
              height: 36,
            },
            {
              name: 'Superior Contracting & Maintenance',
              src: '/images/logos/superior.webp',
              href: 'https://www.superior-maintenance.com',
              width: 200,
              height: 33,
            },
          ]}
        />
      </div>

      {twinOpen && (
        <Suspense fallback={null}>
          <DigitalTwin open={twinOpen} onClose={() => setTwinOpen(false)} />
        </Suspense>
      )}
    </section>
  );
};

export default Hero;
