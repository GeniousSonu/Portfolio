import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '..');

let totalTests = 0;
let passedTests = 0;
let failedTests = 0;

function assert(condition, testName, details = '') {
  totalTests++;
  if (condition) {
    passedTests++;
    console.log(`  ✓ [PASS] ${testName}`);
  } else {
    failedTests++;
    console.error(`  ✗ [FAIL] ${testName} - ${details}`);
  }
}

console.log('\n============================================================');
console.log('INC-001 REGRESSION & RELIABILITY TEST SUITE');
console.log('============================================================\n');

// -------------------------------------------------------------
// Test 1: Service Worker (public/sw.js) Architecture & Defense
// -------------------------------------------------------------
console.log('Scenario A & F: Service Worker (sw.js) Network-First & Eviction Rules');
{
  const swContent = fs.readFileSync(path.join(projectRoot, 'public/sw.js'), 'utf8');

  assert(
    !swContent.includes('PAGES_CACHE') && !swContent.includes('stale-while-revalidate'),
    'SW: No Stale-While-Revalidate caching of HTML pages',
    'Found PAGES_CACHE or stale-while-revalidate in sw.js'
  );

  assert(
    swContent.includes("request.mode === 'navigate'") &&
    swContent.includes('fetch(request)'),
    'SW: Navigation requests use Network-First strategy',
    'Navigation requests do not enforce Network-First'
  );

  assert(
    swContent.includes('/offline') &&
    swContent.includes("match('/offline')"),
    'SW: Offline fallback returns cached /offline page',
    'Offline fallback logic missing in sw.js'
  );

  assert(
    swContent.includes('allowedCaches') &&
    swContent.includes('caches.delete(key)'),
    'SW: Activation phase deletes all obsolete and legacy caches',
    'Cache purging not found in sw.js activate handler'
  );

  assert(
    swContent.includes('self.skipWaiting()') &&
    swContent.includes('self.clients.claim()'),
    'SW: Immediate takeover with skipWaiting and clientsClaim',
    'Immediate activation missing'
  );

  assert(
    swContent.includes('/reset') &&
    swContent.includes('/studio') &&
    swContent.includes('/api') &&
    swContent.includes('_rsc'),
    'SW: Critical paths (/reset, /studio, /api, _rsc) bypass worker cache',
    'Critical bypass routes not found in sw.js'
  );
}

// -------------------------------------------------------------
// Test 2: Client Self-Healing & ChunkLoadError Interception
// -------------------------------------------------------------
console.log('\nScenario B: Self-Healing & ChunkLoadError Recovery (selfHeal.js)');
{
  const selfHealContent = fs.readFileSync(path.join(projectRoot, 'src/lib/selfHeal.js'), 'utf8');
  const selfHealInitContent = fs.readFileSync(path.join(projectRoot, 'src/components/SelfHealInit.jsx'), 'utf8');
  const layoutContent = fs.readFileSync(path.join(projectRoot, 'src/app/layout.js'), 'utf8');

  assert(
    selfHealContent.includes('ChunkLoadError') &&
    selfHealContent.includes('Loading chunk') &&
    selfHealContent.includes('Failed to fetch dynamically imported module'),
    'selfHeal.js: Detects ChunkLoadError and dynamic import failures',
    'ChunkLoadError patterns missing in selfHeal.js'
  );

  assert(
    selfHealContent.includes('sks_self_heal_attempted') &&
    selfHealContent.includes('navigator.serviceWorker.getRegistrations') &&
    selfHealContent.includes('caches.keys()'),
    'selfHeal.js: Evicts SW registrations and caches with single-attempt guard',
    'Worker purge or retry loop guard missing'
  );

  assert(
    selfHealInitContent.includes('initSelfHealing'),
    'SelfHealInit.jsx: Mounts self-healing handler in client tree',
    'initSelfHealing not imported in SelfHealInit.jsx'
  );

  assert(
    layoutContent.includes('SelfHealInit'),
    'layout.js: SelfHealInit is mounted at root App layout',
    'SelfHealInit missing from layout.js'
  );
}

