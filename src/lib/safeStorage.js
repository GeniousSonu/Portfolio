/**
 * Safe Browser Storage Utility
 * 
 * Provides fail-safe, guarded access to localStorage and sessionStorage.
 * Prevents hydration crashes, JSON parse errors, and storage-blocked exceptions (private browsing).
 * Corrupted or invalid data is automatically discarded without throwing.
 */

function getStorage(type = 'local') {
  if (typeof window === 'undefined') return null;
  try {
    const storage = type === 'session' ? window.sessionStorage : window.localStorage;
    // Verify storage is accessible (not blocked by security policies)
    const testKey = '__sks_test_probe__';
    storage.setItem(testKey, '1');
    storage.removeItem(testKey);
    return storage;
  } catch {
    return null;
  }
}

export const safeStorage = {
  /**
   * Safely read a string value from storage.
   */
  getItem(key, defaultValue = null, type = 'local') {
    const storage = getStorage(type);
    if (!storage) return defaultValue;

    try {
      const val = storage.getItem(key);
      return val !== null ? val : defaultValue;
    } catch (err) {
      console.warn(`[SafeStorage] Error reading "${key}":`, err);
      return defaultValue;
    }
  },

  /**
   * Safely write a string value to storage.
   */
  setItem(key, value, type = 'local') {
    const storage = getStorage(type);
    if (!storage) return false;

    try {
      storage.setItem(key, String(value));
      return true;
    } catch (err) {
      console.warn(`[SafeStorage] Error writing "${key}":`, err);
      return false;
    }
  },

  /**
   * Safely remove a key from storage.
   */
  removeItem(key, type = 'local') {
    const storage = getStorage(type);
    if (!storage) return false;

    try {
      storage.removeItem(key);
      return true;
    } catch (err) {
      console.warn(`[SafeStorage] Error removing "${key}":`, err);
      return false;
    }
  },

  /**
   * Safely retrieve and parse a JSON value from storage.
   * Discards corrupted JSON gracefully.
   */
  getJSON(key, defaultValue = null, validator = null, type = 'local') {
    const storage = getStorage(type);
    if (!storage) return defaultValue;

    try {
      const raw = storage.getItem(key);
      if (!raw) return defaultValue;

      const parsed = JSON.parse(raw);
      if (typeof validator === 'function' && !validator(parsed)) {
        console.warn(`[SafeStorage] Validation failed for "${key}". Resetting to default.`);
        return defaultValue;
      }
      return parsed;
    } catch (err) {
      console.warn(`[SafeStorage] Corrupted JSON in "${key}". Discarding value:`, err);
      try {
        storage.removeItem(key);
      } catch {}
      return defaultValue;
    }
  },

  /**
   * Safely serialize and write a JSON value to storage.
   */
  setJSON(key, value, type = 'local') {
    const storage = getStorage(type);
    if (!storage) return false;

    try {
      const serialized = JSON.stringify(value);
      storage.setItem(key, serialized);
      return true;
    } catch (err) {
      console.warn(`[SafeStorage] Error serializing "${key}":`, err);
      return false;
    }
  },

  /**
   * Clear all app-specific storage keys (used by /reset kill switch).
   */
  clearAppKeys() {
    if (typeof window === 'undefined') return;

    const APP_PREFIXES = ['sks_', 'portfolio_', 'genious_', 'live_chat_', 'lounge_'];
    const storages = [window.localStorage, window.sessionStorage];

    storages.forEach((store) => {
      try {
        if (!store) return;
        const keysToRemove = [];
        for (let i = 0; i < store.length; i++) {
          const k = store.key(i);
          if (k && APP_PREFIXES.some((p) => k.startsWith(p))) {
            keysToRemove.push(k);
          }
        }
        keysToRemove.forEach((k) => store.removeItem(k));
      } catch (err) {
        console.warn('[SafeStorage] Error clearing keys:', err);
      }
    });
  },
};

export default safeStorage;
