// Waktu Mustajab Doa (2026-09-12) — a client-side-only computed banner,
// no push notification needed: usePrayerTimes.js already ticks a live
// clock and has today's Fajr/Maghrib as "HH:MM" strings, plenty to
// derive these three windows from. Checked in priority order (most
// specific/rare first) since more than one could technically overlap
// (e.g. Jumat's pre-Maghrib window and the adzan-Maghrib window itself).

function parseTimeToday(hhmm, base = new Date()) {
  const [h, m] = hhmm.split(':').map(Number);
  const d = new Date(base);
  d.setHours(h, m, 0, 0);
  return d;
}

const ADZAN_ORDER = ['Fajr', 'Dhuhr', 'Asr', 'Maghrib', 'Isha'];

// Returns { key, message } or null. `timings` is usePrayerTimes.js's
// `data.timings` shape ({ Fajr, Dhuhr, Asr, Maghrib, Isha } as "HH:MM").
export function getMustajabWindow(timings, now = new Date()) {
  if (!timings) return null;

  // 1. Jumat menjelang Maghrib — the last hour before Maghrib on Friday,
  // one of the most emphasized mustajab windows in the Sunnah.
  if (now.getDay() === 5) {
    const maghrib = parseTimeToday(timings.Maghrib, now);
    const windowStart = new Date(maghrib.getTime() - 60 * 60000);
    if (now >= windowStart && now < maghrib) {
      return { key: 'jumat-maghrib', message: 'Ini waktu mustajab: menjelang Maghrib di hari Jumat. Yuk sempatkan berdoa.' };
    }
  }

  // 2. Antara adzan dan iqamah — approximated as the 10 minutes right
  // after each adzan time, since this app has no real iqamah time to
  // read from.
  for (const key of ADZAN_ORDER) {
    if (!timings[key]) continue;
    const adzan = parseTimeToday(timings[key], now);
    const windowEnd = new Date(adzan.getTime() + 10 * 60000);
    if (now >= adzan && now < windowEnd) {
      return { key: 'antara-adzan-iqamah', message: 'Ini waktu mustajab: antara adzan dan iqamah. Yuk sempatkan berdoa sebelum sholat.' };
    }
  }

  // 3. Sepertiga malam terakhir — last third of the night, spanning from
  // today's Maghrib to tomorrow's Fajr.
  const maghribToday = parseTimeToday(timings.Maghrib, now);
  const fajrTomorrow = parseTimeToday(timings.Fajr, now);
  fajrTomorrow.setDate(fajrTomorrow.getDate() + (now < maghribToday ? 0 : 1));
  const nightStart = now < maghribToday
    ? (() => { const d = new Date(maghribToday); d.setDate(d.getDate() - 1); return d; })()
    : maghribToday;
  const nightDuration = fajrTomorrow - nightStart;
  const lastThirdStart = new Date(fajrTomorrow.getTime() - nightDuration / 3);
  if (now >= lastThirdStart && now < fajrTomorrow) {
    return { key: 'sepertiga-malam', message: 'Ini waktu mustajab: sepertiga malam terakhir. Yuk sempatkan bangun & berdoa.' };
  }

  return null;
}
