import { doc, onSnapshot, setDoc } from 'firebase/firestore';
import { db } from './firebase';

// Minat utama (2026-09-12) — Home used to render the exact same layout
// for every user regardless of what they actually opened the app for.
// Captured once in OnboardingTour.jsx's new final step, and changeable
// anytime after in Pengaturan.jsx — a first-run guess shouldn't be
// permanent if it turns out wrong. `key` is what Home.jsx reorders its
// Layanan grid by; `label`/`icon` are just for the picker UI.
export const INTEREST_OPTIONS = [
  { key: 'quran', label: "Qur'an & Bacaan", icon: '📖' },
  { key: 'sholat', label: 'Sholat & Dzikir', icon: '🕌' },
  { key: 'donasi', label: 'Donasi & Sedekah', icon: '💝' },
  { key: 'semua', label: 'Semuanya', icon: '🌙' },
];

export function watchInterestTag(uid, callback) {
  if (!uid) {
    callback(null);
    return () => {};
  }
  return onSnapshot(doc(db, 'users', uid), (snap) => callback(snap.data()?.interestTag || null));
}

export async function setInterestTag(uid, key) {
  await setDoc(doc(db, 'users', uid), { interestTag: key }, { merge: true });
}
