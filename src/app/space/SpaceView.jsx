"use client";

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { QRCodeSVG } from 'qrcode.react';
import styles from './space.module.css';

const MAX_CHARS = 5000;
const DEBOUNCE_DELAY_MS = 500;
const TURNSTILE_SITE_KEY =
  process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY || '1x00000000000000000000AA';

export default function SpaceView({ roomId = null }) {
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(true);
  const [savingStatus, setSavingStatus] = useState('Synced'); // 'Synced' | 'Saving...' | 'Conflict'
  const [viewerCount, setViewerCount] = useState(1);
  const [isConnected, setIsConnected] = useState(false);
  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const [isClearing, setIsClearing] = useState(false);
  const [dbError, setDbError] = useState(null);
  const [conflictNotice, setConflictNotice] = useState(null); // { remoteContent, remoteUpdatedAt }

  // Room states (for /space/[roomId])
  const [isNotFoundRoom, setIsNotFoundRoom] = useState(false);
  const [isExpiredRoom, setIsExpiredRoom] = useState(false);
  const [showQrModal, setShowQrModal] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [roomUrl, setRoomUrl] = useState('');

  // Turnstile human verification state
  const [sessionToken, setSessionToken] = useState(null);
  const [isVerified, setIsVerified] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);

  // References
  const textareaRef = useRef(null);
  const turnstileContainerRef = useRef(null);
  const turnstileWidgetId = useRef(null);
  const debounceTimerRef = useRef(null);
  const isFocusedRef = useRef(false);
  const pendingRemoteUpdateRef = useRef(null);
  const lastKnownUpdatedAtRef = useRef(null);
  const clientIdRef = useRef(null);

  // Initialize unique clientId per tab
  useEffect(() => {
    if (!clientIdRef.current) {
      clientIdRef.current =
        typeof crypto !== 'undefined' && crypto.randomUUID
          ? crypto.randomUUID()
          : `client-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
    }
  }, []);

  // Auto-resize textarea height
  const adjustTextareaHeight = useCallback(() => {
    const el = textareaRef.current;
    if (el) {
      el.style.height = 'auto';
      el.style.height = `${Math.max(380, el.scrollHeight)}px`;
    }
  }, []);

  // ── Session Verification (Turnstile) ──
  useEffect(() => {
    // Check if a valid session token exists in sessionStorage (survives tab refreshes)
    const storedToken = sessionStorage.getItem('sks_space_session_token');
    if (storedToken) {
      setSessionToken(storedToken);
      setIsVerified(true);
    }
  }, []);

  // Initialize Turnstile widget when unverified
  useEffect(() => {
    if (isVerified) return;

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
                  console.warn('[Space Turnstile] Verification notice:', e.message);
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
  }, [isVerified]);

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
    try {
      const url = roomId ? `/api/space?roomId=${encodeURIComponent(roomId)}` : '/api/space';
      const res = await fetch(url);
      const data = await res.json();

      if (res.status === 404 && data.notFound) {
        setIsNotFoundRoom(true);
        return;
      }
      if (res.status === 410 && data.expired) {
        setIsExpiredRoom(true);
        return;
      }

      if (res.ok) {
        setContent(data.content || '');
        lastKnownUpdatedAtRef.current = data.updatedAt || null;
        setDbError(null);
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
      const token = sessionStorage.getItem('sks_space_session_token') || sessionToken;
      if (!token) return;

      setSavingStatus('Saving...');
      try {
        const res = await fetch('/api/space', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-space-session-token': token,
          },
          body: JSON.stringify({
            content: textToSave,
            clientId: clientIdRef.current,
            lastKnownUpdatedAt: lastKnownUpdatedAtRef.current,
            ...(roomId ? { roomId } : {}),
          }),
        });

        const data = await res.json();

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
          // Silent session renewal: prompt Turnstile without losing typed content
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

  // ── Realtime Setup with Presence & Cursor Jump Protection ──
  useEffect(() => {
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

    // 1. Listen for remote document updates
    channel.on('broadcast', { event: 'document-update' }, ({ payload }) => {
      if (!payload || payload.senderId === clientIdRef.current) {
        return; // Ignore own typing echoes to prevent cursor resets
      }

      // Cursor Stability Check:
      // If user is currently focused/typing in textarea, DO NOT reset their cursor!
      // Queue update and let conflict resolution evaluate upon typing pause.
      if (isFocusedRef.current) {
        pendingRemoteUpdateRef.current = payload;
        return;
      }

      // Otherwise apply remote update cleanly
      setContent(payload.content || '');
      lastKnownUpdatedAtRef.current = payload.updatedAt || null;
      setTimeout(adjustTextareaHeight, 30);
    });

    // 2. Listen for document cleared event
    channel.on('broadcast', { event: 'document-cleared' }, ({ payload }) => {
      if (payload && payload.senderId === clientIdRef.current) return;
      setContent('');
      lastKnownUpdatedAtRef.current = payload?.updatedAt || null;
      setTimeout(adjustTextareaHeight, 30);
    });

    // 3. Track visitor presence
    channel.on('presence', { event: 'sync' }, () => {
      const state = channel.presenceState();
      const count = Object.keys(state).length;
      setViewerCount(Math.max(1, count));
    });

    channel.subscribe(async (status) => {
      if (status === 'SUBSCRIBED') {
        setIsConnected(true);
        await channel.track({ online_at: new Date().toISOString() });
        // Catch-up sync on connect
        fetchDocument();
      } else {
        setIsConnected(false);
      }
    });

    // 4. Tab visibility & online catch-up
    const handleOnline = () => fetchDocument();
    const handleVisibility = () => {
      if (document.visibilityState === 'visible') fetchDocument();
    };

    window.addEventListener('online', handleOnline);
    document.addEventListener('visibilitychange', handleVisibility);

    return () => {
      window.removeEventListener('online', handleOnline);
      document.removeEventListener('visibilitychange', handleVisibility);
      supabase.removeChannel(channel);
    };
  }, [fetchDocument, adjustTextareaHeight]);

  // ── Typing Handler (Local update + Debounce) ──
  const handleChange = (e) => {
    const val = e.target.value.slice(0, MAX_CHARS);
    setContent(val);
    adjustTextareaHeight();

    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    setSavingStatus('Saving...');
    debounceTimerRef.current = setTimeout(() => {
      // If a remote update arrived while actively typing, surface conflict notice
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

  // ── Conflict Resolution Handlers ──
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
    const token = sessionStorage.getItem('sks_space_session_token') || sessionToken;
    if (!token) return;

    setIsClearing(true);
    try {
      const res = await fetch('/api/space', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'x-space-session-token': token,
        },
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
        setTimeout(adjustTextareaHeight, 50);
      }
    } catch (e) {
      console.warn('[Space] Clear error:', e.message);
    } finally {
      setIsClearing(false);
    }
  };

  // If room is expired or not found, render friendly card
  if (isExpiredRoom || isNotFoundRoom) {
    return (
      <main className={styles.container}>
        <div className={styles.inner}>
          <div className={styles.expiredCard}>
            <div className={styles.expiredIcon} aria-hidden="true">
              {isExpiredRoom ? '⏳' : '🔍'}
            </div>
            <h2 className={styles.expiredTitle}>
              {isExpiredRoom ? 'Sync Room Expired' : 'Room Not Found'}
            </h2>
            <p className={styles.expiredDesc}>
              {isExpiredRoom
                ? 'This sync room expired after 48 hours of inactivity to keep your shared data ephemeral and secure.'
                : 'We could not find a sync room with this ID. It may have been cleared or the link is incorrect.'}
            </p>
            <a href="/space" className={styles.primaryCreateBtn}>
              Create a New Sync Room
            </a>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className={styles.container}>
      <div className={styles.inner}>
        {/* ─── Header ─── */}
        <header className={styles.header}>
          <div>
            <h1 className={styles.title}>Space</h1>
            {roomId && (
              <div className={styles.roomBadgeGroup} style={{ marginTop: '0.4rem' }}>
                <div className={styles.roomBadge}>
                  <span>ROOM</span>
                  <span className={styles.roomCode}>{roomId}</span>
                </div>
                <span className={styles.roomTtl}>• 48h auto-expire</span>
              </div>
            )}
          </div>
          <div className={styles.metaRow}>
            {roomId && (
              <div className={styles.roomActions}>
                <button
                  type="button"
                  className={styles.actionPillBtn}
                  onClick={handleCopyLink}
                  aria-label="Copy room share link"
                >
                  {copiedLink ? (
                    <>
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                      Copied!
                    </>
                  ) : (
                    <>
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>
                      Share Link
                    </>
                  )}
                </button>
                <button
                  type="button"
                  className={styles.actionPillBtn}
                  onClick={() => setShowQrModal(true)}
                  aria-label="Show QR code for phone scanning"
                >
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>
                  QR Code
                </button>
              </div>
            )}
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
        </header>

        {/* ─── QR Code Modal ─── */}
        {showQrModal && (
          <div
            className={styles.modalBackdrop}
            onClick={() => setShowQrModal(false)}
            role="dialog"
            aria-modal="true"
            aria-label="Scan QR Code to join sync room"
          >
            <div
              className={styles.qrModalCard}
              onClick={(e) => e.stopPropagation()}
            >
              <button
                type="button"
                className={styles.qrModalClose}
                onClick={() => setShowQrModal(false)}
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
                  style={{ padding: '0.2rem 0.5rem', fontSize: '0.7rem' }}
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

        {/* ─── Turnstile Human Gating Gate ─── */}
        {!isVerified && (
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
            <span className={styles.cardLabel}>Live Scratchpad</span>
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
                  disabled={!isVerified || !content}
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
            onChange={handleChange}
            onFocus={() => {
              isFocusedRef.current = true;
            }}
            onBlur={() => {
              isFocusedRef.current = false;
              // If remote update arrived while focused, apply cleanly now
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
                ? 'Loading shared document...'
                : !isVerified
                ? 'Verify above to type in the shared scratchpad...'
                : 'Start typing... updates sync live for everyone on this page.'
            }
            disabled={!isVerified || loading}
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
