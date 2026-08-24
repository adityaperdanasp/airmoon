import { useEffect, useMemo, useState } from 'react';
import { getLocation } from '../lib/prayerApi';
import { fetchNearbyMosques, haversineKm } from '../lib/mosqueApi';
import TopBar from '../components/TopBar';
import { IconSearch } from '../components/icons';

export default function CariMasjid() {
  const [status, setStatus] = useState('loading');
  const [origin, setOrigin] = useState(null);
  const [mosques, setMosques] = useState([]);
  const [query, setQuery] = useState('');

  useEffect(() => {
    (async () => {
      try {
        const loc = await getLocation();
        setOrigin(loc);
        const list = await fetchNearbyMosques(loc.lat, loc.lng);
        setMosques(list.sort((a, b) => haversineKm(loc.lat, loc.lng, a.lat, a.lng) - haversineKm(loc.lat, loc.lng, b.lat, b.lng)));
        setStatus('ready');
      } catch (err) {
        setStatus(err.code === 1 ? 'denied' : 'error');
      }
    })();
  }, []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return mosques;
    return mosques.filter((m) => m.name.toLowerCase().includes(q));
  }, [mosques, query]);

  return (
    <div className="screen">
      <div className="screen-content">
        <TopBar title="Cari Masjid" />

        <div className="input-row" style={{ borderRadius: 999 }}>
          <IconSearch style={{ color: 'var(--muted)' }} />
          <input placeholder="Cari nama masjid…" value={query} onChange={(e) => setQuery(e.target.value)} />
        </div>

        {status === 'loading' && <div className="center" style={{ minHeight: 200 }}><div className="spinner" /></div>}
        {status === 'denied' && <p className="state-msg">Izinkan akses lokasi buat cari masjid terdekat.</p>}
        {status === 'error' && <p className="state-msg">Gagal memuat data masjid. Coba lagi.</p>}

        {status === 'ready' && filtered.length === 0 && (
          <p className="state-msg">Belum ada masjid yang terdaftar di OpenStreetMap sekitar lokasi kamu.</p>
        )}

        {status === 'ready' && filtered.length > 0 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {filtered.map((m) => (
              <a
                key={m.id}
                href={`https://www.openstreetmap.org/?mlat=${m.lat}&mlon=${m.lng}#map=17/${m.lat}/${m.lng}`}
                target="_blank"
                rel="noreferrer"
                style={{ display: 'flex', alignItems: 'center', gap: 12, padding: 13, borderRadius: 16, background: 'var(--card)', textDecoration: 'none', color: 'inherit' }}
              >
                <div style={{ width: 42, height: 42, borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, background: 'var(--mint)' }}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--primary)"><path d="M12 21s-6.5-6.1-6.5-11A6.5 6.5 0 0 1 18.5 10c0 4.9-6.5 11-6.5 11Z" strokeWidth="1.7" strokeLinejoin="round" /></svg>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 2, flex: 1, minWidth: 0 }}>
                  <span style={{ fontSize: 13, fontWeight: 700 }}>{m.name}</span>
                  <span style={{ fontSize: 11, color: 'var(--muted)' }}>
                    {origin ? `${haversineKm(origin.lat, origin.lng, m.lat, m.lng).toFixed(1)} km` : ''}
                    {m.address ? ` · ${m.address}` : ''}
                  </span>
                </div>
              </a>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
