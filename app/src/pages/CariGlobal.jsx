import { useState } from 'react';
import { Link } from 'react-router-dom';
import { IconSearch } from '../components/icons';
import { searchAll } from '../lib/globalSearch';
import { Skeleton } from '../components/Skeleton';
import PageHeaderPhoto from '../components/PageHeaderPhoto';
import { PAGE_PHOTOS } from '../data/photos';

const CATEGORY_LABEL = { pagi: 'Dzikir Pagi', petang: 'Dzikir Petang', kegiatan: 'Doa Kegiatan' };

function SectionLabel({ children }) {
  return (
    <span className="section-label" style={{ color: 'var(--muted)', fontSize: 11, letterSpacing: '0.04em', textTransform: 'uppercase' }}>
      {children}
    </span>
  );
}

// One search box across the app's content, not just ayat (Cari Ayat) or
// surah names (SurahList's local filter) — before this there was no way
// to find, say, "sabar" across Asmaul Husna's meanings or a specific
// dzikir's title without knowing exactly which page it lived on.
export default function CariGlobal() {
  const [q, setQ] = useState('');
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);

  async function runSearch(e) {
    e.preventDefault();
    const term = q.trim();
    if (!term) return;
    setLoading(true);
    try {
      setResults(await searchAll(term));
    } finally {
      setLoading(false);
    }
  }

  const totalResults = results ? results.ayat.length + results.asmaulHusna.length + results.doa.length : 0;

  return (
    <div className="screen">
      <div className="screen-content">
        <PageHeaderPhoto title="Cari" photo={PAGE_PHOTOS.cariGlobal} subtitle="Cari di seluruh konten airmoon" />

        <form onSubmit={runSearch} className="input-row" style={{ borderRadius: 999 }}>
          <IconSearch style={{ color: 'var(--muted)' }} />
          <input
            placeholder="Ayat, Asmaul Husna, doa harian…"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            autoFocus
          />
        </form>

        {loading && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} height={48} radius={14} />
            ))}
          </div>
        )}

        {!loading && results && totalResults === 0 && (
          <p className="state-msg">Gak ketemu apa-apa buat "{q}".</p>
        )}

        {!loading && results === null && (
          <p style={{ fontSize: 12.5, color: 'var(--muted)', textAlign: 'center', padding: '24px 12px' }}>
            Ketik kata kunci lalu tekan Enter — nyari di ayat Qur'an, Asmaul Husna, dan Doa Harian sekaligus.
          </p>
        )}

        {!loading && results && results.ayat.length > 0 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <SectionLabel>Ayat Qur'an</SectionLabel>
            {results.ayat.map((r) => (
              <Link
                key={r.verseKey}
                to={`/quran/${r.chapter}?ayat=${r.verse}`}
                className="card"
                style={{ display: 'flex', flexDirection: 'column', gap: 6, padding: 12, textDecoration: 'none', color: 'inherit' }}
              >
                <span style={{ fontSize: 10.5, fontWeight: 700, color: 'var(--primary)' }}>QS. {r.chapter} : {r.verse}</span>
                <p style={{ margin: 0, fontSize: 12, lineHeight: 1.5, color: 'var(--muted)' }}>{r.translation}</p>
              </Link>
            ))}
          </div>
        )}

        {!loading && results && results.asmaulHusna.length > 0 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <SectionLabel>Asmaul Husna</SectionLabel>
            <Link to="/lainnya/asmaul-husna" style={{ display: 'flex', flexDirection: 'column', gap: 8, textDecoration: 'none', color: 'inherit' }}>
              {results.asmaulHusna.map((n) => (
                <div key={n.no} className="card" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 10, padding: 12 }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    <span style={{ fontSize: 13, fontWeight: 700 }}>{n.latin}</span>
                    <span style={{ fontSize: 11, color: 'var(--muted)' }}>{n.meaning}</span>
                  </div>
                  <span style={{ fontFamily: "'Amiri', serif", fontSize: 18 }}>{n.arabic}</span>
                </div>
              ))}
            </Link>
          </div>
        )}

        {!loading && results && results.doa.length > 0 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <SectionLabel>Doa Harian</SectionLabel>
            <Link to="/lainnya/doa-harian" style={{ display: 'flex', flexDirection: 'column', gap: 8, textDecoration: 'none', color: 'inherit' }}>
              {results.doa.map((d, i) => (
                <div key={i} className="card" style={{ display: 'flex', flexDirection: 'column', gap: 4, padding: 12 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span style={{ fontSize: 13, fontWeight: 700 }}>{d.title}</span>
                    <span style={{ fontSize: 9.5, fontWeight: 700, padding: '2px 7px', borderRadius: 999, background: 'var(--mint)', color: 'var(--primary)' }}>
                      {CATEGORY_LABEL[d.category]}
                    </span>
                  </div>
                  <p style={{ margin: 0, fontSize: 11.5, lineHeight: 1.5, color: 'var(--muted)' }}>{d.translation}</p>
                </div>
              ))}
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
