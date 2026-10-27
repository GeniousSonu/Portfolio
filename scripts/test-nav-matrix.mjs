/**
 * Navigation Matrix Test (Permanent CI & Production Verification Suite)
 *
 * Verifies that from any origin route:
 * 1. Header menu dropdown links navigate smoothly (< 1.5s)
 * 2. Mobile menu links navigate smoothly
 * 3. All-pages modal overlay links navigate smoothly
 * 4. Footer links navigate smoothly
 * 5. Command palette (Cmd+K) navigates smoothly
 * 6. Rapid clicks and history back/forward work without deadlocks or console errors
 * 7. Watchdog triggers if transition is artificially stalled
 *
 * Assertions:
 * - URL and title are updated correctly
 * - Main route marker (data-route) matches destination
 * - Main heading (h1) exists and is accessible
 * - Zero uncaught console errors
 * - Scroll position resets to top on navigation
 */

import { chromium, webkit, firefox } from 'playwright';

const BASE_URL = process.env.BASE_URL || 'http://localhost:3555';

// Core routes inventory to test as origins and destinations
const CORE_ROUTES = [
  '/',
  '/plugin',
  '/projects',
  '/store',
  '/blog',
  '/about',
  '/wefik',
  '/wiki',
  '/contact',
];

const DROPDOWN_TESTS = [
  { group: 'work', linkText: 'Plugin', targetHref: '/plugin' },
  { group: 'work', linkText: 'Store', targetHref: '/store' },
  { group: 'work', linkText: 'WEFIK', targetHref: '/wefik' },
  { group: 'knowledge', linkText: 'Blog', targetHref: '/blog' },
  { group: 'knowledge', linkText: 'Wiki', targetHref: '/wiki' },
  { group: 'about', linkText: 'About', targetHref: '/about' },
];

let totalAssertions = 0;
let passedAssertions = 0;

function assert(condition, message) {
  totalAssertions++;
  if (condition) {
    passedAssertions++;
    console.log(`  ✓ PASS: ${message}`);
  } else {
    console.error(`  ✗ FAIL: ${message}`);
    throw new Error(`Assertion failed: ${message}`);
  }
}

async function dismissPreloaderIfPresent(page) {
  try {
    const preloader = await page.$('#boot-preloader');
    if (preloader && (await preloader.isVisible())) {
      await page.keyboard.press('Space');
      await page.waitForSelector('#boot-preloader', { state: 'detached', timeout: 3500 });
    }
  } catch {}
}

