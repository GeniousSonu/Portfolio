// Consent Management & Analytics Gate Architecture

const CONSENT_STORAGE_KEY = 'sks_analytics_consent';
const CONSENT_COOKIE_KEY = 'sks_analytics_consent';

/**
 * Get current analytics consent state
 * @returns {'granted' | 'denied' | 'pending'}
 */
export function getConsentStatus() {
  if (typeof window === 'undefined') return 'pending';

  try {
    const stored = localStorage.getItem(CONSENT_STORAGE_KEY);
    if (stored === 'granted' || stored === 'denied') {
      return stored;
    }
  } catch {
    // LocalStorage blocked/unavailable
  }

  // Check fallback cookie
  if (typeof document !== 'undefined') {
    const match = document.cookie.match(new RegExp(`(^| )${CONSENT_COOKIE_KEY}=([^;]+)`));
    if (match && (match[2] === 'granted' || match[2] === 'denied')) {
      return match[2];
    }
  }

  return 'pending';
}

/**
 * Set user consent choice and notify listeners
 * @param {'granted' | 'denied'} status
 */
export function setConsentStatus(status) {
  if (typeof window === 'undefined') return;

  try {
    localStorage.setItem(CONSENT_STORAGE_KEY, status);
  } catch {
    // LocalStorage blocked
  }

  // Set 1-year persistent cookie
  if (typeof document !== 'undefined') {
    document.cookie = `${CONSENT_COOKIE_KEY}=${status}; max-age=31536000; path=/; SameSite=Lax`;
  }

  // Dispatch global event for instant reactive loading
  window.dispatchEvent(
    new CustomEvent('analytics-consent-changed', { detail: { status } })
  );
}

/**
 * Register a callback to execute ONLY after consent is granted.
 * Future analytics scripts (Google Analytics, Plausible, PostHog, custom logger)
 * should be registered here.
 * @param {() => void} callback
 */
export function onAnalyticsConsent(callback) {
  if (typeof window === 'undefined') return;

  if (getConsentStatus() === 'granted') {
    callback();
    return;
  }

  const listener = (event) => {
    if (event.detail?.status === 'granted') {
      callback();
      window.removeEventListener('analytics-consent-changed', listener);
    }
  };

  window.addEventListener('analytics-consent-changed', listener);
}
