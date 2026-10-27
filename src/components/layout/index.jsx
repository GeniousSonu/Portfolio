import React from 'react';
import Link from 'next/link';
import Navbar from '../Navbar';
import Footer from '../Footer';
import styles from './layout.module.css';

/**
 * Universal Page Shell (React Server Component)
 * Provides consistent navbar, main content boundaries, and footer wrapper.
 */
export function PageShell({ children, showNavbar = false, showFooter = false, className = '', dataRoute }) {
  return (
    <div className={`${styles.shell} ${className}`.trim()}>
      {showNavbar && <Navbar />}
      <main className={styles.mainContent} data-route={dataRoute}>
        {children}
      </main>
      {showFooter && <Footer />}
    </div>
  );
}

/**
 * Shared Page Header (React Server Component)
 */
export function PageHeader({ eyebrow, title, summary, meta, className = '' }) {
  return (
    <header className={`${styles.header} ${className}`.trim()}>
      <div className={styles.container}>
        <div className={styles.headerInner}>
          {eyebrow && (
            <div className={styles.eyebrow}>
              <span className={styles.eyebrowDot} aria-hidden="true" />
              <span>{eyebrow}</span>
            </div>
          )}
          <h1 className={styles.title}>{title}</h1>
          {summary && <p className={styles.summary}>{summary}</p>}
          {meta && <div className={styles.metaSlot}>{meta}</div>}
        </div>
      </div>
    </header>
  );
}

/**
 * Shared Container (React Server Component)
 */
export function Container({ children, size = 'default', className = '' }) {
  const sizeClass = size === 'narrow' ? styles.containerNarrow : size === 'wide' ? styles.containerWide : '';
  return (
    <div className={`${styles.container} ${sizeClass} ${className}`.trim()}>
      {children}
    </div>
  );
}

/**
 * Shared Section (React Server Component)
 */
export function Section({ children, bordered = false, className = '', id }) {
  return (
    <section id={id} className={`${styles.section} ${bordered ? styles.sectionBordered : ''} ${className}`.trim()}>
      {children}
    </section>
  );
}

/**
 * Standard Page Stub Component (React Server Component)
 * Clean "Under Construction" template for pending routes.
 */
export function PageStub({ title, summary, status = 'stub', routeHref = '/' }) {
  return (
    <Container>
      <div className={styles.stubWrapper}>
        <div className={styles.stubBadge}>
          <span className={styles.stubBadgeDot} aria-hidden="true" />
          <span>Status: {status.toUpperCase()}</span>
        </div>

        <div className={styles.stubCard}>
          <h2 className={styles.stubTitle}>{title}</h2>
          <p className={styles.stubDesc}>
            {summary || 'This section is currently being architected as part of the Phase R0 skeleton. Complete content and system telemetry will be deployed in an upcoming release cycle.'}
          </p>

          <div className={styles.stubActions}>
            <Link href="/" className={styles.stubBackBtn}>
              <span>← Return to Operator Console</span>
            </Link>
            <Link href="/site-index" className={styles.stubIndexBtn}>
              <span>View Site Topology Index</span>
            </Link>
          </div>
        </div>
      </div>
    </Container>
  );
}
