import React from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import styles from '../legal.module.css';

export const metadata = {
  title: 'Imprint & Operator Notice — SK Sahinur Islam (Genious Sonu)',
  description:
    'Official statutory notice, operator disclosure, intellectual property statement, and regulatory contact channels for SK Sahinur Islam.',
  alternates: {
    canonical: 'https://genioussonu.me/imprint',
  },
  openGraph: {
    title: 'Imprint & Legal Operator Notice — SK Sahinur Islam',
    description:
      'Official statutory disclosure, legal identity, regulatory channels, and copyright notices.',
    url: 'https://genioussonu.me/imprint',
    siteName: 'SK Sahinur Islam (Genious Sonu) Portfolio',
    images: [
      {
        url: '/icon-512.png',
        width: 512,
        height: 512,
        alt: 'SK Sahinur Islam Imprint',
      },
    ],
  },
};

// Config flag for commercial/business address (Decision D-02)
const BUSINESS_ADDRESS_CONFIG = {
  hasPublicCommercialAddress: false, // Set to true when owner establishes a dedicated business/office entity
  cityRegion: 'Kolkata, West Bengal, India',
};

export default function ImprintPage() {
  const schemaData = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: 'Imprint & Operator Notice',
    description: 'Official statutory disclosure and operator identity for SK Sahinur Islam.',
    url: 'https://genioussonu.me/imprint',
    publisher: {
      '@type': 'Person',
      name: 'SK Sahinur Islam',
      alternateName: 'Genious Sonu',
      url: 'https://genioussonu.me',
      email: 'talk2sahinur@gmail.com',
    },
  };

  const sections = [
    { id: 'operator', num: '01', title: 'Operator & Entity Information' },
    { id: 'contact', num: '02', title: 'Official Contact & Regulatory Channels' },
    { id: 'privacy-policy-ref', num: '03', title: 'Privacy & Data Protection Officer' },
    { id: 'content-liability', num: '04', title: 'Liability for Content & Editorial Integrity' },
    { id: 'external-links', num: '05', title: 'External Links & Third-Party Referrals' },
    { id: 'ip-copyright', num: '06', title: 'Intellectual Property & Open Source Licenses' },
    { id: 'dispute-resolution', num: '07', title: 'Jurisdiction & Dispute Resolution' },
    { id: 'legal-disclaimer', num: '08', title: 'Statutory Review Notice' },
  ];

  return (
    <main className={styles.legalPage}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaData) }}
      />
      <div className={styles.ambientGlow} aria-hidden="true" />
      <Navbar />

      <div className={styles.container}>
        {/* Breadcrumb Navigation */}
        <nav className={styles.breadcrumbs} aria-label="Breadcrumb navigation">
          <Link href="/" className={styles.breadcrumbLink}>Home</Link>
          <span className={styles.breadcrumbSeparator}>/</span>
          <span className={styles.breadcrumbCurrent}>Imprint &amp; Legal Notice</span>
        </nav>

        {/* Header Block */}
        <header className={styles.header}>
          <div className={styles.badge}>
            <span>●</span> Statutory Operator Disclosure
          </div>
          <h1 className={styles.title}>Imprint &amp; Operator Notice</h1>
          <p className={styles.subtitle}>
            Statutory disclosure of website ownership, operator identity, professional liability, and official contact channels in accordance with international digital media regulations and Indian IT law.
          </p>

          <div className={styles.metaRow}>
            <div className={styles.metaItem}>
              <span className={styles.metaDot} />
              <span>Operator: SK Sahinur Islam</span>
            </div>
            <div className={styles.metaItem}>
              <span>Jurisdiction: Republic of India</span>
            </div>
            <div className={styles.metaItem}>
              <span>Effective Date: October 2026</span>
            </div>
            <div className={styles.complianceTags}>
              <span className={styles.tag}>Information Technology Act 2000</span>
              <span className={styles.tag}>Digital Personal Data Protection Act 2023</span>
              <span className={styles.tag}>GDPR Aligned</span>
            </div>
          </div>
        </header>

        {/* Table of Contents */}
        <nav className={styles.tocCard} aria-label="Table of contents">
          <div className={styles.tocHeader}>
            <div className={styles.tocTitle}>
              <span>[#]</span> Table of Contents
            </div>
            <div className={styles.tocTerminalDots} aria-hidden="true">
              <span className={`${styles.tocDot} ${styles.tocDotRed}`} />
              <span className={`${styles.tocDot} ${styles.tocDotYellow}`} />
              <span className={`${styles.tocDot} ${styles.tocDotGreen}`} />
            </div>
          </div>
          <ol className={styles.tocList}>
            {sections.map((sec) => (
              <li key={sec.id}>
                <a href={`#${sec.id}`} className={styles.tocLink}>
                  <span className={styles.sectionNumber}>{sec.num}</span> {sec.title}
                </a>
              </li>
            ))}
          </ol>
        </nav>

        {/* 01. Operator & Entity Information */}
        <section id="operator" className={styles.section}>
          <h2 className={styles.sectionTitle}>
            <span className={styles.sectionNumber}>01</span> Operator &amp; Entity Information
          </h2>
          <p className={styles.paragraph}>
            This digital platform, portfolio, and associated web engineering applications are developed, published, and maintained exclusively by:
          </p>
          <div className={styles.cardsGrid}>
            <div className={styles.card}>
              <div className={styles.cardTitle}>Full Legal Name</div>
              <p className={styles.cardText}>
                <strong className={styles.highlightText}>SK Sahinur Islam</strong><br />
                Professional Alias: Genious Sonu
              </p>
            </div>
            <div className={styles.card}>
              <div className={styles.cardTitle}>Legal Nature of Platform</div>
              <p className={styles.cardText}>
                Independent Full-Stack Software Engineer, Security Researcher &amp; Digital Creator.
              </p>
            </div>
            <div className={styles.card}>
              <div className={styles.cardTitle}>Geographical Jurisdiction</div>
              <p className={styles.cardText}>
                {BUSINESS_ADDRESS_CONFIG.cityRegion}<br />
                Republic of India
              </p>
            </div>
          </div>

          <div className={styles.callout}>
            <div className={styles.calloutHeader}>Operator Privacy &amp; Physical Address Policy (D-02)</div>
            <p className={styles.paragraph} style={{ margin: 0 }}>
              In accordance with security best practices, safety directives, and applicable digital publication guidelines, private residential and home street addresses are strictly exempt from public disclosure. If a physical corporate address is legally mandated for statutory dispute service, verified notices must be served through official email or registered post upon written confirmation.
            </p>
          </div>
        </section>

        {/* 02. Official Contact & Regulatory Channels */}
        <section id="contact" className={styles.section}>
          <h2 className={styles.sectionTitle}>
            <span className={styles.sectionNumber}>02</span> Official Contact &amp; Regulatory Channels
          </h2>
          <p className={styles.paragraph}>
            For inquiries regarding engineering contracts, editorial feedback, security reports, or statutory communications, please use the following primary communication vectors:
          </p>
          <ul className={styles.bulletList}>
            <li className={styles.bulletItem}>
              <strong className={styles.highlightText}>Direct Electronic Mail:</strong>{' '}
              <a href="mailto:talk2sahinur@gmail.com" className={styles.breadcrumbLink}>
                talk2sahinur@gmail.com
              </a>
            </li>
            <li className={styles.bulletItem}>
              <strong className={styles.highlightText}>Interactive Web Portal:</strong>{' '}
              <Link href="/contact" className={styles.breadcrumbLink}>
                Official Encrypted Contact Interface (/contact)
              </Link>
            </li>
            <li className={styles.bulletItem}>
              <strong className={styles.highlightText}>Responsible Vulnerability Disclosure:</strong> Security researchers discovering potential vulnerabilities in platform infrastructure or sub-components are encouraged to submit reports to the direct email above with PGP encryption or via private GitHub advisory.
            </li>
          </ul>
        </section>

        {/* 03. Privacy & Data Protection Officer */}
        <section id="privacy-policy-ref" className={styles.section}>
          <h2 className={styles.sectionTitle}>
            <span className={styles.sectionNumber}>03</span> Privacy &amp; Data Protection Officer
          </h2>
          <p className={styles.paragraph}>
            Detailed disclosures regarding our collection of technical telemetry, cookie consent protocols via Google Consent Mode v2, and third-party sub-processors (Vercel, Supabase, Firebase, Sanity, Resend, Telegram, Google AI) are codified in our comprehensive Privacy Policy:
          </p>
          <div className={styles.callout}>
            <div className={styles.calloutHeader}>Data Protection Inquiries</div>
            <p className={styles.paragraph} style={{ margin: 0 }}>
              The data controller for this platform under the Digital Personal Data Protection Act 2023 (DPDP Act) and General Data Protection Regulation (GDPR) is SK Sahinur Islam. To exercise your rights of erasure, access, correction, or consent revocation, consult our{' '}
              <Link href="/privacy" className={styles.breadcrumbLink}>
                Privacy Policy (/privacy)
              </Link>{' '}
              or submit an email request.
            </p>
          </div>
        </section>

        {/* 04. Liability for Content & Editorial Integrity */}
        <section id="content-liability" className={styles.section}>
          <h2 className={styles.sectionTitle}>
            <span className={styles.sectionNumber}>04</span> Liability for Content &amp; Editorial Integrity
          </h2>
          <p className={styles.paragraph}>
            As an independent service provider under Section 79 of the Information Technology Act 2000, the operator is responsible for their own editorial content and engineering publications on these pages under general statutory laws.
          </p>
          <p className={styles.paragraph}>
            All technical writeups, cybersecurity guides, architectural diagrams, and code snippets are published for informational, educational, and research purposes only. While technical content is reviewed with utmost rigor for accuracy and safety, the operator accepts no liability for errors, omissions, or downstream outcomes arising from implementation of open-source scripts or code examples in production environments.
          </p>
        </section>

        {/* 05. External Links & Third-Party Referrals */}
        <section id="external-links" className={styles.section}>
          <h2 className={styles.sectionTitle}>
            <span className={styles.sectionNumber}>05</span> External Links &amp; Third-Party Referrals
          </h2>
          <p className={styles.paragraph}>
            Our platform contains hyperlinks to third-party web domains (such as GitHub repositories, WordPress plugins, Spotify playlists, and technology documentation). The operator possesses no control over the content, security policies, or privacy practices of these external websites. The relevant operators or webmasters of those linked domains remain exclusively liable for their respective content.
          </p>
          <p className={styles.paragraph}>
            At the timestamp of linking, all third-party URLs were audited for potential statutory violations. Continuous real-time monitoring of external sites without concrete evidence of a legal infringement is unreasonable. Upon notification of unlawful links, we will purge the corresponding hyperlinks immediately.
          </p>
        </section>

        {/* 06. Intellectual Property & Open Source Licenses */}
        <section id="ip-copyright" className={styles.section}>
          <h2 className={styles.sectionTitle}>
            <span className={styles.sectionNumber}>06</span> Intellectual Property &amp; Open Source Licenses
          </h2>
          <p className={styles.paragraph}>
            All original media, visual assets, custom UI designs, brand lockups, and editorial blog articles produced by the operator are protected under Indian and international copyright conventions.
          </p>
          <p className={styles.paragraph}>
            Open-source software projects and software utilities featured on this portfolio are governed by their respective permissive licenses (e.g., MIT, Apache 2.0, GPLv2/v3 for WordPress plugins). Third-party trademarks, product names, and company logos referenced herein belong to their respective proprietary holders.
          </p>
        </section>

        {/* 07. Jurisdiction & Dispute Resolution */}
        <section id="dispute-resolution" className={styles.section}>
          <h2 className={styles.sectionTitle}>
            <span className={styles.sectionNumber}>07</span> Jurisdiction &amp; Dispute Resolution
          </h2>
          <p className={styles.paragraph}>
            All legal relationships, terms, and disputes arising from or in connection with the utilization of this platform shall be governed exclusively by the substantive laws of the <strong className={styles.highlightText}>Republic of India</strong>, without regard to conflict-of-law principles.
          </p>
          <p className={styles.paragraph}>
            The courts of competent jurisdiction situated in <strong className={styles.highlightText}>Kolkata, West Bengal, India</strong> shall possess exclusive jurisdiction over any claims or proceedings.
          </p>
        </section>

        {/* 08. Statutory Review Notice */}
        <section id="legal-disclaimer" className={styles.section}>
          <h2 className={styles.sectionTitle}>
            <span className={styles.sectionNumber}>08</span> Statutory Review Notice
          </h2>
          <div className={`${styles.callout} ${styles.calloutWarning}`}>
            <div className={styles.calloutHeader}>Legal Professional Review Advisory</div>
            <p className={styles.paragraph} style={{ margin: 0 }}>
              Notice: The statements on this page represent automated statutory declarations compiled according to standard architectural practices and owner guidelines. Users and commercial counterparties are advised that these texts do not constitute formal legal counsel. A qualified legal professional should review all contractual obligations and regulatory instruments for bespoke enterprise engagements.
            </p>
          </div>
        </section>

        {/* Quick Legal Switcher Footer Bar */}
        <nav className={styles.legalNavBlock} aria-label="Legal document switcher">
          <div className={styles.legalLinksGroup}>
            <Link href="/privacy" className={styles.legalNavLink}>
              Privacy Policy
            </Link>
            <Link href="/terms" className={styles.legalNavLink}>
              Terms of Service
            </Link>
            <Link href="/imprint" className={`${styles.legalNavLink} ${styles.legalNavLinkActive}`}>
              Imprint &amp; Notice
            </Link>
          </div>
          <Link href="/contact" className={styles.contactBtn}>
            <span>Official Contact Form</span> →
          </Link>
        </nav>
      </div>

      <Footer />
    </main>
  );
}
