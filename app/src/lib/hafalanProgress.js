// Tahfiz Qur'an Tracker (2026-09-12) — memorization progress, distinct
// from lib/khatamProgress.js's khatam (reading) tracker: someone can
// have read every page without having memorized any of it, and vice
// versa for a few well-known short surahs. Mirrors khatamProgress.js's
// exact shape — a single `hafalan.verses` array field on users/{uid},
// `arrayUnion`/`arrayRemove` so re-marking the same ayat is a no-op.
import { doc, onSnapshot, setDoc, arrayUnion, arrayRemove } from 'firebase/firestore';
import { db } from './firebase';

export function watchHafalanProgress(uid, callback) {
  if (!uid) {
    callback([]);
    return () => {};
  }
  return onSnapshot(doc(db, 'users', uid), (snap) => callback(snap.data()?.hafalan?.verses || []));
}

export async function markAyatHafal(uid, chapter, verse) {
  await setDoc(doc(db, 'users', uid), { hafalan: { verses: arrayUnion(`${chapter}:${verse}`) } }, { merge: true });
}

export async function unmarkAyatHafal(uid, chapter, verse) {
  await setDoc(doc(db, 'users', uid), { hafalan: { verses: arrayRemove(`${chapter}:${verse}`) } }, { merge: true });
}
