/**
 * Audience numbers for the /websites and /products directories, read from
 * /api/stats (PostHog behind an edge cache). Everything here degrades to
 * nothing: while loading, when the endpoint is not configured, or when a card
 * has no data yet, the page looks exactly as it did before this existed.
 */
import React, { createContext, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { Eye, Users, Clock, MousePointerClick } from 'lucide-react';
import { track } from '../utils/track';

export type Period = 'day' | 'month' | 'year' | 'all';
export const PERIODS: { key: Period; label: string; long: string }[] = [
  { key: 'day', label: '24h', long: 'Last 24 hours' },
  { key: 'month', label: '30d', long: 'Last 30 days' },
  { key: 'year', label: '12mo', long: 'Last 12 months' },
  { key: 'all', label: 'All', long: 'Lifetime' },
];

export interface SiteRow {
  views: number;
  visitors: number;
  seconds: number;
}
export interface ProductRow {
  views: number;
  visitors: number;
  clicks: number;
}
type ByPeriod<T> = Record<Period, T>;

interface StatsPayload {
  configured: boolean;
  generatedAt?: string;
  sites?: Record<string, ByPeriod<SiteRow>>;
  products?: Record<string, ByPeriod<ProductRow>>;
}

interface StatsContextValue {
  data: StatsPayload | null;
  period: Period;
  setPeriod: (p: Period) => void;
}

const StatsContext = createContext<StatsContextValue>({ data: null, period: 'month', setPeriod: () => {} });

let cached: Promise<StatsPayload | null> | null = null;
const fetchStats = () => {
  if (!cached) {
    cached = fetch('/api/stats')
      .then((r) => (r.ok || r.status === 503 ? r.json() : null))
      .catch(() => null);
  }
  return cached;
};

export const StatsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [data, setData] = useState<StatsPayload | null>(null);
  const [period, setPeriodState] = useState<Period>(() => {
    try {
      const saved = window.localStorage.getItem('stats-period');
      return (PERIODS.some((p) => p.key === saved) ? saved : 'month') as Period;
    } catch {
      return 'month';
    }
  });
  const setPeriod = (p: Period) => {
    setPeriodState(p);
    try {
      window.localStorage.setItem('stats-period', p);
    } catch {
      /* private mode */
    }
  };
  useEffect(() => {
    let live = true;
    fetchStats().then((d) => live && setData(d));
    return () => {
      live = false;
    };
  }, []);
  const value = useMemo(() => ({ data, period, setPeriod }), [data, period]);
  return <StatsContext.Provider value={value}>{children}</StatsContext.Provider>;
};

export const useStats = () => useContext(StatsContext);

