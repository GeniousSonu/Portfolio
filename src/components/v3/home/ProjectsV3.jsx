'use client';

import React, { useRef } from 'react';
import Image from 'next/image';
import ChapterHeader from '../ChapterHeader';
import { useChapterReveal } from '../motion';
import { PROJECTS } from '@/data/projects';
import { buildCloudinaryUrl } from '@/lib/cloudinaryClient';

const SECTION_THEMES = [
  { id: 'sec-01', bgVar: 'var(--sec-01-bg)', accent: '#FF2E93', darkAccent: '#34D399', darkBorder: '#10B981', status: 'WP SECURITY PLUGIN' },
  { id: 'sec-02', bgVar: 'var(--sec-02-bg)', accent: '#A3E635', darkAccent: '#A78BFA', darkBorder: '#8B5CF6', status: 'ADAPTIVE AI TUTOR' },
  { id: 'sec-03', bgVar: 'var(--sec-03-bg)', accent: '#FACC15', darkAccent: '#FB7185', darkBorder: '#F43F5E', status: 'OFFICIALLY GRANTED PATENT' },
  { id: 'sec-04', bgVar: 'var(--sec-04-bg)', accent: '#00F5D4', darkAccent: '#F472B6', darkBorder: '#EC4899', status: 'WEB ARCHITECTURE' },
  { id: 'sec-05', bgVar: 'var(--sec-05-bg)', accent: '#FF4D8D', darkAccent: '#E879F9', darkBorder: '#D946EF', status: 'AGENCY PLATFORM' },
  { id: 'sec-06', bgVar: 'var(--sec-06-bg)', accent: '#0F1E36', darkAccent: '#FB923C', darkBorder: '#F97316', status: 'FULL STACK APP' },
  { id: 'sec-07', bgVar: 'var(--sec-07-bg)', accent: '#FF2E93', darkAccent: '#4ADE80', darkBorder: '#4ADE80', status: 'APPLICATION PORTAL' },
];

function ChromeStarSVG() {
  return (
    <svg
      width="32"
      height="32"
      viewBox="0 0 24 24"
      fill="none"
      className="v3-chrome-star"
      aria-hidden="true"
    >
      <path
        d="M12 0C12 7.5 16.5 12 24 12C16.5 12 12 16.5 12 24C12 16.5 7.5 12 0 12C7.5 12 12 7.5 12 0Z"
        fill="url(#chromeStarGrad)"
      />
      <defs>
        <linearGradient id="chromeStarGrad" x1="2" y1="2" x2="22" y2="22" gradientUnits="userSpaceOnUse">
          <stop stopColor="#FFFFFF" />
          <stop offset="0.45" stopColor="#B4F461" />
          <stop offset="1" stopColor="#FF2E93" />
        </linearGradient>
      </defs>
    </svg>
  );
}

function ProjectCover({ project, widths, sizes, priority = false }) {
  const [failed, setFailed] = React.useState(false);

  if (!project.coverImage || failed) {
    return (
      <div className="v3-showcase-cover v3-showcase-cover--type" aria-hidden="true">
        <div className="v3-type-cover-badge">GENIOUS SONU // SHIPPED BUILD</div>
        <div className="v3-type-cover-title">{project.title}</div>
        <div className="v3-type-cover-metric-row">
          <span className="v3-type-cover-stat">{project.metrics?.[0]?.val ?? '100%'}</span>
          <span className="v3-type-cover-caption">{project.metrics?.[0]?.label ?? 'Engineered'}</span>
        </div>
      </div>
    );
  }

  return (
    <div className="v3-showcase-cover">
      <Image
        src={buildCloudinaryUrl(project.coverImage, {
          width: widths,
          height: Math.round(widths * 0.62),
          crop: 'fill',
        })}
        alt={`${project.title} — project showcase`}
        width={widths}
        height={Math.round(widths * 0.62)}
        sizes={sizes}
        priority={priority}
        onError={() => setFailed(true)}
        className="v3-showcase-img"
      />
    </div>
  );
}

