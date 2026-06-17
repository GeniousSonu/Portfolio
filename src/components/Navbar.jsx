"use client";
import React, { useState, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollToPlugin } from 'gsap/ScrollToPlugin';

/* ── Brand SVG Icons ── */
const IconGitHub = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20" aria-hidden="true">
    <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z"/>
  </svg>
);

const IconLinkedIn = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20" aria-hidden="true">
    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
  </svg>
);

const IconUpwork = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20" aria-hidden="true">
    <path d="M18.561 13.158c-1.102 0-2.135-.467-3.074-1.227l.228-1.076.008-.042c.207-1.143.849-3.06 2.839-3.06a2.705 2.705 0 0 1 2.703 2.703 2.707 2.707 0 0 1-2.704 2.702zm0-8.14c-2.539 0-4.51 1.649-5.31 4.366-1.22-1.834-2.148-4.036-2.687-5.892H7.828v7.112a2.551 2.551 0 0 1-2.547 2.548 2.55 2.55 0 0 1-2.545-2.548V3.492H0v7.112c0 2.914 2.37 5.303 5.281 5.303 2.913 0 5.283-2.389 5.283-5.303v-1.19c.529 1.107 1.182 2.229 1.974 3.221l-1.673 7.873h2.797l1.213-5.71c1.063.679 2.285 1.109 3.686 1.109 3 0 5.439-2.452 5.439-5.45 0-3-2.439-5.439-5.439-5.439z"/>
  </svg>
);

const IconLinktree = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20" aria-hidden="true">
    <path d="M7.953 15.066c-.08.163-.08.324-.08.486.08.517.598.84 1.123.84.517 0 1.04-.323 1.12-.84.08-.323.08-.647-.08-.97L7.953 15.066zm4.054-4.61h1.688L16.037 7.3c.488-.534.325-1.46-.245-1.785a1.07 1.07 0 0 0-1.39.374l-2.395 4.567zm-7.627 0h1.688l-2.07-3.944a1.07 1.07 0 0 0-1.39-.374c-.57.325-.733 1.251-.245 1.785l2.017 2.533zm11.52 4.61c.325-.324.325-.647.163-.97-.162-.324-.48-.486-.81-.486-.325 0-.648.162-.81.486l-2.072 3.944c-.162.324-.162.647.08.97.163.324.48.486.81.486.163 0 .325-.08.488-.162l2.15-4.268zM12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.84 10.458l-5.84 8.786-5.84-8.786h2.153l3.687-6.913 3.687 6.913H17.84z"/>
  </svg>
);

const IconWhatsApp = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20" aria-hidden="true">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z"/>
  </svg>
);

const IconYouTube = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20" aria-hidden="true">
    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
  </svg>
);

const IconInstagram = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20" aria-hidden="true">
    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z"/>
  </svg>
);

const IconFacebook = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20" aria-hidden="true">
    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
  </svg>
);

const IconEmail = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" width="20" height="20" aria-hidden="true">
    <rect x="2" y="4" width="20" height="16" rx="2"/>
    <polyline points="2,4 12,13 22,4"/>
  </svg>
);

/* ── Social nav links shown at bottom of mobile menu ── */
const MOBILE_SOCIALS = [
  { href: 'https://github.com/GeniousSonu',  Icon: IconGitHub,   label: 'GitHub',   color: '#e6edf3' },
  { href: 'https://www.linkedin.com/in/sksahinurislam/', Icon: IconLinkedIn, label: 'LinkedIn', color: '#0A66C2' },
  { href: 'https://www.upwork.com/freelancers/~0104912246c7c7bdbf', Icon: IconUpwork, label: 'Upwork', color: '#14A800' },
  { href: 'https://linktr.ee/sksahinurislam', Icon: IconLinktree, label: 'Linktree', color: '#39E09B' },
  { href: 'https://api.whatsapp.com/send?phone=8159871669', Icon: IconWhatsApp, label: 'WhatsApp', color: '#25D366' },
  { href: 'https://www.youtube.com/@GeniousSonu', Icon: IconYouTube, label: 'YouTube', color: '#FF0000' },
];

