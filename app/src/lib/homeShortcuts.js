// Pintasan "Jelajahi" di Home (2026-10-03, founder request) — the user
// picks which features sit in Home's shortcut grid instead of everyone
// getting the same 8 tiles. localStorage-only and per-device, same as
// pinnedLainnya.js / recentLainnya.js: it is a layout preference, not data
// worth syncing. Stored as route paths (`to`) so a renamed label never
// breaks a saved choice; paths that no longer exist in the catalog are
// dropped on read (see Home.jsx).
const STORAGE_KEY = 'airmoon-home-shortcuts';
export const MAX_HOME_SHORTCUTS = 11; // + the fixed "Semua" tile = 12, three full rows of four

// What Home showed before this was configurable, minus "Semua" (always
// present, always last).
export const DEFAULT_HOME_SHORTCUTS = [
  '/quran',
  '/lainnya/kiblat',
  '/lainnya/kalkulator-zakat',
  '/lainnya/cari-masjid',
  '/ask-me',
  '/doa',
  '/lainnya/tasbih',
];

export function getHomeShortcuts() {
  try {
    const raw = JSON.parse(localStorage.getItem(STORAGE_KEY));
    if (Array.isArray(raw)) return raw.filter((v) => typeof v === 'string').slice(0, MAX_HOME_SHORTCUTS);
  } catch {
    // fall through to defaults
  }
  return DEFAULT_HOME_SHORTCUTS;
}

export function saveHomeShortcuts(list) {
  const clean = [...new Set(list)].slice(0, MAX_HOME_SHORTCUTS);
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(clean));
  } catch {
    // Private browsing / full storage — the choice just won't survive a reload.
  }
  return clean;
}

export function resetHomeShortcuts() {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {
    // ignore
  }
  return DEFAULT_HOME_SHORTCUTS;
}
