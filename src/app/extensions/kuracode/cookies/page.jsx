'use client';

import React from 'react';
import Link from 'next/link';
import styles from '../kuracode.module.css';

export default function CookiesPage() {
  const handleOpenConsentPreferences = () => {
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('open-cookie-preferences'));
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-8">
      {/* Breadcrumbs */}
      <nav className={styles.breadcrumbs} aria-label="Breadcrumb">
        <Link href="/extensions/kuracode" className={styles.breadcrumbLink}>KuraCode</Link>
        <span className={styles.breadcrumbSeparator}>/</span>
        <span className={styles.breadcrumbCurrent}>Cookies Policy</span>
      </nav>

      <article className="p-8 md:p-10 rounded-2xl border border-border bg-surface-1">
        <header className="mb-8 border-b border-border pb-6">
          <h1 className="text-3xl font-extrabold text-text-primary mb-3">
            KuraCode Cookie &amp; Tracking Disclosure
          </h1>
          <p className="text-base text-text-muted">
            Detailed disclosure of extension storage vs. website documentation consent protocols.
          </p>
        </header>

        <section className="space-y-6 text-sm text-text-secondary leading-relaxed">
          <h2 className="text-xl font-bold text-text-primary">1. Extension In-Browser Cookies</h2>
          <div className="p-4 rounded-xl border border-emerald-800/40 bg-emerald-950/20 text-emerald-400 font-mono text-xs">
            ✓ ZERO COOKIES: The KuraCode browser extension sets 0 cookies and accesses 0 cookie stores.
          </div>
          <p>
            The extension does not use HTTP cookies, flash cookies, or tracking beacons. All user preferences (theme, hotkey choices, local tags) are stored strictly within the sandboxed <code className="font-mono text-emerald-400">chrome.storage.local</code> or <code className="font-mono text-emerald-400">browser.storage.local</code> APIs.
          </p>

          <h2 className="text-xl font-bold text-text-primary">2. Website Documentation Consent Architecture</h2>
          <p>
            When viewing this documentation portal on <strong>genioussonu.me</strong>, analytics are governed by strict consent gating adhering to GDPR, ePrivacy, and Google Consent Mode v2:
          </p>
          <ul className="list-disc pl-5 space-y-1 text-text-primary">
            <li><strong>Default State:</strong> All analytics storage and advertising tags are set to &apos;denied&apos; on document load.</li>
            <li><strong>Consent Banner:</strong> Tracking tags only initialize after you click &apos;Accept&apos; on the consent banner.</li>
            <li><strong>Quiet Extension Routes:</strong> Routes such as <code className="font-mono text-gold text-xs">/demo</code>, <code className="font-mono text-gold text-xs">/review</code>, <code className="font-mono text-gold text-xs">/welcome</code>, and <code className="font-mono text-gold text-xs">/update</code> completely dismount analytics and tracking regardless of consent state.</li>
          </ul>

          <div className="mt-8 pt-6 border-t border-border flex items-center justify-between flex-wrap gap-4">
            <div>
              <h3 className="font-bold text-text-primary text-base">Adjust Website Consent Settings</h3>
              <p className="text-xs text-text-muted">Open the interactive preference manager to review or revoke permissions.</p>
            </div>
            <button
              type="button"
              onClick={handleOpenConsentPreferences}
              className={styles.secondaryBtn}
            >
              <span>Manage Cookie Preferences</span>
            </button>
          </div>
        </section>
      </article>
    </div>
  );
}
