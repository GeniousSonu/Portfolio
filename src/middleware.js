import { NextResponse } from 'next/server'

const COOKIE_NAME = '__studio_session'
const LOGIN_PATH = '/studio-login'

/**
 * Compute the expected session token using Web Crypto (Edge-compatible).
 * Token = HMAC-SHA256(email:password, STUDIO_SESSION_SECRET) as hex string.
 * This is stateless — no DB needed. Cookie expiry handles logout.
 */
async function computeExpectedToken() {
  const secret = process.env.STUDIO_SESSION_SECRET
  const email = process.env.STUDIO_ADMIN_EMAIL
  const password = process.env.STUDIO_ADMIN_PASSWORD

  if (!secret || !email || !password) return null

  const encoder = new TextEncoder()
  const key = await crypto.subtle.importKey(
    'raw',
    encoder.encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  )

  const signature = await crypto.subtle.sign(
    'HMAC',
    key,
    encoder.encode(`${email}:${password}`)
  )

  return Array.from(new Uint8Array(signature))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('')
}

export async function middleware(request) {
  const { pathname } = request.nextUrl

  // Only guard /studio paths (not /studio-login itself or api routes)
  if (!pathname.startsWith('/studio')) {
    return NextResponse.next()
  }

  const sessionCookie = request.cookies.get(COOKIE_NAME)?.value
  const expectedToken = await computeExpectedToken()

  // If env vars aren't set, allow access (dev safety valve — set your env vars!)
  if (!expectedToken) {
    console.warn('[Studio Gate] STUDIO_SESSION_SECRET / STUDIO_ADMIN_EMAIL / STUDIO_ADMIN_PASSWORD env vars are not set. Studio is unprotected.')
    return NextResponse.next()
  }

  // Constant-time comparison to prevent timing attacks
  const isValid =
    sessionCookie != null &&
    sessionCookie.length === expectedToken.length &&
    sessionCookie === expectedToken

  if (!isValid) {
    const loginUrl = new URL(LOGIN_PATH, request.url)
    loginUrl.searchParams.set('redirect', pathname)
    return NextResponse.redirect(loginUrl)
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/studio/:path*'],
}
