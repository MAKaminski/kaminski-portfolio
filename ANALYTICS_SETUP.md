# Analytics

Three layers, all optional at build time, none hardcoded in the bundle.

| Layer | Where it initialises | Gate | What it gives |
|---|---|---|---|
| Vercel Analytics | `<Analytics />` in `src/App.tsx` | Always on (Vercel-hosted) | Page views + the custom events below, in the Vercel dashboard |
| Google Analytics 4 | `initGA()` from `src/utils/analytics.ts` | `REACT_APP_GA_MEASUREMENT_ID` | Search Console linkage, GA reports |
| PostHog | `initPostHog()` from `src/utils/posthog.ts` | `REACT_APP_POSTHOG_KEY` | Referrer report, funnels, web vitals; the SDK is imported lazily on idle and talks to the first-party `/ingest` proxy (see below) |

Custom events go through one helper, `track()` in `src/utils/track.ts`, which fans out to
Vercel Analytics and PostHog under the same event name:
`Calendar Link Clicked`, `Contact Form Submission`, `Contact Email Clicked`,
`Role Page Visited`, `Resume Downloaded`, `Digital Twin Opened`, plus the path and contact events below.

## Leads are stored server-side; analytics go through /ingest

Client-side analytics can be blocked. On 2026-09-24 a newsletter sign-up from Brave never
reached PostHog, because the only record of it was a posthog-js call to `us.i.posthog.com`,
which Brave Shields, uBlock and Safari content blockers drop. Two fixes:

- **`POST /api/lead`** (`api/lead.ts`) is the record of every newsletter sign-up and contact
  lead. It is same-origin, so blockers leave it alone, and it writes to PostHog from the
  server: `$identify` (distinct id = the email, linked to the browser's anonymous id when the
  page has one) and a `Lead Received` event (`kind`, `intent`, `variant`, `source`, `page`).
  It uses a different name from the client's `Contact Lead Captured` / `Newsletter Subscribed`
  so experiment metrics are not double-counted. It needs the project token as
  `POSTHOG_PROJECT_TOKEN`, or falls back to `REACT_APP_POSTHOG_KEY`, which Production
  already has. **To see every lead, filter PostHog for `Lead Received`.**
- **Lead emails** (`api/_lib/email.ts`). After `/api/lead` stores a lead it sends, through
  Resend from `notes@michael-kaminski.io` (verified domain): a confirmation to the lead (reply-to
  Michael) and a notification to Michael (reply-to the lead, with a PostHog person link). Needs
  `RESEND_API_KEY`: a send-only key restricted to michael-kaminski.io, set for Production only
  so preview deploys never email anyone. Optional overrides: `LEAD_FROM_EMAIL`,
  `LEAD_NOTIFY_EMAIL`. An address gets at most one confirmation per kind per UTC day (Resend
  Idempotency-Key), so the public form cannot be used to flood someone's inbox. Email failures
  are logged and never fail the request; the lead is already stored.
- **`/ingest/*`** is a reverse proxy to PostHog US, defined in `vercel.json` ahead of the
  filesystem handler. posthog-js uses it as `api_host`, so the analytics events that feed the
  experiments and path funnels are no longer dropped by blockers either.

## Visitor paths

The home page forks right under the hero ("Start here") into three paths. Each path uses the
same key as the contact experiment it ends at, so the path someone chose and the intent they
later pick can be compared directly. Config lives in `src/data/visitorPaths.ts`.

| Path | Start here card → | Expected next step | Converts at |
|---|---|---|---|
| `recruiter` | `#experience` | `Resume Downloaded` | `Contact Lead Captured` (intent=recruiter) |
| `fractional` | `/projects` | case study pageview | `Contact Lead Captured` (intent=fractional) or `Calendar Link Clicked` |
| `reader` | `/writing` | article pageview | `Newsletter Subscribed` or `Contact Lead Captured` (intent=reader) |

Behaviour events:

| Event | Properties | Answers |
|---|---|---|
| `Path Selected` | `path`, `destination` | Which kind of visitor this is, before they share anything. Also sets person properties `visitor_path` / `first_visitor_path`. |
| `Home Section Viewed` | `section` (`hero`, `track_record`, `experience`, `skills`, `testimonials`, `contact`) | Scroll depth: how far down the home page people get. Fires once per section per page load. |
| `Section Expanded` | `section`, `item` | Which collapsed detail people open (deal table, full timeline, a Q&A, a skills area, a long review). |
| `Nav Clicked` | `item`, `location` (`header`, `mobile_menu`, `footer`) | Where people go from the navigation. |
| `Contact Direct Clicked` | `channel` (`email`, `phone`, `linkedin`) | Who skips the picker and reaches out directly. |
| `Newsletter Subscribed` | `source`, `page` | Footer sign-ups; identifies the person with `newsletter_subscribed: true`. Until 2026-09-24 this form only pretended to save. |

The PostHog dashboard "Portfolio: visitor paths" charts these. `$pageview` tiles filter to
`$host = www.michael-kaminski.io` because the project is shared with other sites.

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
