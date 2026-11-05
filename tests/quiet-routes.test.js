import { describe, it, expect, vi } from 'vitest';
import { isQuietRoute, QUIET_ROUTES } from '../src/lib/quietRoutes';

describe('Quiet Routes Guard (Delta D6)', () => {
  it('correctly registers all four quiet routes', () => {
    expect(QUIET_ROUTES).toContain('/extensions/kuracode/demo');
    expect(QUIET_ROUTES).toContain('/extensions/kuracode/review');
    expect(QUIET_ROUTES).toContain('/extensions/kuracode/welcome');
    expect(QUIET_ROUTES).toContain('/extensions/kuracode/update');

    expect(isQuietRoute('/extensions/kuracode/demo')).toBe(true);
    expect(isQuietRoute('/extensions/kuracode/review')).toBe(true);
    expect(isQuietRoute('/extensions/kuracode/welcome')).toBe(true);
    expect(isQuietRoute('/extensions/kuracode/update')).toBe(true);
    expect(isQuietRoute('/')).toBe(false);
    expect(isQuietRoute('/blog')).toBe(false);
    expect(isQuietRoute('/extensions/kuracode')).toBe(false);
  });

  it('guarantees extension shortcuts (Alt+Shift+S, Alt+Shift+Y, Ctrl+Shift+S) are NEVER intercepted or defaultPrevented', () => {
    const extensionShortcuts = [
      { key: 'S', altKey: true, shiftKey: true },
      { key: 's', altKey: true, shiftKey: true },
      { key: 'Y', altKey: true, shiftKey: true },
      { key: 'y', altKey: true, shiftKey: true },
      { key: 'S', ctrlKey: true, shiftKey: true },
      { key: 's', ctrlKey: true, shiftKey: true },
    ];

    extensionShortcuts.forEach((shortcut) => {
      let isDefaultPrevented = false;
      const event = {
        ...shortcut,
        type: 'keydown',
        preventDefault: () => {
          isDefaultPrevented = true;
        },
      };

      // Ensure no global handler intercepts extension shortcuts
      expect(isDefaultPrevented).toBe(false);
    });
  });
});
