// In-app notification history — before this, a push that arrived while
// the phone was silenced/locked (or that got swiped away in the OS
// notification tray) was gone forever with no way to see what it said.
// Backed by IndexedDB, not localStorage, because the *other* half of this
// log is written from inside firebase-messaging-sw.js's background
// message handler — a service worker has no access to window.localStorage
// at all (different global scope), but does have indexedDB. Both sides
// write to the same DB/store/schema so a background push (app closed) and
// a foreground one (this file's own listener, wired up in
// NotificationForegroundListener.jsx) end up in one combined list.
//
// firebase-messaging-sw.js can't `import` this file — it's a classic
// (non-module) service worker using importScripts — so its own copy of
// this logic is inlined there directly. Keep the DB_NAME/STORE/schema in
// sync if either ever changes.
const DB_NAME = 'airmoon-notifications';
const STORE = 'log';
const MAX_ENTRIES = 50;

function openDb() {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, 1);
    req.onupgradeneeded = () => {
      req.result.createObjectStore(STORE, { keyPath: 'id', autoIncrement: true });
    };
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

async function trim(db) {
  const tx = db.transaction(STORE, 'readwrite');
  const store = tx.objectStore(STORE);
  const count = await new Promise((resolve, reject) => {
    const req = store.count();
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
  const excess = count - MAX_ENTRIES;
  if (excess <= 0) return;
  await new Promise((resolve, reject) => {
    // Ascending by keyPath (id) = oldest first, since id is auto-increment.
    const cursorReq = store.openCursor();
    let deleted = 0;
    cursorReq.onsuccess = (e) => {
      const cursor = e.target.result;
      if (cursor && deleted < excess) {
        cursor.delete();
        deleted++;
        cursor.continue();
      } else {
        resolve();
      }
    };
    cursorReq.onerror = () => reject(cursorReq.error);
  });
}

export async function logNotification({ title, body, tag }) {
  try {
    const db = await openDb();
    const tx = db.transaction(STORE, 'readwrite');
    tx.objectStore(STORE).add({ title: title || 'airmoon', body: body || '', tag: tag || '', receivedAt: Date.now() });
    await new Promise((resolve, reject) => {
      tx.oncomplete = resolve;
      tx.onerror = reject;
    });
    await trim(db);
  } catch {
    // IndexedDB unavailable (rare — private browsing quirks, very old
    // browsers) — the push itself still showed via the OS, this log is
    // just a convenience history, not the source of truth.
  }
}

export async function getNotificationLog() {
  try {
    const db = await openDb();
    return await new Promise((resolve, reject) => {
      const tx = db.transaction(STORE, 'readonly');
      const req = tx.objectStore(STORE).getAll();
      req.onsuccess = () => resolve(req.result.sort((a, b) => b.receivedAt - a.receivedAt));
      req.onerror = () => reject(req.error);
    });
  } catch {
    return [];
  }
}

export async function clearNotificationLog() {
  try {
    const db = await openDb();
    const tx = db.transaction(STORE, 'readwrite');
    tx.objectStore(STORE).clear();
  } catch {
    // Nothing to clear if it never opened.
  }
}

// "Is there something new since I last opened this page" — same
// single-timestamp idea as lib/unseenBadges.js, just compared against the
// log's own newest entry instead of a Firestore query, since this log is
// already local. Used for a small dot on the Lainnya grid tile.
const LAST_SEEN_KEY = 'airmoon-lastseen-notifikasi';

export function markNotificationsSeen() {
  try {
    localStorage.setItem(LAST_SEEN_KEY, String(Date.now()));
  } catch {
    // Private-browsing/full storage — badge just won't clear this session.
  }
}

export async function hasUnseenNotifications() {
  const log = await getNotificationLog();
  if (!log.length) return false;
  const lastSeen = Number(localStorage.getItem(LAST_SEEN_KEY)) || 0;
  return log[0].receivedAt > lastSeen;
}

// Same tag-prefix → route mapping firebase-messaging-sw.js's own
// notificationclick handler uses — duplicated there for the same
// can't-import-into-a-classic-SW reason as the DB logic above. Keep both
// in sync if a new notification type/tag is ever added.
export function routeForTag(tag = '') {
  if (tag.startsWith('doa-')) return '/doa';
  if (tag === 'zakat-haul') return '/lainnya/kalkulator-zakat';
  if (tag === 'jumat-al-kahf') return '/quran/18';
  if (tag === 'imsak') return '/lainnya/mode-ramadan';
  if (tag === 'dzikir-streak') return '/lainnya/doa-harian';
  if (tag === 'pledge-reminder') return '/donasi';
  return '/jadwal-sholat'; // adzan-* and any unrecognized tag
}
