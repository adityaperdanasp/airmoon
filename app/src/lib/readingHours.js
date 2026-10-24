// Mencatat jam (waktu lokal) kamu biasa membaca Qur'an: users/{uid}.readingHours.h{0-23}
// naik satu per jam per hari. Dipakai backend (api/send-prayer-notifications.js)
// untuk pengingat "waktu biasa kamu membaca". Hanya hitungan per jam, tanpa isi bacaan.
import { doc, updateDoc, increment } from 'firebase/firestore';
import { db } from './firebase';

export async function recordReadingHour(uid) {
  if (!uid) return;
  const now = new Date();
  const stamp = `${now.getFullYear()}-${now.getMonth()}-${now.getDate()}-${now.getHours()}`;
  try {
    if (localStorage.getItem('airmoon-reading-hour-stamp') === stamp) return;
    localStorage.setItem('airmoon-reading-hour-stamp', stamp);
  } catch {
    // no storage: it just may write twice in one hour, harmless
  }
  try {
    await updateDoc(doc(db, 'users', uid), { [`readingHours.h${now.getHours()}`]: increment(1) });
  } catch {
    // best effort
  }
}
