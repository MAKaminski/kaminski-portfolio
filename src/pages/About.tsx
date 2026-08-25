import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';
import Seo from '../components/Seo';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { aboutParagraphs } from '../data/about';
import { jobTimeline } from '../data/experience';
import { transactionTotals } from '../data/transactions';

const SITE_URL = 'https://www.michael-kaminski.io';

/**
 * The About page exists for two findings in the same audit: `has_personal_voice:
 * false`, and "role history and progression not visible" — the home page had an
 * Experience heading but the crawler never saw dates or titles under it.
 */
const About: React.FC = () => {
  const totals = transactionTotals();

  return (
    <div className="min-h-screen bg-ink-900">
      <Seo
        title="About Michael Kaminski — Technical Product Manager, Agent Layer"
        description="How I got from corporate finance to agent infrastructure, and why the two halves turn out to be the same job. Full role history with dates."
        canonicalPath="/about"
        breadcrumbName="About"
        jsonLd={{
          '@context': 'https://schema.org',
          '@type': 'AboutPage',
          name: 'About Michael Kaminski',
          url: `${SITE_URL}/about`,
          mainEntity: { '@id': `${SITE_URL}/#person` },
        }}
      />
      <Header />

      <main className="section-padding pt-32">
        <div className="mx-auto max-w-3xl px-4">
          <h1 className="mb-4 text-4xl font-bold text-white sm:text-5xl">About</h1>
          <p className="mb-10 text-lg text-white/60">
            Technical product manager at the agent layer. Atlanta, relocating to New York City.
          </p>

          <div className="mb-14 space-y-5">
            {aboutParagraphs.map((para) => (
              <p key={para.slice(0, 40)} className="text-lg leading-relaxed text-white/75">
                {para}
              </p>
            ))}
          </div>

          <h2 className="mb-6 text-2xl font-bold text-white">Where I've worked</h2>
          <ol className="mb-14 space-y-6">
            {jobTimeline.map((job) => (
              <li key={job.company + job.period} className="border-l-2 border-accent/40 pl-5">
                <div className="mb-1 flex flex-wrap items-baseline gap-x-3">
                  <h3 className="text-lg font-bold text-white">
                    {job.link ? (
                      <a href={job.link} target="_blank" rel="noopener noreferrer" className="hover:text-accent">
                        {job.company}
                      </a>
                    ) : (
                      job.company
                    )}
                  </h3>
                  <span className="text-white/70">{job.title}</span>
                  <time className="text-sm text-white/40">{job.period}</time>
                </div>
                <p className="text-white/60">{job.description}</p>
                {job.exit && <p className="mt-1 text-sm italic text-white/45">{job.exit}</p>}
              </li>
            ))}
          </ol>

          <h2 className="mb-4 text-2xl font-bold text-white">The finance half, in numbers</h2>
          <p className="mb-14 text-white/70">
            {totals.count} named transactions totalling ${totals.totalM.toLocaleString()}M —{' '}
            {totals.headline} — across equity, debt, an IPO and a $4,000M share repurchase. Every
            one is listed with its date, counterparty and instrument on the{' '}
            <Link to="/" className="font-semibold text-accent hover:underline">
              home page
            </Link>
            .
          </p>

          <div className="rilla-card p-8">
            <h2 className="mb-3 text-xl font-bold text-white">Working on something at the agent layer?</h2>
            <p className="mb-5 text-white/70">
              I'm looking for senior product roles on agent platforms and agent infrastructure —
              open to fractional and full-time.
            </p>
            <div className="flex flex-wrap gap-4">
              <a
                href="https://calendly.com/kaminski1337/15min"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-full bg-accent px-6 py-3 font-bold text-ink-900 transition-all hover:brightness-90"
              >
                Book a Call <ArrowUpRight size={16} />
              </a>
              <Link
                to="/projects"
                className="inline-flex items-center gap-2 rounded-full border-2 border-white/25 px-6 py-3 font-semibold text-white transition-all hover:bg-white hover:text-ink-900"
              >
                See the case studies
              </Link>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default About;
