'use client';

const STORAGE_PREFIX = 'sks_lounge_rooms_';
const DISPLAY_NAME_KEY = 'sks_lounge_display_name';
export const MAX_ACTIVE_ROOMS = 5;

function getStorageKey() {
  return 'sks_lounge_rooms';
}

/**
 * Generates an 8-character random alphanumeric room code.
 * Excludes ambiguous characters (0, O, I, l, 1).
 */
export function generateRoomCode() {
  const chars = '23456789abcdefghijkmnpqrstuvwxyz';
  let code = '';
  const bytes = new Uint8Array(8);
  if (typeof window !== 'undefined' && window.crypto) {
    window.crypto.getRandomValues(bytes);
    for (let i = 0; i < 8; i++) {
      code += chars[bytes[i] % chars.length];
    }
  } else {
    for (let i = 0; i < 8; i++) {
      code += chars[Math.floor(Math.random() * chars.length)];
    }
  }
  return code;
}

/**
 * Get stored display name or null.
 */
export function getLoungeDisplayName() {
  if (typeof window === 'undefined') return '';
  try {
    return localStorage.getItem(DISPLAY_NAME_KEY) || '';
  } catch {
    return '';
  }
}

/**
 * Save display name to localStorage.
 */
export function setLoungeDisplayName(name) {
  if (typeof window === 'undefined') return;
  try {
    const clean = (name || '').trim().slice(0, 24);
    if (clean) {
      localStorage.setItem(DISPLAY_NAME_KEY, clean);
    }
  } catch {}
}

/**
 * Retrieves visitor's room history from localStorage.
 */
export function getRoomHistory() {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(getStorageKey());
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.sort((a, b) => (b.lastVisitedAt || 0) - (a.lastVisitedAt || 0));
  } catch (err) {
    console.warn('[LoungeHistory] Read error:', err);
    return [];
  }
}

/**
 * Adds or updates a room in the visitor's local history.
 * Enforces the MAX_ACTIVE_ROOMS limit (5).
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
      history[existingIndex].lastVisitedAt = now;
      if (preview) {
        history[existingIndex].preview = preview;
      }
      localStorage.setItem(getStorageKey(), JSON.stringify(history));
      return { success: true, count: history.length, isNew: false };
    }

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
    console.warn('[LoungeHistory] Write error:', err);
    return { success: false, error: err.message };
  }
}

/**
 * Removes a room from visitor's local history.
 */
export function removeRoomFromHistory(roomId) {
  if (typeof window === 'undefined' || !roomId) return [];
  try {
    const cleanId = roomId.trim().toLowerCase();
    const history = getRoomHistory().filter((item) => item.roomId !== cleanId);
    localStorage.setItem(getStorageKey(), JSON.stringify(history));
    return history;
  } catch (err) {
    console.warn('[LoungeHistory] Remove error:', err);
    return [];
  }
}

/**
 * Checks whether visitor has reached maximum active rooms limit.
 */
export function checkRoomLimitStatus() {
  const history = getRoomHistory();
  return {
    limitReached: history.length >= MAX_ACTIVE_ROOMS,
    currentCount: history.length,
    max: MAX_ACTIVE_ROOMS,
  };
}
