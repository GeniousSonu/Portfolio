'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import Image from 'next/image';
import styles from './OwnerPhotoStack.module.css';

const PHOTOS = [
  {
    id: 'owner-1',
    src: '/assets/owner/owner-1.webp',
    alt: 'SK Sahinur Islam portrait in studio lighting',
    caption: 'Kolkata Studio',
    blurDataURL:
      'data:image/webp;base64,UklGRtAAAABXRUJQVlA4IMQAAAAwBQCdASoYABgAPzmSv1mvKaajqAgB4CcJbACxHtpAnOVOesOLr5VvYVUAL8K84sj8QAD+vdOCbMeKFMw1NaBW3kqYnbdBikM4rYtUY72TVmq1gWeFuy2G5G0svIsH23qa7NR/Qer9mqEsrGJYP1BlLmYDunjIaa+93rFHxGmgD0WEPexjJ64LNWtffHXwi2GQj6MUK+TeA8Wr8bUMf3QbrXYR53zg4U+2ifHlRKi1CPhI48jVFmS799N6AOkRGttZMAAA',
  },
  {
    id: 'owner-2',
    src: '/assets/owner/owner-2.webp',
    alt: 'SK Sahinur Islam outdoor portrait',
    caption: 'Field & Workspace',
    blurDataURL:
      'data:image/webp;base64,UklGRpQAAABXRUJQVlA4IIgAAACwBACdASoYABgAPzl+uFOvJ6Uit/VYAeAnCWgAy0mAAYfSO2mbteUQqgB6QRuAAP7KqDDuQHkxDERDk6FNYQ2/qU/3r+Qx1RtKwwQWXv6Ler+/m/JS16aiGEV4Ds79Y6t/c44qGXfDr1+/oPm/JLVQaFbG5l3+hT2sopJkg/BGaz/dePmvAAAA',
  },
  {
    id: 'owner-3',
    src: '/assets/owner/owner-3.webp',
    alt: 'SK Sahinur Islam casual engineering portrait',
    caption: 'Architecture Review',
    blurDataURL:
      'data:image/webp;base64,UklGRn4AAABXRUJQVlA4IHIAAADwBACdASoYABgAPzmOuVavKaUjqA1R4CcJYwDFyBEc20iNcnF4Q63nI8u6Mlq0fAAA/ujMuOvzbxTWbMF6n6z5LcIahxozNCbcMbO0aUeXzmOklmLbgsSxHikNJs/uqOHUg/hlgTEEk6erUmp504gMAAA=',
  },
  {
    id: 'owner-4',
    src: '/assets/owner/owner-4.webp',
    alt: 'SK Sahinur Islam systems developer portrait',
    caption: 'Systems Development',
    blurDataURL:
      'data:image/webp;base64,UklGRnAAAABXRUJQVlA4IGQAAADwBACdASoYABgAPzmGvVavKCYjsBgIAeAnCWUAxzAQ7+/8S/MIa+Am++CqPRAK9AAA/ujabx/tXbpRYj5F5NCKeoJpeeEIX2eq2bESoACnJlup4beyY5+Bc0y5FOsYNSD4AAAA',
  },
];

// Visual rotation offsets for stacked cards
const ROTATIONS = [0, -3.5, 2.8, -2];

