'use client';

import React, { useEffect, useState } from 'react';
import { clearAllServiceWorkersAndCaches } from '@/lib/selfHeal';
import safeStorage from '@/lib/safeStorage';

export default function ResetPage() {
  const [status, setStatus] = useState('Clearing site storage and caches...');
  const [complete, setComplete] = useState(false);

  useEffect(() => {
    async function performReset() {
      try {
        setStatus('Unregistering service workers & clearing Cache Storage...');
        await clearAllServiceWorkersAndCaches();

        setStatus('Clearing local application preferences & session state...');
        safeStorage.clearAppKeys();

        // Also clear any self-heal loop counters
        try {
          sessionStorage.clear();
        } catch {}

        setStatus('Cache reset complete. Redirecting to home...');
        setComplete(true);

        const timer = setTimeout(() => {
          window.location.replace('/');
        }, 600);

        return () => clearTimeout(timer);
      } catch (err) {
        console.error('[Reset] Failed to complete full reset:', err);
        setStatus('Reset encountered an error, but cache cleanup was attempted.');
        setComplete(true);
      }
    }

    performReset();
  }, []);

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        minHeight: '100dvh',
        backgroundColor: '#050505',
        color: '#f9fafb',
        fontFamily: 'monospace',
        padding: '24px',
        boxSizing: 'border-box',
      }}
    >
      <div
        style={{
          maxWidth: '460px',
          width: '100%',
          backgroundColor: '#0f1115',
          border: '1px solid rgba(255, 255, 255, 0.12)',
          borderRadius: '12px',
          padding: '28px',
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
            backgroundColor: 'rgba(16, 185, 129, 0.1)',
            border: '1px solid rgba(16, 185, 129, 0.3)',
            marginBottom: '16px',
            color: '#10b981',
            fontSize: '20px',
          }}
        >
          ↻
        </div>

        <h1
          style={{
            fontSize: '18px',
            fontWeight: 600,
            marginBottom: '12px',
            color: '#ffffff',
            letterSpacing: '-0.01em',
          }}
        >
          Cache Reset &amp; Recovery
        </h1>

        <p
          style={{
            fontSize: '13px',
            lineHeight: 1.6,
            color: '#9ca3af',
            marginBottom: '24px',
          }}
        >
          {status}
        </p>

        {complete && (
          // Full document reload is intentional here to bypass stale router memory after storage wipe
          // eslint-disable-next-line @next/next/no-html-link-for-pages
          <a
            href="/"
            style={{
              display: 'inline-block',
              padding: '10px 20px',
              backgroundColor: '#10b981',
              color: '#050505',
              fontWeight: 600,
              fontSize: '13px',
              borderRadius: '8px',
              textDecoration: 'none',
              transition: 'opacity 0.2s ease',
            }}
          >
            Return to Home (/) →
          </a>
        )}
      </div>
    </div>
  );
}
