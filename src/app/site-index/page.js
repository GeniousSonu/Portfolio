import React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { PageShell, PageHeader, Container, Section } from '@/components/layout';
import { buildMetadata } from '@/lib/seo';
import {
  NAV_GROUPS,
  NAVIGATION_ITEMS,
  FOOTER_LEGAL_ITEMS,
  EXCLUDED_FROM_NAV,
} from '@/config/navigation';
import styles from './siteIndex.module.css';

/**
 * Site Index and Route Directory
 * Development tool for inspecting configured platform routes and navigation groups.
 */
export const metadata = buildMetadata({
  title: 'Site Index — Route Directory',
  description: 'Directory of platform routes, navigation groups, and status states.',
  path: '/site-index',
  noIndex: true,
});

export default function SiteIndexPage() {
  if (process.env.NODE_ENV === 'production') {
    notFound();
  }

  const allGroups = [
    ...NAV_GROUPS,
    { id: 'legal', label: 'Legal & Policies', description: 'Mandatory compliance, terms and data policies' },
    { id: 'excluded', label: 'Internal & Utility', description: 'Administrative, PWA and internal review screens' },
  ];

  const getItemsForGroup = (groupId) => {
    if (groupId === 'legal') return FOOTER_LEGAL_ITEMS;
    if (groupId === 'excluded') return EXCLUDED_FROM_NAV;
    return NAVIGATION_ITEMS.filter((item) => item.group === groupId);
  };

  return (
    <PageShell>
      <PageHeader
        eyebrow="[ ROUTE DIRECTORY ]"
        title="Complete Site Topology Index"
        summary="Directory of all navigatable routes, homepage anchor sections, and documents configured across the platform."
      />

      <Section>
        <Container>
          <div className={styles.statsBar}>
            <div className={styles.stat}>
              <span className={styles.statVal}>{NAVIGATION_ITEMS.length + FOOTER_LEGAL_ITEMS.length + EXCLUDED_FROM_NAV.length}</span>
              <span className={styles.statLabel}>Total Endpoints</span>
            </div>
            <div className={styles.stat}>
              <span className={styles.statVal}>{NAVIGATION_ITEMS.filter(i => i.status === 'live').length}</span>
              <span className={styles.statLabel}>Live Routes</span>
            </div>
            <div className={styles.stat}>
              <span className={styles.statVal}>{NAVIGATION_ITEMS.filter(i => i.type === 'anchor').length}</span>
              <span className={styles.statLabel}>Homepage Anchors</span>
            </div>
            <div className={styles.stat}>
              <span className={styles.statVal}>{NAVIGATION_ITEMS.filter(i => i.status === 'stub').length + EXCLUDED_FROM_NAV.filter(i => i.status === 'stub').length}</span>
              <span className={styles.statLabel}>Draft Routes</span>
            </div>
          </div>

          <div className={styles.groupsGrid}>
            {allGroups.map((group) => {
              const items = getItemsForGroup(group.id);
              if (!items || items.length === 0) return null;

              return (
                <div key={group.id} className={styles.groupCard}>
                  <div className={styles.groupHeader}>
                    <div className={styles.groupMeta}>
                      <span className={styles.groupTag}>{group.id.toUpperCase()}</span>
                      <h2 className={styles.groupTitle}>{group.label}</h2>
                    </div>
                    <span className={styles.groupCount}>{items.length} items</span>
                  </div>
                  <p className={styles.groupDesc}>{group.description}</p>

                  <ul className={styles.itemsList}>
                    {items.map((item) => (
                      <li key={item.id} className={styles.itemRow}>
                        <div className={styles.itemMain}>
                          <Link href={item.href} className={styles.itemLink}>
                            <span>{item.label}</span>
                            <span className={styles.itemArrow}>↗</span>
                          </Link>
                          <span className={styles.itemHref}>{item.href}</span>
                          <p className={styles.itemDescription}>{item.description}</p>
                        </div>

                        <div className={styles.itemBadges}>
                          <span className={`${styles.statusBadge} ${item.status === 'live' ? styles.statusLive : styles.statusStub}`}>
                            {item.status}
                          </span>
                          <span className={styles.typeBadge}>
                            {item.type || 'page'}
                          </span>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>
        </Container>
      </Section>
    </PageShell>
  );
}
