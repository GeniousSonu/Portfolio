import { NextResponse } from 'next/server';
import { getServiceSupabase } from '@/lib/supabaseServer';
import {
  createSpaceRoom,
  getSpaceRoom,
  verifyTurnstileToken,
} from '@/lib/sharedSpace';

const ROOM_CREATE_LIMIT = 10;          // Max 10 room creations per hour per IP
const ROOM_CREATE_WINDOW = 60 * 60;    // 1 hour (3600s)

function getClientIp(req) {
  const forwarded = req.headers.get('x-forwarded-for');
  const realIp = req.headers.get('x-real-ip');
  return forwarded ? forwarded.split(',')[0].trim() : realIp || '127.0.0.1';
}

async function checkRoomCreationRateLimit(clientIp) {
  const key = `space:room_create:${clientIp}`;
  const now = Date.now();
  const supabase = getServiceSupabase();

  try {
    const { data: record, error: fetchError } = await supabase
      .from('chatbot_rate_limits')
      .select('count, reset_at')
      .eq('key', key)
      .single();

    if (!fetchError && record) {
      const resetTime = new Date(record.reset_at).getTime();
      if (now >= resetTime) {
        const newReset = new Date(now + ROOM_CREATE_WINDOW * 1000).toISOString();
        await supabase
          .from('chatbot_rate_limits')
          .update({ count: 1, reset_at: newReset, updated_at: new Date().toISOString() })
          .eq('key', key);
        return { allowed: true };
      } else if (record.count < ROOM_CREATE_LIMIT) {
        await supabase
          .from('chatbot_rate_limits')
          .update({ count: record.count + 1, updated_at: new Date().toISOString() })
          .eq('key', key);
        return { allowed: true };
      } else {
        return { allowed: false };
      }
    } else if (fetchError && fetchError.code === 'PGRST116') {
      const newReset = new Date(now + ROOM_CREATE_WINDOW * 1000).toISOString();
      await supabase
        .from('chatbot_rate_limits')
        .insert({ key, count: 1, reset_at: newReset, updated_at: new Date().toISOString() });
      return { allowed: true };
    }
  } catch (err) {
    console.warn('[RoomCreationRateLimit] Notice:', err.message);
  }

  return { allowed: true };
}

/**
 * GET /api/space/room?roomId=...
 * Fetches status, content, and expiration of a specific room.
 */
export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const roomId = searchParams.get('roomId');

    if (!roomId) {
      return NextResponse.json({ error: 'roomId parameter is required' }, { status: 400 });
    }

    const room = await getSpaceRoom(roomId);

    if (room.notFound) {
      return NextResponse.json(
        { error: 'This room does not exist.', notFound: true },
        { status: 404 }
      );
    }

    if (room.expired) {
      return NextResponse.json(
        { error: 'This room has expired after 48 hours of inactivity.', expired: true },
        { status: 410 }
      );
    }

    return NextResponse.json({
      success: true,
      roomId: room.roomId,
      content: room.content,
      updatedAt: room.updatedAt,
      expiresAt: room.expiresAt,
    });
  } catch (err) {
    console.error('[API Space Room GET] Error:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

/**
 * POST /api/space/room
 * Creates a dedicated Instant Sync Room with abuse rate limits & bot verification.
 */
export async function POST(req) {
  try {
    const clientIp = getClientIp(req);

    // 1. IP Rate Limiting for Room Creation
    const rateStatus = await checkRoomCreationRateLimit(clientIp);
    if (!rateStatus.allowed) {
      return NextResponse.json(
        { error: 'You have created too many sync rooms. Please try again later.' },
        { status: 429 }
      );
    }

    // 2. Turnstile Verification (if token provided)
    const body = await req.json().catch(() => ({}));
    const turnstileToken = body.turnstileToken;

    if (turnstileToken) {
      const turnstileCheck = await verifyTurnstileToken(turnstileToken, clientIp);
      if (!turnstileCheck.success) {
        return NextResponse.json({ error: turnstileCheck.error }, { status: 403 });
      }
    }

    // 3. Create room in database
    const room = await createSpaceRoom();

    return NextResponse.json({
      success: true,
      roomId: room.roomId,
      expiresAt: room.expiresAt,
      url: `/space/${room.roomId}`,
    });
  } catch (err) {
    console.error('[API Space Room POST] Error:', err);
    return NextResponse.json(
      { error: err.message || 'Failed to create sync room.' },
      { status: 500 }
    );
  }
}
