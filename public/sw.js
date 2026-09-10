// High-Performance PWA Service Worker for SK Sahinur Islam Portfolio
// Cache-First for static assets; Stale-While-Revalidate for HTML pages & dynamic routes

const CACHE_VERSION = 'v-1789023066277';
const STATIC_CACHE = `sks-static-${CACHE_VERSION}`;
const PAGES_CACHE = `sks-pages-${CACHE_VERSION}`;
const IMAGE_CACHE = `sks-images-${CACHE_VERSION}`;

const PRECACHE_ASSETS = [
  '/',
  '/manifest.webmanifest',
  '/manifest.json',
  '/icon-192.png',
  '/icon-512.png',
  '/icon-maskable-512.png',
  '/apple-touch-icon.png',
  '/logo.svg',
];

// 1. Install: Pre-cache core shell assets & activate immediately
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(STATIC_CACHE).then((cache) => {
      return cache.addAll(PRECACHE_ASSETS).catch((err) => {
        console.warn('PWA Precache partial notice:', err);
      });
    }).then(() => self.skipWaiting())
  );
});

// 2. Activate: Purge obsolete caches & claim clients immediately
self.addEventListener('activate', (event) => {
  const currentCaches = [STATIC_CACHE, PAGES_CACHE, IMAGE_CACHE];
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys
          .filter((key) => !currentCaches.includes(key))
          .map((key) => caches.delete(key))
      );
    }).then(() => self.clients.claim())
  );
});

// 2b. Explicit skip-waiting message listener
self.addEventListener('message', (event) => {
  if (event.data && (event.data.type === 'SKIP_WAITING' || event.data === 'skipWaiting')) {
    self.skipWaiting();
  }
});

// 3. Fetch Event Routing
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Only handle GET requests
  if (request.method !== 'GET') return;

  // Bypass Sanity Studio, internal APIs, and dev HMR
  if (
    url.pathname.startsWith('/studio') ||
    url.pathname.startsWith('/api') ||
    url.pathname.startsWith('/_next/webpack-hmr') ||
    url.pathname.startsWith('/__nextjs')
  ) {
    return;
  }

  // ── STRATEGY A: Stale-While-Revalidate for HTML Pages & Navigations ──
  // Users see cached pages instantly on repeat visits while fresh content updates in background
  if (request.mode === 'navigate' || request.headers.get('accept')?.includes('text/html')) {
    event.respondWith(
      caches.open(PAGES_CACHE).then(async (cache) => {
        const cachedResponse = await cache.match(request);

        // Fetch fresh copy from network in background
        const fetchPromise = fetch(request)
          .then((networkResponse) => {
            if (networkResponse && networkResponse.status === 200) {
              cache.put(request, networkResponse.clone());
            }
            return networkResponse;
          })
          .catch(async () => {
            // Network failed - if we had a cache match, it will be returned below
            if (cachedResponse) return cachedResponse;
            // Otherwise fallback to home page cache
            const homeFallback = await cache.match('/');
            if (homeFallback) return homeFallback;
            return new Response('Offline — SK Sahinur Islam Portfolio', {
              headers: { 'Content-Type': 'text/html; charset=utf-8' },
            });
          });

        // Return cached response immediately if available, else await network
        return cachedResponse || fetchPromise;
      })
    );
    return;
  }

  // ── STRATEGY B: Cache-First for Sanity CDN Images ──
  if (url.hostname === 'cdn.sanity.io') {
    event.respondWith(
      caches.open(IMAGE_CACHE).then(async (cache) => {
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

  // ── STRATEGY C: Cache-First for Static Assets (JS, CSS, Fonts, Icons) ──
  // Static versioned bundles rarely change; serve directly from cache
  const isStaticAsset =
    url.pathname.startsWith('/_next/static/') ||
    url.pathname.startsWith('/fonts/') ||
    url.pathname.startsWith('/logo/') ||
    url.pathname.endsWith('.woff2') ||
    url.pathname.endsWith('.woff') ||
    url.pathname.endsWith('.ttf') ||
    url.pathname.endsWith('.png') ||
    url.pathname.endsWith('.svg') ||
    url.pathname.endsWith('.webp') ||
    url.pathname.endsWith('.jpg') ||
    url.pathname.endsWith('.jpeg') ||
    url.pathname.endsWith('.ico') ||
    url.pathname.endsWith('.webmanifest');

  if (isStaticAsset) {
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

  // Default: Network with Cache fallback
  event.respondWith(
    fetch(request).catch(() => caches.match(request))
  );
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
      // If a window is already open, focus it and navigate
      for (const client of clientList) {
        if ('focus' in client) {
          client.navigate(targetUrl);
          return client.focus();
        }
      }
      // Otherwise open a new window
      if (self.clients.openWindow) {
        return self.clients.openWindow(targetUrl);
      }
    })
  );
});

