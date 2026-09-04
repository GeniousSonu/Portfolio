import { spawn } from 'child_process';
import fs from 'fs';

const ARTIFACTS_DIR = '/home/dayshift/.gemini/antigravity-ide/brain/2dd8f18a-1e71-4718-a1b7-0cbc4532fbb5';
const PORT = 9315;

const chrome = spawn('/usr/bin/google-chrome', [
  '--headless=new',
  `--remote-debugging-port=${PORT}`,
  '--user-data-dir=/tmp/chrome-test-action-' + Date.now(),
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

  for (let i = 0; i < 20; i++) {
    const chk = await send('Runtime.evaluate', { expression: 'Boolean(document.querySelector("button[title*=\\"genious.exe\\"]"))' });
    if (chk.result?.value) break;
    await new Promise(r => setTimeout(r, 300));
  }

  // Dismiss cookies
  await send('Runtime.evaluate', { expression: 'const b = document.querySelector(".cookie-btn-accept"); if (b) b.click();' });
  await new Promise(r => setTimeout(r, 400));

  // Open chatbot
  await send('Runtime.evaluate', { expression: 'document.querySelector("button[title*=\\"genious.exe\\"]").click();' });
  await new Promise(r => setTimeout(r, 800));

  // Click suggestion chip: "Show me your featured projects"
  console.log('Clicking suggestion chip: Show me your featured projects...');
  const chipRes = await send('Runtime.evaluate', {
    expression: `
      const chips = Array.from(document.querySelectorAll('button'));
      const chip = chips.find(b => b.innerText.includes('featured projects'));
      if (chip) {
        chip.click();
        'CHIP_CLICKED';
      } else 'CHIP_NOT_FOUND';
    `
  });
  console.log('Chip result:', chipRes.result?.value);

  // Wait for model response
  console.log('Waiting for response from genious.exe...');
  for (let i = 0; i < 30; i++) {
    const checkBot = await send('Runtime.evaluate', {
      expression: `
        const bubbles = document.querySelectorAll('div[class*="bubble"]');
        const thinking = document.querySelector('span[class*="typingDot"]');
        bubbles.length >= 3 && !thinking;
      `
    });
    if (checkBot.result?.value) break;
    await new Promise(r => setTimeout(r, 1000));
  }

  await new Promise(r => setTimeout(r, 1000));

  let shot = await send('Page.captureScreenshot', { format: 'png' });
  fs.writeFileSync(`${ARTIFACTS_DIR}/genious_response_with_actions.png`, Buffer.from(shot.data, 'base64'));
  console.log('Captured genious_response_with_actions.png');

  // Check action buttons in DOM
  const actionButtonsEval = await send('Runtime.evaluate', {
    expression: `
      const actBtns = Array.from(document.querySelectorAll('button[class*="action"]'));
      actBtns.map(b => ({ text: b.innerText, class: b.className }));
    `,
    returnByValue: true
  });
  console.log('Action buttons found:', actionButtonsEval.result?.value);

  // If action button found, click it!
  if (actionButtonsEval.result?.value?.length > 0) {
    console.log('Clicking action button to navigate...');
    await send('Runtime.evaluate', {
      expression: `
        const btn = document.querySelector('button[class*="actionNavBtn"]') || document.querySelector('button[class*="action"]');
        if (btn) btn.click();
      `
    });
    await new Promise(r => setTimeout(r, 1200));

    // Measure scroll position
    const scrollEval = await send('Runtime.evaluate', {
      expression: `({ scrollY: window.scrollY, hash: window.location.hash })`,
      returnByValue: true
    });
    console.log('Scroll position after action click:', scrollEval.result?.value);

    shot = await send('Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync(`${ARTIFACTS_DIR}/genious_navigated_section.png`, Buffer.from(shot.data, 'base64'));
  }

  ws.close();
} catch (e) {
  console.error(e);
} finally {
  chrome.kill();
}
