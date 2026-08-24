import { NavLink } from 'react-router-dom';
import { useLang } from '../context/LangContext';
import { IconHome, IconBook, IconHeart, IconKaaba } from './icons';

export default function BottomNav() {
  const { t } = useLang();
  const item = (to, Icon, label) => (
    <NavLink to={to} className={({ isActive }) => `nav-item${isActive ? ' active' : ''}`} end>
      <Icon strokeWidth="1.8" />
      <span>{label}</span>
    </NavLink>
  );
  return (
    <nav className="bottomnav">
      {item('/', IconHome, t('nav_home'))}
      {item('/quran', IconBook, t('nav_quran'))}
      {item('/donasi', IconHeart, t('nav_donasi'))}
      {item('/umroh', IconKaaba, t('nav_umroh'))}
    </nav>
  );
}
