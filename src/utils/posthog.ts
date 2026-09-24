/**
 * PostHog, gated on REACT_APP_POSTHOG_KEY exactly like GA4 is gated on
 * REACT_APP_GA_MEASUREMENT_ID: no key, no network call. Traffic goes through the
 * first-party /ingest proxy defined in vercel.json. Set the key in Vercel for
 * the Production environment only, so preview deployments never pollute the
 * project (CRA cannot see VERCEL_ENV). The SDK (~60 KB gz) is imported lazily on
 * an idle callback so it never sits in the first-paint bundle.
 */
import type { PostHog } from 'posthog-js';

let client: PostHog | null = null;
let loading: Promise<PostHog | null> | null = null;

export const POSTHOG_KEY = process.env.REACT_APP_POSTHOG_KEY;
// Same-origin reverse proxy (vercel.json routes /ingest/* to PostHog US). Talking
// to us.i.posthog.com directly meant Brave Shields, uBlock and Safari content
// blockers silently dropped every event, including lead sign-ups.
export const POSTHOG_HOST = '/ingest';

const load = (): Promise<PostHog | null> => {
  if (!POSTHOG_KEY || typeof window === 'undefined') return Promise.resolve(null);
  if (!loading) {
    loading = import('posthog-js').then(({ default: posthog }) => {
      posthog.init(POSTHOG_KEY as string, {
        api_host: POSTHOG_HOST,
        ui_host: 'https://us.posthog.com',
        capture_pageview: 'history_change',
        capture_pageleave: true,
        persistence: 'localStorage+cookie',
        disable_session_recording: true,
        autocapture: false,
      });
      client = posthog;
      return posthog;
    });
  }
  return loading;
};

/** Call once after mount. Defers the SDK download until the main thread is idle. */
export const initPostHog = () => {
  if (!POSTHOG_KEY || typeof window === 'undefined') return;
  const w = window as Window & { requestIdleCallback?: (cb: () => void) => number };
  if (typeof w.requestIdleCallback === 'function') w.requestIdleCallback(() => void load());
  else setTimeout(() => void load(), 1);
};

/**
 * Ties the anonymous visitor to an email once they hand one over (the contact
 * form). This is what turns pageviews into a person record in PostHog's CRM.
 */
export const identifyVisitor = (email: string, properties?: Record<string, unknown>) => {
  if (!POSTHOG_KEY || !email) return;
  const id = email.trim().toLowerCase();
  const run = (p: PostHog) => p.identify(id, { email: id, ...properties });
  if (client) run(client);
  else void load().then((p) => p && run(p));
};

/**
 * Tags the (still anonymous) visitor with a person property, so "who said what
 * they wanted" is queryable before, and without, anyone typing an email.
 */
export const setVisitorProperties = (
  properties: Record<string, unknown>,
  setOnce?: Record<string, unknown>,
) => {
  if (!POSTHOG_KEY) return;
  const run = (p: PostHog) => p.setPersonProperties(properties, setOnce);
  if (client) run(client);
  else void load().then((p) => p && run(p));
};

/**
 * Resolves an experiment's variant for this visitor. Calling getFeatureFlag is
 * what records the `$feature_flag_called` exposure, so only call this at the
 * moment the variant is actually shown. Resolves null (render control, no
 * exposure recorded) when PostHog is off or flags have not arrived in time.
 */
export const getExperimentVariant = (flagKey: string, timeoutMs = 1500): Promise<string | null> => {
  if (!POSTHOG_KEY || typeof window === 'undefined') return Promise.resolve(null);
  return new Promise((resolve) => {
    let done = false;
    const finish = (v: string | null) => {
      if (done) return;
      done = true;
      resolve(v);
    };
    const timer = setTimeout(() => finish(null), timeoutMs);
    void load().then((p) => {
      if (!p) return finish(null);
      p.onFeatureFlags(() => {
        if (done) return;
        clearTimeout(timer);
        const v = p.getFeatureFlag(flagKey);
        finish(typeof v === 'string' ? v : null);
      });
    });
  });
};

/**
 * The browser's anonymous PostHog id, when the SDK has loaded. /api/lead sends it
 * with the lead so the server-side identify joins this visitor's earlier
 * pageviews. Undefined when PostHog is off or blocked; the lead still lands.
 */
export const getAnonymousId = (): string | undefined => {
  try {
    return client?.get_distinct_id() || undefined;
  } catch {
    return undefined;
  }
};

/** Fire-and-forget capture; queues behind the lazy import if it has not landed yet. */
export const captureEvent = (name: string, properties?: Record<string, unknown>) => {
  if (!POSTHOG_KEY) return;
  if (client) client.capture(name, properties);
  else void load().then((p) => p?.capture(name, properties));
};
