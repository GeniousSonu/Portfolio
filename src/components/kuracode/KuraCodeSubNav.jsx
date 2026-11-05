'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import styles from '@/app/extensions/kuracode/kuracode.module.css';

const NAV_LINKS = [
  { href: '/extensions/kuracode', label: 'Overview' },
  { href: '/extensions/kuracode/install', label: 'Install' },
  { href: '/extensions/kuracode/docs', label: 'Docs' },
  { href: '/extensions/kuracode/demo', label: 'Demo' },
  { href: '/extensions/kuracode/faq', label: 'FAQ' },
  { href: '/extensions/kuracode/roadmap', label: 'Roadmap' },
  { href: '/extensions/kuracode/changelog', label: 'Changelog' },
  { href: '/extensions/kuracode/support', label: 'Support' },
];

export default function KuraCodeSubNav() {
  const pathname = usePathname();

  return (
    <nav className={styles.subnav} aria-label="KuraCode Product Navigation">
      <Link href="/extensions/kuracode" className={styles.subnavBrand}>
        <Image
          src="/assets/kuracode/kuracode-icon.svg"
          alt="KuraCode Logo"
          width={24}
          height={24}
          priority
        />
        <span>KuraCode</span>
      </Link>

      <ul className={styles.subnavLinks}>
        {NAV_LINKS.map((link) => {
          const isActive =
            link.href === '/extensions/kuracode'
              ? pathname === '/extensions/kuracode'
              : pathname.startsWith(link.href);

          return (
            <li key={link.href}>
              <Link
                href={link.href}
                className={`${styles.subnavLink} ${isActive ? styles.subnavLinkActive : ''}`}
              >
                {link.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
