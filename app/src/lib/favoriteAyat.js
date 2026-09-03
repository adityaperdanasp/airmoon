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

// Collections/folders (2026-09-04) — a flat `collection` string field on
// the same doc rather than a separate collection-of-collections: someone's
// favorite list stays small enough that grouping by a field and filtering
// client-side is simpler than a second synced data structure, and it means
// an ayat can never end up in an "orphaned" collection reference. `null`/
// unset means "Semua" (ungrouped) — AyatFavorit.jsx treats that as the
// default bucket, not a real named collection.
export async function setFavoriteCollection(uid, chapter, verse, collectionName) {
  await setDoc(
    doc(db, 'users', uid, 'favoriteAyat', `${chapter}:${verse}`),
    { collection: collectionName || null },
    { merge: true }
  );
}
