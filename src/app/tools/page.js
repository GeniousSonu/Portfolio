'use client';

import React, { useState } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export default function ToolsPage() {
  const [activeTab, setActiveTab] = useState('jwt'); // 'jwt' | 'cron'

  // JWT Decoder state
  const [jwtInput, setJwtInput] = useState('');
  const [jwtHeader, setJwtHeader] = useState(null);
  const [jwtPayload, setJwtPayload] = useState(null);
  const [jwtError, setJwtError] = useState('');
  const [hasSignature, setHasSignature] = useState(false);
  const [copiedSection, setCopiedSection] = useState(null);

  // Cron Generator state
  const [minute, setMinute] = useState('*');
  const [hour, setHour] = useState('*');
  const [dayOfMonth, setDayOfMonth] = useState('*');
  const [month, setMonth] = useState('*');
  const [dayOfWeek, setDayOfWeek] = useState('*');
  const [cronCopied, setCronCopied] = useState(false);

  // Parse JWT
  const handleDecodeJwt = (token) => {
    setJwtInput(token);
    setJwtError('');
    setJwtHeader(null);
    setJwtPayload(null);
    setHasSignature(false);

    const trimmed = token.trim();
    if (!trimmed) return;

    const parts = trimmed.split('.');
    if (parts.length < 2 || parts.length > 3) {
      setJwtError('Invalid JWT format. A valid token consists of 2 or 3 dot-separated base64url segments.');
      return;
    }

    try {
      const base64UrlDecode = (str) => {
        let base64 = str.replace(/-/g, '+').replace(/_/g, '/');
        while (base64.length % 4) {
          base64 += '=';
        }
        const jsonStr = decodeURIComponent(
          atob(base64)
            .split('')
            .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
            .join('')
        );
        return JSON.parse(jsonStr);
      };

      const header = base64UrlDecode(parts[0]);
      const payload = base64UrlDecode(parts[1]);

      setJwtHeader(header);
      setJwtPayload(payload);
      setHasSignature(Boolean(parts[2]));
    } catch {
      setJwtError('Failed to decode token segments. Ensure the payload is valid base64url JSON.');
    }
  };

  const copyToClipboard = (text, section) => {
    navigator.clipboard.writeText(text);
    if (section === 'cron') {
      setCronCopied(true);
      setTimeout(() => setCronCopied(false), 2000);
    } else {
      setCopiedSection(section);
      setTimeout(() => setCopiedSection(null), 2000);
    }
  };

  const cronExpression = `${minute} ${hour} ${dayOfMonth} ${month} ${dayOfWeek}`;

  // Human description for cron expression
  const describeCron = () => {
    if (minute === '*' && hour === '*' && dayOfMonth === '*' && month === '*' && dayOfWeek === '*') {
      return 'Runs every minute.';
    }
    if (minute === '0' && hour === '*' && dayOfMonth === '*' && month === '*' && dayOfWeek === '*') {
      return 'Runs every hour at the start of the hour (minute 0).';
    }
    if (minute === '0' && hour === '0' && dayOfMonth === '*' && month === '*' && dayOfWeek === '*') {
      return 'Runs every day at midnight (00:00).';
    }
    if (minute === '*/15' && hour === '*') {
      return 'Runs every 15 minutes.';
    }
    if (minute === '*/30' && hour === '*') {
      return 'Runs every 30 minutes.';
    }
    return `Runs at minute ${minute}, hour ${hour}, day-of-month ${dayOfMonth}, month ${month}, weekday ${dayOfWeek}.`;
  };

  return (
    <>
      <Navbar />
      <main className="site-container" style={{ paddingTop: '120px', minHeight: '80vh', paddingBottom: '4rem' }}>
        <div style={{ marginBottom: '2rem' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.25rem 0.75rem', borderRadius: '4px', background: 'rgba(56, 189, 248, 0.1)', color: 'var(--blue)', fontSize: '0.8rem', fontFamily: 'monospace', marginBottom: '0.75rem' }}>
            <span>$ SYS_TOOLS_V2.0</span>
          </div>
          <h1 className="section-title" style={{ margin: '0 0 0.5rem 0' }}>Developer Utilities</h1>
          <p className="section-subtitle" style={{ margin: 0, color: 'var(--text-muted)' }}>
            Client-side, privacy-preserving terminal tools. No data ever leaves your browser.
          </p>
        </div>

        {/* Tab switch */}
        <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '2rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.75rem' }}>
          <button
            type="button"
            onClick={() => setActiveTab('jwt')}
            style={{
              padding: '0.5rem 1rem',
              borderRadius: '6px',
              fontFamily: 'monospace',
              fontSize: '0.9rem',
              cursor: 'pointer',
              border: activeTab === 'jwt' ? '1px solid var(--blue)' : '1px solid var(--border-color)',
              background: activeTab === 'jwt' ? 'rgba(56, 189, 248, 0.15)' : 'transparent',
              color: activeTab === 'jwt' ? 'var(--blue)' : 'var(--text-muted)',
              transition: 'all 0.2s ease',
            }}
          >
            [01] JWT Decoder
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('cron')}
            style={{
              padding: '0.5rem 1rem',
              borderRadius: '6px',
              fontFamily: 'monospace',
              fontSize: '0.9rem',
              cursor: 'pointer',
              border: activeTab === 'cron' ? '1px solid var(--gold)' : '1px solid var(--border-color)',
              background: activeTab === 'cron' ? 'rgba(234, 179, 8, 0.15)' : 'transparent',
              color: activeTab === 'cron' ? 'var(--gold)' : 'var(--text-muted)',
              transition: 'all 0.2s ease',
            }}
          >
            [02] Cron Expression Generator
          </button>
        </div>

        {/* Tab Content: JWT Decoder */}
        {activeTab === 'jwt' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div style={{ border: '1px solid var(--border-color)', borderRadius: '8px', padding: '1.5rem', background: 'var(--bg-secondary)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                <label htmlFor="jwt-input" style={{ fontSize: '0.85rem', fontFamily: 'monospace', color: 'var(--blue)' }}>
                  ENCODED JWT TOKEN:
                </label>
                {jwtInput && (
                  <button
                    type="button"
                    onClick={() => handleDecodeJwt('')}
                    style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', fontSize: '0.8rem', fontFamily: 'monospace' }}
                  >
                    [Clear]
                  </button>
                )}
              </div>
              <textarea
                id="jwt-input"
                rows={4}
                value={jwtInput}
                onChange={(e) => handleDecodeJwt(e.target.value)}
                placeholder="Paste token (eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...)"
                style={{
                  width: '100%',
                  background: 'var(--bg-primary)',
                  border: '1px solid var(--border-color)',
                  borderRadius: '6px',
                  color: 'var(--text-color)',
                  padding: '0.75rem',
                  fontFamily: 'monospace',
                  fontSize: '0.85rem',
                  resize: 'vertical',
                  boxSizing: 'border-box',
                }}
              />
              {jwtError && (
                <div style={{ marginTop: '0.75rem', padding: '0.5rem 0.75rem', borderRadius: '4px', background: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', fontSize: '0.85rem', fontFamily: 'monospace' }}>
                  ERROR: {jwtError}
                </div>
              )}
            </div>

            {/* Results Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem' }}>
              {/* Header block */}
              <div style={{ border: '1px solid var(--border-color)', borderRadius: '8px', padding: '1.25rem', background: 'var(--bg-secondary)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                  <span style={{ fontSize: '0.85rem', fontFamily: 'monospace', color: 'var(--blue)' }}>HEADER (Algorithm & Token Type)</span>
                  {jwtHeader && (
                    <button
                      type="button"
                      onClick={() => copyToClipboard(JSON.stringify(jwtHeader, null, 2), 'header')}
                      style={{ background: 'transparent', border: '1px solid var(--border-color)', borderRadius: '4px', padding: '2px 8px', color: 'var(--text-muted)', cursor: 'pointer', fontSize: '0.75rem', fontFamily: 'monospace' }}
                    >
                      {copiedSection === 'header' ? 'Copied!' : 'Copy'}
                    </button>
                  )}
                </div>
                <pre style={{ margin: 0, padding: '0.75rem', background: 'var(--bg-primary)', borderRadius: '6px', overflowX: 'auto', fontSize: '0.85rem', fontFamily: 'monospace', color: jwtHeader ? 'var(--text-color)' : 'var(--text-muted)', border: '1px solid var(--border-color)' }}>
                  {jwtHeader ? JSON.stringify(jwtHeader, null, 2) : '// Header data will appear here'}
                </pre>
              </div>

              {/* Payload block */}
              <div style={{ border: '1px solid var(--border-color)', borderRadius: '8px', padding: '1.25rem', background: 'var(--bg-secondary)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                  <span style={{ fontSize: '0.85rem', fontFamily: 'monospace', color: 'var(--gold)' }}>PAYLOAD (Data Claims)</span>
                  {jwtPayload && (
                    <button
                      type="button"
                      onClick={() => copyToClipboard(JSON.stringify(jwtPayload, null, 2), 'payload')}
                      style={{ background: 'transparent', border: '1px solid var(--border-color)', borderRadius: '4px', padding: '2px 8px', color: 'var(--text-muted)', cursor: 'pointer', fontSize: '0.75rem', fontFamily: 'monospace' }}
                    >
                      {copiedSection === 'payload' ? 'Copied!' : 'Copy'}
                    </button>
                  )}
                </div>
                <pre style={{ margin: 0, padding: '0.75rem', background: 'var(--bg-primary)', borderRadius: '6px', overflowX: 'auto', fontSize: '0.85rem', fontFamily: 'monospace', color: jwtPayload ? 'var(--text-color)' : 'var(--text-muted)', border: '1px solid var(--border-color)' }}>
                  {jwtPayload ? JSON.stringify(jwtPayload, null, 2) : '// Payload claims will appear here'}
                </pre>
              </div>
            </div>

            {/* Signature status */}
            <div style={{ padding: '0.75rem 1rem', border: '1px solid var(--border-color)', borderRadius: '6px', background: 'var(--bg-secondary)', fontSize: '0.85rem', fontFamily: 'monospace', color: 'var(--text-muted)' }}>
              <span>SIGNATURE STATUS: </span>
              {hasSignature ? (
                <span style={{ color: 'var(--emerald)' }}>[PRESENT] Client inspection only (never send secret keys over browser).</span>
              ) : (
                <span style={{ color: 'var(--text-muted)' }}>[NONE / WAITING]</span>
              )}
            </div>
          </div>
        )}

        {/* Tab Content: Cron Generator */}
        {activeTab === 'cron' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div style={{ border: '1px solid var(--border-color)', borderRadius: '8px', padding: '1.5rem', background: 'var(--bg-secondary)' }}>
              <h2 style={{ fontSize: '1rem', fontFamily: 'monospace', color: 'var(--gold)', margin: '0 0 1rem 0' }}>
                CRON SCHEDULE BUILDER (5-FIELD STANDARD)
              </h2>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '1rem', marginBottom: '1.5rem' }}>
                <div>
                  <label htmlFor="cron-minute" style={{ display: 'block', fontSize: '0.8rem', fontFamily: 'monospace', color: 'var(--text-muted)', marginBottom: '0.35rem' }}>
                    MINUTE (0-59)
                  </label>
                  <input
                    id="cron-minute"
                    type="text"
                    value={minute}
                    onChange={(e) => setMinute(e.target.value)}
                    style={{ width: '100%', padding: '0.5rem', background: 'var(--bg-primary)', border: '1px solid var(--border-color)', borderRadius: '4px', color: 'var(--text-color)', fontFamily: 'monospace', boxSizing: 'border-box' }}
                  />
                </div>
                <div>
                  <label htmlFor="cron-hour" style={{ display: 'block', fontSize: '0.8rem', fontFamily: 'monospace', color: 'var(--text-muted)', marginBottom: '0.35rem' }}>
                    HOUR (0-23)
                  </label>
                  <input
                    id="cron-hour"
                    type="text"
                    value={hour}
                    onChange={(e) => setHour(e.target.value)}
                    style={{ width: '100%', padding: '0.5rem', background: 'var(--bg-primary)', border: '1px solid var(--border-color)', borderRadius: '4px', color: 'var(--text-color)', fontFamily: 'monospace', boxSizing: 'border-box' }}
                  />
                </div>
                <div>
                  <label htmlFor="cron-dom" style={{ display: 'block', fontSize: '0.8rem', fontFamily: 'monospace', color: 'var(--text-muted)', marginBottom: '0.35rem' }}>
                    DAY OF MONTH (1-31)
                  </label>
                  <input
                    id="cron-dom"
                    type="text"
                    value={dayOfMonth}
                    onChange={(e) => setDayOfMonth(e.target.value)}
                    style={{ width: '100%', padding: '0.5rem', background: 'var(--bg-primary)', border: '1px solid var(--border-color)', borderRadius: '4px', color: 'var(--text-color)', fontFamily: 'monospace', boxSizing: 'border-box' }}
                  />
                </div>
                <div>
                  <label htmlFor="cron-month" style={{ display: 'block', fontSize: '0.8rem', fontFamily: 'monospace', color: 'var(--text-muted)', marginBottom: '0.35rem' }}>
                    MONTH (1-12)
                  </label>
                  <input
                    id="cron-month"
                    type="text"
                    value={month}
                    onChange={(e) => setMonth(e.target.value)}
                    style={{ width: '100%', padding: '0.5rem', background: 'var(--bg-primary)', border: '1px solid var(--border-color)', borderRadius: '4px', color: 'var(--text-color)', fontFamily: 'monospace', boxSizing: 'border-box' }}
                  />
                </div>
                <div>
                  <label htmlFor="cron-dow" style={{ display: 'block', fontSize: '0.8rem', fontFamily: 'monospace', color: 'var(--text-muted)', marginBottom: '0.35rem' }}>
                    DAY OF WEEK (0-6)
                  </label>
                  <input
                    id="cron-dow"
                    type="text"
                    value={dayOfWeek}
                    onChange={(e) => setDayOfWeek(e.target.value)}
                    style={{ width: '100%', padding: '0.5rem', background: 'var(--bg-primary)', border: '1px solid var(--border-color)', borderRadius: '4px', color: 'var(--text-color)', fontFamily: 'monospace', boxSizing: 'border-box' }}
                  />
                </div>
              </div>

              {/* Quick Presets */}
              <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '1.5rem' }}>
                <span style={{ fontSize: '0.8rem', fontFamily: 'monospace', color: 'var(--text-muted)', alignSelf: 'center', marginRight: '0.5rem' }}>Presets:</span>
                {[
                  { label: 'Every minute', vals: ['*', '*', '*', '*', '*'] },
                  { label: 'Every 15 min', vals: ['*/15', '*', '*', '*', '*'] },
                  { label: 'Hourly', vals: ['0', '*', '*', '*', '*'] },
                  { label: 'Daily at 00:00', vals: ['0', '0', '*', '*', '*'] },
                  { label: 'Weekly (Sunday)', vals: ['0', '0', '*', '*', '0'] },
                ].map((preset) => (
                  <button
                    key={preset.label}
                    type="button"
                    onClick={() => {
                      setMinute(preset.vals[0]);
                      setHour(preset.vals[1]);
                      setDayOfMonth(preset.vals[2]);
                      setMonth(preset.vals[3]);
                      setDayOfWeek(preset.vals[4]);
                    }}
                    style={{
                      background: 'var(--bg-primary)',
                      border: '1px solid var(--border-color)',
                      borderRadius: '4px',
                      padding: '0.25rem 0.6rem',
                      color: 'var(--text-muted)',
                      cursor: 'pointer',
                      fontSize: '0.75rem',
                      fontFamily: 'monospace',
                    }}
                  >
                    {preset.label}
                  </button>
                ))}
              </div>

              {/* Expression output banner */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem', background: 'var(--bg-primary)', border: '1px solid var(--border-color)', borderRadius: '6px' }}>
                <div>
                  <div style={{ fontSize: '0.75rem', fontFamily: 'monospace', color: 'var(--text-muted)', marginBottom: '0.25rem' }}>GENERATED EXPRESSION:</div>
                  <code style={{ fontSize: '1.25rem', fontFamily: 'monospace', color: 'var(--gold)', fontWeight: 'bold' }}>{cronExpression}</code>
                  <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '0.35rem' }}>{describeCron()}</div>
                </div>
                <button
                  type="button"
                  onClick={() => copyToClipboard(cronExpression, 'cron')}
                  style={{
                    padding: '0.5rem 1rem',
                    background: 'rgba(234, 179, 8, 0.15)',
                    border: '1px solid var(--gold)',
                    borderRadius: '4px',
                    color: 'var(--gold)',
                    fontFamily: 'monospace',
                    fontSize: '0.85rem',
                    cursor: 'pointer',
                  }}
                >
                  {cronCopied ? 'Copied!' : 'Copy Expression'}
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
      <Footer />
    </>
  );
}
