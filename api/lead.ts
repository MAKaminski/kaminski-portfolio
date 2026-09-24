/**
 * POST /api/lead — the durable copy of every newsletter sign-up and contact lead.
 *
 * The browser also reports these through posthog-js, but that call is exactly
 * what Brave Shields, uBlock and Safari content blockers drop, so on its own a
 * lead could vanish without a trace (one did, on 2026-09-24). This endpoint is
 * same-origin, so blockers leave it alone, and it writes to PostHog from the
 * server:
 *
 *   $identify     distinct_id = the email, linked to the browser's anonymous id
 *                 when the page could read one, so earlier pageviews join up
 *   Lead Received kind, intent, variant, source, page (server-side record)
 *
 * kind is newsletter, contact, or resume (the "email me a copy" field next to the
 * resume download; that confirmation carries the PDF link).
 *
 * `Lead Received` is deliberately a different name from the client's
 * `Contact Lead Captured` / `Newsletter Subscribed`, so experiment metrics that
 * count the client events are not double-counted.
 *
 * After storing it, sends a confirmation to the lead and a notification to
 * Michael through Resend (see _lib/email.ts); skipped when RESEND_API_KEY is unset.
 *
 * Needs the PostHog project token, which is the same public `phc_` value the
 * front end uses: POSTHOG_PROJECT_TOKEN, falling back to REACT_APP_POSTHOG_KEY.
 */
import { rateLimit, type ApiRequest, type ApiResponse } from './_lib/http';
import { sendLeadEmails } from './_lib/email';
import { subscribe } from './_lib/newsletter';

const CAPTURE_HOST = process.env.POSTHOG_CAPTURE_HOST || 'https://us.i.posthog.com';
const KINDS = new Set(['newsletter', 'contact', 'resume']);
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const str = (v: unknown, max = 300): string | undefined =>
  typeof v === 'string' && v.trim() ? v.trim().slice(0, max) : undefined;

export default async function handler(req: ApiRequest, res: ApiResponse) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
  if (!rateLimit(req, 10, 60_000)) return res.status(429).json({ error: 'Slow down a moment and try again.' });

  const token = process.env.POSTHOG_PROJECT_TOKEN || process.env.REACT_APP_POSTHOG_KEY;
  if (!token) return res.status(503).json({ error: 'Lead capture is not configured.', code: 'not_configured' });

  let body = req.body as Record<string, unknown> | string | undefined;
  if (typeof body === 'string') {
    try {
      body = JSON.parse(body);
    } catch {
      body = undefined;
    }
  }
  const b = (body || {}) as Record<string, unknown>;

  const email = str(b.email, 254)?.toLowerCase();
  const kind = str(b.kind, 20);
  if (!email || !EMAIL.test(email)) return res.status(400).json({ error: 'A valid email is required.' });
  if (!kind || !KINDS.has(kind)) return res.status(400).json({ error: 'Unknown lead kind.' });

  const anonId = str(b.anonymous_id, 200);
  const props = {
    kind,
    intent: str(b.intent, 40),
    variant: str(b.variant, 40),
    source: str(b.source, 60),
    page: str(b.page, 200),
  };
  const personSet = {
    email,
    ...(kind === 'newsletter'
      ? { newsletter_subscribed: true }
      : kind === 'resume'
        ? { resume_requested: true }
        : { contact_intent: props.intent }),
    ...(str(b.detail, 500) ? { contact_detail: str(b.detail, 500) } : {}),
  };
  const timestamp = new Date().toISOString();

  const batch = [
    {
      event: '$identify',
      timestamp,
      properties: {
        distinct_id: email,
        ...(anonId && anonId !== email ? { $anon_distinct_id: anonId } : {}),
        $set: personSet,
        $lib: 'portfolio-api',
      },
    },
    {
      event: 'Lead Received',
      timestamp,
      properties: { distinct_id: email, ...props, $set: personSet, $lib: 'portfolio-api' },
    },
  ];

  try {
    const r = await fetch(`${CAPTURE_HOST}/batch/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ api_key: token, batch }),
    });
    if (!r.ok) return res.status(502).json({ error: 'Could not record the lead.', code: 'upstream' });
  } catch {
    return res.status(502).json({ error: 'Could not record the lead.', code: 'upstream' });
  }

  // Stored first, emailed second: a Resend outage never loses the lead.
  // Newsletter sign-ups also join the "Field notes" segment that article
  // broadcasts go to (see _lib/newsletter.ts and cron/announce.ts).
  const [emailed, listed] = await Promise.all([
    sendLeadEmails({ ...props, email, detail: str(b.detail, 500) }),
    kind === 'newsletter' ? subscribe(email) : Promise.resolve(undefined),
  ]);

  return res.status(200).json({ ok: true, emailed: emailed ?? 'not_configured', ...(listed !== undefined ? { listed } : {}) });
}
