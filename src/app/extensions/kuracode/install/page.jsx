import React from 'react';
import Link from 'next/link';
import styles from '../kuracode.module.css';
import { KURACODE_FACTS } from '@/data/kuracode/facts';
import PlaceholderChip from '@/components/kuracode/PlaceholderChip';

export const metadata = {
  title: 'Install KuraCode — Browser Extension Setup',
  description: 'Download and install the KuraCode code snippet manager for Chrome, Edge, Brave, and Firefox.',
  alternates: {
    canonical: 'https://genioussonu.me/extensions/kuracode/install',
  },
};

export default function InstallPage() {
  return (
    <div className="max-w-4xl mx-auto py-8">
      {/* Breadcrumb */}
      <nav className={styles.breadcrumbs} aria-label="Breadcrumb">
        <Link href="/extensions/kuracode" className={styles.breadcrumbLink}>KuraCode</Link>
        <span className={styles.breadcrumbSeparator}>/</span>
        <span className={styles.breadcrumbCurrent}>Install</span>
      </nav>

      <div className="text-center mb-12">
        <div className={styles.badge}>PRE-RELEASE DISTRIBUTION</div>
        <h1 className="text-3xl md:text-4xl font-extrabold text-text-primary mb-4">
          Install KuraCode Extension
        </h1>
        <p className="text-base text-text-muted max-w-xl mx-auto">
          KuraCode is currently in pre-release staging. Official store listings are being reviewed for publication.
        </p>
      </div>

      {/* Store Listings Status */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <div className="p-6 rounded-xl border border-border bg-surface-1 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-3 mb-3">
              <span className="text-xl">🌐</span>
              <h3 className="font-bold text-text-primary text-base">Chrome Web Store</h3>
            </div>
            <p className="text-sm text-text-muted mb-4">Official store submission in progress for Google Chrome and Chromium browsers.</p>
          </div>
          <span className="inline-block py-2 px-3 text-center text-xs font-mono font-medium rounded-lg bg-surface-2 border border-border text-gold">
            Listing Coming Soon
          </span>
        </div>

        <div className="p-6 rounded-xl border border-border bg-surface-1 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-3 mb-3">
              <span className="text-xl">🌊</span>
              <h3 className="font-bold text-text-primary text-base">Microsoft Edge Add-ons</h3>
            </div>
            <p className="text-sm text-text-muted mb-4">Official store submission staged for Microsoft Edge.</p>
          </div>
          <span className="inline-block py-2 px-3 text-center text-xs font-mono font-medium rounded-lg bg-surface-2 border border-border text-gold">
            Listing Coming Soon
          </span>
        </div>

        <div className="p-6 rounded-xl border border-border bg-surface-1 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-3 mb-3">
              <span className="text-xl">🦊</span>
              <h3 className="font-bold text-text-primary text-base">Firefox Add-ons (AMO)</h3>
            </div>
            <p className="text-sm text-text-muted mb-4">Manifest V3 build package prepared for Mozilla Add-on review.</p>
          </div>
          <span className="inline-block py-2 px-3 text-center text-xs font-mono font-medium rounded-lg bg-surface-2 border border-border text-gold">
            Listing Coming Soon
          </span>
        </div>
      </div>

      {/* Developer Sideload Instructions */}
      <section className="p-8 rounded-2xl border border-border bg-surface-1 mb-12">
        <h2 className="text-xl font-bold text-text-primary mb-4 flex items-center gap-2">
          <span>🛠️</span>
          <span>Manual Developer Sideload (Pre-Release Build)</span>
        </h2>
        <p className="text-sm text-text-secondary leading-relaxed mb-6">
          Developers testing the preview version can install KuraCode directly in Chromium-based browsers using Developer Mode:
        </p>

        <ol className="space-y-4 text-sm text-text-primary list-decimal pl-5">
          <li>
            Clone or download the extension build repository:{' '}
            <a
              href={KURACODE_FACTS.owner.repositoryUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-emerald-400 underline font-mono text-xs"
            >
              {KURACODE_FACTS.owner.repositoryUrl}
            </a>
          </li>
          <li>In your browser, open <code className="px-1.5 py-0.5 rounded bg-surface-2 font-mono text-xs text-gold">chrome://extensions</code> or <code className="px-1.5 py-0.5 rounded bg-surface-2 font-mono text-xs text-gold">edge://extensions</code>.</li>
          <li>Toggle the <strong>Developer mode</strong> switch in the upper-right corner.</li>
          <li>Click the <strong>Load unpacked</strong> button and select the unpacked <code className="px-1.5 py-0.5 rounded bg-surface-2 font-mono text-xs">dist/</code> directory.</li>
          <li>Pin KuraCode to your toolbar and highlight any code snippet on a web page to test.</li>
        </ol>
      </section>

      {/* Owner Token Chip */}
      <div className="text-center text-xs text-text-muted font-mono">
        <span>Build hash: {KURACODE_FACTS.version} • Owner signature: </span>
        <PlaceholderChip label={KURACODE_FACTS.owner.legalName} />
      </div>
    </div>
  );
}
