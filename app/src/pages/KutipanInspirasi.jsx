import { useEffect, useState } from 'react';
import { useLang } from '../context/LangContext';
import { useTheme } from '../context/ThemeContext';
import { fetchQuoteByIndex, todaysQuoteIndex } from '../lib/quotesApi';
import { QUOTE_REFS } from '../data/quoteRefs';
import { DECORATIVE_PHOTOS_LIGHT, DECORATIVE_PHOTOS_DARK } from '../data/photos';
import TopBar from '../components/TopBar';
import ErrorRetry from '../components/ErrorRetry';
import { SkeletonCard } from '../components/Skeleton';
import { shareText } from '../lib/share';

export default function KutipanInspirasi() {
  const { lang } = useLang();
  const { theme } = useTheme();
  const [idx, setIdx] = useState(todaysQuoteIndex());
  const [quote, setQuote] = useState(null);
  const [error, setError] = useState('');
  const [retryTick, setRetryTick] = useState(0);
  // "Berikutnya" already let someone reach every quote by tapping through
  // sequentially, but there was no way to actually see the other 99 at a
  // glance or jump straight to one — this grid is the real "jelajah
  // semua" view.
  const [browsing, setBrowsing] = useState(false);

  useEffect(() => {
    setQuote(null);
    setError('');
    fetchQuoteByIndex(idx)
      .then(setQuote)
      .catch(() => setError(lang === 'en' ? 'Failed to load the quote.' : 'Gagal memuat kutipan.'));
  }, [idx, retryTick]);

  async function handleShare() {
    if (!quote) return;
    await shareText({ text: `"${quote[lang]}" — ${quote.source}`, title: 'Kutipan dari airmoon' });
  }

  const photoPool = theme === 'dark' ? DECORATIVE_PHOTOS_DARK : DECORATIVE_PHOTOS_LIGHT;

  return (
    <div className="screen">
      <div className="screen-content">
        <TopBar
          title={lang === 'en' ? 'Daily Quote' : 'Kutipan Inspirasi'}
          subtitle={lang === 'en' ? '100 quotes, one new each day' : '100 kutipan, gonta-ganti tiap hari'}
          right={
            <button className="icon-btn" onClick={() => setBrowsing((v) => !v)} aria-label="Jelajah semua kutipan" title="Jelajah semua kutipan">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <rect x="3" y="3" width="7" height="7" rx="1.5" strokeWidth="1.6" />
                <rect x="14" y="3" width="7" height="7" rx="1.5" strokeWidth="1.6" />
                <rect x="3" y="14" width="7" height="7" rx="1.5" strokeWidth="1.6" />
                <rect x="14" y="14" width="7" height="7" rx="1.5" strokeWidth="1.6" />
              </svg>
            </button>
          }
        />

        {browsing && (
          <div className="card" style={{ padding: 14, display: 'flex', flexWrap: 'wrap', gap: 6 }}>
            {QUOTE_REFS.map((_, i) => (
              <button
                key={i}
                onClick={() => {
                  setIdx(i);
                  setBrowsing(false);
                }}
                style={{
                  width: 30,
                  height: 30,
                  borderRadius: 8,
                  fontSize: 10.5,
                  fontWeight: 700,
                  border: i === idx ? 'none' : '1px solid var(--border)',
                  background: i === idx ? 'var(--primary)' : 'var(--card)',
                  color: i === idx ? 'var(--on-primary)' : 'var(--muted)',
                  cursor: 'pointer',
                }}
              >
                {i + 1}
              </button>
            ))}
          </div>
        )}

        {error && <ErrorRetry message={error} onRetry={() => setRetryTick((n) => n + 1)} />}

        {!quote && !error && <SkeletonCard height={300} radius={24} />}

        {quote && (
          <>
            <div
              style={{
                position: 'relative',
                overflow: 'hidden',
                borderRadius: 24,
                padding: '32px 26px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                minHeight: 300,
              }}
            >
              {/* A real photo backdrop instead of a flat gradient —
                  data/photos.js's wider decorative pool (theme-aware, one
                  per idx so browsing "Next" through quotes also cycles the
                  backdrop) rather than a dedicated quote-only photo set.
                  Same brand-tinted overlay gradient + opacity values
                  Home.jsx's own header photo already uses for both
                  themes, so this reads as "this app's card", not a stock
                  photo with text pasted on top. */}
              <img
                src={photoPool[idx % photoPool.length]}
                alt=""
                style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }}
              />
              <div
                style={{
                  position: 'absolute',
                  inset: 0,
                  background:
                    theme === 'dark'
                      ? 'linear-gradient(160deg, rgba(11,12,10,0.55) 0%, rgba(11,12,10,0.88) 100%)'
                      : 'linear-gradient(160deg, rgba(13,77,71,0.62) 0%, rgba(13,77,71,0.85) 100%)',
                }}
              />
              <div style={{ position: 'relative', zIndex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 18, textAlign: 'center' }}>
                <span style={{ fontFamily: "'Amiri', serif", fontSize: 26, lineHeight: 1.9, color: '#fff', direction: 'rtl' }}>
                  {quote.arabic}
                </span>
                <span style={{ fontSize: 13.5, lineHeight: 1.6, color: 'rgba(255,255,255,0.85)', fontStyle: 'italic' }}>
                  "{quote[lang]}"
                </span>
                <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--accent)' }}>{quote.source}</span>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, flexWrap: 'wrap' }}>
              <span style={{ fontSize: 11, color: 'var(--muted)' }}>
                {lang === 'en' ? `Quote ${idx + 1} of ${QUOTE_REFS.length}` : `Kutipan ke-${idx + 1} dari ${QUOTE_REFS.length}`}
              </span>
            </div>

            <div style={{ display: 'flex', gap: 10 }}>
              <button className="btn-outline" style={{ flex: 'none', padding: '0 16px' }} onClick={() => setIdx((i) => (i - 1 + QUOTE_REFS.length) % QUOTE_REFS.length)} aria-label={lang === 'en' ? 'Previous' : 'Sebelumnya'}>
                ←
              </button>
              <button className="btn-outline" style={{ flex: 1 }} onClick={() => setIdx((i) => (i + 1) % QUOTE_REFS.length)}>
                {lang === 'en' ? 'Next' : 'Berikutnya'}
              </button>
              <button className="btn" style={{ flex: 1 }} onClick={handleShare}>
                {lang === 'en' ? 'Share' : 'Bagikan'}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
