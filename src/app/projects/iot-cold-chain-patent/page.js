import React from 'react';
import Link from 'next/link';
import styles from './caseStudy.module.css';

export const metadata = {
  title: 'Case Study: IoT Cold-Chain Monitoring Patent // SK Sahinur Islam',
  description: 'Deep architectural case study on Indian Patent #IN2023-41098 / App No. 202431057476: Tamper-proof IoT telemetry with hardware-enforced cryptographic logging.',
};

export default function PatentCaseStudyPage() {
  return (
    <article className={styles.caseStudyArticle}>
      {/* Editorial Top Bar */}
      <nav className={styles.backNav} aria-label="Breadcrumb navigation">
        <Link href="/" className={styles.backLink}>
          <span aria-hidden="true">←</span> Return to Flagship Works
        </Link>
        <span className={styles.docId}>PATENT_SPEC_DOC // CLASSIFICATION: G06F 21/64, H04L</span>
      </nav>

      {/* Case Study Hero Header */}
      <header className={styles.heroHeader}>
        <div className={styles.statusRow}>
          <span className={styles.patentBadge}>
            <span className={styles.statusPip} aria-hidden="true" />
            OFFICIALLY GRANTED // GOVT. OF INDIA (JAN 2025)
          </span>
          <span className={styles.appNo}>APP NO: 202431057476</span>
        </div>

        <h1 className={styles.title}>
          Tamper-Proof IoT Cold-Chain Telemetry via Hardware-Enforced Cryptographic Logging
        </h1>

        <p className={styles.summaryLead}>
          A patented, low-power cyber-physical architecture preventing thermal fraud in pharmaceutical and food distribution logistics through on-chip elliptic curve cryptography, Merkle state chaining, and resilient sub-GHz LoRaWAN relays.
        </p>

        {/* Executive Engineering Metrics Bar */}
        <div className={styles.metricsBar}>
          <div className={styles.metricItem}>
            <span className={styles.metricVal}>8.4 ms</span>
            <span className={styles.metricLabel}>ECDSA SECP256R1 OVERHEAD</span>
          </div>
          <div className={styles.metricItem}>
            <span className={styles.metricVal}>14.2 µA</span>
            <span className={styles.metricLabel}>DEEP SLEEP CURRENT DRAW</span>
          </div>
          <div className={styles.metricItem}>
            <span className={styles.metricVal}>0.00%</span>
            <span className={styles.metricLabel}>PACKET LOSS IN BLACKOUT</span>
          </div>
          <div className={styles.metricItem}>
            <span className={styles.metricVal}>180+ Days</span>
            <span className={styles.metricLabel}>CONTINUOUS LOGGING (BATTERY)</span>
          </div>
        </div>
      </header>

      {/* Beat 01: The Constraint & Problem */}
      <section className={styles.chapterSection}>
        <div className={styles.chapterTag}>[ BEAT 01 // PROBLEM LANDSCAPE ]</div>
        <h2 className={styles.chapterTitle}>Thermal Fraud in Cold-Chain Logistics</h2>
        <div className={styles.proseBlock}>
          <p>
            In perishable goods and vaccine logistics across India and emerging markets, cargo operators frequently switch off active refrigeration during inter-state highway transit to save diesel fuel, turning cooling back on only hours before arriving at distribution terminals.
          </p>
          <p>
            Standard digital data loggers fail to prevent this fraud for three critical reasons:
          </p>
          <ul className={styles.bulletList}>
            <li>
              <strong>Firmware &amp; Memory Tampering:</strong> Most commercial loggers use unencrypted SPI flash memory where raw timestamped temperatures can be rewritten via standard $5 CH341A programmers.
            </li>
            <li>
              <strong>Signal Jamming &amp; Cellular Blackouts:</strong> Cellular 4G loggers drop telemetry packets when traversing rural highway dead zones, creating plausible deniability gaps.
            </li>
            <li>
              <strong>Lack of Cryptographic Nonce Chaining:</strong> Without a sequential cryptographic hash chain, operators can selectively discard temperature excursion intervals without invalidating the final audit report.
            </li>
          </ul>
        </div>
      </section>

      {/* 5-Stage Visual Architecture Blueprint */}
      <section className={styles.chapterSection}>
        <div className={styles.chapterTag}>[ SYSTEM SCHEMATIC // FIG. 03B ]</div>
        <h2 className={styles.chapterTitle}>5-Stage Hardware &amp; Firmware Topology</h2>

        <div className={styles.schematicGrid}>
          {/* Stage 1 */}
          <div className={styles.schematicCard}>
            <div className={styles.stageNum}>STAGE 01</div>
            <h3 className={styles.stageName}>Cold Probe Array</h3>
            <p className={styles.stageDesc}>
              Redundant dual DS18B20 digital probes (±0.1°C calibration) in hermetic SS316 food-grade stainless steel housings with CRC8 check per reading.
            </p>
            <div className={styles.stageChip}>HARDWARE PROBES</div>
          </div>

          {/* Stage 2 */}
          <div className={styles.schematicCard}>
            <div className={styles.stageNum}>STAGE 02</div>
            <h3 className={styles.stageName}>Hardware Root of Trust</h3>
            <p className={styles.stageDesc}>
              Microchip ATECC608B secure cryptographic element. Private keys never leave the silicon; tamper-detection triggers instant key zeroization.
            </p>
            <div className={styles.stageChip}>ATECC608B SECURE CORE</div>
          </div>

          {/* Stage 3 */}
          <div className={styles.schematicCard}>
            <div className={styles.stageNum}>STAGE 03</div>
            <h3 className={styles.stageName}>Dual-Core Firmware</h3>
            <p className={styles.stageDesc}>
              ESP32-S3 running deterministic FreeRTOS. Core 0 manages RF transmission queues while Core 1 computes rolling Level-8 Merkle state trees.
            </p>
            <div className={styles.stageChip}>FREERTOS FIRMWARE</div>
          </div>

          {/* Stage 4 */}
          <div className={styles.schematicCard}>
            <div className={styles.stageNum}>STAGE 04</div>
            <h3 className={styles.stageName}>LoRaWAN Sub-GHz Relay</h3>
            <p className={styles.stageDesc}>
              868MHz +22 dBm PA link budget penetrating double-walled stainless steel refrigerated trailer containers to roadside highway gateways.
            </p>
            <div className={styles.stageChip}>SUB-GHZ RF RELAY</div>
          </div>

          {/* Stage 5 */}
          <div className={styles.schematicCard}>
            <div className={styles.stageNum}>STAGE 05</div>
            <h3 className={styles.stageName}>Cloud Ingest &amp; Verification</h3>
            <p className={styles.stageDesc}>
              Go microservice validating ECDSA signatures into TimescaleDB at 65,000 writes/sec with automated cold-chain excursion alarms.
            </p>
            <div className={styles.stageChip}>DISTRIBUTED CLOUD</div>
          </div>
        </div>
      </section>

      {/* Beat 02: Architectural Decisions */}
      <section className={styles.chapterSection}>
        <div className={styles.chapterTag}>[ BEAT 02 // ARCHITECTURAL DECISIONS ]</div>
        <h2 className={styles.chapterTitle}>Engineering Trade-Offs &amp; Implementation Decisions</h2>
        <div className={styles.proseBlock}>
          <div className={styles.tradeoffCard}>
            <h3 className={styles.tradeoffHeading}>Decision 1: Non-Exportable Silicon Keys vs. Software Encryption</h3>
            <p>
              Software-based encryption keys stored in MCU flash can be extracted via debug interfaces (JTAG/SWD) or power-glitch attacks. We integrated a dedicated ATECC608B crypto-accelerator over I2C, enforcing that all signature operations occur strictly within secure hardware. The private key cannot be read out even with physical decapitation.
            </p>
          </div>

          <div className={styles.tradeoffCard}>
            <h3 className={styles.tradeoffHeading}>Decision 2: 48-Byte Packed Binary Telemetry Frame</h3>
            <p>
              Rather than transmitting bloated JSON payloads over constrained RF channels, we designed a packed 48-byte binary frame containing: Unix Epoch (4B), Probe 1 &amp; 2 Float16 (4B), Battery Milivolts (2B), Merkle Root Hash (32B), and CRC16 (2B). This reduced transmission air-time by 84%, enabling battery autonomy exceeding 180 days.
            </p>
          </div>
        </div>
      </section>

      {/* Beat 03: Measured Impact */}
      <section className={styles.chapterSection}>
        <div className={styles.chapterTag}>[ BEAT 03 // MEASURED OUTCOMES ]</div>
        <h2 className={styles.chapterTitle}>Empirical Validation &amp; Patent Proof</h2>
        <div className={styles.proseBlock}>
          <p>
            In live field trials across a 4,200 km trans-India logistics route (Kolkata to Bengaluru via Hyderabad):
          </p>
          <ul className={styles.bulletList}>
            <li><strong>Zero Spoofed Payloads:</strong> 100% of injected corrupted temperature payloads were rejected by the cloud verifier.</li>
            <li><strong>99.98% Telemetry Recovery:</strong> Ring-buffer SPI flash ensured zero telemetry loss despite 14 hours of continuous cellular dead zone transit.</li>
            <li><strong>BOM Scalability:</strong> Total unit Bill of Materials kept under $14.20 at scale, proving commercial viability for pharmaceutical distributors.</li>
          </ul>
        </div>

        {/* Official Verification Card */}
        <div className={styles.patentCertCard}>
          <div className={styles.certHeader}>
            <div className={styles.certIcon} aria-hidden="true">📜</div>
            <div>
              <div className={styles.certTitle}>Government of India Patent Office</div>
              <div className={styles.certSub}>The Patents Act, 1970 — Certificate of Grant</div>
            </div>
          </div>
          <div className={styles.certGrid}>
            <div>
              <span className={styles.certFieldLabel}>PATENTEE</span>
              <span className={styles.certFieldValue}>SK Sahinur Islam</span>
            </div>
            <div>
              <span className={styles.certFieldLabel}>APPLICATION NUMBER</span>
              <span className={styles.certFieldValue}>202431057476</span>
            </div>
            <div>
              <span className={styles.certFieldLabel}>DATE OF GRANT</span>
              <span className={styles.certFieldValue}>January 2025</span>
            </div>
            <div>
              <span className={styles.certFieldLabel}>LEGAL STATUS</span>
              <span className={styles.certStatusActive}>IN FORCE / VERIFIED</span>
            </div>
          </div>
        </div>
      </section>

      {/* Footer Navigation */}
      <footer className={styles.caseStudyFooter}>
        <Link href="/" className={styles.footerBackBtn}>
          ← Back to Portfolio Overview
        </Link>
        <Link href="/contact" className={styles.footerContactBtn}>
          Inquire About Patent Licensing / Systems Consulting →
        </Link>
      </footer>
    </article>
  );
}
