import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { IconBack } from './icons';
import { useTheme } from '../context/ThemeContext';

// Gentle parallax: the photo itself scrolls slightly slower than the page
// (translateY at a fraction of window.scrollY, clamped to a small max so
// the photo never visibly detaches from its 130px frame) — a plain static
// banner previously felt flat compared to the rest of this batch's
// scroll-reactive touches (StickyMiniHeader, PullToRefresh). Window-level
// scroll listener, not a container ref — .screen/.screen-content have no
// overflow rule of their own, the document itself is what scrolls.
const MAX_SHIFT = 18;

function usePhotoParallax() {
  const [shift, setShift] = useState(0);
  const elRef = useRef(null);

  useEffect(() => {
    if (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) return;
    function onScroll() {
      const el = elRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      // Only worth computing while the banner is anywhere near the
      // viewport — this fires on every scroll tick across the whole app.
      if (rect.bottom < -50 || rect.top > window.innerHeight + 50) return;
      const clamped = Math.max(-MAX_SHIFT, Math.min(MAX_SHIFT, window.scrollY * 0.25));
      setShift(clamped);
    }
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return { elRef, shift };
}

// A photo banner replacing the plain TopBar on a handful of content
// pages (Arah Kiblat, Jadwal Sholat, Cari Masjid, Zakat, ...) — per an
// explicit ask to bring in the founder's own Islamic-architecture
// photography rather than leaving these pages as plain text headers.
// Back button + title are overlaid directly on the photo instead of
// using the shared TopBar, so this fully replaces it (don't render both
// on the same page).
export default function PageHeaderPhoto({ title, photo, subtitle, showBack = true, right }) {
  const navigate = useNavigate();
  const { theme } = useTheme();
  const { elRef, shift } = usePhotoParallax();
  return (
    <div ref={elRef} style={{ position: 'relative', height: 130, borderRadius: 22, overflow: 'hidden' }}>
      <img
        src={photo}
        alt=""
        style={{
          position: 'absolute',
          inset: -MAX_SHIFT,
          width: `calc(100% + ${MAX_SHIFT * 2}px)`,
          height: `calc(100% + ${MAX_SHIFT * 2}px)`,
          objectFit: 'cover',
          transform: `translateY(${shift}px)`,
        }}
      />
      <div
        style={{
          position: 'absolute',
          inset: 0,
          // Dark theme's own near-black page background (--bg: #0b0c0a)
          // made this same light-mode overlay read as a jarringly bright
          // rectangle floating in an otherwise dark UI — a daylight photo
          // barely dimmed at the top (10% opacity) next to near-black
          // everywhere else. Darkened further in dark mode (matching the
          // same theme-aware treatment Home.jsx's own header photo
          // already has) so the photo dims into the surrounding UI
          // instead of fighting it.
          background:
            theme === 'dark'
              ? 'linear-gradient(180deg, rgba(0,0,0,0.35) 0%, rgba(0,0,0,0.78) 100%)'
              : 'linear-gradient(180deg, rgba(10,20,15,0.1) 0%, rgba(10,20,15,0.62) 100%)',
        }}
      />
      <div
        style={{
          position: 'absolute',
          inset: 0,
          display: 'flex',
          alignItems: 'flex-end',
          justifyContent: 'space-between',
          padding: '14px 18px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, minWidth: 0 }}>
          {showBack && (
            <button
              onClick={() => navigate(-1)}
              aria-label="Kembali"
              style={{
                width: 32,
                height: 32,
                borderRadius: '50%',
                background: 'rgba(255,255,255,0.22)',
                border: 'none',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#fff',
                cursor: 'pointer',
                flexShrink: 0,
              }}
            >
              <IconBack />
            </button>
          )}
          <div style={{ minWidth: 0 }}>
            <h1 style={{ margin: 0, fontSize: 17, fontWeight: 800, color: '#fff' }}>{title}</h1>
            {subtitle && <div style={{ fontSize: 11.5, color: 'rgba(255,255,255,0.8)', marginTop: 1 }}>{subtitle}</div>}
          </div>
        </div>
        {right}
      </div>
    </div>
  );
}
