'use client';
import React, { useEffect, useRef } from 'react';
import Image from 'next/image';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { buildCloudinaryUrl } from '@/lib/cloudinaryClient';
import { PROJECTS } from '@/data/projects';

/* ── Brand & Action SVG Icons ──────────────────────────────── */
const IconGitHub = () => (
  <svg
    className="action-btn-icon"
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="currentColor"
    aria-hidden="true"
  >
    <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
  </svg>
);

const IconPatentDoc = () => (
  <svg
    className="action-btn-icon"
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
    <polyline points="14 2 14 8 20 8" />
    <circle cx="12" cy="14" r="3" />
    <path d="M12 17v3" />
  </svg>
);

const IconPlatform = () => (
  <svg
    className="action-btn-icon"
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <polygon points="12 2 2 7 12 12 22 7 12 2" />
    <polyline points="2 17 12 22 22 17" />
    <polyline points="2 12 12 17 22 12" />
  </svg>
);

const IconShield = () => (
  <svg
    className="action-btn-icon"
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
  </svg>
);


export default function Projects() {
  const containerRef = useRef(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      const revealEl = containerRef.current?.querySelector('.reveal');
      if (revealEl) {
        gsap.fromTo(
          revealEl,
          { opacity: 0, y: 40 },
          {
            opacity: 1,
            y: 0,
            duration: 0.9,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: revealEl,
              start: 'top 85%',
              toggleActions: 'play none none none',
            },
          }
        );
      }

      const gridEl = containerRef.current?.querySelector('.projects-grid');
      if (gridEl) {
        const children = gridEl.querySelectorAll('.stagger-child');
        gsap.fromTo(
          children,
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
              toggleActions: 'play none none none',
            },
          }
        );
      }
    }, containerRef);

    return () => {
      ctx.revert();
    };
  }, []);

  return (
    <section id="projects" className="section" ref={containerRef}>
      <div className="site-container">
        <div style={{ marginBottom: '3rem' }} className="reveal">
          <div className="s-label">Selected Work</div>
          <h2 className="section-title">Things I&apos;ve built</h2>
          <p className="section-subtitle">
            From AI tutoring systems to patented IoT hardware — projects where the code actually
            runs somewhere.
          </p>
        </div>

        <div className="projects-grid">
          {PROJECTS.map((project) => (
            <div
              key={project.title}
              className={`project-card stagger-child ${project.isPatent ? 'project-card-patent' : ''}`}
            >
              {/* Top Bar / Category */}
              <div className="project-header">
                <div>
                  <div
                    className="project-year mono muted"
                    style={{ fontSize: '0.62rem', letterSpacing: '0.1em' }}
                  >
                    {project.category}
                  </div>
                  <div
                    className="project-cat-dot"
                    style={{
                      background: project.dotColor,
                      display: 'inline-block',
                      marginTop: '0.4rem',
                    }}
                  />
                </div>
                <div className="project-links">
                  <a
                    href={project.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="project-link"
                    data-tip={project.btnText}
                    aria-label={`${project.title} - ${project.btnText}`}
                  >
                    {project.btnType === 'patent' ? (
                      '↗'
                    ) : (
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
                      </svg>
                    )}
                  </a>
                </div>
              </div>

              {/* Patent Spotlight Banner */}
              {project.isPatent && (
                <div className="patent-spotlight-bar">
                  <span className="patent-spotlight-tag">
                    <span>★</span> {project.patentRibbon}
                  </span>
                  <span className="patent-spotlight-status">Govt. of India</span>
                </div>
              )}

              {/* Patent Badge */}
              {project.isPatent && (
                <div className="patent-badge">⊕ {project.patentNumber} · Granted Jul 2025</div>
              )}

              {/* Optional Cloudinary Project Cover */}
              {project.coverImage && (
                <div className="project-cover">
                  <Image
                    src={buildCloudinaryUrl(project.coverImage, {
                      width: 800,
                      height: 450,
                      crop: 'fill',
                    })}
                    alt={project.title}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    className="project-cover-img"
                    loading="lazy"
                  />
                </div>
              )}

              {/* Clickable Project Title */}
              <h3 className="project-title">
                <a
                  href={project.link}
                  {...(!project.link.startsWith('/')
                    ? { target: '_blank', rel: 'noopener noreferrer' }
                    : {})}
                  className="project-title-link"
                >
                  {project.title}
                </a>
              </h3>

              {/* Description */}
              <div className="project-desc">{project.desc}</div>

              {/* Tech Stack */}
              <div className="project-stack">
                {project.stack.map((item) => (
                  <span key={item} className="stack-chip">
                    {item}
                  </span>
                ))}
              </div>

              {/* Bottom Container pinned to bottom */}
              <div className="project-card-bottom">
                {/* Metrics */}
                <div className="project-metrics">
                  {project.metrics.map((m) => (
                    <div key={m.label} className="metric">
                      <div className="metric-val">{m.val}</div>
                      <div className="metric-label">{m.label}</div>
                    </div>
                  ))}
                </div>

                {/* Bottom-Left Primary Action Link */}
                <div className="project-bottom-action">
                  <a
                    href={project.link}
                    {...(!project.link.startsWith('/')
                      ? { target: '_blank', rel: 'noopener noreferrer' }
                      : {})}
                    className={`project-action-btn ${
                      project.btnType === 'patent'
                        ? 'project-btn-patent'
                        : project.btnType === 'agency' || project.btnType === 'plugin'
                          ? 'project-btn-agency'
                          : 'project-btn-github'
                    }`}
                    aria-label={`${project.title} - ${project.btnText}`}
                  >
                    {project.btnType === 'patent' ? (
                      <IconPatentDoc />
                    ) : project.btnType === 'agency' ? (
                      <IconPlatform />
                    ) : project.btnType === 'plugin' ? (
                      <IconShield />
                    ) : (
                      <IconGitHub />
                    )}
                    <span>{project.btnText}</span>
                    <span className="action-btn-arrow">↗</span>
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
