import React from 'react';
import Link from 'next/link';
import { PROJECTS } from '@/data/projects';
import styles from './projects.module.css';

export const metadata = {
  title: 'Engineering Projects & Case Studies | SK Sahinur Islam',
  description:
    'Selected works in IoT systems, distributed architectures, developer platforms, and high-fidelity product design.',
};

export default function ProjectsPage() {
  const patent = PROJECTS.find((project) => project.isPatent);
  const ordered = patent ? [patent, ...PROJECTS.filter((project) => project !== patent)] : PROJECTS;

  return (
    <main className={styles.pageContainer} data-route="/projects">
        <div className={styles.ambientGlow} aria-hidden="true" />
        <div className={styles.inner}>
          <header className={styles.header}>
            <div className={styles.badge}>
              <span className={styles.badgeDot} aria-hidden="true" />
              Engineering Dossier
            </div>
            <h1 className={styles.title}>Projects & Inventions</h1>
            <p className={styles.lead}>
              A curated record of production distributed systems, IoT hardware inventions,
              open-source tooling, and client platforms.
            </p>
          </header>

          <div className={styles.grid}>
            {ordered.map((proj) => {
              const isInternal = proj.link.startsWith('/');
              return (
                <article
                  key={proj.slug}
                  className={`${styles.card} ${proj.isPatent ? styles.cardFeatured : ''}`}
                >
                  <div className={styles.cardTop}>
                    <div className={styles.cardMeta}>
                      <span className={styles.cardTag}>{proj.category}</span>
                      {proj.isPatent ? <span>IN 544062</span> : null}
                    </div>
                    <h2 className={styles.cardTitle}>{proj.title}</h2>
                    <p className={styles.cardDesc}>{proj.desc}</p>
                    <div className={styles.techStack}>
                      {proj.stack.map((tech) => (
                        <span key={tech} className={styles.techBadge}>
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div>
                    <div className={styles.metricsRow}>
                      {proj.metrics.map((m) => (
                        <div key={m.label}>
                          <div className={styles.metricVal}>{m.val}</div>
                          <div className={styles.metricLbl}>{m.label}</div>
                        </div>
                      ))}
                    </div>

                    <div className={styles.actions}>
                      {proj.caseStudy ? (
                        <Link href={proj.caseStudy} className={styles.primaryBtn}>
                          Read Full Blueprint Case Study →
                        </Link>
                      ) : null}
                      {isInternal ? (
                        <Link
                          href={proj.link}
                          className={proj.caseStudy ? styles.secondaryBtn : styles.primaryBtn}
                        >
                          {proj.btnText} →
                        </Link>
                      ) : (
                        <a
                          href={proj.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={proj.caseStudy ? styles.secondaryBtn : styles.primaryBtn}
                        >
                          {proj.btnText} ↗
                        </a>
                      )}
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </main>
  );
}
