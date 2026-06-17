"use client";
import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

export default function Projects() {
  const containerRef = useRef(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const revealEl = containerRef.current?.querySelector('.reveal');
    let titleTrigger;
    if (revealEl) {
      titleTrigger = gsap.fromTo(revealEl, 
        { opacity: 0, y: 40 },
        {
          opacity: 1,
          y: 0,
          duration: 0.9,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: revealEl,
            start: 'top 85%',
            toggleActions: 'play none none none'
          }
        }
      );
    }

    const gridEl = containerRef.current?.querySelector('.projects-grid');
    let staggerTrigger;
    if (gridEl) {
      const children = gridEl.querySelectorAll('.stagger-child');
      staggerTrigger = gsap.fromTo(children,
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 0.7,
          stagger: 0.1,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: gridEl,
            start: 'top 80%',
            toggleActions: 'play none none none'
          }
        }
      );
    }

    return () => {
      titleTrigger?.scrollTrigger?.kill();
      titleTrigger?.kill();
      staggerTrigger?.scrollTrigger?.kill();
      staggerTrigger?.kill();
    };
  }, []);

  return (
    <section id="projects" className="section" ref={containerRef}>
      <div className="site-container">
        <div style={{ marginBottom: '3rem' }} className="reveal">
          <div className="s-label">Selected Work</div>
          <h2 className="section-title">Things I've built</h2>
          <p className="section-subtitle">From AI tutoring systems to patented IoT hardware — projects where the code actually runs somewhere.</p>
        </div>
        <div className="projects-grid">
          {/* LearnAI */}
          <div className="project-card stagger-child">
            <div className="project-header">
              <div>
                <div className="project-year mono muted" style={{ fontSize: '0.62rem', letterSpacing: '0.1em' }}>2024 · AI/ML</div>
                <div className="project-cat-dot" style={{ background: '#A78BFA', display: 'inline-block', marginTop: '0.4rem' }}></div>
              </div>
              <div className="project-links">
                <a href="https://github.com/GeniousSonu/LearnAI" target="_blank" rel="noopener noreferrer" className="project-link" data-tip="GitHub" aria-label="View on GitHub">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/></svg>
                </a>
              </div>
            </div>
            <div className="project-title">LearnAI — Adaptive Intelligent Tutoring</div>
            <div className="project-desc">AI-powered tutoring platform that profiles users, adapts content difficulty in real-time, and uses NLP for contextual feedback. Built on MERN + Python ML microservices.</div>
            <div className="project-stack">
              <span className="stack-chip">React</span><span className="stack-chip">Node.js</span><span className="stack-chip">MongoDB</span><span className="stack-chip">Python</span><span className="stack-chip">scikit-learn</span><span className="stack-chip">OpenAI API</span><span className="stack-chip">FastAPI</span>
            </div>
            <div className="project-metrics">
              <div className="metric"><div className="metric-val">87%</div><div className="metric-label">Accuracy</div></div>
              <div className="metric"><div className="metric-val">3.2×</div><div className="metric-label">Engagement↑</div></div>
              <div className="metric"><div className="metric-val">200+</div><div className="metric-label">Modules</div></div>
            </div>
          </div>

          {/* Vaccine IoT */}
          <div className="project-card stagger-child">
            <div className="project-header">
              <div>
                <div className="project-year mono muted" style={{ fontSize: '0.62rem', letterSpacing: '0.1em' }}>2025 · IoT · Hardware</div>
                <div className="project-cat-dot" style={{ background: '#4ADE80', display: 'inline-block', marginTop: '0.4rem' }}></div>
              </div>
              <div className="project-links">
                <a href="https://drive.google.com/drive/folders/1SXCzHl1WOz646EWjiQHYuhG6BGNPTMfJ?usp=sharing" target="_blank" rel="noopener noreferrer" className="project-link" data-tip="Patent Doc" aria-label="View patent">↗</a>
              </div>
            </div>
            <div className="patent-badge">⊕ Patent #202531060002 A · Granted Jul 2025</div>
            <div className="project-title">Solar IoT Vaccine Preservation System</div>
            <div className="project-desc">Patented solar-powered IoT cold chain system replacing expensive RFID stickers. NodeMCU + ESP8266, MQTT telemetry, DS18B20 sensors, zone-wise Peltier cooling for off-grid healthcare.</div>
            <div className="project-stack">
              <span className="stack-chip">ESP8266</span><span className="stack-chip">NodeMCU</span><span className="stack-chip">MQTT</span><span className="stack-chip">C++</span><span className="stack-chip">Solar PV</span><span className="stack-chip">Python</span>
            </div>
            <div className="project-metrics">
              <div className="metric"><div className="metric-val">40%</div><div className="metric-label">Power Save</div></div>
              <div className="metric"><div className="metric-val">99.7%</div><div className="metric-label">Uptime</div></div>
              <div className="metric"><div className="metric-val">PATENTED</div><div className="metric-label">2025</div></div>
            </div>
          </div>

          {/* Portfolio v4 */}
          <div className="project-card stagger-child">
            <div className="project-header">
              <div>
                <div className="project-year mono muted" style={{ fontSize: '0.62rem', letterSpacing: '0.1em' }}>2024 · Web</div>
                <div className="project-cat-dot" style={{ background: '#059669', display: 'inline-block', marginTop: '0.4rem' }}></div>
              </div>
              <div className="project-links">
                <a href="https://github.com/GeniousSonu/v4" target="_blank" rel="noopener noreferrer" className="project-link" data-tip="GitHub" aria-label="View on GitHub">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/></svg>
                </a>
              </div>
            </div>
            <div className="project-title">Personal Website v4 — Gatsby Edition</div>
            <div className="project-desc">Fourth complete rewrite of my personal site. Gatsby + GraphQL + MDX, Lighthouse 100 across all metrics, GSAP scroll animations, terminal-inspired dark theme.</div>
            <div className="project-stack">
              <span className="stack-chip">Gatsby</span><span className="stack-chip">React</span><span className="stack-chip">GraphQL</span><span className="stack-chip">GSAP</span><span className="stack-chip">MDX</span><span className="stack-chip">Netlify</span>
            </div>
            <div className="project-metrics">
              <div className="metric"><div className="metric-val">100</div><div className="metric-label">Lighthouse</div></div>
              <div className="metric"><div className="metric-val">v4</div><div className="metric-label">Iteration</div></div>
            </div>
          </div>

          {/* WEFIK Platform */}
          <div className="project-card stagger-child">
            <div className="project-header">
              <div>
                <div className="project-year mono muted" style={{ fontSize: '0.62rem', letterSpacing: '0.1em' }}>2021 · Web · SaaS</div>
                <div className="project-cat-dot" style={{ background: '#60A5FA', display: 'inline-block', marginTop: '0.4rem' }}></div>
              </div>
            </div>
            <div className="project-title">WEFIK Digital Agency Platform</div>
            <div className="project-desc">Internal business platform for WEFIK — client portal, real-time project tracking, invoice generation, team management. MERN stack with WebSocket notifications and RBAC.</div>
            <div className="project-stack">
              <span className="stack-chip">React</span><span className="stack-chip">Node.js</span><span className="stack-chip">MongoDB</span><span className="stack-chip">Socket.io</span><span className="stack-chip">Redis</span><span className="stack-chip">AWS S3</span>
            </div>
            <div className="project-metrics">
              <div className="metric"><div className="metric-val">5+</div><div className="metric-label">Countries</div></div>
              <div className="metric"><div className="metric-val">30+</div><div className="metric-label">Projects Run</div></div>
            </div>
          </div>

          {/* STAY Hotel Booking */}
          <div className="project-card stagger-child">
            <div className="project-header">
              <div>
                <div className="project-year mono muted" style={{ fontSize: '0.62rem', letterSpacing: '0.1em' }}>2024 · Full Stack · Web</div>
                <div className="project-cat-dot" style={{ background: '#e34c26', display: 'inline-block', marginTop: '0.4rem' }}></div>
              </div>
              <div className="project-links">
                <a href="https://github.com/GeniousSonu/stay" target="_blank" rel="noopener noreferrer" className="project-link" data-tip="GitHub" aria-label="View on GitHub">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/></svg>
                </a>
              </div>
            </div>
            <div className="project-title">STAY — Full Stack Hotel Booking Web App</div>
            <div className="project-desc">A hotel booking web application built with HTML, CSS, JavaScript, Node.js, Express.js, MongoDB, and Bootstrap, offering a seamless user experience and secure payment integration.</div>
            <div className="project-stack">
              <span className="stack-chip">Node.js</span><span className="stack-chip">Express.js</span><span className="stack-chip">MongoDB</span><span className="stack-chip">JavaScript</span><span className="stack-chip">Bootstrap</span><span className="stack-chip">HTML/CSS</span>
            </div>
            <div className="project-metrics">
              <div className="metric"><div className="metric-val">99.9%</div><div className="metric-label">Uptime</div></div>
              <div className="metric"><div className="metric-val">150+</div><div className="metric-label">Bookings/mo</div></div>
              <div className="metric"><div className="metric-val">2.1s</div><div className="metric-label">Load Time</div></div>
            </div>
          </div>

          {/* JobHunt Platform */}
          <div className="project-card stagger-child">
            <div className="project-header">
              <div>
                <div className="project-year mono muted" style={{ fontSize: '0.62rem', letterSpacing: '0.1em' }}>2024 · Web · Portal</div>
                <div className="project-cat-dot" style={{ background: '#f1e05a', display: 'inline-block', marginTop: '0.4rem' }}></div>
              </div>
              <div className="project-links">
                <a href="https://github.com/GeniousSonu/JobHunt" target="_blank" rel="noopener noreferrer" className="project-link" data-tip="GitHub" aria-label="View on GitHub">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/></svg>
                </a>
              </div>
            </div>
            <div className="project-title">JobHunt — Job Application Tracker Portal</div>
            <div className="project-desc">A job search and recruitment management portal featuring job postings, user profiles, applicant tracking, and recruiter dashboards built with MERN stack.</div>
            <div className="project-stack">
              <span className="stack-chip">React</span><span className="stack-chip">Node.js</span><span className="stack-chip">MongoDB</span><span className="stack-chip">Express.js</span><span className="stack-chip">Tailwind CSS</span>
            </div>
            <div className="project-metrics">
              <div className="metric"><div className="metric-val">500+</div><div className="metric-label">Active Users</div></div>
              <div className="metric"><div className="metric-val">98%</div><div className="metric-label">Match Rate</div></div>
              <div className="metric"><div className="metric-val">1.2s</div><div className="metric-label">Response Time</div></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
