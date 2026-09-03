// Granular notification categories — `notifEnabled` used to be the only
// switch that existed, covering all 11+ distinct push types this app now
// sends (adzan, doa broadcasts, zakat haul/fitrah, Jumat, imsak, dzikir
// streak, pledge reminder, puasa sunnah, daily quote, amalan reminder,
// campaign-funded). Someone who wants adzan reminders but not the daily
// quote push had no way to say so short of turning everything off.
//
// `notifPrefs.<category>` is read as enabled unless explicitly `false` —
// missing/undefined means enabled, so every existing user (who's never
// seen this settings section) keeps getting everything they already were,
// with no migration needed. Every server-side check that sends a push
// reads this via docSnap.data() directly (no separate watcher needed
// there) and treats `notifPrefs?.<category> === false` as the skip
// condition — see send-prayer-notifications.js, check-campaign-
// deadlines.js, broadcast-doa.js, and api/_lib/notifyDonorsFunded.js.
import { doc, onSnapshot, setDoc } from 'firebase/firestore';
import { db } from './firebase';

export const NOTIF_CATEGORIES = [
  { key: 'adzan', label: 'Adzan & Imsak', desc: 'Pengingat waktu sholat dan Imsak Ramadan' },
  { key: 'pengingat', label: 'Pengingat Ibadah', desc: 'Zakat, dzikir, puasa sunnah, Jumat, amalan harian' },
  { key: 'komunitas', label: 'Doa & Komunitas', desc: 'Notifikasi doa baru dari sesama pengguna' },
  { key: 'donasi', label: 'Donasi', desc: 'Pengingat donasi bulanan & campaign yang tercapai' },
  { key: 'konten', label: 'Konten Harian', desc: 'Kutipan inspirasi harian' },
];

export function watchNotifPrefs(uid, callback) {
  if (!uid) {
    callback({});
    return () => {};
  }
  return onSnapshot(doc(db, 'users', uid), (snap) => callback(snap.data()?.notifPrefs || {}));
}

export async function setNotifPref(uid, category, enabled) {
  await setDoc(doc(db, 'users', uid), { notifPrefs: { [category]: enabled } }, { merge: true });
}
