import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import styles from './kuracode.module.css';
import { KURACODE_FACTS } from '@/data/kuracode/facts';
import PlaceholderChip from '@/components/kuracode/PlaceholderChip';

export const metadata = {
  title: 'KuraCode — Code Snippet Manager for Developers',
  description:
    'Save code from anywhere on the web in one click, keep where it came from, find it again instantly, and share it with your team.',
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

      {/* Hero */}
      <section className={styles.hero}>
        <div className={styles.badge}>
          <span>● PRE-RELEASE STAGING</span>
          <span>•</span>
          <span>LOCAL-FIRST DEVELOPER PREVIEW</span>
        </div>

        <h1 className={styles.heroTitle}>
          Save code from anywhere on the web, <span className={styles.titleGradient}>keep where it came from.</span>
        </h1>

        <p className={styles.heroSubtitle}>
          {KURACODE_FACTS.oneLinePromise}
        </p>

        <div className={styles.heroActions}>
          <Link href="/extensions/kuracode/install" className={styles.primaryBtn}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="7 10 12 15 17 10" />
              <line x1="12" y1="15" x2="12" y2="3" />
            </svg>
            <span>Get Pre-Release Build</span>
          </Link>

          <Link href="/extensions/kuracode/demo" className={styles.secondaryBtn}>
            <span>Try Interactive Demo</span>
          </Link>
        </div>

        <div className="text-xs text-text-muted mb-8 font-mono">
          <span>Owner status: </span>
          <PlaceholderChip label={KURACODE_FACTS.owner.legalName} />
        </div>
      </section>

      {/* Hero Presentation Banner */}
      <div className={styles.showcaseCard}>
        <picture>
          <source srcSet="/assets/kuracode/kuracode-hero.avif" type="image/avif" />
          <source srcSet="/assets/kuracode/kuracode-hero.webp" type="image/webp" />
          <Image
            src="/assets/kuracode/kuracode-hero.webp"
            alt="KuraCode extension feature presentation board showing code capture, clean line numbers, and provenance"
            width={1920}
            height={1072}
            className="w-full h-auto block"
            priority
          />
        </picture>
      </div>

      {/* Honest Screenshot Area */}
      <section className="mb-16 p-8 rounded-2xl border border-dashed border-border/60 bg-surface-1/40 text-center">
        <h3 className="text-lg font-bold text-text-primary mb-2">Extension Interface &amp; In-Product Captures</h3>
        <p className="text-sm text-text-muted max-w-xl mx-auto mb-4">
          In adherence to pre-release honesty standards, production UI screenshots will be captured directly from the published store builds upon store approval.
        </p>
        <span className="inline-block px-3 py-1 rounded-full text-xs font-mono bg-surface-2 text-gold border border-border">
          Screenshots arriving with official store launch
        </span>
      </section>

      {/* Core Features Grid */}
      <section className="mb-16">
        <div className="text-center mb-10">
          <h2 className="text-2xl md:text-3xl font-extrabold text-text-primary mb-3">
            Built for Developer Flow
          </h2>
          <p className="text-sm md:text-base text-text-muted max-w-lg mx-auto">
            Zero friction, zero account roadblocks, and zero tracking. Your code remains your own.
          </p>
        </div>

        <div className={styles.grid}>
          <div className={styles.card}>
            <div className={styles.cardIcon}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="4 17 10 11 4 5" />
                <line x1="12" y1="19" x2="20" y2="19" />
              </svg>
            </div>
            <h3 className={styles.cardTitle}>1-Click Capture with Provenance</h3>
            <p className={styles.cardDesc}>
              Select code anywhere and press Alt+Shift+S. KuraCode automatically records the URL, heading, and timestamp.
            </p>
            <span className={styles.statusTag}>Status: Available</span>
          </div>

          <div className={styles.card}>
            <div className={styles.cardIcon}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </div>
            <h3 className={styles.cardTitle}>Automatic Code Cleaner</h3>
            <p className={styles.cardDesc}>
              Strips annoying line numbers, shell prompts ($), and copy-button text from copied snippets while preserving indentation.
            </p>
            <span className={styles.statusTag}>Status: Available</span>
          </div>

          <div className={styles.card}>
            <div className={styles.cardIcon}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="2" y="3" width="20" height="14" rx="2" />
                <line x1="8" y1="21" x2="16" y2="21" />
                <line x1="12" y1="17" x2="12" y2="21" />
              </svg>
            </div>
            <h3 className={styles.cardTitle}>Local-First &amp; Offline</h3>
            <p className={styles.cardDesc}>
              All data lives in your browser IndexedDB. Nothing leaves your machine without explicit sync activation.
            </p>
            <span className={styles.statusTag}>Status: Available</span>
          </div>

          <div className={styles.card}>
            <div className={styles.cardIcon}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
              </svg>
            </div>
            <h3 className={styles.cardTitle}>Pre-Save Secret Scanner</h3>
            <p className={styles.cardDesc}>
              Scans highlighted code for accidentally selected API keys, private tokens, or passwords before saving.
            </p>
            <span className={styles.statusTag}>Status: Available</span>
          </div>

          <div className={styles.card}>
            <div className={styles.cardIcon}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                <circle cx="9" cy="7" r="4" />
                <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                <path d="M16 3.13a4 4 0 0 1 0 7.75" />
              </svg>
            </div>
            <h3 className={styles.cardTitle}>Team Snippet Workspaces</h3>
            <p className={styles.cardDesc}>
              Shared team libraries and web-viewer links for approved engineering patterns.
            </p>
            <span className={styles.statusTag}>Status: Coming soon</span>
          </div>

          <div className={styles.card}>
            <div className={styles.cardIcon}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                <polyline points="14 2 14 8 20 8" />
              </svg>
            </div>
            <h3 className={styles.cardTitle}>VS Code &amp; IDE Bridge</h3>
            <p className={styles.cardDesc}>
              Two-way sync and direct editor insertions from your KuraCode snippet library.
            </p>
            <span className={styles.statusTag}>Status: Planned</span>
          </div>
        </div>
      </section>
    </div>
  );
}

