'use client'
/**
 * /studio/[[...tool]] — Embedded Sanity Studio
 * Accessible at /studio on both local dev and live production.
 * Uses next-sanity's NextStudio to render the full Sanity dashboard.
 */
import { NextStudio } from 'next-sanity/studio'
import config from '@/sanity/studio.config'

export default function StudioPage() {
  return <NextStudio config={config} />
}
