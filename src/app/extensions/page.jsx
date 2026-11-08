import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import styles from './extensions.module.css';

export const metadata = {
  title: 'Browser Extensions — SK Sahinur Islam',
  description:
    'Browser extensions for code capture, developer workflows, and web tools built by SK Sahinur Islam.',
  alternates: {
    canonical: 'https://genioussonu.me/extensions',
  },
};

export default function ExtensionsIndexPage() {
  return (
    <main className={styles.wrapper} data-route="/extensions">
      <div className={styles.ambientGlow} aria-hidden="true" />
      <div className={styles.container}>
        {/* Breadcrumb Navigation */}
        <nav className={styles.breadcrumbs} aria-label="Breadcrumb">
          <Link href="/" className={styles.breadcrumbLink}>
            Home
          </Link>
          <span className={styles.breadcrumbSeparator}>/</span>
          <span className={styles.breadcrumbCurrent}>Extensions</span>
        </nav>

        {/* Page Header */}
        <header className={styles.pageHeader}>
          <h1 className={styles.pageTitle}>Browser Extensions</h1>
          <p className={styles.pageSubtitle}>
            Client-side browser extensions built for code capture, workflow speed, and local privacy.
          </p>
        </header>

        {/* Featured Product Showcase Card */}
        <article className={styles.featuredCard} aria-labelledby="kuracode-title">
          <div className={styles.cardLayout}>
            {/* Main Product Info Column */}
            <div className={styles.cardMain}>
              <div className={styles.productHeader}>
                <div className={styles.logoContainer}>
                  <Image
                    src="/assets/kuracode/kuracode-icon.svg"
                    alt="KuraCode Logo"
                    width={38}
                    height={38}
                    priority
                  />
                </div>
                <div className={styles.productHeadingCol}>
                  <h2 id="kuracode-title" className={styles.productTitle}>
                    KuraCode
                  </h2>
                  <span className={styles.productCategory}>Code Snippet Manager</span>
                </div>
              </div>

              <p className={styles.productDesc}>
                Captures code snippets with original URL source and context, stored locally on your
                device with zero account required.
              </p>

              <ul className={styles.featureList} role="list" aria-label="Key capabilities">
                <li className={styles.featureItem}>
                  <span className={styles.featureDot} aria-hidden="true" />
                  <span>In-browser code capture with automatic URL and title attribution</span>
                </li>
                <li className={styles.featureItem}>
                  <span className={styles.featureDot} aria-hidden="true" />
                  <span>Cleans copied line numbers and shell prompts automatically</span>
                </li>
                <li className={styles.featureItem}>
                  <span className={styles.featureDot} aria-hidden="true" />
                  <span>Local-first storage via browser.storage.local without remote servers</span>
                </li>
                <li className={styles.featureItem}>
                  <span className={styles.featureDot} aria-hidden="true" />
                  <span>Syntax highlighting with automatic language detection</span>
                </li>
              </ul>
            </div>

            {/* Specifications & Compatibility Panel */}
            <aside className={styles.specsPanel} aria-label="Extension specifications">
              <div className={styles.specRow}>
                <span className={styles.specLabel}>Status</span>
                <span className={styles.specValue}>Preview · v0.1.0</span>
              </div>
              <div className={styles.specRow}>
                <span className={styles.specLabel}>Browsers</span>
                <span className={styles.specValue}>Chrome, Edge, Firefox</span>
              </div>
              <div className={styles.specRow}>
                <span className={styles.specLabel}>Storage</span>
                <span className={styles.specValue}>Local-first (offline)</span>
              </div>
              <div className={styles.specRow}>
                <span className={styles.specLabel}>Telemetry</span>
                <span className={styles.specValue}>None (zero tracking)</span>
              </div>
              <div className={styles.specRow}>
                <span className={styles.specLabel}>Architecture</span>
                <span className={styles.specValue}>Manifest V3</span>
              </div>
            </aside>
          </div>

          {/* Card Action Footer */}
          <div className={styles.cardFooter}>
            <div className={styles.statusBadge}>
              <span className={styles.statusDot} aria-hidden="true" />
              <span>Developer Preview</span>
            </div>

            <div className={styles.ctaGroup}>
              <Link href="/extensions/kuracode/demo" className={styles.secondaryAction}>
                Try Demo
              </Link>
              <Link href="/extensions/kuracode" className={styles.primaryAction}>
                Explore KuraCode →
              </Link>
            </div>
          </div>
        </article>

        {/* Extension Standards Section */}
        <section className={styles.standardsSection} aria-labelledby="standards-heading">
          <div className={styles.standardsHeader}>
            <h2 id="standards-heading" className={styles.standardsTitle}>
              Extension Architecture Principles
            </h2>
            <p className={styles.standardsDesc}>
              Every extension published here adheres to strict browser security and user privacy standards.
            </p>
          </div>

          <div className={styles.standardsGrid}>
            <div className={styles.standardCard}>
              <h3 className={styles.standardCardTitle}>Local-First Storage</h3>
              <p className={styles.standardCardDesc}>
                Saved snippets and settings remain in your browser’s sandboxed local storage. No external accounts or central servers required.
              </p>
            </div>

            <div className={styles.standardCard}>
              <h3 className={styles.standardCardTitle}>Zero Telemetry</h3>
              <p className={styles.standardCardDesc}>
                Extensions do not inject analytics scripts, tracking pixels, or third-party advertising SDKs into your browsing tabs.
              </p>
            </div>

            <div className={styles.standardCard}>
              <h3 className={styles.standardCardTitle}>Manifest V3 Compliance</h3>
              <p className={styles.standardCardDesc}>
                Built strictly on modern browser extension standards with explicit permission scoping and zero remote executable code.
              </p>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
