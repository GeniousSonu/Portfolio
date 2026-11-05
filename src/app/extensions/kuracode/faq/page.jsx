import React from 'react';
import Link from 'next/link';
import styles from '../kuracode.module.css';
import { KURACODE_FAQS } from '@/data/kuracode/faq';

export const metadata = {
  title: 'KuraCode FAQ — Frequently Asked Questions',
  description: 'Answers to top questions regarding KuraCode privacy, local-first storage, code cleaning, shortcuts, and releases.',
  alternates: {
    canonical: 'https://genioussonu.me/extensions/kuracode/faq',
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
    <div className="max-w-4xl mx-auto py-8">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      {/* Breadcrumbs */}
      <nav className={styles.breadcrumbs} aria-label="Breadcrumb">
        <Link href="/extensions/kuracode" className={styles.breadcrumbLink}>KuraCode</Link>
        <span className={styles.breadcrumbSeparator}>/</span>
        <span className={styles.breadcrumbCurrent}>FAQ</span>
      </nav>

      <div className="mb-12 text-center">
        <h1 className="text-3xl md:text-4xl font-extrabold text-text-primary mb-3">
          Frequently Asked Questions
        </h1>
        <p className="text-base text-text-muted max-w-xl mx-auto">
          Honest, technical answers about local-first storage, code cleaning, browser permissions, and release plans.
        </p>
      </div>

      <div className="space-y-12">
        {KURACODE_FAQS.map((category) => (
          <section key={category.category}>
            <h2 className="text-xl font-bold text-gold mb-6 border-b border-border pb-2 flex items-center gap-2">
              <span>●</span>
              <span>{category.category}</span>
            </h2>

            <div className="space-y-4">
              {category.questions.map((item, idx) => (
                <details
                  key={idx}
                  className="p-5 rounded-xl border border-border bg-surface-1 group open:border-gold/40 transition-colors"
                >
                  <summary className="font-bold text-text-primary cursor-pointer list-none flex justify-between items-center gap-4 text-base">
                    <span>{item.q}</span>
                    <span className="text-xs text-text-muted font-mono transition-transform group-open:rotate-180">▼</span>
                  </summary>
                  <p className="mt-4 text-sm text-text-secondary leading-relaxed border-t border-border/50 pt-3">
                    {item.a}
                  </p>
                </details>
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
