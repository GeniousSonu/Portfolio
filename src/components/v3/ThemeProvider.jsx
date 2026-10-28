'use client';

import React, { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react';

const ThemeContext = createContext(null);
const STORAGE_KEY = 'v3-theme';

const THEME_BG = {
  light: '#F4EFE4',
  dark: '#070B14',
};

function systemTheme() {
  if (typeof window === 'undefined' || !window.matchMedia) return 'dark';
  return window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
}

function readStoredTheme() {
  if (typeof window === 'undefined') return null;
  try {
    const value = window.localStorage.getItem(STORAGE_KEY);
    return value === 'light' || value === 'dark' ? value : null;
  } catch {
    return null;
  }
}

function syncThemeColor(theme) {
  const color = THEME_BG[theme] || THEME_BG.dark;
  document.querySelectorAll('meta[name="theme-color"]').forEach((meta) => {
    meta.setAttribute('content', color);
  });
}

export function useTheme() {
  return (
    useContext(ThemeContext) || {
      theme: 'dark',
      toggleTheme: () => {},
      setTheme: () => {},
    }
  );
}

export default function ThemeProvider({ children }) {
  const [theme, setThemeState] = useState('light');
  const [mounted, setMounted] = useState(false);
  const veilRef = useRef(null);
  const veilTimerRef = useRef(null);

  const applyTheme = useCallback((next) => {
    const root = document.documentElement;
    root.setAttribute('data-theme', next);
    root.setAttribute('data-v3', 'true');
    const isHome = typeof window !== 'undefined' && (window.location.pathname === '/' || window.location.pathname === '/index.html');
    root.setAttribute('data-v3-home', isHome ? 'true' : 'false');
    syncThemeColor(next);
    setThemeState(next);
  }, []);

  useEffect(() => {
    const stored = readStoredTheme();
    const next = stored || 'light';
    applyTheme(next);
    setMounted(true);

    const mq = window.matchMedia?.('(prefers-color-scheme: light)');
    const onSystemChange = () => {
      if (!readStoredTheme()) applyTheme(systemTheme());
    };
    mq?.addEventListener?.('change', onSystemChange);

    return () => {
      mq?.removeEventListener?.('change', onSystemChange);
      clearTimeout(veilTimerRef.current);
      const root = document.documentElement;
      root.classList.remove('v3-theme-transition');
    };
  }, [applyTheme]);

  const flashVeil = useCallback(() => {
    const veil = veilRef.current;
    if (!veil) return;
    veil.classList.add('is-covering');
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        veil.classList.remove('is-covering');
      });
    });
    clearTimeout(veilTimerRef.current);
    veilTimerRef.current = setTimeout(() => {
      veil.classList.remove('is-covering');
    }, 360);
  }, []);

  const setTheme = useCallback(
    (next, event) => {
      const value = next === 'light' ? 'light' : 'dark';
      try {
        window.localStorage.setItem(STORAGE_KEY, value);
      } catch {}

      const root = document.documentElement;
      const reduceMotion =
        window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ||
        root.classList.contains('reduce-motion');

      if (reduceMotion) {
        applyTheme(value);
        return;
      }

      const supportsViewTransition = typeof document.startViewTransition === 'function';

      if (!supportsViewTransition) {
        applyTheme(value);
        flashVeil();
        return;
      }

      const x = event?.clientX ?? window.innerWidth - 72;
      const y = event?.clientY ?? window.innerHeight - 72;
      const radius = Math.hypot(
        Math.max(x, window.innerWidth - x),
        Math.max(y, window.innerHeight - y)
      );

      root.style.setProperty('--v3-theme-x', `${x}px`);
      root.style.setProperty('--v3-theme-y', `${y}px`);
      root.style.setProperty('--v3-theme-r', `${radius}px`);
      root.classList.add('v3-theme-transition');

      try {
        const transition = document.startViewTransition(() => applyTheme(value));
        transition.finished.finally(() => {
          root.classList.remove('v3-theme-transition');
        });
      } catch {
        root.classList.remove('v3-theme-transition');
        applyTheme(value);
        flashVeil();
      }
    },
    [applyTheme, flashVeil]
  );

  const toggleTheme = useCallback(
    (event) => {
      const current = document.documentElement.getAttribute('data-theme') || theme;
      setTheme(current === 'light' ? 'dark' : 'light', event);
    },
    [setTheme, theme]
  );

  return (
    <ThemeContext.Provider value={{ theme, mounted, toggleTheme, setTheme }}>
      <div ref={veilRef} className="v3-theme-veil" aria-hidden="true" />
      {children}
    </ThemeContext.Provider>
  );
}
