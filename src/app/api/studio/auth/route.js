import { NextResponse } from 'next/server'
import { createHmac } from 'crypto'

export const runtime = 'nodejs'

const COOKIE_NAME = '__studio_session'
const COOKIE_MAX_AGE = 7 * 24 * 60 * 60 // 7 days in seconds

/**
 * Server-side credential verification and session cookie issuance.
 * Credentials are ONLY read from environment variables — never from client payload comparison.
 */
export async function POST(request) {
  try {
    const body = await request.json()
    const { email, password } = body ?? {}

    const adminEmail = process.env.STUDIO_ADMIN_EMAIL
    const adminPassword = process.env.STUDIO_ADMIN_PASSWORD
    const sessionSecret = process.env.STUDIO_SESSION_SECRET

    // Validate env vars are configured
    if (!adminEmail || !adminPassword || !sessionSecret) {
      console.error('[Studio Auth] Missing STUDIO_ADMIN_EMAIL, STUDIO_ADMIN_PASSWORD, or STUDIO_SESSION_SECRET env vars.')
      return NextResponse.json(
        { error: 'Server is not configured. Contact the site administrator.' },
        { status: 500 }
      )
    }

    // Validate input
    if (typeof email !== 'string' || typeof password !== 'string') {
      return NextResponse.json({ error: 'Invalid request.' }, { status: 400 })
    }

    // Constant-time comparison to prevent timing attacks
    const emailMatch = timingSafeEqual(email.toLowerCase().trim(), adminEmail.toLowerCase().trim())
    const passwordMatch = timingSafeEqual(password, adminPassword)

    if (!emailMatch || !passwordMatch) {
      // Delay response slightly to slow brute-force
      await new Promise((r) => setTimeout(r, 400))
      return NextResponse.json({ error: 'Invalid email or password.' }, { status: 401 })
    }

    // Generate the session token (same algorithm as middleware)
    const token = createHmac('sha256', sessionSecret)
      .update(`${adminEmail}:${adminPassword}`)
      .digest('hex')

    const response = NextResponse.json({ ok: true })

    const isProduction = process.env.NODE_ENV === 'production'

    response.cookies.set(COOKIE_NAME, token, {
      httpOnly: true,
      secure: isProduction,
      sameSite: 'strict',
      maxAge: COOKIE_MAX_AGE,
      path: '/',
    })

    return response
  } catch (err) {
    console.error('[Studio Auth] Unexpected error:', err)
    return NextResponse.json({ error: 'An unexpected error occurred.' }, { status: 500 })
  }
}

/**
 * Constant-time string comparison to prevent timing-based credential enumeration.
 */
function timingSafeEqual(a, b) {
  if (a.length !== b.length) {
    // Still do a comparison to keep timing consistent
    let diff = 0
    for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ (b.charCodeAt(i % b.length) || 0)
    return false
  }
  let diff = 0
  for (let i = 0; i < a.length; i++) {
    diff |= a.charCodeAt(i) ^ b.charCodeAt(i)
  }
  return diff === 0
}
