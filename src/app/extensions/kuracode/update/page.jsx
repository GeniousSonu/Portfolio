import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import styles from '../kuracode.module.css';
import { KURACODE_FACTS } from '@/data/kuracode/facts';

export const metadata = {
  title: 'KuraCode Update — What&apos;s New',
  robots: {
    index: false,
    follow: false,
  },
};

export default function UpdatePage() {
  return (
    <div className={styles.quietWrapper}>
      <div className="flex items-center gap-3 mb-8">
        <Image src="/assets/kuracode/kuracode-icon.svg" alt="KuraCode Logo" width={32} height={32} />
        <div>
          <h1 className="text-2xl font-bold text-text-primary">KuraCode Updated</h1>
          <div className="text-xs font-mono text-gold">Current Version: {KURACODE_FACTS.version}</div>
        </div>
      </div>

      <div className="p-6 rounded-2xl border border-border bg-surface-1 mb-8 space-y-4">
        <h2 className="text-base font-bold text-text-primary">Release Highlights</h2>
        <ul className="space-y-2 text-sm text-text-secondary list-disc pl-5 leading-relaxed">
          <li>Local-first code capture engine with sub-50ms execution speed.</li>
          <li>Refined line number and terminal prompt ($) cleaning heuristics.</li>
          <li>Accurate whitespace and indentation preservation.</li>
          <li>Pre-save secret scanner auditing for exposed tokens and private keys.</li>
        </ul>
      </div>

      <div className="flex gap-4">
        <Link href="/extensions/kuracode/changelog" className={styles.primaryBtn}>
          <span>View Full Changelog</span>
        </Link>
        <Link href="/extensions/kuracode" className={styles.secondaryBtn}>
          <span>Back to Overview</span>
        </Link>
      </div>
    </div>
  );
}
