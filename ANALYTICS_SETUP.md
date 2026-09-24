# Analytics

Three layers, all optional at build time, none hardcoded in the bundle.

| Layer | Where it initialises | Gate | What it gives |
|---|---|---|---|
| Vercel Analytics | `<Analytics />` in `src/App.tsx` | Always on (Vercel-hosted) | Page views + the custom events below, in the Vercel dashboard |
| Google Analytics 4 | `initGA()` from `src/utils/analytics.ts` | `REACT_APP_GA_MEASUREMENT_ID` | Search Console linkage, GA reports |
| PostHog | `initPostHog()` from `src/utils/posthog.ts` | `REACT_APP_POSTHOG_KEY` (+ optional `REACT_APP_POSTHOG_HOST`, default `https://us.i.posthog.com`) | Referrer report, funnels, web vitals; the SDK is imported lazily on idle |

Custom events go through one helper, `track()` in `src/utils/track.ts`, which fans out to
Vercel Analytics and PostHog under the same event name:
`Calendar Link Clicked`, `Contact Form Submission`, `Contact Email Clicked`,
`Role Page Visited`, `Resume Downloaded`, `Digital Twin Opened`, plus the contact funnel below.

## Contact experiments

The contact section's first question is "what brings you here?" — one click, no typing. Each
answer is a PostHog experiment (running since 2026-09-24) on how little we can ask for:

| Intent | Flag / experiment | control | test |
|---|---|---|---|
| Fractional | `contact-fractional-ask` | email + one line on what they're building | `calendar_first`: 15-min Calendly first, email as fallback |
| Recruiter (full-time) | `contact-recruiter-ask` | email + role link/title | `email_only`: email alone, resume on submit |
| Reader | `contact-reader-ask` | email field shown immediately | `two_step`: "Keep me posted" click, then the field |

Funnel events, all with `intent` and `variant` properties:
`Contact Intent Selected` (interested) → `Contact Ask Started` → `Contact Lead Captured`
(`method`: `form` or `calendar`; willing to share). Picking an intent also sets the person
properties `contact_intent` / `first_contact_intent` before any email exists; submitting an
email identifies the person. Exposure (`$feature_flag_called`) fires only when the ask is
shown, so each experiment's denominator is people who chose that intent. Config lives in
`src/data/contactExperiments.ts`.

## Turning a layer on

Vercel → Project → Settings → Environment Variables. CRA only exposes variables prefixed
`REACT_APP_`, and they are baked in at build time, so redeploy after changing one.

- GA4: `REACT_APP_GA_MEASUREMENT_ID = G-…` (Production).
- PostHog: create a project for this site, copy its `phc_…` project token, set
  `REACT_APP_POSTHOG_KEY` for **Production only** — CRA cannot see `VERCEL_ENV`, so a key
  on Preview would send every branch deploy's traffic into the same project.

With a variable unset, that layer makes no network request at all.
