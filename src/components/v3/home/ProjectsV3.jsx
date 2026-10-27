'use client';

import React, { useRef } from 'react';
import Image from 'next/image';
import ChapterHeader from '../ChapterHeader';
import { useChapterReveal } from '../motion';
import { PROJECTS } from '@/data/projects';
import { buildCloudinaryUrl } from '@/lib/cloudinaryClient';

function ProjectGlyph({ type }) {
  if (type === 'github') {
    return (
      <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor" aria-hidden="true">
        <path d="M12 .5C5.65.5.5 5.65.5 12c0 5.08 3.29 9.39 7.86 10.91.58.11.79-.25.79-.55v-2.17c-3.2.7-3.87-1.36-3.87-1.36-.52-1.33-1.28-1.68-1.28-1.68-1.04-.71.08-.7.08-.7 1.15.08 1.76 1.18 1.76 1.18 1.03 1.75 2.69 1.25 3.35.95.1-.74.4-1.25.72-1.54-2.55-.29-5.24-1.28-5.24-5.68 0-1.26.45-2.28 1.18-3.09-.12-.29-.51-1.46.11-3.05 0 0 .96-.31 3.15 1.18a10.9 10.9 0 0 1 5.74 0c2.18-1.49 3.14-1.18 3.14-1.18.63 1.59.24 2.76.12 3.05.74.81 1.18 1.83 1.18 3.09 0 4.41-2.7 5.38-5.26 5.67.41.35.77 1.05.77 2.12v3.14c0 .31.21.67.8.55A11.51 11.51 0 0 0 23.5 12C23.5 5.65 18.35.5 12 .5Z" />
      </svg>
    );
  }
  if (type === 'patent') {
    return (
      <svg
        viewBox="0 0 24 24"
        width="16"
        height="16"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8Z" />
        <path d="M14 2v6h6" />
        <circle cx="12" cy="14" r="3" />
        <path d="M12 17v3" />
      </svg>
    );
  }
  return (
    <svg
      viewBox="0 0 24 24"
      width="16"
      height="16"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M7 17 17 7M9 7h8v8" />
    </svg>
  );
}

function ProjectCover({ project, widths, sizes, priority = false }) {
  const [failed, setFailed] = React.useState(false);

  if (!project.coverImage || failed) {
    return (
      <div className="v3-project-cover v3-project-cover--type" aria-hidden="true">
        <span className="v3-type-cover-brand">GeniousSonu</span>
        <span className="v3-type-cover-title">{project.title}</span>
        <span className="v3-type-cover-rule" />
        <span className="v3-type-cover-stat">{project.metrics?.[0]?.val ?? '—'}</span>
        <span className="v3-type-cover-caption">
          {project.metrics?.[0]?.label ?? 'Shipped system'}
        </span>
      </div>
    );
  }

  return (
    <div className="v3-project-cover">
      <Image
        src={buildCloudinaryUrl(project.coverImage, {
          width: widths,
          height: Math.round(widths * 0.62),
          crop: 'fill',
        })}
        alt={`${project.title} — project cover`}
        width={widths}
        height={Math.round(widths * 0.62)}
        sizes={sizes}
        priority={priority}
        onError={() => setFailed(true)}
        className="v3-project-img"
      />
    </div>
  );
}

function Metrics({ metrics }) {
  return (
    <dl className="v3-project-metrics">
      {metrics.map((metric) => (
        <div key={`${metric.val}-${metric.label}`}>
          <dt>{metric.label}</dt>
          <dd>{metric.val}</dd>
        </div>
      ))}
    </dl>
  );
}

function Stack({ stack }) {
  return (
    <ul className="v3-project-stack" aria-label="Technology stack">
      {stack.map((item) => (
        <li key={item}>{item}</li>
      ))}
    </ul>
  );
}

export default function ProjectsV3() {
  const rootRef = useRef(null);
  useChapterReveal(rootRef);

  const patent = PROJECTS.find((project) => project.isPatent);
  const rest = PROJECTS.filter((project) => project !== patent);

  return (
    <section
      id="projects"
      className="v3-chapter v3-projects"
      ref={rootRef}
      aria-labelledby="projects-title"
    >
      <div className="v3-shell">
        <ChapterHeader
          number="04"
          chapter="The Proof"
          title={<>Things I&rsquo;ve built</>}
          subtitle="From AI tutoring systems to patented IoT hardware — projects where the code actually runs somewhere."
          emoji="rocket"
          id="projects-title"
          aside={<span className="v3-chapter-count">07 selected systems</span>}
        />

        <article className="v3-feature" data-reveal>
          <div className="v3-feature-media">
            <ProjectCover project={patent} widths={1280} sizes="(max-width: 900px) 92vw, 58vw" />
            <span className="v3-feature-ribbon">{patent.patentRibbon}</span>
            <span className="v3-feature-grain" aria-hidden="true" />
          </div>

          <div className="v3-feature-body">
            <div className="v3-project-kicker">
              <span
                className="v3-project-dot"
                style={{ background: patent.dotColor }}
                aria-hidden="true"
              />
              {patent.category}
              <span className="v3-kicker-divider" aria-hidden="true">
                /
              </span>
              Featured build
            </div>
            <h3 className="v3-feature-title">{patent.title}</h3>
            <p className="v3-feature-desc">{patent.desc}</p>
            <Stack stack={patent.stack} />
            <Metrics metrics={patent.metrics} />
            <a
              href={patent.link}
              target="_blank"
              rel="noopener noreferrer"
              className="v3-project-action"
              data-v3-sound="confirm"
            >
              <ProjectGlyph type={patent.btnType} />
              {patent.btnText}
              <span aria-hidden="true">↗</span>
            </a>
          </div>
        </article>

        <div className="v3-shelf-head" data-reveal>
          <span className="v3-label">Also shipped</span>
          <span className="v3-shelf-rule" aria-hidden="true" />
          <span className="v3-label">2021 — 2026</span>
        </div>

        <div className="v3-project-shelf">
          {rest.map((project, index) => (
            <article className="v3-project-card" key={project.title} data-reveal>
              <ProjectCover
                project={project}
                widths={900}
                sizes="(max-width: 720px) 92vw, (max-width: 1100px) 46vw, 38vw"
              />

              <div className="v3-project-body">
                <div className="v3-project-kicker">
                  <span
                    className="v3-project-dot"
                    style={{ background: project.dotColor }}
                    aria-hidden="true"
                  />
                  {project.category}
                  <span className="v3-project-index" aria-hidden="true">
                    {String(index + 2).padStart(2, '0')}
                  </span>
                </div>
                <h3 className="v3-project-title">{project.title}</h3>
                <p className="v3-project-desc">{project.desc}</p>
                <Stack stack={project.stack} />
                <Metrics metrics={project.metrics} />
                <a
                  href={project.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="v3-project-action"
                  data-v3-sound="confirm"
                >
                  <ProjectGlyph type={project.btnType} />
                  {project.btnText}
                  <span aria-hidden="true">↗</span>
                </a>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
