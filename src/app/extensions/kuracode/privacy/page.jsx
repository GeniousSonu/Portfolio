import React from 'react';
import Link from 'next/link';
import styles from '../kuracode.module.css';
import { KURACODE_LEGAL } from '@/data/kuracode/legal';
import { KURACODE_FACTS } from '@/data/kuracode/facts';
import PlaceholderChip from '@/components/kuracode/PlaceholderChip';

export const metadata = {
  title: 'KuraCode Privacy Policy — Local-First Code Data Stance',
  description: 'Learn how KuraCode stores snippets locally on your machine with zero analytics, zero selling of data, and zero cloud tracking.',
  alternates: {
    canonical: 'https://genioussonu.me/extensions/kuracode/privacy',
  },
};

export default function PrivacyPage() {
  return (
    <div className="max-w-4xl mx-auto py-8">
      {/* Breadcrumbs */}
      <nav className={styles.breadcrumbs} aria-label="Breadcrumb">
        <Link href="/extensions/kuracode" className={styles.breadcrumbLink}>KuraCode</Link>
        <span className={styles.breadcrumbSeparator}>/</span>
        <span className={styles.breadcrumbCurrent}>Privacy Policy</span>
      </nav>

      <article className="p-8 md:p-10 rounded-2xl border border-border bg-surface-1">
        <header className="mb-8 border-b border-border pb-6">
          <div className="flex justify-between items-center flex-wrap gap-2 mb-2">
            <h1 className="text-3xl font-extrabold text-text-primary">
              KuraCode Privacy Policy
            </h1>
            <span className="text-xs font-mono text-gold px-2 py-0.5 rounded bg-surface-2 border border-border">
              v{KURACODE_LEGAL.version}
            </span>
          </div>
          <p className="text-xs font-mono text-text-muted">
            Effective Date: {KURACODE_LEGAL.effectiveDate} • Applies to KuraCode Extension &amp; Web Documentation
          </p>
        </header>

        {/* 6-Bullet Executive Summary */}
        <section className="mb-10 p-6 rounded-xl border border-border bg-surface-2/60">
          <h2 className="text-base font-bold text-gold uppercase tracking-wider mb-4 font-mono">
            Key Privacy Commitments (Executive Summary)
          </h2>
          <ul className="space-y-3 text-sm text-text-primary list-disc pl-5">
            {KURACODE_LEGAL.privacySummaryBullets.map((bullet, idx) => (
              <li key={idx} className="leading-relaxed">
                {bullet}
              </li>
            ))}
          </ul>
        </section>

        <section className="space-y-6 text-sm text-text-secondary leading-relaxed">
          <h2 className="text-xl font-bold text-text-primary">1. What Information KuraCode Handles</h2>
          <p>
            When you highlight code on a web page and activate KuraCode, the extension extracts:
          </p>
          <ul className="list-disc pl-5 space-y-1 text-text-primary">
            <li>The selected text block (code snippet).</li>
            <li>The URL of the webpage from which the snippet was captured.</li>
            <li>The title of the page and the nearest HTML heading tag above the selection.</li>
            <li>The timestamp of the capture.</li>
            <li>User-assigned tags and collections.</li>
          </ul>

          <h2 className="text-xl font-bold text-text-primary">2. Local-First Architecture</h2>
          <p>
            All captured snippets, notes, and metadata are persisted exclusively inside your browser local IndexedDB instance. In the current pre-release version, no remote backend exists for user data, and no server connections are established for snippet operations.
          </p>

          <h2 className="text-xl font-bold text-text-primary">3. Zero Third-Party Analytics &amp; Cookies</h2>
          <p>
            The KuraCode extension does not inject Google Analytics, telemetry beacons, or third-party advertising SDKs into your browser. It sets zero cookies. For website visitors browsing documentation on genioussonu.me, visit telemetry is strictly governed by the site-wide cookie consent banner with Google Consent Mode v2 default &apos;denied&apos;.
          </p>

          <h2 className="text-xl font-bold text-text-primary">4. Incognito &amp; Private Browsing Windows</h2>
          <p>
            KuraCode detects when a window is in Incognito or Private mode. To safeguard private workflows, captured snippets in private windows are not committed to persistent storage.
          </p>

          <h2 className="text-xl font-bold text-text-primary">5. User Rights &amp; Data Deletion</h2>
          <p>
            You retain absolute sovereignty over your data. You may export your entire snippet database at any moment in open JSON or Markdown format from the extension settings menu, or execute a permanent local wipe.
          </p>
        </section>

        <footer className="mt-12 pt-6 border-t border-border flex justify-between items-center text-xs font-mono text-text-muted flex-wrap gap-2">
          <div>
            <span>Data Controller: </span>
            <PlaceholderChip label={KURACODE_FACTS.owner.legalName} />
          </div>
          <Link href="/extensions/kuracode/terms" className="text-gold hover:underline">
            View Terms of Service →
          </Link>
        </footer>
      </article>
    </div>
  );
}
