import React from 'react';
import ReactDOM from 'react-dom/client';
import { HelmetProvider } from 'react-helmet-async';
import './index.css';
import App from './App';
import { initPostHog } from './utils/posthog';

// Initialise before the first render, not from an effect inside <App>. React
// runs child effects before parent ones, so a useEffect in App would fire
// *after* PostHogPageview's — dropping the entry pageview of every visit, which
// is the one carrying the referrer and UTM parameters.
initPostHog();

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.StrictMode>
    <HelmetProvider>
      <App />
    </HelmetProvider>
  </React.StrictMode>
);
