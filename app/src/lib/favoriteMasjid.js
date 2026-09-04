// Masjid Favorit — Cari Masjid's results are whatever's nearby right now;
// there was no way to bookmark one for later (a masjid you pray at
// regularly but aren't currently standing next to) short of re-searching
// and hoping it resurfaces. localStorage-only, same personal-list
// precedent as lib/savedLocations.js/lib/warisScenarios.js — this is a
// personal shortlist, not something that needs to sync across devices.
const KEY = 'airmoon-favorite-masjid';
const MAX = 20;

export function loadFavoriteMasjid() {
  try {
    const saved = JSON.parse(localStorage.getItem(KEY));
    return Array.isArray(saved) ? saved : [];
  } catch {
    return [];
  }
}

// `mosque` is one row from fetchNearbyMosques — { id, name, lat, lng,
// address, rating }. Stored as-is so the favorites list can render an
// identical row without needing a fresh API call.
export function addFavoriteMasjid(mosque) {
  try {
    const existing = loadFavoriteMasjid().filter((m) => m.id !== mosque.id);
    const next = [mosque, ...existing].slice(0, MAX);
    localStorage.setItem(KEY, JSON.stringify(next));
    return next;
  } catch {
    return loadFavoriteMasjid();
  }
}

export function removeFavoriteMasjid(id) {
  try {
    const next = loadFavoriteMasjid().filter((m) => m.id !== id);
    localStorage.setItem(KEY, JSON.stringify(next));
    return next;
  } catch {
    return loadFavoriteMasjid();
  }
}

export function isFavoriteMasjid(id, favorites) {
  return favorites.some((m) => m.id === id);
}
