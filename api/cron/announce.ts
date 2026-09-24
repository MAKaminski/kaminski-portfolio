/**
 * GET /api/cron/announce — emails the newsletter segment when an article ships.
 *
 * Runs once a day from Vercel Cron (vercel.json). Each run:
 *   1. takes articles dated from ANNOUNCE_FROM through today, within the last
 *      LOOKBACK_DAYS, oldest first;
 *   2. drops any already announced (a broadcast named `article:<slug>` exists);
 *   3. checks the first remaining one is actually live (its page returns 200,
 *      so a merged-but-not-deployed article waits for tomorrow);
 *   4. creates and sends one broadcast for it.
 *
 * At most one broadcast per run, so a backlog trickles out a day at a time
 * rather than landing as a burst. ANNOUNCE_FROM keeps the articles that
 * predate the newsletter from being sent to people who just signed up.
 *
 * Auth: Vercel Cron sends `Authorization: Bearer $CRON_SECRET`. Without the
 * secret configured the endpoint refuses to run. `?dry=1` reports what it
 * would send without sending.
 */
import type { ApiRequest, ApiResponse } from '../_lib/http';
import { newsletterConfig, resend } from '../_lib/newsletter';
import { articles, type Article } from '../../src/data/articles';

const SITE = 'https://www.michael-kaminski.io';
const FROM = process.env.NEWSLETTER_FROM_EMAIL || 'Michael Kaminski <notes@michael-kaminski.io>';
const REPLY_TO = process.env.LEAD_NOTIFY_EMAIL || 'mkaminski1337@gmail.com';
/** The newsletter launched 2026-09-24; nothing dated before the day after is announced. */
export const ANNOUNCE_FROM = '2026-09-25';
const LOOKBACK_DAYS = 7;

const esc = (s: string) =>
  s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

const broadcastName = (slug: string) => `article:${slug}`;

/** Articles eligible today, oldest first. Exported for tests. */
export function eligible(all: Article[], today: string): Article[] {
  const floor = new Date(`${today}T00:00:00Z`);
  floor.setUTCDate(floor.getUTCDate() - LOOKBACK_DAYS);
  const from = [ANNOUNCE_FROM, floor.toISOString().slice(0, 10)].sort()[1];
  return all.filter((a) => a.date >= from && a.date <= today).sort((a, b) => a.date.localeCompare(b.date));
}

/** The email for one article. Exported for tests. */
export function renderArticleEmail(a: Article) {
  const url = `${SITE}/writing/${a.slug}?utm_source=newsletter&utm_medium=email&utm_campaign=${encodeURIComponent(a.slug)}`;
  const text = [
    a.title,
    a.description,
    `Read it (${a.readMinutes} min): ${url}`,
    '— Michael',
    "You're getting this because you signed up for field notes at michael-kaminski.io.",
    'Unsubscribe: {{{RESEND_UNSUBSCRIBE_URL}}}',
  ].join('\n\n');
  const p = (inner: string, extra = '') =>
    `<p style="margin-top:0;margin-bottom:16px;font-family:Arial, Helvetica, sans-serif;font-size:15px;line-height:23px;color:#1a1a1a;${extra}">${inner}</p>`;
  const html = `<!DOCTYPE html>
<html><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
<body style="margin:0;padding:0;background-color:#ffffff;">
<table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td align="left" style="padding-top:24px;padding-bottom:24px;padding-left:16px;padding-right:16px;">
<table width="100%" cellpadding="0" cellspacing="0" border="0" style="max-width:560px;"><tr><td>
${p(`<strong style="font-size:18px;line-height:26px;">${esc(a.title)}</strong>`)}
${p(esc(a.description))}
${p(`<a href="${url}" style="color:#1a1a1a;text-decoration:underline;font-weight:bold;">Read it (${a.readMinutes} min)</a>`)}
${p('— Michael')}
${p(`You're getting this because you signed up for field notes at michael-kaminski.io. <a href="{{{RESEND_UNSUBSCRIBE_URL}}}" style="color:#666666;text-decoration:underline;">Unsubscribe</a>.`, 'font-size:12px;line-height:18px;color:#666666;')}
</td></tr></table>
</td></tr></table>
</body></html>`;
  return { subject: a.title, text, html };
}

async function announcedNames(key: string): Promise<Set<string>> {
  const names = new Set<string>();
  let after: string | undefined;
  for (let page = 0; page < 20; page++) {
    const r = await resend(key, `/broadcasts?limit=100${after ? `&after=${after}` : ''}`);
    if (!r.ok) throw new Error(`list broadcasts ${r.status}`);
    const body = (await r.json()) as { data?: { id: string; name?: string }[]; has_more?: boolean };
    const data = body.data || [];
    data.forEach((b) => b.name && names.add(b.name));
    if (!body.has_more || !data.length) break;
    after = data[data.length - 1].id;
  }
  return names;
}

export default async function handler(req: ApiRequest & { query?: Record<string, string | string[]> }, res: ApiResponse) {
  const secret = process.env.CRON_SECRET;
  const auth = req.headers.authorization;
  if (!secret || auth !== `Bearer ${secret}`) return res.status(401).json({ error: 'Unauthorized' });

  const cfg = newsletterConfig();
  if (!cfg) return res.status(503).json({ error: 'Newsletter is not configured.', code: 'not_configured' });

  const dry = req.query?.dry === '1';
  const today = new Date().toISOString().slice(0, 10);

  try {
    const sent = await announcedNames(cfg.key);
    const pending = eligible(articles, today).filter((a) => !sent.has(broadcastName(a.slug)));
    if (!pending.length) return res.status(200).json({ ok: true, sent: null, reason: 'nothing new', today });

    const next = pending[0];
    const live = await fetch(`${SITE}/writing/${next.slug}`, { method: 'HEAD' });
    if (!live.ok) return res.status(200).json({ ok: true, sent: null, reason: `not live yet (${live.status})`, slug: next.slug });

    if (dry) return res.status(200).json({ ok: true, dry: true, would_send: next.slug, pending: pending.map((a) => a.slug) });

    const email = renderArticleEmail(next);
    const r = await resend(cfg.key, '/broadcasts', {
      method: 'POST',
      body: {
        segment_id: cfg.segmentId,
        name: broadcastName(next.slug),
        from: FROM,
        reply_to: REPLY_TO,
        subject: email.subject,
        html: email.html,
        text: email.text,
        send: true,
      },
    });
    if (!r.ok) {
      const detail = await r.text().catch(() => '');
      console.error('broadcast failed', r.status, detail);
      return res.status(502).json({ error: 'Broadcast failed.', status: r.status });
    }
    const created = (await r.json()) as { id?: string };
    return res.status(200).json({ ok: true, sent: next.slug, broadcast: created.id, remaining: pending.length - 1 });
  } catch (e) {
    console.error('announce failed', e);
    return res.status(502).json({ error: 'Announce failed.' });
  }
}
