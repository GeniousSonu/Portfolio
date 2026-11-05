import React from 'react';
import styles from './kuracode.module.css';
import KuraCodeSubNav from '@/components/kuracode/KuraCodeSubNav';
import KuraCodeFooter from '@/components/kuracode/KuraCodeFooter';

export const metadata = {
  title: {
    default: 'KuraCode — Save code from anywhere on the web in one click',
    template: '%s | KuraCode',
  },
  description:
    'KuraCode is a local-first browser extension for developers to capture, annotate, clean, search, and organize code snippets with source provenance.',
  icons: {
    icon: '/assets/kuracode/favicon.svg',
    apple: '/assets/kuracode/apple-touch-icon-180x180.png',
  },
  robots: {
    index: false,
    follow: true,
  },
  openGraph: {
    images: [{ url: '/assets/kuracode/og-kuracode.png', width: 1200, height: 630, alt: 'KuraCode' }],
  },
};

export default function KuraCodeLayout({ children }) {
  return (
    <div className={styles.wrapper}>
      <div className={styles.ambientGlow} aria-hidden="true" />
      <div className={styles.container}>
        <KuraCodeSubNav />
        {children}
        <KuraCodeFooter />
      </div>
    </div>
  );
}
