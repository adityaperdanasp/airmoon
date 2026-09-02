import { doc, onSnapshot, setDoc } from 'firebase/firestore';
import { db } from './firebase';

// A curated set of colors for the avatar circle — not a photo upload,
// since this project has no Firebase Storage bucket/upload handler set
// up anywhere (the one place the app handles user-submitted photos,
// Daftarkan Masjid, deliberately routes through Google Forms instead of
// building that infrastructure — see CLAUDE.md). A color picker is a
// real, useful "customize your avatar" feature without needing new
// backend plumbing.
export const AVATAR_COLORS = [
  { id: 'teal', hex: '#0d4d47' },
  { id: 'gold', hex: '#a9761f' },
  { id: 'maroon', hex: '#8a3a3a' },
  { id: 'navy', hex: '#1e4d6b' },
  { id: 'forest', hex: '#1c6b4a' },
  { id: 'plum', hex: '#6b3a6b' },
  { id: 'terracotta', hex: '#b5651d' },
  { id: 'slate', hex: '#3f5c68' },
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
