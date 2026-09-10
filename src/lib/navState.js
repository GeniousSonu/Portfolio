'use client';

/**
 * navState — Shared navigation state module
 *
 * Single source of truth for navigation intent, scroll behavior,
 * and Lenis smooth-scroll instance reference. Replaces the scattered
 * `window.__portfolioNavigatingToRoute`, `window.__portfolioNavigatingToAnchor`,
 * and `window.__lenis` global flags that were accumulating cross-flag ordering risks.
 *
 * This is a module-scoped singleton (not React context) so it works identically
 * across all consumers without prop-drilling or context nesting.
 */

const navState = {
  /**
   * Current navigation intent.
   * - 'idle':   No navigation in progress
   * - 'route':  A route-level navigation is active (scroll-lock should scroll to top)
   * - 'anchor': An anchor/hash scroll is active (scroll-lock should not restore position)
   * @type {'idle' | 'route' | 'anchor'}
   */
  intent: 'idle',

  /**
   * Reference to the global Lenis smooth-scroll instance (desktop only).
   * @type {import('lenis').default | null}
   */
  lenis: null,

  /** Mark that a route navigation is in progress. */
  startRouteNav() {
    this.intent = 'route';
  },

  /** Mark that an anchor/hash scroll is in progress. */
  startAnchorNav() {
    this.intent = 'anchor';
  },

  /**
   * Consume and reset the current navigation intent.
   * Returns what the intent was before resetting to 'idle'.
   * @returns {'idle' | 'route' | 'anchor'}
   */
  consumeIntent() {
    const was = this.intent;
    this.intent = 'idle';
    return was;
  },
};

export default navState;
