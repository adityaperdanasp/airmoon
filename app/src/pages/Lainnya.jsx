import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useLang } from '../context/LangContext';
import TopBar from '../components/TopBar';
import { getRecentLainnya, markLainnyaVisited } from '../lib/recentLainnya';
import { getPinnedLainnya, togglePinLainnya, MAX_PINS_REACHED } from '../lib/pinnedLainnya';
import { useToast } from '../context/ToastContext';
import { getUnseenNotificationCount } from '../lib/notificationLog';
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
  LightbulbIcon,
  HelpIcon,
  GroupIcon,
  ChecklistIcon,
  MosqueIcon,
  MedalIcon,
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
// [UI 2026-09-11] Each tile now also prefetches its own route chunk on
// hover/touch, same pattern BottomNav's 5 tabs already use — this grid
// is the literal hub for ~20 lazy-loaded routes (App.jsx), unlike
// BottomNav's tabs it previously had no head start at all: tapping a
// tile paid the full chunk-download cost from a cold start every time.
const SECTIONS = [
  {
    title: 'Ibadah Harian',
    items: [
      { to: '/lainnya/doa-harian', key: 'item_doa_harian', bg: 'var(--mint)', node: <CuppedHandsIcon size={30} />, prefetch: () => import('./DoaHarian') },
      { to: '/lainnya/tasbih', key: 'item_tasbih', bg: 'var(--peach)', node: <TasbihCounterIcon size={30} />, prefetch: () => import('./Tasbih') },
      { to: '/lainnya/ayat-favorit', key: 'item_ayat_favorit', bg: 'var(--cream)', node: <FavoriteAyatIcon size={30} />, prefetch: () => import('./AyatFavorit') },
      { to: '/lainnya/puasa-sunnah', label: 'Puasa Sunnah', bg: 'var(--blue-gray)', node: <PuasaSunnahIcon size={30} />, prefetch: () => import('./PuasaSunnah') },
      { to: '/lainnya/jumat-checklist', key: 'jumat_title', bg: 'var(--cream)', node: <ChecklistIcon size={30} />, prefetch: () => import('./JumatChecklist') },
      { to: '/lainnya/mode-ramadan', key: 'item_ramadan', bg: 'var(--mint)', node: <LanternIcon size={30} />, prefetch: () => import('./ModeRamadan') },
    ],
  },
  {
    title: 'Progres Ibadah',
    items: [
      { to: '/lainnya/ringkasan-ibadah', label: 'Ringkasan Ibadah', bg: 'var(--peach)', node: <StatsIcon size={30} />, prefetch: () => import('./RingkasanIbadah') },
      { to: '/lainnya/kalender-ibadah', label: 'Kalender Ibadah', bg: 'var(--cream)', node: <AmalanCalendarIcon size={30} />, prefetch: () => import('./KalenderIbadah') },
      { to: '/lainnya/grup-ibadah', label: 'Grup Ibadah', bg: 'var(--blue-gray)', node: <GroupIcon size={30} />, prefetch: () => import('./GrupIbadah') },
      { to: '/lainnya/doa-bersama', label: 'Doa Bersama', bg: 'var(--cream)', node: <CuppedHandsIcon size={30} />, prefetch: () => import('./DoaBersama') },
      { to: '/lainnya/tantangan-teman', key: 'tantangan_title', bg: 'var(--peach)', node: <GroupIcon size={30} />, prefetch: () => import('./TantanganTeman') },
      { to: '/lainnya/koleksi-badge', key: 'koleksi_badge_title', bg: 'var(--mint)', node: <MedalIcon size={30} />, prefetch: () => import('./KoleksiBadge') },
    ],
  },
  {
    title: 'Ilmu & Bacaan',
    items: [
      { to: '/lainnya/asmaul-husna', key: 'item_asmaul_husna', bg: 'var(--mint)', node: <TasbihIcon size={30} />, prefetch: () => import('./NamaNamaAllah') },
      { to: '/lainnya/sejarah-islam', label: 'Sejarah Islam', bg: 'var(--peach)', node: <HistoryBookIcon size={30} />, prefetch: () => import('./SejarahIslam') },
      { to: '/lainnya/kutipan-inspirasi', key: 'item_kutipan_inspirasi', bg: 'var(--cream)', node: <ScrollIcon size={30} />, prefetch: () => import('./KutipanInspirasi') },
      { to: '/lainnya/panduan-sholat', key: 'panduan_sholat_title', bg: 'var(--mint)', node: <MosqueIcon size={30} />, prefetch: () => import('./PanduanSholat') },
    ],
  },
  {
    title: 'Alat Hitung',
    items: [
      { to: '/lainnya/kalkulator-zakat', key: 'item_kalkulator_zakat', bg: 'var(--peach)', node: <CalculatorIcon size={30} />, prefetch: () => import('./KalkulatorZakat') },
      { to: '/lainnya/zakat-korporat', key: 'item_zakat_korporat', bg: 'var(--mint)', node: <CalculatorIcon size={30} />, prefetch: () => import('./ZakatKorporat') },
      { to: '/lainnya/kalkulator-waris', label: 'Kalkulator Waris', bg: 'var(--blue-gray)', node: <InheritanceScaleIcon size={30} />, prefetch: () => import('./KalkulatorWaris') },
      { to: '/lainnya/kalender-hijriah', key: 'item_kalender_hijriah', bg: 'var(--cream)', node: <HijriCalendarIcon size={30} />, prefetch: () => import('./KalenderHijriah') },
    ],
  },
  {
    title: "Ka'bah & Perjalanan",
    items: [
      { to: '/lainnya/kiblat', key: 'item_kiblat', bg: 'var(--mint)', node: <QiblaCompassIcon size={30} />, prefetch: () => import('./QiblaCompass') },
      { to: '/lainnya/makkah-live', key: 'item_makkah_live', bg: 'var(--blue-gray)', node: <LiveKaabaIcon size={30} />, prefetch: () => import('./MakkahLive') },
      { to: '/umroh', key: 'nav_umroh', bg: 'var(--peach)', node: <UmrohIcon size={30} />, prefetch: () => import('./Umroh') },
    ],
  },
  {
    title: 'Alat & Info',
    items: [
      { to: '/lainnya/kartu-ucapan', key: 'item_kartu_ucapan', bg: 'var(--blue-gray)', node: <GreetingCardIcon size={30} />, prefetch: () => import('./KartuUcapan') },
      { to: '/cari', label: 'Cari', bg: 'var(--mint)', node: <GlobalSearchIcon size={30} />, prefetch: () => import('./CariGlobal') },
      { to: '/notifikasi', label: 'Notifikasi', bg: 'var(--cream)', node: <NotificationBellIcon size={30} />, prefetch: () => import('./NotifikasiCenter') },
      { to: '/yang-baru', label: 'Yang Baru', bg: 'var(--peach)', node: <WhatsNewIcon size={30} />, prefetch: () => import('./Changelog') },
      { to: '/lainnya/usulan-fitur', label: 'Usulkan Fitur', bg: 'var(--mint)', node: <LightbulbIcon size={30} />, prefetch: () => import('./UsulanFitur') },
      { to: '/lainnya/forum', key: 'forum_title', bg: 'var(--cream)', node: <GroupIcon size={30} />, prefetch: () => import('./ForumKomunitas') },
      { to: '/lainnya/bantuan', label: 'Bantuan', bg: 'var(--blue-gray)', node: <HelpIcon size={30} />, prefetch: () => import('./Bantuan') },
      { to: '/lainnya/relawan', label: 'Jadi Relawan', bg: 'var(--peach)', node: <CuppedHandsIcon size={30} />, prefetch: () => import('./Relawan') },
      {
        to: '/lainnya/bagikan',
        key: 'bagikan_title',
        bg: 'var(--cream)',
        node: (
          <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="var(--primary)">
            <circle cx="18" cy="5" r="3" strokeWidth="1.6" /><circle cx="6" cy="12" r="3" strokeWidth="1.6" /><circle cx="18" cy="19" r="3" strokeWidth="1.6" />
            <path d="M8.6 10.5 15.4 6.5M8.6 13.5 15.4 17.5" strokeWidth="1.6" />
          </svg>
        ),
        prefetch: () => import('./Bagikan'),
      },
    ],
  },
];

