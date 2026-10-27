# Portfolio Design System (`design-reference.md`)

> **IMPORTANT FOR AI AGENTS:** This document supersedes any previous `design.md`. Apply these visual tokens, typography rules, and layout structures strictly while keeping all existing components, routes, and business logic intact.

---

## 1. Typography System

Import the following Google Fonts (or local equivalents):
* **Display Condensed (`--font-display`):** `'Anton'`, `'Bebas Neue'`, or `'Impact'` — Uppercase, tight tracking (`-0.02em`), line-height `0.88`.
* **Editorial Serif (`--font-serif`):** `'Instrument Serif'`, `'Playfair Display'`, or `'Newsreader'` (Italic) — Used for narrative hooks and cover story accent words.
* **Technical Monospace (`--font-mono`):** `'JetBrains Mono'` or `'Space Mono'` — Uppercase, letter-spacing `0.08em`, font-size `0.75rem`–`0.85rem`.
* **UI Sans (`--font-sans`):** `'Plus Jakarta Sans'` or `'Inter'` — Clean body copy, navigation links, and bullet points.

---

## 2. Color Tokens & Dual-Theme Variables

```css
:root {
  /* Core UI & Neo-Brutalist Tokens (Day Mode) */
  --nav-bg: rgba(255, 255, 255, 0.78);
  --nav-border: rgba(255, 255, 255, 0.9);
  --nav-text: #0F172A;
  --nav-active-bg: #0F172A;
  --nav-active-text: #FFFFFF;
  --cta-pink: #FF2E93;
  
  --glass-card-bg: rgba(255, 255, 255, 0.82);
  --glass-card-border: rgba(255, 255, 255, 0.6);
  --brutal-border: #0F172A;
  --brutal-shadow: 3px 3px 0px #0F172A;
  
  --pill-pink: #FF4D94;
  --pill-lime: #B4F461;
  --pill-yellow: #FDE047;

  /* Vibrant Section Palette (Day Mode) */
  --sec-01-bg: #0F5A47; /* Deep Emerald */
  --sec-02-bg: #442C6E; /* Royal Indigo */
  --sec-03-bg: #D91B38; /* Vivid Crimson */
  --sec-04-bg: #E10686; /* Electric Magenta */
  --sec-05-bg: #6E1D52; /* Festive Plum */
  --sec-06-bg: #F9841A; /* Bright Tangerine (Use #0F1E36 dark navy text) */
  --sec-07-bg: #2B3530; /* Tactical Forest Charcoal */
  --sec-08-bg: #1572B6; /* Ice Cobalt Blue */
}

[data-theme="dark"] {
  /* Core UI & Neo-Brutalist Tokens (Night Mode) */
  --nav-bg: rgba(15, 23, 42, 0.78);
  --nav-border: rgba(255, 255, 255, 0.14);
  --nav-text: #F8FAFC;
  --nav-active-bg: #F8FAFC;
  --nav-active-text: #0F172A;
  --cta-pink: #FF2E93;

  --glass-card-bg: rgba(15, 23, 42, 0.75);
  --glass-card-border: rgba(255, 255, 255, 0.15);
  --brutal-border: #000000;
  --brutal-shadow: 3px 3px 0px #000000;

  /* Rich Obsidian & Neon-Tinted Section Palette (Night Mode) */
  --sec-01-bg: #06281F;
  --sec-02-bg: #19102C;
  --sec-03-bg: #3B0712;
  --sec-04-bg: #3D0325;
  --sec-05-bg: #26091C;
  --sec-06-bg: #2E1503; /* Switch text to #FFF7ED in dark mode */
  --sec-07-bg: #0B0F0D;
  --sec-08-bg: #072138;
}