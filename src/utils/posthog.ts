/**
 * PostHog, gated on REACT_APP_POSTHOG_KEY exactly like GA4 is gated on
 * REACT_APP_GA_MEASUREMENT_ID: no key, no network call. Set the key in Vercel for
 * the Production environment only, so preview deployments never pollute the
 * project (CRA cannot see VERCEL_ENV). The SDK (~60 KB gz) is imported lazily on
 * an idle callback so it never sits in the first-paint bundle.
 */
import type { PostHog } from 'posthog-js';

let client: PostHog | null = null;
let loading: Promise<PostHog | null> | null = null;

export const POSTHOG_KEY = process.env.REACT_APP_POSTHOG_KEY;
export const POSTHOG_HOST = process.env.REACT_APP_POSTHOG_HOST || 'https://us.i.posthog.com';

const load = (): Promise<PostHog | null> => {
  if (!POSTHOG_KEY || typeof window === 'undefined') return Promise.resolve(null);
  if (!loading) {
    loading = import('posthog-js').then(({ default: posthog }) => {
      posthog.init(POSTHOG_KEY as string, {
        api_host: POSTHOG_HOST,
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

/** Fire-and-forget capture; queues behind the lazy import if it has not landed yet. */
export const captureEvent = (name: string, properties?: Record<string, unknown>) => {
  if (!POSTHOG_KEY) return;
  if (client) client.capture(name, properties);
  else void load().then((p) => p?.capture(name, properties));
};
