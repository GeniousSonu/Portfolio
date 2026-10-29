'use client';

import React, { useState, useEffect } from 'react';
import { useSound } from '../SoundProvider';

export default function SoundOptInPrompt() {
  const { optInStatus, soundOptIn } = useSound();
  const [mounted, setMounted] = useState(false);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Show prompt after a short delay (1.5s) to avoid layout clutter on initial render
    const timer = setTimeout(() => {
      if (optInStatus === 'pending') {
        setVisible(true);
      }
    }, 1500);
    return () => clearTimeout(timer);
  }, [optInStatus]);

  if (!mounted || optInStatus !== 'pending' || !visible) {
    return null;
  }

  return (
    <aside
      className="sn-sound-optin-banner"
      role="region"
      aria-label="Sound and Music Opt-in"
    >
      <div className="sn-optin-content">
        <div className="sn-optin-icon" aria-hidden="true">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M3 18v-6a9 9 0 0 1 18 0v6" />
            <path d="M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3zM3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3z" />
          </svg>
        </div>
        <div className="sn-optin-text">
          <span className="sn-optin-title">Turn on lofi & sounds?</span>
          <span className="sn-optin-desc">Relaxing ambient music & tactile clicks</span>
        </div>
      </div>

      <div className="sn-optin-actions">
        <button
          type="button"
          className="sn-optin-btn sn-optin-on"
          onClick={() => soundOptIn('on')}
          aria-label="Turn on lofi and sounds"
          data-sound="confirm"
          data-haptic="confirm"
        >
          Turn On
        </button>
        <button
          type="button"
          className="sn-optin-btn sn-optin-off"
          onClick={() => soundOptIn('off')}
          aria-label="Keep sounds off"
          data-sound="none"
        >
          Off
        </button>
      </div>
    </aside>
  );
}
