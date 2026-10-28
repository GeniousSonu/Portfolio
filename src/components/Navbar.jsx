"use client";
import React, { useState, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import gsap from 'gsap';
import { ScrollToPlugin } from 'gsap/ScrollToPlugin';
import InstallAppButton from './InstallAppButton';
import { useOverlay } from '@/context/OverlayContext';
import { useTransitionRouter } from '@/context/TransitionContext';
import { usePlayground } from '@/context/PlaygroundContext';
import navState from '@/lib/navState';
import { NAV_GROUPS, NAVIGATION_ITEMS, getNavItemsByGroup } from '@/config/navigation';
import { useTheme } from '@/components/v3/ThemeProvider';
import MenuOverlay from './menu/MenuOverlay';
import styles from './Navbar.module.css';

export default function Navbar() {
  const router = useRouter();
  const transitionRouter = useTransitionRouter();
  const pathname = usePathname();
  const { activeOverlay, openOverlay, closeOverlay } = useOverlay();
  const { isPlaygroundActive, togglePlayground, isDesktop } = usePlayground();
  const { theme, toggleTheme } = useTheme();
  const mobileOpen = activeOverlay === 'nav';
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [openGroup, setOpenGroup] = useState(null); // active dropdown group ID: 'work' | 'knowledge' | 'lab' | 'about'
  const [shouldCueTheme, setShouldCueTheme] = useState(false);

  useEffect(() => {
    try {
      if (!localStorage.getItem('sks_theme_cue_seen')) {
        setShouldCueTheme(true);
      }
    } catch {}
  }, []);

  const handleThemeToggle = (e) => {
    try {
      localStorage.setItem('sks_theme_cue_seen', '1');
      setShouldCueTheme(false);
    } catch {}
    toggleTheme(e);
  };
  const navRef = useRef(null);
  const dropdownTimerRef = useRef(null);
  const hamburgerBtnRef = useRef(null);
  const triggerRefs = useRef({});

  // Primary navigation groups for triggers
  const triggerGroups = NAV_GROUPS.filter((g) => g.id !== 'contact');

  // Close panels on route transition
  useEffect(() => {
    setOpenGroup(null);
  }, [pathname]);

  const closeDropdown = useCallback(() => {
    if (dropdownTimerRef.current) clearTimeout(dropdownTimerRef.current);
    setOpenGroup(null);
  }, []);

  const openDropdown = useCallback((groupId) => {
    if (dropdownTimerRef.current) clearTimeout(dropdownTimerRef.current);
    setOpenGroup(groupId);
  }, []);

  const handleGroupToggle = (e, groupId) => {
    e.preventDefault();
    e.stopPropagation();
    if (dropdownTimerRef.current) clearTimeout(dropdownTimerRef.current);
    setOpenGroup((prev) => (prev === groupId ? null : groupId));
  };

  const handleGroupMouseEnter = (groupId) => {
    if (typeof window !== 'undefined' && window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
      openDropdown(groupId);
    }
  };

  const handleGroupMouseLeave = () => {
    if (typeof window !== 'undefined' && window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
      dropdownTimerRef.current = setTimeout(() => {
        setOpenGroup(null);
      }, 200);
    }
  };

  // Close when clicking outside
  useEffect(() => {
    const handlePointerDown = (e) => {
      if (navRef.current && !navRef.current.contains(e.target)) {
        setOpenGroup(null);
      }
    };
    document.addEventListener('pointerdown', handlePointerDown);
    return () => {
      document.removeEventListener('pointerdown', handlePointerDown);
      if (dropdownTimerRef.current) clearTimeout(dropdownTimerRef.current);
    };
  }, []);

  // Keyboard accessibility for group triggers and panel items
  const handleTriggerKeyDown = (e, groupId) => {
    if (e.key === 'ArrowDown' || e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      setOpenGroup(groupId);
      setTimeout(() => {
        const panel = document.getElementById(`nav-panel-${groupId}`);
        const firstLink = panel?.querySelector('a');
        firstLink?.focus();
      }, 40);
    } else if (e.key === 'Escape') {
      e.preventDefault();
      setOpenGroup(null);
    }
  };

  const handlePanelKeyDown = (e, groupId) => {
    if (e.key === 'Escape') {
      e.preventDefault();
      setOpenGroup(null);
      triggerRefs.current[groupId]?.focus();
      return;
    }

    if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
      e.preventDefault();
      const panel = document.getElementById(`nav-panel-${groupId}`);
      const items = Array.from(panel?.querySelectorAll('a') || []);
      const currentIndex = items.indexOf(document.activeElement);
      if (e.key === 'ArrowDown') {
        const nextIndex = (currentIndex + 1) % items.length;
        items[nextIndex]?.focus();
      } else {
        const prevIndex = (currentIndex - 1 + items.length) % items.length;
        items[prevIndex]?.focus();
      }
    }
  };

  // Sync body class for mobile nav active styles
  useEffect(() => {
    if (typeof window !== 'undefined') {
      if (mobileOpen) {
        document.body.classList.add('mobile-nav-active');
      } else {
        document.body.classList.remove('mobile-nav-active');
      }
    }
    return () => {
      if (typeof window !== 'undefined') {
        document.body.classList.remove('mobile-nav-active');
      }
    };
  }, [mobileOpen]);

  useEffect(() => {
    gsap.registerPlugin(ScrollToPlugin);
    let lastY = window.scrollY;

    const handleScroll = () => {
      const currentY = window.scrollY;
      setScrolled(currentY > 40);

      if (currentY > 120 && currentY > lastY + 6) {
        setHidden(true);
      } else if (currentY < lastY - 6 || currentY <= 40) {
        setHidden(false);
      }

      lastY = currentY;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const closeMobileNav = useCallback(() => {
    closeOverlay('nav');
    hamburgerBtnRef.current?.focus();
  }, [closeOverlay]);

  // Prefetch routes when mobile menu opens
  useEffect(() => {
    if (!mobileOpen) return;
    const timer = setTimeout(() => {
      const routeItems = NAVIGATION_ITEMS.filter((item) => item.type === 'page').map((item) => item.href);
      routeItems.forEach((href) => {
        try { router.prefetch(href); } catch {}
      });
    }, 150);
    return () => clearTimeout(timer);
  }, [mobileOpen, router]);

  const scrollToSectionWithOffset = (targetSelector) => {
    const target = document.querySelector(targetSelector);
    if (!target) return;
    const navHeight = 75;
    const top = target.getBoundingClientRect().top + window.scrollY - navHeight;
    window.scrollTo({
      top: Math.max(0, top),
      behavior: 'smooth',
    });
  };

  const handleLinkClick = (e, targetHref) => {
    e?.preventDefault?.();
    setOpenGroup(null);

    if (!targetHref) {
      closeOverlay('nav');
      return;
    }

    if (targetHref.startsWith('http://') || targetHref.startsWith('https://')) {
      closeOverlay('nav');
      window.open(targetHref, '_blank', 'noopener,noreferrer');
      return;
    }

    try {
      if (targetHref === '#' || targetHref === '/') {
        if (pathname === '/') {
          closeOverlay('nav');
          try {
            navState?.startAnchorNav?.();
          } catch {}
          setTimeout(() => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }, 50);
        } else {
          transitionRouter.push('/');
          setTimeout(() => {
            closeOverlay('nav');
          }, 60);
        }
        return;
      }

      if (targetHref.startsWith('/#')) {
        const anchor = targetHref.replace('/', '');
        if (pathname === '/') {
          closeOverlay('nav');
          try {
            navState?.startAnchorNav?.();
          } catch {}
          setTimeout(() => {
            scrollToSectionWithOffset(anchor);
          }, 60);
        } else {
          if (typeof sessionStorage !== 'undefined') {
            sessionStorage.setItem('portfolio_scroll_target', anchor);
          }
          transitionRouter.push(targetHref);
          setTimeout(() => {
            closeOverlay('nav');
          }, 60);
        }
        return;
      }

      if (targetHref.startsWith('#')) {
        if (pathname === '/') {
          closeOverlay('nav');
          try {
            navState?.startAnchorNav?.();
          } catch {}
          setTimeout(() => {
            scrollToSectionWithOffset(targetHref);
          }, 60);
        } else {
          if (typeof sessionStorage !== 'undefined') {
            sessionStorage.setItem('portfolio_scroll_target', targetHref);
          }
          transitionRouter.push('/' + targetHref);
          setTimeout(() => {
            closeOverlay('nav');
          }, 60);
        }
        return;
      }

      if (targetHref.startsWith('/')) {
        try {
          navState?.startRouteNav?.();
        } catch {}
        transitionRouter.push(targetHref);
        setTimeout(() => {
          closeOverlay('nav');
        }, 60);
      }
    } catch (err) {
      console.warn('Navbar handleLinkClick error, executing fallback navigation:', err);
      closeOverlay('nav');
      if (typeof window !== 'undefined') {
        window.location.assign(targetHref);
      }
    }
  };

  // Scroll to section when arriving on homepage
  useEffect(() => {
    if (pathname === '/') {
      const storedTarget = typeof sessionStorage !== 'undefined' ? sessionStorage.getItem('portfolio_scroll_target') : null;
      const hashTarget = window.location.hash;
      const target = storedTarget || hashTarget;
      if (target && target.startsWith('#')) {
        if (typeof sessionStorage !== 'undefined') {
          sessionStorage.removeItem('portfolio_scroll_target');
        }
        const timer = setTimeout(() => {
          scrollToSectionWithOffset(target);
        }, 350);
        return () => clearTimeout(timer);
      }
    }
  }, [pathname]);

  return (
    <>
      <nav
        id="nav"
        ref={navRef}
        className={`${scrolled ? 'scrolled' : ''} ${hidden ? 'nav-hidden' : ''}`}
        role="navigation"
        aria-label="Main navigation"
      >
        <div className="nav-inner">
          {/* Logo */}
          <Link
            href="/"
            onClick={(e) => handleLinkClick(e, '/')}
            className="nav-logo"
            aria-label="SK Sahinur Islam — Home"
          >
            <Image src="/logo.svg" alt="SONU" width={90} height={26} priority className="nav-logo-img" />
          </Link>

          {/* Desktop Links (5 Groups + All Pages + Contact CTA) */}
          <ul className="nav-links" role="list">
            {triggerGroups.map((group) => {
              const groupItems = getNavItemsByGroup(group.id);
              const isGroupActive = groupItems.some((item) => {
                if (item.type === 'page') return pathname === item.href || pathname.startsWith(item.href + '/');
                return false;
              });
              const isOpen = openGroup === group.id;

              return (
                <li
                  key={group.id}
                  className="nav-dropdown-wrapper"
                  onMouseEnter={() => handleGroupMouseEnter(group.id)}
                  onMouseLeave={handleGroupMouseLeave}
                >
                  <button
                    ref={(el) => (triggerRefs.current[group.id] = el)}
                    type="button"
                    className={`nav-dropdown-trigger ${isGroupActive ? 'active' : ''}`}
                    aria-expanded={isOpen}
                    aria-controls={`nav-panel-${group.id}`}
                    aria-haspopup="true"
                    aria-label={`${group.label} menu`}
                    onClick={(e) => handleGroupToggle(e, group.id)}
                    onKeyDown={(e) => handleTriggerKeyDown(e, group.id)}
                  >
                    <span>{group.label}</span>
                    <svg
                      className="nav-dropdown-caret"
                      width="12"
                      height="12"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      aria-hidden="true"
                    >
                      <polyline points="6 9 12 15 18 9" />
                    </svg>
                  </button>

                  {isOpen && (
                    <div
                      id={`nav-panel-${group.id}`}
                      className={styles.dropdownMenu}
                      aria-label={`${group.label} pages`}
                      onMouseEnter={() => handleGroupMouseEnter(group.id)}
                      onMouseLeave={handleGroupMouseLeave}
                      onKeyDown={(e) => handlePanelKeyDown(e, group.id)}
                    >
                      <div className={styles.panelHeader}>{group.description}</div>
                      {groupItems.map((item) => (
                        <a
                          key={item.id}
                          href={item.href}
                          className={styles.dropdownItem}
                          onClick={(e) => handleLinkClick(e, item.href)}
                        >
                          <div className={styles.itemTop}>
                            <span className={styles.itemLabel}>{item.label}</span>
                            {item.status === 'stub' ? (
                              <span className={`${styles.itemTag} ${styles.itemTagStub}`}>STUB</span>
                            ) : item.type === 'anchor' ? (
                              <span className={styles.itemTag}>#section</span>
                            ) : null}
                          </div>
                          <span className={styles.itemDesc}>{item.description}</span>
                        </a>
                      ))}
                    </div>
                  )}
                </li>
              );
            })}

            {/* "All pages" modal trigger */}
            <li>
              <button
                type="button"
                className={styles.allPagesBtn}
                onClick={() => openOverlay('site_menu')}
                aria-label="Open all pages directory"
                title="View complete site directory"
              >
                <span>Index</span>
                <span className={styles.itemTag}>All</span>
              </button>
            </li>

            {/* Contact CTA */}
            <li>
              <a
                href="/contact"
                onClick={(e) => handleLinkClick(e, '/contact')}
                className="nav-cta"
              >
                Contact →
              </a>
            </li>
          </ul>

          {/* Playground Toggle */}
          {isDesktop && (
            <button
              className={`nav-cmdk-btn ${isPlaygroundActive ? 'ring-2 ring-emerald-500 text-emerald-400' : ''}`}
              onClick={togglePlayground}
              aria-label="Toggle Playground Mode"
              title="Playground Mode (Editable & Draggable)"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
              </svg>
            </button>
          )}

          {/* Command Palette Trigger */}
          <button
            className="nav-cmdk-btn"
            onClick={() => {
              openOverlay('palette');
            }}
            aria-label="Open Command Palette (Cmd+K)"
            title="Search & Commands (⌘K)"
          >
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
            <span className="nav-cmdk-badge">⌘K</span>
          </button>

          {/* Day/Night Theme Toggle */}
          <button
            type="button"
            className={`nav-theme-toggle-btn${shouldCueTheme ? ' theme-cue-bounce' : ''}`}
            onClick={handleThemeToggle}
            aria-label={`Switch to ${theme === 'dark' ? 'Day' : 'Night'} Mode`}
            title={`Switch to ${theme === 'dark' ? 'Day' : 'Night'} Mode`}
          >
            {theme === 'dark' ? (
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <circle cx="12" cy="12" r="5" />
                <line x1="12" y1="1" x2="12" y2="3" />
                <line x1="12" y1="21" x2="12" y2="23" />
                <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
                <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
                <line x1="1" y1="12" x2="3" y2="12" />
                <line x1="21" y1="12" x2="23" y2="12" />
                <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
                <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
              </svg>
            ) : (
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
              </svg>
            )}
          </button>

          {/* Install App Button */}
          <InstallAppButton />

          {/* Hamburger — animated 3-bar → X */}
          <button
            ref={hamburgerBtnRef}
            className={`nav-hamburger${mobileOpen ? ' is-open' : ''}`}
            id="hamburger-btn"
            aria-label={mobileOpen ? 'Close navigation menu' : 'Open navigation menu'}
            aria-expanded={mobileOpen}
            aria-controls="mobile-nav"
            onClick={() => {
              if (mobileOpen) {
                closeMobileNav();
              } else {
                openOverlay('nav');
              }
            }}
          >
            <span className="ham-bar ham-bar--top" />
            <span className="ham-bar ham-bar--mid" />
            <span className="ham-bar ham-bar--bot" />
          </button>
        </div>
      </nav>

      {/* ── Craft Navigation Menu Overlay ── */}
      <MenuOverlay
        isOpen={mobileOpen}
        onClose={closeMobileNav}
        onOpenPalette={() => openOverlay('palette')}
        onNavigate={handleLinkClick}
        triggerRef={hamburgerBtnRef}
      />
    </>
  );
}
