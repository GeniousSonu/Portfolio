'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';
import styles from './play.module.css';

export default function PlayClient() {
  // Web Audio Synthesizer state
  const [isPlaying, setIsPlaying] = useState(false);
  const [frequency, setFrequency] = useState(440); // A4 concert pitch
  const [waveform, setWaveform] = useState('sine'); // 'sine' | 'square' | 'sawtooth' | 'triangle'
  const [volume, setVolume] = useState(0.15); // Default quiet safe volume

  const audioCtxRef = useRef(null);
  const oscNodeRef = useRef(null);
  const gainNodeRef = useRef(null);

  // Initialize or update audio context
  const stopAudio = useCallback(() => {
    if (oscNodeRef.current) {
      try {
        oscNodeRef.current.stop();
        oscNodeRef.current.disconnect();
      } catch {}
      oscNodeRef.current = null;
    }
    setIsPlaying(false);
  }, []);

  const startAudio = useCallback(() => {
    try {
      if (!audioCtxRef.current) {
        const AudioContextClass = window.AudioContext || window.webkitAudioContext;
        if (!AudioContextClass) return;
        audioCtxRef.current = new AudioContextClass();
      }

      if (audioCtxRef.current.state === 'suspended') {
        audioCtxRef.current.resume();
      }

      stopAudio();

      const osc = audioCtxRef.current.createOscillator();
      const gain = audioCtxRef.current.createGain();

      osc.type = waveform;
      osc.frequency.setValueAtTime(frequency, audioCtxRef.current.currentTime);

      gain.gain.setValueAtTime(volume, audioCtxRef.current.currentTime);

      osc.connect(gain);
      gain.connect(audioCtxRef.current.destination);

      osc.start();
      oscNodeRef.current = osc;
      gainNodeRef.current = gain;
      setIsPlaying(true);
    } catch (err) {
      console.warn('[Synthesizer] Audio context initialization notice:', err);
    }
  }, [frequency, waveform, volume, stopAudio]);

  const toggleAudio = () => {
    if (isPlaying) {
      stopAudio();
    } else {
      startAudio();
    }
  };

  // Live adjustments while playing
  useEffect(() => {
    if (isPlaying && oscNodeRef.current && audioCtxRef.current) {
      oscNodeRef.current.frequency.setValueAtTime(
        frequency,
        audioCtxRef.current.currentTime
      );
    }
  }, [frequency, isPlaying]);

  useEffect(() => {
    if (isPlaying && gainNodeRef.current && audioCtxRef.current) {
      gainNodeRef.current.gain.setValueAtTime(
        volume,
        audioCtxRef.current.currentTime
      );
    }
  }, [volume, isPlaying]);

  useEffect(() => {
    if (isPlaying) {
      startAudio();
    }
  }, [waveform, isPlaying, startAudio]);

  // Clean teardown on unmount
  useEffect(() => {
    return () => {
      stopAudio();
      if (audioCtxRef.current) {
        audioCtxRef.current.close().catch(() => {});
      }
    };
  }, [stopAudio]);

  return (
    <div className={styles.labGrid}>
      {/* Experiment 1: Web Audio Tone Node */}
      <div className={styles.labCard}>
        <div className={styles.cardHeader}>
          <span className={styles.cardTag}>Node 01 · Web Audio Experiment</span>
          <span className={styles.cardStatus}>
            {isPlaying ? '● OSCILLATING' : '○ STANDBY'}
          </span>
        </div>

        <h2 className={styles.cardTitle}>Acoustic Frequency Synthesizer</h2>
        <p className={styles.cardDesc}>
          Direct browser tone generator utilizing native Web Audio API oscillators and gain nodes.
          Calibrate waveform shapes and explore frequency textures in real-time.
        </p>

        <div className={styles.synthControls}>
          <div className={styles.controlGroup}>
            <div className={styles.controlLabel}>
              <span>WAVEFORM SHAPE</span>
              <span>{waveform.toUpperCase()}</span>
            </div>
            <div className={styles.waveButtons}>
              {['sine', 'square', 'sawtooth', 'triangle'].map((type) => (
                <button
                  key={type}
                  type="button"
                  onClick={() => setWaveform(type)}
                  className={`${styles.waveBtn} ${
                    waveform === type ? styles.waveBtnActive : ''
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>

          <div className={styles.controlGroup}>
            <div className={styles.controlLabel}>
              <span>FREQUENCY</span>
              <span>{frequency} HZ</span>
            </div>
            <input
              type="range"
              min="100"
              max="2000"
              step="5"
              value={frequency}
              onChange={(e) => setFrequency(Number(e.target.value))}
              className={styles.slider}
            />
          </div>

          <div className={styles.controlGroup}>
            <div className={styles.controlLabel}>
              <span>AMPLITUDE (VOLUME)</span>
              <span>{Math.round(volume * 100)}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="0.5"
              step="0.01"
              value={volume}
              onChange={(e) => setVolume(Number(e.target.value))}
              className={styles.slider}
            />
          </div>
        </div>

        <button
          type="button"
          onClick={toggleAudio}
          className={isPlaying ? 'btn btn-ghost' : 'btn btn-gold'}
          style={{ width: '100%', justifyContent: 'center' }}
        >
          {isPlaying ? 'Stop Oscillator ■' : 'Start Audio Node ▶'}
        </button>
      </div>

      {/* Experiment 2: Competitive Chess Telemetry */}
      <div className={styles.labCard}>
        <div className={styles.cardHeader}>
          <span className={styles.cardTag}>Protocol 02 · Strategy Engine</span>
          <span className={styles.cardStatus}>VERIFIED RATINGS</span>
        </div>

        <h2 className={styles.cardTitle}>Chess Telemetry &amp; Challenges</h2>
        <p className={styles.cardDesc}>
          Competitive ratings and tactical puzzle metrics across online platforms. Challenge my handle
          directly to an asynchronous or live rapid match.
        </p>

        <div className={styles.statsList}>
          <div className={styles.statItem}>
            <div className={styles.statItemLabel}>Chess.com Rapid</div>
            <div className={styles.statItemValue}>1650 ELO</div>
          </div>
          <div className={styles.statItem}>
            <div className={styles.statItemLabel}>Tactics Rating</div>
            <div className={styles.statItemValue}>2100+</div>
          </div>
          <div className={styles.statItem}>
            <div className={styles.statItemLabel}>Primary Defense</div>
            <div className={styles.statItemValue}>Sicilian (c5)</div>
          </div>
          <div className={styles.statItem}>
            <div className={styles.statItemLabel}>White Opening</div>
            <div className={styles.statItemValue}>Queen&apos;s Gambit</div>
          </div>
        </div>

        <div className={styles.chessButtons}>
          <a
            href="https://lichess.org/@/GeniousSonu"
            target="_blank"
            rel="noopener noreferrer"
            className={styles.externalBtn}
          >
            <span>Challenge on Lichess</span>
            <span>↗</span>
          </a>
          <a
            href="https://www.chess.com/member/genioussonu"
            target="_blank"
            rel="noopener noreferrer"
            className={styles.externalBtn}
          >
            <span>Chess.com Profile</span>
            <span>↗</span>
          </a>
        </div>
      </div>

      {/* Experiment 3: Esports Telemetry & Match Request */}
      <div className={styles.fullWidthCard}>
        <div className={styles.cardHeader} style={{ justifyContent: 'center' }}>
          <span className={styles.cardTag}>Protocol 03 · Tactical FPS</span>
        </div>
        <h2 className={styles.cardTitle}>Valorant Competitive Telemetry</h2>
        <p className={styles.cardDesc} style={{ margin: '0 auto 1.5rem', maxWidth: '580px' }}>
          Tactical FPS telemetry tracking: Rank <strong>Diamond 2</strong>. Main agents: <em>Omen, Killjoy, Cypher</em>.
          Workstation display: 144Hz high-refresh IPS with sub-millisecond input lag.
        </p>

        <Link
          href="/contact?subject=Gaming%20Match%20Challenge"
          className="btn btn-gold"
          style={{ display: 'inline-flex' }}
        >
          Dispatch Match Request →
        </Link>
      </div>
    </div>
  );
}
