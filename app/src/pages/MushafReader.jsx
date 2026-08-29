import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { useAuth } from '../context/AuthContext';
import { fetchChapters, fetchMushafPage, layoutPage, TOTAL_MUSHAF_PAGES, TAJWEED_COLORS, parseTajweedHtml } from '../lib/mushafApi';
import { fetchSurahDetail } from '../lib/quranApi';
import { useNightMode, NIGHT_STYLE_VARS } from '../lib/readingPrefs';
import { IconBack } from '../components/icons';

// Same Bismillah text as Al-Fatihah's own first ayah, standard convention
// for rendering it as a separate banner line before a new surah — every
// surah's Bismillah is identical Uthmani text regardless of which surah
// follows it.
const BISMILLAH = 'بِسْمِ ٱللَّهِ ٱلرَّحْمَـٰنِ ٱلرَّحِيمِ';

// A pointed-end ribbon/cartouche shape ("unwan" in classical manuscript
// terms) via CSS clip-path, not a hand-drawn illustration — a generic,
// centuries-old Quran page convention (most printed Mushaf editions use
// some variant of this), not specific artwork copied from any one app.
const RIBBON_CLIP = 'polygon(0% 50%, 3% 0%, 97% 0%, 100% 50%, 97% 100%, 3% 100%)';

function SurahBanner({ chapter }) {
  if (!chapter) return null;
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10, margin: '10px 0 14px' }}>
      <div
        style={{
          width: '100%',
          padding: '12px 30px',
          clipPath: RIBBON_CLIP,
          background: 'linear-gradient(180deg, var(--cream), var(--card))',
          border: '1.5px solid var(--gold-ink)',
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

// A stepped double-bracket hugging each corner plus a small diamond accent
// where the two arms meet — a geometric strapwork motif (nested right-angle
// lines), the same family of ornament as classical Islamic manuscript
// corner-pieces but built as an original shape from plain line/rect
// primitives, not traced from any third-party asset.
function CornerOrnament({ corner }) {
  const pos = {
    tl: { top: -1, left: -1, rotate: 0 },
    tr: { top: -1, right: -1, rotate: 90 },
    br: { bottom: -1, right: -1, rotate: 180 },
    bl: { bottom: -1, left: -1, rotate: 270 },
  }[corner];
  return (
    <svg
      width="34"
      height="34"
      viewBox="0 0 34 34"
      style={{ position: 'absolute', top: pos.top, left: pos.left, right: pos.right, bottom: pos.bottom, transform: `rotate(${pos.rotate}deg)`, pointerEvents: 'none' }}
    >
      <g stroke="var(--gold-ink)" strokeWidth="1.4" fill="none" strokeLinecap="round">
        <path d="M3 31 L3 12 L12 12 L12 3 L31 3" />
        <path d="M3 23 L3 18 L18 18 L18 3 L23 3" />
      </g>
      <rect x="6.5" y="6.5" width="5" height="5" fill="var(--gold-ink)" transform="rotate(45 9 9)" />
    </svg>
  );
}

// Wraps the whole page card in a double gold border (an outer thin line,
// then a gap, then the card's own border) with a rosette at each corner —
// the classical "framed manuscript page" look, built entirely from CSS +
// simple SVG shapes rather than a raster/illustration asset.
function PageFrame({ children }) {
  return (
    <div style={{ position: 'relative', padding: 6, borderRadius: 22, border: '1px solid var(--gold-ink)' }}>
      <div style={{ position: 'relative', borderRadius: 16 }}>
        {children}
        <CornerOrnament corner="tl" />
        <CornerOrnament corner="tr" />
        <CornerOrnament corner="br" />
        <CornerOrnament corner="bl" />
      </div>
    </div>
  );
}

// Tapping an ayah's end-mark now opens AyahActionSheet (murotal/bagikan/
// salin/tandai terakhir baca) instead of bookmarking directly — the direct-
// bookmark-on-tap behavior moved into the sheet's own "Tandai Terakhir
// Baca" row, per the same per-ayah (not per-page) reasoning as before: a
// page can hold a dozen+ ayat, so "this page" alone doesn't say how far
// into it you actually got.
function AyahEndMark({ text, verseKey, isBookmarked, isTarget, onTap, forwardRef }) {
  return (
    <button
      ref={forwardRef}
      onClick={() => onTap(verseKey)}
      aria-label={`Opsi ayat ${text}`}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: 22,
        height: 22,
        borderRadius: '50%',
        border: '1px solid var(--gold-ink)',
        background: isBookmarked ? 'var(--gold-ink)' : 'transparent',
        fontSize: 11,
        fontFamily: "'Amiri', serif",
        color: isBookmarked ? '#fff' : 'var(--gold-ink)',
        margin: '0 2px',
        verticalAlign: 'middle',
        padding: 0,
        cursor: 'pointer',
        boxShadow: isTarget ? '0 0 0 4px var(--mint)' : 'none',
        transition: 'box-shadow 0.3s ease',
      }}
    >
      {text}
    </button>
  );
}

