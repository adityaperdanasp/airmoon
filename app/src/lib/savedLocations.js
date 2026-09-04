// Lokasi Favorit — both QiblaCompass.jsx and JadwalSholat.jsx already let
// someone override GPS with a searched location (lib/useQibla.js's and
// lib/usePrayerTimes.js's own separate `override` keys), but only ONE at
// a time — switching between "Rumah" and "Kampung Halaman" meant
// re-searching the same place every visit. This is a single shared list
// (not split per-page like the overrides are) since a saved place like
// "Rumah" is the same physical location regardless of which page you're
// checking it from. localStorage-only, same personal-list precedent as
// lib/warisScenarios.js/lib/zakatHistory.js.
const KEY = 'airmoon-saved-locations';
const MAX = 8;

export function loadSavedLocations() {
  try {
    const saved = JSON.parse(localStorage.getItem(KEY));
    return Array.isArray(saved) ? saved : [];
  } catch {
    return [];
  }
}

// `loc` is { label, lat, lng } — same shape LocationSearch.jsx's search
// results and the qibla/prayer-times override already use. Dedupes by
// label so tapping "save" twice on the same result doesn't create a
// duplicate chip.
export function addSavedLocation(loc) {
  try {
    const existing = loadSavedLocations().filter((l) => l.label !== loc.label);
    const next = [{ ...loc, id: `${Date.now()}` }, ...existing].slice(0, MAX);
    localStorage.setItem(KEY, JSON.stringify(next));
    return next;
  } catch {
    return loadSavedLocations();
  }
}

export function removeSavedLocation(id) {
  try {
    const next = loadSavedLocations().filter((l) => l.id !== id);
    localStorage.setItem(KEY, JSON.stringify(next));
    return next;
  } catch {
    return loadSavedLocations();
  }
}

export function isLocationSaved(label) {
  return loadSavedLocations().some((l) => l.label === label);
}
