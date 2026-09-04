import { useEffect } from 'react';
import { getMessaging, onMessage } from 'firebase/messaging';
import { app } from '../lib/firebase';
import { isPushSupported } from '../lib/notifications';
import { logNotification, getUnseenNotificationCount } from '../lib/notificationLog';
import { setAppBadgeCount } from '../lib/appBadge';
import { useToast } from '../context/ToastContext';

// A real, separate gap this closes, not just plumbing for the Notifikasi
// log: firebase-messaging-sw.js's onBackgroundMessage only ever runs while
// the tab is backgrounded/closed — a data-only push (this backend sends no
// top-level `notification` field, see send-prayer-notifications.js) that
// arrives while someone has the app open in the foreground was previously
// dropped on the floor with nothing shown at all, since nothing was
// listening for Firebase Messaging's separate foreground `onMessage`
// event. Mounted once near the root (see App.jsx) so it's always
// listening regardless of which route is active; renders nothing itself.
//
// Also keeps the PWA app-icon badge (lib/appBadge.js) in sync — accurate
// for a foreground push (this listener) and on app boot (the effect
// below), both on the main thread and able to read the same localStorage
// `lastSeen` marker notificationLog.js's unseen-count logic already uses.
// A push that arrives while the app is fully closed
// (firebase-messaging-sw.js's background handler, a different JS context
// with no access to that same localStorage value) does NOT update the
// badge — a real, documented limitation rather than a silently wrong
// count; fixing it needs a shared IndexedDB "last seen" marker both
// contexts read/write, a bigger change than this feature's own scope.
export default function NotificationForegroundListener() {
  const { showToast } = useToast();

  useEffect(() => {
    getUnseenNotificationCount().then(setAppBadgeCount);
  }, []);

  useEffect(() => {
    let unsubscribe;
    (async () => {
      if (!(await isPushSupported())) return;
      try {
        const messaging = getMessaging(app);
        unsubscribe = onMessage(messaging, (payload) => {
          const { title, body, tag } = payload.data || {};
          logNotification({ title, body, tag });
          showToast(title || body || 'Notifikasi baru');
          getUnseenNotificationCount().then(setAppBadgeCount);
        });
      } catch {
        // getMessaging()/onMessage() can throw on an unsupported
        // environment despite isPushSupported() passing (e.g. no real
        // Firebase config context in some embedded webviews) — nothing
        // else in the app depends on this, so fail silently.
      }
    })();
    return () => unsubscribe?.();
    // eslint-disable-next-line react-hooks/exhaustive-deps -- showToast
    // comes from context and is stable enough for a mount-once listener;
    // re-subscribing on every render would be wasteful, not more correct.
  }, []);

  return null;
}
