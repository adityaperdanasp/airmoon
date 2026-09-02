// A unified "did I do today's ibadah" checklist for Home — sholat, Dzikir
// Pagi/Petang (reusing lib/dzikirStreak.js's existing per-day tracking,
// not duplicating it), and tilawah, all in one glanceable card instead of
// scattered across separate pages someone has to remember to check.
//
// Sholat and tilawah get their own manual per-day doc here
// (users/{uid}/amalanHarian/{dateKey}) rather than being auto-inferred
// from other data — there's no reliable existing signal for either
// ("moved the last-read bookmark" isn't the same as "actually read
// something today", and this app has never tracked prayer completion at
// all) — a deliberate, honest manual checklist beats a fragile guess.

import { doc, onSnapshot, setDoc } from 'firebase/firestore';
import { db } from './firebase';

export const SHOLAT_KEYS = ['subuh', 'dzuhur', 'ashar', 'maghrib', 'isya'];
export const SHOLAT_LABELS = { subuh: 'Subuh', dzuhur: 'Dzuhur', ashar: 'Ashar', maghrib: 'Maghrib', isya: 'Isya' };

function todayKey() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

export function watchAmalanHarian(uid, callback) {
  if (!uid) {
    callback({ sholat: {}, tilawah: false });
    return () => {};
  }
  return onSnapshot(doc(db, 'users', uid, 'amalanHarian', todayKey()), (snap) => {
    callback(snap.exists() ? snap.data() : { sholat: {}, tilawah: false });
  });
}

export async function setSholatDone(uid, waktu, done) {
  await setDoc(doc(db, 'users', uid, 'amalanHarian', todayKey()), { sholat: { [waktu]: done } }, { merge: true });
}

export async function setTilawahDone(uid, done) {
  await setDoc(doc(db, 'users', uid, 'amalanHarian', todayKey()), { tilawah: done }, { merge: true });
}
