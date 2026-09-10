'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useTransitionRouter } from '@/context/TransitionContext';
import { doc, getDoc, setDoc, serverTimestamp, Timestamp } from 'firebase/firestore';
import {
  db,
  ensureAnonymousAuth,
  initAppCheck,
  FIREBASE_PROJECT_ID,
  FIREBASE_CONSOLE_RULES_URL,
} from '@/lib/firebase/client';
import {
  generateRoomCode,
  getLoungeDisplayName,
  setLoungeDisplayName,
  getRoomHistory,
  addOrUpdateRoomHistory,
  removeRoomFromHistory,
  checkRoomLimitStatus,
  MAX_ACTIVE_ROOMS,
} from '@/lib/loungeHistory';
import LoungeParticleCanvas from '@/components/LoungeParticleCanvas';
import styles from './lounge.module.css';

const RULES_SNIPPET = `rules_version = '2';

service cloud.firestore {
  match /databases/{database}/documents {
    
    // ── The Lounge Realtime Hangout Rules ──
    match /rooms/{roomId} {
      allow read: if request.auth != null;
      allow create: if request.auth != null 
                    && request.resource.data.hostUid == request.auth.uid;
      allow update: if request.auth != null;
      allow delete: if request.auth != null && request.auth.uid == resource.data.hostUid;

      match /participants/{uid} {
        allow read: if request.auth != null;
        allow write: if request.auth != null && request.auth.uid == uid;
      }

      match /messages/{messageId} {
        allow read: if request.auth != null;
        allow create: if request.auth != null 
                      && request.auth.uid == request.resource.data.uid;
        allow update, delete: if false;
      }

      match /signals/{presenterUid}/peers/{viewerUid} {
        allow read, write: if request.auth != null 
                           && (request.auth.uid == presenterUid || request.auth.uid == viewerUid);
      }
    }
  }
}`;

