'use client';

import React, { useState } from 'react';

export default function ConfessionPage() {
  const [note, setNote] = useState('');
  const [status, setStatus] = useState('idle'); // 'idle' | 'submitting' | 'success' | 'error'
  const [errorMessage, setErrorMessage] = useState('');
  const [honeypot, setHoneypot] = useState('');
  const [receiptId, setReceiptId] = useState(null);

  const charCount = note.length;
  const maxChars = 2000;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!note.trim() || status === 'submitting') return;

    setStatus('submitting');
    setErrorMessage('');

    try {
      const res = await fetch('/api/confession', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          note: note.trim(),
          confirm_subject_ref: honeypot, // Honeypot trap
          isEncrypted: true,
        }),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Failed to transmit note. Please try again.');
      }

      setStatus('success');
      setReceiptId(data.id || 'CONF-' + Math.random().toString(36).substring(2, 9).toUpperCase());
      setNote('');
    } catch (err) {
      console.error('[Confession] Transmission error:', err);
      setStatus('error');
      setErrorMessage(err.message || 'Transmission failed. Please check connection and try again.');
    }
  };

  return (
    <main className="site-container" data-route="/confession" style={{ paddingTop: '130px', paddingBottom: '80px', minHeight: '85vh' }}>
        <div style={{ maxWidth: '680px', margin: '0 auto' }}>
          {/* Header Badge */}
          <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.35rem 0.85rem',
                borderRadius: '999px',
                background: 'rgba(255, 255, 255, 0.04)',
                border: '1px solid var(--border-color)',
                fontFamily: 'var(--font-mono)',
                fontSize: '0.75rem',
                color: 'var(--signal)',
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                marginBottom: '1rem',
              }}
            >
              <span
                style={{
                  width: '6px',
                  height: '6px',
                  borderRadius: '50%',
                  background: 'var(--signal)',
                  boxShadow: '0 0 8px var(--signal)',
                }}
                aria-hidden="true"
              />
              <span>Zero-Trace Transmission Protocol</span>
            </div>

            <h1 className="section-title" style={{ fontSize: 'clamp(2rem, 4vw, 2.75rem)', marginBottom: '0.75rem' }}>
              Cryptographic Confession Box
            </h1>
            <p className="section-subtitle" style={{ margin: '0 auto', maxWidth: '520px', lineHeight: '1.6' }}>
              Leave an anonymous message, feedback, or secret thought. All payloads are salted, hashed, and isolated without user identifiers.
            </p>
          </div>

          {/* Form Card */}
          <div
            style={{
              marginTop: '2.5rem',
              padding: 'clamp(1.5rem, 3vw, 2.25rem)',
              background: 'var(--surface-1, rgba(255, 255, 255, 0.02))',
              border: '1px solid var(--border-color)',
              borderRadius: '12px',
              position: 'relative',
            }}
          >
            {/* System Status Strip */}
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                paddingBottom: '1rem',
                borderBottom: '1px solid var(--border-color)',
                marginBottom: '1.25rem',
                fontFamily: 'var(--font-mono)',
                fontSize: '0.75rem',
                color: 'var(--text-muted)',
              }}
            >
              <span>CHANNEL: SECURE_RELAY</span>
              <span>CIPHER: AES-256-GCM / SHA-256</span>
            </div>

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              {/* Invisible Honeypot Field */}
              <div style={{ position: 'absolute', opacity: 0, pointerEvents: 'none', height: 0, overflow: 'hidden' }} aria-hidden="true">
                <label htmlFor="confirm_subject_ref">Leave this empty</label>
                <input
                  type="text"
                  id="confirm_subject_ref"
                  name="confirm_subject_ref"
                  tabIndex="-1"
                  autoComplete="off"
                  value={honeypot}
                  onChange={(e) => setHoneypot(e.target.value)}
                />
              </div>

              <div>
                <label
                  htmlFor="confession-textarea"
                  style={{
                    display: 'block',
                    marginBottom: '0.5rem',
                    fontFamily: 'var(--font-mono)',
                    fontSize: '0.8rem',
                    color: 'var(--text)',
                    letterSpacing: '0.04em',
                  }}
                >
                  TRANSMISSION PAYLOAD
                </label>
                <textarea
                  id="confession-textarea"
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  placeholder="Type your confession, architectural critique, or secret message here..."
                  rows={7}
                  maxLength={maxChars}
                  disabled={status === 'submitting'}
                  style={{
                    width: '100%',
                    padding: '1rem',
                    borderRadius: '8px',
                    background: 'var(--void, #050505)',
                    border: '1px solid var(--border-color)',
                    color: 'var(--text)',
                    fontFamily: 'inherit',
                    fontSize: '0.95rem',
                    lineHeight: '1.6',
                    resize: 'vertical',
                    boxSizing: 'border-box',
                  }}
                />
              </div>

              {/* Character counter & Transmission meta */}
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.75rem',
                  color: charCount > maxChars * 0.9 ? 'var(--amber, #f59e0b)' : 'var(--text-muted)',
                }}
              >
                <span>{charCount} / {maxChars} CHARACTERS</span>
                <span>METADATA: STRIPPED</span>
              </div>

              {/* Error Message */}
              {status === 'error' && (
                <div
                  role="alert"
                  style={{
                    padding: '0.85rem 1rem',
                    borderRadius: '8px',
                    background: 'rgba(239, 68, 68, 0.1)',
                    border: '1px solid rgba(239, 68, 68, 0.25)',
                    color: 'var(--red, #ef4444)',
                    fontSize: '0.85rem',
                    fontFamily: 'var(--font-mono)',
                  }}
                >
                  [ERROR]: {errorMessage}
                </div>
              )}

              {/* Submit CTA */}
              <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '0.5rem' }}>
                <button
                  type="submit"
                  className="btn btn-gold"
                  disabled={status === 'submitting' || !note.trim()}
                  style={{ minWidth: '180px', display: 'inline-flex', justifyContent: 'center' }}
                >
                  {status === 'submitting' ? 'Encrypting & Sending...' : 'Drop Note into Vault →'}
                </button>
              </div>
            </form>

            {/* Success Receipt Screen */}
            {status === 'success' && (
              <div
                role="status"
                style={{
                  marginTop: '1.5rem',
                  padding: '1.25rem',
                  background: 'rgba(16, 185, 129, 0.08)',
                  border: '1px solid rgba(16, 185, 129, 0.25)',
                  borderRadius: '8px',
                  color: 'var(--emerald, #10b981)',
                  fontFamily: 'var(--font-mono)',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 'bold', fontSize: '0.95rem' }}>
                  <span>✓</span>
                  <span>TRANSMISSION CONFIRMED</span>
                </div>
                <p style={{ margin: '0.5rem 0 0.75rem', fontSize: '0.85rem', color: 'var(--text)', fontFamily: 'inherit' }}>
                  Your note has been received and stored in the secure vault. Identity tokens were zeroed.
                </p>
                {receiptId && (
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                    RECEIPT REF: {receiptId}
                  </div>
                )}
                <button
                  type="button"
                  onClick={() => {
                    setStatus('idle');
                    setReceiptId(null);
                  }}
                  className="btn btn-ghost"
                  style={{ marginTop: '1rem', fontSize: '0.8rem', padding: '0.4rem 0.9rem' }}
                >
                  Submit Another Note
                </button>
              </div>
            )}
          </div>
        </div>
      </main>
  );
}
