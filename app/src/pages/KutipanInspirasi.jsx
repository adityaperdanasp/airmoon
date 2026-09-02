import { useEffect, useState } from 'react';
import { useLang } from '../context/LangContext';
import { fetchQuoteByIndex, todaysQuoteIndex } from '../lib/quotesApi';
import { QUOTE_REFS } from '../data/quoteRefs';
import TopBar from '../components/TopBar';
import ErrorRetry from '../components/ErrorRetry';

export default function KutipanInspirasi() {
  const { lang } = useLang();
  const [idx, setIdx] = useState(todaysQuoteIndex());
  const [quote, setQuote] = useState(null);
  const [error, setError] = useState('');
  const [retryTick, setRetryTick] = useState(0);

  useEffect(() => {
    setQuote(null);
    setError('');
    fetchQuoteByIndex(idx)
      .then(setQuote)
      .catch(() => setError(lang === 'en' ? 'Failed to load the quote.' : 'Gagal memuat kutipan.'));
  }, [idx, retryTick]);

  async function handleShare() {
    if (!quote) return;
    const text = `"${quote[lang]}" — ${quote.source}`;
    if (navigator.share) await navigator.share({ text, title: 'Kutipan dari airmoon' });
    else await navigator.clipboard.writeText(text);
  }

  return (
    <div className="screen">
      <div className="screen-content">
        <TopBar title={lang === 'en' ? 'Daily Quote' : 'Kutipan Inspirasi'} subtitle={lang === 'en' ? '100 quotes, one new each day' : '100 kutipan, gonta-ganti tiap hari'} />

        {error && <ErrorRetry message={error} onRetry={() => setRetryTick((n) => n + 1)} />}

        {!quote && !error && (
          <div className="center" style={{ minHeight: 260 }}>
            <div className="spinner" />
          </div>
        )}

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
                gap: 18,
                textAlign: 'center',
                background: `linear-gradient(160deg, var(--primary), var(--primary-dark))`,
                minHeight: 300,
                justifyContent: 'center',
              }}
            >
              <span style={{ fontFamily: "'Amiri', serif", fontSize: 26, lineHeight: 1.9, color: '#fff', direction: 'rtl' }}>
                {quote.arabic}
              </span>
              <span style={{ fontSize: 13.5, lineHeight: 1.6, color: 'rgba(255,255,255,0.85)', fontStyle: 'italic' }}>
                "{quote[lang]}"
              </span>
              <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--accent)' }}>{quote.source}</span>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, flexWrap: 'wrap' }}>
              <span style={{ fontSize: 11, color: 'var(--muted)' }}>
                {lang === 'en' ? `Quote ${idx + 1} of ${QUOTE_REFS.length}` : `Kutipan ke-${idx + 1} dari ${QUOTE_REFS.length}`}
              </span>
            </div>

            <div style={{ display: 'flex', gap: 10 }}>
              <button className="btn-outline" onClick={() => setIdx((i) => (i + 1) % QUOTE_REFS.length)}>
                {lang === 'en' ? 'Next' : 'Berikutnya'}
              </button>
              <button className="btn" onClick={handleShare}>
                {lang === 'en' ? 'Share' : 'Bagikan'}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
