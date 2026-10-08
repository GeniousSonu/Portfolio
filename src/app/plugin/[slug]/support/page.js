import React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { PLUGIN_CONFIG, ALL_PLUGINS } from '@/config/plugin';
import styles from '../../plugin.module.css';

export async function generateStaticParams() {
  return ALL_PLUGINS.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  if (slug !== PLUGIN_CONFIG.slug) return {};

  const title = `Support & Assistance — ${PLUGIN_CONFIG.name}`;
  const description =
    'Official support guidelines, issue reporting checklist, and diagnostic procedures for GeniousSonu Site Checkup.';
  const canonicalUrl = `https://www.genioussonu.me/plugin/${PLUGIN_CONFIG.slug}/support`;

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

export default async function PluginSupportPage({ params }) {
  const { slug } = await params;
  if (slug !== PLUGIN_CONFIG.slug) notFound();

  const githubIssuesUrl = `${PLUGIN_CONFIG.githubRepoUrl}/issues`;

  return (
    <div className={styles.pageWrapper}>
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
          <Link
            href={`/plugin/${PLUGIN_CONFIG.slug}`}
            className={styles.breadcrumbLink}
          >
            {PLUGIN_CONFIG.slug}
          </Link>
          <span className={styles.breadcrumbSeparator}>/</span>
          <span className={styles.breadcrumbCurrent}>support</span>
        </nav>

        {/* Subpage Navigation Bar */}
        <nav className={styles.pluginNav} aria-label="Plugin Navigation">
          <Link
            href={`/plugin/${PLUGIN_CONFIG.slug}`}
            className={styles.navPill}
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
            className={`${styles.navPill} ${styles.navPillActive}`}
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

        {/* Page Header */}
        <header className={styles.pageHeader}>
          <div className={styles.badge}>
            <span>◈</span>
            <span>Technical Helpdesk &amp; Issues</span>
          </div>
          <h1 className={styles.title}>
            {PLUGIN_CONFIG.name} <span className={styles.titleGradient}>Support</span>
          </h1>
          <p className={styles.subtitle}>
            Need assistance, discovered a bug, or have a security question? Here are the official
            channels to get help directly from the developer.
          </p>
        </header>

        {/* Support Channels Grid */}
        <section aria-label="Support Channels" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem', marginBottom: '3.5rem' }}>
          <div
            style={{
              background: 'var(--graphite, #0f1115)',
              border: '1px solid var(--border, #2a2f38)',
              borderRadius: '14px',
              padding: '2rem',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
            }}
          >
            <div>
              <div style={{ color: 'var(--gold-bright)', fontSize: '1.5rem', marginBottom: '0.75rem' }}>
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" />
                </svg>
              </div>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '0.5rem' }}>
                GitHub Issue Tracker
              </h2>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: '1.6', marginBottom: '1.5rem' }}>
                For bug reports, technical inquiries, and feature requests. Publicly tracked and reviewed.
              </p>
            </div>
            <a
              href={githubIssuesUrl}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.btnPrimary}
            >
              Open GitHub Issue ↗
            </a>
          </div>

          <div
            style={{
              background: 'var(--graphite, #0f1115)',
              border: '1px solid var(--border, #2a2f38)',
              borderRadius: '14px',
              padding: '2rem',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
            }}
          >
            <div>
              <div style={{ color: 'var(--gold-bright)', fontSize: '1.5rem', marginBottom: '0.75rem' }}>
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                  <polyline points="22,6 12,13 2,6" />
                </svg>
              </div>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '0.5rem' }}>
                Direct Security Contact
              </h2>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: '1.6', marginBottom: '1.5rem' }}>
                For sensitive vulnerability disclosures or private inquiries, reach out directly via email or our
                secure contact form.
              </p>
            </div>
            <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
              <a
                href={`mailto:${PLUGIN_CONFIG.supportEmail}`}
                className={styles.btnSecondary}
              >
                {PLUGIN_CONFIG.supportEmail}
              </a>
              <Link href="/contact" className={styles.btnPrimary}>
                Direct Contact Terminal →
              </Link>
            </div>
          </div>

          {PLUGIN_CONFIG.wordpressOrgUrl ? (
            <div
              style={{
                background: 'var(--graphite, #0f1115)',
                border: '1px solid var(--border, #2a2f38)',
                borderRadius: '14px',
                padding: '2rem',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
              }}
            >
              <div>
                <h2 style={{ fontSize: '1.25rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '0.5rem' }}>
                  WordPress.org Support Forum
                </h2>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: '1.6', marginBottom: '1.5rem' }}>
                  Community forum for WordPress directory users.
                </p>
              </div>
              <a
                href={`${PLUGIN_CONFIG.wordpressOrgUrl}/support`}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.btnSecondary}
              >
                Visit WP.org Forum ↗
              </a>
            </div>
          ) : null}
        </section>

        {/* Bug Report Checklist */}
        <section aria-label="Bug Report Guidelines" style={{ background: 'var(--surface, #22262e)', border: '1px solid var(--border, #2a2f38)', borderRadius: '16px', padding: '2.5rem' }}>
          <h2 style={{ fontSize: '1.35rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.75rem' }}>
            What to Include in a Bug Report
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', lineHeight: '1.6', marginBottom: '1.5rem' }}>
            To diagnose issues swiftly, please provide the following technical details in your GitHub issue or message:
          </p>

          <ol style={{ paddingLeft: '1.25rem', color: 'var(--text-secondary)', lineHeight: '1.8', fontSize: '0.92rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <li>
              <strong>WordPress &amp; PHP Versions:</strong> e.g., WordPress 6.5.2, PHP 8.2.14.
            </li>
            <li>
              <strong>Web Server Architecture:</strong> Apache, LiteSpeed, Nginx, or Docker reverse proxy.
            </li>
            <li>
              <strong>Site Environment:</strong> Production, Staging, or Local development (LocalWP/Valet/Docker).
            </li>
            <li>
              <strong>Diagnostic Snapshot Export:</strong> Use the plugin&apos;s built-in{' '}
              <strong>Developer Diagnostic Snapshot</strong> feature in the dashboard to copy a sanitized Markdown system
              summary.
            </li>
            <li>
              <strong>Privacy Guarantee:</strong> The diagnostic snapshot is pre-sanitized and automatically redacts all
              passwords, security salts, database credentials, and personal email addresses.
            </li>
            <li>
              <strong>Exact Error Message / Behavior:</strong> Relevant log entries from <code>wp-content/debug.log</code> or
              web browser developer tools console.
            </li>
          </ol>
        </section>
      </main>

      <Footer />
    </div>
  );
}
