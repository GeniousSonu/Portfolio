"use client";
import React, { useEffect, useState, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Initial post snapshot from Sanity to guarantee immediate rendering without blank state
const INITIAL_POSTS = [
  {
    _id: '02ef00a0-f9df-422b-9ed5-52836792471e',
    title: "How to Become a Hacker Without Certificates: A Beginner's Roadmap to Ethical Hacking",
    slug: 'how-to-become-a-hacker-without-certificates',
    excerpt:
      "You don't need expensive certifications or a computer science degree to start learning ethical hacking. This beginner-friendly roadmap explains the fundamental skills, tools, mindset, and practical steps needed to begin your journey into cybersecurity and ethical hacking.",
    publishedAt: '2026-09-02T07:19:42.949Z',
    readTime: 5,
    featured: true,
    mainImage: {
      alt: 'A Young curious boy looking Terminal style Matrix grid',
      asset: {
        _id: 'image-9cda1c6298d7686a344f071deced1214aedfb629-7952x5304-jpg',
        url: 'https://cdn.sanity.io/images/zt9wetk3/production/9cda1c6298d7686a344f071deced1214aedfb629-7952x5304.jpg',
      },
    },
    author: {
      _id: 'ff78b7fe-f43c-4364-a32a-315f122d5ff6',
      name: 'Mr Bettle',
      role: 'Security Researcher',
    },
    categories: [
      {
        _id: '4ba3adce-af1e-4fc9-ae7a-56d72e1dd741',
        title: 'Cyber Security',
        slug: 'cyber-security',
        color: '#06b6d4',
      },
    ],
  },
];

export default function HomeBlogSection() {
  const [posts, setPosts] = useState(INITIAL_POSTS);
  const [totalCount, setTotalCount] = useState(INITIAL_POSTS.length);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);
  const containerRef = useRef(null);
  const carouselRef = useRef(null);

// Fetch up to 10 live articles from our internal server API
  useEffect(() => {
    let isMounted = true;
    async function fetchPosts() {
      try {
        const res = await fetch('/api/posts');
        if (!res.ok) return;
        const result = await res.json();
        if (isMounted && result?.posts && Array.isArray(result.posts) && result.posts.length > 0) {
          setPosts(result.posts.slice(0, 10));
          setTotalCount(result.posts.length);
        }
      } catch (err) {
        console.warn('Could not fetch latest posts from /api/posts, using cached snapshot:', err?.message || err);
      }
    }
    fetchPosts();
    return () => {
      isMounted = false;
    };
  }, []);

  // Update scroll arrow states
  const checkScrollState = () => {
    const el = carouselRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 10);
    setCanScrollRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 10);
  };

  useEffect(() => {
    const el = carouselRef.current;
    if (!el) return;
    checkScrollState();
    el.addEventListener('scroll', checkScrollState, { passive: true });
    window.addEventListener('resize', checkScrollState, { passive: true });
    return () => {
      el.removeEventListener('scroll', checkScrollState);
      window.removeEventListener('resize', checkScrollState);
    };
  }, [posts]);

  const scrollPrev = () => {
    if (carouselRef.current) {
      carouselRef.current.scrollBy({ left: -360, behavior: 'smooth' });
    }
  };

  const scrollNext = () => {
    if (carouselRef.current) {
      carouselRef.current.scrollBy({ left: 360, behavior: 'smooth' });
    }
  };

  // GSAP reveal triggers
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      const revealEl = containerRef.current?.querySelector('.reveal');
      if (revealEl) {
        gsap.fromTo(
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
    }, containerRef);

    return () => {
      ctx.revert();
    };
  }, [posts]);

  const isSingle = posts.length === 1;

  return (
    <section id="blog-section" className="section" ref={containerRef}>
      <div className="site-container">
        {/* Section Header Row with Desktop Carousel Arrows */}
        <div className="home-blog-header-row reveal">
          <div className="home-blog-header-text">
            <div className="s-label">
              <span style={{ color: 'var(--red)' }}>●</span> Articles &amp; Engineering Notes
            </div>
            <h2 className="section-title">Latest from the Blog</h2>
            <p className="section-subtitle">
              Insights on backend architecture, system design, cybersecurity roadmaps, and modern full-stack engineering.
            </p>
          </div>

          {/* Desktop Navigation Arrows (hidden on single post) */}
          {!isSingle && (
            <div className="home-blog-nav-arrows" aria-label="Article carousel navigation">
              <button
                type="button"
                onClick={scrollPrev}
                disabled={!canScrollLeft}
                className="home-blog-arrow-btn"
                aria-label="Scroll to previous article"
                title="Previous articles"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="19" y1="12" x2="5" y2="12" />
                  <polyline points="12 19 5 12 12 5" />
                </svg>
              </button>
              <button
                type="button"
                onClick={scrollNext}
                disabled={!canScrollRight}
                className="home-blog-arrow-btn"
                aria-label="Scroll to next article"
                title="Next articles"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="5" y1="12" x2="19" y2="12" />
                  <polyline points="12 5 19 12 12 19" />
                </svg>
              </button>
            </div>
          )}
        </div>

        {/* Mobile Swipe Hint Badge */}
        {!isSingle && (
          <div className="certs-swipe-hint" aria-hidden="true" style={{ marginBottom: '1.25rem' }}>
            <span>← Swipe to explore articles →</span>
          </div>
        )}

        {/* Horizontal Carousel Track */}
        <div className="home-blog-scroll-wrapper">
          <div
            ref={carouselRef}
            className={`home-blog-carousel ${isSingle ? 'is-single' : ''}`}
            role="region"
            aria-label="Blog posts carousel"
          >
            {posts.map((post) => {
              const category = post.categories?.[0]?.title || 'Engineering';
              const categoryColor = post.categories?.[0]?.color || '#06b6d4';
              const postDate = post.publishedAt
                ? new Date(post.publishedAt).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric',
                  })
                : 'Recent';

              return (
                <article key={post._id} className="home-blog-card">
                  {/* Cover Image */}
                  <div className="home-blog-thumb">
                    {post.mainImage?.asset?.url ? (
                      <Image
                        src={post.mainImage.asset.url}
                        alt={post.mainImage.alt || post.title}
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 85vw, 360px"
                      />
                    ) : (
                      <div className="home-blog-thumb-fallback">
                        <span className="mono muted">ARTICLE</span>
                      </div>
                    )}
                  </div>

                  <div className="home-blog-body">
                    <div className="home-blog-meta">
                      <span
                        className="home-blog-cat"
                        style={{ borderColor: `${categoryColor}50`, color: categoryColor }}
                      >
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
        </div>

        {/* Dedicated Explore Button for all blogs */}
        <div className="home-blog-cta-wrap reveal">
          <Link href="/blog" className="home-blog-cta-btn">
            <span>Explore All Articles {totalCount > 1 ? `(${totalCount})` : ''}</span>
            <span className="cta-arrow">→</span>
          </Link>
        </div>
      </div>
    </section>
  );
}
