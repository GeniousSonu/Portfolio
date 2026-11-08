import React from 'react';
import Link from 'next/link';
import styles from '../kuracode.module.css';
import { KURACODE_ROADMAP } from '@/data/kuracode/roadmap';

export const metadata = {
  title: 'KuraCode Roadmap — Verified Feature Pipeline & Delivery Status',
  description:
    'Track the current status of KuraCode features across local-first core capabilities, team collaboration, and editor integrations.',
  alternates: {
    canonical: 'https://genioussonu.me/extensions/kuracode/roadmap',
  },
};

function getStatusBadgeClass(status) {
  switch (status) {
    case 'Available':
      return styles.statusAvailable;
    case 'In Progress':
      return styles.statusProgress;
    case 'Coming soon':
      return styles.statusComing;
    default:
      return styles.statusPlanned;
  }
}

export default function RoadmapPage() {
  return (
    <div>
      {/* Breadcrumbs */}
      <nav className={styles.breadcrumbs} aria-label="Breadcrumbs">
        <Link href="/extensions/kuracode" className={styles.breadcrumbLink}>
          KuraCode
        </Link>
        <span className={styles.breadcrumbSeparator}>/</span>
        <span className={styles.breadcrumbCurrent}>Roadmap</span>
      </nav>

      {/* Page Header */}
      <header className={styles.pageHeader}>
        <div className={styles.pageHeaderBadge}>DEVELOPMENT PIPELINE</div>
        <h1 className={styles.pageTitle}>Product Roadmap &amp; Feature Status</h1>
        <p className={styles.pageSubtitle}>
          We clearly delineate what is operational in the current extension build versus features currently in development or planned for subsequent releases.
        </p>
      </header>

      {/* Status Legend */}
      <div className="flex items-center gap-3 flex-wrap text-xs font-mono mb-8 p-3 rounded-xl border border-border-subtle bg-surface-card">
        <span className="text-text-muted">Legend:</span>
        <span className={`${styles.statusBadge} ${styles.statusAvailable}`}>Available (In Build)</span>
        <span className={`${styles.statusBadge} ${styles.statusProgress}`}>In Progress (Store Packaging)</span>
        <span className={`${styles.statusBadge} ${styles.statusComing}`}>Coming Soon (Next Milestone)</span>
        <span className={`${styles.statusBadge} ${styles.statusPlanned}`}>Planned (Future Pipeline)</span>
      </div>

      {/* Roadmap Phases */}
      <div className="space-y-10">
        {KURACODE_ROADMAP.map((phase, pIdx) => (
          <section key={pIdx} className={styles.roadmapPhase}>
            <div className={styles.roadmapPhaseHeader}>
              <div>
                <h2 className={styles.roadmapPhaseTitle}>{phase.phase}</h2>
                <span className="text-xs font-mono text-gold font-medium mt-1 inline-block">
                  {phase.stage}
                </span>
              </div>
              <span className={`${styles.statusBadge} ${phase.status.includes('Progress') ? styles.statusProgress : phase.status.includes('Coming') ? styles.statusComing : styles.statusPlanned}`}>
                {phase.status}
              </span>
            </div>

            <p className={styles.roadmapPhaseDesc}>{phase.description}</p>

            <div className={styles.roadmapGrid}>
              {phase.items.map((item, iIdx) => (
                <div key={iIdx} className={styles.roadmapCard}>
                  <div className={styles.roadmapCardHeader}>
                    <h3 className={styles.roadmapCardTitle}>{item.name}</h3>
                    <span className={`${styles.statusBadge} ${getStatusBadgeClass(item.status)}`}>
                      {item.status}
                    </span>
                  </div>
                  <p className={styles.roadmapCardDesc}>{item.description}</p>
                </div>
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
