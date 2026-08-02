// PostHog product analytics.
//
// Why this file exists: the site previously shipped *no* PostHog SDK at all —
// only Google Analytics (gated behind an env var that isn't set) and Vercel
// Analytics. That's why posthog.com showed nothing for this domain: nothing was
// ever sending events, so there was no ingestion problem to debug.
//
// PostHog is initialized once, at module load, from `src/index.tsx` — before
// React renders — so the very first `$pageview` of a session isn't dropped.
import posthog from 'posthog-js';

// REQUIRED. Set REACT_APP_POSTHOG_KEY in the Vercel project settings (and in
// .env.local for development) — without it PostHog is skipped entirely and the
// site sends no product analytics.
//
// The value is a PostHog *project* key (`phc_…`). Those are public by design —
// write-only, and served to every visitor inside the JS bundle — but they're
// read from the environment rather than committed so the repo's secret scanning
// stays clean and the project can be swapped without a code change.
const POSTHOG_KEY = process.env.REACT_APP_POSTHOG_KEY;

// Defaults to talking to PostHog US cloud directly. Set REACT_APP_POSTHOG_HOST
// to '/mk-relay' to route events through the same-origin reverse proxy defined
// in vercel.json, which ad blockers don't recognise (typically recovers 10-30%
// of otherwise-dropped events). See ANALYTICS_SETUP.md.
const POSTHOG_HOST = process.env.REACT_APP_POSTHOG_HOST || 'https://us.i.posthog.com';

// Where the PostHog app itself lives. Only meaningful when api_host is a proxy
// path — it keeps toolbar/replay links pointing at posthog.com rather than at
// this domain.
const POSTHOG_UI_HOST = 'https://us.posthog.com';

/**
 * Initialize PostHog. Safe to call more than once — React StrictMode double
 * invokes effects in development, and a second `init` would otherwise reset
 * the session.
 */
export const initPostHog = (): void => {
  if (typeof window === 'undefined') return;
  if (posthog.__loaded) return;

  if (!POSTHOG_KEY) {
    // Loud on purpose: a silently-skipped init is exactly how the site ended up
    // with no analytics in the first place.
    // eslint-disable-next-line no-console
    console.warn(
      '[analytics] REACT_APP_POSTHOG_KEY is not set — PostHog is disabled and no ' +
        'product analytics will be recorded. Set it in the Vercel project settings ' +
        'and redeploy (CRA inlines REACT_APP_* variables at build time).'
    );
    return;
  }

  posthog.init(POSTHOG_KEY, {
    api_host: POSTHOG_HOST,
    ui_host: POSTHOG_UI_HOST,
    // Opts into PostHog's current recommended defaults. Critically this sets
    // `capture_pageview: 'history_change'`, which is what makes pageviews work
    // in a react-router SPA — without it PostHog only ever records the single
    // pageview from the initial document load, and every in-app navigation
    // (/writing, /cfo, /products, …) is invisible.
    defaults: '2026-05-30',
    // Capture clicks/inputs automatically so there's useful data immediately,
    // rather than only on the handful of hand-instrumented CTAs.
    autocapture: true,
    capture_pageleave: true,
    person_profiles: 'always',
    // Surface front-end errors in PostHog error tracking.
    capture_exceptions: true,
    // Log every capture to the console during `npm start`, so the pipeline can
    // be verified locally. Local events are still *sent* — PostHog's built-in
    // "filter out internal and test users" setting keeps localhost traffic out
    // of the dashboards, while leaving it visible in the activity/event
    // explorer for debugging.
    debug: process.env.NODE_ENV === 'development',
  });
};

/**
 * Capture a custom event. No-ops safely if init hasn't run (e.g. SSR/tests) so
 * call sites never need to guard.
 */
export const capturePostHog = (event: string, properties?: Record<string, any>): void => {
  if (typeof window === 'undefined' || !posthog.__loaded) return;
  posthog.capture(event, properties);
};

export default posthog;
