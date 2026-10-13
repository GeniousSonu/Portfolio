'use client';

import React, { createContext, useContext, useState, useEffect, useRef, useCallback } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import PageTransitionWaveform from '@/components/PageTransitionWaveform';

const TransitionContext = createContext(null);

export function TransitionProvider({ children }) {
  const router = useRouter();
  const pathname = usePathname();
  const [transitionStatus, setTransitionStatus] = useState('idle'); // 'idle' | 'transitioning' | 'completed'
  const [transitionPhase, setTransitionPhase] = useState('idle'); // 'idle' | 'fade-out' | 'sweep' | 'fade-in'
  const [waveformActive, setWaveformActive] = useState(false);
  const [announcement, setAnnouncement] = useState('');

  // Refs for tracking in-flight transitions and timeouts
  const activeTransitionRef = useRef(null);
  const activeControllerRef = useRef(null);
  const transitionResolverRef = useRef(null);
  const activeTimeoutRef = useRef(null);
  const phaseTimersRef = useRef([]);
  const lastNavRef = useRef({ href: '', time: 0 });

  const clearPhaseTimers = useCallback(() => {
    phaseTimersRef.current.forEach((id) => clearTimeout(id));
    phaseTimersRef.current = [];
  }, []);

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

  // When pathname changes, settle pending transition, move focus, and announce new title
  useEffect(() => {
    if (transitionResolverRef.current) {
      transitionResolverRef.current();
      transitionResolverRef.current = null;
    }
    if (activeTimeoutRef.current) {
      clearTimeout(activeTimeoutRef.current);
      activeTimeoutRef.current = null;
    }

    // Announce route change to screen readers
    const pageTitle = document.title || 'Page';
    setAnnouncement(`Navigated to ${pageTitle}`);

    // Accessibility: Move focus to main landmark or h1
    setTimeout(() => {
      const mainEl = document.querySelector('main') || document.querySelector('h1');
      if (mainEl) {
        if (!mainEl.hasAttribute('tabindex')) {
          mainEl.setAttribute('tabindex', '-1');
        }
        mainEl.focus({ preventScroll: true });
      }
    }, 60);

    setTransitionStatus('completed');
    setTransitionPhase('fade-in');

    const settleTimer = setTimeout(() => {
      setTransitionStatus('idle');
      setTransitionPhase('idle');
      setWaveformActive(false);
    }, 180);

    return () => clearTimeout(settleTimer);
  }, [pathname]);

  const transitionNavigate = useCallback((href) => {
    if (!href || typeof window === 'undefined') return;

    // 1. Pre-flight checks: anchor links or same path
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
        return;
      }
      if (normalize(targetPath) === normalize(currentPath) && !targetUrl.hash) {
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

    // 2. Rapid navigation interruption: cleanly abort prior in-flight transition
    clearPhaseTimers();
    if (activeTimeoutRef.current) {
      clearTimeout(activeTimeoutRef.current);
      activeTimeoutRef.current = null;
    }
    if (transitionResolverRef.current) {
      transitionResolverRef.current();
      transitionResolverRef.current = null;
    }
    if (activeTransitionRef.current) {
      try {
        activeTransitionRef.current.skipTransition?.();
      } catch {}
      activeTransitionRef.current = null;
    }
    if (activeControllerRef.current) {
      activeControllerRef.current.abort();
      activeControllerRef.current = null;
    }

    const controller = new AbortController();
    activeControllerRef.current = controller;

    // 3. Accessibility check: prefers-reduced-motion
    const prefersReducedMotion =
      window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ||
      localStorage.getItem('sks_reduce_motion') === 'true';

    if (prefersReducedMotion) {
      setTransitionStatus('completed');
      setTransitionPhase('idle');
      setWaveformActive(false);
      router.push(href);
      return;
    }

    // 4. Waveform + Fade Sequence (380ms total duration, 450ms hard safety ceiling)
    setTransitionStatus('transitioning');
    setWaveformActive(true);
    setTransitionPhase('fade-out');

    // Update root classes for CSS fade coordination
    const shell = document.querySelector('.page-transition-shell');
    if (shell) {
      shell.classList.add('transition-out');
      shell.classList.remove('transition-in');
    }

    // 100ms: Waveform sweep left to right across center
    const sweepTimer = setTimeout(() => {
      if (controller.signal.aborted) return;
      setTransitionPhase('sweep');
    }, 100);
    phaseTimersRef.current.push(sweepTimer);

    // 200ms: Route execution & new content fade-in
    const navExecuteTimer = setTimeout(() => {
      if (controller.signal.aborted) return;
      setTransitionPhase('fade-in');

      // Native View Transitions check
      const supportsViewTransitions = typeof document !== 'undefined' && 'startViewTransition' in document;
      if (supportsViewTransitions) {
        try {
          const transition = document.startViewTransition(() => {
            router.push(href);
          });
          activeTransitionRef.current = transition;
          transition.finished
            ?.then(() => {
              activeTransitionRef.current = null;
            })
            ?.catch(() => {
              activeTransitionRef.current = null;
            });
        } catch {
          router.push(href);
        }
      } else {
        router.push(href);
      }

      if (shell) {
        shell.classList.remove('transition-out');
        shell.classList.add('transition-in');
      }
    }, 200);
    phaseTimersRef.current.push(navExecuteTimer);

    // 380ms: Final completion and waveform removal
    const completeTimer = setTimeout(() => {
      if (controller.signal.aborted) return;
      setWaveformActive(false);
      setTransitionPhase('idle');
      setTransitionStatus('completed');
      if (shell) {
        shell.classList.remove('transition-in', 'transition-out');
      }
    }, 380);
    phaseTimersRef.current.push(completeTimer);

    // 450ms: Hard safety timeout (guarantees interactivity never blocked)
    const timeoutId = setTimeout(() => {
      clearPhaseTimers();
      setWaveformActive(false);
      setTransitionPhase('idle');
      setTransitionStatus('completed');
      if (shell) {
        shell.classList.remove('transition-in', 'transition-out');
      }
    }, 450);
    activeTimeoutRef.current = timeoutId;
  }, [router, clearPhaseTimers]);

  // Global click interceptor for internal links in bubble phase
  useEffect(() => {
    if (typeof document === 'undefined') return;

    const handleGlobalLinkClick = (e) => {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) {
        return;
      }

      const anchor = e.target.closest?.('a[href]');
      if (!anchor) return;

      if (anchor.target && anchor.target !== '_self') return;
      if (anchor.hasAttribute('download')) return;

      const hrefAttr = anchor.getAttribute('href');
      if (!hrefAttr || hrefAttr.startsWith('mailto:') || hrefAttr.startsWith('tel:') || hrefAttr.startsWith('javascript:')) {
        return;
      }

      if (hrefAttr.startsWith('#')) return;

      try {
        const targetUrl = new URL(hrefAttr, window.location.href);
        if (targetUrl.origin !== window.location.origin) return;

        // Route navigation: intercept and drive via transitionNavigate
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
