import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchChapters, fetchMushafPage, layoutPage, TOTAL_MUSHAF_PAGES } from '../lib/mushafApi';
import { IconBack } from '../components/icons';

// Same Bismillah text as Al-Fatihah's own first ayah, standard convention
// for rendering it as a separate banner line before a new surah — every
// surah's Bismillah is identical Uthmani text regardless of which surah
// follows it.
const BISMILLAH = 'بِسْمِ ٱللَّهِ ٱلرَّحْمَـٰنِ ٱلرَّحِيمِ';

function SurahBanner({ chapter }) {
  if (!chapter) return null;
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10, margin: '4px 0 10px' }}>
      <div
        style={{
          width: '100%',
          padding: '10px 16px',
          borderRadius: 10,
          border: '1.5px solid var(--gold-ink)',
          background: 'var(--cream)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 10,
        }}
      >
        <span style={{ fontSize: 10.5, fontWeight: 700, color: 'var(--gold-ink)' }}>
          {chapter.verses_count} ayat &middot; {chapter.revelation_place === 'makkah' ? 'Makkiyyah' : 'Madaniyyah'}
        </span>
        <span style={{ fontFamily: "'Amiri', serif", fontSize: 20, fontWeight: 700, color: 'var(--gold-ink)' }}>
          سُورَةُ {chapter.name_arabic}
        </span>
      </div>
      {chapter.bismillah_pre && (
        <div style={{ fontFamily: "'Amiri', serif", fontSize: 22, direction: 'rtl' }}>{BISMILLAH}</div>
      )}
    </div>
  );
}

function AyahEndMark({ text }) {
  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: 22,
        height: 22,
        borderRadius: '50%',
        border: '1px solid var(--gold-ink)',
        fontSize: 11,
        fontFamily: "'Amiri', serif",
        color: 'var(--gold-ink)',
        margin: '0 2px',
        verticalAlign: 'middle',
      }}
    >
      {text}
    </span>
  );
}

const BASE_LINE_FONT_SIZE = 26;
const MIN_LINE_FONT_SIZE = 15;

// Real Mushaf lines were composed to fill exactly one printed line at a
// fixed size — on a narrower screen the same line can overflow instead of
// wrapping (wrapping isn't an option, a mushaf line has to stay one line).
// Shrinks its own font-size until its content actually fits the container,
// rather than clipping or forcing a fixed size that only works on some
// screens/pages.
function MushafLine({ children, fontFamily, lineKey, fontReady }) {
  const ref = useRef(null);
  const [fontSize, setFontSize] = useState(BASE_LINE_FONT_SIZE);

  // lineKey (page+line number) is stable across re-renders even though
  // `children` is a brand-new JSX tree every render — resetting on
  // `children` instead would re-trigger the shrink loop constantly. Also
  // resets once the real page font finishes loading (fontReady flips
  // false->true): font-display: swap means the first several shrink passes
  // can run measured against the *fallback* font's metrics, settle there,
  // and then overflow again the moment the real (differently-spaced) font
  // swaps in with no further measurement triggered.
  useLayoutEffect(() => {
    setFontSize(BASE_LINE_FONT_SIZE);
  }, [lineKey, fontReady]);

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (el.scrollWidth > el.clientWidth && fontSize > MIN_LINE_FONT_SIZE) {
      setFontSize((s) => Math.max(MIN_LINE_FONT_SIZE, s - 0.5));
    }
  }, [fontSize, lineKey, fontReady]);

  return (
    <div
      ref={ref}
      style={{
        fontFamily,
        fontSize,
        lineHeight: 2.3,
        direction: 'rtl',
        textAlign: 'justify',
        textAlignLast: 'center',
        whiteSpace: 'nowrap',
        overflowX: 'hidden',
      }}
    >
      {children}
    </div>
  );
}

