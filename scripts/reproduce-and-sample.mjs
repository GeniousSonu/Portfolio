import { chromium } from 'playwright';

async function run() {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext();
  const page = await context.newPage();

  console.log('1. Loading /contact on production server...');
  await page.goto('http://localhost:3555/contact', { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(500);

  console.log('2. Installing RAF + MutationObserver frame-by-frame route sampler...');
  await page.evaluate(() => {
    window.__frameHistory = [];
    let active = true;

    function getVisibleRoutes() {
      const mains = Array.from(document.querySelectorAll('main'));
      const visible = mains.filter((m) => {
        const rect = m.getBoundingClientRect();
        const cs = window.getComputedStyle(m);
        let cur = m;
        let isVis = rect.height > 0 && cs.display !== 'none' && cs.visibility !== 'hidden' && cs.opacity !== '0';
        while (cur && isVis) {
          const pStyle = window.getComputedStyle(cur);
          if (pStyle.display === 'none' || pStyle.visibility === 'hidden' || pStyle.opacity === '0') {
            isVis = false;
          }
          cur = cur.parentElement;
        }
        return isVis;
      });
      return visible.map((m) => m.getAttribute('data-route') || 'unknown');
    }

    function checkBootPreloader() {
      const el = document.getElementById('boot-preloader');
      if (!el) return null;
      const cs = window.getComputedStyle(el);
      const isVis = cs.display !== 'none' && cs.visibility !== 'hidden' && cs.opacity !== '0';
      return isVis ? el.getAttribute('data-stage') || 'visible' : null;
    }

    function sample() {
      if (!active) return;
      const t = performance.now();
      const routes = getVisibleRoutes();
      const preloader = checkBootPreloader();
      const shell = document.querySelector('.page-transition-shell');
      const shellOpacity = shell ? window.getComputedStyle(shell).opacity : 'none';

      window.__frameHistory.push({
        time: t,
        routes,
        preloader,
        shellOpacity,
        shellClass: shell?.className || '',
        pathname: window.location.pathname,
      });

      requestAnimationFrame(sample);
    }

    requestAnimationFrame(sample);
    window.__stopSampler = () => {
      active = false;
    };
  });

  console.log('3. Triggering navigation to /plugin...');
  // Click on plugin link
  const link = page.locator('a[href="/plugin"]').first();
  await link.click();

  // Record for 1000ms
  await page.waitForTimeout(1000);

  const history = await page.evaluate(() => {
    window.__stopSampler();
    return window.__frameHistory;
  });

  console.log(`4. Analyzed ${history.length} frames during navigation.`);

  const states = [];
  let lastKey = '';
  let glitches = 0;

  for (const f of history) {
    const routeStr = f.routes.length ? f.routes.join('+') : 'BLANK';
    const key = `[Route: ${routeStr}] [Path: ${f.pathname}] [ShellOpacity: ${f.shellOpacity}] [Preloader: ${f.preloader || 'hidden'}]`;
    if (key !== lastKey) {
      states.push({ time: Math.round(f.time), state: key });
      lastKey = key;
    }

    // A glitch is any frame whose route is neither origin (/contact) nor destination (/plugin), or BLANK
    const isGlitch = f.routes.some((r) => r !== '/contact' && r !== '/plugin') || f.routes.length === 0;
    if (isGlitch) {
      glitches++;
    }
  }

  console.log('\n--- FRAME BY FRAME STATE PROGRESSION ---');
  states.forEach((s) => console.log(`+${s.time}ms: ${s.state}`));
  console.log(`\nTotal Frames: ${history.length}, Glitch/Blank Frames: ${glitches}`);

  await browser.close();
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