export default function ProjectsV3() {
  const rootRef = useRef(null);
  useChapterReveal(rootRef);

  return (
    <section
      id="projects"
      className="v3-chapter v3-projects-stacked"
      ref={rootRef}
      aria-labelledby="projects-title"
    >
      <div className="v3-shell v3-projects-head-shell">
        <ChapterHeader
          number="04"
          chapter="The Proof"
          title={<>Things I&rsquo;ve built</>}
          subtitle="From adaptive AI tutoring systems to patented IoT hardware — systems where the code actually runs in production."
          emoji="rocket"
          id="projects-title"
          aside={<span className="v3-chapter-count">07 selected systems</span>}
        />
      </div>

      <div className="v3-stacked-cards-container">
        {PROJECTS.map((project, index) => {
          const theme = SECTION_THEMES[index % SECTION_THEMES.length];
          const isTangerine = theme.id === 'sec-06';
          const cardNum = String(index + 1).padStart(2, '0');

          return (
            <article
              key={project.slug || project.title}
              id={`showcase-${project.slug || index}`}
              className={`v3-stacked-card ${theme.id} ${isTangerine ? 'is-tangerine' : ''}`}
              style={{
                '--card-bg': theme.bgVar,
                '--card-accent': theme.accent,
                '--card-dark-border': theme.darkBorder,
              }}
              data-reveal
            >
              {/* Dot matrix background texture on right half */}
              <div className="v3-stacked-dot-matrix" aria-hidden="true" />

              <div className="v3-stacked-card-inner">
                {/* 42% Left Narrative Column */}
                <div className="v3-showcase-narrative">
                  <div className="v3-showcase-index-row">
                    <span className="v3-index-pill">P.{cardNum}</span>
                    <span className="v3-index-counter">{cardNum} / 07</span>
                  </div>

                  <h3 className="v3-showcase-title">{project.title}</h3>

                  <div className="v3-showcase-metadata">
                    <span>{project.category}</span>
                    <span className="v3-meta-bullet" aria-hidden="true">·</span>
                    <span>{project.isPatent ? 'OFFICIAL PATENT' : 'PRODUCTION SYSTEM'}</span>
                  </div>

                  <div className="v3-showcase-context-box">
                    <p className="v3-showcase-editorial-hook">
                      &ldquo;{project.desc}&rdquo;
                    </p>
                  </div>

                  {project.metrics?.length > 0 && (
                    <div className="v3-showcase-bullets">
                      {project.metrics.map((m) => (
                        <div key={m.label} className="v3-bullet-item">
                          <span className="v3-bullet-dot" aria-hidden="true">✦</span>
                          <strong className="v3-bullet-val">{m.val}</strong>
                          <span className="v3-bullet-label">{m.label}</span>
                        </div>
                      ))}
                    </div>
                  )}

                  <div className="v3-showcase-skill-pills">
                    {project.stack?.map((item) => (
                      <span key={item} className="v3-showcase-pill">
                        {item}
                      </span>
                    ))}
                  </div>
                </div>

                {/* 58% Right Visual Showcase Frame */}
                <div className="v3-showcase-visual">
                  <div className="v3-star-anchor">
                    <ChromeStarSVG />
                  </div>

                  <div className="v3-tilted-frame">
                    <div className="v3-frame-media-wrap">
                      <div className="v3-status-pill-overlay">
                        <span className="v3-live-dot" aria-hidden="true" />
                        <span>{project.isPatent ? (project.patentRibbon || 'OFFICIALLY GRANTED PATENT') : theme.status}</span>
                      </div>

                      <ProjectCover
                        project={project}
                        widths={1100}
                        sizes="(max-width: 900px) 94vw, 54vw"
                        priority={index === 0}
                      />
                    </div>

                    <div className="v3-frame-footer-bar">
                      <div className="v3-frame-footer-title">
                        {project.title.split('—')[0].trim()}
                      </div>
                      <a
                        href={project.link}
                        target={project.link.startsWith('http') ? '_blank' : undefined}
                        rel={project.link.startsWith('http') ? 'noopener noreferrer' : undefined}
                        className="v3-frame-cta-btn"
                        data-v3-sound="confirm"
                      >
                        <span>{project.btnText || 'Explore System'}</span>
                        <span aria-hidden="true">↗</span>
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}
