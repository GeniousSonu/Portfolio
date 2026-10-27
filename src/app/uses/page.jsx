import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { client } from '@/sanity/client';
import { USES_PRODUCTS_QUERY } from '@/sanity/queries';
import { getOptimizedImageUrl } from '@/sanity/image';
import { AMAZON_AFFILIATE_TAG } from '@/data/gearProducts';
import styles from './uses.module.css';

export const revalidate = 30; // ISR cache revalidation every 30 seconds

export const metadata = {
  title: 'Uses — Workstation Rig, Dual 4K Displays & Dev Toolchain | SK Sahinur Islam',
  description:
    'Hardware specifications, dual monitors, storage hierarchy, code editors, terminal configurations, and daily productivity tools used by SK Sahinur Islam (Genious Sonu).',
  alternates: {
    canonical: 'https://genioussonu.me/uses',
  },
  openGraph: {
    title: 'Uses — SK Sahinur Islam Workstation Rig & Toolchain',
    description:
      'Ryzen 5 5600X, RTX 5060, 4K Acer Nitro, Dell pivot monitor, 6TB storage tiers, and developer tools used daily.',
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

  // Sahinur's verified workstation hardware
  const staticHardware = [
    {
      name: 'Acer Nitro VG270K V2 27" 4K UHD IPS Monitor',
      desc: 'Primary 27-inch 4K UHD display (3840 x 2160, 100% sRGB) delivering razor-sharp text clarity, expansive canvas for side-by-side terminal & IDE windows, and color accuracy for interface design.',
      tag: 'Primary 4K Display',
      url: 'https://link.amazon/B04di5nGT',
    },
    {
      name: 'Dell S2425HSM 24" Secondary Monitor',
      desc: 'Dedicated vertical/portrait side monitor with ergonomic height & pivot stand. Displays continuous Docker logs, server terminal streams, and live Telegram chat.',
      tag: 'Secondary Monitor',
      url: 'https://link.amazon/B0eQ7xMY4',
    },
    {
      name: 'NVIDIA GeForce RTX 5060 (Next Gen Power)',
      desc: 'Dedicated graphics card handling GPU-accelerated computing, WebGL 3D shaders (Three.js / Globe.gl), local neural net acceleration, and multi-display driving.',
      tag: 'Graphics (GPU)',
      url: 'https://link.amazon/B01KFpqaB',
    },
    {
      name: 'AMD Ryzen 5 5600X Processor',
      desc: '6-Core, 12-Thread processor (boost up to 4.6 GHz) delivering fast Next.js Turbopack compile cycles, concurrent container workloads, and multithreaded backend pipelines.',
      tag: 'Processor (CPU)',
      url: 'https://link.amazon/B024XdQNe',
    },
    {
      name: 'AMD AM4 High-Performance Motherboard',
      desc: 'Stable workstation foundation equipped with PCIe 4.0 data channels, robust VRM power delivery, and multi-drive NVMe storage support.',
      tag: 'Motherboard',
      url: 'https://link.amazon/B0apuvRvA',
    },
    {
      name: 'Corsair Vengeance LPX 32GB (2x16GB) 3200MHz DDR4',
      desc: 'High-frequency dual-channel memory ensuring zero bottleneck when running multiple VS Code instances, local PostgreSQL/Redis instances, and Docker containers concurrently.',
      tag: '32GB RAM',
      url: '', // Link kept blank as requested
    },
    {
      name: 'WD_BLACK 1TB NVMe High-Performance SSD',
      desc: 'PCIe Gen4 system drive (5,150+ MB/s read) hosting primary operating systems, node_modules caches, and active repository trees for instant I/O response.',
      tag: 'Primary NVMe',
      url: 'https://link.amazon/B02Iy4ffO',
    },
    {
      name: 'Multi-Tiered Secondary Storage (4TB SSDs + 1TB HDD)',
      desc: '4TB combined fast SATA SSDs (2TB + 2TB) for container persistent volumes and VM images, paired with 1TB HDD for cold backups and system snapshots.',
      tag: 'Storage Array (6TB Total)',
      url: '', // Link kept blank as requested
    },
    {
      name: 'iQOO 13 Flagship (Snapdragon 8 Gen 3)',
      desc: 'Daily handheld device powered by Qualcomm Snapdragon 8 Gen 3. Used for 2FA security tokens, mobile PWA debugging, and instant Telegram live-chat dispatch.',
      tag: 'Mobile Driver',
      url: '', // Link kept blank as requested
    },
  ];

  const staticDevTools = [
    {
      name: 'Visual Studio Code',
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
      desc: 'GPU-accelerated terminal emulator running custom Zsh configuration with fzf fuzzy finding, zoxide, and autosuggestions.',
      tag: 'Terminal',
    },
    {
      name: 'Git & GitHub CLI',
      desc: 'Command-line version control with signed commits, rebase workflows, and automated continuous delivery actions.',
      tag: 'VCS',
    },
    {
      name: 'Docker Desktop & Podman',
      desc: 'Containerized staging for microservices, database clusters, and cloud-native testing environments.',
      tag: 'Containers',
    },
  ];

  const staticProductivity = [
    {
      name: 'Obsidian & Local Markdown',
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

      <main className={styles.inner} data-route="/uses">
        <header className={styles.header}>
          <div className={styles.eyebrow}>
            <span className={styles.pulseDot} aria-hidden="true" />
            <span>Workspace &amp; Engineering Toolchain</span>
          </div>
          <h1 className={styles.title}>What I Use Daily</h1>
          <p className={styles.subtitle}>
            A transparent inventory of the physical hardware components, dual-display monitors, storage hierarchy, and developer tooling that power my daily engineering workflow.
          </p>
        </header>

        {/* Amazon Associate Legal Disclosure Banner */}
        <aside className={styles.disclosureBanner} aria-label="Affiliate link disclosure">
          <div className={styles.disclosureIcon} aria-hidden="true">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="16" x2="12" y2="12" />
              <line x1="12" y1="8" x2="12.01" y2="8" />
            </svg>
          </div>
          <p className={styles.disclosureText}>
            <span className={styles.disclosureHighlight}>Amazon Associate Disclosure:</span> As an Amazon Associate, I earn from qualifying purchases (Tracking ID: <code>{AMAZON_AFFILIATE_TAG}</code>). Verified gear items link directly to Amazon. Unlinked items are actively part of my rig and will have links updated as available.
          </p>
        </aside>

        {/* Section 1: Hardware & Desk Setup */}
        <section className={styles.section}>
          <h2 className={styles.sectionHeading}>
            <span className={styles.sectionIcon}>⚡</span>
            Workstation Rig &amp; Displays
          </h2>
          <div className={styles.itemsList}>
            {staticHardware.map((item) => (
              <div key={item.name} className={styles.itemRow}>
                <div className={styles.itemMain}>
                  <h3 className={styles.itemName}>{item.name}</h3>
                  <p className={styles.itemDesc}>{item.desc}</p>
                </div>
                <div className={styles.itemSide}>
                  <span className={styles.itemTag}>{item.tag}</span>
                  {item.url ? (
                    <a
                      href={item.url}
                      target="_blank"
                      rel="noopener noreferrer sponsored"
                      className={styles.itemLink}
                      aria-label={`View ${item.name} on Amazon`}
                    >
                      <span>Amazon</span>
                      <span>↗</span>
                    </a>
                  ) : null}
                </div>
              </div>
            ))}
          </div>

          {/* Quick link to full store catalog */}
          <div className={styles.storeCallout}>
            <div>
              <h3 className={styles.storeCalloutTitle}>Explore the Full Gear Catalog</h3>
              <p className={styles.storeCalloutDesc}>
                Browse filtered categories, technical specs, and status of all components in my custom store showcase.
              </p>
            </div>
            <Link href="/store" className={styles.storeCalloutBtn}>
              <span>Open Gear Store</span>
              <span>→</span>
            </Link>
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

        {/* Section 4: Recommended Gear from Sanity (if any exist) */}
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
                            rel="noopener noreferrer sponsored"
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
    </div>
  );
}
