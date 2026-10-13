# Incident BOOT-002 — Restoration of Original Terminal Stage & Unified Two-Stage Boot Machine

**Date:** 2026-10-13  
**Status:** Resolved & Verified  
**Component:** `src/components/BootPreloader.jsx`, `src/config/boot.js`, `src/app/globals.css`  
**Classification:** Regression Resolution & Architecture Modernization  

---

## 1. Executive Summary

During the resolution of BOOT-001 (which addressed the missing multilingual name preloader), commit `ff97ccd` replaced the entire preloader component to enforce an isolated 2.5s name-only presentation. This inadvertently removed the original terminal boot sequence (`$ whoami`, `sahinur_islam`, `$ ./init_portfolio.sh`, compilation statuses), stripping a core brand touchpoint of the portfolio.

TASK BOOT-002 restores the original terminal stage, redesigns the preloader as an explicit finite state machine (FSM), and establishes a balanced two-stage progression:
1. **Stage 1 — Terminal**: 1.2s to 1.4s (target ~1.30s).
2. **Stage 2 — Multilingual Names**: 1.8s (six scripts, ~300ms each).
3. **Stage 3 — Exit Wipe**: ~0.4s clip-path upward wipe.
4. **Target Total Duration**: $\le 3.6\text{s}$ (measured ~3.50s).
5. **Absolute Failsafe**: 4.5s ceiling timeout (releasing scroll locks unconditionally).

---

## 2. Root Cause Analysis

### The Removing Commit
- **Commit SHA**: `ff97ccd`
- **Commit Message**: `fix(preloader): resolve BOOT-001 missing multilingual name preloader and implement waveform route transition`
- **Mechanism of Removal**: The previous BOOT-001 prompt mandated an isolated multilingual name preloader capped strictly at 2.5 seconds total runtime. In response, `src/components/BootPreloader.jsx` was rewritten from scratch focusing only on grapheme clusters and OFL fonts, completely deleting lines 180–270 of the earlier implementation containing the terminal DOM, CSS, and typewriter animation logic.

---

## 3. What Was Restored

100% of the original terminal stage styling, markup, and typographic hierarchy from commits `ef9ece1` and `c20fd70` was recovered and integrated:

1. **Terminal Header**:
   - Window dots: Red (`.dot-r`), Yellow (`.dot-y`), Green (`.dot-g`) resolved via CSS design tokens (`var(--red)`, `var(--amber)`, `var(--gold-bright)`).
   - Title: `sahinur@dev:~ (boot)`.
   - Skip accessibility indicator: `[ESC / SKIP]` / `press any key to skip`.

2. **Terminal Body & Commands**:
   - **Line 1**: Interactive prompt (`$`), animated typewriter text (`whoami`), and blinking monospace block cursor (`▋`).
   - **Line 2**: Indented result badge (`sahinur_islam`) styled with `var(--gold-bright)`.
   - **Line 3**: Interactive prompt (`$`), animated typewriter text (`./init_portfolio.sh`), and blinking monospace block cursor (`▋`).
   - **Line 4**: Status item `Loading modules...` with emerald badge `[OK]`.
   - **Line 5**: Status item `Establishing connection...` with emerald badge `[OK]`.
   - **Line 6**: Status item `Compiling experience.js...` with emerald badge `[OK]`.

3. **What Could Not Be Recovered**:
   - **Nothing**. All components, line strings, colors, and layout metrics were recovered from git history.

---

## 4. Architectural Enhancements (BOOT-002)

To prevent future regression and ensure rock-solid stability, the preloader was rebuilt from the ground up:

### A. Explicit Finite State Machine (FSM)
Defined in `src/config/boot.js`:
- **States**: `IDLE` $\to$ `TERMINAL` $\to$ `NAMES` $\to$ `EXIT` $\to$ `DONE` (with `SKIPPED` and `FAILED` failsafes).
- **Events**: `START`, `TERMINAL_DONE`, `NAMES_DONE`, `EXIT_DONE`, `SKIP`, `ERROR`, `FAILSAFE`.
- **Transitions Table**: Strictly enforced transition matrix; invalid transitions are ignored and logged in development.

### B. Single Source of Truth Timing
- All durations are centralized in `src/config/boot.js`.
- Terminal: ~1300ms ($180\text{ms fly-in} + 240\text{ms whoami} + 120\text{ms drop} + 340\text{ms script} + 270\text{ms status} + 150\text{ms dwell}$).
- Names: 1800ms ($6 \times 300\text{ms}$).
- Exit wipe: 400ms upward clip-path.
- Total runtime: ~3500ms ($\le 3600\text{ms}$).
- Absolute ceiling: 4500ms.

### C. Zero Layout Shift Guarantee
- Both Stage 1 (Terminal) and Stage 2 (Names) render within `.boot-stage-frame`, which has pre-measured reserved bounds (`min-height: clamp(210px, 36vh, 270px)` and `width: min(54ch, calc(100vw - 2rem))`).
- Handoff occurs at the same center baseline with zero displacement or blank frames.

### D. Layer Isolation & Z-Index
- Preloader `#boot-preloader` elevated to `z-index: 2147483647` (maximum 32-bit signed integer).
- Grain layers, custom cursor dots/rings, and floating widgets are forced to `display: none !important` via `body.preloader-locked` while preloader is active.

### E. Responsive Support
- Short viewports ($h < 500\text{px}$, landscape phones) switch to compact terminal layout with condensed line-heights and padding, never clipping active lines.
- Narrow viewports ($w = 320\text{px}$) employ `clamp()` typography and ellipsis overflow guards so horizontal scrolling is strictly 0.
- Browser zoom up to 200% preserves clear separation between content and skip hint.
