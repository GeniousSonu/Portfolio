'use client';

import React, { useState, useMemo } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { getOptimizedImageUrl } from '@/sanity/image';
import styles from './store.module.css';

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
      const matchesSearch =
        searchQuery.trim() === '' ||
        product.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.description?.toLowerCase().includes(searchQuery.toLowerCase());

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
              placeholder="Search gear, tools, or books..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              aria-label="Search products"
            />
          </div>

          {categories.length > 2 && (
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
            const imageUrl = getOptimizedImageUrl(product.image, 640, 85);
            const imageAlt = product.image?.alt || product.name || 'Product recommendation';

            return (
              <article key={product._id} className={styles.card}>
                <div className={styles.imageWrapper}>
                  {product.featured && (
                    <span className={styles.featuredBadge}>TOP PICK</span>
                  )}
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
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: '100%',
                        height: '100%',
                        background: 'rgba(255,255,255,0.03)',
                        color: 'var(--text-muted, #64748b)',
                        fontSize: '0.85rem',
                      }}
                    >
                      Gear Preview
                    </div>
                  )}
                </div>

                <div className={styles.cardBody}>
                  <h2 className={styles.productName}>{product.name}</h2>
                  <p className={styles.productDescription}>{product.description}</p>

                  <div className={styles.cardFooter}>
                    <div className={styles.priceTag}>
                      <span className={styles.priceLabel}>Approx. Price</span>
                      <span className={styles.priceValue}>{product.price || 'Check Store'}</span>
                    </div>

                    <a
                      href={product.affiliateUrl}
                      target="_blank"
                      rel="noopener noreferrer sponsored"
                      className={styles.buyBtn}
                      aria-label={`Buy ${product.name} on external store (opens in new tab)`}
                    >
                      <span>Check Price</span>
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
          <h2 className={styles.emptyTitle}>
            {initialProducts.length === 0
              ? 'Curated Gear Coming Soon'
              : 'No matching gear found'}
          </h2>
          <p className={styles.emptyDesc}>
            {initialProducts.length === 0
              ? "I'm currently compiling my favorite developer tools, mechanical keyboards, monitors, and engineering reads. Check back shortly!"
              : `No items matched "${searchQuery}". Try selecting "All" categories or clearing your search.`}
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
