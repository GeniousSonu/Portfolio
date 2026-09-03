'use client'
import React, { useState, useMemo } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { getOptimizedImageUrl } from '@/sanity/image'
import styles from './blog.module.css'

export default function BlogListClient({ initialPosts = [] }) {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('All')

  // Extract unique categories
  const categories = useMemo(() => {
    const set = new Set()
    initialPosts.forEach((post) => {
      post.categories?.forEach((cat) => {
        if (cat?.title) set.add(cat.title)
      })
    })
    return ['All', ...Array.from(set)]
  }, [initialPosts])

  // Filter posts
  const filteredPosts = useMemo(() => {
    return initialPosts.filter((post) => {
      const matchesSearch =
        searchQuery.trim() === '' ||
        post.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.excerpt?.toLowerCase().includes(searchQuery.toLowerCase())

      const matchesCategory =
        selectedCategory === 'All' ||
        post.categories?.some((c) => c?.title?.toLowerCase() === selectedCategory.toLowerCase())

      return matchesSearch && matchesCategory
    })
  }, [initialPosts, searchQuery, selectedCategory])

  const featuredPost = useMemo(() => {
    return filteredPosts.find((p) => p.featured) || (filteredPosts.length > 0 && searchQuery === '' && selectedCategory === 'All' ? filteredPosts[0] : null)
  }, [filteredPosts, searchQuery, selectedCategory])

  const remainingPosts = useMemo(() => {
    if (!featuredPost) return filteredPosts
    return filteredPosts.filter((p) => p._id !== featuredPost._id)
  }, [filteredPosts, featuredPost])

  return (
    <>
      {/* Search & Filter Controls */}
      <div className={styles.controls}>
        <div className={styles.searchBox}>
          <svg
            className={styles.searchIcon}
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <input
            type="text"
            placeholder="Search articles, architectures, engineering insights..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={styles.searchInput}
          />
        </div>

        {categories.length > 1 && (
          <div className={styles.categories}>
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`${styles.categoryBtn} ${
                  selectedCategory === cat ? styles.categoryBtnActive : ''
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* When no posts match filter or no posts exist */}
      {filteredPosts.length === 0 ? (
        <div className={styles.emptyState}>
          <div className={styles.emptyIcon}>✍️</div>
          <h3 className={styles.emptyTitle}>
            {initialPosts.length === 0 ? 'No Blog Posts Published Yet' : 'No matching articles found'}
          </h3>
          <p className={styles.emptyDesc}>
            {initialPosts.length === 0
              ? 'Sanity Studio is connected! Run your studio locally to publish your first article with rich blocks, code highlights, and cross-platform syndication.'
              : `No articles match "${searchQuery || selectedCategory}". Try searching with different keywords.`}
          </p>
          {initialPosts.length === 0 && (
            <div style={{ marginTop: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.75rem', alignItems: 'center' }}>
              <span className="text-xs font-mono text-text-muted bg-white/5 px-3 py-1.5 rounded border border-white/10">
                cd ../studio-portfolio && npm run dev
              </span>
            </div>
          )}
        </div>
      ) : (
        <>
          {/* Featured Post Spotlight */}
          {featuredPost && (
            <section className={styles.featuredSection}>
              <Link href={`/blog/${featuredPost.slug}`} className={styles.featuredCard}>
                <div className={styles.featuredImageWrapper}>
                  {featuredPost.mainImage ? (
                    <Image
                      src={getOptimizedImageUrl(featuredPost.mainImage, 1000) || featuredPost.mainImage.asset?.url}
                      alt={featuredPost.mainImage.alt || featuredPost.title}
                      fill
                      priority
                      className="object-cover"
                      sizes="(max-width: 900px) 100vw, 55vw"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-[#1b2234] to-[#0d111a] text-border/40">
                      <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                        <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/>
                        <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>
                      </svg>
                    </div>
                  )}
                </div>
                <div className={styles.featuredContent}>
                  <div>
                    <span className={styles.featuredBadge}>
                      ⭐ {featuredPost.featured ? 'Featured Article' : 'Latest Release'}
                    </span>
                    <h2 className={styles.featuredTitle}>{featuredPost.title}</h2>
                    {featuredPost.excerpt && (
                      <p className={styles.featuredExcerpt}>{featuredPost.excerpt}</p>
                    )}
                  </div>
                  <div className={styles.featuredMeta}>
                    <div className={styles.authorInfo}>
                      {featuredPost.author?.image ? (
                        <div className={styles.authorAvatar}>
                          <Image
                            src={getOptimizedImageUrl(featuredPost.author.image, 80) || featuredPost.author.image.asset?.url}
                            alt={featuredPost.author.name || 'Author'}
                            fill
                            className="object-cover"
                          />
                        </div>
                      ) : null}
                      <span>{featuredPost.author?.name || 'SK Sahinur Islam'}</span>
                    </div>
                    <div>
                      <span>
                        {featuredPost.publishedAt
                          ? new Date(featuredPost.publishedAt).toLocaleDateString('en-US', {
                              month: 'short',
                              day: 'numeric',
                              year: 'numeric',
                            })
                          : 'Draft'}
                      </span>
                      {featuredPost.readTime && <span> • {featuredPost.readTime} min read</span>}
                    </div>
                  </div>
                </div>
              </Link>
            </section>
          )}

          {/* Grid of Remaining Articles */}
          {remainingPosts.length > 0 && (
            <div className={styles.grid}>
              {remainingPosts.map((post) => (
                <Link key={post._id} href={`/blog/${post.slug}`} className={styles.card}>
                  <div className={styles.cardImageWrapper}>
                    {post.mainImage ? (
                      <Image
                        src={getOptimizedImageUrl(post.mainImage, 700) || post.mainImage.asset?.url}
                        alt={post.mainImage.alt || post.title}
                        fill
                        className="object-cover"
                        sizes="(max-width: 680px) 100vw, (max-width: 1040px) 50vw, 33vw"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-[#161c2b] to-[#0c1017] text-border/30">
                        <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                          <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/>
                          <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>
                        </svg>
                      </div>
                    )}
                  </div>
                  <div className={styles.cardBody}>
                    {post.categories && post.categories.length > 0 && (
                      <div className={styles.cardTags}>
                        {post.categories.map((c) => (
                          <span key={c._id || c.title} className={styles.tag}>
                            {c.title}
                          </span>
                        ))}
                      </div>
                    )}
                    <h3 className={styles.cardTitle}>{post.title}</h3>
                    {post.excerpt && <p className={styles.cardExcerpt}>{post.excerpt}</p>}
                    <div className={styles.cardFooter}>
                      <span>
                        {post.publishedAt
                          ? new Date(post.publishedAt).toLocaleDateString('en-US', {
                              month: 'short',
                              day: 'numeric',
                              year: 'numeric',
                            })
                          : ''}
                      </span>
                      {post.readTime && <span>{post.readTime} min read</span>}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </>
      )}
    </>
  )
}
