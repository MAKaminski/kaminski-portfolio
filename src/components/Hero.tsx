import React from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Download, Clock, ArrowUpRight, Linkedin, Github } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { track } from '@vercel/analytics';
import { captureEvent } from '../utils/posthog';
import { useTheme } from '../App';
import { Role } from '../App';
import Marquee from './Marquee';
import CountUp from './CountUp';
import SplitReveal from './SplitReveal';
import Magnetic from './Magnetic';

const RILLA_EASE = [0.445, 0.05, 0.55, 0.95] as const;

const Hero: React.FC = () => {
  const { setTheme, currentRole } = useTheme();
  const navigate = useNavigate();
  const { scrollY } = useScroll();
  const yGlow = useTransform(scrollY, [0, 700], [0, 160]);
  const yPortrait = useTransform(scrollY, [0, 700], [0, -70]);
  const yGrid = useTransform(scrollY, [0, 700], [0, 80]);

  const roles: { key: Role; label: string }[] = [
    { key: 'cfo', label: 'CFO' },
    { key: 'cpo', label: 'CPO' },
    { key: 'strategy', label: 'Strategy' },
    { key: 'technology', label: 'Technology' },
    { key: 'revenue', label: 'Revenue' },
  ];

  const stats = [
    { to: 20, suffix: '+', label: 'Years across finance & engineering' },
    { to: 3, suffix: '', label: 'Successful exits' },
    { prefix: '$', to: 10.8, decimals: 1, suffix: 'B+', label: 'Transactions led' },
  ];

  const handleRoleClick = (role: Role, path: string) => {
    setTheme(role);
    navigate(path);
    track('Role Page Visited', { role, path });
    captureEvent('role_page_visited', { role, path });
  };

  return (
    <section className="relative overflow-hidden bg-ink-900 text-white pt-28 pb-16">
      {/* Spotlight + grid backdrop (parallax) */}
      <div className="pointer-events-none absolute inset-0">
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
            <motion.p
              className="mb-5 flex items-center gap-3 text-sm font-semibold tracking-[0.2em] text-white/60 uppercase"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: RILLA_EASE }}
            >
              <span className="h-2 w-2 rounded-full bg-accent" />
              Michael Kaminski · Atlanta
            </motion.p>

            <h1 className="display text-[15vw] leading-[0.86] sm:text-7xl lg:text-8xl xl:text-[6.4rem]">
              <SplitReveal
                immediate
                delay={0.15}
                lines={[
                  'Fintech',
                  <>Finance <span className="accent">+</span> Engineering</>,
                  'Leader',
                ]}
              />
            </h1>

            <motion.p
              className="mt-7 max-w-xl text-lg text-white/70"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, ease: RILLA_EASE, delay: 0.5 }}
            >
              Fluent in both the boardroom and the codebase. I build the financial model a
              private-equity board expects — and ship the software that runs the product.
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
                  onClick={() => {
                    track('Calendar Link Clicked', { source: 'Hero' });
                    captureEvent('calendar_link_clicked', { source: 'Hero' });
                  }}
                  className="btn-pill-accent text-base"
                >
                  <Clock className="w-5 h-5" /> Book a Call
                </a>
              </Magnetic>
              <Magnetic>
                <a
                  href="/docs/Kaminski Resume.pdf"
                  download="Kaminski_Resume.pdf"
                  onClick={() => {
                    track('Resume Downloaded', { source: 'Hero' });
                    captureEvent('resume_downloaded', { source: 'Hero' });
                  }}
                  className="btn-pill-ghost text-base"
                >
                  <Download className="w-5 h-5" /> Resume
                </a>
              </Magnetic>
              <div className="flex items-center gap-2 pl-1">
                <Magnetic strength={0.5}>
                  <a href="https://www.linkedin.com/in/michaelxaxkaminski/" target="_blank" rel="noopener noreferrer"
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

            {/* Stats */}
            <motion.div
              className="mt-12 grid grid-cols-3 gap-6 max-w-xl"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: RILLA_EASE, delay: 0.7 }}
            >
              {stats.map((s, i) => (
                <div key={i}>
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
              <div className="absolute -inset-3 rounded-[26px] bg-accent/20 blur-2xl" />
              <motion.div
                initial={{ clipPath: 'inset(100% 0% 0% 0%)' }}
                animate={{ clipPath: 'inset(0% 0% 0% 0%)' }}
                transition={{ duration: 1, ease: RILLA_EASE, delay: 0.35 }}
                className="relative"
              >
                <picture>
                  <source srcSet="/images/484D0082-4587-4FEF-AE4B-E727C7BF176B_1_105_c.webp" type="image/webp" />
                  <img
                    src="/images/484D0082-4587-4FEF-AE4B-E727C7BF176B_1_105_c.jpeg"
                    alt="Michael Kaminski"
                    width={440}
                    height={520}
                    decoding="async"
                    className="w-full rounded-[22px] object-cover border-4 border-accent shadow-2xl"
                  />
                </picture>
              </motion.div>
              <motion.div
                className="absolute -bottom-4 -left-4 rounded-full bg-accent px-5 py-2 text-sm font-bold text-ink-900 shadow-lg"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, ease: RILLA_EASE, delay: 1 }}
              >
                Open to fractional & full-time
              </motion.div>
            </motion.div>

            {/* Role selector */}
            <motion.div
              className="mt-10"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: RILLA_EASE, delay: 0.8 }}
            >
              <p className="mb-3 text-center text-xs font-semibold uppercase tracking-[0.2em] text-white/55">
                View by role
              </p>
              <div className="flex flex-wrap justify-center gap-2">
                {roles.map((role) => (
                  <button
                    key={role.key}
                    onClick={() => handleRoleClick(role.key, `/${role.key}`)}
                    className={`inline-flex items-center gap-1 rounded-full border px-4 py-2 text-sm font-semibold transition ${
                      currentRole === role.key
                        ? 'border-accent bg-accent text-ink-900'
                        : 'border-white/15 text-white/80 hover:border-accent hover:text-accent'
                    }`}
                  >
                    {role.label} <ArrowUpRight className="w-3.5 h-3.5" />
                  </button>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Company marquee (scroll-velocity skew) */}
      <div className="relative mt-16 border-y border-white/10 py-6">
        <Marquee items={['GreenSky', 'Home Depot', 'HD Supply', 'KPMG', 'Momnt', 'Property Walk']} />
      </div>
    </section>
  );
};

export default Hero;
