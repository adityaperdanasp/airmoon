import { useEffect, useRef, useState } from 'react';
import { drawQuoteCard } from '../lib/quoteCardCanvas';
import { canvasToFile } from '../lib/ayatCardCanvas';
import { useTheme } from '../context/ThemeContext';
import { shareFile } from '../lib/share';
import { useEscapeKey } from '../lib/useEscapeKey';
import Portal from './Portal';

// A shareable "Kutipan Inspirasi" card preview — same shape as
// AyatCardModal.jsx (renders the same canvas used for sharing/
// downloading directly on screen, portalled to document.body), built as
// its own component rather than generalizing AyatCardModal itself since
// the two draw functions take a genuinely different shape (a quote's
// `source` is already a formatted string, an ayat's `chapterName`/`verse`
// aren't).
export default function QuoteCardModal({ quote, quoteIndex, onClose }) {
  const canvasRef = useRef(null);
  const { theme } = useTheme();
  const [ready, setReady] = useState(false);
  const [busy, setBusy] = useState(false);
  useEscapeKey(onClose);

  useEffect(() => {
    let cancelled = false;
    setReady(false);
    drawQuoteCard(canvasRef.current, {
      arabic: quote.arabic,
      translation: quote.id,
      source: quote.source,
      quoteIndex,
      theme,
    }).then(() => {
      if (!cancelled) setReady(true);
    });
    return () => {
      cancelled = true;
    };
  }, [quote, quoteIndex, theme]);

  function handleDownload() {
    canvasRef.current.toBlob((blob) => {
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `kutipan-${quoteIndex + 1}.png`;
      a.click();
      URL.revokeObjectURL(url);
    }, 'image/png');
  }

  async function handleShare() {
    setBusy(true);
    try {
      const file = await canvasToFile(canvasRef.current, `kutipan-${quoteIndex + 1}.png`);
      await shareFile({ file, title: 'Kutipan dari airmoon', onFallback: handleDownload });
    } finally {
      setBusy(false);
    }
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
