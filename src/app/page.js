"use client";
import React, { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

import CustomCursor from '../components/CustomCursor';
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

// GlobeConnect uses WebGL and must be rendered client-side
const GlobeConnect = dynamic(() => import('../components/GlobeConnect'), { ssr: false });

export default function Home() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (loading) return;
    
    gsap.registerPlugin(ScrollTrigger);

    // Animate page-level rack separators
    const separators = gsap.utils.toArray('.rack-sep');
    const sepTriggers = separators.map(sep => 
      gsap.fromTo(sep,
        { opacity: 0, scaleX: 0.8 },
        {
          opacity: 1,
          scaleX: 1,
          duration: 0.6,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: sep,
            start: 'top 90%',
            toggleActions: 'play none none none'
          }
        }
      )
    );

    // Animate global-reach reveal items
    const pageReveals = gsap.utils.toArray('#global-reach .reveal');
    const revealTriggers = pageReveals.map(el =>
      gsap.fromTo(el,
        { opacity: 0, y: 40 },
        {
          opacity: 1,
          y: 0,
          duration: 0.9,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: el,
            start: 'top 85%',
            toggleActions: 'play none none none'
          }
        }
      )
    );

    return () => {
      sepTriggers.forEach(t => {
        t.scrollTrigger?.kill();
        t.kill();
      });
      revealTriggers.forEach(t => {
        t.scrollTrigger?.kill();
        t.kill();
      });
    };
  }, [loading]);

  return (
    <>
      <CustomCursor />
      {loading ? (
        <Loader onComplete={() => setLoading(false)} />
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
              <div className="rack-sep">[ SECTION 07 · CONTACT ]</div>
            </div>
            <Contact />
          </main>
          
          <Footer />
        </>
      )}
    </>
  );
}
