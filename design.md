# Design System & Aesthetic Specification

**Platform:** SK Sahinur Islam (Genious Sonu) — Official Portfolio & Engineering Platform  
**Design Philosophy:** Cyber-Minimalism · High-Density Dark Mode · Tactile Glassmorphism · Precision Motion  
**Document Version:** 2.4.0  

---

## 1. Aesthetic Philosophy & Brand Identity

The design language reflects an elite engineering and cyber-security aesthetic. It blends the discipline of Unix terminal systems, modern high-density dashboards, and futuristic sci-fi interfaces into a cohesive, fluid web experience.

### Core Visual Pillars:
1. **The Deep Void (OLED Dark Mode)**: Pure deep darks (`#050505`) as the base canvas, punctuated by subtle graphite borders and ambient emerald glow.
2. **Emerald & Cyber Accents**: Transitioned from traditional yellow-gold to high-energy modern emerald green (`#10B981` / `#34D399`) representing terminal vitality, security, and precision.
3. **Tactile Glassmorphism**: Multi-layered semi-transparent surfaces with backdrop blur filters, hairline borders (`1px solid rgba(255, 255, 255, 0.08)`), and inset highlights.
4. **Cinematic Micro-Interactions**: Fluid, hardware-accelerated transitions powered by GSAP and Lenis with spring physics. No jarring static snaps; every interactive state feels physically weighted.

---

## 2. Color Palette & Design Tokens

### 2.1. Surface & Background Tokens
```css
:root {
  /* Surfaces & Base Canvas */
  --void: #050505;          /* Ultimate black background - OLED friendly */
  --graphite: #0F1115;      /* Secondary dark canvas / card background */
  --gunmetal: #1A1D23;      /* Elevated card & hover state background */
  --surface: #22262E;       /* Modals, drawers, and elevated popovers */
  
  /* Borders & Hairlines */
  --border: #2A2F38;        /* Standard element border */
  --border-dim: #1E2229;    /* Subtle division border / grid lines */
  --border-bright: #3D4452; /* Hovered card outline */
}
```

### 2.2. Accent & Brand Colors
```css
:root {
  /* Primary Cyber Emerald (Signature Brand Color) */
  --gold: #10B981;          /* Primary vibrant emerald accent */
  --gold-dim: #059669;      /* Dimmed / pressed emerald */
  --gold-bright: #34D399;   /* High-visibility glowing highlight */
  
  /* Neutral Metal Tones */
  --silver: #8A9BAD;        /* Muted technical labels */
  --silver-bright: #C1CDD9; /* Secondary headings and highlights */
  
  /* Functional Status Colors */
  --green: #4ADE80;         /* Success / online status indicator */
  --amber: #FBBF24;         /* Warnings & caution notices */
  --blue: #60A5FA;          /* Informational badges & links */
  --red: #F87171;           /* Destructive actions & error badges */
  --purple: #A78BFA;        /* Special creative features & AI flags */
}
```

### 2.3. Typography & Text Hierarchy
```css
:root {
  /* Text Contrast Hierarchy */
  --text-primary: #F9FAFB;   /* 98% white for headings and primary titles */
  --text-secondary: #D1D5DB; /* 80% light gray for readable body text */
  --text-muted: #8A9BAD;     /* 55% muted slate for metadata, tags, and timestamps */

  /* Font Families */
  --font-display: 'Brooklyn', 'Geist', system-ui, sans-serif;
  --font-sans: 'Geist', 'Geist Fallback', system-ui, sans-serif;
  --font-mono: 'Geist', 'Geist Fallback', monospace;
  --font-poppins: var(--font-poppins), 'Poppins', sans-serif;
}
```

---

## 3. Typography Scale & Heading Rules

| Element | Font Family | Size | Weight | Tracking (Letter Spacing) | Line Height | Usage |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **Display H1** | Brooklyn | `clamp(2.5rem, 6vw, 4.8rem)` | 700 / 800 | `-0.03em` | 1.05 | Hero titles, primary landing banners |
| **Section H2** | Brooklyn | `clamp(1.8rem, 3.5vw, 2.8rem)` | 700 | `-0.02em` | 1.15 | Section headers (`Experience`, `Projects`) |
| **Card H3** | Geist / Brooklyn | `1.35rem – 1.6rem` | 600 | `-0.01em` | 1.25 | Project card titles, role headings |
| **Subheadings H4**| Geist | `1.1rem – 1.25rem` | 600 | `0.00em` | 1.35 | Modal headers, sub-feature titles |
| **Body Large** | Geist | `1.0625rem (17px)` | 400 | `0.00em` | 1.65 | Article intros, hero summaries |
| **Body Regular**| Geist | `0.9375rem (15px)` | 400 | `0.00em` | 1.60 | Standard paragraphs, card descriptions |
| **Technical Mono**| Geist Mono | `0.8125rem (13px)` | 500 | `0.05em` | 1.40 | Code blocks, rack separators, status indicators |
| **Badges & Labels**| Geist Mono / Sans | `0.75rem (12px)` | 600 | `0.08em` | 1.00 | Uppercase technical pill tags (`[ SECTION 01 ]`) |

---

