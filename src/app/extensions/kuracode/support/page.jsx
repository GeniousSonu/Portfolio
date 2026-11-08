import React from 'react';
import Link from 'next/link';
import styles from '../kuracode.module.css';
import { KURACODE_FACTS } from '@/data/kuracode/facts';

export const metadata = {
  title: 'KuraCode Support — Documentation, Issues & Help Channels',
  description:
    'Get help with KuraCode, report code-cleaning edge cases on GitHub, check keyboard shortcut conflicts, and browse documentation.',
  alternates: {
    canonical: 'https://genioussonu.me/extensions/kuracode/support',
  },
};

export default function SupportPage() {
  return (
    <div>
      {/* Breadcrumbs */}
      <nav className={styles.breadcrumbs} aria-label="Breadcrumbs">
        <Link href="/extensions/kuracode" className={styles.breadcrumbLink}>
          KuraCode
        </Link>
        <span className={styles.breadcrumbSeparator}>/</span>
        <span className={styles.breadcrumbCurrent}>Support</span>
      </nav>

      {/* Page Header */}
      <header className={styles.pageHeader}>
        <div className={styles.pageHeaderBadge}>HELP &amp; COMMUNITY</div>
        <h1 className={styles.pageTitle}>Support &amp; Issue Tracker</h1>
        <p className={styles.pageSubtitle}>
          Encountered a bug, a snippet that failed cleaning, or need help setting up keyboard shortcuts? Use the verified channels below.
        </p>
      </header>

      {/* Main Support Grid */}
      <div className={styles.supportGrid}>
        {/* Card 1: Documentation & FAQs */}
        <div className={styles.supportCard}>
          <div>
            <div className={styles.supportCardIcon}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
                <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
              </svg>
            </div>
            <h2 className={styles.supportCardTitle}>Documentation &amp; FAQ</h2>
            <p className={styles.supportCardDesc}>
              Read technical answers on local-first storage, keyboard shortcuts, least-privilege browser permissions, and data export.
            </p>
          </div>
          <div className="flex flex-col gap-2 pt-2">
            <Link href="/extensions/kuracode/faq" className={styles.supportAction}>
              <span>Browse 20+ FAQ Answers</span>
              <span>→</span>
            </Link>
            <Link href="/extensions/kuracode/docs" className={styles.supportAction}>
              <span>View Core Documentation</span>
              <span>→</span>
            </Link>
          </div>
        </div>

        {/* Card 2: GitHub Issue Tracker */}
        <div className={styles.supportCard}>
          <div>
            <div className={styles.supportCardIcon}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="8" x2="12" y2="12" />
                <line x1="12" y1="16" x2="12.01" y2="16" />
              </svg>
            </div>
            <h2 className={styles.supportCardTitle}>GitHub Issue Tracker</h2>
            <p className={styles.supportCardDesc}>
              Report bugs, submit code snippets that failed sanitization, or request new editor integrations directly on the repository.
            </p>
          </div>
          <div className="pt-2">
            <a
              href={`${KURACODE_FACTS.owner.repositoryUrl}/issues`}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.supportAction}
            >
              <span>Open GitHub Issues</span>
              <span>↗</span>
            </a>
          </div>
        </div>

        {/* Card 3: Interactive Sandbox */}
        <div className={styles.supportCard}>
          <div>
            <div className={styles.supportCardIcon}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="16 18 22 12 16 6" />
                <polyline points="8 6 2 12 8 18" />
              </svg>
            </div>
            <h2 className={styles.supportCardTitle}>Sanitizer Sandbox</h2>
            <p className={styles.supportCardDesc}>
              Test how KuraCode cleans numbered code, shell prompts, and handles Python indentation before installing the extension.
            </p>
          </div>
          <div className="pt-2">
            <Link href="/extensions/kuracode/demo" className={styles.supportAction}>
              <span>Launch Interactive Demo</span>
              <span>→</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Troubleshooting Common Issues */}
      <section className="mb-12 p-6 rounded-xl border border-border-subtle bg-surface-card">
        <h2 className="text-lg font-bold text-text-primary mb-3 flex items-center gap-2">
          <span>Troubleshooting Common Scenarios</span>
        </h2>
        <div className="space-y-4 text-sm text-text-secondary leading-relaxed">
          <div>
            <strong className="text-text-primary font-mono text-xs block mb-1">
              Shortcut does not trigger on a webpage?
            </strong>
            <p className="text-text-muted">
              Some websites capture key combinations. Open your browser shortcut manager (for Chromium browsers:{' '}
              <code className="text-xs font-mono text-gold px-1.5 py-0.5 rounded bg-surface-2 border border-border-subtle">
                chrome://extensions/shortcuts
              </code>) to customize your capture key combination.
            </p>
          </div>
          <div>
            <strong className="text-text-primary font-mono text-xs block mb-1">
              Want to capture code inside Private or Incognito windows?
            </strong>
            <p className="text-text-muted">
              By default, KuraCode does not persist private session snippets. You can enable extension execution in incognito mode within your browser extension manager settings.
            </p>
          </div>
          <div>
            <strong className="text-text-primary font-mono text-xs block mb-1">
              Data backups and exports?
            </strong>
            <p className="text-text-muted">
              You can export your complete snippet collection as JSON or structured Markdown files directly from the extension popup at any time.
            </p>
          </div>
        </div>
      </section>

      {/* Direct Contact */}
      <section className={styles.directContactCard}>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <h2 className="text-lg font-bold text-text-primary mb-1">Direct Developer Contact</h2>
            <p className="text-sm text-text-muted max-w-xl">
              For security vulnerability disclosures, store review inquiries, or enterprise questions, reach out through the verified contact portal.
            </p>
          </div>
          <Link href="/contact" className={styles.secondaryBtn}>
            <span>Contact Developer</span>
            <span>→</span>
          </Link>
        </div>
      </section>
    </div>
  );
}
