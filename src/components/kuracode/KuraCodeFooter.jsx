import React from 'react';
import Link from 'next/link';
import styles from '@/app/extensions/kuracode/kuracode.module.css';

const LEGAL_LINKS = [
  { href: '/extensions/kuracode/privacy', label: 'Privacy' },
  { href: '/extensions/kuracode/terms', label: 'Terms' },
  { href: '/extensions/kuracode/permissions', label: 'Permissions' },
  { href: '/extensions/kuracode/data', label: 'Data Policy' },
  { href: '/extensions/kuracode/security', label: 'Security' },
  { href: '/extensions/kuracode/licenses', label: 'Licenses' },
  { href: '/extensions/kuracode/accessibility', label: 'Accessibility' },
  { href: '/extensions/kuracode/cookies', label: 'Cookies' },
  { href: '/extensions/kuracode/brand', label: 'Brand & Assets' },
];

export default function KuraCodeFooter() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className={styles.productFooter} aria-label="KuraCode Product Footer">
      <div>
        <span>© {currentYear} KuraCode. Local-first developer tools.</span>
      </div>
      <div className={styles.productFooterLinks}>
        {LEGAL_LINKS.map((item) => (
          <Link key={item.href} href={item.href} className={styles.productFooterLink}>
            {item.label}
          </Link>
        ))}
      </div>
    </footer>
  );
}

