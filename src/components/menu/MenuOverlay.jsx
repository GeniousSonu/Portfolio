'use client';

import React, { useState, useEffect, useRef } from 'react';
import MenuHeader from './MenuHeader';
import ViewSwitcher from './ViewSwitcher';
import MenuSection from './MenuSection';
import MenuAllPagesList from './MenuAllPagesList';
import MenuFooter from './MenuFooter';
import { MENU_SECTIONS } from './menuData';
import styles from './menu.module.css';

/**
 * MenuOverlay Component
 * Implements Section 3 (Structure) & Section 6 (Accessibility):
 * - Fixed inset-0 overlay with independent scroll container
 * - Safe area insets (top/bottom)
 * - Backdrop tap outside 480px content column dismisses
 * - Esc key dismisses
 * - Focus trap, focuses search on open, returns focus to trigger on close
 * - View switcher between "Sections" (grouped grid) and "All pages" (flat list)
 * - Bottom status block
 */
export default function MenuOverlay({
  isOpen,
  onClose,
  onOpenPalette,
  onNavigate,
  triggerRef,
}) {
  const [currentView, setCurrentView] = useState('sections'); // 'sections' | 'all'
  const overlayRef = useRef(null);
  const contentColRef = useRef(null);
  const searchBtnRef = useRef(null);

  // Focus management & keyboard listeners
  useEffect(() => {
    if (!isOpen) return;

    const triggerEl = triggerRef?.current;

    // Focus search button on open per Section 6
    const timer = setTimeout(() => {
      searchBtnRef.current?.focus();
    }, 60);

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
        return;
      }

      if (e.key === 'Tab') {
        const focusables = Array.from(
          overlayRef.current?.querySelectorAll(
            'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
          ) || []
        );

        if (focusables.length === 0) return;

        const firstEl = focusables[0];
        const lastEl = focusables[focusables.length - 1];

        if (e.shiftKey) {
          if (document.activeElement === firstEl) {
            e.preventDefault();
            lastEl.focus();
          }
        } else {
          if (document.activeElement === lastEl) {
            e.preventDefault();
            firstEl.focus();
          }
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      clearTimeout(timer);
      window.removeEventListener('keydown', handleKeyDown);
      // Return focus to hamburger trigger on close per Section 6
      triggerEl?.focus();
    };
  }, [isOpen, onClose, triggerRef]);

  // Reset view to 'sections' when re-opening
  useEffect(() => {
    if (isOpen) {
      setCurrentView('sections');
    }
  }, [isOpen]);

  // Click outside 480px content column dismisses
  const handleOverlayClick = (e) => {
    if (contentColRef.current && !contentColRef.current.contains(e.target)) {
      onClose();
    }
  };

  const handleOpenSearch = () => {
    onClose();
    if (onOpenPalette) {
      setTimeout(() => {
        onOpenPalette();
      }, 80);
    }
  };

  if (!isOpen) return null;

  let cumulativeStagger = 0;

  return (
    <div
      ref={overlayRef}
      id="mobile-nav"
      className={`${styles.overlay} ${isOpen ? styles.overlayOpen : ''}`}
      role="dialog"
      aria-modal="true"
      aria-label="Site menu"
      onClick={handleOverlayClick}
      data-lenis-prevent="true"
      onWheel={(e) => e.stopPropagation()}
    >
      <div ref={contentColRef} className={styles.contentColumn}>
        {/* Sticky Header with Search button & Close button */}
        <MenuHeader
          searchRef={searchBtnRef}
          onOpenSearch={handleOpenSearch}
          onClose={onClose}
        />

        {/* View Switcher: Sections | All pages */}
        <ViewSwitcher
          currentView={currentView}
          onViewChange={setCurrentView}
        />

        {/* Dynamic View: Grouped Sections Grid or Flat All Pages List */}
        {currentView === 'sections' ? (
          <div
            id="panel-sections"
            role="tabpanel"
            aria-labelledby="tab-sections"
          >
            {MENU_SECTIONS.map((section, sIdx) => {
              const baseStagger = cumulativeStagger;
              cumulativeStagger += section.items.length;

              return (
                <MenuSection
                  key={section.id}
                  section={section}
                  isFirst={sIdx === 0}
                  baseStaggerIndex={baseStagger}
                  onNavigate={onNavigate}
                />
              );
            })}
          </div>
        ) : (
          <MenuAllPagesList onNavigate={onNavigate} />
        )}

        {/* Bottom Block Footer */}
        <MenuFooter onNavigate={onNavigate} />
      </div>
    </div>
  );
}
