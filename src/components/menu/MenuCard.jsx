'use client';

import React from 'react';
import styles from './menu.module.css';

/**
 * MenuCard Component
 * Implements Section 4 Card Anatomy (Founder Decision 2026-10-12):
 * - Icon + Title ONLY, zero descriptions
 * - No per-card index numbers on card face (count chips carry orientation)
 * - 16px padding, 14px border radius, 96px min-height
 * - Lucide icon (22x22px, stroke 1.5, round caps/joins, aria-hidden="true")
 * - 14px top-right accent arrow for external link (WEFIK only)
 * - Title: 15px / 20px semi-bold, single line truncated with ellipsis
 * - 120ms press active scale(0.96) + border accent + icon accent
 * - Staggered 30ms entrance animation (280ms cubic-bezier)
 */
export default function MenuCard({ item, staggerIndex = 0, onNavigate }) {
  const { id, title, href, icon: IconComponent, isExternal } = item;

  const handleClick = (e) => {
    if (onNavigate) {
      onNavigate(e, href);
    }
  };

  return (
    <a
      href={href}
      className={styles.card}
      style={{ '--stagger-index': staggerIndex }}
      onClick={handleClick}
      aria-label={isExternal ? `${title} (opens external site)` : title}
    >
      <div className={styles.cardTopRow}>
        {IconComponent && (
          <IconComponent
            size={22}
            strokeWidth={1.5}
            className={styles.cardIcon}
            aria-hidden="true"
          />
        )}
        {isExternal && (
          <span className={styles.externalArrow} aria-hidden="true">
            ↗
          </span>
        )}
      </div>

      <div className={styles.cardTitle}>{title}</div>
    </a>
  );
}

