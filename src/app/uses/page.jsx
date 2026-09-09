import React from 'react';
import Image from 'next/image';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { client } from '@/sanity/client';
import { USES_PRODUCTS_QUERY } from '@/sanity/queries';
import { getOptimizedImageUrl } from '@/sanity/image';
import styles from './uses.module.css';

export const revalidate = 30; // ISR cache revalidation every 30 seconds

export const metadata = {
  title: 'Uses — Workspace, Gear & Dev Toolchain | SK Sahinur Islam',
  description: 'Hardware, software, code editors, terminal configurations, and productivity setups used daily by SK Sahinur Islam.',
  openGraph: {
    title: 'Uses — SK Sahinur Islam Setup & Toolchain',
    description: 'Hardware, code editors, terminal setups, and developer tools used daily.',
    url: 'https://genioussonu.me/uses',
  },
};

export default async function UsesPage() {
  let usesProducts = [];
  try {
    usesProducts = await client.fetch(USES_PRODUCTS_QUERY);
  } catch (err) {
    console.warn('[UsesPage] Error fetching products from Sanity:', err?.message || err);
    usesProducts = [];
  }

  const staticHardware = [
    {
      name: 'MacBook Pro & Linux Workstation',
      desc: 'Primary portable machine for engineering and architecture design, paired with a dedicated Linux dual-boot environment for systems administration and local testing.',
      tag: 'Hardware',
    },
    {
      name: 'Dell UltraSharp 4K Monitor',
      desc: 'High-density color-accurate display with USB-C hub connectivity for clean single-cable workspace routing.',
      tag: 'Display',
    },
    {
      name: 'Custom Mechanical Keyboard',
      desc: 'Tactile mechanical keyboard customized for all-day typing comfort and low latency input.',
      tag: 'Peripherals',
    },
    {
      name: 'Sony WH-1000XM Series ANC Headphones',
      desc: 'Essential for deep work blocks, background noise isolation, and listening to ambient/synthwave while coding.',
      tag: 'Audio',
    },
  ];

  const staticDevTools = [
    {
      name: 'Visual Studio Code & Cursor IDE',
      desc: 'Configured with custom dark system themes, minimal status bars, and strict ESLint/Prettier automation on save.',
      tag: 'Editor',
    },
    {
      name: 'Geist Mono & JetBrains Mono',
      desc: 'Clean, legible monospaced developer fonts with programming ligatures for crystal-clear code readability.',
      tag: 'Typography',
    },
    {
      name: 'Alacritty & Warp Terminal',
      desc: 'GPU-accelerated terminal emulator running custom Zsh configuration with fzf fuzzy finding and autosuggestions.',
      tag: 'Terminal',
    },
    {
      name: 'Git & GitHub CLI',
      desc: 'Command-line version control with signed commits, rebase workflows, and automated continuous delivery actions.',
      tag: 'VCS',
    },
  ];

  const staticProductivity = [
    {
      name: 'Obsidian & Markdown',
      desc: 'Local-first note-taking and knowledge base for architectural brainstorming, RFCs, and engineering logs.',
      tag: 'Notes',
    },
    {
      name: 'Raycast',
      desc: 'Extensible launcher replacing default Spotlight for instant clipboard history, window management, and script executions.',
      tag: 'System',
    },
    {
      name: 'Postman & Thunder Client',
      desc: 'API endpoint testing, contract validation, and webhook verification for backend microservices.',
      tag: 'API',
    },
    {
      name: 'Figma',
      desc: 'Component prototyping, design system token alignment, and interface layout drafts prior to front-end implementation.',
      tag: 'Design',
    },
  ];

  return (
    <div className={styles.pageContainer}>
      <div className={styles.ambientGlow} aria-hidden="true" />
      <Navbar />

      <main className={styles.inner}>
        <header className={styles.header}>
          <div className={styles.eyebrow}>
            <span className={styles.pulseDot} aria-hidden="true" />
            <span>Workspace &amp; Toolchain</span>
          </div>
          <h1 className={styles.title}>What I Use Daily</h1>
          <p className={styles.subtitle}>
            A curated inventory of the hardware, software, developer tooling, and productivity stack that power my engineering workflows.
          </p>
        </header>

        {/* FTC Legal Affiliate Disclosure Banner */}
        <aside className={styles.disclosureBanner} aria-label="Affiliate link disclosure">
          <div className={styles.disclosureIcon} aria-hidden="true">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="16" x2="12" y2="12" />
              <line x1="12" y1="8" x2="12.01" y2="8" />
            </svg>
          </div>
          <p className={styles.disclosureText}>
            <span className={styles.disclosureHighlight}>Affiliate Disclosure:</span> Some hardware and equipment listed on this page carry affiliate links. If you purchase through these links, I may receive a small commission at zero additional cost to you. I only list gear and tools that I personally test, utilize, and find exceptional.
          </p>
        </aside>

        {/* Section 1: Hardware & Desk */}
        <section className={styles.section}>
          <h2 className={styles.sectionHeading}>
            <span className={styles.sectionIcon}>⚡</span>
            Hardware &amp; Desk Setup
          </h2>
          <div className={styles.itemsList}>
            {staticHardware.map((item) => (
              <div key={item.name} className={styles.itemRow}>
                <div className={styles.itemMain}>
                  <h3 className={styles.itemName}>{item.name}</h3>
                  <p className={styles.itemDesc}>{item.desc}</p>
                </div>
                <span className={styles.itemTag}>{item.tag}</span>
              </div>
            ))}
          </div>
        </section>

        {/* Section 2: Code Editor & Development */}
        <section className={styles.section}>
          <h2 className={styles.sectionHeading}>
            <span className={styles.sectionIcon}>💻</span>
            Editor &amp; Development Environment
          </h2>
          <div className={styles.itemsList}>
            {staticDevTools.map((item) => (
              <div key={item.name} className={styles.itemRow}>
                <div className={styles.itemMain}>
                  <h3 className={styles.itemName}>{item.name}</h3>
                  <p className={styles.itemDesc}>{item.desc}</p>
                </div>
                <span className={styles.itemTag}>{item.tag}</span>
              </div>
            ))}
          </div>
        </section>

        {/* Section 3: Productivity & Utilities */}
        <section className={styles.section}>
          <h2 className={styles.sectionHeading}>
            <span className={styles.sectionIcon}>🛠</span>
            Productivity &amp; System Apps
          </h2>
          <div className={styles.itemsList}>
            {staticProductivity.map((item) => (
              <div key={item.name} className={styles.itemRow}>
                <div className={styles.itemMain}>
                  <h3 className={styles.itemName}>{item.name}</h3>
                  <p className={styles.itemDesc}>{item.desc}</p>
                </div>
                <span className={styles.itemTag}>{item.tag}</span>
              </div>
            ))}
          </div>
        </section>

        {/* Section 4: Recommended Gear from Sanity */}
        {Array.isArray(usesProducts) && usesProducts.length > 0 && (
          <section className={styles.section}>
            <h2 className={styles.sectionHeading}>
              <span className={styles.sectionIcon}>📦</span>
              Featured Gear &amp; Desk Accessories
            </h2>
            <div className={styles.gearGrid}>
              {usesProducts.map((prod) => {
                const imgUrl = getOptimizedImageUrl(prod.image, 500, 320);
                return (
                  <div key={prod._id} className={styles.gearCard}>
                    {imgUrl && (
                      <div className={styles.gearImageWrap}>
                        <Image
                          src={imgUrl}
                          alt={prod.image?.alt || prod.name}
                          fill
                          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                          style={{ objectFit: 'cover' }}
                        />
                      </div>
                    )}
                    <div className={styles.gearContent}>
                      <h3 className={styles.gearTitle}>{prod.name}</h3>
                      <p className={styles.gearDesc}>{prod.description}</p>
                      <div className={styles.gearFooter}>
                        {prod.price && <span className={styles.gearPrice}>{prod.price}</span>}
                        {prod.affiliateUrl && (
                          <a
                            href={prod.affiliateUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={styles.gearBtn}
                          >
                            View Gear ↗
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        )}
      </main>

      <Footer />
    </div>
  );
}
