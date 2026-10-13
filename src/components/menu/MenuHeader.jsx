'use client';

import React from 'react';
import styles from './menu.module.css';

/**
 * MenuHeader Component
 * Implements Section 3.2 Sticky Header:
 * - 64px height, sticky top
 * - Full-width flexible 44px Search button with ⌘K badge
 * - 44x44px Close button with x glyph
 */
export default function MenuHeader({ searchRef, onOpenSearch, onClose }) {
  return (
    <header className={styles.stickyHeader}>
      <button
        ref={searchRef}
        type="button"
        className={styles.searchBtn}
        onClick={onOpenSearch}
        aria-label="Search and run commands (Command K)"
      >
        <svg
          className={styles.searchIcon}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <circle cx="11" cy="11" r="8" />
          <line x1="21" y1="21" x2="16.65" y2="16.65" />
        </svg>
        <span className={styles.searchText}>Search &amp; commands</span>
        <div className={styles.spacer} aria-hidden="true" />
        <kbd className={styles.kbdBadge}>⌘K</kbd>
      </button>

      <button
        type="button"
        className={styles.closeBtn}
        onClick={onClose}
        aria-label="Close menu"
      >
        <span aria-hidden="true">×</span>
      </button>
    </header>
  );
}
