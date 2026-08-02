import React from 'react';
import ReactDOM from 'react-dom/client';
import { HelmetProvider } from 'react-helmet-async';
import { PostHogProvider } from '@posthog/react';
import './index.css';
import App from './App';
import posthog, { initPostHog } from './utils/posthog';

// Initialize before the first render so the session's opening `$pageview`
// isn't lost to a race with React mounting.
initPostHog();

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.StrictMode>
    <PostHogProvider client={posthog}>
      <HelmetProvider>
        <App />
      </HelmetProvider>
    </PostHogProvider>
  </React.StrictMode>
);
