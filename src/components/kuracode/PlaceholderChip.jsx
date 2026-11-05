import React from 'react';

/**
 * PlaceholderChip (Delta D2)
 * Renders an unresolved owner item as a tasteful "to be confirmed" chip
 * instead of leaking raw [[OWNER: ...]] tokens into public rendered HTML.
 */
export default function PlaceholderChip({ label, fallback = 'To be confirmed' }) {
  const isUnresolved = typeof label === 'string' && label.includes('[[OWNER:');
  const cleanLabel = isUnresolved
    ? label.replace(/\[\[OWNER:\s*|\]\]/g, '').trim()
    : label;

  if (!isUnresolved) {
    return <span>{label}</span>;
  }

  return (
    <span
      className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-xs font-mono font-medium"
      style={{
        background: 'var(--sn-surface-2, rgba(255, 255, 255, 0.08))',
        color: 'var(--sn-accent-gold, #f59e0b)',
        border: '1px dashed var(--sn-card-border, rgba(255, 255, 255, 0.2))',
      }}
      title={`Owner item pending confirmation: ${cleanLabel}`}
    >
      <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
      <span>{cleanLabel || fallback} (TBC)</span>
    </span>
  );
}

export function resolvePlaceholder(val, fallback = 'To be confirmed') {
  if (typeof val !== 'string') return val;
  if (val.includes('[[OWNER:')) {
    const clean = val.replace(/\[\[OWNER:\s*|\]\]/g, '').trim();
    return `${clean || fallback} (TBC)`;
  }
  return val;
}
