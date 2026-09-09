"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import styles from './space.module.css';

export default function SpaceLanding() {
  const router = useRouter();
  const [isCreating, setIsCreating] = useState(false);
  const [roomCodeInput, setRoomCodeInput] = useState('');
  const [errorMsg, setErrorMsg] = useState(null);

  const handleCreateRoom = async () => {
    setIsCreating(true);
    setErrorMsg(null);
    try {
      const res = await fetch('/api/space/room', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });
      const data = await res.json();
      if (res.ok && data.url) {
        router.push(data.url);
      } else {
        setErrorMsg(data.error || 'Failed to create room. Please try again.');
      }
    } catch (err) {
      console.error('Room creation failed:', err);
      setErrorMsg('Network error while creating sync room.');
    } finally {
      setIsCreating(false);
    }
  };

  const handleJoinByCode = (e) => {
    e.preventDefault();
    const cleanCode = roomCodeInput.trim().toLowerCase();
    if (!cleanCode) return;
    router.push(`/space/${cleanCode}`);
  };

  return (
    <main className={styles.container}>
      <div className={styles.inner}>
        {/* Hero Section */}
        <section className={styles.landingHero}>
          <div className={styles.landingEyebrow}>
            <span>✦ Instant Multi-Device Sync</span>
          </div>

          <h1 className={styles.landingTitle}>
            AirDrop for text across all your devices.
          </h1>

          <p className={styles.landingSubtitle}>
            Instant ephemeral scratchpads connecting your laptop, phone, and colleagues.
            Zero logins, instant QR pairing, and 48-hour auto-clean.
          </p>

          {errorMsg && (
            <div className={styles.noticeBanner} role="alert" style={{ width: '100%', maxWidth: '440px' }}>
              <span>⚠️ {errorMsg}</span>
            </div>
          )}

          <div className={styles.landingActions}>
            <button
              type="button"
              className={styles.primaryCreateBtn}
              onClick={handleCreateRoom}
              disabled={isCreating}
            >
              {isCreating ? (
                <>
                  <span className={styles.savingText}>Creating Room...</span>
                </>
              ) : (
                <>
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="12" y1="5" x2="12" y2="19" />
                    <line x1="5" y1="12" x2="19" y2="12" />
                  </svg>
                  Create a New Sync Room
                </>
              )}
            </button>

            {/* Quick Join Input */}
            <form onSubmit={handleJoinByCode} style={{ display: 'flex', gap: '0.4rem', alignItems: 'center' }}>
              <input
                type="text"
                value={roomCodeInput}
                onChange={(e) => setRoomCodeInput(e.target.value)}
                placeholder="Enter 8-char code"
                maxLength={12}
                style={{
                  background: 'rgba(255, 255, 255, 0.04)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  borderRadius: '8px',
                  padding: '0.62rem 0.85rem',
                  fontSize: '0.8rem',
                  color: '#f8fafc',
                  fontFamily: 'var(--font-mono, monospace)',
                  outline: 'none',
                  width: '150px',
                }}
                aria-label="Room code"
              />
              <button
                type="submit"
                className={styles.actionPillBtn}
                style={{ padding: '0.62rem 0.85rem' }}
                disabled={!roomCodeInput.trim()}
              >
                Join
              </button>
            </form>
          </div>

          <div style={{ marginTop: '0.5rem' }}>
            <Link href="/space?mode=legacy" className={styles.legacyLink}>
              Or open the public global scratchpad →
            </Link>
          </div>
        </section>

        {/* Features Highlights Grid */}
        <section className={styles.featuresGrid} style={{ marginTop: '2.5rem' }}>
          <div className={styles.featureCard}>
            <div className={styles.featureIcon}>⚡</div>
            <h2 className={styles.featureTitle}>Instant QR Pairing</h2>
            <p className={styles.featureDesc}>
              Scan the room QR code with your phone camera to instantly share text, code snippets, or links without typing long URLs or authenticating.
            </p>
          </div>

          <div className={styles.featureCard}>
            <div className={styles.featureIcon}>🔒</div>
            <h2 className={styles.featureTitle}>48-Hour Ephemeral Privacy</h2>
            <p className={styles.featureDesc}>
              Rooms automatically self-destruct after 48 hours of inactivity. No logins, accounts, or persistent personal logs are stored.
            </p>
          </div>

          <div className={styles.featureCard}>
            <div className={styles.featureIcon}>📡</div>
            <h2 className={styles.featureTitle}>Real-time Edge Sync</h2>
            <p className={styles.featureDesc}>
              Sub-second collaborative typing powered by websockets with live presence count, offline detection, and typing conflict protection.
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}
