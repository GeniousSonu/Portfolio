'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import styles from '../kuracode.module.css';

export default function DemoPage() {
  const [copiedSnippet, setCopiedSnippet] = useState(null);

  const handleCopy = (code, id) => {
    navigator.clipboard?.writeText(code);
    setCopiedSnippet(id);
    setTimeout(() => setCopiedSnippet(null), 2000);
  };

  return (
    <div className={styles.quietWrapper}>
      <header className="mb-8 border-b border-border pb-6 flex items-center justify-between flex-wrap gap-4">
        <div className="flex items-center gap-3">
          <Image src="/assets/kuracode/kuracode-icon.svg" alt="KuraCode Logo" width={32} height={32} />
          <div>
            <h1 className="text-2xl font-bold text-text-primary">Interactive Capture Sandbox</h1>
            <p className="text-xs text-text-muted font-mono">Quiet Verification Route • Same-Origin Only • Text Selectable</p>
          </div>
        </div>
        <Link href="/extensions/kuracode" className="text-xs font-mono text-gold hover:underline">
          ← Return to KuraCode Overview
        </Link>
      </header>

      <div className="p-4 rounded-xl border border-emerald-800/40 bg-emerald-950/20 text-emerald-400 text-xs font-mono mb-8">
        💡 Instructions: Highlight any of the code boxes below with your mouse and trigger KuraCode via hotkey (Alt+Shift+S / ⌥+Shift+S) or right-click context menu. Observe how line numbers and shell prompts are cleaned automatically.
      </div>

      <div className="space-y-8">
        {/* Sample 1: Code with Line Numbers */}
        <div className="p-6 rounded-xl border border-border bg-surface-1">
          <div className="flex justify-between items-center mb-3">
            <span className="text-xs font-mono text-gold font-bold">SAMPLE 1: Numbered Code (Tests Line Number Stripping)</span>
            <button
              type="button"
              onClick={() => handleCopy('function calculateChecksum(buffer) {\n  let sum = 0;\n  for (let i = 0; i < buffer.length; i++) {\n    sum = (sum + buffer[i]) & 0xffff;\n  }\n  return sum;\n}', 'sample-1')}
              className="text-xs font-mono px-2.5 py-1 rounded bg-surface-2 hover:bg-surface-2/80 text-text-primary border border-border"
            >
              {copiedSnippet === 'sample-1' ? 'Copied Raw!' : 'Copy Raw Text'}
            </button>
          </div>
          <pre className="p-4 rounded-lg bg-black/60 font-mono text-xs text-emerald-400 overflow-x-auto leading-relaxed select-all">
{`01: function calculateChecksum(buffer) {
02:   let sum = 0;
03:   for (let i = 0; i < buffer.length; i++) {
04:     sum = (sum + buffer[i]) & 0xffff;
05:   }
06:   return sum;
07: }`}
          </pre>
        </div>

        {/* Sample 2: Terminal Session with Shell Prompts */}
        <div className="p-6 rounded-xl border border-border bg-surface-1">
          <div className="flex justify-between items-center mb-3">
            <span className="text-xs font-mono text-gold font-bold">SAMPLE 2: Terminal Session (Tests Prompt Cleaning: $, &gt;)</span>
            <button
              type="button"
              onClick={() => handleCopy('git checkout -b feature/provenance-engine\nnpm install\nnpm run test', 'sample-2')}
              className="text-xs font-mono px-2.5 py-1 rounded bg-surface-2 hover:bg-surface-2/80 text-text-primary border border-border"
            >
              {copiedSnippet === 'sample-2' ? 'Copied Raw!' : 'Copy Raw Text'}
            </button>
          </div>
          <pre className="p-4 rounded-lg bg-black/60 font-mono text-xs text-amber-300 overflow-x-auto leading-relaxed select-all">
{`$ git checkout -b feature/provenance-engine
$ npm install
$ npm run test`}
          </pre>
        </div>

        {/* Sample 3: Python Indentation Preservation */}
        <div className="p-6 rounded-xl border border-border bg-surface-1">
          <div className="flex justify-between items-center mb-3">
            <span className="text-xs font-mono text-gold font-bold">SAMPLE 3: Nested Python (Tests Indentation Preservation)</span>
            <button
              type="button"
              onClick={() => handleCopy('def parse_log_entry(raw_line):\n    if not raw_line.strip():\n        return None\n    try:\n        timestamp, message = raw_line.split(" - ", 1)\n        return {"time": timestamp, "msg": message}\n    except ValueError:\n        return {"error": "malformed"}', 'sample-3')}
              className="text-xs font-mono px-2.5 py-1 rounded bg-surface-2 hover:bg-surface-2/80 text-text-primary border border-border"
            >
              {copiedSnippet === 'sample-3' ? 'Copied Raw!' : 'Copy Raw Text'}
            </button>
          </div>
          <pre className="p-4 rounded-lg bg-black/60 font-mono text-xs text-sky-300 overflow-x-auto leading-relaxed select-all">
{`def parse_log_entry(raw_line):
    if not raw_line.strip():
        return None
    try:
        timestamp, message = raw_line.split(" - ", 1)
        return {"time": timestamp, "msg": message}
    except ValueError:
        return {"error": "malformed"}`}
          </pre>
        </div>

        {/* Sample 4: Same-Origin Static Iframe Test */}
        <div className="p-6 rounded-xl border border-border bg-surface-1">
          <span className="text-xs font-mono text-gold font-bold block mb-3">
            SAMPLE 4: Same-Origin Embedded Frame (Tests Isolated Iframe Capture)
          </span>
          <iframe
            src="/assets/kuracode/demo-frame.html"
            title="KuraCode Embedded Frame Test"
            className="w-full h-36 rounded-lg border border-border bg-black/40"
          />
        </div>
      </div>
    </div>
  );
}
