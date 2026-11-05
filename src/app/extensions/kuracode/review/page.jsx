import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import styles from '../kuracode.module.css';

export const metadata = {
  title: 'KuraCode Store Reviewer Instructions',
  robots: {
    index: false,
    follow: false,
  },
};

export default function ReviewerGuidePage() {
  return (
    <div className={styles.quietWrapper}>
      <header className="mb-8 border-b border-border pb-6 flex items-center justify-between flex-wrap gap-4">
        <div className="flex items-center gap-3">
          <Image src="/assets/kuracode/kuracode-icon.svg" alt="KuraCode Logo" width={32} height={32} />
          <div>
            <h1 className="text-2xl font-bold text-text-primary">Store Reviewer Guide</h1>
            <p className="text-xs text-text-muted font-mono">Chrome Web Store • Microsoft Edge Add-ons • Mozilla AMO</p>
          </div>
        </div>
        <Link href="/extensions/kuracode" className="text-xs font-mono text-gold hover:underline">
          ← Overview
        </Link>
      </header>

      <div className="space-y-6 text-sm text-text-secondary leading-relaxed">
        <section className="p-6 rounded-xl border border-border bg-surface-1">
          <h2 className="text-base font-bold text-text-primary mb-3">1. Single Purpose &amp; Architecture Overview</h2>
          <p>
            KuraCode is a local-first developer utility designed strictly to capture, clean, and organize programming code snippets directly from web pages. The extension functions entirely client-side without requiring a user account or remote authentication.
          </p>
        </section>

        <section className="p-6 rounded-xl border border-border bg-surface-1">
          <h2 className="text-base font-bold text-text-primary mb-3">2. Test Credentials Notice (Delta D4)</h2>
          <p>
            In adherence to store submission security policies, test account credentials and private staging access keys are never published on public web pages. Any specialized test account details or verification bypass tokens are supplied exclusively inside the confidential Store Submission Notes field in the developer dashboard.
          </p>
        </section>

        <section className="p-6 rounded-xl border border-border bg-surface-1">
          <h2 className="text-base font-bold text-text-primary mb-3">3. Step-by-Step Functional Verification Flow</h2>
          <ol className="list-decimal pl-5 space-y-2 text-text-primary">
            <li>
              Navigate to the test sandbox at{' '}
              <Link href="/extensions/kuracode/demo" className="text-emerald-400 underline font-mono text-xs">
                /extensions/kuracode/demo
              </Link>.
            </li>
            <li>Highlight any code block containing line numbers or shell prompts ($).</li>
            <li>Press the default shortcut (<code className="px-1.5 py-0.5 rounded bg-surface-2 text-gold font-mono text-xs">Alt+Shift+S</code> or <code className="px-1.5 py-0.5 rounded bg-surface-2 text-gold font-mono text-xs">⌥+Shift+S</code>) or right-click and choose <strong>Save to KuraCode</strong>.</li>
            <li>Observe that the capture modal opens with line numbers and prompts automatically cleaned.</li>
            <li>Click Save. Verify that the snippet appears in the popup library (<code className="px-1.5 py-0.5 rounded bg-surface-2 text-gold font-mono text-xs">Alt+Shift+Y</code>) with origin URL and timestamp.</li>
            <li>Open the export menu and verify that data can be exported to JSON or Markdown.</li>
          </ol>
        </section>

        <section className="p-6 rounded-xl border border-border bg-surface-1">
          <h2 className="text-base font-bold text-text-primary mb-3">4. Permissions Breakdown</h2>
          <p>
            For a line-by-line justification of each declared permission (activeTab, contextMenus, storage), visit the{' '}
            <Link href="/extensions/kuracode/permissions" className="text-gold underline">
              Permissions Documentation
            </Link>.
          </p>
        </section>
      </div>
    </div>
  );
}

