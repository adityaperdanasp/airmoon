import { useEffect, useRef, useState } from 'react';
import { drawAyatCard, canvasToFile } from '../lib/ayatCardCanvas';
import { useTheme } from '../context/ThemeContext';
import { shareFile } from '../lib/share';
import Portal from './Portal';

// A shareable "Ayat Card" preview — renders the same canvas used for
// sharing/downloading directly on screen (scaled down via CSS width, the
// backing resolution stays 1080x1350 so the shared/downloaded file is
// still full quality) rather than drawing twice or round-tripping through
// a dataURL <img>. Portalled to document.body — see Portal.jsx's own
// comment for why.
export default function AyatCardModal({ ayat, onClose }) {
  const canvasRef = useRef(null);
  const { theme } = useTheme();
  const [ready, setReady] = useState(false);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    let cancelled = false;
    setReady(false);
    drawAyatCard(canvasRef.current, { ...ayat, theme }).then(() => {
      if (!cancelled) setReady(true);
    });
    return () => {
      cancelled = true;
    };
  }, [ayat, theme]);

  async function handleShare() {
    setBusy(true);
    try {
      const file = await canvasToFile(canvasRef.current, `ayat-${ayat.chapter}-${ayat.verse}.png`);
      await shareFile({ file, title: 'Ayat dari airmoon', onFallback: handleDownload });
    } finally {
      setBusy(false);
    }
  }

  function handleDownload() {
    canvasRef.current.toBlob((blob) => {
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `ayat-${ayat.chapter}-${ayat.verse}.png`;
      a.click();
      URL.revokeObjectURL(url);
    }, 'image/png');
  }

  return (
    <Portal>
    <div
      onClick={onClose}
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(0,0,0,0.6)',
        zIndex: 50,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 16,
        padding: 20,
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16, width: '100%', maxWidth: 340 }}
      >
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
