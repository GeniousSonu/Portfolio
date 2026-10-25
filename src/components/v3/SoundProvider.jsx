'use client';

import React, { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react';
import { useTheme } from './ThemeProvider';

const SoundContext = createContext(null);
const SOUND_KEY = 'v3-sound';

export function useSound() {
  return (
    useContext(SoundContext) || {
      soundEnabled: true,
      ambientEnabled: false,
      toggleSound: () => {},
      toggleAmbient: () => {},
      play: () => {},
      engineReady: false,
    }
  );
}

function canHover() {
  return (
    typeof window !== 'undefined' &&
    window.matchMedia?.('(hover: hover) and (pointer: fine)').matches
  );
}

export default function SoundProvider({ children }) {
  const { theme } = useTheme();
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [ambientEnabled, setAmbientEnabled] = useState(false);
  const [engineReady, setEngineReady] = useState(false);

  const engineRef = useRef(null);
  const loadPromiseRef = useRef(null);
  const soundEnabledRef = useRef(true);
  const ambientEnabledRef = useRef(false);
  const themeRef = useRef(theme);
  const hoverAtRef = useRef(0);

  useEffect(() => {
    themeRef.current = theme;
  }, [theme]);

  const loadEngine = useCallback(() => {
    if (engineRef.current) return Promise.resolve(engineRef.current);
    if (loadPromiseRef.current) return loadPromiseRef.current;

    loadPromiseRef.current = import('./audio/engine')
      .then((mod) => {
        engineRef.current = mod;
        mod.setMuted(!soundEnabledRef.current);
        setEngineReady(true);
        return mod;
      })
      .catch(() => null);

    return loadPromiseRef.current;
  }, []);

  useEffect(() => {
    let stored = 'on';
    try {
      stored = window.localStorage.getItem(SOUND_KEY) || 'on';
    } catch {}
    const enabled = stored !== 'off';
    setSoundEnabled(enabled);
    soundEnabledRef.current = enabled;

    let idleId = null;
    const preload = () => {
      loadEngine();
    };
    if ('requestIdleCallback' in window) {
      idleId = window.requestIdleCallback(preload, { timeout: 2500 });
    } else {
      idleId = window.setTimeout(preload, 1400);
    }

    return () => {
      if (idleId !== null) {
        if ('cancelIdleCallback' in window) window.cancelIdleCallback(idleId);
        else clearTimeout(idleId);
      }
    };
  }, [loadEngine]);

  useEffect(() => {
    const unlockAudio = () => {
      loadEngine().then((mod) => {
        if (!mod) return;
        mod.unlock();
        mod.setMuted(!soundEnabledRef.current);
      });
    };
    const onFirstGesture = () => {
      unlockAudio();
      window.removeEventListener('pointerdown', onFirstGesture, true);
      window.removeEventListener('keydown', onFirstGesture, true);
    };
    window.addEventListener('pointerdown', onFirstGesture, true);
    window.addEventListener('keydown', onFirstGesture, true);
    return () => {
      window.removeEventListener('pointerdown', onFirstGesture, true);
      window.removeEventListener('keydown', onFirstGesture, true);
    };
  }, [loadEngine]);

  useEffect(() => {
    const onClick = (event) => {
      if (!soundEnabledRef.current) return;
      const target = event.target instanceof Element ? event.target : null;
      if (!target) return;
      if (target.closest('input, textarea, select, [contenteditable="true"], [data-v3-silent]')) {
        return;
      }
      const custom = target.closest('[data-v3-sound]');
      if (custom) {
        const kind = custom.getAttribute('data-v3-sound') || 'tick';
        if (kind === 'none') return;
        engineRef.current?.play(kind);
        return;
      }
      if (target.closest('a, button, [role="button"], summary')) {
        engineRef.current?.play('tick');
      }
    };

    const onPointerOver = (event) => {
      if (!soundEnabledRef.current || !canHover()) return;
      const target = event.target instanceof Element ? event.target : null;
      if (!target || target.closest('[data-v3-silent]')) return;
      if (!target.closest('a, button, [role="button"], summary')) return;
      const now = Date.now();
      if (now - hoverAtRef.current < 90) return;
      hoverAtRef.current = now;
      engineRef.current?.play('hover');
    };

    document.addEventListener('click', onClick, true);
    document.addEventListener('mouseover', onPointerOver, true);
    return () => {
      document.removeEventListener('click', onClick, true);
      document.removeEventListener('mouseover', onPointerOver, true);
    };
  }, []);

  useEffect(() => {
    if (!ambientEnabledRef.current || !engineRef.current) return;
    if (ambientEnabled) engineRef.current.startAmbient(theme);
  }, [theme, ambientEnabled]);

  useEffect(() => {
    const onVisibility = () => {
      engineRef.current?.setPageHidden(document.visibilityState === 'hidden');
    };
    document.addEventListener('visibilitychange', onVisibility);
    return () => document.removeEventListener('visibilitychange', onVisibility);
  }, []);

  useEffect(
    () => () => {
      engineRef.current?.stopAmbient();
    },
    []
  );

  const play = useCallback((kind) => {
    if (!soundEnabledRef.current) return;
    engineRef.current?.play(kind);
  }, []);

  const toggleSound = useCallback(() => {
    const next = !soundEnabledRef.current;
    soundEnabledRef.current = next;
    setSoundEnabled(next);
    try {
      window.localStorage.setItem(SOUND_KEY, next ? 'on' : 'off');
    } catch {}

    if (next) {
      loadEngine().then((mod) => {
        if (!mod) return;
        mod.unlock();
        mod.setMuted(false);
        mod.play('confirm');
      });
    } else {
      const mod = engineRef.current;
      if (mod) {
        mod.play('confirm');
        window.setTimeout(() => mod.setMuted(true), 130);
      }
    }
  }, [loadEngine]);

  const toggleAmbient = useCallback(() => {
    const next = !ambientEnabledRef.current;

    if (!next) {
      ambientEnabledRef.current = false;
      setAmbientEnabled(false);
      engineRef.current?.stopAmbient();
      return;
    }

    ambientEnabledRef.current = true;
    setAmbientEnabled(true);
    loadEngine().then((mod) => {
      if (!mod) return;
      mod.unlock();
      mod.startAmbient(themeRef.current);
    });
  }, [loadEngine]);

  return (
    <SoundContext.Provider
      value={{
        soundEnabled,
        ambientEnabled,
        toggleSound,
        toggleAmbient,
        play,
        engineReady,
      }}
    >
      {children}
    </SoundContext.Provider>
  );
}
