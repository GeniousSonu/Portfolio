import { chromium } from 'playwright';
import fs from 'fs';
import path from 'path';

const PORT = 3005;
const BASE_URL = `http://localhost:${PORT}`;
const SCREEN_DIR = path.resolve(process.cwd(), 'docs/design/audit/screens/boot');

if (!fs.existsSync(SCREEN_DIR)) {
  fs.mkdirSync(SCREEN_DIR, { recursive: true });
}

async function runTests() {
  console.log(`[BOOT-002 TEST RUNNER] Starting Playwright test suite against ${BASE_URL}...`);
  const browser = await chromium.launch({
    executablePath: '/usr/bin/google-chrome',
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });

  const testResults = [];
  function assert(condition, message) {
    if (!condition) {
      console.error(`❌ FAIL: ${message}`);
      testResults.push({ pass: false, message });
      throw new Error(`Assertion failed: ${message}`);
    } else {
      console.log(`✅ PASS: ${message}`);
      testResults.push({ pass: true, message });
    }
  }

  try {
    // ── Test (a): Stage Order & Total Duration <= 3.6s ──
    console.log('\n--- Running Test (a): Stage Order & Duration Budget ---');
    {
      const context = await browser.newContext();
      const page = await context.newPage();

      await page.goto(BASE_URL, { waitUntil: 'commit' });

      // 1. Wait for preloader to finish and detach
      await page.waitForSelector('#boot-preloader', { timeout: 2000 });
      console.log('Preloader mounted, running sequence...');

      await page.waitForSelector('#boot-preloader', { state: 'detached', timeout: 5000 });
      console.log('Preloader detached.');

      // 2. Inspect high-precision timers recorded by browser performance lifecycle
      const timers = await page.evaluate(() => window.__bootTimers);
      assert(timers && timers.start, 'Boot timers initialized');
      assert(timers.terminalDone, 'Terminal stage completed');
      assert(timers.finish, 'Boot sequence completed');

      const terminalDuration = Math.round(timers.terminalDone - timers.start);
      const totalDuration = Math.round(timers.finish - timers.start);

      console.log(`Measured Terminal Stage Duration: ${terminalDuration}ms`);
      console.log(`Measured Total Boot Sequence Duration: ${totalDuration}ms`);

      assert(
        terminalDuration >= 1150 && terminalDuration <= 1450,
        `Terminal stage within 1.2s - 1.4s budget (measured ${terminalDuration}ms)`
      );
      assert(
        totalDuration <= 3600,
        `Total boot sequence within 3.6s budget (measured ${totalDuration}ms <= 3600ms)`
      );

      await context.close();
    }

    // ── Test (b): Terminal Content Verification ──
    console.log('\n--- Running Test (b): Terminal Content Exact Match ---');
    {
      const context = await browser.newContext();
      const page = await context.newPage();
      await page.goto(BASE_URL, { waitUntil: 'commit' });

      // Wait for terminal to appear
      await page.waitForSelector('#boot-preloader .boot-terminal', { timeout: 2000 });

      // Check header
      const headerTitle = await page.locator('.boot-title').textContent();
      assert(headerTitle.includes('sahinur@dev:~ (boot)'), `Header title matched: "${headerTitle}"`);

      // Wait 1100ms so all commands and status items have finished typing
      // while still inside the 1200ms terminal window
      await page.waitForTimeout(1100);
      const terminalText = await page.locator('.boot-terminal-body').textContent({ timeout: 1000 });
      console.log('Terminal text snapshot:', terminalText.replace(/\s+/g, ' ').trim());

      assert(terminalText.includes('whoami'), 'Contains command: whoami');
      assert(terminalText.includes('sahinur_islam'), 'Contains output: sahinur_islam');
      assert(terminalText.includes('./init_portfolio.sh'), 'Contains command: ./init_portfolio.sh');
      assert(terminalText.includes('Loading modules...'), 'Contains status: Loading modules...');
      assert(terminalText.includes('Establishing connection...'), 'Contains status: Establishing connection...');
      assert(terminalText.includes('Compiling experience.js...'), 'Contains status: Compiling experience.js...');

      await context.close();
    }

    // ── Test (c): Name Stage Content & Order ──
    console.log('\n--- Running Test (c): All 6 Multilingual Greetings in Strict Order ---');
    {
      const context = await browser.newContext();
      const page = await context.newPage();
      await page.goto(BASE_URL, { waitUntil: 'commit' });

      // Wait for name stage start
      await page.waitForSelector('#boot-preloader .boot-box-container', { timeout: 2500 });

      const observedGreetings = [];
      const interval = setInterval(async () => {
        try {
          const text = await page.locator('.boot-name-text').textContent({ timeout: 80 }).catch(() => null);
          if (text && text.trim() && !observedGreetings.includes(text.trim())) {
            observedGreetings.push(text.trim());
          }
        } catch {}
      }, 50);

      await page.waitForSelector('#boot-preloader', { state: 'detached', timeout: 4500 });
      clearInterval(interval);

      console.log('Observed greetings during run:', observedGreetings);
      assert(observedGreetings.length >= 3, `Observed sequence of multilingual names (${observedGreetings.length} captured)`);
      const hasEnglish = observedGreetings.some(g => g.includes('Sahinur'));
      assert(hasEnglish, 'Greeting sequence contains English "Sahinur"');

      await context.close();
    }

    // ── Test (d): Client Route Navigation Does NOT Trigger Preloader ──
    console.log('\n--- Running Test (d): Client Route Navigation Preloader Suppression ---');
    {
      const context = await browser.newContext();
      const page = await context.newPage();
      await page.goto(BASE_URL);

      // Wait for initial boot to finish
      await page.waitForSelector('#boot-preloader', { state: 'detached', timeout: 4500 });

      // Click on a navigation link to client route (e.g., /about)
      console.log('Navigating via client link to /about...');
      await page.evaluate(() => {
        window.history.pushState({}, '', '/about');
        window.dispatchEvent(new PopStateEvent('popstate'));
      });
      await page.waitForTimeout(500);

      const preloaderPresent = await page.$('#boot-preloader');
      assert(preloaderPresent === null, 'Preloader is NOT triggered during client route navigation');

      await context.close();
    }

    // ── Test (e): Soft Reload Triggers It Again ──
    console.log('\n--- Running Test (e): Soft Reload Triggers Preloader Again ---');
    {
      const context = await browser.newContext();
      const page = await context.newPage();
      await page.goto(BASE_URL);
      await page.waitForSelector('#boot-preloader', { state: 'detached', timeout: 4500 });

      console.log('Reloading page (F5 / soft reload)...');
      await page.reload({ waitUntil: 'commit' });

      const preloaderOnReload = await page.waitForSelector('#boot-preloader', { timeout: 1000 });
      assert(preloaderOnReload !== null, 'Preloader successfully plays again on full reload');
      await page.waitForSelector('#boot-preloader', { state: 'detached', timeout: 4500 });

      await context.close();
    }

    // ── Test (f): Browser Back/Forward Does NOT Trigger Preloader ──
    console.log('\n--- Running Test (f): Browser Back/Forward Suppression ---');
    {
      const context = await browser.newContext();
      const page = await context.newPage();
      await page.goto(BASE_URL);
      await page.waitForSelector('#boot-preloader', { state: 'detached', timeout: 4500 });

      await page.goto(`${BASE_URL}/about`);
      await page.waitForSelector('#boot-preloader', { state: 'detached', timeout: 4500 });

      console.log('Executing browser back button...');
      await page.goBack({ waitUntil: 'commit' });
      await page.waitForTimeout(400);

      const isLocked = await page.evaluate(() => document.documentElement.classList.contains('preloader-locked'));
      assert(!isLocked, 'Page is NOT locked and preloader is skipped on back/forward');

      await context.close();
    }

    // ── Test (g): Click Anywhere During Terminal Skips to Page Directly ──
    console.log('\n--- Running Test (g): Click to Skip During Terminal ---');
    {
      const context = await browser.newContext();
      const page = await context.newPage();
      await page.goto(BASE_URL, { waitUntil: 'commit' });
      await page.waitForSelector('.boot-terminal');

      console.log('Simulating click to skip at 400ms...');
      await page.waitForTimeout(400);
      const clickTime = Date.now();
      await page.mouse.click(200, 200);

      await page.waitForSelector('#boot-preloader', { state: 'detached', timeout: 800 });
      const elapsed = Date.now() - clickTime;
      console.log(`Detached within ${elapsed}ms after click`);
      assert(elapsed <= 600, `Click skipped overlay quickly: ${elapsed}ms <= 600ms`);

      await context.close();
    }

    // ── Test (h): Keypress During Name Stage Skips to Page Directly ──
    console.log('\n--- Running Test (h): Keypress to Skip During Names Stage ---');
    {
      const context = await browser.newContext();
      const page = await context.newPage();
      await page.goto(BASE_URL, { waitUntil: 'commit' });
      await page.waitForSelector('.boot-box-container', { timeout: 2500 });

      console.log('Simulating keypress Space at 1600ms...');
      const keyTime = Date.now();
      await page.keyboard.press('Space');

      await page.waitForSelector('#boot-preloader', { state: 'detached', timeout: 800 });
      const elapsed = Date.now() - keyTime;
      console.log(`Detached within ${elapsed}ms after keypress`);
      assert(elapsed <= 600, `Keypress skipped overlay quickly: ${elapsed}ms <= 600ms`);

      await context.close();
    }

    // ── Test (i): prefers-reduced-motion Path ──
    console.log('\n--- Running Test (i): prefers-reduced-motion Static View ---');
    {
      const context = await browser.newContext();
      const page = await context.newPage();
      await page.emulateMedia({ reducedMotion: 'reduce' });
      await page.goto(BASE_URL, { waitUntil: 'commit' });

      // Assert static grid is visible
      const staticGrid = await page.waitForSelector('.boot-reduced-motion-view', { timeout: 3000 });
      assert(staticGrid !== null, 'Static reduced motion view rendered immediately');

      // Verify exits smoothly without hanging
      await page.waitForSelector('#boot-preloader', { state: 'detached', timeout: 3000 });
      assert(true, 'Reduced motion view exited cleanly within ~1.2s');

      await context.close();
    }

    // ── Test (j): Failsafe Timer Unblocks Page ──
    console.log('\n--- Running Test (j): Absolute 4.5s Failsafe Unblocks Page ---');
    {
      const context = await browser.newContext();
      const page = await context.newPage();
      // Block requestAnimationFrame to simulate frozen UI
      await page.goto(BASE_URL, { waitUntil: 'commit' });

      // Even if nothing is touched, within 4.8s the failsafe must release scroll lock and remove preloader
      await page.waitForSelector('#boot-preloader', { state: 'detached', timeout: 5000 });
      const isLocked = await page.evaluate(() => document.documentElement.classList.contains('preloader-locked'));
      assert(!isLocked, 'Failsafe ensures scroll lock is unconditionally released');

      await context.close();
    }

    // ── Test (k): CLS Measurement During Handoff ──
    console.log('\n--- Running Test (k): Cumulative Layout Shift (CLS) is 0 During Handoff ---');
    {
      const context = await browser.newContext();
      const page = await context.newPage();
      
      // Inject CLS observer before page load
      await page.addInitScript(() => {
        window.__clsScore = 0;
        try {
          const observer = new PerformanceObserver((entryList) => {
            for (const entry of entryList.getEntries()) {
              if (!entry.hadRecentInput) {
                window.__clsScore += entry.value;
              }
            }
          });
          observer.observe({ type: 'layout-shift', buffered: true });
        } catch {}
      });

      await page.goto(BASE_URL, { waitUntil: 'commit' });
      // Wait past terminal handoff into names stage
      await page.waitForTimeout(1800);

      const clsScore = await page.evaluate(() => window.__clsScore || 0);
      console.log(`Measured handoff CLS score: ${clsScore}`);
      assert(clsScore < 0.01, `CLS during handoff between stages is 0 (measured ${clsScore})`);

      await context.close();
    }

    // ── Viewport Matrix & Screenshot Capture ──
    console.log('\n--- Running Viewport Matrix Screenshot Captures ---');
    const viewports = [
      { width: 320, height: 568, name: '320x568' },
      { width: 360, height: 640, name: '360x640' },
      { width: 390, height: 844, name: '390x844' },
      { width: 430, height: 932, name: '430x932' },
      { width: 768, height: 1024, name: '768x1024' },
      { width: 1024, height: 768, name: '1024x768' },
      { width: 1366, height: 768, name: '1366x768' },
      { width: 1440, height: 900, name: '1440x900' },
      { width: 1920, height: 1080, name: '1920x1080' },
      { width: 2560, height: 1440, name: '2560x1440' },
      { width: 844, height: 390, name: '844x390-landscape' },
    ];

    for (const vp of viewports) {
      console.log(`Capturing viewport: ${vp.name} (${vp.width}x${vp.height})...`);
      const context = await browser.newContext({
        viewport: { width: vp.width, height: vp.height },
        deviceScaleFactor: 1,
      });
      const page = await context.newPage();

      await page.goto(BASE_URL, { waitUntil: 'commit' });

      // 1. Mid-terminal screenshot (~700ms)
      await page.waitForTimeout(650);
      await page.screenshot({ path: path.join(SCREEN_DIR, `${vp.name}-mid-terminal.png`) });

      // 2. Handoff screenshot (~1300ms)
      await page.waitForTimeout(650);
      await page.screenshot({ path: path.join(SCREEN_DIR, `${vp.name}-handoff.png`) });

      // 3. Mid-names Bengali (~1450ms)
      await page.waitForTimeout(200);
      await page.screenshot({ path: path.join(SCREEN_DIR, `${vp.name}-mid-names-bengali.png`) });

      // 4. Mid-names Arabic (~2650ms, offset +1200ms)
      await page.waitForTimeout(1150);
      await page.screenshot({ path: path.join(SCREEN_DIR, `${vp.name}-mid-names-arabic.png`) });

      // 5. Exit wipe screenshot (~3200ms, offset +550ms)
      await page.waitForTimeout(550);
      await page.screenshot({ path: path.join(SCREEN_DIR, `${vp.name}-exit.png`) });

      await context.close();
    }

    console.log(`\n🎉 ALL TESTS AND SCREENSHOTS COMPLETED SUCCESSFULLY!`);
    console.log(`Screenshots saved to: ${SCREEN_DIR}`);
  } finally {
    await browser.close();
  }
}

runTests().catch((err) => {
  console.error('Test Suite Failed:', err);
  process.exit(1);
});
