'use client';
import React, { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import gsap from 'gsap';
import { isQuietRoute } from '@/lib/quietRoutes';

const NATIVE_CURSOR_SELECTOR =
  'input, textarea, select, [contenteditable="true"], [contenteditable=""], pre, code, iframe, dialog, [role="dialog"], #cookie-consent, [data-native-cursor]';

export default function CustomCursor() {
  const pathname = usePathname();
  const quiet = isQuietRoute(pathname);

  useEffect(() => {
    if (quiet) return;
    const cursor = document.getElementById('cursor');
    const ring = document.getElementById('cursor-ring');
    if (!cursor || !ring) return;

    // Must be fine pointer with hover capability
    const pointerFineHover = window.matchMedia('(pointer: fine) and (hover: hover)');
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (!pointerFineHover.matches || reducedMotion.matches) {
      cursor.style.display = 'none';
      ring.style.display = 'none';
      return;
    }

    let mx = -100,
      my = -100,
      rx = -100,
      ry = -100;
    let isVisible = false;
    let disabledByError = false;

    const hideFollower = () => {
      isVisible = false;
      cursor.style.opacity = '0';
      ring.style.opacity = '0';
    };

    const showFollower = () => {
      if (disabledByError) return;
      isVisible = true;
      cursor.style.opacity = '1';
      ring.style.opacity = '1';
    };

    const handleMouseMove = (e) => {
      if (disabledByError) return;

      const target = e.target;
      if (
        target &&
        typeof target.closest === 'function' &&
        target.closest(NATIVE_CURSOR_SELECTOR)
      ) {
        hideFollower();
        return;
      }

      mx = e.clientX;
      my = e.clientY;

      if (!isVisible) {
        showFollower();
      }

      gsap.to(cursor, { x: mx, y: my, duration: 0.05, ease: 'none' });
    };

    const handleMouseLeave = () => {
      hideFollower();
    };

    const handleMouseEnter = () => {
      if (!disabledByError) {
        showFollower();
      }
    };

    const handleBlur = () => {
      hideFollower();
    };

    const handleVisibilityChange = () => {
      if (document.hidden) {
        hideFollower();
      }
    };

    const handleError = () => {
      // Auto-disable decorative cursor on any unhandled runtime error
      disabledByError = true;
      hideFollower();
      cursor.style.display = 'none';
      ring.style.display = 'none';
    };

    // Route change resets follower until pointer movement resumes
    hideFollower();

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    document.documentElement.addEventListener('mouseleave', handleMouseLeave);
    document.documentElement.addEventListener('mouseenter', handleMouseEnter);
    window.addEventListener('blur', handleBlur);
    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('error', handleError);

    let animationFrameId;
    const animateRing = () => {
      rx += (mx - rx) * 0.12;
      ry += (my - ry) * 0.12;
      ring.style.left = rx + 'px';
      ring.style.top = ry + 'px';
      animationFrameId = requestAnimationFrame(animateRing);
    };
    animateRing();

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      document.documentElement.removeEventListener('mouseleave', handleMouseLeave);
      document.documentElement.removeEventListener('mouseenter', handleMouseEnter);
      window.removeEventListener('blur', handleBlur);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('error', handleError);
      cancelAnimationFrame(animationFrameId);
      gsap.killTweensOf(cursor);
    };
  }, [quiet, pathname]);

  if (quiet) return null;

  return (
    <>
      <div id="cursor" aria-hidden="true"></div>
      <div id="cursor-ring" aria-hidden="true"></div>
    </>
  );
}