// -------------------------------------------------------------
// Test 3: Safe Storage Resiliency under Corrupted / Malformed Data
// -------------------------------------------------------------
console.log('\nScenario C: Corrupted Storage Resiliency (safeStorage.js)');
{
  const safeStorageContent = fs.readFileSync(path.join(projectRoot, 'src/lib/safeStorage.js'), 'utf8');

  assert(
    safeStorageContent.includes('export const safeStorage =') &&
    safeStorageContent.includes('getItem') &&
    safeStorageContent.includes('setItem') &&
    safeStorageContent.includes('getJSON') &&
    safeStorageContent.includes('setJSON') &&
    safeStorageContent.includes('clearAppKeys'),
    'safeStorage.js: Provides defensive getItem, setItem, getJSON, setJSON, clearAppKeys helpers',
    'safeStorage API incomplete'
  );

  // Check integration across storage-dependent components
  const userPrefs = fs.readFileSync(path.join(projectRoot, 'src/components/UserPreferences.jsx'), 'utf8');
  const consent = fs.readFileSync(path.join(projectRoot, 'src/lib/consent.js'), 'utf8');
  const spaceHist = fs.readFileSync(path.join(projectRoot, 'src/lib/spaceHistory.js'), 'utf8');
  const loungeHist = fs.readFileSync(path.join(projectRoot, 'src/lib/loungeHistory.js'), 'utf8');
  const preloader = fs.readFileSync(path.join(projectRoot, 'src/components/BootPreloader.jsx'), 'utf8');

  assert(
    userPrefs.includes('safeStorage.getItem') && userPrefs.includes('safeStorage.setItem'),
    'UserPreferences.jsx: Uses safeStorage for preference persistence',
    'UserPreferences not using safeStorage'
  );

  assert(
    consent.includes('safeStorage.getItem') && consent.includes('safeStorage.setItem'),
    'consent.js: Uses safeStorage for GDPR consent storage',
    'consent.js not using safeStorage'
  );

  assert(
    spaceHist.includes('safeStorage.getJSON') && spaceHist.includes('safeStorage.setJSON'),
    'spaceHistory.js: Uses safeStorage for space room history',
    'spaceHistory.js not using safeStorage'
  );

  assert(
    loungeHist.includes('safeStorage.getJSON') && loungeHist.includes('safeStorage.setJSON'),
    'loungeHistory.js: Uses safeStorage for lounge history',
    'loungeHistory.js not using safeStorage'
  );

  assert(
    preloader.includes('safeStorage.getItem') && preloader.includes('SESSION_KEY'),
    'BootPreloader.jsx: Uses safeStorage for session boot tracker',
    'BootPreloader not using safeStorage'
  );
}

