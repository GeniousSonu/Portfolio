'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useTransitionRouter } from '@/context/TransitionContext';
import {
  doc,
  collection,
  onSnapshot,
  runTransaction,
  updateDoc,
  deleteDoc,
  serverTimestamp,
  Timestamp,
} from 'firebase/firestore';
import { db, ensureAnonymousAuth, initAppCheck } from '@/lib/firebase/client';
import {
  getLoungeDisplayName,
  setLoungeDisplayName,
  addOrUpdateRoomHistory,
} from '@/lib/loungeHistory';
import { PresenterManager, ViewerManager } from '@/lib/webrtcStar';
import LoungeParticleCanvas from '@/components/LoungeParticleCanvas';
import LoungeChat from '@/components/LoungeChat';
import LoungeYouTubePlayer from '@/components/LoungeYouTubePlayer';
import styles from './lounge.module.css';

const ORB_COLORS = [
  '#10B981', // Emerald
  '#60A5FA', // Sky
  '#A78BFA', // Violet
  '#FBBF24', // Amber
  '#F472B6', // Rose
  '#34D399', // Mint
];

export default function LoungeRoomView({ roomId }) {
  const router = useRouter();
  const transitionRouter = useTransitionRouter();

  // Auth & Identity
  const [currentUser, setCurrentUser] = useState(null);
  const [displayName, setDisplayName] = useState('');
  const [showNameModal, setShowNameModal] = useState(false);
  const [nameInput, setNameInput] = useState('');

  // Room State
  const [roomData, setRoomData] = useState(null);
  const [participants, setParticipants] = useState([]);
  const [joinStatus, setJoinStatus] = useState('connecting'); // 'connecting' | 'joined' | 'full' | 'error' | 'not_found'
  const [errorMessage, setErrorMessage] = useState('');
  const [copiedInvite, setCopiedInvite] = useState(false);

  // WebRTC Screen Share State (Star Topology)
  const [isSharingScreen, setIsSharingScreen] = useState(false);
  const [canScreenShare, setCanScreenShare] = useState(false);
  const [remoteStream, setRemoteStream] = useState(null);
  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);
  const presenterManagerRef = useRef(null);
  const viewerManagerRef = useRef(null);

  // YouTube / Stage Mode
  const [stageMode, setStageMode] = useState('idle'); // 'idle' | 'screenshare' | 'youtube'
  const [showYouTubeInput, setShowYouTubeInput] = useState(false);

  // Chat & UI State
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [unreadChatCount, setUnreadChatCount] = useState(0);

  const heartbeatTimerRef = useRef(null);
  const isJoinedRef = useRef(false);

  // Check displayMedia capability (desktop only)
  useEffect(() => {
    if (typeof window !== 'undefined' && typeof navigator !== 'undefined') {
      const hasGetDisplayMedia =
        navigator.mediaDevices && typeof navigator.mediaDevices.getDisplayMedia === 'function';
      const isTouchOnly = !window.matchMedia('(pointer: fine)').matches;
      setCanScreenShare(hasGetDisplayMedia && !isTouchOnly);
    }
  }, []);

  // 1. Initialize App Check & Auth
  useEffect(() => {
    initAppCheck();
    let isMounted = true;

    async function setupSession() {
      try {
        const user = await ensureAnonymousAuth();
        if (!isMounted) return;
        setCurrentUser(user);

        const savedName = getLoungeDisplayName() || `Guest_${user.uid.slice(-4)}`;
        setDisplayName(savedName);
        setNameInput(savedName);
      } catch (err) {
        if (!isMounted) return;
        console.error('[The Lounge] Session init failure:', err);
        setJoinStatus('error');
        setErrorMessage('Failed to establish secure anonymous session.');
      }
    }

    setupSession();
    return () => {
      isMounted = false;
    };
  }, []);

  // 2. Atomic Join Transaction & Room Verification
  const performJoinTransaction = useCallback(
    async (user, currentName) => {
      if (!roomId || !user) return;

      try {
        const roomRef = doc(db, 'rooms', roomId);
        const participantRef = doc(db, 'rooms', roomId, 'participants', user.uid);

        await runTransaction(db, async (transaction) => {
          const [roomSnap, participantSnap] = await Promise.all([
            transaction.get(roomRef),
            transaction.get(participantRef),
          ]);

          if (!roomSnap.exists()) {
            throw new Error('NOT_FOUND');
          }

          const rData = roomSnap.data();

          if (rData.expiresAt && Date.now() > rData.expiresAt.toMillis()) {
            throw new Error('EXPIRED');
          }

          const currentCount = rData.participantCount || 0;

          // If already in room, refresh presence
          if (participantSnap.exists()) {
            transaction.update(participantRef, {
              displayName: currentName,
              lastSeen: serverTimestamp(),
              expiresAt: Timestamp.fromMillis(Date.now() + 2 * 60 * 60 * 1000), // 2h TTL
            });
            return;
          }

          // Enforce 6-participant cap
          if (currentCount >= 6) {
            throw new Error('ROOM_FULL');
          }

          // Assign deterministic color based on count
          const color = ORB_COLORS[currentCount % ORB_COLORS.length];

          // Increment parent counter & write participant document
          transaction.update(roomRef, {
            participantCount: currentCount + 1,
            updatedAt: serverTimestamp(),
          });

          transaction.set(participantRef, {
            uid: user.uid,
            displayName: currentName,
            joinedAt: serverTimestamp(),
            lastSeen: serverTimestamp(),
            isTyping: false,
            isScreenSharing: false,
            color,
            expiresAt: Timestamp.fromMillis(Date.now() + 2 * 60 * 60 * 1000), // 2h TTL
          });
        });

        isJoinedRef.current = true;
        setJoinStatus('joined');
        addOrUpdateRoomHistory(roomId, 'Active');
      } catch (err) {
        console.error('[The Lounge] Join transaction error:', err);
        if (err.message === 'NOT_FOUND') {
          setJoinStatus('not_found');
          setErrorMessage('This lounge session does not exist. It may have been closed or expired.');
        } else if (err.message === 'ROOM_FULL') {
          setJoinStatus('full');
          setErrorMessage('The Lounge is at maximum capacity (6/6 participants). Please wait for a slot to open.');
        } else if (err.message === 'EXPIRED') {
          setJoinStatus('error');
          setErrorMessage('This lounge session has expired.');
        } else {
          setJoinStatus('error');
          setErrorMessage(err.message || 'Error joining lounge.');
        }
      }
    },
    [roomId]
  );

  // Run join once user and displayName are ready
  useEffect(() => {
    if (currentUser && displayName && joinStatus === 'connecting') {
      performJoinTransaction(currentUser, displayName);
    }
  }, [currentUser, displayName, joinStatus, performJoinTransaction]);

  // 3. 50-Second Heartbeat Loop (Quota-efficient)
  useEffect(() => {
    if (joinStatus !== 'joined' || !currentUser || !roomId) return;

    const runHeartbeat = () => {
      const pRef = doc(db, 'rooms', roomId, 'participants', currentUser.uid);
      updateDoc(pRef, {
        lastSeen: serverTimestamp(),
        expiresAt: Timestamp.fromMillis(Date.now() + 2 * 60 * 60 * 1000),
      }).catch((err) => console.warn('[The Lounge] Heartbeat notice:', err));
    };

    heartbeatTimerRef.current = setInterval(runHeartbeat, 50000);

    return () => {
      if (heartbeatTimerRef.current) clearInterval(heartbeatTimerRef.current);
    };
  }, [joinStatus, currentUser, roomId]);

  // 4. Room & Participants Subscriptions
  useEffect(() => {
    if (!roomId) return;

    const roomRef = doc(db, 'rooms', roomId);
    const unsubRoom = onSnapshot(roomRef, (snap) => {
      if (snap.exists()) {
        setRoomData({ id: snap.id, ...snap.data() });
      } else if (joinStatus === 'joined') {
        setJoinStatus('not_found');
        setErrorMessage('The host closed this lounge.');
      }
    });

    const participantsCol = collection(db, 'rooms', roomId, 'participants');
    const unsubParticipants = onSnapshot(participantsCol, (snap) => {
      const now = Date.now();
      const list = [];

      snap.forEach((docSnap) => {
        const data = docSnap.data();
        const lastSeenMs = data.lastSeen?.toMillis ? data.lastSeen.toMillis() : now;
        const isOnline = now - lastSeenMs < 90000;

        list.push({
          id: docSnap.id,
          ...data,
          isOnline,
        });
      });

      list.sort((a, b) => {
        if (a.uid === roomData?.hostUid) return -1;
        if (b.uid === roomData?.hostUid) return 1;
        return (b.joinedAt?.toMillis?.() || 0) - (a.joinedAt?.toMillis?.() || 0);
      });

      setParticipants(list);
    });

    return () => {
      unsubRoom();
      unsubParticipants();
    };
  }, [roomId, joinStatus, roomData?.hostUid]);

  // Active online participants & presenter detection
  const activeParticipants = participants.filter((p) => p.isOnline);
  const activePresenter = participants.find((p) => p.isScreenSharing && p.isOnline);
  const isHost = currentUser && roomData && currentUser.uid === roomData.hostUid;

  // 5. Presenter Star WebRTC Lifecycle
  const startScreenShare = async () => {
    if (!canScreenShare || !currentUser || !roomId || isSharingScreen) return;

    try {
      const stream = await navigator.mediaDevices.getDisplayMedia({
        video: { cursor: 'always' },
        audio: false,
      });

      setIsSharingScreen(true);

      if (localVideoRef.current) {
        localVideoRef.current.srcObject = stream;
      }

      // Mark participant document as presenting
      const pRef = doc(db, 'rooms', roomId, 'participants', currentUser.uid);
      await updateDoc(pRef, { isScreenSharing: true });

      // Initialize Star Topology Presenter Manager
      const presenterMgr = new PresenterManager(roomId, currentUser.uid, stream);
      presenterManagerRef.current = presenterMgr;

      // Connect to all currently online viewers in room
      activeParticipants.forEach((p) => {
        if (p.uid !== currentUser.uid) {
          presenterMgr.connectToViewer(p.uid);
        }
      });

      // When presenter stops stream via browser bar or native stop
      stream.getVideoTracks()[0].onended = () => {
        stopScreenShare();
      };
    } catch (err) {
      console.warn('[The Lounge] Screen capture cancelled or failed:', err);
      setIsSharingScreen(false);
    }
  };

  const stopScreenShare = useCallback(async () => {
    if (!currentUser || !roomId) return;

    if (presenterManagerRef.current) {
      presenterManagerRef.current.destroy();
      presenterManagerRef.current = null;
    }

    if (localVideoRef.current) {
      localVideoRef.current.srcObject = null;
    }

    setIsSharingScreen(false);

    try {
      const pRef = doc(db, 'rooms', roomId, 'participants', currentUser.uid);
      await updateDoc(pRef, { isScreenSharing: false });
    } catch {}
  }, [currentUser, roomId]);

  // If new viewers join while I am actively presenting, connect to them
  useEffect(() => {
    if (isSharingScreen && presenterManagerRef.current && currentUser) {
      activeParticipants.forEach((p) => {
        if (p.uid !== currentUser.uid) {
          presenterManagerRef.current.connectToViewer(p.uid);
        }
      });
    }
  }, [activeParticipants, isSharingScreen, currentUser]);

  // 6. Viewer Star WebRTC Lifecycle
  useEffect(() => {
    // If another peer is presenting and I am not presenting
    if (activePresenter && currentUser && activePresenter.uid !== currentUser.uid) {
      if (!viewerManagerRef.current) {
        const viewerMgr = new ViewerManager(
          roomId,
          activePresenter.uid,
          currentUser.uid,
          (incomingStream) => {
            setRemoteStream(incomingStream);
            if (remoteVideoRef.current) {
              remoteVideoRef.current.srcObject = incomingStream;
            }
          }
        );
        viewerManagerRef.current = viewerMgr;
        viewerMgr.start();
      }
    } else {
      // Presenter stopped or I left
      if (viewerManagerRef.current) {
        viewerManagerRef.current.destroy();
        viewerManagerRef.current = null;
      }
      setRemoteStream(null);
    }
  }, [activePresenter, currentUser, roomId]);

  // Ensure remote stream is attached to video element if element mounts
  useEffect(() => {
    if (remoteStream && remoteVideoRef.current) {
      remoteVideoRef.current.srcObject = remoteStream;
    }
  }, [remoteStream]);

  // Determine Central Stage Display Mode
  useEffect(() => {
    if (isSharingScreen || (activePresenter && remoteStream)) {
      setStageMode('screenshare');
    } else if (roomData?.playbackState?.videoId) {
      setStageMode('youtube');
    } else {
      setStageMode('idle');
    }
  }, [isSharingScreen, activePresenter, remoteStream, roomData?.playbackState?.videoId]);

  // 7. Clean Leave Action
  const handleLeaveLounge = async () => {
    if (isSharingScreen) {
      await stopScreenShare();
    }

    if (viewerManagerRef.current) {
      viewerManagerRef.current.destroy();
      viewerManagerRef.current = null;
    }

    if (!currentUser || !roomId) {
      transitionRouter.push('/lounge');
      return;
    }

    try {
      const roomRef = doc(db, 'rooms', roomId);
      const participantRef = doc(db, 'rooms', roomId, 'participants', currentUser.uid);

      await runTransaction(db, async (transaction) => {
        const roomSnap = await transaction.get(roomRef);
        const currentCount = roomSnap.exists() ? roomSnap.data().participantCount || 1 : 1;

        transaction.update(roomRef, {
          participantCount: Math.max(0, currentCount - 1),
          updatedAt: serverTimestamp(),
        });
        transaction.delete(participantRef);
      });
    } catch (err) {
      console.warn('[The Lounge] Leave transaction fallback:', err);
      deleteDoc(doc(db, 'rooms', roomId, 'participants', currentUser.uid)).catch(() => {});
    } finally {
      isJoinedRef.current = false;
      transitionRouter.push('/lounge');
    }
  };

  // Best-effort beforeunload cleanup
  useEffect(() => {
    const handleBeforeUnload = () => {
      if (isJoinedRef.current && currentUser && roomId) {
        if (isSharingScreen) {
          stopScreenShare();
        }
        deleteDoc(doc(db, 'rooms', roomId, 'participants', currentUser.uid)).catch(() => {});
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [currentUser, roomId, isSharingScreen, stopScreenShare]);

  // Copy Invite Link
  const handleCopyInvite = () => {
    if (typeof window === 'undefined') return;
    const url = window.location.href;
    navigator.clipboard.writeText(url).then(() => {
      setCopiedInvite(true);
      setTimeout(() => setCopiedInvite(false), 2000);
    });
  };

  // Update Display Name
  const handleSaveName = (e) => {
    e.preventDefault();
    const clean = nameInput.trim().slice(0, 24);
    if (!clean || !currentUser || !roomId) return;

    setDisplayName(clean);
    setLoungeDisplayName(clean);
    setShowNameModal(false);

    const pRef = doc(db, 'rooms', roomId, 'participants', currentUser.uid);
    updateDoc(pRef, { displayName: clean }).catch(() => {});
  };

  // Render Error / Full State
  if (joinStatus === 'error' || joinStatus === 'not_found' || joinStatus === 'full') {
    return (
      <div className={styles.pageContainer}>
        <LoungeParticleCanvas />
        <main className={styles.landingMain} style={{ justifyContent: 'center', alignItems: 'center' }}>
          <div className={styles.card} style={{ maxWidth: 520, textAlign: 'center', alignItems: 'center' }}>
            <div className={styles.cardIcon} style={{ background: 'rgba(239, 68, 68, 0.15)', color: '#f87171' }}>
              ✕
            </div>
            <h2 className={styles.cardTitle}>
              {joinStatus === 'full' ? 'Lounge Full' : 'Connection Dropped'}
            </h2>
            <p className={styles.cardDesc}>{errorMessage}</p>
            <button
              type="button"
              className={styles.primaryBtn}
              onClick={() => transitionRouter.push('/lounge')}
            >
              Return to Lounge Lobby
            </button>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className={styles.pageContainer}>
      <LoungeParticleCanvas />
      <div className={styles.ambientGlowTop} aria-hidden="true" />
      <div className={styles.ambientGlowStage} aria-hidden="true" />

      {/* Edit Name Modal */}
      {showNameModal && (
        <div className={styles.modalBackdrop} role="dialog" aria-modal="true">
          <div className={styles.modalCard}>
            <h3 className={styles.modalTitle}>Update Callsign</h3>
            <form onSubmit={handleSaveName} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <input
                type="text"
                className={styles.inputCode}
                value={nameInput}
                onChange={(e) => setNameInput(e.target.value)}
                maxLength={24}
                required
                autoFocus
              />
              <div style={{ display: 'flex', gap: '0.6rem' }}>
                <button type="submit" className={styles.primaryBtn} style={{ flex: 1 }}>
                  Save
                </button>
                <button
                  type="button"
                  className={styles.secondaryBtn}
                  onClick={() => setShowNameModal(false)}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <main className={styles.roomMain}>
        {/* Room Top Bar Controls */}
        <header className={styles.roomTopBar}>
          <div className={styles.roomIdentity}>
            <span className={styles.roomCodeBadge}>STAGE: {roomId}</span>
            <div className={styles.slotCountBadge}>
              <span style={{ color: '#10b981' }}>●</span>
              <span>{activeParticipants.length} / 6 SLOTS</span>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
            <div className={styles.userHandleWrap}>
              <span>{displayName}</span>
              <button
                type="button"
                className={styles.userEditBtn}
                onClick={() => setShowNameModal(true)}
                title="Edit your display name"
                aria-label="Edit display name"
              >
                ✎
              </button>
            </div>

            <button
              type="button"
              className={styles.secondaryBtn}
              style={{ padding: '0.4rem 0.85rem', fontSize: '0.78rem' }}
              onClick={handleCopyInvite}
            >
              {copiedInvite ? '✓ Link Copied' : 'Invite Link'}
            </button>

            <button
              type="button"
              className={styles.leaveBtn}
              onClick={handleLeaveLounge}
            >
              Leave Stage
            </button>
          </div>
        </header>

        {/* Central Stage Arena */}
        <section className={styles.stageArena}>
          {/* Glowing Participant Orbs Ring */}
          <div className={styles.orbsContainer} role="region" aria-label="Lounge Participants">
            {participants.map((p) => {
              const initial = (p.displayName || 'G')[0].toUpperCase();
              const isRoomHost = p.uid === roomData?.hostUid;
              const isMe = p.uid === currentUser?.uid;

              return (
                <div key={p.id} className={styles.orbWrapper}>
                  <div
                    className={`${styles.participantOrb} ${
                      p.isTyping ? styles.orbTyping : ''
                    } ${p.isScreenSharing ? styles.orbPresenting : ''} ${
                      !p.isOnline ? styles.orbOffline : ''
                    }`}
                    style={{
                      borderColor: p.color || '#10b981',
                      boxShadow: p.isOnline ? `0 0 22px ${p.color || '#10b981'}44` : 'none',
                    }}
                    title={`${p.displayName} ${isRoomHost ? '(Host)' : ''} ${p.isScreenSharing ? '(Presenting)' : ''} ${!p.isOnline ? '(Away)' : ''}`}
                  >
                    <span>{initial}</span>
                  </div>

                  <div className={styles.orbLabel}>
                    {p.displayName} {isMe && '(you)'}
                  </div>

                  {isRoomHost && <span className={styles.orbHostTag}>HOST</span>}
                </div>
              );
            })}
          </div>

          {/* Central Stage Display */}
          <div className={styles.centralStageDisplay}>
            {stageMode === 'screenshare' ? (
              <div style={{ width: '100%', height: '100%', position: 'relative', background: '#000' }}>
                {isSharingScreen ? (
                  <video
                    ref={localVideoRef}
                    autoPlay
                    playsInline
                    muted
                    style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                  />
                ) : (
                  <video
                    ref={remoteVideoRef}
                    autoPlay
                    playsInline
                    style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                  />
                )}
                <div
                  style={{
                    position: 'absolute',
                    top: 12,
                    left: 12,
                    background: 'rgba(0, 0, 0, 0.75)',
                    padding: '0.3rem 0.65rem',
                    borderRadius: 6,
                    fontFamily: 'var(--font-mono, monospace)',
                    fontSize: '0.74rem',
                    color: '#60a5fa',
                    border: '1px solid rgba(96, 165, 250, 0.3)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.4rem',
                  }}
                >
                  <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#60a5fa' }} />
                  <span>
                    {isSharingScreen
                      ? 'BROADCASTING YOUR SCREEN'
                      : `STREAMING: ${activePresenter?.displayName || 'Peer'}`}
                  </span>
                </div>
              </div>
            ) : stageMode === 'youtube' ? (
              <LoungeYouTubePlayer
                roomId={roomId}
                isHost={isHost}
                playbackState={roomData?.playbackState}
              />
            ) : (
              <div className={styles.waitingStageVisual}>
                <div className={styles.waitingIcon}>
                  <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polygon points="5 3 19 12 5 21 5 3" />
                  </svg>
                </div>
                <h3 className={styles.stageHeading}>Virtual Stage Idle</h3>
                <p style={{ maxWidth: 460, fontSize: '0.85rem', lineHeight: 1.55 }}>
                  {isHost
                    ? 'You are the stage host. Stream your screen to all participants or load a synchronized YouTube listening session below.'
                    : 'Awaiting host broadcast. Relax, chat with participants, or explore the stage.'}
                </p>
              </div>
            )}
          </div>

          {/* Floating Action Dock */}
          <nav className={styles.floatingDock} aria-label="Stage actions">
            {/* Screen Share Button (Desktop-only, gracefully hidden on mobile) */}
            {canScreenShare && (
              <button
                type="button"
                className={`${styles.dockBtn} ${isSharingScreen ? styles.dockBtnActive : ''}`}
                onClick={isSharingScreen ? stopScreenShare : startScreenShare}
                disabled={activePresenter && activePresenter.uid !== currentUser?.uid}
                title={
                  activePresenter && activePresenter.uid !== currentUser?.uid
                    ? `${activePresenter.displayName} is currently presenting`
                    : isSharingScreen
                    ? 'Stop screen sharing'
                    : 'Share your screen with room'
                }
              >
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="2" y="3" width="20" height="14" rx="2" ry="2" />
                  <line x1="8" y1="21" x2="16" y2="21" />
                  <line x1="12" y1="17" x2="12" y2="21" />
                </svg>
                <span>{isSharingScreen ? 'Stop Sharing' : 'Share Screen'}</span>
              </button>
            )}

            {/* YouTube Watch Party Toggle (Host controls) */}
            {isHost && (
              <button
                type="button"
                className={`${styles.dockBtn} ${stageMode === 'youtube' ? styles.dockBtnActive : ''}`}
                onClick={() => {
                  if (stageMode === 'youtube') {
                    // Reset YouTube video
                    const roomRef = doc(db, 'rooms', roomId);
                    updateDoc(roomRef, {
                      playbackState: { videoId: '', isPlaying: false, positionSeconds: 0, updatedAt: serverTimestamp() },
                    }).catch(() => {});
                  } else {
                    // Prompt host with a sample music session
                    const roomRef = doc(db, 'rooms', roomId);
                    updateDoc(roomRef, {
                      playbackState: { videoId: 'jfKfPfyJRdk', isPlaying: true, positionSeconds: 0, updatedAt: serverTimestamp() }, // Lofi synth ambient
                    }).catch(() => {});
                  }
                }}
              >
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polygon points="5 3 19 12 5 21 5 3" />
                </svg>
                <span>{stageMode === 'youtube' ? 'Close YouTube' : 'YouTube Party'}</span>
              </button>
            )}

            {/* Chat Drawer Toggle */}
            <button
              type="button"
              className={`${styles.dockBtn} ${isChatOpen ? styles.dockBtnActive : ''}`}
              onClick={() => {
                setIsChatOpen(!isChatOpen);
                setUnreadChatCount(0);
              }}
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
              </svg>
              <span>Chat</span>
              {unreadChatCount > 0 && (
                <span style={{ background: '#10b981', color: '#000', borderRadius: '50%', padding: '1px 5px', fontSize: '0.65rem' }}>
                  {unreadChatCount}
                </span>
              )}
            </button>

            {/* Copy Invite Code */}
            <button
              type="button"
              className={styles.dockBtn}
              onClick={handleCopyInvite}
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
                <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
              </svg>
              <span>{copiedInvite ? 'Copied!' : 'Copy Invite'}</span>
            </button>
          </nav>
        </section>
      </main>

      {/* Chat Drawer */}
      <LoungeChat
        roomId={roomId}
        currentUser={currentUser}
        displayName={displayName}
        participants={participants}
        isOpen={isChatOpen}
        onClose={() => setIsChatOpen(false)}
        onNewMessage={() => {
          if (!isChatOpen) {
            setUnreadChatCount((prev) => prev + 1);
          }
        }}
      />
    </div>
  );
}
