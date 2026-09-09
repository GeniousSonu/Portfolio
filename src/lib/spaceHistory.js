import { getOrCreateVisitorId } from './visitorId';

const STORAGE_PREFIX = 'sks_space_rooms_';
export const MAX_ACTIVE_ROOMS = 5;

function getStorageKey() {
  if (typeof window === 'undefined') return 'sks_space_rooms';
  const visitorId = getOrCreateVisitorId();
  return visitorId ? `${STORAGE_PREFIX}${visitorId}` : 'sks_space_rooms';
}

/**
 * Retrieves visitor's room history from localStorage.
 * Returns Array<{ roomId: string, lastVisitedAt: number, createdAt: number, preview: string }>
 */
export function getRoomHistory() {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(getStorageKey());
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    // Sort descending by lastVisitedAt
    return parsed.sort((a, b) => (b.lastVisitedAt || 0) - (a.lastVisitedAt || 0));
  } catch (err) {
    console.warn('[SpaceHistory] Read error:', err);
    return [];
  }
}

/**
 * Adds or updates a room in the visitor's local history.
 * Enforces the MAX_ACTIVE_ROOMS limit (default 5).
 */
export function addOrUpdateRoomHistory(roomId, previewText = '') {
  if (typeof window === 'undefined' || !roomId) return { success: false };
  try {
    const cleanId = roomId.trim().toLowerCase();
    const history = getRoomHistory();
    const existingIndex = history.findIndex((item) => item.roomId === cleanId);
    const now = Date.now();
    const preview = (previewText || '').trim().slice(0, 35);

    if (existingIndex !== -1) {
      // Update existing room timestamp & preview
      history[existingIndex].lastVisitedAt = now;
      if (preview) {
        history[existingIndex].preview = preview;
      }
      localStorage.setItem(getStorageKey(), JSON.stringify(history));
      return { success: true, count: history.length, isNew: false };
    }

    // New room: check 5-room active limit
    if (history.length >= MAX_ACTIVE_ROOMS) {
      return {
        success: false,
        limitReached: true,
        count: history.length,
        max: MAX_ACTIVE_ROOMS,
      };
    }

    const newEntry = {
      roomId: cleanId,
      lastVisitedAt: now,
      createdAt: now,
      preview: preview || '',
    };

    history.unshift(newEntry);
    localStorage.setItem(getStorageKey(), JSON.stringify(history));
    return { success: true, count: history.length, isNew: true };
  } catch (err) {
    console.warn('[SpaceHistory] Write error:', err);
    return { success: false, error: err.message };
  }
}

/**
 * Updates the text preview snippet for an existing room in history.
 */
export function updateRoomPreview(roomId, previewText) {
  if (typeof window === 'undefined' || !roomId) return;
  try {
    const cleanId = roomId.trim().toLowerCase();
    const history = getRoomHistory();
    const item = history.find((h) => h.roomId === cleanId);
    if (item) {
      item.preview = (previewText || '').trim().slice(0, 35);
      item.lastVisitedAt = Date.now();
      localStorage.setItem(getStorageKey(), JSON.stringify(history));
    }
  } catch (err) {}
}

/**
 * Removes a room from visitor's local history (e.g. to make room for a new one).
 */
export function removeRoomFromHistory(roomId) {
  if (typeof window === 'undefined' || !roomId) return [];
  try {
    const cleanId = roomId.trim().toLowerCase();
    const history = getRoomHistory().filter((item) => item.roomId !== cleanId);
    localStorage.setItem(getStorageKey(), JSON.stringify(history));
    return history;
  } catch (err) {
    console.warn('[SpaceHistory] Remove error:', err);
    return [];
  }
}

/**
 * Checks whether visitor has reached the active room limit.
 */
export function checkRoomLimitStatus() {
  const history = getRoomHistory();
  return {
    count: history.length,
    max: MAX_ACTIVE_ROOMS,
    limitReached: history.length >= MAX_ACTIVE_ROOMS,
  };
}
