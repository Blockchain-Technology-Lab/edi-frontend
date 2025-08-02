// src/hooks/useAnalytics.ts

import { useCallback } from 'react';
import { getAnalytics } from '../utils/analytics';

export function useAnalytics() {
  const analytics = getAnalytics();

  const trackEvent = useCallback(
    (eventName: string, parameters?: Record<string, any>) => {
      if (!analytics) {
        console.warn('Analytics not initialized');
        return;
      }
      analytics.track(eventName, parameters);
    },
    [analytics]
  );

  const trackPageView = useCallback(
    (path?: string) => {
      if (!analytics) {
        console.warn('Analytics not initialized');
        return;
      }
      analytics.trackPageView(path);
    },
    [analytics]
  );

  const setUserId = useCallback(
    (userId: string) => {
      if (!analytics) {
        console.warn('Analytics not initialized');
        return;
      }
      analytics.setUserId(userId);
    },
    [analytics]
  );

  const setUserProperties = useCallback(
    (properties: Record<string, any>) => {
      if (!analytics) {
        console.warn('Analytics not initialized');
        return;
      }
      analytics.setUserProperties(properties);
    },
    [analytics]
  );

  return {
    trackEvent,
    trackPageView,
    setUserId,
    setUserProperties,
    isAvailable: !!analytics,
  };
}
