/**
 * Lead emails, sent through Resend from the verified michael-kaminski.io domain.
 *
 *   confirmation → the person who signed up / reached out
 *   notification → Michael's inbox, one per lead
 *
 * Both are best-effort: /api/lead has already stored the lead in PostHog before
 * this runs, so a Resend failure is logged and never fails the request.
 *
 * The endpoint is public, so anyone can type any address into the form. Each
 * confirmation carries a Resend Idempotency-Key of kind + address + UTC day, so
 * an address gets at most one confirmation per kind per day however many times
 * it is submitted, across every serverless instance.
 *
 * Env: RESEND_API_KEY (required to send anything), LEAD_FROM_EMAIL,
 * LEAD_NOTIFY_EMAIL (both have defaults below).
 */

const RESEND_URL = 'https://api.resend.com/emails';
const FROM = process.env.LEAD_FROM_EMAIL || 'Michael Kaminski <notes@michael-kaminski.io>';
const OWNER = process.env.LEAD_NOTIFY_EMAIL || 'mkaminski1337@gmail.com';
const SITE = 'https://www.michael-kaminski.io';
const CALENDLY = 'https://calendly.com/kaminski1337/15min';

export interface LeadForEmail {
  kind: string;
  email: string;
  intent?: string;
  variant?: string;
  source?: string;
  page?: string;
  detail?: string;
}

const esc = (s: string) =>
  s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

/** Plain, single-column email: renders the same in Gmail, Outlook and Apple Mail. */
const wrap = (paragraphs: string[]) => `<!DOCTYPE html>
<html><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
<body style="margin:0;padding:0;background-color:#ffffff;">
<table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td align="left" style="padding-top:24px;padding-bottom:24px;padding-left:16px;padding-right:16px;">
<table width="100%" cellpadding="0" cellspacing="0" border="0" style="max-width:560px;"><tr><td style="font-family:Arial, Helvetica, sans-serif;font-size:15px;line-height:23px;color:#1a1a1a;">
${paragraphs.map((p) => `<p style="margin-top:0;margin-bottom:16px;font-family:Arial, Helvetica, sans-serif;font-size:15px;line-height:23px;color:#1a1a1a;">${p}</p>`).join('\n')}
</td></tr></table>
</td></tr></table>
</body></html>`;

const link = (href: string, text: string) => `<a href="${href}" style="color:#1a1a1a;text-decoration:underline;">${esc(text)}</a>`;

/** What the person gets back. Text first; the HTML is the same words. */
function confirmation(lead: LeadForEmail): { subject: string; text: string; html: string } {
  if (lead.kind === 'newsletter') {
    const text = [
      "You're on the list for new field notes on agent infrastructure: MCP servers, eval harnesses, and getting agents through review.",
      'No cadence promises, and nothing else lands in your inbox.',
      `The existing essays are at ${SITE}/writing if you want something to read now.`,
      '— Michael',
    ];
    return {
      subject: "You're on the list",
      text: text.join('\n\n'),
      html: wrap([
        esc(text[0]),
        esc(text[1]),
        `The existing essays are at ${link(`${SITE}/writing`, 'michael-kaminski.io/writing')} if you want something to read now.`,
        '— Michael',
      ]),
    };
  }

  const extra =
    lead.intent === 'recruiter'
      ? { t: `My resume is at ${SITE}/resume.pdf.`, h: `My resume is at ${link(`${SITE}/resume.pdf`, 'michael-kaminski.io/resume.pdf')}.` }
      : { t: `If it's easier, grab 15 minutes: ${CALENDLY}`, h: `If it's easier, ${link(CALENDLY, 'grab 15 minutes')}.` };
  const first = 'Thanks for reaching out through michael-kaminski.io. I read these myself and reply within one business day.';
  const reply = 'You can also just reply to this email.';
  return {
    subject: 'Got your note',
    text: [first, extra.t, reply, '— Michael'].join('\n\n'),
    html: wrap([esc(first), extra.h, esc(reply), '— Michael']),
  };
}

/** What lands in Michael's inbox. Reply-to is the lead, so replying answers them. */
function notification(lead: LeadForEmail): { subject: string; text: string; html: string } {
  const label = lead.kind === 'newsletter' ? 'newsletter' : `contact / ${lead.intent || 'unknown'}`;
  const rows: [string, string | undefined][] = [
    ['Email', lead.email],
    ['Kind', lead.kind],
    ['Intent', lead.intent],
    ['Variant', lead.variant],
    ['Detail', lead.detail],
    ['Source', lead.source],
    ['Page', lead.page],
  ];
  const present = rows.filter(([, v]) => v) as [string, string][];
  const person = `https://us.posthog.com/project/199170/person/${encodeURIComponent(lead.email)}`;
  return {
    subject: `New lead (${label}): ${lead.email}`,
    text: [...present.map(([k, v]) => `${k}: ${v}`), '', `PostHog: ${person}`].join('\n'),
    html: wrap([
      present.map(([k, v]) => `<strong>${esc(k)}:</strong> ${esc(v)}`).join('<br>'),
      link(person, 'Open in PostHog'),
    ]),
  };
}

async function send(apiKey: string, body: Record<string, unknown>, idempotencyKey?: string): Promise<boolean> {
  try {
    const r = await fetch(RESEND_URL, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
        ...(idempotencyKey ? { 'Idempotency-Key': idempotencyKey } : {}),
      },
      body: JSON.stringify(body),
    });
    if (!r.ok) console.error('resend send failed', r.status, await r.text().catch(() => ''));
    return r.ok;
  } catch (e) {
    console.error('resend send threw', e);
    return false;
  }
}

/** Sends both emails. Resolves which ones went out; never throws. */
export async function sendLeadEmails(lead: LeadForEmail): Promise<{ confirmed: boolean; notified: boolean } | null> {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) return null;

  const c = confirmation(lead);
  const n = notification(lead);
  const day = new Date().toISOString().slice(0, 10);
  // Resend idempotency keys are capped at 256 chars; addresses are capped at 254 upstream.
  const idem = `lead-${lead.kind}-${day}-${lead.email}`.slice(0, 256);

  const [confirmed, notified] = await Promise.all([
    send(apiKey, { from: FROM, to: [lead.email], reply_to: OWNER, subject: c.subject, text: c.text, html: c.html }, idem),
    send(apiKey, { from: FROM, to: [OWNER], reply_to: lead.email, subject: n.subject, text: n.text, html: n.html }),
  ]);
  return { confirmed, notified };
}
