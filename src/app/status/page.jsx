import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { getServiceSupabase } from '@/lib/supabaseServer';
import styles from './status.module.css';

export const revalidate = 300; // 5-minute server-side cache to conserve API quota

export const metadata = {
  title: 'System Health & Service Status — SK Sahinur Islam',
  description: 'Real-time operational status and response latencies for core services powering genioussonu.me.',
  openGraph: {
    title: 'System Health & Status — SK Sahinur Islam',
    description: 'Real-time operational health checks for Supabase, Telegram, Resend, and edge services.',
    url: 'https://genioussonu.me/status',
  },
};

async function checkSupabase() {
  const start = Date.now();
  try {
    const supabase = getServiceSupabase();
    const { error } = await supabase
      .from('site_visit_log')
      .select('visitor_id', { count: 'exact', head: true })
      .limit(1);

    const latency = Date.now() - start;
    if (error) {
      console.warn('[Status Probe] Supabase read returned error:', error.message);
      return { status: 'degraded', label: 'Degraded Performance', latency };
    }
    return { status: 'operational', label: 'Operational', latency };
  } catch (err) {
    console.error('[Status Probe] Supabase exception caught server-side:', err?.message || err);
    return { status: 'unable_to_verify', label: 'Unable to verify', latency: null };
  }
}

async function checkTelegram() {
  const start = Date.now();
  const botToken = process.env.TELEGRAM_BOT_TOKEN;
  if (!botToken) {
    return { status: 'unmonitored', label: 'Not Configured', latency: null };
  }
  try {
    const res = await fetch(`https://api.telegram.org/bot${botToken}/getMe`, {
      next: { revalidate: 300 },
      signal: AbortSignal.timeout(4000),
    });
    const latency = Date.now() - start;
    const data = await res.json().catch(() => ({}));

    if (res.ok && data.ok) {
      return { status: 'operational', label: 'Operational', latency };
    }
    console.warn('[Status Probe] Telegram returned non-ok status:', res.status);
    return { status: 'degraded', label: 'Degraded Performance', latency };
  } catch (err) {
    console.error('[Status Probe] Telegram exception caught server-side:', err?.message || err);
    return { status: 'unable_to_verify', label: 'Unable to verify', latency: null };
  }
}

async function checkResend() {
  const start = Date.now();
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    return { status: 'unmonitored', label: 'Not Configured', latency: null };
  }
  try {
    const res = await fetch('https://api.resend.com/api-keys', {
      headers: { Authorization: `Bearer ${apiKey}` },
      next: { revalidate: 300 },
      signal: AbortSignal.timeout(4000),
    });
    const latency = Date.now() - start;

    if (res.status === 200) {
      return { status: 'operational', label: 'Operational', latency };
    } else if (res.status === 401 || res.status === 403) {
      // Reached Resend API gateway successfully
      return { status: 'operational', label: 'Operational', latency };
    }
    console.warn('[Status Probe] Resend reachability non-200:', res.status);
    return { status: 'degraded', label: 'Degraded Performance', latency };
  } catch (err) {
    console.error('[Status Probe] Resend exception caught server-side:', err?.message || err);
    return { status: 'unable_to_verify', label: 'Unable to verify', latency: null };
  }
}

function checkAIServices() {
  // As requested: avoid consuming real inference tokens on routine status checks
  return {
    status: 'unmonitored',
    label: 'Quota-Preserving (Passive)',
    latency: null,
  };
}

