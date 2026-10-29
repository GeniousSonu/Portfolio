'use client';

import React, { useState } from 'react';
import { useTheme } from '@/components/v3/ThemeProvider';
import { useSound } from '@/components/v3/SoundProvider';

const SHORTLIST = [
  {
    id: 'track-1',
    title: 'Morning Coffee',
    artist: 'LuKremBo',
    bpm: '76 BPM',
    mood: 'Bright, cheerful morning with warm Rhodes & acoustic guitar',
    bestFor: 'Day Mode (Light Theme)',
    license: 'CC BY 4.0',
    licenseUrl: 'https://creativecommons.org/licenses/by/4.0/',
    duration: '2:15',
    loudness: '-18.5 LUFS',
  },
  {
    id: 'track-2',
    title: 'Night City Breeze',
    artist: 'Purrple Cat',
    bpm: '70 BPM',
    mood: 'Moody late-night coding with tape hiss, sub bass & vinyl rain',
    bestFor: 'Night Mode (Dark Theme)',
    license: 'CC BY-SA 4.0',
    licenseUrl: 'https://creativecommons.org/licenses/by-sa/4.0/',
    duration: '2:40',
    loudness: '-19.2 LUFS',
  },
  {
    id: 'track-3',
    title: 'Silent Waves',
    artist: 'HoliznaCC0',
    bpm: '65 BPM',
    mood: 'Minimalist ambient lofi guitar with soft room tone',
    bestFor: 'Universal / Public Domain (CC0)',
    license: 'CC0 1.0 (Public Domain)',
    licenseUrl: 'https://creativecommons.org/publicdomain/zero/1.0/',
    duration: '3:05',
    loudness: '-18.8 LUFS',
  },
  {
    id: 'track-4',
    title: 'Cozy Sunday',
    artist: 'Ghostrifter Official',
    bpm: '74 BPM',
    mood: 'Gentle upright piano loop with brushed percussion',
    bestFor: 'Universal Focus',
    license: 'CC BY-SA 3.0',
    licenseUrl: 'https://creativecommons.org/licenses/by-sa/3.0/',
    duration: '2:30',
    loudness: '-18.4 LUFS',
  },
  {
    id: 'track-5',
    title: 'Lofi Study Session',
    artist: 'FASSounds',
    bpm: '72 BPM',
    mood: 'Dusty vinyl Rhodes with warm acoustic bass sway',
    bestFor: 'Day / Light Focus',
    license: 'Pixabay Content License (Free Commercial Web)',
    licenseUrl: 'https://pixabay.com/service/license-summary/',
    duration: '2:20',
    loudness: '-19.0 LUFS',
  },
  {
    id: 'track-6',
    title: 'Dreamy Night',
    artist: 'Meydan',
    bpm: '75 BPM',
    mood: 'Warm atmospheric pads and gentle kick-snare heartbeat',
    bestFor: 'Night / Dark Focus',
    license: 'CC BY 4.0',
    licenseUrl: 'https://creativecommons.org/licenses/by/4.0/',
    duration: '3:12',
    loudness: '-18.7 LUFS',
  },
];

function PlayIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <polygon points="5 3 19 12 5 21 5 3" />
    </svg>
  );
}

function StopIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <rect x="4" y="4" width="16" height="16" rx="2" />
    </svg>
  );
}

