import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import styles from '../kuracode.module.css';
import { KURACODE_BRAND } from '@/data/kuracode/brand';

export const metadata = {
  title: 'KuraCode Brand Kit & Vector Assets',
  description: 'Download official KuraCode brand assets, logos, geometric icons, and review brand color guidelines.',
  alternates: {
    canonical: 'https://genioussonu.me/extensions/kuracode/brand',
  },
};

export default function BrandPage() {
  return (
    <div className="max-w-4xl mx-auto py-8">
      {/* Breadcrumbs */}
      <nav className={styles.breadcrumbs} aria-label="Breadcrumb">
        <Link href="/extensions/kuracode" className={styles.breadcrumbLink}>KuraCode</Link>
        <span className={styles.breadcrumbSeparator}>/</span>
        <span className={styles.breadcrumbCurrent}>Brand &amp; Press Kit</span>
      </nav>

      <div className="mb-12">
        <h1 className="text-3xl md:text-4xl font-extrabold text-text-primary mb-3">
          KuraCode Brand &amp; Assets
        </h1>
        <p className="text-base text-text-muted">
          Official SVG vectors, brand color palettes, and high-resolution marks for press and community mentions.
        </p>
      </div>

      {/* Brand Palette (Derived directly from SVG icon) */}
      <section className="p-8 rounded-2xl border border-border bg-surface-1 mb-12">
        <div className="flex justify-between items-center mb-6 pb-3 border-b border-border flex-wrap gap-2">
          <h2 className="text-xl font-bold text-text-primary">Color Palette</h2>
          <span className="text-xs font-mono text-gold bg-surface-2 px-2.5 py-1 rounded border border-border">
            {KURACODE_BRAND.derivedNotice}
          </span>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {KURACODE_BRAND.palette.map((color, idx) => (
            <div key={idx} className="p-4 rounded-xl border border-border bg-surface-2 flex flex-col gap-3">
              <div
                className="w-full h-14 rounded-lg border border-white/10"
                style={{ backgroundColor: color.hex }}
              />
              <div>
                <div className="font-bold text-text-primary text-sm">{color.name}</div>
                <div className="font-mono text-xs text-emerald-400 font-semibold">{color.hex}</div>
                <div className="text-xs text-text-muted mt-1">{color.role}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Downloads Grid */}
      <section className="p-8 rounded-2xl border border-border bg-surface-1">
        <h2 className="text-xl font-bold text-text-primary mb-6">Press Kit Downloads (Self-Hosted)</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {KURACODE_BRAND.downloads.map((item, idx) => (
            <div
              key={idx}
              className="p-4 rounded-xl border border-border bg-surface-2 flex items-center justify-between"
            >
              <div>
                <div className="font-bold text-text-primary text-sm">{item.label}</div>
                <div className="text-xs text-text-muted font-mono">{item.type} • Direct Download</div>
              </div>
              <a
                href={item.file}
                download
                className="px-3 py-1.5 rounded-lg bg-surface-1 hover:bg-emerald-500 hover:text-black transition-colors text-xs font-mono font-bold border border-border"
              >
                Download
              </a>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
