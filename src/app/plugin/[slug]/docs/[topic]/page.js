import React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { PLUGIN_CONFIG, ALL_PLUGINS } from '@/config/plugin';
import { DOCS_TOPICS } from '@/data/pluginDocs';
import { SOP_SECTIONS, PLUGIN_TASKS } from '@/data/pluginTasks';
import styles from '../docs.module.css';

export async function generateStaticParams() {
  const params = [];
  for (const plugin of ALL_PLUGINS) {
    for (const topic of DOCS_TOPICS) {
      params.push({ slug: plugin.slug, topic: topic.slug });
    }
  }
  return params;
}

export async function generateMetadata({ params }) {
  const { slug, topic } = await params;
  if (slug !== PLUGIN_CONFIG.slug) return {};

  const currentTopic = DOCS_TOPICS.find((t) => t.slug === topic);
  if (!currentTopic) return {};

  const title = `${currentTopic.title} — ${PLUGIN_CONFIG.name} Docs`;
  const description = currentTopic.shortDesc;
  const canonicalUrl = `https://www.genioussonu.me/plugin/${PLUGIN_CONFIG.slug}/docs/${topic}`;

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

export default async function PluginDocsTopicPage({ params }) {
  const { slug, topic } = await params;
  if (slug !== PLUGIN_CONFIG.slug) notFound();

  const currentTopicIndex = DOCS_TOPICS.findIndex((t) => t.slug === topic);
  if (currentTopicIndex === -1) notFound();

  const currentTopic = DOCS_TOPICS[currentTopicIndex];
  const prevTopic = currentTopicIndex > 0 ? DOCS_TOPICS[currentTopicIndex - 1] : null;
  const nextTopic =
    currentTopicIndex < DOCS_TOPICS.length - 1 ? DOCS_TOPICS[currentTopicIndex + 1] : null;

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
          <Link
            href={`/plugin/${PLUGIN_CONFIG.slug}/docs`}
            className={styles.breadcrumbLink}
          >
            docs
          </Link>
          <span className={styles.breadcrumbSeparator}>/</span>
          <span className={styles.breadcrumbCurrent}>{currentTopic.slug}</span>
        </nav>

        <div className={styles.docsLayout}>
          {/* Docs Sidebar Navigation */}
          <aside className={styles.sidebar} aria-label="Documentation Navigation">
            <div className={styles.sidebarHeader}>Docs Index</div>
            <nav className={styles.sidebarNav}>
              <Link
                href={`/plugin/${PLUGIN_CONFIG.slug}/docs`}
                className={styles.sidebarLink}
              >
                <span>Overview</span>
              </Link>
              {DOCS_TOPICS.map((t) => {
                const isActive = t.slug === topic;
                return (
                  <Link
                    key={t.slug}
                    href={`/plugin/${PLUGIN_CONFIG.slug}/docs/${t.slug}`}
                    className={`${styles.sidebarLink} ${isActive ? styles.sidebarLinkActive : ''}`}
                    aria-current={isActive ? 'page' : undefined}
                  >
                    <span>{t.title}</span>
                    {isActive && <span>•</span>}
                  </Link>
                );
              })}
            </nav>
          </aside>

          {/* Main Article Content */}
          <article className={styles.article}>
            <header className={styles.articleHeader}>
              <div className={styles.docBadge}>
                <span>◈</span>
                <span>Section {currentTopicIndex + 1} of {DOCS_TOPICS.length}</span>
              </div>
              <h1 className={styles.docTitle}>{currentTopic.title}</h1>
              <p className={styles.docLead}>{currentTopic.shortDesc}</p>
            </header>

            {/* TOPIC 1: INSTALLATION */}
            {topic === 'installation' && (
              <>
                <div className={styles.sectionBlock}>
                  <h2 className={styles.sectionHeading}>System Requirements</h2>
                  <p className={styles.paragraph}>
                    Before installation, verify your hosting environment meets the baseline specs:
                  </p>
                  <ul style={{ paddingLeft: '1.25rem', marginBottom: '1.25rem', color: 'var(--text-secondary)' }}>
                    <li><strong>WordPress:</strong> Version {PLUGIN_CONFIG.requiresWp} or higher (tested up to {PLUGIN_CONFIG.testedUpTo}).</li>
                    <li><strong>PHP:</strong> Version {PLUGIN_CONFIG.requiresPhp} or higher.</li>
                    <li><strong>Web Server:</strong> Apache 2.4+, LiteSpeed, or Nginx 1.18+.</li>
                    <li><strong>Permissions:</strong> Write access to <code>wp-content/plugins/</code> and webroot configuration files during setup.</li>
                  </ul>
                </div>

                <div className={styles.sectionBlock}>
                  <h2 className={styles.sectionHeading}>Method 1: WordPress Admin Upload (Recommended)</h2>
                  <ol style={{ paddingLeft: '1.25rem', marginBottom: '1.25rem', color: 'var(--text-secondary)', lineHeight: '1.8' }}>
                    <li>Download the latest release ZIP from the <a href={PLUGIN_CONFIG.releaseZipUrl} style={{ color: 'var(--gold-bright)' }}>GitHub Releases</a>.</li>
                    <li>Log into your WordPress admin dashboard (<code>/wp-admin/</code>).</li>
                    <li>Navigate to <strong>Plugins &rarr; Add New &rarr; Upload Plugin</strong>.</li>
                    <li>Choose the downloaded ZIP archive and click <strong>Install Now</strong>.</li>
                    <li>Click <strong>Activate Plugin</strong>.</li>
                  </ol>
                </div>

                <div className={styles.sectionBlock}>
                  <h2 className={styles.sectionHeading}>Method 2: Manual Directory Placement</h2>
                  <p className={styles.paragraph}>
                    For agency staging pipelines, Git deployments, or command-line SSH setups:
                  </p>
                  <div className={styles.codeBlock}>
                    # Extract plugin folder directly to WordPress plugins directory<br />
                    cd /var/www/html/wp-content/plugins/<br />
                    unzip genioussonu-site-checkup.zip<br />
                    <br />
                    # Activate via WP-CLI<br />
                    wp plugin activate genioussonu-site-checkup
                  </div>
                </div>

                <div className={styles.callout}>
                  <div className={styles.calloutTitle}>Post-Activation Verification</div>
                  <p>
                    Upon activation, GeniousSonu Site Checkup automatically creates its database tables
                    (<code>wpsg_audit_logs</code>) via WordPress <code>dbDelta()</code> and registers the top-level
                    <strong> Site Checkup</strong> navigation menu.
                  </p>
                </div>
              </>
            )}

            {/* TOPIC 2: GETTING STARTED */}
            {topic === 'getting-started' && (
              <>
                <div className={styles.sectionBlock}>
                  <h2 className={styles.sectionHeading}>Accessing the Site Checkup Dashboard</h2>
                  <p className={styles.paragraph}>
                    Once activated, click the <strong>Site Checkup</strong> top-level menu item in the left
                    navigation bar of your WordPress admin panel.
                  </p>
                  <p className={styles.paragraph}>
                    The dashboard initiates an instant audit across all 64 SOP checklist items, calculating your
                    overall <strong>SOP Coverage Score</strong> (e.g. 0% to 100%).
                  </p>
                </div>

                <div className={styles.sectionBlock}>
                  <h2 className={styles.sectionHeading}>Running Safe Automation (Level A)</h2>
                  <p className={styles.paragraph}>
                    Level A tasks are completely safe, automated, and non-breaking. They include:
                  </p>
                  <ul style={{ paddingLeft: '1.25rem', marginBottom: '1.25rem', color: 'var(--text-secondary)' }}>
                    <li>Disabling XML-RPC via runtime filters and web server rules.</li>
                    <li>Restricting unauthenticated REST API user enumeration.</li>
                    <li>Adding security headers (X-Frame-Options, X-Content-Type-Options, HSTS).</li>
                    <li>Hiding PHP version banners (X-Powered-By).</li>
                    <li>Enforcing strict 640 permissions on <code>wp-config.php</code>.</li>
                  </ul>
                  <p className={styles.paragraph}>
                    Click <strong>Run All Safe Tasks</strong> to execute them sequentially. Each task triggers a
                    client-driven batch request with live visual indicators.
                  </p>
                </div>

                <div className={styles.sectionBlock}>
                  <h2 className={styles.sectionHeading}>Pre-Execution Diff Previews</h2>
                  <p className={styles.paragraph}>
                    Before writing configuration blocks to <code>.htaccess</code> or <code>wp-config.php</code>,
                    GeniousSonu Site Checkup presents a visual diff modal. You can inspect the exact marker-delimited
                    code (e.g. <code># BEGIN GeniousSonu_Site_Checkup</code>) before confirming.
                  </p>
                </div>

                <div className={styles.callout}>
                  <div className={styles.calloutTitle}>Reversible Rollbacks</div>
                  <p>
                    Every automated task includes a 1-click Undo mechanism. If you ever need to revert a rule,
                    simply click <strong>Undo</strong>, and the marker manager cleanly excises only the plugin&apos;s
                    managed block without corrupting custom server directives.
                  </p>
                </div>
              </>
            )}

            {/* TOPIC 3: TASK REFERENCE */}
            {topic === 'task-reference' && (
              <>
                <div className={styles.sectionBlock}>
                  <h2 className={styles.sectionHeading}>Catalog of All 64 SOP Tasks</h2>
                  <p className={styles.paragraph}>
                    The checklist is structured around our agency security SOP, organized across 7 distinct sections
                    and 4 operational levels:
                  </p>
                  <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '1.5rem' }}>
                    <span className={`${styles.levelBadge} ${styles.levelA}`}>Level A: Safe Automation</span>
                    <span className={`${styles.levelBadge} ${styles.levelB}`}>Level B: Guided Bridges</span>
                    <span className={`${styles.levelBadge} ${styles.levelC}`}>Level C: SOP Reminders</span>
                    <span className={`${styles.levelBadge} ${styles.levelD}`}>Level D: Client Reports</span>
                  </div>
                </div>

                {SOP_SECTIONS.map((sec) => {
                  const sectionTasks = PLUGIN_TASKS.filter((t) => t.section === sec.key);
                  return (
                    <div key={sec.key} className={styles.sectionBlock} style={{ marginBottom: '2.5rem' }}>
                      <h3
                        style={{
                          fontSize: '1.15rem',
                          color: 'var(--gold-bright)',
                          marginBottom: '0.4rem',
                          fontFamily: 'var(--font-mono)',
                        }}
                      >
                        {sec.label} ({sectionTasks.length} Tasks)
                      </h3>
                      <p style={{ fontSize: '0.86rem', color: 'var(--text-muted)', marginBottom: '0.75rem' }}>
                        {sec.desc}
                      </p>

                      <div className={styles.taskTableWrapper}>
                        <table className={styles.taskTable}>
                          <thead>
                            <tr>
                              <th style={{ width: '80px' }}>Level</th>
                              <th style={{ width: '220px' }}>Task</th>
                              <th>Description</th>
                            </tr>
                          </thead>
                          <tbody>
                            {sectionTasks.map((t) => (
                              <tr key={t.id}>
                                <td>
                                  <span
                                    className={`${styles.levelBadge} ${
                                      t.level === 'A'
                                        ? styles.levelA
                                        : t.level === 'B'
                                        ? styles.levelB
                                        : t.level === 'C'
                                        ? styles.levelC
                                        : styles.levelD
                                    }`}
                                  >
                                    L-{t.level}
                                  </span>
                                </td>
                                <td>
                                  <strong>{t.title}</strong>
                                </td>
                                <td style={{ fontSize: '0.84rem', lineHeight: '1.5' }}>
                                  {t.description}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  );
                })}
              </>
            )}

            {/* TOPIC 4: RECOMMENDED SETTINGS */}
            {topic === 'recommended-settings' && (
              <>
                <div className={styles.sectionBlock}>
                  <h2 className={styles.sectionHeading}>Server Directives (Apache vs Nginx)</h2>
                  <p className={styles.paragraph}>
                    GeniousSonu Site Checkup detects your server software automatically:
                  </p>
                  <ul style={{ paddingLeft: '1.25rem', marginBottom: '1.25rem', color: 'var(--text-secondary)' }}>
                    <li>
                      <strong>Apache / LiteSpeed:</strong> Security headers and file protection rules are applied
                      directly into <code>.htaccess</code> using isolated, managed marker blocks.
                    </li>
                    <li>
                      <strong>Nginx:</strong> Because Nginx does not read <code>.htaccess</code> files, the plugin marks
                      those tasks as &quot;Server Directive Required&quot; and offers a <strong>View Nginx Snippet</strong> modal
                      with copyable directives for your <code>nginx.conf</code> server block.
                    </li>
                  </ul>
                  <div className={styles.codeBlock}>
                    # Example Nginx Server Directives generated by plugin<br />
                    location ~* /(?:uploads|files)/.*\.php$ &#123; deny all; &#125;<br />
                    location = /xmlrpc.php &#123; deny all; &#125;<br />
                    add_header X-Frame-Options &quot;SAMEORIGIN&quot; always;<br />
                    add_header X-Content-Type-Options &quot;nosniff&quot; always;
                  </div>
                </div>

                <div className={styles.sectionBlock}>
                  <h2 className={styles.sectionHeading}>Third-Party Integrations &amp; Bridges</h2>
                  <p className={styles.paragraph}>
                    For high-stakes security layers, GeniousSonu Site Checkup bridges to mature, specialized tools:
                  </p>
                  <ul style={{ paddingLeft: '1.25rem', marginBottom: '1.25rem', color: 'var(--text-secondary)' }}>
                    <li><strong>Wordfence:</strong> Checks firewall rules, brute-force limits, and email alert routing.</li>
                    <li><strong>Two-Factor Authentication (2FA):</strong> Verifies mandatory 2FA enforcement for all admin accounts.</li>
                    <li><strong>WPS Hide Login:</strong> Inspects custom login URL configurations.</li>
                    <li><strong>security.txt (RFC 9116):</strong> Generates <code>/.well-known/security.txt</code> for responsible disclosure.</li>
                  </ul>
                </div>

                <div className={styles.callout}>
                  <div className={styles.calloutTitle}>Staging Site Protection</div>
                  <p>
                    On staging URLs, ensure HTTP Basic Authentication is active. GeniousSonu Site Checkup detects
                    staging walls and only flags loopback issues on true 5xx server errors, preventing false-positive
                    reverts during automated tests.
                  </p>
                </div>
              </>
            )}

            {/* TOPIC 5: TROUBLESHOOTING & FAQ */}
            {topic === 'troubleshooting' && (
              <>
                <div className={styles.sectionBlock}>
                  <h2 className={styles.sectionHeading}>Emergency Lockout Recovery</h2>
                  <p className={styles.paragraph}>
                    If you configure a custom login URL and forget the secret path, GeniousSonu Site Checkup features a
                    fail-safe filesystem override with <strong>zero query-string backdoors</strong>.
                  </p>
                  <p className={styles.paragraph}>
                    Open your site&apos;s <code>wp-config.php</code> file via FTP, SSH, or your hosting control panel and add:
                  </p>
                  <div className={styles.codeBlock}>
                    define( &apos;WPSG_DISABLE_LOGIN_RENAME&apos;, true );
                  </div>
                  <p className={styles.paragraph}>
                    Save the file. This immediately deactivates the custom login renamer and restores access to the
                    standard <code>/wp-login.php</code> endpoint.
                  </p>
                </div>

                <div className={styles.sectionBlock}>
                  <h2 className={styles.sectionHeading}>Frequently Asked Questions</h2>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', marginTop: '1rem' }}>
                    <div style={{ background: 'var(--surface, #22262e)', padding: '1.25rem', borderRadius: '10px' }}>
                      <h3 style={{ fontSize: '1rem', color: 'var(--text-primary)', marginBottom: '0.4rem' }}>
                        Does the plugin store my database passwords or salts in audit logs?
                      </h3>
                      <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', lineHeight: '1.6' }}>
                        No. The audit logging system includes an automated secret scrubber. Edits to <code>wp-config.php</code>
                        record only constant names and boolean states (e.g. <code>{`{"DISALLOW_FILE_EDIT": true}`}</code>). Salt
                        rotations log <code>{`{"salts_rotated": true}`}</code> with zero key material.
                      </p>
                    </div>

                    <div style={{ background: 'var(--surface, #22262e)', padding: '1.25rem', borderRadius: '10px' }}>
                      <h3 style={{ fontSize: '1rem', color: 'var(--text-primary)', marginBottom: '0.4rem' }}>
                        Does GeniousSonu Site Checkup work on WordPress Multisite?
                      </h3>
                      <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', lineHeight: '1.6' }}>
                        Yes. On WordPress Multisite networks, security settings and checklist task execution are strictly
                        restricted to Super Administrators (<code>is_super_admin()</code>).
                      </p>
                    </div>

                    <div style={{ background: 'var(--surface, #22262e)', padding: '1.25rem', borderRadius: '10px' }}>
                      <h3 style={{ fontSize: '1rem', color: 'var(--text-primary)', marginBottom: '0.4rem' }}>
                        What if an automated task causes a 500 server error?
                      </h3>
                      <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', lineHeight: '1.6' }}>
                        The plugin executes an automated loopback test after modifying server files. If a 5xx response is
                        detected, the change is automatically rolled back to the backup checkpoint within milliseconds.
                      </p>
                    </div>
                  </div>
                </div>
              </>
            )}

            {/* TOPIC 6: UPDATING */}
            {topic === 'updating' && (
              <>
                <div className={styles.sectionBlock}>
                  <h2 className={styles.sectionHeading}>Official WordPress.org Directory Updates</h2>
                  <p className={styles.paragraph}>
                    Once the plugin is approved on the official WordPress.org directory, updates will arrive
                    automatically through the native WordPress updates manager in <strong>Dashboard &rarr; Updates</strong>.
                  </p>
                </div>

                <div className={styles.sectionBlock}>
                  <h2 className={styles.sectionHeading}>Self-Hosted &amp; GitHub Release Updates</h2>
                  <p className={styles.paragraph}>
                    For client agency sites running the standalone or self-hosted build, GeniousSonu Site Checkup includes
                    native integration with the <code>plugin-update-checker</code> library pointing at:
                  </p>
                  <div className={styles.codeBlock}>
                    https://www.genioussonu.me/plugin/genioussonu-site-checkup/update-info.json
                  </div>
                  <p className={styles.paragraph}>
                    This endpoint delivers update notifications and changelog inspection directly to your WordPress
                    admin dashboard, isolated cleanly from WordPress.org.
                  </p>
                </div>

                <div className={styles.sectionBlock}>
                  <h2 className={styles.sectionHeading}>Database Upgrades &amp; Migrations</h2>
                  <p className={styles.paragraph}>
                    When updating between versions (e.g. 1.0.0 to 1.3.1), database schema updates run automatically on
                    the <code>plugins_loaded</code> hook via <code>dbDelta()</code>. No manual SQL commands or database
                    migration scripts are required.
                  </p>
                </div>

                <div className={styles.callout}>
                  <div className={styles.calloutTitle}>Checking Release Notes</div>
                  <p>
                    Review the complete version-by-version changes and bug fixes on the{' '}
                    <Link href={`/plugin/${PLUGIN_CONFIG.slug}/changelog`} style={{ color: 'var(--gold-bright)' }}>
                      Changelog Page
                    </Link>.
                  </p>
                </div>
              </>
            )}

            {/* Pagination Navigation Footer */}
            <div className={styles.paginationFooter}>
              {prevTopic ? (
                <Link
                  href={`/plugin/${PLUGIN_CONFIG.slug}/docs/${prevTopic.slug}`}
                  className={styles.paginationBtn}
                >
                  ← {prevTopic.title}
                </Link>
              ) : (
                <Link
                  href={`/plugin/${PLUGIN_CONFIG.slug}/docs`}
                  className={styles.paginationBtn}
                >
                  ← Docs Overview
                </Link>
              )}

              {nextTopic && (
                <Link
                  href={`/plugin/${PLUGIN_CONFIG.slug}/docs/${nextTopic.slug}`}
                  className={styles.paginationBtn}
                >
                  {nextTopic.title} →
                </Link>
              )}
            </div>
          </article>
        </div>
      </main>

      <Footer />
    </div>
  );
}
