// Jam Tenang (Quiet Hours) — a time window (e.g. 22:00–05:00) during which
// non-essential pengingat pushes stay silent, deliberately NEVER applied
// to adzan itself (that's the one category this app's whole notification
// system exists for — muting it during quiet hours would defeat the
// point). Scoped to `send-prayer-notifications.js`'s per-user "pengingat"
// pushes (Dzikir Petang streak, Amalan Harian, Target Baca) — those are
// the actual evening/night annoyance vector; `check-campaign-deadlines.js`
// fires once a day at a fixed server time that's unlikely to land inside
// anyone's typical sleep window regardless of their own timezone, so
// applying quiet-hours math there wouldn't meaningfully change anything.
import { doc, onSnapshot, setDoc } from 'firebase/firestore';
import { db } from './firebase';

export const DEFAULT_QUIET_HOURS = { enabled: false, start: '22:00', end: '05:00' };

export function watchQuietHours(uid, callback) {
  if (!uid) {
    callback(DEFAULT_QUIET_HOURS);
    return () => {};
  }
  return onSnapshot(doc(db, 'users', uid), (snap) => {
    callback({ ...DEFAULT_QUIET_HOURS, ...(snap.data()?.quietHours || {}) });
  });
}

export async function setQuietHours(uid, quietHours) {
  await setDoc(doc(db, 'users', uid), { quietHours }, { merge: true });
}
