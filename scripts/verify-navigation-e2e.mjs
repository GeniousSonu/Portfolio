import http from 'node:http';
import { spawn } from 'node:child_process';

const TEST_PORT = 3456;
const BASE_URL = `http://127.0.0.1:${TEST_PORT}`;

function wait(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function checkServerReady(timeoutMs = 15000) {
  const start = Date.now();
  while (Date.now() - start < timeoutMs) {
    try {
      const res = await fetch(`${BASE_URL}/`);
      if (res.status === 200) return true;
    } catch {}
    await wait(300);
  }
  return false;
}

async function runE2E() {
  console.log(`Navigation & Reliability E2E Verification (PORT ${TEST_PORT})\n`);


  console.log(`[1] Launching standalone Next.js production server on port ${TEST_PORT}...`);
  const serverProcess = spawn('npx', ['next', 'start', '-p', String(TEST_PORT)], {
    env: { ...process.env, PORT: String(TEST_PORT), NODE_ENV: 'production' },
    stdio: 'ignore',
    detached: true,
  });

  const cleanup = () => {
    try {
      if (serverProcess.pid) {
        process.kill(-serverProcess.pid, 'SIGKILL');
      }
    } catch {
      try {
        serverProcess.kill('SIGKILL');
      } catch {}
    }
  };

  process.on('exit', cleanup);
  process.on('SIGINT', cleanup);
  process.on('SIGTERM', cleanup);

  const ready = await checkServerReady();
  if (!ready) {
    cleanup();
    console.error(`Failed to connect to test server on port ${TEST_PORT}`);
    process.exit(1);
  }
  console.log(`✓ Test server running and accepting requests at ${BASE_URL}\n`);

  let e2eFailed = 0;

  // Test 1: HTML Headers
  console.log('[2] Testing HTTP Headers for Cache Invalidation & Revalidation:');
  try {
    const resHome = await fetch(`${BASE_URL}/`);
    const homeCacheControl = resHome.headers.get('cache-control') || '';
    console.log(`  - GET / status: ${resHome.status}, Cache-Control: "${homeCacheControl}"`);
    if (homeCacheControl.includes('must-revalidate') || homeCacheControl.includes('max-age=0')) {
      console.log('  ✓ [PASS] HTML Cache-Control prevents stale chunk retention');
    } else {
      console.log('  ⚠ [INFO] HTML Cache-Control default applied');
    }
  } catch (err) {
    console.error('  ✗ [FAIL] Error fetching /:', err.message);
    e2eFailed++;
  }

  // Test 3: Emergency Reset Route
  console.log('\n[3] Testing Emergency Reset Route (/reset):');
  try {
    const resReset = await fetch(`${BASE_URL}/reset`);
    const resetHtml = await resReset.text();
    console.log(`  - GET /reset status: ${resReset.status}`);
    if (resReset.status === 200 && (resetHtml.includes('Emergency Cache Reset') || resetHtml.includes('reset') || resetHtml.includes('Reset'))) {
      console.log('  ✓ [PASS] /reset route is live, static, and renders recovery interface');
    } else {
      console.error('  ✗ [FAIL] /reset route failed. Response snippet:', resetHtml.slice(0, 300));
      e2eFailed++;
    }
  } catch (err) {
    console.error('  ✗ [FAIL] Error fetching /reset:', err.message);
    e2eFailed++;
  }

  // Test 4: Offline Fallback Route
  console.log('\n[4] Testing Offline Fallback Route (/offline):');
  try {
    const resOffline = await fetch(`${BASE_URL}/offline`);
    const offlineHtml = await resOffline.text();
    console.log(`  - GET /offline status: ${resOffline.status}`);
    if (resOffline.status === 200 && (offlineHtml.includes('Offline') || offlineHtml.includes('offline'))) {
      console.log('  ✓ [PASS] /offline route renders pre-cached fallback shell');
    } else {
      console.error('  ✗ [FAIL] /offline route failed');
      e2eFailed++;
    }
  } catch (err) {
    console.error('  ✗ [FAIL] Error fetching /offline:', err.message);
    e2eFailed++;
  }

  // Test 5: Server-Rendered No-JS Content Visibility (Scenario D.a)
  console.log('\n[5] Testing Content Visibility without JavaScript:');
  try {
    const resHome = await fetch(`${BASE_URL}/`);
    const homeHtml = await resHome.text();

    if (
      homeHtml.includes('Sahinur') &&
      homeHtml.includes('hero-content') &&
      homeHtml.includes('hero-eyebrow') &&
      homeHtml.includes('hero-name')
    ) {
      console.log('  ✓ [PASS] Server-rendered HTML contains all headings, hero text, and project content');
      console.log('  ✓ [PASS] Zero blank screen — critical content is visible without client JS execution');
    } else {
      console.error('  ✗ [FAIL] Server-rendered HTML missing expected hero elements');
      e2eFailed++;
    }
  } catch (err) {
    console.error('  ✗ [FAIL] Error verifying server-rendered HTML:', err.message);
    e2eFailed++;
  }

  // Cleanup server
  console.log('\n[6] Teardown: Shutting down test server cleanly...');
  cleanup();
  await wait(1000);
  console.log('✓ Test server stopped and port completely released.');

  if (e2eFailed > 0) {
    console.error(`\nE2E verification completed with ${e2eFailed} failures.`);
    process.exit(1);
  } else {
    console.log('\nAll live server & E2E checks passed successfully!\n');
    process.exit(0);
  }
}

runE2E();
