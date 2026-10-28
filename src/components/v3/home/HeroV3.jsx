'use client';

import React, { useEffect, useRef, useState } from 'react';
import Emoji3D from '../Emoji3D';
import { PlayableElement, EditableText } from '@/components/PlaygroundWrappers';
import { useBootComplete, useMagneticButtons, prefersReducedMotion } from '../motion';

const COMMANDS = [
  'ls -la /projects/',
  'git log --oneline -5',
  'sudo systemctl status nginx',
  'ssh root@192.168.1.1',
  'cat /etc/hosts',
];

const STATS = [
  { target: 1, suffix: '', label: 'Granted Patent', meta: '2025' },
  { target: 30, suffix: '+', label: 'Verified Certifications', meta: 'CompTIA · IBM · THM' },
  { target: 40, suffix: '+', label: 'Shipped Systems', meta: 'Production' },
  { target: 5, suffix: '+', label: 'Years Engineering', meta: 'Since 2021' },
];

const TELEMETRY = [
  ['PATENT', 'IN 544062 · App No. 202531060002 A (Jul 2025)'],
  ['TITLE', 'Solar IoT Vaccine Preservation System'],
  ['HARDWARE', 'NodeMCU ESP8266 + MQTT + Peltier Cooling'],
  ['STACK', 'Next.js 16 · Supabase · Sanity v3 · WebRTC'],
  ['LOCATION', 'Kolkata, WB, IN (22.5726° N, 88.3639° E)'],
];

function localTime() {
  try {
    return new Date().toLocaleTimeString('en-GB', {
      timeZone: 'Asia/Kolkata',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    });
  } catch {
    return '';
  }
}

