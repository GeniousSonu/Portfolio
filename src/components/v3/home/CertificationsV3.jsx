'use client';

import React, { useEffect, useRef, useState, useCallback } from 'react';
import ChapterHeader from '../ChapterHeader';
import { useChapterReveal, prefersReducedMotion } from '../motion';
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
  const pinWrapperRef = useRef(null);
  const stickyRef = useRef(null);
  const trackRef = useRef(null);
  const rootRef = useRef(null);

  const [isPinActive, setIsPinActive] = useState(false);
  const [progress, setProgress] = useState(0);
  const [counter, setCounter] = useState('01 / 16');

  useChapterReveal(rootRef);

  // Recalculate track geometry and pin wrapper height
  const recalcPin = useCallback(() => {
    if (!pinWrapperRef.current || !trackRef.current) return;

    if (prefersReducedMotion()) {
      setIsPinActive(false);
      pinWrapperRef.current.style.height = 'auto';
      trackRef.current.style.transform = 'none';
      return;
    }

    const trackScrollWidth = trackRef.current.scrollWidth;
    const viewportWidth = window.innerWidth;
    const horizontalDistance = Math.max(0, trackScrollWidth - viewportWidth + 64);

    if (horizontalDistance <= 20) {
      setIsPinActive(false);
      pinWrapperRef.current.style.height = 'auto';
      trackRef.current.style.transform = 'none';
      return;
    }

    setIsPinActive(true);
    // Pin length: proportional to track width, max ~3.5 viewports
    const pinScrollHeight = Math.min(window.innerHeight * 3.5, horizontalDistance);
    pinWrapperRef.current.style.height = `${window.innerHeight + pinScrollHeight}px`;
  }, []);

  // Sync scroll progress and drive translateX right-to-left
  useEffect(() => {
    recalcPin();

    let frame = 0;

    const onScroll = () => {
      if (frame) return;
      frame = window.requestAnimationFrame(() => {
        frame = 0;
        if (!pinWrapperRef.current || !trackRef.current || prefersReducedMotion()) return;

        const rect = pinWrapperRef.current.getBoundingClientRect();
        const scrollableDist = pinWrapperRef.current.offsetHeight - window.innerHeight;
        if (scrollableDist <= 0) return;

        const rawProgress = -rect.top / scrollableDist;
        const p = Math.min(1, Math.max(0, rawProgress));
        setProgress(p);

        const trackScrollWidth = trackRef.current.scrollWidth;
        const viewportWidth = window.innerWidth;
        const maxTranslate = Math.max(0, trackScrollWidth - viewportWidth + 64);
        const x = -p * maxTranslate;

        trackRef.current.style.transform = `translate3d(${x.toFixed(2)}px, 0, 0)`;

        const count = Math.min(
          CERTS.length,
          Math.max(1, Math.round(p * (CERTS.length - 1)) + 1)
        );
        setCounter(`${String(count).padStart(2, '0')} / ${String(CERTS.length).padStart(2, '0')}`);
      });
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', recalcPin, { passive: true });

    // Recalculate after web fonts load to prevent layout shifts
    if (document.fonts?.ready) {
      document.fonts.ready.then(recalcPin).catch(() => {});
    }

    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', recalcPin);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, [recalcPin]);

  // Keyboard navigation focus handler so focus never lands off-screen
  const handleCardFocus = (index) => {
    if (!pinWrapperRef.current || prefersReducedMotion()) return;
    const scrollableDist = pinWrapperRef.current.offsetHeight - window.innerHeight;
    if (scrollableDist <= 0) return;
    const targetProgress = index / (CERTS.length - 1);
    const targetScrollY = pinWrapperRef.current.offsetTop + targetProgress * scrollableDist;
    window.scrollTo({ top: targetScrollY, behavior: 'smooth' });
  };

  return (
    <div
      ref={pinWrapperRef}
      className={`v3-certs-pin-wrapper ${isPinActive ? 'is-pin-active' : 'is-pin-disabled'}`}
    >
      <div id="certifications" aria-hidden="true" className="v3-anchor" />
      <div id="certs" aria-hidden="true" className="v3-anchor" />

      <section
        ref={stickyRef}
        className="v3-chapter v3-certs v3-certs-sticky-container"
        aria-labelledby="certs-title"
      >
        <div className="v3-shell v3-certs-shell" ref={rootRef}>
          <ChapterHeader
            number="06"
            chapter="The Credentials"
            title="30+ Certifications"
            subtitle="CompTIA, TryHackMe, Coursera, Udemy, LinkedIn Learning — continuous learning across the stack."
            emoji="trophy"
            id="certs-title"
            aside={<span className="v3-chapter-count">16 shown · 30+ earned</span>}
          />

          {/* Dynamic Progress Bar & Live Counter */}
          <div className="v3-cert-status-row" aria-label="Certifications scroll progress">
            <div className="v3-cert-progress-track">
              <div
                className="v3-cert-progress-fill"
                style={{ width: `${(progress * 100).toFixed(1)}%` }}
              />
            </div>
            <div className="v3-cert-counter" aria-live="polite">
              <span className="v3-cert-counter-current">{counter}</span>
              <span className="v3-cert-counter-total">VERIFIED</span>
            </div>
          </div>

          <div
            className="v3-cert-rail"
            role="region"
            aria-label="Certifications interactive showcase"
          >
            <div ref={trackRef} className="v3-cert-track">
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
                  onFocus={() => handleCardFocus(index)}
                  tabIndex={0}
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

          <div className="v3-certs-foot" data-reveal>
            <span className="v3-label">Showing {CERTS.length} of 30+ verified credentials</span>
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
    </div>
  );
}
