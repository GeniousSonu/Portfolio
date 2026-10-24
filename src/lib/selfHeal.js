/**
 * Client Self-Healing Recovery Module (Incident INC-001)
 * 
 * Intercepts ChunkLoadError, chunk download rejections, and hydration failures.
 * Automatically unregisters all service workers, clears Cache Storage, and executes
 * a single recovery reload with infinite-loop prevention.
 */

const RECOVERY_KEY = 'sks_self_heal_attempted';
const MAX_ATTEMPTS = 1;

export async function clearAllServiceWorkersAndCaches() {
  try {
    // 1. Unregister all service workers
    if (typeof navigator !== 'undefined' && 'serviceWorker' in navigator) {
      const registrations = await navigator.serviceWorker.getRegistrations();
      for (const reg of registrations) {
        await reg.unregister();
        console.log('[SelfHeal] Unregistered Service Worker:', reg.scope);
      }
    }

    // 2. Clear all Cache Storage buckets
    if (typeof caches !== 'undefined') {
      const keys = await caches.keys();
      for (const key of keys) {
        await caches.delete(key);
        console.log('[SelfHeal] Deleted Cache bucket:', key);
      }
    }
  } catch (err) {
    console.warn('[SelfHeal] Error clearing workers/caches:', err);
  }
}

export function isChunkOrHydrationError(err) {
  if (!err) return false;
  const msg = typeof err === 'string' ? err : err.message || err.name || '';
  return (
    msg.includes('ChunkLoadError') ||
    msg.includes('Loading chunk') ||
    msg.includes('Failed to fetch dynamically imported module') ||
    msg.includes('error loading dynamically imported module') ||
    msg.includes('Hydration failed') ||
    msg.includes('Text content does not match server-rendered HTML') ||
    msg.includes('Minified React error #418') ||
    msg.includes('Minified React error #423') ||
    msg.includes('Minified React error #425')
  );
}

export function initSelfHealing() {
  if (typeof window === 'undefined') return;

  const triggerSelfHeal = async (err) => {
    if (!isChunkOrHydrationError(err)) return;

    let attempts = 0;
    try {
      attempts = parseInt(sessionStorage.getItem(RECOVERY_KEY) || '0', 10);
    } catch {}

    if (attempts < MAX_ATTEMPTS) {
      console.warn('[SelfHeal] Chunk load failure detected. Performing automatic cache purge & recovery reload...');
      try {
        sessionStorage.setItem(RECOVERY_KEY, String(attempts + 1));
      } catch {}

      // Report initial self-heal attempt to Sentry once
      try {
        const Sentry = await import('@sentry/nextjs');
        Sentry.captureException(err instanceof Error ? err : new Error(String(err)), {
          level: 'warning',
          tags: {
            mechanism: 'self-heal',
            stage: 'recovery-reload',
            attempt: String(attempts + 1),
          },
          fingerprint: ['self-heal', 'chunk-or-hydration-error'],
        });
      } catch {}

      await clearAllServiceWorkersAndCaches();
      window.location.reload();
    } else {
      console.error('[SelfHeal] Recovery already attempted for this session. Showing fallback UI.');

      // Report exhausted self-heal to Sentry once without looping
      try {
        const Sentry = await import('@sentry/nextjs');
        Sentry.captureException(err instanceof Error ? err : new Error(String(err)), {
          level: 'fatal',
          tags: {
            mechanism: 'self-heal',
            stage: 'exhausted',
            attempt: String(attempts),
          },
          fingerprint: ['self-heal', 'exhausted-blank-screen-risk'],
        });
      } catch {}

      window.dispatchEvent(new CustomEvent('self-heal-exhausted', { detail: { error: err } }));
    }
  };

  window.addEventListener('error', (e) => {
    triggerSelfHeal(e.error || e.message);
  });

  window.addEventListener('unhandledrejection', (e) => {
    triggerSelfHeal(e.reason);
  });
}
