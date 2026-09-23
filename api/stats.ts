/**
 * GET /api/stats — audience numbers for every site and product card, read from
 * the personal PostHog project.
 *
 * Sites: pageviews, unique visitors and total time on site, keyed by host, over
 * four windows (24 h, 30 d, 365 d, lifetime). Products are GitHub repositories
 * with no site of their own, so their numbers are card impressions, unique
 * viewers and outbound clicks recorded on this portfolio.
 *
 * Needs POSTHOG_PERSONAL_API_KEY (scope query:read) and POSTHOG_PROJECT_ID. With
 * either missing the endpoint answers 503 { configured: false } and the pages
 * simply hide the numbers. Responses are cached at the edge for 15 minutes so
 * PostHog is queried at most four times an hour regardless of traffic.
 */
import { rateLimit, type ApiRequest, type ApiResponse } from './_lib/http';

const PERIODS = ['day', 'month', 'year', 'all'] as const;
export type Period = (typeof PERIODS)[number];

/** Lifetime is bounded below so every query carries the time range PostHog requires. */
const EPOCH = '2025-01-01 00:00:00';

interface SiteRow {
  views: number;
  visitors: number;
  seconds: number;
}
interface ProductRow {
  views: number;
  visitors: number;
  clicks: number;
}
type ByPeriod<T> = Record<Period, T>;

const SITE_SQL = `
SELECT
  replaceRegexpOne(properties.$host, '^www\\\\.', '') AS host,
  countIf(timestamp >= now() - INTERVAL 1 DAY) AS d_views,
  uniqIf(person_id, timestamp >= now() - INTERVAL 1 DAY) AS d_visitors,
  countIf(timestamp >= now() - INTERVAL 30 DAY) AS m_views,
  uniqIf(person_id, timestamp >= now() - INTERVAL 30 DAY) AS m_visitors,
  countIf(timestamp >= now() - INTERVAL 365 DAY) AS y_views,
  uniqIf(person_id, timestamp >= now() - INTERVAL 365 DAY) AS y_visitors,
  count() AS all_views,
  uniq(person_id) AS all_visitors
FROM events
WHERE event = '$pageview'
  AND timestamp >= toDateTime('${EPOCH}')
  AND properties.$host NOT LIKE '%localhost%'
GROUP BY host
LIMIT 300`;

const TIME_SQL = `
SELECT
  replaceRegexpOne($entry_hostname, '^www\\\\.', '') AS host,
  sumIf($session_duration, $start_timestamp >= now() - INTERVAL 1 DAY) AS d_seconds,
  sumIf($session_duration, $start_timestamp >= now() - INTERVAL 30 DAY) AS m_seconds,
  sumIf($session_duration, $start_timestamp >= now() - INTERVAL 365 DAY) AS y_seconds,
  sum($session_duration) AS all_seconds
FROM sessions
WHERE $start_timestamp >= toDateTime('${EPOCH}')
  AND $entry_hostname != ''
GROUP BY host
LIMIT 300`;

const PRODUCT_SQL = `
SELECT
  properties.name AS name,
  countIf(event = 'Product Card Viewed' AND timestamp >= now() - INTERVAL 1 DAY) AS d_views,
  uniqIf(person_id, event = 'Product Card Viewed' AND timestamp >= now() - INTERVAL 1 DAY) AS d_visitors,
  countIf(event = 'Product Card Clicked' AND timestamp >= now() - INTERVAL 1 DAY) AS d_clicks,
  countIf(event = 'Product Card Viewed' AND timestamp >= now() - INTERVAL 30 DAY) AS m_views,
  uniqIf(person_id, event = 'Product Card Viewed' AND timestamp >= now() - INTERVAL 30 DAY) AS m_visitors,
  countIf(event = 'Product Card Clicked' AND timestamp >= now() - INTERVAL 30 DAY) AS m_clicks,
  countIf(event = 'Product Card Viewed' AND timestamp >= now() - INTERVAL 365 DAY) AS y_views,
  uniqIf(person_id, event = 'Product Card Viewed' AND timestamp >= now() - INTERVAL 365 DAY) AS y_visitors,
  countIf(event = 'Product Card Clicked' AND timestamp >= now() - INTERVAL 365 DAY) AS y_clicks,
  countIf(event = 'Product Card Viewed') AS all_views,
  uniqIf(person_id, event = 'Product Card Viewed') AS all_visitors,
  countIf(event = 'Product Card Clicked') AS all_clicks
FROM events
WHERE event IN ('Product Card Viewed', 'Product Card Clicked')
  AND timestamp >= toDateTime('${EPOCH}')
  AND properties.name != ''
GROUP BY name
LIMIT 100`;

