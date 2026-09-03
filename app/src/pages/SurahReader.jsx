import { useEffect, useRef, useState } from 'react';
import { useParams, useSearchParams, Link } from 'react-router-dom';
import { doc, setDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { fetchSurahDetail, RECITERS } from '../lib/quranApi';
import { hasWordSync, fetchChapterTiming } from '../lib/quranTimingApi';
import { fetchWordGloss } from '../lib/wordGlossApi';
import { watchFavoriteAyat, addFavoriteAyat, removeFavoriteAyat } from '../lib/favoriteAyat';
import { useNightMode, NIGHT_STYLE_VARS, useArabicFontSize, MIN_ARABIC_SIZE, MAX_ARABIC_SIZE } from '../lib/readingPrefs';
import { fetchSurahTafsir } from '../lib/tafsirApi';
import { markSurahOpened } from '../lib/readingHistory';
import TopBar from '../components/TopBar';
import AyatCardModal from '../components/AyatCardModal';
import TafsirSheet from '../components/TafsirSheet';
import ErrorRetry from '../components/ErrorRetry';
import { Skeleton, SkeletonCard } from '../components/Skeleton';
import Portal from '../components/Portal';

function getReciterId() {
  return localStorage.getItem('airmoon-qari') || '05';
}

export default function SurahReader() {
  const { nomor } = useParams();
  const [searchParams] = useSearchParams();
  const jumpToAyat = Number(searchParams.get('ayat')) || null; // deep-link from Cari Ayat search results
  const { user } = useAuth();
  const { showToast } = useToast();
  const [surah, setSurah] = useState(null);
  const [highlightAyat, setHighlightAyat] = useState(null);
  const [error, setError] = useState('');
  const [playing, setPlaying] = useState(null); // ayat number currently playing
  const [bookmarked, setBookmarked] = useState(null);
  const [reciterId, setReciterId] = useState(getReciterId());
  const [timing, setTiming] = useState(null); // fetchChapterTiming() result, or null if unavailable
  const [night, setNight] = useNightMode();
  const [arabicSize, setArabicSize] = useArabicFontSize();
  const [showSizeControls, setShowSizeControls] = useState(false);
  const [tafsirMap, setTafsirMap] = useState(null);
  const [tafsirOpenAyat, setTafsirOpenAyat] = useState(null);
  const [tafsirLoading, setTafsirLoading] = useState(false);
  const [activeWord, setActiveWord] = useState(null); // 1-based word index within the playing ayat
  const [glossOn, setGlossOn] = useState(false);
  const [gloss, setGloss] = useState(null); // { [ayatNumber]: [{arab, id}, ...] } once loaded
  const [glossLoading, setGlossLoading] = useState(false);
  const [favorites, setFavorites] = useState([]);
  const [cardAyat, setCardAyat] = useState(null); // ayat passed to AyatCardModal, or null when closed
  const audioRef = useRef(null);
  const reciter = RECITERS.find((r) => r.id === reciterId) || RECITERS[4];
  // Word-sync only actually applies once the timing data has loaded — a
  // fetch failure (or a reciter with no Quran.com match at all) falls back
  // to the plain per-ayat playback below rather than blocking anything.
  const wordSyncReady = hasWordSync(reciterId) && !!timing;
  const [retryTick, setRetryTick] = useState(0);

  useEffect(() => {
    setSurah(null);
    setError('');
    fetchSurahDetail(nomor)
      .then((s) => {
        setSurah(s);
        markSurahOpened({ nomor: s.nomor, namaLatin: s.namaLatin });
      })
      .catch(() => setError('Gagal memuat surat.'));
  }, [nomor, retryTick]);

  // Reset the cached tafsir map whenever the surah changes so a stale
  // tafsir from the previous surah never gets shown against the wrong
  // ayat — same reasoning as the gloss reset effect below.
  useEffect(() => {
    setTafsirMap(null);
  }, [nomor]);

  async function openTafsir(ayatNumber) {
    setTafsirOpenAyat(ayatNumber);
    if (tafsirMap) return;
    setTafsirLoading(true);
    try {
      setTafsirMap(await fetchSurahTafsir(nomor));
    } catch {
      setTafsirMap({});
    } finally {
      setTafsirLoading(false);
    }
  }

  // Deep-link from Cari Ayat: once the surah's real content is in the DOM,
  // scroll the target ayat into view and give it a brief highlight ring —
  // same "you landed here, not randomly on the page" affordance
  // MushafReader already gives its own ?ayat= deep link.
  useEffect(() => {
    if (!surah || !jumpToAyat) return;
    const el = document.getElementById(`ayat-${jumpToAyat}`);
    if (!el) return;
    el.scrollIntoView({ behavior: 'smooth', block: 'center' });
    setHighlightAyat(jumpToAyat);
    const t = setTimeout(() => setHighlightAyat(null), 2200);
    return () => clearTimeout(t);
  }, [surah, jumpToAyat]);

  useEffect(() => {
    setReciterId(getReciterId());
  }, []);

  useEffect(() => watchFavoriteAyat(user?.uid, setFavorites), [user?.uid]);
  const favoriteKeys = new Set(favorites.map((f) => f.id));

  async function toggleFavorite(a) {
    if (!user || !surah) return;
    const key = `${surah.nomor}:${a.nomorAyat}`;
    if (favoriteKeys.has(key)) {
      await removeFavoriteAyat(user.uid, surah.nomor, a.nomorAyat);
      showToast('Dihapus dari favorit');
    } else {
      await addFavoriteAyat(user.uid, {
        chapter: surah.nomor,
        chapterName: surah.namaLatin,
        verse: a.nomorAyat,
        arabic: a.teksArab,
        translation: a.teksIndonesia,
      });
      showToast('Ditambahkan ke favorit');
    }
  }

  // Reset whenever the surah changes so a stale gloss from the previous
  // surah never gets shown against the wrong ayat while the new one loads.
  useEffect(() => {
    setGloss(null);
  }, [nomor]);

  useEffect(() => {
    if (!glossOn || gloss || !nomor) return;
    let cancelled = false;
    setGlossLoading(true);
    fetchWordGloss(nomor)
      .then((g) => {
        if (!cancelled) setGloss(g);
      })
      .catch(() => {
        /* toggle just stays on with nothing to show — teksIndonesia below still covers the ayat */
      })
      .finally(() => {
        if (!cancelled) setGlossLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [glossOn, gloss, nomor]);

  useEffect(() => {
    setTiming(null);
    setActiveWord(null);
    if (!nomor || !hasWordSync(reciterId)) return;
    let cancelled = false;
    fetchChapterTiming(reciterId, nomor)
      .then((t) => {
        if (!cancelled) setTiming(t);
      })
      .catch(() => {
        /* silently falls back to per-ayat playback below */
      });
    return () => {
      cancelled = true;
    };
  }, [nomor, reciterId]);

  function playAyat(ayat) {
    if (!audioRef.current) return;
    if (wordSyncReady) {
      const v = timing.verses[ayat.nomorAyat];
      if (!v) return;
      if (audioRef.current.src !== timing.audioUrl) audioRef.current.src = timing.audioUrl;
      audioRef.current.currentTime = v.fromMs / 1000;
      audioRef.current.play();
      setPlaying(ayat.nomorAyat);
      return;
    }
    const url = ayat.audio?.[reciterId];
    if (!url) return;
    audioRef.current.src = url;
    audioRef.current.play();
    setPlaying(ayat.nomorAyat);
  }

  function handleTimeUpdate() {
    if (!wordSyncReady || !audioRef.current) return;
    const ms = audioRef.current.currentTime * 1000;
    const verseEntry = Object.entries(timing.verses).find(([, v]) => ms >= v.fromMs && ms < v.toMs);
    if (!verseEntry) return;
    const [verseNumber, v] = verseEntry;
    setPlaying(Number(verseNumber));
    const word = v.words.find((w) => ms >= w.fromMs && ms < w.toMs);
    setActiveWord(word ? word.index : null);
  }

  function handleEnded() {
    if (wordSyncReady) {
      setPlaying(null);
      setActiveWord(null);
      return;
    }
    if (!surah) return;
    const idx = surah.ayat.findIndex((a) => a.nomorAyat === playing);
    const nextAyat = surah.ayat[idx + 1];
    if (nextAyat) playAyat(nextAyat);
    else setPlaying(null);
  }

  async function markLastRead(ayat) {
    setBookmarked(ayat.nomorAyat);
    if (!user || !surah) return;
    // Separate from lastReadMushaf — Mode Ayat and Mode Mushaf each keep
    // their own bookmark so switching modes (e.g. out of boredom) doesn't
    // force one to stand in for the other. See lastReadMushaf in
    // MushafReader.jsx for why a mushaf-mode bookmark can't just reuse this.
    await setDoc(
      doc(db, 'users', user.uid),
      { lastReadAyat: { nomor: surah.nomor, namaLatin: surah.namaLatin, ayat: ayat.nomorAyat } },
      { merge: true }
    );
  }

  if (error) {
    return (
      <div className="screen">
        <div className="screen-content">
          <TopBar title="Al-Qur'an" />
          <ErrorRetry message={error} onRetry={() => setRetryTick((n) => n + 1)} />
        </div>
      </div>
    );
  }

  if (!surah) {
    return (
      <div className="screen">
        <div className="screen-content">
          <Skeleton height={20} width={140} />
          <SkeletonCard height={90} radius={22} />
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} style={{ display: 'flex', flexDirection: 'column', gap: 10, paddingBottom: 18, borderBottom: '1px solid var(--border)' }}>
              <Skeleton height={26} width="85%" style={{ alignSelf: 'flex-end' }} />
              <Skeleton height={13} width="60%" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  const topbarActions = (
    <div style={{ display: 'flex', alignItems: 'center', gap: 2 }}>
      <button
        className="icon-btn"
        onClick={() => setShowSizeControls((v) => !v)}
        aria-label="Ukuran teks Arab"
        style={{ color: showSizeControls ? 'var(--primary)' : 'var(--muted)', fontWeight: 800, fontSize: 13 }}
        title="Ukuran teks Arab"
      >
        Aa
      </button>
      <button
        className="icon-btn"
        onClick={() => setGlossOn((v) => !v)}
        aria-label="Toggle terjemahan per kata"
        style={{ color: glossOn ? 'var(--primary)' : 'var(--muted)' }}
        title="Terjemahan per kata"
      >
        {glossLoading ? (
          <div className="spinner" style={{ width: 14, height: 14 }} />
        ) : (
          <svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor">
            <text x="1" y="16" fontSize="12" fontWeight="800" fontFamily="Poppins, sans-serif">A</text>
            <text x="11" y="20" fontSize="13" fontWeight="700" fontFamily="'Amiri', serif">ب</text>
          </svg>
        )}
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
  );

  return (
    <div className="screen" style={night ? NIGHT_STYLE_VARS : undefined}>
      <div className="screen-content" style={{ paddingBottom: 'calc(110px + env(safe-area-inset-bottom))' }}>
        <TopBar title={surah.namaLatin} subtitle={`${surah.tempatTurun} · ${surah.jumlahAyat} Ayat`} right={topbarActions} />

        {showSizeControls && (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 16, padding: '10px 14px', borderRadius: 14, background: 'var(--mint-soft)' }}>
            <button
              onClick={() => setArabicSize((s) => Math.max(MIN_ARABIC_SIZE, s - 2))}
              disabled={arabicSize <= MIN_ARABIC_SIZE}
              aria-label="Perkecil teks Arab"
              style={{ width: 32, height: 32, borderRadius: '50%', border: 'none', background: 'var(--card)', color: 'var(--primary)', fontWeight: 800, fontSize: 13, cursor: 'pointer', opacity: arabicSize <= MIN_ARABIC_SIZE ? 0.4 : 1 }}
            >
              A-
            </button>
            <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--muted)', minWidth: 30, textAlign: 'center' }}>{arabicSize}px</span>
            <button
              onClick={() => setArabicSize((s) => Math.min(MAX_ARABIC_SIZE, s + 2))}
              disabled={arabicSize >= MAX_ARABIC_SIZE}
              aria-label="Perbesar teks Arab"
              style={{ width: 32, height: 32, borderRadius: '50%', border: 'none', background: 'var(--card)', color: 'var(--primary)', fontWeight: 800, fontSize: 15, cursor: 'pointer', opacity: arabicSize >= MAX_ARABIC_SIZE ? 0.4 : 1 }}
            >
              A+
            </button>
          </div>
        )}

        <Link
          to={`/quran/${nomor}/qari`}
          style={{
            textDecoration: 'none',
            color: 'inherit',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 10,
            padding: '12px 14px',
            borderRadius: 14,
            background: 'var(--mint-soft)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ width: 30, height: 30, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--primary)' }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--on-primary)">
                <path d="M12 2a4 4 0 0 0-4 4v5a4 4 0 0 0 8 0V6a4 4 0 0 0-4-4Z" strokeWidth="1.6" />
                <path d="M6 11a6 6 0 0 0 12 0M12 17v4M9 21h6" strokeWidth="1.6" strokeLinecap="round" />
              </svg>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              <span style={{ fontSize: 10, color: 'var(--muted)' }}>Qari</span>
              <span style={{ fontSize: 12.5, fontWeight: 700 }}>{reciter.name}</span>
            </div>
          </div>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--muted)"><path d="m9 6 6 6-6 6" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg>
        </Link>

        <div style={{ borderRadius: 22, padding: '24px 20px', textAlign: 'center', background: `linear-gradient(135deg, var(--primary), var(--primary-dark))` }}>
          <div style={{ fontFamily: "'Amiri', serif", fontSize: 21, fontWeight: 700, color: '#fff', marginBottom: 6 }}>{surah.nama}</div>
          <div style={{ fontSize: 12, color: 'var(--accent)' }}>{surah.arti} &middot; {surah.tempatTurun === 'Mekah' ? 'Turun di Makkah' : 'Turun di Madinah'}</div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 22 }}>
          {surah.ayat.map((a) => {
            const isPlaying = playing === a.nomorAyat;
            const isBookmarked = bookmarked === a.nomorAyat;
            const isJumpTarget = highlightAyat === a.nomorAyat;
            return (
              <div
                key={a.nomorAyat}
                id={`ayat-${a.nomorAyat}`}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 10,
                  paddingBottom: 18,
                  borderBottom: '1px solid var(--border)',
                  background: isJumpTarget ? 'var(--mint)' : isPlaying ? 'var(--cream)' : 'transparent',
                  borderRadius: isJumpTarget || isPlaying ? 16 : 0,
                  padding: isJumpTarget || isPlaying ? '12px 10px 18px' : undefined,
                  margin: isJumpTarget || isPlaying ? '0 -10px' : undefined,
                  boxShadow: isJumpTarget ? '0 0 0 2px var(--primary)' : 'none',
                  transition: 'background 0.3s ease, box-shadow 0.3s ease',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12 }}>
                  <div
                    style={{
                      width: 28,
                      height: 28,
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                      background: isPlaying ? 'var(--accent)' : 'transparent',
                      border: isPlaying ? 'none' : '1.5px solid var(--primary)',
                    }}
                  >
                    <span style={{ fontSize: 11, fontWeight: 800, color: isPlaying ? 'var(--primary-dark)' : 'var(--primary)' }}>
                      {a.nomorAyat}
                    </span>
                  </div>
                  {glossOn && gloss?.[a.nomorAyat] ? (
                    <div style={{ flex: 1, display: 'flex', flexWrap: 'wrap', flexDirection: 'row-reverse', gap: '10px 14px', justifyContent: 'flex-start' }}>
                      {gloss[a.nomorAyat].map((w, i) => (
                        <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3, maxWidth: 90 }}>
                          <span style={{ fontFamily: "'Amiri', serif", fontSize: arabicSize - 2, lineHeight: 1.4 }}>{w.arab}</span>
                          <span style={{ fontSize: 9.5, color: 'var(--muted)', textAlign: 'center', lineHeight: 1.2 }}>{w.id}</span>
                        </div>
                      ))}
                    </div>
                  ) : (
                  <div style={{ flex: 1, fontFamily: "'Amiri', serif", fontSize: arabicSize, lineHeight: 2, direction: 'rtl', textAlign: 'right' }}>
                      {wordSyncReady && isPlaying
                        ? a.teksArab.split(' ').map((word, i) => (
                            <span
                              key={i}
                              style={{
                                color: activeWord === i + 1 ? 'var(--primary)' : 'inherit',
                                transition: 'color 0.15s ease',
                              }}
                            >
                              {word}
                              {i < a.teksArab.split(' ').length - 1 ? ' ' : ''}
                            </span>
                          ))
                        : a.teksArab}
                    </div>
                  )}
                </div>
                <p style={{ margin: 0, fontSize: 13, lineHeight: 1.6, color: 'var(--muted)' }}>{a.teksIndonesia}</p>
                <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                  <button
                    onClick={() => (isPlaying ? audioRef.current?.pause() : playAyat(a))}
                    style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer', color: 'var(--primary)' }}
                    aria-label="Putar ayat"
                  >
                    {isPlaying ? (
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" stroke="none"><rect x="6" y="5" width="4" height="14" rx="1" /><rect x="14" y="5" width="4" height="14" rx="1" /></svg>
                    ) : (
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" stroke="none"><path d="M8 5.5v13l11-6.5-11-6.5Z" /></svg>
                    )}
                  </button>
                  <button
                    onClick={() => markLastRead(a)}
                    style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer', color: isBookmarked ? 'var(--primary)' : 'var(--muted-soft)' }}
                    aria-label="Tandai terakhir dibaca"
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill={isBookmarked ? 'currentColor' : 'none'} stroke="currentColor">
                      <path d="M7 3.5h10a1 1 0 0 1 1 1V21l-6-3.5L6 21V4.5a1 1 0 0 1 1-1Z" strokeWidth="1.6" strokeLinejoin="round" />
                    </svg>
                  </button>
                  <button
                    onClick={() => toggleFavorite(a)}
                    style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer', color: favoriteKeys.has(`${surah.nomor}:${a.nomorAyat}`) ? 'var(--accent)' : 'var(--muted-soft)' }}
                    aria-label="Simpan ke favorit"
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill={favoriteKeys.has(`${surah.nomor}:${a.nomorAyat}`) ? 'currentColor' : 'none'} stroke="currentColor">
                      <path d="m12 3 2.7 6.2 6.8.6-5.1 4.5 1.6 6.7L12 17.3l-5.9 3.5 1.5-6.7-5-4.5 6.7-.6Z" strokeWidth="1.4" strokeLinejoin="round" />
                    </svg>
                  </button>
                  <button
                    onClick={() =>
                      setCardAyat({
                        chapter: surah.nomor,
                        chapterName: surah.namaLatin,
                        verse: a.nomorAyat,
                        arabic: a.teksArab,
                        translation: a.teksIndonesia,
                      })
                    }
                    style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer', color: 'var(--muted-soft)' }}
                    aria-label="Bagikan sebagai gambar"
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                      <path d="M12 3v13M12 3 8 7M12 3l4 4" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                      <path d="M5 14v4.5A2.5 2.5 0 0 0 7.5 21h9a2.5 2.5 0 0 0 2.5-2.5V14" strokeWidth="1.6" strokeLinecap="round" />
                    </svg>
                  </button>
                  <button
                    onClick={() => openTafsir(a.nomorAyat)}
                    style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer', color: 'var(--muted-soft)' }}
                    aria-label="Lihat tafsir"
                    title="Tafsir"
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                      <path d="M4 5.5A2.5 2.5 0 0 1 6.5 3H12v18H6.5A2.5 2.5 0 0 1 4 18.5v-13Z" strokeWidth="1.6" strokeLinejoin="round" />
                      <path d="M20 5.5A2.5 2.5 0 0 0 17.5 3H12v18h5.5a2.5 2.5 0 0 0 2.5-2.5v-13Z" strokeWidth="1.6" strokeLinejoin="round" />
                    </svg>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <audio ref={audioRef} onEnded={handleEnded} onTimeUpdate={handleTimeUpdate} style={{ display: 'none' }} />

      {playing && (
        <Portal>
        <div
          style={{
            position: 'fixed',
            left: '50%',
            transform: 'translateX(-50%)',
            bottom: 22,
            width: 'calc(100% - 32px)',
            maxWidth: 448,
            display: 'flex',
            alignItems: 'center',
            gap: 12,
            padding: '10px 14px',
            borderRadius: 999,
            boxShadow: 'var(--shadow-pill)',
            background: 'var(--bg)',
            border: '1px solid var(--border)',
            zIndex: 20,
          }}
        >
          <button
            onClick={() => audioRef.current?.pause()}
            aria-label="Jeda"
            style={{ width: 40, height: 40, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, background: 'var(--primary)', border: 'none', cursor: 'pointer' }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="var(--on-primary)" stroke="none"><rect x="6" y="5" width="4" height="14" rx="1" /><rect x="14" y="5" width="4" height="14" rx="1" /></svg>
          </button>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 2, flex: 1, minWidth: 0 }}>
            <span style={{ fontSize: 12, fontWeight: 700 }}>{surah.namaLatin} &middot; Ayat {playing}</span>
            <span style={{ fontSize: 10, color: 'var(--muted)' }}>{reciter.name}</span>
          </div>
        </div>
        </Portal>
      )}

      {cardAyat && <AyatCardModal ayat={cardAyat} onClose={() => setCardAyat(null)} />}

      {tafsirOpenAyat && (
        <TafsirSheet
          title={`${surah.namaLatin} : ${tafsirOpenAyat}`}
          loading={tafsirLoading}
          text={tafsirMap?.[tafsirOpenAyat]}
          onClose={() => setTafsirOpenAyat(null)}
        />
      )}
    </div>
  );
}
