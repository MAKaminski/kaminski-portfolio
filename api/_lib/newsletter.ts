/**
 * The "Field notes" newsletter: a Resend segment plus broadcasts.
 *
 * Sign-ups from the footer (kind = newsletter) are added to the segment by
 * /api/lead. /api/cron/announce sends one broadcast per new article to it.
 * Resend owns unsubscribes: every broadcast carries {{{RESEND_UNSUBSCRIBE_URL}}},
 * and an unsubscribed contact is skipped by every later broadcast.
 *
 * Contacts and broadcasts need a full-access key, which is why this uses
 * RESEND_NEWSLETTER_KEY rather than the send-only RESEND_API_KEY used for the
 * one-to-one lead emails. It never leaves the server.
 *
 * Env: RESEND_NEWSLETTER_KEY, RESEND_SEGMENT_ID.
 */

const API = 'https://api.resend.com';

export const newsletterConfig = () => {
  const key = process.env.RESEND_NEWSLETTER_KEY;
  const segmentId = process.env.RESEND_SEGMENT_ID;
  return key && segmentId ? { key, segmentId } : null;
};

export const resend = (key: string, path: string, init: { method?: string; body?: unknown } = {}) =>
  fetch(`${API}${path}`, {
    method: init.method || 'GET',
    headers: { Authorization: `Bearer ${key}`, 'Content-Type': 'application/json' },
    ...(init.body !== undefined ? { body: JSON.stringify(init.body) } : {}),
  });

/**
 * Adds a sign-up to the segment. Creating the contact covers a new address;
 * when it already exists (earlier sign-up, or a contact lead), it is added to
 * the segment instead. A contact who unsubscribed stays unsubscribed: this
 * never flips that flag back. Best-effort, never throws.
 */
export async function subscribe(email: string): Promise<boolean> {
  const cfg = newsletterConfig();
  if (!cfg) return false;
  try {
    const created = await resend(cfg.key, '/contacts', {
      method: 'POST',
      body: { email, unsubscribed: false, segments: [{ id: cfg.segmentId }] },
    });
    if (created.ok) return true;
    const added = await resend(cfg.key, `/contacts/${encodeURIComponent(email)}/segments/${cfg.segmentId}`, {
      method: 'POST',
    });
    if (!added.ok) console.error('newsletter subscribe failed', created.status, added.status, await added.text().catch(() => ''));
    return added.ok;
  } catch (e) {
    console.error('newsletter subscribe threw', e);
    return false;
  }
}
