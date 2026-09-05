#!/usr/bin/env node

/**
 * Local Development Telegram Poller Bridge
 *
 * Why this is needed:
 * Telegram Webhooks can only deliver to public HTTPS URLs (e.g. your production Vercel domain).
 * When running locally on localhost:3000, Telegram cannot reach your private IP.
 *
 * This script polls Telegram for replies and forwards them to your local webhook:
 *   http://localhost:3000/api/live-chat/webhook
 *
 * Usage:
 *   node scripts/dev-telegram-poller.mjs
 */

import fs from 'fs';
import path from 'path';

// Parse .env.local
const envPath = path.resolve(process.cwd(), '.env.local');
const env = {};

if (fs.existsSync(envPath)) {
  fs.readFileSync(envPath, 'utf8').split('\n').forEach((line) => {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) return;
    const idx = trimmed.indexOf('=');
    if (idx !== -1) {
      env[trimmed.slice(0, idx).trim()] = trimmed.slice(idx + 1).trim();
    }
  });
}

const botToken = env.TELEGRAM_BOT_TOKEN || process.env.TELEGRAM_BOT_TOKEN;
const webhookSecret = env.TELEGRAM_WEBHOOK_SECRET || process.env.TELEGRAM_WEBHOOK_SECRET;
const port = process.env.PORT || 3000;
const localWebhookUrl = `http://localhost:${port}/api/live-chat/webhook`;

if (!botToken) {
  console.error('❌ Error: TELEGRAM_BOT_TOKEN not found in .env.local');
  process.exit(1);
}

console.log('🔗 [Dev Telegram Bridge] Starting local poller...');
console.log(`📡 Polling Telegram Bot: https://api.telegram.org/bot${botToken.slice(0, 10)}...`);
console.log(`🎯 Forwarding to local webhook: ${localWebhookUrl}`);
console.log('⚡ Ready! Any reply you send in Telegram will now appear live on localhost:3000!\n');

let lastUpdateId = 0;
let isRunning = true;

process.on('SIGINT', () => {
  console.log('\n🛑 Stopping Telegram dev poller...');
  isRunning = false;
  process.exit(0);
});

async function poll() {
  while (isRunning) {
    try {
      const url = `https://api.telegram.org/bot${botToken}/getUpdates?offset=${lastUpdateId + 1}&timeout=20`;
      const res = await fetch(url);
      const data = await res.json();

      if (data.ok && Array.isArray(data.result)) {
        for (const update of data.result) {
          lastUpdateId = Math.max(lastUpdateId, update.update_id);

          const msg = update.message || update.edited_message;
          if (!msg) continue;

          const replyToId = msg.reply_to_message?.message_id;
          const text = msg.text;

          console.log(`📩 Telegram Update received [id: ${update.update_id}] | Text: "${text || ''}" | Reply-To: #${replyToId || 'None'}`);

          // Forward to local webhook
          try {
            const hookRes = await fetch(localWebhookUrl, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'x-telegram-bot-api-secret-token': webhookSecret || '',
              },
              body: JSON.stringify(update),
            });

            const hookData = await hookRes.json().catch(() => ({}));
            if (hookRes.ok) {
              console.log(`   ✅ Forwarded to ${localWebhookUrl} -> HTTP ${hookRes.status} (Delivered live via Realtime)`);
            } else {
              console.warn(`   ⚠️ Webhook returned HTTP ${hookRes.status}:`, hookData);
            }
          } catch (fetchErr) {
            console.error(`   ❌ Failed to reach ${localWebhookUrl}. Is 'npm run dev' running on port ${port}?`, fetchErr.message);
          }
        }
      }
    } catch (err) {
      if (isRunning) {
        console.error('Polling error:', err.message);
        await new Promise((r) => setTimeout(r, 3000));
      }
    }
  }
}

poll();
