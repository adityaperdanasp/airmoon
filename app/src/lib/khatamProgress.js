// Progress Khatam Qur'an — how much of the whole Mushaf someone has
// actually paged through, not per-surah completion (Mode Ayat has no
// fixed page count to track against) or a single last-read pointer (that
// only says "where did I leave off", not "how much have I covered
// overall"). Backed by `users/{uid}.khatam`: `pages` is every distinct
// Mushaf page number visited (arrayUnion, so revisiting a page is a
// no-op), `juz` is every distinct juz number actually seen on those pages
// (MushafReader.jsx already fetches `juz_number` per page for its own
// "Juz N · Halaman P" header — reused here directly rather than
// estimating juz from a page-count formula, which would drift from the
// real, unevenly-sized juz boundaries).
import { doc, onSnapshot, setDoc, arrayUnion } from 'firebase/firestore';
import { db } from './firebase';

export const TOTAL_MUSHAF_PAGES = 604;
export const TOTAL_JUZ = 30;

export function watchKhatamProgress(uid, callback) {
  if (!uid) {
    callback({ pages: [], juz: [] });
    return () => {};
  }
  return onSnapshot(doc(db, 'users', uid), (snap) => {
    const khatam = snap.data()?.khatam;
    callback({ pages: khatam?.pages || [], juz: khatam?.juz || [] });
  });
}

export async function markPageRead(uid, page, juzNumber) {
  if (!uid || !page) return;
  const update = { khatam: { pages: arrayUnion(page) } };
  if (juzNumber) update.khatam.juz = arrayUnion(juzNumber);
  await setDoc(doc(db, 'users', uid), update, { merge: true });
}

export async function resetKhatamProgress(uid) {
  await setDoc(doc(db, 'users', uid), { khatam: null }, { merge: true });
}
