import React from 'react';
import Link from 'next/link';
import styles from '../kuracode.module.css';
import { KURACODE_LICENSES } from '@/data/kuracode/licenses';

export const metadata = {
  title: 'KuraCode Open Source Licenses & Notices',
  description: 'Legal notices, copyright attributions, and third-party software licenses used in KuraCode.',
  alternates: {
    canonical: 'https://genioussonu.me/extensions/kuracode/licenses',
  },
};

export default function LicensesPage() {
  return (
    <div className="max-w-4xl mx-auto py-8">
      {/* Breadcrumbs */}
      <nav className={styles.breadcrumbs} aria-label="Breadcrumb">
        <Link href="/extensions/kuracode" className={styles.breadcrumbLink}>KuraCode</Link>
        <span className={styles.breadcrumbSeparator}>/</span>
        <span className={styles.breadcrumbCurrent}>Licenses</span>
      </nav>

      <div className="mb-10">
        <h1 className="text-3xl font-extrabold text-text-primary mb-3">
          Open Source Licenses &amp; Third-Party Notices
        </h1>
        <p className="text-base text-text-muted">
          KuraCode is built on open-source software and transparent licensing standards.
        </p>
      </div>

      <div className="space-y-6">
        {KURACODE_LICENSES.map((pkg, idx) => (
          <div key={idx} className="p-6 rounded-xl border border-border bg-surface-1">
            <div className="flex justify-between items-start mb-2 flex-wrap gap-2">
              <h2 className="text-lg font-bold text-text-primary">{pkg.name}</h2>
              <span className="text-xs font-mono px-2 py-0.5 rounded bg-surface-2 border border-border text-gold">
                {pkg.license}
              </span>
            </div>
            <div className="text-xs text-text-muted font-mono mb-3">
              Version: {pkg.version} • Author: {pkg.author}
            </div>
            <p className="text-sm text-text-secondary mb-4 leading-relaxed">
              {pkg.description}
            </p>
            <a
              href={pkg.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs font-mono text-emerald-400 hover:underline inline-flex items-center gap-1"
            >
              <span>View License Source</span>
              <span>↗</span>
            </a>
          </div>
        ))}
      </div>
    </div>
  );
}

