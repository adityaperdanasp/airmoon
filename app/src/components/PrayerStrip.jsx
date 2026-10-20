import { Link } from 'react-router-dom';
import { PRAYER_METHODS } from '../lib/prayerMethod';

const ORDER = [['Fajr', 'Subuh'], ['Dhuhr', 'Dzuhur'], ['Asr', 'Ashar'], ['Maghrib', 'Maghrib'], ['Isha', 'Isya']];

// The five times in one floating card overlapping the hero's skyline;
// the prayer we're counting down to is highlighted. Whole card links to
// the full Jadwal Sholat page.
export default function PrayerStrip({ timings, nextKey, location, manual, methodId }) {
  const methodLabel = PRAYER_METHODS.find((m) => m.id === methodId)?.label;
  return (
    <Link
      to="/jadwal-sholat"
      onMouseEnter={() => import('../pages/JadwalSholat')}
      onTouchStart={() => import('../pages/JadwalSholat')}
      aria-label="Jadwal sholat"
      className="prayer-strip"
      style={{ position: 'relative', display: 'flex', flexWrap: 'wrap', margin: '-46px 20px 0', padding: '14px 8px 12px', borderRadius: 24, background: 'var(--card)', color: 'var(--ink)', textDecoration: 'none', border: '1px solid var(--border)', boxShadow: '0 12px 32px rgba(10,40,36,0.14)' }}
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
      {location && (
        <div className="strip-loc" style={{ flexBasis: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 5, marginTop: 8, padding: '8px 10px 0', borderTop: '1px solid var(--border)', fontSize: 11, color: 'var(--muted)', minWidth: 0 }}>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" style={{ flexShrink: 0 }} aria-hidden="true">
            <path d="M12 21s7-6.2 7-11.5A7 7 0 0 0 5 9.5C5 14.8 12 21 12 21Z" strokeWidth="1.8" strokeLinejoin="round" />
            <circle cx="12" cy="9.5" r="2.4" strokeWidth="1.8" />
          </svg>
          <span style={{ fontWeight: 700, color: 'var(--ink)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{location}</span>
          <span style={{ flexShrink: 0, whiteSpace: 'nowrap' }}>· {manual ? 'lokasi manual' : 'sesuai GPS'}{methodLabel ? ` · ${methodLabel}` : ''}</span>
        </div>
      )}
    </Link>
  );
}
