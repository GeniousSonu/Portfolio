import React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { PLUGIN_CONFIG, ALL_PLUGINS } from '@/config/plugin';
import { DOCS_TOPICS } from '@/data/pluginDocs';
import styles from './docs.module.css';

export async function generateStaticParams() {
  return ALL_PLUGINS.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  if (slug !== PLUGIN_CONFIG.slug) return {};

  const title = `Documentation — ${PLUGIN_CONFIG.name}`;
  const description =
    'Comprehensive documentation, setup guides, and 64-item agency task reference for GeniousSonu Site Checkup.';
  const canonicalUrl = `https://www.genioussonu.me/plugin/${PLUGIN_CONFIG.slug}/docs`;

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

export default async function PluginDocsIndexPage({ params }) {
  const { slug } = await params;
  if (slug !== PLUGIN_CONFIG.slug) {
    notFound();
  }

  return (
    <div className={styles.docsWrapper}>
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
          <span className={styles.breadcrumbCurrent}>docs</span>
        </nav>

        <div className={styles.docsLayout}>
          {/* Docs Sidebar Navigation */}
          <aside className={styles.sidebar} aria-label="Documentation Navigation">
            <div className={styles.sidebarHeader}>Docs Index</div>
            <nav className={styles.sidebarNav}>
              <Link
                href={`/plugin/${PLUGIN_CONFIG.slug}/docs`}
                className={`${styles.sidebarLink} ${styles.sidebarLinkActive}`}
              >
                <span>Overview</span>
                <span>→</span>
              </Link>
              {DOCS_TOPICS.map((topic) => (
                <Link
                  key={topic.slug}
                  href={`/plugin/${PLUGIN_CONFIG.slug}/docs/${topic.slug}`}
                  className={styles.sidebarLink}
                >
                  <span>{topic.title}</span>
                </Link>
              ))}
            </nav>
          </aside>

          {/* Main Article Content */}
          <article className={styles.article}>
            <header className={styles.articleHeader}>
              <div className={styles.docBadge}>
                <span>◈</span>
                <span>Documentation &amp; Guide</span>
              </div>
              <h1 className={styles.docTitle}>{PLUGIN_CONFIG.name} Documentation</h1>
              <p className={styles.docLead}>
                Official guides, architectural overviews, and checklist task references for the
                GeniousSonu Site Checkup WordPress security audit and hardening plugin.
              </p>
            </header>

            <div className={styles.sectionBlock}>
              <h2 className={styles.sectionHeading}>About the Architecture</h2>
              <p className={styles.paragraph}>
                GeniousSonu Site Checkup delivers professional WordPress security auditing through an
                actionable, agency SOP-driven dashboard. Rather than competing with or replacing
                mature firewalls and backup tools, it audits your environment, detects
                vulnerabilities, and applies verified, reversible hardening fixes with zero bloat.
              </p>

              <div className={styles.callout}>
                <div className={styles.calloutTitle}>Strict Guideline 7 Compliance</div>
                <p>
                  Outbound queries to third-party vulnerability databases (Patchstack, GitHub, OSV,
                  NVD, WPScan) and alert webhooks require an explicit administrator opt-in checkbox in
                  Settings. The plugin performs full local auditing with zero outbound network calls by
                  default.
                </p>
              </div>
            </div>

            <div className={styles.sectionBlock}>
              <h2 className={styles.sectionHeading}>Documentation Sections</h2>
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
                  gap: '1.25rem',
                  marginTop: '1rem',
                }}
              >
                {DOCS_TOPICS.map((topic) => (
                  <Link
                    key={topic.slug}
                    href={`/plugin/${PLUGIN_CONFIG.slug}/docs/${topic.slug}`}
                    style={{
                      background: 'var(--surface, #22262e)',
                      border: '1px solid var(--border-dim, #1e2229)',
                      borderRadius: '10px',
                      padding: '1.25rem',
                      textDecoration: 'none',
                      color: 'inherit',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'space-between',
                      transition: 'border-color 0.2s ease, transform 0.2s ease',
                    }}
                  >
                    <div>
                      <h3
                        style={{
                          fontSize: '1.05rem',
                          fontWeight: 600,
                          color: 'var(--text-primary)',
                          marginBottom: '0.4rem',
                        }}
                      >
                        {topic.title}
                      </h3>
                      <p
                        style={{
                          fontSize: '0.85rem',
                          color: 'var(--text-muted)',
                          lineHeight: '1.5',
                        }}
                      >
                        {topic.shortDesc}
                      </p>
                    </div>
                    <div
                      style={{
                        marginTop: '1rem',
                        fontFamily: 'var(--font-mono)',
                        fontSize: '0.78rem',
                        color: 'var(--gold-bright, #34d399)',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.35rem',
                      }}
                    >
                      <span>Read Guide</span>
                      <span>→</span>
                    </div>
                  </Link>
                ))}
              </div>
            </div>

            <div className={styles.paginationFooter}>
              <Link
                href={`/plugin/${PLUGIN_CONFIG.slug}`}
                className={styles.paginationBtn}
              >
                ← Plugin Overview
              </Link>
              <Link
                href={`/plugin/${PLUGIN_CONFIG.slug}/docs/installation`}
                className={styles.paginationBtn}
              >
                Installation Guide →
              </Link>
            </div>
          </article>
        </div>
      </main>

      <Footer />
    </div>
  );
}
