import { NextResponse } from 'next/server';
import * as Sentry from '@sentry/nextjs';

/**
 * Preview-Only Sentry Fault Injection Route (Task AUTOHEAL-001)
 *
 * STRICT GUARD: Completely disabled in production environments.
 * Returns 404 Not Found if accessed on production domain/environment.
 */
export async function GET(request) {
  const isProduction =
    process.env.VERCEL_ENV === 'production' ||
    (process.env.NODE_ENV === 'production' && !process.env.VERCEL_ENV);

  // Strictly absent from production builds / runtime
  if (isProduction) {
    return new NextResponse('Not Found', { status: 404 });
  }

  const { searchParams } = new URL(request.url);
  const action = searchParams.get('action') || 'exception';

  if (action === 'exception') {
    // Throws an unhandled server error caught by onRequestError / Sentry server instrumentation
    throw new Error('[Preview Fault Injection] Simulated unhandled server exception for Sentry pipeline test');
  }

  if (action === 'capture') {
    const sentry = Sentry.captureMessage ? Sentry : (Sentry.default || Sentry);
    const eventId = sentry.captureMessage(
      '[Preview Fault Injection] Manual message capture verification from Route Handler',
      'warning'
    );
    return NextResponse.json({
      status: 'captured',
      eventId,
      environment: process.env.VERCEL_ENV || 'preview-local',
    });
  }

  return NextResponse.json({
    status: 'ready',
    message: 'Preview fault route active. Pass ?action=exception to throw or ?action=capture to test Sentry.',
  });
}
