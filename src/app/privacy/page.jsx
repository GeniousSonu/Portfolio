import React from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import styles from '../legal.module.css';

export const metadata = {
  title: 'Privacy Policy — SK Sahinur Islam (Genious Sonu)',
  description:
    'Comprehensive privacy policy detailing data protection, cookie consent protocols, Google Analytics compliance, GDPR, CCPA, and Indian DPDP Act 2023 rights for visitors of SK Sahinur Islam.',
  alternates: {
    canonical: 'https://genioussonu.me/privacy',
  },
  openGraph: {
    title: 'Privacy Policy — SK Sahinur Islam (Genious Sonu)',
    description:
      'Transparent, loophole-free privacy policy explaining data protection, analytics consent, and user rights.',
    url: 'https://genioussonu.me/privacy',
    siteName: 'SK Sahinur Islam (Genious Sonu) Portfolio',
    images: [
      {
        url: '/icon-512.png',
        width: 512,
        height: 512,
        alt: 'SK Sahinur Islam Privacy Policy',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Privacy Policy — SK Sahinur Islam (Genious Sonu)',
    description:
      'Transparent privacy policy covering data handling, cookies, and international data protection compliance.',
    creator: '@GeniousSonu',
    images: ['/icon-512.png'],
  },
};

export default function PrivacyPage() {
  const schemaData = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebPage',
        '@id': 'https://genioussonu.me/privacy/#webpage',
        url: 'https://genioussonu.me/privacy',
        name: 'Privacy Policy — SK Sahinur Islam (Genious Sonu)',
        description: 'Privacy policy and data protection disclosure for the portfolio of SK Sahinur Islam.',
        datePublished: '2024-01-01',
        dateModified: '2026-09-05',
        publisher: {
          '@type': 'Person',
          name: 'SK Sahinur Islam',
          alternateName: 'Genious Sonu',
          url: 'https://genioussonu.me',
        },
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          {
            '@type': 'ListItem',
            position: 1,
            name: 'Home',
            item: 'https://genioussonu.me',
          },
          {
            '@type': 'ListItem',
            position: 2,
            name: 'Legal',
            item: 'https://genioussonu.me/privacy',
          },
          {
            '@type': 'ListItem',
            position: 3,
            name: 'Privacy Policy',
            item: 'https://genioussonu.me/privacy',
          },
        ],
      },
    ],
  };

  const sections = [
    { id: 'controller', num: '01', title: 'Data Controller & Scope' },
    { id: 'data-collected', num: '02', title: 'Categories of Information Collected' },
    { id: 'legal-bases', num: '03', title: 'Legal Bases for Processing' },
    { id: 'cookies-analytics', num: '04', title: 'Cookies & Google Consent Mode v2' },
    { id: 'data-usage', num: '05', title: 'How Your Information is Utilized' },
    { id: 'sub-processors', num: '06', title: 'Third-Party Sub-processors' },
    { id: 'security', num: '07', title: 'Data Security & Encryption Architecture' },
    { id: 'retention', num: '08', title: 'Data Retention Periods' },
    { id: 'global-rights', num: '09', title: 'Your Global Privacy Rights' },
    { id: 'no-sale', num: '10', title: 'Zero Data Sale & Sharing Guarantee' },
    { id: 'children', num: '11', title: "Children's Privacy Protection" },
    { id: 'contact-rights', num: '12', title: 'Exercising Your Rights & Contact' },
  ];

  return (
    <main className={styles.legalPage}>
      <Navbar />
      <div className={styles.ambientGlow} />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaData) }}
      />

      <div className={styles.container}>
        {/* Breadcrumb Navigation */}
        <nav aria-label="Breadcrumb" className={styles.breadcrumbs}>
          <Link href="/" className={styles.breadcrumbLink}>Home</Link>
          <span className={styles.breadcrumbSeparator}>/</span>
          <span className={styles.breadcrumbLink}>Legal</span>
          <span className={styles.breadcrumbSeparator}>/</span>
          <span className={styles.breadcrumbCurrent}>Privacy Policy</span>
        </nav>

        {/* Page Header */}
        <header className={styles.header}>
          <div className={styles.badge}>
            <span>sys.sec</span>
            <span>--policy=privacy_protection</span>
          </div>
          <h1 className={styles.title}>Privacy Policy</h1>
          <p className={styles.subtitle}>
            Transparency is foundational to reliable engineering. This policy details what information is collected, how it is secured, and how your privacy rights are guaranteed across international jurisdictions.
          </p>
          <div className={styles.metaRow}>
            <span className={styles.metaItem}>
              <span className={styles.metaDot} />
              Effective Date: September 2026
            </span>
            <span className={styles.metaItem}>Version 2.4.0 (Zero-Sale Standard)</span>
            <div className={styles.complianceTags}>
              <span className={styles.tag}>India DPDP Act 2023</span>
              <span className={styles.tag}>GDPR Compliant</span>
              <span className={styles.tag}>CCPA / CPRA</span>
            </div>
          </div>
        </header>

        {/* Quick Navigation / Table of Contents */}
        <nav className={styles.tocCard} aria-label="Table of Contents">
          <div className={styles.tocHeader}>
            <div className={styles.tocTitle}>
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <line x1="8" y1="6" x2="21" y2="6"/>
                <line x1="8" y1="12" x2="21" y2="12"/>
                <line x1="8" y1="18" x2="21" y2="18"/>
                <line x1="3" y1="6" x2="3.01" y2="6"/>
                <line x1="3" y1="12" x2="3.01" y2="12"/>
                <line x1="3" y1="18" x2="3.01" y2="18"/>
              </svg>
              Privacy Policy Sections
            </div>
            <div className={styles.tocTerminalDots} aria-hidden="true">
              <span className={`${styles.tocDot} ${styles.tocDotRed}`} />
              <span className={`${styles.tocDot} ${styles.tocDotYellow}`} />
              <span className={`${styles.tocDot} ${styles.tocDotGreen}`} />
            </div>
          </div>
          <ul className={styles.tocList}>
            {sections.map(({ id, num, title }) => (
              <li key={id}>
                <a href={`#${id}`} className={styles.tocLink}>
                  <span className={styles.tocNum}>§{num}</span> {title}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        {/* Privacy Policy Body */}
        <article className={styles.content}>
          {/* 01. Controller */}
          <section id="controller" className={styles.section}>
            <h2 className={styles.sectionTitle}>
              <span className={styles.sectionNumber}>01.</span> Data Controller &amp; Scope
            </h2>
            <p className={styles.paragraph}>
              The entity responsible for the collection, control, and processing of your personal data under the European General Data Protection Regulation (GDPR), the California Consumer Privacy Act (CCPA/CPRA), and the Indian Digital Personal Data Protection Act, 2023 (DPDP Act) is:
            </p>
            <div className={styles.callout}>
              <div className={styles.calloutHeader}>Data Controller Information</div>
              <p style={{ margin: 0 }}>
                <strong>SK Sahinur Islam (Genious Sonu)</strong><br />
                Senior Web Application Developer &amp; IT Engineer<br />
                Location: Kolkata, West Bengal, India<br />
                Direct Privacy Inquiries: <a href="mailto:sahinurislamm2002@gmail.com" style={{ color: 'var(--gold)' }}>sahinurislamm2002@gmail.com</a><br />
                Official Domain: <span style={{ color: 'var(--text-primary)' }}>https://genioussonu.me</span>
              </p>
            </div>
          </section>

          {/* 02. Data Collected */}
          <section id="data-collected" className={styles.section}>
            <h2 className={styles.sectionTitle}>
              <span className={styles.sectionNumber}>02.</span> Categories of Information Collected
            </h2>
            <p className={styles.paragraph}>
              I believe in strict data minimization. I collect only the information strictly required to facilitate professional correspondence, protect infrastructure security, and optimize performance:
            </p>
            <div className={styles.cardsGrid}>
              <div className={styles.card}>
                <div className={styles.cardTitle}>1. Direct Contact Submissions</div>
                <p className={styles.cardText}>
                  When submitting a message through the website contact form, I collect your <strong>name</strong>, <strong>email address</strong>, and the <strong>text content of your inquiry</strong>. This is processed securely via the Resend API.
                </p>
              </div>
              <div className={styles.card}>
                <div className={styles.cardTitle}>2. Automated Technical Telemetry</div>
                <p className={styles.cardText}>
                  Standard HTTP edge request headers including truncated/anonymized IP address, user-agent string, browser version, device category, referring URL, and server request timestamps.
                </p>
              </div>
              <div className={styles.card}>
                <div className={styles.cardTitle}>3. Local Storage &amp; Cache Tokens</div>
                <p className={styles.cardText}>
                  Client-side storage tokens for PWA offline caching (Service Worker `sw.js`), dark mode preferences, and cookie consent state flags (`cookie-consent-choice`).
                </p>
              </div>
            </div>
          </section>

          {/* 03. Legal Bases */}
          <section id="legal-bases" className={styles.section}>
            <h2 className={styles.sectionTitle}>
              <span className={styles.sectionNumber}>03.</span> Legal Bases for Processing
            </h2>
            <p className={styles.paragraph}>
              In accordance with international privacy frameworks (GDPR Article 6 &amp; Indian DPDP Act 2023), processing is justified strictly under:
            </p>
            <ul className={styles.bulletList}>
              <li className={styles.bulletItem}><span className={styles.highlightText}>Consent:</span> For optional performance analytics cookies (Google Analytics 4) and voluntary interactions with the AI chatbot widget.</li>
              <li className={styles.bulletItem}><span className={styles.highlightText}>Contractual / Pre-Contractual Necessity:</span> To respond to software development inquiries, freelance consulting requests, or project bids submitted by you.</li>
              <li className={styles.bulletItem}><span className={styles.highlightText}>Legitimate Interests:</span> Maintaining web application integrity, DDoS mitigation, network firewall filtering, and debugging technical runtime errors.</li>
            </ul>
          </section>

          {/* 04. Cookies & Google Consent Mode */}
          <section id="cookies-analytics" className={styles.section}>
            <h2 className={styles.sectionTitle}>
              <span className={styles.sectionNumber}>04.</span> Cookies &amp; Google Consent Mode v2
            </h2>
            <p className={styles.paragraph}>
              This Website strictly adheres to European ePrivacy and Google Consent Mode v2 standards:
            </p>
            <div className={styles.callout}>
              <div className={styles.calloutHeader}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                </svg>
                Zero Tracking by Default
              </div>
              <p style={{ margin: 0 }}>
                When you visit this Website, all analytics tracking tags and ad storage flags are set to <strong>&quot;denied&quot; by default</strong>. Google Analytics 4 is <em>completely prevented</em> from executing or writing cookies until you explicitly select &quot;Accept All&quot; or enable analytics in the Cookie Consent Banner.
              </p>
            </div>
            <p className={styles.paragraph}>
              You can reopen your cookie configuration panel and modify your preferences at any time by clicking the &quot;Cookie Settings&quot; button in the footer.
            </p>
          </section>

          {/* 05. Data Usage */}
          <section id="data-usage" className={styles.section}>
            <h2 className={styles.sectionTitle}>
              <span className={styles.sectionNumber}>05.</span> How Your Information is Utilized
            </h2>
            <p className={styles.paragraph}>
              Your information is exclusively used for the specific purposes for which it was supplied:
            </p>
            <ul className={styles.bulletList}>
              <li className={styles.bulletItem}>Evaluating and responding to freelance software development, full-stack engineering, and IT infrastructure consulting inquiries.</li>
              <li className={styles.bulletItem}>Delivering compiled, optimized website assets via Vercel Edge networks and modern Next.js serverless functions.</li>
              <li className={styles.bulletItem}>Detecting, investigating, and stopping unauthorized intrusions, bot floods, prompt injection, and cyber threats.</li>
              <li className={styles.bulletItem}>Analyzing anonymized, aggregated page traffic metrics (only when explicit consent is provided) to understand which engineering blog articles resonate with readers.</li>
            </ul>
          </section>

          {/* 06. Sub-processors */}
          <section id="sub-processors" className={styles.section}>
            <h2 className={styles.sectionTitle}>
              <span className={styles.sectionNumber}>06.</span> Third-Party Sub-processors
            </h2>
            <p className={styles.paragraph}>
              I partner exclusively with industry-standard, SOC 2 / ISO 27001 compliant cloud infrastructure providers to operate this Website:
            </p>
            <div className={styles.cardsGrid}>
              <div className={styles.card}>
                <div className={styles.cardTitle}>Vercel Inc. (USA)</div>
                <p className={styles.cardText}>Primary hosting, edge routing, serverless compute, and SSL termination. Compliant with EU-US Data Privacy Framework.</p>
              </div>
              <div className={styles.card}>
                <div className={styles.cardTitle}>Resend Inc. (USA)</div>
                <p className={styles.cardText}>Transactional email delivery service utilized securely by <code>/api/contact</code> to dispatch contact form submissions to my private inbox.</p>
              </div>
              <div className={styles.card}>
                <div className={styles.cardTitle}>Sanity AS (Norway/EU)</div>
                <p className={styles.cardText}>Headless Content Management System (CMS) hosting technical blog posts, project metadata, and gear recommendations under GDPR standards.</p>
              </div>
              <div className={styles.card}>
                <div className={styles.cardTitle}>Google LLC (USA)</div>
                <p className={styles.cardText}>Optional Google Analytics 4 (telemetry activated only upon consent) and Google Gemini API (supporting chatbot conversational inference).</p>
              </div>
              <div className={styles.card}>
                <div className={styles.cardTitle}>Groq Inc. (USA)</div>
                <p className={styles.cardText}>High-speed LPU AI inference engine powering the Genious Bot conversational assistant under strict zero-training API policies.</p>
              </div>
            </div>
          </section>

          {/* 07. Security */}
          <section id="security" className={styles.section}>
            <h2 className={styles.sectionTitle}>
              <span className={styles.sectionNumber}>07.</span> Data Security &amp; Encryption Architecture
            </h2>
            <p className={styles.paragraph}>
              Security is not an afterthought; it is built into the architecture of this application:
            </p>
            <ul className={styles.bulletList}>
              <li className={styles.bulletItem}><span className={styles.highlightText}>Transport Layer Security:</span> All network traffic between your browser and the site is encrypted using modern TLS 1.3 cryptographic suites with HTTP Strict Transport Security (HSTS).</li>
              <li className={styles.bulletItem}><span className={styles.highlightText}>Hardened Headers:</span> Explicit security headers including X-Content-Type-Options: nosniff, X-Frame-Options: SAMEORIGIN, and Referrer-Policy: strict-origin-when-cross-origin.</li>
              <li className={styles.bulletItem}><span className={styles.highlightText}>Credential Isolation:</span> Zero sensitive environment variables or third-party secret tokens are ever bundled or exposed to client-side JavaScript.</li>
            </ul>
          </section>

          {/* 08. Retention */}
          <section id="retention" className={styles.section}>
            <h2 className={styles.sectionTitle}>
              <span className={styles.sectionNumber}>08.</span> Data Retention Periods
            </h2>
            <p className={styles.paragraph}>
              I do not hoard personal data. Inquiries received via the contact form are retained for up to <span className={styles.highlightText}>24 months</span> in my secure email archive for business continuity, or until you request premature deletion. Temporary edge server logs are automatically purged within <span className={styles.highlightText}>30 days</span>.
            </p>
          </section>

          {/* 09. Global Rights */}
          <section id="global-rights" className={styles.section}>
            <h2 className={styles.sectionTitle}>
              <span className={styles.sectionNumber}>09.</span> Your Global Privacy Rights
            </h2>
            <p className={styles.paragraph}>
              Depending on your location, you hold statutory rights regarding your personal information:
            </p>
            <div className={styles.cardsGrid}>
              <div className={styles.card}>
                <div className={styles.cardTitle}>European Union &amp; UK (GDPR)</div>
                <p className={styles.cardText}>Right of access (Art. 15), rectification (Art. 16), erasure / &quot;right to be forgotten&quot; (Art. 17), restriction of processing (Art. 18), data portability (Art. 20), and right to withdraw consent without detriment.</p>
              </div>
              <div className={styles.card}>
                <div className={styles.cardTitle}>California (CCPA / CPRA)</div>
                <p className={styles.cardText}>Right to know specific pieces of personal information collected, right to delete personal information, right to non-discrimination, and right to opt-out of any data sale (I do not sell data).</p>
              </div>
              <div className={styles.card}>
                <div className={styles.cardTitle}>India (DPDP Act, 2023)</div>
                <p className={styles.cardText}>Right to access summary of personal data and processing activities, right to correction and erasure of inaccurate personal data, right to grievance redressal, and right to nominate an authorized representative.</p>
              </div>
            </div>
          </section>

          {/* 10. No Sale */}
          <section id="no-sale" className={styles.section}>
            <h2 className={styles.sectionTitle}>
              <span className={styles.sectionNumber}>10.</span> Zero Data Sale &amp; Sharing Guarantee
            </h2>
            <div className={styles.callout}>
              <div className={styles.calloutHeader}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                </svg>
                My Pledge to You
              </div>
              <p style={{ margin: 0 }}>
                I have <strong>never sold</strong>, <strong>rented</strong>, <strong>leased</strong>, or <strong>monetized</strong> your personal data, email address, or browsing behavior to data brokers, ad networks, or third parties—and I never will.
              </p>
            </div>
          </section>

          {/* 11. Children */}
          <section id="children" className={styles.section}>
            <h2 className={styles.sectionTitle}>
              <span className={styles.sectionNumber}>11.</span> Children&apos;s Privacy Protection
            </h2>
            <p className={styles.paragraph}>
              This Website is a professional engineering portfolio directed toward businesses, recruiters, engineers, and clients. It is not intended for or directed toward individuals under the age of 13 (or under 16 in the European Union). I do not knowingly collect personal data from minors. If you believe a minor has submitted personal data through this site, please contact me immediately for expedited deletion.
            </p>
          </section>

          {/* 12. Contact Rights */}
          <section id="contact-rights" className={styles.section}>
            <h2 className={styles.sectionTitle}>
              <span className={styles.sectionNumber}>12.</span> Exercising Your Rights &amp; Contact
            </h2>
            <p className={styles.paragraph}>
              To exercise your rights of access, rectification, erasure, or to raise any data protection inquiry, email me directly with the subject line <code>[Privacy Rights Request]</code>:
            </p>
            <div className={styles.callout}>
              <div className={styles.calloutHeader}>Direct Data Protection Inquiries</div>
              <p style={{ margin: 0 }}>
                <strong>SK Sahinur Islam</strong><br />
                Attn: Data Privacy &amp; Protection<br />
                Email: <a href="mailto:sahinurislamm2002@gmail.com" style={{ color: 'var(--gold)' }}>sahinurislamm2002@gmail.com</a><br />
                Response Time: Within 30 calendar days (free of charge)
              </p>
            </div>
          </section>
        </article>

        {/* Legal Switcher Footer Bar */}
        <div className={styles.legalNavBlock}>
          <div className={styles.legalLinksGroup}>
            <Link href="/terms" className={styles.legalNavLink}>
              Terms &amp; Conditions
            </Link>
            <Link href="/privacy" className={`${styles.legalNavLink} ${styles.legalNavLinkActive}`}>
              Privacy Policy
            </Link>
            <Link href="/bot/privacy-policy" className={styles.legalNavLink}>
              Bot Privacy Policy
            </Link>
          </div>
          <Link href="/#contact" className={styles.contactBtn}>
            Get in Touch <span>→</span>
          </Link>
        </div>
      </div>

      <Footer />
    </main>
  );
}
