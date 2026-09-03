// Background push handler for prayer-time reminders. Runs as a classic
// (non-module) service worker, so it uses the compat SDK via importScripts
// rather than the ESM imports the rest of the app uses — that's the
// documented Firebase pattern for messaging service workers, not a
// leftover from an older setup.
importScripts('https://www.gstatic.com/firebasejs/12.18.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/12.18.0/firebase-messaging-compat.js');

firebase.initializeApp({
  apiKey: 'AIzaSyCabOhScJEoa96NrOuFBv6De_8zAi2Uh8E',
  authDomain: 'airmoon-d9620.firebaseapp.com',
  projectId: 'airmoon-d9620',
  storageBucket: 'airmoon-d9620.firebasestorage.app',
  messagingSenderId: '697264069553',
  appId: '1:697264069553:web:d3cbc6c2c98a3a82d87b90',
});

const messaging = firebase.messaging();

// In-app notification history (2026-09-04) — inlined here rather than
// imported from src/lib/notificationLog.js because a classic (non-module)
// service worker can't `import` an ES module; the app's own copy (used by
// the Notifikasi page and the foreground listener) targets the exact same
// DB_NAME/STORE/schema so both halves land in one combined list. Keep
// both copies in sync if the schema ever changes.
const NOTIF_DB_NAME = 'airmoon-notifications';
const NOTIF_STORE = 'log';
const NOTIF_MAX_ENTRIES = 50;

function openNotifDb() {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(NOTIF_DB_NAME, 1);
    req.onupgradeneeded = () => {
      req.result.createObjectStore(NOTIF_STORE, { keyPath: 'id', autoIncrement: true });
    };
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

async function logNotificationToDb({ title, body, tag }) {
  try {
    const db = await openNotifDb();
    const tx = db.transaction(NOTIF_STORE, 'readwrite');
    tx.objectStore(NOTIF_STORE).add({ title: title || 'airmoon', body: body || '', tag: tag || '', receivedAt: Date.now() });
    await new Promise((resolve, reject) => {
      tx.oncomplete = resolve;
      tx.onerror = reject;
    });
    // Trim oldest-first once over the cap — same approach as SHELL_CACHE's
    // trimCache below, just against IndexedDB instead of the Cache API.
    const countTx = db.transaction(NOTIF_STORE, 'readwrite');
    const store = countTx.objectStore(NOTIF_STORE);
    const count = await new Promise((resolve, reject) => {
      const r = store.count();
      r.onsuccess = () => resolve(r.result);
      r.onerror = () => reject(r.error);
    });
    const excess = count - NOTIF_MAX_ENTRIES;
    if (excess > 0) {
      const cursorReq = store.openCursor();
      let deleted = 0;
      cursorReq.onsuccess = (e) => {
        const cursor = e.target.result;
        if (cursor && deleted < excess) {
          cursor.delete();
          deleted++;
          cursor.continue();
        }
      };
    }
  } catch {
    // IndexedDB unavailable — the push itself still shows via the OS
    // below, this log is just a convenience history.
  }
}

messaging.onBackgroundMessage((payload) => {
  // Backend sends data-only messages now (no top-level `notification`
  // field) so this handler always runs instead of the browser sometimes
  // auto-displaying the push itself — see send-prayer-notifications.js's
  // comment for why.
  const { title, body } = payload.data || {};
  logNotificationToDb({ title, body, tag: payload.data?.tag });
  self.registration.showNotification(title || 'airmoon', {
    body: body || '',
    icon: '/icons/icon-192.png',
    badge: '/icons/icon-192.png',
    tag: payload.data?.tag || 'airmoon-prayer',
    // Each prayer reuses the same tag every day (adzan-Isha, adzan-Subuh, …)
    // so today's notification replaces yesterday's leftover instead of
    // piling up. Per the Notification API spec, replacing a same-tag
    // notification is silent by default (no sound/vibration) unless
    // renotify is explicitly set — without this, the user only gets a
    // sound the very first time a given prayer's tag is ever used, then
    // silently "updated" notifications forever after. This was a real
    // reported bug (2026-08-29), not a phone settings issue — confirmed
    // the user's iOS notification settings (Allow Notifications, Sounds,
    // Immediate Delivery) were already correctly enabled.
    renotify: true,
  });
});

// Routed by tag prefix (2026-09-03) — every notification used to open
// /jadwal-sholat regardless of what it was actually about, which made
// sense back when adzan reminders were the only push this app sent, but
// stopped being right once doa broadcasts, the zakat haul reminder, the
// Friday Al-Kahf reminder, the Ramadan Imsak reminder, and the Dzikir
// Petang streak-break reminder were all added on top. See
// api/broadcast-doa.js, api/check-campaign-deadlines.js's checkZakatHaul/
// checkJumatReminder, and send-prayer-notifications.js (Imsak + streak
// checks) for where each tag is actually set.
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  const tag = event.notification.tag || '';
  let url = '/jadwal-sholat'; // adzan-* and any unrecognized tag
  if (tag.startsWith('doa-')) url = '/doa';
  else if (tag.startsWith('campaign-funded-')) url = '/donasi';
  else if (tag === 'zakat-haul') url = '/lainnya/kalkulator-zakat';
  else if (tag === 'jumat-al-kahf') url = '/quran/18'; // Al-Kahf
  else if (tag === 'imsak') url = '/lainnya/mode-ramadan';
  else if (tag === 'dzikir-streak') url = '/lainnya/doa-harian';
  else if (tag === 'pledge-reminder') url = '/donasi';
  else if (tag === 'zakat-fitrah') url = '/lainnya/kalkulator-zakat';
  else if (tag === 'kutipan-harian') url = '/lainnya/kutipan-inspirasi';
  else if (tag === 'amalan-belum-selesai') url = '/?focus=amalan';
  else if (tag === 'puasa-sunnah') url = '/'; // no dedicated non-Ramadan fasting page exists yet — ModeRamadan is specifically Ramadan-scoped
  else if (tag === 'sedekah-recap') url = '/donasi';
  else if (tag === 'test-notification') url = '/pengaturan';
  else if (tag === 'zakat-penghasilan') url = '/lainnya/kalkulator-zakat';
  else if (tag === 'target-baca') url = '/quran';
  event.waitUntil(clients.openWindow(url));
});

