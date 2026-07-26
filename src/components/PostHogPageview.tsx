import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { capturePageview } from '../utils/posthog';

/**
 * Records a PostHog $pageview on every client-side route change.
 *
 * This site is a single-page app, so after the first load React Router swaps
 * routes without a document navigation — PostHog's automatic pageview capture
 * would only ever see the landing page. Rendering this inside <Router> keeps
 * per-route traffic, entry pages, and exit pages accurate.
 */
const PostHogPageview: React.FC = () => {
  const location = useLocation();

  useEffect(() => {
    capturePageview(location.pathname + location.search);
  }, [location.pathname, location.search]);

  return null;
};

export default PostHogPageview;
