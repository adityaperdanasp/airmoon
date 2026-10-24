// Pilihan Ringkasan Pagi (users/{uid}.morningDigest = { enabled, mode }).
// mode: 'after-fajr' | '06:00' | '07:00'. Dikirim backend sekali sehari.
import { doc, onSnapshot, setDoc } from 'firebase/firestore';
import { db } from './firebase';

export const DIGEST_MODES = [
  { id: 'after-fajr', label: 'Setelah Subuh' },
  { id: '06:00', label: '06.00' },
  { id: '07:00', label: '07.00' },
];

export function watchMorningDigest(uid, callback) {
  if (!uid) {
    callback({ enabled: false, mode: 'after-fajr' });
    return () => {};
  }
  return onSnapshot(doc(db, 'users', uid), (snap) => {
    const d = snap.data()?.morningDigest;
    callback({ enabled: !!d?.enabled, mode: d?.mode || 'after-fajr' });
  });
}

export function setMorningDigest(uid, value) {
  return setDoc(doc(db, 'users', uid), { morningDigest: value }, { merge: true });
}
