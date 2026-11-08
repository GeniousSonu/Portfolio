import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import styles from './kuracode.module.css';
import { KURACODE_FACTS } from '@/data/kuracode/facts';

export const metadata = {
  title: 'KuraCode — Clean, Local-First Code Snippet Capture for Developers',
  description:
    'Save code from anywhere on the web in one click, keep source URLs and headings, automatically strip line numbers and prompts, and organize snippets locally.',
  alternates: {
    canonical: 'https://genioussonu.me/extensions/kuracode',
  },
};

export default function KuraCodeLandingPage() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: KURACODE_FACTS.name,
    applicationCategory: 'DeveloperApplication',
    operatingSystem: 'Google Chrome, Microsoft Edge, Mozilla Firefox',
    description: KURACODE_FACTS.oneLinePromise,
    url: KURACODE_FACTS.officialHome,
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD',
    },
  };

  return (
    <div>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Hero Section */}
      <section className={styles.hero}>
        <div className={styles.badge}>
          <span>Local-First Browser Extension • Manifest V3</span>
        </div>

        <h1 className={styles.heroTitle}>
          Capture code from the web,{' '}
          <span className={styles.titleGradient}>preserve where it came from.</span>
        </h1>

        <p className={styles.heroSubtitle}>
          Save snippets from technical documentation, blogs, and repositories in one shortcut.
          KuraCode automatically strips line numbers and shell prompts while preserving exact indentation, section headings, and source URLs.
        </p>

        <div className={styles.heroActions}>
          <Link href="/extensions/kuracode/demo" className={styles.primaryBtn}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <polygon points="5 3 19 12 5 21 5 3" />
            </svg>
            <span>Try Interactive Demo</span>
          </Link>

          <Link href="/extensions/kuracode/install" className={styles.secondaryBtn}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="7 10 12 15 17 10" />
              <line x1="12" y1="15" x2="12" y2="3" />
            </svg>
            <span>Installation Guide</span>
          </Link>
        </div>
      </section>

      {/* Showcase Visual in Browser Frame */}
      <div className={styles.browserFrame}>
        <div className={styles.browserFrameHeader}>
          <div className={styles.frameDot} />
          <div className={styles.frameDot} />
          <div className={styles.frameDot} />
          <span className={styles.frameTitle}>KuraCode Extension Interface &amp; In-Browser Capture</span>
        </div>
        <picture>
          <source srcSet="/assets/kuracode/kuracode-hero.avif" type="image/avif" />
          <source srcSet="/assets/kuracode/kuracode-hero.webp" type="image/webp" />
          <Image
            src="/assets/kuracode/kuracode-hero.webp"
            alt="KuraCode extension feature board showing code capture, clean line numbers, and provenance metadata"
            width={1920}
            height={1072}
            className="w-full h-auto block"
            priority
          />
        </picture>
      </div>

      {/* 3-Step Walkthrough */}
      <section className={styles.walkthroughSection}>
        <div className="max-w-xl">
          <h2 className="text-xl md:text-2xl font-bold text-text-primary mb-2">
            How It Works in Your Daily Workflow
          </h2>
          <p className="text-sm text-text-muted">
            Seamless snippet collection without interrupting your development flow.
          </p>
        </div>

        <div className={styles.walkthroughGrid}>
          <div className={styles.stepItem}>
            <span className={styles.stepNumber}>STEP 1</span>
            <h3 className={styles.stepTitle}>Select Any Code</h3>
            <p className={styles.stepDesc}>
              Highlight any code snippet on Stack Overflow, MDN, GitHub, or any technical blog.
            </p>
          </div>

          <div className={styles.stepItem}>
            <span className={styles.stepNumber}>STEP 2</span>
            <h3 className={styles.stepTitle}>Trigger Capture</h3>
            <p className={styles.stepDesc}>
              Press <kbd className="font-mono text-xs text-gold px-1.5 py-0.5 rounded bg-surface-2 border border-border-subtle">Alt+Shift+S</kbd> or right-click and choose Save to KuraCode.
            </p>
          </div>

          <div className={styles.stepItem}>
            <span className={styles.stepNumber}>STEP 3</span>
            <h3 className={styles.stepTitle}>Clean &amp; Indexed</h3>
            <p className={styles.stepDesc}>
              Line numbers and shell prompts are stripped automatically. Stored locally with full-text search.
            </p>
          </div>
        </div>
      </section>

      {/* Architectural Pillars */}
      <section className="mb-16">
        <div className="mb-8">
          <h2 className="text-xl md:text-2xl font-bold text-text-primary mb-2">
            Core Architectural Capabilities
          </h2>
          <p className="text-sm text-text-muted max-w-xl">
            Engineered as a lightweight, local-first utility focused on developer productivity and data ownership.
          </p>
        </div>

        <div className={styles.grid}>
          {/* Card 1 */}
          <div className={styles.card}>
            <div className={styles.cardIcon}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
                <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
              </svg>
            </div>
            <h3 className={styles.cardTitle}>Context-Aware Provenance</h3>
            <p className={styles.cardDesc}>
              Every snippet automatically records the source webpage URL, page title, nearest section heading, and capture date so you can retrace origins instantly.
            </p>
          </div>

          {/* Card 2 */}
          <div className={styles.card}>
            <div className={styles.cardIcon}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="4 7 4 4 20 4 20 7" />
                <line x1="9" y1="20" x2="15" y2="20" />
                <line x1="12" y1="4" x2="12" y2="20" />
              </svg>
            </div>
            <h3 className={styles.cardTitle}>Automated Code Sanitization</h3>
            <p className={styles.cardDesc}>
              Strips leading line counters (01:, 12 |), terminal prompts ($, &gt;), and accidental copy button text while preserving nested code indentation.
            </p>
          </div>

          {/* Card 3 */}
          <div className={styles.card}>
            <div className={styles.cardIcon}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="2" y="3" width="20" height="14" rx="2" />
                <line x1="8" y1="21" x2="16" y2="21" />
                <line x1="12" y1="17" x2="12" y2="21" />
              </svg>
            </div>
            <h3 className={styles.cardTitle}>Local-First Offline Storage</h3>
            <p className={styles.cardDesc}>
              All snippet contents and search indices live in your browser IndexedDB. Zero mandatory sign-up, zero server synchronization, and zero telemetry beacons.
            </p>
          </div>

          {/* Card 4 */}
          <div className={styles.card}>
            <div className={styles.cardIcon}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
              </svg>
            </div>
            <h3 className={styles.cardTitle}>Client-Side Secret Detection</h3>
            <p className={styles.cardDesc}>
              Heuristic patterns flag accidental API keys, tokens, or passwords before you save or copy snippets, reducing credential leak risks.
            </p>
          </div>
        </div>
      </section>

      {/* Quick Links Section */}
      <section className="p-8 rounded-2xl border border-border-subtle bg-surface-card flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h2 className="text-lg font-bold text-text-primary mb-1">
            Want to see how the cleaner handles your code?
          </h2>
          <p className="text-sm text-text-muted">
            Test the live sanitization engine directly in your browser without installing the extension.
          </p>
        </div>
        <div className="flex items-center gap-3 flex-wrap">
          <Link href="/extensions/kuracode/demo" className={styles.primaryBtn}>
            Launch Live Demo
          </Link>
          <Link href="/extensions/kuracode/faq" className={styles.secondaryBtn}>
            Read FAQs
          </Link>
        </div>
      </section>
    </div>
  );
}
