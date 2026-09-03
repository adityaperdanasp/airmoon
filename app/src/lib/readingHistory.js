// Riwayat baca — a small list of recently-opened surah, not just the
// single lastReadAyat bookmark. The bookmark answers "where did I leave
// off" (one spot, deliberately overwritten every time); this answers "what
// have I been reading lately" (several, most-recent-first) — someone
// bouncing between 2-3 surah in the same session had no quick way back to
// the one before last. localStorage-only, per-device, same pattern as
// lib/recentLainnya.js — this is a personalization nicety, not data worth
// syncing across devices the way the real bookmark is.
const KEY = 'airmoon-reading-history';
const MAX = 8;

export function getReadingHistory() {
  try {
    return JSON.parse(localStorage.getItem(KEY)) || [];
  } catch {
    return [];
  }
}

export function markSurahOpened({ nomor, namaLatin }) {
  try {
    const next = [{ nomor, namaLatin }, ...getReadingHistory().filter((s) => s.nomor !== nomor)].slice(0, MAX);
    localStorage.setItem(KEY, JSON.stringify(next));
  } catch {
    // Private-browsing/full storage — the row just won't remember this visit.
  }
}

export function clearReadingHistory() {
  try {
    localStorage.removeItem(KEY);
  } catch {
    // Nothing to clear if it was never set.
  }
}
