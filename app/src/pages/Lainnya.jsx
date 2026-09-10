import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useLang } from '../context/LangContext';
import TopBar from '../components/TopBar';
import { getRecentLainnya, markLainnyaVisited } from '../lib/recentLainnya';
import { hasUnseenNotifications } from '../lib/notificationLog';
import { hasUnseenChangelog } from '../lib/changelogSeen';
import {
  QiblaCompassIcon,
  CalculatorIcon,
  TasbihIcon,
  TasbihCounterIcon,
  FavoriteAyatIcon,
  HijriCalendarIcon,
  GreetingCardIcon,
  CuppedHandsIcon,
  ScrollIcon,
  LiveKaabaIcon,
  LanternIcon,
  UmrohIcon,
  NotificationBellIcon,
  GlobalSearchIcon,
  InheritanceScaleIcon,
  WhatsNewIcon,
  HistoryBookIcon,
  PuasaSunnahIcon,
  StatsIcon,
  AmalanCalendarIcon,
} from '../components/serviceIcons';

// All hand-drawn gradient icons (see serviceIcons.jsx) — this grid used
// to mix in platform emoji (📿🗓️💌🤲📜🎥🌙) and one stray raster.
//
// [UI 2026-09-10] Grouped into labelled sections. The grid grew from 12
// tiles to 20 (every feature batch dropped its new tile at the end with
// no logic), turning "find the one I want" into a scan of the whole page.
// Sections are by user intent — daily practice vs. dashboards vs. reading
// vs. calculators vs. place/travel vs. odds-and-ends — so someone can jump
// to the right neighbourhood first. All icons are size 30, uniformly (the
// Kiblat compass was a lone size-33 outlier that read as slightly-off in
// a row of otherwise-matched tiles).
const SECTIONS = [
  {
    title: 'Ibadah Harian',
    items: [
      { to: '/lainnya/doa-harian', key: 'item_doa_harian', bg: 'var(--mint)', node: <CuppedHandsIcon size={30} /> },
      { to: '/lainnya/tasbih', key: 'item_tasbih', bg: 'var(--peach)', node: <TasbihCounterIcon size={30} /> },
      { to: '/lainnya/ayat-favorit', key: 'item_ayat_favorit', bg: 'var(--cream)', node: <FavoriteAyatIcon size={30} /> },
      { to: '/lainnya/puasa-sunnah', label: 'Puasa Sunnah', bg: 'var(--blue-gray)', node: <PuasaSunnahIcon size={30} /> },
      { to: '/lainnya/mode-ramadan', key: 'item_ramadan', bg: 'var(--mint)', node: <LanternIcon size={30} /> },
    ],
  },
  {
    title: 'Progres Ibadah',
    items: [
      { to: '/lainnya/ringkasan-ibadah', label: 'Ringkasan Ibadah', bg: 'var(--peach)', node: <StatsIcon size={30} /> },
      { to: '/lainnya/kalender-ibadah', label: 'Kalender Ibadah', bg: 'var(--cream)', node: <AmalanCalendarIcon size={30} /> },
    ],
  },
  {
    title: 'Ilmu & Bacaan',
    items: [
      { to: '/lainnya/asmaul-husna', key: 'item_asmaul_husna', bg: 'var(--mint)', node: <TasbihIcon size={30} /> },
      { to: '/lainnya/sejarah-islam', label: 'Sejarah Islam', bg: 'var(--peach)', node: <HistoryBookIcon size={30} /> },
      { to: '/lainnya/kutipan-inspirasi', key: 'item_kutipan_inspirasi', bg: 'var(--cream)', node: <ScrollIcon size={30} /> },
    ],
  },
  {
    title: 'Alat Hitung',
    items: [
      { to: '/lainnya/kalkulator-zakat', key: 'item_kalkulator_zakat', bg: 'var(--peach)', node: <CalculatorIcon size={30} /> },
      { to: '/lainnya/kalkulator-waris', label: 'Kalkulator Waris', bg: 'var(--blue-gray)', node: <InheritanceScaleIcon size={30} /> },
      { to: '/lainnya/kalender-hijriah', key: 'item_kalender_hijriah', bg: 'var(--cream)', node: <HijriCalendarIcon size={30} /> },
    ],
  },
  {
    title: "Ka'bah & Perjalanan",
    items: [
      { to: '/lainnya/kiblat', key: 'item_kiblat', bg: 'var(--mint)', node: <QiblaCompassIcon size={30} /> },
      { to: '/lainnya/makkah-live', key: 'item_makkah_live', bg: 'var(--blue-gray)', node: <LiveKaabaIcon size={30} /> },
      { to: '/umroh', key: 'nav_umroh', bg: 'var(--peach)', node: <UmrohIcon size={30} /> },
    ],
  },
  {
    title: 'Alat & Info',
    items: [
      { to: '/lainnya/kartu-ucapan', key: 'item_kartu_ucapan', bg: 'var(--blue-gray)', node: <GreetingCardIcon size={30} /> },
      { to: '/cari', label: 'Cari', bg: 'var(--mint)', node: <GlobalSearchIcon size={30} /> },
      { to: '/notifikasi', label: 'Notifikasi', bg: 'var(--cream)', node: <NotificationBellIcon size={30} /> },
      { to: '/yang-baru', label: 'Yang Baru', bg: 'var(--peach)', node: <WhatsNewIcon size={30} /> },
    ],
  },
];

