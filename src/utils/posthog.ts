// PostHog product analytics.
//
// Why this file exists: the site shipped no PostHog SDK at all — only Google
// Analytics (gated behind an env var that was never set) and Vercel Analytics.
// That is why posthog.com showed nothing for michael-kaminski.io: there was no
// ingestion problem to debug, because nothing was ever sending events.
//
// Initialized once at module load from `src/index.tsx`, before React renders,
// so the first `$pageview` of a session isn't lost to a race with mounting.
import posthog from 'posthog-js';

// REQUIRED. Set REACT_APP_POSTHOG_KEY in the Vercel project settings (and in
// .env.local for development). Without a usable value PostHog is skipped and
// the site records nothing.
//
// The key is not committed. PostHog project keys are write-only and public by
// design — this one ships to every visitor inside the JS bundle regardless —
// but the repo runs secret scanning, and a hardcoded `phc_…` trips it on every
// pull request. Keeping it in the environment is the cheaper trade: the failure
// mode it reintroduces (a missing variable) is handled loudly below, and the
// failure mode that actually bit this site (a *malformed* variable) is handled
// by normalizeKey.
const KEY_PATTERN = /^phc_[A-Za-z0-9]{20,}$/;

/**
 * Recover a usable key from an environment value.
 *
 * Not defensive programming for its own sake: production was deployed with
 * `REACT_APP_POSTHOG_KEY` set to the string
 * `"REACT_APP_POSTHOG_KEY = phc_…"` — the whole line from the setup docs was
 * pasted into the value box. A raw `init()` on that would have authenticated
 * against a key that doesn't exist and dropped every event, with the dashboard
 * looking identical to having no SDK at all. So: strip quotes, strip a leading
 * `NAME =` prefix, and require the result to actually look like a key before
 * trusting it.
 */
export const normalizeKey = (raw: string | undefined): string | null => {
  if (!raw) return null;

  let value = raw.trim();
  // Shell-style quoting survives a copy/paste out of a .env file.
  value = value.replace(/^['"]|['"]$/g, '').trim();
  // `NAME = value` / `NAME=value` — keep only what follows the last '='.
  if (value.includes('=')) value = value.slice(value.lastIndexOf('=') + 1).trim();
  value = value.replace(/^['"]|['"]$/g, '').trim();

  return KEY_PATTERN.test(value) ? value : null;
};

const resolveKey = (): string | null => {
  const raw = process.env.REACT_APP_POSTHOG_KEY;
  const normalized = normalizeKey(raw);

  if (normalized) return normalized;

  // Loud on purpose, and distinct per cause: a silently-skipped init is exactly
  // how this site ended up with no analytics for months.
  if (raw && raw.trim()) {
    // eslint-disable-next-line no-console
    console.error(
      '[analytics] REACT_APP_POSTHOG_KEY is set but no PostHog key could be ' +
        `read from it (expected \`phc_…\`, got ${JSON.stringify(raw.slice(0, 32))}…). ` +
        'PostHog is disabled. Set the value to the key alone — no variable ' +
        'name, no quotes.'
    );
  } else {
    // eslint-disable-next-line no-console
    console.error(
      '[analytics] REACT_APP_POSTHOG_KEY is not set — PostHog is disabled and ' +
        'no product analytics will be recorded. Set it in the Vercel project ' +
        'settings and redeploy (CRA inlines REACT_APP_* variables at build time).'
    );
  }

  return null;
};

// Where posthog-js sends events. Defaults to PostHog US cloud, matching the
// project's region. Set REACT_APP_POSTHOG_HOST to '/mk-relay' to route through
// the same-origin reverse proxy in vercel.json, which ad blockers don't
// recognise — see ANALYTICS_SETUP.md for the trade-off.
const POSTHOG_HOST = process.env.REACT_APP_POSTHOG_HOST || 'https://us.i.posthog.com';

// Keeps toolbar and session-replay links pointing at posthog.com rather than at
// this domain when api_host is a proxy path.
const POSTHOG_UI_HOST = 'https://us.posthog.com';

/**
 * Initialize PostHog. Safe to call more than once — React StrictMode double
 * invokes effects in development, and a second `init` would reset the session.
 */
export const initPostHog = (): void => {
  if (typeof window === 'undefined') return;
  if (posthog.__loaded) return;

  const key = resolveKey();
  if (!key) return;

  posthog.init(key, {
    api_host: POSTHOG_HOST,
    ui_host: POSTHOG_UI_HOST,
    // Opts into PostHog's current recommended defaults. Critically this sets
    // `capture_pageview: 'history_change'`, which is what makes pageviews work
    // in a react-router SPA. Without it PostHog records only the single
    // pageview from the initial document load, and every in-app navigation
    // (/writing, /cfo, /products, …) is invisible.
    defaults: '2026-05-30',
    // Clicks and inputs without hand-instrumenting each one, so the project has
    // usable data immediately rather than only on the few wired-up CTAs.
    autocapture: true,
    capture_pageleave: true,
    person_profiles: 'always',
    capture_exceptions: true,
    // Log captures to the console during `npm start` so the pipeline can be
    // verified locally. Events still send; PostHog's "filter out internal and
    // test users" setting keeps localhost traffic out of the dashboards while
    // leaving it visible in the event explorer.
    debug: process.env.NODE_ENV === 'development',
  });
};

/**
 * Capture a custom event. No-ops safely when init hasn't run (SSR, prerender,
 * tests) so call sites never need to guard.
 */
export const capturePostHog = (event: string, properties?: Record<string, any>): void => {
  if (typeof window === 'undefined' || !posthog.__loaded) return;
  posthog.capture(event, properties);
};

export default posthog;
