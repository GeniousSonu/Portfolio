import React from 'react';
import Link from 'next/link';
import styles from '../kuracode.module.css';
import { KURACODE_FACTS } from '@/data/kuracode/facts';
import PlaceholderChip from '@/components/kuracode/PlaceholderChip';

export const metadata = {
  title: 'KuraCode Terms of Service',
  description: 'Pre-release terms governing usage of the KuraCode extension and documentation.',
  alternates: {
    canonical: 'https://genioussonu.me/extensions/kuracode/terms',
  },
};

export default function TermsPage() {
  return (
    <div className="max-w-4xl mx-auto py-8">
      {/* Breadcrumbs */}
      <nav className={styles.breadcrumbs} aria-label="Breadcrumb">
        <Link href="/extensions/kuracode" className={styles.breadcrumbLink}>KuraCode</Link>
        <span className={styles.breadcrumbSeparator}>/</span>
        <span className={styles.breadcrumbCurrent}>Terms of Service</span>
      </nav>

      <article className="p-8 md:p-10 rounded-2xl border border-border bg-surface-1">
        <header className="mb-8 border-b border-border pb-6">
          <h1 className="text-3xl font-extrabold text-text-primary mb-2">
            KuraCode Terms of Service
          </h1>
          <p className="text-xs font-mono text-text-muted">
            Last Updated: {KURACODE_FACTS.lastUpdated} • Pre-Release Developer Utility
          </p>
        </header>

        <section className="space-y-6 text-sm text-text-secondary leading-relaxed">
          <h2 className="text-xl font-bold text-text-primary">1. Nature of the Software</h2>
          <p>
            KuraCode is provided as a local-first browser extension utility intended to assist developers in capturing, organizing, and retrieving code snippets. The preview version is offered free of charge.
          </p>

          <h2 className="text-xl font-bold text-text-primary">2. User Responsibilities &amp; Code Licensing</h2>
          <p>
            When capturing code from external web pages, you acknowledge that you are responsible for complying with the applicable copyright, license, and attribution requirements of the third-party source repository or webpage. KuraCode provides provenance reminders but does not constitute legal licensing validation.
          </p>

          <h2 className="text-xl font-bold text-text-primary">3. No Warranty &amp; Limitation of Liability</h2>
          <p>
            The software is provided on an &ldquo;as is&rdquo; basis without warranties of any kind. As code is stored locally on your device, you are encouraged to regularly export your snippets as JSON or Markdown backups.
          </p>
        </section>

        <footer className="mt-12 pt-6 border-t border-border flex justify-between items-center text-xs font-mono text-text-muted flex-wrap gap-2">
          <div>
            <span>Licensor: </span>
            <PlaceholderChip label={KURACODE_FACTS.owner.legalName} />
          </div>
          <Link href="/extensions/kuracode/privacy" className="text-gold hover:underline">
            View Privacy Policy →
          </Link>
        </footer>
      </article>
    </div>
  );
}

