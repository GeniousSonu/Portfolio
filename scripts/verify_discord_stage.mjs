import { spawn } from 'child_process';
import fs from 'fs';
import { db, auth } from '../src/lib/firebase/client.js';
import { signInAnonymously } from 'firebase/auth';
import { doc, setDoc, serverTimestamp, Timestamp, deleteDoc } from 'firebase/firestore';

function generateRoomCode() {
  const chars = 'abcdefghjkmnpqrstuvwxyz23456789';
  let code = '';
  for (let i = 0; i < 8; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
}

async function verifyDiscordStage() {
  console.log('=== STARTING DISCORD STAGE & VOICE VERIFICATION ===');
  const userCred = await signInAnonymously(auth);
  const roomId = generateRoomCode();
  const roomRef = doc(db, 'rooms', roomId);

  await setDoc(roomRef, {
    roomId,
    hostUid: userCred.user.uid,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
    participantCount: 0,
    playbackState: {
      videoId: '',
      isPlaying: false,
      positionSeconds: 0,
      updatedAt: serverTimestamp(),
    },
    expiresAt: Timestamp.fromMillis(Date.now() + 48 * 60 * 60 * 1000),
  });

  const roomUrl = `http://localhost:3000/lounge/${roomId}`;
  console.log(`Room created: ${roomUrl}`);

  const tempDir = '/tmp/chrome-verify-' + Date.now();
  fs.mkdirSync(tempDir, { recursive: true });
  const port = 9530;

  const chrome = spawn('/usr/bin/google-chrome', [
    '--headless=new',
    `--remote-debugging-port=${port}`,
    `--user-data-dir=${tempDir}`,
    '--no-sandbox',
    '--disable-gpu',
    '--use-fake-ui-for-media-stream',
    '--use-fake-device-for-media-stream',
    'about:blank',
  ]);

  try {
    await new Promise((r) => setTimeout(r, 2000));
    const res = await fetch(`http://localhost:${port}/json`);
    const targets = await res.json();
    const page = targets.find((t) => t.type === 'page');
    const ws = new WebSocket(page.webSocketDebuggerUrl);
    await new Promise((r) => (ws.onopen = r));

    let msgId = 1;
    const send = (method, params = {}) =>
      new Promise((resolve, reject) => {
        const id = msgId++;
        const handler = (e) => {
          const d = JSON.parse(e.data);
          if (d.id === id) {
            ws.removeEventListener('message', handler);
            if (d.error) reject(d.error);
            else resolve(d.result);
          }
        };
        ws.addEventListener('message', handler);
        ws.send(JSON.stringify({ id, method, params }));
      });

    await send('Page.enable');
    await send('Runtime.enable');

    // Bypass boot preloader
    await send('Page.addScriptToEvaluateOnNewDocument', {
      source: `
        try {
          sessionStorage.setItem('hasLoadedBefore', 'true');
        } catch {}
      `,
    });

    const viewports = [
      { name: 'iPhone_SE_375', width: 375, height: 667 },
      { name: 'iPhone_14_390', width: 390, height: 844 },
      { name: 'iPhone_ProMax_428', width: 428, height: 926 },
    ];

    for (const vp of viewports) {
      console.log(`\nTesting viewport: ${vp.name} (${vp.width}x${vp.height})`);
      await send('Emulation.setDeviceMetricsOverride', {
        width: vp.width,
        height: vp.height,
        deviceScaleFactor: 2,
        mobile: true,
      });

      await send('Page.navigate', { url: roomUrl });
      
      // Wait until centralStageDisplay is mounted
      let ready = false;
      for (let i = 0; i < 25; i++) {
        const chk = await send('Runtime.evaluate', {
          returnByValue: true,
          expression: `Boolean(document.querySelector('div[class*="centralStageDisplay"]'))`,
        });
        if (chk.value) {
          ready = true;
          break;
        }
        await new Promise((r) => setTimeout(r, 300));
      }
      console.log(`Stage mounted: ${ready}`);

      // Dismiss cookie banner if present
      await send('Runtime.evaluate', {
        expression: `(() => {
          const btn = document.querySelector('button[aria-label="Accept essential cookies only"], button:has-text("Decline"), button:has-text("Accept")');
          if (btn) btn.click();
        })()`,
      });
      await new Promise((r) => setTimeout(r, 400));

      // Inspect stage dimensions and buttons
      const evalRes = await send('Runtime.evaluate', {
        returnByValue: true,
        expression: `(() => {
          const stage = document.querySelector('div[class*="centralStageDisplay"]');
          const beacon = document.querySelector('div[class*="stageRadarBeacon"]');
          const heading = document.querySelector('h3[class*="stageHeading"]');
          const desc = document.querySelector('p[class*="stageDescription"]');
          const dock = document.querySelector('nav[class*="floatingDock"]');
          const buttons = Array.from(dock ? dock.querySelectorAll('button') : []);

          const stageRect = stage ? stage.getBoundingClientRect() : null;
          const dockRect = dock ? dock.getBoundingClientRect() : null;

          const btnInfo = buttons.map(b => {
            const r = b.getBoundingClientRect();
            return {
              text: b.innerText.trim() || b.getAttribute('aria-label') || 'Icon',
              className: b.className,
              width: Math.round(r.width),
              height: Math.round(r.height),
              meetsTapTarget: r.width >= 44 && r.height >= 44
            };
          });

          return {
            stageHeight: stageRect ? Math.round(stageRect.height) : 0,
            stageWidth: stageRect ? Math.round(stageRect.width) : 0,
            hasRadarBeacon: !!beacon,
            headingText: heading ? heading.innerText : '',
            descText: desc ? desc.innerText.slice(0, 40) + '...' : '',
            dockWidth: dockRect ? Math.round(dockRect.width) : 0,
            buttonsCount: buttons.length,
            buttons: btnInfo
          };
        })()`,
      });

      console.log('Stage & Dock inspection:', JSON.stringify(evalRes.value, null, 2));

      // Capture screenshot
      const shot = await send('Page.captureScreenshot', { format: 'png' });
      const shotPath = `/home/dayshift/.gemini/antigravity-ide/brain/2dd8f18a-1e71-4718-a1b7-0cbc4532fbb5/discord_stage_${vp.name}.png`;
      fs.writeFileSync(shotPath, Buffer.from(shot.data, 'base64'));
      console.log(`Saved screenshot to: ${shotPath}`);
    }

    // Now test Join Voice on iPhone 14 (390x844) to verify Discord voice controls
    console.log('\n--- Testing Join Voice on 390x844 to verify Discord buttons ---');
    await send('Emulation.setDeviceMetricsOverride', {
      width: 390,
      height: 844,
      deviceScaleFactor: 2,
      mobile: true,
    });

    const joinVoiceRes = await send('Runtime.evaluate', {
      returnByValue: true,
      expression: `(() => {
        const joinBtn = Array.from(document.querySelectorAll('button')).find(b => b.innerText.includes('Join Voice') || b.getAttribute('aria-label') === 'Join Voice');
        if (joinBtn) {
          joinBtn.click();
          return { clicked: true };
        }
        return { clicked: false };
      })()`,
    });
    console.log('Join Voice click result:', joinVoiceRes.value);
    await new Promise((r) => setTimeout(r, 1800));

    // Verify Voice active state: Discord Voice status, Mute, Deafen, Disconnect buttons
    const voiceControlsRes = await send('Runtime.evaluate', {
      returnByValue: true,
      expression: `(() => {
        const dock = document.querySelector('nav[class*="floatingDock"]');
        const voiceStatus = document.querySelector('div[class*="discordVoiceStatus"]');
        const waveBars = document.querySelectorAll('span[class*="waveBar"]');
        const disconnectBtn = document.querySelector('button[class*="discordBtnDisconnect"]');
        const muteBtn = Array.from(document.querySelectorAll('button')).find(b => b.innerText.includes('Mute') || b.getAttribute('aria-label')?.includes('Mute'));
        const deafenBtn = Array.from(document.querySelectorAll('button')).find(b => b.innerText.includes('Deafen') || b.getAttribute('aria-label')?.includes('Deafen'));
        const screenShareBtn = Array.from(document.querySelectorAll('button')).find(b => b.innerText.includes('Share Screen') || b.getAttribute('aria-label')?.includes('Share screen'));

        return {
          hasVoiceStatus: !!voiceStatus,
          waveBarCount: waveBars.length,
          hasDisconnectBtn: !!disconnectBtn,
          hasMuteBtn: !!muteBtn,
          hasDeafenBtn: !!deafenBtn,
          hasScreenShareBtn: !!screenShareBtn,
          buttons: Array.from(dock ? dock.querySelectorAll('button') : []).map(b => {
            const r = b.getBoundingClientRect();
            return {
              text: b.innerText.trim() || b.getAttribute('aria-label'),
              className: b.className,
              width: Math.round(r.width),
              height: Math.round(r.height),
              meetsTapTarget: r.width >= 44 && r.height >= 44
            };
          })
        };
      })()`,
    });
    console.log('Discord Voice Controls:', JSON.stringify(voiceControlsRes.value, null, 2));

    const shotVoice = await send('Page.captureScreenshot', { format: 'png' });
    const shotVoicePath = `/home/dayshift/.gemini/antigravity-ide/brain/2dd8f18a-1e71-4718-a1b7-0cbc4532fbb5/discord_stage_in_voice_390.png`;
    fs.writeFileSync(shotVoicePath, Buffer.from(shotVoice.data, 'base64'));
    console.log(`Saved screenshot in voice to: ${shotVoicePath}`);

    // Now toggle mute and verify Discord Red Muted state
    console.log('\n--- Testing Toggle Mute ---');
    await send('Runtime.evaluate', {
      expression: `(() => {
        const muteBtn = Array.from(document.querySelectorAll('button')).find(b => b.innerText.includes('Mute') || b.getAttribute('aria-label')?.includes('Mute'));
        if (muteBtn) muteBtn.click();
      })()`,
    });
    await new Promise((r) => setTimeout(r, 600));

    const mutedStateRes = await send('Runtime.evaluate', {
      returnByValue: true,
      expression: `(() => {
        const mutedBtn = document.querySelector('button[class*="discordBtnMuted"]');
        return {
          isMutedButtonRed: !!mutedBtn,
          mutedBtnText: mutedBtn ? mutedBtn.innerText.trim() : null
        };
      })()`,
    });
    console.log('Muted State verification:', JSON.stringify(mutedStateRes.value, null, 2));

    const shotMuted = await send('Page.captureScreenshot', { format: 'png' });
    const shotMutedPath = `/home/dayshift/.gemini/antigravity-ide/brain/2dd8f18a-1e71-4718-a1b7-0cbc4532fbb5/discord_stage_muted_390.png`;
    fs.writeFileSync(shotMutedPath, Buffer.from(shotMuted.data, 'base64'));
    console.log(`Saved screenshot muted to: ${shotMutedPath}`);

    ws.close();
  } finally {
    chrome.kill('SIGKILL');
    await new Promise((r) => setTimeout(r, 500));
    try {
      fs.rmSync(tempDir, { recursive: true, force: true });
    } catch {}
    // Clean up room doc
    await deleteDoc(roomRef).catch(() => {});
    console.log('=== VERIFICATION COMPLETED CLEANLY ===');
  }
}

verifyDiscordStage().catch((err) => {
  console.error('Verification failed:', err);
  process.exit(1);
});
