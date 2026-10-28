import React from 'react';
import Link from 'next/link';
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
      email: 'sahinurislamm2002@gmail.com',
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
    <main className={styles.legalPage} data-route="/imprint">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaData) }}
      />
      <div className={styles.ambientGlow} aria-hidden="true" />

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
            <span className={styles.badgeDot} />
            <span>Statutory Declaration · Section 5 TMG / Indian IT Act 2000</span>
          </div>
          <h1 className={styles.title}>Imprint &amp; Operator Notice</h1>
          <p className={styles.subtitle}>
            Official legal identity, regulatory representation, intellectual property declarations, and institutional contact channels.
          </p>
          <div className={styles.metaRow}>
            <span>Effective: October 2026</span>
            <span className={styles.metaDivider}>•</span>
            <span>Version: 3.0</span>
            <span className={styles.metaDivider}>•</span>
            <span>Jurisdiction: Kolkata, West Bengal, India</span>
          </div>
        </header>

        {/* Quick Jump Table of Contents */}
        <nav className={styles.toc} aria-label="Table of Contents">
          <div className={styles.tocHeader}>Navigation &amp; Sections</div>
          <div className={styles.tocGrid}>
            {sections.map((sec) => (
              <a key={sec.id} href={`#${sec.id}`} className={styles.tocItem}>
                <span className={styles.tocNum}>{sec.num}</span>
                <span className={styles.tocTitle}>{sec.title}</span>
              </a>
            ))}
          </div>
        </nav>

        <article className={styles.content}>
          {/* 01. Operator & Entity Information */}
          <section id="operator" className={styles.section}>
            <h2 className={styles.sectionTitle}>
              <span className={styles.sectionNumber}>01</span> Operator &amp; Entity Information
            </h2>
            <p className={styles.paragraph}>
              This digital platform, associated software sub-domains, and engineering services are owned, architected, and operated by:
            </p>
            <div className={styles.callout}>
              <div className={styles.calloutHeader}>Operator Legal Identity</div>
              <p className={styles.paragraph} style={{ margin: 0 }}>
                <strong className={styles.highlightText}>SK Sahinur Islam</strong> (known professionally as <em>Genious Sonu</em>)<br />
                Senior Web Application Developer, Co-Founder of WEFIK, and IT Systems Engineer.<br />
                Kolkata, West Bengal, India
              </p>
            </div>
            <p className={styles.paragraph}>
              Operating as an independent technology specialist and software engineer. All professional contracts, licensing agreements, and project deliverables are executed under the laws of the Republic of India.
            </p>
          </section>

          {/* 02. Official Contact & Regulatory Channels */}
          <section id="contact" className={styles.section}>
            <h2 className={styles.sectionTitle}>
              <span className={styles.sectionNumber}>02</span> Official Contact &amp; Regulatory Channels
            </h2>
            <p className={styles.paragraph}>
              For regulatory communications, statutory inquiries, enterprise engagements, or security vulnerability disclosures:
            </p>
            <ul className={styles.bulletList}>
              <li className={styles.bulletItem}>
                <strong className={styles.highlightText}>Direct Electronic Mail:</strong>{' '}
                <a href="mailto:sahinurislamm2002@gmail.com" className={styles.breadcrumbLink}>
                  sahinurislamm2002@gmail.com
                </a>{' '}
                / <a href="mailto:talk2sahinur@gmail.com" className={styles.breadcrumbLink}>talk2sahinur@gmail.com</a>
              </li>
              <li className={styles.bulletItem}>
                <strong className={styles.highlightText}>Interactive Web Portal:</strong>{' '}
                <Link href="/contact" className={styles.breadcrumbLink}>
                  Official Encrypted Contact Interface (/contact)
                </Link>
              </li>
              <li className={styles.bulletItem}>
                <strong className={styles.highlightText}>Agency Inquiries:</strong>{' '}
                <a href="mailto:info@wefik.in" className={styles.breadcrumbLink}>
                  info@wefik.in
                </a>{' '}
                (WEFIK Operations)
              </li>
            </ul>
          </section>

          {/* 03. Privacy & Data Protection Officer */}
          <section id="privacy-policy-ref" className={styles.section}>
            <h2 className={styles.sectionTitle}>
              <span className={styles.sectionNumber}>03</span> Privacy &amp; Data Protection Officer
            </h2>
            <p className={styles.paragraph}>
              Detailed disclosures regarding technical telemetry, cookie consent protocols via Google Consent Mode v2, and third-party sub-processors (Vercel, Supabase, Firebase, Sanity, Resend, Telegram, Google AI) are codified in our comprehensive Privacy Policy:
            </p>
            <div className={styles.callout}>
              <div className={styles.calloutHeader}>Data Protection Inquiries</div>
              <p className={styles.paragraph} style={{ margin: 0 }}>
                The data controller for this platform under the Digital Personal Data Protection Act 2023 (DPDP Act) and General Data Protection Regulation (GDPR) is SK Sahinur Islam. To exercise rights of erasure, access, correction, or consent revocation, consult our{' '}
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
              All technical writeups, cybersecurity guides, architectural diagrams, and code snippets are published for informational, educational, and research purposes only.
            </p>
          </section>

          {/* 05. External Links & Third-Party Referrals */}
          <section id="external-links" className={styles.section}>
            <h2 className={styles.sectionTitle}>
              <span className={styles.sectionNumber}>05</span> External Links &amp; Third-Party Referrals
            </h2>
            <p className={styles.paragraph}>
              Our platform contains hyperlinks to third-party web domains (such as GitHub repositories, WordPress plugins, Spotify playlists, and technology documentation). The operator possesses no control over the content, security policies, or privacy practices of these external websites.
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
              Open-source software projects and software utilities featured on this portfolio are governed by their respective permissive licenses (e.g., MIT, Apache 2.0, GPLv2/v3).
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
                Notice: The statements on this page represent automated statutory declarations compiled according to standard architectural practices and owner guidelines. Users and commercial counterparties are advised that these texts do not constitute formal legal counsel.
              </p>
            </div>
          </section>
        </article>

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
            <Link href="/bot/privacy-policy" className={styles.legalNavLink}>
              Bot Privacy Policy
            </Link>
          </div>
          <Link href="/contact" className={styles.contactBtn}>
            <span>Official Contact Form</span> →
          </Link>
        </nav>
      </div>
    </main>
  );
}
