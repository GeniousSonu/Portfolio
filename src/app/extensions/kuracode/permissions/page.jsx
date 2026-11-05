import React from 'react';
import Link from 'next/link';
import styles from '../kuracode.module.css';
import { KURACODE_PERMISSIONS } from '@/data/kuracode/permissions';

export const metadata = {
  title: 'KuraCode Browser Permissions & Disclosures',
  description: 'Detailed explanation of why KuraCode requests activeTab, contextMenus, and storage permissions.',
  alternates: {
    canonical: 'https://genioussonu.me/extensions/kuracode/permissions',
  },
};

export default function PermissionsPage() {
  return (
    <div className="max-w-4xl mx-auto py-8">
      {/* Breadcrumbs */}
      <nav className={styles.breadcrumbs} aria-label="Breadcrumb">
        <Link href="/extensions/kuracode" className={styles.breadcrumbLink}>KuraCode</Link>
        <span className={styles.breadcrumbSeparator}>/</span>
        <span className={styles.breadcrumbCurrent}>Permissions</span>
      </nav>

      <div className="mb-10">
        <h1 className="text-3xl font-extrabold text-text-primary mb-3">
          Browser Permissions &amp; Disclosures
        </h1>
        <p className="text-base text-text-muted">
          Transparent technical breakdown of every manifest permission requested by KuraCode.
        </p>
      </div>

      {/* Single-Purpose Statement */}
      <div className="p-6 rounded-xl border border-gold/40 bg-surface-1 mb-10">
        <h2 className="text-sm font-bold text-gold uppercase tracking-wider font-mono mb-2">
          Store Compliance: Single-Purpose Statement
        </h2>
        <p className="text-base text-text-primary font-medium leading-relaxed">
          &ldquo;{KURACODE_PERMISSIONS.singlePurposeStatement}&rdquo;
        </p>
      </div>

      {/* Permissions Table */}
      <div className="overflow-x-auto rounded-xl border border-border bg-surface-1 mb-12">
        <table className="w-full text-left text-sm border-collapse">
          <thead>
            <tr className="border-b border-border bg-surface-2 text-xs font-mono text-text-muted uppercase">
              <th className="p-4">Permission</th>
              <th className="p-4">Purpose &amp; Justification</th>
              <th className="p-4">Data Accessed</th>
              <th className="p-4">Transmitted?</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/60">
            {KURACODE_PERMISSIONS.permissions.map((item, idx) => (
              <tr key={idx} className="hover:bg-surface-2/40 transition-colors">
                <td className="p-4 font-mono font-bold text-emerald-400">
                  {item.permission}
                </td>
                <td className="p-4 text-text-secondary leading-relaxed">
                  {item.justification}
                </td>
                <td className="p-4 text-xs font-mono text-text-muted">
                  {item.dataAccessed}
                </td>
                <td className="p-4 font-mono text-xs text-text-primary">
                  {item.transmittedRemotely}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

