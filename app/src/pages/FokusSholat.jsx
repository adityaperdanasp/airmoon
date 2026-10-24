import { useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useQibla } from '../lib/useQibla';
import { hapticSuccess } from '../lib/haptics';

// Mode Fokus Sholat: layar penuh yang tenang. Menahan toast dan pengingat di
// dalam aplikasi, menjaga layar tetap menyala, dan menampilkan arah kiblat
// serta pintasan ke panduan bacaan. Tidak bisa menahan notifikasi sistem HP
// (itu pengaturan Jangan Ganggu di HP), jadi ada pengingat soal itu di sini.
const DURATION_MIN = 15;

function fmt(ms) {
  const s = Math.max(0, Math.round(ms / 1000));
  return `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`;
}

export default function FokusSholat() {
  const navigate = useNavigate();
  const { qibla, heading, headingStatus, requestHeadingPermission, locStatus } = useQibla();
  const [endsAt, setEndsAt] = useState(null);
  const [now, setNow] = useState(() => Date.now());
  const wake = useRef(null);
  const active = endsAt !== null;
  const remaining = active ? endsAt - now : 0;
  const finished = active && remaining <= 0;

  useEffect(() => {
    if (!active) return undefined;
    const id = setInterval(() => setNow(Date.now()), 500);
    return () => clearInterval(id);
  }, [active]);

  // Mute in-app toasts + keep the screen awake while focusing.
  useEffect(() => {
    if (!active) return undefined;
    document.documentElement.dataset.focusMode = '1';
    (async () => {
      try {
        if ('wakeLock' in navigator) wake.current = await navigator.wakeLock.request('screen');
      } catch {
        // Wake lock refused (battery saver, background tab): not essential.
      }
    })();
    return () => {
      delete document.documentElement.dataset.focusMode;
      wake.current?.release?.().catch(() => {});
      wake.current = null;
    };
  }, [active]);

  useEffect(() => {
    if (finished) hapticSuccess();
  }, [finished]);

  const rotation = qibla && heading != null ? qibla.bearing - heading : qibla ? qibla.bearing : 0;

  return (
    <div
      className="screen"
      style={{ background: 'linear-gradient(170deg, #060a14, #0b1530 55%, #11223f)', color: '#f2f0e8', minHeight: '100dvh', ['--ink']: '#f2f0e8', ['--muted']: '#b3b9c9', ['--border']: 'rgba(255,255,255,0.16)' }}
    >
      <div className="screen-content" style={{ alignItems: 'center', justifyContent: 'center', gap: 22, textAlign: 'center' }}>
        <button
          onClick={() => navigate(-1)}
          aria-label="Kembali"
          style={{ position: 'absolute', top: 'calc(18px + env(safe-area-inset-top))', left: 18, background: 'rgba(255,255,255,0.12)', border: 'none', color: '#fff', width: 38, height: 38, borderRadius: '50%', cursor: 'pointer', fontSize: 18 }}
        >
          ←
        </button>

        <span style={{ fontSize: 11, letterSpacing: '0.18em', textTransform: 'uppercase', color: '#e8b84b', fontWeight: 700 }}>Mode Fokus Sholat</span>

        <div style={{ position: 'relative', width: 230, height: 230, borderRadius: '50%', border: '1.5px solid rgba(232,184,75,0.4)', background: 'radial-gradient(circle, rgba(232,184,75,0.12), transparent 70%)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          {locStatus === 'ready' ? (
            <div style={{ position: 'absolute', inset: 0, transform: `rotate(${rotation}deg)`, transition: 'transform 0.3s ease-out' }}>
              <svg viewBox="0 0 230 230" width="230" height="230" aria-label="Arah kiblat">
                <path d="M115 22 L127 62 L115 54 L103 62 Z" fill="#e8b84b" />
                <line x1="115" y1="62" x2="115" y2="120" stroke="#e8b84b" strokeWidth="2.4" strokeLinecap="round" opacity="0.7" />
                <circle cx="115" cy="120" r="5" fill="#e8b84b" />
              </svg>
            </div>
          ) : (
            <span style={{ fontSize: 12, color: 'var(--muted)', padding: 30 }}>{locStatus === 'denied' ? 'Izinkan lokasi untuk melihat arah kiblat.' : 'Mencari arah kiblat…'}</span>
          )}
          {active && locStatus === 'ready' && (
            <span style={{ position: 'absolute', bottom: 38, fontSize: 30, fontWeight: 700, fontVariantNumeric: 'tabular-nums' }}>{finished ? '00:00' : fmt(remaining)}</span>
          )}
        </div>

        {headingStatus === 'needs-permission' && (
          <button className="btn-outline" style={{ width: 'auto', padding: '9px 18px', color: '#fff', background: 'transparent', borderColor: 'rgba(255,255,255,0.3)' }} onClick={requestHeadingPermission}>
            Aktifkan kompas
          </button>
        )}
        {qibla && <span style={{ fontSize: 12, color: 'var(--muted)' }}>Arah kiblat {Math.round(qibla.bearing)}° dari utara · {Math.round(qibla.distanceKm).toLocaleString('id-ID')} km ke Ka'bah</span>}

        {!active ? (
          <>
            <p style={{ margin: 0, fontSize: 12.5, lineHeight: 1.6, color: 'var(--muted)', maxWidth: 300 }}>
              Layar tetap menyala dan pengingat di dalam aplikasi dimatikan selama {DURATION_MIN} menit. Agar notifikasi HP lain tidak masuk, nyalakan mode "Jangan Ganggu" di HP kamu.
            </p>
            <button className="btn" style={{ background: '#e8b84b', color: '#2b1d05', maxWidth: 280 }} onClick={() => { setNow(Date.now()); setEndsAt(Date.now() + DURATION_MIN * 60000); }}>
              Mulai Fokus
            </button>
            <Link to="/lainnya/panduan-sholat" style={{ color: '#e8b84b', fontSize: 12.5, fontWeight: 700, textDecoration: 'none' }}>Lihat panduan bacaan sholat ›</Link>
          </>
        ) : (
          <>
            <p style={{ margin: 0, fontSize: 13, lineHeight: 1.6, color: 'var(--muted)', maxWidth: 300 }}>
              {finished ? 'Waktu fokus selesai. Semoga sholatmu diterima.' : 'Hadapkan dirimu ke arah panah. Tenang, kamu tidak sedang terburu-buru.'}
            </p>
            <button className="btn-outline" style={{ width: 'auto', padding: '11px 24px', color: '#fff', background: 'transparent', borderColor: 'rgba(255,255,255,0.35)' }} onClick={() => setEndsAt(null)}>
              {finished ? 'Selesai' : 'Akhiri lebih awal'}
            </button>
          </>
        )}
      </div>
    </div>
  );
}
