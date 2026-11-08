'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import styles from '../kuracode.module.css';

const DEMO_SAMPLES = [
  {
    id: 'javascript',
    label: 'Numbered JavaScript',
    filename: 'checksum.js',
    language: 'JavaScript',
    description: 'Demonstrates stripping leading line numbers (01:, 02:) while preserving language structure.',
    raw: `01: function calculateChecksum(buffer) {
02:   let sum = 0;
03:   for (let i = 0; i < buffer.length; i++) {
04:     sum = (sum + buffer[i]) & 0xffff;
05:   }
06:   return sum;
07: }`,
    cleaned: `function calculateChecksum(buffer) {
  let sum = 0;
  for (let i = 0; i < buffer.length; i++) {
    sum = (sum + buffer[i]) & 0xffff;
  }
  return sum;
}`,
    hasSecret: false,
  },
  {
    id: 'terminal',
    label: 'Terminal Shell Session',
    filename: 'setup.sh',
    language: 'Bash / Shell',
    description: 'Demonstrates stripping command prompt symbols ($, >) for ready-to-run execution.',
    raw: `$ git checkout -b feature/provenance-engine
$ npm install --save-dev vitest
$ npm run test -- --run`,
    cleaned: `git checkout -b feature/provenance-engine
npm install --save-dev vitest
npm run test -- --run`,
    hasSecret: false,
  },
  {
    id: 'python',
    label: 'Indented Python',
    filename: 'parser.py',
    language: 'Python',
    description: 'Demonstrates strict preservation of whitespace and nested blocks.',
    raw: `def parse_log_entry(raw_line):
    """Parse timestamped log into structured dictionary."""
    if not raw_line.strip():
        return None
    try:
        timestamp, message = raw_line.split(" - ", 1)
        return {"time": timestamp, "msg": message}
    except ValueError:
        return {"error": "malformed"}`,
    cleaned: `def parse_log_entry(raw_line):
    """Parse timestamped log into structured dictionary."""
    if not raw_line.strip():
        return None
    try:
        timestamp, message = raw_line.split(" - ", 1)
        return {"time": timestamp, "msg": message}
    except ValueError:
        return {"error": "malformed"}`,
    hasSecret: false,
  },
  {
    id: 'secret',
    label: 'Credential Detection',
    filename: 'auth.config.ts',
    language: 'TypeScript',
    description: 'Demonstrates client-side scanning detecting API keys before snippets are committed.',
    raw: `export const authConfig = {
  serviceId: "srv_9920148",
  // Accidental credential detected in tutorial snippet:
  clientSecret: "SAMPLE_DEV_TOKEN_KEY",
  endpoint: "https://api.example.com/v1"
};`,
    cleaned: `export const authConfig = {
  serviceId: "srv_9920148",
  // Accidental credential detected in tutorial snippet:
  clientSecret: "SAMPLE_DEV_TOKEN_KEY",
  endpoint: "https://api.example.com/v1"
};`,
    hasSecret: true,
  },
];

