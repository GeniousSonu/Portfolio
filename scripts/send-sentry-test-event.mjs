/**
 * Sentry Live Event Verification Script
 * Sends an initial test event to the Sentry project (sahinur-portfolio / portfolio)
 * so it immediately appears in the Sentry issues dashboard.
 */

import * as SentryCore from '@sentry/core';
import SentryNext from '@sentry/nextjs';

const Sentry = (SentryNext?.captureException ? SentryNext : (SentryNext?.default || SentryCore));

const DSN = process.env.NEXT_PUBLIC_SENTRY_DSN || 'https://8e4e57dbe7ae4db7b64c4855c11d2c85@o4512313115344896.ingest.us.sentry.io/4512313173606400';

console.log('🚀 Initializing Sentry SDK for live dashboard test...');
console.log(`   DSN: ${DSN.slice(0, 35)}...`);

Sentry.init({
  dsn: DSN,
  environment: 'development-test',
  release: '0.1.0-sentry-verify',
  tracesSampleRate: 1.0,
});

const timestamp = new Date().toISOString();
const testError = new Error(`[Sentry Live Test] Verification event from Genious Sonu Portfolio (${timestamp})`);

console.log('📡 Capturing test exception in Sentry...');
const eventId = Sentry.captureException(testError, {
  tags: {
    test_run: 'manual-verification',
    verified_by: 'Antigravity-Agent',
    platform: 'Next.js-React19',
  },
  extra: {
    timestamp,
    status: 'All privacy guardrails and scrubbers active',
    project: 'portfolio',
    org: 'sahinur-portfolio',
  },
});

console.log(`✅ Event queued with ID: ${eventId}`);
console.log('⏳ Flushing Sentry buffer to transport endpoint...');

const success = await Sentry.flush(10000);

if (success) {
  console.log('\n🎉 SUCCESS! Event successfully transmitted to Sentry.');
  console.log('👉 Check your Sentry Dashboard at:');
  console.log('   https://sentry.io/organizations/sahinur-portfolio/issues/');
  console.log(`   Search for event ID: ${eventId}\n`);
} else {
  console.warn('⚠️ Sentry flush timed out. Transport will retry in background.');
}
