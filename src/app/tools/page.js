'use client';

import React, { useState, useEffect } from 'react';

export default function ToolsPage() {
  const [activeTab, setActiveTab] = useState('jwt'); // 'jwt' | 'cron' | 'base64' | 'hash' | 'json'

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

  // Base64 state
  const [b64Input, setB64Input] = useState('');
  const [b64Output, setB64Output] = useState('');
  const [b64Mode, setB64Mode] = useState('encode'); // 'encode' | 'decode'
  const [b64UrlSafe, setB64UrlSafe] = useState(false);
  const [b64Error, setB64Error] = useState('');
  const [b64Copied, setB64Copied] = useState(false);

  // Hash state
  const [hashInput, setHashInput] = useState('');
  const [hashAlgo, setHashAlgo] = useState('SHA-256'); // 'SHA-256' | 'SHA-512' | 'SHA-1'
  const [hashOutput, setHashOutput] = useState('');
  const [hashCopied, setHashCopied] = useState(false);

  // JSON Formatter state
  const [jsonInput, setJsonInput] = useState('');
  const [jsonOutput, setJsonOutput] = useState('');
  const [jsonError, setJsonError] = useState('');
  const [jsonCopied, setJsonCopied] = useState(false);

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

  // Base64 Transform
  useEffect(() => {
    if (!b64Input) {
      setB64Output('');
      setB64Error('');
      return;
    }
    try {
      setB64Error('');
      if (b64Mode === 'encode') {
        let encoded = btoa(unescape(encodeURIComponent(b64Input)));
        if (b64UrlSafe) {
          encoded = encoded.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
        }
        setB64Output(encoded);
      } else {
        let inputToDecode = b64Input.trim();
        if (b64UrlSafe) {
          inputToDecode = inputToDecode.replace(/-/g, '+').replace(/_/g, '/');
          while (inputToDecode.length % 4) inputToDecode += '=';
        }
        const decoded = decodeURIComponent(escape(atob(inputToDecode)));
        setB64Output(decoded);
      }
    } catch {
      setB64Error(`Failed to ${b64Mode} data. Check for valid character sequence.`);
      setB64Output('');
    }
  }, [b64Input, b64Mode, b64UrlSafe]);

  // Hash Generator
  useEffect(() => {
    if (!hashInput) {
      setHashOutput('');
      return;
    }
    const computeHash = async () => {
      try {
        const encoder = new TextEncoder();
        const data = encoder.encode(hashInput);
        const hashBuffer = await crypto.subtle.digest(hashAlgo, data);
        const hashArray = Array.from(new Uint8Array(hashBuffer));
        const hashHex = hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
        setHashOutput(hashHex);
      } catch (e) {
        console.warn('[Hash] Computation error:', e);
      }
    };
    computeHash();
  }, [hashInput, hashAlgo]);

  // JSON Formatter / Validator
  const handleFormatJson = (indentSpaces = 2) => {
    setJsonError('');
    if (!jsonInput.trim()) {
      setJsonOutput('');
      return;
    }
    try {
      const parsed = JSON.parse(jsonInput);
      if (indentSpaces === 0) {
        setJsonOutput(JSON.stringify(parsed));
      } else {
        setJsonOutput(JSON.stringify(parsed, null, indentSpaces));
      }
    } catch (err) {
      setJsonError(err.message || 'Invalid JSON syntax.');
    }
  };

  const copyToClipboard = (text, section) => {
    navigator.clipboard.writeText(text);
    if (section === 'cron') {
      setCronCopied(true);
      setTimeout(() => setCronCopied(false), 2000);
    } else if (section === 'b64') {
      setB64Copied(true);
      setTimeout(() => setB64Copied(false), 2000);
    } else if (section === 'hash') {
      setHashCopied(true);
      setTimeout(() => setHashCopied(false), 2000);
    } else if (section === 'json') {
      setJsonCopied(true);
      setTimeout(() => setJsonCopied(false), 2000);
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
    <main className="site-container" data-route="/tools" style={{ paddingTop: '120px', minHeight: '80vh', paddingBottom: '4rem' }}>
        <div style={{ marginBottom: '2rem' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.25rem 0.75rem', borderRadius: '4px', background: 'rgba(56, 189, 248, 0.1)', color: 'var(--blue, #38bdf8)', fontSize: '0.8rem', fontFamily: 'monospace', marginBottom: '0.75rem' }}>
            <span>$ SYS_TOOLS_V2.0</span>
          </div>
          <h1 className="section-title" style={{ margin: '0 0 0.5rem 0' }}>Developer Utilities Belt</h1>
          <p className="section-subtitle" style={{ margin: 0, color: 'var(--text-muted)' }}>
            Client-side, privacy-preserving terminal tools. No data ever leaves your browser memory.
          </p>
        </div>

        {/* Tab switch */}
        <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '2rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.75rem', flexWrap: 'wrap' }}>
          {[
            { id: 'jwt', label: '[01] JWT Decoder' },
            { id: 'cron', label: '[02] Cron Builder' },
            { id: 'base64', label: '[03] Base64 Engine' },
            { id: 'hash', label: '[04] Hash Generator' },
            { id: 'json', label: '[05] JSON Formatter' },
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              style={{
                padding: '0.5rem 0.9rem',
                borderRadius: '6px',
                fontFamily: 'monospace',
                fontSize: '0.85rem',
                cursor: 'pointer',
                border: activeTab === tab.id ? '1px solid var(--signal, var(--gold))' : '1px solid var(--border-color)',
                background: activeTab === tab.id ? 'rgba(234, 179, 8, 0.12)' : 'transparent',
                color: activeTab === tab.id ? 'var(--signal, var(--gold))' : 'var(--text-muted)',
                transition: 'all 0.2s ease',
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* TAB 1: JWT Decoder */}
        {activeTab === 'jwt' && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2rem' }}>
            <div style={{ background: 'var(--surface-1, rgba(255,255,255,0.02))', border: '1px solid var(--border-color)', borderRadius: '8px', padding: '1.5rem' }}>
              <h2 style={{ fontSize: '1.1rem', margin: '0 0 1rem 0', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span style={{ color: 'var(--blue, #38bdf8)' }}>◈</span> Encoded JWT String
              </h2>
              <textarea
                value={jwtInput}
                onChange={(e) => handleDecodeJwt(e.target.value)}
                placeholder="Paste token (eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...)"
                rows={10}
                style={{
                  width: '100%',
                  padding: '1rem',
                  borderRadius: '6px',
                  background: 'var(--void, #050505)',
                  border: '1px solid var(--border-color)',
                  color: 'var(--text)',
                  fontFamily: 'monospace',
                  fontSize: '0.85rem',
                  lineHeight: '1.5',
                  resize: 'vertical',
                  boxSizing: 'border-box',
                }}
              />
              {jwtError && (
                <div style={{ marginTop: '0.75rem', padding: '0.75rem', borderRadius: '4px', background: 'rgba(239, 68, 68, 0.1)', color: 'var(--red, #ef4444)', fontSize: '0.8rem', fontFamily: 'monospace' }}>
                  {jwtError}
                </div>
              )}
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <div style={{ background: 'var(--surface-1, rgba(255,255,255,0.02))', border: '1px solid var(--border-color)', borderRadius: '8px', padding: '1.5rem' }}>
                <h3 style={{ fontSize: '0.95rem', margin: '0 0 0.75rem 0', color: 'var(--red, #ef4444)' }}>Header: Algorithm &amp; Token Type</h3>
                <pre style={{ margin: 0, padding: '1rem', borderRadius: '6px', background: 'var(--void, #050505)', border: '1px solid var(--border-color)', color: 'var(--text)', fontFamily: 'monospace', fontSize: '0.85rem', overflowX: 'auto' }}>
                  {jwtHeader ? JSON.stringify(jwtHeader, null, 2) : '// Decoded header will render here'}
                </pre>
              </div>

              <div style={{ background: 'var(--surface-1, rgba(255,255,255,0.02))', border: '1px solid var(--border-color)', borderRadius: '8px', padding: '1.5rem' }}>
                <h3 style={{ fontSize: '0.95rem', margin: '0 0 0.75rem 0', color: 'var(--blue, #38bdf8)' }}>Payload: Claims Data</h3>
                <pre style={{ margin: 0, padding: '1rem', borderRadius: '6px', background: 'var(--void, #050505)', border: '1px solid var(--border-color)', color: 'var(--text)', fontFamily: 'monospace', fontSize: '0.85rem', overflowX: 'auto' }}>
                  {jwtPayload ? JSON.stringify(jwtPayload, null, 2) : '// Decoded payload claims will render here'}
                </pre>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: Cron Generator */}
        {activeTab === 'cron' && (
          <div style={{ background: 'var(--surface-1, rgba(255,255,255,0.02))', border: '1px solid var(--border-color)', borderRadius: '8px', padding: '2rem' }}>
            <h2 style={{ fontSize: '1.25rem', margin: '0 0 0.5rem 0' }}>Cron Schedule Expression Builder</h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
              Build POSIX/Linux cron expressions interactively with standard 5-part field syntax.
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '1rem', marginBottom: '1.5rem' }}>
              {[
                { label: 'Minute', val: minute, set: setMinute },
                { label: 'Hour', val: hour, set: setHour },
                { label: 'Day of Month', val: dayOfMonth, set: setDayOfMonth },
                { label: 'Month', val: month, set: setMonth },
                { label: 'Day of Week', val: dayOfWeek, set: setDayOfWeek },
              ].map((f) => (
                <div key={f.label}>
                  <label style={{ display: 'block', fontSize: '0.75rem', fontFamily: 'monospace', color: 'var(--text-muted)', marginBottom: '0.4rem' }}>
                    {f.label.toUpperCase()}
                  </label>
                  <input
                    type="text"
                    value={f.val}
                    onChange={(e) => f.set(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '0.6rem',
                      borderRadius: '4px',
                      background: 'var(--void, #050505)',
                      border: '1px solid var(--border-color)',
                      color: 'var(--text)',
                      fontFamily: 'monospace',
                      boxSizing: 'border-box',
                    }}
                  />
                </div>
              ))}
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem', background: 'var(--void, #050505)', border: '1px solid var(--border-color)', borderRadius: '6px' }}>
              <div>
                <div style={{ fontSize: '0.75rem', fontFamily: 'monospace', color: 'var(--text-muted)', marginBottom: '0.25rem' }}>GENERATED EXPRESSION:</div>
                <code style={{ fontSize: '1.25rem', fontFamily: 'monospace', color: 'var(--signal, var(--gold))', fontWeight: 'bold' }}>{cronExpression}</code>
                <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '0.35rem' }}>{describeCron()}</div>
              </div>
              <button
                type="button"
                onClick={() => copyToClipboard(cronExpression, 'cron')}
                className="btn btn-gold"
                style={{ fontSize: '0.8rem', padding: '0.45rem 0.9rem' }}
              >
                {cronCopied ? 'Copied!' : 'Copy Expression'}
              </button>
            </div>
          </div>
        )}

        {/* TAB 3: Base64 Engine */}
        {activeTab === 'base64' && (
          <div style={{ background: 'var(--surface-1, rgba(255,255,255,0.02))', border: '1px solid var(--border-color)', borderRadius: '8px', padding: '2rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
              <div>
                <h2 style={{ fontSize: '1.25rem', margin: '0 0 0.25rem 0' }}>Base64 Encoder &amp; Decoder</h2>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', margin: 0 }}>UTF-8 compliant encoding with optional RFC 4648 URL-safe alphabet.</p>
              </div>

              <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                <button
                  type="button"
                  onClick={() => setB64Mode('encode')}
                  className={b64Mode === 'encode' ? 'btn btn-gold' : 'btn btn-ghost'}
                  style={{ fontSize: '0.8rem', padding: '0.35rem 0.75rem' }}
                >
                  Encode
                </button>
                <button
                  type="button"
                  onClick={() => setB64Mode('decode')}
                  className={b64Mode === 'decode' ? 'btn btn-gold' : 'btn btn-ghost'}
                  style={{ fontSize: '0.8rem', padding: '0.35rem 0.75rem' }}
                >
                  Decode
                </button>

                <label style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.78rem', fontFamily: 'monospace', color: 'var(--text-muted)', marginLeft: '0.75rem', cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    checked={b64UrlSafe}
                    onChange={(e) => setB64UrlSafe(e.target.checked)}
                  />
                  <span>URL-Safe (- / _)</span>
                </label>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', fontFamily: 'monospace', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>
                  INPUT PAYLOAD ({b64Mode.toUpperCase()})
                </label>
                <textarea
                  value={b64Input}
                  onChange={(e) => setB64Input(e.target.value)}
                  placeholder={`Type or paste string to ${b64Mode}...`}
                  rows={8}
                  style={{
                    width: '100%',
                    padding: '0.85rem',
                    borderRadius: '6px',
                    background: 'var(--void, #050505)',
                    border: '1px solid var(--border-color)',
                    color: 'var(--text)',
                    fontFamily: 'monospace',
                    fontSize: '0.85rem',
                    resize: 'vertical',
                    boxSizing: 'border-box',
                  }}
                />
              </div>

              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                  <span style={{ fontSize: '0.75rem', fontFamily: 'monospace', color: 'var(--text-muted)' }}>
                    TRANSFORMED RESULT
                  </span>
                  {b64Output && (
                    <button
                      type="button"
                      onClick={() => copyToClipboard(b64Output, 'b64')}
                      style={{ background: 'none', border: 'none', color: 'var(--signal, var(--gold))', cursor: 'pointer', fontFamily: 'monospace', fontSize: '0.75rem' }}
                    >
                      {b64Copied ? 'Copied!' : 'Copy Result ↗'}
                    </button>
                  )}
                </div>
                <textarea
                  readOnly
                  value={b64Output}
                  placeholder="// Result will appear here automatically..."
                  rows={8}
                  style={{
                    width: '100%',
                    padding: '0.85rem',
                    borderRadius: '6px',
                    background: 'var(--void, #050505)',
                    border: '1px solid var(--border-color)',
                    color: 'var(--signal, var(--gold))',
                    fontFamily: 'monospace',
                    fontSize: '0.85rem',
                    resize: 'vertical',
                    boxSizing: 'border-box',
                  }}
                />
                {b64Error && (
                  <div style={{ marginTop: '0.5rem', color: 'var(--red, #ef4444)', fontSize: '0.75rem', fontFamily: 'monospace' }}>
                    {b64Error}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: Hash Generator */}
        {activeTab === 'hash' && (
          <div style={{ background: 'var(--surface-1, rgba(255,255,255,0.02))', border: '1px solid var(--border-color)', borderRadius: '8px', padding: '2rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
              <div>
                <h2 style={{ fontSize: '1.25rem', margin: '0 0 0.25rem 0' }}>Cryptographic Hash Generator</h2>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', margin: 0 }}>Native Web Crypto SubtleDigest algorithms with zero network calls.</p>
              </div>

              <div style={{ display: 'flex', gap: '0.5rem' }}>
                {['SHA-256', 'SHA-512', 'SHA-1'].map((algo) => (
                  <button
                    key={algo}
                    type="button"
                    onClick={() => setHashAlgo(algo)}
                    className={hashAlgo === algo ? 'btn btn-gold' : 'btn btn-ghost'}
                    style={{ fontSize: '0.8rem', padding: '0.35rem 0.75rem' }}
                  >
                    {algo}
                  </button>
                ))}
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', fontFamily: 'monospace', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>
                  PLAINTEXT INPUT STRING
                </label>
                <textarea
                  value={hashInput}
                  onChange={(e) => setHashInput(e.target.value)}
                  placeholder="Type or paste plaintext string to compute cryptographic hash digest..."
                  rows={5}
                  style={{
                    width: '100%',
                    padding: '0.85rem',
                    borderRadius: '6px',
                    background: 'var(--void, #050505)',
                    border: '1px solid var(--border-color)',
                    color: 'var(--text)',
                    fontFamily: 'monospace',
                    fontSize: '0.85rem',
                    resize: 'vertical',
                    boxSizing: 'border-box',
                  }}
                />
              </div>

              <div style={{ padding: '1rem', background: 'var(--void, #050505)', border: '1px solid var(--border-color)', borderRadius: '6px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                  <span style={{ fontSize: '0.75rem', fontFamily: 'monospace', color: 'var(--text-muted)' }}>
                    HEX DIGEST ({hashAlgo}):
                  </span>
                  {hashOutput && (
                    <button
                      type="button"
                      onClick={() => copyToClipboard(hashOutput, 'hash')}
                      style={{ background: 'none', border: 'none', color: 'var(--signal, var(--gold))', cursor: 'pointer', fontFamily: 'monospace', fontSize: '0.75rem' }}
                    >
                      {hashCopied ? 'Copied!' : 'Copy Hash ↗'}
                    </button>
                  )}
                </div>
                <code style={{ display: 'block', wordBreak: 'break-all', fontFamily: 'monospace', fontSize: '0.9rem', color: hashOutput ? 'var(--signal, var(--gold))' : 'var(--text-muted)' }}>
                  {hashOutput || '// Type input above to generate hash'}
                </code>
              </div>
            </div>
          </div>
        )}

        {/* TAB 5: JSON Formatter & Validator */}
        {activeTab === 'json' && (
          <div style={{ background: 'var(--surface-1, rgba(255,255,255,0.02))', border: '1px solid var(--border-color)', borderRadius: '8px', padding: '2rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
              <div>
                <h2 style={{ fontSize: '1.25rem', margin: '0 0 0.25rem 0' }}>JSON Formatter, Validator &amp; Minifier</h2>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', margin: 0 }}>Validates syntax integrity and beautifies structured payloads.</p>
              </div>

              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <button
                  type="button"
                  onClick={() => handleFormatJson(2)}
                  className="btn btn-gold"
                  style={{ fontSize: '0.8rem', padding: '0.35rem 0.75rem' }}
                >
                  Prettify (2 Spaces)
                </button>
                <button
                  type="button"
                  onClick={() => handleFormatJson(0)}
                  className="btn btn-ghost"
                  style={{ fontSize: '0.8rem', padding: '0.35rem 0.75rem' }}
                >
                  Minify (Compact)
                </button>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', fontFamily: 'monospace', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>
                  RAW JSON INPUT
                </label>
                <textarea
                  value={jsonInput}
                  onChange={(e) => setJsonInput(e.target.value)}
                  placeholder="Paste unformatted or raw JSON string..."
                  rows={10}
                  style={{
                    width: '100%',
                    padding: '0.85rem',
                    borderRadius: '6px',
                    background: 'var(--void, #050505)',
                    border: '1px solid var(--border-color)',
                    color: 'var(--text)',
                    fontFamily: 'monospace',
                    fontSize: '0.85rem',
                    resize: 'vertical',
                    boxSizing: 'border-box',
                  }}
                />
                {jsonError && (
                  <div style={{ marginTop: '0.5rem', padding: '0.6rem', borderRadius: '4px', background: 'rgba(239, 68, 68, 0.1)', color: 'var(--red, #ef4444)', fontSize: '0.75rem', fontFamily: 'monospace' }}>
                    [SYNTAX ERROR]: {jsonError}
                  </div>
                )}
              </div>

              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                  <span style={{ fontSize: '0.75rem', fontFamily: 'monospace', color: 'var(--text-muted)' }}>
                    FORMATTED OUTPUT
                  </span>
                  {jsonOutput && (
                    <button
                      type="button"
                      onClick={() => copyToClipboard(jsonOutput, 'json')}
                      style={{ background: 'none', border: 'none', color: 'var(--signal, var(--gold))', cursor: 'pointer', fontFamily: 'monospace', fontSize: '0.75rem' }}
                    >
                      {jsonCopied ? 'Copied!' : 'Copy Formatted JSON ↗'}
                    </button>
                  )}
                </div>
                <textarea
                  readOnly
                  value={jsonOutput}
                  placeholder="// Formatted JSON output will render here..."
                  rows={10}
                  style={{
                    width: '100%',
                    padding: '0.85rem',
                    borderRadius: '6px',
                    background: 'var(--void, #050505)',
                    border: '1px solid var(--border-color)',
                    color: 'var(--text)',
                    fontFamily: 'monospace',
                    fontSize: '0.85rem',
                    resize: 'vertical',
                    boxSizing: 'border-box',
                  }}
                />
              </div>
            </div>
          </div>
        )}
      </main>
  );
}
