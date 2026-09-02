import React from 'react'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import CustomCursor from '@/components/CustomCursor'
import PortableTextRenderer from '@/components/PortableTextRenderer'
import { client } from '@/sanity/client'
import { POST_QUERY, POST_SLUGS_QUERY } from '@/sanity/queries'
import ShareButtons from './ShareButtons'
import styles from './post.module.css'

export const revalidate = 30 // ISR cache revalidation every 30 seconds

export async function generateStaticParams() {
  try {
    const slugs = await client.withConfig({ useCdn: false }).fetch(POST_SLUGS_QUERY)
    return slugs.map((item) => ({
      slug: item.slug,
    }))
  } catch (err) {
    console.error('Error generating static params for blog:', err)
    return []
  }
}

export async function generateMetadata({ params }) {
  const { slug } = await params
  const post = await client.fetch(POST_QUERY, { slug })

  if (!post) {
    return {
      title: 'Article Not Found — SK Sahinur Islam',
    }
  }

  const title = `${post.title} — SK Sahinur Islam`
  const description = post.excerpt || `Read ${post.title} by SK Sahinur Islam.`
  const imageUrl = post.mainImage?.asset?.url || 'https://sksahinurislam.dev/logo.svg'

  return {
    title,
    description,
    alternates: {
      canonical: post.syncMetadata?.canonicalUrl || `https://sksahinurislam.dev/blog/${slug}`,
    },
    openGraph: {
      title,
      description,
      type: 'article',
      url: `https://sksahinurislam.dev/blog/${slug}`,
      publishedTime: post.publishedAt,
      authors: [post.author?.name || 'SK Sahinur Islam'],
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: post.mainImage?.alt || post.title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [imageUrl],
    },
  }
}

export default async function BlogPostPage({ params }) {
  const { slug } = await params
  const post = await client.fetch(POST_QUERY, { slug })

  if (!post) {
    notFound()
  }

  // Schema.org BlogPosting structured data
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.excerpt,
    image: post.mainImage?.asset?.url,
    datePublished: post.publishedAt,
    author: {
      '@type': 'Person',
      name: post.author?.name || 'SK Sahinur Islam',
      url: 'https://sksahinurislam.dev',
    },
    publisher: {
      '@type': 'Person',
      name: 'SK Sahinur Islam',
      url: 'https://sksahinurislam.dev',
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `https://sksahinurislam.dev/blog/${slug}`,
    },
  }

  return (
    <article className={styles.articlePage}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <CustomCursor />
      <Navbar />

      {/* Ambient background glow */}
      <div className={styles.ambientGlow} />

      <div className={styles.container}>
        {/* Back Link */}
        <div className={styles.backNav}>
          <Link href="/blog" className={styles.backLink}>
            ← Back to all articles
          </Link>
        </div>

        {/* Article Header */}
        <header className={styles.header}>
          {post.categories && post.categories.length > 0 && (
            <div className={styles.tags}>
              {post.categories.map((c) => (
                <span key={c._id || c.title} className={styles.tag}>
                  {c.title}
                </span>
              ))}
            </div>
          )}

          <h1 className={styles.title}>{post.title}</h1>

          {post.excerpt && <p className={styles.excerpt}>{post.excerpt}</p>}

          <div className={styles.authorMeta}>
            <div className={styles.authorDetails}>
              {post.author?.image?.asset?.url ? (
                <div className={styles.authorAvatar}>
                  <Image
                    src={post.author.image.asset.url}
                    alt={post.author.name || 'Author'}
                    fill
                    className="object-cover"
                  />
                </div>
              ) : (
                <div className={styles.authorAvatar}>
                  <Image
                    src="/logo.svg"
                    alt="Author"
                    fill
                    className="object-cover p-1"
                  />
                </div>
              )}
              <div>
                <div className={styles.authorName}>{post.author?.name || 'SK Sahinur Islam'}</div>
                <div className={styles.authorRole}>{post.author?.role || 'Full-Stack Developer & Engineer'}</div>
              </div>
            </div>

            <div className={styles.postStats}>
              {post.publishedAt && (
                <span>
                  {new Date(post.publishedAt).toLocaleDateString('en-US', {
                    month: 'long',
                    day: 'numeric',
                    year: 'numeric',
                  })}
                </span>
              )}
              {post.readTime && <span>• {post.readTime} min read</span>}
            </div>
          </div>
        </header>

        {/* Cover Image */}
        {post.mainImage?.asset?.url && (
          <div className={styles.coverImageWrapper}>
            <Image
              src={post.mainImage.asset.url}
              alt={post.mainImage.alt || post.title}
              fill
              priority
              className="object-cover"
              sizes="(max-width: 860px) 100vw, 860px"
            />
          </div>
        )}

        {/* Cross-Platform Syndication Notice (if present) */}
        {post.syncMetadata && (post.syncMetadata.mediumUrl || post.syncMetadata.devToUrl || post.syncMetadata.hashnodeUrl) && (
          <div className={styles.syncSection}>
            <span>Also syndicated on:</span>
            <div className={styles.syncLinks}>
              {post.syncMetadata.mediumUrl && (
                <a href={post.syncMetadata.mediumUrl} target="_blank" rel="noopener noreferrer" className={styles.syncLink}>
                  Medium ↗
                </a>
              )}
              {post.syncMetadata.devToUrl && (
                <a href={post.syncMetadata.devToUrl} target="_blank" rel="noopener noreferrer" className={styles.syncLink}>
                  Dev.to ↗
                </a>
              )}
              {post.syncMetadata.hashnodeUrl && (
                <a href={post.syncMetadata.hashnodeUrl} target="_blank" rel="noopener noreferrer" className={styles.syncLink}>
                  Hashnode ↗
                </a>
              )}
            </div>
          </div>
        )}

        {/* Article Body Content */}
        <section className={styles.contentWrapper}>
          <PortableTextRenderer value={post.body} />
        </section>

        {/* Bottom Actions & Share */}
        <footer className={styles.footerActions}>
          <Link href="/blog" className={styles.backLink}>
            ← Explore more engineering articles
          </Link>
          <ShareButtons title={post.title} slug={slug} />
        </footer>
      </div>

      <Footer />
    </article>
  )
}
