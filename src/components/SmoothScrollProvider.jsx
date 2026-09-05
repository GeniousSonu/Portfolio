'use client';

import { useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';
import Lenis from 'lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

/**
 * SmoothScrollProvider
 * 
 * - Creates a single global Lenis instance.
 * - Restricts Lenis to desktop viewports (>= 1024px with fine pointer) to prevent touch jank.
 * - Respects prefers-reduced-motion.
 * - Perfectly synchronizes Lenis with GSAP ScrollTrigger ticker.
 * - Strict-mode safe: prevents double-init and cleans up completely on unmount.
 * - Resets scroll position and refreshes ScrollTrigger on Next.js client-side route changes.
 * - Triggers ScrollTrigger.refresh() on window load to account for lazy-loaded images.
 */
export default function SmoothScrollProvider() {
  const pathname = usePathname();
  const lenisRef = useRef(null);
  const tickerHandlerRef = useRef(null);
  const initializedRef = useRef(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    // 1. Accessibility: Bypassed if user prefers reduced motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) {
      return;
    }

    // 2. Mobile / Touch stability: Native scroll is preferred on touch & smaller devices (< 1024px)
    const isDesktopWithFinePointer = window.matchMedia('(min-width: 1024px) and (pointer: fine)').matches;
    if (!isDesktopWithFinePointer) {
      return;
    }

    // 3. React 18/19 Strict Mode Guard: Prevent double-initialization
    if (initializedRef.current || window.__lenis) {
      return;
    }
    initializedRef.current = true;

    // 4. Register and configure ScrollTrigger globally
    gsap.registerPlugin(ScrollTrigger);
    ScrollTrigger.config({
      invalidateOnRefresh: true,
      ignoreMobileResize: true,
    });

    // 5. Initialize single Lenis instance
    const lenis = new Lenis({
      lerp: 0.1,
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      syncTouch: false,
    });

    // 6. Hook Lenis scroll event to ScrollTrigger update
    lenis.on('scroll', ScrollTrigger.update);

    // 7. Drive Lenis through GSAP ticker for frame-perfect animation sync
    const tickerHandler = (time) => {
      lenis.raf(time * 1000);
    };
    gsap.ticker.add(tickerHandler);
    gsap.ticker.lagSmoothing(0);

    window.__lenis = lenis;
    lenisRef.current = lenis;
    tickerHandlerRef.current = tickerHandler;

    // Refresh ScrollTrigger once Lenis is active
    ScrollTrigger.refresh();

    // 8. Full cleanup on unmount
    return () => {
      if (tickerHandlerRef.current) {
        gsap.ticker.remove(tickerHandlerRef.current);
        tickerHandlerRef.current = null;
      }
      if (lenisRef.current) {
        lenisRef.current.destroy();
        lenisRef.current = null;
      }
      window.__lenis = null;
      initializedRef.current = false;
    };
  }, []);

  // 9. Route-change synchronization (reset scroll & recalculate trigger positions)
  useEffect(() => {
    if (typeof window === 'undefined') return;

    if (window.__lenis) {
      window.__lenis.scrollTo(0, { immediate: true });
    }

    // Small delay ensures DOM has swapped before recalculating trigger offsets
    const timer = setTimeout(() => {
      ScrollTrigger.refresh();
    }, 80);

    return () => clearTimeout(timer);
  }, [pathname]);

  // 10. Refresh triggers when full window / lazy assets finish loading
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const handleAssetsLoaded = () => {
      ScrollTrigger.refresh();
    };

    if (document.readyState === 'complete') {
      ScrollTrigger.refresh();
    } else {
      window.addEventListener('load', handleAssetsLoaded, { once: true });
    }

    window.addEventListener('scrolltrigger-refresh-needed', handleAssetsLoaded);

    return () => {
      window.removeEventListener('load', handleAssetsLoaded);
      window.removeEventListener('scrolltrigger-refresh-needed', handleAssetsLoaded);
    };
  }, []);

  return null;
}
