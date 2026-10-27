'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useSearchParams, useRouter } from 'next/navigation';
import { PROJECT_CATEGORIES } from '@/config/projectTaxonomy';
import styles from './projects.module.css';

export default function ProjectFilterClient({ initialProjects }) {
  const searchParams = useSearchParams();
  const router = useRouter();

  const urlCategory = searchParams?.get('category') || 'all';
  const [activeCategory, setActiveCategory] = useState(urlCategory);

  useEffect(() => {
    if (urlCategory && urlCategory !== activeCategory) {
      setActiveCategory(urlCategory);
    }
  }, [urlCategory, activeCategory]);

  const handleCategoryChange = (catId) => {
    setActiveCategory(catId);
    const params = new URLSearchParams(window.location.search);
    if (catId === 'all') {
      params.delete('category');
    } else {
      params.set('category', catId);
    }
    const queryString = params.toString();
    const newUrl = queryString ? `/projects?${queryString}` : '/projects';
    router.replace(newUrl, { scroll: false });
  };

  const filteredProjects = initialProjects.filter((proj) => {
    if (activeCategory === 'all') return true;
    return proj.categories?.includes(activeCategory);
  });

  // Calculate count for each category
  const categoryCounts = PROJECT_CATEGORIES.reduce((acc, cat) => {
    if (cat.id === 'all') {
      acc[cat.id] = initialProjects.length;
    } else {
      acc[cat.id] = initialProjects.filter((p) => p.categories?.includes(cat.id)).length;
    }
    return acc;
  }, {});

  return (
    <>
      <nav className={styles.filterBar} aria-label="Project category filter">
        {PROJECT_CATEGORIES.map((cat) => {
          const isActive = activeCategory === cat.id;
          const count = categoryCounts[cat.id] || 0;
          return (
            <button
              key={cat.id}
              type="button"
              onClick={() => handleCategoryChange(cat.id)}
              className={`${styles.filterChip} ${isActive ? styles.activeFilterChip : ''}`}
              aria-pressed={isActive}
            >
              <span>{cat.label}</span>
              <span className={styles.filterCount} aria-label={`${count} projects`}>
                {count}
              </span>
            </button>
          );
        })}
      </nav>

      <div className={styles.grid}>
        {filteredProjects.length === 0 ? (
          <div className={styles.emptyState}>
            No projects found in this discipline. Try selecting &ldquo;All Disciplines&rdquo;.
          </div>
        ) : (
          filteredProjects.map((proj) => {
            const isInternal = proj.link.startsWith('/');
            return (
              <article
                key={proj.slug}
                className={`${styles.card} ${proj.isPatent ? styles.cardFeatured : ''}`}
              >
                <div className={styles.cardTop}>
                  <div className={styles.cardMeta}>
                    <span className={styles.cardTag}>{proj.category}</span>
                    {proj.isPatent ? <span>IN 544062</span> : null}
                  </div>
                  <h2 className={styles.cardTitle}>{proj.title}</h2>
                  <p className={styles.cardDesc}>{proj.desc}</p>
                  <div className={styles.techStack}>
                    {proj.stack.map((tech) => (
                      <span key={tech} className={styles.techBadge}>
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <div className={styles.metricsRow}>
                    {proj.metrics.map((m) => (
                      <div key={m.label}>
                        <div className={styles.metricVal}>{m.val}</div>
                        <div className={styles.metricLbl}>{m.label}</div>
                      </div>
                    ))}
                  </div>

                  <div className={styles.actions}>
                    {proj.caseStudy ? (
                      <Link href={proj.caseStudy} className={styles.primaryBtn}>
                        Read Full Blueprint Case Study →
                      </Link>
                    ) : null}
                    {isInternal ? (
                      <Link
                        href={proj.link}
                        className={proj.caseStudy ? styles.secondaryBtn : styles.primaryBtn}
                      >
                        {proj.btnText} →
                      </Link>
                    ) : (
                      <a
                        href={proj.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={proj.caseStudy ? styles.secondaryBtn : styles.primaryBtn}
                      >
                        {proj.btnText} →
                      </a>
                    )}
                  </div>
                </div>
              </article>
            );
          })
        )}
      </div>
    </>
  );
}
