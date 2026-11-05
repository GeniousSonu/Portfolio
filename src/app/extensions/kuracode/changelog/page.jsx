import React from 'react';
import Link from 'next/link';
import styles from '../kuracode.module.css';
import { KURACODE_CHANGELOG } from '@/data/kuracode/changelog';

export const metadata = {
  title: 'KuraCode Changelog — Release Notes & Updates',
  description: 'Version history, updates, bug fixes, and feature additions for KuraCode.',
  alternates: {
    canonical: 'https://genioussonu.me/extensions/kuracode/changelog',
  },
};

export default function ChangelogPage() {
  return (
    <div className="max-w-4xl mx-auto py-8">
      {/* Breadcrumbs */}
      <nav className={styles.breadcrumbs} aria-label="Breadcrumb">
        <Link href="/extensions/kuracode" className={styles.breadcrumbLink}>KuraCode</Link>
        <span className={styles.breadcrumbSeparator}>/</span>
        <span className={styles.breadcrumbCurrent}>Changelog</span>
      </nav>

      <div className="mb-12">
        <h1 className="text-3xl md:text-4xl font-extrabold text-text-primary mb-3">
          KuraCode Changelog
        </h1>
        <p className="text-base text-text-muted">
          All notable changes, bug fixes, and architectural revisions documented per release.
        </p>
      </div>

      <div className="space-y-12">
        {KURACODE_CHANGELOG.map((entry) => (
          <article
            key={entry.version}
            id={entry.version}
            className="p-8 rounded-2xl border border-border bg-surface-1 relative"
          >
            <header className="flex justify-between items-center mb-6 pb-4 border-b border-border flex-wrap gap-2">
              <div>
                <a
                  href={`#${entry.version}`}
                  className="text-2xl font-extrabold text-text-primary hover:text-gold transition-colors inline-flex items-center gap-2"
                >
                  <span>v{entry.version}</span>
                  <span className="text-sm font-mono text-text-muted">#</span>
                </a>
                <h2 className="text-base font-semibold text-text-secondary mt-1">{entry.title}</h2>
              </div>
              <div className="text-right">
                <span className="inline-block text-xs font-mono font-medium px-2 py-0.5 rounded bg-surface-2 border border-border text-emerald-400">
                  {entry.status}
                </span>
                <div className="text-xs text-text-muted font-mono mt-1">{entry.date}</div>
              </div>
            </header>

            <ul className="space-y-2 text-sm text-text-primary list-disc pl-5">
              {entry.highlights.map((item, idx) => (
                <li key={idx} className="leading-relaxed">
                  {item}
                </li>
              ))}
            </ul>
          </article>
        ))}
      </div>
    </div>
  );
}

