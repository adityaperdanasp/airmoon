// Monthly Zakat Penghasilan reminder — distinct from Zakat Maal's haul
// countdown (lib/zakatHaul.js), which only makes sense for wealth sitting
// above nisab for a full lunar year. Income zakat is typically paid every
// payday instead, so this is a plain monthly on/off reminder with no
// target amount stored (income varies month to month, unlike a fixed
// donation pledge) — the push just nudges someone back to this
// calculator, they compute and pay the actual figure themselves.
import { doc, onSnapshot, setDoc } from 'firebase/firestore';
import { db } from './firebase';

export function watchZakatPenghasilanReminder(uid, callback) {
  if (!uid) {
    callback(false);
    return () => {};
  }
  return onSnapshot(doc(db, 'users', uid), (snap) => callback(!!snap.data()?.zakatPenghasilanReminder?.active));
}

export async function setZakatPenghasilanReminder(uid, active) {
  await setDoc(doc(db, 'users', uid), { zakatPenghasilanReminder: { active } }, { merge: true });
}
