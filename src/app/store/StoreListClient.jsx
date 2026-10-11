'use client';

import React, { useState, useMemo } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { getOptimizedImageUrl } from '@/sanity/image';
import styles from './store.module.css';

// Tech Hardware SVG Illustrations
function TechIcon({ type }) {
  switch (type) {
    case 'cpu':
      return (
        <svg className={styles.techIconSvg} width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <rect x="4" y="4" width="16" height="16" rx="2" />
          <rect x="9" y="9" width="6" height="6" />
          <line x1="9" y1="1" x2="9" y2="4" /><line x1="15" y1="1" x2="15" y2="4" />
          <line x1="9" y1="20" x2="9" y2="23" /><line x1="15" y1="20" x2="15" y2="23" />
          <line x1="20" y1="9" x2="23" y2="9" /><line x1="20" y1="15" x2="23" y2="15" />
          <line x1="1" y1="9" x2="4" y2="9" /><line x1="1" y1="15" x2="4" y2="15" />
        </svg>
      );
    case 'gpu':
      return (
        <svg className={styles.techIconSvg} width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <rect x="2" y="6" width="20" height="12" rx="2" />
          <circle cx="8" cy="12" r="2.5" />
          <circle cx="16" cy="12" r="2.5" />
          <line x1="6" y1="2" x2="6" y2="6" /><line x1="10" y1="2" x2="10" y2="6" />
          <line x1="14" y1="2" x2="14" y2="6" /><line x1="18" y1="2" x2="18" y2="6" />
        </svg>
      );
    case 'monitor':
      return (
        <svg className={styles.techIconSvg} width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <rect x="2" y="3" width="20" height="14" rx="2" />
          <line x1="8" y1="21" x2="16" y2="21" />
          <line x1="12" y1="17" x2="12" y2="21" />
        </svg>
      );
    case 'ssd':
      return (
        <svg className={styles.techIconSvg} width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="4" width="18" height="16" rx="2" />
          <line x1="7" y1="8" x2="11" y2="8" />
          <circle cx="16" cy="16" r="1.5" />
          <line x1="7" y1="12" x2="17" y2="12" />
        </svg>
      );
    case 'hdd':
      return (
        <svg className={styles.techIconSvg} width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <rect x="4" y="2" width="16" height="20" rx="2" />
          <circle cx="12" cy="14" r="4" />
          <circle cx="12" cy="14" r="1" />
          <line x1="6" y1="6" x2="6.01" y2="6" />
        </svg>
      );
    case 'ram':
      return (
        <svg className={styles.techIconSvg} width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <rect x="2" y="7" width="20" height="10" rx="1" />
          <line x1="6" y1="17" x2="6" y2="20" /><line x1="9" y1="17" x2="9" y2="20" />
          <line x1="12" y1="17" x2="12" y2="20" /><line x1="15" y1="17" x2="15" y2="20" />
          <line x1="18" y1="17" x2="18" y2="20" />
          <rect x="5" y="10" width="3" height="4" />
          <rect x="10" y="10" width="4" height="4" />
          <rect x="16" y="10" width="3" height="4" />
        </svg>
      );
    case 'phone':
      return (
        <svg className={styles.techIconSvg} width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <rect x="5" y="2" width="14" height="20" rx="2.5" />
          <line x1="12" y1="18" x2="12.01" y2="18" />
        </svg>
      );
    case 'motherboard':
      return (
        <svg className={styles.techIconSvg} width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <rect x="2" y="2" width="20" height="20" rx="2" />
          <rect x="6" y="6" width="6" height="6" />
          <line x1="15" y1="6" x2="18" y2="6" /><line x1="15" y1="9" x2="18" y2="9" />
          <line x1="6" y1="15" x2="18" y2="15" /><line x1="6" y1="18" x2="14" y2="18" />
        </svg>
      );
    default:
      return (
        <svg className={styles.techIconSvg} width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <rect x="2" y="3" width="20" height="14" rx="2" />
          <line x1="8" y1="21" x2="16" y2="21" />
          <line x1="12" y1="17" x2="12" y2="21" />
        </svg>
      );
  }
}

