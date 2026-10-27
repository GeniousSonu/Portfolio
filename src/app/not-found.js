"use client";
import React from 'react';
import Link from 'next/link';

export default function NotFound() {
  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: 'var(--void, #0B0D0E)',
      color: 'var(--text-primary, #ECEAE4)',
      fontFamily: "var(--font-sans, system-ui, sans-serif)",
      padding: '2rem',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Background Grid */}
      <div id="grid-overlay" style={{ opacity: 0.15 }} aria-hidden="true" />
      <div id="scan-line" style={{ opacity: 0.3 }} aria-hidden="true" />

      <main data-route="/404" style={{
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
          padding: '0.35rem 0.85rem',
          background: 'rgba(212, 175, 55, 0.08)',
          border: '1px solid var(--border-brass, rgba(212, 175, 55, 0.28))',
          borderRadius: 'var(--radius-sm, 6px)',
          fontSize: '0.75rem',
          fontFamily: 'var(--font-mono, monospace)',
          color: 'var(--gold, #D4AF37)'
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
          color: 'var(--text-primary, #ECEAE4)'
        }}>
          404
        </h1>

        {/* Subtitle */}
        <p style={{
          fontSize: '1rem',
          color: 'var(--text-secondary, #A1A1AA)',
          lineHeight: 1.6,
          margin: 0,
          fontWeight: 400,
          maxWidth: '440px'
        }}>
          The route you requested does not exist or has been relocated to another endpoint.
        </p>

        {/* Terminal sysinfo card */}
        <div className="sysinfo" style={{ width: '100%', margin: '0.5rem 0', textAlign: 'left', borderRadius: 'var(--radius-sm, 6px)' }}>
          <div className="sysinfo-header">
            <div className="dot-r" /><div className="dot-y" /><div className="dot-g" />
            <span style={{ marginLeft: '0.5rem', fontSize: '0.7rem', color: 'var(--text-muted)' }}>
              sahinur@dev:~$ status --check
            </span>
          </div>
          <div className="sysinfo-body" style={{ padding: '1rem', fontSize: '0.8rem', fontFamily: 'var(--font-mono, monospace)' }}>
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
            padding: '0.65rem 1.4rem',
            borderRadius: 'var(--radius-sm, 6px)',
            fontSize: '0.85rem',
            textDecoration: 'none',
            transition: 'all 0.25s cubic-bezier(0.16, 1, 0.3, 1)'
          }}
        >
          ← Return to Overview
        </Link>
      </main>
      </div>
  );
}
