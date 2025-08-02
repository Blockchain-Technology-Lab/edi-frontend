// src/utils/analytics.ts

declare global {
  interface Window {
    dataLayer: any[];
    gtag: (...args: any[]) => void;
  }
}

export interface AnalyticsConfig {
  trackingId: string;
  debug?: boolean;
  anonymizeIp?: boolean;
  cookieDomain?: string;
}

export class Analytics {
  private config: AnalyticsConfig;
  private isLoaded = false;
  private isLoading = false;

  constructor(config: AnalyticsConfig) {
    this.config = config;
  }

  async initialize(): Promise<void> {
    if (this.isLoaded || this.isLoading) return;

    this.isLoading = true;

    try {
      // Initialize dataLayer
      window.dataLayer = window.dataLayer || [];

      function gtag(...args: any[]) {
        window.dataLayer.push(args);
      }

      // Assign gtag to window for global access
      window.gtag = gtag;

      // Load the script
      await this.loadScript();

      // Configure Google Analytics
      gtag('js', new Date());
      gtag('config', this.config.trackingId, {
        page_title: document.title,
        page_location: window.location.href,
        anonymize_ip: this.config.anonymizeIp ?? true,
        cookie_domain: this.config.cookieDomain ?? 'auto',
        debug_mode: this.config.debug ?? false,
      });

      this.isLoaded = true;

      if (this.config.debug) {
        console.log('Google Analytics initialized successfully');
      }
    } catch (error) {
      console.warn('Google Analytics failed to initialize:', error);
      this.trackingFallback();
    } finally {
      this.isLoading = false;
    }
  }

  private loadScript(): Promise<void> {
    return new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.async = true;
      script.src = `https://www.googletagmanager.com/gtag/js?id=${this.config.trackingId}`;

      script.onload = () => resolve();
      script.onerror = (error) => reject(error);

      document.head.appendChild(script);
    });
  }

  private trackingFallback(): void {
    // Fallback tracking method when GA fails to load
    if (this.config.debug) {
      console.log('Using fallback tracking method');
    }

    // You could implement alternative tracking here
    // For example, send events to your own analytics endpoint
  }

  track(eventName: string, parameters?: Record<string, any>): void {
    if (!this.isLoaded) {
      if (this.config.debug) {
        console.warn('Analytics not loaded, event not tracked:', eventName);
      }
      return;
    }

    try {
      window.gtag('event', eventName, parameters);
    } catch (error) {
      console.warn('Failed to track event:', eventName, error);
    }
  }

  trackPageView(path?: string): void {
    if (!this.isLoaded) return;

    try {
      window.gtag('config', this.config.trackingId, {
        page_path: path || window.location.pathname,
        page_title: document.title,
        page_location: window.location.href,
      });
    } catch (error) {
      console.warn('Failed to track page view:', error);
    }
  }

  setUserId(userId: string): void {
    if (!this.isLoaded) return;

    try {
      window.gtag('config', this.config.trackingId, {
        user_id: userId,
      });
    } catch (error) {
      console.warn('Failed to set user ID:', error);
    }
  }

  setUserProperties(properties: Record<string, any>): void {
    if (!this.isLoaded) return;

    try {
      window.gtag('set', 'user_properties', properties);
    } catch (error) {
      console.warn('Failed to set user properties:', error);
    }
  }
}

// Create singleton instance
let analyticsInstance: Analytics | null = null;

export function initializeAnalytics(config: AnalyticsConfig): Analytics {
  if (!analyticsInstance) {
    analyticsInstance = new Analytics(config);
  }
  return analyticsInstance;
}

export function getAnalytics(): Analytics | null {
  return analyticsInstance;
}
