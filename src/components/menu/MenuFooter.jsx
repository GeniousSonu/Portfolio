'use client';

import React from 'react';
import styles from './menu.module.css';

/**
 * MenuFooter Component
 * Implements Section 3.5 Bottom Block:
 * - 32px top margin, hairline rule
 * - Left: ● (accent, 8px) + systems nominal (11px mono gray-500)
 * - Right: link to /status ("status →", 11px mono gray-500)
 */
export default function MenuFooter({ onNavigate }) {
  const handleClick = (e) => {
    if (onNavigate) {
      onNavigate(e, '/status');
    }
  };

  return (
    <footer className={styles.menuFooter}>
      <div className={styles.footerStatus}>
        <span className={styles.statusDot} aria-hidden="true" />
        <span className={styles.statusText}>systems nominal</span>
      </div>

      <a
        href="/status"
        className={styles.statusLink}
        onClick={handleClick}
        aria-label="View system status and health telemetry"
      >
        status →
      </a>
    </footer>
  );
}
