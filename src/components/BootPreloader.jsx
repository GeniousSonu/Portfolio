'use client';

import React, { useState, useEffect, useRef } from 'react';
import gsap from 'gsap';
import navState from '@/lib/navState';

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

  // Line containers
  const line1Ref = useRef(null);
  const line2Ref = useRef(null);
  const line3Ref = useRef(null);
  const line4Ref = useRef(null);
  const line5Ref = useRef(null);
  const line6Ref = useRef(null);

  // Text target spans for real typewriter effect
  const cmd1TextRef = useRef(null);
  const cmd1CursorRef = useRef(null);
  const cmd2TextRef = useRef(null);
  const cmd2CursorRef = useRef(null);

  useEffect(() => {
    if (!active || hasBootedInSession) {
      return;
    }

    // 1. bfcache protection (mobile Safari / Chrome back-forward cache restore)
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
    if (navState.lenis) {
      try {
        navState.lenis.stop();
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

    // 4. Page readiness tracking & 6s safety ceiling
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
    }, 6000);

    // Helper: Final wipe-out and restore scroll / anchors
    const finishPreloader = (hash) => {
      hasBootedInSession = true;
      window.__preloaderActive = false;
      document.documentElement.classList.remove('preloader-locked');
      document.body.classList.remove('preloader-locked');

      if ('scrollRestoration' in window.history) {
        window.history.scrollRestoration = 'auto';
      }

      if (navState.lenis) {
        try {
          navState.lenis.start();
          navState.lenis.resize();
        } catch {}
      }

      if (hash) {
        setTimeout(() => {
          if (navState.lenis) {
            navState.lenis.scrollTo(hash, { offset: -75, duration: 1.0 });
          } else {
            const el = document.querySelector(hash);
            if (el) {
              const top = el.getBoundingClientRect().top + window.scrollY - 75;
              window.scrollTo({ top, behavior: 'smooth' });
            }
          }
        }, 60);
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

    // 6. Master GSAP Timeline inside gsap.context for React 18 Strict Mode safety
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        defaults: { ease: 'power2.out' },
      });

      // ─── INITIAL STATE SETUP (Guaranteed Zero Flash) ───
      gsap.set(terminalRef.current, {
        autoAlpha: 0,
        scale: 0.84,
        rotateX: 16,
        y: 35,
        transformPerspective: 900,
      });

      gsap.set(
        [line1Ref.current, line2Ref.current, line3Ref.current, line4Ref.current, line5Ref.current, line6Ref.current],
        {
          autoAlpha: 0,
          y: 6,
        }
      );

      gsap.set(helloWrapRef.current, {
        display: 'none',
        autoAlpha: 0,
        scale: 0.92,
      });

      // Hide all scripts initially
      scriptRefs.current.forEach((el) => {
        if (el) {
          el.style.display = 'none';
          el.style.opacity = '0';
        }
      });

      // Clear typed text initially
      if (cmd1TextRef.current) cmd1TextRef.current.textContent = '';
      if (cmd2TextRef.current) cmd2TextRef.current.textContent = '';

      // ─── ACT 1: Cinematic Terminal 3D Perspective Fly-In & Settle (~0.6s) ───
      tl.to(terminalRef.current, {
        autoAlpha: 1,
        scale: 1,
        rotateX: 0,
        y: 0,
        duration: 0.6,
        ease: 'power3.out',
      });

      // ─── ACT 2: Real Letter-by-Letter Typewriter Boot Sequence (~1.8s) ───
      // Line 1: Show prompt and cursor
      tl.to(line1Ref.current, { autoAlpha: 1, y: 0, duration: 0.15 }, '+=0.1');

      // Type 'whoami' letter-by-letter on timeline
      const cmd1Tracker = { count: 0 };
      const cmd1Text = 'whoami';
      tl.to(cmd1Tracker, {
        count: cmd1Text.length,
        duration: 0.38,
        ease: 'none',
        onUpdate: () => {
          if (cmd1TextRef.current) {
            cmd1TextRef.current.textContent = cmd1Text.slice(0, Math.round(cmd1Tracker.count));
          }
        },
      });

      // Hide line 1 cursor
      tl.set(cmd1CursorRef.current, { display: 'none' }, '+=0.06');

      // Line 2: Output drops in smoothly (sahinur_islam)
      tl.to(line2Ref.current, { autoAlpha: 1, y: 0, duration: 0.22, ease: 'back.out(1.5)' }, '+=0.08');

      // Line 3: Show prompt and cursor for script execution
      tl.to(line3Ref.current, { autoAlpha: 1, y: 0, duration: 0.15 }, '+=0.18');

      // Type './init_portfolio.sh' letter-by-letter on timeline
      const cmd2Tracker = { count: 0 };
      const cmd2Text = './init_portfolio.sh';
      tl.to(cmd2Tracker, {
        count: cmd2Text.length,
        duration: 0.52,
        ease: 'none',
        onUpdate: () => {
          if (cmd2TextRef.current) {
            cmd2TextRef.current.textContent = cmd2Text.slice(0, Math.round(cmd2Tracker.count));
          }
        },
      });

      // Hide line 3 cursor
      tl.set(cmd2CursorRef.current, { display: 'none' }, '+=0.06');

      // Status lines 4, 5, 6 glide in smoothly
      tl.to(line4Ref.current, { autoAlpha: 1, y: 0, duration: 0.2 }, '+=0.1');
      tl.to(line5Ref.current, { autoAlpha: 1, y: 0, duration: 0.18 }, '+=0.12');
      tl.to(line6Ref.current, { autoAlpha: 1, y: 0, duration: 0.18 }, '+=0.12');

      // Pause on compiled terminal state so user can read it
      tl.to({}, { duration: 0.4 });

      // ─── ACT 3: Silky Dissolve & Multilingual Global Hello (~1.8s) ───
      // Terminal compiles / dissolves with soft blur
      tl.to(terminalRef.current, {
        scale: 0.94,
        y: -10,
        autoAlpha: 0,
        filter: 'blur(12px)',
        duration: 0.42,
        ease: 'power2.inOut',
      });

      // Helper to smoothly swap visible script frame with cross-fade
      const showScriptFrame = (index) => {
        scriptRefs.current.forEach((el, i) => {
          if (!el) return;
          if (i === index) {
            el.style.display = 'inline-block';
            gsap.fromTo(el, { opacity: 0, scale: 0.95 }, { opacity: 1, scale: 1, duration: 0.18, ease: 'power2.out', overwrite: true });
          } else {
            el.style.display = 'none';
            el.style.opacity = '0';
          }
        });
      };

      // Activate Global Hello container and show first script (Bengali)
      tl.add(() => {
        if (terminalRef.current) terminalRef.current.style.display = 'none';
        if (helloWrapRef.current) {
          helloWrapRef.current.style.display = 'flex';
        }
        showScriptFrame(0);
      });

      // Hello container scales and clears blur
      tl.fromTo(
        helloWrapRef.current,
        { autoAlpha: 0, scale: 0.92, filter: 'blur(10px)' },
        { autoAlpha: 1, scale: 1, filter: 'blur(0px)', duration: 0.35, ease: 'power3.out' }
      );

      // Frame 0: Bengali (সাহিনুর) displays for 240ms
      tl.to({}, { duration: 0.24 });

      // Frame 1: Hindi (साहिनुर)
      tl.add(() => showScriptFrame(1));
      tl.to({}, { duration: 0.24 });

      // Frame 2: Japanese (サヒヌル)
      tl.add(() => showScriptFrame(2));
      tl.to({}, { duration: 0.24 });

      // Frame 3: Russian (сахинур)
      tl.add(() => showScriptFrame(3));
      tl.to({}, { duration: 0.24 });

      // Frame 4: Arabic (ساهينور - dir="rtl", cursor hidden)
      tl.add(() => showScriptFrame(4));
      tl.to({}, { duration: 0.24 });

      // Frame 5: Latin resting state (Sahinur _) with gold blinking cursor
      tl.add(() => showScriptFrame(5));
      // Hold on the Latin resting state for ~550ms
      tl.to({}, { duration: 0.55 });

      // ─── GATING LOGIC: Wait for page ready OR ceiling, then smooth wipe-out ───
      tl.add(() => {
        const executeWipeOut = () => {
          if (!preloaderRef.current) {
            finishPreloader(targetHash);
            return;
          }

          gsap.to(preloaderRef.current, {
            autoAlpha: 0,
            scale: 1.05,
            filter: 'blur(8px)',
            duration: 0.5,
            ease: 'power2.inOut',
            onComplete: () => {
              finishPreloader(targetHash);
            },
          });
        };

        if (isPageReadyRef.current || ceilingHitRef.current) {
          executeWipeOut();
        } else {
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
        {/* Ambient Glow */}
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
              <span className="boot-cmd" ref={cmd1TextRef}></span>
              <span className="boot-typing-cursor" ref={cmd1CursorRef}>▋</span>
            </div>

            {/* Line 2: sahinur_islam */}
            <div className="boot-line boot-out-highlight" ref={line2Ref}>
              <span className="boot-output">sahinur_islam</span>
            </div>

            {/* Line 3: $ ./init_portfolio.sh */}
            <div className="boot-line" ref={line3Ref}>
              <span className="boot-prompt">$</span>
              <span className="boot-cmd" ref={cmd2TextRef}></span>
              <span className="boot-typing-cursor" ref={cmd2CursorRef}>▋</span>
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

        {/* 2. Global Hello Display - Guaranteed 100% hidden by default in CSS and inline style */}
        <div
          className="boot-hello-wrap"
          ref={helloWrapRef}
          style={{ display: 'none', opacity: 0, visibility: 'hidden' }}
        >
          <div className="boot-hello-content">
            {HELLO_SCRIPTS.map((script, idx) => (
              <span
                key={script.lang}
                ref={(el) => (scriptRefs.current[idx] = el)}
                className="boot-hello-word"
                dir={script.dir}
                lang={script.lang}
                style={{ display: 'none', opacity: 0 }}
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
