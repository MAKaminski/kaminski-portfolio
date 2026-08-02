import { useAnalytics } from '../hooks/useAnalytics';

/**
 * Mounts the `useAnalytics` side effects (route-change pageviews, scroll-depth
 * milestones, time-on-page) for the whole app.
 *
 * The hook already existed but nothing ever called it, so none of that
 * behavioural tracking ran. It has to live inside the Router because it depends
 * on `useLocation`.
 */
const AnalyticsTracker: React.FC = () => {
  useAnalytics();
  return null;
};

export default AnalyticsTracker;
