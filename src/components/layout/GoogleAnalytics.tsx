// src/components/GoogleAnalytics.tsx

import { useEffect } from 'react';
import { initializeAnalytics } from '../../utils/analytics';

export function GoogleAnalytics() {
    const trackingId = import.meta.env.VITE_GA_TRACKING_ID;

    useEffect(() => {
        if (!trackingId) {
            console.warn('Google Analytics tracking ID not found in environment variables');
            return;
        }

        const analytics = initializeAnalytics({
            trackingId,
            debug: import.meta.env.DEV,
            anonymizeIp: true,
            cookieDomain: 'auto',
        });

        analytics.initialize().catch((error) => {
            console.error('Failed to initialize Google Analytics:', error);
        });

        return () => {
            // Cleanup if needed
            const existingScript = document.querySelector(`script[src*="gtag/js?id=${trackingId}"]`);
            if (existingScript) {
                existingScript.remove();
            }
        };
    }, [trackingId]);

    if (!trackingId) {
        return null;
    }

    return null; // Script is loaded dynamically
}
