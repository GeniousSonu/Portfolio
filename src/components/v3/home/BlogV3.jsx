'use client';

import React, { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useChapterReveal } from '../motion';

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
      },
    ],
  },
];

function Arrow({ direction }) {
  return (
    <svg
      viewBox="0 0 24 24"
      width="18"
      height="18"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {direction === 'prev' ? (
        <>
          <line x1="19" y1="12" x2="5" y2="12" />
          <polyline points="12 19 5 12 12 5" />
        </>
      ) : (
        <>
          <line x1="5" y1="12" x2="19" y2="12" />
          <polyline points="12 5 19 12 12 19" />
        </>
      )}
    </svg>
  );
}

function BlogThumb({ post }) {
  const [failed, setFailed] = useState(false);
  const url = post.mainImage?.asset?.url;

  if (!url || failed) {
    return (
      <div className="v3-blog-thumb v3-blog-thumb--fallback">
        <span className="v3-label">{post.categories?.[0]?.title || 'Article'}</span>
      </div>
    );
  }

  return (
    <div className="v3-blog-thumb">
      <Image
        src={url}
        alt={post.mainImage.alt || post.title}
        fill
        sizes="(max-width: 640px) 86vw, (max-width: 1100px) 46vw, 360px"
        onError={() => setFailed(true)}
      />
    </div>
  );
}

export default function BlogV3() {
  const rootRef = useRef(null);
  const carouselRef = useRef(null);
  const [posts, setPosts] = useState(INITIAL_POSTS);
  const [totalCount, setTotalCount] = useState(INITIAL_POSTS.length);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);
  useChapterReveal(rootRef);

  useEffect(() => {
    let isMounted = true;

    async function fetchPosts() {
      try {
        const res = await fetch('/api/posts');
        if (!res.ok) return;
        const result = await res.json();
        if (isMounted && Array.isArray(result?.posts) && result.posts.length > 0) {
          setPosts(result.posts.slice(0, 10));
          setTotalCount(result.posts.length);
        }
      } catch (error) {
        if (process.env.NODE_ENV !== 'production') {
          console.warn('Using cached blog snapshot:', error?.message || error);
        }
      }
    }

    fetchPosts();
    return () => {
      isMounted = false;
    };
  }, []);

  const updateArrows = () => {
    const el = carouselRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 10);
    setCanScrollRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 10);
  };

  useEffect(() => {
    const el = carouselRef.current;
    if (!el) return undefined;
    updateArrows();
    el.addEventListener('scroll', updateArrows, { passive: true });
    window.addEventListener('resize', updateArrows);
    return () => {
      el.removeEventListener('scroll', updateArrows);
      window.removeEventListener('resize', updateArrows);
    };
  }, [posts]);

  const scrollBy = (delta) => {
    carouselRef.current?.scrollBy({ left: delta, behavior: 'smooth' });
  };

  const isSingle = posts.length === 1;

  return (
    <section
      id="blog-section"
      className="v3-interlude v3-blog"
      ref={rootRef}
      aria-labelledby="blog-title"
    >
      <span id="blog" className="v3-anchor" aria-hidden="true" />
      <div className="v3-shell">
        <header className="v3-blog-head" data-reveal>
          <div>
            <span className="v3-label v3-label--dot">Articles &amp; Engineering Notes</span>
            <h2 id="blog-title" className="v3-interlude-title">
              Latest from the Blog
            </h2>
            <p className="v3-interlude-lede">
              Insights on backend architecture, system design, cybersecurity roadmaps, and modern
              full-stack engineering.
            </p>
          </div>

          {!isSingle && (canScrollLeft || canScrollRight) ? (
            <div className="v3-blog-arrows" aria-label="Article carousel navigation">
              <button
                type="button"
                className="v3-arrow-btn"
                onClick={() => scrollBy(-360)}
                disabled={!canScrollLeft}
                aria-label="Scroll to previous article"
              >
                <Arrow direction="prev" />
              </button>
              <button
                type="button"
                className="v3-arrow-btn"
                onClick={() => scrollBy(360)}
                disabled={!canScrollRight}
                aria-label="Scroll to next article"
              >
                <Arrow direction="next" />
              </button>
            </div>
          ) : null}
        </header>

        <p className="v3-swipe-hint" aria-hidden="true">
          ← Swipe to explore articles →
        </p>

        <div className="v3-blog-rail" data-lenis-prevent>
          <div
            className={`v3-blog-track ${isSingle ? 'is-single' : ''}`}
            ref={carouselRef}
            role="region"
            aria-label="Blog posts carousel"
          >
            {posts.map((post) => {
              const category = post.categories?.[0]?.title || 'Engineering';
              const postUrl = `/blog/${post.slug || ''}`;
              const postDate = post.publishedAt
                ? new Date(post.publishedAt).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric',
                  })
                : 'Recent';

              return (
                <article className="v3-blog-card" key={post._id}>
                  <BlogThumb post={post} />

                  <div className="v3-blog-body">
                    <div className="v3-blog-meta">
                      <span className="v3-blog-cat">{category}</span>
                      <span className="v3-blog-date">
                        {postDate}
                        {post.readTime ? ` · ${post.readTime} min read` : ''}
                      </span>
                    </div>

                    <h3 className="v3-blog-title">
                      <Link href={postUrl} className="v3-blog-link" data-v3-sound="confirm">
                        {post.title}
                      </Link>
                    </h3>

                    {post.excerpt ? <p className="v3-blog-desc">{post.excerpt}</p> : null}

                    <span className="v3-blog-read">
                      Read Article <span aria-hidden="true">→</span>
                    </span>
                  </div>
                </article>
              );
            })}
          </div>
        </div>

        <div className="v3-blog-cta" data-reveal>
          <Link href="/blog" className="v3-project-action" data-v3-sound="confirm">
            Explore All Articles{totalCount > 1 ? ` (${totalCount})` : ''}
            <span aria-hidden="true">→</span>
          </Link>
        </div>
      </div>
    </section>
  );
}
