import { NextResponse } from 'next/server';
import { resend } from '@/lib/resend';
import { checkSpaceRateLimit } from '@/lib/sharedSpace';

const MAX_NAME_LENGTH = 100;
const MAX_EMAIL_LENGTH = 150;
const MAX_MESSAGE_LENGTH = 5000;
const CONTACT_RATE_LIMIT = 5;       // Max 5 messages
const CONTACT_RATE_WINDOW = 600;    // per 10 minutes

export async function POST(request) {
  try {
    // 1. IP Rate Limiting (Supabase-backed counter)
    const forwarded = request.headers.get('x-forwarded-for');
    const clientIp = forwarded ? forwarded.split(',')[0].trim() : request.headers.get('x-real-ip') || '127.0.0.1';
    const rateLimitKey = `contact:${clientIp}`;
    const rateStatus = await checkSpaceRateLimit(rateLimitKey, CONTACT_RATE_LIMIT, CONTACT_RATE_WINDOW);

    if (!rateStatus.allowed) {
      return NextResponse.json(
        {
          success: false,
          error: 'Too many contact messages sent from your IP. Please wait a few minutes before sending another message.',
        },
        { status: 429 }
      );
    }

    const body = await request.json();
    const { name, email, message, turnstileToken } = body;

    // Optional Cloudflare Turnstile verification (graceful degradation)
    if (process.env.TURNSTILE_SECRET_KEY && turnstileToken) {
      try {
        const formData = new URLSearchParams();
        formData.append('secret', process.env.TURNSTILE_SECRET_KEY);
        formData.append('response', turnstileToken);
        formData.append('remoteip', clientIp);

        const cfRes = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
          method: 'POST',
          body: formData,
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        });

        const cfData = await cfRes.json();
        if (!cfData.success) {
          return NextResponse.json(
            { success: false, error: 'Human verification failed. Please try again.' },
            { status: 403 }
          );
        }
      } catch (cfErr) {
        console.warn('[Contact API] Turnstile verification network error, bypassing:', cfErr);
      }
    }

    // Validation
    if (!name?.trim() || !email?.trim() || !message?.trim()) {
      return NextResponse.json(
        { error: 'Name, email, and message are required fields.' },
        { status: 400 }
      );
    }

    if (name.length > MAX_NAME_LENGTH) {
      return NextResponse.json(
        { error: `Name exceeds maximum length of ${MAX_NAME_LENGTH} characters.` },
        { status: 400 }
      );
    }

    if (email.length > MAX_EMAIL_LENGTH) {
      return NextResponse.json(
        { error: `Email exceeds maximum length of ${MAX_EMAIL_LENGTH} characters.` },
        { status: 400 }
      );
    }

    if (message.length > MAX_MESSAGE_LENGTH) {
      return NextResponse.json(
        { error: `Message exceeds maximum length of ${MAX_MESSAGE_LENGTH} characters.` },
        { status: 400 }
      );
    }

    // Basic email format check
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Please provide a valid email address.' },
        { status: 400 }
      );
    }

    // Check for required API credentials
    if (!process.env.RESEND_API_KEY) {
      console.error('[Contact API] Missing RESEND_API_KEY environment variable.');
      return NextResponse.json(
        {
          success: false,
          error: 'Email service configuration missing. Please ensure RESEND_API_KEY is configured in Vercel Environment Variables.',
          type: 'configuration_error'
        },
        { status: 503 }
      );
    }

    const recipient = process.env.CONTACT_NOTIFICATION_EMAIL || 'sahinurislamm2002@gmail.com';

    // Send email via Resend
    const { data, error } = await resend.emails.send({
      from: 'Portfolio Contact <onboarding@resend.dev>',
      to: recipient,
      replyTo: email,
      subject: `[Portfolio Inquiry] New message from ${name}`,
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
              <div style="font-size: 15px; color: #f1f5f9; font-weight: 600; margin-top: 3px;">${escapeHtml(name)}</div>
            </div>

            <div style="margin-bottom: 18px;">
              <span style="font-size: 11px; text-transform: uppercase; letter-spacing: 0.05em; color: #64748b; font-weight: 600;">Reply Email</span>
              <div style="font-size: 15px; color: #38bdf8; margin-top: 3px;">
                <a href="mailto:${escapeHtml(email)}" style="color: #38bdf8; text-decoration: none;">${escapeHtml(email)}</a>
              </div>
            </div>

            <div style="margin-bottom: 8px;">
              <span style="font-size: 11px; text-transform: uppercase; letter-spacing: 0.05em; color: #64748b; font-weight: 600;">Message</span>
              <div style="background: #161f30; padding: 16px; border-radius: 8px; border: 1px solid #243048; margin-top: 6px; font-size: 14px; line-height: 1.6; color: #e2e8f0; white-space: pre-wrap;">${escapeHtml(message)}</div>
            </div>
          </div>

          <div style="background: #090d13; padding: 12px 24px; border-top: 1px solid #1f293d; font-size: 12px; color: #64748b; text-align: center;">
            Sent securely via Resend · SK Sahinur Islam Portfolio
          </div>
        </div>
      `,
    });

    if (error) {
      console.error('[Contact API] Resend API error response:', error);
      return NextResponse.json(
        {
          success: false,
          error: error.message || 'Failed to send email through Resend service.',
          type: 'resend_error'
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
        type: 'server_error'
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
