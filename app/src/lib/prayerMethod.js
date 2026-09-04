// Metode Perhitungan Jadwal Sholat — was hardcoded to Aladhan's method=20
// (Kementerian Agama RI) everywhere, with no way to pick a different
// calculation convention. A curated subset of Aladhan's real supported
// methods (not the full ~16, just the ones an Indonesian user would
// plausibly want) — each id matches Aladhan's own public method-id table.
import { doc, onSnapshot, setDoc } from 'firebase/firestore';
import { db } from './firebase';

export const PRAYER_METHODS = [
  { id: 20, label: 'Kemenag RI', sub: 'Kementerian Agama Republik Indonesia (default)' },
  { id: 11, label: 'Singapura', sub: 'Majlis Ugama Islam Singapura — konvensi serupa Asia Tenggara' },
  { id: 3, label: 'MWL', sub: 'Muslim World League' },
  { id: 2, label: 'ISNA', sub: 'Islamic Society of North America' },
  { id: 4, label: 'Umm Al-Qura', sub: 'Umm Al-Qura University, Makkah' },
];

const KEY = 'airmoon-prayer-method';

export function loadPrayerMethod() {
  try {
    const saved = Number(localStorage.getItem(KEY));
    return PRAYER_METHODS.some((m) => m.id === saved) ? saved : 20;
  } catch {
    return 20;
  }
}

// Also mirrored to Firestore (users/{uid}.prayerMethod) when signed in, so
// api/send-prayer-notifications.js's push times actually match what's
// shown on screen — a localStorage-only preference would leave the
// backend cron always computing against the default Kemenag method
// regardless of what the user picked, same reasoning as `notifLocation`
// already being synced there for the same cron.
export async function setPrayerMethod(id, uid) {
  try {
    localStorage.setItem(KEY, String(id));
  } catch {
    // Private-browsing/full storage — still applies this session via the
    // caller's own state, just won't survive a reload.
  }
  if (uid) {
    await setDoc(doc(db, 'users', uid), { prayerMethod: id }, { merge: true });
  }
}

export function watchPrayerMethod(uid, callback) {
  if (!uid) {
    callback(loadPrayerMethod());
    return () => {};
  }
  return onSnapshot(doc(db, 'users', uid), (snap) => {
    const saved = snap.data()?.prayerMethod;
    callback(PRAYER_METHODS.some((m) => m.id === saved) ? saved : loadPrayerMethod());
  });
}
