import { useEffect, useRef, useState } from 'react';
import { canvasToFile } from '../lib/ayatCardCanvas';
import { shareFile } from '../lib/share';
import { useEscapeKey } from '../lib/useEscapeKey';
import { downloadCardWallpaper } from '../lib/downloadWallpaper';
import Portal from './Portal';

// The one shared shell behind every canvas share modal (~16 of them).
// They were all near-identical copies of the same ~80 lines — which is
// exactly how one invisible-button bug (white-on-white "Unduh") ended up
// needing the same fix applied to 15 files at once (2026-09-07). Now each
// modal is a thin wrapper that supplies its draw function, its filename,
// and its share title; everything visual lives here, once.
//
// The card's own frame/border is the drawing function's concern, not this
// shell's — see lib/cardFrame.js for the two allowed frame weights.
export default function ShareModalShell({
  draw, // async (canvas, args) => void
  drawArgs, // object passed to draw() and (if wallpaper) downloadCardWallpaper()
  filename, // e.g. 'sejarah-islam.png'
  shareTitle, // e.g. 'Sejarah Islam - airmoon'
  wallpaper = false, // show the 3rd "Lock Screen HP" button
  wallpaperFilename,
  aspectRatio = '1080 / 1350',
  extra = null, // optional controls rendered between the preview and the button row
  footer = null, // optional controls rendered below the button row (e.g. "share as text")
  onClose,
}) {
  const canvasRef = useRef(null);
  const [ready, setReady] = useState(false);
  const [busy, setBusy] = useState(false);
  const [wallpaperBusy, setWallpaperBusy] = useState(false);
  useEscapeKey(onClose);

  // drawArgs is a fresh object literal on every render — serialise it so
  // the redraw effect only fires when a value inside it actually changes.
  const argsKey = JSON.stringify(drawArgs);
  useEffect(() => {
    let cancelled = false;
    setReady(false);
    Promise.resolve(draw(canvasRef.current, drawArgs)).then(() => {
      if (!cancelled) setReady(true);
    });
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [argsKey]);

  function handleDownload() {
    canvasRef.current.toBlob((blob) => {
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      a.click();
      URL.revokeObjectURL(url);
    }, 'image/png');
  }

  async function handleShare() {
    setBusy(true);
    try {
      const file = await canvasToFile(canvasRef.current, filename);
      await shareFile({ file, title: shareTitle, onFallback: handleDownload });
    } finally {
      setBusy(false);
    }
  }

  async function handleWallpaper() {
    setWallpaperBusy(true);
    try {
      await downloadCardWallpaper(
        draw,
        drawArgs,
        wallpaperFilename || filename.replace(/\.png$/, '-lockscreen.png')
      );
    } finally {
      setWallpaperBusy(false);
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
            <canvas ref={canvasRef} style={{ width: '100%', display: 'block', aspectRatio }} />
            {!ready && (
              <div style={{ position: 'absolute', inset: 0, background: 'rgba(10,54,48,0.9)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 14, padding: 32 }}>
                {/* A shimmering placeholder shaped like the card's own
                    logo+title+body layout, not a bare spinner — reads as
                    "the card is arriving", same convention Skeleton.jsx
                    uses elsewhere in the app. */}
                <div className="share-preview-skel" style={{ width: 44, height: 44, borderRadius: '50%' }} />
                <div className="share-preview-skel" style={{ width: '65%', height: 16 }} />
                <div className="share-preview-skel" style={{ width: '85%', height: 12 }} />
                <div className="share-preview-skel" style={{ width: '75%', height: 12 }} />
              </div>
            )}
          </div>

          {extra}

          <div style={{ display: 'flex', gap: 10, width: '100%' }}>
            <button className="btn-outline" style={{ flex: 1, color: '#fff', borderColor: 'rgba(255,255,255,0.4)', background: 'transparent' }} onClick={handleDownload} disabled={!ready}>
              Unduh
            </button>
            <button className="btn" style={{ flex: 1 }} onClick={handleShare} disabled={!ready || busy}>
              {busy ? '...' : 'Bagikan'}
            </button>
          </div>

          {wallpaper && (
            <button
              onClick={handleWallpaper}
              disabled={!ready || wallpaperBusy}
              className="btn-outline"
              style={{ width: '100%', color: '#fff', borderColor: 'rgba(255,255,255,0.4)', background: 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}
            >
              📱 {wallpaperBusy ? 'Menyiapkan...' : 'Unduh buat Lock Screen HP'}
            </button>
          )}

          {footer}

          <button onClick={onClose} style={{ background: 'none', border: 'none', color: '#fff', fontSize: 12.5, fontWeight: 600, cursor: 'pointer', opacity: 0.8 }}>
            Tutup
          </button>
        </div>
      </div>
    </Portal>
  );
}
