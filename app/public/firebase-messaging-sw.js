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

messaging.onBackgroundMessage((payload) => {
  // Backend sends data-only messages now (no top-level `notification`
  // field) so this handler always runs instead of the browser sometimes
  // auto-displaying the push itself — see send-prayer-notifications.js's
  // comment for why.
  const { title, body } = payload.data || {};
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
// stopped being right once doa broadcasts, the zakat haul reminder, and
// now the Friday Al-Kahf reminder were added on top. See
// api/broadcast-doa.js, api/check-campaign-deadlines.js's checkZakatHaul/
// checkJumatReminder, and send-prayer-notifications.js for where each tag
// is actually set.
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  const tag = event.notification.tag || '';
  let url = '/jadwal-sholat'; // adzan-* and any unrecognized tag
  if (tag.startsWith('doa-')) url = '/doa';
  else if (tag === 'zakat-haul') url = '/lainnya/kalkulator-zakat';
  else if (tag === 'jumat-al-kahf') url = '/quran/18'; // Al-Kahf
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
self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', (event) => event.waitUntil(clients.claim()));

const RUNTIME_CACHE = 'airmoon-runtime-v1';
// The Qur'an text/audio APIs this app reads from (lib/quranApi.js,
// lib/mushafApi.js, lib/wordGlossApi.js, lib/quranSearchApi.js) — reading
// is the offline use case that actually matters (bad signal at the
// mosque/on a train), prayer-time/donation data changes too often to be
// worth serving stale.
const OFFLINE_HOSTS = ['equran.id', 'api.quran.com'];

self.addEventListener('fetch', (event) => {
  const { request } = event;
  if (request.method !== 'GET') return;
  const url = new URL(request.url);

  if (OFFLINE_HOSTS.includes(url.hostname)) {
    // Cache-first: once a surah/search/gloss request has been made
    // successfully, re-opening the same thing works offline indefinitely
    // (Qur'an text doesn't change) instead of re-hitting the network.
    event.respondWith(
      caches.open(RUNTIME_CACHE).then(async (cache) => {
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
            caches.open(RUNTIME_CACHE).then((cache) => cache.put(request, clone));
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