export default function DemoPage() {
  const [activeTab, setActiveTab] = useState(DEMO_SAMPLES[0].id);
  const [isCleanedView, setIsCleanedView] = useState(false);
  const [copied, setCopied] = useState(false);

  const sample = DEMO_SAMPLES.find((s) => s.id === activeTab) || DEMO_SAMPLES[0];
  const displayedCode = isCleanedView ? sample.cleaned : sample.raw;

  const handleCopy = () => {
    navigator.clipboard?.writeText(displayedCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className={styles.quietWrapper}>
      {/* Header */}
      <header className={styles.demoHeader}>
        <div className="flex items-center gap-3">
          <Image
            src="/assets/kuracode/kuracode-icon.svg"
            alt="KuraCode Logo"
            width={28}
            height={28}
          />
          <div>
            <h1 className="text-xl font-bold text-text-primary">
              Interactive Sanitizer Sandbox
            </h1>
            <p className="text-xs text-text-muted">
              Live simulation of KuraCode code cleaning and credential detection.
            </p>
          </div>
        </div>

        <Link
          href="/extensions/kuracode"
          className="text-xs font-mono text-gold hover:underline flex items-center gap-1"
        >
          <span>←</span>
          <span>Return to Overview</span>
        </Link>
      </header>

      {/* Usage Guidance */}
      <div className="p-4 rounded-xl border border-border-subtle bg-surface-card mb-6 text-xs text-text-secondary leading-relaxed">
        <strong className="text-text-primary block mb-1">
          How to test this demonstration:
        </strong>
        <span>
          Select any sample below. You can toggle between the <strong>Raw Web Source</strong> (with unwanted line numbers or prompts) and the <strong>KuraCode Cleaned</strong> output. If you have the KuraCode extension installed, highlight any code box and trigger capture using{' '}
          <kbd className="font-mono text-gold px-1.5 py-0.5 rounded bg-surface-2 border border-border-subtle">
            Alt+Shift+S
          </kbd>{' '}
          directly.
        </span>
      </div>

      {/* Sample Selector Tabs */}
      <div className={styles.demoToolbar} role="tablist" aria-label="Code sample tabs">
        {DEMO_SAMPLES.map((s) => (
          <button
            key={s.id}
            type="button"
            role="tab"
            aria-selected={activeTab === s.id}
            onClick={() => {
              setActiveTab(s.id);
              setIsCleanedView(false);
            }}
            className={`${styles.demoTab} ${activeTab === s.id ? styles.demoTabActive : ''}`}
          >
            {s.label}
          </button>
        ))}
      </div>

      {/* Active Sample Overview */}
      <div className="mb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-text-muted">
        <div>
          <span className="font-semibold text-text-primary">{sample.label}: </span>
          <span>{sample.description}</span>
        </div>

        {/* View Toggle */}
        <div className="flex items-center gap-2 self-start sm:self-auto">
          <button
            type="button"
            onClick={() => setIsCleanedView(false)}
            className={`px-3 py-1 rounded text-xs font-mono transition-colors ${
              !isCleanedView
                ? 'bg-surface-2 text-text-primary border border-border-subtle'
                : 'text-text-muted hover:text-text-primary'
            }`}
          >
            Raw Web Source
          </button>
          <button
            type="button"
            onClick={() => setIsCleanedView(true)}
            className={`px-3 py-1 rounded text-xs font-mono transition-colors ${
              isCleanedView
                ? 'bg-gold/15 text-gold border border-gold/30 font-semibold'
                : 'text-text-muted hover:text-text-primary'
            }`}
          >
            Cleaned Output ✓
          </button>
        </div>
      </div>

      {/* Editor Window */}
      <div className={styles.demoWindow}>
        <div className={styles.demoWindowTitle}>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-red-500/60" />
            <span className="w-2.5 h-2.5 rounded-full bg-yellow-500/60" />
            <span className="w-2.5 h-2.5 rounded-full bg-green-500/60" />
            <span className="ml-2 font-mono text-xs text-text-primary">
              {sample.filename}
            </span>
            <span className="text-xs text-text-muted">({sample.language})</span>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-xs font-mono text-text-muted">
              {isCleanedView ? 'Status: Sanitized' : 'Status: Unsanitized'}
            </span>
            <button
              type="button"
              onClick={handleCopy}
              className="px-2.5 py-1 rounded text-xs font-mono bg-surface-2 hover:bg-surface-2/80 text-text-primary border border-border-subtle transition-colors"
            >
              {copied ? '✓ Copied' : 'Copy Code'}
            </button>
          </div>
        </div>

        <pre className={`${styles.demoCodePre} select-all`}>
          <code>{displayedCode}</code>
        </pre>
      </div>

      {/* Credential Scanner Notification */}
      {sample.hasSecret && (
        <div className={styles.demoSecretAlert}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
            <line x1="12" y1="8" x2="12" y2="12" />
            <line x1="12" y1="16" x2="12.01" y2="16" />
          </svg>
          <div>
            <strong className="block text-red-300 font-semibold text-xs">
              Client-Side Secret Detection Warning:
            </strong>
            <span className="text-xs text-red-200/90">
              Pattern matching flagged an active credential format (<code className="font-mono">sk_live_...</code>). KuraCode warns you locally before committing this snippet to prevent accidental leakages.
            </span>
          </div>
        </div>
      )}

      {/* Quick Action Footer */}
      <div className="mt-8 pt-6 border-t border-border-subtle flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-text-muted">
        <span>KuraCode executes code cleaning locally on the client without sending your code to external servers.</span>
        <div className="flex items-center gap-4">
          <Link href="/extensions/kuracode/docs" className="text-gold hover:underline">
            Read Docs
          </Link>
          <Link href="/extensions/kuracode/install" className="text-gold hover:underline">
            Get Extension
          </Link>
        </div>
      </div>
    </div>
  );
}
