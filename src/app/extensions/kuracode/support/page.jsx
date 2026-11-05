import React from 'react';
import Link from 'next/link';
import styles from '../kuracode.module.css';
import { KURACODE_FACTS } from '@/data/kuracode/facts';
import PlaceholderChip from '@/components/kuracode/PlaceholderChip';

export const metadata = {
  title: 'KuraCode Support & Issue Tracker',
  description: 'Get help, report bugs, request features, and troubleshoot KuraCode.',
  alternates: {
    canonical: 'https://genioussonu.me/extensions/kuracode/support',
  },
};

export default function SupportPage() {
  return (
    <div className="max-w-4xl mx-auto py-8">
      {/* Breadcrumbs */}
      <nav className={styles.breadcrumbs} aria-label="Breadcrumb">
        <Link href="/extensions/kuracode" className={styles.breadcrumbLink}>KuraCode</Link>
        <span className={styles.breadcrumbSeparator}>/</span>
        <span className={styles.breadcrumbCurrent}>Support</span>
      </nav>

      <div className="mb-12">
        <h1 className="text-3xl md:text-4xl font-extrabold text-text-primary mb-3">
          KuraCode Support &amp; Help Center
        </h1>
        <p className="text-base text-text-muted">
          Need assistance or encountered an issue with code capture? Reach out directly or check existing documentation.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
        <div className="p-6 rounded-xl border border-border bg-surface-1 flex flex-col justify-between">
          <div>
            <h2 className="text-lg font-bold text-text-primary mb-2">Frequently Asked Questions</h2>
            <p className="text-sm text-text-muted mb-4">
              Explore 20+ verified technical answers covering privacy, keyboard shortcuts, code cleaning, and local storage.
            </p>
          </div>
          <Link href="/extensions/kuracode/faq" className="text-sm font-mono text-gold hover:underline">
            View FAQ Directory →
          </Link>
        </div>

        <div className="p-6 rounded-xl border border-border bg-surface-1 flex flex-col justify-between">
          <div>
            <h2 className="text-lg font-bold text-text-primary mb-2">GitHub Issue Tracker</h2>
            <p className="text-sm text-text-muted mb-4">
              Report bugs, submit edge-case snippet samples that failed cleaning, or request new IDE integrations.
            </p>
          </div>
          <a
            href={KURACODE_FACTS.owner.repositoryUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm font-mono text-emerald-400 hover:underline"
          >
            Open GitHub Issues →
          </a>
        </div>
      </div>

      <section className="p-8 rounded-2xl border border-border bg-surface-1">
        <h2 className="text-xl font-bold text-text-primary mb-3">Direct Support Channel</h2>
        <p className="text-sm text-text-secondary leading-relaxed mb-4">
          For security inquiries, store review verifications, or urgent developer feedback, contact the project owner directly:
        </p>
        <div className="flex items-center gap-3 text-sm font-mono text-text-primary">
          <span>Support Contact:</span>
          <PlaceholderChip label={KURACODE_FACTS.owner.supportEmail} fallback="contact@genioussonu.me" />
        </div>
      </section>
    </div>
  );
}

