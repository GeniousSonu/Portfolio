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

  const title = `Terms of Use — ${PLUGIN_CONFIG.name}`;
  const description =
    'Plain-language terms of use for GeniousSonu Site Checkup. GPLv2 licensing, backup responsibilities, AS-IS warranty disclaimers, and support scope.';
  const canonicalUrl = `https://www.genioussonu.me/plugin/${PLUGIN_CONFIG.slug}/terms`;

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

export default async function PluginTermsPage({ params }) {
  const { slug } = await params;
  if (slug !== PLUGIN_CONFIG.slug) notFound();

  return (
    <div className={styles.pageWrapper}>
      <div className={styles.ambientGlow} aria-hidden="true" />
      <Navbar />

      <main className={styles.container}>
        {/* Breadcrumbs */}
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
          <span className={styles.breadcrumbCurrent}>terms</span>
        </nav>

        {/* Plugin Navigation Bar */}
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
            className={styles.navPill}
          >
            Privacy Policy
          </Link>
          <Link
            href={`/plugin/${PLUGIN_CONFIG.slug}/terms`}
            className={`${styles.navPill} ${styles.navPillActive}`}
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
            <span>⚖</span>
            <span>Plain-Language Agreement</span>
          </div>
          <h1 className={styles.title}>
            {PLUGIN_CONFIG.name} <span className={styles.titleGradient}>Terms of Use</span>
          </h1>
          <p className={styles.subtitle}>
            Clear, transparent terms governing the use of {PLUGIN_CONFIG.name}. Licensed under GPLv2 or later.
          </p>
        </header>

        {/* Legal Body */}
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
          {/* Legal Notice Callout */}
          <div
            style={{
              background: 'rgba(234, 179, 8, 0.08)',
              border: '1px solid rgba(234, 179, 8, 0.25)',
              borderRadius: '10px',
              padding: '1.25rem 1.5rem',
              marginBottom: '2.5rem',
              color: 'var(--text-primary)',
            }}
          >
            <div style={{ fontWeight: 600, color: '#facc15', marginBottom: '0.4rem' }}>
              📋 Legal Notice &amp; Identification
            </div>
            <p style={{ margin: 0, fontSize: '0.92rem', color: 'var(--text-secondary)' }}>
              These terms are established by the plugin author,{' '}
              <strong>SK Sahinur Islam</strong>{' '}
              <span
                style={{
                  display: 'inline-block',
                  background: 'rgba(234, 179, 8, 0.2)',
                  color: '#fef08a',
                  padding: '0.1rem 0.5rem',
                  borderRadius: '4px',
                  fontFamily: 'var(--font-mono, monospace)',
                  fontSize: '0.82rem',
                }}
              >
                [PLACEHOLDER: SK Sahinur Islam / Legal Entity Name]
              </span>{' '}
              (&ldquo;Developer&rdquo;, &ldquo;we&rdquo;, or &ldquo;our&rdquo;), publisher of{' '}
              <strong>{PLUGIN_CONFIG.name}</strong> (&ldquo;the Plugin&rdquo;) accessible via{' '}
              <a
                href="https://www.genioussonu.me"
                style={{ color: 'var(--gold-bright)', textDecoration: 'underline' }}
              >
                genioussonu.me
              </a>
              . By downloading, installing, activating, or using the Plugin, you agree to these terms.
            </p>
          </div>

          {/* Section 1: GPL License */}
          <section style={{ marginBottom: '2.5rem' }}>
            <h2 style={{ fontSize: '1.35rem', color: 'var(--text-primary)', marginBottom: '0.75rem', fontWeight: 700 }}>
              1. Open Source License (GPLv2 or Later)
            </h2>
            <p style={{ marginBottom: '1rem' }}>
              <strong>{PLUGIN_CONFIG.name}</strong> is free software released under the terms of the{' '}
              <strong>GNU General Public License version 2</strong> (or, at your option, any later version) as published by
              the Free Software Foundation.
            </p>
            <p style={{ marginBottom: '1rem' }}>
              You are free to run, study, share, and modify the software under the terms of the GPLv2 license. A copy of
              the license is included in the plugin source repository or can be reviewed online at{' '}
              <a
                href={PLUGIN_CONFIG.licenseUrl}
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: 'var(--gold-bright)', textDecoration: 'underline' }}
              >
                {PLUGIN_CONFIG.licenseUrl}
              </a>
              .
            </p>
          </section>

          {/* Section 2: AS-IS and No Warranty */}
          <section style={{ marginBottom: '2.5rem' }}>
            <h2 style={{ fontSize: '1.35rem', color: 'var(--text-primary)', marginBottom: '0.75rem', fontWeight: 700 }}>
              2. &ldquo;AS-IS&rdquo; Disclaimer and Absence of Warranty
            </h2>
            <div
              style={{
                background: 'rgba(239, 68, 68, 0.08)',
                border: '1px solid rgba(239, 68, 68, 0.25)',
                borderRadius: '8px',
                padding: '1.25rem 1.5rem',
                marginBottom: '1rem',
              }}
            >
              <p
                style={{
                  margin: 0,
                  fontSize: '0.92rem',
                  fontFamily: 'var(--font-mono, monospace)',
                  color: '#fca5a5',
                  lineHeight: '1.6',
                }}
              >
                THE SOFTWARE IS PROVIDED &ldquo;AS IS&rdquo;, WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING
                BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, AND
                NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHOR OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES, OR
                OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT, OR OTHERWISE, ARISING FROM, OUT OF, OR IN
                CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
              </p>
            </div>
            <p>
              You explicitly acknowledge that WordPress installations feature complex combinations of hosting environments,
              PHP configurations, themes, server software (Apache, Nginx, LiteSpeed), and other plugins that may interact
              unpredictably.
            </p>
          </section>

          {/* Section 3: Backup & Staging Responsibility */}
          <section style={{ marginBottom: '2.5rem' }}>
            <h2 style={{ fontSize: '1.35rem', color: 'var(--text-primary)', marginBottom: '0.75rem', fontWeight: 700 }}>
              3. User Responsibility: Backups and Staging Verification
            </h2>
            <p style={{ marginBottom: '1rem' }}>
              Certain tasks within <strong>{PLUGIN_CONFIG.name}</strong> perform file and server configuration modifications
              when you explicitly initiate a fix. These include, but are not limited to:
            </p>
            <ul style={{ paddingLeft: '1.5rem', marginBottom: '1rem' }}>
              <li>Writing server rules into <code>.htaccess</code> files.</li>
              <li>Defining constants in <code>wp-config.php</code> (e.g., <code>DISALLOW_FILE_EDIT</code>).</li>
              <li>Modifying filesystem permissions on core files and directories.</li>
              <li>Cleaning transient transients or database records.</li>
            </ul>
            <div
              style={{
                background: 'rgba(16, 185, 129, 0.06)',
                border: '1px solid rgba(16, 185, 129, 0.25)',
                borderRadius: '8px',
                padding: '1.25rem 1.5rem',
                marginBottom: '1rem',
              }}
            >
              <strong style={{ color: 'var(--gold-bright)' }}>Mandatory Prerequisite:</strong>
              <p style={{ margin: '0.5rem 0 0', fontSize: '0.95rem' }}>
                You are solely responsible for taking and verifying a full off-site backup (database and all files) of your
                WordPress site <strong>before</strong> executing any automated or manual hardening fix. We strongly
                recommend performing all fix operations on a staging or development clone before applying changes to a live
                production environment.
              </p>
            </div>
            <p>
              The Developer assumes no liability for site downtime, locked administration sessions, data loss, or server
              misconfigurations resulting from applied hardening rules.
            </p>
          </section>

          {/* Section 4: No Guarantee of Security Outcomes */}
          <section style={{ marginBottom: '2.5rem' }}>
            <h2 style={{ fontSize: '1.35rem', color: 'var(--text-primary)', marginBottom: '0.75rem', fontWeight: 700 }}>
              4. No Guarantee of Security Outcomes
            </h2>
            <p style={{ marginBottom: '1rem' }}>
              <strong>{PLUGIN_CONFIG.name}</strong> is an agency Standard Operating Procedure (SOP) checklist, audit,
              hardening, and vulnerability assessment utility. <strong>It is NOT a firewall replacement, an incident response service, or an absolute guarantee of site invulnerability.</strong>
            </p>
            <p style={{ marginBottom: '1rem' }}>
              Cybersecurity is an evolving discipline. Zero-day exploits, compromised third-party extensions, stolen administrative
              credentials, social engineering, and vulnerabilities outside the scope of WordPress cannot be prevented
              solely by configuration hardening.
            </p>
            <p>
              Achieving a 100% score on the plugin checklist significantly hardens your defensive posture against common
              attack vectors, but does not provide an infallible guarantee against intrusion.
            </p>
          </section>

          {/* Section 5: Support Scope Statement */}
          <section style={{ marginBottom: '2.5rem' }}>
            <h2 style={{ fontSize: '1.35rem', color: 'var(--text-primary)', marginBottom: '0.75rem', fontWeight: 700 }}>
              5. Support Scope Statement
            </h2>
            <p style={{ marginBottom: '1rem' }}>
              Support is provided on a best-effort, community basis through our official channels:
            </p>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                gap: '1rem',
                marginBottom: '1.5rem',
              }}
            >
              <div
                style={{
                  background: 'rgba(255, 255, 255, 0.02)',
                  border: '1px solid var(--border)',
                  borderRadius: '8px',
                  padding: '1.25rem',
                }}
              >
                <div style={{ color: 'var(--gold-bright)', fontWeight: 600, marginBottom: '0.5rem' }}>
                  ✓ Included in Support
                </div>
                <ul style={{ paddingLeft: '1.25rem', margin: 0, fontSize: '0.9rem' }}>
                  <li>Reporting reproducible bugs in plugin code.</li>
                  <li>Inaccurate check outputs or false positives in audits.</li>
                  <li>Clarification of documentation and checklist rules.</li>
                  <li>Compatibility issues with supported WordPress core versions (5.8+).</li>
                </ul>
              </div>
              <div
                style={{
                  background: 'rgba(255, 255, 255, 0.02)',
                  border: '1px solid var(--border)',
                  borderRadius: '8px',
                  padding: '1.25rem',
                }}
              >
                <div style={{ color: '#f87171', fontWeight: 600, marginBottom: '0.5rem' }}>
                  ✕ Outside Support Scope
                </div>
                <ul style={{ paddingLeft: '1.25rem', margin: 0, fontSize: '0.9rem' }}>
                  <li>Remediating existing malware infections or post-hack cleanup.</li>
                  <li>Custom PHP, theme, or plugin development.</li>
                  <li>Server administration, reverse proxy, or OS-level tuning.</li>
                  <li>Guaranteed response times or enterprise Service Level Agreements (SLAs).</li>
                </ul>
              </div>
            </div>
            <p>
              To file a report or request assistance, please consult the{' '}
              <Link
                href={`/plugin/${PLUGIN_CONFIG.slug}/support`}
                style={{ color: 'var(--gold-bright)', textDecoration: 'underline' }}
              >
                Support Page
              </Link>{' '}
              or open an issue on the{' '}
              <a
                href={`${PLUGIN_CONFIG.githubRepoUrl}/issues`}
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: 'var(--gold-bright)', textDecoration: 'underline' }}
              >
                GitHub Issues Tracker
              </a>
              .
            </p>
          </section>

          {/* Section 6: Third-Party Services */}
          <section style={{ marginBottom: '2.5rem' }}>
            <h2 style={{ fontSize: '1.35rem', color: 'var(--text-primary)', marginBottom: '0.75rem', fontWeight: 700 }}>
              6. Third-Party Feeds and External APIs
            </h2>
            <p>
              The Plugin offers optional integrations with external feeds (e.g. Patchstack, GitHub Security Advisories,
              NVD, OSV, CISA KEV, WPScan). These feeds are operated by independent third parties with their own terms and
              availability policies. The Developer makes no guarantees regarding the uptime, uninterrupted continuity, or
              accuracy of third-party feeds. Please review our{' '}
              <Link
                href={`/plugin/${PLUGIN_CONFIG.slug}/privacy-policy`}
                style={{ color: 'var(--gold-bright)', textDecoration: 'underline' }}
              >
                Privacy Policy
              </Link>{' '}
              for external service terms and data transmission details.
            </p>
          </section>

          {/* Section 7: Updates to Terms */}
          <section style={{ marginBottom: '1.5rem' }}>
            <h2 style={{ fontSize: '1.35rem', color: 'var(--text-primary)', marginBottom: '0.75rem', fontWeight: 700 }}>
              7. Governing Law and Modifications
            </h2>
            <p style={{ marginBottom: '1rem' }}>
              We reserve the right to modify these Terms of Use at any time. Any changes will be published directly to this
              page with an updated revision date. Your continued use of the Plugin constitutes agreement to any revised terms.
            </p>
            <p style={{ margin: 0 }}>
              Questions concerning these terms may be directed to{' '}
              <a
                href={`mailto:${PLUGIN_CONFIG.supportEmail}`}
                style={{ color: 'var(--gold-bright)', textDecoration: 'underline' }}
              >
                {PLUGIN_CONFIG.supportEmail}
              </a>
              .
            </p>
          </section>

          <footer
            style={{
              marginTop: '2.5rem',
              paddingTop: '1.5rem',
              borderTop: '1px solid var(--border, #2a2f38)',
              fontSize: '0.85rem',
              color: 'var(--text-muted)',
              display: 'flex',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: '1rem',
            }}
          >
            <span>Last Updated: {PLUGIN_CONFIG.updatedDate}</span>
            <span>License: GNU General Public License v2.0 or later</span>
          </footer>
        </article>

        {/* Back link */}
        <div style={{ marginTop: '2.5rem', textAlign: 'center' }}>
          <Link
            href={`/plugin/${PLUGIN_CONFIG.slug}`}
            style={{
              color: 'var(--text-secondary)',
              textDecoration: 'none',
              fontSize: '0.9rem',
              transition: 'color 0.2s',
            }}
          >
            ← Back to {PLUGIN_CONFIG.name} Overview
          </Link>
        </div>
      </main>

      <Footer />
    </div>
  );
}
