import { chromium, webkit, firefox } from 'playwright';

const BASE_URL = 'http://localhost:3555';

const ROUTE_PAIRS = [
  ['/contact', '/plugin'],
  ['/plugin', '/contact'],
  ['/contact', '/projects'],
  ['/projects', '/contact'],
  ['/contact', '/about'],
  ['/about', '/contact'],
  ['/plugin', '/store'],
  ['/store', '/plugin'],
  ['/plugin', '/wiki'],
  ['/wiki', '/plugin'],
  ['/', '/contact'],
  ['/contact', '/'],
  ['/', '/plugin'],
  ['/plugin', '/'],
  ['/space', '/contact'],
  ['/contact', '/space'],
  ['/lounge', '/plugin'],
  ['/plugin', '/lounge'],
  ['/site-index', '/terms'],
  ['/terms', '/privacy'],
  ['/privacy', '/changelog'],
  ['/changelog', '/reset'],
  ['/reset', '/about'],
];

async function setupPageSampler(page) {
  await page.evaluate(() => {
    window.__frameHistory = [];
    let sampling = true;

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
      return visible.map((m) => m.getAttribute('data-route') || 'unmarked');
    }

    function checkBootPreloader() {
      const el = document.getElementById('boot-preloader');
      if (!el) return null;
      const cs = window.getComputedStyle(el);
      const isVis = cs.display !== 'none' && cs.visibility !== 'hidden' && cs.opacity !== '0';
      return isVis ? el.getAttribute('data-stage') || 'visible' : null;
    }

    function sample() {
      if (!sampling) return;
      const t = performance.now();
      const routes = getVisibleRoutes();
      const preloader = checkBootPreloader();
      const shell = document.querySelector('.page-transition-shell');
      const shellOpacity = shell ? window.getComputedStyle(shell).opacity : '1';

      window.__frameHistory.push({
        time: t,
        routes,
        preloader,
        shellOpacity,
        pathname: window.location.pathname,
      });

      requestAnimationFrame(sample);
    }

    requestAnimationFrame(sample);

    window.__clearSampler = () => {
      window.__frameHistory = [];
      sampling = true;
      requestAnimationFrame(sample);
    };

    window.__stopAndGetSampler = () => {
      sampling = false;
      return window.__frameHistory;
    };
  });
}

