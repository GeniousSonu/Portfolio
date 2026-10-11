"use client";

import React, { useEffect, useState, useRef } from 'react';
import { useSitePresence } from '@/lib/sitePresence';
import { SlidingNumber } from '@/components/animate-ui/primitives/texts/sliding-number';

function EyeIcon() {
  return (
    <svg
      width="12"
      height="12"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className="status-strip-icon"
    >
      <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}

export default function SiteStatusStrip() {
  const liveCount = useSitePresence();
  const [displayTotal, setDisplayTotal] = useState(null);
  const [loadFailed, setLoadFailed] = useState(false);
  const hasAnimatedRef = useRef(false);

  useEffect(() => {
    let isMounted = true;

    fetch('/api/site-stats')
      .then((res) => {
        if (!res.ok) throw new Error('Failed to fetch');
        return res.json();
      })
      .then((data) => {
        if (!isMounted) return;

        if (data?.ok && typeof data.totalVisitors === 'number') {
          setDisplayTotal(data.totalVisitors);
        } else {
          setLoadFailed(true);
        }
      })
      .catch(() => {
        if (isMounted) {
          setLoadFailed(true);
        }
      });

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <div className="site-status-strip" aria-label="Live site visitor statistics">
      {/* ── Live Online Presence ── */}
      <div className="status-strip-section">
        <span className="status-strip-dot" aria-hidden="true" />
        <span className="status-strip-tag">LIVE</span>
        <span className="status-strip-bullet" aria-hidden="true">·</span>
        <span className="status-strip-num">
          <SlidingNumber value={liveCount} />
        </span>
        <span className="status-strip-label">ONLINE</span>
      </div>

      {/* ── Minimal Divider ── */}
      <div className="status-strip-bar" aria-hidden="true" />

      {/* ── Total Unique Visitors ── */}
      <div className="status-strip-section">
        <EyeIcon />
        <span className="status-strip-num">
          {displayTotal !== null ? (
            <SlidingNumber value={displayTotal} />
          ) : loadFailed ? (
            '—'
          ) : (
            '...'
          )}
        </span>
        <span className="status-strip-label">TOTAL VISITORS</span>
      </div>
    </div>
  );
}
