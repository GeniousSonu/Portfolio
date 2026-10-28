'use client';

import React, { useRef } from 'react';
import ChapterHeader from '../ChapterHeader';
import { useChapterReveal } from '../motion';
import { CERTS } from '@/components/Certifications';

function VerifyMark() {
  return (
    <svg
      viewBox="0 0 24 24"
      width="13"
      height="13"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="m5 12.5 4.4 4.4L19 7.5" />
    </svg>
  );
}

export default function CertificationsV3() {
  const rootRef = useRef(null);
  useChapterReveal(rootRef);

  return (
    <section
      id="certifications"
      className="v3-chapter v3-certs"
      ref={rootRef}
      aria-labelledby="certs-title"
    >
      <div id="certs" aria-hidden="true" className="v3-anchor" />
      <div className="v3-shell">
        <ChapterHeader
          number="06"
          chapter="The Credentials"
          title="30+ Certifications"
          subtitle="CompTIA, TryHackMe, Coursera, Udemy, LinkedIn Learning — continuous learning across the stack."
          emoji="trophy"
          id="certs-title"
          aside={<span className="v3-chapter-count">16 shown · 30+ earned</span>}
        />

        <div
          className="v3-cert-rail"
          role="region"
          aria-label="Certifications carousel"
        >
          <div className="v3-cert-track">
            {CERTS.map((cert, index) => (
              <a
                href={
                  cert.credId && cert.credId.startsWith('THM')
                    ? 'https://tryhackme.com/p/GeniousSonu'
                    : 'https://www.linkedin.com/in/sksahinurislam/details/certifications/'
                }
                target="_blank"
                rel="noopener noreferrer"
                className="v3-cert-ticket"
                key={`${cert.title}-${cert.date}`}
                data-reveal
              >
                <div className="v3-cert-top">
                  <span
                    className="v3-cert-logo"
                    style={{ background: cert.bg, borderColor: cert.border }}
                  >
                    <cert.Logo />
                  </span>
                  <span className="v3-cert-serial">No. {String(index + 1).padStart(2, '0')}</span>
                </div>

                <h3 className="v3-cert-title">{cert.title}</h3>
                <p className="v3-cert-issuer">{cert.issuer}</p>

                <div className="v3-cert-foot">
                  <span className="v3-cert-date">{cert.date}</span>
                  {cert.credId ? (
                    <span className="v3-cert-cred">
                      <VerifyMark />
                      {cert.credId}
                    </span>
                  ) : (
                    <span className="v3-cert-verified">
                      <VerifyMark />
                      Verified
                    </span>
                  )}
                </div>
              </a>
            ))}
          </div>
        </div>

        <p className="v3-swipe-hint" aria-hidden="true">
          ← Swipe to explore certifications →
        </p>

        <div className="v3-certs-foot" data-reveal>
          <span className="v3-label">Showing {CERTS.length} of 30+ certifications</span>
          <span className="v3-shelf-rule" aria-hidden="true" />
          <a
            href="https://www.linkedin.com/in/sksahinurislam/details/certifications/"
            target="_blank"
            rel="noopener noreferrer"
            className="v3-btn v3-btn--linkedin"
            data-v3-sound="confirm"
          >
            <svg
              viewBox="0 0 24 24"
              width="16"
              height="16"
              fill="currentColor"
              aria-hidden="true"
            >
              <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 10.9h2.8v8.37h-2.8v-8.37M7.86 6.54a1.62 1.62 0 0 0-1.62 1.62c0 .9.72 1.62 1.62 1.62a1.62 1.62 0 0 0 1.62-1.62 1.62 1.62 0 0 0-1.62-1.62" />
            </svg>
            Verify All on LinkedIn <span aria-hidden="true">↗</span>
          </a>
        </div>
      </div>
    </section>
  );
}
