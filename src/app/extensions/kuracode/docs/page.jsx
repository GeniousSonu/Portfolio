import React from 'react';
import Link from 'next/link';
import styles from '../kuracode.module.css';
import { KURACODE_DOCS } from '@/data/kuracode/docs';

export const metadata = {
  title: 'KuraCode Documentation & Guides',
  description: 'Official guides for capturing, organizing, cleaning, and exporting code snippets with KuraCode.',
  alternates: {
    canonical: 'https://genioussonu.me/extensions/kuracode/docs',
  },
};

export default function DocsIndexPage() {
  return (
    <div className="max-w-4xl mx-auto py-8">
      {/* Breadcrumbs */}
      <nav className={styles.breadcrumbs} aria-label="Breadcrumb">
        <Link href="/extensions/kuracode" className={styles.breadcrumbLink}>KuraCode</Link>
        <span className={styles.breadcrumbSeparator}>/</span>
        <span className={styles.breadcrumbCurrent}>Documentation</span>
      </nav>

      <div className="mb-10">
        <h1 className="text-3xl font-extrabold text-text-primary mb-3">
          KuraCode Documentation
        </h1>
        <p className="text-base text-text-muted">
          Master the keyboard-first workflows, capture settings, and local database management.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {KURACODE_DOCS.map((doc) => (
          <Link
            key={doc.slug}
            href={`/extensions/kuracode/docs/${doc.slug}`}
            className="p-6 rounded-xl border border-border bg-surface-1 hover:border-gold/50 transition-all flex flex-col justify-between group"
          >
            <div>
              <h2 className="text-lg font-bold text-text-primary group-hover:text-gold transition-colors mb-2">
                {doc.title}
              </h2>
              <p className="text-sm text-text-muted leading-relaxed">
                {doc.shortDesc}
              </p>
            </div>
            <div className="mt-4 flex items-center text-xs font-mono text-emerald-400 font-semibold gap-1">
              <span>Read guide</span>
              <span>→</span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
