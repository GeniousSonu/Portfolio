// Client-Side Sentry Instrumentation & Privacy Firewall (PRD Phase 5 / OPS-03 / PRV-01)
// https://docs.sentry.io/platforms/javascript/guides/nextjs/

import * as Sentry from '@sentry/nextjs';
import { getConsentStatus } from '@/lib/consent';
import { scrubSentryEvent, scrubSentryBreadcrumb } from '@/lib/sentryScrubber';

const dsn = process.env.NEXT_PUBLIC_SENTRY_DSN;
const isProduction = process.env.NODE_ENV === 'production';
const release =
  process.env.NEXT_PUBLIC_VERCEL_GIT_COMMIT_SHA ||
  process.env.VERCEL_GIT_COMMIT_SHA ||
  'local-dev';
const environment =
  process.env.NEXT_PUBLIC_VERCEL_ENV ||
  process.env.NODE_ENV ||
  'development';

// Initialization is a complete no-op if NEXT_PUBLIC_SENTRY_DSN is absent
if (dsn) {
  Sentry.init({
    dsn,
    enabled: Boolean(dsn),

    // Release & environment tagging with commit SHA and Vercel environment
    release,
    environment,

    // Performance tracing capped at 10% (0.1) in production to respect quotas
    tracesSampleRate: isProduction ? 0.1 : 0.0,

    // Strict PII protection: disable default telemetry PII
    sendDefaultPii: false,

    // Explicitly NO session replay (Zero invasive user recording)
    replaysSessionSampleRate: 0,
    replaysOnErrorSampleRate: 0,

    // Noise Control: filter out known harmless and third-party extension errors
    ignoreErrors: [
      // Harmless browser layout cycle warning common in modern responsive components
      /ResizeObserver loop/i,
      /ResizeObserver loop completed with undelivered notifications/i,
      // Browser extensions or unhandled third-party promise cancellations
      /Non-Error promise rejection captured/i,
      // Transient client network disconnect or ad-blocker drop
      /NetworkError when attempting to fetch resource/i,
      /Failed to fetch/i,
      /Load failed/i,
      // Fetch aborted by user route navigation
      /cancelled/i,
      /AbortError/i,
      // Third-party browser extension injection scripts
      /chrome-extension:\/\//i,
      /moz-extension:\/\//i,
      /safari-extension:\/\//i,
      /safari-web-extension:\/\//i,
    ],

    // Deny URLs from browser extensions and external tracking vendors
    denyUrls: [
      /extensions\//i,
      /^chrome:\/\//i,
      /^chrome-extension:\/\//i,
      /^moz-extension:\/\//i,
      /^safari-extension:\/\//i,
      /gtm\.js/i,
      /analytics\.js/i,
      /googletagmanager\.com/i,
    ],

    // Consent Gate: Client events are strictly blocked until explicit user consent
    beforeSend(event) {
      if (typeof window !== 'undefined' && getConsentStatus() !== 'granted') {
        // Zero analytics or Sentry client events before user consent
        return null;
      }
      return scrubSentryEvent(event);
    },

    // Consent Gate on Breadcrumbs: Drop breadcrumbs if consent has not been granted
    beforeBreadcrumb(breadcrumb) {
      if (typeof window !== 'undefined' && getConsentStatus() !== 'granted') {
        return null;
      }
      return scrubSentryBreadcrumb(breadcrumb);
    },
  });
}

export const onRouterTransitionStart = Sentry.captureRouterTransitionStart;
