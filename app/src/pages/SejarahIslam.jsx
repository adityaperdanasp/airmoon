import { useState } from 'react';
import { useTheme } from '../context/ThemeContext';
import { ISLAMIC_HISTORY, todaysHistoryIndex } from '../data/islamicHistory';
import { DECORATIVE_PHOTOS_LIGHT, DECORATIVE_PHOTOS_DARK } from '../data/photos';
import TopBar from '../components/TopBar';
import SejarahIslamShareModal from '../components/SejarahIslamShareModal';

// "Hari Ini dalam Sejarah Islam" — same day-of-year rotation pattern as
// KutipanInspirasi.jsx, but fully local content (data/islamicHistory.js
// has its own honesty caveat about needing a human check against a
// mu'tabar source — same standard already applied to asmaulHusna.js).
export default function SejarahIslam() {
  const { theme } = useTheme();
  const [idx, setIdx] = useState(todaysHistoryIndex());
  const [browsing, setBrowsing] = useState(false);
  const [showCardModal, setShowCardModal] = useState(false);
  const entry = ISLAMIC_HISTORY[idx];
  const photoPool = theme === 'dark' ? DECORATIVE_PHOTOS_DARK : DECORATIVE_PHOTOS_LIGHT;

  return (
    <div className="screen">
      <div className="screen-content">
        <TopBar
          title="Sejarah Islam"
          subtitle="Mengenang peristiwa penting umat Islam"
          right={
            <button className="icon-btn" onClick={() => setBrowsing((v) => !v)} aria-label="Jelajah semua peristiwa" title="Jelajah semua peristiwa">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <rect x="3" y="3" width="7" height="7" rx="1.5" strokeWidth="1.6" />
                <rect x="14" y="3" width="7" height="7" rx="1.5" strokeWidth="1.6" />
                <rect x="3" y="14" width="7" height="7" rx="1.5" strokeWidth="1.6" />
                <rect x="14" y="14" width="7" height="7" rx="1.5" strokeWidth="1.6" />
              </svg>
            </button>
          }
        />

        <div style={{ padding: '10px 14px', borderRadius: 12, background: 'var(--cream)', fontSize: 11, color: 'var(--gold-ink-dark)', lineHeight: 1.5 }}>
          Tahun yang ditampilkan adalah perkiraan Hijriah dari catatan sejarah umum, bukan tanggal pasti — konten ini belum diverifikasi ke rujukan sejarah yang mu'tabar.
        </div>

        {browsing && (
          <div className="card" style={{ padding: 8, display: 'flex', flexDirection: 'column', gap: 2, maxHeight: 320, overflowY: 'auto' }}>
            {ISLAMIC_HISTORY.map((h, i) => (
              <button
                key={h.title}
                onClick={() => {
                  setIdx(i);
                  setBrowsing(false);
                }}
                style={{
                  textAlign: 'left',
                  padding: '10px 10px',
                  borderRadius: 10,
                  border: 'none',
                  background: i === idx ? 'var(--mint-soft)' : 'transparent',
                  cursor: 'pointer',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 1,
                }}
              >
                <span style={{ fontSize: 12.5, fontWeight: 700, color: 'var(--ink)' }}>{h.title}</span>
                <span style={{ fontSize: 10.5, color: 'var(--muted)' }}>{h.year}</span>
              </button>
            ))}
          </div>
        )}

        <div
          style={{
            position: 'relative',
            overflow: 'hidden',
            borderRadius: 24,
            padding: '30px 24px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: 280,
          }}
        >
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
                  ? 'linear-gradient(160deg, rgba(11,12,10,0.6) 0%, rgba(11,12,10,0.92) 100%)'
                  : 'linear-gradient(160deg, rgba(13,77,71,0.68) 0%, rgba(13,77,71,0.9) 100%)',
            }}
          />
          <div style={{ position: 'relative', zIndex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12, textAlign: 'center' }}>
            <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--accent)', letterSpacing: '0.04em', textTransform: 'uppercase' }}>
              {entry.year}
            </span>
            <span style={{ fontSize: 19, fontWeight: 800, color: '#fff', lineHeight: 1.3 }}>{entry.title}</span>
            <span style={{ fontSize: 13, lineHeight: 1.7, color: 'rgba(255,255,255,0.88)' }}>{entry.text}</span>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <span style={{ fontSize: 11, color: 'var(--muted)' }}>
            Peristiwa {idx + 1} dari {ISLAMIC_HISTORY.length}
          </span>
        </div>

        <div style={{ display: 'flex', gap: 10 }}>
          <button className="btn-outline" style={{ flex: 'none', padding: '0 16px' }} onClick={() => setIdx((i) => (i - 1 + ISLAMIC_HISTORY.length) % ISLAMIC_HISTORY.length)} aria-label="Sebelumnya">
            ←
          </button>
          <button className="btn-outline" style={{ flex: 1 }} onClick={() => setIdx((i) => (i + 1) % ISLAMIC_HISTORY.length)}>
            Berikutnya
          </button>
          <button className="btn" style={{ flex: 1 }} onClick={() => setShowCardModal(true)}>
            Bagikan
          </button>
        </div>
      </div>

      {showCardModal && (
        <SejarahIslamShareModal
          title={entry.title}
          year={entry.year}
          text={entry.text}
          photoIndex={idx}
          theme={theme}
          onClose={() => setShowCardModal(false)}
        />
      )}
    </div>
  );
}
