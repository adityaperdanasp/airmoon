// Streak sholat lengkap dan rapor ibadah bulanan, dihitung dari satu kali
// baca subkoleksi amalanHarian (satu dokumen per tanggal).
//
// "Sholat lengkap" = kelima waktu tercentang pada hari itu. Karena sholat yang
// waktunya sudah habis tidak bisa dicentang lagi (lib/ibadahWindows.js),
// centang yang ada otomatis berarti dikerjakan dalam waktunya. Streak ini
// pribadi: tidak dibandingkan dengan siapa pun.
//
// Satu hari libur per bulan dimaafkan (hari bolong tunggal, dengan hari
// sebelumnya lengkap) supaya satu hari sakit atau safar tidak menghapus
// rangkaian panjang.
import { collection, getDocs } from 'firebase/firestore';
import { db } from './firebase';
import { SHOLAT_KEYS, scoreForDay, DAILY_POINTS_MAX } from './amalanHarian';

function keyOf(d) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

export async function fetchAmalanAll(uid) {
  if (!uid) return new Map();
  const snap = await getDocs(collection(db, 'users', uid, 'amalanHarian'));
  const map = new Map();
  snap.forEach((d) => map.set(d.id, d.data()));
  return map;
}

const isComplete = (data) => !!data && SHOLAT_KEYS.every((k) => data.sholat?.[k]);

// Walks backwards day by day from `from`, returning the length of the run
// (forgiving one single-day gap per calendar month).
function runBackwards(all, from) {
  let streak = 0;
  const usedFreeze = new Set();
  const d = new Date(from);
  for (let i = 0; i < 800; i++) {
    const k = keyOf(d);
    if (isComplete(all.get(k))) {
      streak += 1;
    } else {
      const monthKey = k.slice(0, 7);
      const prev = new Date(d);
      prev.setDate(prev.getDate() - 1);
      if (streak > 0 && !usedFreeze.has(monthKey) && isComplete(all.get(keyOf(prev)))) {
        usedFreeze.add(monthKey);
      } else {
        break;
      }
    }
    d.setDate(d.getDate() - 1);
  }
  return streak;
}

export function computeSholatStreak(all) {
  const today = new Date();
  // Today only counts once complete, but an unfinished today does not break the run.
  const start = isComplete(all.get(keyOf(today))) ? today : new Date(today.getFullYear(), today.getMonth(), today.getDate() - 1);
  const current = runBackwards(all, start);
  let best = 0;
  for (const k of all.keys()) {
    if (isComplete(all.get(k))) {
      const [y, m, d] = k.split('-').map(Number);
      best = Math.max(best, runBackwards(all, new Date(y, m - 1, d)));
    }
  }
  return { current, best: Math.max(best, current) };
}

export function computeMonthReport(all, year, month /* 0-based */) {
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const today = new Date();
  const last = today.getFullYear() === year && today.getMonth() === month ? today.getDate() : daysInMonth;
  let points = 0;
  let sholatComplete = 0;
  let tilawahDays = 0;
  let dzikirDays = 0;
  let bestDay = { day: 0, score: -1 };
  for (let day = 1; day <= last; day++) {
    const data = all.get(keyOf(new Date(year, month, day)));
    if (!data) continue;
    const score = scoreForDay(data);
    points += score;
    if (isComplete(data)) sholatComplete += 1;
    if (data.tilawah) tilawahDays += 1;
    if (data.dzikirPagi || data.dzikirPetang) dzikirDays += 1;
    if (score > bestDay.score) bestDay = { day, score };
  }
  return { points, maxPoints: last * DAILY_POINTS_MAX, daysCounted: last, sholatComplete, tilawahDays, dzikirDays, bestDay };
}
