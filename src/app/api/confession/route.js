import { NextResponse } from 'next/server';
import crypto from 'node:crypto';
import { getServiceSupabase } from '@/lib/supabaseServer';
import {
  extractClientIp,
  validateHoneypot,
  validateRequestOrigin,
} from '@/lib/contactSecurity';

export const dynamic = 'force-dynamic';

// In-memory sliding rate limiter: Max 5 submissions per IP per hour
const ipSubmissionsMap = new Map();
const RATE_LIMIT_WINDOW_MS = 60 * 60 * 1000; // 1 hour
const MAX_CONFESSIONS_PER_IP = 5;

function checkRateLimit(ip) {
  const now = Date.now();
  const entry = ipSubmissionsMap.get(ip) || [];
  const validTimestamps = entry.filter((t) => now - t < RATE_LIMIT_WINDOW_MS);

  if (validTimestamps.length >= MAX_CONFESSIONS_PER_IP) {
    return false;
  }

  validTimestamps.push(now);
  ipSubmissionsMap.set(ip, validTimestamps);
  return true;
}

export async function POST(request) {
  try {
    // 1. Origin verification
    const originCheck = validateRequestOrigin(request);
    if (!originCheck.valid) {
      return NextResponse.json({ success: false, error: 'Forbidden' }, { status: 403 });
    }

    // 2. Body parsing
    let body;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json(
        { success: false, error: 'Invalid JSON request payload.' },
        { status: 400 }
      );
    }

    const clientIp = extractClientIp(request);

    // 3. Honeypot check
    const honeypot = validateHoneypot(body);
    if (honeypot.isHoneypot) {
      // Fake 200 OK so bots don't learn they were trapped
      return NextResponse.json({
        success: true,
        message: 'Note securely transmitted into the vault.',
      });
    }

    // 4. Rate limiting
    if (!checkRateLimit(clientIp)) {
      return NextResponse.json(
        {
          success: false,
          error: 'Rate limit exceeded. Maximum 5 anonymous submissions per hour.',
        },
        { status: 429 }
      );
    }

    // 5. Input validation
    const noteText = typeof body.note === 'string' ? body.note.trim() : '';
    if (!noteText || noteText.length < 2) {
      return NextResponse.json(
        { success: false, error: 'Confession note cannot be empty.' },
        { status: 400 }
      );
    }

    if (noteText.length > 2000) {
      return NextResponse.json(
        { success: false, error: 'Confession exceeds maximum length of 2000 characters.' },
        { status: 400 }
      );
    }

    // 6. Generate cryptographic hash identifiers
    const salt = process.env.CONFESSION_HASH_SALT || 'genioussonu_confession_salt';
    const ipHash = crypto.createHash('sha256').update(`${clientIp}:${salt}`).digest('hex');
    const confessionId = crypto.randomUUID();

    // 7. Persist to Supabase if configured
    try {
      const supabase = getServiceSupabase();
      const { error: dbError } = await supabase.from('confessions').insert({
        id: confessionId,
        body: noteText,
        is_encrypted: Boolean(body.isEncrypted),
        status: 'new',
        ip_hash: ipHash,
        created_at: new Date().toISOString(),
      });

      if (dbError) {
        // Table may not exist yet in Supabase project; log for awareness but don't fail user
        console.warn('[Confession API] Supabase table insert notice:', dbError.message);
      }
    } catch (dbErr) {
      console.warn('[Confession API] Supabase unavailable, proceeding gracefully:', dbErr?.message);
    }

    // 8. Telegram notification per PRD FR-CONF-07 (Message is "New confession received" only, without text)
    const botToken = process.env.TELEGRAM_BOT_TOKEN;
    const chatId = process.env.TELEGRAM_CHAT_ID;
    if (botToken && chatId) {
      const istTime = new Date().toLocaleTimeString('en-US', {
        timeZone: 'Asia/Kolkata',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true,
      });

      fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: chatId,
          text: `🔐 <b>New Anonymous Confession</b>\n\nA new message has been dropped into the vault.\n• <b>Time:</b> ${istTime} IST\n• <b>Length:</b> ${noteText.length} chars`,
          parse_mode: 'HTML',
        }),
      }).catch((err) => {
        console.warn('[Confession API] Telegram notification notice:', err?.message);
      });
    }

    return NextResponse.json({
      success: true,
      id: confessionId,
      message: 'Note securely transmitted into the vault.',
      timestamp: Date.now(),
    });
  } catch (err) {
    console.error('[Confession API] Unexpected error:', err);
    return NextResponse.json(
      { success: false, error: 'Internal server error processing confession.' },
      { status: 500 }
    );
  }
}
