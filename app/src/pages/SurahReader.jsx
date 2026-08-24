import { useEffect, useRef, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { doc, setDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { useAuth } from '../context/AuthContext';
import { fetchSurahDetail, RECITERS } from '../lib/quranApi';
import TopBar from '../components/TopBar';

function getReciterId() {
  return localStorage.getItem('airmoon-qari') || '05';
}

export default function SurahReader() {
  const { nomor } = useParams();
  const { user } = useAuth();
  const [surah, setSurah] = useState(null);
  const [error, setError] = useState('');
  const [playing, setPlaying] = useState(null); // ayat number currently playing
  const [bookmarked, setBookmarked] = useState(null);
  const [reciterId, setReciterId] = useState(getReciterId());
  const audioRef = useRef(null);
  const reciter = RECITERS.find((r) => r.id === reciterId) || RECITERS[4];

  useEffect(() => {
    setSurah(null);
    setError('');
    fetchSurahDetail(nomor)
      .then(setSurah)
      .catch(() => setError('Gagal memuat surat. Coba lagi.'));
  }, [nomor]);

  useEffect(() => {
    setReciterId(getReciterId());
  }, []);

  function playAyat(ayat) {
    const url = ayat.audio?.[reciterId];
    if (!url || !audioRef.current) return;
    audioRef.current.src = url;
    audioRef.current.play();
    setPlaying(ayat.nomorAyat);
  }

  function handleEnded() {
    if (!surah) return;
    const idx = surah.ayat.findIndex((a) => a.nomorAyat === playing);
    const nextAyat = surah.ayat[idx + 1];
    if (nextAyat) playAyat(nextAyat);
    else setPlaying(null);
  }

  async function markLastRead(ayat) {
    setBookmarked(ayat.nomorAyat);
    if (!user || !surah) return;
    await setDoc(
      doc(db, 'users', user.uid),
      { lastRead: { nomor: surah.nomor, namaLatin: surah.namaLatin, ayat: ayat.nomorAyat } },
      { merge: true }
    );
  }

  if (error) {
    return (
      <div className="screen">
        <div className="screen-content">
          <TopBar title="Al-Qur'an" />
          <p className="state-msg">{error}</p>
        </div>
      </div>
    );
  }

  if (!surah) {
    return (
      <div className="screen">
        <div className="screen-content center" style={{ minHeight: '60vh' }}>
          <div className="spinner" />
        </div>
      </div>
    );
  }

  return (
    <div className="screen">
      <div className="screen-content" style={{ paddingBottom: 110 }}>
        <TopBar title={surah.namaLatin} subtitle={`${surah.tempatTurun} · ${surah.jumlahAyat} Ayat`} />

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
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#fff">
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
            return (
              <div
                key={a.nomorAyat}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 10,
                  paddingBottom: 18,
                  borderBottom: '1px solid var(--border)',
                  background: isPlaying ? 'var(--cream)' : 'transparent',
                  borderRadius: isPlaying ? 16 : 0,
                  padding: isPlaying ? '12px 10px 18px' : undefined,
                  margin: isPlaying ? '0 -10px' : undefined,
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
                  <div style={{ flex: 1, fontFamily: "'Amiri', serif", fontSize: 24, lineHeight: 2, direction: 'rtl', textAlign: 'right' }}>
                    {a.teksArab}
                  </div>
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
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <audio ref={audioRef} onEnded={handleEnded} style={{ display: 'none' }} />

      {playing && (
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
            style={{ width: 40, height: 40, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, background: 'var(--primary)', border: 'none', cursor: 'pointer' }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="#fff" stroke="none"><rect x="6" y="5" width="4" height="14" rx="1" /><rect x="14" y="5" width="4" height="14" rx="1" /></svg>
          </button>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 2, flex: 1, minWidth: 0 }}>
            <span style={{ fontSize: 12, fontWeight: 700 }}>{surah.namaLatin} &middot; Ayat {playing}</span>
            <span style={{ fontSize: 10, color: 'var(--muted)' }}>{reciter.name}</span>
          </div>
        </div>
      )}
    </div>
  );
}
