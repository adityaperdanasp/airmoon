import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PageHeaderPhoto from '../components/PageHeaderPhoto';
import { PAGE_PHOTOS } from '../data/photos';
import { isNativeApp } from '../lib/notifications';

// Preview clips are ~14s trims of the real adzan recordings (source:
// github.com/achaudhry/adhan), re-encoded to 80kbps mono and bundled as
// static assets under public/adzan-preview/ instead of streamed from
// jsDelivr. The full tracks are ~5MB each — fine for actual playback at
// prayer time, but way too much just to preview a voice: jsDelivr's edge
// cache also has to fetch cold from GitHub on a miss, so the "listen
// first" tap could take up to ~5s before any sound came out. Same-origin
// 140KB clips start in well under a second.
const SOUNDS = [
  {
    name: 'Adzan Makkah',
    sub: 'Masjidil Haram',
    preview: '/adzan-preview/makkah.mp3',
  },
  {
    name: 'Adzan Madinah',
    sub: 'Masjid Nabawi',
    preview: '/adzan-preview/madinah.mp3',
  },
  {
    name: 'Adzan Mishary Rasyid',
    sub: 'Al-Afasy',
    preview: '/adzan-preview/mishary-rasyid.mp3',
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
        <PageHeaderPhoto title="Suara Adzan" photo={PAGE_PHOTOS.pilihAdzan} />
        {!isNativeApp() && (
          <div style={{ padding: '10px 14px', borderRadius: 12, background: 'var(--cream)', fontSize: 11, color: 'var(--gold-ink-dark)', lineHeight: 1.5 }}>
            Di web/PWA, pilihan di sini cuma buat preview — belum bisa ngatur suara notifikasi adzan yang beneran (keterbatasan browser). Buat suara adzan asli, pasang aplikasi Android airmoon.
          </div>
        )}
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
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="var(--on-primary)" stroke="none"><rect x="6" y="5" width="4" height="14" rx="1" /><rect x="14" y="5" width="4" height="14" rx="1" /></svg>
                  ) : (
                    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke={active ? 'var(--on-primary)' : 'var(--muted)'}>
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
                  {active && <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="var(--on-primary)"><path d="M5 12.5 10 17 19 7" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" /></svg>}
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
