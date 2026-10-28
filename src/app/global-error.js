'use client';

import React, { useEffect } from 'react';
import * as Sentry from '@sentry/nextjs';

/**
 * Global Root Error Boundary (Incident INC-001)
 * Catches errors thrown inside RootLayout and prevents total document unmount.
 * Must render its own <html> and <body>.
 */
export default function GlobalError({ error, reset }) {
  useEffect(() => {
    console.error('[Global Error Boundary]:', error?.message || 'Root layout error');
    if (error) {
      Sentry.captureException(error);
    }
  }, [error]);

  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>Application Error — SK Sahinur Islam</title>
      </head>
      <body
        style={{
          margin: 0,
          padding: '24px',
          backgroundColor: 'var(--void, #050505)',
          color: 'var(--text-primary, #f9fafb)',
          fontFamily: 'var(--font-mono, monospace)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '100vh',
          minHeight: '100dvh',
          boxSizing: 'border-box',
        }}
      >
        <div
          style={{
            maxWidth: '480px',
            width: '100%',
            backgroundColor: 'var(--surface-card, #0f1115)',
            border: '1px solid var(--border-hairline, rgba(255, 255, 255, 0.12))',
            borderRadius: 'var(--radius-md, 12px)',
            padding: '32px 24px',
            textAlign: 'center',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.5)',
          }}
        >
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '44px',
              height: '44px',
              borderRadius: '50%',
              backgroundColor: 'rgba(239, 68, 68, 0.12)',
              border: '1px solid rgba(239, 68, 68, 0.3)',
              color: 'var(--red, #ef4444)',
              fontSize: '20px',
              marginBottom: '16px',
            }}
          >
            !
          </div>

          <h1
            style={{
              fontSize: '18px',
              fontWeight: 600,
              marginBottom: '10px',
              color: 'var(--text-primary, #ffffff)',
            }}
          >
            System Recovery Mode
          </h1>

          <p
            style={{
              fontSize: '13px',
              lineHeight: 1.6,
              color: 'var(--text-secondary, #9ca3af)',
              marginBottom: '24px',
            }}
          >
            The root layout encountered an error while booting. You can reload the page or reset the client cache.
          </p>

          <div
            style={{
              display: 'flex',
              gap: '12px',
              justifyContent: 'center',
              flexWrap: 'wrap',
            }}
          >
            <button
              type="button"
              onClick={() => {
                if (typeof reset === 'function') {
                  try {
                    reset();
                  } catch {
                    window.location.reload();
                  }
                } else {
                  window.location.reload();
                }
              }}
              style={{
                padding: '10px 18px',
                backgroundColor: 'var(--signal, #10b981)',
                color: 'var(--void, #050505)',
                border: 'none',
                borderRadius: 'var(--radius-sm, 8px)',
                fontSize: '13px',
                fontWeight: 600,
                cursor: 'pointer',
                fontFamily: 'inherit',
              }}
            >
              Try Again
            </button>

            <a
              href="/reset"
              style={{
                padding: '10px 18px',
                backgroundColor: 'rgba(255, 255, 255, 0.06)',
                color: 'var(--text-primary, #d1d5db)',
                border: '1px solid var(--border-hairline, rgba(255, 255, 255, 0.12))',
                borderRadius: 'var(--radius-sm, 8px)',
                fontSize: '13px',
                fontWeight: 500,
                textDecoration: 'none',
                display: 'inline-flex',
                alignItems: 'center',
                cursor: 'pointer',
                fontFamily: 'inherit',
              }}
            >
              Reset Site Cache
            </a>
          </div>
        </div>
      </body>
    </html>
  );
}
