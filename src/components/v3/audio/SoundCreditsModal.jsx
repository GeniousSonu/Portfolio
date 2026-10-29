'use client';

import React, { useEffect, useRef } from 'react';
import { useSound } from '../SoundProvider';

export default function SoundCreditsModal() {
  const { showCredits, setShowCredits } = useSound();
  const modalRef = useRef(null);
  const previousFocusRef = useRef(null);

  useEffect(() => {
    if (!showCredits) return;

    previousFocusRef.current = document.activeElement;
    modalRef.current?.focus();

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        setShowCredits(false);
        return;
      }

      // Trap focus within modal dialog
      if (e.key === 'Tab' && modalRef.current) {
        const focusables = modalRef.current.querySelectorAll(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        if (focusables.length === 0) return;

        const first = focusables[0];
        const last = focusables[focusables.length - 1];

        if (e.shiftKey) {
          if (document.activeElement === first || document.activeElement === modalRef.current) {
            e.preventDefault();
            last.focus();
          }
        } else {
          if (document.activeElement === last) {
            e.preventDefault();
            first.focus();
          }
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      if (previousFocusRef.current && typeof previousFocusRef.current.focus === 'function') {
        previousFocusRef.current.focus();
      }
    };
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
        tabIndex={-1}
        ref={modalRef}
        onClick={(e) => e.stopPropagation()}
        style={{ outline: 'none' }}
      >
        <div className="sn-sound-modal-header">
          <div>
            <h3 className="sn-modal-title">Audio &amp; Sound Credits</h3>
            <p className="sn-modal-subtitle">Creative Commons &amp; Permissively Licensed Assets</p>
          </div>
          <button
            type="button"
            className="sn-modal-close-btn"
            onClick={() => setShowCredits(false)}
            aria-label="Close audio credits"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
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
            <h4 className="sn-credits-heading">Interactive Sound Effects &amp; Synthesis</h4>
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
