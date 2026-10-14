#!/usr/bin/env node
/**
 * Route Verification Script (Phase R0 Skeleton Gate)
 *
 * Verifies that every `href` declared in `src/config/navigation.js`:
 * 1. Resolves to an actual physical route directory/file in `src/app/`, OR
 * 2. Resolves to a valid anchor ID on the homepage (`src/app/page.js` or related components).
 *
 * Exits with status 1 on any broken link.
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, '..');
const APP_DIR = path.join(ROOT_DIR, 'src', 'app');
const PAGE_JS_PATH = path.join(APP_DIR, 'page.js');
const NAV_CONFIG_PATH = path.join(ROOT_DIR, 'src', 'config', 'navigation.js');

// Dynamically import navigation configuration
const navModule = await import(`file://${NAV_CONFIG_PATH}`);
const { NAVIGATION_ITEMS, FOOTER_LEGAL_ITEMS, EXCLUDED_FROM_NAV, FOOTER_CONNECT_ITEMS } = navModule;

const allItems = [
  ...NAVIGATION_ITEMS,
  ...FOOTER_LEGAL_ITEMS,
  ...EXCLUDED_FROM_NAV,
];

console.log(`[check-routes] Verifying ${allItems.length} navigation endpoints against codebase...`);

// Validate T01 curated footer metadata
let footerErrors = false;
for (const item of NAVIGATION_ITEMS) {
  if (typeof item.footer !== 'boolean') {
    console.error(`  ❌ Missing boolean 'footer' property on item "${item.id}"`);
    footerErrors = true;
  }
  if (item.footer && !['work', 'navigate'].includes(item.footerColumn)) {
    console.error(`  ❌ Invalid footerColumn "${item.footerColumn}" on item "${item.id}". Expected 'work' or 'navigate'.`);
    footerErrors = true;
  }
}

if (!Array.isArray(FOOTER_CONNECT_ITEMS) || FOOTER_CONNECT_ITEMS.length === 0) {
  console.error(`  ❌ Missing or empty FOOTER_CONNECT_ITEMS`);
  footerErrors = true;
}

if (footerErrors) {
  console.error(`\n[check-routes] FAILED: Invalid footer configuration schema detected.`);
  process.exit(1);
}

let hasErrors = false;
let verifiedCount = 0;

// Read homepage content to scan for declared anchor IDs
const homeContent = fs.readFileSync(PAGE_JS_PATH, 'utf-8');
const componentDir = path.join(ROOT_DIR, 'src', 'components');

function checkAnchorExists(anchorId) {
  const cleanId = anchorId.replace('#', '');
  // Check in page.js
  if (homeContent.includes(`id="${cleanId}"`) || homeContent.includes(`id='${cleanId}'`)) {
    return true;
  }
  // Check in components
  const componentFiles = fs.readdirSync(componentDir).filter(f => f.endsWith('.jsx') || f.endsWith('.js'));
  for (const file of componentFiles) {
    const content = fs.readFileSync(path.join(componentDir, file), 'utf-8');
    if (content.includes(`id="${cleanId}"`) || content.includes(`id='${cleanId}'`)) {
      return true;
    }
  }
  return false;
}

function checkPageRouteExists(routePath) {
  // Normalize route path: remove leading /
  const segments = routePath.replace(/^\//, '').split('/').filter(Boolean);
  
  if (segments.length === 0) {
    // Root route /
    return fs.existsSync(path.join(APP_DIR, 'page.js')) || fs.existsSync(path.join(APP_DIR, 'page.jsx'));
  }

  const targetDir = path.join(APP_DIR, ...segments);
  const possibleFiles = [
    path.join(targetDir, 'page.js'),
    path.join(targetDir, 'page.jsx'),
    path.join(targetDir, 'page.ts'),
    path.join(targetDir, 'page.tsx'),
    path.join(targetDir, '[[...tool]]', 'page.jsx'),
    path.join(targetDir, '[[...tool]]', 'page.js'),
    path.join(targetDir, '[...tool]', 'page.jsx'),
    path.join(targetDir, '[...tool]', 'page.js'),
  ];

  return possibleFiles.some((f) => fs.existsSync(f));
}

for (const item of allItems) {
  const { href, label, type } = item;

  if (href.startsWith('/#')) {
    // Homepage anchor target
    const anchorId = href.replace('/#', '');
    if (checkAnchorExists(anchorId)) {
      verifiedCount++;
    } else {
      console.error(`  ❌ Broken anchor link: "${label}" -> ${href} (Anchor id="${anchorId}" not found in homepage components)`);
      hasErrors = true;
    }
  } else if (href.startsWith('#')) {
    // Standalone anchor target
    const anchorId = href.replace('#', '');
    if (checkAnchorExists(anchorId)) {
      verifiedCount++;
    } else {
      console.error(`  ❌ Broken anchor link: "${label}" -> ${href} (Anchor id="${anchorId}" not found in homepage components)`);
      hasErrors = true;
    }
  } else if (href.startsWith('/')) {
    // Standard page route
    if (checkPageRouteExists(href)) {
      verifiedCount++;
    } else {
      console.error(`  ❌ 404 Missing page route: "${label}" -> ${href} (No corresponding page.js/jsx found in src/app${href})`);
      hasErrors = true;
    }
  } else {
    console.error(`  ❌ Invalid href format: "${label}" -> ${href}`);
    hasErrors = true;
  }
}

if (hasErrors) {
  console.error(`\n[check-routes] FAILED: Broken navigation links detected. Review errors above.`);
  process.exit(1);
} else {
  console.log(`[check-routes] SUCCESS: All ${verifiedCount} navigation links verified with 0 errors.`);
  process.exit(0);
}
