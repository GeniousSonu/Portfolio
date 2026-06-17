"use client";
import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { TextPlugin } from 'gsap/TextPlugin';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

export default function Hero() {
  const eyebrowRef = useRef(null);
  const nameRef = useRef(null);
  const roleRef = useRef(null);
  const descRef = useRef(null);
  const actionsRef = useRef(null);
  const statsRef = useRef(null);
  const terminalRef = useRef(null);
  const typingRef = useRef(null);

  useEffect(() => {
    gsap.registerPlugin(TextPlugin, ScrollTrigger);

    // Entry Animations
    const heroTL = gsap.timeline({ delay: 0.1 });
    
    // Animate eyebrow
    heroTL.to(eyebrowRef.current, { opacity: 1, y: 0, duration: 0.7, ease: 'power3.out' });
    
    // Animate name lines
    if (nameRef.current) {
      const spans = nameRef.current.querySelectorAll('.hero-name-line span');
      heroTL.to(spans, { y: 0, opacity: 1, duration: 0.9, stagger: 0.12, ease: 'power4.out' }, '-=0.3');
    }

    heroTL.to(roleRef.current, { opacity: 1, y: 0, duration: 0.7, ease: 'power3.out' }, '-=0.4')
          .to(descRef.current, { opacity: 1, y: 0, duration: 0.7, ease: 'power3.out' }, '-=0.4')
          .to(actionsRef.current, { opacity: 1, y: 0, duration: 0.7, ease: 'power3.out' }, '-=0.4')
          .to(terminalRef.current, { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' }, '-=0.6')
          .to(statsRef.current, { opacity: 1, y: 0, duration: 0.7, ease: 'power3.out' }, '-=0.5');

    // Counter animations on stats
    heroTL.add(() => {
      if (!statsRef.current) return;
      const countItems = statsRef.current.querySelectorAll('.stat-value[data-target]');
      countItems.forEach(el => {
        const target = parseInt(el.getAttribute('data-target') || '0', 10);
        const numEl = el.querySelector('.count-num');
        if (!numEl) return;
        gsap.to({ val: 0 }, {
          val: target,
          duration: 1.8,
          ease: 'power2.out',
          onUpdate: function() {
            numEl.textContent = Math.round(this.targets()[0].val).toString();
          }
        });
      });
    }, '-=0.4');

    // Terminal typing logic
    const commands = [
      'ls -la /projects/',
      'git log --oneline -5',
      'sudo systemctl status nginx',
      'ssh root@192.168.1.1',
      'cat /etc/hosts'
    ];
    let cmdIdx = 0;
    let typingAnimation;

    function typeNext() {
      if (!typingRef.current) return;
      const cmd = commands[cmdIdx % commands.length];
      
      typingAnimation = gsap.to(typingRef.current, {
        duration: cmd.length * 0.05,
        text: { value: cmd, delimiter: '' },
        ease: 'none',
        onComplete: () => {
          setTimeout(() => {
            if (!typingRef.current) return;
            typingAnimation = gsap.to(typingRef.current, {
              duration: cmd.length * 0.02,
              text: { value: '', delimiter: '' },
              ease: 'none',
              onComplete: () => {
                cmdIdx++;
                setTimeout(typeNext, 500);
              }
            });
          }, 1800);
        }
      });
    }

    const typingStartTimeout = setTimeout(typeNext, 1500);

    // Magnetic buttons effect
    const buttons = actionsRef.current?.querySelectorAll('.btn') || [];
    const buttonHandlers = [];

    buttons.forEach(btn => {
      const handleMouseMove = (e) => {
        const rect = btn.getBoundingClientRect();
        const cx = rect.left + rect.width / 2;
        const cy = rect.top + rect.height / 2;
        const dx = (e.clientX - cx) * 0.25;
        const dy = (e.clientY - cy) * 0.25;
        gsap.to(btn, { x: dx, y: dy, duration: 0.3, ease: 'power2.out' });
      };

      const handleMouseLeave = () => {
        gsap.to(btn, { x: 0, y: 0, duration: 0.5, ease: 'elastic.out(1, 0.5)' });
      };

      btn.addEventListener('mousemove', handleMouseMove);
      btn.addEventListener('mouseleave', handleMouseLeave);
      buttonHandlers.push({ btn, handleMouseMove, handleMouseLeave });
    });

    // Parallax background scroll
    const parallaxTrigger = gsap.to('.hero-bg', {
      y: -100,
      ease: 'none',
      scrollTrigger: {
        trigger: '#hero',
        start: 'top top',
        end: 'bottom top',
        scrub: 1.5
      }
    });

    return () => {
      if (typingAnimation) typingAnimation.kill();
      clearTimeout(typingStartTimeout);
      buttonHandlers.forEach(({ btn, handleMouseMove, handleMouseLeave }) => {
        btn.removeEventListener('mousemove', handleMouseMove);
        btn.removeEventListener('mouseleave', handleMouseLeave);
      });
      parallaxTrigger.scrollTrigger?.kill();
      parallaxTrigger.kill();
    };
  }, []);

  return (
    <section id="hero">
      <div className="hero-bg" aria-hidden="true"></div>
      <div className="site-container" style={{ width: '100%' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: '2rem', alignItems: 'center', flexWrap: 'wrap' }}>
          <div className="hero-content">
            <div className="hero-eyebrow" id="hero-eyebrow" ref={eyebrowRef}>
              <span className="status-dot"></span>
              <span className="line"></span>
              <span>Open to Global Roles · IST (UTC+5:30)</span>
            </div>

            <h1 className="hero-name" aria-label="SK Sahinur Islam" ref={nameRef}>
              <span className="hero-name-line"><span>SK</span></span>
              <span className="hero-name-line"><span>Sahinur</span></span>
              <span className="hero-name-line"><span>Islam</span></span>
            </h1>

            <p className="hero-role" id="hero-role" ref={roleRef}>Full Stack Developer &amp; IT Engineer</p>

            <p className="hero-desc" id="hero-desc" ref={descRef}>
              I build systems that don't fail at 3 AM. From MERN stack web apps to patented IoT cold chains,
              I engineer at the intersection of <span className="gold">web, infrastructure, and security.</span>
            </p>

            <div className="hero-actions" id="hero-actions" ref={actionsRef}>
              <a href="#projects" className="btn btn-gold">View Projects ↓</a>
              <a href="https://www.linkedin.com/in/sksahinurislam/" target="_blank" rel="noopener noreferrer" className="btn btn-ghost">LinkedIn →</a>
            </div>

            <div className="hero-stats" id="hero-stats" ref={statsRef}>
              <div className="stat-item">
                <div className="stat-value" data-target="5"><span className="count-num">0</span><span>+</span></div>
                <div className="stat-label">Years Active</div>
              </div>
              <div className="stat-item">
                <div className="stat-value" data-target="40"><span className="count-num">0</span><span>+</span></div>
                <div className="stat-label">Projects Done</div>
              </div>
              <div className="stat-item">
                <div className="stat-value" data-target="30"><span className="count-num">0</span><span>+</span></div>
                <div className="stat-label">Certifications</div>
              </div>
              <div className="stat-item">
                <div className="stat-value" data-target="1"><span className="count-num">0</span></div>
                <div className="stat-label">Patent Granted</div>
              </div>
            </div>
          </div>

          {/* Hero Terminal */}
          <div className="hero-terminal" id="hero-terminal" ref={terminalRef}>
            <div className="terminal-window">
              <div className="terminal-header">
                <div className="dot-r"></div><div className="dot-y"></div><div className="dot-g"></div>
                <span style={{ marginLeft: '0.5rem', fontSize: '0.7rem', color: 'var(--text-muted)' }}>sahinur@dev:~</span>
              </div>
              <div className="sysinfo-body">
                <div className="ssh-prompt">
                  <div className="ssh-line"><span className="ssh-prompt-str">sahinur@dev:~$</span><span className="ssh-cmd">neofetch --minimal</span></div>
                  <div className="ssh-line ssh-out">  OS: Ubuntu 24.04 LTS x86_64</div>
                  <div className="ssh-line ssh-out">  Kernel: 6.8.0-49-generic</div>
                  <div className="ssh-line ssh-out">  Shell: zsh 5.9</div>
                  <div className="ssh-line ssh-out">  Stack: MERN · Laravel · Python</div>
                  <div className="ssh-line ssh-out">  Uptime: 5y 4m 12d</div>
                  <div className="ssh-line"><span className="ssh-prompt-str">sahinur@dev:~$</span><span className="ssh-cmd">whoami</span></div>
                  <div className="ssh-line ssh-out">  sk-sahinur-islam (co-founder, dev, qa-intern)</div>
                  <div className="ssh-line">
                    <span className="ssh-prompt-str">sahinur@dev:~$</span>
                    <span id="terminal-typing" className="ssh-cmd" ref={typingRef}></span>
                    <span style={{ color: 'var(--green)', animation: 'blink 1s step-end infinite' }}>▋</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
