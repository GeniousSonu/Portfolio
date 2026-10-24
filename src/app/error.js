'use client';

import React, { useEffect } from 'react';
import * as Sentry from '@sentry/nextjs';

/**
 * Route Segment Error Boundary (Incident INC-001)
 * Prevents application blank screen when any route or component throws during render or hydration.
 */
export default function Error({ error, reset }) {
  useEffect(() => {
    // Log sanitized error and report to Sentry
    console.error('[Application Error Boundary caught error]:', error?.message || 'Unknown render error');
    if (error) {
      Sentry.captureException(error);
    }
  }, [error]);

  const handleHardRefresh = () => {
    window.location.reload();
  };

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '70vh',
        padding: '24px',
        backgroundColor: 'transparent',
        color: '#f9fafb',
        fontFamily: 'monospace',
        textAlign: 'center',
      }}
    >
      <div
        style={{
          maxWidth: '480px',
          width: '100%',
          backgroundColor: '#0f1115',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          borderRadius: '12px',
          padding: '32px 24px',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4)',
        }}
      >
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '40px',
            height: '40px',
            borderRadius: '50%',
            backgroundColor: 'rgba(239, 68, 68, 0.12)',
            border: '1px solid rgba(239, 68, 68, 0.3)',
            color: '#ef4444',
            fontSize: '18px',
            marginBottom: '16px',
          }}
        >
          !
        </div>

        <h2
          style={{
            fontSize: '18px',
            fontWeight: 600,
            marginBottom: '10px',
            color: '#f9fafb',
          }}
        >
          Application Error
        </h2>

        <p
          style={{
            fontSize: '13px',
            lineHeight: 1.6,
            color: '#9ca3af',
            marginBottom: '24px',
          }}
        >
          An unexpected render or asset loading issue occurred while displaying this page.
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
                  handleHardRefresh();
                }
              } else {
                handleHardRefresh();
              }
            }}
            style={{
              padding: '10px 18px',
              backgroundColor: '#10b981',
              color: '#050505',
              border: 'none',
              borderRadius: '8px',
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
              color: '#d1d5db',
              border: '1px solid rgba(255, 255, 255, 0.12)',
              borderRadius: '8px',
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
    </div>
  );
}
