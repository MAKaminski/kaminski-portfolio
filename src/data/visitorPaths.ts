import type { ContactIntent } from './contactExperiments';

/**
 * The three routes through the site. Each one ends at the matching contact
 * experiment (src/data/contactExperiments.ts), so a visitor's path and their
 * eventual contact intent share one key and can be compared directly.
 *
 * Expected path, per visitor type:
 *   recruiter  → Start here → #experience → Resume Downloaded → Contact (recruiter)
 *   fractional → Start here → /projects (case study)          → Contact (fractional) / Calendar
 *   reader     → Start here → /writing (article)              → Newsletter Subscribed / Contact (reader)
 *
 * `Path Selected` records the choice; `Home Section Viewed` and pageviews
 * record how far each one got. The PostHog dashboard "Portfolio: visitor
 * paths" has one funnel per path.
 */
export interface VisitorPath {
  key: ContactIntent;
  label: string;
  blurb: string;
  cta: string;
  href: string;
}

export const VISITOR_PATHS: VisitorPath[] = [
  {
    key: 'recruiter',
    label: "I'm hiring full-time",
    blurb: 'Twenty years of roles, the deals, and the resume.',
    cta: 'See experience',
    href: '/#experience',
  },
  {
    key: 'fractional',
    label: 'I need fractional help',
    blurb: 'Case studies of agents shipped through review.',
    cta: 'See projects',
    href: '/projects',
  },
  {
    key: 'reader',
    label: "I'm here to read",
    blurb: 'Field notes on agent infrastructure and evals.',
    cta: 'Read the writing',
    href: '/writing',
  },
];
