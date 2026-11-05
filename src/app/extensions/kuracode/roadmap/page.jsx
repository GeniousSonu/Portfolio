import React from 'react';
import Link from 'next/link';
import styles from '../kuracode.module.css';
import { KURACODE_ROADMAP } from '@/data/kuracode/roadmap';

export const metadata = {
  title: 'KuraCode Roadmap — Feature Pipeline & Status',
  description: 'Verified status of KuraCode features across local-first core, team collaboration, and ecosystem integrations.',
  alternates: {
    canonical: 'https://genioussonu.me/extensions/kuracode/roadmap',
  },
};

export default function RoadmapPage() {
  return (
    <div className="max-w-4xl mx-auto py-8">
      {/* Breadcrumbs */}
      <nav className={styles.breadcrumbs} aria-label="Breadcrumb">
        <Link href="/extensions/kuracode" className={styles.breadcrumbLink}>KuraCode</Link>
        <span className={styles.breadcrumbSeparator}>/</span>
        <span className={styles.breadcrumbCurrent}>Roadmap</span>
      </nav>

      <div className="mb-12">
        <h1 className="text-3xl md:text-4xl font-extrabold text-text-primary mb-3">
          Product Roadmap &amp; Feature Status
        </h1>
        <p className="text-base text-text-muted">
          We strictly label all capabilities as Available, Coming soon, or Planned so you always know what is real today.
        </p>
      </div>

      <div className="space-y-10">
        {KURACODE_ROADMAP.map((phase, pIdx) => (
          <div key={pIdx} className="p-8 rounded-2xl border border-border bg-surface-1">
            <div className="flex justify-between items-center mb-6 pb-4 border-b border-border flex-wrap gap-2">
              <h2 className="text-xl font-bold text-text-primary">{phase.phase}</h2>
              <span className="text-xs font-mono font-medium px-2.5 py-1 rounded bg-surface-2 border border-border text-gold">
                {phase.status}
              </span>
            </div>

            <ul className="space-y-3">
              {phase.items.map((item, iIdx) => (
                <li
                  key={iIdx}
                  className="flex justify-between items-center py-2 px-3 rounded-lg hover:bg-surface-2/60 transition-colors text-sm"
                >
                  <span className="text-text-primary font-medium">{item.name}</span>
                  <span
                    className={`font-mono text-xs px-2 py-0.5 rounded border ${
                      item.status === 'Available'
                        ? 'bg-emerald-950/40 text-emerald-400 border-emerald-800/40'
                        : item.status === 'Coming soon'
                        ? 'bg-amber-950/40 text-amber-400 border-amber-800/40'
                        : 'bg-surface-2 text-text-muted border-border'
                    }`}
                  >
                    {item.status}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}
