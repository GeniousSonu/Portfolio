'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import navState from '@/lib/navState';
import { BOOT_GREETINGS, BOOT_TIMING } from '@/config/bootGreetings';
import { bootFontVariables } from '@/lib/bootFonts';

// Track already played in this document in memory (NOT in localStorage or sessionStorage)
// This guarantees it plays on every full reload or initial document load, but NEVER on client route transitions.
let hasBootedInThisDocument = false;

/**
 * Extract grapheme clusters safely using Intl.Segmenter.
 * Preserves conjuncts and vowel marks in Bengali and Devanagari.
 */
function getGraphemes(text, lang) {
  if (typeof Intl !== 'undefined' && Intl.Segmenter) {
    try {
      const segmenter = new Intl.Segmenter(lang, { granularity: 'grapheme' });
      return Array.from(segmenter.segment(text), (s) => s.segment);
    } catch {
      // Fallback
    }
  }
  return Array.from(text);
}

export default function BootPreloader() {
  // Server-render overlay to ensure zero flash of page content underneath
  const [active, setActive] = useState(true);
  const [currentGreetingIndex, setCurrentGreetingIndex] = useState(0);
  const [revealedClusters, setRevealedClusters] = useState(0);
  const [rtlMaskPercent, setRtlMaskPercent] = useState(0);
  const [isExiting, setIsExiting] = useState(false);
  const [isReducedMotion, setIsReducedMotion] = useState(false);

  const containerRef = useRef(null);
  const timerRefs = useRef([]);
  const hasFinishedRef = useRef(false);

  const clearAllTimers = useCallback(() => {
    timerRefs.current.forEach((id) => clearTimeout(id));
    timerRefs.current = [];
  }, []);

  const finish = useCallback(() => {
    if (hasFinishedRef.current) return;
    hasFinishedRef.current = true;
    hasBootedInThisDocument = true;
    clearAllTimers();

    // Release scroll lock unconditionally
    if (typeof document !== 'undefined') {
      document.documentElement.classList.remove('preloader-locked');
      document.body.classList.remove('preloader-locked');
      document.documentElement.classList.add('boot-complete');
    }

    if (typeof window !== 'undefined') {
      window.__preloaderActive = false;
      if (navState.lenis) {
        try {
          navState.lenis.start();
          navState.lenis.resize();
        } catch {}
      }
    }

    // Completely remove component from DOM
    setActive(false);
  }, [clearAllTimers]);

  const handleSkip = useCallback(() => {
    if (hasFinishedRef.current) return;
    setIsExiting(true);
    const exitTimer = setTimeout(finish, 200);
    timerRefs.current.push(exitTimer);
  }, [finish]);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    // 1. Inspect navigation type: play for 'navigate', 'reload', 'prerender'
    // Do NOT play for 'back_forward' or bfcache restore
    const navEntries = performance.getEntriesByType?.('navigation');
    const navEntry = navEntries && navEntries[0];
    const navType = navEntry ? navEntry.type : 'navigate';
    const isBackForward = navType === 'back_forward';

    if (isBackForward || hasBootedInThisDocument) {
      finish();
      return;
    }

    // Mark as booted for this document
    hasBootedInThisDocument = true;

    // 2. bfcache protection (pageshow with event.persisted === true)
    const handlePageShow = (e) => {
      if (e.persisted) {
        finish();
      }
    };
    window.addEventListener('pageshow', handlePageShow);

    // 3. User skip listeners (click, tap, or any key)
    const handleKeyDown = () => handleSkip();
    const handlePointerDown = () => handleSkip();

    window.addEventListener('keydown', handleKeyDown, { passive: true });
    window.addEventListener('pointerdown', handlePointerDown, { passive: true });

    // 4. Lock scroll immediately
    window.__preloaderActive = true;
    document.documentElement.classList.add('preloader-locked');
    document.body.classList.add('preloader-locked');
    if (navState.lenis) {
      try {
        navState.lenis.stop();
      } catch {}
    }

    // 5. Absolute failsafe timeout (4.0s hard ceiling from INC-001)
    const failsafeTimer = setTimeout(() => {
      finish();
    }, BOOT_TIMING.absoluteCeilingMs);
    timerRefs.current.push(failsafeTimer);

    // 6. Check motion preferences
    const prefersReduced =
      window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ||
      localStorage.getItem('sks_reduce_motion') === 'true';

    if (prefersReduced) {
      setIsReducedMotion(true);
      // Reduced motion: show six names statically for 900 ms, then fade out
      const staticTimer = setTimeout(() => {
        setIsExiting(true);
        const exitTimer = setTimeout(finish, 200);
        timerRefs.current.push(exitTimer);
      }, BOOT_TIMING.reducedMotionDurationMs);
      timerRefs.current.push(staticTimer);

      return () => {
        clearAllTimers();
        window.removeEventListener('pageshow', handlePageShow);
        window.removeEventListener('keydown', handleKeyDown);
        window.removeEventListener('pointerdown', handlePointerDown);
      };
    }

    // 7. Full Animation Orchestration
    // Wait for document.fonts.ready (with 600ms cap) before starting sequence
    const startSequence = async () => {
      try {
        await Promise.race([
          document.fonts ? document.fonts.ready : Promise.resolve(),
          new Promise((resolve) => setTimeout(resolve, BOOT_TIMING.fontReadyTimeoutMs)),
        ]);
      } catch {
        // Proceed even on font error
      }

      if (hasFinishedRef.current) return;

      let currentTimeOffset = 0;

      BOOT_GREETINGS.forEach((greeting, index) => {
        const greetingStartTimer = setTimeout(() => {
          if (hasFinishedRef.current) return;
          setCurrentGreetingIndex(index);
          setRevealedClusters(0);
          setRtlMaskPercent(0);

          if (greeting.useRtlMask) {
            // Arabic: smoothly reveal right-to-left mask over 160ms preserving cursive ligatures
            const startTime = performance.now();
            const animateMask = (now) => {
              if (hasFinishedRef.current) return;
              const elapsed = now - startTime;
              const progress = Math.min(elapsed / BOOT_TIMING.typeDurationMs, 1);
              setRtlMaskPercent(progress * 100);

              if (progress < 1) {
                requestAnimationFrame(animateMask);
              }
            };
            requestAnimationFrame(animateMask);
          } else {
            // Grapheme reveal: reveal cluster-by-cluster over 160ms using Intl.Segmenter
            const clusters = getGraphemes(greeting.text, greeting.lang);
            const totalClusters = clusters.length;
            const clusterInterval = Math.max(BOOT_TIMING.typeDurationMs / totalClusters, 20);

            for (let c = 1; c <= totalClusters; c++) {
              const clusterTimer = setTimeout(() => {
                if (hasFinishedRef.current) return;
                setRevealedClusters(c);
              }, c * clusterInterval);
              timerRefs.current.push(clusterTimer);
            }
          }
        }, currentTimeOffset);

        timerRefs.current.push(greetingStartTimer);
        currentTimeOffset += BOOT_TIMING.greetingDurationMs;
      });

      // Exit wipe transition after all 6 greetings complete (~2040ms)
      const exitStartTimer = setTimeout(() => {
        if (hasFinishedRef.current) return;
        setIsExiting(true);

        const exitCompleteTimer = setTimeout(() => {
          finish();
        }, BOOT_TIMING.exitDurationMs);
        timerRefs.current.push(exitCompleteTimer);
      }, currentTimeOffset);

      timerRefs.current.push(exitStartTimer);
    };

    startSequence();

    return () => {
      clearAllTimers();
      window.removeEventListener('pageshow', handlePageShow);
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('pointerdown', handlePointerDown);
      // Clean up locks if unmounted unexpectedly
      if (typeof document !== 'undefined') {
        document.documentElement.classList.remove('preloader-locked');
        document.body.classList.remove('preloader-locked');
      }
    };
  }, [finish, handleSkip, clearAllTimers]);

  if (!active) return null;

  const activeGreeting = BOOT_GREETINGS[currentGreetingIndex] || BOOT_GREETINGS[0];
  const clusters = getGraphemes(activeGreeting.text, activeGreeting.lang);
  const visibleText = clusters.slice(0, revealedClusters).join('');

  return (
    <aside
      id="boot-preloader"
      ref={containerRef}
      className={`boot-preloader-root ${bootFontVariables} ${isExiting ? 'boot-exit-wipe' : ''}`}
      role="status"
      aria-label="Loading SK Sahinur Islam's portfolio"
    >
      {/* Visually hidden live text for assistive technologies */}
      <span className="sr-only">Sahinur</span>

      {/* Decorative multilingual sequence */}
      <div className="boot-scene" aria-hidden="true">
        {/* Subtle radial ambient glow using CSS tokens */}
        <div className="boot-ambient-glow" />

        {/* Pre-measured reserved box to guarantee zero layout shift */}
        <div className="boot-box-container">
          {isReducedMotion ? (
            /* Reduced motion: clean static presentation of all six scripts */
            <div className="boot-static-grid">
              {BOOT_GREETINGS.map((g) => (
                <span
                  key={g.id}
                  lang={g.lang}
                  dir={g.dir}
                  className="boot-static-item"
                  style={{ fontFamily: g.fontFamily }}
                >
                  {g.text}
                </span>
              ))}
            </div>
          ) : (
            /* Full motion: Grapheme typing / Arabic RTL mask reveal */
            <div className="boot-greeting-stage">
              {activeGreeting.useRtlMask ? (
                <span
                  key={activeGreeting.id}
                  lang={activeGreeting.lang}
                  dir={activeGreeting.dir}
                  className="boot-name-text boot-arabic-mask"
                  style={{
                    fontFamily: activeGreeting.fontFamily,
                    clipPath: `inset(0 0 0 calc(100% - ${rtlMaskPercent}%))`,
                    WebkitClipPath: `inset(0 0 0 calc(100% - ${rtlMaskPercent}%))`,
                  }}
                >
                  {activeGreeting.text}
                </span>
              ) : (
                <span
                  key={activeGreeting.id}
                  lang={activeGreeting.lang}
                  dir={activeGreeting.dir}
                  className="boot-name-text"
                  style={{ fontFamily: activeGreeting.fontFamily }}
                >
                  {visibleText}
                  {/* Blinking gold cursor on final English greeting */}
                  {activeGreeting.id === 'en' && (
                    <span className="boot-accent-cursor">_</span>
                  )}
                </span>
              )}
            </div>
          )}
        </div>

        {/* Accessible skip prompt */}
        <div className="boot-skip-hint">
          <span>Click or press any key to skip</span>
        </div>
      </div>
    </aside>
  );
}
