import React from 'react';
import Link from 'next/link';
import styles from './caseStudy.module.css';

export const metadata = {
  title: 'Case Study: Solar IoT Vaccine Preservation Patent // SK Sahinur Islam',
  description:
    'Architectural case study on Indian Patent No. 544062 (App No. 202531060002 A): a solar-powered IoT vaccine preservation system with real-time MQTT telemetry and zone-wise Peltier cooling.',
};

const PATENT_DOCUMENT_URL =
  'https://drive.google.com/drive/folders/1SXCzHl1WOz646EWjiQHYuhG6BGNPTMfJ?usp=sharing';

export default function PatentCaseStudyPage() {
  return (
    <main className={styles.caseStudyArticle} data-route="/projects/iot-cold-chain-patent">
        <nav className={styles.backNav} aria-label="Breadcrumb navigation">
          <Link href="/projects" className={styles.backLink}>
            <span aria-hidden="true">←</span> Return to Flagship Works
          </Link>
          <span className={styles.docId}>PATENT_SPEC_DOC // CLASSIFICATION: A61B, F25D, H02J</span>
        </nav>

        <header className={styles.heroHeader}>
          <div className={styles.statusRow}>
            <span className={styles.patentBadge}>
              <span className={styles.statusPip} aria-hidden="true" />
              OFFICIALLY GRANTED // GOVT. OF INDIA (JUL 2025)
            </span>
            <span className={styles.appNo}>APP NO: 202531060002 A</span>
          </div>

          <h1 className={styles.title}>
            Solar-Powered IoT Vaccine Preservation with Real-Time MQTT Telemetry
          </h1>

          <p className={styles.summaryLead}>
            An autonomous cold-chain architecture for off-grid rural healthcare logistics. Solar
            power, zone-wise thermoelectric regulation, and continuous temperature telemetry keep
            vaccines inside their safe storage window without depending on an unstable grid.
          </p>

          <div className={styles.metricsBar}>
            <div className={styles.metricItem}>
              <span className={styles.metricVal}>2–8 °C</span>
              <span className={styles.metricLabel}>VACCINE STORAGE WINDOW</span>
            </div>
            <div className={styles.metricItem}>
              <span className={styles.metricVal}>Solar PV</span>
              <span className={styles.metricLabel}>PRIMARY POWER SOURCE</span>
            </div>
            <div className={styles.metricItem}>
              <span className={styles.metricVal}>MQTT / TLS</span>
              <span className={styles.metricLabel}>TELEMETRY TRANSPORT</span>
            </div>
            <div className={styles.metricItem}>
              <span className={styles.metricVal}>Zone-wise</span>
              <span className={styles.metricLabel}>PELTIER REGULATION</span>
            </div>
          </div>
        </header>

        <section className={styles.chapterSection}>
          <div className={styles.chapterTag}>[ BEAT 01 // PROBLEM LANDSCAPE ]</div>
          <h2 className={styles.chapterTitle}>Last-Mile Cold Chains Without Reliable Power</h2>
          <div className={styles.proseBlock}>
            <p>
              Vaccines lose potency when they leave their recommended temperature window. Rural
              immunisation routes face exactly the conditions that make this hard to prevent:
              intermittent grid supply, long transit legs, and limited refrigeration infrastructure.
            </p>
            <p>Conventional approaches break down in three places:</p>
            <ul className={styles.bulletList}>
              <li>
                <strong>Grid-dependent refrigeration:</strong> Compressor-based units stop holding
                temperature as soon as supply drops, which is precisely when remote clinics and
                vehicles need them most.
              </li>
              <li>
                <strong>Periodic manual checks:</strong> A reading taken twice a day cannot show the
                excursion that happened in between, so spoilage is discovered after the fact.
              </li>
              <li>
                <strong>Costly per-unit tagging:</strong> RFID-based tracking stacks add hardware
                and reader infrastructure that small healthcare programmes cannot justify.
              </li>
            </ul>
          </div>
        </section>

        <section className={styles.chapterSection}>
          <div className={styles.chapterTag}>[ SYSTEM SCHEMATIC // FIG. 01 ]</div>
          <h2 className={styles.chapterTitle}>5-Stage Hardware &amp; Firmware Topology</h2>

          <div className={styles.schematicGrid}>
            <div className={styles.schematicCard}>
              <div className={styles.stageNum}>STAGE 01</div>
              <h3 className={styles.stageName}>Temperature Sensing</h3>
              <p className={styles.stageDesc}>
                Calibrated DS18B20 digital probes sample the storage chamber continuously, giving the
                controller a reliable picture of the actual vaccine environment.
              </p>
              <div className={styles.stageChip}>SENSOR ARRAY</div>
            </div>

            <div className={styles.schematicCard}>
              <div className={styles.stageNum}>STAGE 02</div>
              <h3 className={styles.stageName}>Embedded Control</h3>
              <p className={styles.stageDesc}>
                A NodeMCU ESP8266 runs the control loop: read, compare against the safe window, drive
                the cooling zones, and queue telemetry for publish.
              </p>
              <div className={styles.stageChip}>ESP8266 CONTROLLER</div>
            </div>

            <div className={styles.schematicCard}>
              <div className={styles.stageNum}>STAGE 03</div>
              <h3 className={styles.stageName}>Zone-wise Cooling</h3>
              <p className={styles.stageDesc}>
                Thermoelectric Peltier modules regulate the chamber in zones, so cooling effort
                follows the measured load instead of running a single compressor at full duty.
              </p>
              <div className={styles.stageChip}>PELTIER REGULATION</div>
            </div>

            <div className={styles.schematicCard}>
              <div className={styles.stageNum}>STAGE 04</div>
              <h3 className={styles.stageName}>Solar Power Stage</h3>
              <p className={styles.stageDesc}>
                A photovoltaic array with an MPPT charge controller and battery buffer supplies the
                unit, keeping preservation running through grid outages and off-grid transport.
              </p>
              <div className={styles.stageChip}>SOLAR + MPPT</div>
            </div>

            <div className={styles.schematicCard}>
              <div className={styles.stageNum}>STAGE 05</div>
              <h3 className={styles.stageName}>Telemetry &amp; Alerts</h3>
              <p className={styles.stageDesc}>
                Readings publish over MQTT with TLS to a broker-backed dashboard. Breaches of the
                safe window raise immediate alerts and remain in the persistent telemetry log.
              </p>
              <div className={styles.stageChip}>MQTT OVER TLS</div>
            </div>
          </div>
        </section>

        <section className={styles.chapterSection}>
          <div className={styles.chapterTag}>[ BEAT 02 // ARCHITECTURAL DECISIONS ]</div>
          <h2 className={styles.chapterTitle}>Engineering Trade-Offs &amp; Implementation Decisions</h2>
          <div className={styles.proseBlock}>
            <div className={styles.tradeoffCard}>
              <h3 className={styles.tradeoffHeading}>
                Decision 1: Direct ESP8266 Telemetry Instead of RFID Infrastructure
              </h3>
              <p>
                The controller publishes readings itself over Wi-Fi rather than depending on tagged
                packages and reader hardware. That removes the per-unit consumable cost and makes the
                same unit usable in a clinic room, a vehicle, or a field camp with no extra
                infrastructure.
              </p>
            </div>

            <div className={styles.tradeoffCard}>
              <h3 className={styles.tradeoffHeading}>
                Decision 2: Zone-wise Peltier Regulation on a Solar Budget
              </h3>
              <p>
                Thermoelectric modules have no compressor surge current, which suits a solar and
                battery supply. Driving them per zone lets the firmware spend power only where the
                sensors report a rise, and keeps the thermal response even across the chamber.
              </p>
            </div>

            <div className={styles.tradeoffCard}>
              <h3 className={styles.tradeoffHeading}>Decision 3: Telemetry Designed for Auditing</h3>
              <p>
                Every reading is timestamped and persisted, not just displayed live. The value of the
                system is the continuous record: an operator can show the storage history for a
                batch, and an excursion triggers an alert while there is still time to act.
              </p>
            </div>
          </div>
        </section>

        <section className={styles.chapterSection}>
          <div className={styles.chapterTag}>[ BEAT 03 // PATENT VERIFICATION ]</div>
          <h2 className={styles.chapterTitle}>Granted Patent &amp; Official Record</h2>
          <div className={styles.proseBlock}>
            <p>
              The architecture was granted by the Indian Patent Office on 4 July 2025. The grant
              covers the solar-powered preservation apparatus, its zone-wise thermoelectric
              regulation, and the real-time monitoring and alert generation for temperature-sensitive
              vaccine storage.
            </p>
          </div>

          <div className={styles.patentCertCard}>
            <div className={styles.certHeader}>
              <div className={styles.certIcon} aria-hidden="true">
                <svg
                  viewBox="0 0 24 24"
                  width="26"
                  height="26"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8Z" />
                  <path d="M14 2v6h6" />
                  <path d="m8.5 14.5 2.5 2.5 4.5-5" />
                </svg>
              </div>
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
                <span className={styles.certFieldValue}>202531060002 A</span>
              </div>
              <div>
                <span className={styles.certFieldLabel}>PATENT NUMBER</span>
                <span className={styles.certFieldValue}>544062</span>
              </div>
              <div>
                <span className={styles.certFieldLabel}>DATE OF GRANT</span>
                <span className={styles.certFieldValue}>4 July 2025</span>
              </div>
            </div>
          </div>
        </section>

        <footer className={styles.caseStudyFooter}>
          <Link href="/projects" className={styles.footerBackBtn}>
            ← Back to Projects
          </Link>
          <a
            href={PATENT_DOCUMENT_URL}
            target="_blank"
            rel="noopener noreferrer"
            className={styles.footerContactBtn}
          >
            View Official Patent Document ↗
          </a>
        </footer>
      </main>
  );
}
