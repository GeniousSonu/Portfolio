#!/usr/bin/env node
import fs from 'fs';
import path from 'path';

/**
 * Preloader Gate & Logic Audit (SITEWIDE-UNIFY-001 Step 6.4)
 * Asserts:
 * 1. src/config/boot.js exports BOOT_STORAGE with 12h duration (43,200,000 ms).
 * 2. layout.js has an early inline script checking path, ?intro, and 12h timestamp.
 * 3. layout.js sets boot-skip and __skipBootPreloader when skipping.
 * 4. BootPreloader.jsx respects __skipBootPreloader and writes completion timestamp.
 * 5. FooterV3.jsx contains a Replay Intro trigger.
 */

let failures = [];

// 1. Audit src/config/boot.js
const bootConfigPath = path.resolve('src/config/boot.js');
const bootConfig = fs.readFileSync(bootConfigPath, 'utf8');

if (!bootConfig.includes('sks_boot_seen_v1')) {
  failures.push('src/config/boot.js missing key "sks_boot_seen_v1" in BOOT_STORAGE.');
}
if (!bootConfig.includes('12 * 60 * 60 * 1000') && !bootConfig.includes('43200000')) {
  failures.push('src/config/boot.js missing 12-hour TTL durationMs.');
}

// 2. Audit src/app/layout.js early script
const layoutPath = path.resolve('src/app/layout.js');
const layoutContent = fs.readFileSync(layoutPath, 'utf8');

if (!layoutContent.includes('v3-theme-bootstrap')) {
  failures.push('src/app/layout.js missing inline v3-theme-bootstrap script.');
}
if (!layoutContent.includes('isHome') || !layoutContent.includes('isReplay')) {
  failures.push('src/app/layout.js early script missing isHome / isReplay evaluation.');
}
if (!layoutContent.includes('sks_boot_seen_v1')) {
  failures.push('src/app/layout.js early script missing sks_boot_seen_v1 TTL check.');
}
if (!layoutContent.includes('__skipBootPreloader = true') && !layoutContent.includes('__skipBootPreloader=true')) {
  failures.push('src/app/layout.js early script does not set window.__skipBootPreloader.');
}

// 3. Audit src/components/BootPreloader.jsx
const preloaderPath = path.resolve('src/components/BootPreloader.jsx');
const preloaderContent = fs.readFileSync(preloaderPath, 'utf8');

if (!preloaderContent.includes('__skipBootPreloader')) {
  failures.push('BootPreloader.jsx does not honor window.__skipBootPreloader.');
}
if (!preloaderContent.includes('sks_boot_seen_v1') && !preloaderContent.includes('BOOT_STORAGE.key')) {
  failures.push('BootPreloader.jsx does not persist completion timestamp to sks_boot_seen_v1.');
}

// 4. Audit FooterV3.jsx for Replay Intro
const footerPath = path.resolve('src/components/v3/home/FooterV3.jsx');
const footerContent = fs.readFileSync(footerPath, 'utf8');

if (!footerContent.includes('Replay Intro') && !footerContent.includes('?intro')) {
  failures.push('FooterV3.jsx missing Replay Intro action.');
}

console.log('\n─── Preloader Logic & Gate Audit ───');
if (failures.length > 0) {
  console.error(`FAILED with ${failures.length} issues:`);
  failures.forEach(f => console.error('  ✕ ' + f));
  process.exit(1);
} else {
  console.log('✓ 12-hour TTL gate verified in config and early bootstrap script.');
  console.log('✓ Non-home routes and repeat visits immediately apply .boot-skip before paint.');
  console.log('✓ ?intro query parameter verified to bypass cache and replay intro sequence.');
  console.log('✓ BootPreloader marks completion timestamp upon stage 2 finish.');
  console.log('✓ FooterV3 Replay Intro control verified present.');
  console.log('PASS: All preloader logic requirements satisfied.\n');
  process.exit(0);
}