function ActionRow({ icon, label, onClick, disabled }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 14,
        width: '100%',
        padding: '14px 20px',
        background: 'none',
        border: 'none',
        borderTop: '1px solid var(--border)',
        color: disabled ? 'var(--muted)' : 'var(--ink)',
        fontSize: 14,
        fontWeight: 600,
        textAlign: 'left',
        cursor: disabled ? 'default' : 'pointer',
        opacity: disabled ? 0.5 : 1,
      }}
    >
      <span style={{ width: 20, textAlign: 'center', fontSize: 16 }}>{icon}</span>
      {label}
    </button>
  );
}

// Bottom sheet of per-ayah actions — murotal, bagikan, salin, tandai
// terakhir baca — replacing the old tap-to-bookmark-directly behavior.
// Audio + Indonesian translation are fetched lazily here (only once a
// specific ayah's sheet is opened) from EQuran.id via
// lib/quranApi.js's fetchSurahDetail, reusing the same reciter
// preference (`airmoon-qari`) already set in Mode Ayat's Pilih Qari
// screen — Mode Mushaf doesn't need its own separate reciter setting.
function AyahActionSheet({ verse, chapterName, isBookmarked, onClose, onBookmark }) {
  const [audioUrl, setAudioUrl] = useState(null);
  const [translation, setTranslation] = useState(null);
  const [loadingExtra, setLoadingExtra] = useState(true);
  const [playing, setPlaying] = useState(false);
  const audioRef = useRef(null);
  const [copied, setCopied] = useState(false);

  const [chapterId, verseNumber] = verse.verse_key.split(':').map(Number);

  useEffect(() => {
    let cancelled = false;
    setLoadingExtra(true);
    fetchSurahDetail(chapterId)
      .then((surah) => {
        if (cancelled) return;
        const ayat = surah.ayat.find((a) => a.nomorAyat === verseNumber);
        const qariId = localStorage.getItem('airmoon-qari') || '05';
        setAudioUrl(ayat?.audio?.[qariId] || null);
        setTranslation(ayat?.teksIndonesia || null);
      })
      .catch(() => {})
      .finally(() => {
        if (!cancelled) setLoadingExtra(false);
      });
    return () => {
      cancelled = true;
      audioRef.current?.pause();
    };
  }, [chapterId, verseNumber]);

  function handlePlay() {
    if (!audioUrl) return;
    if (!audioRef.current) {
      audioRef.current = new Audio(audioUrl);
      audioRef.current.addEventListener('ended', () => setPlaying(false));
    }
    if (playing) {
      audioRef.current.pause();
      setPlaying(false);
    } else {
      audioRef.current.play();
      setPlaying(true);
    }
  }

  function buildShareText() {
    return `${verse.text_uthmani}\n\n${translation ? translation + '\n\n' : ''}QS. ${chapterName} : ${verseNumber}`;
  }

  async function handleShare() {
    const text = buildShareText();
    if (navigator.share) {
      try {
        await navigator.share({ text });
      } catch {
        // user cancelled the share sheet — nothing to do
      }
    } else {
      await handleCopy();
    }
  }

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(buildShareText());
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      // clipboard permission denied/unsupported — nothing more we can do
    }
  }

  return (
    <div
      onClick={onClose}
      style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 50, display: 'flex', alignItems: 'flex-end' }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{ width: '100%', maxWidth: 480, margin: '0 auto', background: 'var(--card)', borderRadius: '20px 20px 0 0', paddingBottom: 12 }}
      >
        <div style={{ width: 36, height: 4, borderRadius: 999, background: 'var(--border)', margin: '10px auto 12px' }} />
        <div style={{ padding: '0 20px 14px', textAlign: 'center', fontSize: 12.5, fontWeight: 700, color: 'var(--gold-ink)' }}>
          QS. {chapterName} : {verseNumber}
        </div>
        <ActionRow icon={playing ? '⏸' : '▶'} label={playing ? 'Hentikan Murotal' : 'Putar Murotal'} onClick={handlePlay} disabled={loadingExtra || !audioUrl} />
        <ActionRow icon="↗" label="Bagikan Ayat" onClick={handleShare} />
        <ActionRow icon="⧉" label={copied ? 'Tersalin!' : 'Salin Ayat'} onClick={handleCopy} />
        <ActionRow icon={isBookmarked ? '★' : '☆'} label="Tandai Terakhir Baca" onClick={onBookmark} />
      </div>
    </div>
  );
}

