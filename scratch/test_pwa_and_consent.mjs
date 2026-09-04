import assert from 'node:assert';
import fs from 'node:fs';
import path from 'node:path';

console.log('=== TEST 1: Service Worker Stamping & Configuration ===');
const swPath = path.resolve(process.cwd(), 'public/sw.js');
assert(fs.existsSync(swPath), 'public/sw.js must exist');
const initialSw = fs.readFileSync(swPath, 'utf8');

assert(initialSw.includes('self.skipWaiting()'), 'sw.js must include skipWaiting()');
assert(initialSw.includes('self.clients.claim()'), 'sw.js must include clients.claim()');
assert(initialSw.includes("event.data.type === 'SKIP_WAITING'"), 'sw.js must handle SKIP_WAITING message');

// Test update-sw-version.mjs
const { execSync } = await import('node:child_process');
execSync('node scripts/update-sw-version.mjs');
const updatedSw = fs.readFileSync(swPath, 'utf8');
const versionMatch = updatedSw.match(/const CACHE_VERSION = '([^']+)';/);
assert(versionMatch && versionMatch[1], 'CACHE_VERSION must be defined and stamped');
console.log('Stamped CACHE_VERSION:', versionMatch[1]);
console.log('✓ Service Worker configuration and dynamic stamping passed.');

console.log('\n=== TEST 2: Consent Logic Unit Simulation ===');
// Mock browser environment for consent.js
global.window = {
  location: { hostname: 'genioussonu.me' },
  dispatchEvent: (e) => {},
};
global.document = {
  cookie: '',
};
const store = new Map();
global.localStorage = {
  getItem: (k) => store.get(k) || null,
  setItem: (k, v) => store.set(k, String(v)),
  removeItem: (k) => store.delete(k),
  clear: () => store.clear(),
};
global.CustomEvent = class CustomEvent {
  constructor(name, detail) {
    this.name = name;
    this.detail = detail;
  }
};

const consentModule = await import('../src/lib/consent.js');
const { getConsentChoice, isConsentFullAccepted, setConsentChoice, getConsentStatus } = consentModule;

// State 1: Fresh user (none)
localStorage.clear();
document.cookie = '';
assert.strictEqual(getConsentChoice(), 'none', 'Initial consent choice must be none');
assert.strictEqual(isConsentFullAccepted(), false, 'Initial full accepted must be false');
assert.strictEqual(getConsentStatus(), 'pending', 'Initial status must be pending');
console.log('✓ Initial state verified: pending, not full accepted');

// State 2: User clicks "Reject"
setConsentChoice('reject', false);
assert.strictEqual(getConsentChoice(), 'reject', 'Choice must be reject');
assert.strictEqual(isConsentFullAccepted(), false, 'Rejected must NOT be full accepted (footer stays visible)');
assert.strictEqual(getConsentStatus(), 'denied', 'Analytics must be denied');
console.log('✓ Reject state verified: isConsentFullAccepted is false (footer control stays visible)');

// State 3: User custom preferences (e.g. analytics enabled, but not Accept All)
setConsentChoice('custom', true);
assert.strictEqual(getConsentChoice(), 'custom', 'Choice must be custom');
assert.strictEqual(isConsentFullAccepted(), false, 'Custom must NOT be full accepted (footer stays visible)');
assert.strictEqual(getConsentStatus(), 'granted', 'Analytics status can be granted');
console.log('✓ Custom preferences verified: isConsentFullAccepted is false (footer control stays visible)');

// State 4: User clicks "Accept All"
setConsentChoice('accept_all', true);
assert.strictEqual(getConsentChoice(), 'accept_all', 'Choice must be accept_all');
assert.strictEqual(isConsentFullAccepted(), true, 'Accept all must be full accepted (footer control hidden)');
assert.strictEqual(getConsentStatus(), 'granted', 'Analytics status must be granted');
console.log('✓ Accept All verified: isConsentFullAccepted is true (footer control permanently hidden)');

console.log('\n=== ALL PWA & COOKIE CONSENT LOGIC TESTS PASSED ===');
