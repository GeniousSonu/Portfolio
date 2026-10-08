import React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { PLUGIN_CONFIG, ALL_PLUGINS } from '@/config/plugin';
import styles from '../plugin.module.css';

export async function generateStaticParams() {
  return ALL_PLUGINS.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  if (slug !== PLUGIN_CONFIG.slug) return {};

  const title = `${PLUGIN_CONFIG.name} — WordPress Security Audit & Hardening`;
  const description = PLUGIN_CONFIG.tagline;
  const canonicalUrl = `https://www.genioussonu.me/plugin/${PLUGIN_CONFIG.slug}`;

  return {
    title,
    description,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title,
      description,
      url: canonicalUrl,
      siteName: 'SK Sahinur Islam Portfolio',
      type: 'article',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
    },
  };
}

export default async function PluginLandingPage({ params }) {
  const { slug } = await params;
  if (slug !== PLUGIN_CONFIG.slug) {
    notFound();
  }

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: PLUGIN_CONFIG.name,
    operatingSystem: 'WordPress 5.8+',
    applicationCategory: 'SecurityApplication',
    softwareVersion: PLUGIN_CONFIG.version,
    description: PLUGIN_CONFIG.tagline,
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD',
    },
    author: {
      '@type': 'Person',
      name: PLUGIN_CONFIG.author,
      url: PLUGIN_CONFIG.authorUrl,
      sameAs: PLUGIN_CONFIG.authorWpProfile,
    },
    downloadUrl: PLUGIN_CONFIG.releaseZipUrl,
    url: `https://www.genioussonu.me/plugin/${PLUGIN_CONFIG.slug}`,
  };

  const screenshots = [
    {
      id: 1,
      title: 'Global Security Dashboard',
      caption: 'KPI summary bar, real-time SOP Coverage score, and categorized audit status rows.',
    },
    {
      id: 2,
      title: 'Accessible Checklist Table',
      caption: 'Colorblind-friendly SVG status badges, Level A/B/C filters, and 1-click safe fix triggers.',
    },
    {
      id: 3,
      title: 'Pre-Execution Diff Preview',
      caption: 'Visual side-by-side diff modal showing exact marker blocks before touching .htaccess or wp-config.php.',
    },
    {
      id: 4,
      title: 'Executive Client Audit Report',
      caption: 'Print-ready HTML/PDF summary with SOP coverage percentage and emergency incident response sheets.',
    },
  ];

  return (
    <div className={styles.pageWrapper}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className={styles.ambientGlow} aria-hidden="true" />
      <Navbar />

      <main className={styles.container}>
        {/* Breadcrumb Navigation */}
        <nav className={styles.breadcrumbs} aria-label="Breadcrumb">
          <Link href="/" className={styles.breadcrumbLink}>
            home
          </Link>
          <span className={styles.breadcrumbSeparator}>/</span>
          <Link href="/plugin" className={styles.breadcrumbLink}>
            plugins
          </Link>
          <span className={styles.breadcrumbSeparator}>/</span>
          <span className={styles.breadcrumbCurrent}>{PLUGIN_CONFIG.slug}</span>
        </nav>

        {/* Subpage Navigation Bar */}
        <nav className={styles.pluginNav} aria-label="Plugin Navigation">
          <Link
            href={`/plugin/${PLUGIN_CONFIG.slug}`}
            className={`${styles.navPill} ${styles.navPillActive}`}
          >
            Overview
          </Link>
          <Link
            href={`/plugin/${PLUGIN_CONFIG.slug}/docs`}
            className={styles.navPill}
          >
            Documentation
          </Link>
          <Link
            href={`/plugin/${PLUGIN_CONFIG.slug}/changelog`}
            className={styles.navPill}
          >
            Changelog
          </Link>
          <Link
            href={`/plugin/${PLUGIN_CONFIG.slug}/support`}
            className={styles.navPill}
          >
            Support
          </Link>
          <Link
            href={`/plugin/${PLUGIN_CONFIG.slug}/privacy-policy`}
            className={styles.navPill}
          >
            Privacy Policy
          </Link>
          <Link
            href={`/plugin/${PLUGIN_CONFIG.slug}/terms`}
            className={styles.navPill}
          >
            Terms of Use
          </Link>
          <a
            href={PLUGIN_CONFIG.githubRepoUrl}
            target="_blank"
            rel="noopener noreferrer"
            className={styles.navPill}
          >
            GitHub ↗
          </a>
        </nav>

        {/* 1. HERO SECTION */}
        <section className={styles.heroSection} aria-label="Plugin Introduction">
          <div className={styles.heroGrid}>
            <div className={styles.heroContent}>
              <div className={styles.heroKicker}>
                <span className={styles.badge}>WordPress Security SOP</span>
                <span className={styles.versionPill}>v{PLUGIN_CONFIG.version}</span>
              </div>
              <h1 className={styles.title}>
                {PLUGIN_CONFIG.name}
              </h1>
              <p className={styles.subtitle}>{PLUGIN_CONFIG.tagline}</p>

              <div className={styles.heroActions}>
                <a
                  href={PLUGIN_CONFIG.releaseZipUrl}
                  className={styles.btnPrimary}
                  download
                >
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                  >
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2 2v-4" />
                    <polyline points="7 10 12 15 17 10" />
                    <line x1="12" y1="15" x2="12" y2="3" />
                  </svg>
                  <span>Download v{PLUGIN_CONFIG.version}</span>
                </a>

                {PLUGIN_CONFIG.wordpressOrgUrl ? (
                  <a
                    href={PLUGIN_CONFIG.wordpressOrgUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={styles.btnSecondary}
                  >
                    View on WordPress.org
                  </a>
                ) : (
                  <span className={styles.versionPill} title="Plugin review submitted">
                    ◈ {PLUGIN_CONFIG.wpDirectoryStatus}
                  </span>
                )}

                <a
                  href={PLUGIN_CONFIG.githubRepoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.btnSecondary}
                >
                  Source on GitHub ↗
                </a>
              </div>

              <div className={styles.releaseInfo}>
                <span>Release: {PLUGIN_CONFIG.updatedDate}</span>
                <span> · </span>
                <span>License: {PLUGIN_CONFIG.license}</span>
                <span> · </span>
                <span>WP {PLUGIN_CONFIG.requiresWp}+ | PHP {PLUGIN_CONFIG.requiresPhp}+</span>
              </div>
            </div>

            {/* Interactive Preview Mock */}
            <div className={styles.heroPreviewCard} aria-hidden="true">
              <div className={styles.scoreBanner}>
                <span className={styles.scoreLabel}>Agency SOP Coverage</span>
                <span className={styles.scoreValue}>88%</span>
              </div>
              <div className={styles.kpiRow}>
                <div className={styles.kpiCard}>
                  <span className={styles.kpiNum}>64</span>
                  <span className={styles.kpiDesc}>Checklist Tasks</span>
                </div>
                <div className={styles.kpiCard}>
                  <span className={styles.kpiNum} style={{ color: 'var(--gold-bright)' }}>
                    42
                  </span>
                  <span className={styles.kpiDesc}>Auto Hardened</span>
                </div>
                <div className={styles.kpiCard}>
                  <span className={styles.kpiNum}>0</span>
                  <span className={styles.kpiDesc}>Fatal Errors</span>
                </div>
              </div>
              <div
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.72rem',
                  color: 'var(--text-muted)',
                  lineHeight: '1.7',
                }}
              >
                <div>✓ XML-RPC Runtime &amp; Server Filter Active</div>
                <div>✓ REST Unauthenticated User Enumeration Blocked</div>
                <div>✓ Strict 640 Permissions on wp-config.php</div>
                <div>✓ Security Headers: X-Frame, Nosniff, HSTS</div>
                <div>✓ Zero Secret Redaction in Audit Trail</div>
              </div>
            </div>
          </div>
        </section>

        {/* 2. THE PROBLEM IT SOLVES */}
        <section aria-label="The Problem and Solution">
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>The Agency Security Challenge</h2>
            <p className={styles.sectionDesc}>
              WordPress security in client agencies typically fails due to human fatigue or heavy,
              bloated plugins that break sites.
            </p>
          </div>

          <div className={styles.problemSolutionGrid}>
            <div className={styles.problemCard}>
              <div className={`${styles.cardHeadBadge} ${styles.badgeProblem}`}>
                <span>✕</span>
                <span>Traditional Pitfalls</span>
              </div>
              <p style={{ color: 'var(--text-primary)', fontWeight: 600, marginBottom: '0.5rem' }}>
                Spreadsheets get skipped. Bloated suites break production.
              </p>
              <ul className={styles.cardBulletList}>
                <li className={styles.cardBulletItem}>
                  <span style={{ color: '#f87171' }}>•</span>
                  <span>
                    <strong>Unchecked Checklists:</strong> 40+ manual tasks on internal Notion or
                    Google Docs get abandoned during tight delivery schedules.
                  </span>
                </li>
                <li className={styles.cardBulletItem}>
                  <span style={{ color: '#f87171' }}>•</span>
                  <span>
                    <strong>Fatal Breakages:</strong> Aggressive monolithic plugins alter server files
                    blindly, creating 500 Internal Server Errors with no rollback.
                  </span>
                </li>
                <li className={styles.cardBulletItem}>
                  <span style={{ color: '#f87171' }}>•</span>
                  <span>
                    <strong>Secret Leaks:</strong> Audit logs frequently dump plain-text database
                    passwords and auth salts into wp_options.
                  </span>
                </li>
              </ul>
            </div>

            <div className={styles.solutionCard}>
              <div className={`${styles.cardHeadBadge} ${styles.badgeSolution}`}>
                <span>✓</span>
                <span>The GeniousSonu Checkup Way</span>
              </div>
              <p style={{ color: 'var(--text-primary)', fontWeight: 600, marginBottom: '0.5rem' }}>
                Actionable SOP automation with verified safeguards.
              </p>
              <ul className={styles.cardBulletList}>
                <li className={styles.cardBulletItem}>
                  <span style={{ color: 'var(--gold-bright)' }}>•</span>
                  <span>
                    <strong>Built-In SOP Engine:</strong> 64 structured checklist items grouped into 7
                    actionable categories right in the WordPress admin.
                  </span>
                </li>
                <li className={styles.cardBulletItem}>
                  <span style={{ color: 'var(--gold-bright)' }}>•</span>
                  <span>
                    <strong>1-Click Fix with Diff Previews:</strong> Inspect every line of code before
                    it touches .htaccess or wp-config.php.
                  </span>
                </li>
                <li className={styles.cardBulletItem}>
                  <span style={{ color: 'var(--gold-bright)' }}>•</span>
                  <span>
                    <strong>Zero-Secret Logging:</strong> Passwords, database keys, and salts are
                    strictly scrubbed and masked prior to storage.
                  </span>
                </li>
              </ul>
            </div>
          </div>
        </section>

        {/* 3. HOW IT WORKS IN 3 STEPS */}
        <section className={styles.stepsSection} aria-label="Workflow in 3 Steps">
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>How It Works in 3 Steps</h2>
            <p className={styles.sectionDesc}>
              A transparent, safe, and verifiable workflow designed for developers and agencies.
            </p>
          </div>

          <div className={styles.stepsGrid}>
            <div className={styles.stepCard}>
              <span className={styles.stepNum}>01</span>
              <h3 className={styles.stepTitle}>See Checklist</h3>
              <p className={styles.stepDesc}>
                Open the dashboard to trigger an instant audit of 64 agency SOP items. The plugin
                evaluates your server environment, calculates your SOP Coverage score, and flags
                missing protections.
              </p>
            </div>

            <div className={styles.stepCard}>
              <span className={styles.stepNum}>02</span>
              <h3 className={styles.stepTitle}>Click to Fix</h3>
              <p className={styles.stepDesc}>
                Execute safe Level-A automation tasks in 1 click or inspect the pre-execution diff
                modal. For complex setups (WAF, 2FA, backups), use Level-B guided bridges to
                mature, audited tools.
              </p>
            </div>

            <div className={styles.stepCard}>
              <span className={styles.stepNum}>03</span>
              <h3 className={styles.stepTitle}>Verified Audit Trail</h3>
              <p className={styles.stepDesc}>
                Every fix is instantly confirmed via loopback self-verification. Export print-ready
                executive client audit summaries with completion certificates and emergency
                incident-response escalation contacts.
              </p>
            </div>
          </div>
        </section>

        {/* 4. FEATURE GRID */}
        <section className={styles.featuresSection} aria-label="Plugin Features">
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>Engineered for Enterprise WordPress</h2>
            <p className={styles.sectionDesc}>
              Every capability is taken directly from our production task registry and validated
              against agency security guidelines.
            </p>
          </div>

          <div className={styles.featuresGrid}>
            <div className={styles.featureCard}>
              <div className={styles.featureIcon}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                </svg>
              </div>
              <h3 className={styles.featureTitle}>Level A: 1-Click Safe Hardening</h3>
              <p className={styles.featureDesc}>
                Disable XML-RPC, restrict REST unauthenticated user enumeration, enforce clickjacking
                (X-Frame-Options), MIME sniffing protection, HSTS, and strict 640 wp-config.php permissions.
              </p>
              <span className={styles.featureBadge}>Automated &amp; Reversible</span>
            </div>

            <div className={styles.featureCard}>
              <div className={styles.featureIcon}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
                  <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
                </svg>
              </div>
              <h3 className={styles.featureTitle}>Level B: Guided Plugin Bridges</h3>
              <p className={styles.featureDesc}>
                Seamlessly bridges to vetted plugins (Wordfence, Two-Factor Authentication, WPS Hide
                Login, and backup tools). Generates RFC 9116 security.txt disclosure policies.
              </p>
              <span className={styles.featureBadge}>Best-Practice Bridges</span>
            </div>

            <div className={styles.featureCard}>
              <div className={styles.featureIcon}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                  <line x1="16" y1="2" x2="16" y2="6" />
                  <line x1="8" y1="2" x2="8" y2="6" />
                  <line x1="3" y1="10" x2="21" y2="10" />
                </svg>
              </div>
              <h3 className={styles.featureTitle}>Level C: SOP Rotation Reminders</h3>
              <p className={styles.featureDesc}>
                Track 15-day hosting/cPanel and admin password rotations, quarterly 90-day backup
                restore drills, staging HTTP Basic Auth walls, and 6-month Google Search Console URL removal reviews.
              </p>
              <span className={styles.featureBadge}>Maintenance Hygiene</span>
            </div>

            <div className={styles.featureCard}>
              <div className={styles.featureIcon}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                  <polyline points="14 2 14 8 20 8" />
                  <line x1="16" y1="13" x2="8" y2="13" />
                  <line x1="16" y1="17" x2="8" y2="17" />
                  <polyline points="10 9 9 9 8 9" />
                </svg>
              </div>
              <h3 className={styles.featureTitle}>Level D: Executive Client Reports</h3>
              <p className={styles.featureDesc}>
                Generate print-ready HTML and PDF audit summaries detailing completed hardening, SOP
                coverage percentage, emergency incident-response escalation contacts, and audit trails.
              </p>
              <span className={styles.featureBadge}>Agency Client Handoff</span>
            </div>

            <div className={styles.featureCard}>
              <div className={styles.featureIcon}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10" />
                  <line x1="12" y1="8" x2="12" y2="12" />
                  <line x1="12" y1="16" x2="12.01" y2="16" />
                </svg>
              </div>
              <h3 className={styles.featureTitle}>Vulnerability Intelligence (Patchstack)</h3>
              <p className={styles.featureDesc}>
                Cross-references active plugins and themes against the Patchstack vulnerability database
                with match-confidence scoring (high, medium, unverified). Requires explicit consent.
              </p>
              <span className={styles.featureBadge}>CVE Intelligence</span>
            </div>

            <div className={styles.featureCard}>
              <div className={styles.featureIcon}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="2" y="2" width="20" height="8" rx="2" ry="2" />
                  <rect x="2" y="14" width="20" height="8" rx="2" ry="2" />
                  <line x1="6" y1="6" x2="6.01" y2="6" />
                  <line x1="6" y1="18" x2="6.01" y2="18" />
                </svg>
              </div>
              <h3 className={styles.featureTitle}>Server Environment Aware</h3>
              <p className={styles.featureDesc}>
                Detects Apache/LiteSpeed vs Nginx automatically. On Nginx, .htaccess tasks present
                copyable Nginx server directives instead of false positive warnings.
              </p>
              <span className={styles.featureBadge}>Apache &amp; Nginx</span>
            </div>
          </div>
        </section>

        {/* 5. SCREENSHOTS GALLERY */}
        <section className={styles.screenshotsSection} aria-label="Plugin Screenshots">
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>Dashboard Preview &amp; Screenshots</h2>
            <p className={styles.sectionDesc}>
              Visual walkthrough of the admin dashboard, diff viewer, and client report generator.
            </p>
          </div>

          <div className={styles.screenshotsGrid}>
            {screenshots.map((item) => (
              <figure key={item.id} className={styles.screenshotCard}>
                <div className={styles.screenshotPreview}>
                  <svg
                    width="36"
                    height="36"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    aria-hidden="true"
                  >
                    <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                    <circle cx="8.5" cy="8.5" r="1.5" />
                    <polyline points="21 15 16 10 5 21" />
                  </svg>
                  <span className={styles.screenshotPlaceholderBadge}>
                    [Screenshot {item.id}: {item.title}]
                  </span>
                </div>
                <figcaption className={styles.screenshotCaption}>
                  <strong>{item.title}:</strong> {item.caption}
                </figcaption>
              </figure>
            ))}
          </div>
        </section>

        {/* 6. HONEST NOTE: WHAT IT DOES NOT DO */}
        <section className={styles.honestNoteCard} aria-label="Operational Scope and Limitations">
          <div className={styles.honestNoteHeader}>
            <svg
              width="22"
              height="22"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              aria-hidden="true"
            >
              <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
              <line x1="12" y1="9" x2="12" y2="13" />
              <line x1="12" y1="17" x2="12.01" y2="17" />
            </svg>
            <span>What GeniousSonu Site Checkup Does NOT Do</span>
          </div>
          <p className={styles.honestNoteText}>
            GeniousSonu Site Checkup is an agency checklist, audit, and baseline hardening tool. It is{' '}
            <strong>NOT a replacement for a web application firewall (WAF)</strong> or real-time
            intrusion prevention system (such as Wordfence or Cloudflare), nor is it a backup service
            or a guarantee of total security. It reduces your attack surface and enforces agency SOP
            hygiene without adding background bloat. For maximum defense, run it alongside an audited
            firewall and scheduled off-site backups.
          </p>
        </section>

        {/* 7. SYSTEM REQUIREMENTS */}
        <section className={styles.reqCard} aria-label="System Requirements">
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>Compatibility &amp; Requirements</h2>
            <p className={styles.sectionDesc}>
              Lightweight requirements tested on standard hosting stacks.
            </p>
          </div>

          <div className={styles.reqGrid}>
            <div className={styles.reqItem}>
              <span className={styles.reqItemLabel}>WordPress Version</span>
              <span className={styles.reqItemValue}>{PLUGIN_CONFIG.requiresWp}+ (Tested to {PLUGIN_CONFIG.testedUpTo})</span>
            </div>
            <div className={styles.reqItem}>
              <span className={styles.reqItemLabel}>PHP Version</span>
              <span className={styles.reqItemValue}>{PLUGIN_CONFIG.requiresPhp}+</span>
            </div>
            <div className={styles.reqItem}>
              <span className={styles.reqItemLabel}>Web Server Support</span>
              <span className={styles.reqItemValue}>Apache, LiteSpeed, Nginx</span>
            </div>
            <div className={styles.reqItem}>
              <span className={styles.reqItemLabel}>Open Source License</span>
              <span className={styles.reqItemValue}>{PLUGIN_CONFIG.license}</span>
            </div>
          </div>
        </section>

        {/* 8. AUTHOR BLOCK */}
        <section className={styles.authorSection} aria-label="Author Profile">
          <div className={styles.authorCard}>
            <div className={styles.authorAvatar} aria-hidden="true">
              SS
            </div>
            <div className={styles.authorInfo}>
              <h2 className={styles.authorName}>{PLUGIN_CONFIG.author}</h2>
              <p className={styles.authorBio}>
                Senior Web Application Developer at Ib Arts, Co-Founder of WEFIK, and IT Engineer.
                Author of GeniousSonu Site Checkup, focusing on scalable backend systems, WordPress
                security hardening, and agency DevOps workflows.
              </p>
              <div className={styles.authorLinks}>
                <a
                  href={PLUGIN_CONFIG.authorWpProfile}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.authorLink}
                >
                  WordPress.org Profile ↗
                </a>
                <a
                  href={PLUGIN_CONFIG.authorUrl}
                  className={styles.authorLink}
                >
                  Portfolio Website →
                </a>
                <a
                  href={PLUGIN_CONFIG.githubRepoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.authorLink}
                >
                  GitHub Repository ↗
                </a>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
