'use client';

import React, { useCallback, useRef } from 'react';
import { useTheme } from '@/components/v3/ThemeProvider';

/**
 * CelestialOrb — Pure CSS-driven sun/moon theme toggle.
 *
 * In Golden Hour (Light): A warm scalloped golden sun with breathing corona.
 * In Midnight Signal (Dark): A pale cratered moon with an orbiting signal satellite.
 *
 * Zero JSX conditional rendering: Both states live in the DOM and are
 * toggled via [data-theme] CSS rules to prevent hydration mismatch.
 */
export default function CelestialOrb({ size = 'large', className = '' }) {
  const { toggleTheme } = useTheme();
  const orbRef = useRef(null);

  const sizeClass = size === 'large' ? 'sn-orb--lg' : 'sn-orb--sm';

  const handleToggle = useCallback(
    (e) => {
      toggleTheme(e);
    },
    [toggleTheme]
  );

  const handleKeyDown = useCallback(
    (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        handleToggle(e);
      }
    },
    [handleToggle]
  );

  return (
    <button
      ref={orbRef}
      type="button"
      className={`sn-orb ${sizeClass} ${className}`}
      onClick={handleToggle}
      onKeyDown={handleKeyDown}
      aria-label="Toggle theme between Golden Hour and Midnight Signal"
      title="Toggle visual theme (Golden Hour / Midnight Signal)"
    >
      {/* Dynamic ambient glow */}
      <span className="sn-orb-glow" aria-hidden="true" />

      {/* Sun Scalloped Petal Ring (Visible in Light Mode) */}
      <svg
        className="sn-orb-sun-ring"
        viewBox="0 0 200 200"
        aria-hidden="true"
      >
        {Array.from({ length: 12 }).map((_, i) => {
          const angle = (360 / 12) * i;
          const rad = (angle * Math.PI) / 180;
          const cx = 100 + 78 * Math.cos(rad);
          const cy = 100 + 78 * Math.sin(rad);
          return (
            <circle
              key={i}
              cx={cx}
              cy={cy}
              r="20"
              fill="var(--sn-orb-accent, #F7C268)"
              className="sn-sun-petal"
            />
          );
        })}
      </svg>

      {/* Moon Orbit Ring & Satellite (Visible in Dark Mode) */}
      <svg
        className="sn-orb-moon-ring"
        viewBox="0 0 200 200"
        aria-hidden="true"
      >
        <circle
          cx="100"
          cy="100"
          r="86"
          fill="none"
          stroke="var(--sn-signal-cyan, #29F0D4)"
          strokeWidth="1.2"
          strokeDasharray="4 6"
          className="sn-moon-orbit-path"
        />
        <circle
          className="sn-satellite"
          cx="186"
          cy="100"
          r="4.5"
          fill="var(--sn-signal-cyan, #29F0D4)"
        />
      </svg>

      {/* Core Disc */}
      <span className="sn-orb-core">
        {/* Moon Craters (CSS visible only in [data-theme='dark']) */}
        <span className="sn-crater sn-crater--1" aria-hidden="true" />
        <span className="sn-crater sn-crater--2" aria-hidden="true" />
        <span className="sn-crater sn-crater--3" aria-hidden="true" />
        <span className="sn-crater sn-crater--4" aria-hidden="true" />
      </span>

      <span className="sr-only">Toggle visual mode</span>
    </button>
  );
}
