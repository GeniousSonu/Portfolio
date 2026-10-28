'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useTransitionRouter } from '@/context/TransitionContext';
import { isConsentFullAccepted } from '@/lib/consent';
import SiteStatusStrip from '@/components/SiteStatusStrip';
import { FooterLogo, SOCIAL_LINKS } from '@/components/Footer';
import { NAV_GROUPS, getNavItemsByGroup, FOOTER_LEGAL_ITEMS } from '@/config/navigation';

const SYSTEM_ROWS = [
  { key: 'role', val: 'Senior Web Application Developer' },
  { key: 'stack', val: 'Next.js · Node · Linux' },
  { key: 'patent', val: 'IN 544062 · Granted' },
  { key: 'location', val: 'Kolkata, IN' },
  { key: 'timezone', val: 'Asia/Kolkata' },
];

export default function FooterV3() {
  const pathname = usePathname();
  const transitionRouter = useTransitionRouter();
  const year = new Date().getFullYear();
  const [showCookieControl, setShowCookieControl] = useState(false);

  useEffect(() => {
    const updateCookieVisibility = () => setShowCookieControl(!isConsentFullAccepted());
    updateCookieVisibility();

    const handleConsentChoice = (event) => {
      if (event?.detail?.fullAccepted !== undefined) {
        setShowCookieControl(!event.detail.fullAccepted);
      } else {
        updateCookieVisibility();
      }
    };

    window.addEventListener('cookie-consent-choice-changed', handleConsentChoice);
    window.addEventListener('analytics-consent-changed', updateCookieVisibility);

    return () => {
      window.removeEventListener('cookie-consent-choice-changed', handleConsentChoice);
      window.removeEventListener('analytics-consent-changed', updateCookieVisibility);
    };
  }, []);

  const handleNavClick = (event, href) => {
    event.preventDefault();

    if (href === '#' || href === '/') {
      if (pathname === '/') {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else {
        transitionRouter.push('/');
      }
      return;
    }

    if (href.startsWith('/#')) {
      const anchor = href.replace('/', '');
      if (pathname === '/') {
        document.querySelector(anchor)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      } else {
        if (typeof sessionStorage !== 'undefined') {
          sessionStorage.setItem('portfolio_scroll_target', anchor);
        }
        transitionRouter.push(href);
      }
      return;
    }

    if (href.startsWith('/')) {
      transitionRouter.push(href);
    }
  };

  return (
    <footer id="footer" className="v3-footer">
      <div className="v3-shell">
        <div className="v3-footer-top">
          <div className="v3-footer-brand">
            <Link
              href="/"
              onClick={(event) => handleNavClick(event, '/')}
              aria-label="SK Sahinur Islam — Back to top"
              className="v3-footer-logo"
            >
              <FooterLogo color="var(--v3-ink)" />
            </Link>

            <p className="v3-footer-tagline">
              Engineering at the intersection of
              <br />
              <span>web, infrastructure &amp; security.</span>
            </p>

            <div className="v3-footer-status">
              <span className="v3-status-dot" aria-hidden="true" />
              <span>OPEN TO GLOBAL ROLES · IST (UTC+5:30)</span>
            </div>

            <div className="v3-footer-socials">
              {SOCIAL_LINKS.map(({ id, label, href, icon: Icon }) => (
                <a
                  key={id}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="v3-footer-social"
                  data-v3-sound="confirm"
                >
                  <Icon />
                  <span>{label}</span>
                </a>
              ))}
            </div>
          </div>

          <nav className="v3-footer-nav" aria-label="Footer sitemap">
            {NAV_GROUPS.map((group) => {
              const items = getNavItemsByGroup(group.id);
              return (
                <div className="v3-footer-group" key={group.id}>
                  <h2 className="v3-footer-group-title">{group.label}</h2>
                  <ul>
                    {items.map((item) => (
                      <li key={item.id}>
                        <a
                          href={item.href}
                          onClick={(event) => handleNavClick(event, item.href)}
                          className="v3-footer-link"
                          data-v3-sound="confirm"
                        >
                          {item.label}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </nav>

          <div className="v3-footer-system">
            <h2 className="v3-footer-group-title">System Status</h2>
            <div className="v3-term v3-term--footer">
              <div className="v3-term-head">
                <span className="v3-term-dots" aria-hidden="true">
                  <span />
                  <span />
                  <span />
                </span>
                <span className="v3-term-title">sahinur@dev:~</span>
              </div>
              <div className="v3-term-body">
                {SYSTEM_ROWS.map(({ key, val }) => (
                  <div className="v3-sys-row" key={key}>
                    <span>{key}</span>
                    <span>{val}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="v3-footer-status-strip">
          <SiteStatusStrip />
        </div>

        <div className="v3-footer-wordmark" aria-label="SAHINUR ISLAM">
          SAHINUR ISLAM
        </div>

        <div className="v3-footer-bottom" data-build-id={process.env.NEXT_PUBLIC_BUILD_ID || 'prod'}>
          <div className="v3-footer-legal-notice">
            &copy; {year} SK Sahinur Islam. All rights reserved.
          </div>

          <div className="v3-footer-legal">
            <Link
              href="/?intro=1"
              onClick={() => {
                try {
                  localStorage.removeItem('sks_boot_seen_v1');
                } catch {}
              }}
              className="v3-footer-link"
              data-v3-sound="confirm"
              title="Replay console boot sequence"
            >
              Replay Intro
            </Link>
            {FOOTER_LEGAL_ITEMS.map((item) => (
              <Link
                key={item.id}
                href={item.href}
                className="v3-footer-link"
                data-v3-sound="confirm"
              >
                {item.label}
              </Link>
            ))}
            {showCookieControl ? (
              <button
                type="button"
                onClick={() => {
                  window.dispatchEvent(new CustomEvent('open-cookie-preferences'));
                }}
                className="v3-footer-link v3-footer-cookie"
                data-v3-sound="confirm"
              >
                Cookie Settings
              </button>
            ) : null}
          </div>
        </div>
      </div>
    </footer>
  );
}
