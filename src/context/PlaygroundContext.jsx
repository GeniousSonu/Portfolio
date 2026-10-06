'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

const PlaygroundContext = createContext();

export function PlaygroundProvider({ children }) {
  const [isPlaygroundActive, setIsPlaygroundActive] = useState(false);
  const [isDesktop, setIsDesktop] = useState(true);

  useEffect(() => {
    const checkDesktop = () => setIsDesktop(window.innerWidth > 1024);
    checkDesktop();
    window.addEventListener('resize', checkDesktop);
    return () => window.removeEventListener('resize', checkDesktop);
  }, []);

  const togglePlayground = () => {
    if (isDesktop) {
      setIsPlaygroundActive((prev) => !prev);
    }
  };

  // Auto-disable if window resizes to mobile
  useEffect(() => {
    if (!isDesktop && isPlaygroundActive) {
      setIsPlaygroundActive(false);
    }
  }, [isDesktop, isPlaygroundActive]);

  return (
    <PlaygroundContext.Provider
      value={{
        isPlaygroundActive,
        togglePlayground,
        isDesktop,
      }}
    >
      {children}
    </PlaygroundContext.Provider>
  );
}

export function usePlayground() {
  const context = useContext(PlaygroundContext);
  if (context === undefined) {
    throw new Error('usePlayground must be used within a PlaygroundProvider');
  }
  return context;
}
