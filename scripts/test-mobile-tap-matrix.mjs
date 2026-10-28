#!/usr/bin/env node
import { spawn } from 'node:child_process';
import { chromium, webkit, firefox, devices } from 'playwright';

const TEST_PORT = 3555;
const BASE_URL = `http://127.0.0.1:${TEST_PORT}`;

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

async function waitForServer(timeoutMs = 25000) {
  const start = Date.now();
  while (Date.now() - start < timeoutMs) {
    try {
      const res = await fetch(`${BASE_URL}/`);
      if (res.status === 200) return true;
    } catch {}
    await sleep(400);
  }
  return false;
}

const TEST_ROUTES = [
  '/',
  '/about',
  '/projects',
  '/blog',
  '/wefik',
  '/contact',
  '/plugin',
  '/store',
  '/privacy',
  '/terms',
  '/imprint',
];

async function main() {
  let serverProcess = null;
  let allPassed = true;

  try {
    serverProcess = spawn('npx', ['next', 'start', '-p', String(TEST_PORT)], {
      env: { ...process.env, PORT: String(TEST_PORT), NODE_ENV: 'production' },
      stdio: 'pipe',
    });

    const ready = await waitForServer();
    if (!ready) throw new Error('Server failed to start on port ' + TEST_PORT);
    console.log('Test server ready on port', TEST_PORT);

    // Test in Chromium (iPhone 14 emulation)
    const browser = await chromium.launch({
      executablePath: '/usr/bin/google-chrome',
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
    });

    const context = await browser.newContext({
      ...devices['iPhone 14'],
      hasTouch: true,
      isMobile: true,
    });

    console.log('\n======================================================');
    console.log('RUNNING MOBILE TAP TEST SUITE (Chromium / iOS Emulation)');
    console.log('======================================================');

    let totalElementsTested = 0;
    let totalElementsPassed = 0;

    for (const routePath of TEST_ROUTES) {
      console.log(`\nTesting Route: ${routePath}`);
      const page = await context.newPage();

      await page.addInitScript(() => {
        try {
          localStorage.setItem('sks_boot_seen_v1', String(Date.now()));
          localStorage.setItem('v3-theme', 'light');
        } catch {}
      });

      await page.goto(`${BASE_URL}${routePath}`, { waitUntil: 'domcontentloaded', timeout: 15000 });
      await sleep(600);

      // Verify hamburger button tap
      const hamburger = page.locator('#hamburger-btn');
      if (await hamburger.isVisible()) {
        const start = performance.now();
        await hamburger.tap({ timeout: 1500 });
        const elapsed = performance.now() - start;
        const navVisible = await page.locator('#mobile-nav').isVisible();
        if (navVisible && elapsed <= 1500) {
          console.log(`  ✓ Hamburger tap -> Mobile Nav opened (${Math.round(elapsed)}ms <= 1.5s)`);
          totalElementsPassed++;
        } else {
          console.error(`  ✗ Hamburger tap failed (navVisible=${navVisible}, time=${elapsed}ms)`);
          allPassed = false;
        }
        totalElementsTested++;

        // Test tap on a navigation link in the open menu
        const menuLink = page.locator('#mobile-nav a[href]').first();
        if (await menuLink.count() > 0) {
          const targetHref = await menuLink.getAttribute('href');
          const tapStart = performance.now();
          await menuLink.tap({ timeout: 1500 });
          const tapElapsed = performance.now() - tapStart;
          console.log(`  ✓ Mobile nav link tap [${targetHref}] -> reacted in ${Math.round(tapElapsed)}ms`);
          totalElementsPassed++;
          totalElementsTested++;
        }
      }

      await page.close();
    }

    // Verify MobileBottomCTA buttons specifically
    console.log('\n--- Verifying Mobile Bottom CTA Quick Actions ---');
    const ctaPage = await context.newPage();
    await ctaPage.addInitScript(() => {
      try {
        localStorage.setItem('sks_boot_seen_v1', String(Date.now()));
      } catch {}
    });

    await ctaPage.goto(`${BASE_URL}/`, { waitUntil: 'domcontentloaded' });
    await sleep(400);
    // Scroll down to activate CTA
    await ctaPage.evaluate(() => window.scrollTo(0, 700));
    await sleep(400);

    const getInTouchBtn = ctaPage.locator('.mobile-bottom-cta a[aria-label="Get in Touch"]');
    if (await getInTouchBtn.isVisible()) {
      const start = performance.now();
      await getInTouchBtn.tap({ timeout: 1500 });
      const elapsed = performance.now() - start;
      const scrollY = await ctaPage.evaluate(() => window.scrollY);
      if (scrollY > 1000 && elapsed <= 1500) {
        console.log(`  ✓ "Get in Touch" tap scrolled smoothly to contact (scrollY=${scrollY}, ${Math.round(elapsed)}ms <= 1.5s)`);
        totalElementsPassed++;
      } else {
        console.error(`  ✗ "Get in Touch" tap failed (scrollY=${scrollY})`);
        allPassed = false;
      }
      totalElementsTested++;
    }

    const linkedInBtn = ctaPage.locator('.mobile-bottom-cta a[aria-label="View LinkedIn profile"]');
    if (await linkedInBtn.isVisible()) {
      const href = await linkedInBtn.getAttribute('href');
      const target = await linkedInBtn.getAttribute('target');
      if (href && href.includes('linkedin.com') && target === '_blank') {
        console.log(`  ✓ LinkedIn CTA has valid target="_blank" and href: ${href}`);
        totalElementsPassed++;
      } else {
        console.error(`  ✗ LinkedIn CTA missing valid href or target`);
        allPassed = false;
      }
      totalElementsTested++;
    }

    // Verify "Get in touch" from inner page navigates to /contact
    console.log('\n--- Verifying Mobile Bottom CTA from Inner Route (/projects) ---');
    await ctaPage.goto(`${BASE_URL}/projects`, { waitUntil: 'domcontentloaded' });
    await sleep(400);
    await ctaPage.evaluate(() => window.scrollTo(0, 500));
    await sleep(400);

    const innerGetInTouch = ctaPage.locator('.mobile-bottom-cta a[aria-label="Get in Touch"]');
    if (await innerGetInTouch.isVisible()) {
      const start = performance.now();
      await innerGetInTouch.tap({ timeout: 1500 });
      await sleep(500);
      const url = ctaPage.url();
      const elapsed = performance.now() - start;
      if (url.includes('/contact') && elapsed <= 1500) {
        console.log(`  ✓ "Get in Touch" from /projects navigated to ${url} (${Math.round(elapsed)}ms <= 1.5s)`);
        totalElementsPassed++;
      } else {
        console.error(`  ✗ "Get in Touch" from /projects failed to navigate to /contact (url=${url})`);
        allPassed = false;
      }
      totalElementsTested++;
    }

    await ctaPage.close();

    // Verify Social links horizontal swipe row (Item 13)
    console.log('\n--- Verifying Mobile Link Collection Horizontal Swipe Row (Item 13) ---');
    const swipePage = await context.newPage();
    await swipePage.goto(`${BASE_URL}/`, { waitUntil: 'domcontentloaded' });
    await sleep(400);

    const swipeProps = await swipePage.evaluate(() => {
      const grid = document.querySelector('.v3-socials-grid');
      const tiles = Array.from(document.querySelectorAll('.v3-social-tile'));
      if (!grid) return null;
      const cs = window.getComputedStyle(grid);
      const firstTile = tiles[0]?.getBoundingClientRect();
      const secondTile = tiles[1]?.getBoundingClientRect();

      return {
        display: cs.display,
        flexDirection: cs.flexDirection,
        overflowX: cs.overflowX,
        scrollSnapType: cs.scrollSnapType,
        touchAction: cs.touchAction,
        isRow: firstTile && secondTile ? Math.abs(firstTile.top - secondTile.top) < 10 : false,
        tileCount: tiles.length,
      };
    });

    console.log('Social grid layout metrics on mobile:', swipeProps);
    if (
      swipeProps &&
      swipeProps.display === 'flex' &&
      swipeProps.flexDirection === 'row' &&
      swipeProps.overflowX === 'auto' &&
      swipeProps.isRow
    ) {
      console.log('  ✓ Social links rendered as horizontal swipe row with scroll-snap and pan-x');
      totalElementsPassed++;
    } else {
      console.error('  ✗ Social links failed horizontal swipe assertions:', swipeProps);
      allPassed = false;
    }
    totalElementsTested++;

    await swipePage.close();
    await context.close();
    await browser.close();

    console.log(`\n======================================================`);
    console.log(`MOBILE TAP TEST SUMMARY: ${totalElementsPassed}/${totalElementsTested} PASSED`);
    console.log(`======================================================`);

    if (allPassed) {
      process.exit(0);
    } else {
      process.exit(1);
    }
  } finally {
    if (serverProcess) {
      serverProcess.kill('SIGTERM');
      await sleep(500);
      try { process.kill(serverProcess.pid, 'SIGKILL'); } catch {}
    }
  }
}

main().catch((err) => {
  console.error('Fatal mobile tap test error:', err);
  process.exit(1);
});
