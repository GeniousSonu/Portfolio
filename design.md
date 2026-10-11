# DESIGN.md — Design System & Art Direction

**Product:** SK Sahinur Islam (Genious Sonu) — Official Portfolio & Engineering Platform
**Document version:** 3.0.0 (supersedes Design System 2.4.0 "Cyber-Minimalism / Tactile Glassmorphism")
**Art direction codename:** **OPERATOR CONSOLE**
**Authority:** Senior Design Lead (Claude) · **Implementation:** Antigravity agent · **Approver:** Owner
**Companion documents:** `PRD.md` (what and why), `AGENTS.md` (engineering rules), `docs/site/ROUTE-INVENTORY.md`
**Status:** Approved direction, living document

---

## 0. How to Use This Document

### 0.1 Purpose

This is the single source of truth for how the platform looks, moves, sounds in text, and behaves visually. It exists so that (a) the owner can judge design decisions against written intent, (b) AI coding agents can implement without inventing a style, and (c) every future change has something to be checked against.

### 0.2 Reading order for the implementation agent

1. `AGENTS.md` (technical constraints always win).
2. This file, Sections 1–3 (concept, principles, tokens) before touching any CSS.
3. The section for the component or page being built (Sections 8–11).
4. Section 16 (anti-slop review) and Section 18 (acceptance) before declaring work done.

### 0.3 Conventions

