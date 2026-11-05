import React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import MarkdownIt from 'markdown-it';
import styles from '../../kuracode.module.css';
import { KURACODE_DOCS } from '@/data/kuracode/docs';

const md = new MarkdownIt({
  html: false,
  linkify: true,
  typographer: false,
});

export async function generateStaticParams() {
  return KURACODE_DOCS.map((doc) => ({ slug: doc.slug }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const doc = KURACODE_DOCS.find((d) => d.slug === slug);
  if (!doc) return {};

  return {
    title: `${doc.title} — KuraCode Docs`,
    description: doc.shortDesc,
    alternates: {
      canonical: `https://genioussonu.me/extensions/kuracode/docs/${slug}`,
    },
  };
}

export default async function DocTopicPage({ params }) {
  const { slug } = await params;
  const doc = KURACODE_DOCS.find((d) => d.slug === slug);

  if (!doc) {
    notFound();
  }

  return (
    <div className="max-w-4xl mx-auto py-8">
      {/* Breadcrumbs */}
      <nav className={styles.breadcrumbs} aria-label="Breadcrumb">
        <Link href="/extensions/kuracode" className={styles.breadcrumbLink}>KuraCode</Link>
        <span className={styles.breadcrumbSeparator}>/</span>
        <Link href="/extensions/kuracode/docs" className={styles.breadcrumbLink}>Docs</Link>
        <span className={styles.breadcrumbSeparator}>/</span>
        <span className={styles.breadcrumbCurrent}>{doc.title}</span>
      </nav>

      <article className="p-8 md:p-10 rounded-2xl border border-border bg-surface-1">
        <header className="mb-8 border-b border-border pb-6">
          <h1 className="text-3xl font-extrabold text-text-primary mb-3">
            {doc.title}
          </h1>
          <p className="text-base text-text-muted">
            {doc.shortDesc}
          </p>
        </header>

        <div
          className="prose prose-invert max-w-none text-text-primary text-sm leading-relaxed space-y-4 font-sans"
          dangerouslySetInnerHTML={{ __html: md.render(doc.content.trim()) }}
        />

        <footer className="mt-12 pt-6 border-t border-border flex justify-between items-center text-xs font-mono text-text-muted">
          <Link href="/extensions/kuracode/docs" className="text-gold hover:underline">
            ← Back to all guides
          </Link>
          <span>Applies to KuraCode 0.1.0-preview</span>
        </footer>
      </article>
    </div>
  );
}

