"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  getRoomHistory,
  addOrUpdateRoomHistory,
  removeRoomFromHistory,
  checkRoomLimitStatus,
  MAX_ACTIVE_ROOMS,
} from '@/lib/spaceHistory';
import styles from './space.module.css';

export default function SpaceLanding() {
  const router = useRouter();
  const [isCreating, setIsCreating] = useState(false);
  const [isCheckingCode, setIsCheckingCode] = useState(false);
  const [roomCodeInput, setRoomCodeInput] = useState('');
  const [errorMsg, setErrorMsg] = useState(null);
  const [joinError, setJoinError] = useState(null);
  const [limitNotice, setLimitNotice] = useState(null);
  const [recentRooms, setRecentRooms] = useState([]);

  // Load local room history on mount
  useEffect(() => {
    setRecentRooms(getRoomHistory());
  }, []);

  const handleCreateRoom = async () => {
    setErrorMsg(null);
    setJoinError(null);
    setLimitNotice(null);

    // 1. Check 5-Room Active Limit
    const limitStatus = checkRoomLimitStatus();
    if (limitStatus.limitReached) {
      setLimitNotice(
        `You've reached your limit of ${MAX_ACTIVE_ROOMS} active sync rooms. Please open or remove an existing room below before creating a new one.`
      );
      return;
    }

    setIsCreating(true);
    try {
      const res = await fetch('/api/space/room', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });
      const data = await res.json();
      if (res.ok && data.url && data.roomId) {
        // Record into local room history
        addOrUpdateRoomHistory(data.roomId, '');
        // Client-side navigation without full page reload
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

  const handleJoinByCode = async (e) => {
    e.preventDefault();
    setJoinError(null);
    setErrorMsg(null);
    setLimitNotice(null);

    const cleanCode = roomCodeInput.trim().toLowerCase();
    if (!cleanCode) return;

    // Validate format (alphanumeric, 4 to 16 chars)
    if (!/^[a-z0-9_-]{4,16}$/.test(cleanCode)) {
      setJoinError('Invalid room code format. Codes are 8 alphanumeric characters.');
      return;
    }

    setIsCheckingCode(true);
    try {
      // Strictly verify existence BEFORE navigating — NEVER create on join lookup
      const res = await fetch(`/api/space/room?roomId=${encodeURIComponent(cleanCode)}`);
      const data = await res.json();

      if (res.status === 404 || data.notFound) {
        setJoinError("This room doesn't exist.");
        return;
      }

      if (res.status === 410 || data.expired) {
        setJoinError('This room has expired after 48 hours of inactivity.');
        return;
      }

      if (res.ok && data.roomId) {
        // Room verified to exist in DB: add to history and navigate
        addOrUpdateRoomHistory(data.roomId, data.content || '');
        router.push(`/space/${data.roomId}`);
      } else {
        setJoinError(data.error || "Could not verify room. Please check the code.");
      }
    } catch (err) {
      console.error('Join verification failed:', err);
      setJoinError('Network error while checking room.');
    } finally {
      setIsCheckingCode(false);
    }
  };

  const handleRemoveRecentRoom = (e, roomId) => {
    e.stopPropagation();
    const updated = removeRoomFromHistory(roomId);
    setRecentRooms(updated);
    if (limitNotice && updated.length < MAX_ACTIVE_ROOMS) {
      setLimitNotice(null);
    }
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

          {/* Error Banner */}
          {errorMsg && (
            <div className={styles.noticeBanner} role="alert" style={{ width: '100%', maxWidth: '520px' }}>
              <span>⚠️ {errorMsg}</span>
            </div>
          )}

          {/* Limit Notice Banner */}
          {limitNotice && (
            <div className={styles.roomLimitBanner} role="alert" style={{ width: '100%', maxWidth: '520px' }}>
              <span>⚠️ {limitNotice}</span>
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
                onChange={(e) => {
                  setRoomCodeInput(e.target.value);
                  if (joinError) setJoinError(null);
                }}
                placeholder="Enter 8-char code"
                maxLength={16}
                disabled={isCheckingCode}
                style={{
                  background: 'rgba(255, 255, 255, 0.04)',
                  border: joinError ? '1px solid #ef4444' : '1px solid rgba(255, 255, 255, 0.1)',
                  borderRadius: '8px',
                  padding: '0.62rem 0.85rem',
                  fontSize: '0.8rem',
                  color: '#f8fafc',
                  fontFamily: 'var(--font-mono, monospace)',
                  outline: 'none',
                  width: '155px',
                }}
                aria-label="Room code"
              />
              <button
                type="submit"
                className={styles.actionPillBtn}
                style={{ padding: '0.62rem 0.85rem' }}
                disabled={!roomCodeInput.trim() || isCheckingCode}
              >
                {isCheckingCode ? 'Checking...' : 'Join'}
              </button>
            </form>
          </div>

          {/* Join Error Banner with Option to Create */}
          {joinError && (
            <div
              className={styles.noticeBanner}
              role="alert"
              style={{
                width: '100%',
                maxWidth: '520px',
                borderColor: 'rgba(239, 68, 68, 0.3)',
                background: 'rgba(239, 68, 68, 0.06)',
                color: '#fca5a5',
              }}
            >
              <span>{joinError}</span>
              <button
                type="button"
                className={styles.noticeActionBtn}
                onClick={handleCreateRoom}
                style={{ borderColor: 'rgba(16, 185, 129, 0.4)', color: '#10b981' }}
              >
                Create a new room instead
              </button>
            </div>
          )}

          <div style={{ marginTop: '0.5rem' }}>
            <Link href="/space" className={styles.legacyLink}>
              Or open the public global scratchpad →
            </Link>
          </div>
        </section>

        {/* Recent Rooms Section (if visitor has created or visited rooms) */}
        {recentRooms.length > 0 && (
          <section style={{ marginTop: '2rem', width: '100%', maxWidth: '640px', margin: '2rem auto 0 auto' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
              <span style={{ fontSize: '0.78rem', fontWeight: 600, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                Your Active Rooms ({recentRooms.length}/{MAX_ACTIVE_ROOMS})
              </span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {recentRooms.map((r) => (
                <div
                  key={r.roomId}
                  onClick={() => router.push(`/space/${r.roomId}`)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '0.75rem 1rem',
                    background: '#0b0f19',
                    border: '1px solid rgba(255, 255, 255, 0.08)',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease',
                  }}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') router.push(`/space/${r.roomId}`);
                  }}
                >
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.2rem', overflow: 'hidden' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <span style={{ fontFamily: 'var(--font-mono, monospace)', fontWeight: 600, color: '#10b981', fontSize: '0.85rem', textTransform: 'uppercase' }}>
                        {r.roomId}
                      </span>
                      <span style={{ fontSize: '0.7rem', color: '#64748b' }}>
                        • {new Date(r.lastVisitedAt).toLocaleDateString()}
                      </span>
                    </div>
                    {r.preview && (
                      <span style={{ fontSize: '0.74rem', color: '#94a3b8', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '400px' }}>
                        &ldquo;{r.preview}&rdquo;
                      </span>
                    )}
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span style={{ fontSize: '0.74rem', color: '#10b981', fontWeight: 500 }}>
                      Open →
                    </span>
                    <button
                      type="button"
                      className={styles.roomItemDeleteBtn}
                      onClick={(e) => handleRemoveRecentRoom(e, r.roomId)}
                      title="Remove from history"
                      aria-label={`Remove room ${r.roomId} from history`}
                    >
                      &times;
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

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
