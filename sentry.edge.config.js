// Edge Runtime Sentry Instrumentation (PRD Phase 5 / OPS-03)
// https://docs.sentry.io/platforms/javascript/guides/nextjs/

import * as Sentry from '@sentry/nextjs';
import { scrubSentryEvent, scrubSentryBreadcrumb } from './src/lib/sentryScrubber.js';

const dsn = process.env.SENTRY_DSN || process.env.NEXT_PUBLIC_SENTRY_DSN;
const isProduction = process.env.NODE_ENV === 'production';
const release =
  process.env.VERCEL_GIT_COMMIT_SHA ||
  process.env.NEXT_PUBLIC_VERCEL_GIT_COMMIT_SHA ||
  'local-dev';
const environment =
  process.env.VERCEL_ENV ||
  process.env.NEXT_PUBLIC_VERCEL_ENV ||
  process.env.NODE_ENV ||
  'development';

// Initialization is a complete no-op if DSN is absent
if (dsn) {
  Sentry.init({
    dsn,
    enabled: Boolean(dsn),

    // Release & environment tagging with commit SHA and Vercel environment
    release,
    environment,

    // Performance tracing capped at 10% (0.1) in production
    tracesSampleRate: isProduction ? 0.1 : 0.0,

    // Strict PII protection
    sendDefaultPii: false,

    // Ignore known harmless noise
    ignoreErrors: [
      /ECONNRESET/i,
      /EPIPE/i,
      /ClientAbortError/i,
    ],

    // Mandatory scrubbing: redact headers, auth secrets, database credentials, IPs, and PII
    beforeSend(event) {
      return scrubSentryEvent(event);
    },

    beforeBreadcrumb(breadcrumb) {
      return scrubSentryBreadcrumb(breadcrumb);
    },
  });
}
