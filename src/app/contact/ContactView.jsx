'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import Script from 'next/script';
import gsap from 'gsap';
import styles from './contact.module.css';

export default function ContactView() {
  // Form fields
  const [identity, setIdentity] = useState('');
  const [replyAddress, setReplyAddress] = useState('');
  const [payload, setPayload] = useState('');

  // Status & Telemetry
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDelivered, setIsDelivered] = useState(false);
  const [feedback, setFeedback] = useState({ type: '', text: '' });
  const [latency, setLatency] = useState(null);
  const [latencyStatus, setLatencyStatus] = useState('measuring');
  const [localTime, setLocalTime] = useState('');
  const [timeZone, setTimeZone] = useState('UTC');

  // Anti-Bot Telemetry (Honeypot & Form Timing)
  const formMountedAt = useRef(Date.now());
  const [honeypotVal, setHoneypotVal] = useState('');

  // Logs stream
  const [logs, setLogs] = useState([
    { time: '00:00:01', tag: 'SYSTEM', msg: 'Kernel initialized. TLSv1.3 cryptographic handshake ready.' },
    { time: '00:00:02', tag: 'SYSTEM', msg: 'Awaiting operator input on secure channel...' },
  ]);

  // Turnstile state
  const [turnstileToken, setTurnstileToken] = useState(null);
  const [turnstileLoaded, setTurnstileLoaded] = useState(false);
  const turnstileContainerRef = useRef(null);
  const turnstileWidgetId = useRef(null);

  // DOM Refs
  const canvasRef = useRef(null);
  const logContainerRef = useRef(null);
  const submitBtnRef = useRef(null);
  const hasLoggedFocus = useRef({});

  const turnstileSiteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;

  // Append new telemetry log
  const addLog = useCallback((tag, msg) => {
    const now = new Date();
    const timeStr = [
      String(now.getHours()).padStart(2, '0'),
      String(now.getMinutes()).padStart(2, '0'),
      String(now.getSeconds()).padStart(2, '0'),
    ].join(':');

    setLogs((prev) => [...prev.slice(-25), { time: timeStr, tag, msg }]);
  }, []);

  // Auto-scroll logs
  useEffect(() => {
    if (logContainerRef.current) {
      logContainerRef.current.scrollTop = logContainerRef.current.scrollHeight;
    }
  }, [logs]);

  // Measure Real RTT Latency
  const measurePing = useCallback(async () => {
    setLatencyStatus('measuring');
    const start = performance.now();
    try {
      const res = await fetch('/api/contact/ping', { cache: 'no-store' });
      if (res.ok) {
        const rtt = Math.round(performance.now() - start);
        setLatency(rtt);
        setLatencyStatus(rtt < 100 ? 'good' : rtt < 300 ? 'medium' : 'slow');
        addLog('TELEMETRY', `Ping measured: ${rtt}ms RTT to edge node.`);
      } else {
        throw new Error('Ping failed');
      }
    } catch {
      setLatency(null);
      setLatencyStatus('timeout');
      addLog('TELEMETRY', 'Edge ping timeout or offline.');
    }
  }, [addLog]);

  // Clock & Timezone
  useEffect(() => {
    try {
      setTimeZone(Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC');
    } catch {}

    const updateClock = () => {
      const now = new Date();
      setLocalTime(
        now.toLocaleTimeString('en-US', {
          hour12: false,
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
        })
      );
    };

    updateClock();
    const interval = setInterval(updateClock, 1000);
    return () => clearInterval(interval);
  }, []);

  // Initial ping measurement
  useEffect(() => {
    measurePing();
  }, [measurePing]);

  // Turnstile Explicit Render
  useEffect(() => {
    if (
      turnstileLoaded &&
      window.turnstile &&
      turnstileContainerRef.current &&
      turnstileSiteKey &&
      turnstileWidgetId.current === null
    ) {
      try {
        turnstileWidgetId.current = window.turnstile.render(turnstileContainerRef.current, {
          sitekey: turnstileSiteKey,
          theme: 'dark',
          callback: (token) => {
            setTurnstileToken(token);
            addLog('SYSTEM', 'Turnstile challenge passed. Cryptographic token verified.');
          },
          'error-callback': () => {
            addLog('SYSTEM', 'Turnstile verification fallback enabled.');
          },
        });
      } catch (err) {
        console.warn('Turnstile render warning:', err);
      }
    }
  }, [turnstileLoaded, turnstileSiteKey, addLog]);

  // Performance-Gated Node Canvas Background
  useEffect(() => {
    if (typeof window === 'undefined') return;

    // Strict safety gates
    const isTouch = !window.matchMedia('(pointer: fine)').matches;
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const lowCores = (navigator.hardwareConcurrency || 4) < 4;

    if (isTouch || prefersReducedMotion || lowCores) {
      return; // Suppress canvas completely on mobile, touch, or reduced motion
    }

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', handleResize);

    const nodeCount = 38;
    const nodes = Array.from({ length: nodeCount }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 0.5,
      vy: (Math.random() - 0.5) * 0.5,
      radius: Math.random() * 1.5 + 1,
    }));

    let mouseX = -1000;
    let mouseY = -1000;
    const handleMouseMove = (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });

    let lastFrame = 0;
    const targetFps = 30;
    const frameInterval = 1000 / targetFps;

    const render = (time) => {
      animId = requestAnimationFrame(render);
      if (time - lastFrame < frameInterval) return;
      lastFrame = time;

      ctx.clearRect(0, 0, width, height);

      // Draw connections
      for (let i = 0; i < nodes.length; i++) {
        const a = nodes[i];

        // Move
        a.x += a.vx;
        a.y += a.vy;

        if (a.x < 0 || a.x > width) a.vx *= -1;
        if (a.y < 0 || a.y > height) a.vy *= -1;

        // Mouse attraction
        const dxM = mouseX - a.x;
        const dyM = mouseY - a.y;
        const distM = Math.hypot(dxM, dyM);
        if (distM < 140) {
          a.x += dxM * 0.015;
          a.y += dyM * 0.015;
        }

        for (let j = i + 1; j < nodes.length; j++) {
          const b = nodes[j];
          const dx = b.x - a.x;
          const dy = b.y - a.y;
          const dist = Math.hypot(dx, dy);

          if (dist < 110) {
            const alpha = (1 - dist / 110) * 0.18;
            ctx.strokeStyle = `rgba(16, 185, 129, ${alpha})`;
            ctx.lineWidth = 0.75;
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.stroke();
          }
        }

        // Draw particle
        ctx.fillStyle = 'rgba(52, 211, 153, 0.4)';
        ctx.beginPath();
        ctx.arc(a.x, a.y, a.radius, 0, Math.PI * 2);
        ctx.fill();
      }
    };

    animId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  // Magnetic Submit Button on Desktop
  useEffect(() => {
    const btn = submitBtnRef.current;
    if (!btn) return;

    const isTouch = !window.matchMedia('(pointer: fine)').matches;
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (isTouch || prefersReducedMotion) return;

    const xTo = gsap.quickTo(btn, 'x', { duration: 0.3, ease: 'power3.out' });
    const yTo = gsap.quickTo(btn, 'y', { duration: 0.3, ease: 'power3.out' });

    const handleMouseMove = (e) => {
      const rect = btn.getBoundingClientRect();
      const relX = e.clientX - (rect.left + rect.width / 2);
      const relY = e.clientY - (rect.top + rect.height / 2);
      const dist = Math.hypot(relX, relY);

      if (dist < 80) {
        xTo(relX * 0.25);
        yTo(relY * 0.25);
      } else {
        xTo(0);
        yTo(0);
      }
    };

    const handleMouseLeave = () => {
      xTo(0);
      yTo(0);
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    btn.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      btn.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [isDelivered]);

  // Field focus telemetry logs
  const handleFocusField = (fieldName) => {
    if (!hasLoggedFocus.current[fieldName]) {
      hasLoggedFocus.current[fieldName] = true;
      addLog('INPUT', `Buffer allocated for [${fieldName}]. Awaiting stream.`);
    }
  };

  // Form Submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!identity.trim() || !replyAddress.trim() || !payload.trim()) {
      setFeedback({ type: 'error', text: 'All terminal parameters are mandatory.' });
      addLog('ERROR', 'Validation failure: Incomplete parameter set.');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(replyAddress.trim())) {
      setFeedback({ type: 'error', text: 'Invalid reply_address protocol format.' });
      addLog('ERROR', `Malformed email format: "${replyAddress.slice(0, 10)}..."`);
      return;
    }

    setIsSubmitting(true);
    setFeedback({ type: 'info', text: 'Encrypting and transmitting packet...' });
    addLog('TRANSMIT', `Encapsulating payload (${payload.length} bytes)...`);

    // Graceful Turnstile handling: If site key exists but token not resolved yet, wait max 4.5s
    let token = turnstileToken;
    if (turnstileSiteKey && !token) {
      addLog('SYSTEM', 'Awaiting challenge token resolution (timeout: 4.5s)...');
      await Promise.race([
        new Promise((resolve) => {
          const check = setInterval(() => {
            if (turnstileToken) {
              clearInterval(check);
              resolve();
            }
          }, 100);
        }),
        new Promise((resolve) => setTimeout(resolve, 4500)),
      ]);
      token = turnstileToken;
    }

    const elapsedMs = Date.now() - formMountedAt.current;

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: identity.trim(),
          email: replyAddress.trim(),
          message: payload.trim(),
          turnstileToken: token,
          confirm_subject_ref: honeypotVal,
          elapsedMs,
        }),
      });

      const data = await res.json().catch(() => ({}));

      if (res.ok && data.success) {
        setIsDelivered(true);
        setFeedback({ type: 'success', text: 'Connection established. Handshake confirmed.' });
        addLog('OK', 'HTTP 200: Packet delivered successfully to sahinur@dev.');
      } else {
        const errMsg = data.error || 'Transmission dropped by host gateway.';
        setFeedback({ type: 'error', text: errMsg });
        addLog('ERROR', `HTTP ${res.status}: ${errMsg}`);
      }
    } catch (err) {
      console.error('Contact submission error:', err);
      setFeedback({ type: 'error', text: 'Socket error: Connection timed out.' });
      addLog('ERROR', 'Socket failure: Network route unreachable.');
    } finally {
      setIsSubmitting(false);
      // Reset Turnstile token on completion to prevent token replay
      if (typeof window !== 'undefined' && window.turnstile && turnstileWidgetId.current !== null) {
        try {
          window.turnstile.reset(turnstileWidgetId.current);
          setTurnstileToken(null);
        } catch (e) {}
      }
    }
  };

  const handleReset = () => {
    setIsDelivered(false);
    setIdentity('');
    setReplyAddress('');
    setPayload('');
    setFeedback({ type: '', text: '' });
    hasLoggedFocus.current = {};
    addLog('SYSTEM', 'Connection reset. Ready for new transmission.');
  };

  return (
    <div className={styles.pageContainer}>
      {/* Turnstile Script if key configured */}
      {turnstileSiteKey && (
        <Script
          src="https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit"
          strategy="lazyOnload"
          onLoad={() => setTurnstileLoaded(true)}
        />
      )}

      {/* Network Canvas Background */}
      <canvas ref={canvasRef} className={styles.canvasBackground} aria-hidden="true" />

      {/* Ambient Cyber Accents */}
      <div className={styles.ambientGlowTop} aria-hidden="true" />
      <div className={styles.ambientGlowBottom} aria-hidden="true" />

      <main className={styles.mainContent}>
        {/* Header */}
        <header className={styles.headerSection}>
          <div className={styles.breadcrumbBar}>
            <span className={styles.statusIndicator} />
            <span>TERMINAL PORT 443 · ESTABLISH CONNECTION</span>
          </div>
          <h1 className={styles.title}>
            Establish <span className={styles.titleGradient}>Direct Connection</span>
          </h1>
          <p className={styles.subtitle}>
            Initiate a low-latency transmission directly to SK Sahinur Islam (Genious Sonu).
            Telemetry, encryption, and direct routing verified.
          </p>
        </header>

        {/* 2-Column Interface */}
        <div className={styles.interfaceGrid}>
          {/* Column 1: Terminal Handshake Form */}
          <div className={styles.terminalCard}>
            <div className={styles.terminalHeader}>
              <div className={styles.terminalControls}>
                <div className={styles.dotRed} />
                <div className={styles.dotYellow} />
                <div className={styles.dotGreen} />
              </div>
              <div className={styles.terminalTitle}>
                <span>session://handshake.sh</span>
              </div>
              <div className={styles.terminalBadge}>
                {isDelivered ? 'ESTABLISHED' : isSubmitting ? 'TRANSMITTING' : 'LISTENING'}
              </div>
            </div>

            {isDelivered ? (
              <div className={styles.successPanel}>
                <div className={styles.successIconBadge}>
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                </div>
                <h2 className={styles.successHeading}>Connection Established</h2>
                <p className={styles.successDetail}>
                  Your message has been encrypted and delivered directly to Sahinur&apos;s personal inbox.
                  A response will be transmitted to <strong style={{ color: '#34d399' }}>{replyAddress}</strong> shortly.
                </p>
                <div className={styles.successActions}>
                  <a
                    href="https://t.me/genious_sonu"
                    target="_blank"
                    rel="noopener noreferrer"
                    className={styles.telegramConnectBtn}
                  >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.894 8.221l-1.97 9.28c-.145.658-.537.818-1.084.508l-3-2.21-1.446 1.394c-.14.18-.357.295-.6.295-.002 0-.003 0-.005 0l.213-3.054 5.56-5.022c.24-.213-.054-.334-.373-.121l-6.869 4.326-2.96-.924c-.643-.204-.657-.643.136-.953l11.57-4.458c.538-.196 1.006.128.832.943z"/>
                    </svg>
                    <span>Talk on Telegram &rarr;</span>
                  </a>
                  <button type="button" onClick={handleReset} className={styles.resetFormBtn}>
                    Send Another Transmission
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className={styles.terminalBody} noValidate>
                {/* Off-screen Autofill-Safe Honeypot Trap */}
                <div
                  style={{
                    position: 'absolute',
                    left: '-9999px',
                    width: 0,
                    height: 0,
                    overflow: 'hidden',
                    opacity: 0,
                    pointerEvents: 'none',
                    zIndex: -1,
                  }}
                  aria-hidden="true"
                >
                  <label htmlFor="contact_view_confirm_ref">Leave empty</label>
                  <input
                    id="contact_view_confirm_ref"
                    type="text"
                    name="confirm_subject_ref"
                    value={honeypotVal}
                    onChange={(e) => setHoneypotVal(e.target.value)}
                    tabIndex={-1}
                    autoComplete="off"
                  />
                </div>

                {/* Identity Field */}
                <div className={styles.formGroup}>
                  <label htmlFor="param-identity" className={styles.formLabel}>
                    <span>
                      <span className={styles.paramPrefix}>$</span>param: identity
                    </span>
                    <span className={styles.paramRequirement}>required [string]</span>
                  </label>
                  <div className={styles.inputWrapper}>
                    <input
                      id="param-identity"
                      name="identity"
                      type="text"
                      className={styles.inputField}
                      placeholder="e.g. Alex Vance / Tech Lead at Acme Corp"
                      value={identity}
                      onChange={(e) => setIdentity(e.target.value)}
                      onFocus={() => handleFocusField('identity')}
                      required
                      autoComplete="name"
                    />
                  </div>
                </div>

                {/* Reply Address Field */}
                <div className={styles.formGroup}>
                  <label htmlFor="param-reply-address" className={styles.formLabel}>
                    <span>
                      <span className={styles.paramPrefix}>$</span>param: reply_address
                    </span>
                    <span className={styles.paramRequirement}>required [email]</span>
                  </label>
                  <div className={styles.inputWrapper}>
                    <input
                      id="param-reply-address"
                      name="reply_address"
                      type="email"
                      className={styles.inputField}
                      placeholder="e.g. alex@acme.com"
                      value={replyAddress}
                      onChange={(e) => setReplyAddress(e.target.value)}
                      onFocus={() => handleFocusField('reply_address')}
                      required
                      autoComplete="email"
                    />
                  </div>
                </div>

                {/* Payload Message Field */}
                <div className={styles.formGroup}>
                  <label htmlFor="param-payload" className={styles.formLabel}>
                    <span>
                      <span className={styles.paramPrefix}>$</span>param: payload
                    </span>
                    <span className={styles.paramRequirement}>required [text]</span>
                  </label>
                  <div className={styles.inputWrapper}>
                    <textarea
                      id="param-payload"
                      name="payload"
                      className={styles.textareaField}
                      placeholder="Describe your architectural challenge, project requirements, or contract inquiry..."
                      value={payload}
                      onChange={(e) => setPayload(e.target.value)}
                      onFocus={() => handleFocusField('payload')}
                      maxLength={5000}
                      required
                    />
                  </div>
                  <div className={styles.charCount}>
                    {payload.length} / 5000 chars
                  </div>
                </div>

                {/* Turnstile Container (if key present) */}
                {turnstileSiteKey && (
                  <div className={styles.turnstileBox}>
                    <div ref={turnstileContainerRef} />
                  </div>
                )}

                {/* Submit Container */}
                <div className={styles.submitButtonContainer}>
                  <button
                    ref={submitBtnRef}
                    type="submit"
                    className={styles.submitBtn}
                    disabled={isSubmitting}
                  >
                    <span className={styles.submitGlow} aria-hidden="true" />
                    <span>{isSubmitting ? 'TRANSMITTING PACKET...' : 'TRANSMIT PACKET ⟩'}</span>
                  </button>

                  <div
                    className={styles.submitStatusFeedback}
                    style={{
                      color:
                        feedback.type === 'error'
                          ? '#f87171'
                          : feedback.type === 'success'
                          ? '#34d399'
                          : '#fbbf24',
                    }}
                  >
                    {feedback.text}
                  </div>
                </div>
              </form>
            )}
          </div>

          {/* Column 2: Live Telemetry Terminal & Connection Info */}
          <div className={styles.telemetryColumn}>
            {/* Live Console Output */}
            <div className={styles.logConsoleWindow}>
              <div className={styles.terminalHeader}>
                <div className={styles.terminalControls}>
                  <div className={styles.dotRed} />
                  <div className={styles.dotYellow} />
                  <div className={styles.dotGreen} />
                </div>
                <div className={styles.terminalTitle}>
                  <span>stdout://telemetry.log</span>
                </div>
                <div className={styles.terminalBadge}>LIVE</div>
              </div>

              <div ref={logContainerRef} className={styles.logOutputContainer} role="log" aria-live="polite">
                {logs.map((log, idx) => (
                  <div key={idx} className={styles.logLine}>
                    <span className={styles.logTime}>[{log.time}]</span>
                    <span
                      className={`${styles.logTag} ${
                        log.tag === 'SYSTEM'
                          ? styles.logTagSystem
                          : log.tag === 'INPUT'
                          ? styles.logTagInput
                          : log.tag === 'TELEMETRY'
                          ? styles.logTagTelemetry
                          : log.tag === 'TRANSMIT'
                          ? styles.logTagTransmit
                          : log.tag === 'OK'
                          ? styles.logTagOk
                          : styles.logTagError
                      }`}
                    >
                      [{log.tag}]
                    </span>
                    <span className={styles.logMsg}>{log.msg}</span>
                  </div>
                ))}
                <div>
                  <span className={styles.logCursor} aria-hidden="true" />
                </div>
              </div>
            </div>

            {/* Connection HUD & Metrics */}
            <div className={styles.hudCard}>
              <div className={styles.hudHeader}>
                <div className={styles.hudTitle}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="10" />
                    <line x1="2" y1="12" x2="22" y2="12" />
                    <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
                  </svg>
                  <span>Network Handshake Telemetry</span>
                </div>
                <button
                  type="button"
                  onClick={measurePing}
                  className={styles.hudRefreshBtn}
                  title="Re-measure edge round-trip latency"
                  aria-label="Refresh ping measurement"
                >
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polyline points="23 4 23 10 17 10" />
                    <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10" />
                  </svg>
                </button>
              </div>

              <div className={styles.metricsGrid}>
                {/* Latency */}
                <div className={styles.metricItem}>
                  <span className={styles.metricLabel}>Edge Latency (RTT)</span>
                  <span
                    className={`${styles.metricValue} ${
                      latencyStatus === 'good'
                        ? styles.latencyGood
                        : latencyStatus === 'medium'
                        ? styles.latencyMedium
                        : styles.latencySlow
                    }`}
                  >
                    {latency !== null ? `${latency} ms` : latencyStatus === 'measuring' ? 'measuring...' : 'timeout'}
                  </span>
                </div>

                {/* Local Clock */}
                <div className={styles.metricItem}>
                  <span className={styles.metricLabel}>Local Time ({timeZone.split('/').pop()})</span>
                  <span className={styles.metricValue}>{localTime || '--:--:--'}</span>
                </div>

                {/* Protocol */}
                <div className={styles.metricItem}>
                  <span className={styles.metricLabel}>Transport Protocol</span>
                  <span className={styles.metricValue}>HTTP/3 · TLSv1.3</span>
                </div>

                {/* Cipher */}
                <div className={styles.metricItem}>
                  <span className={styles.metricLabel}>Cipher Suite</span>
                  <span className={styles.metricValue}>AES-256-GCM</span>
                </div>
              </div>

              {/* Direct Channels JSON Block */}
              <div className={styles.jsonEndpointsBlock}>
                <div>{'{'}</div>
                <div style={{ paddingLeft: '1.2rem' }}>
                  <span className={styles.jsonKey}>&quot;host&quot;</span>: <span className={styles.jsonString}>&quot;genioussonu.me&quot;</span>,
                </div>
                <div style={{ paddingLeft: '1.2rem' }}>
                  <span className={styles.jsonKey}>&quot;operator&quot;</span>: <span className={styles.jsonString}>&quot;SK Sahinur Islam&quot;</span>,
                </div>
                <div style={{ paddingLeft: '1.2rem' }}>
                  <span className={styles.jsonKey}>&quot;email&quot;</span>: <a href="mailto:sahinurislamm2002@gmail.com" className={styles.jsonValLink}>&quot;sahinurislamm2002@gmail.com&quot;</a>,
                </div>
                <div style={{ paddingLeft: '1.2rem' }}>
                  <span className={styles.jsonKey}>&quot;telegram&quot;</span>: <a href="https://t.me/genious_sonu" target="_blank" rel="noopener noreferrer" className={styles.jsonValLink}>&quot;@genious_sonu&quot;</a>,
                </div>
                <div style={{ paddingLeft: '1.2rem' }}>
                  <span className={styles.jsonKey}>&quot;github&quot;</span>: <a href="https://github.com/GeniousSonu" target="_blank" rel="noopener noreferrer" className={styles.jsonValLink}>&quot;github.com/GeniousSonu&quot;</a>,
                </div>
                <div style={{ paddingLeft: '1.2rem' }}>
                  <span className={styles.jsonKey}>&quot;linkedin&quot;</span>: <a href="https://linkedin.com/in/sksahinurislam" target="_blank" rel="noopener noreferrer" className={styles.jsonValLink}>&quot;in/sksahinurislam&quot;</a>
                </div>
                <div>{'}'}</div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
