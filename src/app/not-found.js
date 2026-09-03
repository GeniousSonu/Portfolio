"use client";
import React from 'react';
import Link from 'next/link';
import CustomCursor from '../components/CustomCursor';

export default function NotFound() {
  return (
    <>
      <CustomCursor />
      <div style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: '#050505',
      color: '#F9FAFB',
      fontFamily: "'Geist', 'Geist Fallback', system-ui, sans-serif",
      padding: '2rem',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Background Grid */}
      <div id="grid-overlay" style={{ opacity: 0.2 }} aria-hidden="true" />
      <div id="scan-line" style={{ opacity: 0.5 }} aria-hidden="true" />

      <main style={{
        zIndex: 10,
        maxWidth: '560px',
        textAlign: 'center',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '1.5rem'
      }}>
        {/* Terminal Header status badge */}
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '0.6rem',
          padding: '0.4rem 0.9rem',
          background: 'rgba(15, 17, 21, 0.8)',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          borderRadius: '9999px',
          fontSize: '0.75rem',
          fontFamily: 'monospace',
          color: '#8A9BAD'
        }}>
          <span style={{
            width: '6px',
            height: '6px',
            borderRadius: '50%',
            backgroundColor: '#F87171',
            boxShadow: '0 0 8px #F87171'
          }} />
          <span>HTTP 404 · PAGE_NOT_FOUND</span>
        </div>

        {/* Title */}
        <h1 style={{
          fontSize: 'clamp(3rem, 8vw, 6rem)',
          fontWeight: 700,
          letterSpacing: '-0.04em',
          lineHeight: 1,
          margin: 0,
          background: 'linear-gradient(180deg, #FFFFFF 0%, #8A9BAD 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent'
        }}>
          404
        </h1>

        {/* Subtitle */}
        <p style={{
          fontSize: '1rem',
          color: '#D1D5DB',
          lineHeight: 1.6,
          margin: 0,
          fontWeight: 300,
          maxWidth: '440px'
        }}>
          The route you requested does not exist or has been relocated to another endpoint.
        </p>

        {/* Terminal sysinfo card */}
        <div className="sysinfo" style={{ width: '100%', margin: '0.5rem 0', textAlign: 'left' }}>
          <div className="sysinfo-header">
            <div className="dot-r" /><div className="dot-y" /><div className="dot-g" />
            <span style={{ marginLeft: '0.5rem', fontSize: '0.7rem', color: 'var(--text-muted)' }}>
              sahinur@dev:~$ status --check
            </span>
          </div>
          <div className="sysinfo-body" style={{ padding: '1rem', fontSize: '0.8rem', fontFamily: 'monospace' }}>
            <div style={{ color: 'var(--red)', marginBottom: '0.3rem' }}>
              ERR: Target URL unreachable
            </div>
            <div style={{ color: 'var(--text-muted)' }}>
              Suggestions: Check spelling or navigate back to primary root.
            </div>
          </div>
        </div>

        {/* Action button */}
        <Link
          href="/"
          className="btn btn-gold"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem',
            padding: '0.75rem 1.6rem',
            borderRadius: '9999px',
            fontSize: '0.85rem',
            textDecoration: 'none',
            transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)'
          }}
        >
          ← Return to Terminal
        </Link>
      </main>
      </div>
    </>
  );
}
