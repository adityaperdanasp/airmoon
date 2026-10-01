// Catatan Wasiat & Preferensi Pemakaman — tempat nulis pesan terakhir/
// preferensi (mau dikubur dimana, siapa yang diberi amanah, dll),
// tersimpan privat per akun (users/{uid}.wasiatCatatan, sudah dicover
// rule owner-only yang ada). Ini CUMA catatan personal buat keluarga,
// bukan dokumen hukum/wasiat syar'i yang mengikat — beda dari field
// `wasiat` di Kalkulator Waris (itu nominal wasiat harta buat dikurangi
// sebelum pembagian waris, murni angka).
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from './firebase';

export async function loadWasiatCatatan(uid) {
  if (!uid) return '';
  const snap = await getDoc(doc(db, 'users', uid));
  return (snap.exists() && snap.data().wasiatCatatan) || '';
}

export async function saveWasiatCatatan(uid, text) {
  await setDoc(doc(db, 'users', uid), { wasiatCatatan: text }, { merge: true });
}
