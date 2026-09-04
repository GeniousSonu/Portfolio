import { spawn } from 'child_process';
import fs from 'fs';

const ARTIFACTS_DIR = '/home/dayshift/.gemini/antigravity-ide/brain/2dd8f18a-1e71-4718-a1b7-0cbc4532fbb5';
const PORT = 9288;

console.log('Spawning headless Chrome on port', PORT);
const chrome = spawn('/usr/bin/google-chrome', [
  '--headless=new',
  `--remote-debugging-port=${PORT}`,
  '--user-data-dir=/tmp/chrome-test-genious-' + Date.now(),
  '--no-sandbox',
  '--disable-gpu',
  '--window-size=1440,900',
  'http://localhost:3000'
]);

await new Promise(r => setTimeout(r, 2500));

try {
  const res = await fetch(`http://localhost:${PORT}/json`);
  const targets = await res.json();
  const page = targets.find(t => t.type === 'page');
  const ws = new WebSocket(page.webSocketDebuggerUrl);
  await new Promise(r => ws.onopen = r);

  let id = 1;
  const send = (m, p = {}) => new Promise((resolve, reject) => {
    const curId = id++;
    const handler = (e) => {
      const d = JSON.parse(e.data);
      if (d.id === curId) {
        ws.removeEventListener('message', handler);
        if (d.error) reject(d.error); else resolve(d.result);
      }
    };
    ws.addEventListener('message', handler);
    ws.send(JSON.stringify({ id: curId, method: m, params: p }));
  });

  await send('Page.enable');
  await send('Runtime.enable');

  // Wait for loader to finish
  for (let i = 0; i < 20; i++) {
    const chk = await send('Runtime.evaluate', { expression: 'Boolean(document.getElementById("hero"))' });
    if (chk.result?.value) break;
    await new Promise(r => setTimeout(r, 300));
  }
  await new Promise(r => setTimeout(r, 1200));

  // Accept cookies if present
  await send('Runtime.evaluate', {
    expression: `
      const acceptBtn = document.querySelector('.cookie-btn-accept');
      if (acceptBtn) acceptBtn.click();
    `
  });
  await new Promise(r => setTimeout(r, 600));

  // 1. Check trigger button text
  const triggerTextEval = await send('Runtime.evaluate', {
    expression: `
      const trigger = document.querySelector('button[aria-label*="genious.exe"]');
      trigger ? trigger.innerText : 'NOT_FOUND';
    `
  });
  console.log('Trigger button text:', triggerTextEval.result?.value);

  let shot = await send('Page.captureScreenshot', { format: 'png' });
  fs.writeFileSync(`${ARTIFACTS_DIR}/genious_trigger_view.png`, Buffer.from(shot.data, 'base64'));

  // 2. Click trigger to open panel
  console.log('Opening genious.exe panel...');
  await send('Runtime.evaluate', {
    expression: `
      const trigger = document.querySelector('button[aria-label*="genious.exe"]');
      if (trigger) trigger.click();
    `
  });
  await new Promise(r => setTimeout(r, 800));

  // Check header text and greeting
  const headerEval = await send('Runtime.evaluate', {
    expression: `
      const h3 = document.querySelector('div[role="dialog"] h3');
      const status = document.querySelector('div[role="dialog"] span');
      const firstMsg = document.querySelector('div[role="log"]');
      ({
        title: h3 ? h3.innerText : '',
        status: status ? status.innerText : '',
        hasGreeting: firstMsg ? firstMsg.innerText.includes("genious.exe") : false
      })
    `,
    returnByValue: true
  });
  console.log('Header evaluation:', headerEval.result?.value);

  shot = await send('Page.captureScreenshot', { format: 'png' });
  fs.writeFileSync(`${ARTIFACTS_DIR}/genious_panel_open.png`, Buffer.from(shot.data, 'base64'));

  console.log('Verification completed successfully.');
  ws.close();
} catch (e) {
  console.error('CDP error:', e);
} finally {
  chrome.kill();
}
