import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { usePrayerTimes } from '../lib/usePrayerTimes';
import TopBar from '../components/TopBar';
import BottomNav from '../components/BottomNav';

function useNotifyToggle(next) {
  const [enabled, setEnabled] = useState(() => localStorage.getItem('airmoon-adzan-notif') === '1');
  const [scheduled, setScheduled] = useState(null);

  useEffect(() => {
    if (scheduled) clearTimeout(scheduled);
    if (!enabled || !next || typeof Notification === 'undefined') return;
    const [h, m, s] = next.countdown.split(':').map(Number);
    const ms = (h * 3600 + m * 60 + s) * 1000;
    const id = setTimeout(() => {
      if (Notification.permission === 'granted') {
        new Notification(`Waktunya Sholat ${next.label}`, {
          body: `${next.label} telah masuk waktunya. Yuk tunaikan sholat.`,
        });
      }
    }, ms);
    setScheduled(id);
    return () => clearTimeout(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [enabled, next?.key]);

  async function toggle() {
    if (!enabled && typeof Notification !== 'undefined' && Notification.permission !== 'granted') {
      const perm = await Notification.requestPermission();
      if (perm !== 'granted') return;
    }
    const next2 = !enabled;
    setEnabled(next2);
    localStorage.setItem('airmoon-adzan-notif', next2 ? '1' : '0');
  }

  return { enabled, toggle };
}

export default function JadwalSholat() {
  const { status, data, next, prayerOrder, prayerLabel } = usePrayerTimes();
  const { enabled, toggle } = useNotifyToggle(next);
  const adzanSound = localStorage.getItem('airmoon-adzan-sound') || 'Adzan Makkah';

  return (
    <div className="screen">
      <div className="screen-content">
        <div className="topbar">
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <h1 style={{ margin: 0, fontSize: 22, fontWeight: 800, letterSpacing: '-0.01em' }}>Jadwal Sholat</h1>
            <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginTop: 2 }}>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="var(--muted)">
                <path d="M12 21s-6.5-6.1-6.5-11A6.5 6.5 0 0 1 18.5 10c0 4.9-6.5 11-6.5 11Z" strokeWidth="1.7" strokeLinejoin="round" />
              </svg>
              <span style={{ fontSize: 12, color: 'var(--muted)' }}>
                {data ? data.locationLabel : status === 'denied' ? 'Lokasi tidak diizinkan' : 'Mendeteksi lokasi…'}
              </span>
              {data && <span style={{ fontSize: 9, fontWeight: 700, padding: '2px 6px', borderRadius: 999, color: 'var(--primary)', background: 'var(--mint)' }}>GPS</span>}
            </div>
          </div>
        </div>

        {status === 'denied' && (
          <div className="card" style={{ padding: 16, fontSize: 12.5, lineHeight: 1.5 }}>
            Akses lokasi ditolak. Izinkan lokasi di pengaturan browser buat lihat jadwal sholat sesuai posisi kamu.
          </div>
        )}

        {status === 'error' && (
          <div className="card" style={{ padding: 16, fontSize: 12.5, lineHeight: 1.5 }}>
            Gagal memuat jadwal sholat. Coba refresh halaman.
          </div>
        )}

        {status === 'ready' && data && next && (
          <>
            <div style={{ borderRadius: 22, padding: '22px 20px', textAlign: 'center', background: `linear-gradient(135deg, var(--primary), var(--primary-dark))` }}>
              <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.04em', textTransform: 'uppercase', color: 'var(--accent)' }}>
                {next.label} dalam
              </div>
              <div style={{ fontSize: 34, fontWeight: 800, color: '#fff', marginTop: 6 }}>{next.countdown}</div>
              <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.75)', marginTop: 6 }}>
                {data.hijri.day} {data.hijri.month.en} {data.hijri.year} H
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {prayerOrder.map((key) => {
                const isNext = key === next.key;
                return (
                  <div
                    key={key}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '13px 16px',
                      borderRadius: 16,
                      background: isNext ? 'var(--primary)' : 'var(--card)',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      {isNext && <div style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--accent)' }} />}
                      <span style={{ fontSize: 13.5, fontWeight: 700, color: isNext ? '#fff' : 'var(--ink)' }}>{prayerLabel[key]}</span>
                    </div>
                    <span style={{ fontSize: 14, fontWeight: 700, color: isNext ? '#fff' : 'var(--ink)' }}>{data.timings[key]}</span>
                  </div>
                );
              })}
            </div>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, padding: '14px 16px', borderRadius: 18, border: '1px solid var(--border)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{ width: 36, height: 36, borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, background: 'var(--mint)' }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--primary)">
                    <path d="M12 2a6 6 0 0 0-6 6v3.09c0 .58-.2 1.14-.57 1.59L4 15h16l-1.43-2.32a2.6 2.6 0 0 1-.57-1.59V8a6 6 0 0 0-6-6Z" strokeWidth="1.6" strokeLinejoin="round" />
                  </svg>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                  <span style={{ fontSize: 13, fontWeight: 700 }}>Notifikasi Adzan</span>
                  <span style={{ fontSize: 11, color: 'var(--muted)' }}>
                    {enabled ? `Aktif untuk ${next.label} berikutnya` : 'Nonaktif'}
                  </span>
                </div>
              </div>
              <button
                onClick={toggle}
                style={{
                  width: 42,
                  height: 24,
                  borderRadius: 999,
                  padding: 2,
                  display: 'flex',
                  justifyContent: enabled ? 'flex-end' : 'flex-start',
                  flexShrink: 0,
                  background: enabled ? 'var(--primary)' : 'var(--border)',
                  border: 'none',
                  cursor: 'pointer',
                }}
                aria-label="Toggle notifikasi adzan"
              >
                <div style={{ width: 20, height: 20, borderRadius: '50%', background: '#fff' }} />
              </button>
            </div>

            <Link
              to="/jadwal-sholat/adzan"
              style={{ textDecoration: 'none', color: 'inherit', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, padding: '14px 16px', borderRadius: 18, border: '1px solid var(--border)' }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{ width: 36, height: 36, borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, background: 'var(--cream)' }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--gold-ink)">
                    <path d="M11 5 6 9H3v6h3l5 4V5Z" strokeWidth="1.6" strokeLinejoin="round" />
                    <path d="M15.5 9a4.5 4.5 0 0 1 0 6" strokeWidth="1.6" strokeLinecap="round" />
                  </svg>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                  <span style={{ fontSize: 13, fontWeight: 700 }}>Suara Adzan</span>
                  <span style={{ fontSize: 11, color: 'var(--muted)' }}>{adzanSound}</span>
                </div>
              </div>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--muted)"><path d="m9 6 6 6-6 6" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg>
            </Link>
          </>
        )}

        {status === 'loading' && (
          <div className="center" style={{ minHeight: 200 }}>
            <div className="spinner" />
          </div>
        )}
      </div>
      <BottomNav />
    </div>
  );
}
