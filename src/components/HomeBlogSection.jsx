"use client";
import React, { useEffect, useState, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { client } from '@/sanity/client';
import { POSTS_QUERY } from '@/sanity/queries';

// High-quality fallback posts if no documents are published in Sanity yet
const SAMPLE_POSTS = [
  {
    _id: 'sample-1',
    title: 'Building High-Throughput Event-Driven Microservices with Node.js & Redis',
    slug: 'event-driven-microservices-nodejs-redis',
    excerpt: 'Architectural patterns for scalable pub/sub messaging, worker queues, and resilient telemetry pipelines handling thousands of events/sec.',
    publishedAt: '2026-08-20T10:00:00Z',
    readTime: 6,
    featured: true,
    categories: [{ title: 'Backend & Architecture', color: '#E63946' }],
  },
  {
    _id: 'sample-2',
    title: 'Zero-Downtime Next.js 16 Deployment & Edge Optimization Strategies',
    slug: 'nextjs-16-edge-optimization-zero-downtime',
    excerpt: 'How we achieve sub-100ms TTFB globally using hybrid ISR caching, Turbopack optimizations, and containerized Docker clusters.',
    publishedAt: '2026-08-10T12:00:00Z',
    readTime: 5,
    categories: [{ title: 'Next.js & Full-Stack', color: '#00F0FF' }],
  },
  {
    _id: 'sample-3',
    title: 'Designing Real-Time IoT Telemetry with MQTT, Python & Custom Hardware',
    slug: 'real-time-iot-telemetry-mqtt-python',
    excerpt: 'Engineering low-latency sensor monitoring systems for patent-pending medical vaccine preservation boxes with cellular failover.',
    publishedAt: '2026-07-28T09:30:00Z',
    readTime: 8,
    categories: [{ title: 'IoT & Embedded', color: '#4ADE80' }],
  },
];

export default function HomeBlogSection() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const containerRef = useRef(null);

  useEffect(() => {
    // Fetch live posts from Sanity
    let isMounted = true;
    async function fetchPosts() {
      try {
        const data = await client.fetch(POSTS_QUERY);
        if (isMounted && Array.isArray(data)) {
          setPosts(data.slice(0, 3));
        }
      } catch {
        // Silently handle fetch error if Sanity API is unreachable
      } finally {
        if (isMounted) setLoading(false);
      }
    }
    fetchPosts();
    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const revealEl = containerRef.current?.querySelector('.reveal');
    let titleTrigger;
    if (revealEl) {
      titleTrigger = gsap.fromTo(
        revealEl,
        { opacity: 0, y: 35 },
        {
          opacity: 1,
          y: 0,
          duration: 0.85,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: revealEl,
            start: 'top 85%',
            toggleActions: 'play none none none',
          },
        }
      );
    }

    const gridEl = containerRef.current?.querySelector('.home-blog-grid');
    let staggerTrigger;
    if (gridEl) {
      const children = gridEl.querySelectorAll('.home-blog-card');
      if (children && children.length > 0) {
        staggerTrigger = gsap.fromTo(
          children,
          { opacity: 0, y: 30 },
          {
            opacity: 1,
            y: 0,
            duration: 0.7,
            stagger: 0.12,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: gridEl,
              start: 'top 80%',
              toggleActions: 'play none none none',
            },
          }
        );
      }
    }

    return () => {
      titleTrigger?.scrollTrigger?.kill();
      titleTrigger?.kill();
      staggerTrigger?.scrollTrigger?.kill();
      staggerTrigger?.kill();
    };
  }, [posts]);

  if (!loading && posts.length === 0) {
    return null;
  }

  return (
    <section id="blog-section" className="section" ref={containerRef}>
      <div className="site-container">
        {/* Section Header */}
        <div style={{ marginBottom: '3rem' }} className="reveal">
          <div className="s-label">
            <span style={{ color: 'var(--red)' }}>●</span> Articles & Engineering Notes
          </div>
          <h2 className="section-title">Latest from the Blog</h2>
          <p className="section-subtitle">
            Insights on backend architecture, system design, DevOps pipelines, IoT telemetry, and modern full-stack development.
          </p>
        </div>

        {/* 3-Column Responsive Blog Cards */}
        <div className="home-blog-grid">
          {posts.map((post) => {
            const category = post.categories?.[0]?.title || 'Engineering';
            const categoryColor = post.categories?.[0]?.color || '#E63946';
            const postDate = post.publishedAt
              ? new Date(post.publishedAt).toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric',
                })
              : 'Recent';

            return (
              <article key={post._id} className="home-blog-card">
                {/* Optional Cover Image if available */}
                {post.mainImage?.asset?.url && (
                  <div className="home-blog-thumb">
                    <Image
                      src={post.mainImage.asset.url}
                      alt={post.mainImage.alt || post.title}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, 33vw"
                    />
                  </div>
                )}

                <div className="home-blog-body">
                  <div className="home-blog-meta">
                    <span className="home-blog-cat" style={{ borderColor: `${categoryColor}40`, color: categoryColor }}>
                      {category}
                    </span>
                    <span className="home-blog-date mono muted">
                      {postDate} {post.readTime ? `· ${post.readTime} min read` : ''}
                    </span>
                  </div>

                  <h3 className="home-blog-title">
                    <Link href={`/blog/${post.slug || '#'}`}>{post.title}</Link>
                  </h3>

                  {post.excerpt && <p className="home-blog-desc">{post.excerpt}</p>}

                  <div className="home-blog-footer">
                    <Link href={`/blog/${post.slug || '#'}`} className="home-blog-readmore">
                      <span>Read Article</span>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="5" y1="12" x2="19" y2="12" />
                        <polyline points="12 5 19 12 12 19" />
                      </svg>
                    </Link>
                  </div>
                </div>
              </article>
            );
          })}
        </div>

        {/* Separated Dedicated Button at the bottom */}
        <div className="home-blog-cta-wrap reveal">
          <Link href="/blog" className="home-blog-cta-btn">
            <span>Explore All Articles & Publications</span>
            <span className="cta-arrow">→</span>
          </Link>
        </div>
      </div>
    </section>
  );
}
