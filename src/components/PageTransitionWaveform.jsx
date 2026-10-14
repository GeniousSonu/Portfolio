'use client';

import React from 'react';

// Static 3-layered sine waveform path (under 2 KB, pre-calculated)
// Envelope: amplitude rises to max 24px in center and tapers at boundaries
const SINE_WAVE_PATH =
  'M0 30 L20 30.6 L40 31.6 L60 32.7 L80 33.7 L100 34.3 L120 34.1 L140 32.9 L160 30.8 L180 28.1 L200 25.4 L220 23.3 L240 22.3 L260 22.8 L280 24.8 L300 28.1 L320 32.2 L340 36.3 L360 39.5 L380 41.1 L400 40.5 L420 37.6 L440 32.9 L460 27.5 L480 22.4 L500 19 L520 18.2 L540 20.3 L560 25 L580 31.3 L600 38 L620 43.5 L640 46.2 L660 45.3 L680 40.7 L700 33.5 L720 25.5 L740 18.9 L760 15.6 L780 16.6 L800 21.7 L820 29.8 L840 38.6 L860 45.6 L880 48.6 L900 46.7 L920 40.1 L940 30.7 L960 21.1 L980 13.9 L1000 11.2 L1020 13.9 L1040 21.6 L1060 32.4 L1080 43.4 L1100 51.6 L1120 54.4 L1140 50.3 L1160 39.7 L1180 25.1 L1200 30 M0 30 L20 31.4 L40 33.6 L60 36.1 L80 38.2 L100 39 L120 37.9 L140 34.6 L160 29.3 L180 23.1 L200 17.5 L220 14.1 L240 14 L260 17.4 L280 23.5 L300 30.8 L320 37.7 L340 42.4 L360 43.4 L380 40.1 L400 33.1 L420 24.1 L440 15.4 L460 9.7 L480 8.8 L500 13.2 L520 22.1 L540 33.1 L560 43.1 L580 48.7 L600 47.9 L620 40.9 L640 29.6 L660 17.5 L680 9 L700 7.3 L720 13 L740 24.6 L760 38.2 L780 49.3 L800 53.6 L820 49.3 L840 37.7 L860 22.3 L880 8.5 L900 2.2 L920 5.8 L940 18.2 L960 35.1 L980 50.8 L1000 59.8 L1020 58.7 L1040 47.6 L1060 29.8 L1080 11.5 L1100 0.4 L1120 1.9 L1140 14.2 L1160 33.5 L1180 53 L1200 30 M0 30 L20 30.8 L40 32 L60 33 L80 32.8 L100 31.3 L120 28.7 L140 26.2 L160 25.2 L180 26.4 L200 29.7 L220 33.9 L240 37.5 L260 38.8 L280 37 L300 32.3 L320 26.5 L340 21.6 L360 19.8 L380 22 L400 27.6 L420 34.6 L440 40.3 L460 42.4 L480 39.5 L500 32.3 L520 23.2 L540 15.6 L560 13 L580 16.5 L600 25.1 L620 35.6 L640 44 L660 46.8 L680 42.4 L700 32.3 L720 19.8 L740 10.1 L760 7.1 L780 12.3 L800 24.3 L820 38.6 L840 49.4 L860 52.3 L880 45.4 L900 30.8 L920 14 L940 2.7 L960 0.7 L980 9.5 L1000 26.8 L1020 45.5 L1040 57.3 L1060 56.7 L1080 43.7 L1100 22.8 L1120 2.9 L1140 -5.5 L1160 2.4 L1180 25.3 L1200 30';

/**
 * PageTransitionWaveform
 * 
 * Hairline stroke 1.5px SVG waveform positioned fixed at viewport vertical center.
 * Static 3-layered sine path under 2 KB, max amplitude 24px.
 * Animates using transform, opacity, and clip-path only.
 */
export default function PageTransitionWaveform({ active, phase }) {
  if (!active && phase === 'idle') return null;

  return (
    <div
      id="transition-waveform-container"
      className={`transition-waveform-container ${active ? 'active' : ''} phase-${phase}`}
      aria-hidden="true"
    >
      <svg
        className="transition-waveform-svg"
        viewBox="0 0 1200 60"
        preserveAspectRatio="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d={SINE_WAVE_PATH}
          stroke="var(--gold)"
          strokeWidth="1.5"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </div>
  );
}