export default function LoungeLanding() {
  const router = useRouter();
  const transitionRouter = useTransitionRouter();

  const [displayName, setDisplayName] = useState('');
  const [showNameModal, setShowNameModal] = useState(false);
  const [modalPendingAction, setModalPendingAction] = useState(null); // 'create' | 'join'
  const [roomCodeInput, setRoomCodeInput] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const [isJoining, setIsJoining] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);
  const [joinError, setJoinError] = useState(null);
  const [limitNotice, setLimitNotice] = useState(null);
  const [recentRooms, setRecentRooms] = useState([]);
  const [permissionError, setPermissionError] = useState(false);
  const [copiedRules, setCopiedRules] = useState(false);


  // Initialize App Check and load preferences on mount
  useEffect(() => {
    initAppCheck();
    const storedName = getLoungeDisplayName();
    setDisplayName(storedName);
    setRecentRooms(getRoomHistory());
  }, []);

  const handleNameModalSubmit = (e) => {
    e.preventDefault();
    const clean = displayName.trim().slice(0, 24);
    if (!clean) return;
    setLoungeDisplayName(clean);
    setShowNameModal(false);

    if (modalPendingAction === 'create') {
      executeCreateRoom();
    } else if (modalPendingAction === 'join') {
      executeJoinRoom(roomCodeInput);
    }
    setModalPendingAction(null);
  };

  const startCreateRoom = () => {
    setErrorMsg(null);
    setJoinError(null);
    setLimitNotice(null);

    const limitStatus = checkRoomLimitStatus();
    if (limitStatus.limitReached) {
      setLimitNotice(`You have reached the maximum limit of ${MAX_ACTIVE_ROOMS} active lounge rooms. Remove an existing room below to create a new one.`);
      return;
    }

    if (!displayName.trim()) {
      setModalPendingAction('create');
      setShowNameModal(true);
      return;
    }

    executeCreateRoom();
  };

  const handleCopyRules = () => {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(RULES_SNIPPET);
      setCopiedRules(true);
      setTimeout(() => setCopiedRules(false), 2500);
    }
  };

  const executeCreateRoom = async () => {
    setIsCreating(true);
    setPermissionError(false);
    setErrorMsg(null);
    try {
      const user = await ensureAnonymousAuth();
      if (!user) throw new Error('Authentication failure');

      const roomId = generateRoomCode();
      const roomRef = doc(db, 'rooms', roomId);

      await setDoc(roomRef, {
        roomId,
        hostUid: user.uid,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        participantCount: 0,
        playbackState: {
          videoId: '',
          isPlaying: false,
          positionSeconds: 0,
          updatedAt: serverTimestamp(),
        },
        expiresAt: Timestamp.fromMillis(Date.now() + 48 * 60 * 60 * 1000), // 48-hour TTL
      });

      addOrUpdateRoomHistory(roomId, 'Host');
      transitionRouter.push(`/lounge/${roomId}`);
    } catch (err) {
      console.error('[The Lounge] Room creation failed:', err);
      const isPerm =
        err?.code === 'permission-denied' ||
        (typeof err?.message === 'string' && err.message.toLowerCase().includes('permission'));

      if (isPerm) {
        setPermissionError(true);
        setErrorMsg('Firestore security rules have not been published in Firebase Console.');
      } else {
        setErrorMsg(err.message || 'Failed to create room. Please check your connection.');
      }
    } finally {
      setIsCreating(false);
    }
  };

  const startJoinRoom = (e) => {
    e.preventDefault();
    setJoinError(null);
    setErrorMsg(null);
    setLimitNotice(null);

    const cleanCode = roomCodeInput.trim().toLowerCase();
    if (!cleanCode) return;

    if (!/^[a-z0-9]{4,16}$/.test(cleanCode)) {
      setJoinError('Invalid room code format. Lounge codes are 8 alphanumeric characters.');
      return;
    }

    if (!displayName.trim()) {
      setModalPendingAction('join');
      setShowNameModal(true);
      return;
    }

    executeJoinRoom(cleanCode);
  };

  const executeJoinRoom = async (code) => {
    setIsJoining(true);
    setPermissionError(false);
    setJoinError(null);
    try {
      await ensureAnonymousAuth();
      const roomRef = doc(db, 'rooms', code);
      const snap = await getDoc(roomRef);

      if (!snap.exists()) {
        setJoinError("This room doesn't exist. Please check the code and try again.");
        return;
      }

      const data = snap.data();
      if (data.expiresAt && Date.now() > data.expiresAt.toMillis()) {
        setJoinError('This lounge session has expired.');
        return;
      }

      if ((data.participantCount || 0) >= 6) {
        setJoinError('This lounge is currently at maximum capacity (6/6 slots).');
        return;
      }

      addOrUpdateRoomHistory(code, 'Member');
      transitionRouter.push(`/lounge/${code}`);
    } catch (err) {
      console.error('[The Lounge] Room join check failed:', err);
      const isPerm =
        err?.code === 'permission-denied' ||
        (typeof err?.message === 'string' && err.message.toLowerCase().includes('permission'));

      if (isPerm) {
        setPermissionError(true);
        setJoinError('Firestore security rules required. Please publish rules in Firebase Console.');
      } else {
        setJoinError(err.message || 'Failed to connect to lounge.');
      }
    } finally {
      setIsJoining(false);
    }
  };

  const handleDeleteHistory = (e, roomId) => {
    e.preventDefault();
    e.stopPropagation();
    const updated = removeRoomFromHistory(roomId);
    setRecentRooms(updated);
    setLimitNotice(null);
  };

  return (
    <div className={styles.pageContainer}>
      <LoungeParticleCanvas />
      <div className={styles.ambientGlowTop} aria-hidden="true" />
      <div className={styles.ambientGlowStage} aria-hidden="true" />

      {/* Pre-Join Callsign Modal */}
      {showNameModal && (
        <div className={styles.modalBackdrop} role="dialog" aria-modal="true">
          <div className={styles.modalCard}>
            <h3 className={styles.modalTitle}>Set Your Callsign</h3>
            <p className={styles.modalDesc}>
              Choose a handle to represent your glowing avatar and messages in The Lounge.
            </p>
            <form onSubmit={handleNameModalSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <input
                type="text"
                className={styles.inputCode}
                placeholder="e.g. Neo / Cyberpunk"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                maxLength={24}
                autoFocus
                required
              />
              <button type="submit" className={styles.primaryBtn}>
                Confirm &amp; Proceed &rarr;
              </button>
            </form>
          </div>
        </div>
      )}

      <main className={styles.landingMain}>
        <header className={styles.headerSection}>
          <div className={styles.badge}>
            <span className={styles.beaconDot} />
            <span>THE LOUNGE · ISOLATED REAL-TIME STAGE</span>
          </div>
          <h1 className={styles.title}>
            Step into <span className={styles.titleGradient}>The Lounge</span>
          </h1>
          <p className={styles.subtitle}>
            A synchronized virtual hangout featuring WebRTC peer-to-peer screen sharing, synchronized
            YouTube listening sessions, and real-time spatial participant orbs.
          </p>
        </header>

        {/* Firebase Rules Missing Assistant */}
        {permissionError && (
          <div className={styles.rulesHelperCard} role="alert">
            <div className={styles.rulesHelperHeader}>
              <div className={styles.rulesHelperIcon}>🔒</div>
              <div>
                <h3 className={styles.rulesHelperTitle}>Firestore Security Rules Setup Required</h3>
                <p className={styles.rulesHelperDesc}>
                  Your Firebase Cloud project (<code>{FIREBASE_PROJECT_ID}</code>) is currently blocking database writes because the default rules in the Firebase Console are locked. Paste the security rules into the Firebase Console rules editor and click <strong>Publish</strong>.
                </p>
              </div>
            </div>

            <div className={styles.rulesActionRow}>
              <a
                href={FIREBASE_CONSOLE_RULES_URL}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.rulesConsoleBtn}
              >
                Open Firebase Console Rules ↗
              </a>
              <button
                type="button"
                className={styles.rulesCopyBtn}
                onClick={handleCopyRules}
              >
                {copiedRules ? 'Copied to Clipboard! ✓' : '📋 Copy Rules to Clipboard'}
              </button>
              <button
                type="button"
                className={styles.rulesRetryBtn}
                onClick={executeCreateRoom}
                disabled={isCreating}
              >
                {isCreating ? 'Verifying...' : '↻ Verify & Retry Now'}
              </button>
            </div>

            <details className={styles.rulesCodeContainer}>
              <summary className={styles.rulesSummary}>
                ▶ View copy-pasteable rules (firestore.rules)
              </summary>
              <pre className={styles.rulesCodePre}>{RULES_SNIPPET}</pre>
            </details>
          </div>
        )}

        {limitNotice && (
          <div className={styles.errorBanner} style={{ maxWidth: 960, margin: '0 auto 1.5rem', width: '100%' }}>
            ⚠ {limitNotice}
          </div>
        )}

        <div className={styles.landingGrid}>
          {/* Card 1: Create a Stage */}
          <div className={styles.card}>
            <div className={styles.cardIconTitle}>
              <div className={styles.cardIcon}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polygon points="5 3 19 12 5 21 5 3" />
                </svg>
              </div>
              <h2 className={styles.cardTitle}>Create a Lounge</h2>
            </div>
            <p className={styles.cardDesc}>
              Initialize an isolated virtual room. As host, stream your screen or coordinate synchronized YouTube playback with up to 5 friends.
            </p>
            {errorMsg && !permissionError && <div className={styles.errorBanner}>✕ {errorMsg}</div>}

            <button
              type="button"
              className={styles.primaryBtn}
              onClick={startCreateRoom}
              disabled={isCreating}
            >
              {isCreating ? 'Initializing Stage...' : 'Launch New Lounge ⟩'}
            </button>
          </div>

          {/* Card 2: Join via Code */}
          <div className={styles.card}>
            <div className={styles.cardIconTitle}>
              <div className={styles.cardIcon}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" />
                  <polyline points="10 17 15 12 10 7" />
                  <line x1="15" y1="12" x2="3" y2="12" />
                </svg>
              </div>
              <h2 className={styles.cardTitle}>Join an Existing Room</h2>
            </div>
            <p className={styles.cardDesc}>
              Have an 8-character invite code? Enter it below to join an active session.
            </p>
            {joinError && <div className={styles.errorBanner}>✕ {joinError}</div>}
            <form onSubmit={startJoinRoom} className={styles.joinForm}>
              <input
                type="text"
                className={styles.inputCode}
                placeholder="room code (e.g. x7k9p2m4)"
                value={roomCodeInput}
                onChange={(e) => setRoomCodeInput(e.target.value)}
                maxLength={16}
                required
              />
              <button
                type="submit"
                className={styles.secondaryBtn}
                disabled={isJoining || !roomCodeInput.trim()}
              >
                {isJoining ? 'Verifying...' : 'Join ⟩'}
              </button>
            </form>
          </div>
        </div>

        {/* Room History Section */}
        {recentRooms.length > 0 && (
          <div className={styles.historySection}>
            <div className={styles.historyTitle}>
              <span>Recent Lounge Sessions ({recentRooms.length} / {MAX_ACTIVE_ROOMS})</span>
              {displayName && (
                <span style={{ color: '#34d399', cursor: 'pointer' }} onClick={() => setShowNameModal(true)}>
                  Callsign: {displayName} ✎
                </span>
              )}
            </div>
            <div className={styles.historyList}>
              {recentRooms.map((room) => (
                <div
                  key={room.roomId}
                  onClick={() => transitionRouter.push(`/lounge/${room.roomId}`)}
                  className={styles.historyPill}
                  style={{ cursor: 'pointer' }}
                >
                  <span style={{ color: '#34d399' }}>●</span>
                  <span>{room.roomId}</span>
                  {room.preview && <span style={{ color: '#64748b', fontSize: '0.72rem' }}>({room.preview})</span>}
                  <button
                    type="button"
                    className={styles.deleteHistoryBtn}
                    onClick={(e) => handleDeleteHistory(e, room.roomId)}
                    title="Remove from history"
                    aria-label="Remove room from history"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
