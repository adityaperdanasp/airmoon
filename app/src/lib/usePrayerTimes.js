import { useEffect, useState } from 'react';
import { getLocation, fetchPrayerTimes, reverseGeocode } from './prayerApi';

const PRAYER_ORDER = ['Fajr', 'Dhuhr', 'Asr', 'Maghrib', 'Isha'];
const PRAYER_LABEL = { Fajr: 'Subuh', Dhuhr: 'Dzuhur', Asr: 'Ashar', Maghrib: 'Maghrib', Isha: 'Isya' };

function parseTimeToday(hhmm) {
  const [h, m] = hhmm.split(':').map(Number);
  const d = new Date();
  d.setHours(h, m, 0, 0);
  return d;
}

export function usePrayerTimes() {
  const [status, setStatus] = useState('loading'); // loading | denied | error | ready
  const [data, setData] = useState(null); // { timings, hijri, gregorian, locationLabel }
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const { lat, lng } = await getLocation();
        const [times, label] = await Promise.all([fetchPrayerTimes(lat, lng), reverseGeocode(lat, lng)]);
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
  }, []);

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

  return { status, data, next, prayerOrder: PRAYER_ORDER, prayerLabel: PRAYER_LABEL };
}
