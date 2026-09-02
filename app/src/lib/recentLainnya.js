// "Terakhir Dibuka" row on Lainnya.jsx — deliberately a small row above
// the static grid rather than reordering the grid itself: a 12-item grid
// someone has already memorized the spatial position of (top-left is
// always Asmaul Husna, etc.) would feel disorienting if it reshuffled
// under them every time they used something, which defeats the point of
// a "quick access" feature. localStorage-only, per-device, no Firestore
// doc — this is a lightweight personalization nicety, not data worth
// syncing across devices.
const KEY = 'airmoon-lainnya-recent';
const MAX = 4;

export function getRecentLainnya() {
  try {
    return JSON.parse(localStorage.getItem(KEY)) || [];
  } catch {
    return [];
  }
}

export function markLainnyaVisited(to) {
  try {
    const next = [to, ...getRecentLainnya().filter((p) => p !== to)].slice(0, MAX);
    localStorage.setItem(KEY, JSON.stringify(next));
  } catch {
    // Private-browsing/full storage — the row just won't remember this visit.
  }
}