/** Host key used by /api/stats: no scheme, no www, no path. */
export const hostKey = (url: string) =>
  url.replace(/^https?:\/\//, '').replace(/^www\./, '').replace(/\/.*$/, '').toLowerCase();

export const fmtCount = (n: number) => {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1).replace(/\.0$/, '')}M`;
  if (n >= 10_000) return `${Math.round(n / 1000)}k`;
  if (n >= 1_000) return `${(n / 1000).toFixed(1).replace(/\.0$/, '')}k`;
  return String(n);
};

export const fmtTime = (seconds: number) => {
  if (seconds < 60) return `${Math.round(seconds)}s`;
  const m = seconds / 60;
  if (m < 60) return `${Math.round(m)}m`;
  const h = m / 60;
  if (h < 48) return `${h.toFixed(h < 10 ? 1 : 0).replace(/\.0$/, '')}h`;
  return `${Math.round(h / 24)}d`;
};

const Stat: React.FC<{ icon: React.ReactNode; value: string; label: string }> = ({ icon, value, label }) => (
  <span className="inline-flex items-center gap-1.5" title={label} aria-label={`${label}: ${value}`}>
    <span className="text-white/35">{icon}</span>
    <span className="font-semibold tabular-nums text-white/85">{value}</span>
  </span>
);

const PeriodToggle: React.FC = () => {
  const { period, setPeriod } = useStats();
  return (
    <div role="tablist" aria-label="Time window" className="inline-flex rounded-full border border-white/10 bg-white/[0.03] p-0.5">
      {PERIODS.map((p) => (
        <button
          key={p.key}
          role="tab"
          aria-selected={period === p.key}
          onClick={() => setPeriod(p.key)}
          className={`rounded-full px-3 py-1 text-xs font-semibold transition-colors ${
            period === p.key ? 'bg-accent text-ink-900' : 'text-white/60 hover:text-white'
          }`}
        >
          {p.label}
        </button>
      ))}
    </div>
  );
};

/**
 * Aggregate strip for the top of a directory page. `hosts` and `names` are the
 * cards on the page, so the totals only count things the visitor can see.
 */
export const StatsStrip: React.FC<{ kind: 'sites'; hosts: string[] } | { kind: 'products'; names: string[] }> = (props) => {
  const { data, period } = useStats();
  if (!data || !data.configured) return null;
  const long = PERIODS.find((p) => p.key === period)?.long ?? '';

  if (props.kind === 'sites') {
    const rows = props.hosts.map((h) => data.sites?.[h]?.[period]).filter(Boolean) as SiteRow[];
    const views = rows.reduce((a, r) => a + r.views, 0);
    const visitors = rows.reduce((a, r) => a + r.visitors, 0);
    const seconds = rows.reduce((a, r) => a + r.seconds, 0);
    const reporting = rows.filter((r) => r.views > 0).length;
    return (
      <div className="mb-8 flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-white/10 bg-white/[0.02] px-5 py-4">
        <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm">
          <Stat icon={<Eye size={15} />} value={fmtCount(views)} label={`Page views, ${long.toLowerCase()}`} />
          <Stat icon={<Users size={15} />} value={fmtCount(visitors)} label={`Unique visitors, ${long.toLowerCase()}`} />
          <Stat icon={<Clock size={15} />} value={fmtTime(seconds)} label={`Time on site, ${long.toLowerCase()}`} />
          <span className="text-xs text-white/40">
            {reporting} of {props.hosts.length} sites reporting · {long}
          </span>
        </div>
        <PeriodToggle />
      </div>
    );
  }

  const rows = props.names.map((n) => data.products?.[n]?.[period]).filter(Boolean) as ProductRow[];
  const views = rows.reduce((a, r) => a + r.views, 0);
  const visitors = rows.reduce((a, r) => a + r.visitors, 0);
  const clicks = rows.reduce((a, r) => a + r.clicks, 0);
  return (
    <div className="mb-8 flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-white/10 bg-white/[0.02] px-5 py-4">
      <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm">
        <Stat icon={<Eye size={15} />} value={fmtCount(views)} label={`Card views, ${long.toLowerCase()}`} />
        <Stat icon={<Users size={15} />} value={fmtCount(visitors)} label={`Unique viewers, ${long.toLowerCase()}`} />
        <Stat icon={<MousePointerClick size={15} />} value={fmtCount(clicks)} label={`Opens on GitHub, ${long.toLowerCase()}`} />
        <span className="text-xs text-white/40">Measured on this page · {long}</span>
      </div>
      <PeriodToggle />
    </div>
  );
};

/** Per-card line. Renders nothing until there is at least one view to show. */
export const SiteCardStats: React.FC<{ host: string }> = ({ host }) => {
  const { data, period } = useStats();
  const row = data?.sites?.[host]?.[period];
  if (!row || row.views === 0) return null;
  return (
    <div className="mb-3 flex items-center gap-4 text-xs">
      <Stat icon={<Eye size={13} />} value={fmtCount(row.views)} label="Page views" />
      <Stat icon={<Users size={13} />} value={fmtCount(row.visitors)} label="Unique visitors" />
      <Stat icon={<Clock size={13} />} value={fmtTime(row.seconds)} label="Time on site" />
    </div>
  );
};

export const ProductCardStats: React.FC<{ name: string }> = ({ name }) => {
  const { data, period } = useStats();
  const row = data?.products?.[name]?.[period];
  if (!row || row.views === 0) return null;
  return (
    <div className="mb-3 flex items-center gap-4 text-xs">
      <Stat icon={<Eye size={13} />} value={fmtCount(row.views)} label="Card views" />
      <Stat icon={<Users size={13} />} value={fmtCount(row.visitors)} label="Unique viewers" />
      <Stat icon={<MousePointerClick size={13} />} value={fmtCount(row.clicks)} label="Opens on GitHub" />
    </div>
  );
};

/**
 * Fires `<Kind> Card Viewed` once when at least half the card has been on
 * screen. Impressions are what /api/stats counts as product "views", and they
 * give websites a second signal alongside their own pageviews.
 */
export const useCardImpression = (event: string, props: Record<string, string>) => {
  const ref = useRef<HTMLDivElement | null>(null);
  const fired = useRef(false);
  useEffect(() => {
    const el = ref.current;
    if (!el || fired.current || typeof IntersectionObserver === 'undefined') return;
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting) && !fired.current) {
          fired.current = true;
          track(event, props);
          io.disconnect();
        }
      },
      { threshold: 0.5 }
    );
    io.observe(el);
    return () => io.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [event, props.name]);
  return ref;
};
