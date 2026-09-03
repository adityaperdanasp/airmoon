import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';

// A compact header that slides in once the page's own hero/topbar has
// scrolled past — SurahReader/MushafReader/DoaHarian are long enough that
// scrolling even a short way loses all context of which surah/page/
// category is even being read. Portalled to document.body, same
// containing-block-bug precedent as BottomNav/ConfirmDialog/etc (see
// CLAUDE.md's "floating BottomNav pill" bug note) — a plain fixed child
// of .screen risks silently breaking the instant a future edit adds a
// transform/filter/will-change ancestor.
//
// Listens on `window` scroll, not a container ref — .screen/.screen-content
// have no overflow rule of their own (confirmed in theme.css), so the
// actual scrolling happens at the document level for every page this is
// used on.
const SHOW_THRESHOLD = 160;

export default function StickyMiniHeader({ title, subtitle, visible: forceVisible }) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    function onScroll() {
      setScrolled(window.scrollY > SHOW_THRESHOLD);
    }
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const show = forceVisible ?? scrolled;

  return createPortal(
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 20,
        display: 'flex',
        justifyContent: 'center',
        pointerEvents: show ? 'auto' : 'none',
        opacity: show ? 1 : 0,
        transform: show ? 'translateY(0)' : 'translateY(-100%)',
        transition: 'opacity 0.2s ease, transform 0.2s ease',
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: 480,
          padding: 'calc(10px + env(safe-area-inset-top)) 20px 10px',
          background: 'var(--card)',
          borderBottom: '1px solid var(--border)',
          boxShadow: 'var(--shadow-card)',
          display: 'flex',
          flexDirection: 'column',
          gap: 1,
        }}
      >
        <span style={{ fontSize: 13.5, fontWeight: 800, color: 'var(--ink)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
          {title}
        </span>
        {subtitle && <span style={{ fontSize: 10.5, color: 'var(--muted)' }}>{subtitle}</span>}
      </div>
    </div>,
    document.body
  );
}