export default function OwnerPhotoStack() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const containerRef = useRef(null);
  const tiltRef = useRef(null);
  const touchStartX = useRef(0);
  const touchEndX = useRef(0);

  const total = PHOTOS.length;

  const nextPhoto = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % total);
  }, [total]);

  const prevPhoto = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + total) % total);
  }, [total]);

  // Observer for viewability
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting);
      },
      { threshold: 0.25 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  // Auto-advance: slow 6s interval, paused on hover/focus or when not visible or prefers-reduced-motion
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion || !isVisible || isPaused) return;

    const interval = setInterval(() => {
      nextPhoto();
    }, 6000);

    return () => clearInterval(interval);
  }, [isVisible, isPaused, nextPhoto]);

  // Keyboard navigation
  const handleKeyDown = (e) => {
    if (e.key === 'ArrowRight') {
      e.preventDefault();
      nextPhoto();
    } else if (e.key === 'ArrowLeft') {
      e.preventDefault();
      prevPhoto();
    }
  };

  // Touch swipe support
  const handleTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchMove = (e) => {
    touchEndX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = () => {
    const diff = touchStartX.current - touchEndX.current;
    if (Math.abs(diff) > 40) {
      if (diff > 0) {
        nextPhoto();
      } else {
        prevPhoto();
      }
    }
  };

  // Subtle 3D Pointer Tilt (desktop only, transform only)
  const handlePointerMove = (e) => {
    if (typeof window !== 'undefined' && window.matchMedia('(pointer: fine)').matches) {
      const el = tiltRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      const rotateX = -y * 8;
      const rotateY = x * 8;
      el.style.transform = `perspective(900px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg)`;
    }
  };

  const handlePointerLeave = () => {
    const el = tiltRef.current;
    if (el) {
      el.style.transform = 'perspective(900px) rotateX(0deg) rotateY(0deg)';
    }
    setIsPaused(false);
  };

  return (
    <div
      ref={containerRef}
      className={styles.stackContainer}
      onKeyDown={handleKeyDown}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={handlePointerLeave}
      onFocus={() => setIsPaused(true)}
      onBlur={() => setIsPaused(false)}
      onPointerMove={handlePointerMove}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      tabIndex={0}
      role="region"
      aria-label="Photo prints of SK Sahinur Islam, interactive shuffle stack"
    >
      <div className={styles.srLive} aria-live="polite">
        {`Showing photo ${currentIndex + 1} of ${total}: ${PHOTOS[currentIndex].alt}`}
      </div>

      <div ref={tiltRef} className={styles.tiltFrame}>
        <div className={styles.tapeTopLeft} aria-hidden="true" />
        <div className={styles.tapeTopRight} aria-hidden="true" />

        <div className={styles.cardsStack}>
          {PHOTOS.map((photo, index) => {
            // Position relative to current active index
            const offset = (index - currentIndex + total) % total;
            const isTop = offset === 0;
            const zIndex = total - offset;
            const rot = ROTATIONS[offset % ROTATIONS.length];
            const translateY = offset * 4;
            const scale = 1 - offset * 0.03;
            const opacity = offset > 2 ? 0 : 1;

            return (
              <div
                key={photo.id}
                className={styles.cardItem}
                style={{
                  zIndex,
                  transform: `translateY(${translateY}px) scale(${scale}) rotate(${rot}deg)`,
                  opacity,
                  pointerEvents: isTop ? 'auto' : 'none',
                }}
                onClick={nextPhoto}
                title="Click to shuffle to next print"
              >
                <div className={styles.imageWrapper}>
                  <Image
                    src={photo.src}
                    alt={photo.alt}
                    width={800}
                    height={800}
                    priority={index === 0}
                    placeholder="blur"
                    blurDataURL={photo.blurDataURL}
                    className={styles.photoImg}
                  />
                </div>
                <div className={styles.cardFooter}>
                  <span className={styles.photoLocation}>{photo.caption}</span>
                  <span className={styles.photoCounter}>
                    {index + 1} / {total}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Accessible Shuffling Controls */}
      <div className={styles.controlsBar}>
        <button
          type="button"
          onClick={prevPhoto}
          className={styles.navBtn}
          aria-label="Previous photo"
          title="Previous photo (Left arrow)"
        >
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <polyline points="15 18 9 12 15 6" />
          </svg>
        </button>

        <div className={styles.dotsWrapper} aria-hidden="true">
          {PHOTOS.map((_, dotIdx) => (
            <button
              key={dotIdx}
              type="button"
              className={`${styles.dotBtn} ${dotIdx === currentIndex ? styles.activeDot : ''}`}
              onClick={() => setCurrentIndex(dotIdx)}
              aria-label={`Go to photo ${dotIdx + 1}`}
              tabIndex={-1}
            />
          ))}
        </div>

        <button
          type="button"
          onClick={nextPhoto}
          className={styles.navBtn}
          aria-label="Next photo"
          title="Next photo (Right arrow or click print)"
        >
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <polyline points="9 18 15 12 9 6" />
          </svg>
        </button>
      </div>
    </div>
  );
}
