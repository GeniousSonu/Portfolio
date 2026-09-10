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
import {
  db,
  ensureAnonymousAuth,
  initAppCheck,
  FIREBASE_CONSOLE_RULES_URL,
} from '@/lib/firebase/client';
import {
  getLoungeDisplayName,
  setLoungeDisplayName,
  addOrUpdateRoomHistory,
} from '@/lib/loungeHistory';
import { PresenterManager, ViewerManager, VoiceMeshManager, AUDIO_CONSTRAINTS } from '@/lib/webrtcStar';
import LoungeParticleCanvas from '@/components/LoungeParticleCanvas';
import LoungeChat from '@/components/LoungeChat';
import LoungeYouTubePlayer from '@/components/LoungeYouTubePlayer';
import { useOverlay } from '@/context/OverlayContext';
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
  const { activeOverlay } = useOverlay();

  // Duplicate Tab Prevention (BroadcastChannel)
  const myTabId = useRef(
    typeof crypto !== 'undefined' && crypto.randomUUID
      ? crypto.randomUUID()
      : `tab_${Math.random().toString(36).substring(2, 9)}_${Date.now()}`
  ).current;
  const [isDuplicateTab, setIsDuplicateTab] = useState(false);
  const [activeTabId, setActiveTabId] = useState(null);
  const activeTabIdRef = useRef(null);
  useEffect(() => {
    activeTabIdRef.current = activeTabId;
  }, [activeTabId]);
  const [duplicateProbeDone, setDuplicateProbeDone] = useState(false);
  const [switchFocusNotice, setSwitchFocusNotice] = useState(false);
  const isDuplicateTabRef = useRef(false);
  const broadcastChannelRef = useRef(null);

  // Connection State tracking for voice peers
  const [peerConnectionStates, setPeerConnectionStates] = useState({});

  // First-time Shortcut Hint Banner
  const [showShortcutHint, setShowShortcutHint] = useState(false);

  // Auth & Identity
  const [currentUser, setCurrentUser] = useState(null);
  const [displayName, setDisplayName] = useState('');
  const [showNameModal, setShowNameModal] = useState(false);
  const [nameInput, setNameInput] = useState('');

  // Room State
  const [roomData, setRoomData] = useState(null);
  const [participants, setParticipants] = useState([]);
  const [joinStatus, setJoinStatus] = useState('connecting'); // 'connecting' | 'joined' | 'duplicate_tab' | 'full' | 'error' | 'not_found'
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

  // WebRTC Voice Chat State (Mesh Topology with Speaking Glow & Per-Peer Moderation)
  const [inVoice, setInVoice] = useState(false);
  const [isMicMuted, setIsMicMuted] = useState(false);
  const [isDeafened, setIsDeafened] = useState(false);
  const [speakingMap, setSpeakingMap] = useState({}); // uid -> boolean
  const [locallyMutedPeers, setLocallyMutedPeers] = useState({}); // peerUid -> boolean
  const [autoMutedNotice, setAutoMutedNotice] = useState(false);

  const voiceMeshRef = useRef(null);
  const isVoiceActiveRef = useRef(false);
  const isMicMutedRef = useRef(false);

  // YouTube / Stage Mode
  const [stageMode, setStageMode] = useState('idle'); // 'idle' | 'screenshare' | 'youtube'
  const [showYouTubeInput, setShowYouTubeInput] = useState(false);

  // Chat & UI State
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [unreadChatCount, setUnreadChatCount] = useState(0);

  const handleNewMessage = useCallback(() => {
    if (!isChatOpen) {
      setUnreadChatCount((prev) => prev + 1);
    }
  }, [isChatOpen]);

  const heartbeatTimerRef = useRef(null);
  const isJoinedRef = useRef(false);
  const joinInProgressRef = useRef(false);

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

  // BroadcastChannel duplicate join detection scoped to lounge-room-${roomId}
  useEffect(() => {
    if (typeof window === 'undefined' || !('BroadcastChannel' in window) || !roomId) {
      setDuplicateProbeDone(true);
      return;
    }

    const channelName = `lounge-room-${roomId}`;
    const channel = new BroadcastChannel(channelName);
    broadcastChannelRef.current = channel;

    channel.onmessage = (event) => {
      const data = event.data;
      if (!data || typeof data !== 'object') return;

      // Case 1: Another tab asks if there is an active session in this room
      if (data.type === 'CHECK_EXISTING_SESSION') {
        if (data.tabId !== myTabId && (isJoinedRef.current || joinInProgressRef.current)) {
          channel.postMessage({
            type: 'SESSION_ACTIVE',
            targetTabId: data.tabId,
            activeTabId: myTabId,
          });
        }
      }

      // Case 2: We probed and another tab answered that it is already active
      if (data.type === 'SESSION_ACTIVE' && data.targetTabId === myTabId) {
        console.log('[The Lounge] Duplicate tab session detected in room:', roomId);
        isDuplicateTabRef.current = true;
        joinInProgressRef.current = false;
        setIsDuplicateTab(true);
        setActiveTabId(data.activeTabId);
        setJoinStatus('duplicate_tab');
      }

      // Case 3: A duplicate tab requested this active tab to focus
      if (data.type === 'REQUEST_FOCUS' && data.targetTabId === myTabId) {
        if (typeof window !== 'undefined') {
          window.focus();
        }
      }

      // Case 4: An active tab closed/left
      if (data.type === 'SESSION_LEFT' && data.senderTabId === activeTabIdRef.current) {
        setActiveTabId(null);
      }
    };

    // Probe for existing session
    channel.postMessage({ type: 'CHECK_EXISTING_SESSION', tabId: myTabId });

    // Allow 300ms for active tab to respond before proceeding to join
    const probeTimer = setTimeout(() => {
      setDuplicateProbeDone(true);
    }, 300);

    return () => {
      clearTimeout(probeTimer);
      if (isJoinedRef.current) {
        channel.postMessage({ type: 'SESSION_LEFT', senderTabId: myTabId });
      }
      try {
        channel.close();
      } catch {}
      broadcastChannelRef.current = null;
    };
  }, [roomId, myTabId]);

  const handleSwitchToExistingTab = () => {
    if (broadcastChannelRef.current && activeTabId) {
      broadcastChannelRef.current.postMessage({
        type: 'REQUEST_FOCUS',
        targetTabId: activeTabId,
      });
    }
    setSwitchFocusNotice(true);
    setTimeout(() => setSwitchFocusNotice(false), 3500);
  };

  const handleRetryJoin = () => {
    isDuplicateTabRef.current = false;
    setIsDuplicateTab(false);
    setActiveTabId(null);
    setJoinStatus('connecting');
  };

  // 2. Atomic Join Transaction & Room Verification
  const performJoinTransaction = useCallback(
    async (user, currentName) => {
      if (!roomId || !user || isJoinedRef.current || joinInProgressRef.current) return;
      joinInProgressRef.current = true;
      console.log('[COUNTER_DEBUG] Attempting join transaction for UID:', user.uid);

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

          // If already in room, refresh presence without incrementing
          if (participantSnap.exists()) {
            transaction.update(participantRef, {
              displayName: currentName,
              lastSeen: serverTimestamp(),
              expiresAt: Timestamp.fromMillis(Date.now() + 2 * 60 * 60 * 1000), // 2h TTL
            });
            return;
          }

          // Strict server-side cap: max 6 participants
          if (currentCount >= 6) {
            throw new Error('ROOM_FULL');
          }

          const color = ORB_COLORS[currentCount % ORB_COLORS.length];

          console.log('[COUNTER_DEBUG] Incrementing participantCount from', currentCount, 'to', currentCount + 1);
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
        joinInProgressRef.current = false;
        setJoinStatus('joined');
        addOrUpdateRoomHistory(roomId, 'Active');
      } catch (err) {
        joinInProgressRef.current = false;
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
        } else if (
          err?.code === 'permission-denied' ||
          (typeof err?.message === 'string' && err.message.toLowerCase().includes('permission'))
        ) {
          setJoinStatus('error');
          setErrorMessage(
            'Firestore Security Rules required. Please publish the project rules in Firebase Console.'
          );
        } else {
          setJoinStatus('error');
          setErrorMessage(err.message || 'Error joining lounge.');
        }
      }
    },
    [roomId]
  );

  // Run join once user and displayName are ready and duplicate check passed
  useEffect(() => {
    if (
      currentUser &&
      displayName &&
      joinStatus === 'connecting' &&
      duplicateProbeDone &&
      !isJoinedRef.current &&
      !joinInProgressRef.current &&
      !isDuplicateTabRef.current
    ) {
      performJoinTransaction(currentUser, displayName);
    }
  }, [currentUser, displayName, joinStatus, duplicateProbeDone, performJoinTransaction]);


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
    if (!roomId || !currentUser || joinStatus === 'duplicate_tab') return;

    const roomRef = doc(db, 'rooms', roomId);
    const unsubRoom = onSnapshot(
      roomRef,
      (snap) => {
        if (snap.exists()) {
          setRoomData({ id: snap.id, ...snap.data() });
        } else if (joinStatus === 'joined') {
          setJoinStatus('not_found');
          setErrorMessage('The host closed this lounge.');
        }
      },
      (err) => {
        console.warn('[The Lounge] Room snapshot notice:', err);
        if (err.code === 'permission-denied') {
          setJoinStatus('error');
          setErrorMessage(
            'Firestore Security Rules required. Please publish the project rules in Firebase Console.'
          );
        }
      }
    );

    const participantsCol = collection(db, 'rooms', roomId, 'participants');
    const unsubParticipants = onSnapshot(
      participantsCol,
      (snap) => {

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
  }, [roomId, currentUser, joinStatus, roomData?.hostUid]);

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

  // ── Voice Chat System (Mesh, Auto-Mute, Peer Mute, Speaking Glow) ──
  const handleJoinVoice = async () => {
    if (!currentUser || !roomId) return;
    try {
      const stream = await navigator.mediaDevices.getUserMedia(AUDIO_CONSTRAINTS);
      const voiceMgr = new VoiceMeshManager(roomId, currentUser.uid, stream, {
        onSpeakingChange: (uid, isSpeaking) => {
          setSpeakingMap((prev) => {
            if (prev[uid] === isSpeaking) return prev;
            return { ...prev, [uid]: isSpeaking };
          });
        },
        onPeerLeft: (peerUid) => {
          setSpeakingMap((prev) => {
            const next = { ...prev };
            delete next[peerUid];
            return next;
          });
        },
        onConnectionStateChange: (peerUid, iceState, connState) => {
          setPeerConnectionStates((prev) => {
            if (iceState === 'closed' && connState === 'closed') {
              const next = { ...prev };
              delete next[peerUid];
              return next;
            }
            return {
              ...prev,
              [peerUid]: { iceState, connState },
            };
          });
        },
      });

      voiceMeshRef.current = voiceMgr;
      setInVoice(true);
      isVoiceActiveRef.current = true;
      setIsMicMuted(false);
      isMicMutedRef.current = false;
      setIsDeafened(false);
      setAutoMutedNotice(false);

      // Connect to any participants already in voice
      if (Array.isArray(participants)) {
        const voicePeers = participants
          .filter((p) => p.inVoice && p.uid !== currentUser.uid)
          .map((p) => p.uid);
        voiceMgr.syncVoiceParticipants(voicePeers);
      }

      // Update Firestore participant presence doc
      const pRef = doc(db, 'rooms', roomId, 'participants', currentUser.uid);
      updateDoc(pRef, {
        inVoice: true,
        isMuted: false,
        isDeafened: false,
      }).catch(() => {});
    } catch (err) {
      console.error('[The Lounge Voice] Error accessing microphone:', err);
      alert('Microphone permission is required to join voice chat.');
    }
  };

  const handleLeaveVoice = useCallback(() => {
    if (voiceMeshRef.current) {
      voiceMeshRef.current.destroy();
      voiceMeshRef.current = null;
    }
    setInVoice(false);
    isVoiceActiveRef.current = false;
    setIsMicMuted(false);
    isMicMutedRef.current = false;
    setIsDeafened(false);
    setSpeakingMap({});
    setPeerConnectionStates({});
    setAutoMutedNotice(false);

    if (currentUser && roomId) {
      const pRef = doc(db, 'rooms', roomId, 'participants', currentUser.uid);
      updateDoc(pRef, {
        inVoice: false,
        isMuted: false,
        isDeafened: false,
      }).catch(() => {});
    }
  }, [currentUser, roomId]);

  const handleToggleMic = useCallback(() => {
    if (!voiceMeshRef.current) return;
    const nextMuted = !isMicMuted;
    voiceMeshRef.current.setLocalMuted(nextMuted);
    setIsMicMuted(nextMuted);
    isMicMutedRef.current = nextMuted;
    if (!nextMuted) {
      setAutoMutedNotice(false);
    }

    if (currentUser && roomId) {
      const pRef = doc(db, 'rooms', roomId, 'participants', currentUser.uid);
      updateDoc(pRef, { isMuted: nextMuted }).catch(() => {});
    }
  }, [isMicMuted, currentUser, roomId]);

  const handleToggleDeafen = useCallback(() => {
    if (!voiceMeshRef.current) return;
    const nextDeafened = !isDeafened;
    voiceMeshRef.current.setDeafened(nextDeafened);
    setIsDeafened(nextDeafened);
    if (nextDeafened) {
      setIsMicMuted(true);
      isMicMutedRef.current = true;
    }

    if (currentUser && roomId) {
      const pRef = doc(db, 'rooms', roomId, 'participants', currentUser.uid);
      updateDoc(pRef, {
        isDeafened: nextDeafened,
        isMuted: nextDeafened ? true : isMicMuted,
      }).catch(() => {});
    }
  }, [isDeafened, isMicMuted, currentUser, roomId]);

  const handleTogglePeerMute = (peerUid) => {
    if (!voiceMeshRef.current) return;
    const currentMuted = !!locallyMutedPeers[peerUid];
    const nextMuted = !currentMuted;
    voiceMeshRef.current.setPeerLocallyMuted(peerUid, nextMuted);
    setLocallyMutedPeers((prev) => ({
      ...prev,
      [peerUid]: nextMuted,
    }));
  };

  // One-time Keyboard Shortcut Hint Discovery Banner
  useEffect(() => {
    if (joinStatus === 'joined' && typeof window !== 'undefined') {
      const dismissed = localStorage.getItem('lounge_shortcuts_hint_dismissed');
      if (!dismissed) {
        setShowShortcutHint(true);
      }
    }
  }, [joinStatus]);

  const handleDismissShortcutHint = () => {
    setShowShortcutHint(false);
    if (typeof window !== 'undefined') {
      localStorage.setItem('lounge_shortcuts_hint_dismissed', 'true');
    }
  };

  // Global Keyboard Shortcuts (K = chat, M = mute, D = deafen, Escape = close)
  useEffect(() => {
    if (joinStatus !== 'joined') return;

    const handleKeyDown = (e) => {
      // Do NOT intercept if Command Palette is active or modifier keys (Cmd, Ctrl, Alt) are pressed
      if (activeOverlay === 'palette' || e.metaKey || e.ctrlKey || e.altKey) {
        return;
      }

      // Escape key: close chat or modal
      if (e.key === 'Escape') {
        if (isChatOpen) {
          e.preventDefault();
          document.activeElement?.blur?.();
          setIsChatOpen(false);
          return;
        }
        if (showNameModal) {
          e.preventDefault();
          document.activeElement?.blur?.();
          setShowNameModal(false);
          return;
        }
        return;
      }

      // Ignore if user is currently typing in an input, textarea, or contenteditable field
      const activeTag = document.activeElement?.tagName?.toUpperCase();
      const isTyping =
        activeTag === 'INPUT' ||
        activeTag === 'TEXTAREA' ||
        document.activeElement?.isContentEditable;
      if (isTyping) return;

      const key = e.key.toLowerCase();

      // K -> Toggle Lounge Chat
      if (key === 'k') {
        e.preventDefault();
        setIsChatOpen((prev) => !prev);
        setUnreadChatCount(0);
        return;
      }

      // M -> Toggle Mic Mute (while in voice)
      if (key === 'm') {
        e.preventDefault();
        if (inVoice) {
          handleToggleMic();
        }
        return;
      }

      // D -> Toggle Deafen (while in voice)
      if (key === 'd') {
        e.preventDefault();
        if (inVoice) {
          handleToggleDeafen();
        }
        return;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [joinStatus, activeOverlay, isChatOpen, showNameModal, inVoice, handleToggleMic, handleToggleDeafen]);

  // Visibilitychange listener: Automatically auto-mute mic when tab is backgrounded
  // Re-enabling ONLY happens upon return and explicit user unmute action
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'hidden') {
        if (isVoiceActiveRef.current && voiceMeshRef.current && !isMicMutedRef.current) {
          voiceMeshRef.current.setLocalMuted(true);
          setIsMicMuted(true);
          isMicMutedRef.current = true;
          setAutoMutedNotice(true);

          if (currentUser && roomId) {
            const pRef = doc(db, 'rooms', roomId, 'participants', currentUser.uid);
            updateDoc(pRef, { isMuted: true }).catch(() => {});
          }
        }
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [currentUser, roomId]);

  // Sync voice peer mesh when participants change
  useEffect(() => {
    if (inVoice && voiceMeshRef.current && Array.isArray(participants)) {
      const voicePeers = participants
        .filter((p) => p.inVoice && p.uid !== currentUser?.uid)
        .map((p) => p.uid);
      voiceMeshRef.current.syncVoiceParticipants(voicePeers);
    }
  }, [inVoice, participants, currentUser]);

  // Explicit Leave Room
  const handleLeaveLounge = async () => {
    if (!currentUser || !roomId) {
      transitionRouter.push('/lounge');
      return;
    }

    handleLeaveVoice();
    if (isSharingScreen) {
      stopScreenShare();
    }

    const roomRef = doc(db, 'rooms', roomId);
    const participantRef = doc(db, 'rooms', roomId, 'participants', currentUser.uid);

    try {
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

  // Cleanup on component unmount (e.g. Next.js router transitions)
  useEffect(() => {
    return () => {
      handleLeaveVoice();
      if (isJoinedRef.current && currentUser && roomId) {
        isJoinedRef.current = false;
        console.log('[COUNTER_DEBUG] Unmounting component, decrementing participantCount for UID:', currentUser.uid);
        const roomRef = doc(db, 'rooms', roomId);
        const participantRef = doc(db, 'rooms', roomId, 'participants', currentUser.uid);

        runTransaction(db, async (tx) => {
          const roomSnap = await tx.get(roomRef);
          if (roomSnap.exists()) {
            const count = roomSnap.data().participantCount || 1;
            console.log('[COUNTER_DEBUG] Decrementing participantCount from', count, 'to', Math.max(0, count - 1));
            tx.update(roomRef, {
              participantCount: Math.max(0, count - 1),
              updatedAt: serverTimestamp(),
            });
          }
          tx.delete(participantRef);
        }).catch((err) => {
          console.warn('[The Lounge] Unmount decrement fallback:', err);
          deleteDoc(participantRef).catch(() => {});
        });
      }
    };
  }, [currentUser, roomId, handleLeaveVoice]);

  // Host self-healing: automatically reconciles room participantCount if it drifts from live active participants
  useEffect(() => {
    if (currentUser && roomData?.hostUid === currentUser.uid && Array.isArray(participants)) {
      const activeCount = participants.filter((p) => p.isOnline).length;
      if (typeof roomData.participantCount === 'number' && roomData.participantCount !== activeCount && isJoinedRef.current) {
        console.log('[COUNTER_DEBUG] Host reconciling count. Stored:', roomData.participantCount, 'Actual active:', activeCount);
        const roomRef = doc(db, 'rooms', roomId);
        updateDoc(roomRef, {
          participantCount: activeCount,
          updatedAt: serverTimestamp(),
        }).catch(() => {});
      }
    }
  }, [currentUser, roomData?.hostUid, roomData?.participantCount, participants, roomId]);

  // Best-effort beforeunload & pagehide cleanup for tab/window close
  useEffect(() => {
    const handleUnloadCleanup = () => {
      handleLeaveVoice();
      if (isJoinedRef.current && currentUser && roomId) {
        if (isSharingScreen) {
          stopScreenShare();
        }
        deleteDoc(doc(db, 'rooms', roomId, 'participants', currentUser.uid)).catch(() => {});
      }
    };

    window.addEventListener('beforeunload', handleUnloadCleanup);
    window.addEventListener('pagehide', handleUnloadCleanup);
    return () => {
      window.removeEventListener('beforeunload', handleUnloadCleanup);
      window.removeEventListener('pagehide', handleUnloadCleanup);
    };
  }, [currentUser, roomId, isSharingScreen, stopScreenShare, handleLeaveVoice]);

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

  // Render Duplicate Tab State
  if (joinStatus === 'duplicate_tab') {
    return (
      <div className={styles.pageContainer}>
        <LoungeParticleCanvas />
        <main className={styles.landingMain} style={{ justifyContent: 'center', alignItems: 'center' }}>
          <div className={styles.duplicateTabCard}>
            <div className={styles.duplicateTabIcon}>📑</div>
            <h2 className={styles.cardTitle}>You're Already in this Room</h2>
            <p className={styles.cardDesc}>
              Another tab in this browser already has an active session in <strong>Stage {roomId}</strong>. Duplicate joins from the same browser profile are blocked to prevent audio loopback and duplicate presence.
            </p>
            {switchFocusNotice && (
              <div
                style={{
                  background: 'rgba(59, 130, 246, 0.15)',
                  border: '1px solid rgba(59, 130, 246, 0.35)',
                  borderRadius: '8px',
                  padding: '0.5rem 0.85rem',
                  fontSize: '0.78rem',
                  color: '#93c5fd',
                  fontFamily: 'var(--font-mono, monospace)',
                }}
              >
                Focus signal sent! If your browser prevented automatic tab switching, please click your other open tab.
              </div>
            )}
            <div className={styles.duplicateActions}>
              <button
                type="button"
                className={styles.primaryBtn}
                onClick={handleSwitchToExistingTab}
              >
                Switch to Active Tab
              </button>
              <button
                type="button"
                className={styles.secondaryBtn}
                onClick={() => transitionRouter.push('/lounge')}
              >
                Return to Lounge Lobby
              </button>
            </div>
            <p className={styles.duplicateHint}>
              Closed the other tab?{' '}
              <button type="button" className={styles.textBtn} onClick={handleRetryJoin}>
                Join from this tab
              </button>
            </p>
          </div>
        </main>
      </div>
    );
  }

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
            {errorMessage?.includes('Firestore Security Rules') && (
              <a
                href={FIREBASE_CONSOLE_RULES_URL}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.secondaryBtn}
                style={{
                  marginBottom: '1rem',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                  padding: '0.6rem 1.1rem',
                  fontSize: '0.82rem',
                }}
              >
                Open Firebase Console Rules ↗
              </a>
            )}
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

        {/* First-Time Keyboard Shortcuts Hint */}
        {showShortcutHint && (
          <div className={styles.shortcutHintBar} role="note" aria-label="Keyboard Shortcuts Tip">
            <div className={styles.shortcutKeysWrap}>
              <span>💡 Tip:</span>
              <span><kbd className={styles.shortcutKeyBadge}>K</kbd> Chat</span>
              <span>·</span>
              <span><kbd className={styles.shortcutKeyBadge}>M</kbd> Mute</span>
              <span>·</span>
              <span><kbd className={styles.shortcutKeyBadge}>D</kbd> Deafen</span>
              <span>·</span>
              <span><kbd className={styles.shortcutKeyBadge}>Esc</kbd> Close</span>
            </div>
            <button
              type="button"
              className={styles.shortcutDismissBtn}
              onClick={handleDismissShortcutHint}
              aria-label="Dismiss shortcut tip"
            >
              ✕
            </button>
          </div>
        )}

        {/* Central Stage Arena */}
        <section className={styles.stageArena}>
          {/* Glowing Participant Orbs Ring */}
          <div className={styles.orbsContainer} role="region" aria-label="Lounge Participants">
            {participants.map((p) => {
              const initial = (p.displayName || 'G')[0].toUpperCase();
              const isRoomHost = p.uid === roomData?.hostUid;
              const isMe = p.uid === currentUser?.uid;
              const isPeerSpeaking = !!speakingMap[p.uid];
              const isPeerInVoice = !!p.inVoice;
              const isPeerMicMuted = !!p.isMuted;
              const isLocallyMuted = !!locallyMutedPeers[p.uid];
              const peerConnInfo = peerConnectionStates[p.uid];
              const isPeerConnFailed =
                inVoice &&
                isPeerInVoice &&
                !isMe &&
                peerConnInfo &&
                (peerConnInfo.iceState === 'failed' ||
                  peerConnInfo.iceState === 'disconnected' ||
                  peerConnInfo.connState === 'failed' ||
                  peerConnInfo.connState === 'disconnected');

              return (
                <div key={p.id} className={styles.orbWrapper}>
                  <div
                    className={`${styles.participantOrb} ${
                      p.isTyping ? styles.orbTyping : ''
                    } ${p.isScreenSharing ? styles.orbPresenting : ''} ${
                      isPeerSpeaking ? styles.orbSpeakingGlow : ''
                    } ${!p.isOnline ? styles.orbOffline : ''}`}
                    style={{
                      borderColor: p.color || '#10b981',
                      boxShadow: p.isOnline ? `0 0 22px ${p.color || '#10b981'}44` : 'none',
                    }}
                    title={`${p.displayName} ${isRoomHost ? '(Host)' : ''} ${
                      p.isScreenSharing ? '(Presenting)' : ''
                    } ${
                      isPeerInVoice
                        ? isPeerConnFailed
                          ? `(Audio connection ${peerConnInfo?.iceState || peerConnInfo?.connState || 'issue'})`
                          : isPeerMicMuted
                          ? '(Voice Muted)'
                          : '(Speaking in Voice)'
                        : ''
                    } ${!p.isOnline ? '(Away)' : ''}`}
                  >
                    {/* Voice mic status badge on orb */}
                    {isPeerInVoice && (
                      <div
                        className={`${styles.orbVoiceBadge} ${
                          isPeerConnFailed
                            ? styles.orbVoiceBadgeFailed
                            : isPeerMicMuted
                            ? styles.orbVoiceBadgeMuted
                            : styles.orbVoiceBadgeActive
                        }`}
                        title={
                          isPeerConnFailed
                            ? `Audio connection issue (${peerConnInfo?.iceState || peerConnInfo?.connState || 'disconnected'})`
                            : isPeerMicMuted
                            ? 'Mic Muted'
                            : 'Mic Active'
                        }
                      >
                        {isPeerConnFailed ? '⚠️' : isPeerMicMuted ? '✕' : '🎙'}
                      </div>
                    )}
                    <span>{initial}</span>
                  </div>

                  <div className={styles.orbLabel}>
                    {p.displayName} {isMe && '(you)'}
                  </div>

                  {/* Local "Mute for me" toggle for remote peers in voice */}
                  {inVoice && isPeerInVoice && !isMe && (
                    <button
                      type="button"
                      className={`${styles.orbPeerMuteBtn} ${
                        isLocallyMuted ? styles.orbPeerMuteBtnMuted : ''
                      }`}
                      onClick={() => handleTogglePeerMute(p.uid)}
                      title={isLocallyMuted ? 'Muted for you (click to unmute)' : 'Mute this participant for you'}
                      aria-label={isLocallyMuted ? 'Unmute for me' : 'Mute for me'}
                    >
                      {isLocallyMuted ? '🔇 Muted' : '🔊 Mute'}
                    </button>
                  )}

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
                    ? 'You are the stage host. Stream your screen to all participants, start voice chat, or load a synchronized YouTube listening session below.'
                    : 'Awaiting host broadcast. Relax, chat with participants, or join voice chat.'}
                </p>
              </div>
            )}
          </div>

          {/* Background Auto-Muted Notification Banner */}
          {autoMutedNotice && inVoice && (
            <div className={styles.autoMutedBanner} role="status">
              <span>🎙️ Microphone was auto-muted while tab was backgrounded.</span>
              <button
                type="button"
                className={styles.autoMutedBannerBtn}
                onClick={handleToggleMic}
              >
                Unmute Now
              </button>
            </div>
          )}

          {/* Floating Action Dock */}
          <nav className={styles.floatingDock} aria-label="Stage actions">
            {/* Voice Chat Controls */}
            {!inVoice ? (
              <button
                type="button"
                className={styles.dockBtn}
                onClick={handleJoinVoice}
                title="Join real-time voice chat with room participants"
              >
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z" />
                  <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
                  <line x1="12" y1="19" x2="12" y2="22" />
                </svg>
                <span>Join Voice</span>
              </button>
            ) : (
              <>
                {/* Voice Connected Pill */}
                <div
                  className={`${styles.dockBtn} ${styles.dockVoiceActive}`}
                  title="Voice mesh active"
                  style={{ cursor: 'default' }}
                >
                  <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#10b981', display: 'inline-block' }} />
                  <span>Voice</span>
                </div>

                {/* Mic Mute / Unmute */}
                <button
                  type="button"
                  className={`${styles.dockBtn} ${isMicMuted ? styles.dockVoiceMuted : ''}`}
                  onClick={handleToggleMic}
                  title={isMicMuted ? 'Unmute microphone' : 'Mute microphone'}
                  aria-label={isMicMuted ? 'Unmute microphone' : 'Mute microphone'}
                >
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    {isMicMuted ? (
                      <>
                        <line x1="2" y1="2" x2="22" y2="22" />
                        <path d="M18.89 13.23A7.12 7.12 0 0 0 19 12v-2" />
                        <path d="M5 10v2a7 7 0 0 0 12 5" />
                        <path d="M15 9.34V5a3 3 0 0 0-5.68-1.33" />
                        <path d="M9 9v3a3 3 0 0 0 5.12 2.12" />
                        <line x1="12" y1="19" x2="12" y2="22" />
                      </>
                    ) : (
                      <>
                        <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z" />
                        <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
                        <line x1="12" y1="19" x2="12" y2="22" />
                      </>
                    )}
                  </svg>
                  <span>{isMicMuted ? 'Muted' : 'Mute'}</span>
                </button>

                {/* Deafen Toggle */}
                <button
                  type="button"
                  className={`${styles.dockBtn} ${isDeafened ? styles.dockVoiceDeafened : ''}`}
                  onClick={handleToggleDeafen}
                  title={isDeafened ? 'Undeafen (resume audio)' : 'Deafen (mute incoming audio)'}
                  aria-label={isDeafened ? 'Undeafen' : 'Deafen'}
                >
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M3 18v-6a9 9 0 0 1 18 0v6" />
                    <path d="M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3zM3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3z" />
                    {isDeafened && <line x1="2" y1="2" x2="22" y2="22" stroke="currentColor" strokeWidth="2.5" />}
                  </svg>
                  <span>{isDeafened ? 'Deafened' : 'Deafen'}</span>
                </button>

                {/* Leave Voice */}
                <button
                  type="button"
                  className={`${styles.dockBtn} ${styles.dockVoiceLeave}`}
                  onClick={handleLeaveVoice}
                  title="Disconnect from voice chat"
                  aria-label="Disconnect voice"
                >
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M10.68 13.31a16 16 0 0 0 3.41 2.6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7 2 2 0 0 1 1.72 2v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.42 19.42 0 0 1-6-6 19.8 19.8 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91" />
                    <line x1="23" y1="1" x2="1" y2="23" />
                  </svg>
                  <span>Disconnect</span>
                </button>
              </>
            )}
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
        onNewMessage={handleNewMessage}
      />

    </div>
  );
}
