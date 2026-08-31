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

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  event.waitUntil(clients.openWindow('/jadwal-sholat'));
});
