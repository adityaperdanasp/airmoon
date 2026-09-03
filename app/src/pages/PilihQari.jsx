import { useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { RECITERS, fetchSurahDetail } from '../lib/quranApi';
import { hasWordSync } from '../lib/quranTimingApi';
import PageHeaderPhoto from '../components/PageHeaderPhoto';
import { PAGE_PHOTOS } from '../data/photos';

export default function PilihQari() {
  const navigate = useNavigate();
  const { nomor } = useParams();
  const current = localStorage.getItem('airmoon-qari') || '05';
  // Al-Fatihah's audioFull map — short enough to be a real preview, and
  // fetchSurahDetail already returns it alongside the per-ayat audio this
  // page never used to expose. Previously this page was just a plain name
  // list with no way to hear a reciter before committing to them.
  const [audioFull, setAudioFull] = useState(null);
  const [playingId, setPlayingId] = useState(null);
  const audioRef = useRef(null);

  useEffect(() => {
    fetchSurahDetail(1)
      .then((d) => setAudioFull(d.audioFull))
      .catch(() => {});
    return () => audioRef.current?.pause();
  }, []);

  function togglePreview(e, id) {
    e.stopPropagation();
    const url = audioFull?.[id];
    if (!url) return;
    if (playingId === id) {
      audioRef.current?.pause();
      setPlayingId(null);
      return;
    }
    if (!audioRef.current) {
      audioRef.current = new Audio();
      audioRef.current.addEventListener('ended', () => setPlayingId(null));
    }
    audioRef.current.src = url;
    audioRef.current.play();
    setPlayingId(id);
  }

  function pick(id) {
    localStorage.setItem('airmoon-qari', id);
    navigate(`/quran/${nomor}`, { replace: true });
  }

  return (
    <div className="screen">
      <div className="screen-content">
        <PageHeaderPhoto title="Pilih Qari" photo={PAGE_PHOTOS.pilihQari} subtitle="Ketuk ▶ buat dengar contoh (Al-Fatihah)" />
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {RECITERS.map((r) => {
            const active = r.id === current;
            const isPlaying = playingId === r.id;
            return (
              <button
                key={r.id}
                onClick={() => pick(r.id)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 12,
                  padding: '12px 14px',
                  borderRadius: 16,
                  border: 'none',
                  cursor: 'pointer',
                  textAlign: 'left',
                  font: 'inherit',
                  color: 'inherit',
                  background: active ? 'var(--mint)' : 'transparent',
                }}
              >
                <div
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                    background: active ? 'var(--primary)' : 'var(--mint-soft)',
                  }}
                >
                  <span style={{ fontSize: 14, fontWeight: 800, color: active ? 'var(--on-primary)' : 'var(--muted)' }}>
                    {r.name
                      .split(' ')
                      .map((w) => w[0])
                      .slice(0, 2)
                      .join('')}
                  </span>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 2, flex: 1 }}>
                  <span style={{ fontSize: 13.5, fontWeight: 700 }}>{r.name}</span>
                  {hasWordSync(r.id) && (
                    <span style={{ fontSize: 10, fontWeight: 700, color: 'var(--primary)' }}>Highlight kata saat dibaca</span>
                  )}
                </div>
                <div
                  onClick={(e) => togglePreview(e, r.id)}
                  role="button"
                  aria-label={isPlaying ? `Hentikan contoh suara ${r.name}` : `Dengar contoh suara ${r.name}`}
                  style={{
                    width: 30,
                    height: 30,
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                    background: isPlaying ? 'var(--accent)' : 'var(--card)',
                    opacity: audioFull ? 1 : 0.4,
                  }}
                >
                  {isPlaying ? (
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor" stroke="none" style={{ color: 'var(--primary-dark)' }}><rect x="6" y="5" width="4" height="14" rx="1" /><rect x="14" y="5" width="4" height="14" rx="1" /></svg>
                  ) : (
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor" stroke="none" style={{ color: 'var(--muted)' }}><path d="M8 5.5v13l11-6.5-11-6.5Z" /></svg>
                  )}
                </div>
                <div
                  style={{
                    width: 22,
                    height: 22,
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                    background: active ? 'var(--primary)' : 'transparent',
                    border: active ? 'none' : '1.5px solid var(--border)',
                  }}
                >
                  {active && (
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="var(--on-primary)"><path d="M5 12.5 10 17 19 7" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" /></svg>
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