export default function HeroV3() {
  const rootRef = useRef(null);
  const [booted, setBooted] = useState(false);
  const [clock, setClock] = useState('');
  const [typed, setTyped] = useState(COMMANDS[0]);

  useBootComplete(() => setBooted(true));
  useMagneticButtons(rootRef);

  useEffect(() => {
    const tick = () => setClock(localTime());
    tick();
    const id = window.setInterval(tick, 30000);
    return () => window.clearInterval(id);
  }, []);

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

    const start = performance.now() + 550;
    const duration = 1100;
    let frame = 0;

    const tick = (now) => {
      const elapsed = now - start;
      const t = Math.min(1, Math.max(0, elapsed / duration));
      const eased = 1 - (1 - t) * (1 - t);
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

  useEffect(() => {
    if (!booted || prefersReducedMotion()) return undefined;

    let disposed = false;
    let timer = null;
    let index = 0;
    let chars = 0;
    let deleting = false;
    let visible = true;

    const terminal = rootRef.current?.querySelector('.v3-terminal');
    let observer = null;
    if (terminal) {
      observer = new IntersectionObserver(
        ([entry]) => {
          visible = entry.isIntersecting;
        },
        { threshold: 0.1 }
      );
      observer.observe(terminal);
    }

    const step = () => {
      if (disposed) return;
      if (!visible || document.visibilityState === 'hidden') {
        timer = window.setTimeout(step, 700);
        return;
      }

      const command = COMMANDS[index];
      if (!deleting) {
        chars += 1;
        setTyped(command.slice(0, chars));
        if (chars >= command.length) {
          deleting = true;
          timer = window.setTimeout(step, 1700);
          return;
        }
        timer = window.setTimeout(step, 52 + Math.random() * 36);
      } else {
        chars -= 2;
        setTyped(command.slice(0, Math.max(0, chars)));
        if (chars <= 0) {
          deleting = false;
          index = (index + 1) % COMMANDS.length;
          chars = 0;
          timer = window.setTimeout(step, 420);
          return;
        }
        timer = window.setTimeout(step, 26);
      }
    };

    timer = window.setTimeout(step, 800);
    return () => {
      disposed = true;
      observer?.disconnect();
      window.clearTimeout(timer);
    };
  }, [booted]);

  return (
    <section id="hero" className="v3-hero" ref={rootRef} aria-labelledby="hero-title">
      <div className="v3-hero-atmosphere" aria-hidden="true">
        <span className="v3-hero-sun-halo" />
        <span className="v3-hero-grid" />
        <svg
          className="v3-hero-thread"
          viewBox="0 0 1000 700"
          fill="none"
          preserveAspectRatio="none"
        >
          <path
            d="M-20 120C120 120 160 40 290 40c150 0 150 150 300 150 160 0 180-120 430-120"
            stroke="currentColor"
            strokeWidth="1"
            vectorEffect="non-scaling-stroke"
          />
          <path
            d="M-20 660c170 0 210-90 360-90 170 0 170 90 330 90 150 0 190-70 350-70"
            stroke="currentColor"
            strokeWidth="1"
            vectorEffect="non-scaling-stroke"
          />
        </svg>
      </div>

      <div className="v3-shell v3-hero-shell">
        <div className="v3-hero-topline" data-hero-fade>
          <span className="v3-eyebrow">
            <span className="v3-pulse-dot" aria-hidden="true" />
            Open to Global Roles · IST (UTC+5:30)
          </span>
        </div>

        <div className="v3-hero-grid">
          <div className="v3-hero-main v3-glass-card">
            <div className="v3-cover-badge-row" data-hero-fade>
              <span className="v3-cover-badge">★ COVER STORY</span>
            </div>

            <h1 className="v3-hero-title" id="hero-title">
              <span className="v3-hero-line v3-hero-line--small">
                <span data-hero-line>SK</span>
              </span>
              <span className="v3-hero-line">
                <span data-hero-line>
                  <EditableText tag="span" className="v3-hero-name-serif">
                    Sahinur
                  </EditableText>
                </span>
              </span>
              <span className="v3-hero-line v3-hero-line--italic">
                <span data-hero-line>
                  <EditableText tag="span" className="v3-hero-name-italic">
                    Islam
                  </EditableText>
                  <span className="v3-hero-period">.</span>
                </span>
              </span>
              <span className="sr-only">
                (Genious Sonu) — Senior Web Application Developer &amp; Systems Architect
              </span>
            </h1>

            <p className="v3-hero-role" data-hero-fade>
              <EditableText tag="span">Senior Web Application Developer &amp; Systems Architect</EditableText>
            </p>
            <p className="v3-hero-desc" data-hero-fade>
              <EditableText tag="span">
                <span className="v3-serif-accent">Architecting resilient real-time protocols</span>, secure distributed systems, and
                high-fidelity product interfaces.
              </EditableText>
            </p>

            <div className="v3-hero-pills" data-hero-fade>
              <span className="v3-pill-tag v3-pill-tag--pink">Granted Patentee (IoT)</span>
              <span className="v3-pill-tag v3-pill-tag--lime">Co-Founder @ WEFIK</span>
              <span className="v3-pill-tag v3-pill-tag--yellow">30+ Verified Credentials</span>
            </div>

            <div className="v3-hero-actions" data-hero-fade>
              <a href="#projects" className="v3-btn v3-btn--primary" data-magnetic>
                <span>Selected Works</span>
                <span aria-hidden="true">↓</span>
              </a>
              <a
                href="/projects/iot-cold-chain-patent"
                className="v3-btn v3-btn--ghost"
                data-magnetic
              >
                <span>Patent Blueprint</span>
                <span aria-hidden="true">→</span>
              </a>
            </div>
          </div>

          <aside className="v3-hero-aside">
            <div className="v3-orbit-card">
              <div className="v3-orbit-visual" aria-hidden="true">
                <span className="v3-orbit-ring v3-orbit-ring--one" />
                <span className="v3-orbit-ring v3-orbit-ring--two" />
                <Emoji3D name="sun" size={92} priority className="v3-orbit-sun" />
              </div>
              <div className="v3-orbit-copy">
                <span className="v3-mono-label">Based in</span>
                <strong>Kolkata, India</strong>
                <span className="v3-orbit-time">
                  {clock ? (
                    <>
                      {clock} <span>IST</span>
                    </>
                  ) : (
                    'UTC+5:30'
                  )}
                </span>
              </div>
            </div>

            <PlayableElement className="v3-terminal-wrap">
              <div className="v3-terminal">
                <div className="v3-terminal-head">
                  <span className="v3-terminal-dots" aria-hidden="true">
                    <span />
                    <span />
                    <span />
                  </span>
                  <span className="v3-terminal-title">sahinur.is // systems-telemetry</span>
                </div>
                <dl className="v3-terminal-body">
                  {TELEMETRY.map(([key, value]) => (
                    <div key={key} className="v3-terminal-row">
                      <dt>{key}</dt>
                      <dd>{value}</dd>
                    </div>
                  ))}
                  <div className="v3-terminal-row v3-terminal-row--command">
                    <dt>$</dt>
                    <dd>
                      {typed}
                      <span className="v3-caret" aria-hidden="true" />
                    </dd>
                  </div>
                  <div className="v3-terminal-output">
                    SK Sahinur Islam // Senior Web Application Developer &amp; Co-Founder
                  </div>
                </dl>
              </div>
            </PlayableElement>
          </aside>
        </div>

        <dl className="v3-hero-stats" data-hero-fade aria-label="Career statistics">
          {STATS.map((stat) => (
            <div key={stat.label} className="v3-stat">
              <dd
                className="v3-stat-num"
                data-stat-target={stat.target}
                data-stat-suffix={stat.suffix}
              >
                {stat.target}
                {stat.suffix}
              </dd>
              <dt className="v3-stat-label">{stat.label}</dt>
              <span className="v3-stat-meta">{stat.meta}</span>
            </div>
          ))}
        </dl>

        <div className="v3-hero-foot" data-hero-fade>
          <a href="#about" className="v3-scroll-cue" data-v3-sound="tick">
            <span className="v3-scroll-line" aria-hidden="true">
              <span />
            </span>
            Scroll to follow the thread.
          </a>
          <span className="v3-hero-footnote">01 — Arrival</span>
        </div>
      </div>
    </section>
  );
}
