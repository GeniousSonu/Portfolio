'use client';

import React, { useReducer, useEffect, useRef, useCallback } from 'react';
import navState from '@/lib/navState';
import {
  BOOT_STATES,
  BOOT_EVENTS,
  BOOT_TRANSITIONS,
  BOOT_TIMING,
  BOOT_STORAGE,
  TERMINAL_CONTENT,
  BOOT_GREETINGS,
} from '@/config/boot';
import { bootFontVariables } from '@/lib/bootFonts';

// Track already played in this document in-memory (NOT in sessionStorage/localStorage)
let hasBootedInThisDocument = false;

/**
 * Finite State Machine Reducer (TASK BOOT-002)
 */
function bootReducer(state, action) {
  const transitions = BOOT_TRANSITIONS[state];
  const nextState = transitions?.[action.type];

  if (!nextState) {
    if (process.env.NODE_ENV !== 'production') {
      console.warn(
        `[BootPreloader FSM] Ignored invalid transition from state "${state}" with event "${action.type}"`
      );
    }
    return state;
  }
  return nextState;
}

/**
 * Grapheme cluster splitter using Intl.Segmenter.
 * Preserves conjuncts and vowel marks in Indic scripts.
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

function getInitialBootState() {
  if (typeof window !== 'undefined') {
    const path = window.location.pathname;
    const isHome = path === '/' || path === '/index.html';
    const isReplay = window.location.search.includes('intro') || window.location.hash === '#intro';
    if (!isHome && !isReplay) return BOOT_STATES.DONE;
    if (window.__skipBootPreloader || document.documentElement.classList.contains('boot-skip') || hasBootedInThisDocument) {
      if (!isReplay) return BOOT_STATES.DONE;
    }
  }
  return BOOT_STATES.IDLE;
}

export default function BootPreloader() {
  const [state, dispatch] = useReducer(bootReducer, undefined, getInitialBootState);

  // Terminal state
  const [terminalLine1Text, setTerminalLine1Text] = React.useState('');
  const [terminalLine1Cursor, setTerminalLine1Cursor] = React.useState(true);
  const [terminalLine2Visible, setTerminalLine2Visible] = React.useState(false);
  const [terminalLine3Text, setTerminalLine3Text] = React.useState('');
  const [terminalLine3Cursor, setTerminalLine3Cursor] = React.useState(false);
  const [visibleStatusCount, setVisibleStatusCount] = React.useState(0);

  // Name stage state
  const [currentGreetingIndex, setCurrentGreetingIndex] = React.useState(0);
  const [revealedClusters, setRevealedClusters] = React.useState(0);
  const [rtlMaskPercent, setRtlMaskPercent] = React.useState(0);

  // Accessibility & interaction
  const [isReducedMotion, setIsReducedMotion] = React.useState(false);

  const containerRef = useRef(null);
  const timerRefs = useRef([]);
  const hasFinishedRef = useRef(false);

  const registerTimer = useCallback((fn, delayMs) => {
    const id = setTimeout(fn, delayMs);
    timerRefs.current.push(id);
    return id;
  }, []);

  const clearAllTimers = useCallback(() => {
    timerRefs.current.forEach((id) => clearTimeout(id));
    timerRefs.current = [];
  }, []);

  const releaseScrollLock = useCallback(() => {
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
  }, []);

  const finishBoot = useCallback(() => {
    if (hasFinishedRef.current) return;
    hasFinishedRef.current = true;
    hasBootedInThisDocument = true;
    try {
      localStorage.setItem(BOOT_STORAGE.key, String(Date.now()));
    } catch {}
    clearAllTimers();
    releaseScrollLock();

    // Focus restoration to main content
    if (typeof window !== 'undefined' && window.__bootTimers) {
      window.__bootTimers.finish = performance.now();
    }
    if (typeof document !== 'undefined') {
      const main = document.querySelector('main') || document.querySelector('h1');
      if (main && typeof main.focus === 'function') {
        main.setAttribute('tabindex', '-1');
        main.focus({ preventScroll: true });
      }
    }

    dispatch({ type: BOOT_EVENTS.EXIT_DONE });
  }, [clearAllTimers, releaseScrollLock]);

  const handleSkip = useCallback(() => {
    if (hasFinishedRef.current) return;
    clearAllTimers();
    dispatch({ type: BOOT_EVENTS.SKIP });

    // Allow exit wipe animation to run for 250ms, then finish
    registerTimer(finishBoot, 250);
  }, [clearAllTimers, finishBoot, registerTimer]);

  // Main lifecycle effect (SITEWIDE-UNIFY-001 Step 6)
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const path = window.location.pathname;
    const isHome = path === '/' || path === '/index.html';
    const isReplay = window.location.search.includes('intro') || window.location.hash === '#intro';

    // Rule 1: Show ONLY on full document load of Home route (or explicit ?intro replay)
    if (!isHome && !isReplay) {
      finishBoot();
      return;
    }

    // Rule 2: Early skip flag from inline script (or already booted in this doc)
    if ((window.__skipBootPreloader || document.documentElement.classList.contains('boot-skip') || hasBootedInThisDocument) && !isReplay) {
      finishBoot();
      return;
    }

    // Rule 3: Inspect navigation type: do NOT play on 'back_forward' or bfcache restore
    const navEntries = performance.getEntriesByType?.('navigation');
    const navEntry = navEntries && navEntries[0];
    const navType = navEntry ? navEntry.type : 'navigate';
    const isBackForward = navType === 'back_forward';

    if (isBackForward && !isReplay) {
      finishBoot();
      return;
    }

    // Rule 4: Timestamp check in safe storage (12 hours TTL)
    if (!isReplay) {
      try {
        const raw = localStorage.getItem(BOOT_STORAGE.key);
        if (raw) {
          const ts = parseInt(raw, 10);
          if (!isNaN(ts) && (Date.now() - ts) < BOOT_STORAGE.durationMs) {
            finishBoot();
            return;
          }
        }
      } catch {
        // Safe skip if storage is corrupted or unavailable
        finishBoot();
        return;
      }
    }

    hasBootedInThisDocument = true;

    // bfcache protection (pageshow with event.persisted === true)
    const handlePageShow = (e) => {
      if (e.persisted) {
        finishBoot();
      }
    };
    window.addEventListener('pageshow', handlePageShow);

    // 3. User skip listeners (tap anywhere or press any key)
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

    // 5. Absolute failsafe timeout (4.5s ceiling from BOOT-002 contract)
    registerTimer(() => {
      dispatch({ type: BOOT_EVENTS.FAILSAFE });
      finishBoot();
    }, BOOT_TIMING.absoluteCeilingMs);

    // 6. Check motion preferences
    const prefersReduced =
      window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ||
      localStorage.getItem('sks_reduce_motion') === 'true';

    if (prefersReduced) {
      setIsReducedMotion(true);
      dispatch({ type: BOOT_EVENTS.START });

      // Static presentation for ~900ms, then exit fade
      registerTimer(() => {
        dispatch({ type: BOOT_EVENTS.SKIP });
        registerTimer(finishBoot, BOOT_TIMING.reducedMotionFadeMs);
      }, BOOT_TIMING.reducedMotionStaticMs);

      return () => {
        clearAllTimers();
        window.removeEventListener('pageshow', handlePageShow);
        window.removeEventListener('keydown', handleKeyDown);
        window.removeEventListener('pointerdown', handlePointerDown);
        releaseScrollLock();
      };
    }

    // 7. Full Animation Orchestration
    // Terminal uses Geist Mono (system-ready), so it starts immediately on mount with zero delay.
    // Multilingual fonts are loaded concurrently during the 1.2-1.4s terminal stage.
    const fontReadyPromise = Promise.race([
      document.fonts ? document.fonts.ready : Promise.resolve(),
      new Promise((resolve) => setTimeout(resolve, BOOT_TIMING.fontReadyTimeoutMs)),
    ]).catch(() => {});

    // Start Terminal stage immediately
    if (typeof window !== 'undefined') {
      window.__bootTimers = { start: performance.now() };
    }
    dispatch({ type: BOOT_EVENTS.START });

    // ── Stage 1: Terminal Timeline (~1250ms total, within 1.2s - 1.4s) ──
    // Line 1: Type 'whoami' (240ms)
    const whoamiText = 'whoami';
    for (let i = 1; i <= whoamiText.length; i++) {
      registerTimer(() => {
        if (hasFinishedRef.current) return;
        setTerminalLine1Text(whoamiText.slice(0, i));
      }, 100 + i * (BOOT_TIMING.terminalLine1TypeMs / whoamiText.length));
    }

    // Hide line 1 cursor & drop line 2 (sahinur_islam)
    registerTimer(() => {
      if (hasFinishedRef.current) return;
      setTerminalLine1Cursor(false);
      setTerminalLine2Visible(true);
    }, 100 + BOOT_TIMING.terminalLine1TypeMs + 40);

    // Line 3: Show cursor & type './init_portfolio.sh' (340ms)
    const line3StartTime = 100 + BOOT_TIMING.terminalLine1TypeMs + BOOT_TIMING.terminalLine2DropMs + 40;
    registerTimer(() => {
      if (hasFinishedRef.current) return;
      setTerminalLine3Cursor(true);
    }, line3StartTime);

    const initText = './init_portfolio.sh';
    for (let i = 1; i <= initText.length; i++) {
      registerTimer(() => {
        if (hasFinishedRef.current) return;
        setTerminalLine3Text(initText.slice(0, i));
      }, line3StartTime + i * (BOOT_TIMING.terminalLine3TypeMs / initText.length));
    }

    // Hide line 3 cursor
    const statusStartTime = line3StartTime + BOOT_TIMING.terminalLine3TypeMs + 30;
    registerTimer(() => {
      if (hasFinishedRef.current) return;
      setTerminalLine3Cursor(false);
    }, statusStartTime);

    // Status lines 4, 5, 6 cascade in (3 x 60ms = 180ms)
    for (let s = 1; s <= 3; s++) {
      registerTimer(() => {
        if (hasFinishedRef.current) return;
        setVisibleStatusCount(s);
      }, statusStartTime + s * 60);
    }

    // Terminal completes at 1200ms -> Transition to Names stage (ensuring fonts are ready)
    const terminalDuration = BOOT_TIMING.terminalTotalMs; // Strictly within 1.2s - 1.4s
    registerTimer(async () => {
      if (hasFinishedRef.current) return;
      await fontReadyPromise;
      if (hasFinishedRef.current) return;
      if (typeof window !== 'undefined' && window.__bootTimers) {
        window.__bootTimers.terminalDone = performance.now();
      }
      dispatch({ type: BOOT_EVENTS.TERMINAL_DONE });
    }, terminalDuration);

    // ── Stage 2: Multilingual Names Timeline (1800ms total, 6 x 300ms) ──
    const namesStartTime = terminalDuration;

    BOOT_GREETINGS.forEach((greeting, index) => {
      const greetingOffset = namesStartTime + index * BOOT_TIMING.greetingDurationMs;

      registerTimer(() => {
        if (hasFinishedRef.current) return;
        setCurrentGreetingIndex(index);
        setRevealedClusters(0);
        setRtlMaskPercent(0);

        if (greeting.useRtlMask) {
          // Arabic: smoothly reveal right-to-left mask over 140ms
          const maskStart = performance.now();
          const animateMask = (now) => {
            if (hasFinishedRef.current) return;
            const elapsed = now - maskStart;
            const progress = Math.min(elapsed / BOOT_TIMING.greetingTypeMs, 1);
            setRtlMaskPercent(progress * 100);
            if (progress < 1) {
              requestAnimationFrame(animateMask);
            }
          };
          requestAnimationFrame(animateMask);
        } else {
          // Grapheme reveal: cluster-by-cluster over 140ms
          const clusters = getGraphemes(greeting.text, greeting.lang);
          const totalClusters = clusters.length;
          const clusterInterval = Math.max(BOOT_TIMING.greetingTypeMs / totalClusters, 20);

          for (let c = 1; c <= totalClusters; c++) {
            registerTimer(() => {
              if (hasFinishedRef.current) return;
              setRevealedClusters(c);
            }, c * clusterInterval);
          }
        }
      }, greetingOffset);
    });

    // ── Stage 3: Exit Wipe (at 1250 + 1800 = 3050ms) ──
    const exitStartTime = namesStartTime + BOOT_TIMING.nameStageDurationMs;

    registerTimer(() => {
      if (hasFinishedRef.current) return;
      if (typeof window !== 'undefined' && window.__bootTimers) {
        window.__bootTimers.namesDone = performance.now();
      }
      dispatch({ type: BOOT_EVENTS.NAMES_DONE });

      // Complete wipe out at 3450ms (<= 3.6s total budget!)
      registerTimer(() => {
        finishBoot();
      }, BOOT_TIMING.exitDurationMs);
    }, exitStartTime);

    return () => {
      clearAllTimers();
      window.removeEventListener('pageshow', handlePageShow);
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('pointerdown', handlePointerDown);
      releaseScrollLock();
    };
  }, [finishBoot, handleSkip, registerTimer, clearAllTimers, releaseScrollLock]);

  // Unmounted when state reaches DONE
  if (state === BOOT_STATES.DONE) {
    return null;
  }

  const isExiting = state === BOOT_STATES.EXIT;
  const isTerminalActive = state === BOOT_STATES.TERMINAL || state === BOOT_STATES.IDLE;
  const isNamesActive = state === BOOT_STATES.NAMES || state === BOOT_STATES.EXIT;

  const activeGreeting = BOOT_GREETINGS[currentGreetingIndex] || BOOT_GREETINGS[0];
  const clusters = getGraphemes(activeGreeting.text, activeGreeting.lang);
  const visibleNameText = clusters.slice(0, revealedClusters).join('');

  return (
    <aside
      id="boot-preloader"
      ref={containerRef}
      data-stage={state.toLowerCase()}
      className={`boot-preloader-root ${bootFontVariables} ${isExiting ? 'boot-exit-wipe' : ''}`}
      role="status"
      aria-label="Loading SK Sahinur Islam's portfolio"
    >
      {/* Visually hidden live text for screen readers */}
      <span className="sr-only">Sahinur</span>

      {/* Decorative boot scene */}
      <div className="boot-scene" aria-hidden="true">
        {/* Ambient radial glow using design tokens */}
        <div className="boot-ambient-glow" />

        {/* Common Stage Frame: Pre-measured reserved bounds to guarantee ZERO layout shift */}
        <div className="boot-stage-frame">
          {isReducedMotion ? (
            /* Reduced Motion: Static summary of terminal and all 6 names */
            <div className="boot-reduced-motion-view">
              <div className="boot-terminal" style={{ width: '100%' }}>
                <div className="boot-terminal-header">
                  <div className="boot-dots">
                    <span className="dot-r" />
                    <span className="dot-y" />
                    <span className="dot-g" />
                  </div>
                  <span className="boot-title">{TERMINAL_CONTENT.title}</span>
                </div>
                <div className="boot-terminal-body">
                  <div className="boot-line">
                    <span className="boot-prompt">$</span>
                    <span className="boot-cmd">whoami</span>
                  </div>
                  <div className="boot-line boot-out-highlight">
                    <span className="boot-output">sahinur_islam</span>
                  </div>
                  <div className="boot-line">
                    <span className="boot-prompt">$</span>
                    <span className="boot-cmd">./init_portfolio.sh</span>
                  </div>
                  <div className="boot-line boot-status">
                    <span className="boot-dim">Compiling experience.js...</span>
                    <span className="boot-ok">[OK]</span>
                  </div>
                </div>
              </div>

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
            </div>
          ) : isTerminalActive ? (
            /* STAGE 1: Original Restored Terminal Sequence */
            <div className="boot-terminal" data-stage="terminal">
              <div className="boot-terminal-header">
                <div className="boot-dots">
                  <span className="dot-r" />
                  <span className="dot-y" />
                  <span className="dot-g" />
                </div>
                <span className="boot-title">{TERMINAL_CONTENT.title}</span>
              </div>

              <div className="boot-terminal-body">
                {/* Line 1: $ whoami */}
                <div className="boot-line">
                  <span className="boot-prompt">$</span>
                  <span className="boot-cmd">{terminalLine1Text}</span>
                  {terminalLine1Cursor && <span className="boot-typing-cursor">▋</span>}
                </div>

                {/* Line 2: sahinur_islam */}
                {terminalLine2Visible && (
                  <div className="boot-line boot-out-highlight">
                    <span className="boot-output">sahinur_islam</span>
                  </div>
                )}

                {/* Line 3: $ ./init_portfolio.sh */}
                {terminalLine2Visible && (
                  <div className="boot-line">
                    <span className="boot-prompt">$</span>
                    <span className="boot-cmd">{terminalLine3Text}</span>
                    {terminalLine3Cursor && <span className="boot-typing-cursor">▋</span>}
                  </div>
                )}

                {/* Line 4: Loading modules... [OK] */}
                {visibleStatusCount >= 1 && (
                  <div className="boot-line boot-status">
                    <span className="boot-dim">Loading modules...</span>
                    <span className="boot-ok">[OK]</span>
                  </div>
                )}

                {/* Line 5: Establishing connection... [OK] */}
                {visibleStatusCount >= 2 && (
                  <div className="boot-line boot-status">
                    <span className="boot-dim">Establishing connection...</span>
                    <span className="boot-ok">[OK]</span>
                  </div>
                )}

                {/* Line 6: Compiling experience.js... [OK] */}
                {visibleStatusCount >= 3 && (
                  <div className="boot-line boot-status">
                    <span className="boot-dim">Compiling experience.js...</span>
                    <span className="boot-ok">[OK]</span>
                  </div>
                )}
              </div>
            </div>
          ) : isNamesActive ? (
            /* STAGE 2: Multilingual Names Stage */
            <div className="boot-box-container" data-stage="names">
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
                    {visibleNameText}
                    {/* Blinking gold accent cursor on final English greeting */}
                    {activeGreeting.id === 'en' && (
                      <span className="boot-accent-cursor">_</span>
                    )}
                  </span>
                )}
              </div>
            </div>
          ) : null}
        </div>

        {/* Skip Prompt */}
        <div className="boot-skip-hint">
          <span>{TERMINAL_CONTENT.skipHint}</span>
        </div>
      </div>
    </aside>
  );
}
