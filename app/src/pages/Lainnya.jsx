import { Link } from 'react-router-dom';
import { useLang } from '../context/LangContext';
import TopBar from '../components/TopBar';
import {
  QiblaCompassIcon,
  CalculatorIcon,
  TasbihIcon,
  TasbihCounterIcon,
  HijriCalendarIcon,
  GreetingCardIcon,
  CuppedHandsIcon,
  ScrollIcon,
  LiveKaabaIcon,
  LanternIcon,
  UmrohIcon,
} from '../components/serviceIcons';

// All hand-drawn gradient icons now (see serviceIcons.jsx) — this grid
// used to mix in platform emoji (📿🗓️💌🤲📜🎥🌙) and one stray raster
// (`/icons-3d/umroh-needs.png`), which looked inconsistent against the
// custom illustrated icons already used for Kalkulator Zakat/Kiblat, and
// render wildly differently (and, on iOS, glossy/cartoonish) across
// devices since emoji glyphs are drawn by the OS, not this app.
const ITEMS = [
  { to: '/lainnya/asmaul-husna', key: 'item_asmaul_husna', bg: 'var(--mint)', node: <TasbihIcon size={30} /> },
  { to: '/lainnya/kalender-hijriah', key: 'item_kalender_hijriah', bg: 'var(--cream)', node: <HijriCalendarIcon size={30} /> },
  { to: '/lainnya/kalkulator-zakat', key: 'item_kalkulator_zakat', bg: 'var(--peach)', node: <CalculatorIcon size={30} /> },
  { to: '/lainnya/kartu-ucapan', key: 'item_kartu_ucapan', bg: 'var(--blue-gray)', node: <GreetingCardIcon size={30} /> },
  { to: '/lainnya/doa-harian', key: 'item_doa_harian', bg: 'var(--mint)', node: <CuppedHandsIcon size={30} /> },
  { to: '/lainnya/kutipan-inspirasi', key: 'item_kutipan_inspirasi', bg: 'var(--peach)', node: <ScrollIcon size={30} /> },
  { to: '/lainnya/makkah-live', key: 'item_makkah_live', bg: 'var(--cream)', node: <LiveKaabaIcon size={30} /> },
  { to: '/lainnya/kiblat', key: 'item_kiblat', bg: 'var(--mint)', node: <QiblaCompassIcon size={33} /> },
  { to: '/lainnya/mode-ramadan', key: 'item_ramadan', bg: 'var(--cream)', node: <LanternIcon size={30} /> },
  { to: '/umroh', key: 'nav_umroh', bg: 'var(--blue-gray)', node: <UmrohIcon size={30} /> },
  { to: '/lainnya/tasbih', key: 'item_tasbih', bg: 'var(--peach)', node: <TasbihCounterIcon size={30} /> },
];

export default function Lainnya() {
  const { t } = useLang();
  return (
    <div className="screen">
      <div className="screen-content">
        <TopBar title={t('lainnya_title')} />
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          {ITEMS.map((it) => {
            const label = t(it.key);
            return (
              <Link
                key={it.to}
                to={it.to}
                style={{
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
                <div style={{ width: 48, height: 48, borderRadius: 16, overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center', background: it.bg }}>
                  {it.node}
                </div>
                <span style={{ fontSize: 11.5, fontWeight: 700, textAlign: 'center' }}>{label}</span>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
