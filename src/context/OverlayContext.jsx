'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import useScrollLock from '@/hooks/useScrollLock';

const OverlayContext = createContext({
  activeOverlay: 'none',
  openOverlay: () => {},
  closeOverlay: () => {},
  closeAll: () => {},
  isOverlayOpen: () => false,
});

export function OverlayProvider({ children }) {
  const [activeOverlay, setActiveOverlay] = useState('none');

  // Unified body scroll lock: active whenever ANY overlay is open
  useScrollLock(activeOverlay !== 'none');

  const openOverlay = useCallback((name) => {
    setActiveOverlay(name);
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('portfolio-overlay-change', { detail: { active: name } }));
      // Also dispatch backwards-compatible mobile-nav-toggle event for legacy listeners
      window.dispatchEvent(new CustomEvent('mobile-nav-toggle', { detail: { open: name === 'nav' } }));
    }
  }, []);

  const closeOverlay = useCallback((name) => {
    setActiveOverlay((current) => {
      if (current === name) {
        if (typeof window !== 'undefined') {
          window.dispatchEvent(new CustomEvent('portfolio-overlay-change', { detail: { active: 'none' } }));
          if (name === 'nav') {
            window.dispatchEvent(new CustomEvent('mobile-nav-toggle', { detail: { open: false } }));
          }
        }
        return 'none';
      }
      return current;
    });
  }, []);

  const closeAll = useCallback(() => {
    setActiveOverlay('none');
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('portfolio-overlay-change', { detail: { active: 'none' } }));
      window.dispatchEvent(new CustomEvent('mobile-nav-toggle', { detail: { open: false } }));
    }
  }, []);

  const isOverlayOpen = useCallback((name) => activeOverlay === name, [activeOverlay]);

  // Synchronize state if external window event dispatched
  useEffect(() => {
    const handleOverlayEvent = (e) => {
      const active = e?.detail?.active;
      if (active && active !== activeOverlay) {
        setActiveOverlay(active);
      }
    };
    window.addEventListener('portfolio-overlay-change', handleOverlayEvent);
    return () => window.removeEventListener('portfolio-overlay-change', handleOverlayEvent);
  }, [activeOverlay]);

  // Handle global Escape key to close active overlay if open
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && activeOverlay !== 'none') {
        closeAll();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeOverlay, closeAll]);

  return (
    <OverlayContext.Provider
      value={{
        activeOverlay,
        openOverlay,
        closeOverlay,
        closeAll,
        isOverlayOpen,
      }}
    >
      {children}
    </OverlayContext.Provider>
  );
}

export function useOverlay() {
  const context = useContext(OverlayContext);
  if (!context) {
    throw new Error('useOverlay must be used within an OverlayProvider');
  }
  return context;
}