export default function MushafReader() {
  const { page: pageParam } = useParams();
  const navigate = useNavigate();
  const page = Math.min(TOTAL_MUSHAF_PAGES, Math.max(1, Number(pageParam) || 1));

  const [chapters, setChapters] = useState(null);
  const [verses, setVerses] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchChapters()
      .then(setChapters)
      .catch(() => setError('Gagal memuat data surat.'));
  }, []);

  useEffect(() => {
    setVerses(null);
    setError('');
    fetchMushafPage(page)
      .then(setVerses)
      .catch(() => setError('Gagal memuat halaman mushaf. Coba lagi.'));
  }, [page]);

  function goTo(n) {
    if (n < 1 || n > TOTAL_MUSHAF_PAGES) return;
    navigate(`/quran/mushaf/${n}`);
  }

  // Real Madani Mushaf typography, not an approximation: King Fahd Complex's
  // official per-page fonts (free-to-use, distribute-only license — see
  // lib/mushafApi.js) — one font file per page, each mapping the page's own
  // private-use glyph codes (the `text` field, not `text_uthmani`) to
  // pre-shaped word glyphs already positioned to fill the real printed line
  // exactly, which is how Quran.com's own site achieves pixel-true
  // justification instead of a browser-side approximation. Self-hosted under
  // public/fonts/mushaf/ (all 604 + the shared Bismillah font, ~47MB total,
  // fetched lazily one at a time as the reader pages through) rather than
  // hotlinked from raw.githubusercontent.com — that host sends a
  // `Content-Security-Policy: default-src 'none'; sandbox` response header
  // on every file it serves, which some browsers apply to the font resource
  // itself and refuse to use, silently falling back to tofu glyphs with no
  // console error. Confirmed real, not a one-off: reproduced consistently
  // before self-hosting fixed it.
  const pageFontFamily = `QCF_P${String(page).padStart(3, '0')}`;
  const pageFontUrl = `/fonts/mushaf/${pageFontFamily}.woff2`;

  // Registered via the Font Loading API directly (FontFace + document.fonts.add)
  // rather than a JSX <style>@font-face — that way `fontReady` only flips once
  // the browser has actually confirmed the font is loaded and usable, instead
  // of racing against whether the <style> tag happened to render first.
  const [fontReady, setFontReady] = useState(false);
  useEffect(() => {
    let cancelled = false;
    setFontReady(false);
    const face = new FontFace(pageFontFamily, `url(${pageFontUrl})`);
    face
      .load()
      .then((loaded) => {
        if (cancelled) return;
        document.fonts.add(loaded);
        setFontReady(true);
      })
      .catch(() => {
        if (!cancelled) setFontReady(true); // fall back to Amiri rather than block forever
      });
    return () => {
      cancelled = true;
    };
  }, [pageFontFamily, pageFontUrl]);

  const { lines, surahStarts } = verses ? layoutPage(verses) : { lines: new Map(), surahStarts: [] };
  const lineNumbers = [...lines.keys()].sort((a, b) => a - b);
  const juzNumber = verses?.[0]?.juz_number;
  const chapterById = (id) => chapters?.find((c) => c.id === id);
  // Page header shows every surah that actually starts or continues on this
  // page — usually one, occasionally two when a page spans a surah boundary.
  const chapterIdsOnPage = verses ? [...new Set(verses.map((v) => Number(v.verse_key.split(':')[0])))] : [];
  const chapterNamesOnPage = chapterIdsOnPage.map((id) => chapterById(id)?.name_simple).filter(Boolean).join(' / ');

  return (
    <div className="screen">
      <div className="screen-content" style={{ paddingBottom: 130 }}>
        <div className="topbar">
          <button className="icon-btn" onClick={() => navigate('/quran')} aria-label="Kembali">
            <IconBack />
          </button>
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <span className="title">{chapterNamesOnPage || 'Mushaf'}</span>
            <span style={{ fontSize: 10.5, color: 'var(--muted)' }}>
              {juzNumber ? `Juz ${juzNumber} · ` : ''}Halaman {page}
            </span>
          </div>
          <div className="icon-btn" style={{ visibility: 'hidden' }} />
        </div>

        {error && <p className="state-msg">{error}</p>}

        {!error && !verses && (
          <div className="center" style={{ minHeight: '50vh' }}>
            <div className="spinner" />
          </div>
        )}

        {verses && (
          <div
            style={{
              borderRadius: 18,
              border: '1.5px solid var(--border)',
              background: 'var(--card)',
              padding: '22px 18px',
              display: 'flex',
              flexDirection: 'column',
              gap: 4,
            }}
          >
            {lineNumbers.map((ln) => {
              const banner = surahStarts.find((s) => s.beforeLine === ln);
              return (
                <div key={ln}>
                  {banner && <SurahBanner chapter={chapterById(banner.chapterId)} />}
                  <MushafLine fontFamily={`'${pageFontFamily}', 'Amiri', serif`} lineKey={`${page}-${ln}`} fontReady={fontReady}>
                    {lines.get(ln).map((w, i) =>
                      w.char_type_name === 'end' ? (
                        <AyahEndMark key={i} text={w.text_uthmani} />
                      ) : (
                        <span key={i}>{w.code_v1} </span>
                      )
                    )}
                  </MushafLine>
                </div>
              );
            })}
          </div>
        )}

        {verses && (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
            <button className="btn-outline" style={{ width: 'auto', padding: '10px 18px' }} onClick={() => goTo(page - 1)} disabled={page <= 1}>
              &larr; Sebelumnya
            </button>
            <span style={{ fontSize: 12, color: 'var(--muted)' }}>{page} / {TOTAL_MUSHAF_PAGES}</span>
            <button className="btn-outline" style={{ width: 'auto', padding: '10px 18px' }} onClick={() => goTo(page + 1)} disabled={page >= TOTAL_MUSHAF_PAGES}>
              Selanjutnya &rarr;
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
