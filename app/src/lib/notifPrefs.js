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

// `icon`/`bg` added (2026-09-06) so NotifikasiCenter.jsx's category chips
// and list items can carry a distinct identity each — every category used
// to render in the exact same primary/muted styling, making the list hard
// to scan at a glance despite the filter chips already existing. `bg`
// reuses this app's existing pastel-tile tokens (same ones Lainnya.jsx's
// grid tiles use), not new colors.
export const NOTIF_CATEGORIES = [
  { key: 'adzan', label: 'Adzan & Imsak', desc: 'Pengingat waktu sholat dan Imsak Ramadan', icon: '🕌', bg: 'var(--mint)' },
  { key: 'pengingat', label: 'Pengingat Ibadah', desc: 'Zakat, dzikir, puasa sunnah, Jumat, amalan harian', icon: '🔔', bg: 'var(--cream)' },
  { key: 'komunitas', label: 'Doa & Komunitas', desc: 'Notifikasi doa baru dari sesama pengguna', icon: '🤲', bg: 'var(--blue-gray)' },
  { key: 'donasi', label: 'Donasi', desc: 'Pengingat donasi bulanan & campaign yang tercapai', icon: '💝', bg: 'var(--peach)' },
  { key: 'konten', label: 'Konten Harian', desc: 'Kutipan inspirasi harian', icon: '📜', bg: 'var(--mint)' },
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
