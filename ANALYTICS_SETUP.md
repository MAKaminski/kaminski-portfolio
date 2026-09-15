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
`Role Page Visited`, `Resume Downloaded`, `Digital Twin Opened`.

## Turning a layer on

Vercel → Project → Settings → Environment Variables. CRA only exposes variables prefixed
`REACT_APP_`, and they are baked in at build time, so redeploy after changing one.

- GA4: `REACT_APP_GA_MEASUREMENT_ID = G-…` (Production).
- PostHog: create a project for this site, copy its `phc_…` project token, set
  `REACT_APP_POSTHOG_KEY` for **Production only** — CRA cannot see `VERCEL_ENV`, so a key
  on Preview would send every branch deploy's traffic into the same project.

With a variable unset, that layer makes no network request at all.
