import { NextResponse } from 'next/server';
import { resend, getResendApiKey } from '@/lib/resend';
import {
  extractClientIp,
  validateHoneypot,
  validateTimeOnForm,
  validateRequestOrigin,
  checkAtomicContactRateLimit,
  validateEmailIntegrity,
  validateContentQuality,
  verifyTurnstileSecurity,
  logContactAbuse,
  GENERIC_CLIENT_ERROR,
  FAKE_SUCCESS_RESPONSE,
} from '@/lib/contactSecurity';

export async function POST(request) {
  // 1. Request Origin & Referer Verification (Privacy browser soft-fail)
  const originCheck = validateRequestOrigin(request);
  if (!originCheck.valid) {
    const clientIp = extractClientIp(request);
    await logContactAbuse(clientIp, originCheck.reason, { origin: originCheck.origin });
    return NextResponse.json({ success: false, error: 'Forbidden' }, { status: 403 });
  }

  // 2. Request Body Parsing
  let body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ success: false, error: GENERIC_CLIENT_ERROR }, { status: 400 });
  }

  const clientIp = extractClientIp(request);

  // 3. Honeypot Field Trap (`confirm_subject_ref` — autofill safe)
  const honeypotCheck = validateHoneypot(body);
  if (honeypotCheck.isHoneypot) {
    await logContactAbuse(clientIp, 'honeypot_triggered');
    // Silent fake 200 OK — bots receive success and never learn they were trapped
    return NextResponse.json(FAKE_SUCCESS_RESPONSE, { status: 200 });
  }

  // 4. Minimum Time-on-Form Check (< 3s indicates automated scraper)
  const timeCheck = validateTimeOnForm(body);
  if (!timeCheck.valid) {
    await logContactAbuse(clientIp, timeCheck.reason, { elapsedMs: timeCheck.elapsedMs });
    return NextResponse.json({ success: false, error: GENERIC_CLIENT_ERROR }, { status: 400 });
  }

  // 5. Cloudflare Turnstile Verification (Fail-closed in production)
  const turnstileCheck = await verifyTurnstileSecurity(body?.turnstileToken, clientIp);
  if (!turnstileCheck.success) {
    await logContactAbuse(clientIp, turnstileCheck.reason);
    return NextResponse.json({ success: false, error: GENERIC_CLIENT_ERROR }, { status: 403 });
  }

  // 6. Atomic Rate Limiting (10m IP, 1h IP, 1m Global Circuit Breaker)
  const rateCheck = await checkAtomicContactRateLimit(clientIp);
  if (!rateCheck.allowed) {
    await logContactAbuse(clientIp, rateCheck.reason, { retryAfter: rateCheck.retryAfter });
    return NextResponse.json(
      {
        success: false,
        error: 'Too many submissions. Please wait a moment before trying again.',
      },
      {
        status: 429,
        headers: {
          'Retry-After': String(rateCheck.retryAfter || 60),
        },
      }
    );
  }

  // 7. Email Validation (Regex + Disposable Domain Blocklist + DNS MX / RFC 5321 Fallback)
  const emailCheck = await validateEmailIntegrity(body?.email);
  if (!emailCheck.valid) {
    await logContactAbuse(clientIp, emailCheck.reason, { domain: emailCheck.domain });
    return NextResponse.json({ success: false, error: GENERIC_CLIENT_ERROR }, { status: 400 });
  }

  // 8. Content Quality & Unicode Anti-Abuse Sanitization
  const contentCheck = validateContentQuality(body?.name, body?.message);
  if (!contentCheck.valid) {
    await logContactAbuse(clientIp, contentCheck.reason, {
      urlCount: contentCheck.urlCount,
      ratio: contentCheck.ratio,
    });
    return NextResponse.json({ success: false, error: GENERIC_CLIENT_ERROR }, { status: 400 });
  }

  // 9. Check Email Service API Credentials
  const resendApiKey = getResendApiKey();
  if (!resendApiKey) {
    console.error('[Contact API] Missing RESEND_API_KEY environment variable.');
    return NextResponse.json(
      {
        success: false,
        error: 'Email service configuration missing. Please ensure RESEND_API_KEY is configured.',
      },
      { status: 503 }
    );
  }

  const recipient = process.env.CONTACT_NOTIFICATION_EMAIL || 'sahinurislamm2002@gmail.com';

  // 10. Send Email via Resend with Quota Monitoring
  try {
    const { data, error } = await resend.emails.send({
      from: 'Portfolio Contact <onboarding@resend.dev>',
      to: recipient,
      replyTo: body.email.trim(),
      subject: `[Portfolio Inquiry] New message from ${contentCheck.name}`,
      html: `
        <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 580px; margin: 0 auto; background: #0c1017; border: 1px solid #1f293d; border-radius: 12px; overflow: hidden; color: #e2e8f0;">
          <div style="background: #111827; padding: 20px 24px; border-bottom: 1px solid #1f293d;">
            <h2 style="margin: 0; font-size: 18px; color: #10b981; font-weight: 700; letter-spacing: 0.02em;">
              New Inquiry from Portfolio
            </h2>
            <p style="margin: 4px 0 0; font-size: 13px; color: #94a3b8;">
              Direct submission via genioussonu.me
            </p>
          </div>

          <div style="padding: 24px;">
            <div style="margin-bottom: 18px;">
              <span style="font-size: 11px; text-transform: uppercase; letter-spacing: 0.05em; color: #64748b; font-weight: 600;">Sender Name</span>
              <div style="font-size: 15px; color: #f1f5f9; font-weight: 600; margin-top: 3px;">${escapeHtml(contentCheck.name)}</div>
            </div>

            <div style="margin-bottom: 18px;">
              <span style="font-size: 11px; text-transform: uppercase; letter-spacing: 0.05em; color: #64748b; font-weight: 600;">Reply Email</span>
              <div style="font-size: 15px; color: #38bdf8; margin-top: 3px;">
                <a href="mailto:${escapeHtml(body.email.trim())}" style="color: #38bdf8; text-decoration: none;">${escapeHtml(body.email.trim())}</a>
              </div>
            </div>

            <div style="margin-bottom: 8px;">
              <span style="font-size: 11px; text-transform: uppercase; letter-spacing: 0.05em; color: #64748b; font-weight: 600;">Message</span>
              <div style="background: #161f30; padding: 16px; border-radius: 8px; border: 1px solid #243048; margin-top: 6px; font-size: 14px; line-height: 1.6; color: #e2e8f0; white-space: pre-wrap;">${escapeHtml(contentCheck.message)}</div>
            </div>
          </div>

          <div style="background: #090d13; padding: 12px 24px; border-top: 1px solid #1f293d; font-size: 12px; color: #64748b; text-align: center;">
            Sent securely via Resend · SK Sahinur Islam Portfolio
          </div>
        </div>
      `,
    });

    if (error) {
      console.error('[Contact API] Resend API error:', error);
      // Operational quota alert
      if (
        error.statusCode === 429 ||
        error.name === 'rate_limit_exceeded' ||
        String(error.message).toLowerCase().includes('quota') ||
        String(error.message).toLowerCase().includes('credit')
      ) {
        console.error('[RESEND_QUOTA_ALERT] Resend free-tier quota ceiling reached!', error);
      }
      return NextResponse.json(
        {
          success: false,
          error: 'Unable to deliver message at this moment. Please try again shortly.',
        },
        { status: 502 }
      );
    }

    return NextResponse.json({
      success: true,
      id: data?.id,
      message: 'Message delivered successfully.',
    });
  } catch (err) {
    console.error('[Contact API] Unexpected error handling submission:', err);
    return NextResponse.json(
      {
        success: false,
        error: 'Internal server error while processing message.',
      },
      { status: 500 }
    );
  }
}

function escapeHtml(str = '') {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}