export default async function StatusPage() {
  const [supabaseResult, telegramResult, resendResult] = await Promise.all([
    checkSupabase(),
    checkTelegram(),
    checkResend(),
  ]);

  const aiResult = checkAIServices();

  const services = [
    {
      name: 'Supabase PostgreSQL & Realtime',
      role: 'Core database, WebSocket channels, and state storage',
      ...supabaseResult,
    },
    {
      name: 'Telegram Live Chat Relay',
      role: 'Bi-directional visitor messaging and mobile push alerts',
      ...telegramResult,
    },
    {
      name: 'Resend Transactional Email',
      role: 'Direct inquiry dispatch and deliverability pipeline',
      ...resendResult,
    },
    {
      name: 'AI Inference Engines (Gemini & OpenRouter)',
      role: 'genious.exe multi-turn autonomous systems assistant',
      ...aiResult,
    },
  ];

  const hasErrors = services.some((s) => s.status === 'unable_to_verify');
  const hasDegraded = services.some((s) => s.status === 'degraded');
  const overallText = hasErrors
    ? 'Partial Service Interruption'
    : hasDegraded
    ? 'Degraded Performance'
    : 'All Core Systems Operational';

  const lastCheckedTime = new Date().toLocaleTimeString('en-US', {
    timeZone: 'Asia/Kolkata',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  });

  return (
    <div className={styles.pageContainer}>
      <div className={styles.ambientGlow} aria-hidden="true" />
      <Navbar />

      <main className={styles.inner}>
        <header className={styles.header}>
          <div className={styles.eyebrow}>
            <span className={styles.pulseDot} aria-hidden="true" />
            <span>Infrastructure Health · Live Monitor</span>
          </div>
          <h1 className={styles.title}>System Status</h1>
          <p className={styles.subtitle}>
            Live operational health check and response latency metrics for third-party relays, databases, and core APIs.
          </p>
        </header>

        {/* Overall Status Banner */}
        <div className={styles.overallBanner}>
          <div className={styles.overallLeft}>
            <span
              className={styles.overallDot}
              style={{
                background: hasErrors ? '#ef4444' : hasDegraded ? '#f59e0b' : '#10b981',
                boxShadow: `0 0 12px ${hasErrors ? '#ef4444' : hasDegraded ? '#f59e0b' : '#10b981'}`,
              }}
            />
            <span className={styles.overallTitle}>{overallText}</span>
          </div>
          <span className={styles.lastUpdated}>
            Checked at {lastCheckedTime} IST · 5m Cache
          </span>
        </div>

        {/* Service Rows */}
        <div className={styles.servicesCard}>
          {services.map((svc) => {
            const isOp = svc.status === 'operational';
            const isDeg = svc.status === 'degraded';
            const isErr = svc.status === 'unable_to_verify';

            const dotClass = isOp
              ? styles.dotOperational
              : isDeg
              ? styles.dotDegraded
              : isErr
              ? styles.dotError
              : styles.dotNeutral;

            const badgeClass = isOp
              ? styles.statusOperational
              : isDeg
              ? styles.statusDegraded
              : isErr
              ? styles.statusError
              : styles.statusNeutral;

            return (
              <div key={svc.name} className={styles.serviceRow}>
                <div className={styles.serviceInfo}>
                  <div className={styles.serviceNameRow}>
                    <span className={`${styles.serviceDot} ${dotClass}`} aria-hidden="true" />
                    <h2 className={styles.serviceName}>{svc.name}</h2>
                  </div>
                  <p className={styles.serviceDescription}>{svc.role}</p>
                </div>

                <div className={styles.serviceStatusCol}>
                  {typeof svc.latency === 'number' && (
                    <span className={styles.latencyBadge}>{svc.latency}ms</span>
                  )}
                  <span className={`${styles.statusBadge} ${badgeClass}`}>
                    {svc.label}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Caching and Monitoring Notice */}
        <aside className={styles.policyNotice}>
          <h3 className={styles.policyTitle}>Quota-Conserving Health Check Architecture</h3>
          <p>
            Health probes are executed server-side and cached with a 5-minute Incremental Static Regeneration (ISR) window. This ensures high availability without exhausting free-tier rate allocations or generating unnecessary upstream traffic. Probe failures are sanitized on the client and captured in server-side logs for debugging.
          </p>
        </aside>
      </main>

      <Footer />
    </div>
  );
}
