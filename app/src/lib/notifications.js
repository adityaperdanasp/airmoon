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

export async function enablePrayerNotifications(uid, location) {
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

  await setDoc(
    doc(db, 'users', uid),
    {
      fcmTokens: arrayUnion(token),
      notifLocation: location,
      notifEnabled: true,
    },
    { merge: true }
  );

  return token;
}

export async function disablePrayerNotifications(uid) {
  await setDoc(doc(db, 'users', uid), { notifEnabled: false }, { merge: true });
}
