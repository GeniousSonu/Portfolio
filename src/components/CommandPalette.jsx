'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { Command } from 'cmdk';
import { useOverlay } from '@/context/OverlayContext';
import { useTransitionRouter } from '@/context/TransitionContext';
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

const GitHubIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"/>
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
      // Prevent wheel event from bubbling to window / Lenis virtual scroll
      e.stopPropagation();

      const listEl = listRef.current;
      if (!listEl) return;

      // If wheel occurs on the search bar or modal frame outside the scrollable list,
      // forward the scroll amount to the results list
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
      // Don't trigger if user is inside a regular input/textarea unless it's the shortcut
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

  // Clean up timer on unmount
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

  const handleNavigate = useCallback((target) => {
    closePalette();

    if (target.startsWith('#')) {
      if (pathname === '/') {
        setTimeout(() => {
          scrollToSectionWithOffset(target);
        }, 60);
      } else {
        if (typeof sessionStorage !== 'undefined') {
          sessionStorage.setItem('portfolio_scroll_target', target);
        }
        transitionRouter.push('/' + target);
      }
      return;
    }

    if (target.startsWith('/')) {
      transitionRouter.push(target);
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
        handleNavigate('#contact');
      });
    } else {
      // If contact email is not explicitly configured via env, navigate to contact form
      handleNavigate('#contact');
    }
  }, [handleNavigate, showToast]);

  const handleViewSource = useCallback(() => {
    closePalette();
    window.open('https://github.com/GeniousSonu/Portfolio', '_blank', 'noopener,noreferrer');
  }, [closePalette]);

  if (!isOpen) return null;

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
                onSelect={() => handleNavigate('#contact')}
                className={styles.item}
              >
                <div className={styles.itemContent}>
                  <span className={styles.itemIcon}><MailIcon /></span>
                  <span className={styles.itemLabel}>Open Contact Form</span>
                </div>
                <span className={styles.itemTag}>Section</span>
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

              <Command.Item
                onSelect={handleViewSource}
                className={styles.item}
              >
                <div className={styles.itemContent}>
                  <span className={styles.itemIcon}><GitHubIcon /></span>
                  <span className={styles.itemLabel}>View Source on GitHub</span>
                </div>
                <span className={styles.itemTag}>External</span>
              </Command.Item>
            </Command.Group>

            {/* Navigation — Sections */}
            <Command.Group heading="Homepage Sections" className={styles.group}>
              <Command.Item onSelect={() => handleNavigate('#about')} className={styles.item}>
                <div className={styles.itemContent}>
                  <span className={styles.itemIcon}><SectionIcon /></span>
                  <span className={styles.itemLabel}>About & Background</span>
                </div>
                <span className={styles.itemTag}>#about</span>
              </Command.Item>

              <Command.Item onSelect={() => handleNavigate('#experience')} className={styles.item}>
                <div className={styles.itemContent}>
                  <span className={styles.itemIcon}><SectionIcon /></span>
                  <span className={styles.itemLabel}>Experience & Career</span>
                </div>
                <span className={styles.itemTag}>#experience</span>
              </Command.Item>

              <Command.Item onSelect={() => handleNavigate('#projects')} className={styles.item}>
                <div className={styles.itemContent}>
                  <span className={styles.itemIcon}><SectionIcon /></span>
                  <span className={styles.itemLabel}>Engineering Projects</span>
                </div>
                <span className={styles.itemTag}>#projects</span>
              </Command.Item>

              <Command.Item onSelect={() => handleNavigate('#skills')} className={styles.item}>
                <div className={styles.itemContent}>
                  <span className={styles.itemIcon}><SectionIcon /></span>
                  <span className={styles.itemLabel}>Technical Skills</span>
                </div>
                <span className={styles.itemTag}>#skills</span>
              </Command.Item>

              <Command.Item onSelect={() => handleNavigate('#certs')} className={styles.item}>
                <div className={styles.itemContent}>
                  <span className={styles.itemIcon}><SectionIcon /></span>
                  <span className={styles.itemLabel}>Certifications & IoT Patent</span>
                </div>
                <span className={styles.itemTag}>#certs</span>
              </Command.Item>

              <Command.Item onSelect={() => handleNavigate('#contact')} className={styles.item}>
                <div className={styles.itemContent}>
                  <span className={styles.itemIcon}><SectionIcon /></span>
                  <span className={styles.itemLabel}>Direct Contact</span>
                </div>
                <span className={styles.itemTag}>#contact</span>
              </Command.Item>
            </Command.Group>

            {/* Navigation — Pages */}
            <Command.Group heading="Pages" className={styles.group}>
              <Command.Item onSelect={() => handleNavigate('/blog')} className={styles.item}>
                <div className={styles.itemContent}>
                  <span className={styles.itemIcon}><PageIcon /></span>
                  <span className={styles.itemLabel}>Engineering Blog</span>
                </div>
                <span className={styles.itemTag}>/blog</span>
              </Command.Item>

              <Command.Item onSelect={() => handleNavigate('/store')} className={styles.item}>
                <div className={styles.itemContent}>
                  <span className={styles.itemIcon}><PageIcon /></span>
                  <span className={styles.itemLabel}>Curated Store</span>
                </div>
                <span className={styles.itemTag}>/store</span>
              </Command.Item>

              <Command.Item onSelect={() => handleNavigate('/space')} className={styles.item}>
                <div className={styles.itemContent}>
                  <span className={styles.itemIcon}><PageIcon /></span>
                  <span className={styles.itemLabel}>Shared Real-Time Space</span>
                </div>
                <span className={styles.itemTag}>/space</span>
              </Command.Item>

              <Command.Item onSelect={() => handleNavigate('/lounge')} className={styles.item}>
                <div className={styles.itemContent}>
                  <span className={styles.itemIcon}><PageIcon /></span>
                  <span className={styles.itemLabel}>The Lounge (Watch &amp; Hangout)</span>
                </div>
                <span className={styles.itemTag}>/lounge</span>
              </Command.Item>

              <Command.Item onSelect={() => handleNavigate('/changelog')} className={styles.item}>
                <div className={styles.itemContent}>
                  <span className={styles.itemIcon}><PageIcon /></span>
                  <span className={styles.itemLabel}>Public Changelog</span>
                </div>
                <span className={styles.itemTag}>/changelog</span>
              </Command.Item>

              <Command.Item onSelect={() => handleNavigate('/architecture')} className={styles.item}>
                <div className={styles.itemContent}>
                  <span className={styles.itemIcon}><PageIcon /></span>
                  <span className={styles.itemLabel}>System Architecture</span>
                </div>
                <span className={styles.itemTag}>/architecture</span>
              </Command.Item>

              <Command.Item onSelect={() => handleNavigate('/uses')} className={styles.item}>
                <div className={styles.itemContent}>
                  <span className={styles.itemIcon}><PageIcon /></span>
                  <span className={styles.itemLabel}>Uses & Toolchain</span>
                </div>
                <span className={styles.itemTag}>/uses</span>
              </Command.Item>

              <Command.Item onSelect={() => handleNavigate('/status')} className={styles.item}>
                <div className={styles.itemContent}>
                  <span className={styles.itemIcon}><PageIcon /></span>
                  <span className={styles.itemLabel}>System Health Status</span>
                </div>
                <span className={styles.itemTag}>/status</span>
              </Command.Item>
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
