import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { createHmac } from 'crypto'

export const dynamic = 'force-dynamic'

export const metadata = {
  title: 'Blog Studio — SK Sahinur Islam',
  robots: { index: false, follow: false },
}

function getExpectedToken() {
  const secret = process.env.STUDIO_SESSION_SECRET
  const email = process.env.STUDIO_ADMIN_EMAIL
  const password = process.env.STUDIO_ADMIN_PASSWORD
  if (!secret || !email || !password) return null
  return createHmac('sha256', secret)
    .update(`${email}:${password}`)
    .digest('hex')
}

export default async function StudioLayout({ children }) {
  const cookieStore = await cookies()
  const sessionCookie = cookieStore.get('__studio_session')?.value
  const expectedToken = getExpectedToken()

  if (!expectedToken || !sessionCookie || sessionCookie !== expectedToken) {
    redirect('/studio-login?redirect=/studio')
  }

  return (
    <html lang="en">
      <body style={{ margin: 0, padding: 0, height: '100%' }}>
        {children}
      </body>
    </html>
  )
}