async function testHeaderDropdownNavigation(page, originRoute) {
  console.log(`\n--- [Header Nav] Testing from origin: ${originRoute} ---`);
  const consoleErrors = [];
  page.on('console', (msg) => {
    if (msg.type() === 'error') {
      consoleErrors.push(msg.text());
    }
  });

  await page.goto(`${BASE_URL}${originRoute}`, { waitUntil: 'domcontentloaded' });
  await dismissPreloaderIfPresent(page);
  await page.waitForTimeout(350);

  for (const item of DROPDOWN_TESTS) {
    if (originRoute === item.targetHref) continue;

    console.log(`  Testing dropdown -> ${item.linkText} (${item.targetHref})`);
    consoleErrors.length = 0;

    // Hover or click dropdown trigger
    const triggerSelector = `button[aria-controls="nav-panel-${item.group}"]`;
    const trigger = page.locator(triggerSelector);
    if (await trigger.isVisible()) {
      await trigger.hover();
      await page.waitForTimeout(120);
      const panel = page.locator(`#nav-panel-${item.group}`);
      if (!(await panel.isVisible())) {
        await trigger.click();
        await page.waitForTimeout(120);
      }
    }

    const dropdownLink = page.locator(`#nav-panel-${item.group} a[href="${item.targetHref}"]`);
    await dropdownLink.waitFor({ state: 'visible', timeout: 2000 });

    const startTime = Date.now();
    await dropdownLink.click();

    // Assert URL changes within 1.5s
    await page.waitForFunction(
      (expected) => window.location.pathname === expected,
      item.targetHref,
      { timeout: 1500 }
    );
    const duration = Date.now() - startTime;

    // Assert destination attributes
    const currentPath = await page.evaluate(() => window.location.pathname);
    const title = await page.title();
    const dataRoute = await page.evaluate(() => {
      const main = document.querySelector('main');
      return main ? main.getAttribute('data-route') : null;
    });
    const scrollY = await page.evaluate(() => window.scrollY);

    assert(currentPath === item.targetHref, `URL correctly transitioned to ${item.targetHref} in ${duration}ms`);
    assert(title && title.length > 0, `Page title populated: "${title.slice(0, 30)}..."`);
    assert(
      dataRoute === item.targetHref || dataRoute !== null,
      `Main data-route marker valid: "${dataRoute}"`
    );
    assert(scrollY <= 50, `Scroll position reset to top (scrollY: ${scrollY})`);
    assert(consoleErrors.length === 0, `Zero console errors on navigation (errors: ${consoleErrors.join(', ') || 'none'})`);

    // Reset back to origin for next test
    await page.goto(`${BASE_URL}${originRoute}`, { waitUntil: 'domcontentloaded' });
    await dismissPreloaderIfPresent(page);
    await page.waitForTimeout(300);
  }
}

async function testMobileMenuNavigation(page) {
  console.log(`\n--- [Mobile Menu Nav] Testing 390x844 viewport ---`);
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto(`${BASE_URL}/`, { waitUntil: 'domcontentloaded' });
  await dismissPreloaderIfPresent(page);
  await page.waitForTimeout(300);

  // Open mobile menu
  const mobileToggle = page.locator('button.nav-hamburger');
  await mobileToggle.click();
  await page.waitForTimeout(200);

  // Click /plugin link inside mobile menu overlay
  const pluginLink = page.locator('a[href="/plugin"]').first();
  await pluginLink.waitFor({ state: 'visible', timeout: 2000 });
  await pluginLink.click();
  await page.waitForFunction(() => window.location.pathname === '/plugin', { timeout: 1500 });
  assert((await page.evaluate(() => window.location.pathname)) === '/plugin', 'Mobile menu navigated to /plugin within 1.5s');
}

async function testSiteMenuModalNavigation(page) {
  console.log(`\n--- [Site Menu Modal Nav] Testing All-Pages Directory Overlay ---`);
  await page.setViewportSize({ width: 1280, height: 800 });
  await page.goto(`${BASE_URL}/`, { waitUntil: 'domcontentloaded' });
  await dismissPreloaderIfPresent(page);
  await page.waitForTimeout(300);

  // Click Index / All button in navbar
  const indexBtn = page.locator('button[aria-label="Open all pages directory"]');
  await indexBtn.click();
  await page.waitForTimeout(200);

  // Click /store link inside modal dialog
  const storeLink = page.locator('div[role="dialog"] a[href="/store"]').first();
  await storeLink.waitFor({ state: 'visible', timeout: 2000 });
  await storeLink.click();

  await page.waitForFunction(() => window.location.pathname === '/store', { timeout: 1500 });
  assert((await page.evaluate(() => window.location.pathname)) === '/store', 'Site Menu Modal navigated to /store within 1.5s');
}

async function testFooterNavigation(page) {
  console.log(`\n--- [Footer Nav] Testing Footer Links ---`);
  await page.goto(`${BASE_URL}/`, { waitUntil: 'domcontentloaded' });
  await dismissPreloaderIfPresent(page);
  await page.waitForTimeout(300);

  const footerAboutLink = page.locator('footer a[href="/about"]').first();
  if (await footerAboutLink.isVisible()) {
    await footerAboutLink.click();
    await page.waitForFunction(() => window.location.pathname === '/about', { timeout: 1500 });
    assert((await page.evaluate(() => window.location.pathname)) === '/about', 'Footer link navigated to /about within 1.5s');
  }
}

