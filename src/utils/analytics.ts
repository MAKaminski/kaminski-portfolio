// Google Analytics 4 Configuration and Tracking Utilities
//
// Each helper below also mirrors its event into PostHog. The PostHog call is
// deliberately *outside* the `window.gtag` guards: GA only loads when
// REACT_APP_GA_MEASUREMENT_ID is set, and if the mirror sat inside the guard
// then an unset GA id would silently suppress PostHog too.
import { capturePostHog } from './posthog';

declare global {
  interface Window {
    gtag: (...args: any[]) => void;
    dataLayer: any[];
  }
}

// Holds the configured Measurement ID once initGA runs, so other helpers
// don't reference a hardcoded placeholder.
let gaMeasurementId: string | null = null;

// Initialize Google Analytics
export const initGA = (measurementId: string) => {
  gaMeasurementId = measurementId;
  if (typeof window !== 'undefined' && !window.gtag) {
    // Load Google Analytics script
    const script = document.createElement('script');
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${measurementId}`;
    document.head.appendChild(script);

    window.dataLayer = window.dataLayer || [];
    window.gtag = function() {
      window.dataLayer.push(arguments);
    };

    window.gtag('js', new Date());
    window.gtag('config', measurementId, {
      page_title: document.title,
      page_location: window.location.href,
    });
  }
};

// Track page views.
// Intentionally *not* mirrored to PostHog: posthog-js captures `$pageview`
// itself on every history change (see `defaults` in utils/posthog.ts), so
// mirroring here would double-count every navigation.
export const trackPageView = (page: string, title?: string) => {
  if (typeof window !== 'undefined' && window.gtag && gaMeasurementId) {
    window.gtag('config', gaMeasurementId, {
      page_title: title || document.title,
      page_location: window.location.href,
      custom_map: {
        'custom_page': 'page'
      }
    });
    
    window.gtag('event', 'page_view', {
      page_title: title || document.title,
      page_location: window.location.href,
      custom_page: page
    });
  }
};

// Track custom events
export const trackEvent = (action: string, category: string, label?: string, value?: number) => {
  capturePostHog(action, { category, label, value });
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', action, {
      event_category: category,
      event_label: label,
      value: value
    });
  }
};

// Track user interactions
export const trackUserInteraction = (interaction: string, details?: Record<string, any>) => {
  capturePostHog('user_interaction', { interaction_type: interaction, ...details });
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', 'user_interaction', {
      interaction_type: interaction,
      ...details
    });
  }
};

// Track form submissions
export const trackFormSubmission = (formName: string, formData?: Record<string, any>) => {
  capturePostHog('form_submit', { form_name: formName });
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', 'form_submit', {
      form_name: formName,
      form_data: formData ? JSON.stringify(formData) : undefined
    });
  }
};

// Track file downloads
export const trackDownload = (fileName: string, fileType: string) => {
  capturePostHog('file_download', { file_name: fileName, file_type: fileType });
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', 'file_download', {
      file_name: fileName,
      file_type: fileType
    });
  }
};

// Track external link clicks
export const trackExternalLink = (url: string, linkText?: string) => {
  capturePostHog('external_link_click', { url, link_text: linkText || url });
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', 'click', {
      event_category: 'external_link',
      event_label: linkText || url,
      link_url: url
    });
  }
};

// Track scroll depth
export const trackScrollDepth = (depth: number) => {
  capturePostHog('scroll_depth', { depth });
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', 'scroll', {
      event_category: 'engagement',
      event_label: `scroll_depth_${depth}`,
      value: depth
    });
  }
};

// Track time on page
export const trackTimeOnPage = (seconds: number) => {
  capturePostHog('time_on_page', { seconds });
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', 'timing_complete', {
      name: 'page_load_time',
      value: seconds
    });
  }
};

// Enhanced user identification (anonymized).
// Intentionally *not* mirrored to PostHog: referrer, user agent, screen size,
// locale and timezone are already attached to every PostHog event as `$`
// properties, so re-sending them would just duplicate data.
export const trackUserSession = (sessionData: {
  referrer?: string;
  userAgent?: string;
  screenResolution?: string;
  language?: string;
  timezone?: string;
}) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', 'session_start', {
      custom_map: {
        'custom_referrer': 'referrer',
        'custom_user_agent': 'user_agent',
        'custom_screen_resolution': 'screen_resolution',
        'custom_language': 'language',
        'custom_timezone': 'timezone'
      },
      custom_referrer: sessionData.referrer || document.referrer,
      custom_user_agent: sessionData.userAgent || navigator.userAgent,
      custom_screen_resolution: sessionData.screenResolution || `${screen.width}x${screen.height}`,
      custom_language: sessionData.language || navigator.language,
      custom_timezone: sessionData.timezone || Intl.DateTimeFormat().resolvedOptions().timeZone
    });
  }
}; 