// Tajwid mode can't use the QCF glyph fonts (each glyph is a whole
// pre-shaped word, not individual letters, so there's nothing to recolor
// per-rule) — renders real Unicode text_uthmani_tajweed with Amiri instead,
// coloring each <rule class=X> segment per TAJWEED_COLORS.
function TajweedWord({ html }) {
  const parts = parseTajweedHtml(html);
  return (
    <>
      {parts.map((p, i) => (
        <span key={i} style={{ color: p.ruleClass ? TAJWEED_COLORS[p.ruleClass] : 'inherit' }}>
          {p.text}
        </span>
      ))}
    </>
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
  const [searchParams] = useSearchParams();
  const targetVerseKey = searchParams.get('ayat'); // set when arriving via "Lanjut Baca · Mode Mushaf"
  const navigate = useNavigate();
  const { user } = useAuth();
  const page = Math.min(TOTAL_MUSHAF_PAGES, Math.max(1, Number(pageParam) || 1));

  const [chapters, setChapters] = useState(null);
  const [verses, setVerses] = useState(null);
  const [error, setError] = useState('');
  const [bookmarkedVerseKey, setBookmarkedVerseKey] = useState(null);
  const [actionSheetVerseKey, setActionSheetVerseKey] = useState(null);
  const [tajwidOn, setTajwidOn] = useState(() => localStorage.getItem('airmoon-mushaf-tajwid') === '1');
  const [night, setNight] = useNightMode();
  const targetRef = useRef(null);

  useEffect(() => {
    localStorage.setItem('airmoon-mushaf-tajwid', tajwidOn ? '1' : '0');
  }, [tajwidOn]);

  useEffect(() => {
    // Scoped to this session's load, not synced live — just enough to know
    // which ayah on THIS page (if any) is the saved bookmark, so its mark
    // renders filled-in without a separate Firestore listener.
    if (!user) return;
    getDoc(doc(db, 'users', user.uid)).then((snap) => {
      const lr = snap.data()?.lastReadMushaf;
      if (lr) setBookmarkedVerseKey(lr.verseKey);
    });
  }, [user]);

  useEffect(() => {
    if (targetRef.current) {
      targetRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, [verses]);

  async function bookmarkAyah(verseKey) {
    setBookmarkedVerseKey(verseKey);
    if (!user) return;
    const [chapterId, verseNumber] = verseKey.split(':').map(Number);
    const chapterName = chapters?.find((c) => c.id === chapterId)?.name_simple || '';
    await setDoc(
      doc(db, 'users', user.uid),
      { lastReadMushaf: { page, chapterId, chapterName, verseKey, verseNumber } },
      { merge: true }
    );
  }

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
    // Tajwid mode never renders with the QCF glyph font (see TajweedWord
    // above) — skip fetching the ~30-90KB page font entirely when it won't
    // be used.
    if (tajwidOn) {
      setFontReady(true);
      return;
    }
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
  }, [pageFontFamily, pageFontUrl, tajwidOn]);

  const { lines, surahStarts } = verses ? layoutPage(verses) : { lines: new Map(), surahStarts: [] };
  const lineNumbers = [...lines.keys()].sort((a, b) => a - b);
  const juzNumber = verses?.[0]?.juz_number;
  const chapterById = (id) => chapters?.find((c) => c.id === id);
  // Page header shows every surah that actually starts or continues on this
  // page — usually one, occasionally two when a page spans a surah boundary.
  const chapterIdsOnPage = verses ? [...new Set(verses.map((v) => Number(v.verse_key.split(':')[0])))] : [];
  const chapterNamesOnPage = chapterIdsOnPage.map((id) => chapterById(id)?.name_simple).filter(Boolean).join(' / ');

  return (
    <div className="screen" style={night ? NIGHT_STYLE_VARS : undefined}>
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
          <div style={{ display: 'flex', gap: 4 }}>
            <button
              className="icon-btn"
              onClick={() => setTajwidOn((v) => !v)}
              aria-label="Toggle tajwid berwarna"
              style={{ color: tajwidOn ? 'var(--primary)' : 'var(--muted)' }}
              title="Tajwid berwarna"
            >
              <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path d="M12 3a9 9 0 0 0 0 18c1.5 0 2-1 2-2s-.5-1.5-1-2 0-2 1-2h2a4 4 0 0 0 4-4c0-4.4-3.6-8-8-8Z" strokeWidth="1.6" strokeLinejoin="round" />
                <circle cx="7.5" cy="11" r="1" fill="currentColor" stroke="none" />
                <circle cx="10.5" cy="7.5" r="1" fill="currentColor" stroke="none" />
                <circle cx="15" cy="8" r="1" fill="currentColor" stroke="none" />
              </svg>
            </button>
            <button
              className="icon-btn"
              onClick={() => setNight((v) => !v)}
              aria-label="Toggle mode malam"
              style={{ color: night ? 'var(--primary)' : 'var(--muted)' }}
              title="Mode malam"
            >
              <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path d="M20 14.5A8.5 8.5 0 1 1 9.5 4a6.5 6.5 0 0 0 10.5 10.5Z" strokeWidth="1.6" strokeLinejoin="round" />
              </svg>
            </button>
          </div>
        </div>

        {error && <p className="state-msg">{error}</p>}

        {!error && !verses && (
          <div className="center" style={{ minHeight: '50vh' }}>
            <div className="spinner" />
          </div>
        )}

        {verses && (
          <PageFrame>
          <div
            style={{
              borderRadius: 16,
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
                  <MushafLine
                    fontFamily={tajwidOn ? "'Amiri', serif" : `'${pageFontFamily}', 'Amiri', serif`}
                    lineKey={`${page}-${ln}-${tajwidOn}`}
                    fontReady={fontReady}
                  >
                    {lines.get(ln).map((w, i) =>
                      w.char_type_name === 'end' ? (
                        <AyahEndMark
                          key={i}
                          text={w.text_uthmani}
                          verseKey={w.verseKey}
                          isBookmarked={bookmarkedVerseKey === w.verseKey}
                          isTarget={targetVerseKey === w.verseKey}
                          onTap={setActionSheetVerseKey}
                          forwardRef={targetVerseKey === w.verseKey ? targetRef : undefined}
                        />
                      ) : tajwidOn ? (
                        <span key={i}>
                          <TajweedWord html={w.text_uthmani_tajweed} />{' '}
                        </span>
                      ) : (
                        <span key={i}>{w.code_v1} </span>
                      )
                    )}
                  </MushafLine>
                </div>
              );
            })}
          </div>
          </PageFrame>
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

        {verses && (
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10, padding: '13px 14px', borderRadius: 14, background: 'var(--card)' }}>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="var(--muted)" style={{ flexShrink: 0, marginTop: 1 }}>
              <circle cx="12" cy="12" r="9" strokeWidth="1.6" /><path d="M12 11v5.5M12 8v.01" strokeWidth="1.8" strokeLinecap="round" />
            </svg>
            <span style={{ fontSize: 11, lineHeight: 1.5, color: 'var(--muted)' }}>
              Tap nomor ayat buat buka opsi — putar murotal, bagikan, salin, atau tandai "terakhir dibaca sampai sini".
            </span>
          </div>
        )}
      </div>

      {actionSheetVerseKey && (
        <AyahActionSheet
          verse={verses.find((v) => v.verse_key === actionSheetVerseKey)}
          chapterName={chapterById(Number(actionSheetVerseKey.split(':')[0]))?.name_simple || ''}
          isBookmarked={bookmarkedVerseKey === actionSheetVerseKey}
          onClose={() => setActionSheetVerseKey(null)}
          onBookmark={() => {
            bookmarkAyah(actionSheetVerseKey);
            setActionSheetVerseKey(null);
          }}
        />
      )}
    </div>
  );
}
