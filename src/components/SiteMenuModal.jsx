'use client';

import React, { useEffect, useRef } from 'react';
import Link from 'next/link';
import { useOverlay } from '@/context/OverlayContext';
import { useTransitionRouter } from '@/context/TransitionContext';
import { NAV_GROUPS, NAVIGATION_ITEMS, FOOTER_LEGAL_ITEMS } from '@/config/navigation';
import navState from '@/lib/navState';
import styles from './SiteMenuModal.module.css';

export default function SiteMenuModal() {
  const { activeOverlay, closeOverlay } = useOverlay();
  const transitionRouter = useTransitionRouter();
  const isOpen = activeOverlay === 'site_menu';
  const modalRef = useRef(null);
  const closeBtnRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => {
        closeBtnRef.current?.focus();
      }, 50);

      const handleKeyDown = (e) => {
        if (e.key === 'Escape') {
          e.preventDefault();
          closeOverlay('site_menu');
        }
      };

      window.addEventListener('keydown', handleKeyDown);
      return () => {
        clearTimeout(timer);
        window.removeEventListener('keydown', handleKeyDown);
      };
    }
  }, [isOpen, closeOverlay]);

  if (!isOpen) return null;

  const handleItemClick = (e, item) => {
    e.preventDefault();
    closeOverlay('site_menu');

    if (item.href.startsWith('/#') || item.href.startsWith('#')) {
      const targetHash = item.href.replace(/^\//, '');
      if (window.location.pathname === '/') {
        navState.startAnchorNav();
        setTimeout(() => {
          const el = document.querySelector(targetHash);
          if (el) {
            const navHeight = 75;
            const top = el.getBoundingClientRect().top + window.scrollY - navHeight;
            window.scrollTo({ top: Math.max(0, top), behavior: 'smooth' });
          }
        }, 50);
      } else {
        if (typeof sessionStorage !== 'undefined') {
          sessionStorage.setItem('portfolio_scroll_target', targetHash);
        }
        transitionRouter.push('/' + targetHash);
      }
      return;
    }

    navState.startRouteNav();
    transitionRouter.push(item.href);
  };

  return (
    <div
      className={styles.backdrop}
      onClick={() => closeOverlay('site_menu')}
      role="presentation"
      data-lenis-prevent="true"
    >
      <div
        ref={modalRef}
        className={styles.modal}
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-label="All Pages Site Navigation Directory"
        data-lenis-prevent="true"
      >
        <div className={styles.header}>
          <div>
            <span className={styles.eyebrow}>[ COMPLETE DIRECTORY · OPERATOR CONSOLE ]</span>
            <h2 className={styles.title}>All Pages &amp; Architecture Map</h2>
          </div>
          <button
            ref={closeBtnRef}
            className={styles.closeBtn}
            onClick={() => closeOverlay('site_menu')}
            aria-label="Close All Pages Directory (Esc)"
          >
            <span>✕ ESC</span>
          </button>
        </div>

        <div className={styles.body}>
          <div className={styles.groupsGrid}>
            {NAV_GROUPS.map((group) => {
              const items = NAVIGATION_ITEMS.filter((i) => i.group === group.id);
              if (!items.length) return null;

              return (
                <div key={group.id} className={styles.groupCol}>
                  <div className={styles.groupHeader}>
                    <span className={styles.groupBadge}>{group.id.toUpperCase()}</span>
                    <h3 className={styles.groupTitle}>{group.label}</h3>
                  </div>
                  <p className={styles.groupDesc}>{group.description}</p>

                  <ul className={styles.itemList}>
                    {items.map((item) => (
                      <li key={item.id} className={styles.itemRow}>
                        <a
                          href={item.href}
                          onClick={(e) => handleItemClick(e, item)}
                          className={styles.itemLink}
                        >
                          <div className={styles.itemTop}>
                            <span className={styles.itemLabel}>{item.label}</span>
                            <span className={styles.itemArrow}>↗</span>
                          </div>
                          <span className={styles.itemDesc}>{item.description}</span>
                          {item.status === 'stub' && (
                            <div className={styles.itemMeta}>
                              <span className={styles.stubBadge}>STUB</span>
                            </div>
                          )}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}

            {/* Legal Column */}
            <div className={styles.groupCol}>
              <div className={styles.groupHeader}>
                <span className={styles.groupBadge}>LEGAL</span>
                <h3 className={styles.groupTitle}>Compliance</h3>
              </div>
              <p className={styles.groupDesc}>Privacy notices, terms of service and zero-retention policies</p>

              <ul className={styles.itemList}>
                {FOOTER_LEGAL_ITEMS.map((item) => (
                  <li key={item.id} className={styles.itemRow}>
                    <a
                      href={item.href}
                      onClick={(e) => handleItemClick(e, item)}
                      className={styles.itemLink}
                    >
                      <div className={styles.itemTop}>
                        <span className={styles.itemLabel}>{item.label}</span>
                        <span className={styles.itemArrow}>↗</span>
                      </div>
                      <span className={styles.itemDesc}>{item.description}</span>
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        <div className={styles.footer}>
          <div className={styles.footerLeft}>
            <span className={styles.footerMeta}>TOTAL NAVIGABLE DESTINATIONS: {NAVIGATION_ITEMS.length + FOOTER_LEGAL_ITEMS.length}</span>
          </div>
          <Link
            href="/site-index"
            onClick={() => closeOverlay('site_menu')}
            className={styles.siteIndexLink}
          >
            <span>Open Dedicated Site Index Review Page →</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
