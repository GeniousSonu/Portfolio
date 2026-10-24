# ADR-001: PWA Service Worker Architecture & Strategy (Next.js 16 App Router)

**Status:** Accepted  
**Date:** 2026-10-13  
**Deciders:** Core Engineering Team  
**Relates to:** [INC-001 Incident Report](../incidents/INC-001.md)

---

## 1. Context & Problem Statement

The platform is built on Next.js 16 (App Router), React 19, and modern web standards. PWA functionality was originally introduced to support progressive installation, offline reliability, and caching of static assets.

During Incident INC-001, users experienced persistent blank screens (`#050505` background with only scrollbars visible) across page reloads. The investigation revealed that:

1. Legacy PWA tooling (`next-pwa` or ad-hoc Workbox scripts) applied **Stale-While-Revalidate** caching to HTML navigation requests.
2. In Next.js App Router, every production deployment generates newly hashed JavaScript chunks (e.g. `/_next/static/chunks/app/page-[hash].js`).
3. Serving stale cached HTML led the client browser to request chunk hashes that no longer existed on the production host (HTTP 404), triggering unhandled `ChunkLoadError` exceptions.
4. Paired with CSS that initialized elements with `opacity: 0` pending JavaScript hydration, the failed hydration left the site completely blank.
5. `next-pwa` is abandoned and incompatible with modern Next.js (App Router, Turbopack, React Server Components).

We must define a durable, robust service worker strategy that guarantees reliability without introducing breaking build-time plugins or risk of stale document trapping.

---

## 2. Decision Drivers

- **Zero Blank Page Risk:** Navigation HTML must NEVER serve stale script references that 404 against current deployments.
- **Next.js 16 Compatibility:** Avoid brittle Webpack hook monkeys-patching; support Turbopack and App Router seamlessly.
- **Fail-Safe Offline Support:** Provide clean offline fallback without trapping users when online.
- **Self-Healing Capability:** The client and service worker must automatically purge corrupted caches and unregister obsolete workers.
- **Minimal Complexity:** Zero unnecessary runtime or build-time dependencies.

---

## 3. Options Considered

### Option A: `next-pwa` (Legacy)

- **Evaluation:** Rejected.
- **Rationale:** Abandoned repository, unmaintained for multiple major Next.js versions. Deeply tightly-coupled to legacy Webpack 4/5 tapable hooks. Incompatible with Next.js 16 and Turbopack. Generates unpredictable, opaque caching manifests that historically caused INC-001.

### Option B: Standalone Hand-Crafted `public/sw.js` (Adopted for Immediate & Baseline Protection)

- **Evaluation:** Accepted as the immediate and permanent baseline.
- **Rationale:**
  - 100% transparent and deterministic.
  - Zero build plugins or Webpack coupling.
  - Strictly enforces **Network-First** for navigation requests with `/offline` fallback; never caches HTML in long-lived caches.
  - Explicit versioned caching (`sks-static-v2`, `sks-fonts-v2`) with automatic activation cleanup that deletes all legacy caches (`sks-pages-*`, `workbox-*`).
  - Supports manual bypass for critical routes (`/reset`, `/studio`, `/api`, `_rsc`).
  - Works identically under both `next dev` (Turbopack) and `next build` (Webpack).

### Option C: Migration to Serwist (`@serwist/next`)

- **Evaluation:** Accepted as the Recommended Future Enhancement Path.
- **Rationale:**
  - Serwist is the modern, actively maintained successor to `next-pwa` and `@ducanh2912/next-pwa`.
  - Built specifically for modern Next.js App Router and TypeScript.
  - Properly handles precaching of build manifests while respecting RSC streaming.
  - When the project requires background sync, push notifications, or complex precaching beyond static assets, Serwist is the standard solution to adopt.

---

## 4. Architectural Rules & Implementation Mandate

1. **HTML Navigation Strategy:**
   - Navigations (`request.mode === 'navigate'`) MUST always use **Network-First** with a timeout.
   - If the network fails (offline), return the pre-cached static `/offline` page.
   - Dynamic HTML pages MUST NEVER be cached under generic Stale-While-Revalidate rules.

2. **HTTP Cache-Control Headers in `next.config.mjs`:**
   - Hashed chunks `/_next/static/:path*`: `public, max-age=31536000, immutable`.
   - HTML documents `/:path*`: `public, max-age=0, must-revalidate`.
   - Service worker script `/sw.js`: `no-cache, no-store, must-revalidate`.
   - Emergency kill switch `/reset`: `no-store, no-cache, must-revalidate`.

3. **Active Cache Invalidation & Self-Healing:**
   - The service worker `activate` event purges any cache not matching the current whitelist.
   - The client application includes `selfHeal.js` and `/reset` to unregister service workers and purge caches upon detecting `ChunkLoadError` or repeated hydration failures.

4. **Future Serwist Adoption Criteria:**
   - If offline capabilities need to expand beyond static assets and the offline fallback page, adopt `@serwist/next`.
   - Any Serwist configuration must explicitly disable document HTML precaching or configure strict Network-First for navigation routes.

---

## 5. Consequences

### Positive

- **Guaranteed Freshness:** Visitors always receive the latest deployment's HTML and chunk references.
- **Zero Build Breakage:** Turbopack and Next.js 16 builds execute cleanly without plugin collisions.
- **Deterministic Recovery:** Users trapped by obsolete workers from previous builds are automatically rescued via the `activate` cache eviction and client self-healing script.
- **Auditable & Maintainable:** The entire caching logic lives in a single, well-documented file ([public/sw.js](file:///home/dayshift/Music/Portfolio/public/sw.js)).

### Tradeoffs

- Offline browsing is limited to previously cached assets and the dedicated `/offline` page, rather than arbitrary offline reading of unvisited dynamic articles. This is an intentional tradeoff in favor of 100% stability.
