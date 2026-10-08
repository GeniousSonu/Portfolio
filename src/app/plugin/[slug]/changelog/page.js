import React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { PLUGIN_CONFIG, ALL_PLUGINS } from '@/config/plugin';
import { CHANGELOG_RELEASES } from '@/data/pluginChangelog';
import styles from '../../plugin.module.css';

export async function generateStaticParams() {
  return ALL_PLUGINS.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  if (slug !== PLUGIN_CONFIG.slug) return {};

  const title = `Changelog & Release Notes — ${PLUGIN_CONFIG.name}`;
  const description =
    'Complete release history, vulnerability fixes, hardening enhancements, and feature milestones for GeniousSonu Site Checkup.';
  const canonicalUrl = `https://www.genioussonu.me/plugin/${PLUGIN_CONFIG.slug}/changelog`;

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

export default async function PluginChangelogPage({ params }) {
  const { slug } = await params;
  if (slug !== PLUGIN_CONFIG.slug) notFound();

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
          <span className={styles.breadcrumbCurrent}>changelog</span>
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
            className={`${styles.navPill} ${styles.navPillActive}`}
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

        {/* Page Header */}
        <header className={styles.pageHeader}>
          <div className={styles.badge}>
            <span>◈</span>
            <span>Version History &amp; Milestones</span>
          </div>
          <h1 className={styles.title}>
            {PLUGIN_CONFIG.name} <span className={styles.titleGradient}>Changelog</span>
          </h1>
          <p className={styles.subtitle}>
            All notable improvements, security patches, enterprise features, and architectural updates
            are documented here. Kept in strict synchronization with the official WordPress plugin
            readme.txt.
          </p>
        </header>

        {/* Maintenance Guide Box */}
        <aside
          style={{
            background: 'var(--surface, #22262e)',
            border: '1px solid var(--border-dim, #1e2229)',
            borderRadius: '12px',
            padding: '1.25rem 1.5rem',
            marginBottom: '3rem',
            fontFamily: 'var(--font-mono)',
            fontSize: '0.8rem',
            color: 'var(--text-secondary)',
          }}
        >
          <div style={{ color: 'var(--gold-bright)', fontWeight: 600, marginBottom: '0.35rem' }}>
            ⚡ Single Source of Truth
          </div>
          <div>
            This changelog is populated directly from <code>src/data/pluginChangelog.js</code> and
            synchronized with the <code>= x.y.z =</code> blocks in the plugin repository&apos;s
            <code>readme.txt</code> via <code>node scripts/sync-plugin-changelog.mjs</code>.
          </div>
        </aside>

        {/* Release Timeline */}
        <section aria-label="Releases Timeline" style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          {CHANGELOG_RELEASES.map((rel, idx) => (
            <article
              key={rel.version}
              style={{
                background: 'var(--graphite, #0f1115)',
                border: idx === 0 ? '1px solid rgba(16, 185, 129, 0.4)' : '1px solid var(--border, #2a2f38)',
                borderRadius: '16px',
                padding: '2rem',
                position: 'relative',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  flexWrap: 'wrap',
                  gap: '1rem',
                  paddingBottom: '1rem',
                  borderBottom: '1px solid var(--border-dim, #1e2229)',
                  marginBottom: '1.5rem',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                    v{rel.version}
                  </h2>
                  {idx === 0 && (
                    <span
                      style={{
                        background: 'rgba(16, 185, 129, 0.2)',
                        color: 'var(--gold-bright)',
                        fontFamily: 'var(--font-mono)',
                        fontSize: '0.72rem',
                        fontWeight: 600,
                        padding: '0.2rem 0.55rem',
                        borderRadius: '4px',
                      }}
                    >
                      Latest Release
                    </span>
                  )}
                </div>
                <div
                  style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: '0.8rem',
                    color: 'var(--text-muted)',
                  }}
                >
                  {rel.date}
                </div>
              </div>

              <ul
                style={{
                  listStyle: 'none',
                  padding: 0,
                  margin: 0,
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.85rem',
                }}
              >
                {rel.changes.map((ch, chIdx) => {
                  let tagBg = 'rgba(255, 255, 255, 0.08)';
                  let tagColor = 'var(--text-primary)';
                  if (ch.type === 'Feature') {
                    tagBg = 'rgba(16, 185, 129, 0.15)';
                    tagColor = 'var(--gold-bright)';
                  } else if (ch.type === 'Fix') {
                    tagBg = 'rgba(96, 165, 250, 0.15)';
                    tagColor = '#60a5fa';
                  } else if (ch.type === 'Security' || ch.type === 'Hardening') {
                    tagBg = 'rgba(239, 68, 68, 0.15)';
                    tagColor = '#f87171';
                  } else if (ch.type === 'Performance') {
                    tagBg = 'rgba(251, 191, 36, 0.15)';
                    tagColor = '#fbbf24';
                  }

                  return (
                    <li
                      key={chIdx}
                      style={{
                        display: 'flex',
                        alignItems: 'flex-start',
                        gap: '0.75rem',
                        lineHeight: '1.6',
                        fontSize: '0.92rem',
                        color: 'var(--text-secondary)',
                      }}
                    >
                      <span
                        style={{
                          background: tagBg,
                          color: tagColor,
                          fontFamily: 'var(--font-mono)',
                          fontSize: '0.7rem',
                          fontWeight: 700,
                          padding: '0.15rem 0.45rem',
                          borderRadius: '4px',
                          flexShrink: 0,
                          marginTop: '0.2rem',
                        }}
                      >
                        {ch.type}
                      </span>
                      <span>{ch.description}</span>
                    </li>
                  );
                })}
              </ul>
            </article>
          ))}
        </section>
      </main>

      <Footer />
    </div>
  );
}
