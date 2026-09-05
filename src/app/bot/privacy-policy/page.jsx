import React from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import styles from '../../legal.module.css';

export const metadata = {
  title: 'Genious Bot Privacy Policy — SK Sahinur Islam (Genious Sonu)',
  description:
    'Dedicated privacy policy for the Genious AI Assistant. Explains conversational data processing, ephemeral session architecture, zero-training commitments, and security protocols.',
  alternates: {
    canonical: 'https://genioussonu.me/bot/privacy-policy',
  },
  openGraph: {
    title: 'Genious Bot Privacy Policy — SK Sahinur Islam (Genious Sonu)',
    description:
      'Dedicated privacy policy explaining ephemeral conversational memory, zero model training, and data protection for the Genious Bot.',
    url: 'https://genioussonu.me/bot/privacy-policy',
    siteName: 'SK Sahinur Islam (Genious Sonu) Portfolio',
    images: [
      {
        url: '/icon-512.png',
        width: 512,
        height: 512,
        alt: 'Genious Bot Privacy and Data Architecture',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Genious Bot Privacy Policy — SK Sahinur Islam (Genious Sonu)',
    description:
      'Ephemeral session architecture, zero model training, and privacy protections for the Genious AI Assistant.',
    creator: '@GeniousSonu',
    images: ['/icon-512.png'],
  },
};

export default function BotPrivacyPolicyPage() {
  const schemaData = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebPage',
        '@id': 'https://genioussonu.me/bot/privacy-policy/#webpage',
        url: 'https://genioussonu.me/bot/privacy-policy',
        name: 'Genious AI Assistant Privacy Policy — SK Sahinur Islam',
        description: 'Specific data protection and conversational privacy terms governing the Genious Bot.',
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
            name: 'Bot Privacy Policy',
            item: 'https://genioussonu.me/bot/privacy-policy',
          },
        ],
      },
    ],
  };

  const sections = [
    { id: 'purpose', num: '01', title: 'Purpose & Architectural Overview' },
    { id: 'data-processing', num: '02', title: 'Conversational Processing & Ephemeral Sessions' },
    { id: 'zero-training', num: '03', title: 'Zero Training on User Prompts' },
    { id: 'sensitive-data', num: '04', title: 'Prohibition of Sensitive Credentials' },
    { id: 'abuse-prevention', num: '05', title: 'Anti-Abuse & Rate-Limiting Telemetry' },
    { id: 'ai-providers', num: '06', title: 'Third-Party AI Sub-processors' },
    { id: 'user-controls', num: '07', title: 'User Controls & Memory Purging' },
    { id: 'ai-limitations', num: '08', title: 'Limitations of AI Outputs & Hallucinations' },
    { id: 'contact', num: '09', title: 'Inquiries & Feedback' },
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
          <Link href="/privacy" className={styles.breadcrumbLink}>Legal</Link>
          <span className={styles.breadcrumbSeparator}>/</span>
          <span className={styles.breadcrumbCurrent}>Bot Privacy Policy</span>
        </nav>

        {/* Page Header */}
        <header className={styles.header}>
          <div className={styles.badge}>
            <span>ai.agent</span>
            <span>--policy=bot_privacy_protection</span>
          </div>
          <h1 className={styles.title}>Genious Bot Privacy Policy</h1>
          <p className={styles.subtitle}>
            This dedicated policy outlines how the conversational assistant (&quot;Genious Bot&quot;) processes user queries, enforces ephemeral session isolation, and guarantees zero AI model training on your prompts.
          </p>
          <div className={styles.metaRow}>
            <span className={styles.metaItem}>
              <span className={styles.metaDot} />
              Effective Date: September 2026
            </span>
            <span className={styles.metaItem}>Version 2.1.0 (Ephemeral Memory Standard)</span>
            <div className={styles.complianceTags}>
              <span className={styles.tag}>Zero-Retention API</span>
              <span className={styles.tag}>No Model Training</span>
              <span className={styles.tag}>Client-State Only</span>
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
              Bot Policy Sections
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

        {/* Bot Privacy Content Body */}
        <article className={styles.content}>
          {/* 01. Purpose */}
          <section id="purpose" className={styles.section}>
            <h2 className={styles.sectionTitle}>
              <span className={styles.sectionNumber}>01.</span> Purpose &amp; Architectural Overview
            </h2>
            <p className={styles.paragraph}>
              The <span className={styles.highlightText}>Genious AI Assistant</span> (&quot;Genious Bot&quot;) is an interactive conversational agent integrated into <span className={styles.highlightText}>genioussonu.me</span>. Its sole purpose is to provide visitors, recruiters, prospective clients, and fellow engineers with rapid, intelligent answers regarding:
            </p>
            <ul className={styles.bulletList}>
              <li className={styles.bulletItem}>SK Sahinur Islam&apos;s full-stack software development experience, tech stack, and background.</li>
              <li className={styles.bulletItem}>Engineering achievements, Indian Patent No. 544062 (IoT Real-Time Vaccine Storage Monitoring), and publications.</li>
              <li className={styles.bulletItem}>Open-source projects, technical blog posts, recommended developer gear, and freelance consulting availability.</li>
              <li className={styles.bulletItem}>Interactive guidance on how to connect directly with Sahinur via email, LinkedIn, Upwork, Telegram, or WhatsApp.</li>
            </ul>
          </section>

          {/* 02. Data Processing */}
          <section id="data-processing" className={styles.section}>
            <h2 className={styles.sectionTitle}>
              <span className={styles.sectionNumber}>02.</span> Conversational Processing &amp; Ephemeral Sessions
            </h2>
            <p className={styles.paragraph}>
              The conversational architecture of Genious Bot is engineered with strict privacy isolation:
            </p>
            <div className={styles.cardsGrid}>
              <div className={styles.card}>
                <div className={styles.cardTitle}>Client-Side State Isolation</div>
                <p className={styles.cardText}>
                  Your message history is maintained in temporary browser runtime memory (React state) during your active browsing session. It is <strong>never written to permanent public databases or marketing trackers</strong>.
                </p>
              </div>
              <div className={styles.card}>
                <div className={styles.cardTitle}>Proxied Secure API Gateway</div>
                <p className={styles.cardText}>
                  Queries are transmitted securely via encrypted HTTPS POST to the serverless proxy endpoint <code>/api/chatbot</code>. The serverless worker formats system context and forwards the request to the inference provider.
                </p>
              </div>
              <div className={styles.card}>
                <div className={styles.cardTitle}>Zero Identity Linking</div>
                <p className={styles.cardText}>
                  Conversations are anonymous by design. The bot does not require account creation, logins, phone numbers, or credit cards, and does not correlate your chat queries with external profiling networks.
                </p>
              </div>
            </div>
          </section>

          {/* 03. Zero Training */}
          <section id="zero-training" className={styles.section}>
            <h2 className={styles.sectionTitle}>
              <span className={styles.sectionNumber}>03.</span> Zero Training on User Prompts
            </h2>
            <div className={styles.callout}>
              <div className={styles.calloutHeader}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                </svg>
                Strict Zero-Training Commitment
              </div>
              <p style={{ margin: 0 }}>
                Neither SK Sahinur Islam nor our backend inference systems use your questions, prompts, or chat inputs to train, retrain, fine-tune, or improve public AI foundation models. All API integrations with Groq and Google Cloud utilize commercial enterprise tiers governed by explicit contractual zero-data-retention and zero-model-training clauses.
              </p>
            </div>
          </section>

          {/* 04. Sensitive Data */}
          <section id="sensitive-data" className={styles.section}>
            <h2 className={styles.sectionTitle}>
              <span className={styles.sectionNumber}>04.</span> Prohibition of Sensitive Credentials
            </h2>
            <div className={`${styles.callout} ${styles.calloutWarning}`}>
              <div className={styles.calloutHeader}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
                  <line x1="12" y1="9" x2="12" y2="13"/>
                  <line x1="12" y1="17" x2="12.01" y2="17"/>
                </svg>
                Important Security Advisory
              </div>
              <p style={{ margin: 0 }}>
                Genious Bot is an open portfolio informational assistant. <strong>DO NOT</strong> submit passwords, API access keys, private SSH keys, credit card numbers, bank credentials, proprietary corporate trade secrets, or sensitive health data into the chat interface. I disclaim any liability for confidential information voluntarily entered into the chat prompt by users.
              </p>
            </div>
          </section>

          {/* 05. Abuse Prevention */}
          <section id="abuse-prevention" className={styles.section}>
            <h2 className={styles.sectionTitle}>
              <span className={styles.sectionNumber}>05.</span> Anti-Abuse &amp; Rate-Limiting Telemetry
            </h2>
            <p className={styles.paragraph}>
              To prevent infrastructure exhaustion, API quota exploitation, automated scraping, and prompt injection attacks, the backend edge service enforces automated telemetry safeguards:
            </p>
            <ul className={styles.bulletList}>
              <li className={styles.bulletItem}><span className={styles.highlightText}>Sliding Window Rate-Limiting:</span> Request velocity is monitored anonymously based on ephemeral IP hashes. Exceeding reasonable thresholds results in temporary 429 &quot;Too Many Requests&quot; responses.</li>
              <li className={styles.bulletItem}><span className={styles.highlightText}>Prompt Sanitization:</span> Inbound messages are sanitized to mitigate Cross-Site Scripting (XSS), script injection, and hostile command payloads.</li>
              <li className={styles.bulletItem}><span className={styles.highlightText}>Defensive Audit Logs:</span> Flagrant penetration or DDoS attempts may trigger automated edge firewall blocks via Vercel Web Application Firewall (WAF).</li>
            </ul>
          </section>

          {/* 06. AI Providers */}
          <section id="ai-providers" className={styles.section}>
            <h2 className={styles.sectionTitle}>
              <span className={styles.sectionNumber}>06.</span> Third-Party AI Sub-processors
            </h2>
            <p className={styles.paragraph}>
              Inference requests generated by the bot are executed through the following certified LLM infrastructure providers:
            </p>
            <div className={styles.cardsGrid}>
              <div className={styles.card}>
                <div className={styles.cardTitle}>Groq Inc. (USA)</div>
                <p className={styles.cardText}>
                  Provides high-performance Language Processing Unit (LPU) inference for ultra-fast response delivery. Groq&apos;s enterprise API terms stipulate that customer prompt data is not retained and is never used to train foundation models.
                </p>
              </div>
              <div className={styles.card}>
                <div className={styles.cardTitle}>Google Cloud / Gemini API (USA)</div>
                <p className={styles.cardText}>
                  Provides enterprise generative AI inference fallback. Under Google Cloud Vertex AI and paid API agreements, customer prompts and responses are strictly partitioned and are not used for Google model training.
                </p>
              </div>
            </div>
          </section>

          {/* 07. User Controls */}
          <section id="user-controls" className={styles.section}>
            <h2 className={styles.sectionTitle}>
              <span className={styles.sectionNumber}>07.</span> User Controls &amp; Memory Purging
            </h2>
            <p className={styles.paragraph}>
              You maintain total control over your interactive conversation history:
            </p>
            <ul className={styles.bulletList}>
              <li className={styles.bulletItem}><span className={styles.highlightText}>Instant Memory Reset:</span> Refreshing the webpage or closing your browser tab immediately destroys the in-memory chat session history.</li>
              <li className={styles.bulletItem}><span className={styles.highlightText}>Widget Dismissal:</span> Closing the chat window suspends conversation state.</li>
              <li className={styles.bulletItem}><span className={styles.highlightText}>Local Storage Reset:</span> Clearing your browser cache or site data purges any residual UI state preferences instantly.</li>
            </ul>
          </section>

          {/* 08. AI Limitations */}
          <section id="ai-limitations" className={styles.section}>
            <h2 className={styles.sectionTitle}>
              <span className={styles.sectionNumber}>08.</span> Limitations of AI Outputs &amp; Hallucinations
            </h2>
            <p className={styles.paragraph}>
              While Genious Bot is grounded on accurate, vetted system prompts regarding Sahinur&apos;s engineering background, large language models may occasionally generate inaccurate or hallucinatory statements (&quot;AI Hallucinations&quot;):
            </p>
            <ul className={styles.bulletList}>
              <li className={styles.bulletItem}>All information supplied by Genious Bot is for preliminary convenience and demonstration purposes only.</li>
              <li className={styles.bulletItem}>Bot responses do not constitute binding architectural guarantees, formal price quotations, or legal commitments until confirmed directly and in writing by Sahinur personally.</li>
            </ul>
          </section>

          {/* 09. Contact */}
          <section id="contact" className={styles.section}>
            <h2 className={styles.sectionTitle}>
              <span className={styles.sectionNumber}>09.</span> Inquiries &amp; Feedback
            </h2>
            <p className={styles.paragraph}>
              If you have any questions, feedback, or concerns regarding Genious Bot, its conversational data handling, or technical implementation, please contact me directly:
            </p>
            <div className={styles.callout}>
              <div className={styles.calloutHeader}>AI Assistant Inquiries</div>
              <p style={{ margin: 0 }}>
                <strong>SK Sahinur Islam (Genious Sonu)</strong><br />
                Developer &amp; Creator of Genious Bot<br />
                Email: <a href="mailto:sahinurislamm2002@gmail.com" style={{ color: 'var(--gold)' }}>sahinurislamm2002@gmail.com</a><br />
                Direct Inquiry: <Link href="/#contact" style={{ color: 'var(--gold)' }}>genioussonu.me/#contact</Link>
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
            <Link href="/privacy" className={styles.legalNavLink}>
              Privacy Policy
            </Link>
            <Link href="/bot/privacy-policy" className={`${styles.legalNavLink} ${styles.legalNavLinkActive}`}>
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
