import React from 'react';
import Link from 'next/link';
import { PageShell, PageHeader, Container, Section } from '@/components/layout';
import { buildMetadata } from '@/lib/seo';
import styles from './wefik.module.css';

export const metadata = buildMetadata({
  title: 'WEFIK — Agency Co-Founder & Technical Leadership',
  description:
    'Venture showcase of WEFIK (Web Era for Innovation & Knowledge), co-founded by SK Sahinur Islam. Exploring backend architecture, 30+ client platform deliveries, and cloud operations.',
  path: '/wefik',
});

const CASE_STUDIES = [
  {
    title: 'Enterprise Document QA & Pipeline',
    category: 'Fintech / Legal',
    desc: 'High-speed document parsing and QA automation pipeline processing multi-megabyte PDF and architectural documents with automated format verification.',
    stack: ['Node.js', 'Python', 'AWS S3', 'PostgreSQL'],
  },
  {
    title: 'High-Volume E-Commerce Platform',
    category: 'Retail & Commerce',
    desc: 'Custom headless storefront delivering sub-100ms product catalog lookups, real-time stock sync, and multi-currency Stripe checkout.',
    stack: ['Next.js', 'Laravel', 'Redis', 'Stripe'],
  },
  {
    title: 'Real-Time Fleet & Cold-Chain IoT Dashboard',
    category: 'Hardware & IoT',
    desc: 'Live telemetry ingestion engine aggregating temperature probes, GPS coordinates, and vehicle health metrics over WebSocket channels.',
    stack: ['Node.js', 'MQTT', 'Docker', 'WebSockets'],
  },
];

export default function WefikPage() {
  return (
    <PageShell>
      <PageHeader
        eyebrow="[ VENTURE DOSSIER · CO-FOUNDER ]"
        title="WEFIK — Web Era for Innovation & Knowledge"
        summary="Co-founded in March 2021 as a high-velocity engineering agency. Delivering resilient cloud architectures, scalable web applications, and mission-critical software for global clients."
      />

      <Section className={styles.wrapper}>
        <Container>
          {/* Key Metrics */}
          <div className={styles.metricsBar}>
            <div className={styles.metricCard}>
              <div className={styles.metricValue}>30+</div>
              <div className={styles.metricLabel}>Client Systems Delivered</div>
            </div>
            <div className={styles.metricCard}>
              <div className={styles.metricValue}>2021</div>
              <div className={styles.metricLabel}>Founded in Kolkata</div>
            </div>
            <div className={styles.metricCard}>
              <div className={styles.metricValue}>5+</div>
              <div className={styles.metricLabel}>Countries Served</div>
            </div>
            <div className={styles.metricCard}>
              <div className={styles.metricValue}>99.9%</div>
              <div className={styles.metricLabel}>Production Uptime SLA</div>
            </div>
          </div>

          {/* Agency Story & Technical Role */}
          <div className={styles.sectionBlock}>
            <span className={styles.blockTag}>Agency Operations &amp; Doctrine</span>
            <h2 className={styles.blockTitle}>Engineering Reliable Systems for Fast-Growing Companies</h2>
            <div className={styles.blockText}>
              <p>
                Founded in March 2021, WEFIK (Web Era for Innovation &amp; Knowledge) was born with a singular focus:
                delivering software engineering that combines modern design aesthetics with battle-hardened backend stability.
              </p>
              <p>
                As <strong>Co-Founder &amp; Principal Systems Architect</strong>, I oversaw the entire software development lifecycle,
                establishing company-wide engineering standards: automated CI/CD pipelines, strict code reviews, isolated staging environments,
                and zero-downtime server migrations across AWS, Google Cloud, and dedicated Linux VPS tiers.
              </p>
              <p>
                Over three years of rapid growth, WEFIK partnered with organizations across North America, Europe, and India,
                building mission-critical portals, customer-facing applications, and automated workflow integrations.
              </p>
            </div>
          </div>

          {/* Featured Case Deliveries */}
          <div className={styles.sectionBlock}>
            <span className={styles.blockTag}>Selected Deliverables</span>
            <h2 className={styles.blockTitle}>Key Client Implementations</h2>
            <div className={styles.caseGrid}>
              {CASE_STUDIES.map((c) => (
                <div key={c.title} className={styles.caseCard}>
                  <div className={styles.caseHeader}>
                    <span className={styles.caseBadge}>{c.category}</span>
                  </div>
                  <h3 className={styles.caseTitle}>{c.title}</h3>
                  <p className={styles.caseDesc}>{c.desc}</p>
                  <div className={styles.caseStack}>
                    {c.stack.map((s) => (
                      <span key={s} className={styles.stackPill}>
                        {s}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Consultation CTA */}
          <div className={styles.ctaBox}>
            <h2 className={styles.ctaTitle}>Have a Product Challenge or Engineering Need?</h2>
            <p className={styles.ctaDesc}>
              Whether you need scalable cloud architectures, high-performance Next.js frontends, or robust API backends,
              let&apos;s discuss how we can engineer your next milestone.
            </p>
            <Link href="/contact" className="btn btn-gold">
              Initiate Direct Discussion →
            </Link>
          </div>
        </Container>
      </Section>
    </PageShell>
  );
}
