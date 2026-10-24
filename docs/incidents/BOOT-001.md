# Incident BOOT-001 — Root Cause Analysis: Missing Name Preloader

**Date:** 2026-10-13  
**Status:** Diagnosed & Solution Engineered  
**Component:** `src/components/BootPreloader.jsx`  
**Classification:** State Persistence Bug / Premature Exit / Font Fallback Gap  

---

## 1. Executive Summary

Visitors and testers reported that the animated name preloader sequence ("Sahinur" across multilingual scripts) was completely absent after using the site, upon normal reloads, and upon route navigation.

A thorough investigation of the component tree, state initialization, storage systems, and CSS styling revealed the concrete root causes:

1. **Persistent Session Flag (`sessionStorage` Trap)**:
   In `BootPreloader.jsx`, line 20-32 and lines 56-60, the preloader marked completion by writing `safeStorage.setItem('genioussonu_booted_v1', '1', 'session')`. `sessionStorage` survives normal page reloads (F5, Cmd+R, typing other internal URLs, or deep linking within the same browser tab session). Consequently, on every reload, `active` initialized to `false`, immediately unmounting the preloader before first render.
2. **Missing Navigation Type Gate**:
   The component failed to inspect `performance.getEntriesByType('navigation')[0].type`. It did not distinguish between client navigation, hard reload, fresh document load, and `back_forward` history restorations.
3. **Bloated Timing & Premature Reduced Motion Bypass**:
   The previous preloader had a multi-act structure (~6 seconds) including a simulated terminal window (`$ whoami`, `./init_portfolio.sh`) preceding the name greeting sequence. Because of this duration and INC-001's 4s ceiling, and because `prefers-reduced-motion` immediately called `finishPreloader()` with 0ms delay, users rarely or never saw the multilingual greetings.
4. **Remote CDN Font Dependency Without Subset Preloading**:
   The greetings relied on external Google Fonts CDN links (`fonts.googleapis.com`) without Cyrillic support, without local glyph subsetting, and without awaiting `document.fonts.ready`. If the network lagged, text flashed unstyled or fell back to system sans-serif.

---

## 2. Evidence & Audit Findings (Checklist)

### (a) Did the component render at all?

- **Finding:** Yes, `<BootPreloader />` was still imported and rendered in `src/app/layout.js` (line 339). It was neither removed nor commented out by INC-001.
- **Evidence:** `src/app/layout.js:339` mounts `<BootPreloader />` within `<TransitionProvider>` and `<PlaygroundProvider>`.

### (b) `hasBootedInSession` and `sessionStorage` / `localStorage` logic

- **Finding:** `sessionStorage` key `genioussonu_booted_v1` was set on the first boot finish.
- **Evidence:** In `BootPreloader.jsx`:

  ```js
  const [active, setActive] = useState(() => {
    if (typeof window !== 'undefined') {
      try {
        if (safeStorage.getItem(SESSION_KEY, null, 'session') === '1') {
          return false;
        }
      } catch {}
    }
    return !hasBootedInSession;
  });
  ```

  Once set in the session, `sessionStorage` persists across all page reloads in that tab. Thus, any reload after the initial visit resulted in `active = false`, causing the component to return `null` immediately.

### (c) `pageshow` and `bfcache` handling

- **Finding:** While `BootPreloader.jsx` added a `pageshow` listener for `event.persisted`, it did not prevent the initial overlay render during `back_forward` navigations before hydration.
- **Evidence:** An early inline script to add `.boot-skip` on `navigation.type === 'back_forward'` was missing from `<head>`, risking a flash of preloader overlay when returning via browser history.

### (d) Layout placement vs `template.js`

- **Finding:** The component lives in `src/app/layout.js` (the persistent root layout).
- **Evidence:** Because Next.js App Router root layouts do not remount on client-side route transitions, it is in the correct structural container. However, relying on persistent browser storage caused it to fail on genuine full-document reloads.

### (e) CSS or class rules hiding the element

- **Finding:** In `src/app/globals.css`:
  - `.boot-hello-wrap` had inline `display: none; opacity: 0; visibility: hidden;` until Act 3 of the previous timeline.
  - Furthermore, if `sessionStorage` had the boot flag, `#boot-preloader` never rendered to the DOM at all (`if (!active) return null;`).

### (f) Font loading for multilingual scripts

- **Finding:** No self-hosted local font subsets existed for the multilingual names.
- **Evidence:** `src/app/layout.js` linked to Google Fonts CDN for Noto Sans Bengali, Devanagari, Arabic, and JP, but lacked Cyrillic (Russian), and did not wait for `document.fonts.ready`. If the CDN request was slow, the greetings rendered with system fallback fonts or tofu boxes.

---

## 3. Remediation Architecture (BOOT-001 Contract)

1. **Navigation Entry Detection**:
   - Detect `performance.getEntriesByType('navigation')[0]?.type`.
   - Play on: `'navigate'`, `'reload'`, `'prerender'`.
   - Skip on: `'back_forward'`, and `pageshow` (`event.persisted === true`).
2. **In-Memory Document Boot Flag**:
   - Remove `sessionStorage` and `localStorage` flags for preloader gating.
   - Use an in-memory module variable (`let hasBootedInThisDocument = false`) so every genuine full document load/reload plays cleanly, while client-side soft navigations never replay it.
3. **Zero-Flash Server Render & Early Script**:
   - Server-render the preloader overlay in initial HTML.
   - Inject a tiny early `<head>` inline script that detects `back_forward` and immediately applies `html.boot-skip` to suppress the overlay before first paint.
4. **Self-Hosted, Subsetted Fonts**:
   - Generate tiny WOFF2 local font subsets containing exclusively the required glyphs for Bengali, Devanagari, Japanese, Russian, Arabic, and Latin.
   - Gate animation on `document.fonts.ready` (with 600ms cap).
5. **Exact Strict Timing (< 2.5s Total)**:
   - Bengali $\to$ Hindi $\to$ Japanese $\to$ Russian $\to$ Arabic $\to$ English.
   - ~340ms per greeting (Intl.Segmenter grapheme reveal ~160ms, hold ~160ms, one-frame swap).
   - Arabic uses right-to-left mask reveal.
   - Final clip-path wipe exit.
   - Absolute 4.0s unmount failsafe.
6. **Waveform + Fade Page Transitions**:
   - Dedicated client-side navigation transition with 380ms waveform sweep and View Transitions fallback.
