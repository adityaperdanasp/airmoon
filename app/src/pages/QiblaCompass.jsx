import { useState } from 'react';
import { useLang } from '../context/LangContext';
import { useQibla } from '../lib/useQibla';
import TopBar from '../components/TopBar';

function LocationSearch({ onPick, onUseGps, onClose }) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState(null);
  const [searching, setSearching] = useState(false);
  const [error, setError] = useState('');

  async function handleSearch(e) {
    e.preventDefault();
    if (!query.trim()) return;
    setSearching(true);
    setError('');
    try {
      const res = await fetch(`https://airmoon.vercel.app/api/geocode-search?q=${encodeURIComponent(query.trim())}`);
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Gagal mencari lokasi.');
      setResults(data.results);
    } catch (err) {
      setError(err.message);
    } finally {
      setSearching(false);
    }
  }

  return (
    <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: 10, padding: 16 }}>
      <form onSubmit={handleSearch} style={{ display: 'flex', gap: 8 }}>
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Cari kota atau tempat…"
          autoFocus
          style={{ flex: 1, padding: '10px 12px', borderRadius: 12, border: '1px solid var(--border)', background: 'var(--bg)', color: 'var(--ink)', fontSize: 13.5 }}
        />
        <button className="btn" type="submit" disabled={searching} style={{ padding: '0 16px', opacity: searching ? 0.6 : 1 }}>
          {searching ? '...' : 'Cari'}
        </button>
      </form>

      {error && <span style={{ fontSize: 11.5, color: '#c0392b' }}>{error}</span>}

      {results && results.length === 0 && (
        <span style={{ fontSize: 12, color: 'var(--muted)', textAlign: 'center' }}>Ga ketemu, coba nama lain.</span>
      )}

      {results && results.length > 0 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          {results.map((r, i) => (
            <button
              key={i}
              onClick={() => onPick(r)}
              style={{
                textAlign: 'left',
                padding: '10px 12px',
                borderRadius: 10,
                border: 'none',
                background: 'var(--bg)',
                color: 'var(--ink)',
                fontSize: 12.5,
                cursor: 'pointer',
              }}
            >
              📍 {r.label}
            </button>
          ))}
        </div>
      )}

      <div style={{ display: 'flex', gap: 8 }}>
        <button className="btn-outline" style={{ flex: 1 }} onClick={onUseGps}>Pakai Lokasi Saat Ini</button>
        <button className="btn-outline" style={{ flex: 1 }} onClick={onClose}>Batal</button>
      </div>
    </div>
  );
}

