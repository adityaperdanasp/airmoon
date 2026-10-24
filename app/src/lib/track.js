// Statistik penggunaan anonim (2026-10-24). Selama ini aplikasi tidak bisa
// menjawab "fitur mana yang dipakai" atau "berapa orang aktif per hari".
// Firebase Analytics belum diaktifkan di proyek ini (konfigurasi web tidak
// punya measurementId), jadi ini penghitung sederhana milik sendiri:
//   analyticsDaily/{YYYY-MM-DD}.events.{nama} += 1
// Hanya HITUNGAN per hari. Tidak menyimpan siapa, perangkat apa, isi apa,
// dan tidak ada cookie pelacak. Pengguna bisa mematikannya di Pengaturan.
// Dibaca lewat konsol Firestore oleh pemilik aplikasi, tidak tampil di app.
import { doc, setDoc, increment, serverTimestamp } from 'firebase/firestore';
import { auth, db } from './firebase';
import { getUiPrefs } from './uiPrefs';

let pending = {};
let timer = null;

function todayKey() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

async function flush() {
  timer = null;
  const batch = pending;
  pending = {};
  const names = Object.keys(batch);
  if (!names.length || !auth.currentUser) return;
  const events = {};
  for (const n of names) events[n] = increment(batch[n]);
  try {
    await setDoc(doc(db, 'analyticsDaily', todayKey()), { events, updatedAt: serverTimestamp() }, { merge: true });
  } catch {
    // Statistik tidak boleh pernah mengganggu pemakaian.
  }
}

export function track(name) {
  if (!getUiPrefs().analytics) return;
  const safe = String(name).replace(/[^a-zA-Z0-9_:-]/g, '_').slice(0, 60);
  pending[safe] = (pending[safe] || 0) + 1;
  if (!timer) timer = setTimeout(flush, 6000);
}

// '/quran/18' -> 'pv_quran__n', '/lainnya/tasbih' -> 'pv_lainnya_tasbih'
export function trackPageView(pathname) {
  const clean = pathname
    .split('/')
    .filter(Boolean)
    .map((seg) => (/^\d+$/.test(seg) ? '_n' : seg))
    .join('_');
  track(`pv_${clean || 'home'}`);
}

// Sekali per hari per perangkat: dasar hitungan pengguna aktif harian.
export function trackAppOpenOncePerDay() {
  try {
    const k = 'airmoon-track-open';
    if (localStorage.getItem(k) === todayKey()) return;
    localStorage.setItem(k, todayKey());
  } catch {
    // tanpa penyimpanan: boleh terhitung ganda, bukan masalah
  }
  track('app_open');
}
