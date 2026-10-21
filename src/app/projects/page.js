import React from 'react';
import Link from 'next/link';
import styles from './projects.module.css';

export const metadata = {
  title: 'Engineering Projects & Case Studies | SK Sahinur Islam',
  description: 'Selected works in IoT systems, distributed architectures, developer platforms, and high-fidelity product design.',
};

const PROJECTS = [
  {
    slug: 'iot-cold-chain-patent',
    title: 'Solar IoT Vaccine Cold-Chain Preservation System',
    isPatent: true,
    featured: true,
    year: '2025',
    category: 'Patented IoT Hardware',
    patentNumber: 'Patent #202531060002 A',
    desc: 'Off-grid cold chain monitoring architecture engineered for rural immunization logistics. Eliminates fragile RFID setups using direct ESP8266 telemetry, dual DS18B20 calibration, and zone-wise Peltier thermoelectric regulation with zero grid power dependency.',
    stack: ['ESP8266', 'MQTT Broker', 'C++', 'Solar PV', 'Python', 'DS18B20', 'Peltier Cells'],
    metrics: [
      { val: '40%', label: 'Power Reduction' },
      { val: '99.7%', label: 'Telemetry Uptime' },
      { val: 'PATENTED', label: 'Granted Jul 2025' }
    ],
    internalLink: '/projects/iot-cold-chain-patent',
    externalLink: 'https://drive.google.com/drive/folders/1SXCzHl1WOz646EWjiQHYuhG6BGNPTMfJ?usp=sharing',
    linkLabel: 'Read Full Blueprint Case Study'
  },
  {
    slug: 'genioussonu-site-checkup',
    title: 'GeniousSonu Site Checkup — WordPress Audit Suite',
    featured: false,
    year: '2024',
    category: 'WordPress Enterprise Plugin',
    desc: 'Production-ready diagnostics and observability suite for WordPress environments. Inspects SSL cipher suites, database indexes, file permissions, and core vulnerability vectors with zero external cloud dependencies.',
    stack: ['PHP 8.2', 'WordPress APIs', 'Vanilla JS', 'REST API', 'MySQL'],
    metrics: [
      { val: '24+', label: 'Audit Probes' },
      { val: '<15ms', label: 'Check Overhead' },
      { val: 'v1.0.0', label: 'Release' }
    ],
    internalLink: '/plugin/genioussonu-site-checkup',
    externalLink: 'https://github.com/GeniousSonu',
    linkLabel: 'View Plugin Hub'
  },
  {
    slug: 'wefik-platform',
    title: 'WEFIK Digital Platform & Agency Hub',
    featured: false,
    year: '2021',
    category: 'Agency Infrastructure',
    desc: 'Co-founded agency operations engine handling distributed project deliverables, client portals, real-time milestone dispatching, and secure billing workflows across multinational client engagements.',
    stack: ['React', 'Node.js', 'MongoDB', 'Socket.io', 'Redis', 'AWS S3'],
    metrics: [
      { val: '5+', label: 'Global Regions' },
      { val: '30+', label: 'Shipped Systems' }
    ],
    internalLink: '/wefik',
    externalLink: 'https://github.com/GeniousSonu',
    linkLabel: 'Explore Agency Portal'
  },
  {
    slug: 'learnai',
    title: 'LearnAI — Adaptive Tutoring Engine',
    featured: false,
    year: '2024',
    category: 'AI / Machine Learning',
    desc: 'Adaptive learning system that constructs real-time student knowledge graphs, predicts misconception boundaries, and serves calibrated curriculum micro-modules via Python ML pipelines.',
    stack: ['React', 'FastAPI', 'Python', 'scikit-learn', 'MongoDB', 'OpenAI'],
    metrics: [
      { val: '87%', label: 'Prediction Acc' },
      { val: '3.2×', label: 'Student Retention' }
    ],
    externalLink: 'https://github.com/GeniousSonu/LearnAI',
    linkLabel: 'View GitHub Repository'
  },
  {
    slug: 'portfolio-v4',
    title: 'Personal Portfolio v4 — Gatsby Architecture',
    featured: false,
    year: '2024',
    category: 'Web Platform',
    desc: 'Fourth iteration of personal web platform engineered on Gatsby, GraphQL schema stitching, and MDX compilation. Achieved perfect 100/100 across all four Core Web Vitals audit criteria.',
    stack: ['Gatsby', 'React', 'GraphQL', 'GSAP', 'MDX', 'Tailwind'],
    metrics: [
      { val: '100', label: 'Lighthouse' },
      { val: '0ms', label: 'CLS' }
    ],
    externalLink: 'https://github.com/GeniousSonu/v4',
    linkLabel: 'View GitHub Repository'
  },
  {
    slug: 'stay-booking',
    title: 'STAY — High-Throughput Hotel Engine',
    featured: false,
    year: '2024',
    category: 'Full Stack App',
    desc: 'Comprehensive hospitality reservation portal with concurrency-safe booking calendars, payment gateway verification, and role-based staff administrative controls.',
    stack: ['Node.js', 'Express', 'MongoDB', 'JavaScript', 'REST'],
    metrics: [
      { val: '99.9%', label: 'Uptime' },
      { val: '150+', label: 'Bookings/mo' }
    ],
    externalLink: 'https://github.com/GeniousSonu/stay',
    linkLabel: 'View GitHub Repository'
  }
];

export default function ProjectsPage() {
  return (
    <main className={styles.pageContainer}>
      <div className={styles.ambientGlow} aria-hidden="true" />
      <div className={styles.inner}>
        <header className={styles.header}>
          <div className={styles.badge}>
            <span className={styles.badgeDot} aria-hidden="true" />
            Engineering Dossier
          </div>
          <h1 className={styles.title}>Projects & Inventions</h1>
          <p className={styles.lead}>
            A curated record of production distributed systems, IoT hardware inventions, open-source tooling, and client platforms.
          </p>
        </header>

        <div className={styles.grid}>
          {PROJECTS.map((proj) => (
            <article
              key={proj.slug}
              className={`${styles.card} ${proj.featured ? styles.cardFeatured : ''}`}
            >
              <div className={styles.cardTop}>
                <div className={styles.cardMeta}>
                  <span className={styles.cardTag}>{proj.category}</span>
                  <span>{proj.year}</span>
                </div>
                <h2 className={styles.cardTitle}>{proj.title}</h2>
                <p className={styles.cardDesc}>{proj.desc}</p>
                <div className={styles.techStack}>
                  {proj.stack.map((tech) => (
                    <span key={tech} className={styles.techBadge}>{tech}</span>
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
                  {proj.internalLink ? (
                    <Link href={proj.internalLink} className={styles.primaryBtn}>
                      {proj.linkLabel} →
                    </Link>
                  ) : null}
                  {proj.externalLink ? (
                    <a
                      href={proj.externalLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={proj.internalLink ? styles.secondaryBtn : styles.primaryBtn}
                    >
                      {proj.internalLink ? 'Source / Docs ↗' : `${proj.linkLabel} ↗`}
                    </a>
                  ) : null}
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </main>
  );
}
