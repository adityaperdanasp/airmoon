import { useState } from 'react';
import { loadSavedLocations, addSavedLocation, removeSavedLocation } from '../lib/savedLocations';

// Extracted from QiblaCompass.jsx (2026-09-04) so JadwalSholat.jsx can
// reuse the exact same "search a city, or fall back to GPS" flow instead
// of duplicating it — both pages need a manual location override for the
// same reason (traveling, checking another city, GPS unavailable indoors).
//
// Lokasi Favorit (2026-09-05) — a shared saved-locations list (not tied
// to either page's own override) so someone doesn't have to re-search
// "Rumah" or "Kampung Halaman" every single visit; tapping a favorite
// chip picks it immediately, same as tapping a fresh search result.
export default function LocationSearch({ onPick, onUseGps, onClose }) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState(null);
  const [searching, setSearching] = useState(false);
  const [error, setError] = useState('');
  const [saved, setSaved] = useState(loadSavedLocations);

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

  function toggleSaved(loc) {
    const existing = saved.find((l) => l.label === loc.label);
    setSaved(existing ? removeSavedLocation(existing.id) : addSavedLocation(loc));
  }

  return (
    <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: 10, padding: 16 }}>
      {saved.length > 0 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          <span style={{ fontSize: 10.5, fontWeight: 700, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.03em' }}>
            Lokasi Favorit
          </span>
          <div className="hide-scrollbar" style={{ display: 'flex', gap: 6, overflowX: 'auto' }}>
            {saved.map((loc) => (
              <button
                key={loc.id}
                onClick={() => onPick(loc)}
                style={{
                  flexShrink: 0,
                  padding: '8px 14px',
                  borderRadius: 999,
                  border: 'none',
                  background: 'var(--mint-soft)',
                  color: 'var(--ink)',
                  fontSize: 12,
                  fontWeight: 700,
                  cursor: 'pointer',
                  whiteSpace: 'nowrap',
                }}
              >
                ⭐ {loc.label}
              </button>
            ))}
          </div>
        </div>
      )}

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
          {results.map((r, i) => {
            const isSaved = saved.some((l) => l.label === r.label);
            return (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <button
                  onClick={() => onPick(r)}
                  style={{
                    flex: 1,
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
                <button
                  onClick={() => toggleSaved(r)}
                  aria-label={isSaved ? `Hapus ${r.label} dari favorit` : `Simpan ${r.label} sebagai favorit`}
                  style={{
                    flexShrink: 0,
                    width: 34,
                    height: 34,
                    borderRadius: 10,
                    border: 'none',
                    background: 'var(--bg)',
                    color: isSaved ? 'var(--gold-ink)' : 'var(--muted)',
                    fontSize: 15,
                    cursor: 'pointer',
                  }}
                >
                  {isSaved ? '⭐' : '☆'}
                </button>
              </div>
            );
          })}
        </div>
      )}

      <div style={{ display: 'flex', gap: 8 }}>
        <button className="btn-outline" style={{ flex: 1 }} onClick={onUseGps}>Pakai Lokasi Saat Ini</button>
        <button className="btn-outline" style={{ flex: 1 }} onClick={onClose}>Batal</button>
      </div>
    </div>
  );
}