// -------------------------------------------------------------
// Test 4: Content Visibility & Motion Failsafes (globals.css & layout.js)
// -------------------------------------------------------------
console.log('\nScenario D: Content Visible by Default & Animation Failsafe');
{
  const cssContent = fs.readFileSync(path.join(projectRoot, 'src/app/globals.css'), 'utf8');
  const layoutContent = fs.readFileSync(path.join(projectRoot, 'src/app/layout.js'), 'utf8');

  // Verify default un-scoped state is opacity: 1 and transform: none
  assert(
    cssContent.includes('.hero-eyebrow {\n  display: flex; align-items: center; gap: 0.75rem;\n  font-family: var(--font-mono); font-size: 0.72rem;\n  color: var(--text-muted); letter-spacing: 0.2em;\n  text-transform: uppercase; margin-bottom: 1.75rem;\n  opacity: 1; transform: none;') &&
    cssContent.includes('.hero-role {\n  font-size: clamp(1.1rem, 2.5vw, 1.6rem); font-weight: 600;\n  color: var(--gold); letter-spacing: -0.01em;\n  font-family: var(--font-display);\n  margin-bottom: 1.5rem; opacity: 1; transform: none;'),
    'globals.css: Hero elements are opacity: 1 and transform: none by default',
    'Default hero opacity not set to 1'
  );

  assert(
    cssContent.includes('.reveal { opacity: 1; transform: none; }'),
    'globals.css: .reveal class is opacity: 1 and transform: none by default',
    'Default .reveal opacity not set to 1'
  );

  // Verify hidden initial states require html.js-motion:not(.reduce-motion)
  assert(
    cssContent.includes('html.js-motion:not(.reduce-motion) .hero-eyebrow') &&
    cssContent.includes('html.js-motion:not(.reduce-motion) .reveal'),
    'globals.css: Hidden initial states are strictly scoped under html.js-motion',
    'Scoping under html.js-motion missing'
  );

  // Verify layout.js inline failsafe timer
  assert(
    layoutContent.includes('classList.add(\'js-motion\')') &&
    layoutContent.includes('document.documentElement.classList.remove(\'js-motion\')') &&
    layoutContent.includes('3000'),
    'layout.js: 3-second failsafe removes js-motion if animation hangs',
    '3s animation failsafe timer missing in layout.js'
  );
}

// -------------------------------------------------------------
// Test 5: BootPreloader Reliability & Scroll Lock Safety
// -------------------------------------------------------------
console.log('\nScenario E: BootPreloader Hardening & Scroll Lock Safety');
{
  const preloaderContent = fs.readFileSync(path.join(projectRoot, 'src/components/BootPreloader.jsx'), 'utf8');
  const scrollLockContent = fs.readFileSync(path.join(projectRoot, 'src/hooks/useScrollLock.js'), 'utf8');

  assert(
    preloaderContent.includes('ceilingHitRef.current = true') &&
    preloaderContent.includes('4000'),
    'BootPreloader.jsx: 4-second absolute ceiling timer forces preloader unlock',
    '4s preloader ceiling timer missing'
  );

  assert(
    preloaderContent.includes('preloader-locked') &&
    preloaderContent.includes('document.body.classList.remove(\'preloader-locked\')'),
    'BootPreloader.jsx: Unmount effect guarantees preloader-locked is removed',
    'Unmount cleanup for preloader-locked missing'
  );

  assert(
    scrollLockContent.includes('forceUnlock') &&
    scrollLockContent.includes('pageshow') &&
    scrollLockContent.includes('popstate'),
    'useScrollLock.js: Exports forceUnlock and clears locks on pageshow/popstate',
    'forceUnlock or popstate/pageshow listener missing'
  );
}

// -------------------------------------------------------------
// Test 6: Error Boundaries & Emergency Kill Switch (/reset)
// -------------------------------------------------------------
console.log('\nScenario F, H: Error Boundaries & /reset Emergency Kill Switch');
{
  const errorPageExists = fs.existsSync(path.join(projectRoot, 'src/app/error.js'));
  const globalErrorPageExists = fs.existsSync(path.join(projectRoot, 'src/app/global-error.js'));
  const resetPageExists = fs.existsSync(path.join(projectRoot, 'src/app/reset/page.js'));

  assert(errorPageExists, 'src/app/error.js exists (Leaf & route error boundary)');
  assert(globalErrorPageExists, 'src/app/global-error.js exists (Root layout error boundary)');
  assert(resetPageExists, 'src/app/reset/page.js exists (/reset emergency route)');

  if (resetPageExists) {
    const resetContent = fs.readFileSync(path.join(projectRoot, 'src/app/reset/page.js'), 'utf8');
    assert(
      resetContent.includes('clearAllServiceWorkersAndCaches') &&
      resetContent.includes('safeStorage.clearAppKeys') &&
      resetContent.includes('sessionStorage.clear'),
      'reset/page.js: Fully wipes service workers, caches, local and session storage',
      'Storage purge incomplete in reset/page.js'
    );
  }

  if (globalErrorPageExists) {
    const globalErrorContent = fs.readFileSync(path.join(projectRoot, 'src/app/global-error.js'), 'utf8');
    assert(
      globalErrorContent.includes('Reset Site Cache') &&
      globalErrorContent.includes('/reset'),
      'global-error.js: Provides one-click Reset Site Cache button to /reset',
      'Reset button missing in global-error.js'
    );
  }
}

