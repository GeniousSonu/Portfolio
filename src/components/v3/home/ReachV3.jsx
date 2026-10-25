'use client';

import React, { useRef } from 'react';
import Link from 'next/link';
import ChapterHeader from '../ChapterHeader';
import Emoji3D from '../Emoji3D';
import { useChapterReveal } from '../motion';
import GlobeStage from './GlobeStage';

const REACH_FACTS = [
  ['Based in', 'Kolkata, West Bengal · India'],
  ['Timezone', 'IST · UTC+5:30'],
  ['Availability', 'Open to Work', 'live'],
  ['Work type', 'Remote · Hybrid · On-site'],
];

export default function ReachV3() {
  const rootRef = useRef(null);
  useChapterReveal(rootRef);

  return (
    <section
      id="global-reach"
      className="v3-chapter v3-reach"
      ref={rootRef}
      aria-labelledby="reach-title"
    >
      <div className="v3-shell">
        <ChapterHeader
          number="07"
          chapter="The Reach"
          title="Open for Opportunities Worldwide"
          subtitle="Based in Kolkata, India — working with teams, agencies, and clients globally."
          emoji="star"
          id="reach-title"
          aside={<Emoji3D name="compass" size={44} alt="" className="v3-head-emoji" />}
        />

        <div className="v3-reach-grid">
          <div className="v3-reach-copy" data-reveal>
            <p className="v3-reach-lede">
              A local practice with a global signal. I collaborate remotely with founders, agencies,
              and engineering teams across time zones — and I like a reasonable overlap of working
              hours.
            </p>

            <dl className="v3-reach-facts">
              {REACH_FACTS.map(([key, value, state]) => (
                <div className="v3-reach-fact" key={key}>
                  <dt>{key}</dt>
                  <dd className={state === 'live' ? 'is-live' : ''}>
                    {state === 'live' ? <span aria-hidden="true">● </span> : null}
                    {value}
                  </dd>
                </div>
              ))}
            </dl>

            <div className="v3-reach-actions">
              <Link href="/contact" className="v3-project-action" data-v3-sound="confirm">
                Start a conversation
                <span aria-hidden="true">→</span>
              </Link>
              <a
                href="https://www.linkedin.com/in/sksahinurislam/"
                target="_blank"
                rel="noopener noreferrer"
                className="v3-text-link"
                data-v3-sound="confirm"
              >
                LinkedIn <span aria-hidden="true">↗</span>
              </a>
            </div>
          </div>

          <div className="v3-reach-globe" data-reveal>
            <GlobeStage />
          </div>
        </div>
      </div>
    </section>
  );
}
