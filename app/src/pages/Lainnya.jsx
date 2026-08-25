import { Link } from 'react-router-dom';
import TopBar from '../components/TopBar';

const ITEMS = [
  { to: '/lainnya/asmaul-husna', label: 'Nama-Nama Allah', bg: 'var(--mint)', color: 'var(--primary)' },
  { to: '/lainnya/kalender-hijriah', label: 'Kalender Hijriah', bg: 'var(--cream)', color: 'var(--gold-ink)' },
  { to: '/lainnya/kalkulator-zakat', label: 'Kalkulator Zakat', bg: 'var(--peach)', color: '#a9622f' },
  { to: '/lainnya/kartu-ucapan', label: 'Kartu Ucapan', bg: 'var(--blue-gray)', color: '#3f5c68' },
  { to: '/lainnya/doa-harian', label: "Do'a Harian", bg: 'var(--mint)', color: 'var(--primary)' },
  { to: '/lainnya/kutipan-inspirasi', label: 'Kutipan Inspirasi', bg: 'var(--peach)', color: '#a9622f' },
  { to: '/lainnya/makkah-live', label: 'Makkah Live', bg: 'var(--cream)', color: 'var(--gold-ink)' },
  { to: '/umroh', label: 'Umroh Needs', bg: 'var(--blue-gray)', color: '#3f5c68', icon: '/icons-3d/umroh-needs.png' },
];

export default function Lainnya() {
  return (
    <div className="screen">
      <div className="screen-content">
        <TopBar title="Lainnya" />
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          {ITEMS.map((it) => (
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
                {it.icon ? <img src={it.icon} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : it.label[0]}
              </div>
              <span style={{ fontSize: 11.5, fontWeight: 700, textAlign: 'center' }}>{it.label}</span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
