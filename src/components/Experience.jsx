"use client";
import React, { useEffect, useRef } from 'react';
import Image from 'next/image';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

/* ── Current Roles Data ── */
const CURRENT_ROLES = [
  {
    company: "Ib Arts",
    type: "Full-time · On-site",
    role: "Senior Web Application Developer",
    date: "Jul 2026 – Present",
    duration: "2 mos",
    logo: "/logo/ibarts.png",
    desc: "Driving backend architecture and DevOps infrastructure for production-grade web applications. Designing scalable RESTful APIs, optimizing CI/CD pipelines, managing containerized deployments, and ensuring high-availability server configurations. Collaborating cross-functionally to bridge frontend delivery with robust backend systems.",
    tags: ["Node.js", "Express", "Docker", "CI/CD", "AWS", "MongoDB", "PostgreSQL", "DevOps"]
  },
  {
    company: "Upwork",
    type: "Freelance · Remote",
    role: "Freelance Full-Stack Developer & Web Solutions Specialist",
    date: "Apr 2025 – Present",
    duration: "1 yr 3 mos",
    logo: "/logo/upwork.png",
    desc: "Delivering full-stack engineering to global clients. Stack spans WordPress, Shopify, Wix Studio, MERN, Laravel, and AI/ML integrations. Also handle UI/UX in Figma, branding, SEO, SMO, and performance marketing.",
    tags: ["React", "Node.js", "Laravel", "WordPress", "Shopify", "MongoDB", "Figma", "SEO"]
  },
  {
    company: "WEFIK",
    type: "Full-time · Remote",
    role: "Co-Founder",
    date: "Mar 2021 – Present",
    duration: "5 yrs 4 mos",
    logo: "/logo/wefik.jpeg",
    desc: "Co-founded a digital solutions company. Responsible for vision, strategic growth, project delivery oversight, and building global client relationships. Led 30+ projects across web, mobile, and digital marketing for clients in 5+ countries.",
    tags: ["PHP", "Laravel", "React", "Node.js", "Leadership", "Business Strategy"]
  }
];

/* ── Past Roles Data (Stacking deck order) ── */
const PAST_ROLES = [
  {
    index: "01",
    company: "ARC Document Solutions",
    type: "Internship · On-site",
    role: "Quality Assurance Trainee",
    date: "Sep 2025 – Jun 2026",
    duration: "10 mos",
    logo: "/logo/ARC.png",
    desc: "Embedded in production QA workflows for document processing pipelines. Validated output integrity across large-volume scanning operations, flagged regression defects in document management software, and contributed to test case documentation.",
    tags: ["QA Testing", "Document Management", "Process Improvement", "Technical Writing"]
  },
  {
    index: "02",
    company: "Teenager Esports",
    type: "Full-time · Remote",
    role: "Head of Development",
    date: "Sep 2023 – Feb 2024",
    duration: "6 mos",
    logo: "/logo/teenagers-esports.jpg",
    desc: "Led the development division of a gaming esports organization. Owned the technical roadmap, managed dev teams, built tournament management systems, and integrated streaming infrastructure (OBS, Streamlabs APIs).",
    tags: ["Dev Leadership", "CI/CD", "Web Dev", "Gaming Infra"]
  },
  {
    index: "03",
    company: "Guru Nanak Institute of Technology",
    type: "Full-time · On-site",
    role: "Web Developer",
    date: "Jul 2023 – Feb 2024",
    duration: "8 mos",
    logo: "/logo/gnit.png",
    desc: "Built and maintained web platforms for the institute. Redesigned institutional website (60% load time improvement), developed student event registration system used by 3,000+ students.",
    tags: ["PHP", "MySQL", "WordPress", "JavaScript"]
  },
  {
    index: "04",
    company: "CipherSchools",
    type: "Internship · Remote",
    role: "Full-Stack Developer",
    date: "Sep 2022 – Nov 2022",
    duration: "3 mos",
    logo: "/logo/cipherSchool.webp",
    desc: "Shipped 5 production features for an ed-tech platform. Optimized SQL queries reducing API response time by 40%. First professional experience with a real product codebase.",
    tags: ["PHP", "MySQL", "HTML/CSS", "JavaScript"]
  }
];

