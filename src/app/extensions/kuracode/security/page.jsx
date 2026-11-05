import React from 'react';
import Link from 'next/link';
import styles from '../kuracode.module.css';

export const metadata = {
  title: 'KuraCode Security Policy & Vulnerability Disclosure',
  description: 'Security mechanisms in KuraCode: client-side secret scanner, CSP enforcement, and responsible disclosure.',
  alternates: {
    canonical: 'https://genioussonu.me/extensions/kuracode/security',
  },
};

export default function SecurityPage() {
  return (
    <div className="max-w-4xl mx-auto py-8">
      {/* Breadcrumbs */}
      <nav className={styles.breadcrumbs} aria-label="Breadcrumb">
        <Link href="/extensions/kuracode" className={styles.breadcrumbLink}>KuraCode</Link>
        <span className={styles.breadcrumbSeparator}>/</span>
        <span className={styles.breadcrumbCurrent}>Security</span>
      </nav>

      <article className="p-8 md:p-10 rounded-2xl border border-border bg-surface-1">
        <header className="mb-8 border-b border-border pb-6">
          <h1 className="text-3xl font-extrabold text-text-primary mb-3">
            Security Policy &amp; Architecture
          </h1>
          <p className="text-base text-text-muted">
            How KuraCode defends your developer environment and confidential code.
          </p>
        </header>

        <section className="space-y-6 text-sm text-text-secondary leading-relaxed">
          <h2 className="text-xl font-bold text-text-primary">1. Client-Side Secret Scanning</h2>
          <p>
            Developers frequently copy configuration blocks that contain sensitive credentials. KuraCode includes a built-in heuristic pattern scanner that evaluates highlighted text before saving:
          </p>
          <ul className="list-disc pl-5 space-y-1 text-text-primary">
            <li>Private RSA / SSH keys (\`-----BEGIN OPENSSH PRIVATE KEY-----\`).</li>
            <li>Cloud provider tokens (AWS, GCP, DigitalOcean tokens).</li>
            <li>API keys (Stripe, GitHub personal access tokens, OpenAI keys).</li>
            <li>Database connection URIs containing embedded passwords.</li>
          </ul>
          <p>
            When a potential secret is discovered, KuraCode warns you immediately, allowing you to redact the secret before saving.
          </p>

          <h2 className="text-xl font-bold text-text-primary">2. Content Security Policy (CSP) &amp; Zero Remote Code</h2>
          <p>
            In compliance with Chrome Web Store and Firefox AMO policies (Manifest V3), KuraCode contains no dynamic remote script execution (no <code className="text-emerald-400 font-mono">eval()</code>, no remote CDN scripts). All code highlighting and DOM parsing libraries are bundled locally.
          </p>

          <h2 className="text-xl font-bold text-text-primary">3. Vulnerability Disclosure</h2>
          <p>
            If you identify a security issue, vulnerability, or edge-case script leakage in KuraCode, please report it immediately via RFC 9116 security protocols or our direct contact form at{' '}
            <Link href="/contact" className="text-gold underline">
              genioussonu.me/contact
            </Link>.
          </p>
        </section>
      </article>
    </div>
  );
}
