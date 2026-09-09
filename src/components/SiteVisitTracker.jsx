"use client";

import { useEffect } from 'react';
import { onAnalyticsConsent } from '@/lib/consent';
import { getOrCreateVisitorId } from '@/lib/visitorId';

/**
 * Executes visit tracking once per browser session, strictly gated on cookie consent.
 * Mounted in root layout to track unique visitors without firing on internal SPA route changes.
 */
export default function SiteVisitTracker() {
  useEffect(() => {
    // Avoid double-dispatch within the same browser session
    if (typeof window === 'undefined') return;

    try {
      if (sessionStorage.getItem('sks_visit_tracked') === '1') {
        return;
      }
    } catch (e) {
      // Storage unavailable
    }

    // Only fire when consent is granted (or once granted via consent banner)
    onAnalyticsConsent(() => {
      try {
        if (sessionStorage.getItem('sks_visit_tracked') === '1') {
          return;
        }

        const visitorId = getOrCreateVisitorId();
        if (!visitorId) return;

        fetch('/api/track-visit', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ visitorId }),
        })
          .then((res) => res.json())
          .then((data) => {
            if (data?.ok) {
              try {
                sessionStorage.setItem('sks_visit_tracked', '1');
              } catch (e) {}
            }
          })
          .catch(() => {
            // Fails silently per requirements
          });
      } catch (err) {
        // Silent graceful fallback
      }
    });
  }, []);

  return null;
}
