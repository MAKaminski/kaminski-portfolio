// PostHog product analytics.
//
// This is the analytics layer that answers the questions the Vercel/GA setup
// couldn't: who visited, where they came from, and where they dropped off.
//   - Referrer / UTM / channel  -> captured automatically on every $pageview
//   - Country + city            -> resolved server-side from the request (GeoIP)
//   - Where they dropped off    -> $pageleave events + session replay + path analysis
//   - Who they are              -> anonymous person profiles, upgraded to a real
//                                  identity via identifyContact() when someone
//                                  submits the contact form
//
// Configuration lives in REACT_APP_POSTHOG_KEY rather than in this file. The
// PostHog project key is a public, write-only client-side key that ships in the
// JS bundle regardless, but secret scanning flags it when it is committed, and
// keeping it in the environment also lets the site be pointed at a different
// PostHog project without a code change. See .env.example.
//
// If the variable is unset, initPostHog() no-ops and a warning is logged rather
// than silently collecting nothing — the exact failure mode the pre-existing
// Google Analytics setup in this repo has been sitting in.
import posthog from 'posthog-js';

const POSTHOG_KEY = process.env.REACT_APP_POSTHOG_KEY;

// Events go straight to PostHog rather than through a same-origin reverse
// proxy. A /ingest -> PostHog rewrite is the usual way to stop content blockers
// eating analytics, but it does not work on this project: the site deploys as
// pure static output with no serverless runtime, so Vercel answers every POST
// to a rewritten path with 405 and only GETs get proxied. Since PostHog sends
// events by POST, that setup silently captures nothing. Losing blocked traffic
// beats losing all of it.
const POSTHOG_API_HOST = process.env.REACT_APP_POSTHOG_HOST || 'https://us.i.posthog.com';
const POSTHOG_UI_HOST = 'https://us.posthog.com';

let initialized = false;

export const initPostHog = (): void => {
  if (initialized || typeof window === 'undefined') return;

  if (!POSTHOG_KEY) {
    // Loud on purpose: a missing key means zero analytics, and the whole point
    // of this integration is to stop traffic going unattributed in silence.
    console.warn(
      '[analytics] REACT_APP_POSTHOG_KEY is not set — PostHog is disabled and no visitor data is being collected.'
    );
    return;
  }

  posthog.init(POSTHOG_KEY, {
    api_host: POSTHOG_API_HOST,
    ui_host: POSTHOG_UI_HOST,
    // Pageviews are sent manually from usePostHogPageviews so that SPA route
    // changes are recorded (the automatic one only fires on a hard load).
    capture_pageview: false,
    // $pageleave is what makes "where did they drop off" answerable — it closes
    // out each pageview so exit pages and bounces can be computed.
    capture_pageleave: true,
    autocapture: true,
    // Build a person profile for anonymous visitors too, not just identified
    // ones — otherwise a visitor who never fills in the form is invisible in
    // the Persons view.
    person_profiles: 'always',
    session_recording: {
      // Don't record what people type — the contact form carries an email
      // address and message body.
      maskAllInputs: true,
    },
    persistence: 'localStorage+cookie',
    // Keep localhost/preview noise out of the production numbers.
    loaded: (ph) => {
      if (process.env.NODE_ENV === 'development') ph.opt_out_capturing();
    },
  });

  initialized = true;
};

/** Record a pageview for an SPA route change. */
export const capturePageview = (path: string): void => {
  if (!initialized) return;
  posthog.capture('$pageview', {
    $current_url: window.location.origin + path,
    path,
  });
};

/** Track a named interaction (CTA click, download, etc.). */
export const captureEvent = (event: string, properties?: Record<string, unknown>): void => {
  if (!initialized) return;
  posthog.capture(event, properties);
};

/**
 * Attach a real identity to the current anonymous visitor. Called when someone
 * submits the contact form — this is what turns "anonymous visitor #4" into a
 * named person whose whole prior session history is now attributed to them.
 */
export const identifyContact = (email: string, name?: string): void => {
  if (!initialized || !email) return;
  posthog.identify(email, { email, ...(name ? { name } : {}) });
};

export default posthog;
