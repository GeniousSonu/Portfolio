'use client';

import React, { useRef, useState } from 'react';
import Image from 'next/image';
import ChapterHeader from '../ChapterHeader';
import { CURRENT_ROLES, PAST_ROLES } from '@/components/Experience';
import { useChapterReveal } from '../motion';

function monogram(company) {
  return company
    .split(/\s+/)
    .slice(0, 2)
    .map((word) => word[0])
    .join('')
    .toUpperCase();
}

function RoleLogo({ src, company, size }) {
  const [failed, setFailed] = useState(false);

  if (!src || failed) {
    return (
      <span className="v3-role-monogram" aria-hidden="true">
        {monogram(company)}
      </span>
    );
  }

  return (
    <Image
      src={src}
      alt={`${company} logo`}
      width={size}
      height={size}
      style={{ objectFit: 'contain' }}
      onError={() => setFailed(true)}
    />
  );
}

export default function ExperienceV3() {
  const rootRef = useRef(null);
  useChapterReveal(rootRef);

  return (
    <section
      id="experience"
      className="v3-chapter v3-experience"
      ref={rootRef}
      aria-labelledby="experience-title"
    >
      <div className="v3-shell">
        <ChapterHeader
          number="03"
          chapter="The Practice"
          title="Where I've shipped code"
          subtitle="From technical internships and digital leadership to co-founding WEFIK and engineering backend systems — a track record built on real execution."
          emoji="laptop"
          id="experience-title"
        />

        <div className="v3-experience-grid">
          <aside className="v3-experience-aside" data-reveal>
            <div className="v3-aside-card">
              <span className="v3-mono-label">Active engagements</span>
              <strong className="v3-aside-big">03</strong>
              <p>
                Three roles running in parallel — backend architecture, global freelance delivery,
                and WEFIK.
              </p>
              <span className="v3-aside-rule" aria-hidden="true" />
              <span className="v3-mono-label">Track record</span>
              <strong className="v3-aside-big">07</strong>
              <p>
                Four completed positions behind them, from QA pipelines to leading development
                teams.
              </p>
              <span className="v3-aside-years" aria-hidden="true">
                2021 —— 2026
              </span>
            </div>
          </aside>

          <div className="v3-experience-main">
            <div className="v3-part-head" data-reveal>
              <span className="v3-part-title">
                <span className="v3-live-dot" aria-hidden="true" /> Current engagements
              </span>
              <span className="v3-part-meta">3 active roles</span>
            </div>

            <div className="v3-role-list">
              {CURRENT_ROLES.map((role, index) => (
                <article className="v3-role-card" key={role.company} data-reveal>
                  <div className="v3-role-top">
                    <div className="v3-role-logo">
                      <RoleLogo src={role.logo} company={role.company} size={44} />
                    </div>
                    <div className="v3-role-ident">
                      <div className="v3-role-company-row">
                        <h3>{role.company}</h3>
                        <span className="v3-role-current">Current</span>
                      </div>
                      <p className="v3-role-role">{role.role}</p>
                    </div>
                    <div className="v3-role-when">
                      <span>{role.date}</span>
                      <em>{role.duration}</em>
                      <span className="v3-role-type">{role.type}</span>
                    </div>
                  </div>
                  <p className="v3-role-desc">{role.desc}</p>
                  <ul className="v3-tag-list" aria-label={`${role.company} technologies`}>
                    {role.tags.map((tag) => (
                      <li key={tag}>{tag}</li>
                    ))}
                  </ul>
                  <span className="v3-role-index" aria-hidden="true">
                    0{index + 1}
                  </span>
                </article>
              ))}
            </div>

            <div className="v3-part-head v3-part-head--past" data-reveal>
              <span className="v3-part-title">Previous track record</span>
              <span className="v3-part-meta">4 completed positions</span>
            </div>

            <ol className="v3-past-list">
              {PAST_ROLES.map((role) => (
                <li className="v3-past-role" key={role.company} data-reveal>
                  <div className="v3-past-index" aria-hidden="true">
                    {role.index}
                  </div>
                  <div className="v3-past-body">
                    <div className="v3-past-head">
                      <div className="v3-past-logo">
                        <RoleLogo src={role.logo} company={role.company} size={36} />
                      </div>
                      <div>
                        <h3>{role.company}</h3>
                        <p>{role.role}</p>
                      </div>
                      <div className="v3-past-when">
                        <span>{role.date}</span>
                        <em>{role.duration}</em>
                      </div>
                    </div>
                    <p className="v3-past-desc">{role.desc}</p>
                    <ul
                      className="v3-tag-list v3-tag-list--small"
                      aria-label={`${role.company} skills`}
                    >
                      {role.tags.map((tag) => (
                        <li key={tag}>{tag}</li>
                      ))}
                    </ul>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </div>
    </section>
  );
}
