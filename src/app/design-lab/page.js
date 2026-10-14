import React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import styles from './designLab.module.css';

export const metadata = {
  title: 'Design Lab // Warm Editorial Craft Tokens & Components',
  description: 'Internal design system verification laboratory for Stage 5 Pilot.',
  robots: { index: false, follow: false },
};

export default function DesignLabPage() {
  // Guarded to development and preview environments only
  if (process.env.NODE_ENV === 'production' && !process.env.VERCEL_ENV) {
    notFound();
  }

  return (
    <main className={styles.labMain}>
      <header className={styles.labHeader}>
        <div className={styles.telemetryTag}>[ STAGE 5 PILOT // DESIGN SYSTEM SPECIMEN ]</div>
        <h1 className={styles.labTitle}>Design Engineering Laboratory</h1>
        <p className={styles.labSubtitle}>
          Verifying tokens, typography tension, hairline brass frames, and interactive tactile components for the Warm Editorial Craft art direction.
        </p>
        <div className={styles.navRow}>
          <Link href="/" className={styles.linkChip}>← Return to Home</Link>
          <Link href="/projects/iot-cold-chain-patent" className={styles.linkChip}>View Patent Case Study →</Link>
        </div>
      </header>

      {/* Section 1: Color Palette & Design Tokens */}
      <section className={styles.labSection}>
        <h2 className={styles.sectionHeader}>01 / Calibrated Color Tokens</h2>
        <div className={styles.swatchGrid}>
          <div className={styles.swatchCard} style={{ background: 'var(--void)' }}>
            <span className={styles.swatchLabel}>--void</span>
            <span className={styles.swatchHex}>#0B0D0E</span>
          </div>
          <div className={styles.swatchCard} style={{ background: 'var(--surface-obsidian)' }}>
            <span className={styles.swatchLabel}>--surface-obsidian</span>
            <span className={styles.swatchHex}>#131619</span>
          </div>
          <div className={styles.swatchCard} style={{ background: 'var(--surface-card)' }}>
            <span className={styles.swatchLabel}>--surface-card</span>
            <span className={styles.swatchHex}>#15181C</span>
          </div>
          <div className={styles.swatchCard} style={{ background: 'var(--gold)', color: '#0B0D0E' }}>
            <span className={styles.swatchLabel}>--gold</span>
            <span className={styles.swatchHex}>#D4AF37</span>
          </div>
          <div className={styles.swatchCard} style={{ background: 'var(--gold-bright)', color: '#0B0D0E' }}>
            <span className={styles.swatchLabel}>--gold-bright</span>
            <span className={styles.swatchHex}>#F59E0B</span>
          </div>
          <div className={styles.swatchCard} style={{ background: 'var(--signal)', color: '#0B0D0E' }}>
            <span className={styles.swatchLabel}>--signal</span>
            <span className={styles.swatchHex}>#10B981</span>
          </div>
          <div className={styles.swatchCard} style={{ background: 'var(--text-primary)', color: '#0B0D0E' }}>
            <span className={styles.swatchLabel}>--text-primary</span>
            <span className={styles.swatchHex}>#ECEAE4</span>
          </div>
          <div className={styles.swatchCard} style={{ background: 'var(--text-secondary)', color: '#0B0D0E' }}>
            <span className={styles.swatchLabel}>--text-secondary</span>
            <span className={styles.swatchHex}>#A1A1AA</span>
          </div>
        </div>
      </section>

      {/* Section 2: Typographic Scale */}
      <section className={styles.labSection}>
        <h2 className={styles.sectionHeader}>02 / Typographic Voices & Scale</h2>
        <div className={styles.typeSpecimenCard}>
          <div className={styles.typeRow}>
            <span className={styles.typeMeta}>Display Hero (72px / -0.04em)</span>
            <h1 className={styles.displayHero}>SK Sahinur Islam</h1>
          </div>
          <div className={styles.typeRow}>
            <span className={styles.typeMeta}>Headline XL (48px / -0.035em)</span>
            <h2 className={styles.headlineXl}>Design Engineer &amp; Patentee</h2>
          </div>
          <div className={styles.typeRow}>
            <span className={styles.typeMeta}>Headline LG (32px / -0.03em)</span>
            <h3 className={styles.headlineLg}>Architecting Resilient Real-Time Systems</h3>
          </div>
          <div className={styles.typeRow}>
            <span className={styles.typeMeta}>Body Large (18px / 1.65 line-height)</span>
            <p className={styles.bodyLg}>
              Bridging low-level hardware cryptography, distributed edge protocols, and high-fidelity interface design. Verified patent holder for tamper-proof IoT telemetry with hardware-enforced logging.
            </p>
          </div>
          <div className={styles.typeRow}>
            <span className={styles.typeMeta}>Technical Monospace Telemetry (13px / tabular numerals)</span>
            <p className={styles.codeTelemetry}>
              PATENT_APP_NO: 202431057476 // STATUS: GRANTED_2025 // ATECC608B: READY // LATENCY: 14.2ms
            </p>
          </div>
        </div>
      </section>

      {/* Section 3: Tactile Frame Primitives */}
      <section className={styles.labSection}>
        <h2 className={styles.sectionHeader}>03 / Hairline Brass Frames &amp; Metrics Tiles</h2>
        <div className={styles.componentGrid}>
          {/* Executive Metric Tile */}
          <div className={styles.metricTile}>
            <div className={styles.metricHeader}>
              <span className={styles.metricLabel}>PATENT REGISTRY</span>
              <span className={styles.statusPip} />
            </div>
            <div className={styles.metricValue}>1</div>
            <div className={styles.metricDesc}>Granted Indian Patent (2025) in IoT Cold-Chain Monitoring</div>
          </div>

          {/* Metric Tile 2 */}
          <div className={styles.metricTile}>
            <div className={styles.metricHeader}>
              <span className={styles.metricLabel}>VERIFIED CREDENTIALS</span>
              <span className={styles.statusPip} />
            </div>
            <div className={styles.metricValue}>30+</div>
            <div className={styles.metricDesc}>Cloud, Cybersecurity &amp; Distributed Systems Accreditations</div>
          </div>

          {/* Metric Tile 3 */}
          <div className={styles.metricTile}>
            <div className={styles.metricHeader}>
              <span className={styles.metricLabel}>LIVE TELEMETRY</span>
              <span className={styles.statusPip} />
            </div>
            <div className={styles.metricValue}>14.2ms</div>
            <div className={styles.metricDesc}>Edge WebRTC / WebSocket Ingress Latency (Kolkata DC)</div>
          </div>
        </div>
      </section>

      {/* Section 4: Interactive States & Controls */}
      <section className={styles.labSection}>
        <h2 className={styles.sectionHeader}>04 / Tactile Action Controls</h2>
        <div className={styles.controlsRow}>
          <button type="button" className={styles.btnPrimary}>
            <span>Primary Brass Action</span>
            <span className={styles.btnArrow} aria-hidden="true">→</span>
          </button>

          <button type="button" className={styles.btnSecondary}>
            <span>Secondary Hairline Action</span>
          </button>

          <button type="button" className={styles.btnGhost}>
            <span>Ghost Monospace Trigger [Cmd+K]</span>
          </button>

          <div className={styles.filterGroup} role="tablist" aria-label="Sample filters">
            <button type="button" className={`${styles.filterTab} ${styles.filterTabActive}`} role="tab" aria-selected="true">
              All Systems
            </button>
            <button type="button" className={styles.filterTab} role="tab" aria-selected="false">
              Hardware
            </button>
            <button type="button" className={styles.filterTab} role="tab" aria-selected="false">
              Cloud
            </button>
          </div>
        </div>
      </section>
    </main>
  );
}
