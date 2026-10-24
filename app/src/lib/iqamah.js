// Jeda adzan ke iqamah per waktu sholat (menit), diatur pengguna sesuai
// masjid tempat dia biasa sholat. Dipakai Waktu Mustajab di Home ("antara
// adzan dan iqamah"). Aplikasi ini belum punya data iqamah asli tiap masjid,
// jadi ini perkiraan yang bisa kamu sesuaikan. Per perangkat (localStorage).
export const IQAMAH_KEYS = ['Fajr', 'Dhuhr', 'Asr', 'Maghrib', 'Isha'];
export const IQAMAH_LABELS = { Fajr: 'Subuh', Dhuhr: 'Dzuhur', Asr: 'Ashar', Maghrib: 'Maghrib', Isha: 'Isya' };
export const DEFAULT_IQAMAH = { Fajr: 15, Dhuhr: 10, Asr: 10, Maghrib: 7, Isha: 10 };
const KEY = 'airmoon-iqamah-offsets';
export const MIN_IQAMAH = 3;
export const MAX_IQAMAH = 40;

export function getIqamahOffsets() {
  try {
    const raw = JSON.parse(localStorage.getItem(KEY));
    if (raw && typeof raw === 'object') {
      const out = { ...DEFAULT_IQAMAH };
      for (const k of IQAMAH_KEYS) {
        const v = Number(raw[k]);
        if (v >= MIN_IQAMAH && v <= MAX_IQAMAH) out[k] = v;
      }
      return out;
    }
  } catch {
    // fall through
  }
  return { ...DEFAULT_IQAMAH };
}

export function setIqamahOffset(key, minutes) {
  const next = { ...getIqamahOffsets(), [key]: Math.min(MAX_IQAMAH, Math.max(MIN_IQAMAH, Math.round(minutes))) };
  try {
    localStorage.setItem(KEY, JSON.stringify(next));
  } catch {
    // ignore
  }
  return next;
}
