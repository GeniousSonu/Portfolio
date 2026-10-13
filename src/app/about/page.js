import React from 'react';
import Link from 'next/link';
import { PageShell, PageHeader, Container, Section } from '@/components/layout';
import { buildMetadata } from '@/lib/seo';
import styles from './about.module.css';

export const metadata = buildMetadata({
  title: 'About — Operator Biography & Systems Engineering Dossier',
  description:
    'Full biography, patent achievements in IoT cold-chain preservation, technical leadership at Ib Arts and WEFIK, and systems engineering philosophy of SK Sahinur Islam (Genious Sonu).',
  path: '/about',
});

export default function AboutPage() {
  return (
    <PageShell>
      <PageHeader
        eyebrow="[ OPERATOR DOSSIER · SPEC 01 ]"
        title="Engineering at the edge of systems, code & infrastructure."
        summary="Senior Web Application Developer & IT Specialist based in Kolkata, India. Bridging high-concurrency backend services, Linux infrastructure, patent-granted IoT hardware, and client-centric product execution."
      />

      <Section className={styles.wrapper}>
        <Container>
          <div className={styles.dossierGrid}>
            {/* Sidebar Telemetry Card */}
            <aside className={styles.telemetryCard}>
              <div className={styles.telemetryHeader}>
                <span className={styles.telemetryTitle}>Telemetry Dossier</span>
                <span className={styles.statusDot} aria-hidden="true" />
              </div>

              <div className={styles.telemetryRows}>
                <div className={styles.telemetryRow}>
                  <span className={styles.telemetryLabel}>Call Sign</span>
                  <span className={`${styles.telemetryValue} ${styles.badgeHighlight}`}>Genious Sonu</span>
                </div>
                <div className={styles.telemetryRow}>
                  <span className={styles.telemetryLabel}>Legal Identity</span>
                  <span className={styles.telemetryValue}>SK Sahinur Islam</span>
                </div>
                <div className={styles.telemetryRow}>
                  <span className={styles.telemetryLabel}>Location</span>
                  <span className={styles.telemetryValue}>Kolkata, WB, India</span>
                </div>
                <div className={styles.telemetryRow}>
                  <span className={styles.telemetryLabel}>Timezone</span>
                  <span className={styles.telemetryValue}>IST (UTC+5:30)</span>
                </div>
                <div className={styles.telemetryRow}>
                  <span className={styles.telemetryLabel}>Primary Role</span>
                  <span className={styles.telemetryValue}>Senior Web Dev</span>
                </div>
                <div className={styles.telemetryRow}>
                  <span className={styles.telemetryLabel}>Organization</span>
                  <span className={styles.telemetryValue}>Ib Arts</span>
                </div>
                <div className={styles.telemetryRow}>
                  <span className={styles.telemetryLabel}>Ventures</span>
                  <span className={styles.telemetryValue}>WEFIK (Co-Founder)</span>
                </div>
                <div className={styles.telemetryRow}>
                  <span className={styles.telemetryLabel}>Degree</span>
                  <span className={styles.telemetryValue}>B.Tech IT (8.17 CGPA)</span>
                </div>
                <div className={styles.telemetryRow}>
                  <span className={styles.telemetryLabel}>Patent Status</span>
                  <span className={`${styles.telemetryValue} ${styles.badgeHighlight}`}>Granted (2025)</span>
                </div>
                <div className={styles.telemetryRow}>
                  <span className={styles.telemetryLabel}>Credentials</span>
                  <span className={styles.telemetryValue}>30+ Verified</span>
                </div>
              </div>

              <div className={styles.linksList}>
                <a
                  href="https://www.linkedin.com/in/sksahinurislam/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.operatorLink}
                >
                  <span>LinkedIn Profile</span>
                  <span>↗</span>
                </a>
                <a
                  href="https://github.com/GeniousSonu"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.operatorLink}
                >
                  <span>GitHub Repository</span>
                  <span>↗</span>
                </a>
                <a
                  href="https://www.upwork.com/freelancers/~0104912246c7c7bdbf"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.operatorLink}
                >
                  <span>Upwork Top Rated</span>
                  <span>↗</span>
                </a>
                <Link href="/contact" className={styles.operatorLink}>
                  <span>Transmit Direct Message</span>
                  <span>→</span>
                </Link>
              </div>
            </aside>

            {/* Main Narrative Chapters */}
            <div className={styles.narrative}>
              {/* Chapter 1: Background & Leadership */}
              <article className={styles.chapterBlock}>
                <span className={styles.chapterTag}>Chapter 01 · Trajectory</span>
                <h2 className={styles.chapterTitle}>From Systems Foundations to Production Leadership</h2>
                <div className={styles.chapterContent}>
                  <p>
                    I hold a Bachelor of Technology in Information Technology from Guru Nanak Institute of Technology
                    (CGPA: 8.17), where my engineering journey took root in low-level systems programming, networking
                    protocols, and operating systems fundamentals.
                  </p>
                  <p>
                    Today, I serve as <strong>Senior Web Application Developer at Ib Arts</strong>, leading backend
                    architecture, API scalability, and cloud deployments. My day-to-day work centers on architecting
                    resilient Next.js frontends, microservices with Node.js and Laravel, complex database schemas
                    across PostgreSQL and MongoDB, and Linux server hardening for high-throughput client platforms.
                  </p>
                  <p>
                    In March 2021, I co-founded <strong>WEFIK (Web Era for Innovation &amp; Knowledge)</strong>, a digital
                    technology agency. As Technical Co-Founder, I spearheaded technical delivery for 30+ international
                    client projects, directing architecture choices, security reviews, and edge deployments across five
                    countries.
                  </p>
                </div>
              </article>

              {/* Chapter 2: The Patent */}
              <article className={styles.chapterBlock}>
                <span className={styles.chapterTag}>Chapter 02 · Invention</span>
                <h2 className={styles.chapterTitle}>IoT Real-Time Solar Vaccine Preservation System</h2>
                <div className={styles.chapterContent}>
                  <p>
                    In 2025, I was officially granted an engineering patent for an autonomous, solar-powered cold-chain
                    temperature monitoring and preservation apparatus designed specifically for off-grid rural healthcare
                    logistics.
                  </p>

                  <div className={styles.patentBox}>
                    <div className={styles.patentHeader}>
                      <span>◈</span>
                      <span>PATENT AWARD SPECIFICATION</span>
                    </div>
                    <div className={styles.patentBody}>
                      <strong>Title:</strong> Real-Time Solar Powered IoT Cold-Chain Vaccine Monitoring &amp; Storage System<br />
                      <strong>Hardware Stack:</strong> NodeMCU ESP8266, DHT22 sensors, thermoelectric Peltier semiconductor modules, solar MPPT charge controllers.<br />
                      <strong>Telemetry Protocol:</strong> MQTT over TLS with real-time breach alerts and persistent telemetry logs.
                    </div>
                  </div>

                  <p style={{ marginTop: '1rem' }}>
                    The device guarantees strict 2°C to 8°C temperature window preservation without reliance on unstable local
                    power grids, solving critical last-mile vaccine viability losses in developing regions.
                  </p>
                </div>
              </article>

              {/* Chapter 3: Engineering Philosophy */}
              <article className={styles.chapterBlock}>
                <span className={styles.chapterTag}>Chapter 03 · Doctrine</span>
                <h2 className={styles.chapterTitle}>Systems Philosophy: The Handshake of System &amp; Human</h2>
                <div className={styles.chapterContent}>
                  <p>
                    My architectural worldview rests on four non-negotiable principles:
                  </p>
                  <p>
                    <strong>1. Defensive Architecture by Default:</strong> Every external boundary is untrusted. Public
                    mutation endpoints MUST enforce rate-limiting, honeypots, schema validation, and cryptographic salts.
                  </p>
                  <p>
                    <strong>2. Zero-Stale Observability:</strong> If a system cannot be inspected or traced in real time,
                    it is not production-ready. Telemetry, latency probes, and structured error reporting must precede feature bloat.
                  </p>
                  <p>
                    <strong>3. Fast is a Design Property:</strong> Animations that stutter, payloads that bloat LCP, or
                    unoptimized fonts that flash are technical debt. Performance is respect for the visitor&apos;s device and attention.
                  </p>
                  <p>
                    <strong>4. Human Empathy in Interface Craft:</strong> Precision machines exist to empower people. Behind
                    every monospaced telemetry stream is an operator focused on clarity, craft, and usefulness.
                  </p>
                </div>
              </article>

              {/* Chapter 4: Verified Certifications */}
              <article className={styles.chapterBlock}>
                <span className={styles.chapterTag}>Chapter 04 · Credentials</span>
                <h2 className={styles.chapterTitle}>Continuous Mastery &amp; Industry Verification</h2>
                <div className={styles.chapterContent}>
                  <p>
                    I actively benchmark my skills against industry certifications and competitive security ranges:
                  </p>
                  <div className={styles.certPills}>
                    <span className={styles.certPill}>CompTIA Security Principles</span>
                    <span className={styles.certPill}>IBM Cybersecurity Analyst</span>
                    <span className={styles.certPill}>TryHackMe Top 10% Global Rank</span>
                    <span className={styles.certPill}>Linux Foundation System Administration</span>
                    <span className={styles.certPill}>Coursera Full-Stack Engineering</span>
                    <span className={styles.certPill}>Udemy Advanced Microservices Architecture</span>
                    <span className={styles.certPill}>PostgreSQL Database Administration</span>
                    <span className={styles.certPill}>Modern Web Security &amp; OWASP Top 10</span>
                  </div>
                </div>
              </article>
            </div>
          </div>
        </Container>
      </Section>
    </PageShell>
  );
}
