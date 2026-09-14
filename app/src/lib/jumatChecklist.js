// Checklist Sunnah Jumat (2026-09-12) — one doc per Friday date under
// users/{uid}/jumatChecklist/{dateKey}, holding a map of which sunnah
// items are done that day. Closer to useRamadanTracker.js's per-field-
// merge shape than puasaSunnahLog.js's existence-only shape, since a
// single Friday has several independent sunnah items rather than one
// plain yes/no.
import { doc, onSnapshot, setDoc } from 'firebase/firestore';
import { db } from './firebase';

// `labelKey` (2026-09-14) points at translations.js, not a raw string —
// JumatChecklist.jsx renders each via t(item.labelKey).
export const JUMAT_ITEMS = [
  { key: 'mandi', labelKey: 'jumat_item_mandi' },
  { key: 'wangi', labelKey: 'jumat_item_wangi' },
  { key: 'kuku', labelKey: 'jumat_item_kuku' },
  { key: 'alKahfi', labelKey: 'jumat_item_alkahfi' },
];

export function todayDateKey(date = new Date()) {
  return date.toISOString().slice(0, 10);
}

export function watchJumatChecklist(uid, dateKey, callback) {
  if (!uid) {
    callback({});
    return () => {};
  }
  return onSnapshot(doc(db, 'users', uid, 'jumatChecklist', dateKey), (snap) => callback(snap.data() || {}));
}

export async function setJumatChecklistItem(uid, dateKey, itemKey, value) {
  await setDoc(doc(db, 'users', uid, 'jumatChecklist', dateKey), { [itemKey]: value }, { merge: true });
}
