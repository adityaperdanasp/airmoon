// Single catalog of every tappable feature in the app — Lainnya's grid
// (SECTIONS) plus a few core destinations (CORE_ITEMS). Lainnya renders
// SECTIONS; Home's "Jelajahi" shortcuts let the user pick any of
// ALL_SHORTCUT_ITEMS. One list so a renamed or added page can't drift
// between the two.
import {
  QiblaCompassIcon,
  CalculatorIcon,
  TasbihIcon,
  TasbihCounterIcon,
  FavoriteAyatIcon,
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
  LightbulbIcon,
  HelpIcon,
  GroupIcon,
  ChecklistIcon,
  MosqueIcon,
  MedalIcon,
  PrayerClockIcon,
  QuranBookIcon,
} from './serviceIcons';
import { IconMoon } from './icons';

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
export const SECTIONS = [
  {
    title: 'Ibadah Harian',
    items: [
      { to: '/lainnya/puasa-sunnah', label: 'Kalender Puasa Sunnah', bg: 'var(--blue-gray)', node: <PuasaSunnahIcon size={30} />, prefetch: () => import('../pages/PuasaSunnah') },
      { to: '/lainnya/doa-harian', key: 'item_doa_harian', bg: 'var(--mint)', node: <CuppedHandsIcon size={30} />, prefetch: () => import('../pages/DoaHarian') },
      { to: '/lainnya/tasbih', key: 'item_tasbih', bg: 'var(--peach)', node: <TasbihCounterIcon size={30} />, prefetch: () => import('../pages/Tasbih') },
      { to: '/lainnya/ayat-favorit', key: 'item_ayat_favorit', bg: 'var(--cream)', node: <FavoriteAyatIcon size={30} />, prefetch: () => import('../pages/AyatFavorit') },
      { to: '/lainnya/jumat-checklist', key: 'jumat_title', bg: 'var(--cream)', node: <ChecklistIcon size={30} />, prefetch: () => import('../pages/JumatChecklist') },
      { to: '/lainnya/mode-ramadan', key: 'item_ramadan', bg: 'var(--mint)', node: <LanternIcon size={30} />, prefetch: () => import('../pages/ModeRamadan') },
    ],
  },
  {
    title: 'Progres Ibadah',
    items: [
      { to: '/lainnya/ringkasan-ibadah', label: 'Ringkasan Ibadah', bg: 'var(--peach)', node: <StatsIcon size={30} />, prefetch: () => import('../pages/RingkasanIbadah') },
      { to: '/lainnya/grup-ibadah', label: 'Grup Ibadah', bg: 'var(--blue-gray)', node: <GroupIcon size={30} />, prefetch: () => import('../pages/GrupIbadah') },
      { to: '/lainnya/doa-bersama', label: 'Doa Bersama', bg: 'var(--cream)', node: <CuppedHandsIcon size={30} />, prefetch: () => import('../pages/DoaBersama') },
      { to: '/lainnya/tantangan-teman', key: 'tantangan_title', bg: 'var(--peach)', node: <GroupIcon size={30} />, prefetch: () => import('../pages/TantanganTeman') },
      { to: '/lainnya/koleksi-badge', key: 'koleksi_badge_title', bg: 'var(--mint)', node: <MedalIcon size={30} />, prefetch: () => import('../pages/KoleksiBadge') },
    ],
  },
  {
    title: 'Ilmu & Bacaan',
    items: [
      { to: '/lainnya/asmaul-husna', key: 'item_asmaul_husna', bg: 'var(--mint)', node: <TasbihIcon size={30} />, prefetch: () => import('../pages/NamaNamaAllah') },
      { to: '/lainnya/sejarah-islam', label: 'Sejarah Islam', bg: 'var(--peach)', node: <HistoryBookIcon size={30} />, prefetch: () => import('../pages/SejarahIslam') },
      { to: '/lainnya/kutipan-inspirasi', key: 'item_kutipan_inspirasi', bg: 'var(--cream)', node: <ScrollIcon size={30} />, prefetch: () => import('../pages/KutipanInspirasi') },
      { to: '/lainnya/panduan-sholat', key: 'panduan_sholat_title', bg: 'var(--mint)', node: <MosqueIcon size={30} />, prefetch: () => import('../pages/PanduanSholat') },
      { to: '/lainnya/panduan-jenazah', key: 'panduan_jenazah_title', bg: 'var(--blue-gray)', node: <CuppedHandsIcon size={30} />, prefetch: () => import('../pages/PanduanJenazah') },
    ],
  },
  {
    title: 'Alat Hitung',
    items: [
      { to: '/lainnya/kalkulator-zakat', key: 'item_kalkulator_zakat', bg: 'var(--peach)', node: <CalculatorIcon size={30} />, prefetch: () => import('../pages/KalkulatorZakat') },
      { to: '/lainnya/zakat-korporat', key: 'item_zakat_korporat', bg: 'var(--mint)', node: <CalculatorIcon size={30} />, prefetch: () => import('../pages/ZakatKorporat') },
      { to: '/lainnya/kalkulator-waris', label: 'Kalkulator Waris', bg: 'var(--blue-gray)', node: <InheritanceScaleIcon size={30} />, prefetch: () => import('../pages/KalkulatorWaris') },
    ],
  },
  {
    title: "Ka'bah & Perjalanan",
    items: [
      { to: '/lainnya/kiblat', key: 'item_kiblat', bg: 'var(--mint)', node: <QiblaCompassIcon size={30} />, prefetch: () => import('../pages/QiblaCompass') },
      { to: '/lainnya/makkah-live', key: 'item_makkah_live', bg: 'var(--blue-gray)', node: <LiveKaabaIcon size={30} />, prefetch: () => import('../pages/MakkahLive') },
      { to: '/umroh', key: 'nav_umroh', bg: 'var(--peach)', node: <UmrohIcon size={30} />, prefetch: () => import('../pages/Umroh') },
    ],
  },
  {
    title: 'Alat & Info',
    items: [
      { to: '/lainnya/kartu-ucapan', key: 'item_kartu_ucapan', bg: 'var(--blue-gray)', node: <GreetingCardIcon size={30} />, prefetch: () => import('../pages/KartuUcapan') },
      { to: '/cari', label: 'Cari', bg: 'var(--mint)', node: <GlobalSearchIcon size={30} />, prefetch: () => import('../pages/CariGlobal') },
      { to: '/notifikasi', label: 'Notifikasi', bg: 'var(--cream)', node: <NotificationBellIcon size={30} />, prefetch: () => import('../pages/NotifikasiCenter') },
      { to: '/yang-baru', label: 'Yang Baru', bg: 'var(--peach)', node: <WhatsNewIcon size={30} />, prefetch: () => import('../pages/Changelog') },
      { to: '/lainnya/usulan-fitur', label: 'Usulkan Fitur', bg: 'var(--mint)', node: <LightbulbIcon size={30} />, prefetch: () => import('../pages/UsulanFitur') },
      { to: '/lainnya/forum', key: 'forum_title', bg: 'var(--cream)', node: <GroupIcon size={30} />, prefetch: () => import('../pages/ForumKomunitas') },
      { to: '/lainnya/bantuan', label: 'Bantuan', bg: 'var(--blue-gray)', node: <HelpIcon size={30} />, prefetch: () => import('../pages/Bantuan') },
      { to: '/lainnya/relawan', label: 'Jadi Relawan', bg: 'var(--peach)', node: <CuppedHandsIcon size={30} />, prefetch: () => import('../pages/Relawan') },
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
        prefetch: () => import('../pages/Bagikan'),
      },
    ],
  },
];


