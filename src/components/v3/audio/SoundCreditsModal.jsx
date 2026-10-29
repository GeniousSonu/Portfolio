'use client';

import React, { useEffect, useRef } from 'react';
import { useSound } from '../SoundProvider';

export default function SoundCreditsModal() {
  const { showCredits, setShowCredits } = useSound();
  const modalRef = useRef(null);

  useEffect(() => {
    if (!showCredits) return;
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        setShowCredits(false);
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [showCredits, setShowCredits]);

  if (!showCredits) return null;

  return (
    <div
      className="sn-sound-modal-backdrop"
      onClick={() => setShowCredits(false)}
      role="presentation"
    >
      <div
        className="sn-sound-modal-card"
        role="dialog"
        aria-modal="true"
        aria-label="Audio Licensing & Credits"
        ref={modalRef}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="sn-sound-modal-header">
          <div>
            <h3 className="sn-modal-title">Audio & Sound Credits</h3>
            <p className="sn-modal-subtitle">Creative Commons & Permissively Licensed Assets</p>
          </div>
          <button
            type="button"
            className="sn-modal-close-btn"
            onClick={() => setShowCredits(false)}
            aria-label="Close audio credits"
          >
            ✕
          </button>
        </div>

        <div className="sn-sound-modal-body">
          <section className="sn-credits-section">
            <h4 className="sn-credits-heading">Lofi Background Stream</h4>
            <div className="sn-track-item">
              <span className="sn-track-name">Morning Coffee (Day Mode)</span>
              <span className="sn-track-meta">By LuKremBo • Creative Commons Attribution 4.0 (CC BY 4.0)</span>
            </div>
            <div className="sn-track-item">
              <span className="sn-track-name">Night City Breeze (Night Mode)</span>
              <span className="sn-track-meta">By Purrple Cat • Creative Commons Attribution-ShareAlike 4.0 (CC BY-SA 4.0)</span>
            </div>
            <div className="sn-track-item">
              <span className="sn-track-name">Silent Waves (Ambient Drone)</span>
              <span className="sn-track-meta">By HoliznaCC0 • Creative Commons Zero (CC0 1.0 Universal)</span>
            </div>
          </section>

          <section className="sn-credits-section">
            <h4 className="sn-credits-heading">Interactive Sound Effects & Synthesis</h4>
            <p className="sn-credits-text">
              All UI clicks, chimes, swell effects, and tactile sound design are synthesized dynamically in real-time using the native HTML5 Web Audio API. 100% zero external audio files, zero network bandwidth, and zero tracking.
            </p>
          </section>
        </div>

        <div className="sn-sound-modal-footer">
          <button
            type="button"
            className="sn-modal-done-btn"
            onClick={() => setShowCredits(false)}
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
}
