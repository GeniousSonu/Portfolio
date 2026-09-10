'use client';

import { useEffect, useRef } from 'react';
import navState from '@/lib/navState';

// Global tracking variables across all component instances
let lockCount = 0;
let previousScrollY = 0;
let previousStyles = {
  overflow: '',
  position: '',
  top: '',
  left: '',
  right: '',
  width: '',
};

/**
 * Custom hook for locking body scroll on full-screen overlays (mobile nav, chatbot, modals).
 * Handles iOS Safari, desktop, and Android robustly by saving scrollY and using position: fixed.
 * Restores exact scroll position without jumping to top upon close.
 */
export function useScrollLock(isLocked) {
  const hasLockedRef = useRef(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    if (isLocked && !hasLockedRef.current) {
      hasLockedRef.current = true;

      if (lockCount === 0) {
        // Record current scroll position
        previousScrollY = window.scrollY || window.pageYOffset || document.documentElement.scrollTop || 0;

        // Preserve previous inline styles
        previousStyles = {
          overflow: document.body.style.overflow,
          position: document.body.style.position,
          top: document.body.style.top,
          left: document.body.style.left,
          right: document.body.style.right,
          width: document.body.style.width,
        };

        // Apply cross-device scroll lock
        document.body.style.overflow = 'hidden';
        document.body.style.position = 'fixed';
        document.body.style.top = `-${previousScrollY}px`;
        document.body.style.left = '0';
        document.body.style.right = '0';
        document.body.style.width = '100%';

        // Safely stop Lenis if active on desktop
        navState.lenis?.stop();
      }

      lockCount += 1;
    } else if (!isLocked && hasLockedRef.current) {
      hasLockedRef.current = false;
      lockCount = Math.max(0, lockCount - 1);

      if (lockCount === 0) {
        // Retrieve scroll offset before clearing styles
        const currentTop = document.body.style.top;
        const scrollYToRestore = currentTop ? Math.abs(parseInt(currentTop, 10)) : previousScrollY;

        // Restore original inline styles
        document.body.style.overflow = previousStyles.overflow || '';
        document.body.style.position = previousStyles.position || '';
        document.body.style.top = previousStyles.top || '';
        document.body.style.left = previousStyles.left || '';
        document.body.style.right = previousStyles.right || '';
        document.body.style.width = previousStyles.width || '';

        // Seamlessly restore scroll position based on navigation intent
        const intent = navState.consumeIntent();
        if (intent === 'route') {
          window.scrollTo({
            top: 0,
            left: 0,
            behavior: 'instant',
          });
        } else if (intent === 'anchor') {
          // Anchor navigation: don't restore scroll — the anchor handler will scroll
        } else {
          window.scrollTo({
            top: scrollYToRestore,
            left: 0,
            behavior: 'instant',
          });
        }

        // Safely resume Lenis
        navState.lenis?.start();
        navState.lenis?.resize();
      }
    }

    return () => {
      // Automatic safety cleanup on unmount
      if (hasLockedRef.current) {
        hasLockedRef.current = false;
        lockCount = Math.max(0, lockCount - 1);

        if (lockCount === 0) {
          const currentTop = document.body.style.top;
          const scrollYToRestore = currentTop ? Math.abs(parseInt(currentTop, 10)) : previousScrollY;

          document.body.style.overflow = previousStyles.overflow || '';
          document.body.style.position = previousStyles.position || '';
          document.body.style.top = previousStyles.top || '';
          document.body.style.left = previousStyles.left || '';
          document.body.style.right = previousStyles.right || '';
          document.body.style.width = previousStyles.width || '';

          const intent = navState.consumeIntent();
          if (intent === 'route') {
            window.scrollTo({
              top: 0,
              left: 0,
              behavior: 'instant',
            });
          } else {
            window.scrollTo({
              top: scrollYToRestore,
              left: 0,
              behavior: 'instant',
            });
          }

          navState.lenis?.start();
          navState.lenis?.resize();
        }
      }
    };
  }, [isLocked]);
}

export default useScrollLock;
