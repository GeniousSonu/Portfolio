export const dynamic = 'force-dynamic'

export const metadata = {
  title: 'Blog Studio — SK Sahinur Islam',
  robots: { index: false, follow: false },
}

export default function StudioLayout({ children }) {
  return (
    <div style={{ margin: 0, padding: 0, height: '100%', minHeight: '100vh' }}>
      {children}
    </div>
  )
}
