import { useState } from 'react';
import { Link } from 'react-router-dom';
import TopBar from '../components/TopBar';
import { IconSearch } from '../components/icons';
import { searchQuran } from '../lib/quranSearchApi';

export default function CariAyat() {
  const [q, setQ] = useState('');
  const [results, setResults] = useState(null); // null = no search run yet
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function runSearch(e) {
    e.preventDefault();
    const term = q.trim();
    if (!term) return;
    setLoading(true);
    setError('');
    try {
      setResults(await searchQuran(term));
    } catch {
      setError('Gagal mencari ayat. Coba lagi.');
      setResults(null);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="screen">
      <div className="screen-content">
        <TopBar title="Cari Ayat" subtitle="Cari isi ayat pakai kata kunci" />

        <form onSubmit={runSearch} className="input-row" style={{ borderRadius: 999 }}>
          <IconSearch style={{ color: 'var(--muted)' }} />
          <input
            placeholder="Contoh: sabar, rezeki, syukur…"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            autoFocus
          />
        </form>

        {loading && (
          <div className="center" style={{ minHeight: '30vh' }}>
            <div className="spinner" />
          </div>
        )}

        {error && <p className="state-msg">{error}</p>}

        {!loading && results?.length === 0 && (
          <p className="state-msg">Gak ketemu ayat yang cocok dengan "{q}".</p>
        )}

        {!loading && results === null && !error && (
          <p style={{ fontSize: 12.5, color: 'var(--muted)', textAlign: 'center', padding: '24px 12px' }}>
            Ketik kata kunci (Bahasa Indonesia atau Arab) lalu tekan Enter untuk mencari di seluruh Al-Qur'an.
          </p>
        )}

        {!loading && results?.length > 0 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {results.map((r) => (
              <Link
                key={r.verseKey}
                to={`/quran/${r.chapter}?ayat=${r.verse}`}
                className="card"
                style={{ display: 'flex', flexDirection: 'column', gap: 8, padding: 14, textDecoration: 'none', color: 'inherit' }}
              >
                <span
                  style={{
                    alignSelf: 'flex-start',
                    fontSize: 10.5,
                    fontWeight: 700,
                    padding: '3px 9px',
                    borderRadius: 999,
                    color: 'var(--primary)',
                    background: 'var(--mint)',
                  }}
                >
                  QS. {r.chapter} : {r.verse}
                </span>
                <div style={{ fontFamily: "'Amiri', serif", fontSize: 18, lineHeight: 1.8, direction: 'rtl', textAlign: 'right' }}>
                  {r.arabic}
                </div>
                <p style={{ margin: 0, fontSize: 12, lineHeight: 1.55, color: 'var(--muted)' }}>{r.translation}</p>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
