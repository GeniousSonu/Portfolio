"use client";
import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

/* ── Provider Logo Components ─────────────────────────────── */

/* LinkedIn Learning — inline SVG (no logo file provided) */
const LogoLinkedIn = () => (
  <svg viewBox="0 0 72 72" width="28" height="28" aria-label="LinkedIn" role="img">
    <rect width="72" height="72" rx="8" fill="#0A66C2"/>
    <path fill="#fff" d="M13.4 27.5h9.4v30.6h-9.4zM18.1 23.5a5.4 5.4 0 1 1 0-10.9 5.4 5.4 0 0 1 0 10.9zM58.7 58.1H49.3V43c0-3.6-.1-8.2-5-8.2-5 0-5.7 3.9-5.7 7.9v15.4H29.2V27.5h9v4.2h.1c1.2-2.4 4.3-4.9 8.8-4.9 9.4 0 11.1 6.2 11.1 14.2v17.1z"/>
  </svg>
);

/* Image-based logos using /logo/ assets */
const LogoTryHackMe = () => (
  <img src="/logo/tryhackme.png" alt="TryHackMe" width="28" height="28" style={{ objectFit: 'contain', borderRadius: '4px' }} />
);

const LogoCoursera = () => (
  <img src="/logo/coursera.png" alt="Coursera" width="28" height="28" style={{ objectFit: 'contain', borderRadius: '4px' }} />
);

const LogoUdemy = () => (
  <img src="/logo/udemy.png" alt="Udemy" width="28" height="28" style={{ objectFit: 'contain', borderRadius: '4px' }} />
);

const LogoAon = () => (
  <img src="/logo/Aon.png" alt="Aon" width="28" height="28" style={{ objectFit: 'contain', borderRadius: '4px' }} />
);

const LogoArdent = () => (
  <img src="/logo/ardent.png" alt="Ardent Computech" width="28" height="28" style={{ objectFit: 'contain', borderRadius: '4px' }} />
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
    bg: 'rgba(230,30,30,0.08)',
    border: 'rgba(230,30,30,0.2)',
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
