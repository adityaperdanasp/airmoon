const ALADHAN_PROXY = 'https://airmoon.vercel.app/api/aladhan';
const RAMADAN_MONTH = 9;

// Given the current Hijri month/year, which Hijri year's 1 Ramadan is the
// next (or current) one to count down to. If we're already past Ramadan
// for this Hijri year (month > 9), the next one is next Hijri year.
export function nextRamadanYear(currentHijriMonth, currentHijriYear) {
  return currentHijriMonth > RAMADAN_MONTH ? currentHijriYear + 1 : currentHijriYear;
}

export function isRamadan(hijriMonth) {
  return hijriMonth === RAMADAN_MONTH;
}

// Gregorian date of 1 Ramadan for the given Hijri year.
export async function fetchRamadanStart(hijriYear) {
  const res = await fetch(`${ALADHAN_PROXY}?type=h-to-g&day=1&month=${RAMADAN_MONTH}&year=${hijriYear}`);
  if (!res.ok) throw new Error('Gagal menghitung tanggal Ramadan.');
  const json = await res.json();
  const g = json.data.gregorian;
  return new Date(Number(g.year), g.month.number - 1, Number(g.day));
}

export function daysBetween(from, to) {
  const msPerDay = 24 * 60 * 60 * 1000;
  const a = new Date(from.getFullYear(), from.getMonth(), from.getDate());
  const b = new Date(to.getFullYear(), to.getMonth(), to.getDate());
  return Math.round((b - a) / msPerDay);
}
