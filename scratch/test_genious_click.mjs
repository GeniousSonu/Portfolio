import { spawn } from 'child_process';
import fs from 'fs';

const ARTIFACTS_DIR = '/home/dayshift/.gemini/antigravity-ide/brain/2dd8f18a-1e71-4718-a1b7-0cbc4532fbb5';
const PORT = 9301;

const chrome = spawn('/usr/bin/google-chrome', [
  '--headless=new',
  `--remote-debugging-port=${PORT}`,
  '--user-data-dir=/tmp/chrome-test-genious-open-' + Date.now(),
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

  // Wait for page
  for (let i = 0; i < 20; i++) {
    const chk = await send('Runtime.evaluate', { expression: 'Boolean(document.querySelector("button[title*=\\"genious.exe\\"]"))' });
    if (chk.result?.value) break;
    await new Promise(r => setTimeout(r, 300));
  }

  // Dismiss cookies
  await send('Runtime.evaluate', {
    expression: `
      const b = document.querySelector('.cookie-btn-accept');
      if (b) b.click();
    `
  });
  await new Promise(r => setTimeout(r, 500));

  // Click genious.exe button
  console.log('Clicking genious.exe trigger...');
  const clickRes = await send('Runtime.evaluate', {
    expression: `
      const btn = document.querySelector('button[title*="genious.exe"]');
      if (btn) {
        btn.click();
        'CLICKED';
      } else 'NOT_FOUND';
    `
  });
  console.log('Click result:', clickRes.result?.value);
  await new Promise(r => setTimeout(r, 1200));

  let shot = await send('Page.captureScreenshot', { format: 'png' });
  fs.writeFileSync(`${ARTIFACTS_DIR}/genious_panel_active.png`, Buffer.from(shot.data, 'base64'));

  const content = await send('Runtime.evaluate', {
    expression: `
      const d = document.querySelector('div[role="dialog"]');
      d ? d.innerText : 'NO_DIALOG';
    `
  });
  console.log('Dialog innerText preview:\n', content.result?.value?.slice(0, 300));

  ws.close();
} catch (e) {
  console.error(e);
} finally {
  chrome.kill();
}