## 4. Glassmorphism & Elevation Specs

### 4.1. The Glass Token Formula
All floating cards, command palettes, and navigation bars follow the unified glassmorphism formula:

```css
/* Card Level Glass */
.glass-card {
  background: rgba(15, 17, 21, 0.75);
  backdrop-filter: blur(16px) saturate(180%);
  -webkit-backdrop-filter: blur(16px) saturate(180%);
  border: 1px solid rgba(255, 255, 255, 0.08);
  box-shadow: 
    0 4px 24px -1px rgba(0, 0, 0, 0.5),
    inset 0 1px 0 0 rgba(255, 255, 255, 0.05);
  border-radius: 12px;
  transition: transform 0.3s var(--ease-out), border-color 0.3s var(--ease-out), box-shadow 0.3s var(--ease-out);
}

.glass-card:hover {
  transform: translateY(-2px);
  border-color: rgba(16, 185, 129, 0.35); /* Subtle emerald edge */
  box-shadow: 
    0 12px 32px -4px rgba(0, 0, 0, 0.7),
    0 0 15px rgba(16, 185, 129, 0.15),
    inset 0 1px 0 0 rgba(255, 255, 255, 0.1);
}
```

### 4.2. Navigation Glass Header
```css
.navbar-glass {
  background: rgba(5, 5, 5, 0.85);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border-bottom: 1px solid rgba(255, 255, 255, 0.06);
}
```

---

## 5. Animation, Motion & Physics Guidelines

### 5.1. Easing Curves
```css
:root {
  --ease-out: cubic-bezier(0.16, 1, 0.3, 1);    /* Smooth decelerated arrival */
  --ease-spring: cubic-bezier(0.34, 1.56, 0.64, 1); /* Spring bounce for badges & icons */
  --ease-standard: cubic-bezier(0.4, 0.0, 0.2, 1);  /* Material standard */
}
```

### 5.2. Scroll-Engine Synchronization (Lenis + GSAP)
- **Desktop**: Lenis runs smooth scroll with `lerp: 0.1` and `touchMultiplier: 1.5`. Lenis scroll updates are pinned to GSAP's `ScrollTrigger.update` ticker loop to prevent frame tearing or jank.
- **Mobile**: Native hardware-accelerated kinetic touch scrolling is preserved on mobile devices (`touch: true` flag in Lenis) to ensure zero lag.
- **Pinned Card Stacking**: In `Experience.jsx`, cards stick to the viewport with cumulative top offsets (`top: 100px + (index * 24px)`) and scale back slightly (`scale: 0.98`) as subsequent cards stack on top.

### 5.3. Page Route Transitions
- Powered by the native **View Transitions API** with fallback to CSS opacity cross-fades.
- Transition duration capped at **180ms - 220ms** with a strict 450ms safety abort timeout to guarantee navigation never hangs.
- Respects `prefers-reduced-motion`: When active, route changes occur instantly with zero animation.

---

## 6. Showcase Styles & Custom UI Components

### 6.1. Rack Separators (`.rack-sep`)
Technical cyber-rack divider used between major sections:
```css
.rack-sep {
  display: flex;
  align-items: center;
  gap: 1.5rem;
  font-family: var(--font-mono);
  font-size: 0.8125rem;
  font-weight: 500;
  color: var(--gold);
  letter-spacing: 0.12em;
  text-transform: uppercase;
  margin: 4rem 0 2rem;
}
.rack-sep::before,
.rack-sep::after {
  content: '';
  flex: 1;
  height: 1px;
  background: linear-gradient(90deg, transparent, var(--border), transparent);
}
```

### 6.2. Interactive Custom Cursor (`CustomCursor.jsx`)
- Hides default browser cursor (`cursor: none` on body).
- Outer magnetic follower ring (`width: 32px; height: 32px`) lags with smooth lerp physics.
- Center dot (`width: 6px; height: 6px`) attaches directly to pointer coordinates.
- Expands and switches blend mode (`mix-blend-mode: difference`) over interactive links, buttons, and card headers.

### 6.3. Ambient Scanlines & Grid Overlay
- Fixed background pseudo-elements (`#grid-overlay`, `#scan-line`) project subtle retro-futuristic grid coordinates and a soft CRT scanline animation across the page without interfering with text selection or pointer events (`pointer-events: none`).

---

## 7. Responsive Layout Rules & Breakpoints

| Breakpoint | Target Screen | Layout Behavior |
| :--- | :--- | :--- |
| `< 480px` | Small Mobile | Single column, sticky bottom CTA bar visible, custom cursor disabled (native touch cursor), hamburger navigation. |
| `480px – 768px` | Large Mobile / Tablet | 1-to-2 column auto-fit grids, reduced padding, globe scales to container width. |
| `769px – 1024px` | Small Laptop / Tablet Landscape | 2-column project grids, horizontal skill pills, sidebar drawers. |
| `1025px – 1440px` | Standard Desktop | Full Lenis smooth scrolling, pinned experience card stacking, 3D interactive globe at full resolution. |
| `> 1440px` | Large Displays / Ultra-wide | Max content container width constrained to `1280px` / `1440px` to maintain optimal line-length and visual ergonomics. |