// Items that live outside Lainnya's grid (they have their own tab or
// route) but are still worth offering as a Home shortcut. Kept separate
// from SECTIONS so Lainnya itself doesn't suddenly list a second copy of
// Qur'an / Donasi inside its own grid.
export const CORE_ITEMS = [
  { to: '/quran', label: "Qur'an", bg: 'var(--mint)', node: <QuranBookIcon size={30} />, prefetch: () => import('../pages/SurahList') },
  { to: '/jadwal-sholat', label: 'Jadwal Sholat', bg: 'var(--cream)', node: <PrayerClockIcon size={30} />, prefetch: () => import('../pages/JadwalSholat') },
  { to: '/lainnya/cari-masjid', label: 'Cari Masjid', bg: 'var(--mint)', node: <MosqueIcon size={30} />, prefetch: () => import('../pages/CariMasjid') },
  { to: '/ask-me', label: 'Ust. Rewin', bg: 'var(--peach)', node: <IconMoon width="26" height="26" style={{ color: 'var(--primary)' }} />, prefetch: () => import('../pages/AskMe') },
  { to: '/doa', label: 'Doa & Aminkan', bg: 'var(--cream)', node: <LanternIcon size={30} />, prefetch: () => import('../pages/Doa') },
  { to: '/donasi', label: 'Donasi', bg: 'var(--peach)', node: <MosqueIcon size={30} />, prefetch: () => import('../pages/Donasi') },
];

export const ALL_ITEMS = SECTIONS.flatMap((s) => s.items);
export const ALL_SHORTCUT_ITEMS = [...CORE_ITEMS, ...ALL_ITEMS];
