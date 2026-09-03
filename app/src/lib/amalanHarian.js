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

import { doc, onSnapshot, setDoc, getDoc } from 'firebase/firestore';
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

// Recent-days completion, for a GitHub-style heatmap (components/
// AmalanHeatmap.jsx) — one-shot reads (a heatmap of the past doesn't need
// a live listener the way "today" does), one getDoc per day rather than a
// range query, since a subcollection keyed by plain date-string ids has
// no field to range-filter on without adding a duplicate timestamp field
// just for this. Deliberately scores only sholat + tilawah (out of 6),
// not the full 8-item Amalan Harian total shown on Home — dzikirStreak
// only ever stores the *current* streak's `lastDate`, not a per-day
// history, so a past day's dzikir completion genuinely can't be
// reconstructed after the fact.
export async function fetchRecentAmalanHarian(uid, days = 30) {
  if (!uid) return [];
  const today = new Date();
  const dateKeys = [];
  for (let i = days - 1; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    dateKeys.push(`${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`);
  }
  const snaps = await Promise.all(dateKeys.map((key) => getDoc(doc(db, 'users', uid, 'amalanHarian', key))));
  const max = SHOLAT_KEYS.length + 1;
  return dateKeys.map((dateKey, i) => {
    const data = snaps[i].exists() ? snaps[i].data() : { sholat: {}, tilawah: false };
    const sholatDone = SHOLAT_KEYS.filter((k) => data.sholat?.[k]).length;
    return { dateKey, score: sholatDone + (data.tilawah ? 1 : 0), max };
  });
}
