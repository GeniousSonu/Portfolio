"use client";
import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

export default function Skills() {
  const containerRef = useRef(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const revealElements = containerRef.current?.querySelectorAll('.reveal') || [];
    const triggers = [];

    revealElements.forEach(el => {
      const t = gsap.fromTo(el,
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
      triggers.push(t);
    });

    const gridEl = containerRef.current?.querySelector('.skills-grid');
    if (gridEl) {
      const children = gridEl.querySelectorAll('.stagger-child');
      const t = gsap.fromTo(children,
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
      triggers.push(t);
    }

    // Animate skill progress bars
    const skillBars = containerRef.current?.querySelectorAll('.skill-fill') || [];
    skillBars.forEach(bar => {
      const width = parseInt(bar.getAttribute('data-width') || '0', 10);
      const t = ScrollTrigger.create({
        trigger: bar,
        start: 'top 90%',
        onEnter: () => {
          gsap.to(bar, { scaleX: width / 100, duration: 1.4, ease: 'power3.out' });
        }
      });
      triggers.push(t);
    });

    return () => {
      triggers.forEach(t => {
        if (t.scrollTrigger) t.scrollTrigger.kill();
        t.kill();
      });
    };
  }, []);

  return (
    <section id="skills" className="section" ref={containerRef}>
      <div className="site-container">
        <div style={{ marginBottom: '3rem' }} className="reveal">
          <div className="s-label">Technical Capabilities</div>
          <h2 className="section-title">Stack &amp; expertise</h2>
          <p className="section-subtitle">A polyglot tech stack built over 5+ years across web, infrastructure, AI, and security.</p>
        </div>

        {/* SSH Commands showcase */}
        <div className="ssh-prompt reveal" style={{ marginBottom: '2.5rem', maxWidth: '600px' }}>
          <div className="ssh-line">
            <span className="ssh-prompt-str">sahinur@dev:~$</span>
            <span className="ssh-cmd">cat /etc/tech-stack.conf</span>
          </div>
          <div className="ssh-line"><span className="ssh-comment"># PRIMARY STACK</span></div>
          <div className="ssh-line ssh-out">FRONTEND="React Next.js TypeScript Tailwind GSAP"</div>
          <div className="ssh-line ssh-out">BACKEND="Node.js Laravel PHP Python FastAPI"</div>
          <div className="ssh-line ssh-out">DATABASE="MongoDB MySQL PostgreSQL Redis"</div>
          <div className="ssh-line ssh-out">INFRA="Linux Git Docker Nginx AWS SSH"</div>
          <div className="ssh-line ssh-out">SECURITY="PenTest FortiGate OWASP TryHackMe"</div>
          <div className="ssh-line ssh-out">AI_ML="scikit-learn TensorFlow OpenAI NumPy"</div>
        </div>

        <div className="skills-grid">
          {/* Frontend */}
          <div className="skill-cat-card stagger-child">
            <div className="skill-cat-header">
              <span className="skill-cat-icon" style={{ color: '#60A5FA' }}>⬡</span>
              <span className="skill-cat-title">Frontend</span>
            </div>
            <div className="skill-list">
              <div className="skill-row">
                <div className="skill-name-row"><span className="skill-name">React.js</span><span className="skill-pct">90%</span></div>
                <div className="skill-bar"><div className="skill-fill" style={{ background: 'linear-gradient(90deg,#60A5FA,#93C5FD)' }} data-width="90"></div></div>
              </div>
              <div className="skill-row">
                <div className="skill-name-row"><span className="skill-name">Next.js</span><span className="skill-pct">85%</span></div>
                <div className="skill-bar"><div className="skill-fill" style={{ background: 'linear-gradient(90deg,#60A5FA,#93C5FD)' }} data-width="85"></div></div>
              </div>
              <div className="skill-row">
                <div className="skill-name-row"><span className="skill-name">TypeScript</span><span className="skill-pct">82%</span></div>
                <div className="skill-bar"><div className="skill-fill" style={{ background: 'linear-gradient(90deg,#60A5FA,#93C5FD)' }} data-width="82"></div></div>
              </div>
              <div className="skill-row">
                <div className="skill-name-row"><span className="skill-name">HTML / CSS</span><span className="skill-pct">95%</span></div>
                <div className="skill-bar"><div className="skill-fill" style={{ background: 'linear-gradient(90deg,#60A5FA,#93C5FD)' }} data-width="95"></div></div>
              </div>
              <div className="skill-row">
                <div className="skill-name-row"><span className="skill-name">GSAP</span><span className="skill-pct">78%</span></div>
                <div className="skill-bar"><div className="skill-fill" style={{ background: 'linear-gradient(90deg,#60A5FA,#93C5FD)' }} data-width="78"></div></div>
              </div>
            </div>
          </div>

          {/* Backend */}
          <div className="skill-cat-card stagger-child">
            <div className="skill-cat-header">
              <span className="skill-cat-icon" style={{ color: '#4ADE80' }}>⬢</span>
              <span className="skill-cat-title">Backend</span>
            </div>
            <div className="skill-list">
              <div className="skill-row">
                <div className="skill-name-row"><span className="skill-name">Node.js</span><span className="skill-pct">88%</span></div>
                <div className="skill-bar"><div className="skill-fill" style={{ background: 'linear-gradient(90deg,#4ADE80,#86EFAC)' }} data-width="88"></div></div>
              </div>
              <div className="skill-row">
                <div className="skill-name-row"><span className="skill-name">PHP / Laravel</span><span className="skill-pct">82%</span></div>
                <div className="skill-bar"><div className="skill-fill" style={{ background: 'linear-gradient(90deg,#4ADE80,#86EFAC)' }} data-width="82"></div></div>
              </div>
              <div className="skill-row">
                <div className="skill-name-row"><span className="skill-name">Python</span><span className="skill-pct">78%</span></div>
                <div className="skill-bar"><div className="skill-fill" style={{ background: 'linear-gradient(90deg,#4ADE80,#86EFAC)' }} data-width="78"></div></div>
              </div>
              <div className="skill-row">
                <div className="skill-name-row"><span className="skill-name">Java</span><span className="skill-pct">72%</span></div>
                <div className="skill-bar"><div className="skill-fill" style={{ background: 'linear-gradient(90deg,#4ADE80,#86EFAC)' }} data-width="72"></div></div>
              </div>
              <div className="skill-row">
                <div className="skill-name-row"><span className="skill-name">REST / GraphQL</span><span className="skill-pct">85%</span></div>
                <div className="skill-bar"><div className="skill-fill" style={{ background: 'linear-gradient(90deg,#4ADE80,#86EFAC)' }} data-width="85"></div></div>
              </div>
            </div>
          </div>

          {/* Infrastructure */}
          <div className="skill-cat-card stagger-child">
            <div className="skill-cat-header">
              <span className="skill-cat-icon" style={{ color: '#8A9BAD' }}>◎</span>
              <span className="skill-cat-title">Infrastructure</span>
            </div>
            <div className="skill-list">
              <div className="skill-row">
                <div className="skill-name-row"><span className="skill-name">Linux (Ubuntu)</span><span className="skill-pct">85%</span></div>
                <div className="skill-bar"><div className="skill-fill" style={{ background: 'linear-gradient(90deg,#8A9BAD,#C1CDD9)' }} data-width="85"></div></div>
              </div>
              <div className="skill-row">
                <div className="skill-name-row"><span className="skill-name">Git / GitHub</span><span className="skill-pct">90%</span></div>
                <div className="skill-bar"><div className="skill-fill" style={{ background: 'linear-gradient(90deg,#8A9BAD,#C1CDD9)' }} data-width="90"></div></div>
              </div>
              <div className="skill-row">
                <div className="skill-name-row"><span className="skill-name">Docker</span><span className="skill-pct">72%</span></div>
                <div className="skill-bar"><div className="skill-fill" style={{ background: 'linear-gradient(90deg,#8A9BAD,#C1CDD9)' }} data-width="72"></div></div>
              </div>
              <div className="skill-row">
                <div className="skill-name-row"><span className="skill-name">Nginx / Apache</span><span className="skill-pct">75%</span></div>
                <div className="skill-bar"><div className="skill-fill" style={{ background: 'linear-gradient(90deg,#8A9BAD,#C1CDD9)' }} data-width="75"></div></div>
              </div>
              <div className="skill-row">
                <div className="skill-name-row"><span className="skill-name">SSH / Bash</span><span className="skill-pct">82%</span></div>
                <div className="skill-bar"><div className="skill-fill" style={{ background: 'linear-gradient(90deg,#8A9BAD,#C1CDD9)' }} data-width="82"></div></div>
              </div>
            </div>
          </div>

          {/* Security */}
          <div className="skill-cat-card stagger-child">
            <div className="skill-cat-header">
              <span className="skill-cat-icon" style={{ color: '#F87171' }}>⊕</span>
              <span className="skill-cat-title">Security</span>
            </div>
            <div className="skill-list">
              <div className="skill-row">
                <div className="skill-name-row"><span className="skill-name">Penetration Testing</span><span className="skill-pct">72%</span></div>
                <div className="skill-bar"><div className="skill-fill" style={{ background: 'linear-gradient(90deg,#F87171,#FCA5A5)' }} data-width="72"></div></div>
              </div>
              <div className="skill-row">
                <div className="skill-name-row"><span className="skill-name">FortiGate / Web Filter</span><span className="skill-pct">68%</span></div>
                <div className="skill-bar"><div className="skill-fill" style={{ background: 'linear-gradient(90deg,#F87171,#FCA5A5)' }} data-width="68"></div></div>
              </div>
              <div className="skill-row">
                <div className="skill-name-row"><span className="skill-name">Network Troubleshooting</span><span className="skill-pct">80%</span></div>
                <div className="skill-bar"><div className="skill-fill" style={{ background: 'linear-gradient(90deg,#F87171,#FCA5A5)' }} data-width="80"></div></div>
              </div>
              <div className="skill-row">
                <div className="skill-name-row"><span className="skill-name">OWASP Top 10</span><span className="skill-pct">76%</span></div>
                <div className="skill-bar"><div className="skill-fill" style={{ background: 'linear-gradient(90deg,#F87171,#FCA5A5)' }} data-width="76"></div></div>
              </div>
            </div>
          </div>

          {/* AI/ML */}
          <div className="skill-cat-card stagger-child">
            <div className="skill-cat-header">
              <span className="skill-cat-icon" style={{ color: '#A78BFA' }}>⋈</span>
              <span className="skill-cat-title">AI / ML</span>
            </div>
            <div className="skill-list">
              <div className="skill-row">
                <div className="skill-name-row"><span className="skill-name">scikit-learn</span><span className="skill-pct">75%</span></div>
                <div className="skill-bar"><div className="skill-fill" style={{ background: 'linear-gradient(90deg,#A78BFA,#C4B5FD)' }} data-width="75"></div></div>
              </div>
              <div className="skill-row">
                <div className="skill-name-row"><span className="skill-name">OpenAI API</span><span className="skill-pct">80%</span></div>
                <div className="skill-bar"><div className="skill-fill" style={{ background: 'linear-gradient(90deg,#A78BFA,#C4B5FD)' }} data-width="80"></div></div>
              </div>
              <div className="skill-row">
                <div className="skill-name-row"><span className="skill-name">TensorFlow</span><span className="skill-pct">68%</span></div>
                <div className="skill-bar"><div className="skill-fill" style={{ background: 'linear-gradient(90deg,#A78BFA,#C4B5FD)' }} data-width="68"></div></div>
              </div>
              <div className="skill-row">
                <div className="skill-name-row"><span className="skill-name">Machine Learning</span><span className="skill-pct">74%</span></div>
                <div className="skill-bar"><div className="skill-fill" style={{ background: 'linear-gradient(90deg,#A78BFA,#C4B5FD)' }} data-width="74"></div></div>
              </div>
            </div>
          </div>

          {/* Databases */}
          <div className="skill-cat-card stagger-child">
            <div className="skill-cat-header">
              <span className="skill-cat-icon" style={{ color: '#14B8A6' }}>◈</span>
              <span className="skill-cat-title">Databases</span>
            </div>
            <div className="skill-list">
              <div className="skill-row">
                <div className="skill-name-row"><span className="skill-name">MongoDB</span><span className="skill-pct">88%</span></div>
                <div className="skill-bar"><div className="skill-fill" style={{ background: 'linear-gradient(90deg,#14B8A6,#2DD4BF)' }} data-width="88"></div></div>
              </div>
              <div className="skill-row">
                <div className="skill-name-row"><span className="skill-name">MySQL</span><span className="skill-pct">83%</span></div>
                <div className="skill-bar"><div className="skill-fill" style={{ background: 'linear-gradient(90deg,#14B8A6,#2DD4BF)' }} data-width="83"></div></div>
              </div>
              <div className="skill-row">
                <div className="skill-name-row"><span className="skill-name">PostgreSQL</span><span className="skill-pct">74%</span></div>
                <div className="skill-bar"><div className="skill-fill" style={{ background: 'linear-gradient(90deg,#14B8A6,#2DD4BF)' }} data-width="74"></div></div>
              </div>
              <div className="skill-row">
                <div className="skill-name-row"><span className="skill-name">Redis</span><span className="skill-pct">68%</span></div>
                <div className="skill-bar"><div className="skill-fill" style={{ background: 'linear-gradient(90deg,#14B8A6,#2DD4BF)' }} data-width="68"></div></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