const ALL_ITEMS = SECTIONS.flatMap((s) => s.items);

function Tile({ it, label, badge, count, pinned, onTogglePin }) {
  return (
    <Link
      to={it.to}
      onClick={() => markLainnyaVisited(it.to)}
      onMouseEnter={it.prefetch}
      onTouchStart={it.prefetch}
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
      {onTogglePin && (
        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            onTogglePin(it.to);
          }}
          aria-label={pinned ? `Lepas pin ${label}` : `Pin ${label}`}
          style={{
            position: 'absolute',
            top: 6,
            left: 6,
            zIndex: 1,
            width: 20,
            height: 20,
            padding: 0,
            border: 'none',
            borderRadius: '50%',
            background: pinned ? 'var(--primary)' : 'rgba(0,0,0,0.08)',
            color: pinned ? 'var(--on-primary)' : 'var(--muted)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            fontSize: 10,
          }}
        >
          📌
        </button>
      )}
      <div style={{ position: 'relative', width: 48, height: 48, borderRadius: 16, overflow: 'visible', display: 'flex', alignItems: 'center', justifyContent: 'center', background: it.bg }}>
        <div style={{ width: 48, height: 48, borderRadius: 16, overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{it.node}</div>
        {/* A numeric count when there's a real number to show (unseen
            notifications), a plain pulsing dot otherwise (changelog has no
            count) — matching how a messaging app badges its icon. */}
        {count > 0 ? (
          <div
            className="unseen-dot"
            style={{
              position: 'absolute',
              top: -5,
              right: -5,
              minWidth: 17,
              height: 17,
              padding: '0 4px',
              borderRadius: 999,
              background: 'var(--danger)',
              color: '#fff',
              fontSize: 10,
              fontWeight: 800,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              border: '1.5px solid var(--card)',
            }}
          >
            {count > 9 ? '9+' : count}
          </div>
        ) : badge ? (
          <div className="unseen-dot" style={{ position: 'absolute', top: -3, right: -3, width: 9, height: 9, borderRadius: '50%', background: 'var(--danger)', border: '1.5px solid var(--card)' }} />
        ) : null}
      </div>
      <span style={{ fontSize: 11.5, fontWeight: 700, textAlign: 'center' }}>{label}</span>
    </Link>
  );
}