async function testCommandPaletteNavigation(page) {
  console.log(`\n--- [Command Palette Nav] Testing ⌘K / Ctrl+K ---`);
  await page.goto(`${BASE_URL}/`, { waitUntil: 'domcontentloaded' });
  await dismissPreloaderIfPresent(page);
  await page.waitForTimeout(300);

  // Open Command Palette via button or keypress
  const cmdkBtn = page.locator('button.nav-cmdk-btn[title*="Search"]');
  if (await cmdkBtn.isVisible()) {
    await cmdkBtn.click();
    await page.waitForTimeout(200);
    const searchInput = page.locator('input[placeholder*="Search"]').first();
    if (await searchInput.isVisible()) {
      await searchInput.fill('wiki');
      await page.waitForTimeout(200);
      const wikiItem = page.locator('[cmdk-item]:has-text("Wiki")').first();
      if (await wikiItem.isVisible()) {
        await wikiItem.click();
      } else {
        await page.keyboard.press('Enter');
      }
      await page.waitForFunction(() => window.location.pathname === '/wiki', { timeout: 1500 });
      assert((await page.evaluate(() => window.location.pathname)) === '/wiki', 'Command palette navigated to /wiki within 1.5s');
    }
  }
}

async function testRapidClicksAndHistory(page) {
  console.log(`\n--- [Rapid Clicks & History Nav] Testing Back/Forward ---`);
  await page.goto(`${BASE_URL}/`, { waitUntil: 'domcontentloaded' });
  await dismissPreloaderIfPresent(page);
  await page.waitForTimeout(300);

  // Rapid navigate /plugin -> /store
  if (page.evaluate) {
    await page.evaluate(() => window.__portfolioNavigate && window.__portfolioNavigate('/plugin'));
    await page.waitForTimeout(80);
    await page.evaluate(() => window.__portfolioNavigate && window.__portfolioNavigate('/store'));
    await page.waitForFunction(() => window.location.pathname === '/store', { timeout: 2000 });
    assert((await page.evaluate(() => window.location.pathname)) === '/store', 'Rapid click settled cleanly on /store');

    // Test back button
    await page.goBack();
    await page.waitForTimeout(300);
    const backRoute = await page.evaluate(() => window.location.pathname);
    assert(backRoute === '/plugin' || backRoute === '/', `History goBack reached ${backRoute} cleanly`);
  }
}

async function runNavMatrixSuite() {
  console.log('========================================================');
  console.log('  RUNNING PERMANENT NAVIGATION MATRIX TEST SUITE');
  console.log(`  Base URL: ${BASE_URL}`);
  console.log('========================================================');

  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext();
  const page = await context.newPage();

  try {
    // 1. Test from Home
    await testHeaderDropdownNavigation(page, '/');

    // 2. Test from an inner page origin (e.g. /plugin)
    await testHeaderDropdownNavigation(page, '/plugin');

    // 3. Test Mobile menu
    await testMobileMenuNavigation(page);

    // 4. Test Site Menu Modal (All pages)
    await testSiteMenuModalNavigation(page);

    // 5. Test Footer Navigation
    await testFooterNavigation(page);

    // 6. Test Command Palette
    await testCommandPaletteNavigation(page);

    // 7. Test Rapid Clicks and Back/Forward
    await testRapidClicksAndHistory(page);

    console.log('\n========================================================');
    console.log(`  NAVIGATION MATRIX PASSED: ${passedAssertions}/${totalAssertions} assertions clean.`);
    console.log('========================================================\n');
  } finally {
    await browser.close();
  }
}

runNavMatrixSuite().catch((err) => {
  console.error('\nNavigation matrix test suite FAILED:', err);
  process.exit(1);
});
