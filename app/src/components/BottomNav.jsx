import { useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';
import { useLang } from '../context/LangContext';
import { IconHome, IconBook, IconHeart, IconKaaba } from './icons';
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

export default function BottomNav() {
  const { t } = useLang();
  // Home surfaces both doa and donation feeds (see Home.jsx), so it badges
  // on either being new; Donasi only cares about new campaigns. Neither
  // is a real read/unread system — see lib/unseenBadges.js.
  const [hasNewDoa, setHasNewDoa] = useState(false);
  const [hasNewDonasi, setHasNewDonasi] = useState(false);

  useEffect(() => watchHasNewDoa(setHasNewDoa), []);
  useEffect(() => watchHasNewDonasi(setHasNewDonasi), []);

  const item = (to, Icon, label, showDot) => (
    <NavLink to={to} className={({ isActive }) => `nav-item${isActive ? ' active' : ''}`} end>
      <span style={{ position: 'relative', display: 'inline-flex' }}>
        <Icon strokeWidth="1.8" />
        {showDot && <Dot />}
      </span>
      <span>{label}</span>
    </NavLink>
  );

  return (
    <>
      {/* Fades scrolled content out before it reaches the floating pill below,
          instead of content getting sharply cut off behind it mid-scroll. */}
      <div className="bottomnav-scrim" />
      <nav className="bottomnav">
        {item('/', IconHome, t('nav_home'), hasNewDoa || hasNewDonasi)}
        {item('/quran', IconBook, t('nav_quran'), false)}
        {item('/donasi', IconHeart, t('nav_donasi'), hasNewDonasi)}
        {item('/umroh', IconKaaba, t('nav_umroh'), false)}
      </nav>
    </>
  );
}