export default function Experience() {
  const containerRef = useRef(null);
  const pastPinRef = useRef(null);
  const cardsRef = useRef([]);

  useEffect(() => {
    ScrollTrigger.config({ ignoreMobileResize: true });

    // GSAP Responsive Card-Stacking ScrollTrigger
    const cards = cardsRef.current.filter(Boolean);
    if (!pastPinRef.current) return;

    let refreshTimer;
    let lastWidth = typeof window !== 'undefined' ? window.innerWidth : 0;
    const handleViewportChange = () => {
      // Only refresh if viewport width actually changed (e.g., orientation change or desktop resize)
      // Completely ignore vertical-only resize events caused by mobile browser address bar collapse/expand!
      if (typeof window !== 'undefined' && window.innerWidth === lastWidth) return;
      lastWidth = typeof window !== 'undefined' ? window.innerWidth : 0;

      clearTimeout(refreshTimer);
      refreshTimer = setTimeout(() => {
        ScrollTrigger.refresh();
      }, 200);
    };

    const ctx = gsap.context(() => {
      // Initial section header reveal
      const revealEl = containerRef.current?.querySelector('.exp-header-reveal');
      if (revealEl) {
        gsap.fromTo(
          revealEl,
          { opacity: 0, y: 30 },
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: revealEl,
              start: 'top 85%',
              toggleActions: 'play none none none'
            }
          }
        );
      }

      if (!cards.length) return;

      const mm = gsap.matchMedia();

      // ── Desktop / Tablet Stacking Setup (min-width: 768px) ──
      mm.add("(min-width: 768px)", () => {
        const offsetStep = 40; // px vertical offset per stacked card so top-bar peeks out
        const totalCards = cards.length;

        // Clean initial state for all cards (eliminates flash before/during scroll)
        cards.forEach((card, i) => {
          if (i === 0) {
            gsap.set(card, {
              y: 0,
              scale: 1,
              opacity: 1,
              visibility: 'visible',
              filter: 'brightness(1)',
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              transformOrigin: 'top center',
              zIndex: 1,
            });
          } else {
            gsap.set(card, {
              y: 140 + (i - 1) * 20,
              scale: 0.96,
              opacity: 0,
              visibility: 'visible',
              filter: 'brightness(1)',
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              transformOrigin: 'top center',
              zIndex: i + 1,
            });
          }
        });

        // Master pinning timeline with well-calibrated scroll distance (450px per incoming card)
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: pastPinRef.current,
            start: "top 12%",
            end: `+=${(totalCards - 1) * 450}`,
            pin: true,
            scrub: 0.5,
            anticipatePin: 1,
            invalidateOnRefresh: true,
          }
        });

        // Sequence through incoming cards (1, 2, 3...)
        for (let i = 1; i < totalCards; i++) {
          const stepLabel = `step-${i}`;
          const currentTargetY = i * offsetStep;
          const startY = 130 + (i - 1) * 15;

          // 1. Incoming card fades to solid opacity quickly in the first 25% of scroll
          // This eliminates transparent text-ghosting / double-exposure over underneath cards
          tl.fromTo(
            cards[i],
            { opacity: 0 },
            {
              opacity: 1,
              duration: 0.25,
              ease: "power1.in",
            },
            stepLabel
          );

          // 2. Incoming card smoothly translates up to its stacked offset
          tl.fromTo(
            cards[i],
            {
              y: startY,
              scale: 0.96,
            },
            {
              y: currentTargetY,
              scale: 1,
              duration: 1,
              ease: "none",
            },
            stepLabel
          );

          // 3. All cards underneath stay solid, subtly scaling down and dimming for tactile depth
          for (let j = 0; j < i; j++) {
            const depthFromTop = i - j;
            const targetScale = 1 - depthFromTop * 0.025;
            const targetBrightness = Math.max(0.65, 1 - depthFromTop * 0.1);

            tl.to(
              cards[j],
              {
                scale: targetScale,
                filter: `brightness(${targetBrightness})`,
                duration: 1,
                ease: "none",
              },
              stepLabel
            );
          }
        }
      });

      // ── Mobile Setup (max-width: 767px) Natural scroll, clean vertical list ──
      mm.add("(max-width: 767px)", () => {
        cards.forEach((card) => {
          gsap.set(card, {
            scale: 1,
            visibility: 'visible',
            filter: 'none',
            position: 'relative',
            top: 'auto',
            left: 'auto',
            right: 'auto',
            transform: 'none',
          });
        });

        // Single consolidated trigger for mobile instead of multiple reverse-scrub instances
        gsap.fromTo(
          cards,
          { opacity: 0, y: 20 },
          {
            opacity: 1,
            y: 0,
            duration: 0.5,
            stagger: 0.08,
            ease: "power2.out",
            scrollTrigger: {
              trigger: pastPinRef.current,
              start: "top 90%",
              toggleActions: "play none none none",
            },
          }
        );
      });
    }, containerRef);

    window.addEventListener('resize', handleViewportChange, { passive: true });
    window.addEventListener('orientationchange', handleViewportChange, { passive: true });

    return () => {
      clearTimeout(refreshTimer);
      window.removeEventListener('resize', handleViewportChange);
      window.removeEventListener('orientationchange', handleViewportChange);
      ctx.revert();
    };
  }, []);

  return (
    <section id="experience" className="section" ref={containerRef}>
      <div className="site-container">
        
        {/* Section Header */}
        <div className="exp-header-reveal" style={{ marginBottom: '3.5rem' }}>
          <div className="s-label">Career History</div>
          <h2 className="section-title">Where I&apos;ve shipped code</h2>
          <p className="section-subtitle">
            From technical internships and digital leadership to co-founding WEFIK and engineering backend systems — a track record built on real execution.
          </p>
        </div>

        {/* ══════════════════════════════════════════════
            PART 1: CURRENT ROLES (Static list, emerald hover)
           ══════════════════════════════════════════════ */}
        <div className="exp-part">
          <div className="exp-part-header">
            <span className="exp-part-badge">● CURRENT ENGAGEMENTS</span>
            <span className="exp-part-meta">3 Active Roles</span>
          </div>

          <div className="current-roles-list">
            {CURRENT_ROLES.map((role) => (
              <div key={role.company} className="current-role-card">
                <div className="role-card-top">
                  <div className="role-logo-wrap">
                    <Image src={role.logo} alt={`${role.company} Logo`} width={44} height={44} className="role-logo-img" style={{ objectFit: 'contain' }} />
                  </div>
                  <div className="role-header-text">
                    <div className="role-company-row">
                      <span className="role-company-name">{role.company}</span>
                      <span className="role-type-tag">{role.type}</span>
                      <span className="current-live-badge">● ACTIVE</span>
                    </div>
                    <h3 className="role-title-text">{role.role}</h3>
                  </div>
                  <div className="role-date-box">
                    <span className="role-date-str">{role.date}</span>
                    <span className="role-duration-str">{role.duration}</span>
                  </div>
                </div>

                <p className="role-description-text">{role.desc}</p>

                <div className="role-tags-list">
                  {role.tags.map((tag) => (
                    <span key={tag} className="tag">{tag}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ══════════════════════════════════════════════
            PART 2: PAST ROLES (Pinned Scroll-Stacked Cards)
           ══════════════════════════════════════════════ */}
        <div className="exp-part past-roles-part" style={{ marginTop: '5rem' }}>
          <div className="past-roles-pin-wrapper" ref={pastPinRef}>
            <div className="exp-part-header past-header">
              <span className="exp-part-badge past-badge">◈ PREVIOUS TRACK RECORD</span>
              <span className="exp-part-meta">4 Completed Positions · Scroll to Explore</span>
            </div>

            <div className="deck-container">
              {PAST_ROLES.map((role, idx) => (
                <div
                  key={role.company}
                  className={`deck-card deck-card-${idx}`}
                  ref={(el) => (cardsRef.current[idx] = el)}
                  style={{ zIndex: idx + 1 }}
                >
                  <div className="deck-card-inner">
                    <div className="deck-card-top-bar">
                      <div className="deck-num-badge">ROLE {role.index} / 04</div>
                      <div className="deck-timeline-badge">{role.date} ({role.duration})</div>
                    </div>

                    <div className="role-card-top">
                      <div className="role-logo-wrap past-logo-wrap">
                        <Image src={role.logo} alt={`${role.company} Logo`} width={44} height={44} className="role-logo-img" style={{ objectFit: 'contain' }} />
                      </div>
                      <div className="role-header-text">
                        <div className="role-company-row">
                          <span className="role-company-name">{role.company}</span>
                          <span className="role-type-tag">{role.type}</span>
                        </div>
                        <h3 className="role-title-text">{role.role}</h3>
                      </div>
                    </div>

                    <p className="role-description-text past-desc">{role.desc}</p>

                    <div className="role-tags-list">
                      {role.tags.map((tag) => (
                        <span key={tag} className="tag">{tag}</span>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
