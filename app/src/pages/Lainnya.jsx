import { Link } from 'react-router-dom';
import { useLang } from '../context/LangContext';
import TopBar from '../components/TopBar';

const ITEMS = [
  { to: '/lainnya/asmaul-husna', key: 'item_asmaul_husna', bg: 'var(--mint)', color: 'var(--primary)' },
  { to: '/lainnya/kalender-hijriah', key: 'item_kalender_hijriah', bg: 'var(--cream)', color: 'var(--gold-ink)' },
  { to: '/lainnya/kalkulator-zakat', key: 'item_kalkulator_zakat', bg: 'var(--peach)', color: '#a9622f' },
  { to: '/lainnya/kartu-ucapan', key: 'item_kartu_ucapan', bg: 'var(--blue-gray)', color: '#3f5c68' },
  { to: '/lainnya/doa-harian', key: 'item_doa_harian', bg: 'var(--mint)', color: 'var(--primary)' },
  { to: '/lainnya/kutipan-inspirasi', key: 'item_kutipan_inspirasi', bg: 'var(--peach)', color: '#a9622f' },
  { to: '/lainnya/makkah-live', key: 'item_makkah_live', bg: 'var(--cream)', color: 'var(--gold-ink)' },
  { to: '/lainnya/kiblat', key: 'item_kiblat', bg: 'var(--mint)', color: 'var(--primary)' },
  { to: '/umroh', key: 'nav_umroh', bg: 'var(--blue-gray)', color: '#3f5c68', icon: '/icons-3d/umroh-needs.png' },
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
                <div style={{ width: 48, height: 48, borderRadius: 16, overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center', background: it.bg, color: it.color, fontSize: 20, fontWeight: 800 }}>
                  {it.icon ? <img src={it.icon} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : label[0]}
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
