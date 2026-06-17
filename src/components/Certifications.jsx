"use client";
import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

/* ── Provider Logo Components ─────────────────────────────── */

/* LinkedIn Learning — official blue "in" mark */
const LogoLinkedIn = () => (
  <svg viewBox="0 0 72 72" width="28" height="28" aria-label="LinkedIn" role="img">
    <rect width="72" height="72" rx="8" fill="#0A66C2"/>
    <path fill="#fff" d="M13.4 27.5h9.4v30.6h-9.4zM18.1 23.5a5.4 5.4 0 1 1 0-10.9 5.4 5.4 0 0 1 0 10.9zM58.7 58.1H49.3V43c0-3.6-.1-8.2-5-8.2-5 0-5.7 3.9-5.7 7.9v15.4H29.2V27.5h9v4.2h.1c1.2-2.4 4.3-4.9 8.8-4.9 9.4 0 11.1 6.2 11.1 14.2v17.1z"/>
  </svg>
);

/* TryHackMe — red lock icon */
const LogoTryHackMe = () => (
  <svg viewBox="0 0 72 72" width="28" height="28" aria-label="TryHackMe" role="img">
    <rect width="72" height="72" rx="8" fill="#212C42"/>
    <path fill="#C11111" d="M36 10c-5.5 0-10 4.5-10 10v4H20v28h32V24h-6v-4c0-5.5-4.5-10-10-10zm0 6c2.2 0 4 1.8 4 4v4H32v-4c0-2.2 1.8-4 4-4zm0 18a4 4 0 1 1 0 8 4 4 0 0 1 0-8z"/>
    <text x="36" y="68" textAnchor="middle" fill="#C11111" fontSize="9" fontFamily="monospace" fontWeight="bold">THM</text>
  </svg>
);

/* Coursera — blue C mark */
const LogoCoursera = () => (
  <svg viewBox="0 0 72 72" width="28" height="28" aria-label="Coursera" role="img">
    <rect width="72" height="72" rx="8" fill="#0056D2"/>
    <path fill="#fff" d="M36 14C23.85 14 14 23.85 14 36s9.85 22 22 22 22-9.85 22-22S48.15 14 36 14zm0 6c7.7 0 14.2 5.2 16.1 12.3-1.9.6-3.9.9-6 .9-5.9 0-11.2-2.7-14.8-6.9A15.9 15.9 0 0 1 36 20zm0 32c-7.7 0-14.2-5.2-16.1-12.3 1.9-.6 3.9-.9 6-.9 5.9 0 11.2 2.7 14.8 6.9A15.9 15.9 0 0 1 36 52z"/>
  </svg>
);

/* Udemy — purple U */
const LogoUdemy = () => (
  <svg viewBox="0 0 72 72" width="28" height="28" aria-label="Udemy" role="img">
    <rect width="72" height="72" rx="8" fill="#A435F0"/>
    <path fill="#fff" d="M22 20h9v20.5c0 4.2 2.2 6.5 5.5 6.5s5.5-2.3 5.5-6.5V20h9v21c0 9-5.5 14.5-14.5 14.5S22 50 22 41V20z"/>
  </svg>
);

/* CompTIA — red/gray shield */
const LogoCompTIA = () => (
  <svg viewBox="0 0 72 72" width="28" height="28" aria-label="CompTIA" role="img">
    <rect width="72" height="72" rx="8" fill="#C8102E"/>
    <path fill="#fff" d="M36 12 L56 22 L56 42 C56 52 46 62 36 66 C26 62 16 52 16 42 L16 22 Z"/>
    <path fill="#C8102E" d="M36 18 L50 26 L50 42 C50 50 43 58 36 61 C29 58 22 50 22 42 L22 26 Z"/>
    <text x="36" y="46" textAnchor="middle" fill="#fff" fontSize="11" fontFamily="sans-serif" fontWeight="bold">A+</text>
  </svg>
);

/* Aon / CoCubes — corporate blue */
const LogoAon = () => (
  <svg viewBox="0 0 72 72" width="28" height="28" aria-label="Aon" role="img">
    <rect width="72" height="72" rx="8" fill="#1C1C1C"/>
    <text x="36" y="45" textAnchor="middle" fill="#fff" fontSize="22" fontFamily="Georgia,serif" fontWeight="bold" letterSpacing="1">Aon</text>
  </svg>
);

