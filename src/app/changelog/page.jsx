import React from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { client } from '@/sanity/client';
import { CHANGELOG_QUERY } from '@/sanity/queries';
import { PortableText } from '@portabletext/react';
import styles from './changelog.module.css';

export const revalidate = 30; // ISR 30s cache revalidation

export const metadata = {
  title: 'Changelog — Feature Releases & System Updates',
  description: 'Chronological timeline of system enhancements, architectural releases, and feature milestones on genioussonu.me.',
  openGraph: {
    title: 'Changelog — SK Sahinur Islam',
    description: 'Chronological timeline of feature releases, architectural upgrades, and engineering updates.',
    url: 'https://genioussonu.me/changelog',
  },
};

export default async function ChangelogPage() {
  let entries = [];
  try {
    entries = await client.fetch(CHANGELOG_QUERY);
  } catch (err) {
    console.warn('[ChangelogPage] Error fetching entries from Sanity:', err?.message || err);
    entries = [];
  }

  const hasEntries = Array.isArray(entries) && entries.length > 0;

  return (
    <div className={styles.pageContainer}>
      <div className={styles.ambientGlow} aria-hidden="true" />
      <Navbar />

      <main className={styles.inner}>
        <header className={styles.header}>
          <div className={styles.eyebrow}>
            <span className={styles.pulseDot} aria-hidden="true" />
            <span>Changelog · System Releases</span>
          </div>
          <h1 className={styles.title}>Public Changelog</h1>
          <p className={styles.subtitle}>
            A chronological timeline of feature launches, real-time infrastructure improvements, and system architectural updates.
          </p>
        </header>

        {hasEntries ? (
          <div className={styles.timeline}>
            <div className={styles.timelineLine} aria-hidden="true" />

            {entries.map((entry) => {
              const formattedDate = entry.date
                ? new Date(entry.date + 'T00:00:00').toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric',
                  })
                : 'Recent Release';

              return (
                <article key={entry._id} className={styles.entry}>
                  <div className={styles.node} aria-hidden="true" />

                  <div className={styles.card}>
                    <div className={styles.metaRow}>
                      <span className={styles.dateBadge}>{formattedDate}</span>
                      {entry.category && (
                        <span className={styles.categoryBadge}>{entry.category}</span>
                      )}
                      {Array.isArray(entry.tags) &&
                        entry.tags.map((tag, idx) => (
                          <span key={idx} className={styles.tagBadge}>
                            #{tag}
                          </span>
                        ))}
                    </div>

                    <h2 className={styles.entryTitle}>{entry.title}</h2>

                    {entry.description && (
                      <div className={styles.entryDescription}>
                        <PortableText value={entry.description} />
                      </div>
                    )}
                  </div>
                </article>
              );
            })}
          </div>
        ) : (
          <div className={styles.emptyState}>
            <div className={styles.emptyIcon} aria-hidden="true">
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" />
                <polyline points="12 6 12 12 16 14" />
              </svg>
            </div>
            <h3 className={styles.emptyTitle}>Changelog Entries Publishing Soon</h3>
            <p className={styles.emptyText}>
              Entries are configured in Sanity Studio. Once published, release notes and feature summaries will appear here in chronological order.
            </p>
            <Link href="/studio" className={styles.studioLink}>
              Open Sanity Studio →
            </Link>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