export default function QiblaCompass() {
  const { t } = useLang();
  const { locStatus, qibla, heading, headingAccuracy, headingStatus, requestHeadingPermission, override, setOverride } = useQibla();
  const [searchOpen, setSearchOpen] = useState(false);

  const hasHeading = headingStatus === 'granted' && heading != null;
  // 0deg = arrow points straight up on screen. When the arrow points up,
  // the phone's top edge is aimed at the Kaaba.
  const needleRotation = qibla ? (hasHeading ? qibla.bearing - heading : qibla.bearing) : 0;

  // webkitCompassAccuracy (iOS Safari only) is the one real sensor-quality
  // signal available from the web — under ~15° is considered good per
  // Apple's own guidance. No equivalent exists on Android/desktop browsers,
  // so this whole status row simply doesn't render there rather than
  // showing a fabricated "reliable" claim with no real data behind it.
  const accuracyGood = headingAccuracy != null && headingAccuracy <= 15;

  return (
    <div className="screen">
      <div className="screen-content">
        <TopBar title={t('kiblat_title')} />

        {locStatus === 'loading' && (
          <div className="center" style={{ minHeight: 240 }}>
            <div className="spinner" />
          </div>
        )}

        {locStatus === 'denied' && (
          <div className="card" style={{ padding: 16, fontSize: 12.5, lineHeight: 1.5 }}>
            {t('kiblat_loc_denied')}
          </div>
        )}

        {locStatus === 'error' && (
          <div className="card" style={{ padding: 16, fontSize: 12.5, lineHeight: 1.5 }}>
            {t('kiblat_loc_error')}
          </div>
        )}

        {locStatus === 'ready' && qibla && (
          <>
            <button
              onClick={() => setSearchOpen((v) => !v)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                padding: '11px 14px',
                borderRadius: 999,
                border: '1px solid var(--border)',
                background: 'var(--card)',
                color: 'var(--ink)',
                fontSize: 12.5,
                fontWeight: 600,
                cursor: 'pointer',
                alignSelf: 'center',
              }}
            >
              📍 {override ? override.label : 'Lokasi Saat Ini (GPS)'}
              <span style={{ color: 'var(--muted)' }}>{searchOpen ? '▲' : '▼'}</span>
            </button>

            {searchOpen && (
              <LocationSearch
                onPick={(loc) => { setOverride(loc); setSearchOpen(false); }}
                onUseGps={() => { setOverride(null); setSearchOpen(false); }}
                onClose={() => setSearchOpen(false)}
              />
            )}

            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 20,
                padding: '28px 0',
                borderRadius: 28,
                background: 'radial-gradient(circle at 50% 30%, var(--mint-soft), var(--bg) 72%)',
              }}
            >
              <span style={{ fontSize: 30, filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.25))' }}>🕋</span>

              <div style={{ position: 'relative', width: 280, height: 280 }}>
                <svg width="280" height="280" viewBox="0 0 280 280">
                  <defs>
                    <radialGradient id="qibla-ring" cx="50%" cy="50%" r="50%">
                      <stop offset="55%" stopColor="var(--card)" />
                      <stop offset="100%" stopColor="var(--mint)" />
                    </radialGradient>
                  </defs>
                  <circle cx="140" cy="140" r="115" fill="none" stroke="var(--gold-ink)" strokeWidth="2" opacity="0.55" />
                  <circle cx="140" cy="140" r="104" fill="url(#qibla-ring)" stroke="var(--border)" strokeWidth="1" />
                  {Array.from({ length: 24 }).map((_, i) => {
                    const a = (i * 15 * Math.PI) / 180;
                    const isCardinal = i % 6 === 0;
                    const r1 = isCardinal ? 82 : 92;
                    const x1 = 140 + r1 * Math.sin(a);
                    const y1 = 140 - r1 * Math.cos(a);
                    const x2 = 140 + 104 * Math.sin(a);
                    const y2 = 140 - 104 * Math.cos(a);
                    return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="var(--muted-soft)" strokeWidth={isCardinal ? 2 : 1} />;
                  })}
                </svg>

                {/* Cardinal ring — a thin outer ring with N/E/S/W that rotates
                    with -heading, so it always shows real compass directions
                    relative to the phone's current orientation (like a real
                    compass rose). Falls back to a fixed "up" (0deg) when
                    there's no live heading, matching the same no-heading
                    assumption the qibla needle already makes (screen-up =
                    north). Replaces the earlier single red North needle. */}
                <div
                  style={{
                    position: 'absolute',
                    inset: 0,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    transform: `rotate(${hasHeading ? -heading : 0}deg)`,
                    transition: 'transform 0.15s linear',
                  }}
                >
                  <svg width="280" height="280" viewBox="0 0 280 280">
                    <circle cx="140" cy="140" r="130" fill="none" stroke="var(--border)" strokeWidth="1.5" />
                    {Array.from({ length: 12 }).map((_, i) => {
                      if (i % 3 === 0) return null; // where a cardinal letter already sits
                      const a = (i * 30 * Math.PI) / 180;
                      const x1 = 140 + 122 * Math.sin(a);
                      const y1 = 140 - 122 * Math.cos(a);
                      const x2 = 140 + 130 * Math.sin(a);
                      const y2 = 140 - 130 * Math.cos(a);
                      return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="var(--muted-soft)" strokeWidth="1" />;
                    })}
                    {['N', 'E', 'S', 'W'].map((label, i) => {
                      const a = (i * 90 * Math.PI) / 180;
                      const x = 140 + 130 * Math.sin(a);
                      const y = 140 - 130 * Math.cos(a);
                      return (
                        <text
                          key={label}
                          x={x}
                          y={y}
                          textAnchor="middle"
                          dominantBaseline="central"
                          fontSize="13"
                          fontWeight="800"
                          fill={label === 'N' ? '#c0392b' : 'var(--muted)'}
                        >
                          {label}
                        </text>
                      );
                    })}
                  </svg>
                </div>

                {/* Qibla needle — points straight up on screen exactly when
                    the phone's top edge is physically aimed at the Kaaba. */}
                <div
                  style={{
                    position: 'absolute',
                    inset: 0,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    transform: `rotate(${needleRotation}deg)`,
                    transition: 'transform 0.15s linear',
                  }}
                >
                  <svg width="240" height="240" viewBox="0 0 240 240">
                    <path d="M120 44 L129 70 L120 61 L111 70 Z" fill="var(--accent)" stroke="var(--primary-dark)" strokeWidth="1" />
                    <line x1="120" y1="61" x2="120" y2="180" stroke="var(--primary)" strokeWidth="3" strokeLinecap="round" />
                    <circle cx="120" cy="120" r="9" fill="var(--primary)" stroke="var(--card)" strokeWidth="2" />
                  </svg>
                </div>
              </div>

              <div style={{ display: 'flex', gap: 16, fontSize: 11, color: 'var(--muted)' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                  <span style={{ width: 14, height: 3, borderRadius: 2, background: 'var(--accent)' }} />
                  Arah Kiblat
                </span>
                <span style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                  <span style={{ fontSize: 11, fontWeight: 800, color: '#c0392b' }}>N</span>
                  Arah Utara (ikut kompas)
                </span>
              </div>

              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: 32, fontWeight: 800, color: 'var(--primary)' }}>{Math.round(qibla.bearing)}°</div>
                <div style={{ fontSize: 12, color: 'var(--muted)', marginTop: 2 }}>
                  {t('kiblat_dari_utara')} · {Math.round(qibla.distanceKm).toLocaleString('id-ID')} km {t('kiblat_dari_kabah')}
                </div>
              </div>
            </div>

            {headingStatus === 'needs-permission' && (
              <button className="btn" onClick={requestHeadingPermission}>
                {t('kiblat_aktifkan_kompas')}
              </button>
            )}

            {headingStatus === 'denied' && (
              <div className="card" style={{ padding: 16, fontSize: 12.5, lineHeight: 1.5 }}>
                {t('kiblat_kompas_denied')}
              </div>
            )}

            {(headingStatus === 'unsupported' || (headingStatus === 'granted' && heading == null)) && (
              <div className="card" style={{ padding: 16, fontSize: 12.5, lineHeight: 1.5 }}>
                {t('kiblat_kompas_unsupported')}
              </div>
            )}

            {hasHeading && headingAccuracy != null && (
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '13px 14px', borderRadius: 14, background: 'var(--card)' }}>
                <span style={{ width: 8, height: 8, borderRadius: '50%', flexShrink: 0, background: accuracyGood ? '#2ecc71' : '#e67e22' }} />
                <span style={{ fontSize: 11.5, color: 'var(--muted)' }}>
                  {accuracyGood
                    ? 'Sensor kompas HP kamu cukup akurat.'
                    : 'Akurasi kompas kurang stabil — gerakkan HP membentuk angka 8 buat kalibrasi ulang.'}
                </span>
              </div>
            )}

            {hasHeading && (
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10, padding: '13px 14px', borderRadius: 14, background: 'var(--card)' }}>
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="var(--muted)" style={{ flexShrink: 0, marginTop: 1 }}>
                  <circle cx="12" cy="12" r="9" strokeWidth="1.6" />
                  <path d="M12 11v5.5M12 8v.01" strokeWidth="1.8" strokeLinecap="round" />
                </svg>
                <span style={{ fontSize: 11, lineHeight: 1.5, color: 'var(--muted)' }}>{t('kiblat_info')}</span>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
