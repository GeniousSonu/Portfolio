"use client";
import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

const capabilities = [
  { category: 'Frontend', skills: ['React', 'Next.js', 'TypeScript', 'JavaScript', 'HTML', 'CSS', 'Tailwind CSS', 'GSAP'] },
  { category: 'Backend', skills: ['Node.js', 'Express', 'Laravel', 'PHP', 'Python', 'Java', 'REST APIs', 'GraphQL'] },
  { category: 'Infrastructure', skills: ['Linux', 'Docker', 'Nginx', 'Apache', 'AWS', 'Git', 'GitHub Actions', 'Bash'] },
  { category: 'AI / ML', skills: ['OpenAI API', 'scikit-learn', 'TensorFlow', 'NumPy', 'Pandas', 'Machine Learning'] },
  { category: 'Databases', skills: ['MongoDB', 'PostgreSQL', 'MySQL', 'Redis', 'Firebase'] },
  { category: 'Security', skills: ['OWASP Top 10', 'Penetration Testing', 'Network Security', 'FortiGate', 'Web Security'] },
];

export default function Skills() {
  const containerRef = useRef(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const revealElements = containerRef.current?.querySelectorAll('.reveal') || [];
    const triggers = Array.from(revealElements, (element) => gsap.fromTo(
      element,
      { opacity: 0, y: 24 },
      {
        opacity: 1,
        y: 0,
        duration: 0.7,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: element,
          start: 'top 85%',
          toggleActions: 'play none none none',
        },
      },
    ));

    const grid = containerRef.current?.querySelector('.skills-grid');
    if (grid) {
      triggers.push(gsap.fromTo(
        grid.querySelectorAll('.stagger-child'),
        { opacity: 0, y: 20 },
        {
          opacity: 1,
          y: 0,
          duration: 0.55,
          stagger: 0.08,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: grid,
            start: 'top 80%',
            toggleActions: 'play none none none',
          },
        },
      ));
    }

    return () => {
      triggers.forEach((trigger) => {
        trigger.scrollTrigger?.kill();
        trigger.kill();
      });
    };
  }, []);

  return (
    <section id="skills" className="section" ref={containerRef}>
      <div className="site-container">
        <header className="skills-heading reveal">
          <h2 className="section-title">Stack &amp; Expertise</h2>
          <p className="section-subtitle">
            Technologies I work with across web, infrastructure, AI, and security.
          </p>
        </header>

        <div className="skills-grid" aria-label="Technical capabilities">
          {capabilities.map(({ category, skills }) => {
            const headingId = `skills-${category.replace(/[^a-z0-9]/gi, '-').toLowerCase()}`;

            return (
              <section className="skills-category stagger-child" key={category} aria-labelledby={headingId}>
                <h3 className="skills-category-title" id={headingId}>{category}</h3>
                <ul className="skills-tags">
                  {skills.map((skill) => <li className="skills-tag" key={skill}>{skill}</li>)}
                </ul>
              </section>
            );
          })}
        </div>
      </div>
    </section>
  );
}
