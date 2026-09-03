// A single "Reset Semua Data Lokal" action — this app has accumulated a
// lot of separate localStorage-backed features over many sessions (tasbih
// counts, reading/search history, khatam-celebration flags, custom
// checklist items, chat history, and more) with no unified way to wipe
// them — e.g. before handing a phone to someone else, or just wanting a
// clean slate. Scans every key under this app's `airmoon-` prefix rather
// than hardcoding a list of them — auto-covers whatever's shipped since,
// without needing to remember to update this file every time a new
// localStorage-backed feature ships.
//
// PRESERVED_PREFIXES are display PREFERENCES a "reset my DATA" action
// shouldn't be expected to touch — theme, language, chosen qari/adzan
// sound, Arabic reading font/size, night/tajwid reading toggles. Those
// happen to share the same `airmoon-` prefix as everything else, so they
// need an explicit exclusion rather than falling out naturally.
const PRESERVED_PREFIXES = [
  'airmoon-theme',
  'airmoon-lang',
  'airmoon-qari',
  'airmoon-adzan-sound',
  'airmoon-arabic-font',
  'airmoon-reading-night-mode',
  'airmoon-mushaf-tajwid',
];

export function resetAllLocalData() {
  const toRemove = [];
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (!key || !key.startsWith('airmoon-')) continue;
    if (PRESERVED_PREFIXES.some((p) => key.startsWith(p))) continue;
    toRemove.push(key);
  }
  toRemove.forEach((k) => localStorage.removeItem(k));
  return toRemove.length;
}