export default function StoreListClient({ initialProducts = [] }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  // Extract unique categories dynamically from the products list
  const categories = useMemo(() => {
    const set = new Set();
    initialProducts.forEach((product) => {
      if (product.category) set.add(product.category);
    });
    return ['All', ...Array.from(set)];
  }, [initialProducts]);

  // Filter products based on search query and selected category
  const filteredProducts = useMemo(() => {
    return initialProducts.filter((product) => {
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        q === '' ||
        product.name?.toLowerCase().includes(q) ||
        product.description?.toLowerCase().includes(q) ||
        product.specs?.toLowerCase().includes(q) ||
        product.badge?.toLowerCase().includes(q);

      const matchesCategory =
        selectedCategory === 'All' ||
        product.category?.toLowerCase() === selectedCategory.toLowerCase();

      return matchesSearch && matchesCategory;
    });
  }, [initialProducts, searchQuery, selectedCategory]);

  return (
    <>
      {/* Controls: Search and Category Tabs */}
      {initialProducts.length > 0 && (
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
              aria-hidden="true"
            >
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
            <input
              type="text"
              className={styles.searchInput}
              placeholder="Search CPU, GPU, 4K monitors, storage..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              aria-label="Search products"
            />
          </div>

          {categories.length > 1 && (
            <div className={styles.categories} role="tablist" aria-label="Product categories">
              {categories.map((category) => (
                <button
                  key={category}
                  type="button"
                  role="tab"
                  aria-selected={selectedCategory === category}
                  className={`${styles.categoryBtn} ${
                    selectedCategory === category ? styles.categoryBtnActive : ''
                  }`}
                  onClick={() => setSelectedCategory(category)}
                >
                  {category}
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Products Grid */}
      {filteredProducts.length > 0 ? (
        <div className={styles.grid}>
          {filteredProducts.map((product) => {
            const imageUrl = product.image ? getOptimizedImageUrl(product.image, 640, 85) : null;
            const imageAlt = product.image?.alt || product.name || 'Product recommendation';
            const hasAffiliateLink = Boolean(product.affiliateUrl && product.affiliateUrl.trim().length > 0);

            return (
              <article key={product._id} className={styles.card}>
                <div className={styles.imageWrapper}>
                  {product.badge ? (
                    <span className={styles.featuredBadge}>{product.badge}</span>
                  ) : product.featured ? (
                    <span className={styles.featuredBadge}>TOP PICK</span>
                  ) : null}

                  {product.category && (
                    <span className={styles.categoryTag}>{product.category}</span>
                  )}

                  {imageUrl ? (
                    <Image
                      src={imageUrl}
                      alt={imageAlt}
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      className={styles.productImage}
                    />
                  ) : (
                    <div className={styles.techIconBox}>
                      <TechIcon type={product.icon || 'monitor'} />
                      <span className={styles.techIconLabel}>{product.category || 'Hardware'}</span>
                    </div>
                  )}
                </div>

                <div className={styles.cardBody}>
                  <h2 className={styles.productName}>{product.name}</h2>

                  {product.specs && (
                    <span className={styles.specsText}>{product.specs}</span>
                  )}

                  <p className={styles.productDescription}>{product.description}</p>

                  <div className={styles.cardFooter}>
                    <div className={styles.priceTag}>
                      <span className={styles.priceLabel}>Status / Store</span>
                      <span className={styles.priceValue}>{product.price || 'Verified Gear'}</span>
                    </div>

                    {hasAffiliateLink ? (
                      <a
                        href={product.affiliateUrl}
                        target="_blank"
                        rel="noopener noreferrer sponsored"
                        className={styles.buyBtn}
                        aria-label={`Buy ${product.name} on Amazon (opens in new tab)`}
                      >
                        <span>Check on Amazon</span>
                        <svg
                          className={styles.externalIcon}
                          width="14"
                          height="14"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          aria-hidden="true"
                        >
                          <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                          <polyline points="15 3 21 3 21 9" />
                          <line x1="10" y1="14" x2="21" y2="3" />
                        </svg>
                      </a>
                    ) : (
                      <span
                        className={styles.noLinkBtn}
                        title="Personal equipment in daily rig — Amazon affiliate link will be added soon"
                      >
                        <span style={{ color: '#10B981', marginRight: '4px' }}>●</span>
                        Personal Rig · Link Pending
                      </span>
                    )}
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      ) : (
        /* Empty State */
        <div className={styles.emptyState}>
          <div className={styles.emptyIcon} aria-hidden="true">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="2" y="3" width="20" height="14" rx="2" />
              <line x1="8" y1="21" x2="16" y2="21" />
              <line x1="12" y1="17" x2="12" y2="21" />
            </svg>
          </div>
          <h2 className={styles.emptyTitle}>No matching gear found</h2>
          <p className={styles.emptyDesc}>
            No hardware items matched &quot;{searchQuery}&quot;. Try selecting &quot;All&quot; categories or clearing your search filter.
          </p>
          <Link href="/" className={styles.homeBtn}>
            <span>Back to Portfolio</span>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="5" y1="12" x2="19" y2="12" />
              <polyline points="12 5 19 12 12 19" />
            </svg>
          </Link>
        </div>
      )}
    </>
  );
}
