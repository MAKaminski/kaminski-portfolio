/**
 * The contact section asks one question first — "what brings you here?" — and
 * only then asks for anything personal. Each answer is its own PostHog
 * experiment testing how little we can ask for and still get a lead.
 *
 * Funnel, same event names for every intent (properties: intent, variant):
 *   Contact Intent Selected  → interested (one click, no typing)
 *   Contact Ask Started      → engaged with the ask (first focus / click)
 *   Contact Lead Captured    → willing to share (email handed over, or calendar opened)
 *
 * The flag keys must match the experiments in PostHog. A visitor whose flag has
 * not loaded sees `control` and records no exposure.
 */
export type ContactIntent = 'fractional' | 'recruiter' | 'reader';

export interface ContactExperiment {
  intent: ContactIntent;
  flagKey: string;
  label: string;
  blurb: string;
  control: string;
  test: string;
}

export const CONTACT_EXPERIMENTS: ContactExperiment[] = [
  {
    intent: 'fractional',
    flagKey: 'contact-fractional-ask',
    label: 'I need fractional help',
    blurb: 'Agent product, evals, or getting one through review — part-time or project-based.',
    // control: email + one line on what they are building
    // test: straight to a 15-minute calendar slot, email as the fallback
    control: 'short_form',
    test: 'calendar_first',
  },
  {
    intent: 'recruiter',
    flagKey: 'contact-recruiter-ask',
    label: "I'm hiring full-time",
    blurb: 'Recruiter or hiring manager with a senior product role.',
    // control: email + role link/title
    // test: email only, resume handed over on submit
    control: 'email_and_role',
    test: 'email_only',
  },
  {
    intent: 'reader',
    flagKey: 'contact-reader-ask',
    label: 'Just send me the field notes',
    blurb: 'New writing on agent infrastructure when it ships. Nothing else.',
    // control: email field visible immediately
    // test: one-click "keep me posted" first, then the field (micro-commitment)
    control: 'inline_email',
    test: 'two_step',
  },
];

export const CALENDLY_URL = 'https://calendly.com/kaminski1337/15min';