const ALL_ITEMS = SECTIONS.flatMap((s) => s.items);

function Tile({ it, label, badge }) {
  return (
    <Link
      to={it.to}
      onClick={() => markLainnyaVisited(it.to)}
      style={{
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 10,
        padding: '18px 8px',
        borderRadius: 18,
        background: 'var(--card)',
        textDecoration: 'none',
        color: 'inherit',
      }}
    >
      <div style={{ position: 'relative', width: 48, height: 48, borderRadius: 16, overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center', background: it.bg }}>
        {it.node}
        {badge && (
          <div className="unseen-dot" style={{ position: 'absolute', top: 4, right: 4, width: 9, height: 9, borderRadius: '50%', background: 'var(--danger)', border: '1.5px solid var(--card)' }} />
        )}
      </div>
      <span style={{ fontSize: 11.5, fontWeight: 700, textAlign: 'center' }}>{label}</span>
    </Link>
  );
}

export default function Lainnya() {
  const { t } = useLang();
  const [recent, setRecent] = useState([]);
  const [hasUnseenNotif, setHasUnseenNotif] = useState(false);
  const [hasUnseenNews, setHasUnseenNews] = useState(false);

  useEffect(() => setRecent(getRecentLainnya()), []);
  useEffect(() => {
    hasUnseenNotifications().then(setHasUnseenNotif);
    setHasUnseenNews(hasUnseenChangelog());
  }, []);

  const recentItems = recent.map((to) => ALL_ITEMS.find((it) => it.to === to)).filter(Boolean);
  const labelFor = (it) => (it.key ? t(it.key) : it.label);
  const badgeFor = (it) => (it.to === '/notifikasi' && hasUnseenNotif) || (it.to === '/yang-baru' && hasUnseenNews);

  return (
    <div className="screen">
      <div className="screen-content">
        <TopBar title={t('lainnya_title')} />

        {recentItems.length > 0 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            <span className="section-label" style={{ color: 'var(--muted)', fontSize: 11.5, letterSpacing: '0.04em', textTransform: 'uppercase' }}>
              Terakhir Dibuka
            </span>
            <div className="hide-scrollbar" style={{ display: 'flex', gap: 8, overflowX: 'auto' }}>
              {recentItems.map((it) => (
                <Link
                  key={it.to}
                  to={it.to}
                  onClick={() => markLainnyaVisited(it.to)}
                  style={{
                    flexShrink: 0,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 8,
                    padding: '8px 14px 8px 8px',
                    borderRadius: 999,
                    background: 'var(--card)',
                    border: '1px solid var(--border)',
                    textDecoration: 'none',
                    color: 'inherit',
                  }}
                >
                  <div style={{ width: 28, height: 28, borderRadius: '50%', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, background: it.bg }}>
                    {it.node}
                  </div>
                  <span style={{ fontSize: 11.5, fontWeight: 700, whiteSpace: 'nowrap' }}>{labelFor(it)}</span>
                </Link>
              ))}
            </div>
          </div>
        )}

        {SECTIONS.map((section) => (
          <div key={section.title} style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            <span className="section-label" style={{ color: 'var(--muted)', fontSize: 11.5, letterSpacing: '0.04em', textTransform: 'uppercase' }}>
              {section.title}
            </span>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              {section.items.map((it) => (
                <Tile key={it.to} it={it} label={labelFor(it)} badge={badgeFor(it)} />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
