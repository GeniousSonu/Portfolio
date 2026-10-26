'use client';

import React, { useRef } from 'react';
import ChapterHeader from '../ChapterHeader';
import Emoji3D from '../Emoji3D';
import { useChapterReveal } from '../motion';
import { capabilities } from '@/components/Skills';

export default function SkillsV3() {
  const rootRef = useRef(null);
  useChapterReveal(rootRef);

  return (
    <section
      id="skills"
      className="v3-chapter v3-skills"
      ref={rootRef}
      aria-labelledby="skills-title"
    >
      <div className="v3-shell">
        <ChapterHeader
          number="05"
          chapter="The Craft"
          title={<>Stack &amp; Expertise</>}
          subtitle="Technologies I work with across web, infrastructure, AI, and security."
          emoji="brain"
          id="skills-title"
          aside={<Emoji3D name="sparkles" size={56} alt="" className="v3-head-emoji" />}
        />

        <div className="v3-skills-board">
          {capabilities.map((group, index) => (
            <div className="v3-skill-row" key={group.category} data-reveal>
              <div className="v3-skill-meta">
                <span className="v3-skill-index" aria-hidden="true">
                  {String(index + 1).padStart(2, '0')}
                </span>
                <h3 className="v3-skill-name">{group.category}</h3>
                <span className="v3-skill-count">{group.skills.length} tools</span>
              </div>
              <ul className="v3-skill-chips" aria-label={`${group.category} technologies`}>
                {group.skills.map((skill) => (
                  <li key={skill} className="v3-chip">
                    {skill}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="v3-skills-foot" data-reveal>
          <span className="v3-label">40 tools in active rotation</span>
          <span className="v3-shelf-rule" aria-hidden="true" />
          <span className="v3-label">Continuous practice</span>
        </div>
      </div>
    </section>
  );
}
