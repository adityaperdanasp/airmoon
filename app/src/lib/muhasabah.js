// Muhasabah malam (2026-10-24): tiga pertanyaan singkat, catatan pribadi per
// tanggal di users/{uid}/muhasabah/{YYYY-MM-DD}. Tidak dibagikan ke siapa
// pun dan tidak dinilai. Hanya untuk dirimu sendiri.
import { collection, doc, getDoc, limit, onSnapshot, orderBy, query, serverTimestamp, setDoc } from 'firebase/firestore';
import { db } from './firebase';

export const MUHASABAH_QUESTIONS = [
  { key: 'syukur', label: 'Apa yang aku syukuri hari ini?', placeholder: 'Sekecil apa pun, tuliskan.' },
  { key: 'kurang', label: 'Apa yang kurang baik dariku hari ini, dan perlu aku mintakan ampun?', placeholder: 'Jujur saja ke dirimu sendiri.' },
  { key: 'besok', label: 'Satu niat baik untuk besok', placeholder: 'Satu saja, yang realistis.' },
];

export function todayKey() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

export async function loadMuhasabah(uid, dateKey) {
  const snap = await getDoc(doc(db, 'users', uid, 'muhasabah', dateKey));
  return snap.exists() ? snap.data().answers || {} : {};
}

export function saveMuhasabah(uid, dateKey, answers) {
  return setDoc(doc(db, 'users', uid, 'muhasabah', dateKey), { answers, dateKey, createdAt: serverTimestamp() }, { merge: true });
}

export function watchRecentMuhasabah(uid, callback) {
  if (!uid) {
    callback([]);
    return () => {};
  }
  const q = query(collection(db, 'users', uid, 'muhasabah'), orderBy('dateKey', 'desc'), limit(14));
  return onSnapshot(q, (snap) => callback(snap.docs.map((d) => ({ id: d.id, ...d.data() }))));
}
