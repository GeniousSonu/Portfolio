'use client';

import { useEffect, useRef } from 'react';

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
  touchAction: '',
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
          touchAction: document.body.style.touchAction,
        };

        // Apply cross-device scroll lock
        document.body.style.overflow = 'hidden';
        document.body.style.position = 'fixed';
        document.body.style.top = `-${previousScrollY}px`;
        document.body.style.left = '0';
        document.body.style.right = '0';
        document.body.style.width = '100%';
        document.body.style.touchAction = 'none';

        // Safely stop Lenis if active on desktop (optional chaining prevents throws on mobile)
        if (typeof window !== 'undefined') {
          window.__lenis?.stop();
        }
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
        document.body.style.touchAction = previousStyles.touchAction || '';

        // Seamlessly restore scroll position without animation jump, unless an anchor navigation is active
        if (typeof window !== 'undefined' && window.__portfolioNavigatingToAnchor) {
          window.__portfolioNavigatingToAnchor = false;
        } else {
          window.scrollTo({
            top: scrollYToRestore,
            left: 0,
            behavior: 'instant',
          });
        }

        // Safely resume Lenis
        if (typeof window !== 'undefined') {
          window.__lenis?.start();
        }
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
          document.body.style.touchAction = previousStyles.touchAction || '';

          window.scrollTo({
            top: scrollYToRestore,
            left: 0,
            behavior: 'instant',
          });

          if (typeof window !== 'undefined') {
            window.__lenis?.start();
          }
        }
      }
    };
  }, [isLocked]);
}

export default useScrollLock;
