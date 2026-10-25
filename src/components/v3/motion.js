'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

export function prefersReducedMotion() {
  if (typeof window === 'undefined') return false;
  return (
    window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ||
    document.documentElement.classList.contains('reduce-motion')
  );
}

export function useChapterReveal(scopeRef) {
  useEffect(() => {
    const scope = scopeRef.current;
    if (!scope || prefersReducedMotion()) return undefined;

    gsap.registerPlugin(ScrollTrigger);
    const ctx = gsap.context(() => {
      const items = gsap.utils.toArray('[data-reveal]');
      if (!items.length) return;
      gsap.set(items, { opacity: 0, y: 24 });
      ScrollTrigger.batch(items, {
        start: 'top 88%',
        once: true,
        onEnter: (batch) =>
          gsap.to(batch, {
            opacity: 1,
            y: 0,
            duration: 0.56,
            ease: 'power3.out',
            stagger: 0.06,
            overwrite: true,
          }),
      });
    }, scope);

    return () => ctx.revert();
  }, [scopeRef]);
}

export function useBootComplete(callback) {
  const callbackRef = useRef(callback);

  useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);

  useEffect(() => {
    let finished = false;
    let timeoutId = null;
    let observer = null;

    const fire = () => {
      if (finished) return;
      finished = true;
      if (timeoutId) clearTimeout(timeoutId);
      observer?.disconnect();
      callbackRef.current?.();
    };

    const bootDone = () => {
      const root = document.documentElement;
      return (
        root.classList.contains('boot-complete') ||
        root.classList.contains('boot-skip') ||
        !document.getElementById('boot-preloader')
      );
    };

    if (bootDone()) {
      fire();
      return undefined;
    }

    observer = new MutationObserver(() => {
      if (bootDone()) fire();
    });
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });

    // Boot's own ceiling is 4.5s; never leave the hero armed longer than that.
    timeoutId = setTimeout(fire, 5000);

    return () => {
      observer?.disconnect();
      clearTimeout(timeoutId);
    };
  }, []);
}

export function useMagneticButtons(scopeRef) {
  useEffect(() => {
    const scope = scopeRef.current;
    if (!scope || prefersReducedMotion()) return undefined;
    if (!window.matchMedia?.('(hover: hover) and (pointer: fine)').matches) return undefined;

    const buttons = Array.from(scope.querySelectorAll('[data-magnetic]'));
    if (!buttons.length) return undefined;

    const cleanups = buttons.map((button) => {
      const move = (event) => {
        const rect = button.getBoundingClientRect();
        const x = (event.clientX - rect.left - rect.width / 2) * 0.12;
        const y = (event.clientY - rect.top - rect.height / 2) * 0.18;
        gsap.to(button, { x, y, duration: 0.35, ease: 'power2.out' });
      };
      const leave = () => {
        gsap.to(button, { x: 0, y: 0, duration: 0.4, ease: 'power2.out' });
      };
      button.addEventListener('pointermove', move);
      button.addEventListener('pointerleave', leave);
      return () => {
        button.removeEventListener('pointermove', move);
        button.removeEventListener('pointerleave', leave);
        gsap.killTweensOf(button);
        gsap.set(button, { x: 0, y: 0 });
      };
    });

    return () => cleanups.forEach((cleanup) => cleanup());
  }, [scopeRef]);
}
