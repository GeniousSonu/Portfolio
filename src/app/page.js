"use client";
import React, { useState, useEffect, useCallback } from 'react';
import dynamic from 'next/dynamic';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

import Loader from '../components/Loader';
import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import About from '../components/About';
import Experience from '../components/Experience';
import Projects from '../components/Projects';
import Skills from '../components/Skills';
import Certifications from '../components/Certifications';
import Contact from '../components/Contact';
import Footer from '../components/Footer';

// Dynamic imports for heavy below-the-fold components to accelerate initial paint and TTI
const GlobeConnect = dynamic(() => import('../components/GlobeConnect'), { ssr: false });
const HomeBlogSection = dynamic(() => import('../components/HomeBlogSection'), { ssr: false });

export default function Home() {
  const [loading, setLoading] = useState(true);
  const handleLoaderComplete = useCallback(() => setLoading(false), []);

  useEffect(() => {
    if (loading) return;
    
    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      // Batch animate page-level rack separators (consolidates 7 separate triggers into 1)
      ScrollTrigger.batch('.rack-sep', {
        start: 'top 90%',
        once: true,
        onEnter: (batch) =>
          gsap.fromTo(
            batch,
            { opacity: 0, scaleX: 0.8 },
            {
              opacity: 1,
              scaleX: 1,
              duration: 0.6,
              stagger: 0.1,
              ease: 'power2.out',
              overwrite: 'auto',
            }
          ),
      });

      // Batch animate global-reach reveal items
      ScrollTrigger.batch('#global-reach .reveal', {
        start: 'top 85%',
        once: true,
        onEnter: (batch) =>
          gsap.fromTo(
            batch,
            { opacity: 0, y: 35 },
            {
              opacity: 1,
              y: 0,
              duration: 0.8,
              stagger: 0.1,
              ease: 'power3.out',
              overwrite: 'auto',
            }
          ),
      });
    });

    // Check if an anchor target was requested (e.g. navigated from /blog or /store to #certs)
    const targetHash = window.location.hash || (typeof sessionStorage !== 'undefined' ? sessionStorage.getItem('portfolio_scroll_target') : null);
    let scrollTimer;
    if (targetHash) {
      if (typeof sessionStorage !== 'undefined') {
        sessionStorage.removeItem('portfolio_scroll_target');
      }
      scrollTimer = setTimeout(() => {
        const el = document.querySelector(targetHash);
        if (el) {
          const navHeight = 75;
          const top = el.getBoundingClientRect().top + window.scrollY - navHeight;
          window.scrollTo({ top, behavior: 'smooth' });
        }
      }, 300);
    }

    return () => {
      if (scrollTimer) clearTimeout(scrollTimer);
      ctx.revert();
    };
  }, [loading]);

  return (
    <>
      {loading ? (
        <Loader onComplete={handleLoaderComplete} />
      ) : (
        <>
          <div id="grid-overlay" aria-hidden="true"></div>
          <div id="scan-line" aria-hidden="true"></div>
          
          <Navbar />
          
          <main>
            <Hero />
            
            <div className="site-container" style={{ position: 'relative', zIndex: 10 }}>
              <div className="rack-sep">[ SECTION 01 · ABOUT ]</div>
            </div>
            <About />

            <div className="site-container" style={{ position: 'relative', zIndex: 10 }}>
              <div className="rack-sep">[ SECTION 02 · EXPERIENCE ]</div>
            </div>
            <Experience />

            <div className="site-container" style={{ position: 'relative', zIndex: 10 }}>
              <div className="rack-sep">[ SECTION 03 · PROJECTS ]</div>
            </div>
            <Projects />

            <div className="site-container" style={{ position: 'relative', zIndex: 10 }}>
              <div className="rack-sep">[ SECTION 04 · SKILLS ]</div>
            </div>
            <Skills />

            <div className="site-container" style={{ position: 'relative', zIndex: 10 }}>
              <div className="rack-sep">[ SECTION 05 · CERTIFICATIONS ]</div>
            </div>
            <Certifications />

            <div className="site-container" style={{ position: 'relative', zIndex: 10 }}>
              <div className="rack-sep">[ SECTION 06 · GLOBAL CONNECT ]</div>
            </div>
            <section id="global-reach" className="section" style={{ paddingBottom: 0 }}>
              <div className="site-container">
                <div style={{ textAlign: 'center', marginBottom: '3rem' }} className="reveal">
                  <div className="s-label" style={{ justifyContent: 'center' }}>Global network</div>
                  <h2 className="section-title">Open for Opportunities Worldwide</h2>
                  <p className="section-subtitle" style={{ margin: '0 auto' }}>Based in Kolkata, India — working with teams, agencies, and clients globally.</p>
                </div>
                <div id="globe-parent" className="reveal">
                  <GlobeConnect />
                  <div className="globe-overlay-grad"></div>
                </div>
              </div>
            </section>

            <div className="site-container" style={{ position: 'relative', zIndex: 10 }}>
              <div className="rack-sep">[ SECTION 07 · LATEST ARTICLES & BLOG ]</div>
            </div>
            <HomeBlogSection />

            <div className="site-container" style={{ position: 'relative', zIndex: 10 }}>
              <div className="rack-sep">[ SECTION 08 · CONTACT ]</div>
            </div>
            <Contact />
          </main>
          
          <Footer />
        </>
      )}
    </>
  );
}
