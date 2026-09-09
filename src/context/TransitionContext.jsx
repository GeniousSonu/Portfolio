'use client';

import React, { createContext, useContext, useState, useEffect, useRef, useCallback } from 'react';
import { useRouter, usePathname } from 'next/navigation';

const TransitionContext = createContext(null);

export function TransitionProvider({ children }) {
  const router = useRouter();
  const pathname = usePathname();
  const [transitionStatus, setTransitionStatus] = useState('idle'); // 'idle' | 'transitioning' | 'completed'

  // Ref to track active AbortController for in-flight transitions
  const activeControllerRef = useRef(null);
  // Ref to resolve the startViewTransition DOM update promise once pathname updates
  const transitionResolverRef = useRef(null);
  // Ref to track destination pathname
  const targetPathRef = useRef(null);

  // When pathname changes, settle the pending transition and notify shared context
  useEffect(() => {
    if (transitionResolverRef.current) {
      transitionResolverRef.current();
      transitionResolverRef.current = null;
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

    const currentPath = window.location.pathname;
    let targetPath = href;
    try {
      const targetUrl = new URL(href, window.location.href);
      targetPath = targetUrl.pathname;
      // Same-page hash navigation (e.g. /#contact when already on /)
      if (targetPath === currentPath && targetUrl.hash) {
        return;
      }
      // Same path without hash - no route transition needed
      if (targetPath === currentPath && !targetUrl.hash) {
        return;
      }
    } catch {
      // Relative path fallback
      if (href === currentPath) return;
    }

    // 2. Rapid navigation interruption: cancel and abort prior in-flight transition
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

    // 5. Native View Transition with AbortController & 450ms safety timeout
    setTransitionStatus('transitioning');

    let isSettled = false;
    let finishPromiseResolve = null;

    const transitionPromise = new Promise((resolve) => {
      finishPromiseResolve = resolve;
      transitionResolverRef.current = () => {
        if (!isSettled && !controller.signal.aborted) {
          isSettled = true;
          resolve();
        }
      };
    });

    // 450ms timeout guard: ensures transition NEVER hangs or blocks interactivity
    const timeoutId = setTimeout(() => {
      if (!isSettled) {
        isSettled = true;
        transitionResolverRef.current = null;
        if (finishPromiseResolve) finishPromiseResolve();
        setTransitionStatus('completed');
      }
    }, 450);

    controller.signal.addEventListener('abort', () => {
      clearTimeout(timeoutId);
      if (!isSettled) {
        isSettled = true;
        transitionResolverRef.current = null;
        if (finishPromiseResolve) finishPromiseResolve();
      }
    });

    try {
      const transition = document.startViewTransition(async () => {
        router.push(href);
        await transitionPromise;
      });

      transition.finished
        .then(() => {
          clearTimeout(timeoutId);
          if (!controller.signal.aborted) {
            setTransitionStatus('completed');
          }
        })
        .catch(() => {
          clearTimeout(timeoutId);
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

  // Global click interceptor for internal links to ensure full application coverage
  useEffect(() => {
    if (typeof document === 'undefined') return;

    const handleGlobalLinkClick = (e) => {
      // Ignore modified clicks (ctrl, cmd, shift, alt) or secondary clicks
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

    document.addEventListener('click', handleGlobalLinkClick, { capture: true });
    return () => {
      document.removeEventListener('click', handleGlobalLinkClick, { capture: true });
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
