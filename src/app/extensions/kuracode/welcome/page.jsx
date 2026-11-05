import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import styles from '../kuracode.module.css';

export const metadata = {
  title: 'Welcome to KuraCode — Quick Start',
  robots: {
    index: false,
    follow: false,
  },
};

export default function WelcomePage() {
  return (
    <div className={styles.quietWrapper}>
      <div className="flex items-center gap-3 mb-8">
        <Image src="/assets/kuracode/kuracode-icon.svg" alt="KuraCode Logo" width={32} height={32} />
        <h1 className="text-2xl font-bold text-text-primary">Welcome to KuraCode</h1>
      </div>

      <div className="space-y-6 text-sm text-text-secondary leading-relaxed mb-10">
        <p>
          KuraCode is installed and active in your browser. All code you save stays on your machine with zero cloud sync and zero analytics.
        </p>

        <div className="p-5 rounded-xl border border-border bg-surface-1 space-y-4">
          <h2 className="text-base font-bold text-text-primary">First 3 Steps to Get Started</h2>
          <div className="flex items-start gap-3">
            <span className="font-mono text-emerald-400 font-bold">1.</span>
            <div>
              <strong className="text-text-primary">Highlight Code:</strong> Select any code snippet on any webpage (GitHub, Stack Overflow, blog).
            </div>
          </div>
          <div className="flex items-start gap-3">
            <span className="font-mono text-emerald-400 font-bold">2.</span>
            <div>
              <strong className="text-text-primary">Press Hotkey:</strong> Press <code className="px-2 py-0.5 rounded bg-surface-2 font-mono text-gold">Alt + Shift + S</code> (or <code className="px-2 py-0.5 rounded bg-surface-2 font-mono text-gold">⌥ + ⇧ + S</code> on macOS) to save.
            </div>
          </div>
          <div className="flex items-start gap-3">
            <span className="font-mono text-emerald-400 font-bold">3.</span>
            <div>
              <strong className="text-text-primary">Search Anytime:</strong> Press <code className="px-2 py-0.5 rounded bg-surface-2 font-mono text-gold">Alt + Shift + Y</code> to instantly fuzzy-search and copy your saved snippets.
            </div>
          </div>
        </div>
      </div>

      <div className="flex gap-4">
        <Link href="/extensions/kuracode/demo" className={styles.primaryBtn}>
          <span>Try Interactive Demo</span>
        </Link>
        <Link href="/extensions/kuracode/docs" className={styles.secondaryBtn}>
          <span>Documentation</span>
        </Link>
      </div>
    </div>
  );
}
