import { NextResponse } from 'next/server';
import { getServiceSupabase } from '@/lib/supabaseServer';

export const dynamic = 'force-dynamic';

const BOT_USER_AGENT_REGEX =
  /bot|crawler|spider|crawling|googlebot|bingbot|yandex|duckduckbot|baiduspider|slurp|facebookexternalhit|whatsapp|telegrambot|twitterbot|slackbot|discordbot|applebot|linkedinbot|petalbot|semrushbot|ahrefsbot|mj12bot|dotbot/i;

export async function POST(req) {
  try {
    // 1. Filter Automated Bots and Crawlers
    const userAgent = req.headers.get('user-agent') || '';
    if (!userAgent || BOT_USER_AGENT_REGEX.test(userAgent)) {
      return NextResponse.json({ ok: true, skipped: 'bot' });
    }

    // 2. Enforce Cookie Consent (checked against existing sks_analytics_consent cookie)
    const consentCookie = req.cookies.get('sks_analytics_consent')?.value;
    if (consentCookie !== 'granted') {
      return NextResponse.json({ ok: true, skipped: 'no_consent' });
    }

    // 3. Validate Visitor ID
    const body = await req.json().catch(() => null);
    const visitorId = body?.visitorId;
    if (!visitorId || typeof visitorId !== 'string' || !/^[0-9a-fA-F-]{16,64}$/.test(visitorId)) {
      return NextResponse.json(
        { ok: false, error: 'Invalid visitor ID format' },
        { status: 400 }
      );
    }

    // 4. Record Visit (Deduplicated per calendar date via ON CONFLICT DO NOTHING)
    const today = new Date().toISOString().split('T')[0];
    const supabase = getServiceSupabase();

    const { error } = await supabase
      .from('site_visit_log')
      .upsert(
        {
          visitor_id: visitorId,
          visited_date: today,
        },
        {
          onConflict: 'visitor_id,visited_date',
          ignoreDuplicates: true,
        }
      );

    if (error) {
      console.warn('[TrackVisit] Failed to record visit (graceful fallback):', error.message);
      return NextResponse.json({ ok: false, error: 'storage_unavailable' });
    }

    return NextResponse.json({ ok: true, recorded: true });
  } catch (err) {
    console.warn('[TrackVisit] Unexpected exception handled gracefully:', err.message);
    return NextResponse.json({ ok: false, error: 'internal_handled' });
  }
}
