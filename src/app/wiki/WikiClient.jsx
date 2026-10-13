'use client';

import React, { useState, useMemo } from 'react';
import styles from './wiki.module.css';

const WIKI_ENTRIES = [
  {
    id: 'patent-iot-cold-chain',
    category: 'Patent Blueprints',
    title: 'IoT Real-Time Solar Vaccine Storage & Temperature Monitoring',
    readTime: '6 min read',
    excerpt:
      'Architectural breakdown of the 2025 granted patent. Employs NodeMCU ESP8266 microcontrollers, calibrated DHT22 sensors, and Peltier thermoelectric cooling modules powered by solar MPPT circuitry.',
    takeaway: 'Guarantees 2°C–8°C cold-chain preservation for rural medical logistics via MQTT telemetry over TLS.',
    tags: ['IoT', 'Patent', 'MQTT', 'Hardware', 'Solar'],
  },
  {
    id: 'nextjs-isr-edge-caching',
    category: 'Systems Architecture',
    title: 'High-Throughput Next.js App Router & Zero-Stale Caching',
    readTime: '5 min read',
    excerpt:
      'Designing dual-tier caching topologies with Incremental Static Regeneration (ISR), React Server Components (RSC), and Cloudflare Edge Network. Prevents layout shifts, eliminates stale worker caches, and secures instant first-byte responses.',
    takeaway: 'Leverages Network-First PWA navigation rules combined with granular tag-based cache revalidation.',
    tags: ['Next.js 16', 'React 19', 'ISR', 'Edge Caching', 'PWA'],
  },
  {
    id: 'webrtc-mesh-vs-sfu',
    category: 'Networking & Protocols',
    title: 'WebRTC P2P Mesh vs. SFU Topologies in Collaborative Apps',
    readTime: '7 min read',
    excerpt:
      'Deep dive into full-mesh peer-to-peer topologies for small groups (≤ 4 participants) vs. Selective Forwarding Units (SFU) for scale. Analyzes SDP offer/answer exchanges, ICE candidate gathering, and STUN/TURN traversal.',
    takeaway: 'Direct P2P mesh provides zero server transcoding cost, while multi-peer broadcasting requires bitrate choking algorithms.',
    tags: ['WebRTC', 'P2P', 'Networking', 'Video Streams', 'ICE'],
  },
  {
    id: 'zero-trust-public-endpoints',
    category: 'Security & Auth',
    title: 'Defensive Engineering & Zero-Trust Public API Endpoints',
    readTime: '4 min read',
    excerpt:
      'Tactics for securing public form endpoints and contact gateways against distributed spam and credential stuffing: honeypot trap design, time-on-form thresholds, Cloudflare Turnstile token validation, and IP hash sliding windows.',
    takeaway: 'Silent 200 OK honeypot trapping denies malicious bots feedback loops while maintaining human deliverability.',
    tags: ['Security', 'Zero-Trust', 'Rate Limiting', 'Honeypot', 'API'],
  },
  {
    id: 'linux-server-hardening',
    category: 'DevOps & Infrastructure',
    title: 'Production Linux Server Hardening & Zero-Downtime Deployments',
    readTime: '8 min read',
    excerpt:
      'Hardening Ubuntu 24.04 LTS servers for production: SSH key-only access with custom ports, UFW strict firewall profiles, Fail2ban intrusion prevention, Docker containerization, and automated Let’s Encrypt certificate renewal.',
    takeaway: 'Automated health-checked rollbacks combined with systemd daemon supervision yield 99.99% service availability.',
    tags: ['Linux', 'Ubuntu', 'DevOps', 'Docker', 'Nginx', 'SSL'],
  },
  {
    id: 'scalable-postgres-rls',
    category: 'Databases & Storage',
    title: 'Supabase Postgres Row-Level Security (RLS) & Schema Design',
    readTime: '5 min read',
    excerpt:
      'Architecting multi-tenant Postgres schemas with strict RLS policies. Distinguishing between authenticated user permissions, anon read policies, and privileged service-role bypasses for transactional consistency.',
    takeaway: 'Always verify RLS policies against unauthenticated anon queries; prevent silent leaks before production launch.',
    tags: ['PostgreSQL', 'Supabase', 'RLS', 'SQL', 'Databases'],
  },
];

const CATEGORIES = [
  'All Topics',
  'Patent Blueprints',
  'Systems Architecture',
  'Networking & Protocols',
  'Security & Auth',
  'DevOps & Infrastructure',
  'Databases & Storage',
];

export default function WikiClient() {
  const [selectedCategory, setSelectedCategory] = useState('All Topics');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredEntries = useMemo(() => {
    return WIKI_ENTRIES.filter((entry) => {
      const matchesCategory =
        selectedCategory === 'All Topics' || entry.category === selectedCategory;
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        entry.title.toLowerCase().includes(q) ||
        entry.excerpt.toLowerCase().includes(q) ||
        entry.tags.some((t) => t.toLowerCase().includes(q));
      return matchesCategory && matchesSearch;
    });
  }, [selectedCategory, searchQuery]);

  return (
    <>
      <div className={styles.filterBar}>
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            type="button"
            onClick={() => setSelectedCategory(cat)}
            className={`${styles.filterBtn} ${
              selectedCategory === cat ? styles.filterBtnActive : ''
            }`}
          >
            {cat}
          </button>
        ))}

        <div className={styles.searchBox}>
          <input
            type="text"
            placeholder="Search wiki articles or tags..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={styles.searchInput}
          />
        </div>
      </div>

      {filteredEntries.length === 0 ? (
        <div className={styles.emptyState}>
          No articles match your query &quot;{searchQuery}&quot; under &quot;{selectedCategory}&quot;.
        </div>
      ) : (
        <div className={styles.wikiGrid}>
          {filteredEntries.map((entry) => (
            <article key={entry.id} className={styles.wikiCard}>
              <div className={styles.cardTop}>
                <span className={styles.categoryTag}>{entry.category}</span>
                <span className={styles.readTime}>{entry.readTime}</span>
              </div>

              <h2 className={styles.cardTitle}>{entry.title}</h2>
              <p className={styles.cardExcerpt}>{entry.excerpt}</p>

              <div className={styles.keyTakeaway}>
                <strong>Core Takeaway:</strong> {entry.takeaway}
              </div>

              <div className={styles.cardFooter}>
                <div className={styles.tags}>
                  {entry.tags.map((tag) => (
                    <span key={tag} className={styles.tag}>
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </>
  );
}
