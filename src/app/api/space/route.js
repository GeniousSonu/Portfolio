import { NextResponse } from 'next/server';
import {
  getSpaceDocument,
  updateSpaceDocument,
  clearSpaceDocument,
  getSpaceRoom,
  updateSpaceRoom,
  clearSpaceRoom,
  broadcastToRoom,
  sanitizeSpaceContent,
  verifySpaceSessionToken,
  checkSpaceRateLimit,
  broadcastToSpace,
} from '@/lib/sharedSpace';

const SAVE_RATE_LIMIT = 60;          // Max 60 saves per minute per IP (ample for 500ms debouncing)
const SAVE_RATE_WINDOW = 60;         // 60 seconds
const CLEAR_RATE_LIMIT = 6;          // Max 6 clears per 10 minutes
const CLEAR_RATE_WINDOW = 10 * 60;

function getClientIp(req) {
  const forwarded = req.headers.get('x-forwarded-for');
  const realIp = req.headers.get('x-real-ip');
  return forwarded ? forwarded.split(',')[0].trim() : realIp || '127.0.0.1';
}

function extractSessionToken(req, body) {
  const headerToken = req.headers.get('x-space-session-token');
  return headerToken || body?.sessionToken;
}

/**
 * GET /api/space
 * Returns current shared scratchpad content and timestamp.
 * If ?roomId=... is provided, loads the specific Instant Sync Room.
 */
