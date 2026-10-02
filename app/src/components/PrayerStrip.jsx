import { Link } from 'react-router-dom';

const ORDER = [['Fajr', 'Subuh'], ['Dhuhr', 'Dzuhur'], ['Asr', 'Ashar'], ['Maghrib', 'Maghrib'], ['Isha', 'Isya']];

// The five times in one floating card overlapping the hero's skyline;
// the prayer we're counting down to is highlighted. Whole card links to
// the full Jadwal Sholat page.
export default function PrayerStrip({ timings, nextKey }) {
  return (
    <Link
      to="/jadwal-sholat"
      onMouseEnter={() => import('../pages/JadwalSholat')}
      onTouchStart={() => import('../pages/JadwalSholat')}
      aria-label="Jadwal sholat"
      style={{ position: 'relative', display: 'flex', margin: '-46px 20px 0', padding: '14px 8px', borderRadius: 24, background: 'var(--card)', color: 'var(--ink)', textDecoration: 'none', border: '1px solid var(--border)', boxShadow: '0 12px 32px rgba(10,40,36,0.14)' }}
    >
      {ORDER.map(([key, label]) => {
        const on = key === nextKey;
        return (
          <div key={key} style={{ flex: 1, textAlign: 'center', padding: '8px 0', borderRadius: 16, background: on ? 'var(--primary)' : 'transparent', color: on ? 'var(--on-primary)' : 'var(--ink)' }}>
            <div style={{ fontSize: 10.5, opacity: on ? 0.9 : 0.6, fontWeight: 600 }}>{label}</div>
            <div style={{ fontSize: 13.5, fontWeight: 700, marginTop: 2, fontVariantNumeric: 'tabular-nums' }}>{timings?.[key] ? timings[key].slice(0, 5) : '--:--'}</div>
          </div>
        );
      })}
    </Link>
  );
}