export default function Lainnya() {
  const { t } = useLang();
  const { showToast } = useToast();
  const [recent, setRecent] = useState([]);
  const [pinned, setPinned] = useState([]);
  const [unseenNotifCount, setUnseenNotifCount] = useState(0);
  const [hasUnseenNews, setHasUnseenNews] = useState(false);
  const [query, setQuery] = useState('');
  const [collapsed, setCollapsed] = useState({});

  useEffect(() => setRecent(getRecentLainnya()), []);
  useEffect(() => setPinned(getPinnedLainnya()), []);
  useEffect(() => {
    getUnseenNotificationCount().then(setUnseenNotifCount);
    setHasUnseenNews(hasUnseenChangelog());
  }, []);

  const recentItems = recent.map((to) => ALL_ITEMS.find((it) => it.to === to)).filter(Boolean);
  const pinnedItems = pinned.map((to) => ALL_ITEMS.find((it) => it.to === to)).filter(Boolean);
  const labelFor = (it) => (it.key ? t(it.key) : it.label);
  const badgeFor = (it) => it.to === '/yang-baru' && hasUnseenNews;
  const countFor = (it) => (it.to === '/notifikasi' ? unseenNotifCount : 0);

  function handleTogglePin(to) {
    const result = togglePinLainnya(to);
    if (result === MAX_PINS_REACHED) {
      showToast('Maksimal 6 favorit — lepas satu dulu buat pin yang baru.', { type: 'danger' });
      return;
    }
    setPinned(result);
  }

  // Search filters across every section by displayed label (translated
  // where applicable) — this grid grew to 30+ tiles across 6 sections
  // (see this file's own header comment), scanning the whole page to
  // find one feature stopped being reasonable a while ago.
  const trimmedQuery = query.trim().toLowerCase();
  const searching = trimmedQuery.length > 0;
  const filteredSections = searching
    ? SECTIONS.map((section) => ({
        ...section,
        items: section.items.filter((it) => labelFor(it).toLowerCase().includes(trimmedQuery)),
      })).filter((section) => section.items.length > 0)
    : SECTIONS;

  return (
    <div className="screen">
      <div className="screen-content">
        <TopBar title={t('lainnya_title')} />

        <div className="input-row" style={{ borderRadius: 999 }}>
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" style={{ opacity: 0.6, flexShrink: 0 }}>
            <circle cx="11" cy="11" r="7" strokeWidth="1.8" /><path d="m20 20-3.5-3.5" strokeWidth="1.8" strokeLinecap="round" />
          </svg>
          <input
            placeholder="Cari fitur di sini..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            aria-label="Cari fitur di halaman Lainnya"
          />
          {query && (
            <button onClick={() => setQuery('')} aria-label="Hapus pencarian" style={{ background: 'none', border: 'none', color: 'var(--muted)', fontSize: 16, cursor: 'pointer', padding: 0, lineHeight: 1 }}>
              ×
            </button>
          )}
        </div>

        {!searching && pinnedItems.length > 0 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            <span className="section-label" style={{ color: 'var(--muted)', fontSize: 11.5, letterSpacing: '0.04em', textTransform: 'uppercase' }}>
              Favorit Kamu
            </span>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              {pinnedItems.map((it) => (
                <Tile key={it.to} it={it} label={labelFor(it)} badge={badgeFor(it)} count={countFor(it)} pinned onTogglePin={handleTogglePin} />
              ))}
            </div>
          </div>
        )}

        {!searching && recentItems.length > 0 && (
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
                  onMouseEnter={it.prefetch}
                  onTouchStart={it.prefetch}
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

        {searching && filteredSections.length === 0 && (
          <p className="state-msg">Gak ada fitur yang cocok dengan "{query}".</p>
        )}

        {filteredSections.map((section) => {
          // Collapse only applies when NOT searching — a search result
          // hiding behind a collapsed section would be a confusing dead
          // end, so `searching` always forces every matching section open.
          const isCollapsed = !searching && collapsed[section.title];
          return (
            <div key={section.title} style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              <button
                onClick={() => setCollapsed((c) => ({ ...c, [section.title]: !c[section.title] }))}
                aria-expanded={!isCollapsed}
                style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'none', border: 'none', padding: 0, cursor: 'pointer', alignSelf: 'flex-start' }}
              >
                <span className="section-label" style={{ color: 'var(--muted)', fontSize: 11.5, letterSpacing: '0.04em', textTransform: 'uppercase' }}>
                  {section.title}
                </span>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="var(--muted)" style={{ transform: isCollapsed ? 'rotate(-90deg)' : 'none', transition: 'transform 0.15s ease' }}>
                  <path d="m6 9 6 6 6-6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
              {!isCollapsed && (
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                  {section.items.map((it) => (
                    <Tile
                      key={it.to}
                      it={it}
                      label={labelFor(it)}
                      badge={badgeFor(it)}
                      count={countFor(it)}
                      pinned={pinned.includes(it.to)}
                      onTogglePin={handleTogglePin}
                    />
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
