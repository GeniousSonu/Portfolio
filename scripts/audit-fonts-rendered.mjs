import { chromium } from 'playwright';

const ROUTES = [
  '/',
  '/about',
  '/contact',
  '/plugin',
  '/projects',
  '/space',
  '/wiki',
  '/uses',
  '/changelog',
  '/terms',
  '/privacy',
  '/store',
  '/lounge',
  '/play',
  '/site-index',
  '/reset',
];

const FORBIDDEN_FONTS = ['Geist', 'Brooklyn', 'Instrument Serif', 'IBM Plex Mono', 'Poppins'];
const CANONICAL_FONTS = ['Bricolage Grotesque', 'Space Mono', 'Shantell Sans'];

async function auditFonts() {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext();
  const page = await context.newPage();

  console.log(`Auditing rendered platform fonts across ${ROUTES.length} routes on http://localhost:3555...\n`);

  let totalViolations = 0;
  const routeReports = [];

  for (const route of ROUTES) {
    try {
      await page.goto(`http://localhost:3555${route}`, { waitUntil: 'domcontentloaded', timeout: 15000 });
      await page.waitForTimeout(300);

      const fontAudit = await page.evaluate((forbidden) => {
        const elements = Array.from(document.querySelectorAll('body, body *:not(script):not(style)'));
        const usedFonts = new Set();
        const forbiddenFound = [];

        for (const el of elements) {
          const cs = window.getComputedStyle(el);
          const font = cs.fontFamily;
          if (font) {
            usedFonts.add(font);
            for (const f of forbidden) {
              if (new RegExp(`\\b${f}\\b`, 'i').test(font)) {
                forbiddenFound.push({
                  tag: el.tagName.toLowerCase(),
                  id: el.id || undefined,
                  className: el.className || undefined,
                  font,
                });
              }
            }
          }
        }

        return {
          usedFonts: Array.from(usedFonts),
          forbiddenFound,
        };
      }, FORBIDDEN_FONTS);

      const hasForbidden = fontAudit.forbiddenFound.length > 0;
      if (hasForbidden) totalViolations += fontAudit.forbiddenFound.length;

      routeReports.push({
        route,
        status: hasForbidden ? 'FAIL' : 'PASS',
        forbiddenCount: fontAudit.forbiddenFound.length,
        usedSample: fontAudit.usedFonts.slice(0, 3).join(' | '),
      });
    } catch (err) {
      routeReports.push({
        route,
        status: 'ERROR',
        error: err.message,
      });
    }
  }

  await browser.close();

  console.table(routeReports);

  console.log('\n--- RENDERED FONT AUDIT SUMMARY ---');
  if (totalViolations > 0) {
    console.error(`FAILED: ${totalViolations} forbidden font instances rendered in DOM.`);
    process.exit(1);
  } else {
    console.log('PASSED: 0 forbidden fonts rendered. Sitewide 3-font system strictly verified in live DOM.');
    process.exit(0);
  }
}

auditFonts().catch((err) => {
  console.error('Audit failed with error:', err);
  process.exit(1);
});
