'use client';

import React, { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react';
import { useTheme } from './ThemeProvider';

const SoundContext = createContext(null);

const OPT_IN_KEY = 'sks_sound_opt_in_v1';
const SETTINGS_KEY = 'sks_sound_settings_v1';

export function useSound() {
  return (
    useContext(SoundContext) || {
      optInStatus: 'off',
      soundOptIn: () => {},
      musicPlaying: false,
      toggleMusic: () => {},
      musicVolume: 0.25,
      setMusicVolume: () => {},
      effectsEnabled: true,
      toggleEffects: () => {},
      hapticsEnabled: true,
      toggleHaptics: () => {},
      masterMuted: false,
      toggleMasterMute: () => {},
      play: () => {},
      vibrate: () => {},
      engineReady: false,
      showCredits: false,
      setShowCredits: () => {},
      soundEnabled: true,
      ambientEnabled: false,
      toggleSound: () => {},
      toggleAmbient: () => {},
    }
  );
}

function canHover() {
  return (
    typeof window !== 'undefined' &&
    window.matchMedia?.('(hover: hover) and (pointer: fine)').matches
  );
}

function isReducedMotion() {
  return (
    typeof window !== 'undefined' &&
    window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
  );
}

export default function SoundProvider({ children }) {
  const { theme } = useTheme();

  // Opt-in state: 'pending' (show prompt), 'on' (enabled), 'off' (declined)
  const [optInStatus, setOptInStatus] = useState('pending');
  const [musicPlaying, setMusicPlaying] = useState(false);
  const [effectsEnabled, setEffectsEnabled] = useState(true);
  const [hapticsEnabled, setHapticsEnabled] = useState(true);
  const [masterMuted, setMasterMuted] = useState(false);
  const [musicVolume, setMusicVolumeState] = useState(0.25);
  const [engineReady, setEngineReady] = useState(false);
  const [showCredits, setShowCredits] = useState(false);

  const engineRef = useRef(null);
  const loadPromiseRef = useRef(null);
  const optInRef = useRef('pending');
  const musicPlayingRef = useRef(false);
  const effectsEnabledRef = useRef(true);
  const hapticsEnabledRef = useRef(true);
  const masterMutedRef = useRef(false);
  const musicVolumeRef = useRef(0.25);
  const themeRef = useRef(theme);
  const hoverAtRef = useRef(0);

  useEffect(() => {
    themeRef.current = theme;
    if (musicPlayingRef.current && engineRef.current) {
      engineRef.current.startAmbient(theme);
    }
  }, [theme]);

  // Lazy load audio engine only when needed
  const loadEngine = useCallback(() => {
    if (engineRef.current) return Promise.resolve(engineRef.current);
    if (loadPromiseRef.current) return loadPromiseRef.current;

    loadPromiseRef.current = import('./audio/engine')
      .then((mod) => {
        engineRef.current = mod;
        mod.setMasterMuted(masterMutedRef.current);
        mod.setSfxMuted(!effectsEnabledRef.current);
        mod.setMusicMuted(!musicPlayingRef.current);
        mod.setMusicVolume(musicVolumeRef.current);
        setEngineReady(true);
        return mod;
      })
      .catch(() => null);

    return loadPromiseRef.current;
  }, []);

  // Safe localStorage hydration
  useEffect(() => {
    try {
      const storedSettings = window.localStorage.getItem(SETTINGS_KEY);
      let parsedSettings = null;
      if (storedSettings) {
        try {
          parsedSettings = JSON.parse(storedSettings);
        } catch {}
      }

      const storedOptIn = window.localStorage.getItem(OPT_IN_KEY);
      if (storedOptIn === 'on' || storedOptIn === 'off') {
        setOptInStatus(storedOptIn);
        optInRef.current = storedOptIn;

        let playing = storedOptIn === 'on';
        if (parsedSettings && typeof parsedSettings.musicPlaying === 'boolean') {
          playing = storedOptIn === 'on' && parsedSettings.musicPlaying;
        }
        setMusicPlaying(playing);
        musicPlayingRef.current = playing;
      } else {
        setOptInStatus('pending');
        optInRef.current = 'pending';
      }

      if (parsedSettings) {
        if (typeof parsedSettings.effectsEnabled === 'boolean') {
          setEffectsEnabled(parsedSettings.effectsEnabled);
          effectsEnabledRef.current = parsedSettings.effectsEnabled;
        }
        if (typeof parsedSettings.hapticsEnabled === 'boolean') {
          setHapticsEnabled(parsedSettings.hapticsEnabled);
          hapticsEnabledRef.current = parsedSettings.hapticsEnabled;
        }
        if (typeof parsedSettings.masterMuted === 'boolean') {
          setMasterMuted(parsedSettings.masterMuted);
          masterMutedRef.current = parsedSettings.masterMuted;
        }
        if (typeof parsedSettings.musicVolume === 'number' && Number.isFinite(parsedSettings.musicVolume)) {
          const clamped = Math.max(0, Math.min(1, parsedSettings.musicVolume));
          setMusicVolumeState(clamped);
          musicVolumeRef.current = clamped;
        }
      }
    } catch {}
  }, []);

  // Synchronize across tabs via storage event (validating values)
  useEffect(() => {
    const onStorage = (e) => {
      if (e.key === OPT_IN_KEY && (e.newValue === 'on' || e.newValue === 'off')) {
        setOptInStatus(e.newValue);
        optInRef.current = e.newValue;
        const isOn = e.newValue === 'on';
        setMusicPlaying(isOn);
        musicPlayingRef.current = isOn;
        if (engineRef.current) {
          if (isOn) engineRef.current.startAmbient(themeRef.current);
          else engineRef.current.stopAmbient();
        }
      }
    };
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);

  // Unlock AudioContext on first user gesture if opted in, retaining listeners until opted-in gesture
  useEffect(() => {
    const onFirstGesture = () => {
      if (optInRef.current === 'on') {
        loadEngine().then((mod) => {
          if (!mod) return;
          mod.unlock();
          if (musicPlayingRef.current) {
            mod.startAmbient(themeRef.current);
          }
        });
        window.removeEventListener('pointerdown', onFirstGesture, true);
        window.removeEventListener('keydown', onFirstGesture, true);
      }
    };

    window.addEventListener('pointerdown', onFirstGesture, true);
    window.addEventListener('keydown', onFirstGesture, true);
    return () => {
      window.removeEventListener('pointerdown', onFirstGesture, true);
      window.removeEventListener('keydown', onFirstGesture, true);
    };
  }, [loadEngine]);

  // Tab visibility changes — pause on hidden, resume on active
  useEffect(() => {
    const onVisibility = () => {
      engineRef.current?.setPageHidden(document.visibilityState === 'hidden');
    };
    document.addEventListener('visibilitychange', onVisibility);
    return () => document.removeEventListener('visibilitychange', onVisibility);
  }, []);

  // Trigger Haptic Feedback through centralized gate
  const vibrate = useCallback((pattern = 'light') => {
    if (!hapticsEnabledRef.current || masterMutedRef.current || isReducedMotion()) return;
    engineRef.current?.triggerHaptic(pattern);
  }, []);

  // Play synthesized SFX
  const play = useCallback((kind) => {
    if (!effectsEnabledRef.current || masterMutedRef.current || optInRef.current === 'off') return;
    engineRef.current?.play(kind);
  }, []);

  // Handle opt-in choice
  const soundOptIn = useCallback(
    (choice) => {
      const isAccepted = choice === 'on';
      const status = isAccepted ? 'on' : 'off';
      setOptInStatus(status);
      optInRef.current = status;
      try {
        window.localStorage.setItem(OPT_IN_KEY, status);
      } catch {}

      if (isAccepted) {
        setMusicPlaying(true);
        musicPlayingRef.current = true;
        loadEngine().then((mod) => {
          if (!mod) return;
          mod.unlock();
          mod.setMasterMuted(false);
          mod.setSfxMuted(false);
          mod.setMusicMuted(false);
          mod.setMusicVolume(musicVolumeRef.current);
          mod.startAmbient(themeRef.current);
          mod.play('confirm');
          vibrate('confirm');
        });
      } else {
        setMusicPlaying(false);
        musicPlayingRef.current = false;
        engineRef.current?.stopAmbient();
      }
    },
    [loadEngine, vibrate]
  );

  // Toggle Music (Lofi background) — promotes to 'on' and persists musicPlaying
  const toggleMusic = useCallback(() => {
    const next = !musicPlayingRef.current;
    setMusicPlaying(next);
    musicPlayingRef.current = next;

    if (next) {
      if (optInRef.current !== 'on') {
        optInRef.current = 'on';
        setOptInStatus('on');
        try {
          window.localStorage.setItem(OPT_IN_KEY, 'on');
        } catch {}
      }

      loadEngine().then((mod) => {
        if (!mod) return;
        mod.unlock();
        mod.setMusicMuted(false);
        mod.setMusicVolume(musicVolumeRef.current);
        mod.startAmbient(themeRef.current);
        mod.play('toggle');
        vibrate('toggle');
      });
    } else {
      engineRef.current?.stopAmbient();
      engineRef.current?.play('toggle');
      vibrate('toggle');
    }

    try {
      const existing = JSON.parse(window.localStorage.getItem(SETTINGS_KEY) || '{}');
      window.localStorage.setItem(SETTINGS_KEY, JSON.stringify({ ...existing, musicPlaying: next }));
    } catch {}
  }, [loadEngine, vibrate]);

  // Toggle Sound Effects
  const toggleEffects = useCallback(() => {
    const next = !effectsEnabledRef.current;
    setEffectsEnabled(next);
    effectsEnabledRef.current = next;
    engineRef.current?.setSfxMuted(!next);
    if (next) {
      engineRef.current?.play('toggle');
      vibrate('toggle');
    }
    try {
      const existing = JSON.parse(window.localStorage.getItem(SETTINGS_KEY) || '{}');
      window.localStorage.setItem(SETTINGS_KEY, JSON.stringify({ ...existing, effectsEnabled: next }));
    } catch {}
  }, [vibrate]);

  // Toggle Haptics
  const toggleHaptics = useCallback(() => {
    const next = !hapticsEnabledRef.current;
    setHapticsEnabled(next);
    hapticsEnabledRef.current = next;
    if (next) {
      vibrate('confirm');
      engineRef.current?.play('toggle');
    }
    try {
      const existing = JSON.parse(window.localStorage.getItem(SETTINGS_KEY) || '{}');
      window.localStorage.setItem(SETTINGS_KEY, JSON.stringify({ ...existing, hapticsEnabled: next }));
    } catch {}
  }, [vibrate]);

  // Toggle Master Mute
  const toggleMasterMute = useCallback(() => {
    const next = !masterMutedRef.current;
    setMasterMuted(next);
    masterMutedRef.current = next;
    engineRef.current?.setMasterMuted(next);
    try {
      const existing = JSON.parse(window.localStorage.getItem(SETTINGS_KEY) || '{}');
      window.localStorage.setItem(SETTINGS_KEY, JSON.stringify({ ...existing, masterMuted: next }));
    } catch {}
  }, []);

  // Music Volume setter with finite check & clamping
  const setMusicVolume = useCallback((vol) => {
    const validVol = typeof vol === 'number' && Number.isFinite(vol) ? vol : 0.25;
    const clamped = Math.max(0, Math.min(1, validVol));
    setMusicVolumeState(clamped);
    musicVolumeRef.current = clamped;
    engineRef.current?.setMusicVolume(clamped);
    try {
      const existing = JSON.parse(window.localStorage.getItem(SETTINGS_KEY) || '{}');
      window.localStorage.setItem(SETTINGS_KEY, JSON.stringify({ ...existing, musicVolume: clamped }));
    } catch {}
  }, []);

  // Global Event Delegation for clicks, links, buttons, and haptics
  useEffect(() => {
    const onClick = (event) => {
      if (!event.isTrusted) return;
      if (optInRef.current === 'off') return;

      const target = event.target instanceof Element ? event.target : null;
      if (!target) return;

      // Skip silent elements and form typing inputs
      if (target.closest('input, textarea, select, [contenteditable="true"], [data-v3-silent], [data-sound="none"]')) {
        return;
      }

      // Explicit data-sound & data-haptic
      const customSoundEl = target.closest('[data-sound], [data-v3-sound]');
      const customHapticEl = target.closest('[data-haptic]');

      const soundKind = customSoundEl
        ? customSoundEl.getAttribute('data-sound') || customSoundEl.getAttribute('data-v3-sound')
        : null;
      const hapticPattern = customHapticEl
        ? customHapticEl.getAttribute('data-haptic')
        : null;

      // Theme toggle specific sound
      if (target.closest('[aria-label*="theme"], .theme-toggle, .nav-theme-toggle-btn')) {
        const nextTheme = themeRef.current === 'dark' ? 'light' : 'dark';
        if (effectsEnabledRef.current && !masterMutedRef.current) {
          engineRef.current?.play(nextTheme === 'light' ? 'theme-light' : 'theme-dark');
        }
        if (hapticsEnabledRef.current && !masterMutedRef.current && !isReducedMotion()) {
          vibrate('toggle');
        }
        return;
      }

      // Copy buttons
      if (target.closest('[data-copy], .copy-btn, button[aria-label*="copy" i]')) {
        if (effectsEnabledRef.current && !masterMutedRef.current) {
          engineRef.current?.play('copy-success');
        }
        if (hapticsEnabledRef.current && !masterMutedRef.current && !isReducedMotion()) {
          vibrate('success');
        }
        return;
      }

      // Navigation links
      if (target.closest('nav a, .sn-nav-link, .nav-cta, a[href^="/"]')) {
        if (effectsEnabledRef.current && !masterMutedRef.current) {
          engineRef.current?.play(soundKind || 'nav');
        }
        if (hapticsEnabledRef.current && !masterMutedRef.current && !isReducedMotion()) {
          vibrate(hapticPattern || 'light');
        }
        return;
      }

      // General interactive buttons, cards, tabs
      if (target.closest('a, button, [role="button"], summary, [role="tab"], .v3-project-card, .v3-cert-card')) {
        if (effectsEnabledRef.current && !masterMutedRef.current) {
          engineRef.current?.play(soundKind || 'tick');
        }
        if (hapticsEnabledRef.current && !masterMutedRef.current && !isReducedMotion()) {
          vibrate(hapticPattern || 'light');
        }
      }
    };

    // Fine-pointer hover (ultra faint, rate-limited)
    const onPointerOver = (event) => {
      if (!effectsEnabledRef.current || masterMutedRef.current || optInRef.current === 'off' || !canHover()) return;
      const target = event.target instanceof Element ? event.target : null;
      if (!target || target.closest('[data-v3-silent], [data-sound="none"]')) return;
      if (!target.closest('a, button, [role="button"], summary')) return;

      const now = performance.now();
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
  }, [vibrate]);

  return (
    <SoundContext.Provider
      value={{
        optInStatus,
        soundOptIn,
        musicPlaying,
        toggleMusic,
        musicVolume,
        setMusicVolume,
        effectsEnabled,
        toggleEffects,
        hapticsEnabled,
        toggleHaptics,
        masterMuted,
        toggleMasterMute,
        play,
        vibrate,
        engineReady,
        showCredits,
        setShowCredits,
        soundEnabled: effectsEnabled,
        ambientEnabled: musicPlaying,
        toggleSound: toggleEffects,
        toggleAmbient: toggleMusic,
      }}
    >
      {children}
    </SoundContext.Provider>
  );
}
