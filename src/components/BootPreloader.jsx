'use client';

import React, { useState, useEffect, useRef } from 'react';
import gsap from 'gsap';

// Module-level session flag: once booted in this browsing session, never replay on soft navigations
let hasBootedInSession = false;

const HELLO_SCRIPTS = [
  { text: 'সাহিনুর', lang: 'bn', dir: 'ltr', showCursor: false },
  { text: 'साहिनुर', lang: 'hi', dir: 'ltr', showCursor: false },
  { text: 'サヒヌル', lang: 'ja', dir: 'ltr', showCursor: false },
  { text: 'сахинур', lang: 'ru', dir: 'ltr', showCursor: false },
  { text: 'ساهينور', lang: 'ar', dir: 'rtl', showCursor: false },
  { text: 'Sahinur',  lang: 'en', dir: 'ltr', showCursor: true  },
];

export default function BootPreloader() {
  const [active, setActive] = useState(() => !hasBootedInSession);

  const preloaderRef = useRef(null);
  const terminalRef = useRef(null);
  const helloWrapRef = useRef(null);
  const scriptRefs = useRef([]);
  const isPageReadyRef = useRef(false);
  const ceilingHitRef = useRef(false);

  // Terminal line elements
  const line1Ref = useRef(null);
  const line2Ref = useRef(null);
  const line3Ref = useRef(null);
  const line4Ref = useRef(null);
  const line5Ref = useRef(null);
  const line6Ref = useRef(null);

  useEffect(() => {
    if (!active || hasBootedInSession) {
      return;
    }

    // 1. bfcache check (mobile Safari / Chrome back-forward cache restore)
    const handlePageShow = (e) => {
      if (e.persisted) {
        hasBootedInSession = true;
        window.__preloaderActive = false;
        document.documentElement.classList.remove('preloader-locked');
        document.body.classList.remove('preloader-locked');
        setActive(false);
      }
    };
    window.addEventListener('pageshow', handlePageShow);

    // 2. Lock scroll and mark preloader active
    window.__preloaderActive = true;
    document.documentElement.classList.add('preloader-locked');
    document.body.classList.add('preloader-locked');
    if (window.__lenis) {
      try {
        window.__lenis.stop();
      } catch {}
    }

    // 3. Anchor preservation: suppress native jump on URLs with hash (e.g. /#projects)
    const targetHash = window.location.hash;
    if (targetHash) {
      if ('scrollRestoration' in window.history) {
        window.history.scrollRestoration = 'manual';
      }
      window.scrollTo(0, 0);
    }

    // 4. Page readiness tracking
    const markPageReady = () => {
      isPageReadyRef.current = true;
    };

    if (document.readyState === 'complete' || document.readyState === 'interactive') {
      isPageReadyRef.current = true;
    } else {
      window.addEventListener('load', markPageReady, { once: true });
      document.addEventListener('DOMContentLoaded', markPageReady, { once: true });
    }

    const ceilingTimer = setTimeout(() => {
      ceilingHitRef.current = true;
    }, 4500);

    // Helper: Final wipe-out and restore scroll / anchors
    const finishPreloader = (hash) => {
      hasBootedInSession = true;
      window.__preloaderActive = false;
      document.documentElement.classList.remove('preloader-locked');
      document.body.classList.remove('preloader-locked');

      if ('scrollRestoration' in window.history) {
        window.history.scrollRestoration = 'auto';
      }

      if (window.__lenis) {
        try {
          window.__lenis.start();
          window.__lenis.resize();
        } catch {}
      }

      if (hash) {
        setTimeout(() => {
          if (window.__lenis) {
            window.__lenis.scrollTo(hash, { offset: -75, duration: 1.0 });
          } else {
            const el = document.querySelector(hash);
            if (el) {
              const top = el.getBoundingClientRect().top + window.scrollY - 75;
              window.scrollTo({ top, behavior: 'smooth' });
            }
          }
        }, 50);
      }

      setActive(false);
    };

    // 5. Accessibility: prefers-reduced-motion immediate bypass
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) {
      clearTimeout(ceilingTimer);
      if (preloaderRef.current) {
        gsap.to(preloaderRef.current, {
          opacity: 0,
          duration: 0.15,
          ease: 'power1.out',
          onComplete: () => {
            finishPreloader(targetHash);
          },
        });
      } else {
        finishPreloader(targetHash);
      }
      return () => {
        window.removeEventListener('pageshow', handlePageShow);
      };
    }

    // 6. GSAP Timeline inside gsap.context for React 18 Strict Mode safety
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        defaults: { ease: 'power2.out' },
      });

      // Initial state: hide lines and hello container
      gsap.set([line1Ref.current, line2Ref.current, line3Ref.current, line4Ref.current, line5Ref.current, line6Ref.current], {
        autoAlpha: 0,
        y: 4,
      });
      gsap.set(helloWrapRef.current, {
        autoAlpha: 0,
        scale: 0.94,
        display: 'none',
      });

      // ─── ACT 1: Terminal Window 3D Perspective Fly-In & Settle (~0.45s) ───
      tl.fromTo(
        terminalRef.current,
        {
          autoAlpha: 0,
          scale: 0.82,
          rotateX: 18,
          y: 35,
          transformPerspective: 900,
        },
        {
          autoAlpha: 1,
          scale: 1,
          rotateX: 0,
          y: 0,
          duration: 0.45,
          ease: 'power3.out',
        }
      );

      // ─── ACT 2: Fast, Punchy Boot Sequence Typing (~1.1s) ───
      // Line 1: $ whoami
      tl.to(line1Ref.current, { autoAlpha: 1, y: 0, duration: 0.1 }, '+=0.04');

      // Line 2: sahinur_islam
      tl.to(line2Ref.current, { autoAlpha: 1, y: 0, duration: 0.08 }, '+=0.1');

      // Line 3: $ ./init_portfolio.sh
      tl.to(line3Ref.current, { autoAlpha: 1, y: 0, duration: 0.1 }, '+=0.1');

      // Line 4: Loading modules... [OK]
      tl.to(line4Ref.current, { autoAlpha: 1, y: 0, duration: 0.08 }, '+=0.14');

      // Line 5: Establishing connection... [OK]
      tl.to(line5Ref.current, { autoAlpha: 1, y: 0, duration: 0.08 }, '+=0.08');

      // Line 6: Compiling experience.js... [OK]
      tl.to(line6Ref.current, { autoAlpha: 1, y: 0, duration: 0.08 }, '+=0.08');

      // Brief pause on compiled terminal state before dissolve
      tl.to({}, { duration: 0.15 });

      // ─── ACT 3: Terminal Dissolve & Multilingual Global Hello (~1.35s) ───
      // Terminal dissolves / compiles out
      tl.to(terminalRef.current, {
        scale: 0.92,
        autoAlpha: 0,
        filter: 'blur(8px)',
        duration: 0.22,
        ease: 'power2.in',
      });

      // Global Hello scales up
      tl.set(terminalRef.current, { display: 'none' })
        .set(helloWrapRef.current, { display: 'flex' })
        .to(helloWrapRef.current, {
          autoAlpha: 1,
          scale: 1,
          duration: 0.18,
          ease: 'power3.out',
        });

      // Script cycling: 5 foreign scripts × 150ms = 750ms
      // 0: Bengali (সাহিনুর) is already visible initially
      // 1: Hindi (साहिनुर)
      tl.add(() => {
        scriptRefs.current.forEach((el, i) => {
          if (el) el.style.display = i === 1 ? 'inline-block' : 'none';
        });
      }, '+=0.15');

      // 2: Japanese (サヒヌル)
      tl.add(() => {
        scriptRefs.current.forEach((el, i) => {
          if (el) el.style.display = i === 2 ? 'inline-block' : 'none';
        });
      }, '+=0.15');

      // 3: Russian (сахинур)
      tl.add(() => {
        scriptRefs.current.forEach((el, i) => {
          if (el) el.style.display = i === 3 ? 'inline-block' : 'none';
        });
      }, '+=0.15');

      // 4: Arabic (ساهينور - dir="rtl", cursor hidden)
      tl.add(() => {
        scriptRefs.current.forEach((el, i) => {
          if (el) el.style.display = i === 4 ? 'inline-block' : 'none';
        });
      }, '+=0.15');

      // 5: Latin resting state (Sahinur _) with blinking cursor
      tl.add(() => {
        scriptRefs.current.forEach((el, i) => {
          if (el) el.style.display = i === 5 ? 'inline-block' : 'none';
        });
      }, '+=0.15');

      // Hold on final resting state for ~300ms
      tl.to({}, { duration: 0.3 });

      // ─── GATING LOGIC: Wait for page ready OR ceiling, then wipe-out ───
      tl.add(() => {
        const executeWipeOut = () => {
          if (!preloaderRef.current) {
            finishPreloader(targetHash);
            return;
          }

          gsap.to(preloaderRef.current, {
            autoAlpha: 0,
            scale: 1.04,
            duration: 0.35,
            ease: 'power2.inOut',
            onComplete: () => {
              finishPreloader(targetHash);
            },
          });
        };

        if (isPageReadyRef.current || ceilingHitRef.current) {
          executeWipeOut();
        } else {
          // Keep resting state blinking until page load finishes or ceiling fires
          const checkInterval = setInterval(() => {
            if (isPageReadyRef.current || ceilingHitRef.current) {
              clearInterval(checkInterval);
              executeWipeOut();
            }
          }, 60);
        }
      });
    }, preloaderRef);

    return () => {
      clearTimeout(ceilingTimer);
      window.removeEventListener('pageshow', handlePageShow);
      ctx.revert();
    };
  }, [active]);

  if (!active) {
    return null;
  }

  return (
    <aside
      id="boot-preloader"
      ref={preloaderRef}
      role="status"
      aria-label="Loading SK Sahinur Islam's portfolio"
    >
      {/* Screen Reader Announcement */}
      <div className="sr-only" aria-live="polite">
        Loading SK Sahinur Islam&apos;s Portfolio...
      </div>

      {/* Visual Animation Container */}
      <div className="boot-scene" aria-hidden="true">
        {/* Subtle Ambient Radial Glow */}
        <div className="boot-ambient-glow" />

        {/* 1. Terminal Window */}
        <div className="boot-terminal" ref={terminalRef}>
          <div className="boot-terminal-header">
            <div className="boot-dots">
              <span className="dot-r" />
              <span className="dot-y" />
              <span className="dot-g" />
            </div>
            <span className="boot-title">sahinur@dev:~ (boot)</span>
          </div>

          <div className="boot-terminal-body">
            {/* Line 1: $ whoami */}
            <div className="boot-line" ref={line1Ref}>
              <span className="boot-prompt">$</span>
              <span className="boot-cmd">whoami</span>
            </div>

            {/* Line 2: sahinur_islam */}
            <div className="boot-line boot-out-highlight" ref={line2Ref}>
              <span className="boot-output">sahinur_islam</span>
            </div>

            {/* Line 3: $ ./init_portfolio.sh */}
            <div className="boot-line" ref={line3Ref}>
              <span className="boot-prompt">$</span>
              <span className="boot-cmd">./init_portfolio.sh</span>
            </div>

            {/* Line 4: Loading modules... [OK] */}
            <div className="boot-line boot-status" ref={line4Ref}>
              <span className="boot-dim">Loading modules...</span>
              <span className="boot-ok">[OK]</span>
            </div>

            {/* Line 5: Establishing connection... [OK] */}
            <div className="boot-line boot-status" ref={line5Ref}>
              <span className="boot-dim">Establishing connection...</span>
              <span className="boot-ok">[OK]</span>
            </div>

            {/* Line 6: Compiling experience.js... [OK] */}
            <div className="boot-line boot-status" ref={line6Ref}>
              <span className="boot-dim">Compiling experience.js...</span>
              <span className="boot-ok">[OK]</span>
            </div>
          </div>
        </div>

        {/* 2. Global Hello Display */}
        <div className="boot-hello-wrap" ref={helloWrapRef}>
          <div className="boot-hello-content">
            {HELLO_SCRIPTS.map((script, idx) => (
              <span
                key={script.lang}
                ref={(el) => (scriptRefs.current[idx] = el)}
                className={`boot-hello-word ${idx === 0 ? 'active' : ''}`}
                dir={script.dir}
                lang={script.lang}
                style={{ display: idx === 0 ? 'inline-block' : 'none' }}
              >
                {script.text}
                {script.showCursor && (
                  <span className="boot-cursor" aria-hidden="true">
                    _
                  </span>
                )}
              </span>
            ))}
          </div>
        </div>
      </div>
    </aside>
  );
}
