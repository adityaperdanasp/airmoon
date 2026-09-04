// Catatan Puasa Sunnah — `check-campaign-deadlines.js` already sends a
// reminder push for Senin/Kamis and Ayyamul Bidh, but there was nowhere
// to actually record "iya, aku puasa hari itu" — the reminder existed
// with no corresponding log. A subcollection (not a flat array field on
// the user doc) for the same reason `amalanHarian`/`ramadanTracker`/
// `umrohDeposits` are subcollections: this grows one entry per fast over
// a person's whole lifetime of using the app, not a small fixed-size set.
import { collection, doc, setDoc, deleteDoc, onSnapshot, serverTimestamp } from 'firebase/firestore';
import { db } from './firebase';

export function todayDateKey() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

// Returns every marked date (doc id, 'YYYY-MM-DD'), newest first.
export function watchPuasaSunnahLog(uid, callback) {
  if (!uid) {
    callback([]);
    return () => {};
  }
  return onSnapshot(collection(db, 'users', uid, 'puasaSunnah'), (snap) => {
    const dates = snap.docs.map((d) => d.id).sort((a, b) => (a < b ? 1 : -1));
    callback(dates);
  });
}

export async function markPuasaSunnah(uid, dateKey) {
  await setDoc(doc(db, 'users', uid, 'puasaSunnah', dateKey), { at: serverTimestamp() });
}

export async function unmarkPuasaSunnah(uid, dateKey) {
  await deleteDoc(doc(db, 'users', uid, 'puasaSunnah', dateKey));
}