/* Ardent Computech — teal badge */
const LogoArdent = () => (
  <svg viewBox="0 0 72 72" width="28" height="28" aria-label="Ardent Computech" role="img">
    <rect width="72" height="72" rx="8" fill="#0D7377"/>
    <text x="36" y="32" textAnchor="middle" fill="#fff" fontSize="11" fontFamily="sans-serif" fontWeight="700">ARDENT</text>
    <text x="36" y="47" textAnchor="middle" fill="#92E3E4" fontSize="8" fontFamily="monospace">COMPUTECH</text>
    <path fill="none" stroke="#fff" strokeWidth="2" d="M20 54 L36 42 L52 54"/>
  </svg>
);

/* ── Cert data ─────────────────────────────────────────────── */
const CERTS = [
  {
    Logo: LogoLinkedIn,
    bg: 'rgba(10,102,194,0.1)',
    border: 'rgba(10,102,194,0.25)',
    title: 'CompTIA A+',
    issuer: 'LinkedIn Learning / CompTIA',
    date: 'Dec 2024',
  },
  {
    Logo: LogoTryHackMe,
    bg: 'rgba(193,17,17,0.1)',
    border: 'rgba(193,17,17,0.25)',
    title: 'Cyber Security Introduction',
    issuer: 'TryHackMe',
    date: 'Feb 2024',
    credId: 'THM-5QHQT2VOVJ',
  },
  {
    Logo: LogoTryHackMe,
    bg: 'rgba(193,17,17,0.1)',
    border: 'rgba(193,17,17,0.25)',
    title: 'Pre Security Certification',
    issuer: 'TryHackMe',
    date: 'Feb 2024',
    credId: 'THM-88MDZBT3U5',
  },
  {
    Logo: LogoAon,
    bg: 'rgba(255,255,255,0.05)',
    border: 'rgba(255,255,255,0.1)',
    title: 'CoCubes Certified — Coding & Aptitude',
    issuer: 'Aon',
    date: 'Dec 2024',
  },
  {
    Logo: LogoCoursera,
    bg: 'rgba(0,86,210,0.1)',
    border: 'rgba(0,86,210,0.25)',
    title: 'Machine Learning with Python (Honors)',
    issuer: 'Coursera / IBM',
    date: 'Oct 2023',
    credId: 'RRAHPVASHC4C',
  },
  {
    Logo: LogoArdent,
    bg: 'rgba(13,115,119,0.1)',
    border: 'rgba(13,115,119,0.25)',
    title: 'AI & Machine Learning Using Python',
    issuer: 'Ardent Computech Pvt Ltd',
    date: 'Mar 2023',
  },
  {
    Logo: LogoLinkedIn,
    bg: 'rgba(10,102,194,0.1)',
    border: 'rgba(10,102,194,0.25)',
    title: 'Advanced Linux: The Linux Kernel',
    issuer: 'LinkedIn Learning',
    date: 'Dec 2024',
  },
  {
    Logo: LogoLinkedIn,
    bg: 'rgba(10,102,194,0.1)',
    border: 'rgba(10,102,194,0.25)',
    title: 'Wireless Networking: Advanced Troubleshooting',
    issuer: 'LinkedIn Learning',
    date: 'Dec 2024',
  },
  {
    Logo: LogoUdemy,
    bg: 'rgba(164,53,240,0.1)',
    border: 'rgba(164,53,240,0.25)',
    title: 'FortiGate Web Filter',
    issuer: 'Udemy',
    date: 'May 2024',
    credId: 'UC-9a6b7ad0',
  },
  {
    Logo: LogoLinkedIn,
    bg: 'rgba(10,102,194,0.1)',
    border: 'rgba(10,102,194,0.25)',
    title: 'Building Web3 DApps in Ethereum',
    issuer: 'LinkedIn Learning',
    date: 'Dec 2024',
  },
  {
    Logo: LogoCoursera,
    bg: 'rgba(0,86,210,0.1)',
    border: 'rgba(0,86,210,0.25)',
    title: 'Introduction to IoT & Embedded Systems',
    issuer: 'Coursera / UC Irvine',
    date: 'Oct 2022',
    credId: 'BJFWPHLPQVLL',
  },
  {
    Logo: LogoCoursera,
    bg: 'rgba(0,86,210,0.1)',
    border: 'rgba(0,86,210,0.25)',
    title: 'Object Oriented Programming in Java',
    issuer: 'Coursera / Duke University',
    date: 'Apr 2023',
    credId: 'AT6DSAD54YM2',
  },
  {
    Logo: LogoLinkedIn,
    bg: 'rgba(10,102,194,0.1)',
    border: 'rgba(10,102,194,0.25)',
    title: 'Creating a Chat Tool Using OpenAI & Pinecone',
    issuer: 'LinkedIn Learning',
    date: 'Dec 2024',
  },
  {
    Logo: LogoUdemy,
    bg: 'rgba(164,53,240,0.1)',
    border: 'rgba(164,53,240,0.25)',
    title: 'WordPress Web Development',
    issuer: 'Udemy',
    date: 'May 2024',
    credId: 'UC-62fffd69',
  },
  {
    Logo: LogoLinkedIn,
    bg: 'rgba(10,102,194,0.1)',
    border: 'rgba(10,102,194,0.25)',
    title: 'Power BI: Working with ChatGPT',
    issuer: 'LinkedIn Learning',
    date: 'Dec 2024',
  },
  {
    Logo: LogoLinkedIn,
    bg: 'rgba(10,102,194,0.1)',
    border: 'rgba(10,102,194,0.25)',
    title: 'Git Essential Training',
    issuer: 'LinkedIn Learning',
    date: 'Nov 2024',
  },
];

