"use client";

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { supabase } from '@/lib/supabaseClient';
import styles from './space.module.css';

const MAX_CHARS = 5000;
const DEBOUNCE_DELAY_MS = 500;
const TURNSTILE_SITE_KEY =
  process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY || '1x00000000000000000000AA';

export default function SpaceView() {
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(true);
  const [savingStatus, setSavingStatus] = useState('Synced'); // 'Synced' | 'Saving...' | 'Conflict'
  const [viewerCount, setViewerCount] = useState(1);
  const [isConnected, setIsConnected] = useState(false);
  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const [isClearing, setIsClearing] = useState(false);
  const [dbError, setDbError] = useState(null);
  const [conflictNotice, setConflictNotice] = useState(null); // { remoteContent, remoteUpdatedAt }

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

  // ── Fetch Initial Document ──
  const fetchDocument = useCallback(async () => {
    try {
      const res = await fetch('/api/space');
      const data = await res.json();
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
  }, [adjustTextareaHeight]);

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
    [sessionToken]
  );

  // ── Realtime Setup with Presence & Cursor Jump Protection ──
  useEffect(() => {
    fetchDocument();

    const channel = supabase.channel('shared-space', {
      config: {
        private: true,
        presence: { key: clientIdRef.current || 'visitor' },
      },
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
        body: JSON.stringify({ clientId: clientIdRef.current }),
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

  return (
    <main className={styles.container}>
      <div className={styles.inner}>
        {/* ─── Header ─── */}
        <header className={styles.header}>
          <h1 className={styles.title}>Space</h1>
          <div className={styles.metaRow}>
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
