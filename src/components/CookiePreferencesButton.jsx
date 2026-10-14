"use client";
import React from 'react';
import styles from '@/app/legal.module.css';

export default function CookiePreferencesButton({ label = 'Manage Cookie Preferences', className = '' }) {
  const handleClick = () => {
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('open-cookie-preferences'));
    }
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      className={className || styles.contactBtn}
      style={{ cursor: 'pointer', border: 'none' }}
      aria-label="Open cookie preferences dialog"
    >
      <span>⚙️ {label}</span>
    </button>
  );
}
