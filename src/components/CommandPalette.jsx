'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { Command } from 'cmdk';
import { useOverlay } from '@/context/OverlayContext';
import { useTransitionRouter } from '@/context/TransitionContext';
import { NAVIGATION_ITEMS, FOOTER_LEGAL_ITEMS } from '@/config/navigation';
import styles from './CommandPalette.module.css';

// SVG Icons
const SearchIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <circle cx="11" cy="11" r="8" />
    <line x1="21" y1="21" x2="16.65" y2="16.65" />
  </svg>
);

const SectionIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
    <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
  </svg>
);

const PageIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
    <polyline points="14 2 14 8 20 8" />
  </svg>
);

const BotIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <rect x="3" y="11" width="18" height="10" rx="2" />
    <circle cx="12" cy="5" r="2" />
    <path d="M12 7v4" />
    <line x1="8" y1="16" x2="8.01" y2="16" />
    <line x1="16" y1="16" x2="16.01" y2="16" />
  </svg>
);

const MailIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
    <polyline points="22,6 12,13 2,6" />
  </svg>
);

const CopyIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
    <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
  </svg>
);



export default function CommandPalette() {
  const router = useRouter();
  const transitionRouter = useTransitionRouter();
  const pathname = usePathname();
  const { activeOverlay, openOverlay, closeOverlay } = useOverlay();
  const [toastMessage, setToastMessage] = useState(null);
  const toastTimerRef = useRef(null);
  const dialogRef = useRef(null);
  const listRef = useRef(null);

  const isOpen = activeOverlay === 'palette';

  // Allow seamless mouse scrolling anywhere over the Command Palette
  useEffect(() => {
    if (!isOpen) return;
    const dialogEl = dialogRef.current;
    if (!dialogEl) return;

    const handleWheel = (e) => {
      e.stopPropagation();
      const listEl = listRef.current;
      if (!listEl) return;
      if (!listEl.contains(e.target)) {
        listEl.scrollTop += e.deltaY;
      }
    };

    dialogEl.addEventListener('wheel', handleWheel, { passive: true });
    return () => {
      dialogEl.removeEventListener('wheel', handleWheel);
    };
  }, [isOpen]);

  const showToast = useCallback((msg) => {
    if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
    setToastMessage(msg);
    toastTimerRef.current = setTimeout(() => {
      setToastMessage(null);
    }, 2500);
  }, []);

  // Global shortcut listener (Cmd+K / Ctrl+K)
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        if (isOpen) {
          closeOverlay('palette');
        } else {
          openOverlay('palette');
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, openOverlay, closeOverlay]);

  useEffect(() => {
    return () => {
      if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
    };
  }, []);

  const closePalette = useCallback(() => {
    closeOverlay('palette');
  }, [closeOverlay]);

  const scrollToSectionWithOffset = useCallback((targetSelector) => {
    const target = document.querySelector(targetSelector);
    if (!target) return;
    const navHeight = 75;
    const top = target.getBoundingClientRect().top + window.scrollY - navHeight;
    window.scrollTo({
      top: Math.max(0, top),
      behavior: 'smooth',
    });
  }, []);

  const handleNavigate = useCallback((targetHref) => {
    closePalette();

    if (targetHref === '#' || targetHref === '/') {
      if (pathname === '/') {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else {
        transitionRouter.push('/');
      }
      return;
    }

    if (targetHref.startsWith('/#')) {
      const anchor = targetHref.replace('/', '');
      if (pathname === '/') {
        setTimeout(() => {
          scrollToSectionWithOffset(anchor);
        }, 60);
      } else {
        if (typeof sessionStorage !== 'undefined') {
          sessionStorage.setItem('portfolio_scroll_target', anchor);
        }
        transitionRouter.push(targetHref);
      }
      return;
    }

    if (targetHref.startsWith('#')) {
      if (pathname === '/') {
        setTimeout(() => {
          scrollToSectionWithOffset(targetHref);
        }, 60);
      } else {
        if (typeof sessionStorage !== 'undefined') {
          sessionStorage.setItem('portfolio_scroll_target', targetHref);
        }
        transitionRouter.push('/' + targetHref);
      }
      return;
    }

    if (targetHref.startsWith('/')) {
      transitionRouter.push(targetHref);
    }
  }, [closePalette, pathname, transitionRouter, scrollToSectionWithOffset]);

  const handleOpenChatbot = useCallback(() => {
    closePalette();
    setTimeout(() => {
      openOverlay('chatbot');
    }, 80);
  }, [closePalette, openOverlay]);

  const handleCopyEmail = useCallback(() => {
    const email = process.env.NEXT_PUBLIC_CONTACT_EMAIL;
    if (email && email.trim()) {
      navigator.clipboard?.writeText(email).then(() => {
        showToast(`Email copied: ${email}`);
      }).catch(() => {
        handleNavigate('/contact');
      });
    } else {
      handleNavigate('/contact');
    }
  }, [handleNavigate, showToast]);



  if (!isOpen) return null;

  // Filter items by type from single source of truth
  const anchorItems = NAVIGATION_ITEMS.filter((item) => item.type === 'anchor');
  const pageItems = NAVIGATION_ITEMS.filter((item) => item.type === 'page');

  return (
    <div
      className={styles.backdrop}
      onClick={closePalette}
      onWheel={(e) => {
        e.stopPropagation();
        if (listRef.current) {
          listRef.current.scrollTop += e.deltaY;
        }
      }}
      role="presentation"
      data-lenis-prevent="true"
    >
      <div
        ref={dialogRef}
        className={styles.dialog}
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-label="Command Palette"
        data-lenis-prevent="true"
      >
        <Command label="Global Command Palette" data-lenis-prevent="true">
          <div className={styles.inputWrapper}>
            <span className={styles.searchIcon} aria-hidden="true">
              <SearchIcon />
            </span>
            <Command.Input
              className={styles.input}
              placeholder="Search sections, pages, or actions... (Esc to exit)"
              autoFocus
            />
            <span className={styles.escBadge}>ESC</span>
          </div>

          <Command.List
            ref={listRef}
            className={styles.list}
            data-lenis-prevent="true"
          >
            <Command.Empty className={styles.empty}>
              No matching commands or pages found.
            </Command.Empty>

            {/* Quick Actions */}
            <Command.Group heading="Quick Actions" className={styles.group}>
              <Command.Item
                onSelect={handleOpenChatbot}
                className={styles.item}
              >
                <div className={styles.itemContent}>
                  <span className={styles.itemIcon}><BotIcon /></span>
                  <span className={styles.itemLabel}>Open AI Assistant (genious.exe)</span>
                </div>
                <span className={styles.itemTag}>Action</span>
              </Command.Item>

              <Command.Item
                onSelect={() => handleNavigate('/contact')}
                className={styles.item}
              >
                <div className={styles.itemContent}>
                  <span className={styles.itemIcon}><MailIcon /></span>
                  <span className={styles.itemLabel}>Open Contact Form</span>
                </div>
                <span className={styles.itemTag}>Page</span>
              </Command.Item>

              <Command.Item
                onSelect={handleCopyEmail}
                className={styles.item}
              >
                <div className={styles.itemContent}>
                  <span className={styles.itemIcon}><CopyIcon /></span>
                  <span className={styles.itemLabel}>
                    {process.env.NEXT_PUBLIC_CONTACT_EMAIL ? 'Copy Email Address' : 'Contact via Direct Form'}
                  </span>
                </div>
                <span className={styles.itemTag}>Action</span>
              </Command.Item>


            </Command.Group>

            {/* Navigation — Homepage Sections (from navigation.js) */}
            <Command.Group heading="Homepage Sections" className={styles.group}>
              {anchorItems.map((item) => (
                <Command.Item
                  key={item.id}
                  value={`${item.label} ${item.keywords.join(' ')} ${item.description}`}
                  onSelect={() => handleNavigate(item.href)}
                  className={styles.item}
                >
                  <div className={styles.itemContent}>
                    <span className={styles.itemIcon}><SectionIcon /></span>
                    <span className={styles.itemLabel}>{item.label} — {item.description}</span>
                  </div>
                  <span className={styles.itemTag}>{item.href.replace('/', '')}</span>
                </Command.Item>
              ))}
            </Command.Group>

            {/* Navigation — Pages (from navigation.js) */}
            <Command.Group heading="Pages & Modules" className={styles.group}>
              {pageItems.map((item) => (
                <Command.Item
                  key={item.id}
                  value={`${item.label} ${item.keywords.join(' ')} ${item.description}`}
                  onSelect={() => handleNavigate(item.href)}
                  className={styles.item}
                >
                  <div className={styles.itemContent}>
                    <span className={styles.itemIcon}><PageIcon /></span>
                    <span className={styles.itemLabel}>{item.label} — {item.description}</span>
                  </div>
                  <span className={styles.itemTag}>
                    {item.status === 'stub' ? 'STUB' : item.href}
                  </span>
                </Command.Item>
              ))}

              {/* Legal Pages */}
              {FOOTER_LEGAL_ITEMS.map((item) => (
                <Command.Item
                  key={item.id}
                  value={`${item.label} legal privacy terms`}
                  onSelect={() => handleNavigate(item.href)}
                  className={styles.item}
                >
                  <div className={styles.itemContent}>
                    <span className={styles.itemIcon}><PageIcon /></span>
                    <span className={styles.itemLabel}>{item.label} — {item.description}</span>
                  </div>
                  <span className={styles.itemTag}>{item.href}</span>
                </Command.Item>
              ))}
            </Command.Group>
          </Command.List>

          <div className={styles.footer}>
            <div className={styles.shortcuts}>
              <span className={styles.shortcut}><kbd>↑</kbd><kbd>↓</kbd> Navigate</span>
              <span className={styles.shortcut}><kbd>↵</kbd> Select</span>
              <span className={styles.shortcut}><kbd>Esc</kbd> Close</span>
            </div>
            <span>genioussonu.me</span>
          </div>

          {toastMessage && (
            <div className={styles.toast} role="status">
              {toastMessage}
            </div>
          )}
        </Command>
      </div>
    </div>
  );
}
