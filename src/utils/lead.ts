import { getAnonymousId } from './posthog';

const CONTACT_ENDPOINT = process.env.REACT_APP_CONTACT_ENDPOINT;

export interface Lead {
  kind: 'newsletter' | 'contact';
  email: string;
  intent?: string;
  variant?: string;
  detail?: string;
  source?: string;
}

/**
 * Stores a lead where ad blockers cannot drop it. The posthog-js events the
 * components fire are analytics and can be blocked; this is the record.
 *
 * Goes to /api/lead (same origin, server writes to PostHog), and additionally to
 * REACT_APP_CONTACT_ENDPOINT when one is configured. Resolves true when
 * /api/lead accepted it. `keepalive` lets the request finish if the visitor
 * closes the tab straight after submitting.
 */
export const submitLead = async (lead: Lead): Promise<boolean> => {
  const page = typeof window !== 'undefined' ? window.location.pathname : '';
  const payload = { ...lead, page, anonymous_id: getAnonymousId() };
  const post = (url: string) =>
    fetch(url, {
      method: 'POST',
      keepalive: true,
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify(payload),
    });

  if (CONTACT_ENDPOINT) void post(CONTACT_ENDPOINT).catch(() => undefined);
  try {
    return (await post('/api/lead')).ok;
  } catch {
    return false;
  }
};
