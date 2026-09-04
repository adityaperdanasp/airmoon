import { useEffect, useState } from 'react';
import { getLocation, fetchPrayerTimes, reverseGeocode } from './prayerApi';
import { loadPrayerMethod, watchPrayerMethod, setPrayerMethod as persistPrayerMethod } from './prayerMethod';
import { useAuth } from '../context/AuthContext';

const PRAYER_ORDER = ['Fajr', 'Dhuhr', 'Asr', 'Maghrib', 'Isha'];
const PRAYER_LABEL = { Fajr: 'Subuh', Dhuhr: 'Dzuhur', Asr: 'Ashar', Maghrib: 'Maghrib', Isha: 'Isya' };

// Same localStorage-override pattern as lib/useQibla.js's OVERRIDE_KEY —
// separate key since picking a city for "what's the qibla direction from
// there" and "what are the prayer times there" are two independent
// intents someone might want set differently at the same time.
const OVERRIDE_KEY = 'airmoon-prayertimes-override-location';

function loadOverride() {
  try {
    const raw = localStorage.getItem(OVERRIDE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function parseTimeToday(hhmm) {
  const [h, m] = hhmm.split(':').map(Number);
  const d = new Date();
  d.setHours(h, m, 0, 0);
  return d;
}

export function usePrayerTimes() {
  const { user } = useAuth();
  const [status, setStatus] = useState('loading'); // loading | denied | error | ready
  const [data, setData] = useState(null); // { timings, hijri, gregorian, locationLabel }
  const [now, setNow] = useState(new Date());
  const [override, setOverrideState] = useState(loadOverride);
  // Metode Perhitungan (2026-09-05) — localStorage by default, synced to
  // Firestore when signed in so the notification cron's own /api/aladhan
  // call (api/send-prayer-notifications.js) computes against the same
  // method this page displays, not always the Kemenag default.
  const [method, setMethodState] = useState(loadPrayerMethod);
  useEffect(() => watchPrayerMethod(user?.uid, setMethodState), [user?.uid]);

  function setMethod(id) {
    setMethodState(id);
    persistPrayerMethod(id, user?.uid);
  }

  function setOverride(loc) {
    setOverrideState(loc);
    try {
      if (loc) localStorage.setItem(OVERRIDE_KEY, JSON.stringify(loc));
      else localStorage.removeItem(OVERRIDE_KEY);
    } catch {
      // Private-browsing/full storage — the override still applies this
      // session, it just won't survive a reload.
    }
  }

  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    let cancelled = false;
    setStatus('loading');
    (async () => {
      try {
        const { lat, lng } = override || (await getLocation());
        const [times, label] = await Promise.all([
          fetchPrayerTimes(lat, lng, new Date(), method),
          override?.label ? Promise.resolve(override.label) : reverseGeocode(lat, lng),
        ]);
        if (cancelled) return;
        setData({
          timings: times.timings,
          hijri: times.date.hijri,
          gregorian: times.date.gregorian,
          locationLabel: label || 'Lokasi kamu',
          lat,
          lng,
        });
        setStatus('ready');
      } catch (err) {
        if (cancelled) return;
        setStatus(err.code === 1 ? 'denied' : 'error');
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [override, method]);

  let next = null;
  if (data) {
    const upcoming = PRAYER_ORDER.map((key) => ({
      key,
      label: PRAYER_LABEL[key],
      time: data.timings[key],
      date: parseTimeToday(data.timings[key]),
    })).find((p) => p.date > now);

    const target = upcoming || {
      key: 'Fajr',
      label: PRAYER_LABEL.Fajr,
      time: data.timings.Fajr,
      date: (() => {
        const d = parseTimeToday(data.timings.Fajr);
        d.setDate(d.getDate() + 1);
        return d;
      })(),
    };

    const diffMs = Math.max(0, target.date - now);
    const h = Math.floor(diffMs / 3600000);
    const m = Math.floor((diffMs % 3600000) / 60000);
    const s = Math.floor((diffMs % 60000) / 1000);
    next = {
      ...target,
      countdown: `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`,
    };
  }

  return { status, data, next, prayerOrder: PRAYER_ORDER, prayerLabel: PRAYER_LABEL, override, setOverride, method, setMethod };
}
