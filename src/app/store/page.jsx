import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { client } from '@/sanity/client';
import { PRODUCTS_QUERY } from '@/sanity/queries';
import { getCuratedGearProducts, AMAZON_AFFILIATE_TAG } from '@/data/gearProducts';
import StoreListClient from './StoreListClient';
import styles from './store.module.css';

export const revalidate = 30; // ISR cache revalidation every 30 seconds

export const metadata = {
  title: 'Curated Tech Gear & Workstation Setup — SK Sahinur Islam (Genious Sonu)',
  description:
    'Hardware components, 4K dual monitors, multi-tiered storage drives, and developer tools personally battle-tested and recommended by SK Sahinur Islam (Genious Sonu).',
  alternates: {
    canonical: 'https://genioussonu.me/store',
  },
  openGraph: {
    title: 'Curated Tech Gear & Workstation Setup — SK Sahinur Islam (Genious Sonu)',
    description:
      'Hardware, dual-display workstation, NVMe/SATA storage tiers, and developer tools personally battle-tested and recommended by SK Sahinur Islam (Genious Sonu).',
    url: 'https://genioussonu.me/store',
    siteName: 'SK Sahinur Islam (Genious Sonu) Portfolio',
    images: [
      {
        url: '/icon-512.png',
        width: 512,
        height: 512,
        alt: 'SK Sahinur Islam (Genious Sonu) Recommended Gear & Dev Tools',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Curated Tech Gear & Workstation Setup — SK Sahinur Islam (Genious Sonu)',
    description:
      'Hardware components, dual monitors, storage hierarchy, and developer tools used daily by SK Sahinur Islam.',
    creator: '@GeniousSonu',
    images: ['/icon-512.png'],
  },
};

export default async function StorePage() {
  let sanityProducts = [];
  try {
    sanityProducts = await client.fetch(PRODUCTS_QUERY);
  } catch (error) {
    console.warn('[StorePage] Notice: Falling back to local verified gear catalog:', error?.message || error);
    sanityProducts = [];
  }

  // Combine Sanity dynamic products with verified local workstation gear
  const products = getCuratedGearProducts(sanityProducts);

  // Generate ItemList structured data for search engines
  const itemListSchema = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'Curated Developer Gear & Setup by SK Sahinur Islam',
    description: 'Workstation hardware, dual monitors, storage drives, and developer recommendations.',
    url: 'https://genioussonu.me/store',
    numberOfItems: products?.length || 0,
    itemListElement: (products || []).map((prod, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      item: {
        '@type': 'Product',
        name: prod.name,
        description: prod.description || `Recommended ${prod.category || 'tool'}`,
        url: prod.affiliateUrl || 'https://genioussonu.me/store',
        category: prod.category,
        offers: {
          '@type': 'Offer',
          priceCurrency: 'INR',
          price: '0',
          availability: 'https://schema.org/InStock',
        },
      },
    })),
  };

  return (
    <main className={styles.storePage}>
      <Navbar />

      {/* Ambient background glow */}
      <div className={styles.ambientGlow} />

      {/* Schema.org Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListSchema) }}
      />

      <div className={styles.container}>
        {/* Header Section */}
        <header className={styles.header}>
          <div className={styles.badge}>
            <span>✦</span>
            <span>Battle-Tested Workstation Hardware &amp; Rig</span>
          </div>
          <h1 className={styles.title}>Developer Gear &amp; Store</h1>
          <p className={styles.subtitle}>
            A curated inventory of the exact hardware components, dual-monitor setup, multi-tiered storage drives, and mobile tools powering my daily software engineering rig.
          </p>
        </header>

        {/* FTC & Amazon Associate Legal Affiliate Disclosure Banner */}
        <aside className={styles.disclosureBanner} aria-label="Affiliate link disclosure">
          <div className={styles.disclosureIcon} aria-hidden="true">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="16" x2="12" y2="12" />
              <line x1="12" y1="8" x2="12.01" y2="8" />
            </svg>
          </div>
          <p className={styles.disclosureText}>
            <span className={styles.disclosureHighlight}>Amazon Associate Disclosure:</span> As an Amazon Associate, I earn from qualifying purchases (Tracking ID: <code>{AMAZON_AFFILIATE_TAG}</code>). Clicking these verified affiliate links supports my open-source work at zero extra cost to you. I only list gear that is physically part of my personal setup.
          </p>
        </aside>

        {/* Dynamic Store Filter & Listing */}
        <StoreListClient initialProducts={products || []} />
      </div>

      <Footer />
    </main>
  );
}