/* ── Component ─────────────────────────────────────────────── */
export default function Certifications() {
  const containerRef = useRef(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const revealEl = containerRef.current?.querySelector('.reveal');
    let titleTrigger;
    if (revealEl) {
      titleTrigger = gsap.fromTo(revealEl,
        { opacity: 0, y: 40 },
        { opacity: 1, y: 0, duration: 0.9, ease: 'power3.out',
          scrollTrigger: { trigger: revealEl, start: 'top 85%', toggleActions: 'play none none none' }
        }
      );
    }

    const gridEl = containerRef.current?.querySelector('.certs-grid');
    let staggerTrigger;
    if (gridEl) {
      const children = gridEl.querySelectorAll('.stagger-child');
      staggerTrigger = gsap.fromTo(children,
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.7, stagger: 0.06, ease: 'power3.out',
          scrollTrigger: { trigger: gridEl, start: 'top 80%', toggleActions: 'play none none none' }
        }
      );
    }

    return () => {
      titleTrigger?.scrollTrigger?.kill(); titleTrigger?.kill();
      staggerTrigger?.scrollTrigger?.kill(); staggerTrigger?.kill();
    };
  }, []);

  return (
    <section id="certs" className="section" ref={containerRef}>
      <div className="site-container">
        <div style={{ marginBottom: '3rem' }} className="reveal">
          <div className="s-label">Credentials</div>
          <h2 className="section-title">30+ Certifications</h2>
          <p className="section-subtitle">
            CompTIA, TryHackMe, Coursera, Udemy, LinkedIn Learning — continuous learning across the stack.
          </p>
        </div>

        <div className="certs-grid">
          {CERTS.map((cert, i) => (
            <div key={i} className="cert-card stagger-child">
              {/* Provider logo */}
              <div
                className="cert-logo-wrap"
                style={{ background: cert.bg, borderColor: cert.border }}
              >
                <cert.Logo />
              </div>

              {/* Text content */}
              <div className="cert-body">
                <div className="cert-title">{cert.title}</div>
                <div className="cert-issuer">{cert.issuer}</div>
                <div className="cert-meta-row">
                  <span className="cert-date">{cert.date}</span>
                  {cert.credId && (
                    <span className="cert-cred-id">{cert.credId}</span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="certs-footer">
          <span className="certs-count">Showing {CERTS.length} of 30+ certifications</span>
          <a
            href="https://www.linkedin.com/in/sksahinurislam/details/certifications/"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-linkedin"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452z"/>
            </svg>
            Verify All on LinkedIn
          </a>
        </div>
      </div>
    </section>
  );
}
