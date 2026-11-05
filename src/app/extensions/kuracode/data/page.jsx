import React from 'react';
import Link from 'next/link';
import styles from '../kuracode.module.css';
import { KURACODE_LEGAL } from '@/data/kuracode/legal';

export const metadata = {
  title: 'KuraCode Data & Storage Architecture',
  description: 'Technical explanation of how code data is isolated, indexed, and stored on your workstation.',
  alternates: {
    canonical: 'https://genioussonu.me/extensions/kuracode/data',
  },
};

export default function DataArchitecturePage() {
  return (
    <div className="max-w-4xl mx-auto py-8">
      {/* Breadcrumbs */}
      <nav className={styles.breadcrumbs} aria-label="Breadcrumb">
        <Link href="/extensions/kuracode" className={styles.breadcrumbLink}>KuraCode</Link>
        <span className={styles.breadcrumbSeparator}>/</span>
        <span className={styles.breadcrumbCurrent}>Data Architecture</span>
      </nav>

      <article className="p-8 md:p-10 rounded-2xl border border-border bg-surface-1">
        <header className="mb-8 border-b border-border pb-6">
          <h1 className="text-3xl font-extrabold text-text-primary mb-3">
            {KURACODE_LEGAL.dataPolicy.title}
          </h1>
          <p className="text-base text-text-muted">
            {KURACODE_LEGAL.dataPolicy.description}
          </p>
        </header>

        <section className="space-y-6 text-sm text-text-secondary leading-relaxed">
          <h2 className="text-xl font-bold text-text-primary">Local Storage Technology</h2>
          <p>
            KuraCode utilizes the browser&apos;s native <strong>IndexedDB</strong> database engine to store your code snippets, tags, notes, and collections. IndexedDB provides high-performance structured storage capable of managing thousands of snippets without slowing down your browser.
          </p>

          <h2 className="text-xl font-bold text-text-primary">Data Isolation &amp; Host Security</h2>
          <p>
            The extension runs in an isolated content script execution environment. Other browser tabs, malicious websites, and third-party scripts cannot query, read, or alter your KuraCode snippet database.
          </p>

          <h2 className="text-xl font-bold text-text-primary">Backup &amp; Migration</h2>
          <p>
            Because data lives locally, clearing your browser&apos;s application data or unchecking extension storage will remove snippets. We strongly recommend using the built-in <strong>Export to JSON</strong> or <strong>Export to Markdown</strong> utility before performing browser cache purges or system migrations.
          </p>
        </section>
      </article>
    </div>
  );
}

