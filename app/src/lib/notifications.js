import { getMessaging, getToken, isSupported } from 'firebase/messaging';
import { doc, setDoc, arrayUnion } from 'firebase/firestore';
import { app, db } from './firebase';

// Firebase Console → Project Settings → Cloud Messaging → Web Push
// certificates → Generate Key Pair. That key pair's private half is stored
// by Firebase and used to sign outgoing pushes — there's no public API to
// generate one, it has to be done in the console. Wired through an env var
// rather than hardcoded so a missing key fails with a clear message instead
// of a silent broken subscription.
const VAPID_KEY = import.meta.env.VITE_FCM_VAPID_KEY;

export async function isPushSupported() {
  if (!('serviceWorker' in navigator) || !('PushManager' in window)) return false;
  try {
    return await isSupported();
  } catch {
    return false;
  }
}

// True when this page is running inside android-native/'s WebView shell,
// not a regular browser/PWA tab — MainActivity.kt appends this suffix to
// the WebView's user agent specifically so this code can tell. Neither
// `serviceWorker` nor `PushManager` exist inside a plain WebView (no
// service worker support), so the whole VAPID/getToken() flow below is a
// dead end there regardless — the native shell gets its token from the
// device's own Firebase Messaging SDK instead (see getNativeFcmToken()).
export function isNativeApp() {
  return typeof navigator !== 'undefined' && navigator.userAgent.includes('AirmoonNativeApp');
}

// Waits for android-native/'s MainActivity to hand over the current FCM
// token via `window.__airmoonNativeToken(token)` (called once on page
// load if a token is already cached, and again any time it's issued/
// rotated while this page is open). Also proactively asks the native side
// to resend whatever it currently has, in case this runs before that
// initial push arrives. Resolves null after a timeout rather than hanging
// forever if the bridge never responds for some reason.
function getNativeFcmToken() {
  return new Promise((resolve) => {
    if (window.__airmoonNativeTokenValue) {
      resolve(window.__airmoonNativeTokenValue);
      return;
    }
    window.__airmoonNativeToken = (token) => {
      window.__airmoonNativeTokenValue = token;
      resolve(token);
    };
    window.AndroidBridge?.requestFcmToken?.();
    setTimeout(() => resolve(window.__airmoonNativeTokenValue || null), 5000);
  });
}

async function saveFcmToken(uid, token, location) {
  await setDoc(
    doc(db, 'users', uid),
    {
      fcmTokens: arrayUnion(token),
      notifLocation: location,
      notifEnabled: true,
    },
    { merge: true }
  );
}

export async function enablePrayerNotifications(uid, location) {
  if (isNativeApp()) {
    const token = await getNativeFcmToken();
    if (!token) {
      throw new Error('Gagal mendapatkan token notifikasi dari aplikasi.');
    }
    await saveFcmToken(uid, token, location);
    return token;
  }

  if (!VAPID_KEY) {
    throw new Error('Notifikasi belum dikonfigurasi di server (VAPID key belum diset).');
  }
  if (!(await isPushSupported())) {
    throw new Error('Perangkat/browser ini tidak mendukung notifikasi push.');
  }

  const permission = await Notification.requestPermission();
  if (permission !== 'granted') {
    throw new Error('Izin notifikasi ditolak.');
  }

  const registration = await navigator.serviceWorker.register('/firebase-messaging-sw.js');
  const messaging = getMessaging(app);
  const token = await getToken(messaging, { vapidKey: VAPID_KEY, serviceWorkerRegistration: registration });
  if (!token) {
    throw new Error('Gagal mendapatkan token notifikasi.');
  }

  await saveFcmToken(uid, token, location);
  return token;
}

export async function disablePrayerNotifications(uid) {
  await setDoc(doc(db, 'users', uid), { notifEnabled: false }, { merge: true });
}
