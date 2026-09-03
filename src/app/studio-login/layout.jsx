import { Inter } from 'next/font/google'

const inter = Inter({ subsets: ['latin'], display: 'swap' })

export const metadata = {
  title: 'Studio Login',
  robots: { index: false, follow: false },
}

/**
 * Standalone layout for the studio login page.
 * Bypasses the global root layout so there's no Navbar/Footer/Cursor chrome.
 */
export default function StudioLoginLayout({ children }) {
  return (
    <html lang="en" className={inter.className}>
      <body style={{ margin: 0, padding: 0 }}>
        {children}
      </body>
    </html>
  )
}
