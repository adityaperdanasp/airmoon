// Zakat Maal's "haul" tracker — zakat maal is only actually due once
// wealth has stayed above nisab for a full Hijri (lunar) year, not just
// whenever it crosses the threshold. Stored on the same users/{uid} doc
// as everything else per-user (zakatHaul: { startDate, lastNotifiedCycle }),
// already covered by the existing owner-only users/{uid} Firestore rule.
//
// A Hijri year is ~354 days (shorter than the Gregorian 365 this app's
// dates otherwise run on) — that's the real number used for the haul
// countdown, not a rounded 365.

import { doc, getDoc, setDoc, onSnapshot } from 'firebase/firestore';
import { db } from './firebase';

export const HAUL_DAYS = 354;

export function watchZakatHaul(uid, callback) {
  if (!uid) {
    callback(null);
    return () => {};
  }
  return onSnapshot(doc(db, 'users', uid), (snap) => {
    callback((snap.exists() && snap.data().zakatHaul) || null);
  });
}

// Starts (or restarts, e.g. after paying zakat maal and resetting the
// clock) the haul countdown from today.
export async function startZakatHaul(uid) {
  await setDoc(
    doc(db, 'users', uid),
    { zakatHaul: { startDate: new Date().toISOString().slice(0, 10), lastNotifiedCycle: null } },
    { merge: true }
  );
}

export async function clearZakatHaul(uid) {
  const ref = doc(db, 'users', uid);
  const snap = await getDoc(ref);
  if (!snap.exists()) return;
  await setDoc(ref, { zakatHaul: null }, { merge: true });
}

// Days remaining until the haul completes — negative once it's overdue.
export function daysUntilHaulDue(startDate) {
  const start = new Date(`${startDate}T00:00:00`);
  const dueDate = new Date(start);
  dueDate.setDate(dueDate.getDate() + HAUL_DAYS);
  const diffMs = dueDate.getTime() - Date.now();
  return Math.ceil(diffMs / (1000 * 60 * 60 * 24));
}
