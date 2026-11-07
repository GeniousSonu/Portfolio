import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { PageShell, PageHeader, Container, Section } from '@/components/layout';
import { buildMetadata } from '@/lib/seo';
import styles from './about.module.css';

export const metadata = buildMetadata({
  title: 'About — SK Sahinur Islam',
  description:
    'Background, patent work in IoT cold-chain preservation, and engineering background of SK Sahinur Islam (Genious Sonu), Senior Web Application Developer.',
  path: '/about',
});

export default function AboutPage() {
  return (
    <PageShell dataRoute="/about">
      <PageHeader
        eyebrow="About"
        title="Engineering reliable backends, networks, and distributed systems."
        summary="Senior Web Application Developer based in Kolkata, India. Focused on backend architecture, Linux server infrastructure, IoT systems, and clean web applications."
      />

      <Section className={styles.wrapper}>
        <Container>
          <div className={styles.dossierGrid}>
            {/* Sidebar Quick Facts Card */}
            <aside className={styles.quickFactsCard} aria-label="Quick facts">
              <div className={styles.profileHeader}>
                <div className={styles.avatarWrap}>
                  <Image
                    src="/assets/owner/avatar.webp"
                    alt="SK Sahinur Islam"
                    width={88}
                    height={88}
                    className={styles.avatarImg}
                    priority
                  />
                </div>
                <div className={styles.profileMeta}>
                  <h2 className={styles.ownerName}>SK Sahinur Islam</h2>
                  <p className={styles.ownerRole}>Senior Web Application Developer at Ib Arts</p>
                </div>
              </div>

              <dl className={styles.factsList}>
                <div className={styles.factItem}>
                  <dt className={styles.factLabel}>Role</dt>
                  <dd className={styles.factValue}>Senior Web Application Developer</dd>
                </div>
                <div className={styles.factItem}>
                  <dt className={styles.factLabel}>Company</dt>
                  <dd className={styles.factValue}>Ib Arts</dd>
                </div>
                <div className={styles.factItem}>
                  <dt className={styles.factLabel}>Co-founder</dt>
                  <dd className={styles.factValue}>WEFIK (since Mar 2021)</dd>
                </div>
                <div className={styles.factItem}>
                  <dt className={styles.factLabel}>Education</dt>
                  <dd className={styles.factValue}>B.Tech IT, GNIT (8.17 CGPA)</dd>
                </div>
                <div className={styles.factItem}>
                  <dt className={styles.factLabel}>Patent</dt>
                  <dd className={styles.factValue}>Granted 2025 (IoT Cold-Chain)</dd>
                </div>
                <div className={styles.factItem}>
                  <dt className={styles.factLabel}>Credentials</dt>
                  <dd className={styles.factValue}>
                    <a href="#certifications" className={styles.inlineCertLink}>
                      30+ verified
                    </a>
                  </dd>
                </div>
                <div className={styles.factItem}>
                  <dt className={styles.factLabel}>Based in</dt>
                  <dd className={styles.factValue}>Kolkata, India</dd>
                </div>
              </dl>

              <div className={styles.linksGroup}>
                <a
                  href="https://www.linkedin.com/in/sksahinurislam/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.actionBtn}
                  data-sound="click"
                  data-haptic="light"
                  aria-label="LinkedIn profile (opens in new tab)"
                >
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                  >
                    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
                    <rect x="2" y="9" width="4" height="12" />
                    <circle cx="4" cy="4" r="2" />
                  </svg>
                  <span>LinkedIn</span>
                  <span className={styles.externalArrow} aria-hidden="true">
                    ↗
                  </span>
                </a>

                <a
                  href="https://github.com/GeniousSonu"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.actionBtn}
                  data-sound="click"
                  data-haptic="light"
                  aria-label="GitHub profile (opens in new tab)"
                >
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                  >
                    <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" />
                  </svg>
                  <span>GitHub</span>
                  <span className={styles.externalArrow} aria-hidden="true">
                    ↗
                  </span>
                </a>

                <a
                  href="https://www.upwork.com/freelancers/~0104912246c7c7bdbf"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.actionBtn}
                  data-sound="click"
                  data-haptic="light"
                  aria-label="Upwork profile (opens in new tab)"
                >
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                  >
                    <circle cx="12" cy="12" r="10" />
                    <path d="M12 6v6l4 2" />
                  </svg>
                  <span>Upwork Top Rated</span>
                  <span className={styles.externalArrow} aria-hidden="true">
                    ↗
                  </span>
                </a>

                <Link
                  href="/contact"
                  className={styles.primaryContactBtn}
                  data-sound="click"
                  data-haptic="medium"
                >
                  <span>Send me a message</span>
                  <span aria-hidden="true">→</span>
                </Link>
              </div>
            </aside>

            {/* Main Narrative Sections */}
            <div className={styles.narrative}>
              {/* Background */}
              <article className={styles.sectionCard}>
                <span className={styles.sectionCategory}>Background</span>
                <h2 className={styles.sectionTitle}>
                  Backend architecture and systems development
                </h2>
                <div className={styles.sectionBody}>
                  <p>
                    I graduated with a Bachelor of Technology in Information Technology from Guru
                    Nanak Institute of Technology (CGPA 8.17), focusing on networking protocols,
                    operating systems, and distributed backend architectures.
                  </p>
                  <p>
                    Currently, I work as{' '}
                    <strong>Senior Web Application Developer at Ib Arts</strong>, where I lead
                    backend architecture, API scalability, and cloud deployments. My daily
                    responsibilities center on architecting Next.js applications, building
                    microservices with Node.js and Laravel, managing PostgreSQL and MongoDB
                    databases, and hardening Linux servers for production traffic.
                  </p>
                  <p>
                    In March 2021, I co-founded{' '}
                    <strong>WEFIK (Web Era for Innovation &amp; Knowledge)</strong>, a digital
                    technology agency. As Technical Co-Founder, I managed technical delivery for 30+
                    international client projects across five countries, directing architecture
                    decisions, security audits, and deployments.
                  </p>
                </div>
              </article>

              {/* Patent */}
              <article className={styles.sectionCard}>
                <span className={styles.sectionCategory}>Patent</span>
                <h2 className={styles.sectionTitle}>Solar-powered cold-chain monitoring system</h2>
                <div className={styles.sectionBody}>
                  <p>
                    In 2025, I was granted a patent for an autonomous solar-powered temperature
                    monitoring and storage system designed for vaccine preservation in off-grid and
                    rural areas.
                  </p>

                  <div className={styles.patentInfoCard}>
                    <div className={styles.patentCardHeader}>
                      <span className={styles.patentBadge}>Patent No. 544062 · Granted 2025</span>
                    </div>
                    <dl className={styles.patentDetails}>
                      <div className={styles.patentDetailRow}>
                        <dt>Title</dt>
                        <dd>
                          Real-Time Solar Powered IoT Cold-Chain Vaccine Monitoring &amp; Storage
                          System
                        </dd>
                      </div>
                      <div className={styles.patentDetailRow}>
                        <dt>What it does</dt>
                        <dd>
                          Maintains a strict 2°C to 8°C temperature range without relying on an
                          unstable local grid.
                        </dd>
                      </div>
                      <div className={styles.patentDetailRow}>
                        <dt>Hardware</dt>
                        <dd>
                          NodeMCU ESP8266, DHT22 sensors, thermoelectric Peltier modules, solar MPPT
                          charge controller.
                        </dd>
                      </div>
                      <div className={styles.patentDetailRow}>
                        <dt>Data transfer</dt>
                        <dd>
                          MQTT over TLS with automated breach alerts and persistent telemetry logs.
                        </dd>
                      </div>
                    </dl>
                  </div>
                </div>
              </article>

              {/* Engineering Approach */}
              <article className={styles.sectionCard}>
                <span className={styles.sectionCategory}>Engineering approach</span>
                <h2 className={styles.sectionTitle}>Core engineering principles</h2>
                <div className={styles.sectionBody}>
                  <p>
                    <strong>Defensive by default:</strong> Every external endpoint is treated as
                    untrusted. Public mutation endpoints enforce rate-limiting, schema validation,
                    and input sanitization.
                  </p>
                  <p>
                    <strong>Reliable observability:</strong> If a service cannot be inspected or
                    traced, it is not ready for production. Structured error logging, uptime
                    monitoring, and latency metrics come before feature additions.
                  </p>
                  <p>
                    <strong>Performance is a feature:</strong> Bloated bundles, unoptimized assets,
                    and layout shifts waste bandwidth and user time. Keep dependencies minimal and
                    measure real loading performance.
                  </p>
                  <p>
                    <strong>Straightforward systems:</strong> Simple, well-documented architectures
                    survive production incidents far better than clever, over-engineered
                    abstractions.
                  </p>
                </div>
              </article>

              {/* Certifications */}
              <article id="certifications" className={styles.sectionCard}>
                <span className={styles.sectionCategory}>Certifications</span>
                <h2 className={styles.sectionTitle}>
                  Verified credentials and continuous learning
                </h2>
                <div className={styles.sectionBody}>
                  <p>
                    I maintain practical knowledge through industry certifications and technical
                    security assessments:
                  </p>
                  <div className={styles.certPills}>
                    <span className={styles.certPill}>CompTIA Security Principles</span>
                    <span className={styles.certPill}>IBM Cybersecurity Analyst</span>
                    <span className={styles.certPill}>TryHackMe Top 10% Global Rank</span>
                    <span className={styles.certPill}>Linux Foundation System Administration</span>
                    <span className={styles.certPill}>Full-Stack Web Development</span>
                    <span className={styles.certPill}>Microservices Architecture</span>
                    <span className={styles.certPill}>PostgreSQL Database Administration</span>
                    <span className={styles.certPill}>OWASP Top 10 Security Practices</span>
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
