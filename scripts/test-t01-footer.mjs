#!/usr/bin/env node
/**
 * Test Suite for T01: Header and Footer Structure
 *
 * Verifies:
 * 1. Curated footer navigation schema in src/config/navigation.js
 * 2. Semantic navigation landmarks in src/components/Footer.jsx
 * 3. Token-based styling compliance (no raw hex codes in component)
 * 4. 4-column architecture (Navigate, Work, Connect, Legal)
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, '..');

const NAV_CONFIG_PATH = path.join(ROOT_DIR, 'src', 'config', 'navigation.js');
const FOOTER_COMPONENT_PATH = path.join(ROOT_DIR, 'src', 'components', 'Footer.jsx');

let failed = false;

function assert(condition, message) {
  if (!condition) {
    console.error(`❌ FAIL: ${message}`);
    failed = true;
  } else {
    console.log(`✓ PASS: ${message}`);
  }
}

console.log('── Running T01: Header and Footer Verification ──\n');

// 1. Navigation config contract
const navModule = await import(`file://${NAV_CONFIG_PATH}`);
const {
  NAVIGATION_ITEMS,
  FOOTER_LEGAL_ITEMS,
  FOOTER_CONNECT_ITEMS,
  getFooterNavItems,
} = navModule;

assert(Array.isArray(NAVIGATION_ITEMS), 'NAVIGATION_ITEMS is an array');
assert(Array.isArray(FOOTER_LEGAL_ITEMS), 'FOOTER_LEGAL_ITEMS is an array');
assert(Array.isArray(FOOTER_CONNECT_ITEMS), 'FOOTER_CONNECT_ITEMS is an array');

const navigateItems = getFooterNavItems('navigate');
const workItems = getFooterNavItems('work');

assert(navigateItems.length >= 4, `Navigate column has >= 4 items (found ${navigateItems.length})`);
assert(workItems.length >= 4, `Work column has >= 4 items (found ${workItems.length})`);
assert(FOOTER_CONNECT_ITEMS.length === 4, `Connect column has exactly 4 items (found ${FOOTER_CONNECT_ITEMS.length})`);

// Verify required Connect items
const connectLabels = FOOTER_CONNECT_ITEMS.map(i => i.label);
assert(connectLabels.includes('GitHub'), 'Connect includes GitHub');
assert(connectLabels.includes('WordPress.org'), 'Connect includes WordPress.org');
assert(connectLabels.includes('LinkedIn'), 'Connect includes LinkedIn');
assert(connectLabels.includes('Telegram'), 'Connect includes Telegram');

// Verify required Legal items
const legalHrefs = FOOTER_LEGAL_ITEMS.map(i => i.href);
assert(legalHrefs.includes('/privacy'), 'Legal includes /privacy');
assert(legalHrefs.includes('/terms'), 'Legal includes /terms');
assert(legalHrefs.includes('/imprint'), 'Legal includes /imprint');

// 2. Footer component source code inspection
const footerSource = fs.readFileSync(FOOTER_COMPONENT_PATH, 'utf-8');

assert(footerSource.includes('aria-label="Navigate"'), 'Footer has semantic nav landmark for Navigate');
assert(footerSource.includes('aria-label="Work"'), 'Footer has semantic nav landmark for Work');
assert(footerSource.includes('aria-label="Connect"'), 'Footer has semantic nav landmark for Connect');
assert(footerSource.includes('aria-label="Legal"'), 'Footer has semantic nav landmark for Legal');

// Verify design token compliance (no hardcoded hex colors like #fff or #10B981)
const hexMatches = footerSource.match(/#[0-9a-fA-F]{3,8}\b/g) || [];
assert(hexMatches.length === 0, `Footer has zero raw hex codes (found: ${hexMatches.join(', ')})`);

// Verify cookie consent trigger
assert(footerSource.includes('open-cookie-preferences'), 'Footer provides custom event trigger for cookie preferences');

console.log('\n─────────────────────────────────────────────────');
if (failed) {
  console.error('\n❌ T01 verification failed with errors above.');
  process.exit(1);
} else {
  console.log('\n✅ All T01 verification tests passed successfully.');
  process.exit(0);
}
