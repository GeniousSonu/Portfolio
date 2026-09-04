// Consent Management & Analytics Gate Architecture

const CONSENT_STORAGE_KEY = 'sks_analytics_consent';
const CONSENT_COOKIE_KEY = 'sks_analytics_consent';
const CONSENT_CHOICE_STORAGE_KEY = 'sks_consent_choice';
const CONSENT_CHOICE_COOKIE_KEY = 'sks_consent_choice';

function getGaMeasurementId() {
  return process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;
}

/**
 * Clear Google Analytics tracking cookies on consent revocation
 */
function clearGaCookies() {
  if (typeof document === 'undefined' || typeof window === 'undefined') return;
  const hostname = window.location.hostname;
  const domainParts = hostname.split('.');
  const cookies = document.cookie.split(';');

  for (const cookie of cookies) {
    const eqPos = cookie.indexOf('=');
    const name = eqPos > -1 ? cookie.substr(0, eqPos).trim() : cookie.trim();
    if (name.startsWith('_ga')) {
      document.cookie = `${name}=; max-age=0; path=/;`;
      document.cookie = `${name}=; max-age=0; path=/; domain=${hostname};`;
      if (domainParts.length > 1) {
        const rootDomain = '.' + domainParts.slice(-2).join('.');
        document.cookie = `${name}=; max-age=0; path=/; domain=${rootDomain};`;
      }
    }
  }
}

/**
 * Apply runtime analytics disable flag to prevent any background beacons
 */
export function applyAnalyticsDisableFlag() {
  if (typeof window === 'undefined') return;
  const gaId = getGaMeasurementId();
  const consent = getConsentStatus();

  if (gaId) {
    if (consent !== 'granted') {
      window[`ga-disable-${gaId}`] = true;
    } else {
      delete window[`ga-disable-${gaId}`];
    }
  }
}

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
 * Get the specific consent choice made by user
 * @returns {'accept_all' | 'reject' | 'custom' | 'none'}
 */
export function getConsentChoice() {
  if (typeof window === 'undefined') return 'none';

  try {
    const choice = localStorage.getItem(CONSENT_CHOICE_STORAGE_KEY);
    if (choice === 'accept_all' || choice === 'reject' || choice === 'custom') {
      return choice;
    }
  } catch {
    // LocalStorage blocked
  }

  if (typeof document !== 'undefined') {
    const match = document.cookie.match(new RegExp(`(^| )${CONSENT_CHOICE_COOKIE_KEY}=([^;]+)`));
    if (match && (match[2] === 'accept_all' || match[2] === 'reject' || match[2] === 'custom')) {
      return match[2];
    }
  }

  return 'none';
}

/**
 * Check if the user has performed full "Accept All".
 * If true, the footer consent control is permanently hidden.
 * If false (rejected, custom, or pending), the footer control remains visible.
 * @returns {boolean}
 */
export function isConsentFullAccepted() {
  return getConsentChoice() === 'accept_all';
}

/**
 * Record user consent choice (Accept All, Reject, or Custom preferences)
 * and update Google Analytics consent state.
 * @param {'accept_all' | 'reject' | 'custom'} choice
 * @param {boolean} [analyticsGranted]
 */
export function setConsentChoice(choice, analyticsGranted) {
  if (typeof window === 'undefined') return;

  try {
    localStorage.setItem(CONSENT_CHOICE_STORAGE_KEY, choice);
  } catch {
    // LocalStorage blocked
  }

  if (typeof document !== 'undefined') {
    document.cookie = `${CONSENT_CHOICE_COOKIE_KEY}=${choice}; max-age=31536000; path=/; SameSite=Lax`;
  }

  const isGranted = choice === 'accept_all' ? true : (choice === 'reject' ? false : Boolean(analyticsGranted));
  setConsentStatus(isGranted ? 'granted' : 'denied');

  window.dispatchEvent(
    new CustomEvent('cookie-consent-choice-changed', {
      detail: { choice, fullAccepted: choice === 'accept_all' },
    })
  );
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

  const gaId = getGaMeasurementId();

  if (status === 'denied') {
    if (gaId) {
      window[`ga-disable-${gaId}`] = true;
    }
    if (typeof window.gtag === 'function') {
      window.gtag('consent', 'update', {
        analytics_storage: 'denied',
        ad_storage: 'denied',
        ad_user_data: 'denied',
        ad_personalization: 'denied',
      });
    }
    clearGaCookies();
  } else if (status === 'granted') {
    if (gaId) {
      delete window[`ga-disable-${gaId}`];
    }
    if (typeof window.gtag === 'function') {
      window.gtag('consent', 'update', {
        analytics_storage: 'granted',
        ad_storage: 'granted',
        ad_user_data: 'granted',
        ad_personalization: 'granted',
      });
    }
  }

  // Dispatch global event for instant reactive loading
  window.dispatchEvent(
    new CustomEvent('analytics-consent-changed', { detail: { status } })
  );
}

/**
 * Register a callback to execute ONLY after consent is granted.
 * Future analytics scripts should be registered here.
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
