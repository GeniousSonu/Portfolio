import React from 'react'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import { client } from '@/sanity/client'
import { POSTS_QUERY } from '@/sanity/queries'
import BlogListClient from './BlogListClient'
import WaterRippleEffect from '@/components/ui/WaterRippleEffect'
import styles from './blog.module.css'

export const revalidate = 30 // ISR cache revalidation every 30 seconds

export const metadata = {
  title: 'Engineering Blog & Articles — SK Sahinur Islam',
  description: 'Deep dives on backend architecture, system design, DevOps, Node.js, Next.js, and IoT innovations by SK Sahinur Islam.',
  openGraph: {
    title: 'Engineering Blog & Articles — SK Sahinur Islam',
    description: 'Deep dives on backend architecture, system design, DevOps, Node.js, Next.js, and IoT innovations by SK Sahinur Islam.',
    url: 'https://sksahinurislam.dev/blog',
  },
}

export default async function BlogPage() {
  let posts = []
  try {
    posts = await client.fetch(POSTS_QUERY)
  } catch (error) {
    console.error('Error fetching Sanity blog posts:', error)
  }

  return (
    <main className={styles.blogPage}>
      <Navbar />

      {/* Ambient background glow & Water Ripple Layer */}
      <div className={styles.ambientGlow} />
      <WaterRippleEffect
        imageSrc="/water-ripple-background.svg"
        className="water-ripple-layer"
      />

      <div className={styles.container}>
        {/* Header Section */}
        <header className={styles.header}>
          <div className={styles.badge}>
            <span>✦</span>
            <span>Articles & Technical Notes</span>
          </div>
          <h1 className={styles.title}>Engineering Insights</h1>
          <p className={styles.subtitle}>
            Thoughts on backend systems, full-stack architecture, DevOps automation, IoT protocols, and developer experience.
          </p>
        </header>

        {/* Dynamic Blog Filter & Listing */}
        <BlogListClient initialPosts={posts || []} />
      </div>

      <Footer />
    </main>
  )
}
