import { doc, onSnapshot, setDoc } from 'firebase/firestore';
import { db } from './firebase';

// A curated set of colors for the avatar circle — the fallback when
// there's no photo (see avatarPhoto.js for the real upload, added
// 2026-09-11: a compressed data URL stored directly on this same doc,
// since Daftarkan Masjid's Google-Forms-based photo handling doesn't fit
// a profile-photo picker and there's still no Storage bucket to build a
// real upload endpoint against). Also what a fresh account starts with
// before ever picking a photo.
// `label` is real Indonesian, used for the swatch's accessible name — the
// `id` slug alone (an English word like "teal") used to be reused
// directly as the aria-label, which read out an unlocalized word to a
// screen reader on an otherwise all-Indonesian page.
export const AVATAR_COLORS = [
  { id: 'teal', label: 'Teal', hex: '#0d4d47' },
  { id: 'gold', label: 'Emas', hex: '#a9761f' },
  { id: 'maroon', label: 'Marun', hex: '#8a3a3a' },
  { id: 'navy', label: 'Navy', hex: '#1e4d6b' },
  { id: 'forest', label: 'Hijau Tua', hex: '#1c6b4a' },
  { id: 'plum', label: 'Ungu Tua', hex: '#6b3a6b' },
  { id: 'terracotta', label: 'Terracotta', hex: '#b5651d' },
  { id: 'slate', label: 'Abu Kebiruan', hex: '#3f5c68' },
];

export function watchUserProfile(uid, callback) {
  if (!uid) return () => {};
  return onSnapshot(doc(db, 'users', uid), (snap) => {
    callback(snap.exists() ? snap.data() : null);
  });
}

export async function setAvatarColor(uid, hex) {
  await setDoc(doc(db, 'users', uid), { avatarColor: hex }, { merge: true });
}

export async function setAvatarPhoto(uid, dataUrl) {
  await setDoc(doc(db, 'users', uid), { avatarPhoto: dataUrl }, { merge: true });
}

export async function clearAvatarPhoto(uid) {
  await setDoc(doc(db, 'users', uid), { avatarPhoto: null }, { merge: true });
}
