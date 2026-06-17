"use client";
import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

export default function About() {
  const leftRef = useRef(null);
  const rightRef = useRef(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const leftTrigger = gsap.fromTo(leftRef.current, 
      { opacity: 0, x: -40 },
      {
        opacity: 1,
        x: 0,
        duration: 0.9,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: leftRef.current,
          start: 'top 85%',
          toggleActions: 'play none none none'
        }
      }
    );

    const rightTrigger = gsap.fromTo(rightRef.current, 
      { opacity: 0, x: 40 },
      {
        opacity: 1,
        x: 0,
        duration: 0.9,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: rightRef.current,
          start: 'top 85%',
          toggleActions: 'play none none none'
        }
      }
    );

    return () => {
      leftTrigger.scrollTrigger?.kill();
      leftTrigger.kill();
      rightTrigger.scrollTrigger?.kill();
      rightTrigger.kill();
    };
  }, []);

  return (
    <section id="about" className="section">
      <div className="site-container">
        <div className="about-grid">
          <div className="about-text reveal-left" ref={leftRef}>
            <div className="s-label">About Me</div>
            <h2>Building at the edge of <em>code</em> and <em>infrastructure</em></h2>
            <p>
              I'm an IT Engineer and Full Stack Developer from Kolkata, India with a B.Tech in Information Technology from Guru Nanak Institute of Technology (CGPA: 8.17). I've been writing code professionally since 2021 — from PHP internships to co-founding a digital agency, leading dev teams in esports, and now freelancing globally on Upwork.
            </p>
            <p>
              My work spans the full stack: React/Next.js frontends, Node.js/Laravel APIs, MongoDB and MySQL databases, Linux server administration, and increasingly — AI integrations and IoT systems. I hold 30+ certifications across CompTIA, TryHackMe, Coursera, and Udemy.
            </p>
            <p>
              In 2025, I was granted a patent for an IoT-based solar-powered vaccine preservation system — built with NodeMCU, MQTT, and Peltier cooling for off-grid healthcare supply chains.
            </p>
            <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem', flexWrap: 'wrap' }}>
              <a href="https://www.linkedin.com/in/sksahinurislam/" target="_blank" rel="noopener noreferrer" className="btn btn-ghost" style={{ fontSize: '0.8rem', padding: '0.55rem 1.1rem' }}>LinkedIn ↗</a>
              <a href="https://www.upwork.com/freelancers/~0104912246c7c7bdbf" target="_blank" rel="noopener noreferrer" className="btn btn-ghost" style={{ fontSize: '0.8rem', padding: '0.55rem 1.1rem' }}>Upwork ↗</a>
              <a href="https://github.com/GeniousSonu" target="_blank" rel="noopener noreferrer" className="btn btn-ghost" style={{ fontSize: '0.8rem', padding: '0.55rem 1.1rem' }}>GitHub ↗</a>
            </div>
          </div>
          <div className="reveal-right" ref={rightRef}>
            <div className="sysinfo">
              <div className="sysinfo-header">
                <div className="dot-r"></div><div className="dot-y"></div><div className="dot-g"></div>
                <span style={{ marginLeft: '0.5rem' }}>system-profile.sh</span>
              </div>
              <div className="sysinfo-body">
                <div className="sysinfo-row"><span className="sysinfo-key">hostname</span><span className="sysinfo-val">sahinur-dev.local</span></div>
                <div className="sysinfo-row"><span className="sysinfo-key">location</span><span className="sysinfo-val">Kolkata, WB · India</span></div>
                <div className="sysinfo-row"><span className="sysinfo-key">timezone</span><span className="sysinfo-val">Asia/Kolkata (UTC+5:30)</span></div>
                <div className="sysinfo-row"><span className="sysinfo-key">education</span><span className="sysinfo-val">B.Tech IT · GNIT · 2025</span></div>
                <div className="sysinfo-row"><span className="sysinfo-key">languages</span><span className="sysinfo-val">Bengali · English · Hindi</span></div>
                <div className="sysinfo-row"><span className="sysinfo-key">availability</span><span className="sysinfo-val" style={{ color: 'var(--green)' }}>● Open to Work</span></div>
                <div className="sysinfo-row"><span className="sysinfo-key">work-type</span><span className="sysinfo-val">Remote · Hybrid · On-site</span></div>
                <div className="sysinfo-row"><span className="sysinfo-key">email</span><span className="sysinfo-val">sahinurislamm2002@gmail.com</span></div>
              </div>
            </div>

            <div className="patent-card" style={{ marginTop: '1.2rem' }}>
              <div className="patent-label">⊕ Patent Granted — 2025</div>
              <div className="patent-title">Solar Powered IoT Vaccine Preservation System with MQTT Telemetry &amp; Zone-wise Peltier Cooling</div>
              <div className="patent-meta">Patent No. 202531060002 A · Filed &amp; Granted Jul 4, 2025</div>
              <a href="https://drive.google.com/drive/folders/1SXCzHl1WOz646EWjiQHYuhG6BGNPTMfJ?usp=sharing"
                 target="_blank" rel="noopener noreferrer"
                 style={{ display: 'inline-block', marginTop: '0.75rem', fontFamily: 'var(--font-mono)', fontSize: '0.65rem', color: 'var(--gold)', textDecoration: 'none' }}>
                View Patent Document →
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
