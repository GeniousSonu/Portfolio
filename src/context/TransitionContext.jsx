'use client';

import React, { createContext, useContext, useState, useEffect, useRef, useCallback } from 'react';
import { useRouter, usePathname } from 'next/navigation';

const TransitionContext = createContext(null);

export function TransitionProvider({ children }) {
  const router = useRouter();
  const pathname = usePathname();
  const [transitionStatus, setTransitionStatus] = useState('idle'); // 'idle' | 'transitioning' | 'completed'

  // Ref to track active ViewTransition instance
  const activeTransitionRef = useRef(null);
  // Ref to track active AbortController for in-flight transitions
  const activeControllerRef = useRef(null);
  // Ref to resolve the startViewTransition DOM update promise once pathname updates
  const transitionResolverRef = useRef(null);
  // Ref to track active safety timeout
  const activeTimeoutRef = useRef(null);
  // Ref to track destination pathname
  const targetPathRef = useRef(null);
  // Deduplication ref to prevent duplicate triggers within same event cycle
  const lastNavRef = useRef({ href: '', time: 0 });

  // Suppress harmless ViewTransition AbortErrors in dev overlays (e.g. Next.js Turbopack)
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

  // When pathname changes, settle the pending transition and notify shared context
  useEffect(() => {
    if (transitionResolverRef.current) {
      transitionResolverRef.current();
      transitionResolverRef.current = null;
    }
    if (activeTimeoutRef.current) {
      clearTimeout(activeTimeoutRef.current);
      activeTimeoutRef.current = null;
    }
    targetPathRef.current = null;
    setTransitionStatus('completed');

    // After animation duration (180ms), return to idle
    const timer = setTimeout(() => {
      setTransitionStatus('idle');
    }, 220);

    return () => clearTimeout(timer);
  }, [pathname]);

  const transitionNavigate = useCallback((href) => {
    if (!href || typeof window === 'undefined') return;

    // 1. Pre-flight checks: anchor links or same path
    if (href.startsWith('#')) {
      return;
    }

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
      // Same-page hash navigation (e.g. /#contact when already on /)
      if (normalize(targetPath) === normalize(currentPath) && targetUrl.hash) {
        return;
      }
      // Same path without hash - no route transition needed
      if (normalize(targetPath) === normalize(currentPath) && !targetUrl.hash) {
        return;
      }
    } catch {
      // Relative path fallback
      if (normalize(href) === normalize(currentPath)) return;
    }

    // Deduplication guard: ignore redundant triggers for same destination within 250ms
    const now = Date.now();
    if (lastNavRef.current.href === href && now - lastNavRef.current.time < 250) {
      return;
    }
    lastNavRef.current = { href, time: now };

    // 2. Rapid navigation interruption: cleanly abort prior in-flight transition
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
      } catch {
        // Safe ignore
      }
      activeTransitionRef.current = null;
    }
    if (activeControllerRef.current) {
      activeControllerRef.current.abort();
      activeControllerRef.current = null;
    }

    const controller = new AbortController();
    activeControllerRef.current = controller;
    targetPathRef.current = targetPath;

    // 3. Accessibility check: prefers-reduced-motion
    const prefersReducedMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) {
      setTransitionStatus('completed');
      router.push(href);
      return;
    }

    // 4. Native View Transitions API support check
    const supportsViewTransitions = typeof document !== 'undefined' && 'startViewTransition' in document;

    if (!supportsViewTransitions) {
      // Fallback for Firefox and older Safari: CSS opacity fade
      setTransitionStatus('transitioning');
      router.push(href);
      return;
    }

    console.log('[TransitionContext] transitionNavigate called for href:', href, 'current pathname:', pathname, 'at', performance.now());
    // 5. Native View Transition with AbortController & 450ms safety timeout
    setTransitionStatus('transitioning');

    let isSettled = false;
    let finishPromiseResolve = null;

    const transitionPromise = new Promise((resolve) => {
      finishPromiseResolve = resolve;
      transitionResolverRef.current = () => {
        console.log('[TransitionContext] transitionResolverRef called at', performance.now());
        if (!isSettled && !controller.signal.aborted) {
          isSettled = true;
          resolve();
        }
      };
    });

    // 450ms timeout guard: ensures transition NEVER hangs or blocks interactivity
    const timeoutId = setTimeout(() => {
      console.log('[TransitionContext] 450ms safety timeout FIRED! isSettled:', isSettled, 'at', performance.now());
      if (!isSettled) {
        isSettled = true;
        transitionResolverRef.current = null;
        if (finishPromiseResolve) finishPromiseResolve();
        setTransitionStatus('completed');
      }
    }, 450);
    activeTimeoutRef.current = timeoutId;

    controller.signal.addEventListener('abort', () => {
      console.log('[TransitionContext] controller aborted at', performance.now());
      clearTimeout(timeoutId);
      if (!isSettled) {
        isSettled = true;
        transitionResolverRef.current = null;
        if (finishPromiseResolve) finishPromiseResolve();
      }
    });

    try {
      console.log('[TransitionContext] Calling document.startViewTransition at', performance.now());
      const transition = document.startViewTransition(async () => {
        console.log('[TransitionContext] startViewTransition callback started. Calling router.push for:', href, 'at', performance.now());
        router.push(href);
        console.log('[TransitionContext] Waiting for transitionPromise at', performance.now());
        await transitionPromise;
        console.log('[TransitionContext] transitionPromise resolved at', performance.now());
      });
      activeTransitionRef.current = transition;

      transition.ready?.then(() => {
        console.log('[TransitionContext] transition.ready resolved at', performance.now());
      }).catch((e) => {
        console.log('[TransitionContext] transition.ready rejected:', e?.message, 'at', performance.now());
      });

      transition.finished
        ?.then(() => {
          console.log('[TransitionContext] transition.finished resolved at', performance.now());
          clearTimeout(timeoutId);
          if (activeTransitionRef.current === transition) {
            activeTransitionRef.current = null;
          }
          if (!controller.signal.aborted) {
            setTransitionStatus('completed');
          }
        })
        ?.catch((e) => {
          console.log('[TransitionContext] transition.finished rejected:', e?.message, 'at', performance.now());
          clearTimeout(timeoutId);
          if (activeTransitionRef.current === transition) {
            activeTransitionRef.current = null;
          }
          if (!controller.signal.aborted) {
            setTransitionStatus('completed');
          }
        });
    } catch {
      clearTimeout(timeoutId);
      router.push(href);
      setTransitionStatus('completed');
    }
  }, [router]);

  // Global click interceptor for internal links in bubble phase
  useEffect(() => {
    if (typeof document === 'undefined') return;

    const handleGlobalLinkClick = (e) => {
      // Ignore if event was already handled (e.g. by an explicit onClick), or modified clicks
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) {
        return;
      }

      const anchor = e.target.closest?.('a[href]');
      if (!anchor) return;

      // Ignore external, target="_blank", or download links
      if (anchor.target && anchor.target !== '_self') return;
      if (anchor.hasAttribute('download')) return;

      const hrefAttr = anchor.getAttribute('href');
      if (!hrefAttr || hrefAttr.startsWith('mailto:') || hrefAttr.startsWith('tel:') || hrefAttr.startsWith('javascript:')) {
        return;
      }

      // Ignore pure in-page anchor links like href="#contact"
      if (hrefAttr.startsWith('#')) return;

      try {
        const targetUrl = new URL(anchor.href, window.location.href);
        // Ensure same origin
        if (targetUrl.origin !== window.location.origin) return;

        // Same-page hash navigation
        if (targetUrl.pathname === window.location.pathname && targetUrl.hash) return;
        // Exact same path
        if (targetUrl.pathname === window.location.pathname && !targetUrl.hash) return;

        // Route navigation: intercept and drive via transitionNavigate
        e.preventDefault();
        transitionNavigate(targetUrl.pathname + targetUrl.search + targetUrl.hash);
      } catch {
        // Allow browser default
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
        transitionNavigate,
      }}
    >
      {children}
    </TransitionContext.Provider>
  );
}

export function useTransitionRouter() {
  const context = useContext(TransitionContext);
  const router = useRouter();

  if (!context) {
    // Safe fallback if called outside TransitionProvider or during SSR
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
