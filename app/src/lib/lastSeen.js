// Last-seen tracking (2026-09-12) — powers both the "welcome back" banner
// and the churn-diagnosis survey below. Plain localStorage, not
// Firestore — this is a per-device UX timing signal, not data the
// founder needs to read back, so it doesn't need to survive a device
// switch or be queryable.
const KEY = 'airmoon-last-seen-at';

// Called once per Home mount. Returns days since the previous visit (an
// integer), or null on a first-ever visit (nothing to compare against —
// don't show a "welcome back" banner to someone who's never been away).
// Reads the OLD value before overwriting it with now, deliberately —
// this can only ever be answered once per actual visit.
export function checkAndUpdateLastSeen() {
  try {
    const prev = Number(localStorage.getItem(KEY));
    localStorage.setItem(KEY, String(Date.now()));
    if (!prev) return null;
    return Math.floor((Date.now() - prev) / 86400000);
  } catch {
    return null;
  }
}
