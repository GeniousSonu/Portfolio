'use client';

import React, { useEffect, useRef, useState } from 'react';
import { useSound } from './SoundProvider';

const CHAPTERS = [
  { id: 'hero', number: '01', label: 'Arrival' },
  { id: 'about', number: '02', label: 'The Person' },
  { id: 'experience', number: '03', label: 'The Practice' },
  { id: 'projects', number: '04', label: 'The Proof' },
  { id: 'skills', number: '05', label: 'The Craft' },
  { id: 'certifications', number: '06', label: 'The Credentials' },
  { id: 'global-reach', number: '07', label: 'The Reach' },
  { id: 'contact', number: '08', label: 'The Invitation' },
];

export default function ChapterRail() {
  const [active, setActive] = useState('hero');
  const progressRef = useRef(null);
  const topProgressRef = useRef(null);
  const { play } = useSound();

  useEffect(() => {
    const sections = CHAPTERS.map((chapter) => document.getElementById(chapter.id)).filter(Boolean);
    if (!sections.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);
        if (visible[0]) setActive(visible[0].target.id);
      },
      { rootMargin: '-42% 0px -48% 0px', threshold: [0, 0.2, 0.6] }
    );

    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    let frame = 0;
    let last = -1;

    const update = () => {
      frame = 0;
      const doc = document.documentElement;
      const max = doc.scrollHeight - window.innerHeight;
      const progress = max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0;
      const rounded = Math.round(progress * 1000) / 1000;
      if (rounded !== last) {
        if (progressRef.current) {
          progressRef.current.style.setProperty('--v3-progress', rounded);
        }
        if (topProgressRef.current) {
          topProgressRef.current.style.setProperty('--v3-progress', rounded);
        }
        last = rounded;
      }
    };

    const onScroll = () => {
      if (frame) return;
      frame = window.requestAnimationFrame(update);
    };

    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, []);

  const handleClick = (event, id) => {
    const target = document.getElementById(id);
    if (!target) return;
    event.preventDefault();
    play('chapter');
    const reduce =
      window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ||
      document.documentElement.classList.contains('reduce-motion');
    target.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' });
    if (window.history?.replaceState) {
      window.history.replaceState(null, '', id === 'hero' ? window.location.pathname : `#${id}`);
    }
  };

  return (
    <>
      <div className="v3-rail-top" aria-hidden="true">
        <span ref={topProgressRef} className="v3-rail-progress" />
      </div>

      <nav className="v3-rail" aria-label="Home chapters">
        <span className="v3-rail-track" aria-hidden="true">
          <span ref={progressRef} className="v3-rail-progress" />
        </span>
        <ol className="v3-rail-list">
          {CHAPTERS.map((chapter) => (
            <li key={chapter.id}>
              <a
                href={`#${chapter.id}`}
                className={`v3-rail-link ${active === chapter.id ? 'is-active' : ''}`}
                aria-current={active === chapter.id ? 'location' : undefined}
                onClick={(event) => handleClick(event, chapter.id)}
              >
                <span className="v3-rail-dot" aria-hidden="true" />
                <span className="v3-rail-num" aria-hidden="true">
                  {chapter.number}
                </span>
                <span className="v3-rail-label">{chapter.label}</span>
              </a>
            </li>
          ))}
        </ol>
      </nav>
    </>
  );
}
