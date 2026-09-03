/**
 * Studio route layout — completely bypasses the root layout (Navbar, Footer, CustomCursor etc.)
 * so Sanity Studio gets a clean full-screen environment.
 */
export const metadata = {
  title: 'Blog Studio — SK Sahinur Islam',
  robots: { index: false, follow: false },
}

export default function StudioLayout({ children }) {
  return (
    <html lang="en">
      <body style={{ margin: 0, padding: 0, height: '100%' }}>
        {children}
      </body>
    </html>
  )
}
