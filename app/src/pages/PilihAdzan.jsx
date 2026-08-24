import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import TopBar from '../components/TopBar';

// Real preview audio — served via jsDelivr's CDN from the open-source
// achaudhry/adhan repo (github.com/achaudhry/adhan), verified reachable
// and fast. An earlier version pointed at archive.org's /download/
// redirector, which turned out to 503 intermittently — jsDelivr is a
// proper CDN and doesn't have that problem.
const SOUNDS = [
  {
    name: 'Adzan Makkah',
    sub: 'Masjidil Haram',
    preview: 'https://cdn.jsdelivr.net/gh/achaudhry/adhan@master/Adhan-Makkah.mp3',
  },
  {
    name: 'Adzan Madinah',
    sub: 'Masjid Nabawi',
    preview: 'https://cdn.jsdelivr.net/gh/achaudhry/adhan@master/Adhan-Madinah.mp3',
  },
  {
    name: 'Adzan Mishary Rasyid',
    sub: 'Al-Afasy',
    preview: 'https://cdn.jsdelivr.net/gh/achaudhry/adhan@master/Adhan-Mishary-Rashid-Al-Afasy.mp3',
  },
  {
    name: 'Nada Pengingat',
    sub: 'Tanpa suara adzan, cuma beep',
    preview: null,
  },
];

export default function PilihAdzan() {
  const navigate = useNavigate();
  const audioRef = useRef(null);
  const [playing, setPlaying] = useState(null);
  const [previewError, setPreviewError] = useState('');
  const current = localStorage.getItem('airmoon-adzan-sound') || 'Adzan Makkah';

  useEffect(() => () => audioRef.current?.pause(), []);

  function togglePreview(sound, e) {
    e.stopPropagation();
    if (!sound.preview) return;
    setPreviewError('');
    if (playing === sound.name) {
      audioRef.current.pause();
      setPlaying(null);
      return;
    }
    audioRef.current.src = sound.preview;
    audioRef.current.play().catch(() => setPreviewError('Gagal memutar preview, coba lagi.'));
    setPlaying(sound.name);
  }

  function pick(name) {
    localStorage.setItem('airmoon-adzan-sound', name);
    navigate('/jadwal-sholat', { replace: true });
  }

  return (
    <div className="screen">
      <div className="screen-content">
        <TopBar title="Suara Adzan" />
        <p className="muted" style={{ margin: 0, fontSize: 11.5 }}>Ketuk ikon speaker buat dengerin dulu sebelum pilih.</p>
        {previewError && <p style={{ margin: 0, fontSize: 11.5, color: 'var(--danger)' }}>{previewError}</p>}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {SOUNDS.map((s) => {
            const active = s.name === current;
            const isPlaying = playing === s.name;
            return (
              <div
                key={s.name}
                onClick={() => pick(s.name)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 12,
                  padding: '12px 14px',
                  borderRadius: 16,
                  cursor: 'pointer',
                  background: active ? 'var(--cream)' : 'transparent',
                }}
              >
                <button
                  onClick={(e) => togglePreview(s, e)}
                  disabled={!s.preview}
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: 12,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                    border: 'none',
                    cursor: s.preview ? 'pointer' : 'default',
                    background: isPlaying ? 'var(--primary)' : active ? 'var(--primary)' : 'var(--mint-soft)',
                  }}
                  aria-label={`Preview ${s.name}`}
                >
                  {isPlaying ? (
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="#fff" stroke="none"><rect x="6" y="5" width="4" height="14" rx="1" /><rect x="14" y="5" width="4" height="14" rx="1" /></svg>
                  ) : (
                    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke={active ? '#fff' : 'var(--muted)'}>
                      <path d="M11 5 6 9H3v6h3l5 4V5Z" strokeWidth="1.6" strokeLinejoin="round" />
                      {s.preview && <path d="M15.5 9a4.5 4.5 0 0 1 0 6" strokeWidth="1.6" strokeLinecap="round" />}
                    </svg>
                  )}
                </button>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 2, flex: 1 }}>
                  <span style={{ fontSize: 13.5, fontWeight: 700 }}>{s.name}</span>
                  <span style={{ fontSize: 11, color: 'var(--muted)' }}>{s.sub}</span>
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
                  {active && <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#fff"><path d="M5 12.5 10 17 19 7" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" /></svg>}
                </div>
              </div>
            );
          })}
        </div>
        <audio
          ref={audioRef}
          onEnded={() => setPlaying(null)}
          onError={() => {
            setPlaying(null);
            setPreviewError('Gagal memutar preview, coba lagi.');
          }}
          style={{ display: 'none' }}
        />
      </div>
    </div>
  );
}
