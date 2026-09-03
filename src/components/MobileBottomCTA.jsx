"use client";
import React, { useState, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollToPlugin } from 'gsap/ScrollToPlugin';

export default function MobileBottomCTA() {
  const [visible, setVisible] = useState(false);
  const [inContact, setInContact] = useState(false);

  useEffect(() => {
    gsap.registerPlugin(ScrollToPlugin);

    let observer = null;

    const checkContact = () => {
      const contactEl = document.getElementById('contact');
      if (contactEl) {
        const rect = contactEl.getBoundingClientRect();
        const isInView = rect.top <= window.innerHeight * 0.85 && rect.bottom >= 0;
        setInContact(isInView);

        // Attach observer once contact element is in the DOM
        if (!observer && typeof IntersectionObserver !== 'undefined') {
          observer = new IntersectionObserver(
            (entries) => {
              entries.forEach((entry) => {
                setInContact(entry.isIntersecting);
              });
            },
            { threshold: 0.05 }
          );
          observer.observe(contactEl);
        }
      }
    };

    const handleScroll = () => {
      setVisible(window.scrollY > 280);
      checkContact();
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleScroll, { passive: true });
    
    // Check periodically in case page mounts after loader
    const pollTimer = setInterval(checkContact, 500);

    return () => {
      clearInterval(pollTimer);
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
      if (observer) observer.disconnect();
    };
  }, []);

  const handleContactClick = (e) => {
    e.preventDefault();
    const target = document.getElementById('contact');
    if (target) {
      gsap.to(window, {
        scrollTo: { y: target, offsetY: 40 },
        duration: 0.9,
        ease: 'power3.inOut'
      });
    }
  };

  const isHidden = !visible || inContact;

  return (
    <aside
      className={`mobile-bottom-cta ${isHidden ? 'cta-hidden' : ''}`}
      aria-label="Mobile quick actions"
      aria-hidden={isHidden}
    >
      <a
        href="#contact"
        onClick={handleContactClick}
        className="mobile-cta-btn mobile-cta-primary"
        aria-label="Get in Touch"
      >
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <rect x="2" y="4" width="20" height="16" rx="2"/>
          <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>
        </svg>
        <span>Get in Touch</span>
      </a>

      <a
        href="https://www.linkedin.com/in/sksahinurislam/"
        target="_blank"
        rel="noopener noreferrer"
        className="mobile-cta-btn mobile-cta-secondary"
        aria-label="View LinkedIn profile"
      >
        <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
          <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
        </svg>
        <span>LinkedIn</span>
      </a>
    </aside>
  );
}