export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const roomId = searchParams.get('roomId');

    if (roomId) {
      const room = await getSpaceRoom(roomId);
      if (room.notFound) {
        return NextResponse.json({ error: 'Room does not exist.', notFound: true }, { status: 404 });
      }
      if (room.expired) {
        return NextResponse.json({ error: 'Room has expired.', expired: true }, { status: 410 });
      }
      return NextResponse.json({
        success: true,
        roomId: room.roomId,
        content: room.content || '',
        updatedAt: room.updatedAt,
        expiresAt: room.expiresAt,
      });
    }

    // Default: Single shared document
    const doc = await getSpaceDocument();
    return NextResponse.json({
      success: true,
      content: doc.content || '',
      updatedAt: doc.updated_at,
    });
  } catch (err) {
    console.error('[API Space GET] Error:', err.message);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

/**
 * POST /api/space
 * Accepts { content, clientId, lastKnownUpdatedAt, sessionToken }
 * Validates session token, rate limits, performs conflict detection, sanitizes, and broadcasts.
 */
export async function POST(req) {
  try {
    const clientIp = getClientIp(req);
    const body = await req.json().catch(() => ({}));
    const { content, clientId, lastKnownUpdatedAt, roomId } = body;

    // 1. Enforce Human Verification Session Token
    const sessionToken = extractSessionToken(req, body);
    const tokenStatus = verifySpaceSessionToken(sessionToken);
    if (!tokenStatus.valid) {
      if (tokenStatus.expired) {
        return NextResponse.json(
          { error: 'Your session has expired. Renewing verification...', code: 'TOKEN_EXPIRED' },
          { status: 403 }
        );
      }
      return NextResponse.json(
        { error: 'Human verification required to edit.', code: 'UNVERIFIED' },
        { status: 403 }
      );
    }

    // 2. IP Rate Limiting for debounced typing saves
    const rateLimitKey = `space:save:${clientIp}`;
    const rateStatus = await checkSpaceRateLimit(rateLimitKey, SAVE_RATE_LIMIT, SAVE_RATE_WINDOW);
    if (!rateStatus.allowed) {
      return NextResponse.json(
        { error: 'Typing too rapidly. Please pause for a moment.' },
        { status: 429 }
      );
    }

    // 3. Strict Server-Side Unicode / Anti-Abuse Sanitization
    let cleanText;
    try {
      cleanText = sanitizeSpaceContent(content || '');
    } catch (valErr) {
      return NextResponse.json({ error: valErr.message }, { status: 400 });
    }

    // ── Dedicated Room Path ──
    if (roomId) {
      const currentRoom = await getSpaceRoom(roomId);
      if (currentRoom.notFound) {
        return NextResponse.json({ error: 'Room does not exist.', notFound: true }, { status: 404 });
      }
      if (currentRoom.expired) {
        return NextResponse.json({ error: 'Room has expired.', expired: true }, { status: 410 });
      }

      if (
        lastKnownUpdatedAt &&
        currentRoom.updatedAt &&
        currentRoom.content !== cleanText
      ) {
        const serverTime = new Date(currentRoom.updatedAt).getTime();
        const clientSeenTime = new Date(lastKnownUpdatedAt).getTime();
        if (serverTime > clientSeenTime + 400) {
          return NextResponse.json(
            {
              conflict: true,
              currentContent: currentRoom.content,
              updatedAt: currentRoom.updatedAt,
              message: 'Someone else edited this room scratchpad while you were typing.',
            },
            { status: 409 }
          );
        }
      }

      const updated = await updateSpaceRoom(roomId, cleanText);
      broadcastToRoom(roomId, 'document-update', {
        content: cleanText,
        updatedAt: updated.updated_at,
        senderId: clientId || null,
      }).catch((e) => {
        console.warn('[API Space Room POST] Broadcast error:', e.message);
      });

      return NextResponse.json({
        success: true,
        roomId,
        content: cleanText,
        updatedAt: updated.updated_at,
        expiresAt: updated.expires_at,
      });
    }

    // ── Single Document Legacy Path ──
    // 4. Conflict Detection (Timestamp / Version Check)
    const currentDoc = await getSpaceDocument();
    if (
      lastKnownUpdatedAt &&
      currentDoc.updated_at &&
      currentDoc.content !== cleanText
    ) {
      const serverTime = new Date(currentDoc.updated_at).getTime();
      const clientSeenTime = new Date(lastKnownUpdatedAt).getTime();

      // If server document was updated more than 400ms after what client saw
      if (serverTime > clientSeenTime + 400) {
        return NextResponse.json(
          {
            conflict: true,
            currentContent: currentDoc.content,
            updatedAt: currentDoc.updated_at,
            message: 'Someone else edited this scratchpad while you were typing.',
          },
          { status: 409 }
        );
      }
    }

    // 5. Persist to Supabase single document row
    const updated = await updateSpaceDocument(cleanText);

    // 6. Broadcast update over private Realtime channel
    broadcastToSpace('document-update', {
      content: cleanText,
      updatedAt: updated.updated_at,
      senderId: clientId || null,
    }).catch((e) => {
      console.warn('[API Space POST] Broadcast error:', e.message);
    });

    return NextResponse.json({
      success: true,
      content: cleanText,
      updatedAt: updated.updated_at,
    });
  } catch (err) {
    console.error('[API Space POST] Error:', err.message);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

/**
 * DELETE /api/space
 * Clears the shared collaborative scratchpad.
 */
export async function DELETE(req) {
  try {
    const clientIp = getClientIp(req);
    const body = await req.json().catch(() => ({}));
    const { clientId, roomId } = body;

    // 1. Enforce Human Verification Session Token
    const sessionToken = extractSessionToken(req, body);
    const tokenStatus = verifySpaceSessionToken(sessionToken);
    if (!tokenStatus.valid) {
      return NextResponse.json(
        { error: 'Human verification required to clear.', code: 'UNVERIFIED' },
        { status: 403 }
      );
    }

    // 2. Rate limit clear action
    const rateLimitKey = `space:clear:${clientIp}`;
    const rateStatus = await checkSpaceRateLimit(rateLimitKey, CLEAR_RATE_LIMIT, CLEAR_RATE_WINDOW);
    if (!rateStatus.allowed) {
      return NextResponse.json(
        { error: 'Clear limit reached. Please wait a few minutes before clearing again.' },
        { status: 429 }
      );
    }

    // Room path clear
    if (roomId) {
      const cleared = await clearSpaceRoom(roomId);
      broadcastToRoom(roomId, 'document-cleared', {
        updatedAt: cleared.updated_at,
        senderId: clientId || null,
      }).catch((e) => {
        console.warn('[API Space Room DELETE] Broadcast error:', e.message);
      });

      return NextResponse.json({
        success: true,
        roomId,
        message: 'Room scratchpad cleared.',
        updatedAt: cleared.updated_at,
      });
    }

    // 3. Clear single document in Supabase
    const cleared = await clearSpaceDocument();

    // 4. Broadcast clear event
    broadcastToSpace('document-cleared', {
      updatedAt: cleared.updated_at,
      senderId: clientId || null,
    }).catch((e) => {
      console.warn('[API Space DELETE] Broadcast error:', e.message);
    });

    return NextResponse.json({
      success: true,
      message: 'Scratchpad cleared.',
      updatedAt: cleared.updated_at,
    });
  } catch (err) {
    console.error('[API Space DELETE] Error:', err.message);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
