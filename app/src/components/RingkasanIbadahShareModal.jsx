import { useEffect, useRef, useState } from 'react';
import { drawRingkasanIbadahCard } from '../lib/ringkasanIbadahCardCanvas';
import { canvasToFile } from '../lib/ayatCardCanvas';
import { shareFile } from '../lib/share';
import { useEscapeKey } from '../lib/useEscapeKey';
import Portal from './Portal';

// Same shell as RamadanShareModal.jsx/AchievementShareModal.jsx — Ringkasan
// Ibadah had no share option at all despite being the app's most complete
// personal-stats dashboard.
export default function RingkasanIbadahShareModal({ displayName, khatamPct, badgeLabel, totalSedekah, puasaCount, readingStreakDays, theme, onClose }) {
  const canvasRef = useRef(null);
  const [ready, setReady] = useState(false);
  const [busy, setBusy] = useState(false);
  useEscapeKey(onClose);

  useEffect(() => {
    let cancelled = false;
    setReady(false);
    drawRingkasanIbadahCard(canvasRef.current, { displayName, khatamPct, badgeLabel, totalSedekah, puasaCount, readingStreakDays, theme }).then(() => {
      if (!cancelled) setReady(true);
    });
    return () => {
      cancelled = true;
    };
  }, [displayName, khatamPct, badgeLabel, totalSedekah, puasaCount, readingStreakDays, theme]);

  function handleDownload() {
    canvasRef.current.toBlob((blob) => {
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'ringkasan-ibadah.png';
      a.click();
      URL.revokeObjectURL(url);
    }, 'image/png');
  }

  async function handleShare() {
    setBusy(true);
    try {
      const file = await canvasToFile(canvasRef.current, 'ringkasan-ibadah.png');
      await shareFile({ file, title: 'Ringkasan Ibadah - airmoon', onFallback: handleDownload });
    } finally {
      setBusy(false);
    }
  }

  return (
    <Portal>
      <div
        onClick={onClose}
        style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', zIndex: 50, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 16, padding: 20 }}
      >
        <div onClick={(e) => e.stopPropagation()} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16, width: '100%', maxWidth: 340 }}>
          <div style={{ position: 'relative', width: '100%', borderRadius: 18, overflow: 'hidden', boxShadow: '0 20px 40px rgba(0,0,0,0.4)' }}>
            <canvas ref={canvasRef} style={{ width: '100%', display: 'block', aspectRatio: '1080 / 1350' }} />
            {!ready && (
              <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(10,54,48,0.9)' }}>
                <div className="spinner" style={{ borderTopColor: '#fff' }} />
              </div>
            )}
          </div>

          <div style={{ display: 'flex', gap: 10, width: '100%' }}>
            <button className="btn-outline" style={{ flex: 1, color: '#fff', borderColor: 'rgba(255,255,255,0.4)' }} onClick={handleDownload} disabled={!ready}>
              Unduh
            </button>
            <button className="btn" style={{ flex: 1 }} onClick={handleShare} disabled={!ready || busy}>
              {busy ? '...' : 'Bagikan'}
            </button>
          </div>

          <button onClick={onClose} style={{ background: 'none', border: 'none', color: '#fff', fontSize: 12.5, fontWeight: 600, cursor: 'pointer', opacity: 0.8 }}>
            Tutup
          </button>
        </div>
      </div>
    </Portal>
  );
}
