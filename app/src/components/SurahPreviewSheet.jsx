import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchSurahDetail } from '../lib/quranApi';
import { useEscapeKey } from '../lib/useEscapeKey';
import Portal from './Portal';

function getReciterId() {
  return localStorage.getItem('airmoon-qari') || '05';
}

// A quick "is this the surah I'm thinking of" peek — first 1-2 ayat +
// audio preview — before committing to opening the full reader. Reuses
// the same fetchSurahDetail() the real reader uses (nothing new to build
// server-side), just renders a small slice of it. Implemented as a visible
// preview-icon button per row rather than a long-press gesture: mobile web
// has no reliable native long-press event, and a plain button is both more
// discoverable and avoids the timer/touch-vs-scroll conflicts a hand-rolled
// long-press detector would need to get right.
export default function SurahPreviewSheet({ surah, onClose }) {
  const navigate = useNavigate();
  useEscapeKey(onClose);
  const [detail, setDetail] = useState(null);
  const [playing, setPlaying] = useState(false);
  const audioRef = useRef(null);

  useEffect(() => {
    let cancelled = false;
    fetchSurahDetail(surah.nomor).then((d) => {
      if (!cancelled) setDetail(d);
    });
    return () => {
      cancelled = true;
      audioRef.current?.pause();
    };
  }, [surah.nomor]);

  const previewAyat = detail?.ayat.slice(0, 2) || [];

  function togglePlay() {
    const url = previewAyat[0]?.audio?.[getReciterId()];
    if (!url) return;
    if (!audioRef.current) {
      audioRef.current = new Audio(url);
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

  return (
    <Portal>
      <div onClick={onClose} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 50, display: 'flex', alignItems: 'flex-end' }}>
        <div
          onClick={(e) => e.stopPropagation()}
          style={{ width: '100%', maxWidth: 480, margin: '0 auto', maxHeight: '75vh', overflowY: 'auto', background: 'var(--card)', borderRadius: '20px 20px 0 0', padding: '0 0 20px' }}
        >
          <div style={{ width: 36, height: 4, borderRadius: 999, background: 'var(--border)', margin: '10px auto 12px' }} />

          <div style={{ padding: '0 20px 14px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 10 }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <span style={{ fontSize: 15, fontWeight: 800 }}>{surah.namaLatin}</span>
              <span style={{ fontSize: 11, color: 'var(--muted)' }}>{surah.tempatTurun} &middot; {surah.jumlahAyat} Ayat &middot; {surah.arti}</span>
            </div>
            <span style={{ fontFamily: "'Amiri', serif", fontSize: 22, fontWeight: 700 }}>{surah.nama}</span>
          </div>

          {!detail && (
            <div className="center" style={{ minHeight: 100 }}>
              <div className="spinner" />
            </div>
          )}

          {detail && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14, padding: '0 20px' }}>
              {previewAyat.map((a) => (
                <div key={a.nomorAyat} style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                  <div style={{ fontFamily: "'Amiri', serif", fontSize: 20, lineHeight: 1.9, direction: 'rtl', textAlign: 'right' }}>{a.teksArab}</div>
                  <p style={{ margin: 0, fontSize: 12, lineHeight: 1.5, color: 'var(--muted)' }}>{a.teksIndonesia}</p>
                </div>
              ))}
              <span style={{ fontSize: 10.5, color: 'var(--muted-soft)', textAlign: 'center' }}>
                {surah.jumlahAyat > 2 ? `+ ${surah.jumlahAyat - 2} ayat lagi` : ''}
              </span>
            </div>
          )}

          <div style={{ display: 'flex', gap: 10, padding: '16px 20px 0' }}>
            <button className="btn-outline" style={{ flex: 1 }} onClick={togglePlay} disabled={!previewAyat[0]?.audio}>
              {playing ? '⏸ Jeda' : '▶ Dengar Ayat 1'}
            </button>
            <button className="btn" style={{ flex: 1 }} onClick={() => navigate(`/quran/${surah.nomor}`)}>
              Baca Selengkapnya
            </button>
          </div>
        </div>
      </div>
    </Portal>
  );
}