export default function SoundAuditionClient() {
  const { theme, toggleTheme } = useTheme();
  const { play, vibrate, toggleMusic, musicPlaying } = useSound();
  const [activeTrack, setActiveTrack] = useState('track-1');

  const handleTestSfx = (kind, haptic) => {
    play(kind);
    vibrate(haptic);
  };

  const handleToggleAudition = (trackId) => {
    setActiveTrack(trackId);
    toggleMusic();
  };

  return (
    <main
      className="sn-audition-page"
      style={{
        minHeight: '100svh',
        padding: '120px 24px 80px',
        maxWidth: '1000px',
        margin: '0 auto',
      }}
    >
      <header style={{ marginBottom: '40px' }}>
        <div
          style={{
            display: 'inline-block',
            padding: '4px 12px',
            borderRadius: '100px',
            background: 'var(--sn-surface-2)',
            border: '1px solid var(--sn-card-border)',
            fontSize: '12px',
            fontWeight: '600',
            letterSpacing: '0.05em',
            color: 'var(--sn-text-secondary)',
            marginBottom: '12px',
          }}
        >
          INTERNAL AUDITION ROOM • TASK SOUND-FEEL-001
        </div>
        <h1
          style={{
            fontSize: 'clamp(2rem, 4vw, 3rem)',
            fontWeight: '800',
            letterSpacing: '-0.02em',
            color: 'var(--sn-text-primary)',
            marginBottom: '12px',
          }}
        >
          Lofi Music &amp; Sound Sourcing Lab
        </h1>
        <p
          style={{
            fontSize: '1.05rem',
            color: 'var(--sn-text-secondary)',
            maxWidth: '680px',
            lineHeight: '1.6',
          }}
        >
          Audition the 6 shortlisted lofi tracks in both Light and Dark themes. Test how interactive tactile clicks and haptics sound over the background bed.
        </p>

        <div style={{ display: 'flex', gap: '16px', alignItems: 'center', marginTop: '24px' }}>
          <button
            type="button"
            onClick={toggleTheme}
            style={{
              padding: '10px 20px',
              borderRadius: '8px',
              background: 'var(--sn-surface-2)',
              border: '1px solid var(--sn-card-border)',
              color: 'var(--sn-text-primary)',
              cursor: 'pointer',
              fontWeight: '600',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
            }}
          >
            <span>
              Current Theme: <strong>{theme === 'dark' ? 'Night (Dark)' : 'Day (Light)'}</strong>
            </span>
            <span>(Click to toggle)</span>
          </button>
        </div>
      </header>

      {/* SFX Sandbox */}
      <section
        style={{
          padding: '24px',
          borderRadius: '16px',
          background: 'var(--sn-surface-1)',
          border: '1px solid var(--sn-card-border)',
          marginBottom: '40px',
        }}
      >
        <h2 style={{ fontSize: '1.2rem', fontWeight: '700', color: 'var(--sn-text-primary)', marginBottom: '16px' }}>
          Tactile SFX &amp; Haptic Sandbox
        </h2>
        <p style={{ fontSize: '0.9rem', color: 'var(--sn-text-secondary)', marginBottom: '16px' }}>
          Click below to test each synthesized sound effect and ducking response:
        </p>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px' }}>
          <button
            type="button"
            onClick={() => handleTestSfx('tick', 'light')}
            style={{
              padding: '8px 16px',
              borderRadius: '6px',
              background: 'var(--sn-surface-2)',
              border: '1px solid var(--sn-card-border)',
              color: 'var(--sn-text-primary)',
              cursor: 'pointer',
            }}
          >
            Primary Click (tick)
          </button>
          <button
            type="button"
            onClick={() => handleTestSfx('nav', 'light')}
            style={{
              padding: '8px 16px',
              borderRadius: '6px',
              background: 'var(--sn-surface-2)',
              border: '1px solid var(--sn-card-border)',
              color: 'var(--sn-text-primary)',
              cursor: 'pointer',
            }}
          >
            Navigation Slide (nav)
          </button>
          <button
            type="button"
            onClick={() => handleTestSfx('toggle', 'toggle')}
            style={{
              padding: '8px 16px',
              borderRadius: '6px',
              background: 'var(--sn-surface-2)',
              border: '1px solid var(--sn-card-border)',
              color: 'var(--sn-text-primary)',
              cursor: 'pointer',
            }}
          >
            Toggle Snap (toggle)
          </button>
          <button
            type="button"
            onClick={() => handleTestSfx('confirm', 'confirm')}
            style={{
              padding: '8px 16px',
              borderRadius: '6px',
              background: 'var(--sn-surface-2)',
              border: '1px solid var(--sn-card-border)',
              color: 'var(--sn-text-primary)',
              cursor: 'pointer',
            }}
          >
            Warm Bell (confirm)
          </button>
          <button
            type="button"
            onClick={() => handleTestSfx('copy-success', 'success')}
            style={{
              padding: '8px 16px',
              borderRadius: '6px',
              background: 'var(--sn-surface-2)',
              border: '1px solid var(--sn-card-border)',
              color: 'var(--sn-text-primary)',
              cursor: 'pointer',
            }}
          >
            Copy Chime (success)
          </button>
          <button
            type="button"
            onClick={() => handleTestSfx('chapter', 'none')}
            style={{
              padding: '8px 16px',
              borderRadius: '6px',
              background: 'var(--sn-surface-2)',
              border: '1px solid var(--sn-card-border)',
              color: 'var(--sn-text-primary)',
              cursor: 'pointer',
            }}
          >
            Chapter Swell (breath)
          </button>
        </div>
      </section>

      {/* Shortlist Table */}
      <section>
        <h2 style={{ fontSize: '1.4rem', fontWeight: '700', color: 'var(--sn-text-primary)', marginBottom: '20px' }}>
          Shortlisted Candidates (Awaiting Owner Pick)
        </h2>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(290px, 1fr))', gap: '20px' }}>
          {SHORTLIST.map((track) => {
            const isSelected = activeTrack === track.id;
            return (
              <div
                key={track.id}
                style={{
                  padding: '24px',
                  borderRadius: '16px',
                  background: isSelected ? 'var(--sn-surface-2)' : 'var(--sn-surface-1)',
                  border: isSelected ? '2px solid var(--sn-accent-gold)' : '1px solid var(--sn-card-border)',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  transition: 'all 0.2s ease',
                }}
              >
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                    <span
                      style={{
                        fontSize: '0.8rem',
                        fontWeight: '700',
                        color: 'var(--sn-text-secondary)',
                        textTransform: 'uppercase',
                        letterSpacing: '0.08em',
                      }}
                    >
                      {track.bestFor}
                    </span>
                    <span
                      style={{
                        fontSize: '0.8rem',
                        background: 'var(--sn-surface-1)',
                        padding: '2px 8px',
                        borderRadius: '4px',
                        border: '1px solid var(--sn-card-border)',
                        color: 'var(--sn-text-secondary)',
                      }}
                    >
                      {track.bpm}
                    </span>
                  </div>

                  <h3 style={{ fontSize: '1.3rem', fontWeight: '700', color: 'var(--sn-text-primary)', marginBottom: '4px' }}>
                    {track.title}
                  </h3>
                  <div style={{ fontSize: '0.9rem', color: 'var(--sn-text-secondary)', marginBottom: '14px' }}>
                    By {track.artist} • {track.duration}
                  </div>

                  <p style={{ fontSize: '0.92rem', color: 'var(--sn-text-primary)', lineHeight: '1.5', marginBottom: '16px' }}>
                    {track.mood}
                  </p>
                </div>

                <div style={{ borderTop: '1px solid var(--sn-card-border)', paddingTop: '16px', marginTop: '12px' }}>
                  <div style={{ fontSize: '0.8rem', color: 'var(--sn-text-secondary)', marginBottom: '12px' }}>
                    License:{' '}
                    <a
                      href={track.licenseUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{ color: 'var(--sn-accent-gold)', textDecoration: 'underline' }}
                    >
                      {track.license}
                    </a>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleToggleAudition(track.id)}
                    style={{
                      width: '100%',
                      padding: '12px',
                      borderRadius: '8px',
                      background: isSelected && musicPlaying ? 'var(--sn-accent-gold)' : 'var(--sn-surface-2)',
                      color: isSelected && musicPlaying ? 'var(--void)' : 'var(--sn-text-primary)',
                      border: '1px solid var(--sn-card-border)',
                      fontWeight: '700',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '8px',
                    }}
                  >
                    {isSelected && musicPlaying ? (
                      <>
                        <StopIcon />
                        <span>Stop Audition</span>
                      </>
                    ) : (
                      <>
                        <PlayIcon />
                        <span>Audition Track</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </main>
  );
}
