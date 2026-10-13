'use client';

import React from 'react';
import MenuCard from './MenuCard';
import styles from './menu.module.css';

/**
 * MenuSection Component
 * Implements Section 3.4 Section Layout:
 * - Label row: // {NAME} + 12px gap + count chip (05) + flex-1 hairline rule
 * - Label margin: 24px above (32px for first section), 12px below
 * - Grid: 2-column (or 3-column on >=640px) with 10px gap
 */
export default function MenuSection({
  section,
  isFirst = false,
  baseStaggerIndex = 0,
  onNavigate,
}) {
  const { name, count, items } = section;

  return (
    <section className={styles.sectionBlock} aria-labelledby={`menu-section-${section.id}`}>
      <div
        className={`${styles.sectionHeader} ${isFirst ? styles.firstSectionHeader : ''}`}
        id={`menu-section-${section.id}`}
      >
        <span className={styles.sectionLabel}>{'//'} {name}</span>
        <span className={styles.countChip}>{count}</span>
        <div className={styles.hairlineRule} aria-hidden="true" />
      </div>

      <div className={styles.cardGrid}>
        {items.map((item, idx) => (
          <MenuCard
            key={item.id}
            item={item}
            staggerIndex={baseStaggerIndex + idx}
            onNavigate={onNavigate}
          />
        ))}
      </div>
    </section>
  );
}
