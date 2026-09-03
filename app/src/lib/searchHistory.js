// Recent search terms — localStorage, per-device, same pattern as
// lib/recentLainnya.js/lib/readingHistory.js. Generic by `key` so both
// Cari Ayat and Cari Masjid can use it without a second near-identical
// file; each caller passes its own storage key so the two histories never
// mix.
const MAX = 6;

function storageKey(key) {
  return `airmoon-search-history-${key}`;
}

export function getSearchHistory(key) {
  try {
    return JSON.parse(localStorage.getItem(storageKey(key))) || [];
  } catch {
    return [];
  }
}

export function addSearchTerm(key, term) {
  const trimmed = term.trim();
  if (!trimmed) return;
  try {
    const next = [trimmed, ...getSearchHistory(key).filter((t) => t.toLowerCase() !== trimmed.toLowerCase())].slice(0, MAX);
    localStorage.setItem(storageKey(key), JSON.stringify(next));
  } catch {
    // Private-browsing/full storage — history just won't remember this search.
  }
}

export function clearSearchHistory(key) {
  try {
    localStorage.removeItem(storageKey(key));
  } catch {
    // Nothing to clear if it was never set.
  }
}