const NAV_ITEMS = [
  { id: '#about',      label: 'About' },
  { id: '#experience', label: 'Experience' },
  { id: '#projects',   label: 'Projects' },
  { id: '#skills',     label: 'Skills' },
  { id: '#certs',      label: 'Certs' },
  { id: '#contact',    label: 'Contact' },
];

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    gsap.registerPlugin(ScrollToPlugin);

    const handleScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener('scroll', handleScroll, { passive: true });

    // Close mobile nav on scroll
    const closeOnScroll = () => { if (mobileOpen) setMobileOpen(false); };
    window.addEventListener('scroll', closeOnScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('scroll', closeOnScroll);
    };
  }, [mobileOpen]);

  // Lock body scroll when mobile nav is open
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [mobileOpen]);

  const handleLinkClick = (e, targetId) => {
    e.preventDefault();
    setMobileOpen(false);
    if (targetId === '#') {
      gsap.to(window, { scrollTo: { y: 0 }, duration: 1, ease: 'power3.inOut' });
      return;
    }
    const target = document.querySelector(targetId);
    if (target) {
      gsap.to(window, { scrollTo: { y: target, offsetY: 80 }, duration: 1, ease: 'power3.inOut' });
    }
  };

  return (
    <>
      <nav id="nav" className={scrolled ? 'scrolled' : ''} role="navigation" aria-label="Main navigation">
        <div className="nav-inner">
          {/* Logo */}
          <a href="#" onClick={(e) => handleLinkClick(e, '#')} className="nav-logo" aria-label="SK Sahinur Islam — Home">
            <img src="/logo.svg" alt="SONU" className="nav-logo-img" />
          </a>

          {/* Desktop links */}
          <ul className="nav-links" role="list">
            {NAV_ITEMS.map(({ id, label }) => (
              <li key={id}>
                <a href={id} onClick={(e) => handleLinkClick(e, id)}
                   className={id === '#contact' ? 'nav-cta' : ''}>
                  {label}{id === '#contact' ? ' →' : ''}
                </a>
              </li>
            ))}
          </ul>

          {/* Hamburger — animated 3-bar → X */}
          <button
            className={`nav-hamburger${mobileOpen ? ' is-open' : ''}`}
            id="hamburger-btn"
            aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={mobileOpen}
            aria-controls="mobile-nav"
            onClick={() => setMobileOpen(v => !v)}
          >
            <span className="ham-bar ham-bar--top" />
            <span className="ham-bar ham-bar--mid" />
            <span className="ham-bar ham-bar--bot" />
          </button>
        </div>
      </nav>

      {/* ── Full-Screen Mobile Nav ── */}
      <div
        id="mobile-nav"
        className={mobileOpen ? 'open' : ''}
        role="dialog"
        aria-modal="true"
        aria-label="Site navigation"
        aria-hidden={!mobileOpen}
      >
        {/* Background radial glow */}
        <div className="mnav-glow" aria-hidden="true" />

        {/* Close button */}
        <button
          id="mobile-nav-close"
          aria-label="Close menu"
          onClick={() => setMobileOpen(false)}
        >
          <span className="ham-bar ham-bar--top" />
          <span className="ham-bar ham-bar--bot" />
        </button>

        {/* Main link list */}
        <nav className="mnav-links" aria-label="Mobile navigation">
          {NAV_ITEMS.map(({ id, label }, i) => (
            <a
              key={id}
              href={id}
              className="mnav-link"
              style={{ '--delay': `${0.05 + i * 0.06}s` }}
              onClick={(e) => handleLinkClick(e, id)}
              tabIndex={mobileOpen ? 0 : -1}
            >
              <span className="mnav-link-num">0{i + 1}</span>
              <span className="mnav-link-text">{label}</span>
              <span className="mnav-link-arrow">→</span>
            </a>
          ))}
        </nav>

        {/* Social icons row */}
        <div className="mnav-socials">
          {MOBILE_SOCIALS.map(({ href, Icon, label, color }) => (
            <a
              key={label}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className="mnav-social-btn"
              aria-label={label}
              style={{ '--icon-color': color }}
              tabIndex={mobileOpen ? 0 : -1}
            >
              <Icon />
            </a>
          ))}
        </div>

        {/* Bottom tag */}
        <div className="mnav-tag">
          <span style={{ color: 'var(--red)', fontFamily: 'var(--font-mono)' }}>sahinur</span>
          <span style={{ color: 'var(--gold)', fontFamily: 'var(--font-mono)' }}>@dev</span>
          <span style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>:~$</span>
        </div>
      </div>

      {/* Backdrop */}
      {mobileOpen && (
        <div
          className="mnav-backdrop"
          aria-hidden="true"
          onClick={() => setMobileOpen(false)}
        />
      )}
    </>
  );
}
