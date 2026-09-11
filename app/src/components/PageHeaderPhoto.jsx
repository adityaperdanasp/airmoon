import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { IconBack } from './icons';
import { useTheme } from '../context/ThemeContext';
import FadeImage from './FadeImage';

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

// data/photos.js's PAGE_PHOTOS are all daylight shots — in dark theme
// they used to just sit under a heavier overlay (see the gradient note
// below), which dims but never actually makes a bright-sky photo read as
// "night". Until there's a real dark page-photography set, swap in one of
// the genuinely-dark assets we do have (the Home dusk set + the dark
// login hero), picked deterministically off the light path so each page
// keeps a stable dark banner rather than changing under someone.
const DARK_BANNERS = ['/photos/home-dark-1.jpg', '/photos/home-dark-2.jpg', '/photos/login-dark.jpg'];
function resolvePhoto(photo, theme) {
  if (theme !== 'dark' || !photo || photo.includes('-dark')) return photo;
  let h = 0;
  for (let i = 0; i < photo.length; i++) h = (h * 31 + photo.charCodeAt(i)) >>> 0;
  return DARK_BANNERS[h % DARK_BANNERS.length];
}

// [UI 2026-09-11] This 130px-tall banner crops each photo to a very
// short, very wide slice — plain `object-position: center` (the
// previous default) puts that slice at the photo's exact vertical
// midpoint, which for a dome/minaret shot taken from below is often
// mostly empty sky, not the actual building. Checked each PAGE_PHOTOS
// image directly (not guessed) and only 2 needed a real override:
// page-kiblat.jpg's dome+minaret sit in the lower ~85% of the frame
// (center crop shows mostly sky), page-cari-masjid.jpg's ornate teal-
// tiled band sits in the upper half with a plain wall filling the
// bottom (center crop lands right on that wall). Every other page photo
// already reads fine at plain center.
const OBJECT_POSITION = {
  '/photos/page-kiblat.jpg': 'center 80%',
  '/photos/page-cari-masjid.jpg': 'center 25%',
  '/photos/page-zakat.jpg': 'center 78%', // the Green Dome itself sits in the lower third; center crop mostly shows minaret shaft + sky
};

export default function PageHeaderPhoto({ title, photo, subtitle, showBack = true, right }) {
  const navigate = useNavigate();
  const { theme } = useTheme();
  const { elRef, shift } = usePhotoParallax();
  return (
    <div ref={elRef} style={{ position: 'relative', height: 130, borderRadius: 22, overflow: 'hidden' }}>
      <FadeImage
        src={resolvePhoto(photo, theme)}
        alt=""
        style={{
          position: 'absolute',
          inset: -MAX_SHIFT,
          width: `calc(100% + ${MAX_SHIFT * 2}px)`,
          height: `calc(100% + ${MAX_SHIFT * 2}px)`,
          objectFit: 'cover',
          objectPosition: OBJECT_POSITION[photo] || 'center',
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
