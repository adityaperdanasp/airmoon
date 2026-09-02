import { Link } from 'react-router-dom';
import BottomNav from '../components/BottomNav';
import PageHeaderPhoto from '../components/PageHeaderPhoto';
import { PAGE_PHOTOS } from '../data/photos';
import { UmrohIcon } from '../components/serviceIcons';

// All 4 now real pages (content written/sourced per an explicit ask to
// fill these in — was 4 flat "segera hadir" cards before). Manasik/Badal
// carry real fiqh content (sourced from Rumaysho.com, see those files'
// own header comments for the sourcing/verification caveat); Checklist
// is a real interactive checklist; Tabungan is a real calculator.
const ITEMS = [
  { to: '/umroh/manasik', title: 'Panduan Manasik', desc: 'Tata cara umroh dari niat sampai tahallul.' },
  { to: '/umroh/badal', title: 'Badal Umrah', desc: 'Hukum & ketentuan mengumrohkan orang lain.' },
  { to: '/umroh/checklist', title: 'Checklist Persiapan', desc: 'Dokumen, vaksin, dan barang bawaan sebelum berangkat.' },
  { to: '/umroh/tabungan', title: 'Tabungan Umroh', desc: 'Hitung target nabung bulanan buat biaya umroh.' },
];

export default function Umroh() {
  return (
    <div className="screen">
      <div className="screen-content">
        <PageHeaderPhoto title="Umroh Needs" photo={PAGE_PHOTOS.umroh} showBack={false} />
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {ITEMS.map((it) => (
            <Link
              key={it.to}
              to={it.to}
              className="card"
              style={{ display: 'flex', alignItems: 'center', gap: 12, padding: 14, textDecoration: 'none', color: 'inherit' }}
            >
              <div style={{ width: 44, height: 44, borderRadius: 13, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, background: 'var(--blue-gray)' }}>
                <UmrohIcon size={26} />
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 2, flex: 1 }}>
                <span style={{ fontSize: 13, fontWeight: 700 }}>{it.title}</span>
                <span style={{ fontSize: 11, color: 'var(--muted)' }}>{it.desc}</span>
              </div>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--muted)">
                <path d="m9 6 6 6-6 6" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </Link>
          ))}
        </div>
      </div>
      <BottomNav />
    </div>
  );
}
