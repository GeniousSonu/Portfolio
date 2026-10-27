'use client';

import React, { useRef } from 'react';
import ChapterHeader from '../ChapterHeader';
import Emoji3D from '../Emoji3D';
import { useChapterReveal } from '../motion';

const PROFILE = [
  ['hostname', 'sahinur-dev.local'],
  ['location', 'Kolkata, WB · India'],
  ['timezone', 'Asia/Kolkata (UTC+5:30)'],
  ['education', 'B.Tech IT · GNIT · 2025'],
  ['languages', 'Bengali · English · Hindi'],
  ['availability', 'Open to Work', 'live'],
  ['work-type', 'Remote · Hybrid · On-site'],
  ['email', 'sahinurislamm2002@gmail.com'],
];

export default function AboutV3() {
  const rootRef = useRef(null);
  useChapterReveal(rootRef);

  return (
    <section id="about" className="v3-chapter v3-about" ref={rootRef} aria-labelledby="about-title">
      <div className="v3-shell">
        <ChapterHeader
          number="02"
          chapter="The Person"
          title={
            <>
              Building at the edge of <em>code</em> and <em>infrastructure</em>
            </>
          }
          emoji="compass"
          emojiAlt=""
          id="about-title"
        />

        <div className="v3-about-grid">
          <div className="v3-about-left" data-reveal>
            <figure className="v3-print">
              <div className="v3-print-frame">
                <div
                  className="v3-print-composition"
                  role="img"
                  aria-label="Studio monogram composition for Sahinur Islam"
                >
                  <span className="v3-print-sun" aria-hidden="true" />
                  <span className="v3-print-horizon" aria-hidden="true" />
                  <span className="v3-print-thread" aria-hidden="true" />
                  <span className="v3-print-monogram">SI</span>
                </div>
                <span className="v3-print-note">Kolkata Studio</span>
              </div>
              <figcaption>
                <span>Sahinur Islam</span>
                <span>Design Engineer</span>
              </figcaption>
            </figure>

            <div className="v3-profile">
              <div className="v3-profile-head">
                <span className="v3-terminal-dots" aria-hidden="true">
                  <span />
                  <span />
                  <span />
                </span>
                <span>system-profile.sh</span>
              </div>
              <dl className="v3-profile-body">
                {PROFILE.map(([key, value, state]) => (
                  <div key={key} className="v3-profile-row">
                    <dt>{key}</dt>
                    <dd className={state === 'live' ? 'is-live' : ''}>
                      {state === 'live' ? <span aria-hidden="true">● </span> : null}
                      {value}
                    </dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>

          <div className="v3-about-right">
            <div className="v3-prose" data-reveal>
              <p>
                I&apos;m an IT Engineer and Senior Web Application Developer from Kolkata, India
                with a B.Tech in Information Technology from Guru Nanak Institute of Technology
                (CGPA: 8.17). Currently, I serve as Senior Web Application Developer at Ib Arts,
                leading backend architecture and DevOps systems. Since 2021, I&apos;ve co-founded
                digital agency WEFIK, led dev teams in esports, interned in document QA at ARC, and
                engineered software for global clients.
              </p>
              <p>
                My work spans the full stack: React/Next.js frontends, Node.js/Laravel APIs, MongoDB
                and MySQL databases, Linux server administration, and increasingly — AI integrations
                and IoT systems. I hold 30+ certifications across CompTIA, TryHackMe, Coursera, and
                Udemy.
              </p>
              <p>
                In 2025, I was granted a patent for an IoT-based solar-powered vaccine preservation
                system — built with NodeMCU, MQTT, and Peltier cooling for off-grid healthcare
                supply chains.
              </p>
            </div>

            <div className="v3-about-links" data-reveal>
              <a
                href="https://www.linkedin.com/in/sksahinurislam/"
                target="_blank"
                rel="noopener noreferrer"
                className="v3-text-link"
              >
                LinkedIn <span aria-hidden="true">↗</span>
              </a>
              <a
                href="https://www.upwork.com/freelancers/~0104912246c7c7bdbf"
                target="_blank"
                rel="noopener noreferrer"
                className="v3-text-link"
              >
                Upwork <span aria-hidden="true">↗</span>
              </a>
              <a
                href="https://github.com/GeniousSonu"
                target="_blank"
                rel="noopener noreferrer"
                className="v3-text-link"
              >
                GitHub <span aria-hidden="true">↗</span>
              </a>
            </div>

            <article className="v3-patent-card" data-reveal>
              <div className="v3-patent-top">
                <span className="v3-patent-badge">Patent Granted — 2025</span>
                <Emoji3D name="voltage" size={54} alt="" />
              </div>
              <h3 className="v3-patent-title">
                Solar Powered IoT Vaccine Preservation System with MQTT Telemetry &amp; Zone-wise
                Peltier Cooling
              </h3>
              <p className="v3-patent-meta">
                App No. 202531060002 A · Patent No. 544062 · Granted Jul 4, 2025
              </p>
              <a
                href="https://drive.google.com/drive/folders/1SXCzHl1WOz646EWjiQHYuhG6BGNPTMfJ?usp=sharing"
                target="_blank"
                rel="noopener noreferrer"
                className="v3-text-link v3-patent-link"
              >
                View Patent Document <span aria-hidden="true">→</span>
              </a>
            </article>
          </div>
        </div>
      </div>
    </section>
  );
}
