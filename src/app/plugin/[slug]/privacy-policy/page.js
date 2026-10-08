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

  const title = `Privacy Policy — ${PLUGIN_CONFIG.name}`;
  const description =
    'Plain-English privacy policy detailing data sovereignty, zero-collection defaults, and external service opt-ins for GeniousSonu Site Checkup.';
  const canonicalUrl = `https://www.genioussonu.me/plugin/${PLUGIN_CONFIG.slug}/privacy-policy`;

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

export default async function PluginPrivacyPolicyPage({ params }) {
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
          <span className={styles.breadcrumbCurrent}>privacy-policy</span>
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
            className={styles.navPill}
          >
            Support
          </Link>
          <Link
            href={`/plugin/${PLUGIN_CONFIG.slug}/privacy-policy`}
            className={`${styles.navPill} ${styles.navPillActive}`}
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
            <span>Data Sovereignty &amp; Transparency</span>
          </div>
          <h1 className={styles.title}>
            {PLUGIN_CONFIG.name} <span className={styles.titleGradient}>Privacy Policy</span>
          </h1>
          <p className={styles.subtitle}>
            Accurate, transparent, and written in plain English. Your site data belongs to you alone.
          </p>
        </header>

        {/* Article Body */}
        <article
          style={{
            background: 'var(--graphite, #0f1115)',
            border: '1px solid var(--border, #2a2f38)',
            borderRadius: '16px',
            padding: '2.5rem 3rem',
            lineHeight: '1.75',
            color: 'var(--text-secondary)',
          }}
        >
          <section style={{ marginBottom: '2.5rem' }}>
            <h2 style={{ fontSize: '1.35rem', color: 'var(--text-primary)', marginBottom: '0.75rem', fontWeight: 700 }}>
              1. Self-Contained Architecture &amp; Data Collection
            </h2>
            <p style={{ marginBottom: '1rem' }}>
              <strong>GeniousSonu Site Checkup</strong> is designed as a local, self-contained WordPress utility.
              It executes exclusively on your own web server.
            </p>
            <p style={{ marginBottom: '1rem' }}>
              <strong>genioussonu.me does not collect, receive, or store any data from plugin installations</strong>,
              analytics, tracking telemetry, or usage metrics.
            </p>
            <div
              style={{
                background: 'rgba(16, 185, 129, 0.05)',
                borderLeft: '4px solid var(--gold)',
                padding: '1.25rem',
                borderRadius: '0 8px 8px 0',
                margin: '1.25rem 0',
              }}
            >
              <strong style={{ color: 'var(--text-primary)' }}>The One Exception: Self-Hosted Update Checks</strong>
              <p style={{ marginTop: '0.4rem', fontSize: '0.9rem' }}>
                If you use the self-hosted release build, your WordPress installation periodically checks{' '}
                <code>https://www.genioussonu.me/plugin/genioussonu-site-checkup/update-info.json</code> to determine
                if a newer version is available. Like any standard static file request, this reveals your requesting
                server IP address in standard web server access logs. The official WordPress.org directory build does
                <strong> not</strong> make this call; it relies solely on WordPress.org infrastructure.
              </p>
            </div>
          </section>

          <section style={{ marginBottom: '2.5rem' }}>
            <h2 style={{ fontSize: '1.35rem', color: 'var(--text-primary)', marginBottom: '0.75rem', fontWeight: 700 }}>
              2. Outbound External Services (All Strictly Opt-In)
            </h2>
            <p style={{ marginBottom: '1.25rem' }}>
              In compliance with <strong>WordPress.org Plugin Guideline 7</strong>, all outbound network calls to
              external APIs are <strong>disabled by default</strong>. They require an explicit administrator opt-in
              toggle or checkbox in the plugin settings before running.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
              {/* Service 1 */}
              <div style={{ background: 'var(--surface, #22262e)', padding: '1.5rem', borderRadius: '12px', border: '1px solid var(--border-dim, #1e2229)' }}>
                <h3 style={{ fontSize: '1.1rem', color: 'var(--gold-bright)', marginBottom: '0.4rem' }}>
                  1. WordPress.org APIs (api.wordpress.org)
                </h3>
                <p style={{ fontSize: '0.9rem', marginBottom: '0.5rem' }}>
                  <strong>Data Sent:</strong> Current WordPress core version, installed plugin slugs, and site locale.
                  Zero personal visitor data or credentials.
                </p>
                <p style={{ fontSize: '0.9rem', marginBottom: '0.5rem' }}>
                  <strong>Why:</strong> Validates WordPress core files against official SHA-256 checksums and detects closed or abandoned plugins in the official directory.
                </p>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                  Privacy Policy:{' '}
                  <a href="https://wordpress.org/about/privacy/" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--gold-bright)' }}>
                    WordPress.org Privacy Policy ↗
                  </a>
                </p>
              </div>

              {/* Service 2 */}
              <div style={{ background: 'var(--surface, #22262e)', padding: '1.5rem', borderRadius: '12px', border: '1px solid var(--border-dim, #1e2229)' }}>
                <h3 style={{ fontSize: '1.1rem', color: 'var(--gold-bright)', marginBottom: '0.4rem' }}>
                  2. Patchstack Vulnerability Database (patchstack.com)
                </h3>
                <p style={{ fontSize: '0.9rem', marginBottom: '0.5rem' }}>
                  <strong>Data Sent:</strong> Active plugin and theme software slugs and version strings. Optional encrypted API token if configured.
                </p>
                <p style={{ fontSize: '0.9rem', marginBottom: '0.5rem' }}>
                  <strong>Why:</strong> Queries Patchstack vulnerability intelligence to detect known CVEs affecting installed extensions.
                </p>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                  Policies:{' '}
                  <a href="https://patchstack.com/privacy-policy/" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--gold-bright)' }}>
                    Patchstack Privacy Policy ↗
                  </a>
                  {' · '}
                  <a href="https://patchstack.com/terms-and-conditions/" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--gold-bright)' }}>
                    Patchstack Terms of Service ↗
                  </a>
                </p>
              </div>

              {/* Service 3 */}
              <div style={{ background: 'var(--surface, #22262e)', padding: '1.5rem', borderRadius: '12px', border: '1px solid var(--border-dim, #1e2229)' }}>
                <h3 style={{ fontSize: '1.1rem', color: 'var(--gold-bright)', marginBottom: '0.4rem' }}>
                  3. GitHub Security Advisory Database (api.github.com)
                </h3>
                <p style={{ fontSize: '0.9rem', marginBottom: '0.5rem' }}>
                  <strong>Data Sent:</strong> Component slugs and version strings. Optional user-provided GitHub Personal Access Token in HTTPS headers.
                </p>
                <p style={{ fontSize: '0.9rem', marginBottom: '0.5rem' }}>
                  <strong>Why:</strong> Cross-references GitHub GHSA security advisories for open-source WordPress software.
                </p>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                  Policies:{' '}
                  <a href="https://docs.github.com/en/site-policy/privacy-policies/github-general-privacy-statement" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--gold-bright)' }}>
                    GitHub Privacy Statement ↗
                  </a>
                  {' · '}
                  <a href="https://docs.github.com/en/site-policy/github-terms/github-terms-of-service" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--gold-bright)' }}>
                    GitHub Terms of Service ↗
                  </a>
                </p>
              </div>

              {/* Service 4 */}
              <div style={{ background: 'var(--surface, #22262e)', padding: '1.5rem', borderRadius: '12px', border: '1px solid var(--border-dim, #1e2229)' }}>
                <h3 style={{ fontSize: '1.1rem', color: 'var(--gold-bright)', marginBottom: '0.4rem' }}>
                  4. Google Open Source Vulnerabilities (api.osv.dev)
                </h3>
                <p style={{ fontSize: '0.9rem', marginBottom: '0.5rem' }}>
                  <strong>Data Sent:</strong> Software component names and versions. Zero visitor data.
                </p>
                <p style={{ fontSize: '0.9rem', marginBottom: '0.5rem' }}>
                  <strong>Why:</strong> Queries Google distributed OSV vulnerability schema across open-source ecosystems.
                </p>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                  Policies:{' '}
                  <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--gold-bright)' }}>
                    Google Privacy Policy ↗
                  </a>
                  {' · '}
                  <a href="https://google.github.io/osv.dev/faq/" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--gold-bright)' }}>
                    OSV FAQ &amp; Terms ↗
                  </a>
                </p>
              </div>

              {/* Service 5 */}
              <div style={{ background: 'var(--surface, #22262e)', padding: '1.5rem', borderRadius: '12px', border: '1px solid var(--border-dim, #1e2229)' }}>
                <h3 style={{ fontSize: '1.1rem', color: 'var(--gold-bright)', marginBottom: '0.4rem' }}>
                  5. NIST National Vulnerability Database (services.nvd.nist.gov)
                </h3>
                <p style={{ fontSize: '0.9rem', marginBottom: '0.5rem' }}>
                  <strong>Data Sent:</strong> Component identifiers and optional encrypted NVD API key.
                </p>
                <p style={{ fontSize: '0.9rem', marginBottom: '0.5rem' }}>
                  <strong>Why:</strong> Queries official NIST CVE data and CVSS severity scores.
                </p>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                  Privacy Policy:{' '}
                  <a href="https://www.nist.gov/admr/oism/site-privacy" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--gold-bright)' }}>
                    NIST Site Privacy ↗
                  </a>
                </p>
              </div>

              {/* Service 6 */}
              <div style={{ background: 'var(--surface, #22262e)', padding: '1.5rem', borderRadius: '12px', border: '1px solid var(--border-dim, #1e2229)' }}>
                <h3 style={{ fontSize: '1.1rem', color: 'var(--gold-bright)', marginBottom: '0.4rem' }}>
                  6. CISA Known Exploited Vulnerabilities (cisa.gov)
                </h3>
                <p style={{ fontSize: '0.9rem', marginBottom: '0.5rem' }}>
                  <strong>Data Sent:</strong> None. Outbound GET request fetches the public catalog JSON feed.
                </p>
                <p style={{ fontSize: '0.9rem', marginBottom: '0.5rem' }}>
                  <strong>Why:</strong> Alerts administrators to weaponized vulnerabilities and active zero-days.
                </p>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                  Privacy Policy:{' '}
                  <a href="https://www.cisa.gov/privacy-policy" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--gold-bright)' }}>
                    CISA Privacy Policy ↗
                  </a>
                </p>
              </div>

              {/* Service 7 */}
              <div style={{ background: 'var(--surface, #22262e)', padding: '1.5rem', borderRadius: '12px', border: '1px solid var(--border-dim, #1e2229)' }}>
                <h3 style={{ fontSize: '1.1rem', color: 'var(--gold-bright)', marginBottom: '0.4rem' }}>
                  7. WPScan Vulnerability Database (wpscan.com)
                </h3>
                <p style={{ fontSize: '0.9rem', marginBottom: '0.5rem' }}>
                  <strong>Data Sent:</strong> Plugin/theme slugs, version strings, encrypted API key in header.
                </p>
                <p style={{ fontSize: '0.9rem', marginBottom: '0.5rem' }}>
                  <strong>Why:</strong> Queries specialized WordPress core and extension vulnerability databases.
                </p>
                <p style={{ fontSize: '0.9rem', marginBottom: '0.5rem', color: '#fbbf24' }}>
                  <strong>Data Handling Notice:</strong> In compliance with WPScan Terms of Service and data licensing, vulnerability intelligence data retrieved from WPScan is never permanently stored or cached on disk.
                </p>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                  Policies:{' '}
                  <a href="https://automattic.com/privacy/" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--gold-bright)' }}>
                    Automattic Privacy Policy ↗
                  </a>
                  {' · '}
                  <a href="https://wpscan.com/terms/" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--gold-bright)' }}>
                    WPScan Terms of Service ↗
                  </a>
                </p>
              </div>

              {/* Service 8 */}
              <div style={{ background: 'var(--surface, #22262e)', padding: '1.5rem', borderRadius: '12px', border: '1px solid var(--border-dim, #1e2229)' }}>
                <h3 style={{ fontSize: '1.1rem', color: 'var(--gold-bright)', marginBottom: '0.4rem' }}>
                  8. Optional Web-Search Enrichment
                </h3>
                <p style={{ fontSize: '0.9rem', marginBottom: '0.5rem' }}>
                  <strong>Data Sent:</strong> Public CVE identifier and software slug.
                </p>
                <p style={{ fontSize: '0.9rem', marginBottom: '0.5rem' }}>
                  <strong>Why:</strong> Discovers published security writeups, remediation patches, and technical advisories.
                </p>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                  Explicitly disabled by default; only runs when enabled by site administrators in Settings.
                </p>
              </div>

              {/* Service 9 */}
              <div style={{ background: 'var(--surface, #22262e)', padding: '1.5rem', borderRadius: '12px', border: '1px solid var(--border-dim, #1e2229)' }}>
                <h3 style={{ fontSize: '1.1rem', color: 'var(--gold-bright)', marginBottom: '0.4rem' }}>
                  9. Outbound Event Webhooks (Slack, Discord, Custom)
                </h3>
                <p style={{ fontSize: '0.9rem', marginBottom: '0.5rem' }}>
                  <strong>Data Sent:</strong> Factual event notification payloads (timestamp, alert type, sanitized technical message).
                </p>
                <p style={{ fontSize: '0.9rem', marginBottom: '0.5rem' }}>
                  <strong>Why:</strong> Alerts agency teams to critical incidents (brute-force lockouts, rogue admin creation).
                </p>
                <p style={{ fontSize: '0.9rem', marginBottom: '0.5rem', color: 'var(--gold-bright)' }}>
                  <strong>Secret Scrubber:</strong> Webhook dispatch payloads strictly redact all passwords, authentication keys, and database salts prior to transmission.
                </p>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                  Policies:{' '}
                  <a href="https://slack.com/intl/en-in/trust/privacy/privacy-policy" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--gold-bright)' }}>
                    Slack Privacy Policy ↗
                  </a>
                  {' · '}
                  <a href="https://discord.com/privacy" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--gold-bright)' }}>
                    Discord Privacy Policy ↗
                  </a>
                  {' · '}
                  <a href="https://discord.com/terms" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--gold-bright)' }}>
                    Discord Terms of Service ↗
                  </a>
                </p>
              </div>
            </div>
          </section>

          <section>
            <h2 style={{ fontSize: '1.35rem', color: 'var(--text-primary)', marginBottom: '0.75rem', fontWeight: 700 }}>
              3. Data Retention &amp; Local Database Footprint
            </h2>
            <p style={{ marginBottom: '1rem' }}>
              All audit records created by the plugin reside in the local WordPress database table{' '}
              <code>wp_wpsg_audit_logs</code>. Logs are retained for a rolling 12-month period and automatically
              pruned to prevent database bloat. Uninstalling the plugin through the WordPress admin permanently
              removes all managed tables and options when the cleanup option is confirmed.
            </p>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
              Last Updated: {PLUGIN_CONFIG.updatedDate}
            </p>
          </section>
        </article>
      </main>

      <Footer />
    </div>
  );
}
