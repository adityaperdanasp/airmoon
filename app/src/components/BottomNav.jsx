import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { useLang } from '../context/LangContext';
import { IconHome, IconBook, IconHeart, IconKaaba, IconGrid } from './icons';
import { watchHasNewDonasi } from '../lib/unseenBadges';

function Dot() {
  return (
    <span
      aria-hidden="true"
      className="unseen-dot"
      style={{
        position: 'absolute',
        top: -1,
        right: -3,
        width: 8,
        height: 8,
        borderRadius: '50%',
        background: 'var(--danger)',
        border: '1.5px solid var(--bg)',
      }}
    />
  );
}

// Tasbih, Ayat Favorit, Kiblat, Kalkulator Zakat, and 6 more real features
// used to be reachable only through a single small "Lihat Semua" text link
// buried in Home's Layanan section — nothing in the persistent bottom nav
// pointed at them at all. Added as a 5th tab rather than swapping out one
// of the original 4 (Home/Qur'an/Donasi/Umroh were a settled design
// decision from earlier iteration — this is additive, not a replacement).
const ITEMS = [
  { to: '/', Icon: IconHome, labelKey: 'nav_home', prefetch: () => import('../pages/Home') },
  { to: '/quran', Icon: IconBook, labelKey: 'nav_quran', prefetch: () => import('../pages/SurahList') },
  { to: '/donasi', Icon: IconHeart, labelKey: 'nav_donasi', prefetch: () => import('../pages/Donasi') },
  { to: '/umroh', Icon: IconKaaba, labelKey: 'nav_umroh', prefetch: () => import('../pages/Umroh') },
  { to: '/lainnya', Icon: IconGrid, labelKey: 'nav_lainnya', prefetch: () => import('../pages/Lainnya') },
];

// Hold the Qur'an tab to jump straight back to where you stopped reading
// (Home stores that route in localStorage each time it loads your bookmark).
const RESUME_KEY = 'airmoon-quran-resume';
function quranResumeRoute() {
  try {
    return localStorage.getItem(RESUME_KEY) || null;
  } catch {
    return null;
  }
}

// True when the touch started inside something that scrolls sideways (a chip
// row, a carousel) — those swipes belong to that element, not tab switching.
function insideHorizontalScroller(el) {
  for (let n = el; n && n !== document.body; n = n.parentElement) {
    const ox = getComputedStyle(n).overflowX;
    if ((ox === 'auto' || ox === 'scroll') && n.scrollWidth > n.clientWidth + 2) return true;
  }
  return false;
}

export default function BottomNav() {
  const { t } = useLang();
  const location = useLocation();
  const navigate = useNavigate();
  const holdTimer = useRef(null);
  const heldRef = useRef(false);
  // Home shows the donation feed, so it badges on a new campaign (same as
  // Donasi); the new-doa dot moved to Home's "Doa & Aminkan" tile along
  // with the feed itself. Neither is a real read/unread system — see
  // lib/unseenBadges.js.
  const [hasNewDonasi, setHasNewDonasi] = useState(false);

  useEffect(() => watchHasNewDonasi(setHasNewDonasi), []);

  // Mirrors each NavLink's own exact-match `end` behavior (so the sliding
  // pill only ever sits under a tab NavLink itself would also mark
  // active) rather than duplicating react-router's own active-matching
  // logic — a sub-route like /quran/2 or /lainnya/kiblat intentionally
  // shows no tab as active, same as before this component tracked an
  // index at all.
  const activeIndex = ITEMS.findIndex((it) => location.pathname === it.to);

  // Swipe left/right anywhere on a main tab page to move to the next/previous tab.
  useEffect(() => {
    if (activeIndex < 0) return undefined;
    let start = null;
    const down = (e) => {
      const t0 = e.touches[0];
      start = insideHorizontalScroller(e.target) ? null : { x: t0.clientX, y: t0.clientY };
    };
    const up = (e) => {
      if (!start) return;
      const t1 = e.changedTouches[0];
      const dx = t1.clientX - start.x;
      const dy = t1.clientY - start.y;
      start = null;
      if (Math.abs(dx) < 90 || Math.abs(dy) > 45 || Math.abs(dx) < Math.abs(dy) * 2.5) return;
      const next = ITEMS[activeIndex + (dx < 0 ? 1 : -1)];
      if (next) navigate(next.to, { viewTransition: true });
    };
    document.addEventListener('touchstart', down, { passive: true });
    document.addEventListener('touchend', up, { passive: true });
    return () => {
      document.removeEventListener('touchstart', down);
      document.removeEventListener('touchend', up);
    };
  }, [activeIndex, navigate]);

  // Portalled straight to document.body (2026-09-04) — reported bug: the
  // floating pill would sometimes end up dragged up and stuck mid-screen,
  // blocking content. `position: fixed` only resolves against the true
  // viewport as long as *no ancestor* has a transform/filter/perspective/
  // will-change/contain — any one of those on any ancestor (this nav
  // used to render as a child of .screen, which picks up new CSS often as
  // this app evolves) silently turns "fixed" into "fixed relative to that
  // ancestor's box" instead, which for a tall scrollable page reads
  // exactly like "the nav floats up and gets stuck partway down the
  // screen." Rendering into document.body — a sibling of #root itself —
  // makes this immune to that class of bug regardless of what .screen or
  // any other ancestor does in the future, rather than auditing every
  // future CSS change by hand.
  return createPortal(
    <>
      {/* Fades scrolled content out before it reaches the floating pill below,
          instead of content getting sharply cut off behind it mid-scroll. */}
      <div className="bottomnav-scrim" />
      <nav className="bottomnav">
        {activeIndex >= 0 && (
          <div
            aria-hidden="true"
            className="nav-indicator"
            style={{
              left: `calc(${(100 / ITEMS.length) * activeIndex}% + 4px)`,
              width: `calc(${100 / ITEMS.length}% - 8px)`,
            }}
          />
        )}
        {ITEMS.map(({ to, Icon, labelKey, prefetch }) => (
          <NavLink
            key={to}
            to={to}
            end
            viewTransition
            className={({ isActive }) => `nav-item${isActive ? ' active' : ''}`}
            style={{ flex: 1, position: 'relative', zIndex: 1 }}
            onMouseEnter={prefetch}
            onTouchStart={(e) => {
              prefetch();
              if (to === '/quran' && quranResumeRoute()) {
                heldRef.current = false;
                clearTimeout(holdTimer.current);
                holdTimer.current = setTimeout(() => {
                  heldRef.current = true;
                  navigate(quranResumeRoute(), { viewTransition: true });
                }, 550);
              }
              e.stopPropagation();
            }}
            onTouchEnd={() => clearTimeout(holdTimer.current)}
            onTouchMove={() => clearTimeout(holdTimer.current)}
            onClick={(e) => {
              if (heldRef.current) {
                e.preventDefault();
                heldRef.current = false;
              }
            }}
          >
            <span className="nav-icon" style={{ position: 'relative', display: 'inline-flex' }}>
              <Icon strokeWidth={location.pathname === to ? '2.1' : '1.7'} />
              {to === '/' && hasNewDonasi && <Dot />}
              {to === '/donasi' && hasNewDonasi && <Dot />}
            </span>
            <span>{t(labelKey)}</span>
          </NavLink>
        ))}
      </nav>
    </>,
    document.body
  );
}
