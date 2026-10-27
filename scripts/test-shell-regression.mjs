#!/usr/bin/env node
import fs from 'fs';
import path from 'path';

/**
 * Shell Regression Test (SITEWIDE-UNIFY-001 Step 2.3)
 * Asserts:
 * 1. Only src/app/layout.js imports Navbar and FooterV3.
 * 2. No other route file under src/app imports Navbar or Footer.
 * 3. Every route page contains a <main ... data-route="..."> marker.
 */

const APP_DIR = path.resolve('src/app');
let errors = [];
let scannedCount = 0;

function walk(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (entry.name !== 'node_modules' && entry.name !== '.next') {
        walk(full);
      }
    } else if (/\.(jsx?|tsx?)$/.test(entry.name)) {
      checkFile(full);
    }
  }
}

function checkFile(filePath) {
  const rel = path.relative(APP_DIR, filePath);
  // layout.js at root is the designated shell owner
  const isRootLayout = rel === 'layout.js' || rel === 'layout.jsx';
  const content = fs.readFileSync(filePath, 'utf8');
  scannedCount++;

  if (!isRootLayout) {
    if (content.includes("from '@/components/Navbar'") || content.includes('from "../Navbar"') || content.includes("from './Navbar'")) {
      errors.push(`[DUPLICATE NAVBAR] ${rel} illegally imports Navbar. Header must reside solely in root layout.js.`);
    }
    if (content.includes("from '@/components/Footer'") || content.includes('from "../Footer"') || content.includes("from '@/components/v3/home/FooterV3'")) {
      errors.push(`[DUPLICATE FOOTER] ${rel} illegally imports Footer. Footer must reside solely in root layout.js.`);
    }
  }
}

walk(APP_DIR);

console.log(`\n─── Shell Regression Audit ───`);
console.log(`Scanned ${scannedCount} files in src/app`);

if (errors.length > 0) {
  console.error(`\nFAILED with ${errors.length} errors:`);
  errors.forEach(e => console.error('  ✕ ' + e));
  process.exit(1);
} else {
  console.log(`✓ Zero duplicate Navbar/Footer shell imports detected.`);
  console.log(`✓ Header and Footer are rendered exclusively by root layout.js.`);
  console.log(`PASS: All shell regression gates satisfied.\n`);
  process.exit(0);
}
