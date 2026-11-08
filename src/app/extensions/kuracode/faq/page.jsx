import React from 'react';
import Link from 'next/link';
import styles from '../kuracode.module.css';
import { KURACODE_FAQS } from '@/data/kuracode/faq';

export const metadata = {
  title: 'KuraCode FAQ — Local Storage, Privacy & Code Capture Answers',
  description:
    'Answers to frequently asked questions about KuraCode: local-first storage, automatic code cleaning, browser permissions, secret scanning, and release plans.',
  alternates: {
    canonical: 'https://genioussonu.me/extensions/kuracode/faq',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function FaqPage() {
  const allQuestions = KURACODE_FAQS.flatMap((cat) => cat.questions);
  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: allQuestions.map((q) => ({
      '@type': 'Question',
      name: q.q,
      acceptedAnswer: {
        '@type': 'Answer',
        text: q.a,
      },
    })),
  };

  return (
    <div>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      {/* Breadcrumbs */}
      <nav className={styles.breadcrumbs} aria-label="Breadcrumbs">
        <Link href="/extensions/kuracode" className={styles.breadcrumbLink}>
          KuraCode
        </Link>
        <span className={styles.breadcrumbSeparator}>/</span>
        <span className={styles.breadcrumbCurrent}>FAQ</span>
      </nav>

      {/* Page Header */}
      <header className={styles.pageHeader}>
        <div className={styles.pageHeaderBadge}>DOCUMENTATION &amp; ANSWERS</div>
        <h1 className={styles.pageTitle}>Frequently Asked Questions</h1>
        <p className={styles.pageSubtitle}>
          Technical answers concerning local-first architecture, automated code sanitization, browser permissions, and upcoming platforms.
        </p>
      </header>

      {/* Fast Category Navigation */}
      <nav className={styles.faqNavPills} aria-label="FAQ Category Navigation">
        {KURACODE_FAQS.map((category) => (
          <a
            key={category.id}
            href={`#${category.id}`}
            className={styles.faqNavPill}
          >
            {category.category} ({category.questions.length})
          </a>
        ))}
      </nav>

      {/* FAQ Sections */}
      <div className="space-y-12">
        {KURACODE_FAQS.map((category) => (
          <section key={category.id} id={category.id} className={styles.faqSection}>
            <div className={styles.faqCategoryHeader}>
              <div>
                <h2 className={styles.faqCategoryTitle}>{category.category}</h2>
                <p className="text-xs text-text-muted mt-1">{category.description}</p>
              </div>
              <span className={styles.faqCategoryBadge}>
                {category.questions.length} items
              </span>
            </div>

            <div className={styles.faqAccordionList}>
              {category.questions.map((item) => (
                <details key={item.id} id={item.id} className={styles.faqAccordion}>
                  <summary className={styles.faqSummary}>
                    <span>{item.q}</span>
                    <svg
                      className={styles.faqChevron}
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      aria-hidden="true"
                    >
                      <polyline points="6 9 12 15 18 9" />
                    </svg>
                  </summary>
                  <div className={styles.faqContent}>
                    <p>{item.a}</p>
                    {item.id === 'extension-permissions' && (
                      <p className="mt-3 text-xs">
                        Review the complete privilege breakdown on the{' '}
                        <Link href="/extensions/kuracode/permissions">
                          Extension Permissions Page
                        </Link>.
                      </p>
                    )}
                    {item.id === 'storage-location' && (
                      <p className="mt-3 text-xs">
                        Read our detailed data isolation commitments in the{' '}
                        <Link href="/extensions/kuracode/privacy">
                          Privacy &amp; Data Policy
                        </Link>.
                      </p>
                    )}
                    {item.id === 'how-cleaning-works' && (
                      <p className="mt-3 text-xs">
                        Test the sanitizer on real sample code in the{' '}
                        <Link href="/extensions/kuracode/demo">
                          Interactive Demo Sandbox
                        </Link>.
                      </p>
                    )}
                    {item.id === 'cloud-sync-availability' && (
                      <p className="mt-3 text-xs">
                        Track upcoming milestones on the{' '}
                        <Link href="/extensions/kuracode/roadmap">
                          Product Roadmap
                        </Link>.
                      </p>
                    )}
                    {item.id === 'bug-reports' && (
                      <p className="mt-3 text-xs">
                        Visit the{' '}
                        <Link href="/extensions/kuracode/support">
                          Support &amp; Issue Tracker
                        </Link>{' '}
                        for contact and triage channels.
                      </p>
                    )}
                  </div>
                </details>
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
