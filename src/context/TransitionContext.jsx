'use client';

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useRef,
  useCallback,
  startTransition,
} from 'react';
import { useRouter, usePathname } from 'next/navigation';
import PageTransitionWaveform from '@/components/PageTransitionWaveform';
import navState from '@/lib/navState';

const TransitionContext = createContext(null);

export function TransitionProvider({ children }) {
  const router = useRouter();
  const pathname = usePathname();
  const [transitionStatus, setTransitionStatus] = useState('idle'); // 'idle' | 'transitioning' | 'completed'
  const [transitionPhase, setTransitionPhase] = useState('idle'); // 'idle' | 'sweep' | 'fade-in'
  const [waveformActive, setWaveformActive] = useState(false);
  const [announcement, setAnnouncement] = useState('');

  // Tracking in-flight navigation, target route, and timers
  const targetRouteRef = useRef(null);
  const activeControllerRef = useRef(null);
  const safetyTimeoutRef = useRef(null);
  const watchdogTimeoutRef = useRef(null);
  const phaseTimersRef = useRef([]);
  const lastNavRef = useRef({ href: '', time: 0 });
  const isNavigatingRef = useRef(false);

  const clearPhaseTimers = useCallback(() => {
    phaseTimersRef.current.forEach((id) => clearTimeout(id));
    phaseTimersRef.current = [];
    if (safetyTimeoutRef.current) {
      clearTimeout(safetyTimeoutRef.current);
      safetyTimeoutRef.current = null;
    }
    if (watchdogTimeoutRef.current) {
      clearTimeout(watchdogTimeoutRef.current);
      watchdogTimeoutRef.current = null;
    }
  }, []);
  const clearTimers = clearPhaseTimers;

  // Suppress harmless ViewTransition AbortErrors in dev overlays
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const handleUnhandledRejection = (e) => {
      const err = e.reason;
      if (
        err?.name === 'AbortError' ||
        (typeof err?.message === 'string' &&
          (err.message.includes('ViewTransition') || err.message.includes('transition')))
      ) {
        e.preventDefault();
      }
    };

    window.addEventListener('unhandledrejection', handleUnhandledRejection);
    return () => {
      window.removeEventListener('unhandledrejection', handleUnhandledRejection);
    };
  }, []);

  // Settle transition after destination DOM has mounted and painted
  const completeTransition = useCallback((targetPath) => {
    if (watchdogTimeoutRef.current) {
      clearTimeout(watchdogTimeoutRef.current);
      watchdogTimeoutRef.current = null;
    }
    // Wait 2 animation frames to guarantee the browser has finished painting destination DOM
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        // Scroll reset strictly AFTER paint, never before
        if (navState.lenis) {
          try {
            navState.lenis.scrollTo(0, { immediate: true });
          } catch {}
        } else {
          window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
        }

        setTransitionPhase('fade-in');

        // Announce route change to assistive technology
        const pageTitle = document.title || 'Page';
        setAnnouncement(`Navigated to ${pageTitle}`);

        // Accessibility focus shift
        const mainEl = document.querySelector('main') || document.querySelector('h1');
        if (mainEl) {
          if (!mainEl.hasAttribute('tabindex')) {
            mainEl.setAttribute('tabindex', '-1');
          }
          mainEl.focus({ preventScroll: true });
        }

        const settleTimer = setTimeout(() => {
          isNavigatingRef.current = false;
          targetRouteRef.current = null;
          setTransitionStatus('idle');
          setTransitionPhase('idle');
          setWaveformActive(false);
        }, 120);
        phaseTimersRef.current.push(settleTimer);
      });
    });
  }, []);

  // Route observer: triggers when pathname changes
  useEffect(() => {
    if (!isNavigatingRef.current) {
      setTransitionStatus('idle');
      setTransitionPhase('idle');
      setWaveformActive(false);
      return;
    }

    if (safetyTimeoutRef.current) {
      clearTimeout(safetyTimeoutRef.current);
      safetyTimeoutRef.current = null;
    }
    if (watchdogTimeoutRef.current) {
      clearTimeout(watchdogTimeoutRef.current);
      watchdogTimeoutRef.current = null;
    }

    // Verify destination route mount before completing
    const target = targetRouteRef.current;
    let attempts = 0;
    const maxAttempts = 25; // ~400ms at 60fps

    function pollMount() {
      attempts++;
      const mainEl = document.querySelector('main');
      const activeRoute = mainEl?.getAttribute('data-route');

      const isTargetMounted =
        !target ||
        !activeRoute ||
        activeRoute === target ||
        (target.startsWith('/plugin') && activeRoute.startsWith('/plugin')) ||
        (target.startsWith('/blog') && activeRoute.startsWith('/blog')) ||
        (target.startsWith('/space') && activeRoute.startsWith('/space')) ||
        (target.startsWith('/lounge') && activeRoute.startsWith('/lounge'));

      if (isTargetMounted || attempts >= maxAttempts) {
        completeTransition(target);
      } else {
        requestAnimationFrame(pollMount);
      }
    }

    requestAnimationFrame(pollMount);
  }, [pathname, completeTransition]);

  const transitionNavigate = useCallback(
    (href) => {
      if (!href || typeof window === 'undefined') return;

      if (href.startsWith('#')) return;

      const normalize = (p) => {
        if (!p) return '/';
        const clean = p.replace(/\/+$/, '');
        return clean === '' ? '/' : clean;
      };

      const currentPath = window.location.pathname;
      let targetPath = href;
      try {
        const targetUrl = new URL(href, window.location.href);
        targetPath = targetUrl.pathname;
        if (normalize(targetPath) === normalize(currentPath) && targetUrl.hash) {
          const el = document.querySelector(targetUrl.hash);
          if (el) el.scrollIntoView({ behavior: 'smooth' });
          return;
        }
        if (normalize(targetPath) === normalize(currentPath) && !targetUrl.hash) {
          window.scrollTo({ top: 0, behavior: 'smooth' });
          return;
        }
      } catch {
        if (normalize(href) === normalize(currentPath)) return;
      }

      // Deduplication guard: ignore redundant triggers within 150ms
      const now = Date.now();
      if (lastNavRef.current.href === href && now - lastNavRef.current.time < 150) {
        return;
      }
      lastNavRef.current = { href, time: now };

      // Abort prior in-flight timers
      clearPhaseTimers();
      if (activeControllerRef.current) {
        activeControllerRef.current.abort();
        activeControllerRef.current = null;
      }

      const controller = new AbortController();
      activeControllerRef.current = controller;

      // Accessibility check: prefers-reduced-motion
      const prefersReducedMotion =
        window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ||
        localStorage.getItem('sks_reduce_motion') === 'true';

      if (prefersReducedMotion) {
        setTransitionStatus('completed');
        setTransitionPhase('idle');
        setWaveformActive(false);
        startTransition(() => {
          router.push(href);
        });
        return;
      }

      // Transition start: Old page stays at opacity 1 underneath!
      isNavigatingRef.current = true;
      targetRouteRef.current = targetPath;
      setTransitionStatus('transitioning');
      setWaveformActive(true);
      setTransitionPhase('sweep');

      // Execute route update in React transition
      startTransition(() => {
        router.push(href);
      });

      // Hard safety timeout guard (450ms): soft recovery if transition animation stalls
      safetyTimeoutRef.current = setTimeout(() => {
        if (isNavigatingRef.current) {
          setWaveformActive(false);
          setTransitionPhase('idle');
          setTransitionStatus('idle');
        }
      }, 450);

      // Architecture Navigation Watchdog (1500ms):
      // A transition must NEVER be able to block navigation.
      // If the destination has not become current within 1500ms, perform a full standard navigation.
      watchdogTimeoutRef.current = setTimeout(() => {
        const currentPathNow = typeof window !== 'undefined' ? window.location.pathname : '';
        if (isNavigatingRef.current || normalize(currentPathNow) !== normalize(targetPath)) {
          console.warn(
            `[Navigation Watchdog] Destination ${targetPath} not current within 1500ms. Performing fallback navigation to ${href}`
          );
          isNavigatingRef.current = false;
          targetRouteRef.current = null;
          clearTimers();
          setWaveformActive(false);
          setTransitionPhase('idle');
          setTransitionStatus('idle');
          if (typeof window !== 'undefined') {
            window.location.assign(href);
          }
        }
      }, 1500);
    },
    [router, clearPhaseTimers, clearTimers]
  );

  // Global click interceptor for internal links
  useEffect(() => {
    if (typeof document === 'undefined') return;

    if (typeof window !== 'undefined') {
      window.__portfolioNavigate = transitionNavigate;
    }

    const handleGlobalLinkClick = (e) => {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) {
        return;
      }

      const anchor = e.target.closest?.('a[href]');
      if (!anchor) return;

      if (anchor.target && anchor.target !== '_self') return;
      if (anchor.hasAttribute('download')) return;

      const hrefAttr = anchor.getAttribute('href');
      if (
        !hrefAttr ||
        hrefAttr.startsWith('mailto:') ||
        hrefAttr.startsWith('tel:') ||
        hrefAttr.startsWith('javascript:')
      ) {
        return;
      }

      if (hrefAttr.startsWith('#')) return;

      try {
        const targetUrl = new URL(hrefAttr, window.location.href);
        if (targetUrl.origin !== window.location.origin) return;

        e.preventDefault();
        transitionNavigate(targetUrl.pathname + targetUrl.search + targetUrl.hash);
      } catch {
        // Safe ignore
      }
    };

    document.addEventListener('click', handleGlobalLinkClick);
    return () => {
      document.removeEventListener('click', handleGlobalLinkClick);
    };
  }, [transitionNavigate]);

  // Intelligent prefetching: hover, focus, viewport entry
  useEffect(() => {
    if (typeof document === 'undefined') return;

    const prefetched = new Set();
    const prefetchLink = (href) => {
      if (!href || prefetched.has(href)) return;
      try {
        const url = new URL(href, window.location.href);
        if (
          url.origin === window.location.origin &&
          !url.pathname.startsWith('/api') &&
          !url.pathname.startsWith('/studio') &&
          !url.pathname.startsWith('/reset')
        ) {
          prefetched.add(href);
          router.prefetch(url.pathname);
        }
      } catch {}
    };

    const handlePointerOver = (e) => {
      const anchor = e.target.closest?.('a[href]');
      if (anchor) prefetchLink(anchor.getAttribute('href'));
    };

    const handleFocusIn = (e) => {
      const anchor = e.target.closest?.('a[href]');
      if (anchor) prefetchLink(anchor.getAttribute('href'));
    };

    document.addEventListener('pointerover', handlePointerOver, { passive: true });
    document.addEventListener('focusin', handleFocusIn, { passive: true });

    let observer;
    if (typeof IntersectionObserver !== 'undefined') {
      observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              const href = entry.target.getAttribute('href');
              if (href) prefetchLink(href);
              observer.unobserve(entry.target);
            }
          });
        },
        { rootMargin: '100px' }
      );

      document.querySelectorAll('a[href]').forEach((el) => {
        const href = el.getAttribute('href');
        if (href && href.startsWith('/') && !href.startsWith('/#')) {
          observer.observe(el);
        }
      });
    }

    return () => {
      document.removeEventListener('pointerover', handlePointerOver);
      document.removeEventListener('focusin', handleFocusIn);
      if (observer) observer.disconnect();
    };
  }, [router, pathname]);

  return (
    <TransitionContext.Provider
      value={{
        transitionStatus,
        transitionPhase,
        waveformActive,
        transitionNavigate,
      }}
    >
      {/* Route change waveform overlay */}
      <PageTransitionWaveform active={waveformActive} phase={transitionPhase} />

      {/* Screen reader route title announcement */}
      <div className="sr-only" aria-live="polite" aria-atomic="true">
        {announcement}
      </div>

      {children}
    </TransitionContext.Provider>
  );
}

export function useTransitionRouter() {
  const context = useContext(TransitionContext);
  const router = useRouter();

  if (!context) {
    return {
      transitionStatus: 'idle',
      transitionNavigate: (href) => router.push(href),
      push: (href) => router.push(href),
      replace: (href) => router.replace(href),
    };
  }

  return {
    transitionStatus: context.transitionStatus,
    transitionNavigate: context.transitionNavigate,
    push: context.transitionNavigate,
    replace: (href) => context.transitionNavigate(href),
  };
}

export default TransitionProvider;
