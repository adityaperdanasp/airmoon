import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { NavLink, useLocation } from 'react-router-dom';
import { useLang } from '../context/LangContext';
import { IconHome, IconBook, IconHeart, IconKaaba, IconGrid } from './icons';
import { watchHasNewDoa, watchHasNewDonasi } from '../lib/unseenBadges';

function Dot() {
  return (
    <span
      aria-hidden="true"
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

export default function BottomNav() {
  const { t } = useLang();
  const location = useLocation();
  // Home surfaces both doa and donation feeds (see Home.jsx), so it badges
  // on either being new; Donasi only cares about new campaigns. Neither
  // is a real read/unread system — see lib/unseenBadges.js.
  const [hasNewDoa, setHasNewDoa] = useState(false);
  const [hasNewDonasi, setHasNewDonasi] = useState(false);

  useEffect(() => watchHasNewDoa(setHasNewDoa), []);
  useEffect(() => watchHasNewDonasi(setHasNewDonasi), []);

  // Mirrors each NavLink's own exact-match `end` behavior (so the sliding
  // pill only ever sits under a tab NavLink itself would also mark
  // active) rather than duplicating react-router's own active-matching
  // logic — a sub-route like /quran/2 or /lainnya/kiblat intentionally
  // shows no tab as active, same as before this component tracked an
  // index at all.
  const activeIndex = ITEMS.findIndex((it) => location.pathname === it.to);

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
            style={{
              position: 'absolute',
              top: 6,
              bottom: 6,
              left: `calc(${(100 / ITEMS.length) * activeIndex}% + 4px)`,
              width: `calc(${100 / ITEMS.length}% - 8px)`,
              borderRadius: 999,
              background: 'var(--mint)',
              transition: 'left 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
            }}
          />
        )}
        {ITEMS.map(({ to, Icon, labelKey, prefetch }) => (
          <NavLink
            key={to}
            to={to}
            end
            className={({ isActive }) => `nav-item${isActive ? ' active' : ''}`}
            style={{ flex: 1, position: 'relative', zIndex: 1 }}
            onMouseEnter={prefetch}
            onTouchStart={prefetch}
          >
            <span style={{ position: 'relative', display: 'inline-flex' }}>
              <Icon strokeWidth="1.8" />
              {to === '/' && (hasNewDoa || hasNewDonasi) && <Dot />}
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
