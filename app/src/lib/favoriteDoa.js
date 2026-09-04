// Favorit per Doa/Dzikir — Doa Harian could only ever mark a whole
// category (Pagi/Petang) done for a streak; there was no way to bookmark
// one specific dzikir/doa item for quick access, unlike Ayat Favorit.
// Keyed by `${categoryId}:${title}` — title alone isn't safe across
// categories (data/doaHarian.js's own header notes a real near-duplicate
// title that had to be fixed once already), but is unique WITHIN one
// category, which is all this needs. localStorage-only, same
// personal-shortlist precedent as this batch's other favorite/saved
// lists (lib/savedLocations.js, lib/favoriteMasjid.js) — a quick way
// back to a specific dua, not a synced record.
const KEY = 'airmoon-favorite-doa';

export function loadFavoriteDoa() {
  try {
    const saved = JSON.parse(localStorage.getItem(KEY));
    return Array.isArray(saved) ? saved : [];
  } catch {
    return [];
  }
}

export function doaKey(categoryId, title) {
  return `${categoryId}:${title}`;
}

export function toggleFavoriteDoa(key) {
  try {
    const current = loadFavoriteDoa();
    const next = current.includes(key) ? current.filter((k) => k !== key) : [...current, key];
    localStorage.setItem(KEY, JSON.stringify(next));
    return next;
  } catch {
    return loadFavoriteDoa();
  }
}
