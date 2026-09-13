// Favorit di Lainnya (2026-09-13) — with 30+ tiles across 6 sections now
// (Lainnya.jsx's own header comment already flagged this growth problem
// once), letting someone pin their own most-used 3-6 tiles to the top is
// a personalized shortcut, distinct from `recentLainnya.js`'s automatic
// "last opened" row — a pin is a deliberate choice that doesn't get
// bumped off by whatever was tapped most recently. Same localStorage-
// only, per-device shape as recentLainnya.js — this is UI layout
// preference, not data worth syncing across devices.
const STORAGE_KEY = 'airmoon-lainnya-pinned';
const MAX_PINS = 6;

export function getPinnedLainnya() {
  try {
    const raw = JSON.parse(localStorage.getItem(STORAGE_KEY));
    return Array.isArray(raw) ? raw : [];
  } catch {
    return [];
  }
}

export const MAX_PINS_REACHED = 'MAX_PINS_REACHED';

// Returns the new pinned array, or the string MAX_PINS_REACHED (leaving
// storage untouched) if trying to add a 7th pin — refusing loudly rather
// than silently evicting the oldest pin, since a pin is a deliberate
// choice someone would notice disappearing.
export function togglePinLainnya(to) {
  const current = getPinnedLainnya();
  if (current.includes(to)) {
    const next = current.filter((t) => t !== to);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    } catch {
      // Private-browsing/full storage — the change just won't survive a reload.
    }
    return next;
  }
  if (current.length >= MAX_PINS) return MAX_PINS_REACHED;
  const next = [...current, to];
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  } catch {
    // Private-browsing/full storage — the pin just won't survive a reload.
  }
  return next;
}
