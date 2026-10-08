import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { ALL_PLUGINS } from '@/config/plugin';
import styles from './plugin.module.css';

export const metadata = {
  title: 'WordPress Plugins & Tools — SK Sahinur Islam',
  description:
    'Open-source WordPress plugins, enterprise security auditing utilities, and site hardening tools built by SK Sahinur Islam.',
  alternates: {
    canonical: 'https://www.genioussonu.me/plugin',
  },
  openGraph: {
    title: 'WordPress Plugins & Tools — SK Sahinur Islam',
    description:
      'Open-source WordPress plugins, enterprise security auditing utilities, and site hardening tools built by SK Sahinur Islam.',
    url: 'https://www.genioussonu.me/plugin',
    siteName: 'SK Sahinur Islam Portfolio',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'WordPress Plugins & Tools — SK Sahinur Islam',
    description:
      'Open-source WordPress plugins, enterprise security auditing utilities, and site hardening tools built by SK Sahinur Islam.',
  },
};

export default function PluginIndexPage() {
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
          <span className={styles.breadcrumbCurrent}>plugins</span>
        </nav>

        {/* Page Header */}
        <header className={styles.pageHeader}>
          <div className={styles.badge}>
            <span>◈</span>
            <span>WordPress Software Directory</span>
          </div>
          <h1 className={styles.title}>
            Engineered <span className={styles.titleGradient}>Plugins &amp; Tools</span>
          </h1>
          <p className={styles.subtitle}>
            Production-grade, zero-bloat WordPress security utilities and agency SOP tools. Developed
            with enterprise safeguards, strict validation, and compliance with WordPress.org guidelines.
          </p>
        </header>

        {/* Plugin Directory Grid */}
        <section aria-label="Available Plugins" className={styles.pluginGrid}>
          {ALL_PLUGINS.map((plugin) => (
            <article key={plugin.slug} className={styles.pluginCard}>
              <div className={styles.cardHeader}>
                <div className={styles.cardIcon}>
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                  >
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                  </svg>
                </div>
                <div>
                  <h2 className={styles.cardTitle}>{plugin.name}</h2>
                  <span className={styles.versionPill}>v{plugin.version}</span>
                </div>
              </div>

              <p className={styles.cardTagline}>{plugin.tagline}</p>

              <div className={styles.cardMeta}>
                <span className={styles.metaItem}>
                  <strong>WP:</strong> {plugin.requiresWp}+
                </span>
                <span className={styles.metaItem}>
                  <strong>PHP:</strong> {plugin.requiresPhp}+
                </span>
                <span className={styles.metaItem}>
                  <strong>Status:</strong> {plugin.wpDirectoryStatus}
                </span>
                <span className={styles.metaItem}>
                  <strong>Updated:</strong> {plugin.updatedDate}
                </span>
              </div>

              <div className={styles.cardActions}>
                <Link href={`/plugin/${plugin.slug}`} className={styles.btnPrimary}>
                  <span>Explore Plugin</span>
                  <span aria-hidden="true">→</span>
                </Link>
                <Link
                  href={`/plugin/${plugin.slug}/docs`}
                  className={styles.btnSecondary}
                >
                  Documentation
                </Link>
                <a
                  href={plugin.githubRepoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.btnSecondary}
                >
                  GitHub
                </a>
              </div>
            </article>
          ))}
        </section>
      </main>

      <Footer />
    </div>
  );
}
