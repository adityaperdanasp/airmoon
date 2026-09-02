// Favorit Ayat — a real multi-item saved collection, distinct from the
// single lastReadAyat/lastReadMushaf bookmark pointer (see SurahReader.jsx
// and MushafReader.jsx) which only ever remembers "where you left off".
// Someone reads for meaning, not just position, and wants to come back to
// several specific ayat later — this is that list. Stored as one Firestore
// doc per ayat under users/{uid}/favoriteAyat/{verseKey} (e.g. "2:255"),
// covered by the same owner-only access pattern as the rest of users/{uid}
// (a subcollection under a doc a user owns is still scoped to them under
// this app's rules — no separate rule needed beyond what already exists).

import { collection, doc, deleteDoc, setDoc, onSnapshot, serverTimestamp, query, orderBy } from 'firebase/firestore';
import { db } from './firebase';

export function watchFavoriteAyat(uid, callback) {
  if (!uid) {
    callback([]);
    return () => {};
  }
  const q = query(collection(db, 'users', uid, 'favoriteAyat'), orderBy('createdAt', 'desc'));
  return onSnapshot(q, (snap) => callback(snap.docs.map((d) => ({ id: d.id, ...d.data() }))));
}

export async function addFavoriteAyat(uid, ayat) {
  // ayat: { chapter, chapterName, verse, arabic, translation }
  const verseKey = `${ayat.chapter}:${ayat.verse}`;
  await setDoc(doc(db, 'users', uid, 'favoriteAyat', verseKey), { ...ayat, createdAt: serverTimestamp() });
}

export async function removeFavoriteAyat(uid, chapter, verse) {
  await deleteDoc(doc(db, 'users', uid, 'favoriteAyat', `${chapter}:${verse}`));
}
