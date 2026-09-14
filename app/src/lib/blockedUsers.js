// Blokir Pengguna (2026-09-14) — a client-side-only soft block for the
// community forum: hides future content from a blocked uid at render
// time, same localStorage-only, per-device shape as pinnedLainnya.js/
// recentLainnya.js. Deliberately not a real server-side block (that
// would need a new Firestore collection + rules just to hide a uid's
// posts from one other uid) — this is a personal "don't show me this
// person" filter, not moderation (Laporkan/contentReports.js is the
// actual moderation path).
const STORAGE_KEY = 'airmoon-blocked-users';

export function getBlockedUsers() {
  try {
    const raw = JSON.parse(localStorage.getItem(STORAGE_KEY));
    return Array.isArray(raw) ? raw : [];
  } catch {
    return [];
  }
}

export function isUserBlocked(uid) {
  return getBlockedUsers().includes(uid);
}

export function blockUser(uid) {
  const current = getBlockedUsers();
  if (current.includes(uid)) return current;
  const next = [...current, uid];
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  } catch {
    // Private-browsing/full storage — the block just won't survive a reload.
  }
  return next;
}

export function unblockUser(uid) {
  const next = getBlockedUsers().filter((u) => u !== uid);
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  } catch {
    // Private-browsing/full storage.
  }
  return next;
}
