/**
 * Shared helpers for the /api/twin functions.
 *
 * These endpoints are public and spend money on every call, so each one runs the
 * same three checks before doing any work: method, rate limit, and configuration.
 */

// Minimal structural types — avoids taking a dependency on @vercel/node just for
// two interfaces. Vercel's Node runtime passes Node's req/res with these extras.
export interface ApiRequest {
  method?: string;
  headers: Record<string, string | string[] | undefined>;
  body?: unknown;
}

export interface ApiResponse {
  status(code: number): ApiResponse;
  json(body: unknown): void;
  send(body: unknown): void;
  setHeader(name: string, value: string | number | string[]): void;
  write(chunk: string | Uint8Array): boolean;
  end(chunk?: string | Uint8Array): void;
}

/**
 * Per-instance sliding window. Serverless instances are not shared, so this
 * bounds a single abusive client per warm instance rather than globally — it
 * blunts a casual script, not a distributed one. Swap in Vercel KV or Upstash
 * if this ever needs a real ceiling.
 */
const HITS = new Map<string, number[]>();

export function rateLimit(req: ApiRequest, limit: number, windowMs: number): boolean {
  const fwd = req.headers['x-forwarded-for'];
  const key = (Array.isArray(fwd) ? fwd[0] : fwd || 'unknown').split(',')[0].trim();
  const now = Date.now();
  const recent = (HITS.get(key) || []).filter((t) => now - t < windowMs);

  if (recent.length >= limit) {
    HITS.set(key, recent);
    return false;
  }
  recent.push(now);
  HITS.set(key, recent);

  // Bound memory on a long-lived warm instance.
  if (HITS.size > 500) {
    for (const [k, times] of HITS) {
      if (times.every((t) => now - t >= windowMs)) HITS.delete(k);
    }
  }
  return true;
}

/** Runs the shared guards. Returns false when it has already answered the request. */
export function guard(
  req: ApiRequest,
  res: ApiResponse,
  opts: { requiredEnv: string[]; limit: number; windowMs: number; feature: string }
): boolean {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return false;
  }

  const missing = opts.requiredEnv.filter((name) => !process.env[name]);
  if (missing.length) {
    // Deliberately not naming the variables — this response is public.
    res.status(503).json({
      error: `${opts.feature} isn't configured on this deployment.`,
      code: 'not_configured',
    });
    return false;
  }

  if (!rateLimit(req, opts.limit, opts.windowMs)) {
    res.status(429).json({ error: 'Slow down a moment and try again.', code: 'rate_limited' });
    return false;
  }

  return true;
}
