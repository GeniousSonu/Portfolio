#!/usr/bin/env node

/**
 * Telegram Webhook Setup Utility
 *
 * Usage:
 *   node scripts/setup-telegram-webhook.mjs <DOMAIN_OR_URL>
 *   node scripts/setup-telegram-webhook.mjs --info
 *   node scripts/setup-telegram-webhook.mjs --delete
 *
 * Examples:
 *   node scripts/setup-telegram-webhook.mjs https://sahinurislam.com
 *   node scripts/setup-telegram-webhook.mjs https://portfolio-xxx.vercel.app
 */

import fs from 'fs';
import path from 'path';

// Parse .env.local
const envPath = path.resolve(process.cwd(), '.env.local');
let env = {};

if (fs.existsSync(envPath)) {
  const content = fs.readFileSync(envPath, 'utf8');
  content.split('\n').forEach((line) => {
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

if (!botToken) {
  console.error('❌ Error: TELEGRAM_BOT_TOKEN is not defined in .env.local or environment.');
  process.exit(1);
}

const arg = process.argv[2];

async function main() {
  if (arg === '--info' || !arg) {
    console.log('📡 Fetching current Telegram Webhook info...');
    const res = await fetch(`https://api.telegram.org/bot${botToken}/getWebhookInfo`);
    const data = await res.json();
    console.log(JSON.stringify(data, null, 2));

    if (!arg) {
      console.log('\n💡 To register a webhook, run:');
      console.log('   node scripts/setup-telegram-webhook.mjs https://your-domain.com');
    }
    return;
  }

  if (arg === '--delete') {
    console.log('🗑️ Deleting current Telegram Webhook...');
    const res = await fetch(`https://api.telegram.org/bot${botToken}/deleteWebhook`);
    const data = await res.json();
    console.log(JSON.stringify(data, null, 2));
    return;
  }

  // Sanitize URL
  let targetUrl = arg.trim();
  if (!targetUrl.startsWith('http://') && !targetUrl.startsWith('https://')) {
    targetUrl = `https://${targetUrl}`;
  }
  // Ensure it points to the webhook route
  if (!targetUrl.endsWith('/api/live-chat/webhook')) {
    targetUrl = targetUrl.replace(/\/+$/, '') + '/api/live-chat/webhook';
  }

  console.log(`🚀 Registering Telegram Webhook:`);
  console.log(`   URL:          ${targetUrl}`);
  console.log(`   Secret Token: ${webhookSecret ? 'Configured (secure)' : 'None (warning: not recommended)'}`);

  const setWebhookPayload = {
    url: targetUrl,
    allowed_updates: ['message', 'edited_message'],
  };

  if (webhookSecret) {
    setWebhookPayload.secret_token = webhookSecret;
  }

  const res = await fetch(`https://api.telegram.org/bot${botToken}/setWebhook`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(setWebhookPayload),
  });

  const data = await res.json();

  if (data.ok) {
    console.log('\n✅ Telegram Webhook registered successfully!');
    console.log(JSON.stringify(data, null, 2));
  } else {
    console.error('\n❌ Failed to register Telegram Webhook:');
    console.error(JSON.stringify(data, null, 2));
  }
}

main().catch((err) => {
  console.error('Fatal script error:', err);
  process.exit(1);
});
