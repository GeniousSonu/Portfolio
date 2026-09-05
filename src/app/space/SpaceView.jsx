"use client";

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { supabase } from '@/lib/supabaseClient';
import styles from './space.module.css';

const MAX_CHARS = 2000;
const TURNSTILE_SITE_KEY =
  process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY || '1x00000000000000000000AA';

export default function SpaceView() {
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [content, setContent] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [clearing, setClearing] = useState(false);
  const [showClearModal, setShowClearModal] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [toast, setToast] = useState(null); // { type: 'error'|'success', message }
  const [copiedId, setCopiedId] = useState(null);
  const [reportedIds, setReportedIds] = useState(new Set());
  const [turnstileToken, setTurnstileToken] = useState('');

  const turnstileContainerRef = useRef(null);
  const turnstileWidgetId = useRef(null);
  const textareaRef = useRef(null);

  const showToast = useCallback((message, type = 'error') => {
    setToast({ message, type });
    setTimeout(() => {
      setToast(null);
    }, 4500);
  }, []);

  // ── Fetch Current Board Entries ──
  const fetchEntries = useCallback(async () => {
    try {
      const res = await fetch('/api/space');
      const data = await res.json();
      if (res.ok && Array.isArray(data.entries)) {
        setEntries(data.entries);
      }
    } catch (err) {
      console.warn('[SpaceView] Sync error:', err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  // ── Initialize Turnstile Widget ──
  useEffect(() => {
    let scriptLoaded = false;

    const renderTurnstile = () => {
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
              callback: (token) => setTurnstileToken(token),
              'expired-callback': () => setTurnstileToken(''),
              'error-callback': () => setTurnstileToken(''),
              theme: 'dark',
              size: 'flexible',
            }
          );
        } catch (e) {
          console.warn('[Turnstile] Render notice:', e.message);
        }
      }
    };

    if (window.turnstile) {
      renderTurnstile();
    } else {
      const existingScript = document.getElementById('cf-turnstile-script');
      if (!existingScript) {
        const script = document.createElement('script');
        script.id = 'cf-turnstile-script';
        script.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit';
        script.async = true;
        script.defer = true;
        script.onload = () => {
          scriptLoaded = true;
          renderTurnstile();
        };
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
  }, []);

  const resetTurnstile = () => {
    setTurnstileToken('');
    if (window.turnstile && turnstileWidgetId.current) {
      try {
        window.turnstile.reset(turnstileWidgetId.current);
      } catch (e) {}
    }
  };

  // ── Supabase Realtime Subscription & Reconnect Catch-up ──
  useEffect(() => {
    fetchEntries();

    // 1. Private channel subscription for broadcast reception
    const channel = supabase.channel('shared-space', {
      config: { private: true },
    });

    channel
      .on('broadcast', { event: 'new-entry' }, ({ payload }) => {
        if (payload?.entry && payload.entry.id) {
          setEntries((prev) => {
            if (prev.some((e) => e.id === payload.entry.id)) return prev;
            return [payload.entry, ...prev];
          });
        }
      })
      .on('broadcast', { event: 'entry_deleted' }, ({ payload }) => {
        if (payload?.entryId) {
          setEntries((prev) => prev.filter((e) => e.id !== payload.entryId));
        }
      })
      .on('broadcast', { event: 'space_cleared' }, () => {
        setEntries([]);
      });

    channel.subscribe((status) => {
      if (status === 'SUBSCRIBED') {
        setIsConnected(true);
        // Automatic catch-up when channel connects or recovers from drop
        fetchEntries();
      } else {
        setIsConnected(false);
      }
    });

    // 2. Event listeners for tab focus and network reconnection
    const handleOnline = () => {
      fetchEntries();
    };

    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        fetchEntries();
      }
    };

    window.addEventListener('online', handleOnline);
    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      window.removeEventListener('online', handleOnline);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      supabase.removeChannel(channel);
    };
  }, [fetchEntries]);

  // ── Paste from Clipboard ──
  const handlePasteClipboard = async () => {
    try {
      if (navigator.clipboard && navigator.clipboard.readText) {
        const text = await navigator.clipboard.readText();
        if (text) {
          setContent((prev) => (prev ? `${prev}\n${text}` : text).slice(0, MAX_CHARS));
          textareaRef.current?.focus();
        }
      } else {
        showToast('Clipboard read access is not supported on this browser.', 'error');
      }
    } catch (e) {
      showToast('Please paste manually or allow clipboard permission.', 'error');
    }
  };

  // ── Copy Individual Entry ──
  const handleCopy = async (entry) => {
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(entry.content);
        setCopiedId(entry.id);
        setTimeout(() => setCopiedId(null), 2000);
      }
    } catch (e) {
      showToast('Failed to copy text to clipboard.', 'error');
    }
  };

  // ── Report Inappropriate Entry ──
  const handleReport = async (entryId) => {
    if (reportedIds.has(entryId)) return;

    try {
      const res = await fetch('/api/space/report', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ entryId, reason: 'Reported by community visitor' }),
      });
      const data = await res.json();

      if (res.ok) {
        setReportedIds((prev) => new Set(prev).add(entryId));
        showToast('Entry reported for moderation review. Thank you!', 'success');
      } else {
        showToast(data.error || 'Failed to submit report.', 'error');
      }
    } catch (e) {
      showToast('Network error while reporting.', 'error');
    }
  };

  // ── Submit New Paste ──
  const handleSubmit = async (e) => {
    e.preventDefault();
    const clean = content.trim();

    if (!clean) {
      showToast('Please enter text to share.', 'error');
      return;
    }

    if (clean.length > MAX_CHARS) {
      showToast(`Content exceeds ${MAX_CHARS} characters.`, 'error');
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch('/api/space', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          content: clean,
          turnstileToken,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        showToast(data.error || 'Failed to post entry.', 'error');
        resetTurnstile();
      } else {
        setContent('');
        resetTurnstile();
        if (data.entry) {
          setEntries((prev) => [data.entry, ...prev.filter((item) => item.id !== data.entry.id)]);
        }
        showToast('Shared to space!', 'success');
      }
    } catch (err) {
      showToast('Network error while sharing to space.', 'error');
      resetTurnstile();
    } finally {
      setSubmitting(false);
    }
  };

  // ── Confirm Clear All ──
  const handleConfirmClear = async () => {
    setClearing(true);
    try {
      const res = await fetch('/api/space', { method: 'DELETE' });
      const data = await res.json();

      if (!res.ok) {
        showToast(data.error || 'Failed to clear shared space.', 'error');
      } else {
        setEntries([]);
        setShowClearModal(false);
        showToast('Shared space has been cleared.', 'success');
      }
    } catch (e) {
      showToast('Network error while clearing space.', 'error');
    } finally {
      setClearing(false);
    }
  };

  const formatTimestamp = (dateStr) => {
    try {
      const d = new Date(dateStr);
      return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } catch (e) {
      return '';
    }
  };

  return (
    <main className={styles.container}>
      <div className={styles.inner}>
        {/* ─── Header ─── */}
        <header className={styles.header}>
          <div className={styles.badgeRow}>
            <span className={styles.badge}>Live Clipboard</span>
            <div className={styles.connectionStatus}>
              <span
                className={`${styles.statusDot} ${
                  !isConnected ? styles.statusDotDisconnected : ''
                }`}
              />
              <span>{isConnected ? 'Realtime Connected' : 'Reconnecting...'}</span>
            </div>
          </div>
          <h1 className={styles.title}>Shared Space</h1>
          <p className={styles.subtitle}>
            A real-time public clipboard. Anyone can paste, everyone currently viewing receives it
            live without refreshing.
          </p>
        </header>

        {/* ─── Anonymous Public Disclaimer ─── */}
        <aside className={styles.disclaimerBanner} role="alert">
          <span className={styles.disclaimerIcon} aria-hidden="true">
            ⚠️
          </span>
          <div>
            <strong>Public &amp; Anonymous:</strong> Anything pasted here is immediately visible to
            anyone viewing this page and can be cleared at any time. Never share passwords, API keys,
            tokens, or private personal data. Pastes auto-expire after 24 hours.
          </div>
        </aside>

        {/* ─── Toast Feedback ─── */}
        {toast && (
          <div
            className={`${styles.toast} ${
              toast.type === 'success' ? styles.toastSuccess : styles.toastError
            }`}
            role="status"
          >
            <span>{toast.type === 'success' ? '✅' : '⚠️'}</span>
            <span>{toast.message}</span>
          </div>
        )}

        {/* ─── Composer Card ─── */}
        <form className={styles.composerCard} onSubmit={handleSubmit}>
          <textarea
            ref={textareaRef}
            className={styles.textarea}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Paste code, snippets, links, or notes to broadcast live to everyone viewing this page..."
            rows={4}
            maxLength={MAX_CHARS}
            disabled={submitting}
            aria-label="Shared clipboard text content"
          />

          <div className={styles.composerFooter}>
            <div className={styles.leftControls}>
              <button
                type="button"
                className={styles.pasteBtn}
                onClick={handlePasteClipboard}
                title="Paste from your device's clipboard"
              >
                📋 Paste Clipboard
              </button>
              <span
                className={`${styles.charCount} ${
                  content.length > 1800
                    ? content.length >= MAX_CHARS
                      ? styles.charCountError
                      : styles.charCountWarn
                    : ''
                }`}
              >
                {content.length} / {MAX_CHARS}
              </span>
            </div>

            <div className={styles.rightControls}>
              <div
                ref={turnstileContainerRef}
                className={styles.turnstileContainer}
                aria-label="Bot verification"
              />
              <button
                type="submit"
                className={styles.submitBtn}
                disabled={submitting || !content.trim()}
              >
                {submitting ? 'Sharing...' : 'Share to Space 🚀'}
              </button>
            </div>
          </div>
        </form>

        {/* ─── Board Header Bar ─── */}
        <div className={styles.boardHeader}>
          <div className={styles.boardTitle}>
            <span>Active Pastes</span>
            <span className={styles.entryCountBadge}>{entries.length}</span>
          </div>
          {entries.length > 0 && (
            <button
              type="button"
              className={styles.clearAllBtn}
              onClick={() => setShowClearModal(true)}
              disabled={clearing}
            >
              🗑 Clear All
            </button>
          )}
        </div>

        {/* ─── Feed of Entries ─── */}
        <section className={styles.feed} aria-label="Shared pastes list">
          {loading ? (
            <>
              <div className={styles.skeletonCard}>
                <div className={styles.skeletonLine} style={{ width: '30%' }} />
                <div className={styles.skeletonLine} style={{ width: '90%' }} />
                <div className={styles.skeletonLine} style={{ width: '60%' }} />
              </div>
              <div className={styles.skeletonCard}>
                <div className={styles.skeletonLine} style={{ width: '25%' }} />
                <div className={styles.skeletonLine} style={{ width: '85%' }} />
              </div>
            </>
          ) : entries.length === 0 ? (
            <div className={styles.emptyState}>
              <span className={styles.emptyIcon} aria-hidden="true">
                ✨
              </span>
              <h3 className={styles.emptyTitle}>Nothing here yet</h3>
              <p className={styles.emptyDesc}>
                The shared space is completely clean. Be the first to paste something above!
              </p>
            </div>
          ) : (
            entries.map((entry) => (
              <article key={entry.id} className={styles.entryCard}>
                <div className={styles.entryMeta}>
                  <time className={styles.entryTimestamp} dateTime={entry.created_at}>
                    🕒 {formatTimestamp(entry.created_at)}
                  </time>
                  <div className={styles.entryActions}>
                    <button
                      type="button"
                      className={`${styles.actionIconBtn} ${
                        copiedId === entry.id ? styles.actionIconBtnSuccess : ''
                      }`}
                      onClick={() => handleCopy(entry)}
                      title="Copy to your clipboard"
                    >
                      {copiedId === entry.id ? '✓ Copied' : '📄 Copy'}
                    </button>
                    <button
                      type="button"
                      className={`${styles.actionIconBtn} ${
                        reportedIds.has(entry.id) ? styles.actionIconBtnReported : ''
                      }`}
                      onClick={() => handleReport(entry.id)}
                      disabled={reportedIds.has(entry.id)}
                      title="Report inappropriate content to Sonu"
                    >
                      {reportedIds.has(entry.id) ? '🚩 Reported' : '🚩 Report'}
                    </button>
                  </div>
                </div>

                {/* Strictly plain-text safe preformatted block */}
                <pre className={styles.entryContent}>{entry.content}</pre>
              </article>
            ))
          )}
        </section>

        {/* ─── Clear All Confirmation Modal ─── */}
        {showClearModal && (
          <div
            className={styles.modalBackdrop}
            onClick={() => !clearing && setShowClearModal(false)}
            role="dialog"
            aria-modal="true"
            aria-labelledby="modal-title"
          >
            <div className={styles.modalCard} onClick={(e) => e.stopPropagation()}>
              <div className={styles.modalHeader}>
                <div className={styles.modalIcon} aria-hidden="true">
                  🗑️
                </div>
                <h3 id="modal-title" className={styles.modalTitle}>
                  Clear Entire Shared Space?
                </h3>
              </div>
              <p className={styles.modalBody}>
                This will permanently delete all {entries.length} pastes on the shared board for
                everyone currently viewing this page. This action cannot be undone.
              </p>
              <div className={styles.modalActions}>
                <button
                  type="button"
                  className={styles.modalCancelBtn}
                  onClick={() => setShowClearModal(false)}
                  disabled={clearing}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className={styles.modalConfirmBtn}
                  onClick={handleConfirmClear}
                  disabled={clearing}
                >
                  {clearing ? 'Clearing...' : 'Yes, Clear All'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