- **MUST / SHOULD / MAY** are used in the RFC 2119 sense.
- **[VERIFY]** marks facts that depend on assets or code not visible when this document was written (for example the font "Brooklyn" and the contents of the owner's `.glb`). The agent must verify these and report.
- **Token names** in code blocks are normative. Component CSS MUST consume semantic tokens only (Section 3.1).
- **DDR-NNN** references point to the Design Decision Records in Section 20.

### 0.4 What changed from Design System 2.4.0

| 2.4.0 | 3.0.0 | Why |
|-------|-------|-----|
| Tactile glassmorphism on every card | Hairline "frames" with crop marks; glass reserved for floating overlays only | Glass-on-everything is the single most recognizable "AI template" signature (see Section 16) |
| Emerald used broadly as brand wash and glow | Emerald becomes **Signal**: used for live state, focus, and one deliberate emphasis per view (< 5% of pixels) | Scarcity makes the accent meaningful |
| One voice (sans + mono) | **Three voices**: structure (grotesk), system (mono), human (serif) | Gives type a reason to change |
| Dark only, one surface | Dual surface: **Void** (dark) and **Bone** (warm light) chapters | Surface shifts create rhythm and editorial pacing |
| Rounded 12px cards | 0 / 2 / 4px radii; chamfered cut-corners on filled elements | Distinctive geometry matching the instrument concept |
| `--gold` token holding emerald | Renamed `--signal` with a deprecated alias | The old name was a migration leftover |
| 3D only as a globe | 3D **Operator Stage** (owner's model) plus the globe, one WebGL context at a time | The owner is the product |
| Spec "Geist Mono" family set as `'Geist'` | Corrected to `'Geist Mono'` | Bug in 2.4.0 token `--font-mono` |

---

## 1. Concept

### 1.1 Thesis
>
> **A security engineer's operating console, with a human at the desk.**

The visitor boots into Sonu's system. Everything systemic (data, status, structure, controls) speaks in precise, mechanical, monospaced, cold-signal terms. Everything human (the person, the story, the voice) speaks in warm, organic, serif, bone-toned terms. The 3D model of the owner is the "operator" sitting at the console. The whole site is the tension and handshake between the **system** and the **person**.

This is not decoration. It is the reason behind every typographic, color, motion and layout choice in this document. When a design choice cannot be explained through system versus human, it needs a different justification or it is cut.

### 1.2 The three voices

| Voice | Meaning | Type | Color | Motion | Shape |
|-------|---------|------|-------|--------|-------|
| **System** | Data, status, labels, controls, navigation chrome, code | Geist Mono, uppercase micro-labels, tabular numerals | Signal green on Void, cool grays | Linear, stepped, typed, counted, scanned (mechanical easing) | Hairlines, crop marks, chamfers, grids |
| **Structure** | Headlines, section architecture, body copy | Brooklyn display + Geist (grotesk) [VERIFY Brooklyn] | Ink and Bone neutrals | Confident ease-out, masked line reveals | Large type, generous negative space |
| **Human** | The owner's story, quotes, About statement, live chat replies from Sonu | Instrument Serif (regular and italic) | Warm Bone, soft highlights | Organic ease-out and spring; slow fades; breathing | Softer edges, optical sizing, real photography and the 3D operator |

### 1.3 Signature moves (exactly three, no more)

1. **The Operator Stage.** A fixed 3D stage that holds the owner's model. The camera performs a scripted, scroll-driven "shot list" across the Home chapters (Section 9). The model materializes at boot through a scan-line reveal tied to the preloader.
2. **Live telemetry as typography.** Real data (local time in Kolkata, last deploy short SHA, now playing, chess rating, availability) is set as typographic texture in headers, footers and margins. Never fabricated: if a source fails the field shows an em dash.
3. **Chapter mode-shifts.** Sections are numbered chapters. Dark (Void) and light (Bone) surfaces alternate through a fast clip-path transition, with a persistent chapter rail on the left showing progress. Reading content (blog, wiki, docs) lives on Bone; showpiece and system content lives on Void.

Supporting details (not "moves"): crop-mark corners and coordinate labels on frames, figure numbering ("FIG. 03"), and fine grain.

### 1.4 What this site must NOT look like

Purple or blue-violet gradient washes; centered hero with three identical cards below; glass cards everywhere; uniform 12–16px rounded boxes; neon glow on everything; emoji as icons; stock or AI-generated illustration filler; infinite logo marquees; fake numbers; "Hi, I'm … welcome to my portfolio" headlines; parallax on every element; animation that exists only to show off. Section 16 turns this list into a checklist.

### 1.5 Intended feeling (first 10 seconds)

Precise, calm, a little dangerous, and unmistakably personal. A recruiter should think "this person builds real systems and has taste." A client should think "I can trust this person with my product." A developer should think "I want to look at the source."

### 1.6 Award-caliber rubric alignment

Awwwards weights Design 40%, Usability 30%, Creativity 20%, Content 10%. This document is organized to satisfy that balance, and the Section 18 release gate scores each dimension.

| Dimension | Weight | How this system addresses it | Section |
|-----------|--------|------------------------------|---------|
| Design | 40% | Concept-driven type, grid, color scarcity, hairline geometry, disciplined surfaces | 3, 4, 5, 6 |
| Usability | 30% | Full-site wayfinding (rail, panels, all-pages index, palette), WCAG 2.2 AA, clear state design | 10, 13 |
| Creativity | 20% | Operator Stage, scan-in boot, telemetry typography, mode-shifting chapters | 1.3, 8, 9 |
| Content | 10% | Real facts only, dated stats, voice guide, specific microcopy | 15 |

---

## 2. Design Principles (tie-breakers)

1. **Concept before effect.** Every effect answers "what does this say about system versus human?"
2. **Restraint creates impact.** One emphasis per view. One accent. One motion idea per chapter.
3. **Typography is the interface.** Scale, contrast and rhythm do the work that boxes and shadows do in template sites.
4. **Real over generic.** Real data, real screenshots, real dates, real names.
5. **Fast is a design property.** Anything that threatens LCP, INP or CLS is redesigned, not excused.
6. **Everything has a fallback.** No 3D, no motion, no JS-heavy enhancement: the site must still be complete and beautiful.
7. **Accessible by construction.** Contrast, focus, targets and reduced motion are tokens and rules, not a final audit.
8. **Systems over one-offs.** If a pattern appears twice it becomes a component; if a value appears twice it becomes a token.

---

## 3. Design Tokens

### 3.1 Token architecture (three tiers, future-proof)

1. **Primitive tokens** (raw values): `--ink-0`, `--bone-0`, `--signal-500`. Never used directly in components.
2. **Semantic tokens** (roles): `--bg`, `--fg-1`, `--line`, `--accent`. Re-mapped by surface and mode. Components consume only these.
3. **Component tokens** (optional overrides): `--btn-bg`, `--frame-line`. Defined inside the component, defaulting to semantic tokens.

A rebrand or a new theme changes tiers 1 and 2 only. Source of truth is CSS in `src/styles/tokens.css`. A machine-readable export (DTCG-format JSON) is a FUTURE option (Section 19).

### 3.2 CSS cascade layers (MUST)

```css
@layer reset, tokens, base, layout, components, patterns, utilities, overrides;
```

Global CSS declares layer order once in `src/styles/index.css`. CSS Modules remain allowed for components; their rules live in `components` implicitly via `@layer components { … }` wrappers where cascade conflicts are possible. `overrides` is for temporary, documented exceptions only.

### 3.3 Primitive color tokens

Authored in hex. Derived states use `color-mix(in oklch, …)` so hover, pressed and disabled shades stay perceptually consistent.

```css
:root {
  /* INK — dark surfaces (Void family) */
  --ink-0: #050505;   /* Void: page canvas */
  --ink-1: #0A0B0D;   /* Recessed areas, code backgrounds */
  --ink-2: #0F1115;   /* Panels (was --graphite) */
  --ink-3: #16191F;   /* Raised panel, hover fill */
  --ink-4: #1E222A;   /* Overlays, popovers (was --gunmetal/--surface) */

  /* BONE — light surfaces (Human family) */
  --bone-0: #EEEBE3;  /* Bone: reading canvas */
  --bone-1: #E4E0D6;  /* Recessed on bone */
  --bone-2: #D8D3C7;  /* Panels on bone */

  /* NEUTRAL TEXT PRIMITIVES */
  --white-98: #F4F5F6;
  --white-80: #C9CED6;
  --slate-55: #8A9BAD;      /* existing muted slate, retained */
  --black-98: #0B0C0E;
  --black-75: #3A3D43;
  --black-55: #5E6168;

  /* SIGNAL (emerald, retained as brand heritage but now scarce) */
  --signal-300: #34D399;    /* highlight on Void */
  --signal-500: #10B981;    /* primary on Void */
  --signal-700: #047857;    /* signal on Bone (passes AA on Bone) */
  --signal-900: #064E3B;
  --phosphor:   #4DFFA0;    /* God Mode only (Section 12.6) */

  /* FUNCTIONAL (small, never decorative) */
  --ok:    #4ADE80;
  --warn:  #FBBF24;
  --err:   #F87171;
  --info:  #60A5FA;
  --ai:    #A78BFA;         /* AI label dot only; never a surface or gradient */
}
```

Approximate contrast (computed from WCAG relative luminance; MUST be re-verified with tooling in CI):

| Pair | Ratio | Result |
|------|-------|--------|
| `--signal-500` on `--ink-0` | ≈ 8.0:1 | AA and AAA (normal text) |
| `--slate-55` on `--ink-0` | ≈ 7.2:1 | AA and AAA |
| `--signal-700` on `--bone-0` | ≈ 4.7:1 | AA |
| `--signal-500` on `--bone-0` | ≈ 2.2:1 | **FAIL**, never use |
| `--black-55` on `--bone-0` | ≈ 5.2:1 | AA |

### 3.4 Semantic tokens (surface-aware)

```css
:root,
[data-surface="void"] {
  color-scheme: dark;
  --bg:        var(--ink-0);
  --bg-sunken: var(--ink-1);
  --bg-panel:  var(--ink-2);
  --bg-raised: var(--ink-3);
  --bg-overlay: color-mix(in oklch, var(--ink-4) 82%, transparent);

  --fg-1: var(--white-98);
  --fg-2: var(--white-80);
  --fg-3: var(--slate-55);

  --line-1: rgba(255,255,255,0.06);   /* grid, dividers */
  --line-2: rgba(255,255,255,0.10);   /* frames */
  --line-3: rgba(255,255,255,0.18);   /* hover, strong frames */

  --accent:       var(--signal-500);
  --accent-hi:    var(--signal-300);
  --accent-ink:   #04120C;            /* text on accent fills */
  --focus-ring:   var(--signal-300);
}

[data-surface="bone"] {
  color-scheme: light;
  --bg:        var(--bone-0);
  --bg-sunken: var(--bone-1);
  --bg-panel:  var(--bone-1);
  --bg-raised: var(--bone-2);
  --bg-overlay: color-mix(in oklch, var(--bone-0) 88%, transparent);

  --fg-1: var(--black-98);
  --fg-2: var(--black-75);
  --fg-3: var(--black-55);

  --line-1: rgba(11,12,14,0.08);
  --line-2: rgba(11,12,14,0.14);
  --line-3: rgba(11,12,14,0.28);

  --accent:     var(--signal-700);
  --accent-hi:  var(--signal-900);
  --accent-ink: var(--bone-0);
  --focus-ring: var(--signal-700);
}

/* God Mode: full phosphor, monochrome (Section 12.6) */
:root[data-god-mode="true"] {
  --accent: var(--phosphor);
  --accent-hi: var(--phosphor);
  --fg-2: color-mix(in oklch, var(--phosphor) 70%, var(--white-80));
  --fg-3: color-mix(in oklch, var(--phosphor) 45%, var(--slate-55));
  --line-2: color-mix(in oklch, var(--phosphor) 22%, transparent);
}
```

Three independent theme axes, all expressed as data attributes on `<html>` or a section: `data-surface` (void | bone), `data-god-mode` (true | absent), `data-motion` (full | reduced, set from `prefers-reduced-motion` plus a user toggle).

### 3.5 Migration map (old → new, with deprecated aliases kept for one release)

| Old token (2.4.0) | New token | Notes |
|-------------------|-----------|-------|
| `--void` | `--ink-0` / `--bg` | |
| `--graphite` | `--ink-2` / `--bg-panel` | |
| `--gunmetal` | `--ink-3` / `--bg-raised` | |
| `--surface` | `--ink-4` | Overlays only |
| `--border`, `--border-dim`, `--border-bright` | `--line-2`, `--line-1`, `--line-3` | Alpha-based so they work on both surfaces |
| `--gold`, `--gold-dim`, `--gold-bright` | `--accent`, `--signal-700`/`--signal-900` (pressed), `--accent-hi` | Misnamed in 2.4.0 |
| `--silver`, `--silver-bright` | `--fg-3`, `--fg-2` | |
| `--text-primary/secondary/muted` | `--fg-1`, `--fg-2`, `--fg-3` | |
| `--green --amber --blue --red --purple` | `--ok --warn --info --err --ai` | Purple reduced to a tiny AI dot |

Aliases live in `src/styles/legacy-aliases.css`, flagged `/* DEPRECATED: remove in R8 */`, and a lint check blocks new usage.

### 3.6 Spacing

4px base unit.

```css
:root {
  --space-0: 0;
  --space-1: 0.25rem;  /* 4  */
  --space-2: 0.5rem;   /* 8  */
  --space-3: 0.75rem;  /* 12 */
  --space-4: 1rem;     /* 16 */
  --space-5: 1.5rem;   /* 24 */
  --space-6: 2rem;     /* 32 */
  --space-7: 3rem;     /* 48 */
  --space-8: 4rem;     /* 64 */
  --space-9: 6rem;     /* 96 */
  --space-10: 8rem;    /* 128 */
  --space-11: 12rem;   /* 192 */

  /* Fluid section rhythm */
  --section-y: clamp(5rem, 3rem + 8vw, 11rem);
  --section-y-tight: clamp(3rem, 2rem + 4vw, 6rem);
}
```

### 3.7 Radius, borders, elevation

```css
:root {
  --radius-0: 0;
  --radius-1: 2px;     /* inputs, tags */
  --radius-2: 4px;     /* panels, code blocks */
  --radius-full: 999px;/* status dots and avatars ONLY */
  --chamfer: 12px;     /* cut-corner size for filled elements */

  --hairline: 1px;
  --rule-strong: 2px;  /* focus rings, active indicators */
}
```

Elevation on dark surfaces comes from **surface lightness steps and hairlines**, not shadows. Shadows exist only for overlays:

```css
:root {
  --shadow-overlay: 0 24px 64px -16px rgba(0,0,0,0.65), 0 2px 0 0 rgba(255,255,255,0.04) inset;
  --shadow-bone-overlay: 0 24px 56px -20px rgba(11,12,14,0.35);
}
```

### 3.8 Z-index scale

```css
:root {
  --z-stage: 0;        /* Operator Stage canvas */
  --z-content: 1;
  --z-rail: 20;        /* chapter rail */
  --z-header: 40;
  --z-panel: 50;       /* nav panels, popovers */
  --z-overlay: 60;     /* all-pages index, command palette, modals */
  --z-toast: 70;
  --z-cursor: 80;
  --z-grain: 90;       /* pointer-events: none */
  --z-boot: 100;       /* preloader */
}
```

### 3.9 Motion tokens (detail in Section 7)

```css
:root {
  --dur-instant: 80ms;
  --dur-fast: 140ms;
  --dur-base: 240ms;
  --dur-slow: 480ms;
  --dur-chapter: 900ms;
  --dur-cinematic: 1400ms;

  --ease-out:     cubic-bezier(0.16, 1, 0.3, 1);      /* human arrival */
  --ease-spring:  cubic-bezier(0.34, 1.56, 0.64, 1);  /* human emphasis; max overshoot 6% */
  --ease-mech:    cubic-bezier(0.2, 0, 0, 1);         /* system: quick start, firm stop */
  --ease-inout:   cubic-bezier(0.87, 0, 0.13, 1);     /* chapter mode-shifts */
  --ease-linear:  linear;                              /* typing, counters, scans */
}
```

### 3.10 Breakpoints and containers

Design in **container queries** first, viewport media queries second.

| Name | Min width | Behavior |
|------|-----------|----------|
| `xs` | 0 | Single column; 20px page margin; bottom CTA bar; no custom cursor |
| `sm` | 480px | Auto-fit 1–2 columns |
| `md` | 768px | 8-column grid; chapter rail appears as a top progress bar |
| `lg` | 1024px | 12-column grid; chapter rail on left; pinned sequences enabled |
| `xl` | 1440px | Max content width 1440px; stage may bleed full width |
| `2xl` | 1920px | Content stays 1440px; margins grow; type caps prevent oversized headlines |

Use `@container` for components (cards, panels, tool UIs) so they adapt to their slot, not the screen.

---

## 4. Typography

### 4.1 Families

| Role | Family | Source and loading | Notes |
|------|--------|-------------------|-------|
| Display / Structure | **Brooklyn** [VERIFY: confirm licence for web use, weights available, and that it supports Latin extended] | Local, `next/font/local`, preload the display weight, `font-display: swap`, size-adjusted fallback | Retained from the current brand; if the character does not carry at 8rem+, fall back to Geist 700 via the token swap |
| Body / UI | **Geist** | Existing local files | Variable if available |
| System voice | **Geist Mono** | Existing | Fix 2.4.0 bug (`--font-mono` pointed at Geist) |
| Human voice | **Instrument Serif** (regular + italic) | Open licence (OFL); self-hosted via `next/font` | Used sparingly (Section 4.4) |

```css
:root {
  --font-display: 'Brooklyn', 'Geist', system-ui, sans-serif;
  --font-sans:    'Geist', 'Geist Fallback', system-ui, sans-serif;
  --font-mono:    'Geist Mono', ui-monospace, 'SFMono-Regular', Menlo, monospace;
  --font-human:   'Instrument Serif', 'Iowan Old Style', Georgia, serif;
}
```

Only two weights per family are preloaded (display 700; body 400/600). Mono 500. Everything else lazy. Subset to Latin plus the characters used by the Boot Preloader (Bengali, Devanagari, Japanese, Cyrillic, Arabic) loaded **only** during boot via `unicode-range`, not site-wide.

### 4.2 Fluid type scale

```css
:root {
  --step--2: clamp(0.70rem, 0.68rem + 0.10vw, 0.75rem);   /* 11–12  mono micro */
  --step--1: clamp(0.78rem, 0.76rem + 0.12vw, 0.8125rem); /* 12.5–13 */
  --step-0:  clamp(0.9375rem, 0.92rem + 0.18vw, 1.0625rem);/* 15–17  body */
  --step-1:  clamp(1.125rem, 1.05rem + 0.35vw, 1.35rem);   /* lead */
  --step-2:  clamp(1.35rem, 1.2rem + 0.7vw, 1.8rem);       /* H4 / card title */
  --step-3:  clamp(1.75rem, 1.4rem + 1.5vw, 2.8rem);       /* H3 / section sub */
  --step-4:  clamp(2.25rem, 1.6rem + 3vw, 4.25rem);        /* H2 */
  --step-5:  clamp(3rem, 1.8rem + 5.5vw, 6.5rem);          /* H1 page */
  --step-6:  clamp(3.5rem, 1.5rem + 9vw, 9rem);            /* Hero statement */
}
```

### 4.3 Role specifications

| Role | Family | Step | Weight | Tracking | Line height | Case | Notes |
|------|--------|------|--------|----------|-------------|------|-------|
| Hero statement | Display | `--step-6` | 700–800 | -0.045em | 0.9 | Sentence | One per site; max 3 lines; masked line reveal |
| Page H1 | Display | `--step-5` | 700 | -0.035em | 0.95 | Sentence | |
| Section H2 | Display | `--step-4` | 700 | -0.03em | 1.0 | Sentence | |
| H3 | Display/Sans | `--step-3` | 600 | -0.02em | 1.1 | Sentence | |
| Card title | Sans | `--step-2` | 600 | -0.01em | 1.2 | Sentence | |
| Lead | Sans | `--step-1` | 400 | 0 | 1.5 | Sentence | max 60ch |
| Body | Sans | `--step-0` | 400 | 0 | 1.6 | Sentence | max 68ch |
| System label | Mono | `--step--1` | 500 | 0.08em | 1.2 | UPPERCASE | e.g. `[ 03 / PROJECTS ]` |
| System micro | Mono | `--step--2` | 500 | 0.10em | 1.2 | UPPERCASE | Coordinates, figure numbers, timestamps |
| Data numerals | Mono | contextual | 500 | 0 | 1 | | `font-variant-numeric: tabular-nums slashed-zero` |
| Human statement | Human | `--step-3`–`--step-4` | 400 | -0.01em | 1.15 | Sentence | Italic allowed for emphasis |
| Human quote | Human italic | `--step-2` | 400 | 0 | 1.3 | Sentence | |
| Code | Mono | `--step--1` | 400 | 0 | 1.6 | | |

### 4.4 Rules

1. **Serif is the human voice only**: the About statement, quotes, testimonials, signed notes, owner replies in live chat, and at most one emphasis word per page H1 on Bone chapters. Never in navigation, buttons, data, or code.
2. **Mono is the system voice only**: labels, chapter numbers, metadata, status, code. Never for paragraph text.
3. **No more than three type sizes in a single viewport** outside the hero.
4. Headlines use `text-wrap: balance`; paragraphs use `text-wrap: pretty`.
5. `font-optical-sizing: auto` and `font-kerning: normal` globally.
6. Maximum line length: 68ch body, 24ch for display lines in narrow columns.
7. Numbers in data contexts are always tabular.
8. Never fake bold or italic; load the real style or do not use it.
9. Hyphenation off for headlines, `hyphens: auto` for long-form article body with a correct `lang` attribute.

### 4.5 Boot preloader typography

The multilingual greetings (Bengali সাহিনুর, Hindi साहिनुर, Japanese サヒヌル, Russian сахинур, Arabic ساهينور, English Sahinur) are set in Geist Mono where glyphs exist and in the system's script fallback otherwise, with explicit `lang` and `dir="rtl"` for Arabic. Each greeting types on with `--ease-linear`, holds 280ms, and swaps with a 1-frame glitch. Total sequence ≤ 2.5s, skippable.

---

## 5. Layout System

### 5.1 Grid

- 12 columns at `lg` and up, 8 at `md`, 4 at `xs/sm`.
- Gutter: `clamp(16px, 2vw, 32px)`. Page margin: `clamp(20px, 4vw, 64px)`.
- Content max width 1440px; the stage and chapter dividers may bleed full width.
- A subtle 12-column hairline grid (`--line-1`) is visible only in the hero and in tools/lab canvases, as an instrument-panel cue. It is decorative (`aria-hidden`), toggled off in reduced-data mode.

### 5.2 Composition rules

1. **Asymmetry by default.** Primary content spans 7–8 columns, offset; secondary spans 3–4. Fully centered layouts are reserved for the 404, legal and form-completion states.
2. **Oversized type is the hero image.** Where the 3D operator is absent, scale type up rather than adding a stock visual.
3. **Edges matter.** Align to the grid, then break it deliberately once per chapter (an element bleeding past the margin, a figure overlapping a heading) so the layout feels designed rather than assembled.
4. **Density contrast.** Pair one airy region with one dense data region per chapter.
5. **Three-up card rows are banned** as a default layout. Lists are tables, indexes, or asymmetric editorial grids.

### 5.3 Surfaces and chapters

Each chapter is a `<section data-surface="void|bone" data-chapter="NN">`. Surface changes use a clip-path wipe (Section 7.5), never a plain color cut. Chapter order and surfaces for Home are in Section 9; content-first pages (blog, wiki, docs) default to Bone.

### 5.4 The Frame (replaces the glass card)

A **Frame** is a hairline-bordered panel with diagonal crop-mark ticks that appear on hover and focus.

```css
@layer components {
  .frame {
    position: relative;
    background: var(--bg-panel);
    border: var(--hairline) solid var(--line-2);
    border-radius: var(--radius-2);
    transition: border-color var(--dur-fast) var(--ease-mech),
                background-color var(--dur-fast) var(--ease-mech);
  }
  .frame::before,
  .frame::after {
    content: "";
    position: absolute;
    inline-size: 10px;
    block-size: 10px;
    border: var(--hairline) solid var(--accent);
    opacity: 0;
    transition: opacity var(--dur-fast) var(--ease-mech);
    pointer-events: none;
  }
  .frame::before { inset: -1px auto auto -1px; border-inline-end: 0; border-block-end: 0; }
  .frame::after  { inset: auto -1px -1px auto; border-inline-start: 0; border-block-start: 0; }
  .frame:is(:hover, :focus-within) { border-color: var(--line-3); background: var(--bg-raised); }
  .frame:is(:hover, :focus-within)::before,
  .frame:is(:hover, :focus-within)::after { opacity: 1; }
}
```

Variants: `frame--featured` adds a chamfered filled header strip; `frame--flat` removes the hover treatment for static content; `frame--bone` is automatic through semantic tokens.

### 5.5 Chamfer

Filled elements (primary buttons, featured tags, badge strips) use a 12px cut corner. Bordered elements do NOT use `clip-path` (the border would be clipped); they use the Frame ticks instead.

```css
.chamfer {
  clip-path: polygon(0 0, calc(100% - var(--chamfer)) 0, 100% var(--chamfer),
                     100% 100%, var(--chamfer) 100%, 0 calc(100% - var(--chamfer)));
}
```

### 5.6 Chapter rail and coordinates

- **Chapter rail** (desktop `lg+`): fixed at the left margin, a vertical list of two-digit chapter numbers with a progress line. The active chapter is signal-colored and expanded to show its title. Clicking jumps through `navState` (Lenis aware). On `md` and below it becomes a thin top progress bar with the current chapter label.
- **Coordinate labels**: small mono labels at frame corners and stage edges (`N 22.57° E 88.36°` for Kolkata, `SEC 03`, `FIG. 04`) add instrument texture. They are `aria-hidden` when purely decorative and must not be the only carrier of meaning.

### 5.7 Grain and scanline

- **Grain**: one fixed pre-rendered noise tile (128px WebP, tiled, 3–4% opacity, `mix-blend-mode: overlay`) at `--z-grain`. Not an SVG `feTurbulence` filter (too costly).
- **Scanline**: one subtle horizontal band animation, only on Void surfaces, 8s loop, 2–3% opacity, disabled under reduced motion and when the tab is hidden. In God Mode it intensifies (Section 12.6).

---

## 6. Imagery, Iconography and Data Visualization

### 6.1 Photography and media

- **Real subject matter only**: project screenshots, the owner's photography, patent documents, product shots. No stock imagery.
- **Treatment**: unified. Project covers sit in a Frame with a mono caption (`FIG. 07 — Parcel tracker, dashboard, 2026`). Images are shown at natural contrast; a very slight desaturation plus restored color on hover is allowed only for index grids, never for hero imagery.
- **Aspect ratios** (retained from 2.4.0): project covers 16/9, store cards 4/3, article hero 21/9, avatar and square 1/1. Always explicit `aspect-ratio` and dimensions (CLS 0).
- **Delivery** (retained): Cloudinary `f_auto,q_auto,c_fill,g_auto` through `buildCloudinaryUrl`; `next/image` with sizes; AVIF/WebP; only the LCP image gets `priority`.
- **Hover**: scale 1.03 maximum, 400ms `--ease-out`, `overflow: hidden` on the Frame, disabled under reduced motion.

### 6.2 Iconography

- Custom inline SVG set, 24px grid, 1.5px stroke, square caps and miter joins (matches chamfer geometry), `currentColor`.
- Delivered as an SVG sprite or React components; **no new icon library**.
- No emoji as UI icons. Icons never carry meaning alone; they pair with a label or `aria-label`.
- Minimum size 16px; touch targets ≥ 44px including padding.

### 6.3 Illustration and diagrams

- Diagrams are line art on the hairline grid using `--line-3` and `--accent`, labeled in mono. The `/architecture` page is the showcase: nodes are Frames, edges are animated dashed lines (stroke-dashoffset), and the request-flow animation uses `--ease-linear`.
- No generic vector people or isometric blobs.

### 6.4 Data visualization

- Series colors: `--accent` primary, `--fg-2` secondary, `--fg-3` tertiary, plus `--warn` for threshold cues. Differentiate by **pattern and label**, not hue alone.
- Axes and labels in mono at `--step--2`. Gridlines `--line-1`. Direct labels beat legends.
- Numerals tabular. Animations count up with `--ease-linear` and finish within 800ms; static under reduced motion.

---

## 7. Motion System

### 7.1 Principles

1. **Two kinds of motion, matching the voices.** System motion is mechanical (typed, stepped, scanned, counted; `--ease-mech` or linear). Human motion is organic (ease-out, spring with ≤ 6% overshoot, slow breathing).
2. **Motion explains.** It reveals structure, directs attention, confirms input, or moves between states. Otherwise it is cut.
3. **Only `transform`, `opacity`, `clip-path` and (sparingly) `filter` on small elements.** Never animate layout properties, `box-shadow` spread, or `backdrop-filter`.
4. **One motion idea per chapter.** If a chapter has a pinned sequence, nothing else on it parallaxes.
5. **Interruptible.** Every animation can be superseded by new input without stutter.
6. **60fps on mid-range mobile or the effect is simplified.**

### 7.2 Timing guide

| Interaction | Duration | Easing |
|-------------|----------|--------|
| Hover and focus feedback | 140ms | `--ease-mech` |
| Button press | 80ms | `--ease-mech` |
| Panel and menu open | 240ms | `--ease-out` |
| Tabs and segmented indicator | 240ms | `--ease-out` |
| Line-mask text reveal | 700ms per line, 70ms stagger | `--ease-out` |
| Counter and typed text | proportional, ≤ 900ms | linear |
| Route transition | 180–220ms (450ms abort guard) | cross-fade |
| Chapter mode-shift wipe | 900ms | `--ease-inout` |
| Operator camera moves | 1200–1800ms scrubbed to scroll | scrubbed (`scrub: 0.6`) |
| Boot scan-in | ≤ 1400ms | linear scan, `--ease-out` settle |

### 7.3 GSAP and Lenis conventions

- Single Lenis instance, `lerp: 0.1`, driven by `gsap.ticker`; `ScrollTrigger.update` on Lenis `scroll`; `gsap.ticker.lagSmoothing(0)`. Mobile uses native scroll (existing behavior retained).
- All timelines created in `useGSAP`/`gsap.context()` and reverted on unmount. No orphan ScrollTriggers.
- Scroll-linked values mutate refs or uniforms, **never React state per frame**.
- Pinned sequences: the Experience stack keeps its sticky offsets (`top: 100px + index * 24px`, `scale: 0.98` on cover) and is the only pinned sequence in its chapter.
- Prefer **native CSS scroll-driven animations** (`animation-timeline: scroll()/view()`) for simple progress and reveal effects behind `@supports`, with GSAP as the fallback and for complex choreography.
- SplitText (or an equivalent small in-house splitter) is used for line, word and character reveals; confirm the licence status of the GSAP plugins in use [VERIFY] before adding any new plugin.

### 7.4 Text reveals

Headings reveal line by line from a mask (`overflow: clip`, each line translating from 105% to 0). Body copy fades up 12px. System labels type on character by character. Respect the "one motion idea per chapter" rule.

### 7.5 Chapter mode-shift (Void ↔ Bone)

The incoming chapter's background expands via `clip-path: inset()` from the edge in the scroll direction over 900ms (`--ease-inout`). Content inside inherits the new semantic tokens at the midpoint to avoid a flash. Under reduced motion the surfaces change instantly at the chapter boundary.

### 7.6 Route transitions

Retained: View Transitions API with CSS cross-fade fallback, 180–220ms, 450ms abort timeout, instant under reduced motion. The chapter rail and header are `view-transition-name` persistent elements so they do not flicker.

### 7.7 Reduced-motion contract

| Effect | Under `prefers-reduced-motion: reduce` or `data-motion="reduced"` |
|--------|--------------------------------------------------------------------|
| Lenis smooth scroll | Off; native scroll |
| Pinned stacking | Normal vertical list |
| Line reveals and fades | Content visible immediately |
| Chapter wipe | Instant surface switch |
| Typed text | Final text shown |
| Counters | Final value |
| Grain | Kept (static) |
| Scanline, ambient loops | Off |
| 3D stage | Static poster render; no camera motion, no idle animation |
| Custom cursor follower | Off (native cursor) |
| Playground drag | Disabled |
| Route transitions | Instant |

```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.001ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.001ms !important;
    scroll-behavior: auto !important;
  }
}
```

Users can also force this with a footer toggle (persisted in `localStorage` within try/catch), which sets `data-motion="reduced"`.

---

## 8. The Operator Stage (3D System)

### 8.1 Purpose and rules

The Stage is the signature of the site: the owner's `.glb` model lit and directed like a product shot, living in a fixed canvas behind the Home chapters. It is **progressive enhancement**: the site is complete without it.

Hard rules:

1. **One live WebGL renderer at a time.** The Stage and the Globe never render simultaneously; the inactive one is paused or disposed before the other mounts.
2. The Stage is **never the LCP element**. The LCP element is a still render (`operator-poster.avif`) of the same camera and lighting.
3. The 3D chunk is dynamically imported after the first paint and idle, not counted against initial JS.
4. No essential content or navigation lives inside the canvas.
5. Must work with 3D unavailable: static poster, same layout, no empty box (explicit `aspect-ratio`).

### 8.2 Technology

- `three` plus `@react-three/fiber` v9 (React 19 compatible) and `@react-three/drei`, dynamic import, client only [VERIFY exact versions at install; pin exact versions].
- `@gltf-transform/cli` for the asset pipeline (offline, not shipped).
- Meshopt or Draco decoders self-hosted under `/public/3d/decoders/`; KTX2 (Basis) transcoder self-hosted if KTX2 textures are used. **No decoders or HDRIs from third-party CDNs** (CSP and privacy).
- Post-processing: **none by default.** Vignette and grain are done in CSS over the canvas. If one effect is added later (for example subtle bloom on emissive parts), it requires a measured performance case (DDR).
- Future: three.js WebGPU renderer with automatic WebGL fallback is allowed once stable in the pinned version (Section 19).

### 8.3 Asset pipeline (mandatory, in this order)

1. Keep the original in `assets-source/models/` (not in `public/`).
2. Inspect: triangles, vertices, meshes, materials, textures, skeleton, animations. Record in `docs/3d/ASSET-REPORT.md`.
3. Optimize with gltf-transform: dedupe, prune, resample animation, weld/simplify only if above budget, texture resize, Meshopt (or Draco) geometry compression, KTX2 or WebP textures.
4. Produce two delivery tiers:
   - `operator-high.glb` (desktop): target ≤ 3 MB, ≤ 100k triangles, textures ≤ 2048px.
   - `operator-low.glb` (mobile and mid-range): target ≤ 1.2 MB, ≤ 40k triangles, textures ≤ 1024px.
5. Render the poster set from the real scene with final lighting: `operator-poster.avif` and `.webp` at 1×/2× and a 24px blurred placeholder (LQIP), for each chapter state that shows the model (hero, about, footer).
6. Preload only the tier that will be used; `useGLTF.preload` after idle.

If the inspection shows budgets cannot be met without visible loss, the agent reports and the owner decides (DDR).

### 8.4 Scene composition

- **Camera**: perspective, FOV 28–35° (portrait-like compression, flattering and less distorted than wide FOV). Starting position gives a medium shot (waist-up) with the model on the right third on desktop, centered and lower on mobile.
- **Background**: transparent canvas over the DOM; depth is created by lighting, a faint floor reflection (fake: a gradient plane, not real reflection), and the CSS grid and grain layers.
- **Floor**: invisible shadow-catcher with soft contact shadow (drei `ContactShadows` or a baked texture), low resolution (512), blur 2.5–3.5.

### 8.5 Lighting rig

All lighting is physically plausible, low-count, and tuned in a dedicated `/stage-lab` dev route (noindex, dev and preview only).

| Light | Role | Position (relative to model, starting values) | Color | Notes |
|-------|------|-----------------------------------------------|-------|-------|
| **Key** | Main form | Upper left front (-2.2, 2.6, 2.4), directional or spot, soft | Warm neutral `#FFF1E0` | Human voice; intensity ~2.2; shadows off (contact shadow only) |
| **Rim** | Separation from Void | Behind right (2.4, 1.8, -2.6) | `--signal-500` `#10B981` | System voice; intensity ~3.0; the "console light" |
| **Fill** | Lift shadows | HDRI only | Neutral cool | Environment intensity ~0.35 |
| **Kicker** (optional) | Edge on the hair or shoulders | Behind left low | Cool white | Only if the model needs it |

- **Environment**: a self-hosted 1k `.hdr` (or `.exr`) studio-style HDRI under `/public/3d/env/`, used only for reflections and fill; background stays transparent.
- **Tone mapping**: ACES Filmic (or AgX if the pinned three version provides better color on skin and the owner prefers it), `outputColorSpace = SRGBColorSpace`, exposure ~1.0.
- **Materials**: respect the PBR materials in the file; adjust roughness or envMap intensity only through a documented override map. Never recolor skin or clothing.
- **Dynamic lighting hooks**: the rim light color and intensity respond to theme state: Void/default = signal green, Bone chapters = rim fades and key warms, God Mode = phosphor rim with a faint scanline shader (Section 12.6), CTA hover in the contact chapter = rim intensifies briefly.
- Lighting values are stored in a typed config (`src/stage/lighting.config.js`) so art direction changes do not require code changes.

### 8.6 Behavior and choreography

| State | Trigger | Behavior |
|-------|---------|----------|
| **Boot scan-in** | After preloader greetings | Model materializes through a horizontal scan: a custom shader uniform (`uScan` 0→1) clips and brightens the edge in signal green over ≤ 1.4s, then settles to the final material. Poster cross-fades under it |
| **Idle** | Hero | If rigged: subtle breathing and weight shift loop (human motion); if not rigged: ≤ 1.5° slow yaw drift. Amplitudes capped; paused offscreen and in hidden tabs |
| **Pointer follow** | Fine pointer only | Head and spine (if rigged) or whole-model yaw ease toward the cursor within ±12°, lerped, 0.08 damping; disabled on touch and reduced motion |
| **Greeting** | First hero view only | Optional single wave or nod if an animation exists in the file; once per session |
| **Scroll shot list** | Scroll position | Camera and model state interpolate between chapter keyframes (Section 9.2) scrubbed through a GSAP timeline mutating refs |
| **Hand-off to Globe** | Entering the Globe chapter | Stage fades to opacity 0 over 400ms, then `frameloop="never"` and resources released; Globe mounts afterwards. Reverse on exit |

### 8.7 Performance tiers

| Tier | Condition | Experience |
|------|-----------|------------|
| **T0** | `prefers-reduced-motion`, `saveData`, low `deviceMemory` (< 4), `hardwareConcurrency` < 4, WebGL unavailable, user toggle "3D off", or `?3d=off` (dev/preview) | Poster only; no canvas, no three.js download |
| **T1** | Mobile and mid-range | `operator-low.glb`, DPR clamp [1, 1.5], no contact-shadow blur animation, pointer-follow off, lighting rig reduced to key plus rim plus HDRI |
| **T2** | Desktop with decent GPU | `operator-high.glb`, DPR clamp [1, 2], full rig, pointer follow |

Common runtime rules: `frameloop="demand"` when static and `invalidate()` on interaction; pause with `IntersectionObserver` when offscreen and with `visibilitychange` when hidden; a frame-time monitor drops one tier if the median frame time exceeds 24ms for 2 seconds; handle `webglcontextlost` and `restored`; dispose geometries, materials and textures on unmount; never allocate per frame.

### 8.8 Accessibility of the Stage

- The canvas is `aria-hidden="true"` with the poster providing an `alt` on the visible `<img>` fallback (for example "Portrait render of Sonu at his console"). Meaning is carried by DOM text.
- No keyboard traps; no focusable elements inside the canvas.
- Text over the Stage must meet contrast against the poster and the darkest and lightest plausible canvas states (use a scrim gradient behind text where needed).
- No flashing exceeding WCAG limits; scan-in is a single pass.

### 8.9 Other Stage placements

| Place | Treatment |
|-------|-----------|
| `/about` | Close-up or three-quarter shot on Bone with warm key; short idle only |
| `/404` | Operator facing away or shrugging pose (if the rig allows), "SIGNAL LOST" copy; poster fallback |
| Footer | Small operator still or tiny live canvas (T2 only) looking toward the contact CTA |
| `/lounge` | FUTURE: use as the owner's presence avatar |

Pages other than Home reuse the cached GLB (no refetch) but mount their own small canvas, only when visible.

### 8.10 The Globe (existing)

Retained as a separate chapter with these updates: arc colors from tokens (`--accent`, `--fg-3`), atmosphere shader tinted by `--signal-500` at low alpha, labels in mono, static fallback image on T0, and the one-renderer rule from 8.1.

---

## 9. Home Page Blueprint (Chapter by Chapter)

### 9.1 Overview

Home is a sequence of numbered chapters on alternating surfaces, held together by the chapter rail and the Operator Stage. The goal is a recruiter understanding who this is within the first screen and a client understanding what to do within the last.

### 9.2 Chapter table

| # | Chapter | Surface | Purpose | Layout | Signature detail | Motion idea | Stage state |
|---|---------|---------|---------|--------|------------------|-------------|-------------|
| 00 | **Boot** | Void | Identity and personality in 2s | Full-viewport terminal, greetings typed | Multilingual name sequence, build SHA line | Typed text then scan-in | Model scans in behind final greeting |
| 01 | **Operator (Hero)** | Void | State who and what, with proof and path | Hero statement (`--step-6`, 3 lines max) on the left 7 columns; operator on the right; telemetry strip at the base; CTA pair | Hero line carries the value proposition with real specifics (role, years, patent), not a slogan; availability badge as a live status dot | Line-mask reveal; telemetry types on | Medium shot, key warm, rim signal |
| 02 | **Human (About)** | **Bone** | The person behind the system | 5-column serif statement, 4-column facts list in mono, a pull quote | Serif human voice begins here; Kolkata coordinates label | Slow fades only | Push in to head-and-shoulders; rim fades; key warms |
| 03 | **Experience** | Void | Career proof | Pinned card stack (existing logic) on the right, role summary and counters on the left | Dates in tabular mono; current role has a live dot | Stack pin with scale-back (the chapter's one motion idea) | Model recedes to left edge, 30% scale, 40% opacity |
| 04 | **Projects** | Void | Work proof | Index table with filter segmented control; hover reveals a Frame preview; detail opens a full-screen case-study overlay | Table, not a card grid; FIG numbering | Row hover with preview follow (transform only) | Stage dimmed to 12% opacity (CSS) and paused |
| 05 | **Reach (Globe)** | Void | Global trust | Globe full-bleed, client list as mono index on the side | Arcs in signal, labels in mono | Globe auto-rotation, pointer drag | Stage released; Globe active |
| 06 | **Credentials** | **Bone** | Credibility ledger | Patent as a hero artifact (Indian Patent No. 544062) in a large Frame; 30+ credentials as a dense verifiable index | Each credential row links to verification when available | Counter on total; row reveals | None |
| 07 | **Writing** | **Bone** | Show thinking | Latest 3 posts as an editorial list with big numerals and reading times | Serif titles optional; mono metadata | Row hover underline wipe | None |
| 08 | **Contact (Footer)** | Void | Convert | Giant "Let's build something that holds up." style line (copy in Section 15), live chat and contact CTAs, telemetry footer | Footer wordmark ~20vw at 6% opacity; local time; availability | Hover rim-intensify on Stage; CTA magnetic effect (fine pointer only) | Small operator returns, looks toward CTA |

### 9.3 Mobile behavior

- Chapter rail becomes a top progress bar; a bottom sticky CTA bar is kept (existing behavior).
- Stage tier T1 or T0; hero statement drops to `--step-5`; pinned stack becomes a vertical list; Globe is a static or reduced-quality render unless tier allows.
- All hover reveals have tap equivalents.

### 9.4 Hero content rules

- The H1 states **role plus proof plus domain** in plain words. Placeholders until the owner approves final copy: "Senior web engineer building secure, real-time systems." The patent, years of experience and key outcomes appear in the telemetry strip beneath, in mono.
- Exactly two CTAs: primary (Start a conversation) and secondary (View architecture). The resume download lives in the header utility and the footer.
- Availability badge reads from `siteStatus` (CMS), with date.

---

## 10. Navigation and Wayfinding

Builds on Redesign Phase R0 (`src/config/navigation.js` is the single source of truth).

### 10.1 Header

- Height 64px desktop, 56px mobile. Background `--bg-overlay` with `backdrop-filter: blur(16px)` (one of the three permitted glass uses). Hairline bottom border `--line-1`.
- Left: logo mark (monogram "SK") plus a mono wordmark. Center-left: the five groups (**Work, Knowledge, Lab, About**, plus the **Contact** CTA at the right). Right: command trigger chip (`⌘K` / `Ctrl K`), Magic Wand (desktop), motion toggle (in footer, not header), menu button.
- Group panels open on hover-intent (120ms delay) and on focus/click; each panel is a two-column list with item titles, one-line descriptions, and a status tag for `partial` or `stub` pages (visible during the redesign for the owner, hidden before launch via a flag).
- The header auto-hides on scroll down and returns on scroll up (transform only), always visible when focus is within.

### 10.2 All-pages index (the full-screen menu)

Opened by the menu button or `M`. Registered with `openOverlay('site_menu')`.

- Full-viewport overlay on Void with an oversized numbered index of every page (`01 Projects … 24 Terms`) in `--step-4` display type, grouped under mono group labels.
- Hover or focus on a row shows a preview (poster image, one-line description, status) in a Frame at the right; on touch, tap opens directly.
- Includes live telemetry strip, search field (palette lite), and legal links at the bottom.
- Keyboard: arrow keys navigate rows, `Enter` opens, `Esc` closes and returns focus; focus is trapped inside; background scroll locked through the overlay system.
- Mobile: same list, previews omitted, rows are full-width 56px targets.

### 10.3 Chapter rail

Specified in 5.6. It appears on Home and on long content pages (docs, wiki articles, blog posts) where it mirrors the table of contents.

### 10.4 Command palette (existing, restyled)

Frame on `--bg-overlay` (second permitted glass use), mono input, results grouped by Pages, Actions, Content, and (God Mode) System. Commands come from `src/lib/commands.js` and the navigation config. Shows keyboard hints in mono. Result rows have 44px minimum height.

### 10.5 Footer

Giant faded wordmark, sitemap columns generated from the config, legal links, telemetry strip (time in IST, last deploy SHA, status link), consent settings link, motion toggle, 3D toggle ("Operator: on/off"), and the AI notice for the chat widget.

### 10.6 Breadcrumbs and orientation

Content pages show a mono breadcrumb (`KNOWLEDGE / WIKI / ARCHITECTURE`) and a chapter-style heading number. The page title, favicon state and `aria-current` always reflect location.

---

## 11. Components

All components consume semantic tokens, support Void and Bone, support keyboard, define every state, and are documented in `src/components/README.md` with usage and anti-patterns.

### 11.1 State matrix (applies to every interactive component)

Default · Hover · Focus-visible · Active/pressed · Selected · Disabled · Loading · Error · Success. Disabled elements remain readable (≥ 3:1 for non-text, text ≥ 4.5:1 equivalent through opacity limits of 0.55 maximum reduction) and are not focusable unless `aria-disabled` is needed for explanation.

### 11.2 Focus

```css
:focus-visible {
  outline: var(--rule-strong) solid var(--focus-ring);
  outline-offset: 3px;
  border-radius: inherit;
}
```

Never `outline: none` without an equivalent. Focus rings are visible on both surfaces and on top of the Stage scrim.

### 11.3 Buttons

| Variant | Look | Use |
|---------|------|-----|
| **Primary** | Filled `--accent`, text `--accent-ink`, chamfered 12px, mono uppercase label (`--step--1`, tracking 0.08em) | One per view |
| **Secondary** | Transparent with `--line-3` hairline, crop-mark ticks on hover/focus, label `--fg-1` | Alternatives |
| **Tertiary / text** | Mono or sans label with signal underline wipe (left to right, 240ms) | Inline actions |
| **Icon** | 44×44 target, Frame ticks on hover | Toolbars |
Sizes: S 40px, M 48px, L 56px height (all ≥ 24×24 minimum target, and ≥ 44px on touch). Loading state replaces the label with a typed ellipsis (`…` cycling) at fixed width to avoid layout shift. Fine-pointer-only magnetic pull ≤ 6px on primary CTAs; disabled on touch and reduced motion.

### 11.4 Links

Inline links use `--accent-hi` text with an underline offset 0.2em; hover animates an underline wipe. External links show a small ↗ glyph and `rel="noopener"`. Visited state subtly dims on Bone reading surfaces only.

### 11.5 Tags and chips

Mono uppercase `--step--2`, 2px radius, hairline border, 24px height. Status tags use a leading dot (`--ok`, `--warn`, `--err`) and text. Never filled with saturated color.

### 11.6 Filters and tabs (segmented control)

Hairline container with a sliding indicator moved by `transform` (240ms `--ease-out`). Arrow-key navigation, `role="tablist"` or `radiogroup` as appropriate. Changing a filter animates results with a 140ms opacity-and-translate (8px) stagger capped at 12 items.

### 11.7 Inputs and forms

- Boxed hairline inputs (`--line-2`, 48px height, 2px radius), mono labels above, helper text below.
- Focus: border `--accent`, 2px ring offset; error: `--err` border plus an icon plus text (never color only); success: `--ok` check.
- Textareas show a mono character counter (`0412 / 2000`) in `--fg-3`.
- Turnstile and honeypot are visually integrated and invisible to users; failure messaging is human and specific.
- `autocomplete` and `inputmode` attributes always set; labels always visible (no placeholder-only labels).
- The submit button reflects state with typed copy: `SEND` → `SENDING…` → `SENT`.

### 11.8 Overlays: modal, drawer, popover

The permitted glass surfaces. `--bg-overlay`, `backdrop-filter: blur(16px)` (max 16px, solid fallback via `@supports not (backdrop-filter: blur(1px))`), `--shadow-overlay`, hairline border, 4px radius. Registered through `openOverlay`, focus trapped, `Esc` closes, scroll locked, return focus to trigger. **Maximum two blurred layers visible at once.** On low-power or `saveData`, overlays use solid `--ink-4`.

### 11.9 Panels (cards) and lists

Frames as specified in 5.4. **Preferred patterns over card grids**: index tables, ruled lists with hover previews, asymmetric editorial grids, and master-detail layouts. Card grids are allowed only for product shelves where visual comparison is the task.

### 11.10 Code blocks and Portable Text

- Background `--bg-sunken`, hairline, 4px radius, `--step--1` mono, line numbers optional, copy button (44px) with typed "COPIED" feedback.
- Syntax theme built from tokens: keywords `--accent-hi`, strings `--warn`, comments `--fg-3`, functions `--fg-1`, numbers `--info`. Contrast checked per surface; Bone gets a dedicated light variant.
- Callouts: a left rule 2px `--accent` (info), `--warn`, `--err`; mono label; never colored fills larger than the rule.

### 11.11 Status and live indicators

- Status dot: 8px, `--radius-full`, pulse 2s loop (`transform: scale` + `opacity`), static under reduced motion, always accompanied by text.
- Live telemetry items always show a `—` fallback and a visually hidden "unavailable" message when sources fail.

### 11.12 Loading, empty and error states

| State | Pattern |
|-------|---------|
| Loading (content) | Skeleton bars on `--bg-raised`, reserved dimensions, shimmer ≤ 2% brightness, static under reduced motion |
| Loading (page/overlay) | Mono line `LOADING // 02 of 05` with a progress bar of `--accent` |
| Empty | Mono system line explaining why, plus a clear next action (`NO ENTRIES YET. CHECK BACK SOON.`) |
| Error | Plain-language human sentence (serif) plus a mono code (`ERR_NETWORK`) plus a retry action |
| Offline | Dedicated `/offline` page: "Signal lost. Your cached pages still work." with a link list of cached routes |

### 11.13 Toasts

Bottom-left, mono, Frame, 4s auto-dismiss (6s for errors, pause on hover and focus), `role="status"` or `role="alert"`, max two stacked.

### 11.14 Chat widget

- Trigger: 56px target, Frame, signal dot when owner available.
- **AI mode (genious.exe)** uses the System voice: mono timestamps, labeled "AI ASSISTANT" with the `--ai` dot, assistant messages left, plain `--bg-panel`.
- **Live mode (Sonu)** uses the Human voice: serif message text on a warm Bone-tinted bubble, labeled with the owner's name.
- Typing indicator is three stepped squares, not bouncing dots. Chime muted by default until interaction.
- Always shows the AI and relay privacy notices in a collapsed row.

### 11.15 Custom cursor (revised)

- Enabled only for `(pointer: fine)` and `(hover: hover)` after JS is ready; **native cursor is never hidden over text inputs, text selection, or when reduced motion is on.**
- A 6px dot follows the pointer instantly; a 32px ring lags (lerp 0.18) and morphs: grows over links and buttons, becomes a text caret bar over editable text, and shows a mono label ("VIEW", "DRAG", "PLAY") over media.
- `mix-blend-mode: difference` is allowed but must pass contrast checks in the default states; off on Bone chapters where it reduces legibility.
- Uses `transform` only; one rAF loop shared with the GSAP ticker.

### 11.16 Footer wordmark and telemetry strip

Telemetry strip fields (each optional, never fabricated): `IST 14:32:07`, `BUILD a1b2c3d`, `STATUS ONLINE`, `NOW PLAYING —`, `CHESS RAPID —`. Updates once per second for the clock only; other fields update on data fetch. `aria-hidden` for the ticking clock, with a static accessible time label elsewhere.

---

## 12. Interaction Patterns

### 12.1 Scroll

Smooth scroll on desktop (Lenis), native on touch. Anchor navigation always uses `navState` and `transitionNavigate`. Scroll-linked effects have a non-scroll-linked fallback.

### 12.2 Keyboard map

| Key | Action |
|-----|--------|
| `Ctrl/Cmd + K` | Command palette |
| `M` | All-pages index (when no input is focused) |
| `?` | Shortcut help overlay |
| `G` then `H`/`B`/`W`/`P` | Go Home / Blog / Wiki / Projects (when no input is focused) |
| `Esc` | Close the topmost overlay |
| Arrow keys | Navigate lists, tabs, menus |
| Konami code | God Mode (Section 12.6) |
Shortcuts never fire while typing in inputs, textareas or contenteditable (including Chaos Mode editing).

### 12.3 Touch

44px minimum targets, tap equivalents for every hover reveal, no gesture-only actions, swipe to dismiss overlays supported but never required.

### 12.4 Hover intent

Panels and previews open after a 120ms hover-intent delay and close after 200ms to prevent flicker; tooltips appear after 400ms and on focus immediately.

### 12.5 Playground (Chaos Mode)

Existing behavior retained (drag with GSAP Draggable, editable text). Visual updates: draggable elements show a dashed `--accent` outline and a mono handle label while Chaos Mode is on; a "RESET LAYOUT" button sits in a floating Frame; the mode is desktop, fine pointer, non-reduced-motion only.

### 12.6 God Mode (phosphor)

Activated by `sudo su`, the Konami code, or 7 taps on the footer logo (Section PRD FR-GOD). The transformation:

- `data-god-mode="true"` remaps the accent to `--phosphor`, desaturates secondary hues, and sets all System voice text to phosphor tints.
- Scanline intensity rises to ~6% opacity; subtle chromatic offset on headings (1px, transform-based, static under reduced motion).
- The Stage rim light becomes phosphor; a thin phosphor edge shader runs on the model (T2 only).
- Unlisted routes appear in the palette under System.
- Everything stays WCAG-contrast compliant (verified against the God Mode token set); `exit` restores everything with a 240ms transition on color tokens.

### 12.7 Telemetry and live data behavior

Skeleton → value, never a layout jump. Stale data (older than the source's cache window plus a grace period) shows a subtle dim and the last-updated time on hover or focus.

---

## 13. Accessibility (WCAG 2.2 AA)

| ID | Requirement |
|----|-------------|
| A-01 | Text contrast ≥ 4.5:1 (3:1 for ≥ 24px or ≥ 18.66px bold text and UI components) on every surface and in God Mode. CI contrast tests run against the token pairs. |
| A-02 | Visible focus on every interactive element, 2px, offset 3px, ≥ 3:1 against adjacent colors, never obscured by the sticky header (use `scroll-padding-top` and `scroll-margin-top`). |
| A-03 | Target size ≥ 24×24px minimum; ≥ 44×44px for primary touch controls. |
| A-04 | Full keyboard operability; logical order; no keyboard traps; skip link as the first focusable element ("Skip to content"). |
| A-05 | Reduced-motion contract in Section 7.7 enforced and tested. |
| A-06 | The 3D canvas and decorative layers (grain, grid, scanline, coordinates) are `aria-hidden`; meaningful information is always in DOM text. |
| A-07 | Dynamic regions (chat, form results, toasts) use appropriate `aria-live` roles; the ticking clock is not announced. |
| A-08 | Headings form a logical outline; one H1 per page; landmarks (`header`, `nav`, `main`, `footer`) present and labeled. |
| A-09 | Text resizes to 200% without loss and the layout works at 400% zoom and 320px width without horizontal scrolling. |
| A-10 | Color is never the only carrier of meaning (status, errors, charts). |
| A-11 | `lang` attributes on foreign-script text (boot sequence); `dir="rtl"` for Arabic. |
| A-12 | Forms: visible labels, error identification and suggestions, `aria-describedby` for hints, accessible names for Turnstile fallback. |
| A-13 | No content flashes more than three times per second; no auto-playing audio. |
| A-14 | Touch alternatives for drag (Chaos Mode is desktop only and hidden otherwise). |
| A-15 | Consistent navigation and consistent help (contact path) across pages (WCAG 3.2.x). |

Testing: axe in Playwright on all public routes (zero serious/critical), manual keyboard pass, screen reader smoke test (VoiceOver and NVDA), reduced-motion and 3D-off runs.

---

## 14. Performance Constraints on Design

| ID | Constraint |
|----|-----------|
| P-01 | LCP element on Home is the hero statement text or the operator poster; never the live canvas. |
| P-02 | Initial JS ≤ 180 KB gzip (PRD NFR-PERF-05). The Stage, Globe and tools load by dynamic import after paint/idle. |
| P-03 | CLS ≤ 0.05: every image, canvas and embed has reserved space through `aspect-ratio`. |
| P-04 | INP ≤ 100ms: hover and scroll handlers are passive and cheap; no layout reads inside scroll handlers. |
| P-05 | `backdrop-filter`: max two simultaneous layers, blur ≤ 16px, never animated, never on large scrolling surfaces. |
| P-06 | `will-change` only on elements actively animating, removed afterwards; no global `will-change`. |
| P-07 | Animate `transform`, `opacity`, `clip-path` only (small `filter` allowed on tiny elements). |
| P-08 | Fonts: ≤ 4 preloaded font files; others lazy; `font-display: swap` with size-adjusted fallbacks; script-specific boot fonts loaded only during boot. |
| P-09 | Grain is one tiled static image; no real-time noise filters. |
| P-10 | Rendering budget for the Stage: ≤ 16.6ms per frame on T2, ≤ 24ms on T1; automatic tier downgrade. |
| P-11 | Lighthouse (mobile) Performance ≥ 90 on Home and ≥ 95 on content pages; Accessibility, Best Practices, SEO ≥ 95. |
| P-12 | Third-party scripts load after consent and idle. |

---

## 15. Content and Voice

### 15.1 Voice

Precise, calm, concrete, a little dry. Specifics beat adjectives. Short sentences. Verbs first. The System voice is clipped and technical; the Human voice is warmer and first-person.

### 15.2 Rules

1. **No lorem ipsum, no placeholders at launch.** Every page ships with real copy or does not ship.
2. **No fabricated numbers.** Every statistic is real, dated, and sourced (`as of Oct 2026`).
3. **No filler openers** ("Welcome to…", "Hi, I'm…" as H1, "Passionate about…").
4. **Headlines state a fact or a promise.** Examples of the pattern, final copy to be approved: "Secure, real-time systems, built end to end." / "Six years. One patent. Production from day one."
5. **Microcopy is specific**: errors say what happened and what to do; buttons say what will occur.
6. **Capitalization**: sentence case for human text; UPPERCASE only for mono System labels.
7. **Dates and times**: ISO-like in System voice (`2026-10-11`), natural in Human voice. Time zone IST unless stated.
8. **Honesty**: never claim encryption, performance or security the system does not have (PRD principle 7).

### 15.3 Microcopy library (initial)

| Context | Copy |
|---------|------|
| Primary CTA | `Start a conversation` |
| Secondary CTA | `View the architecture` |
| Form sending / sent | `SENDING…` / `SENT. I'll reply within a day.` (only if true) |
| Form error | `Couldn't send. Your message is still here — try again.` |
| Empty list | `NOTHING HERE YET.` |
| 404 | `SIGNAL LOST. This page doesn't exist (or moved).` + links |
| Offline | `You're offline. Cached pages still work.` |
| Chat AI label | `AI ASSISTANT — automated, may be wrong` |
| Chat live label | `Sonu — live` / `Sonu is offline — leave a message` |
| Consent | Plain-language, two buttons of equal prominence |

---

## 16. Anti-Slop Rules and Review Checklist

### 16.1 Banned patterns (any occurrence blocks merge unless the owner approves a DDR)

1. Purple, violet or blue-violet gradients as backgrounds or text fills.
2. Glass cards as the default container (glass is allowed only for header, palette and overlays).
3. Three identical feature cards in a row.
4. Uniform rounded corners above 4px on content containers.
5. Emoji as icons or bullets.
6. Neon glow shadows on more than one element per view.
7. Stock imagery, AI-generated filler imagery or generic isometric illustrations.
8. Infinite logo marquees or fake testimonial carousels.
9. Parallax on more than one layer per chapter.
10. Gradient text as the primary heading treatment.
11. Placeholder or invented numbers.
12. Centered hero with eyebrow badge, gradient headline and two pill buttons.
13. Animation that is not tied to a purpose in Section 7.1.

### 16.2 "Earns its place" test (apply to every element in review)

1. What does it communicate about system or human?
2. If removed, does the page get clearer without losing the idea? If yes, remove it.
3. Is there a real fallback (no JS, no 3D, no motion, slow network)?
4. Does it hold up on a 360px screen and with the keyboard only?

### 16.3 Using Taste Skill and UI UX Pro Max

- **UI UX Pro Max** is run **once** in R1 to cross-check this system's palette, type pairing and style against its catalog and to produce a short audit; its output is stored in `docs/design/uiuxpro-audit.md`. Where it conflicts with this document, this document wins. Its stack guidance must be mapped to Vanilla CSS Modules (no Tailwind, no shadcn).
- **Taste Skill** is used at page level during R2+ as an execution and review aid. Recommended dial settings (per the skill's own parameter names): layout variance **high (8)**, motion intensity **medium-high (6–7)**, visual density **medium-high (6–7)**; the Reduced-Motion contract overrides motion intensity.
- Never apply two skills to restyle the same component in one pass; skills advise, this document and `AGENTS.md` decide.

---

## 17. Implementation Architecture

### 17.1 File structure

```
src/
  styles/
    index.css              # @layer order, imports
    reset.css              # @layer reset
    tokens.css             # @layer tokens (Section 3)
    legacy-aliases.css     # deprecated token aliases (remove in R8)
    base.css               # @layer base: typography, links, focus
    layout.css             # @layer layout: grid, container, chapter, rail
    patterns.css           # @layer patterns: frame, chamfer, rack-sep, coords
    utilities.css          # @layer utilities
  components/
    ui/                    # Button, Tag, Segmented, Input, Frame, Overlay, Toast…
    layout/                # PageShell, PageHeader, Section, Chapter, Rail
    nav/                   # Header, GroupPanel, AllPagesIndex, Footer
    telemetry/             # TelemetryStrip, StatusDot
  stage/                   # Operator Stage (dynamic import boundary)
    Stage.jsx, StageCanvas.jsx, camera.config.js, lighting.config.js,
    shaders/, tiers.js, poster.js
  lib/
    motion/                # gsap setup, lenis, reveal helpers, reduced-motion store
    design/                # contrast checks, token helpers
docs/
  design/                  # uiuxpro-audit.md, DDRs, QA reports
  3d/ASSET-REPORT.md
public/3d/                 # operator-*.glb, env/, decoders/ (self-hosted)
```

### 17.2 Naming and code rules

- BEM-light class names in CSS Modules; global classes only in `patterns` and `utilities`.
- Logical properties (`inline-size`, `margin-block`) everywhere for future RTL support.
- No inline style values that duplicate tokens; no hex values outside `tokens.css`.
- ESLint plus a custom stylelint config: forbid raw hex, forbid `!important` outside `overrides`, forbid deprecated tokens, forbid animating non-allowed properties in keyframes.
- Components are server-friendly where possible; client leaf boundaries stay as defined in `AGENTS.md`.

### 17.3 Design QA tooling

- **Playwright** screenshot and axe tests per route on `xs`, `md`, `lg`, `xl` viewports, Void and Bone surfaces, motion full and reduced, 3D on and off.
- **Lighthouse CI** budgets (Section 14).
- A `/design-lab` dev route (noindex, dev and preview only) rendering tokens, type specimens, every component state and both surfaces; the visual regression anchor.
- `/stage-lab` dev route for lighting and camera tuning (Section 8.5).
- Query flags for QA in dev and preview only: `?motion=off`, `?3d=off`, `?surface=bone`.

---

## 18. Acceptance and Release Gate

### 18.1 Definition of Done (every design change)

1. Uses semantic tokens only; no raw hex; no banned patterns (16.1).
2. All states designed and implemented (11.1), both surfaces verified.
3. Keyboard, focus, reduced-motion and 3D-off paths verified.
4. Performance constraints respected (Section 14); bundle and Lighthouse report attached.
5. Responsive at 320, 390, 768, 1024, 1440, 1920 widths; container-query behavior verified.
6. Copy is real, specific and approved (Section 15).
7. Screenshots (Void and Bone, desktop and mobile) attached to the PR.
8. `/design-lab` updated if a component or token changed.

### 18.2 Release gate (site level)

Score each Awwwards-style dimension 1–10 in a written review; **all must be ≥ 8** and no single blocker open.

| Dimension | Questions |
|-----------|-----------|
| Design (40%) | Is there a recognizable concept? Is hierarchy clear without effects? Does type carry the design? Is color scarce and meaningful? |
| Usability (30%) | Can a first-time visitor find everything? Does it pass AA, keyboard and mobile tests? Are states complete? |
| Creativity (20%) | Do the three signature moves work and feel original? Does anything feel templated? |
| Content (10%) | Is every claim real and dated? Is the voice consistent? |

### 18.3 Device and browser matrix

Chrome, Edge, Safari (macOS and iOS 16+), Firefox: latest two versions. Android mid-range (for example a 4 GB device) as the T1 reference; a low-end Android as the T0 verification. Safari-specific checks for `backdrop-filter`, `clip-path` transitions, View Transitions fallback and WebGL context handling.

---

## 19. Future-Proofing

| Area | Policy |
|------|--------|
| **Tokens** | Three-tier architecture allows rebrands in two files. Optional DTCG JSON export plus Style Dictionary when a second consumer (Figma, native, email) appears. |
| **CSS platform** | Progressive enhancement with `@supports`: container queries, `@layer`, `color-mix()`, `light-dark()`, `:has()`, `@property` (typed custom properties for animated gradients and counters), scroll-driven animations, `@starting-style`, popover and anchor positioning for menus and tooltips, View Transitions (including cross-document). Each adoption keeps a tested fallback. |
| **3D** | WebGPU renderer and TSL when stable in the pinned three.js version, with automatic WebGL fallback and the same tier rules. glTF extensions (`KHR_texture_basisu`, `EXT_meshopt_compression`) are the supported delivery formats. Gaussian splat or neural-avatar formats are evaluated only if they beat the budget. |
| **Theming** | Bone and Void are the shipped surfaces. A user-selectable light/dark preference is supported by token design (`light-dark()`), enabled later by decision (DDR). |
| **Motion** | GSAP remains the choreography engine; native scroll-driven animations absorb simple effects over time to reduce JS. |
| **Typography** | Variable fonts and `font-variation-settings` where available; font swaps happen through `--font-*` tokens only. |
| **Internationalization** | Logical properties everywhere; layouts tested with long strings and RTL; locale routes (`/bn`, `/hi`) evaluated post-3.0. |
| **Content** | CMS-driven pages (Sanity) render through the same components; Portable Text serializers share tokens with the design system so new content looks right automatically. |
| **AI-assisted development** | This document plus `AGENTS.md` are the contract; skills advise only. Design lint rules turn this document into automated checks wherever possible. |
| **Decay prevention** | Quarterly design audit: unused tokens, drift from `/design-lab`, banned-pattern scan, performance budget review. |

---

## 20. Roadmap, Decision Log and Open Items

### 20.1 Redesign phases

| Phase | Scope | Output |
|-------|-------|--------|
| **R0** | Skeleton, navigation, route inventory, skills installed, GLB inspection (in progress) | Every page reachable; config-driven nav; asset report |
| **R1** | Foundation: tokens, layers, fonts, reset, base, layout primitives, Frame/Button/Tag/Input/Overlay components, `/design-lab`, contrast CI, stylelint rules, UI UX Pro Max audit | Design system usable; old tokens aliased |
| **R2** | Shell: header, group panels, all-pages index, chapter rail, footer, command palette restyle, telemetry strip, motion toggle | Final navigation experience |
| **R3** | Operator Stage: asset pipeline, tiers, lighting rig, scan-in, `/stage-lab`, poster set, fallbacks | Stage on Home hero |
| **R4** | Home chapters 00–08 with Stage choreography and Globe hand-off | Redesigned Home |
| **R5** | Knowledge group: Blog, Wiki, Architecture, Uses (Bone reading surface) | Reading experience |
| **R6** | Work group: Projects index and case-study overlay, WEFIK, Plugin, Store | Proof pages |
| **R7** | Lab group: Play, Lounge, Space, Vault, Confession, Tools; God Mode phosphor theme | Playful pages |
| **R8** | States and edges: 404 (operator), offline, legal, errors, empty states, About; remove legacy aliases; remove `/site-index`; QA, performance and accessibility hardening; release gate review | Launch candidate |

This sequence replaces the earlier plan of presenting three alternative art directions: the direction is decided here (DDR-001) and the owner can veto in the log below.

### 20.2 Design Decision Records

| ID | Decision | Status |
|----|----------|--------|
| DDR-001 | Adopt "Operator Console" as the art direction (system vs human voices) | Proposed — awaiting owner confirmation |
| DDR-002 | Retire glassmorphism as the default container; keep glass for header, palette, overlays | Proposed |
| DDR-003 | Introduce Bone surface and chapter mode-shifts | Proposed |
| DDR-004 | Add Instrument Serif as the Human voice (OFL, self-hosted) | Proposed |
| DDR-005 | Keep Brooklyn as display pending licence and glyph verification | Open [VERIFY] |
| DDR-006 | Rename `--gold` to `--signal` and migrate tokens (Section 3.5) | Proposed |
| DDR-007 | One WebGL renderer at a time (Stage and Globe) | Decided |
| DDR-008 | Stage is never the LCP element; poster-first | Decided |
| DDR-009 | No post-processing stack in v1 of the Stage | Decided |
| DDR-010 | Persistent full-site canvas is out of scope; Stage mounts on Home, About, 404, footer | Decided (revisit after R8) |

### 20.3 Open items for the owner

1. Confirm DDR-001 to DDR-004 (the core of the redesign).
2. Provide the final hero copy and the facts for the telemetry strip (years, patent line, availability text).
3. Provide the `.glb` (and any texture sources) so R0 can produce the asset report; confirm whether it is rigged and animated.
4. Confirm Brooklyn licensing and supply the web font files and weights available.
5. Provide a short list of 5–10 photos or screenshots to be used as real imagery in project case studies.
6. Decide whether a visitor-selectable light/dark preference is wanted post-launch.

---

## Appendix A — Core CSS Patterns

### A.1 Signal underline link

```css
@layer components {
  .link {
    color: var(--accent-hi);
    text-decoration: none;
    background: linear-gradient(currentColor, currentColor) 0 100% / 0 1px no-repeat;
    transition: background-size var(--dur-base) var(--ease-out);
    padding-block-end: 0.15em;
  }
  .link:is(:hover, :focus-visible) { background-size: 100% 1px; }
}
```

### A.2 Rack separator (updated)

```css
@layer patterns {
  .rack-sep {
    display: flex;
    align-items: center;
    gap: var(--space-5);
    font: 500 var(--step--1)/1 var(--font-mono);
    letter-spacing: 0.12em;
    text-transform: uppercase;
    color: var(--accent);
    margin-block: var(--space-8) var(--space-6);
  }
  .rack-sep::before,
  .rack-sep::after {
    content: "";
    flex: 1;
    block-size: 1px;
    background: linear-gradient(90deg, transparent, var(--line-3), transparent);
  }
}
```

### A.3 Chapter mode-shift (progressive enhancement)

```css
@layer layout {
  .chapter { position: relative; background: var(--bg); color: var(--fg-1); }
  .chapter[data-surface="bone"] { /* tokens remap via [data-surface] rules in tokens.css */ }
  .chapter__wipe {
    position: absolute; inset: 0; background: var(--bg);
    clip-path: inset(100% 0 0 0);       /* animated to inset(0) by GSAP */
    will-change: clip-path;             /* removed after the animation completes */
    z-index: -1;
  }
}
```

### A.4 Stage container

```css
@layer layout {
  .stage {
    position: fixed; inset: 0;
    z-index: var(--z-stage);
    pointer-events: none;               /* enabled only inside hero hit-area */
    contain: strict;
  }
  .stage__poster { position: absolute; inset: 0; }
  .stage__canvas { position: absolute; inset: 0; opacity: 0; transition: opacity var(--dur-slow) var(--ease-out); }
  .stage[data-ready="true"] .stage__canvas { opacity: 1; }
}
```

### A.5 Grain layer

```css
@layer patterns {
  .grain {
    position: fixed; inset: 0; z-index: var(--z-grain);
    pointer-events: none;
    background: url('/textures/grain-128.webp') repeat;
    opacity: 0.035;
    mix-blend-mode: overlay;
  }
}
```

---

## Appendix B — Camera Keyframe Template (to be tuned in `/stage-lab`)

Values are starting points; the agent records final values in `camera.config.js`.

| Chapter | Camera position | Look-at | FOV | Model offset (x, y) | Model scale | Stage opacity |
|---------|----------------|---------|-----|---------------------|-------------|---------------|
| 01 Operator | (0.0, 1.35, 3.6) | (0.0, 1.25, 0) | 30 | (0.9, -0.1) | 1.0 | 1.0 |
| 02 Human | (0.15, 1.55, 1.9) | (0.0, 1.55, 0) | 28 | (0.5, -0.2) | 1.15 | 1.0 |
| 03 Experience | (-0.4, 1.3, 4.6) | (0.0, 1.2, 0) | 32 | (-1.8, -0.2) | 0.7 | 0.4 |
| 04 Projects | hold | hold | hold | hold | hold | 0.12 and paused |
| 05 Reach | n/a (Stage released) | n/a | n/a | n/a | n/a | 0 |
| 08 Contact | (0.0, 1.2, 4.2) | (0.0, 1.1, 0) | 30 | (1.4, -0.3) | 0.55 | 1.0 |

---

## Appendix C — Glossary

- **Chapter:** a numbered full-width section with its own surface and motion idea.
- **Frame:** the hairline panel with crop-mark ticks (replaces the glass card).
- **LQIP:** low-quality image placeholder.
- **Operator:** the owner's 3D model on the Stage.
- **Rim light:** the backlight that separates the model from the dark background; the "console light".
- **Semantic token:** a role-based variable (`--bg`, `--accent`) re-mapped per surface and mode.
- **Signal:** the emerald accent, used scarcely.
- **Surface:** Void (dark) or Bone (light) theme applied per section.
- **Telemetry:** real, live data used as typographic texture.
- **T0/T1/T2:** Stage performance tiers (poster only / reduced / full).

## Appendix D — Change Log

| Version | Date | Summary |
|---------|------|---------|
| 2.4.0 | Oct 2026 | Cyber-Minimalism, tactile glassmorphism, emerald brand, GSAP and Lenis motion |
| 3.0.0 | Oct 2026 | Full rewrite as the Operator Console art direction: concept, three voices, signature moves, three-tier tokens with Bone/Void surfaces, type system, grid, Frame component, motion system with reduced-motion contract, the Operator Stage 3D specification, Home chapter blueprint, navigation, components, accessibility, performance constraints, voice guide, anti-slop rules, implementation architecture, release gate, future-proofing and roadmap |
