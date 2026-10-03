import { useEffect, useState } from 'react';

// Waktu akhir tiap ibadah harian (2026-10-03, founder request): once a
// sholat's time is over, its chip in "Hari ini" can no longer be tapped
// and shows dimmed. Windows follow the fiqh waktu sholat:
//   Subuh -> terbit matahari (Syuruq), Dzuhur -> Ashar, Ashar -> Maghrib,
//   Maghrib -> Isya, Isya -> stays open until the day rolls over (the
//   amalan doc is per calendar date, so midnight resets it anyway).
// Dzikir Pagi closes at Maghrib adhan, as the founder specified.
// Client-side only: a missing/failed prayer-times fetch means nothing is
// locked, so someone without location access is never blocked.
function at(hhmm) {
  if (!hhmm) return null;
  const [h, m] = String(hhmm).split(':').map(Number);
  if (Number.isNaN(h) || Number.isNaN(m)) return null;
  const d = new Date();
  d.setHours(h, m, 0, 0);
  return d;
}

export function ibadahLocks(timings, now = new Date()) {
  const none = { subuh: false, dzuhur: false, ashar: false, maghrib: false, isya: false, dzikirPagi: false };
  if (!timings) return none;
  const ended = (hhmm) => {
    const d = at(hhmm);
    return !!d && now >= d;
  };
  return {
    subuh: ended(timings.Sunrise || timings.Dhuhr),
    dzuhur: ended(timings.Asr),
    ashar: ended(timings.Maghrib),
    maghrib: ended(timings.Isha),
    isya: false,
    dzikirPagi: ended(timings.Maghrib),
  };
}

// Re-evaluates once a minute so a chip dims right when its time ends,
// not on the next page visit.
export function useMinuteTick() {
  const [now, setNow] = useState(() => new Date());
  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 30000);
    return () => clearInterval(id);
  }, []);
  return now;
}

export const LOCK_HINT = {
  subuh: 'Waktu Subuh sudah habis',
  dzuhur: 'Waktu Dzuhur sudah habis',
  ashar: 'Waktu Ashar sudah habis',
  maghrib: 'Waktu Maghrib sudah habis',
  isya: 'Waktu Isya sudah habis',
  dzikirPagi: 'Waktu dzikir pagi sudah lewat',
};