// --- Offline reading (2026-09-02) ---------------------------------------
// This worker used to only ever get registered when someone opted into
// prayer notifications (lib/notifications.js's enablePrayerNotifications),
// so most visitors had no service worker at all controlling fetches. Now
// registered unconditionally at app boot (main.jsx) as well — registering
// the same scriptURL+scope twice is a no-op, the browser just returns the
// existing registration — so this fetch handler actually runs for
// everyone, not just people who enabled notifications.
//
// This is runtime caching, not full precaching: nothing is downloaded
// ahead of time, so the very first visit still needs a network connection.
// After that, whatever was actually opened (a surah, the app shell itself)
// stays available offline until it's fetched fresh again.
// Two caches, not one, on purpose (2026-09-03 cleanup pass) — the original
// single RUNTIME_CACHE let the app-shell side (every hashed JS/CSS
// filename from every past deploy, since a content hash changes on every
// build) accumulate forever with nothing ever evicting old entries. Split:
// QURAN_CACHE for the actual Qur'an text/audio (safe to keep indefinitely,
// that content never changes) and SHELL_CACHE for the app shell itself
// (bounded below, and blown away wholesale on activate if its version
// string is ever bumped).
const QURAN_CACHE = 'airmoon-quran-v1';
const SHELL_CACHE = 'airmoon-shell-v1';
const CURRENT_CACHES = [QURAN_CACHE, SHELL_CACHE];
const SHELL_CACHE_MAX_ENTRIES = 60; // generous for one deploy's worth of chunks, not unbounded across dozens

self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', (event) => {
  event.waitUntil(
    (async () => {
      // Deletes any cache from a previous SHELL_CACHE/QURAN_CACHE version
      // string wholesale — the mechanism for a deliberate full reset (bump
      // the version above), separate from the day-to-day trimming below.
      const keys = await caches.keys();
      await Promise.all(keys.filter((k) => !CURRENT_CACHES.includes(k)).map((k) => caches.delete(k)));
      await clients.claim();
    })()
  );
});

// Cache.keys() returns entries in insertion order in every engine this
// app actually ships to (not spec-guaranteed, but true in practice) — good
// enough to trim the oldest entries first without needing to hand-roll
// timestamp bookkeeping just for this.
async function trimCache(cacheName, maxEntries) {
  const cache = await caches.open(cacheName);
  const keys = await cache.keys();
  if (keys.length <= maxEntries) return;
  await Promise.all(keys.slice(0, keys.length - maxEntries).map((k) => cache.delete(k)));
}

// The Qur'an text/audio APIs this app reads from (lib/quranApi.js,
// lib/mushafApi.js, lib/wordGlossApi.js, lib/quranSearchApi.js) — reading
// is the offline use case that actually matters (bad signal at the
// mosque/on a train), prayer-time/donation data changes too often to be
// worth serving stale. `cdn.equran.id` and `download.quranicaudio.com`
// were a real gap here (2026-09-04) — every per-ayat/per-surah murotal
// audio file is served from one of those two hosts (see quranApi.js's
// `audio`/`audioFull` maps and lib/quranTimingApi.js's word-synced
// reciters respectively), not from `equran.id`/`api.quran.com` themselves,
// so listening to a surah once online never actually made it available
// offline afterward despite the reading text being cached correctly.
const OFFLINE_HOSTS = ['equran.id', 'api.quran.com', 'cdn.equran.id', 'download.quranicaudio.com'];

self.addEventListener('fetch', (event) => {
  const { request } = event;
  if (request.method !== 'GET') return;
  const url = new URL(request.url);

  if (OFFLINE_HOSTS.includes(url.hostname)) {
    // Cache-first: once a surah/search/gloss request has been made
    // successfully, re-opening the same thing works offline indefinitely
    // (Qur'an text doesn't change) instead of re-hitting the network. No
    // size cap here on purpose — this is bounded by how much of the
    // Qur'an someone has actually read, which self-limits.
    event.respondWith(
      caches.open(QURAN_CACHE).then(async (cache) => {
        const cached = await cache.match(request);
        if (cached) return cached;
        const res = await fetch(request);
        if (res.ok) cache.put(request, res.clone());
        return res;
      })
    );
    return;
  }

  if (url.origin === self.location.origin) {
    // Network-first for the app shell itself (HTML/JS/CSS/fonts/icons) —
    // an online visitor always gets the freshest deploy, and the cache is
    // only what falls back into service once the network is unreachable.
    event.respondWith(
      fetch(request)
        .then((res) => {
          if (res.ok) {
            const clone = res.clone();
            caches.open(SHELL_CACHE).then((cache) => {
              cache.put(request, clone);
              trimCache(SHELL_CACHE, SHELL_CACHE_MAX_ENTRIES);
            });
          }
          return res;
        })
        .catch(async () => {
          const cached = await caches.match(request);
          // A deep link like /quran/2 isn't a real file — both hosts
          // rewrite any unknown path to index.html when online (see
          // firebase.json/vercel.json), so fall back to whatever cached
          // copy of the app shell exists rather than a bare network error.
          return cached || caches.match('/index.html') || caches.match('/');
        })
    );
  }
});
