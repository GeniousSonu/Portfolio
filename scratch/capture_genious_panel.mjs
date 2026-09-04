import { spawn } from 'child_process';
import fs from 'fs';

const ARTIFACTS_DIR = '/home/dayshift/.gemini/antigravity-ide/brain/2dd8f18a-1e71-4718-a1b7-0cbc4532fbb5';
const PORT = 9299;

console.log('Spawning headless Chrome on port', PORT);
const chrome = spawn('/usr/bin/google-chrome', [
  '--headless=new',
  `--remote-debugging-port=${PORT}`,
  '--user-data-dir=/tmp/chrome-test-genious-click-' + Date.now(),
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
    const chk = await send('Runtime.evaluate', { expression: 'Boolean(document.getElementById("hero"))' });
    if (chk.result?.value) break;
    await new Promise(r => setTimeout(r, 300));
  }
  await new Promise(r => setTimeout(r, 1200));

  // Dismiss cookie banner
  await send('Runtime.evaluate', {
    expression: `
      const btn = document.querySelector('.cookie-btn-accept');
      if (btn) btn.click();
    `
  });
  await new Promise(r => setTimeout(r, 500));

  // Find bounding rect of trigger button
  const rectEval = await send('Runtime.evaluate', {
    expression: `
      const btn = document.querySelector('button[aria-label*="genious.exe"]');
      if (btn) {
        const r = btn.getBoundingClientRect();
        ({ x: r.x + r.width / 2, y: r.y + r.height / 2 });
      } else null;
    `,
    returnByValue: true
  });

  const coords = rectEval.result?.value;
  console.log('Button coordinates:', coords);

  if (coords) {
    await send('Input.dispatchMouseEvent', { type: 'mousePressed', x: coords.x, y: coords.y, button: 'left', clickCount: 1 });
    await send('Input.dispatchMouseEvent', { type: 'mouseReleased', x: coords.x, y: coords.y, button: 'left', clickCount: 1 });
  }

  await new Promise(r => setTimeout(r, 1200));

  let shot = await send('Page.captureScreenshot', { format: 'png' });
  fs.writeFileSync(`${ARTIFACTS_DIR}/genious_panel_opened.png`, Buffer.from(shot.data, 'base64'));
  console.log('Captured genious_panel_opened.png');

  // Verify dialog is present
  const dialogEval = await send('Runtime.evaluate', {
    expression: `
      const dialog = document.querySelector('div[role="dialog"]');
      if (!dialog) ({ found: false });
      else {
        const title = dialog.querySelector('h3')?.innerText;
        const status = dialog.querySelector('span')?.innerText;
        const msg = dialog.innerText;
        ({ found: true, title, status, hasGemini: msg.toLowerCase().includes('gemini') });
      }
    `,
    returnByValue: true
  });
  console.log('Dialog check:', dialogEval.result?.value);

  ws.close();
} catch (e) {
  console.error(e);
} finally {
  chrome.kill();
}
