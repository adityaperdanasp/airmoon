import { useEffect, useMemo, useState } from 'react';
import { getLocation } from '../lib/prayerApi';
import { fetchNearbyMosques, haversineKm } from '../lib/mosqueApi';
import { useLang } from '../context/LangContext';
import PageHeaderPhoto from '../components/PageHeaderPhoto';
import { PAGE_PHOTOS } from '../data/photos';
import { IconSearch } from '../components/icons';
import ErrorRetry from '../components/ErrorRetry';

export default function CariMasjid() {
  const { t } = useLang();
  const [status, setStatus] = useState('loading');
  const [origin, setOrigin] = useState(null);
  const [mosques, setMosques] = useState([]);
  const [source, setSource] = useState(null);
  const [query, setQuery] = useState('');
  const [retryTick, setRetryTick] = useState(0);

  useEffect(() => {
    setStatus('loading');
    (async () => {
      try {
        const loc = await getLocation();
        setOrigin(loc);
        const { places, source: src } = await fetchNearbyMosques(loc.lat, loc.lng);
        setMosques(places.sort((a, b) => haversineKm(loc.lat, loc.lng, a.lat, a.lng) - haversineKm(loc.lat, loc.lng, b.lat, b.lng)));
        setSource(src);
        setStatus('ready');
      } catch (err) {
        setStatus(err.code === 1 ? 'denied' : 'error');
      }
    })();
  }, [retryTick]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return mosques;
    return mosques.filter((m) => m.name.toLowerCase().includes(q));
  }, [mosques, query]);

  return (
    <div className="screen">
      <div className="screen-content">
        <PageHeaderPhoto title="Cari Masjid" photo={PAGE_PHOTOS.cariMasjid} />

        <div className="input-row" style={{ borderRadius: 999 }}>
          <IconSearch style={{ color: 'var(--muted)' }} />
          <input placeholder={t('cari_masjid_placeholder')} value={query} onChange={(e) => setQuery(e.target.value)} />
        </div>

        {source === 'osm' && (
          <div style={{ padding: '9px 14px', borderRadius: 12, background: 'var(--cream)', fontSize: 11, color: 'var(--gold-ink-dark)' }}>
            {t('osm_fallback_banner_pre')} <code>GOOGLE_MAPS_API_KEY</code> {t('osm_fallback_banner_post')}
          </div>
        )}

        {status === 'loading' && <div className="center" style={{ minHeight: 200 }}><div className="spinner" /></div>}
        {status === 'denied' && <ErrorRetry message={t('loc_denied')} onRetry={() => setRetryTick((n) => n + 1)} />}
        {status === 'error' && <ErrorRetry message={t('loc_error')} onRetry={() => setRetryTick((n) => n + 1)} />}

        {status === 'ready' && filtered.length === 0 && (
          <p className="state-msg">{t('no_mosques')}</p>
        )}

        {status === 'ready' && filtered.length > 0 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {filtered.map((m) => (
              <div key={m.id} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: 13, borderRadius: 16, background: 'var(--card)' }}>
                <div style={{ width: 42, height: 42, borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, background: 'var(--mint)' }}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--primary)"><path d="M12 21s-6.5-6.1-6.5-11A6.5 6.5 0 0 1 18.5 10c0 4.9-6.5 11-6.5 11Z" strokeWidth="1.7" strokeLinejoin="round" /></svg>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 2, flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <span style={{ fontSize: 13, fontWeight: 700 }}>{m.name}</span>
                    {m.rating && (
                      <span style={{ display: 'flex', alignItems: 'center', gap: 2, fontSize: 10.5, fontWeight: 700, color: 'var(--gold-ink)' }}>
                        <svg width="10" height="10" viewBox="0 0 24 24" fill="var(--gold-ink)" stroke="none"><path d="M12 2.5 14 9l6.5.4-5.1 4.2 1.8 6.4L12 16.7 6.8 20l1.8-6.4L3.5 9.4 10 9 12 2.5Z" /></svg>
                        {m.rating}
                      </span>
                    )}
                  </div>
                  <span style={{ fontSize: 11, color: 'var(--muted)' }}>
                    {origin ? `${haversineKm(origin.lat, origin.lng, m.lat, m.lng).toFixed(1)} km` : ''}
                    {m.address ? ` · ${m.address}` : ''}
                  </span>
                </div>
                <a
                  href={
                    origin
                      ? `https://www.google.com/maps/dir/?api=1&origin=${origin.lat},${origin.lng}&destination=${m.lat},${m.lng}&travelmode=walking`
                      : `https://www.google.com/maps/search/?api=1&query=${m.lat},${m.lng}`
                  }
                  target="_blank"
                  rel="noreferrer"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: 38,
                    height: 38,
                    borderRadius: '50%',
                    flexShrink: 0,
                    background: 'var(--primary)',
                    textDecoration: 'none',
                  }}
                  aria-label={t('buka_arah_aria')}
                >
                  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="var(--on-primary)">
                    <path d="M3 11 20 4l-7 17-3-7-7-3Z" strokeWidth="1.7" strokeLinejoin="round" />
                  </svg>
                </a>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
