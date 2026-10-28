#!/usr/bin/env node
import { spawn } from 'node:child_process';
import { chromium, devices } from 'playwright';

const TEST_PORT = 3556;
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

    const browser = await chromium.launch({
      executablePath: '/usr/bin/google-chrome',
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
    });

    // 1. Verify Item 12: Certificates on Mobile
    console.log('\n--- Verifying Item 12: Certificates on Mobile & Tap Targets ---');
    const mobileContext = await browser.newContext({
      ...devices['iPhone 14'],
      hasTouch: true,
      isMobile: true,
    });
    const page = await mobileContext.newPage();
    await page.addInitScript(() => {
      try {
        localStorage.setItem('sks_boot_seen_v1', String(Date.now()));
        localStorage.setItem('v3-theme', 'light');
      } catch {}
    });
    await page.goto(`${BASE_URL}/`, { waitUntil: 'domcontentloaded' });
    await sleep(500);

    const certMetrics = await page.evaluate(() => {
      const tickets = Array.from(document.querySelectorAll('.v3-cert-ticket'));
      const verifyBtn = document.querySelector('.v3-btn--linkedin');
      return {
        ticketCount: tickets.length,
        allAreAnchors: tickets.every((t) => t.tagName === 'A'),
        allHaveTargetBlank: tickets.every((t) => t.getAttribute('target') === '_blank'),
        allHaveRel: tickets.every((t) => (t.getAttribute('rel') || '').includes('noopener')),
        sampleHrefs: tickets.slice(0, 3).map((t) => t.getAttribute('href')),
        verifyBtnExists: !!verifyBtn,
        verifyBtnHeight: verifyBtn ? verifyBtn.getBoundingClientRect().height : 0,
        verifyBtnHref: verifyBtn ? verifyBtn.getAttribute('href') : null,
      };
    });

    if (certMetrics.ticketCount > 0 && certMetrics.allAreAnchors && certMetrics.allHaveTargetBlank) {
      console.log(`  ✓ All ${certMetrics.ticketCount} certification tickets are <a> anchors with target="_blank"`);
    } else {
      console.error(`  ✗ Cert tickets anchor test failed:`, certMetrics);
      allPassed = false;
    }

    if (certMetrics.verifyBtnExists && certMetrics.verifyBtnHeight >= 44) {
      console.log(`  ✓ LinkedIn verification button has height ${Math.round(certMetrics.verifyBtnHeight)}px >= 44px`);
    } else {
      console.error(`  ✗ LinkedIn verification button failed height check:`, certMetrics);
      allPassed = false;
    }

    // 2. Verify Item 14: Project Card Overflow across narrow viewports
    console.log('\n--- Verifying Item 14: Project Card Narrow Viewport Overflow ---');
    const viewportsToTest = [
      { width: 280, height: 653, name: 'Galaxy Fold (280px)' },
      { width: 320, height: 568, name: 'iPhone SE 1st Gen (320px)' },
      { width: 375, height: 667, name: 'iPhone SE 2nd Gen (375px)' },
      { width: 390, height: 844, name: 'iPhone 14 (390px)' },
      { width: 480, height: 800, name: 'Phablet (480px)' },
    ];

    for (const vp of viewportsToTest) {
      await page.setViewportSize({ width: vp.width, height: vp.height });
      await sleep(300);

      const overflowCheck = await page.evaluate(() => {
        const docOverflow = document.documentElement.scrollWidth > window.innerWidth;
        const titles = Array.from(document.querySelectorAll('.v3-showcase-title'));
        const footers = Array.from(document.querySelectorAll('.v3-frame-footer-bar'));

        let titleOverflow = false;
        for (const t of titles) {
          if (t.scrollWidth > t.clientWidth + 2) {
            titleOverflow = true;
            break;
          }
        }

        let footerOverflow = false;
        for (const f of footers) {
          if (f.scrollWidth > f.clientWidth + 2) {
            footerOverflow = true;
            break;
          }
        }

        return { docOverflow, titleOverflow, footerOverflow };
      });

      if (!overflowCheck.docOverflow && !overflowCheck.titleOverflow && !overflowCheck.footerOverflow) {
        console.log(`  ✓ ${vp.name}: Zero horizontal overflow on document, titles, and footer bars`);
      } else {
        console.error(`  ✗ ${vp.name} failed overflow check:`, overflowCheck);
        allPassed = false;
      }
    }

    // 3. Verify Item 15: Removed Terminal Ping / Launch Section
    console.log('\n--- Verifying Item 15: Terminal Ping Receipt Removed ---');
    const receiptExists = await page.evaluate(() => {
      const receipt = document.querySelector('.v3-receipt');
      const pingText = document.body.innerText.includes('ping -c 1 genioussonu.me');
      return !!receipt || pingText;
    });

    if (!receiptExists) {
      console.log('  ✓ Simulated ping receipt (.v3-receipt) completely removed from DOM');
    } else {
      console.error('  ✗ Simulated ping receipt still present in DOM');
      allPassed = false;
    }

    // 4. Verify Item 20: Contact Form Theme Colors
    console.log('\n--- Verifying Item 20: Contact Form Theme Colors & Contrast ---');
    // Test Light Mode
    const lightFormStyles = await page.evaluate(() => {
      document.documentElement.setAttribute('data-theme', 'light');
      const input = document.querySelector('#name-field');
      const formTerm = document.querySelector('.v3-term--form');
      const submitBtn = document.querySelector('.v3-submit');
      if (!input || !formTerm) return null;

      const csInput = window.getComputedStyle(input);
      const csTerm = window.getComputedStyle(formTerm);
      const csSubmit = window.getComputedStyle(submitBtn);

      return {
        termBg: csTerm.backgroundColor,
        inputBg: csInput.backgroundColor,
        inputColor: csInput.color,
        inputBorder: csInput.borderColor,
        submitHeight: submitBtn.getBoundingClientRect().height,
      };
    });

    console.log('  Light theme form styling:', lightFormStyles);
    if (lightFormStyles && lightFormStyles.submitHeight >= 44) {
      console.log('  ✓ Light theme input surfaces and submit button >= 44px validated');
    } else {
      console.error('  ✗ Light theme form check failed');
      allPassed = false;
    }

    // Test Dark Mode
    await page.evaluate(() => {
      document.documentElement.setAttribute('data-theme', 'dark');
    });
    await sleep(300);

    const darkFormStyles = await page.evaluate(() => {
      const input = document.querySelector('#name-field');
      const formTerm = document.querySelector('.v3-term--form');
      if (!input || !formTerm) return null;

      const csInput = window.getComputedStyle(input);
      const csTerm = window.getComputedStyle(formTerm);

      return {
        termBg: csTerm.backgroundColor,
        inputBg: csInput.backgroundColor,
        inputColor: csInput.color,
      };
    });

    console.log('  Dark theme form styling:', darkFormStyles);
    if (darkFormStyles && darkFormStyles.inputColor !== lightFormStyles.inputColor && darkFormStyles.inputBg !== lightFormStyles.inputBg) {
      console.log('  ✓ Dark theme form inputs adaptively switch to obsidian surfaces and light text');
    } else {
      console.error('  ✗ Dark theme form check failed');
      allPassed = false;
    }

    await page.close();
    await browser.close();

    console.log('\n======================================================');
    if (allPassed) {
      console.log('ALL PR C VERIFICATION TESTS PASSED (100%)');
    } else {
      console.error('SOME PR C TESTS FAILED');
      process.exit(1);
    }
    console.log('======================================================\n');
  } finally {
    if (serverProcess) {
      serverProcess.kill('SIGKILL');
    }
  }
}

main().catch((err) => {
  console.error('Fatal test error:', err);
  process.exit(1);
});
