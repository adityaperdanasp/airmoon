import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import TopBar from '../components/TopBar';
import { IconSearch } from '../components/icons';
import { searchQuran } from '../lib/quranSearchApi';
import { getSearchHistory, addSearchTerm, clearSearchHistory } from '../lib/searchHistory';
import ErrorRetry from '../components/ErrorRetry';
import { Skeleton } from '../components/Skeleton';

const HISTORY_KEY = 'ayat';

export default function CariAyat() {
  const [q, setQ] = useState('');
  const [results, setResults] = useState(null); // null = no search run yet
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [history, setHistory] = useState([]);

  useEffect(() => setHistory(getSearchHistory(HISTORY_KEY)), []);

  async function doSearch(term) {
    if (!term) return;
    setLoading(true);
    setError('');
    try {
      setResults(await searchQuran(term));
      addSearchTerm(HISTORY_KEY, term);
      setHistory(getSearchHistory(HISTORY_KEY));
    } catch {
      setError('Gagal mencari ayat.');
      setResults(null);
    } finally {
      setLoading(false);
    }
  }

  function runSearch(e) {
    e.preventDefault();
    doSearch(q.trim());
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
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="card" style={{ display: 'flex', flexDirection: 'column', gap: 8, padding: 14 }}>
                <Skeleton width={70} height={16} radius={999} />
                <Skeleton width="90%" height={18} />
                <Skeleton width="60%" height={13} />
              </div>
            ))}
          </div>
        )}

        {error && <ErrorRetry message={error} onRetry={() => doSearch(q.trim())} />}

        {!loading && results?.length === 0 && (
          <p className="state-msg">Gak ketemu ayat yang cocok dengan "{q}".</p>
        )}

        {!loading && results === null && !error && (
          <>
            <p style={{ fontSize: 12.5, color: 'var(--muted)', textAlign: 'center', padding: '24px 12px 8px' }}>
              Ketik kata kunci (Bahasa Indonesia atau Arab) lalu tekan Enter untuk mencari di seluruh Al-Qur'an.
            </p>
            {history.length > 0 && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span className="section-label" style={{ color: 'var(--muted)', fontSize: 11, letterSpacing: '0.04em', textTransform: 'uppercase' }}>
                    Pencarian Terakhir
                  </span>
                  <button
                    onClick={() => {
                      clearSearchHistory(HISTORY_KEY);
                      setHistory([]);
                    }}
                    style={{ background: 'none', border: 'none', color: 'var(--muted)', fontSize: 11, textDecoration: 'underline', cursor: 'pointer', padding: 0 }}
                  >
                    Hapus
                  </button>
                </div>
                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                  {history.map((term) => (
                    <button
                      key={term}
                      onClick={() => {
                        setQ(term);
                        doSearch(term);
                      }}
                      style={{ padding: '7px 13px', borderRadius: 999, fontSize: 11.5, fontWeight: 600, border: '1px solid var(--border)', background: 'var(--card)', color: 'var(--ink)', cursor: 'pointer' }}
                    >
                      {term}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </>
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
