// Pengingat Tahlilan (7/40/100 Hari) — set tanggal wafat sekali, app
// kirim notifikasi di hari ke-7/40/100 lewat cron harian yang sama yang
// sudah ngecek zakat haul/puasa sunnah/dll (api/check-campaign-
// deadlines.js's checkTahlilanReminder). Stored on the same users/{uid}
// doc as everything else per-user, already covered by the existing
// owner-only Firestore rule — no rules change needed.
import { doc, setDoc, onSnapshot } from 'firebase/firestore';
import { db } from './firebase';

export function watchTahlilanReminder(uid, callback) {
  if (!uid) {
    callback(null);
    return () => {};
  }
  return onSnapshot(doc(db, 'users', uid), (snap) => {
    const data = snap.exists() ? snap.data() : null;
    callback(data?.tahlilanTanggalWafat ? { tanggalWafat: data.tahlilanTanggalWafat, nama: data.tahlilanNama || '' } : null);
  });
}

export async function setTahlilanReminder(uid, { tanggalWafat, nama }) {
  await setDoc(
    doc(db, 'users', uid),
    {
      tahlilanTanggalWafat: tanggalWafat,
      tahlilanNama: nama || '',
      // Reset the per-milestone flags whenever a new date is set —
      // otherwise a date correction could skip a milestone the old date
      // had already (incorrectly) marked as notified.
      tahlilanNotified7: false,
      tahlilanNotified40: false,
      tahlilanNotified100: false,
    },
    { merge: true }
  );
}

export async function clearTahlilanReminder(uid) {
  await setDoc(
    doc(db, 'users', uid),
    { tahlilanTanggalWafat: null, tahlilanNama: '', tahlilanNotified7: false, tahlilanNotified40: false, tahlilanNotified100: false },
    { merge: true }
  );
}

// Hari ke- sejak tanggal wafat, dihitung lokal buat ditampilkan di UI
// (perhitungan yang beneran dipakai buat kirim notifikasi ada di sisi
// server, lihat api/check-campaign-deadlines.js).
export function hariKeTahlilan(tanggalWafat) {
  if (!tanggalWafat) return null;
  const start = new Date(`${tanggalWafat}T00:00:00`);
  return Math.floor((Date.now() - start.getTime()) / (1000 * 60 * 60 * 24));
}
