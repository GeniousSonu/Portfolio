'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import styles from './offline.module.css';

export default function OfflineView() {
  const [isOnline, setIsOnline] = useState(false);
  const [checking, setChecking] = useState(false);
  const [pingMessage, setPingMessage] = useState('');

  useEffect(() => {
    setIsOnline(typeof navigator !== 'undefined' ? navigator.onLine : false);

    const handleOnline = () => {
      setIsOnline(true);
      setPingMessage('Connection restored. You are back online!');
    };

    const handleOffline = () => {
      setIsOnline(false);
      setPingMessage('Network connection lost.');
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const handlePing = async () => {
    setChecking(true);
    setPingMessage('');

    try {
      const res = await fetch('/api/contact/ping', {
        cache: 'no-store',
        signal: AbortSignal.timeout(3500),
      });

      if (res.ok) {
        setIsOnline(true);
        setPingMessage('Gateway handshake successful (200 OK). Reload to sync live state.');
      } else {
        setPingMessage(`Server responded with status ${res.status}.`);
      }
    } catch {
      setIsOnline(false);
      setPingMessage('Gateway unreachable. Client is operating in offline mode.');
    } finally {
      setChecking(false);
    }
  };

  return (
    <div className={styles.offlineCard}>
      <div
        className={`${styles.statusIndicator} ${
          isOnline ? styles.indicatorOnline : styles.indicatorOffline
        }`}
      >
        <span className={styles.pulseDot} aria-hidden="true" />
        <span>{isOnline ? 'NETWORK ONLINE' : 'OFFLINE STORAGE ACTIVE'}</span>
      </div>

      <h2 className={styles.cardTitle}>
        {isOnline ? 'Connection Established' : 'No Internet Connection'}
      </h2>

      <p className={styles.cardDesc}>
        {isOnline
          ? 'Your connection to the network has been restored. You can now reload to stream live telemetry and interactive spaces.'
          : 'You are currently browsing without an active network connection. Cached pages and Service Worker assets remain available locally.'}
      </p>

      {pingMessage && <div className={styles.pingResult}>{pingMessage}</div>}

      <div className={styles.actions}>
        <button
          type="button"
          onClick={handlePing}
          disabled={checking}
          className="btn btn-gold"
          style={{ minWidth: '160px' }}
        >
          {checking ? 'Probing Gateway...' : 'Check Connection'}
        </button>

        <button
          type="button"
          onClick={() => window.location.reload()}
          className="btn btn-ghost"
        >
          Reload Page ↻
        </button>
      </div>

      <div className={styles.cachedSection}>
        <div className={styles.cachedTitle}>Locally Available Destinations</div>
        <div className={styles.cachedGrid}>
          <Link href="/" className={styles.cachedLink}>
            <span>Home Console</span>
            <span>↗</span>
          </Link>
          <Link href="/about" className={styles.cachedLink}>
            <span>About Dossier</span>
            <span>↗</span>
          </Link>
          <Link href="/uses" className={styles.cachedLink}>
            <span>Uses Rig</span>
            <span>↗</span>
          </Link>
          <Link href="/architecture" className={styles.cachedLink}>
            <span>Architecture</span>
            <span>↗</span>
          </Link>
          <Link href="/status" className={styles.cachedLink}>
            <span>System Status</span>
            <span>↗</span>
          </Link>
          <Link href="/wiki" className={styles.cachedLink}>
            <span>Knowledge Wiki</span>
            <span>↗</span>
          </Link>
        </div>
      </div>

      <div className={styles.footerHelp}>
        Stuck with stale or corrupted cache?{' '}
        <Link href="/reset" className={styles.resetLink}>
          Run Emergency Cache Purge (/reset)
        </Link>
      </div>
    </div>
  );
}
