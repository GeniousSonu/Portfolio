import { NextResponse } from 'next/server';
import {
  getSpaceEntryById,
  checkSpaceRateLimit,
  notifyTelegramReportedEntry,
} from '@/lib/sharedSpace';

const REPORT_RATE_LIMIT = 5;         // Max 5 reports
const REPORT_RATE_WINDOW = 10 * 60;  // per 10 minutes

function getClientIp(req) {
  const forwarded = req.headers.get('x-forwarded-for');
  const realIp = req.headers.get('x-real-ip');
  return forwarded ? forwarded.split(',')[0].trim() : realIp || '127.0.0.1';
}

/**
 * POST /api/space/report
 * Accepts { entryId, reason }
 * Dispatches an instant alert to Sonu's Telegram with an inline "Delete Entry" button.
 */
export async function POST(req) {
  try {
    const clientIp = getClientIp(req);
    const body = await req.json().catch(() => ({}));
    const { entryId, reason } = body;

    if (!entryId || typeof entryId !== 'string') {
      return NextResponse.json({ error: 'Valid entryId is required.' }, { status: 400 });
    }

    // 1. Rate limiting
    const rateLimitKey = `space:report:${clientIp}`;
    const rateStatus = await checkSpaceRateLimit(rateLimitKey, REPORT_RATE_LIMIT, REPORT_RATE_WINDOW);
    if (!rateStatus.allowed) {
      return NextResponse.json(
        { error: 'Too many reports submitted. Please wait a few minutes.' },
        { status: 429 }
      );
    }

    // 2. Lookup entry
    const entry = await getSpaceEntryById(entryId);
    if (!entry) {
      return NextResponse.json(
        { error: 'Entry not found or has already been deleted.' },
        { status: 404 }
      );
    }

    // 3. Dispatch alert to Sonu's Telegram
    await notifyTelegramReportedEntry(entry, clientIp, reason || 'Inappropriate content flagged by visitor');

    return NextResponse.json({ success: true, message: 'Report submitted. Thank you!' });
  } catch (err) {
    console.error('[API Space Report] Error:', err.message);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
