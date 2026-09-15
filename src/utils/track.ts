import { track as vercelTrack } from '@vercel/analytics';
import { captureEvent } from './posthog';

type Props = Record<string, string | number | boolean | null>;

/**
 * One call, every analytics layer. Components import this instead of
 * `@vercel/analytics` directly so the event names stay identical across Vercel
 * Analytics and PostHog (GA4 keeps its own page-view wiring in utils/analytics.ts).
 */
export const track = (name: string, properties?: Props) => {
  vercelTrack(name, properties);
  captureEvent(name, properties);
};
