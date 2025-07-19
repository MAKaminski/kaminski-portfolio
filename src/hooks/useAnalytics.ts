import { useEffect, useRef, useCallback } from 'react';
import { useLocation } from 'react-router-dom';
import { 
  trackPageView, 
  trackEvent, 
  trackUserInteraction, 
  trackScrollDepth, 
  trackTimeOnPage,
  trackUserSession,
  trackDownload,
  trackExternalLink
} from '../utils/analytics';

export const useAnalytics = () => {
  const location = useLocation();
  const startTime = useRef<number>(Date.now());
  const scrollDepth = useRef<number>(0);
  const maxScrollDepth = useRef<number>(0);

  // Track page views on route changes
  useEffect(() => {
    trackPageView(location.pathname, document.title);
    
    // Reset timers for new page
    startTime.current = Date.now();
    scrollDepth.current = 0;
    maxScrollDepth.current = 0;
    
    // Track session data on first page load
    if (location.pathname === '/') {
      trackUserSession({
        referrer: document.referrer,
        userAgent: navigator.userAgent,
        screenResolution: `${screen.width}x${screen.height}`,
        language: navigator.language,
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone
      });
    }
  }, [location]);

  // Track scroll depth
  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.pageYOffset;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const scrollPercent = Math.round((scrollTop / docHeight) * 100);
      
      if (scrollPercent > maxScrollDepth.current) {
        maxScrollDepth.current = scrollPercent;
        
        // Track at 25%, 50%, 75%, and 100% scroll depths
        if (scrollPercent >= 25 && scrollDepth.current < 25) {
          trackScrollDepth(25);
          scrollDepth.current = 25;
        } else if (scrollPercent >= 50 && scrollDepth.current < 50) {
          trackScrollDepth(50);
          scrollDepth.current = 50;
        } else if (scrollPercent >= 75 && scrollDepth.current < 75) {
          trackScrollDepth(75);
          scrollDepth.current = 75;
        } else if (scrollPercent >= 100 && scrollDepth.current < 100) {
          trackScrollDepth(100);
          scrollDepth.current = 100;
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Track time on page when user leaves
  useEffect(() => {
    const handleBeforeUnload = () => {
      const timeSpent = Math.round((Date.now() - startTime.current) / 1000);
      trackTimeOnPage(timeSpent);
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, []);

  // Track user interactions
  const trackInteraction = useCallback((interaction: string, details?: Record<string, any>) => {
    trackUserInteraction(interaction, details);
  }, []);

  // Track button clicks
  const trackButtonClick = useCallback((buttonName: string, location: string, additionalData?: Record<string, any>) => {
    trackEvent('button_click', 'engagement', buttonName, undefined);
    trackUserInteraction('button_click', {
      button_name: buttonName,
      location: location,
      ...additionalData
    });
  }, []);

  // Track form interactions
  const trackFormInteraction = useCallback((formName: string, action: string, formData?: Record<string, any>) => {
    trackEvent('form_interaction', 'engagement', `${formName}_${action}`, undefined);
    trackUserInteraction('form_interaction', {
      form_name: formName,
      action: action,
      form_data: formData
    });
  }, []);

  // Track file downloads
  const trackFileDownload = useCallback((fileName: string, fileType: string, source: string) => {
    trackDownload(fileName, fileType);
    trackEvent('file_download', 'engagement', fileName, undefined);
    trackUserInteraction('file_download', {
      file_name: fileName,
      file_type: fileType,
      source: source
    });
  }, []);

  // Track external link clicks
  const trackLinkClick = useCallback((url: string, linkText: string, source: string) => {
    trackExternalLink(url, linkText);
    trackEvent('external_link_click', 'navigation', linkText, undefined);
    trackUserInteraction('external_link_click', {
      url: url,
      link_text: linkText,
      source: source
    });
  }, []);

  // Track section visibility
  const trackSectionView = useCallback((sectionName: string) => {
    trackEvent('section_view', 'engagement', sectionName, undefined);
    trackUserInteraction('section_view', {
      section_name: sectionName,
      page: location.pathname
    });
  }, [location.pathname]);

  // Track role page visits
  const trackRoleVisit = useCallback((role: string) => {
    trackEvent('role_page_visit', 'navigation', role, undefined);
    trackUserInteraction('role_page_visit', {
      role: role,
      page: location.pathname
    });
  }, [location.pathname]);

  // Track contact interactions
  const trackContactInteraction = useCallback((action: string, details?: Record<string, any>) => {
    trackEvent('contact_interaction', 'engagement', action, undefined);
    trackUserInteraction('contact_interaction', {
      action: action,
      page: location.pathname,
      ...details
    });
  }, [location.pathname]);

  return {
    trackInteraction,
    trackButtonClick,
    trackFormInteraction,
    trackFileDownload,
    trackLinkClick,
    trackSectionView,
    trackRoleVisit,
    trackContactInteraction
  };
}; 