'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useSound } from '../SoundProvider';

export default function SoundFeelControl() {
  const {
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
    setShowCredits,
  } = useSound();

  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef(null);
  const buttonRef = useRef(null);

  // Close on Escape or click outside
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        setIsOpen(false);
        buttonRef.current?.focus();
      }
    };
    const handleClickOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('pointerdown', handleClickOutside);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('pointerdown', handleClickOutside);
    };
  }, [isOpen]);

  const isAudioActive = musicPlaying && !masterMuted;

  return (
    <div className="sn-sound-control-wrapper" ref={containerRef}>
      <button
        ref={buttonRef}
        type="button"
        className={`sn-sound-btn ${isAudioActive ? 'is-playing' : ''} ${masterMuted ? 'is-muted' : ''}`}
        onClick={() => setIsOpen((prev) => !prev)}
        aria-label="Sound and Feel controls"
        aria-expanded={isOpen}
        aria-haspopup="dialog"
        title={isAudioActive ? 'Lofi Music: Playing (Click for controls)' : 'Sound & Music Controls'}
        data-sound="none"
      >
        <span className="sn-equalizer-bars" aria-hidden="true">
          <span className="sn-eq-bar bar-1" />
          <span className="sn-eq-bar bar-2" />
          <span className="sn-eq-bar bar-3" />
          <span className="sn-eq-bar bar-4" />
        </span>
      </button>

      {isOpen && (
        <div
          className="sn-sound-popover"
          role="dialog"
          aria-label="Sound and Haptic Settings"
        >
          <div className="sn-sound-popover-header">
            <div className="sn-sound-title-row">
              <span className="sn-sound-title">Sound & Feel</span>
              <span className={`sn-sound-badge ${isAudioActive ? 'badge-active' : 'badge-idle'}`}>
                {masterMuted ? 'Muted' : isAudioActive ? 'Lofi Active' : 'Idle'}
              </span>
            </div>
            <p className="sn-sound-subtitle">Immersive background lofi & tactile feedback</p>
          </div>

          <div className="sn-sound-popover-body">
            {/* Lofi Music Play/Pause */}
            <div className="sn-sound-row">
              <div className="sn-sound-label-group">
                <span className="sn-row-label">Lofi Ambient</span>
                <span className="sn-row-desc">Warm Rhodes & tape saturation</span>
              </div>
              <button
                type="button"
                className={`sn-toggle-btn ${musicPlaying ? 'is-on' : 'is-off'}`}
                onClick={toggleMusic}
                aria-pressed={musicPlaying}
              >
                {musicPlaying ? 'Playing' : 'Paused'}
              </button>
            </div>

            {/* Music Volume Slider */}
            {musicPlaying && (
              <div className="sn-volume-row">
                <span className="sn-volume-label">Music Volume</span>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.05"
                  value={musicVolume}
                  onChange={(e) => setMusicVolume(parseFloat(e.target.value))}
                  aria-label="Music volume"
                  className="sn-volume-slider"
                />
                <span className="sn-volume-val">{Math.round(musicVolume * 100)}%</span>
              </div>
            )}

            {/* Sound Effects Toggle */}
            <div className="sn-sound-row">
              <div className="sn-sound-label-group">
                <span className="sn-row-label">Interface Sounds</span>
                <span className="sn-row-desc">Tactile clicks, swells & chimes</span>
              </div>
              <button
                type="button"
                className={`sn-toggle-btn ${effectsEnabled ? 'is-on' : 'is-off'}`}
                onClick={toggleEffects}
                aria-pressed={effectsEnabled}
              >
                {effectsEnabled ? 'On' : 'Off'}
              </button>
            </div>

            {/* Haptics Toggle */}
            <div className="sn-sound-row">
              <div className="sn-sound-label-group">
                <span className="sn-row-label">Haptic Feedback</span>
                <span className="sn-row-desc">Subtle tap vibration on mobile</span>
              </div>
              <button
                type="button"
                className={`sn-toggle-btn ${hapticsEnabled ? 'is-on' : 'is-off'}`}
                onClick={toggleHaptics}
                aria-pressed={hapticsEnabled}
              >
                {hapticsEnabled ? 'On' : 'Off'}
              </button>
            </div>

            {/* Master Mute Button */}
            <div className="sn-sound-actions">
              <button
                type="button"
                className={`sn-mute-all-btn ${masterMuted ? 'is-muted' : ''}`}
                onClick={toggleMasterMute}
                aria-pressed={masterMuted}
              >
                {masterMuted ? 'Unmute Audio' : 'Mute All'}
              </button>

              <button
                type="button"
                className="sn-credits-link-btn"
                onClick={() => {
                  setIsOpen(false);
                  setShowCredits(true);
                }}
              >
                Licenses & Credits
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
