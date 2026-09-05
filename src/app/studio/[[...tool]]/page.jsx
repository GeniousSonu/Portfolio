'use client'
/**
 * /studio/[[...tool]] — Embedded Sanity Studio
 * Accessible at /studio on both local dev and live production.
 * Uses dynamic import with ssr: false to prevent Next.js / React 19 SSR hydration mismatches.
 */
import dynamic from 'next/dynamic'
import config from '@/sanity/studio.config'

const NextStudio = dynamic(
  () => import('next-sanity/studio').then((mod) => mod.NextStudio),
  {
    ssr: false,
    loading: () => (
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          height: '100vh',
          background: '#0e1017',
          color: '#94a3b8',
          fontFamily: 'system-ui, -apple-system, sans-serif',
          fontSize: '14px',
        }}
      >
        Initializing Sanity Studio...
      </div>
    ),
  }
)

export default function StudioPage() {
  return <NextStudio config={config} />
}
