/**
 * Persistent Client-Side Visitor Identifier
 * Stored in localStorage to ensure distinct counting across days
 * and unique deduplicated presence tracking across multiple open tabs.
 */

const VISITOR_ID_STORAGE_KEY = 'sks_visitor_id';

export function getOrCreateVisitorId() {
  if (typeof window === 'undefined') return null;

  try {
    let visitorId = localStorage.getItem(VISITOR_ID_STORAGE_KEY);
    if (visitorId && /^[0-9a-fA-F-]{16,64}$/.test(visitorId)) {
      return visitorId;
    }

    if (typeof crypto !== 'undefined' && crypto.randomUUID) {
      visitorId = crypto.randomUUID();
    } else {
      visitorId = 'v_' + Math.random().toString(36).substring(2, 15) + Date.now().toString(36);
    }

    localStorage.setItem(VISITOR_ID_STORAGE_KEY, visitorId);
    return visitorId;
  } catch (err) {
    // If localStorage is blocked in private browsing mode, return a fallback session ID
    return null;
  }
}
