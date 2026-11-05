import React from 'react';
import Link from 'next/link';
import styles from '../kuracode.module.css';

export const metadata = {
  title: 'KuraCode Accessibility Statement (WCAG 2.1 AA)',
  description: 'Our commitment to accessible developer tools, keyboard navigation, high-contrast themes, and screen reader compatibility.',
  alternates: {
    canonical: 'https://genioussonu.me/extensions/kuracode/accessibility',
  },
};

export default function AccessibilityPage() {
  return (
    <div className="max-w-4xl mx-auto py-8">
      {/* Breadcrumbs */}
      <nav className={styles.breadcrumbs} aria-label="Breadcrumb">
        <Link href="/extensions/kuracode" className={styles.breadcrumbLink}>KuraCode</Link>
        <span className={styles.breadcrumbSeparator}>/</span>
        <span className={styles.breadcrumbCurrent}>Accessibility</span>
      </nav>

      <article className="p-8 md:p-10 rounded-2xl border border-border bg-surface-1">
        <header className="mb-8 border-b border-border pb-6">
          <h1 className="text-3xl font-extrabold text-text-primary mb-3">
            Accessibility Statement (VPAT &amp; WCAG 2.1 AA)
          </h1>
          <p className="text-base text-text-muted">
            Developer tools should be accessible to everyone. Here is how KuraCode meets and enforces accessibility standards.
          </p>
        </header>

        <section className="space-y-6 text-sm text-text-secondary leading-relaxed">
          <h2 className="text-xl font-bold text-text-primary">1. Keyboard Operability</h2>
          <p>
            Every single feature inside KuraCode—from capturing snippets and searching collections to editing metadata and exporting archives—can be operated exclusively via standard keyboard inputs without requiring a mouse.
          </p>

          <h2 className="text-xl font-bold text-text-primary">2. Contrast &amp; Theming</h2>
          <p>
            KuraCode supports both high-contrast Light and Dark themes. Text and interactive controls are tested to achieve at least a <strong>4.5:1</strong> contrast ratio for standard text and <strong>3:1</strong> for large headings and icons, adhering to WCAG 2.1 Level AA specifications.
          </p>

          <h2 className="text-xl font-bold text-text-primary">3. Screen Reader Compatibility &amp; ARIA</h2>
          <p>
            All modals, action buttons, status tags, and dialogs are instrumented with semantic HTML5 elements and appropriate ARIA roles (<code className="font-mono text-emerald-400">role=&quot;dialog&quot;</code>, <code className="font-mono text-emerald-400">aria-modal=&quot;true&quot;</code>, <code className="font-mono text-emerald-400">aria-label</code>).
          </p>

          <h2 className="text-xl font-bold text-text-primary">4. Reduced Motion Support</h2>
          <p>
            KuraCode honors the system <code className="font-mono text-emerald-400">prefers-reduced-motion: reduce</code> media feature. When enabled, transition animations and transform sweeps are immediately replaced with zero-latency discrete state changes.
          </p>
        </section>
      </article>
    </div>
  );
}