const PREFIX: Record<Period, string> = { day: 'd', month: 'm', year: 'y', all: 'all' };

async function hogql(query: string): Promise<Record<string, unknown>[]> {
  const host = process.env.POSTHOG_API_HOST || 'https://us.posthog.com';
  const project = process.env.POSTHOG_PROJECT_ID;
  const key = process.env.POSTHOG_PERSONAL_API_KEY;
  const r = await fetch(`${host}/api/projects/${project}/query`, {
    method: 'POST',
    headers: { 'content-type': 'application/json', authorization: `Bearer ${key}` },
    body: JSON.stringify({ query: { kind: 'HogQLQuery', query } }),
  });
  if (!r.ok) throw new Error(`PostHog ${r.status}`);
  const data = (await r.json()) as { columns: string[]; results: unknown[][] };
  return data.results.map((row) => Object.fromEntries(data.columns.map((c, i) => [c, row[i]])));
}

const num = (v: unknown) => (typeof v === 'number' && Number.isFinite(v) ? v : Number(v) || 0);

const emptySite = (): ByPeriod<SiteRow> => ({
  day: { views: 0, visitors: 0, seconds: 0 },
  month: { views: 0, visitors: 0, seconds: 0 },
  year: { views: 0, visitors: 0, seconds: 0 },
  all: { views: 0, visitors: 0, seconds: 0 },
});
const emptyProduct = (): ByPeriod<ProductRow> => ({
  day: { views: 0, visitors: 0, clicks: 0 },
  month: { views: 0, visitors: 0, clicks: 0 },
  year: { views: 0, visitors: 0, clicks: 0 },
  all: { views: 0, visitors: 0, clicks: 0 },
});

export default async function handler(req: ApiRequest, res: ApiResponse) {
  if (req.method !== 'GET') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }
  if (!process.env.POSTHOG_PERSONAL_API_KEY || !process.env.POSTHOG_PROJECT_ID) {
    res.setHeader('Cache-Control', 's-maxage=300');
    res.status(503).json({ configured: false });
    return;
  }
  if (!rateLimit(req, 30, 60_000)) {
    res.status(429).json({ error: 'rate_limited' });
    return;
  }

  try {
    const [siteRows, timeRows, productRows] = await Promise.all([
      hogql(SITE_SQL),
      hogql(TIME_SQL),
      hogql(PRODUCT_SQL),
    ]);

    const sites: Record<string, ByPeriod<SiteRow>> = {};
    for (const row of siteRows) {
      const host = String(row.host || '');
      if (!host) continue;
      const s = (sites[host] ||= emptySite());
      for (const p of PERIODS) {
        s[p].views += num(row[`${PREFIX[p]}_views`]);
        s[p].visitors += num(row[`${PREFIX[p]}_visitors`]);
      }
    }
    for (const row of timeRows) {
      const host = String(row.host || '');
      if (!host) continue;
      const s = (sites[host] ||= emptySite());
      for (const p of PERIODS) s[p].seconds += num(row[`${PREFIX[p]}_seconds`]);
    }

    const products: Record<string, ByPeriod<ProductRow>> = {};
    for (const row of productRows) {
      const name = String(row.name || '');
      if (!name) continue;
      const s = (products[name] ||= emptyProduct());
      for (const p of PERIODS) {
        s[p].views += num(row[`${PREFIX[p]}_views`]);
        s[p].visitors += num(row[`${PREFIX[p]}_visitors`]);
        s[p].clicks += num(row[`${PREFIX[p]}_clicks`]);
      }
    }

    res.setHeader('Cache-Control', 's-maxage=900, stale-while-revalidate=3600');
    res.status(200).json({ configured: true, generatedAt: new Date().toISOString(), sites, products });
  } catch (err) {
    res.setHeader('Cache-Control', 's-maxage=120');
    res.status(502).json({ configured: true, error: (err as Error).message });
  }
}
