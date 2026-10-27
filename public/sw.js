// High-Reliability PWA Service Worker for SK Sahinur Islam Portfolio
// Built for Next.js 16 App Router & Zero-Stale Navigation Architecture
// Incident INC-001 Hardened: Navigations are strictly Network-First with Offline fallback only

const CACHE_VERSION = 'v-6477283-1793110943758';
const STATIC_CACHE = `sks-static-${CACHE_VERSION}`;
const OFFLINE_CACHE = `sks-offline-${CACHE_VERSION}`;

// Only immutable core shell items and offline fallback page are precached
const PRECACHE_ASSETS = [
  '/offline',
  '/manifest.webmanifest',
  '/manifest.json',
  '/icon-192.png',
  '/icon-512.png',
  '/icon-maskable-512.png',
  '/apple-touch-icon.png',
  '/logo.svg',
];

// 1. Install: Precache offline fallback & skip waiting
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(OFFLINE_CACHE).then((cache) => {
      return cache.addAll(PRECACHE_ASSETS).catch((err) => {
        console.warn('[SW] Precache notice:', err);
      });
    }).then(() => self.skipWaiting())
  );
});

// 2. Activate: Purge ALL obsolete & foreign caches, then claim clients immediately
self.addEventListener('activate', (event) => {
  const allowedCaches = [STATIC_CACHE, OFFLINE_CACHE];
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys
          .filter((key) => !allowedCaches.includes(key))
          .map((key) => {
            console.log('[SW] Purging obsolete/stale cache:', key);
            return caches.delete(key);
          })
      );
    }).then(() => self.clients.claim())
  );
});

// 2b. Message listener (supports SKIP_WAITING and emergency cache purge)
self.addEventListener('message', (event) => {
  if (event.data) {
    if (event.data.type === 'SKIP_WAITING' || event.data === 'skipWaiting') {
      self.skipWaiting();
    }
    if (event.data.type === 'PURGE_ALL_CACHES') {
      event.waitUntil(
        caches.keys().then((keys) => Promise.all(keys.map((k) => caches.delete(k))))
      );
    }
  }
});

// 3. Fetch Event Routing
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Only handle GET requests
  if (request.method !== 'GET') return;

  // Never intercept:
  // - Emergency reset route (/reset)
  // - Sanity Studio (/studio)
  // - API endpoints (/api/*)
  // - Next.js internal endpoints (_next/data, webpack-hmr, __nextjs)
  // - Next.js React Server Components (RSC) requests containing ?_rsc=
  if (
    url.pathname.startsWith('/reset') ||
    url.pathname.startsWith('/studio') ||
    url.pathname.startsWith('/api') ||
    url.pathname.startsWith('/_next/data') ||
    url.pathname.startsWith('/_next/webpack-hmr') ||
    url.pathname.startsWith('/__nextjs') ||
    url.searchParams.has('_rsc')
  ) {
    return;
  }

  // ── STRATEGY A: Navigation & HTML Requests (STRICTLY NETWORK-FIRST / NETWORK-ONLY) ──
  // CRITICAL INC-001 FIX: NEVER cache HTML documents or Next.js navigation responses in runtime cache!
  // Prevents serving stale HTML with dead chunk hashes. Falls back to pre-cached /offline page only.
  if (request.mode === 'navigate' || request.headers.get('accept')?.includes('text/html')) {
    event.respondWith(
      fetch(request).catch(async () => {
        const offlineCache = await caches.open(OFFLINE_CACHE);
        const offlineMatch = await offlineCache.match('/offline');
        if (offlineMatch) {
          return offlineMatch;
        }
        return new Response(
          '<!DOCTYPE html><html><head><meta charset="utf-8"><title>Offline — SK Sahinur Islam</title><meta name="viewport" content="width=device-width,initial-scale=1"></head><body style="background:#050505;color:#f9fafb;font-family:sans-serif;display:flex;align-items:center;justify-content:center;height:100vh;margin:0;padding:20px;text-align:center"><div><h2>Network Offline</h2><p style="color:#9ca3af">Please check your internet connection and reload.</p><button onclick="location.reload()" style="background:#10b981;color:#050505;border:none;padding:10px 20px;border-radius:8px;font-weight:600;cursor:pointer">Reload Page</button></div></body></html>',
          {
            headers: { 'Content-Type': 'text/html; charset=utf-8' },
          }
        );
      })
    );
    return;
  }

  // ── STRATEGY B: Cache-First for Immutable Static Assets (JS, CSS, Fonts, Icons) ──
  const isImmutableStatic =
    url.pathname.startsWith('/_next/static/') ||
    url.pathname.startsWith('/fonts/') ||
    url.pathname.startsWith('/logo/') ||
    url.pathname.endsWith('.woff2') ||
    url.pathname.endsWith('.woff') ||
    url.pathname.endsWith('.ttf') ||
    url.pathname.endsWith('.png') ||
    url.pathname.endsWith('.svg') ||
    url.pathname.endsWith('.webp') ||
    url.pathname.endsWith('.ico');

  if (isImmutableStatic) {
    event.respondWith(
      caches.open(STATIC_CACHE).then(async (cache) => {
        const cachedResponse = await cache.match(request);
        if (cachedResponse) {
          return cachedResponse;
        }
        return fetch(request).then((networkResponse) => {
          if (networkResponse && networkResponse.status === 200) {
            cache.put(request, networkResponse.clone());
          }
          return networkResponse;
        }).catch(() => cachedResponse);
      })
    );
    return;
  }

  // Default: Normal Network request
  event.respondWith(fetch(request));
});

// 4. Web Push Notification Handlers
self.addEventListener('push', (event) => {
  let data = {
    title: 'SK Sahinur Islam (Sonu)',
    body: 'You have a new reply in live chat 💬',
    url: '/',
    tag: 'live-chat-default',
    icon: '/icon-192.png',
    badge: '/icon-192.png',
  };

  if (event.data) {
    try {
      data = Object.assign(data, event.data.json());
    } catch {
      data.body = event.data.text() || data.body;
    }
  }

  const options = {
    body: data.body,
    icon: data.icon || '/icon-192.png',
    badge: data.badge || '/icon-192.png',
    vibrate: [100, 50, 100],
    data: {
      url: data.url || '/',
      dateOfArrival: Date.now(),
    },
    tag: data.tag || 'live-chat-notification',
    renotify: true,
  };

  event.waitUntil(
    self.registration.showNotification(data.title, options)
  );
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  const targetUrl = event.notification.data?.url || '/';

  event.waitUntil(
    self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
      for (const client of clientList) {
        if ('focus' in client) {
          client.navigate(targetUrl);
          return client.focus();
        }
      }
      if (self.clients.openWindow) {
        return self.clients.openWindow(targetUrl);
      }
    })
  );
});
