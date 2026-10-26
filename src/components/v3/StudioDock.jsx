'use client';

import React, { useEffect, useRef, useState } from 'react';
import { useTheme } from './ThemeProvider';
import { useSound } from './SoundProvider';

function SunIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      aria-hidden="true"
    >
      <circle cx="12" cy="12" r="4.2" />
      <path d="M12 2.4v2.2M12 19.4v2.2M2.4 12h2.2M19.4 12h2.2M5.2 5.2l1.6 1.6M17.2 17.2l1.6 1.6M18.8 5.2l-1.6 1.6M6.8 17.2l-1.6 1.6" />
    </svg>
  );
}

function MoonIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M20.1 14.2A8.2 8.2 0 0 1 9.8 3.9 8.2 8.2 0 1 0 20.1 14.2Z" />
      <path d="M17.2 4.3v2.4M16 5.5h2.4" />
    </svg>
  );
}

function SoundIcon({ off }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M4 9.5v5h3.4L12 18.6V5.4L7.4 9.5H4Z" />
      {off ? (
        <path d="M16 9.5l5 5M21 9.5l-5 5" />
      ) : (
        <>
          <path d="M15.6 9.2a4 4 0 0 1 0 5.6" />
          <path d="M18.2 6.8a7.4 7.4 0 0 1 0 10.4" />
        </>
      )}
    </svg>
  );
}

function MusicIcon({ off }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M9 18.2V6.4l10-2.2v11.6" />
      <circle cx="6.4" cy="18.4" r="2.6" />
      <circle cx="16.4" cy="15.8" r="2.6" />
      {off ? <path d="M4 4l16 16" /> : null}
    </svg>
  );
}

export default function StudioDock() {
  const { theme, toggleTheme } = useTheme();
  const { soundEnabled, ambientEnabled, toggleSound, toggleAmbient } = useSound();
  const [collapsed, setCollapsed] = useState(false);
  const timerRef = useRef(0);

  const scheduleCollapse = (ms) => {
    window.clearTimeout(timerRef.current);
    timerRef.current = window.setTimeout(() => setCollapsed(true), ms);
  };
  const wake = () => {
    window.clearTimeout(timerRef.current);
    setCollapsed(false);
  };

  useEffect(() => {
    scheduleCollapse(6000);
    return () => window.clearTimeout(timerRef.current);
  }, []);

  return (
    <aside
      className={`v3-studio ${collapsed ? 'is-collapsed' : ''}`}
      aria-label="Studio controls"
      onPointerEnter={wake}
      onPointerLeave={() => scheduleCollapse(1600)}
      onFocus={wake}
      onBlur={() => scheduleCollapse(1200)}
    >
      <span className="v3-studio-label" aria-hidden="true">
        Studio
      </span>
      <div className="v3-studio-buttons">
        <button
          type="button"
          className="v3-studio-btn v3-studio-theme"
          onClick={toggleTheme}
          data-v3-sound="confirm"
          aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} theme`}
          title={`Switch to ${theme === 'light' ? 'Night Signal' : 'Sunday Studio'} theme`}
        >
          <span className="v3-studio-icon v3-studio-icon--sun">
            <SunIcon />
          </span>
          <span className="v3-studio-icon v3-studio-icon--moon">
            <MoonIcon />
          </span>
          <span className="v3-studio-text">Theme</span>
        </button>

        <button
          type="button"
          className={`v3-studio-btn ${soundEnabled ? 'is-on' : 'is-off'}`}
          onClick={toggleSound}
          data-v3-silent
          aria-pressed={soundEnabled}
          aria-label={soundEnabled ? 'Turn interface sounds off' : 'Turn interface sounds on'}
          title={soundEnabled ? 'Interface sounds: on' : 'Interface sounds: off'}
        >
          <span className="v3-studio-icon">
            <SoundIcon off={!soundEnabled} />
          </span>
          <span className="v3-studio-text">Sound</span>
        </button>

        <button
          type="button"
          className={`v3-studio-btn ${ambientEnabled ? 'is-on' : 'is-off'}`}
          onClick={toggleAmbient}
          data-v3-silent
          aria-pressed={ambientEnabled}
          aria-label={ambientEnabled ? 'Stop ambient music' : 'Start ambient music'}
          title={ambientEnabled ? 'Ambient music: playing' : 'Ambient music: off'}
        >
          <span className="v3-studio-icon">
            <MusicIcon off={!ambientEnabled} />
          </span>
          <span className="v3-studio-text">{ambientEnabled ? 'Ambient on' : 'Ambient'}</span>
        </button>
      </div>
    </aside>
  );
}
