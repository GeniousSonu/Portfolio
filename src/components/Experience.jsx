"use client";
import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

export default function Experience() {
  const containerRef = useRef(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const revealElements = containerRef.current?.querySelectorAll('.reveal') || [];
    const triggers = [];

    revealElements.forEach(el => {
      const trigger = gsap.fromTo(el, 
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
      );
      triggers.push(trigger);
    });

    return () => {
      triggers.forEach(t => {
        t.scrollTrigger?.kill();
        t.kill();
      });
    };
  }, []);

  return (
    <section id="experience" className="section" ref={containerRef}>
      <div className="site-container">
        <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', alignItems: 'flex-end', marginBottom: '3rem', flexWrap: 'wrap', gap: '1rem' }}>
          <div className="reveal">
            <div className="s-label">Career History</div>
            <h2 className="section-title">Where I've shipped code</h2>
            <p className="section-subtitle">From internships to co-founding a company and leading dev teams — a track record built on real execution.</p>
          </div>
        </div>

        <div className="exp-list">
          {/* ARC */}
          <div className="exp-item reveal">
            <div className="exp-date">
              <div className="current-badge">● CURRENT</div>
              Sep 2025 – Present<br/>10 mos
            </div>
            <div className="exp-body">
              <div className="exp-company">ARC Document Solutions · Internship · On-site</div>
              <div className="exp-role">Quality Assurance Trainee</div>
              <div className="exp-desc">Embedded in production QA workflows for document processing pipelines. Validate output integrity across large-volume scanning operations, flag regression defects in document management software, and contribute to test case documentation.</div>
              <div className="exp-tags">
                <span className="tag">QA Testing</span><span className="tag">Document Management</span><span className="tag">Process Improvement</span><span className="tag">Technical Writing</span>
              </div>
            </div>
          </div>

          {/* Upwork */}
          <div className="exp-item reveal">
            <div className="exp-date">
              <div className="current-badge">● CURRENT</div>
              Apr 2025 – Present<br/>1 yr 3 mos
            </div>
            <div className="exp-body">
              <div className="exp-company">Upwork · Freelance · Remote</div>
              <div className="exp-role">Freelance Full-Stack Developer &amp; Web Solutions Specialist</div>
              <div className="exp-desc">Delivering full-stack engineering to global clients. Stack spans WordPress, Shopify, Wix Studio, MERN, Laravel, and AI/ML integrations. Also handle UI/UX in Figma, branding, SEO, SMO, and performance marketing.</div>
              <div className="exp-tags">
                <span className="tag">React</span><span className="tag">Node.js</span><span className="tag">Laravel</span><span className="tag">WordPress</span><span className="tag">Shopify</span><span className="tag">MongoDB</span><span className="tag">Figma</span><span className="tag">SEO</span>
              </div>
            </div>
          </div>

          {/* WEFIK */}
          <div className="exp-item reveal">
            <div className="exp-date">
              <div className="current-badge">● CURRENT</div>
              Mar 2021 – Present<br/>5 yrs 4 mos
            </div>
            <div className="exp-body">
              <div className="exp-company">WEFIK · Full-time · Remote</div>
              <div className="exp-role">Co-Founder</div>
              <div className="exp-desc">Co-founded a digital solutions company. Responsible for vision, strategic growth, project delivery oversight, and building global client relationships. Led 30+ projects across web, mobile, and digital marketing for clients in 5+ countries.</div>
              <div className="exp-tags">
                <span className="tag">PHP</span><span className="tag">Laravel</span><span className="tag">React</span><span className="tag">Node.js</span><span className="tag">Leadership</span><span className="tag">Business Strategy</span>
              </div>
            </div>
          </div>

          {/* Teenager Esports */}
          <div className="exp-item reveal">
            <div className="exp-date">Sep 2023 – Feb 2024<br/>6 mos</div>
            <div className="exp-body">
              <div className="exp-company">Teenager Esports · Full-time · Remote</div>
              <div className="exp-role">Head of Development</div>
              <div className="exp-desc">Led the development division of a gaming esports organization. Owned the technical roadmap, managed dev teams, built tournament management systems, and integrated streaming infrastructure (OBS, Streamlabs APIs).</div>
              <div className="exp-tags">
                <span className="tag">Dev Leadership</span><span className="tag">CI/CD</span><span className="tag">Web Dev</span><span className="tag">Gaming Infra</span>
              </div>
            </div>
          </div>

          {/* GNIT */}
          <div className="exp-item reveal">
            <div className="exp-date">Jul 2023 – Feb 2024<br/>8 mos</div>
            <div className="exp-body">
              <div className="exp-company">Guru Nanak Institute of Technology · Full-time · On-site</div>
              <div className="exp-role">Web Developer</div>
              <div className="exp-desc">Built and maintained web platforms for the institute. Redesigned institutional website (60% load time improvement), developed student event registration system used by 3,000+ students.</div>
              <div className="exp-tags">
                <span className="tag">PHP</span><span className="tag">MySQL</span><span className="tag">WordPress</span><span className="tag">JavaScript</span>
              </div>
            </div>
          </div>

          {/* CipherSchools */}
          <div className="exp-item reveal">
            <div className="exp-date">Sep 2022 – Nov 2022<br/>3 mos</div>
            <div className="exp-body">
              <div className="exp-company">CipherSchools · Internship · Remote</div>
              <div className="exp-role">Full-Stack Developer</div>
              <div className="exp-desc">Shipped 5 production features for an ed-tech platform. Optimized SQL queries reducing API response time by 40%. First professional experience with a real product codebase.</div>
              <div className="exp-tags">
                <span className="tag">PHP</span><span className="tag">MySQL</span><span className="tag">HTML/CSS</span><span className="tag">JavaScript</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
