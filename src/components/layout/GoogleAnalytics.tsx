// src/components/GoogleAnalytics.tsx

import { useEffect } from 'react'
import {
  GOOGLE_ANALYTICS_TRACKING_ID,
  initializeAnalytics
} from '../../utils/analytics'

export function GoogleAnalytics() {
  const trackingId = GOOGLE_ANALYTICS_TRACKING_ID

  useEffect(() => {
    if (!trackingId) {
      console.warn('Google Analytics tracking ID is not configured')
      return
    }

    const analytics = initializeAnalytics({
      trackingId,
      debug: import.meta.env.DEV,
      anonymizeIp: true,
      cookieDomain: 'auto'
    })

    analytics.initialize().catch((error) => {
      console.error('Failed to initialize Google Analytics:', error)
    })

    return () => {
      // Cleanup if needed
      const existingScript = document.querySelector(
        `script[src*="gtag/js?id=${trackingId}"]`
      )
      if (existingScript) {
        existingScript.remove()
      }
    }
  }, [trackingId])

  if (!trackingId) {
    return null
  }

  return null // Script is loaded dynamically
}
