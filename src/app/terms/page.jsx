import React from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import styles from '../legal.module.css';

export const metadata = {
  title: 'Terms and Conditions — SK Sahinur Islam (Genious Sonu)',
  description:
    'Terms of service, intellectual property notices, freelance consulting policies, acceptable use guidelines, and legal disclosures governing the portfolio of SK Sahinur Islam (Genious Sonu).',
  alternates: {
    canonical: 'https://genioussonu.me/terms',
  },
  openGraph: {
    title: 'Terms and Conditions — SK Sahinur Islam (Genious Sonu)',
    description:
      'Legal terms, code license conditions, and freelance engagement guidelines for SK Sahinur Islam (Genious Sonu).',
    url: 'https://genioussonu.me/terms',
    siteName: 'SK Sahinur Islam (Genious Sonu) Portfolio',
    images: [
      {
        url: '/icon-512.png',
        width: 512,
        height: 512,
        alt: 'SK Sahinur Islam Legal Terms and Conditions',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Terms and Conditions — SK Sahinur Islam (Genious Sonu)',
    description:
      'Terms of service, patent notices, and consulting policies for SK Sahinur Islam (Genious Sonu).',
    creator: '@GeniousSonu',
    images: ['/icon-512.png'],
  },
};

export default function TermsPage() {
  const schemaData = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebPage',
        '@id': 'https://genioussonu.me/terms/#webpage',
        url: 'https://genioussonu.me/terms',
        name: 'Terms and Conditions of Use — SK Sahinur Islam (Genious Sonu)',
        description: 'Terms of service, IP guidelines, and conditions for the official portfolio of SK Sahinur Islam.',
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
            item: 'https://genioussonu.me/terms',
          },
          {
            '@type': 'ListItem',
            position: 3,
            name: 'Terms and Conditions',
            item: 'https://genioussonu.me/terms',
          },
        ],
      },
    ],
  };

  const sections = [
    { id: 'acceptance', num: '01', title: 'Acceptance of Terms' },
    { id: 'intellectual-property', num: '02', title: 'Intellectual Property & Patent Disclosure' },
    { id: 'code-license', num: '03', title: 'Code Showcases & Repository Licenses' },
    { id: 'client-engagements', num: '04', title: 'Freelance & Engineering Consulting' },
    { id: 'security-rules', num: '05', title: 'Acceptable Use & Cybersecurity Policy' },
    { id: 'bot-usage', num: '06', title: 'Interactive AI & Bot Usage Conditions' },
    { id: 'affiliate-disclosure', num: '07', title: 'Affiliate Links & Store Recommendations' },
    { id: 'third-party-links', num: '08', title: 'Third-Party Links & Platforms' },
    { id: 'disclaimer', num: '09', title: 'Disclaimer of Warranties' },
    { id: 'liability', num: '10', title: 'Limitation of Liability' },
    { id: 'indemnification', num: '11', title: 'Indemnification' },
    { id: 'governing-law', num: '12', title: 'Governing Law & Dispute Resolution' },
    { id: 'contact', num: '13', title: 'Modifications & Inquiries' },
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
          <span className={styles.breadcrumbCurrent}>Terms and Conditions</span>
        </nav>

        {/* Page Header */}
        <header className={styles.header}>
          <div className={styles.badge}>
            <span>sys.legal</span>
            <span>--policy=terms_of_service</span>
          </div>
          <h1 className={styles.title}>Terms and Conditions of Use</h1>
          <p className={styles.subtitle}>
            Please review these terms carefully before navigating or interacting with this website, its APIs, code repositories, freelance consulting offerings, or interactive AI systems.
          </p>
          <div className={styles.metaRow}>
            <span className={styles.metaItem}>
              <span className={styles.metaDot} />
              Effective Date: September 2026
            </span>
            <span className={styles.metaItem}>Version 2.4.0 (Legally Hardened)</span>
            <div className={styles.complianceTags}>
              <span className={styles.tag}>India DPDP 2023</span>
              <span className={styles.tag}>GDPR Aligned</span>
              <span className={styles.tag}>FTC Compliant</span>
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
              Table of Contents
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

        {/* Legal Body Sections */}
        <article className={styles.content}>
          {/* 01. Acceptance */}
          <section id="acceptance" className={styles.section}>
            <h2 className={styles.sectionTitle}>
              <span className={styles.sectionNumber}>01.</span> Acceptance of Terms
            </h2>
            <p className={styles.paragraph}>
              These Terms and Conditions (&quot;Terms&quot;) constitute a legally binding agreement between you (&quot;User&quot;, &quot;Visitor&quot;, or &quot;Client&quot;) and <span className={styles.highlightText}>SK Sahinur Islam</span> (professionally recognized as <span className={styles.highlightText}>Genious Sonu</span>, &quot;I&quot;, &quot;me&quot;, or &quot;my&quot;), operating the digital portfolio, technical blog, and software consulting portal located at <span className={styles.highlightText}>https://genioussonu.me</span> (&quot;Website&quot;).
            </p>
            <p className={styles.paragraph}>
              By accessing, browsing, interacting with, or submitting data to this Website, you signify your full, unconditional agreement to these Terms. If you do not agree to every provision stated herein, you must immediately terminate use of this Website.
            </p>
          </section>

          {/* 02. Intellectual Property & Patent */}
          <section id="intellectual-property" className={styles.section}>
            <h2 className={styles.sectionTitle}>
              <span className={styles.sectionNumber}>02.</span> Intellectual Property &amp; Patent Disclosure
            </h2>
            <p className={styles.paragraph}>
              Unless explicitly attributed to third parties or open-source software, all materials on this Website—including but not limited to source code, user interface designs, custom GSAP animations, graphics, 3D assets, architectural schematics, blog writings, and visual identity—are the exclusive intellectual property of SK Sahinur Islam and are protected under Indian and international copyright, trademark, and intellectual property statutes.
            </p>
            <div className={styles.callout}>
              <div className={styles.calloutHeader}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
                </svg>
                Registered Patent Notice
              </div>
              <p style={{ margin: 0 }}>
                <strong>Indian Patent No. 544062:</strong> The real-time telemetry, sensor data streaming, and hardware-software orchestration mechanisms described in the &quot;IoT Real-Time Vaccine Storage Monitoring System&quot; are protected under statutory letters patent issued by the Indian Patent Office (IPO). Unauthorized commercialization, reproduction, fabrication, or reverse-engineering of this patented methodology constitutes statutory infringement subject to immediate injunctive relief and damages.
              </p>
            </div>
          </section>

          {/* 03. Code Showcases */}
          <section id="code-license" className={styles.section}>
            <h2 className={styles.sectionTitle}>
              <span className={styles.sectionNumber}>03.</span> Code Showcases &amp; Repository Licenses
            </h2>
            <p className={styles.paragraph}>
              This Website demonstrates software engineering projects, code snippets, and architecture samples. The licensing terms are segregated as follows:
            </p>
            <ul className={styles.bulletList}>
              <li className={styles.bulletItem}>
                <span className={styles.highlightText}>Open-Source Repositories:</span> Code explicitly hosted in public GitHub repositories (e.g., under github.com/GeniousSonu) is governed by the specific open-source license file (such as MIT, Apache 2.0, or GPL) situated in that repository.
              </li>
              <li className={styles.bulletItem}>
                <span className={styles.highlightText}>Proprietary Portfolio Implementation:</span> The compiled styling, bespoke Next.js layout, custom brand assets, and proprietary components comprising this portfolio domain remain <em>All Rights Reserved</em>. You may not clone, redistribute, or commercially re-sell this portfolio template without express written consent.
              </li>
            </ul>
          </section>

          {/* 04. Client Engagements */}
          <section id="client-engagements" className={styles.section}>
            <h2 className={styles.sectionTitle}>
              <span className={styles.sectionNumber}>04.</span> Freelance &amp; Engineering Consulting
            </h2>
            <p className={styles.paragraph}>
              Inquiries initiated via the contact form, direct email, or social profiles (LinkedIn, Upwork, WhatsApp, Telegram) do not establish an employer-employee or client-contractor relationship until:
            </p>
            <div className={styles.cardsGrid}>
              <div className={styles.card}>
                <div className={styles.cardTitle}>Statement of Work (SOW)</div>
                <p className={styles.cardText}>A formalized mutual agreement or Statement of Work defining project scope, deliverables, timeline, milestones, and technical requirements is countersigned.</p>
              </div>
              <div className={styles.card}>
                <div className={styles.cardTitle}>Platform Escrow / Contract</div>
                <p className={styles.cardText}>For projects conducted through freelance platforms (such as Upwork), engagements are strictly bound by the platform&apos;s Escrow Terms of Service and agreed hourly/fixed-price milestones.</p>
              </div>
              <div className={styles.card}>
                <div className={styles.cardTitle}>IP Transfer Upon Settlement</div>
                <p className={styles.cardText}>Full transfer of intellectual property rights for custom code commissioned by clients occurs strictly upon receipt of full, final payment as stipulated in the client contract.</p>
              </div>
            </div>
          </section>

          {/* 05. Security Rules */}
          <section id="security-rules" className={styles.section}>
            <h2 className={styles.sectionTitle}>
              <span className={styles.sectionNumber}>05.</span> Acceptable Use &amp; Cybersecurity Policy
            </h2>
            <p className={styles.paragraph}>
              As a full-stack engineer and cybersecurity practitioner, I uphold strict zero-tolerance policies regarding malicious network activity. You agree not to:
            </p>
            <ul className={styles.bulletList}>
              <li className={styles.bulletItem}>Conduct unauthorized vulnerability scanning, port scanning, or penetration testing against <span className={styles.highlightText}>genioussonu.me</span> or its associated serverless edge workers without prior written permission.</li>
              <li className={styles.bulletItem}>Launch Denial of Service (DoS), Distributed Denial of Service (DDoS), or volumetric traffic floods against this domain.</li>
              <li className={styles.bulletItem}>Execute automated scraping, headless harvesting, or extraction of email addresses and phone handles for unsolicited commercial marketing (spam).</li>
              <li className={styles.bulletItem}>Submit malicious payloads, cross-site scripting (XSS) vectors, SQL injection queries, or malicious scripts via the direct message field or API endpoints.</li>
            </ul>
            <div className={`${styles.callout} ${styles.calloutDanger}`}>
              <div className={styles.calloutHeader}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <circle cx="12" cy="12" r="10"/>
                  <line x1="4.93" y1="4.93" x2="19.07" y2="19.07"/>
                </svg>
                Legal Recourse
              </div>
              <p style={{ margin: 0 }}>
                Hostile intrusion attempts, automated spamming, or abuse of the contact API will result in permanent IP firewall blocking, reporting to your upstream internet service provider (ISP), and potential prosecution under the <em>Indian Information Technology Act, 2000</em> (Sections 43 &amp; 66) and international computer fraud regulations.
              </p>
            </div>
          </section>

          {/* 06. Bot Usage */}
          <section id="bot-usage" className={styles.section}>
            <h2 className={styles.sectionTitle}>
              <span className={styles.sectionNumber}>06.</span> Interactive AI &amp; Bot Usage Conditions
            </h2>
            <p className={styles.paragraph}>
              The interactive conversational agent (&quot;Genious Bot&quot;) is supplied solely to assist visitors with rapid navigation, technical inquiries, and project consultation. When interacting with the bot:
            </p>
            <ul className={styles.bulletList}>
              <li className={styles.bulletItem}>You agree not to attempt adversarial prompt injection, jailbreaking, or automated prompt extraction attacks.</li>
              <li className={styles.bulletItem}>You acknowledge that while the bot utilizes advanced LLM backends (Groq and Google Gemini), its outputs are informational and do not represent binding legal, architectural, or price quotations until confirmed in writing by Sahinur personally.</li>
              <li className={styles.bulletItem}>Bot privacy and conversational data policies are governed under the dedicated <Link href="/bot/privacy-policy" style={{ color: 'var(--gold)', textDecoration: 'underline' }}>Bot Privacy Policy</Link>.</li>
            </ul>
          </section>

          {/* 07. Affiliate Disclosure */}
          <section id="affiliate-disclosure" className={styles.section}>
            <h2 className={styles.sectionTitle}>
              <span className={styles.sectionNumber}>07.</span> Affiliate Links &amp; Store Recommendations
            </h2>
            <p className={styles.paragraph}>
              In compliance with the United States Federal Trade Commission (FTC) Guides Concerning the Use of Endorsements and Testimonials in Advertising and international consumer transparency norms:
            </p>
            <p className={styles.paragraph}>
              The <Link href="/store" style={{ color: 'var(--gold)' }}>/store</Link> section contains hand-picked developer hardware, books, peripherals, and SaaS tools personally tested or recommended by Sahinur. Certain links are affiliate links. If you click through and purchase qualifying items, I may earn an affiliate commission at <span className={styles.highlightText}>zero additional cost to you</span>.
            </p>
            <p className={styles.paragraph}>
              Product pricing, warranty fulfillment, delivery, and customer service are the sole responsibility of the third-party merchant (such as Amazon, publisher, or vendor). I disclaim all liability regarding product defects or fulfillment disputes.
            </p>
          </section>

          {/* 08. Third-Party Links */}
          <section id="third-party-links" className={styles.section}>
            <h2 className={styles.sectionTitle}>
              <span className={styles.sectionNumber}>08.</span> Third-Party Links &amp; Platforms
            </h2>
            <p className={styles.paragraph}>
              This Website contains links to external platforms including LinkedIn, GitHub, Upwork, TryHackMe, Telegram, WhatsApp, YouTube, and client project URLs. These third-party sites operate under their own independent terms and privacy protocols. I exercise no editorial control over external domains and accept no responsibility for their content, availability, or operational security.
            </p>
          </section>

          {/* 09. Disclaimer */}
          <section id="disclaimer" className={styles.section}>
            <h2 className={styles.sectionTitle}>
              <span className={styles.sectionNumber}>09.</span> Disclaimer of Warranties
            </h2>
            <p className={styles.paragraph}>
              THIS WEBSITE, ITS CODE SHOWCASES, ARTIFICIAL INTELLIGENCE ASSISTANTS, AND CONTENT ARE PROVIDED STRICTLY ON AN &quot;AS IS&quot; AND &quot;AS AVAILABLE&quot; BASIS WITHOUT WARRANTIES OF ANY KIND, EITHER EXPRESS, STATUTORY, OR IMPLIED.
            </p>
            <p className={styles.paragraph}>
              TO THE FULLEST EXTENT PERMISSIBLE UNDER APPLICABLE LAW, SK SAHINUR ISLAM DISCLAIMS ALL WARRANTIES, INCLUDING BUT NOT LIMITED TO IMPLIED WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, TITLE, ACCURACY, TIMELINESS, NON-INFRINGEMENT, AND UNINTERRUPTED ERROR-FREE OPERATION.
            </p>
          </section>

          {/* 10. Liability */}
          <section id="liability" className={styles.section}>
            <h2 className={styles.sectionTitle}>
              <span className={styles.sectionNumber}>10.</span> Limitation of Liability
            </h2>
            <p className={styles.paragraph}>
              TO THE MAXIMUM EXTENT PERMITTED BY LAW, IN NO EVENT SHALL SK SAHINUR ISLAM BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, EXEMPLARY, OR PUNITIVE DAMAGES—INCLUDING BUT NOT LIMITED TO LOSS OF DATA, REVENUE, CLIENTS, SYSTEM DOWNTIME, OR GOODWILL—ARISING FROM OR IN CONNECTION WITH YOUR USE OR INABILITY TO USE THIS WEBSITE OR ITS CODE EXAMPLES.
            </p>
          </section>

          {/* 11. Indemnification */}
          <section id="indemnification" className={styles.section}>
            <h2 className={styles.sectionTitle}>
              <span className={styles.sectionNumber}>11.</span> Indemnification
            </h2>
            <p className={styles.paragraph}>
              You agree to defend, indemnify, and hold harmless SK Sahinur Islam against any claims, liabilities, damages, judgments, losses, and legal costs (including reasonable attorneys&apos; fees) arising out of or related to your breach of these Terms, unauthorized security probing, or violation of any third-party rights.
            </p>
          </section>

          {/* 12. Governing Law */}
          <section id="governing-law" className={styles.section}>
            <h2 className={styles.sectionTitle}>
              <span className={styles.sectionNumber}>12.</span> Governing Law &amp; Dispute Resolution
            </h2>
            <p className={styles.paragraph}>
              These Terms and any disputes arising out of or related to this Website shall be governed exclusively by and construed in accordance with the laws of the <span className={styles.highlightText}>Republic of India</span>, without giving effect to any principles of conflicts of law.
            </p>
            <p className={styles.paragraph}>
              You irrevocably agree that the courts situated in <span className={styles.highlightText}>Kolkata, West Bengal, India</span> shall have exclusive jurisdiction over any legal suit, action, or proceeding arising out of or relating to these Terms.
            </p>
          </section>

          {/* 13. Modifications & Contact */}
          <section id="contact" className={styles.section}>
            <h2 className={styles.sectionTitle}>
              <span className={styles.sectionNumber}>13.</span> Modifications &amp; Inquiries
            </h2>
            <p className={styles.paragraph}>
              I reserve the right to revise, modernize, or amend these Terms at any time to reflect infrastructural, legal, or service changes. Updated Terms will be posted directly with a refreshed &quot;Effective Date&quot;. Your continued use of the Website subsequent to any modification confirms your acceptance.
            </p>
            <p className={styles.paragraph}>
              For inquiries regarding these Terms, patent licensing, or custom client contracts, please reach out directly:
            </p>
            <div className={styles.callout}>
              <div className={styles.calloutHeader}>Official Legal Contact</div>
              <p style={{ margin: 0 }}>
                <strong>SK Sahinur Islam (Genious Sonu)</strong><br />
                Senior Web Application Developer &amp; IT Engineer<br />
                Location: Kolkata, West Bengal, India<br />
                Email: <a href="mailto:sahinurislamm2002@gmail.com" style={{ color: 'var(--gold)' }}>sahinurislamm2002@gmail.com</a><br />
                Direct Inquiry: <Link href="/#contact" style={{ color: 'var(--gold)' }}>genioussonu.me/#contact</Link>
              </p>
            </div>
          </section>
        </article>

        {/* Legal Switcher Footer Bar */}
        <div className={styles.legalNavBlock}>
          <div className={styles.legalLinksGroup}>
            <Link href="/terms" className={`${styles.legalNavLink} ${styles.legalNavLinkActive}`}>
              Terms &amp; Conditions
            </Link>
            <Link href="/privacy" className={styles.legalNavLink}>
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
