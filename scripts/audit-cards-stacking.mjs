import { chromium } from 'playwright';

const BASE_URL = 'http://localhost:3555';

const VIEWPORTS = [
  { name: 'Desktop (1440x900)', width: 1440, height: 900 },
  { name: 'Laptop Short (1366x768)', width: 1366, height: 768 },
  { name: 'Mobile (390x844)', width: 390, height: 844 },
];

async function runStackingAudit() {
  const browser = await chromium.launch({ headless: true });
  let allPassed = true;

  for (const vp of VIEWPORTS) {
    console.log(`\n======================================================`);
    console.log(`AUDITING VIEWPORT: ${vp.name}`);
    console.log(`======================================================`);

    const context = await browser.newContext({
      viewport: { width: vp.width, height: vp.height },
      deviceScaleFactor: 2,
    });
    const page = await context.newPage();

    // Skip boot intro
    await page.goto(`${BASE_URL}/`, { waitUntil: 'domcontentloaded' });
    await page.evaluate(() => {
      try {
        localStorage.setItem('sks_boot_seen_v1', '1');
      } catch {}
    });
    await page.waitForTimeout(500);

    // Find all cards
    const cardData = await page.evaluate(() => {
      const cards = Array.from(document.querySelectorAll('.v3-stacked-card'));
      return cards.map((c, i) => {
        const titleEl = c.querySelector('.v3-showcase-title');
        const pillEl = c.querySelector('.v3-index-pill');
        const ctaEl = c.querySelector('.v3-frame-cta-btn');
        return {
          index: i,
          id: c.id,
          pill: pillEl ? pillEl.textContent.trim() : `P.${i + 1}`,
          title: titleEl ? titleEl.textContent.trim() : 'Unknown',
          hasCta: !!ctaEl,
        };
      });
    });

    console.log(`Found ${cardData.length} cards in DOM (P.01 - P.0${cardData.length}).`);
    if (cardData.length !== 7) {
      console.error(`ERROR: Expected 7 cards, found ${cardData.length}`);
      allPassed = false;
    }

    // Scroll through each card and verify full screen & stacking
    for (let i = 0; i < cardData.length; i++) {
      const cardInfo = cardData[i];

      // Scroll card into view so it pins at sticky top
      await page.evaluate((idx) => {
        const cards = document.querySelectorAll('.v3-stacked-card');
        const target = cards[idx];
        if (target) {
          target.scrollIntoView({ behavior: 'instant', block: 'start' });
          // Back up by 72px to account for sticky navbar offset
          window.scrollBy(0, -72);
        }
      }, i);

      await page.waitForTimeout(150);

      const metrics = await page.evaluate((idx) => {
        const cards = document.querySelectorAll('.v3-stacked-card');
        const card = cards[idx];
        if (!card) return null;

        const rect = card.getBoundingClientRect();
        const cs = window.getComputedStyle(card);
        const title = card.querySelector('.v3-showcase-title');
        const titleRect = title ? title.getBoundingClientRect() : null;
        const cta = card.querySelector('.v3-frame-cta-btn');
        const ctaRect = cta ? cta.getBoundingClientRect() : null;
        const vh = window.innerHeight;

        return {
          position: cs.position,
          zIndex: parseInt(cs.zIndex, 10) || 0,
          rectTop: Math.round(rect.top),
          rectHeight: Math.round(rect.height),
          viewportHeight: vh,
          isFullScreen: rect.height >= vh - 130,
          titleVisible: titleRect ? titleRect.top >= 0 && titleRect.bottom <= vh : false,
          ctaVisible: ctaRect ? ctaRect.top >= 0 && ctaRect.bottom <= vh : false,
        };
      }, i);

      const passed =
        metrics &&
        metrics.position === 'sticky' &&
        metrics.isFullScreen &&
        (vp.width < 500 || metrics.titleVisible);

      console.log(
        `  ${passed ? '✓' : '✗'} [${cardInfo.pill}] "${cardInfo.title.slice(0, 24)}...": ` +
        `pos=${metrics?.position}, zIndex=${metrics?.zIndex}, h=${metrics?.rectHeight}px (vh=${metrics?.viewportHeight}px), ` +
        `fullScreen=${metrics?.isFullScreen}, titleVis=${metrics?.titleVisible}, ctaVis=${metrics?.ctaVisible}`
      );

      if (!passed) {
        console.error(`    FAILED on card ${cardInfo.pill} in viewport ${vp.name}!`);
        allPassed = false;
      }
    }

    // Specially verify P.06 and P.07 stacking over each other
    console.log(`\n  Verifying P.06 and P.07 Stacking Behavior...`);
    const p6p7Stack = await page.evaluate(() => {
      const cards = document.querySelectorAll('.v3-stacked-card');
      const c6 = cards[5]; // P.06
      const c7 = cards[6]; // P.07
      if (!c6 || !c7) return null;

      // Scroll until P.07 is at sticky top
      c7.scrollIntoView({ behavior: 'instant', block: 'start' });
      window.scrollBy(0, -72);

      const cs6 = window.getComputedStyle(c6);
      const cs7 = window.getComputedStyle(c7);
      const r6 = c6.getBoundingClientRect();
      const r7 = c7.getBoundingClientRect();

      return {
        c6ZIndex: parseInt(cs6.zIndex, 10),
        c7ZIndex: parseInt(cs7.zIndex, 10),
        c7StacksOverC6: parseInt(cs7.zIndex, 10) > parseInt(cs6.zIndex, 10),
        c6Top: Math.round(r6.top),
        c7Top: Math.round(r7.top),
        c7Height: Math.round(r7.height),
        c7FullScreen: r7.height >= window.innerHeight - 130,
      };
    });

    console.log(
      `  ✓ P.06 z-index=${p6p7Stack?.c6ZIndex}, P.07 z-index=${p6p7Stack?.c7ZIndex} ` +
      `-> P.07 stacks over P.06: ${p6p7Stack?.c7StacksOverC6 ? 'YES' : 'NO'}, ` +
      `P.07 full-screen: ${p6p7Stack?.c7FullScreen ? 'YES' : 'NO'}`
    );

    if (!p6p7Stack?.c7StacksOverC6 || !p6p7Stack?.c7FullScreen) {
      console.error('  FAILED P.06 / P.07 stacking assertion!');
      allPassed = false;
    }

    // Verify runway keeps P.07 pinned during additional scrolling
    const runwayPinTest = await page.evaluate(() => {
      const cards = document.querySelectorAll('.v3-stacked-card');
      const c7 = cards[6];
      if (!c7) return false;

      // Scroll down an additional 250px
      window.scrollBy(0, 250);
      const r = c7.getBoundingClientRect();
      // Should remain stuck near top
      return r.top >= 50 && r.top <= 165;
    });

    console.log(`  ✓ P.07 runway persistence test (+250px scroll): ${runwayPinTest ? 'PINNED' : 'DRIFTED'}`);
    if (!runwayPinTest) {
      console.error('  FAILED: P.07 drifted away too early without runway!');
      allPassed = false;
    }

    await context.close();
  }

  await browser.close();

  if (allPassed) {
    console.log('\n======================================================');
    console.log('ALL CARDS FULL-SCREEN & STACKING TESTS PASSED (100%)');
    console.log('======================================================');
    process.exit(0);
  } else {
    console.error('\nFAILURES DETECTED IN STACKING AUDIT');
    process.exit(1);
  }
}

runStackingAudit().catch((err) => {
  console.error('Error during stacking audit:', err);
  process.exit(1);
});
