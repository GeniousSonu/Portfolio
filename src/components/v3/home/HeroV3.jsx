'use client';

import React, { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import CelestialOrb from './CelestialOrb';
import { useBootComplete, useMagneticButtons, prefersReducedMotion } from '../motion';

const STATS = [
  { target: 1, suffix: '', label: 'Granted Patent', meta: 'IN 544062 · 2025' },
  { target: 30, suffix: '+', label: 'Verified Certifications', meta: 'CompTIA · IBM · THM' },
  { target: 40, suffix: '+', label: 'Shipped Systems', meta: 'Production Applications' },
  { target: 5, suffix: '+', label: 'Years Engineering', meta: 'Systems & Web Architecture' },
];

function getISTTime() {
  try {
    return new Date().toLocaleTimeString('en-GB', {
      timeZone: 'Asia/Kolkata',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    });
  } catch {
    return '11:30';
  }
}

export default function HeroV3() {
  const rootRef = useRef(null);
  const [booted, setBooted] = useState(false);
  const [clock, setClock] = useState(getISTTime);
  const [stickerError, setStickerError] = useState(false);

  useBootComplete(() => setBooted(true));
  useMagneticButtons(rootRef);

  // Sync live IST clock periodically
  useEffect(() => {
    const tick = () => setClock(getISTTime());
    tick();
    const timer = window.setInterval(tick, 30000);
    return () => window.clearInterval(timer);
  }, []);

  // Stats count-up animation only executes post-boot, respecting reduced motion
  useEffect(() => {
    if (!booted) return undefined;
    const root = rootRef.current;
    if (!root) return undefined;

    if (prefersReducedMotion()) {
      root.classList.add('is-settled');
      return undefined;
    }

    root.classList.add('is-armed');

    const nodes = Array.from(root.querySelectorAll('[data-stat-target]'));
    if (!nodes.length) return undefined;

    const start = performance.now() + 300;
    const duration = 1000;
    let frame = 0;

    const tick = (now) => {
      const elapsed = now - start;
      const t = Math.min(1, Math.max(0, elapsed / duration));
      // Ease out cubic
      const eased = 1 - Math.pow(1 - t, 3);
      nodes.forEach((node) => {
        const target = Number(node.getAttribute('data-stat-target'));
        const suffix = node.getAttribute('data-stat-suffix') || '';
        node.textContent = `${Math.round(target * eased)}${suffix}`;
      });
      if (t < 1) frame = window.requestAnimationFrame(tick);
    };

    frame = window.requestAnimationFrame(tick);
    return () => window.cancelAnimationFrame(frame);
  }, [booted]);

  return (
    <section id="hero" className="sn-hero" ref={rootRef} aria-labelledby="hero-title">
      {/* ─── DUAL SCENE DOM LAYERS (CSS-Only Theme Switching) ─── */}
      <div className="sn-scene-wrap" aria-hidden="true">
        {/* Light Theme: Golden Hour Sunrise */}
        <picture className="sn-scene sn-scene--light">
          <source
            media="(max-width: 767px)"
            srcSet="/hero/mobile-light.webp"
            type="image/webp"
          />
          <source
            media="(max-width: 767px)"
            srcSet="/hero/mobile-light.jpg"
            type="image/jpeg"
          />
          <source srcSet="/hero/desktop-light.webp" type="image/webp" />
          <img
            src="/hero/desktop-light.jpg"
            alt=""
            fetchPriority="high"
            className="sn-scene-img"
          />
        </picture>

        {/* Dark Theme: Midnight Signal */}
        <picture className="sn-scene sn-scene--dark">
          <source
            media="(max-width: 767px)"
            srcSet="/hero/mobile-dark.webp"
            type="image/webp"
          />
          <source
            media="(max-width: 767px)"
            srcSet="/hero/mobile-dark.jpg"
            type="image/jpeg"
          />
          <source srcSet="/hero/desktop-dark.webp" type="image/webp" />
          <img
            src="/hero/desktop-dark.jpg"
            alt=""
            fetchPriority="high"
            className="sn-scene-img"
          />
        </picture>

        {/* Ambient atmospheric gradients & vignette */}
        <div className="sn-scene-overlay" />
        <div className="sn-scene-vignette" />
      </div>

      {/* ─── HERO CONTENT SHELL ─── */}
      <div className="sn-shell">
        {/* Top Status Strip with Live Clock & Celestial Orb */}
        <div className="sn-topbar">
          <div className="sn-status-badge">
            <span className="sn-pulse-dot" aria-hidden="true" />
            <span className="sn-status-text">
              Open to Global Roles · Kolkata, India{' '}
              <span className="sn-bengali-accent" title="Kolkata in Bengali">
                (কলকাতা)
              </span>
            </span>
            <span className="sn-status-time" suppressHydrationWarning>
              {clock} <span className="sn-status-tz">IST</span>
            </span>
          </div>

          <div className="sn-orb-slot">
            <CelestialOrb size="large" />
          </div>
        </div>

        {/* Main Stage Grid */}
        <div className="sn-stage">
          <div className="sn-narrative-card">
            <div className="sn-eyebrow-row">
              <span className="sn-eyebrow-badge">★ THE SOLAR NODE</span>
              <span className="sn-badge-meta">EST. 2021 · KOLKATA</span>
            </div>

            <h1 className="sn-headline" id="hero-title">
              <span className="sn-headline-author">SK Sahinur Islam</span>
              <span className="sn-headline-lead">
                Architecting{' '}
                <span className="sn-serif-accent">resilient distributed systems</span>,
                real-time protocols, and high-fidelity web applications.
              </span>
              <span className="sr-only">
                (Genious Sonu) — Senior Web Application Developer &amp; Systems Architect
              </span>
            </h1>

            <p className="sn-role-desc">
              Senior Web Application Developer &amp; Systems Architect. Co-Founder @ WEFIK.
              Grantee of Indian Patent IN 544062 for IoT Vaccine Cold-Chain Preservation.
            </p>

            <div className="sn-pills-row">
              <span className="sn-pill sn-pill--patent">
                <span className="sn-pill-icon" aria-hidden="true">⚡</span>
                Granted Patentee (IoT)
              </span>
              <span className="sn-pill sn-pill--agency">
                <span className="sn-pill-icon" aria-hidden="true">✦</span>
                Co-Founder @ WEFIK
              </span>
              <span className="sn-pill sn-pill--certs">
                <span className="sn-pill-icon" aria-hidden="true">✓</span>
                30+ Verified Credentials
              </span>
            </div>

            <div className="sn-actions">
              <a href="#projects" className="sn-btn sn-btn--primary" data-magnetic>
                <span>Selected Works</span>
                <span className="sn-btn-arrow" aria-hidden="true">↓</span>
              </a>
              <a
                href="/projects/iot-cold-chain-patent"
                className="sn-btn sn-btn--ghost"
                data-magnetic
              >
                <span>Patent Blueprint</span>
                <span className="sn-btn-arrow" aria-hidden="true">→</span>
              </a>
            </div>
          </div>

          {/* Sticker Circle Visual with Rotating Text Ring & SI Fallback */}
          <div className="sn-sticker-card" aria-label="SK Sahinur Islam portrait sticker">
            <div className="sn-sticker-frame">
              {/* Rotating Circular Text Ring */}
              <svg
                className="sn-sticker-text-ring"
                viewBox="0 0 320 320"
                aria-hidden="true"
              >
                <path
                  id="sn-sticker-circle-path"
                  d="M 160, 160 m -122, 0 a 122,122 0 1,1 244,0 a 122,122 0 1,1 -244,0"
                  fill="none"
                />
                <text className="sn-sticker-text-path">
                  <textPath href="#sn-sticker-circle-path" startOffset="0%">
                    SK SAHINUR ISLAM • SYSTEMS ARCHITECT • CO-FOUNDER @ WEFIK •
                  </textPath>
                </text>
              </svg>

              {/* Color Disc (Warm yellow in light, Navy in dark) */}
              <div className="sn-sticker-disc">
                {!stickerError ? (
                  <Image
                    src="/Image/sonu-sticker.png"
                    alt="SK Sahinur Islam sticker portrait"
                    width={320}
                    height={414}
                    priority
                    sizes="(max-width: 767px) 160px, (max-width: 1200px) 260px, 300px"
                    className="sn-sticker-img"
                    onError={() => setStickerError(true)}
                  />
                ) : (
                  <div className="sn-sticker-fallback" aria-label="SK Sahinur Islam">
                    <span>SI</span>
                  </div>
                )}
              </div>

              {/* Die-cut ink rim outline */}
              <div className="sn-sticker-rim" aria-hidden="true" />
            </div>
          </div>
        </div>

        {/* Stats Strip — Server-rendered final values for zero hydration mismatch */}
        <dl className="sn-stats-strip" aria-label="Career statistics">
          {STATS.map((stat) => (
            <div key={stat.label} className="sn-stat-card">
              <dd
                className="sn-stat-num"
                data-stat-target={stat.target}
                data-stat-suffix={stat.suffix}
              >
                {stat.target}
                {stat.suffix}
              </dd>
              <dt className="sn-stat-label">{stat.label}</dt>
              <span className="sn-stat-meta">{stat.meta}</span>
            </div>
          ))}
        </dl>

        {/* Scroll Cue */}
        <div className="sn-foot">
          <a href="#about" className="sn-scroll-cue">
            <span className="sn-scroll-bar" aria-hidden="true" />
            <span>Scroll to explore the architecture</span>
          </a>
          <span className="sn-foot-chapter">01 — Arrival</span>
        </div>
      </div>
    </section>
  );
}
