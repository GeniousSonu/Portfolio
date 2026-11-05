import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import styles from './kuracode/kuracode.module.css';

export const metadata = {
  title: 'Browser Extensions — Developer Tools by SK Sahinur Islam',
  description: 'Production browser extensions for developer productivity, code organization, and web engineering.',
  alternates: {
    canonical: 'https://genioussonu.me/extensions',
  },
};

export default function ExtensionsIndexPage() {
  return (
    <div className={styles.wrapper}>
      <div className={styles.ambientGlow} aria-hidden="true" />
      <div className={styles.container}>
        {/* Breadcrumb */}
        <nav className={styles.breadcrumbs} aria-label="Breadcrumb">
          <Link href="/" className={styles.breadcrumbLink}>Home</Link>
          <span className={styles.breadcrumbSeparator}>/</span>
          <span className={styles.breadcrumbCurrent}>Extensions</span>
        </nav>

        <div className="mb-12">
          <h1 className="text-3xl md:text-4xl font-extrabold text-text-primary mb-3">
            Browser Extensions
          </h1>
          <p className="text-base text-text-muted">
            Specialized client-side tools designed for web engineering, security, and developer speed.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="p-8 rounded-2xl border border-border bg-surface-1 flex flex-col justify-between hover:border-gold/50 transition-all">
            <div>
              <div className="flex items-center gap-4 mb-4">
                <Image
                  src="/assets/kuracode/kuracode-icon.svg"
                  alt="KuraCode Logo"
                  width={40}
                  height={40}
                />
                <div>
                  <h2 className="text-xl font-bold text-text-primary">KuraCode</h2>
                  <span className="text-xs font-mono text-gold">Code Snippet Manager</span>
                </div>
              </div>

              <p className="text-sm text-text-secondary leading-relaxed mb-6">
                Save code from anywhere on the web in one click, keep where it came from, find it again instantly, and share it with your team. Local-first architecture with zero account required.
              </p>
            </div>

            <div className="flex items-center justify-between border-t border-border pt-4">
              <span className="text-xs font-mono text-emerald-400 font-semibold">● Pre-Release Preview</span>
              <Link href="/extensions/kuracode" className="text-sm font-mono text-gold hover:underline font-bold">
                Explore KuraCode →
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

