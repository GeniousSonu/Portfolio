'use client';

import React from 'react';
import { NAVIGATION_ITEMS, FOOTER_LEGAL_ITEMS } from '@/config/navigation';
import styles from './menu.module.css';

/**
 * MenuAllPagesList Component
 * Implements Section 3.3 "All pages" view:
 * - Flat list of all navigable routes
 * - >= 44px touch targets
 * - Hairline dividers
 * - 15px titles
 * - 16px chevron-right
 */
export default function MenuAllPagesList({ onNavigate }) {
  // Combine navigation items and legal items into a complete flat directory
  const allDestinations = [
    ...NAVIGATION_ITEMS,
    ...FOOTER_LEGAL_ITEMS,
  ];

  const handleClick = (e, href) => {
    if (onNavigate) {
      onNavigate(e, href);
    }
  };

  return (
    <div
      className={styles.flatList}
      id="panel-all-pages"
      role="tabpanel"
      aria-labelledby="tab-all-pages"
    >
      {allDestinations.map((item) => (
        <a
          key={item.id}
          href={item.href}
          className={styles.flatRow}
          onClick={(e) => handleClick(e, item.href)}
          aria-label={item.label}
        >
          <div className={styles.flatLeft}>
            <span className={styles.flatTitle}>{item.label}</span>
          </div>

          <svg
            className={styles.flatChevron}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <polyline points="9 18 15 12 9 6" />
          </svg>
        </a>
      ))}
    </div>
  );
}
