import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { client } from '@/sanity/client';
import { PRODUCTS_QUERY } from '@/sanity/queries';
import StoreListClient from './StoreListClient';
import WaterRippleEffect from '@/components/ui/WaterRippleEffect';
import styles from './store.module.css';

export const revalidate = 30; // ISR cache revalidation every 30 seconds

export const metadata = {
  title: 'Curated Tech Gear & Dev Tools — SK Sahinur Islam (Genious Sonu)',
  description:
    'Hardware, desk setups, developer tools, SaaS, and engineering books personally battle-tested and recommended by SK Sahinur Islam (Genious Sonu).',
  alternates: {
    canonical: 'https://genioussonu.me/store',
  },
  openGraph: {
    title: 'Curated Tech Gear & Dev Tools — SK Sahinur Islam (Genious Sonu)',
    description:
      'Hardware, desk setups, developer tools, SaaS, and engineering books personally battle-tested and recommended by SK Sahinur Islam (Genious Sonu).',
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
    title: 'Curated Tech Gear & Dev Tools — SK Sahinur Islam (Genious Sonu)',
    description:
      'Hardware, desk setups, developer tools, and engineering books recommended by SK Sahinur Islam (Genious Sonu).',
    creator: '@GeniousSonu',
    images: ['/icon-512.png'],
  },
};

export default async function StorePage() {
  let products = [];
  try {
    products = await client.fetch(PRODUCTS_QUERY);
  } catch (error) {
    console.error('Error fetching Sanity affiliate products:', error);
  }

  // Generate ItemList structured data for search engine optimization
  const itemListSchema = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'Curated Developer Gear & Recommendations by SK Sahinur Islam',
    description: 'Hardware, software, books, and developer tooling recommendations.',
    url: 'https://genioussonu.me/store',
    numberOfItems: products?.length || 0,
    itemListElement: (products || []).map((prod, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      item: {
        '@type': 'Product',
        name: prod.name,
        description: prod.description || `Recommended ${prod.category || 'tool'}`,
        url: prod.affiliateUrl,
        category: prod.category,
        offers: {
          '@type': 'Offer',
          priceCurrency: 'USD',
          price: prod.price ? prod.price.replace(/[^0-9.]/g, '') || '0' : '0',
          availability: 'https://schema.org/InStock',
        },
      },
    })),
  };

  return (
    <main className={styles.storePage}>
      <Navbar />

      {/* Ambient background glow & Water Ripple Layer */}
      <div className={styles.ambientGlow} />
      <WaterRippleEffect
        imageSrc="/water-ripple-background.svg"
        className="water-ripple-layer"
      />

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
            <span>Battle-Tested Hardware &amp; Tooling</span>
          </div>
          <h1 className={styles.title}>Developer Gear &amp; Tools</h1>
          <p className={styles.subtitle}>
            A hand-picked collection of hardware, peripherals, dev tools, and engineering literature that power my daily engineering workflow.
          </p>
        </header>

        {/* FTC Legal Affiliate Disclosure Banner */}
        <aside className={styles.disclosureBanner} aria-label="Affiliate link disclosure">
          <div className={styles.disclosureIcon} aria-hidden="true">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="16" x2="12" y2="12" />
              <line x1="12" y1="8" x2="12.01" y2="8" />
            </svg>
          </div>
          <p className={styles.disclosureText}>
            <span className={styles.disclosureHighlight}>Affiliate Disclosure:</span> This page contains affiliate links. If you make a purchase through these links, I may receive a small commission at no additional cost to you. I only recommend equipment, software, and books that I personally use, thoroughly test, or consider exceptional.
          </p>
        </aside>

        {/* Dynamic Store Filter & Listing */}
        <StoreListClient initialProducts={products || []} />
      </div>

      <Footer />
    </main>
  );
}