// -------------------------------------------------------------
// Test 7: HTTP Cache-Control Headers in next.config.mjs
// -------------------------------------------------------------
console.log('\nHTTP Response Headers & Caching Strategy in next.config.mjs');
{
  const nextConfigContent = fs.readFileSync(path.join(projectRoot, 'next.config.mjs'), 'utf8');

  assert(
    nextConfigContent.includes("source: '/_next/static/:path*'") &&
    nextConfigContent.includes("public, max-age=31536000, immutable"),
    'next.config.mjs: Immutable caching configured for /_next/static/:path*',
    'Static chunk immutable cache header missing'
  );

  assert(
    nextConfigContent.includes("source: '/'") &&
    nextConfigContent.includes("public, max-age=0, must-revalidate"),
    'next.config.mjs: Cache-Control public, max-age=0, must-revalidate for root HTML',
    'HTML revalidation header missing for root'
  );

  assert(
    nextConfigContent.includes("source: '/reset'") &&
    nextConfigContent.includes("no-store, no-cache, must-revalidate"),
    'next.config.mjs: no-store header for /reset emergency route',
    '/reset cache control missing'
  );

  assert(
    nextConfigContent.includes("source: '/sw.js'") &&
    nextConfigContent.includes("no-cache, no-store, must-revalidate"),
    'next.config.mjs: no-cache, no-store for /sw.js',
    '/sw.js cache control missing'
  );
}

// -------------------------------------------------------------
// Test 8: Documentation & Amendment A Compliance
// -------------------------------------------------------------
console.log('\nDocumentation & Amendment A Compliance');
{
  const incDocExists = fs.existsSync(path.join(projectRoot, 'docs/incidents/INC-001.md'));
  const adrDocExists = fs.existsSync(path.join(projectRoot, 'docs/adr/ADR-001-pwa-service-worker.md'));
  const designDocContent = fs.readFileSync(path.join(projectRoot, 'design.md'), 'utf8');

  assert(incDocExists, 'docs/incidents/INC-001.md report exists with root cause analysis');
  assert(adrDocExists, 'docs/adr/ADR-001-pwa-service-worker.md exists with Serwist recommendation');

  assert(
    designDocContent.includes('OPERATOR STAGE ARCHIVED PER AMENDMENT A') &&
    designDocContent.includes('Do NOT install `@react-three/fiber` or `@react-three/drei`'),
    'design.md: Section 8 archived per Amendment A with explicit scope notice',
    'Amendment A archive notice missing in Section 8'
  );

  assert(
    designDocContent.includes('16.4 What We Rejected and Why') &&
    designDocContent.includes('3D Avatar Model of Owner'),
    'design.md: 16.4 What We Rejected and Why documents removal of 3D avatar',
    'What We Rejected and Why missing in design.md'
  );

  assert(
    designDocContent.includes('A.4 Stage container [ARCHIVED — Amendment A]') &&
    designDocContent.includes('Appendix B — Camera Keyframe Template [ARCHIVED — Amendment A]'),
    'design.md: Appendix A.4 and Appendix B archived per Amendment A',
    'Appendix A.4 or B not marked archived in design.md'
  );
}

console.log('\n============================================================');
console.log(`TEST RESULTS: ${passedTests}/${totalTests} PASSED, ${failedTests} FAILED`);
console.log('============================================================\n');

if (failedTests > 0) {
  process.exit(1);
} else {
  console.log('All regression and reliability tests PASSED successfully!\n');
  process.exit(0);
}
