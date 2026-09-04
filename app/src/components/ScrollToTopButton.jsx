import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';

// A floating "back to top" button for the app's longer list pages
// (SurahList's 114 surah, Doa's feed, Notifikasi's log) — none of them
// had any way back to the top short of manually scrolling all the way up.
// Same window-scroll-threshold + portal-to-document.body pattern as
// StickyMiniHeader.jsx (avoids the containing-block bug documented in
// CLAUDE.md for fixed-position elements nested under .screen).
const SHOW_THRESHOLD = 400;

export default function ScrollToTopButton() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    function onScroll() {
      setVisible(window.scrollY > SHOW_THRESHOLD);
    }
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  function handleClick() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  return createPortal(
    <button
      onClick={handleClick}
      aria-label="Kembali ke atas"
      style={{
        position: 'fixed',
        // Sits just above BottomNav's floating pill (which itself sits
        // above env(safe-area-inset-bottom)) on nav-bearing pages, and
        // still clears the safe area on pages without one.
        bottom: 'calc(84px + env(safe-area-inset-bottom))',
        right: 20,
        zIndex: 18,
        width: 42,
        height: 42,
        borderRadius: '50%',
        border: 'none',
        background: 'var(--card)',
        boxShadow: 'var(--shadow-card)',
        color: 'var(--primary)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: 'pointer',
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0) scale(1)' : 'translateY(8px) scale(0.85)',
        pointerEvents: visible ? 'auto' : 'none',
        transition: 'opacity 0.2s ease, transform 0.2s ease',
      }}
    >
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor">
        <path d="M12 19V5M5 12l7-7 7 7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </button>,
    document.body
  );
}
