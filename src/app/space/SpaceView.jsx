"use client";

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useTransitionRouter } from '@/context/TransitionContext';
import { useOverlay } from '@/context/OverlayContext';
import { computePosition, flip, shift, offset, autoUpdate } from '@floating-ui/dom';
import { supabase } from '@/lib/supabaseClient';
import { QRCodeSVG } from 'qrcode.react';
import {
  getRoomHistory,
  addOrUpdateRoomHistory,
  removeRoomFromHistory,
  checkRoomLimitStatus,
  updateRoomPreview,
  MAX_ACTIVE_ROOMS,
} from '@/lib/spaceHistory';
import styles from './space.module.css';

const MAX_CHARS = 5000;
const DEBOUNCE_DELAY_MS = 500;
const TURNSTILE_SITE_KEY =
  process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY || '1x00000000000000000000AA';

export default function SpaceView({ roomId = null }) {
  const router = useRouter();
  const transitionRouter = useTransitionRouter();
  const { activeOverlay, openOverlay, closeOverlay, closeAll } = useOverlay();

  // Overlay-coordinated modal visibilities
  const showRoomsDropdown = activeOverlay === 'space-rooms';
  const showJoinModal = activeOverlay === 'space-join';
  const showQrModal = activeOverlay === 'space-qr';

  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(true);
  const [savingStatus, setSavingStatus] = useState('Synced'); // 'Synced' | 'Saving...' | 'Conflict'
  const [viewerCount, setViewerCount] = useState(1);
  const [isConnected, setIsConnected] = useState(false);
  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const [isClearing, setIsClearing] = useState(false);
  const [dbError, setDbError] = useState(null);
  const [conflictNotice, setConflictNotice] = useState(null); // { remoteContent, remoteUpdatedAt }

  // Room states & modal controls
  const [isNotFoundRoom, setIsNotFoundRoom] = useState(false);
  const [isExpiredRoom, setIsExpiredRoom] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [roomUrl, setRoomUrl] = useState('');

  // Room history & creation states
  const [recentRooms, setRecentRooms] = useState([]);
  const [roomLimitAlert, setRoomLimitAlert] = useState(null);
  const [isCreatingRoom, setIsCreatingRoom] = useState(false);

  // Join by code modal state
  const [joinCodeInput, setJoinCodeInput] = useState('');
  const [joinCodeError, setJoinCodeError] = useState(null);
  const [isCheckingJoin, setIsCheckingJoin] = useState(false);

  // Turnstile human verification state (enforced ONLY for global scratchpad)
  const [sessionToken, setSessionToken] = useState(null);
  const [isVerified, setIsVerified] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);

  // Responsive device viewport state (mobile: <= 640px)
  const [isMobile, setIsMobile] = useState(false);

  // References
  const textareaRef = useRef(null);
  const turnstileContainerRef = useRef(null);
  const turnstileWidgetId = useRef(null);
  const debounceTimerRef = useRef(null);
  const isFocusedRef = useRef(false);
  const pendingRemoteUpdateRef = useRef(null);
  const lastKnownUpdatedAtRef = useRef(null);
  const clientIdRef = useRef(null);
  const roomsBtnRef = useRef(null);
  const dropdownMenuRef = useRef(null);

  // Detect mobile screen width
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 640);
    };
    handleResize();
    window.addEventListener('resize', handleResize, { passive: true });
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Initialize unique clientId per tab
  useEffect(() => {
    if (!clientIdRef.current) {
      clientIdRef.current =
        typeof crypto !== 'undefined' && crypto.randomUUID
          ? crypto.randomUUID()
          : `client-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
    }
  }, []);

  // Load visitor's recent room history from localStorage
  useEffect(() => {
    setRecentRooms(getRoomHistory());
  }, [roomId]);

  // Floating-UI popover positioning on desktop / tablet (> 640px)
  useEffect(() => {
    if (!showRoomsDropdown || isMobile || !roomsBtnRef.current || !dropdownMenuRef.current) return;
    const cleanup = autoUpdate(roomsBtnRef.current, dropdownMenuRef.current, () => {
      computePosition(roomsBtnRef.current, dropdownMenuRef.current, {
        placement: 'bottom-end',
        middleware: [
          offset(6),
          flip({ fallbackPlacements: ['bottom-start', 'top-end', 'top-start'] }),
          shift({ padding: 12 }),
        ],
      }).then(({ x, y }) => {
        if (dropdownMenuRef.current) {
          Object.assign(dropdownMenuRef.current.style, {
            position: 'fixed',
            left: `${Math.round(x)}px`,
            top: `${Math.round(y)}px`,
          });
        }
      });
    });
    return cleanup;
  }, [showRoomsDropdown, isMobile]);

  // Auto-close rooms dropdown on outside click (desktop/tablet only)
  useEffect(() => {
    if (!showRoomsDropdown || isMobile) return;
    const handleOutsideClick = (e) => {
      if (
        roomsBtnRef.current?.contains(e.target) ||
        dropdownMenuRef.current?.contains(e.target)
      ) {
        return;
      }
      closeOverlay('space-rooms');
    };
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, [showRoomsDropdown, isMobile, closeOverlay]);

  // Auto-resize textarea height
  const adjustTextareaHeight = useCallback(() => {
    const el = textareaRef.current;
    if (el) {
      el.style.height = 'auto';
      el.style.height = `${Math.max(380, el.scrollHeight)}px`;
    }
  }, []);

  // ── Session Verification (Turnstile) — Only active for Global Scratchpad ──
  useEffect(() => {
    if (roomId) return; // Dedicated rooms do not require Turnstile captcha
    const storedToken = sessionStorage.getItem('sks_space_session_token');
    if (storedToken) {
      setSessionToken(storedToken);
      setIsVerified(true);
    }
  }, [roomId]);

  // Initialize Turnstile widget when unverified on global scratchpad
  useEffect(() => {
    if (roomId || isVerified) return;

    const renderWidget = () => {
      if (
        window.turnstile &&
        turnstileContainerRef.current &&
        !turnstileWidgetId.current
      ) {
        try {
          turnstileWidgetId.current = window.turnstile.render(
            turnstileContainerRef.current,
            {
              sitekey: TURNSTILE_SITE_KEY,
              callback: async (token) => {
                setIsVerifying(true);
                try {
                  const res = await fetch('/api/space/verify', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ turnstileToken: token }),
                  });
                  const data = await res.json();
                  if (res.ok && data.sessionToken) {
                    sessionStorage.setItem('sks_space_session_token', data.sessionToken);
                    setSessionToken(data.sessionToken);
                    setIsVerified(true);
                  }
                } catch (e) {
                  console.warn('[Space Turnstile] Notice:', e.message);
                } finally {
                  setIsVerifying(false);
                }
              },
              'expired-callback': () => {},
              'error-callback': () => {},
              theme: 'dark',
              size: 'flexible',
            }
          );
        } catch (e) {}
      }
    };

    if (window.turnstile) {
      renderWidget();
    } else {
      const scriptId = 'cf-turnstile-script';
      if (!document.getElementById(scriptId)) {
        const script = document.createElement('script');
        script.id = scriptId;
        script.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit';
        script.async = true;
        script.defer = true;
        script.onload = renderWidget;
        document.head.appendChild(script);
      }
    }

    return () => {
      if (window.turnstile && turnstileWidgetId.current) {
        try {
          window.turnstile.remove(turnstileWidgetId.current);
          turnstileWidgetId.current = null;
        } catch (e) {}
      }
    };
  }, [roomId, isVerified]);

  // Room URL & Copy Handler
  useEffect(() => {
    if (typeof window !== 'undefined' && roomId) {
      setRoomUrl(`${window.location.origin}/space/${roomId}`);
    }
  }, [roomId]);

  const handleCopyLink = async () => {
    const urlToCopy =
      roomUrl || (typeof window !== 'undefined' ? `${window.location.origin}/space/${roomId}` : '');
    if (!urlToCopy) return;
    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(urlToCopy);
      } else {
        const el = document.createElement('textarea');
        el.value = urlToCopy;
        document.body.appendChild(el);
        el.select();
        document.execCommand('copy');
        document.body.removeChild(el);
      }
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    } catch (err) {
      console.warn('Copy link failed:', err);
    }
  };

  // ── Fetch Initial Document ──
  const fetchDocument = useCallback(async () => {
    setLoading(true);
    setIsNotFoundRoom(false);
    setIsExpiredRoom(false);
    try {
      const url = roomId ? `/api/space?roomId=${encodeURIComponent(roomId)}` : '/api/space';
      const res = await fetch(url);
      const data = await res.json();

      if (res.status === 404 || data.notFound) {
        setIsNotFoundRoom(true);
        return;
      }
      if (res.status === 410 || data.expired) {
        setIsExpiredRoom(true);
        return;
      }

      if (res.ok) {
        setContent(data.content || '');
        lastKnownUpdatedAtRef.current = data.updatedAt || null;
        setDbError(null);
        if (roomId) {
          // Record valid room visit in visitor's local history
          addOrUpdateRoomHistory(roomId, data.content || '');
          setRecentRooms(getRoomHistory());
        }
        setTimeout(adjustTextareaHeight, 50);
      } else if (data.error && data.error.includes('shared_space_document')) {
        setDbError(data.error);
      }
    } catch (e) {
      console.warn('[Space] Initial fetch warning:', e.message);
    } finally {
      setLoading(false);
    }
  }, [roomId, adjustTextareaHeight]);

  // ── Save Document (Debounced) ──
  const saveDocument = useCallback(
    async (textToSave) => {
      const isRoomMode = Boolean(roomId);
      const token = sessionStorage.getItem('sks_space_session_token') || sessionToken;

      // Global scratchpad requires Turnstile token; rooms are authenticated by existence & rate limit
      if (!isRoomMode && !token) {
        return;
      }

      setSavingStatus('Saving...');
      try {
        const headers = { 'Content-Type': 'application/json' };
        if (token) {
          headers['x-space-session-token'] = token;
        }

        const res = await fetch('/api/space', {
          method: 'POST',
          headers,
          body: JSON.stringify({
            content: textToSave,
            clientId: clientIdRef.current,
            lastKnownUpdatedAt: lastKnownUpdatedAtRef.current,
            ...(roomId ? { roomId } : {}),
          }),
        });

        const data = await res.json();

        if (res.status === 404 && data.notFound) {
          setIsNotFoundRoom(true);
          return;
        }

        if (res.status === 409 && data.conflict) {
          // Conflict detected: someone else saved while typing
          setSavingStatus('Conflict');
          setConflictNotice({
            remoteContent: data.currentContent || '',
            remoteUpdatedAt: data.updatedAt,
          });
          return;
        }

        if (res.status === 403 && data.code === 'TOKEN_EXPIRED') {
          sessionStorage.removeItem('sks_space_session_token');
          setSessionToken(null);
          setIsVerified(false);
          setSavingStatus('Verification needed');
          return;
        }

        if (res.ok) {
          lastKnownUpdatedAtRef.current = data.updatedAt;
          setSavingStatus('Synced');
          setConflictNotice(null);
          if (roomId) {
            updateRoomPreview(roomId, textToSave);
          }
        } else {
          setSavingStatus('Error');
        }
      } catch (err) {
        console.warn('[Space] Save error:', err.message);
        setSavingStatus('Error');
      }
    },
    [sessionToken, roomId]
  );

  // ── Realtime Channel Lifecycle (Swaps cleanly without stacking) ──
  useEffect(() => {
    let isSubscribed = true;
    fetchDocument();

    const channelName = roomId ? `space-room:${roomId}` : 'shared-space';
    const channelConfig = roomId
      ? {
          presence: { key: clientIdRef.current || 'visitor' },
        }
      : {
          private: true,
          presence: { key: clientIdRef.current || 'visitor' },
        };

    const channel = supabase.channel(channelName, {
      config: channelConfig,
    });

    // 1. Remote document updates
    channel.on('broadcast', { event: 'document-update' }, ({ payload }) => {
      if (!isSubscribed) return;
      if (!payload || payload.senderId === clientIdRef.current) return;

      if (isFocusedRef.current) {
        pendingRemoteUpdateRef.current = payload;
        return;
      }

      setContent(payload.content || '');
      lastKnownUpdatedAtRef.current = payload.updatedAt || null;
      setTimeout(adjustTextareaHeight, 30);
    });

    // 2. Document cleared event
    channel.on('broadcast', { event: 'document-cleared' }, ({ payload }) => {
      if (!isSubscribed) return;
      if (payload && payload.senderId === clientIdRef.current) return;
      setContent('');
      lastKnownUpdatedAtRef.current = payload?.updatedAt || null;
      setTimeout(adjustTextareaHeight, 30);
    });

    // 3. Visitor presence count
    channel.on('presence', { event: 'sync' }, () => {
      if (!isSubscribed) return;
      const state = channel.presenceState();
      const count = Object.keys(state).length;
      setViewerCount(Math.max(1, count));
    });

    channel.subscribe(async (status) => {
      if (!isSubscribed) return;
      if (status === 'SUBSCRIBED') {
        setIsConnected(true);
        await channel.track({ online_at: new Date().toISOString() });
      } else {
        setIsConnected(false);
      }
    });

    // 4. Tab visibility & online catch-up
    const handleOnline = () => {
      if (isSubscribed) fetchDocument();
    };
    const handleVisibility = () => {
      if (document.visibilityState === 'visible' && isSubscribed) {
        fetchDocument();
      }
    };

    window.addEventListener('online', handleOnline);
    document.addEventListener('visibilitychange', handleVisibility);

    // CLEANUP: Immediately unsubscribe and remove channel to prevent connection leaks
    return () => {
      isSubscribed = false;
      setIsConnected(false);
      window.removeEventListener('online', handleOnline);
      document.removeEventListener('visibilitychange', handleVisibility);
      supabase.removeChannel(channel);
    };
  }, [roomId, fetchDocument, adjustTextareaHeight]);

  // ── Typing Handler ──
  const handleChange = (e) => {
    const val = e.target.value.slice(0, MAX_CHARS);
    setContent(val);
    adjustTextareaHeight();

    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    setSavingStatus('Saving...');
    debounceTimerRef.current = setTimeout(() => {
      if (pendingRemoteUpdateRef.current) {
        const pending = pendingRemoteUpdateRef.current;
        pendingRemoteUpdateRef.current = null;
        if (pending.content !== val) {
          setConflictNotice({
            remoteContent: pending.content,
            remoteUpdatedAt: pending.updatedAt,
          });
          setSavingStatus('Conflict');
          return;
        }
      }

      saveDocument(val);
    }, DEBOUNCE_DELAY_MS);
  };

  // ── Conflict Resolution ──
  const handleApplyRemote = () => {
    if (conflictNotice?.remoteContent !== undefined) {
      setContent(conflictNotice.remoteContent);
      lastKnownUpdatedAtRef.current = conflictNotice.remoteUpdatedAt;
      setConflictNotice(null);
      setSavingStatus('Synced');
      setTimeout(adjustTextareaHeight, 50);
    }
  };

  const handleKeepMine = () => {
    setConflictNotice(null);
    saveDocument(content);
  };

  // ── Clear Scratchpad ──
  const handleConfirmClear = async () => {
    const isRoomMode = Boolean(roomId);
    const token = sessionStorage.getItem('sks_space_session_token') || sessionToken;
    if (!isRoomMode && !token) return;

    setIsClearing(true);
    try {
      const headers = { 'Content-Type': 'application/json' };
      if (token) headers['x-space-session-token'] = token;

      const res = await fetch('/api/space', {
        method: 'DELETE',
        headers,
        body: JSON.stringify({
          clientId: clientIdRef.current,
          ...(roomId ? { roomId } : {}),
        }),
      });

      if (res.ok) {
        const data = await res.json();
        setContent('');
        lastKnownUpdatedAtRef.current = data.updatedAt;
        setShowClearConfirm(false);
        setConflictNotice(null);
        if (roomId) {
          updateRoomPreview(roomId, '');
        }
        setTimeout(adjustTextareaHeight, 50);
      }
    } catch (e) {
      console.warn('[Space] Clear error:', e.message);
    } finally {
      setIsClearing(false);
    }
  };

  // ── Room Actions (Client-Side Transitions) ──
  const handleCreateRoomFromView = async () => {
    const limitStatus = checkRoomLimitStatus();
    if (limitStatus.limitReached) {
      setRoomLimitAlert(
        `Active room limit reached (${MAX_ACTIVE_ROOMS}/${MAX_ACTIVE_ROOMS}). Please open or remove an existing room below.`
      );
      openOverlay('space-rooms');
      return;
    }

    setIsCreatingRoom(true);
    setRoomLimitAlert(null);
    try {
      const res = await fetch('/api/space/room', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });
      const data = await res.json();
      if (res.ok && data.roomId) {
        addOrUpdateRoomHistory(data.roomId, '');
        setRecentRooms(getRoomHistory());
        closeOverlay('space-rooms');
        // Soft client navigation — NO full page reload
        transitionRouter.push(`/space/${data.roomId}`);
      } else {
        alert(data.error || 'Failed to create room.');
      }
    } catch (e) {
      console.warn('Room creation error:', e);
    } finally {
      setIsCreatingRoom(false);
    }
  };

  const handleSwitchRoom = (targetRoomId) => {
    closeOverlay('space-rooms');
    if (!targetRoomId) {
      transitionRouter.push('/space');
    } else if (targetRoomId !== roomId) {
      transitionRouter.push(`/space/${targetRoomId}`);
    }
  };

  const handleRemoveRoomFromDropdown = (e, targetRoomId) => {
    e.stopPropagation();
    const updated = removeRoomFromHistory(targetRoomId);
    setRecentRooms(updated);
    if (roomLimitAlert && updated.length < MAX_ACTIVE_ROOMS) {
      setRoomLimitAlert(null);
    }
  };

  // ── Join by Code Lookup (Validates existence before navigating) ──
  const handleJoinCodeSubmit = async (e) => {
    e.preventDefault();
    setJoinCodeError(null);
    const clean = joinCodeInput.trim().toLowerCase();
    if (!clean) return;

    if (!/^[a-z0-9_-]{4,16}$/.test(clean)) {
      setJoinCodeError('Invalid code. Room codes are 8 alphanumeric characters.');
      return;
    }

    setIsCheckingJoin(true);
    try {
      const res = await fetch(`/api/space/room?roomId=${encodeURIComponent(clean)}`);
      const data = await res.json();

      if (res.status === 404 || data.notFound) {
        setJoinCodeError("This room doesn't exist.");
        return;
      }
      if (res.status === 410 || data.expired) {
        setJoinCodeError('This room has expired after 48 hours of inactivity.');
        return;
      }

      if (res.ok && data.roomId) {
        addOrUpdateRoomHistory(data.roomId, data.content || '');
        setRecentRooms(getRoomHistory());
        closeOverlay('space-join');
        setJoinCodeInput('');
        transitionRouter.push(`/space/${data.roomId}`);
      }
    } catch (err) {
      setJoinCodeError('Could not verify room. Please check your network.');
    } finally {
      setIsCheckingJoin(false);
    }
  };

  // Helper for human-readable relative time
  const formatTimeAgo = (timestamp) => {
    if (!timestamp) return '';
    const diffSec = Math.floor((Date.now() - timestamp) / 1000);
    if (diffSec < 60) return 'just now';
    const diffMin = Math.floor(diffSec / 60);
    if (diffMin < 60) return `${diffMin}m ago`;
    const diffHour = Math.floor(diffMin / 60);
    if (diffHour < 24) return `${diffHour}h ago`;
    return `${Math.floor(diffHour / 24)}d ago`;
  };

  // ── Render Loading State (Prevents flash before room check completes) ──
  if (roomId && loading) {
    return (
      <main className={styles.container}>
        <div className={styles.inner}>
          <div className={styles.roomLoadingSkeleton}>
            <div className={styles.loadingSpinner} />
            <span>Connecting to sync room &ldquo;{roomId}&rdquo;...</span>
          </div>
        </div>
      </main>
    );
  }

  // ── Render 404 Not Found State ──
  if (isNotFoundRoom) {
    return (
      <main className={styles.container}>
        <div className={styles.inner}>
          <div className={styles.expiredCard}>
            <div className={styles.expiredIcon} aria-hidden="true">🔍</div>
            <h2 className={styles.expiredTitle}>This room doesn&rsquo;t exist</h2>
            <p className={styles.expiredDesc}>
              We couldn&rsquo;t find an active sync room with code &ldquo;{roomId}&rdquo;. It may have expired or was typed incorrectly.
            </p>
            <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', justifyContent: 'center' }}>
              <button
                type="button"
                className={styles.primaryCreateBtn}
                onClick={handleCreateRoomFromView}
                disabled={isCreatingRoom}
              >
                {isCreatingRoom ? 'Creating Room...' : 'Create a New Room Instead'}
              </button>
              <button
                type="button"
                className={styles.actionPillBtn}
                onClick={() => transitionRouter.push('/space')}
              >
                ← Return to Global Scratchpad
              </button>
            </div>
          </div>
        </div>
      </main>
    );
  }

  // ── Render 410 Expired State ──
  if (isExpiredRoom) {
    return (
      <main className={styles.container}>
        <div className={styles.inner}>
          <div className={styles.expiredCard}>
            <div className={styles.expiredIcon} aria-hidden="true">⏳</div>
            <h2 className={styles.expiredTitle}>Sync Room Expired</h2>
            <p className={styles.expiredDesc}>
              This sync room expired after 48 hours of inactivity to keep your shared data ephemeral and secure.
            </p>
            <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', justifyContent: 'center' }}>
              <button
                type="button"
                className={styles.primaryCreateBtn}
                onClick={handleCreateRoomFromView}
                disabled={isCreatingRoom}
              >
                {isCreatingRoom ? 'Creating Room...' : 'Create a New Room Instead'}
              </button>
              <button
                type="button"
                className={styles.actionPillBtn}
                onClick={() => transitionRouter.push('/space')}
              >
                ← Return to Global Scratchpad
              </button>
            </div>
          </div>
        </div>
      </main>
    );
  }

  const isRoomMode = Boolean(roomId);

  return (
    <main className={styles.container}>
      <div className={styles.inner}>
        {/* ─── Back Navigation (if in a room) ─── */}
        {isRoomMode && (
          <div>
            <button
              type="button"
              className={styles.backNavBtn}
              onClick={() => transitionRouter.push('/space')}
              aria-label="Back to Global Scratchpad"
            >
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="19" y1="12" x2="5" y2="12" />
                <polyline points="12 19 5 12 12 5" />
              </svg>
              Global Scratchpad
            </button>
          </div>
        )}

        {/* ─── Header ─── */}
        <header className={styles.header}>
          <div className={styles.headerTop}>
            <div className={styles.headerIdentity}>
              <h1 className={styles.title}>Space</h1>
              {isRoomMode ? (
                <div className={styles.roomBadgeGroup}>
                  <div className={styles.roomBadge}>
                    <span>ROOM</span>
                    <span className={styles.roomCode}>{roomId}</span>
                  </div>
                  <span className={styles.roomTtl}>• 48h auto-expire</span>
                </div>
              ) : (
                <p className={styles.subtitle}>
                  Public Collaborative Scratchpad
                </p>
              )}
            </div>

            {/* Live Presence Indicator — quiet, small, and pinned in header top */}
            <div className={styles.presenceBadge}>
              <span
                className={`${styles.presenceDot} ${
                  !isConnected ? styles.presenceDotOffline : ''
                }`}
                aria-hidden="true"
              />
              <span>{viewerCount} {viewerCount === 1 ? 'VIEWING' : 'VIEWING'}</span>
            </div>
          </div>

          <div className={styles.headerActionsBar}>
            {/* Rooms Switcher Button & Desktop Popover */}
            <div className={styles.roomsDropdownContainer}>
              <button
                ref={roomsBtnRef}
                type="button"
                className={`${styles.roomsToggleBtn} ${showRoomsDropdown ? styles.roomsToggleBtnActive : ''}`}
                onClick={() => {
                  if (showRoomsDropdown) {
                    closeOverlay('space-rooms');
                  } else {
                    openOverlay('space-rooms');
                  }
                }}
                aria-label="Toggle recent sync rooms"
                aria-expanded={showRoomsDropdown}
              >
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="3" width="7" height="7" />
                  <rect x="14" y="3" width="7" height="7" />
                  <rect x="14" y="14" width="7" height="7" />
                  <rect x="3" y="14" width="7" height="7" />
                </svg>
                <span>Rooms</span>
                {recentRooms.length > 0 && (
                  <span className={styles.roomsBadgeCount}>{recentRooms.length}</span>
                )}
              </button>

              {/* Desktop / Tablet Anchored Dropdown with @floating-ui/dom boundary detection */}
              {showRoomsDropdown && !isMobile && (
                <div
                  ref={dropdownMenuRef}
                  className={styles.roomsDropdownMenu}
                  role="menu"
                  aria-label="Your Sync Rooms"
                  data-lenis-prevent="true"
                >
                  <div className={styles.roomsDropdownHeader}>
                    <span className={styles.roomsDropdownTitle}>Your Sync Rooms</span>
                    <span>{recentRooms.length}/{MAX_ACTIVE_ROOMS}</span>
                  </div>

                  {roomLimitAlert && (
                    <div className={styles.roomLimitAlertBox}>
                      {roomLimitAlert}
                    </div>
                  )}

                  <div className={styles.roomsList} data-lenis-prevent="true">
                    {recentRooms.length === 0 ? (
                      <div className={styles.emptyRoomsNote}>
                        No recent rooms. Create one below to sync across devices.
                      </div>
                    ) : (
                      recentRooms.map((r) => {
                        const isActive = roomId === r.roomId;
                        return (
                          <div
                            key={r.roomId}
                            className={`${styles.roomListItem} ${isActive ? styles.roomListItemActive : ''}`}
                            onClick={() => handleSwitchRoom(r.roomId)}
                            role="menuitem"
                            tabIndex={0}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') handleSwitchRoom(r.roomId);
                            }}
                          >
                            <div className={styles.roomItemInfo}>
                              <div className={styles.roomItemHeader}>
                                <span className={styles.roomItemCode}>{r.roomId}</span>
                                {isActive && <span className={styles.roomItemActiveDot} title="Current Room" />}
                                <span className={styles.roomItemTime}>{formatTimeAgo(r.lastVisitedAt)}</span>
                              </div>
                              {r.preview && (
                                <span className={styles.roomItemSnippet}>
                                  &ldquo;{r.preview}&rdquo;
                                </span>
                              )}
                            </div>
                            <button
                              type="button"
                              className={styles.roomItemDeleteBtn}
                              onClick={(e) => handleRemoveRoomFromDropdown(e, r.roomId)}
                              title="Forget room from list"
                              aria-label={`Forget room ${r.roomId}`}
                            >
                              &times;
                            </button>
                          </div>
                        );
                      })
                    )}
                  </div>

                  <div className={styles.roomsDropdownFooter}>
                    <button
                      type="button"
                      className={styles.roomsFooterActionBtn}
                      onClick={handleCreateRoomFromView}
                      disabled={isCreatingRoom || recentRooms.length >= MAX_ACTIVE_ROOMS}
                    >
                      <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="12" y1="5" x2="12" y2="19" />
                        <line x1="5" y1="12" x2="19" y2="12" />
                      </svg>
                      {isCreatingRoom ? 'Creating...' : recentRooms.length >= MAX_ACTIVE_ROOMS ? 'Room Limit (5/5) Reached' : '+ New Sync Room'}
                    </button>

                    {isRoomMode && (
                      <button
                        type="button"
                        className={styles.roomsFooterActionBtn}
                        onClick={() => handleSwitchRoom(null)}
                        style={{ color: '#94a3b8' }}
                      >
                        Global Scratchpad
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Room Actions */}
            {isRoomMode ? (
              <div className={styles.roomActions}>
                <button
                  type="button"
                  className={styles.actionPillBtn}
                  onClick={handleCopyLink}
                  aria-label="Copy room share link"
                >
                  {copiedLink ? (
                    <>
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                      <span>Copied!</span>
                    </>
                  ) : (
                    <>
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>
                      <span>Share Link</span>
                    </>
                  )}
                </button>
                <button
                  type="button"
                  className={styles.actionPillBtn}
                  onClick={() => openOverlay('space-qr')}
                  aria-label="Show QR code for phone scanning"
                >
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>
                  <span>QR Code</span>
                </button>
              </div>
            ) : (
              <div className={styles.roomActions}>
                <button
                  type="button"
                  className={styles.primaryNewRoomBtn}
                  onClick={handleCreateRoomFromView}
                  disabled={isCreatingRoom}
                >
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="12" y1="5" x2="12" y2="19" />
                    <line x1="5" y1="12" x2="19" y2="12" />
                  </svg>
                  <span>{isCreatingRoom ? 'Creating...' : '+ New Sync Room'}</span>
                </button>
                <button
                  type="button"
                  className={styles.secondaryJoinBtn}
                  onClick={() => openOverlay('space-join')}
                  aria-label="Join room by code"
                >
                  Join Code
                </button>
              </div>
            )}
          </div>
        </header>

        {/* ─── Mobile Bottom Sheet Modal for Rooms List (<= 640px) ─── */}
        {showRoomsDropdown && isMobile && (
          <div
            className={styles.sheetBackdrop}
            onClick={() => closeOverlay('space-rooms')}
            role="dialog"
            aria-modal="true"
            aria-label="Your Sync Rooms"
          >
            <div
              className={styles.sheetContainer}
              onClick={(e) => e.stopPropagation()}
              data-lenis-prevent="true"
            >
              <div className={styles.sheetHandleBar} aria-hidden="true">
                <span className={styles.sheetHandle} />
              </div>

              <div className={styles.sheetHeader}>
                <div className={styles.sheetTitleGroup}>
                  <span className={styles.sheetTitle}>Your Sync Rooms</span>
                  <span className={styles.sheetBadge}>{recentRooms.length}/{MAX_ACTIVE_ROOMS}</span>
                </div>
                <button
                  type="button"
                  className={styles.sheetCloseBtn}
                  onClick={() => closeOverlay('space-rooms')}
                  aria-label="Close rooms panel"
                >
                  &times;
                </button>
              </div>

              {roomLimitAlert && (
                <div className={styles.roomLimitAlertBox}>
                  {roomLimitAlert}
                </div>
              )}

              <div className={styles.sheetList} data-lenis-prevent="true">
                {recentRooms.length === 0 ? (
                  <div className={styles.emptyRoomsNote}>
                    No recent rooms. Create one below to sync across devices.
                  </div>
                ) : (
                  recentRooms.map((r) => {
                    const isActive = roomId === r.roomId;
                    return (
                      <div
                        key={r.roomId}
                        className={`${styles.roomListItem} ${isActive ? styles.roomListItemActive : ''}`}
                        onClick={() => handleSwitchRoom(r.roomId)}
                        role="menuitem"
                        tabIndex={0}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') handleSwitchRoom(r.roomId);
                        }}
                      >
                        <div className={styles.roomItemInfo}>
                          <div className={styles.roomItemHeader}>
                            <span className={styles.roomItemCode}>{r.roomId}</span>
                            {isActive && <span className={styles.roomItemActiveDot} title="Current Room" />}
                            <span className={styles.roomItemTime}>{formatTimeAgo(r.lastVisitedAt)}</span>
                          </div>
                          {r.preview && (
                            <span className={styles.roomItemSnippet}>
                              &ldquo;{r.preview}&rdquo;
                            </span>
                          )}
                        </div>
                        <button
                          type="button"
                          className={styles.roomItemDeleteBtn}
                          onClick={(e) => handleRemoveRoomFromDropdown(e, r.roomId)}
                          title="Forget room from list"
                          aria-label={`Forget room ${r.roomId}`}
                        >
                          &times;
                        </button>
                      </div>
                    );
                  })
                )}
              </div>

              <div className={styles.sheetFooter}>
                <button
                  type="button"
                  className={styles.sheetActionPrimaryBtn}
                  onClick={handleCreateRoomFromView}
                  disabled={isCreatingRoom || recentRooms.length >= MAX_ACTIVE_ROOMS}
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="12" y1="5" x2="12" y2="19" />
                    <line x1="5" y1="12" x2="19" y2="12" />
                  </svg>
                  {isCreatingRoom ? 'Creating Room...' : recentRooms.length >= MAX_ACTIVE_ROOMS ? 'Room Limit (5/5) Reached' : '+ New Sync Room'}
                </button>

                {isRoomMode && (
                  <button
                    type="button"
                    className={styles.sheetActionSecondaryBtn}
                    onClick={() => handleSwitchRoom(null)}
                  >
                    Global Scratchpad
                  </button>
                )}
              </div>
            </div>
          </div>
        )}

        {/* ─── Join with Code Modal ─── */}
        {showJoinModal && (
          <div
            className={styles.modalBackdrop}
            onClick={() => closeOverlay('space-join')}
            role="dialog"
            aria-modal="true"
            aria-label="Join sync room by code"
          >
            <div
              className={styles.qrModalCard}
              onClick={(e) => e.stopPropagation()}
              style={{ maxWidth: '380px' }}
              data-lenis-prevent="true"
            >
              <button
                type="button"
                className={styles.qrModalClose}
                onClick={() => closeOverlay('space-join')}
                aria-label="Close modal"
              >
                &times;
              </button>
              <h3 className={styles.qrModalTitle}>Join a Sync Room</h3>
              <p className={styles.qrModalSubtitle}>
                Enter an existing 8-character room code to join its collaborative scratchpad.
              </p>

              <form onSubmit={handleJoinCodeSubmit} style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                <input
                  type="text"
                  value={joinCodeInput}
                  onChange={(e) => {
                    setJoinCodeInput(e.target.value);
                    if (joinCodeError) setJoinCodeError(null);
                  }}
                  placeholder="e.g. wr62hgnm"
                  maxLength={16}
                  disabled={isCheckingJoin}
                  className={`${styles.joinCodeInput} ${joinCodeError ? styles.joinCodeInputError : ''}`}
                  aria-label="Room code"
                  autoFocus
                />

                {joinCodeError && (
                  <div style={{ fontSize: '0.76rem', color: '#fca5a5', textAlign: 'center' }}>
                    {joinCodeError}
                  </div>
                )}

                <button
                  type="submit"
                  className={styles.primaryCreateBtn}
                  disabled={!joinCodeInput.trim() || isCheckingJoin}
                  style={{ width: '100%', justifyContent: 'center' }}
                >
                  {isCheckingJoin ? 'Checking...' : 'Join Room →'}
                </button>
              </form>
            </div>
          </div>
        )}

        {/* ─── QR Code Modal ─── */}
        {showQrModal && (
          <div
            className={styles.modalBackdrop}
            onClick={() => closeOverlay('space-qr')}
            role="dialog"
            aria-modal="true"
            aria-label="Scan QR Code to join sync room"
          >
            <div
              className={styles.qrModalCard}
              onClick={(e) => e.stopPropagation()}
              data-lenis-prevent="true"
            >
              <button
                type="button"
                className={styles.qrModalClose}
                onClick={() => closeOverlay('space-qr')}
                aria-label="Close QR Modal"
              >
                &times;
              </button>
              <h3 className={styles.qrModalTitle}>Scan with Phone Camera</h3>
              <p className={styles.qrModalSubtitle}>
                Instantly opens this sync room on mobile — zero logins or apps needed.
              </p>
              <div className={styles.qrCodeWrapper}>
                <QRCodeSVG
                  value={roomUrl || (typeof window !== 'undefined' ? `${window.location.origin}/space/${roomId}` : '')}
                  size={180}
                  level="M"
                  includeMargin={false}
                />
              </div>
              <div className={styles.qrUrlBox}>
                <span className={styles.qrUrlText}>
                  {roomUrl || (typeof window !== 'undefined' ? `${window.location.origin}/space/${roomId}` : '')}
                </span>
                <button
                  type="button"
                  className={styles.actionPillBtn}
                  onClick={handleCopyLink}
                  style={{ padding: '0.3rem 0.65rem', fontSize: '0.74rem', minHeight: '38px' }}
                >
                  {copiedLink ? 'Copied' : 'Copy'}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ─── Database Migration Notice (If Needed) ─── */}
        {dbError && (
          <div className={styles.noticeBanner} role="alert">
            <span>⚠️ {dbError}</span>
          </div>
        )}

        {/* ─── Conflict Notice Banner ─── */}
        {conflictNotice && (
          <div className={styles.noticeBanner} role="alert">
            <span>Someone else made edits while you were typing.</span>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <button
                type="button"
                className={styles.noticeActionBtn}
                onClick={handleApplyRemote}
              >
                Load latest
              </button>
              <button
                type="button"
                className={styles.noticeActionBtn}
                onClick={handleKeepMine}
              >
                Keep mine
              </button>
            </div>
          </div>
        )}

        {/* ─── Turnstile Gate (ONLY for Global Scratchpad) ─── */}
        {!isRoomMode && !isVerified && (
          <div className={styles.turnstileGate}>
            <p className={styles.gateText}>
              {isVerifying ? 'Verifying session...' : 'Verify once to join the live collaborative scratchpad'}
            </p>
            <div ref={turnstileContainerRef} aria-label="Human verification challenge" />
          </div>
        )}

        {/* ─── Collaborative Card Workspace ─── */}
        <div className={styles.card}>
          {/* Card Top Bar */}
          <div className={styles.cardHeader}>
            <span className={styles.cardLabel}>
              {isRoomMode ? `Sync Room • ${roomId}` : 'Live Scratchpad'}
            </span>
            <div className={styles.cardActions}>
              {showClearConfirm ? (
                <div className={styles.inlineConfirm}>
                  <span>Clear it?</span>
                  <button
                    type="button"
                    className={styles.inlineConfirmBtn}
                    onClick={handleConfirmClear}
                    disabled={isClearing}
                  >
                    {isClearing ? 'clearing...' : 'confirm'}
                  </button>
                  <button
                    type="button"
                    className={styles.inlineCancelBtn}
                    onClick={() => setShowClearConfirm(false)}
                    disabled={isClearing}
                  >
                    cancel
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  className={styles.clearIconBtn}
                  onClick={() => setShowClearConfirm(true)}
                  aria-label="Clear shared scratchpad"
                  title="Clear scratchpad"
                  disabled={(!isRoomMode && !isVerified) || !content}
                >
                  &times;
                </button>
              )}
            </div>
          </div>

          {/* Collaborative Textarea */}
          <textarea
            ref={textareaRef}
            className={styles.textarea}
            value={content}
            data-lenis-prevent="true"
            onChange={handleChange}
            onFocus={() => {
              isFocusedRef.current = true;
            }}
            onBlur={() => {
              isFocusedRef.current = false;
              if (pendingRemoteUpdateRef.current) {
                const pending = pendingRemoteUpdateRef.current;
                pendingRemoteUpdateRef.current = null;
                setContent(pending.content || '');
                lastKnownUpdatedAtRef.current = pending.updatedAt || null;
                setTimeout(adjustTextareaHeight, 30);
              }
            }}
            placeholder={
              loading
                ? 'Loading document...'
                : !isRoomMode && !isVerified
                ? 'Verify above to type in the global scratchpad...'
                : isRoomMode
                ? `Start typing... updates sync live across all devices in room "${roomId}".`
                : 'Start typing... updates sync live for everyone on this page.'
            }
            disabled={!isRoomMode && !isVerified}
            maxLength={MAX_CHARS}
            spellCheck="false"
            aria-label="Shared collaborative scratchpad text area"
          />

          {/* Card Bottom Bar */}
          <div className={styles.cardFooter}>
            <div className={styles.statusIndicator}>
              <span className={savingStatus === 'Saving...' ? styles.savingText : ''}>
                {savingStatus}
              </span>
            </div>
            <div
              className={`${styles.counter} ${
                content.length > 4500 ? styles.counterWarn : ''
              }`}
            >
              {content.length.toLocaleString()} / {MAX_CHARS.toLocaleString()}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
