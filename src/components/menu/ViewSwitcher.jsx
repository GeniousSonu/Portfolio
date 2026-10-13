'use client';

import React from 'react';
import styles from './menu.module.css';

/**
 * ViewSwitcher Component
 * Implements Section 3.3 Segmented Control:
 * - 44px total height, full width
 * - Two segments: Sections | All pages
 * - Sliding active segment indicator with 200ms transform
 */
export default function ViewSwitcher({ currentView, onViewChange }) {
  const isAllPages = currentView === 'all';

  return (
    <div
      className={styles.switcher}
      role="tablist"
      aria-label="Menu navigation view switcher"
    >
      <div
        className={styles.switcherIndicator}
        style={{
          transform: isAllPages ? 'translateX(100%)' : 'translateX(0)',
        }}
        aria-hidden="true"
      />

      <button
        type="button"
        role="tab"
        id="tab-sections"
        aria-selected={!isAllPages}
        aria-controls="panel-sections"
        className={`${styles.segmentBtn} ${!isAllPages ? styles.segmentBtnActive : ''}`}
        onClick={() => onViewChange('sections')}
      >
        Sections
      </button>

      <button
        type="button"
        role="tab"
        id="tab-all-pages"
        aria-selected={isAllPages}
        aria-controls="panel-all-pages"
        className={`${styles.segmentBtn} ${isAllPages ? styles.segmentBtnActive : ''}`}
        onClick={() => onViewChange('all')}
      >
        All pages
      </button>
    </div>
  );
}