async function runNavigationsForBrowser(browserType, name, count, options = {}) {
  console.log(`\nStarting Suite: ${name} (${count} navigations)...`);
  const browser = await browserType.launch({ headless: true });
  const context = await browser.newContext(options.contextOptions || {});
  
  const page = await context.newPage();

  if (options.cdpThrottle && browserType === chromium) {
    const cdp = await context.newCDPSession(page);
    await cdp.send('Emulation.setCPUThrottlingRate', { rate: 4 });
  }

  let completedNavs = 0;
  let totalFrames = 0;
  let glitches = 0;
  const glitchDetails = [];

  // Initial load
  const initialRoute = ROUTE_PAIRS[0][0];
  await page.goto(`${BASE_URL}${initialRoute}`, { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(300);

  let currentRoute = initialRoute;

  for (let i = 0; i < count; i++) {
    const pair = ROUTE_PAIRS[i % ROUTE_PAIRS.length];
    const fromRoute = await page.evaluate(() => window.location.pathname);
    let toRoute = pair[1] === fromRoute ? pair[0] : pair[1];
    if (toRoute === fromRoute) {
      toRoute = fromRoute === '/contact' ? '/plugin' : '/contact';
    }

    await setupPageSampler(page);

    await page.evaluate((target) => {
      if (window.__portfolioNavigate) {
        window.__portfolioNavigate(target);
      } else {
        const link = document.querySelector(`a[href="${target}"]`);
        if (link) link.click();
      }
    }, toRoute);

    // Wait for route change to finish (overlay faded out or wait timeout)
    try {
      await page.waitForFunction(
        (target) => {
          const main = document.querySelector('main');
          const route = main ? main.getAttribute('data-route') : '';
          return window.location.pathname === target && (route === target || route !== '');
        },
        toRoute,
        { timeout: 3500 }
      );
    } catch {
      // Continue sampling to capture history
    }

    // Small stabilization window
    await page.waitForTimeout(options.waitMs || 60);

    const history = await page.evaluate(() => {
      return window.__stopAndGetSampler ? window.__stopAndGetSampler() : [];
    });

    currentRoute = await page.evaluate(() => window.location.pathname);

    totalFrames += history.length;
    completedNavs++;

    // Analyze frames: a glitch is a frame where:
    // 1. Visible route is neither fromRoute nor toRoute (e.g. wrong route flash / home page flash)
    // 2. OR route is completely blank (0 visible mains)
    // 3. OR boot preloader unexpectedly renders on client transition
    for (const frame of history) {
      const isWrongRoute = frame.routes.some((r) => r !== fromRoute && r !== toRoute);
      const isBlank = frame.routes.length === 0;
      const isPreloaderActive = frame.preloader !== null;

      if (isWrongRoute || isBlank || isPreloaderActive) {
        glitches++;
        if (glitchDetails.length < 10) {
          glitchDetails.push({
            nav: `${fromRoute} -> ${toRoute}`,
            time: Math.round(frame.time),
            routes: frame.routes,
            blank: isBlank,
            preloader: frame.preloader,
            pathname: frame.pathname,
          });
        }
      }
    }

    currentRoute = toRoute;

    if ((i + 1) % 25 === 0 || i === count - 1) {
      process.stdout.write(`  [${name}] ${i + 1}/${count} navigations done (Frames: ${totalFrames}, Glitches: ${glitches})\r`);
    }
  }

  console.log(`\nCompleted ${name}: ${completedNavs} navigations, ${totalFrames} frames sampled, ${glitches} glitches.`);
  if (glitches > 0) {
    console.error('Glitch samples:', JSON.stringify(glitchDetails.slice(0, 5), null, 2));
  }

  await browser.close();

  return {
    name,
    completedNavs,
    totalFrames,
    glitches,
    passed: glitches === 0,
  };
}

async function run500Suite() {
  console.log('====================================================');
  console.log('TRANSITION-FONTS-001: 500-NAVIGATION GLITCH AUDIT');
  console.log('====================================================');

  const results = [];

  // 1. Chromium Unthrottled: 150 navigations
  results.push(await runNavigationsForBrowser(chromium, 'Chromium Unthrottled', 150));

  // 2. Chromium Throttled (CPU 4x): 100 navigations
  results.push(await runNavigationsForBrowser(chromium, 'Chromium Throttled 4x', 100, { cdpThrottle: true, waitMs: 150 }));

  // 3. Chromium ServiceWorker active: 50 navigations
  results.push(await runNavigationsForBrowser(chromium, 'Chromium SW Active', 50));

  // 4. WebKit Unthrottled: 100 navigations
  results.push(await runNavigationsForBrowser(webkit, 'WebKit (Safari engine)', 100));

  // 5. Firefox Unthrottled: 100 navigations
  results.push(await runNavigationsForBrowser(firefox, 'Firefox (Gecko engine)', 100));

  console.log('\n====================================================');
  console.log('FINAL MATRIX (500 Navigations)');
  console.log('====================================================');
  console.table(results);

  const totalNavs = results.reduce((acc, r) => acc + r.completedNavs, 0);
  const totalFrames = results.reduce((acc, r) => acc + r.totalFrames, 0);
  const totalGlitches = results.reduce((acc, r) => acc + r.glitches, 0);

  console.log(`\nTotal Navigations: ${totalNavs}`);
  console.log(`Total Frames Sampled: ${totalFrames}`);
  console.log(`Total Glitch / Blank Frames: ${totalGlitches}`);

  if (totalGlitches === 0 && totalNavs >= 500) {
    console.log('\nSUCCESS: 0 wrong-route or blank frames across 500 navigations. ACCEPTANCE CRITERIA MET.');
    process.exit(0);
  } else {
    console.error(`\nFAILURE: Found ${totalGlitches} glitch frames or did not complete 500 navigations.`);
    process.exit(1);
  }
}

run500Suite().catch((err) => {
  console.error('Error running 500-navigation suite:', err);
  process.exit(1);
});
