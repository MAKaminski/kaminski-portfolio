// Single fan-out point for product events.
//
// The conversion events (Book a Call, Resume Downloaded, Contact Form
// Submission, …) were already instrumented, but imported `track` straight from
// '@vercel/analytics' — so they only ever reached Vercel, never PostHog.
// Components import `track` from here instead, and every existing call site
// reports to both destinations without changing an event name or a payload.
import { track as vercelTrack } from '@vercel/analytics';
import { capturePostHog } from './posthog';

// Matches the property type Vercel Analytics accepts.
export type EventProperties = Record<string, string | number | boolean | null>;

/**
 * Report a product event to Vercel Analytics and PostHog.
 *
 * Drop-in replacement for `@vercel/analytics`'s `track` — same signature, same
 * event names.
 */
export const track = (event: string, properties?: EventProperties): void => {
  vercelTrack(event, properties);
  capturePostHog(event, properties);
};

export default track;
