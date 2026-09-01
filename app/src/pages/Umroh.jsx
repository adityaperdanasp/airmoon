import BottomNav from '../components/BottomNav';
import PageHeaderPhoto from '../components/PageHeaderPhoto';
import { PAGE_PHOTOS } from '../data/photos';

const ITEMS = [
  { title: 'Tabungan Umroh', desc: 'Nabung rutin buat biaya umroh dengan target jelas.' },
  { title: 'Badal Umrah', desc: 'Titip doa & niat lewat jamaah yang lagi umroh.' },
  { title: 'Panduan Manasik', desc: 'Video & langkah tata cara umroh dari niat sampai tahallul.' },
  { title: 'Checklist Persiapan', desc: 'Dokumen, vaksin, dan barang bawaan sebelum berangkat.' },
];

export default function Umroh() {
  return (
    <div className="screen">
      <div className="screen-content">
        <PageHeaderPhoto title="Umroh Needs" photo={PAGE_PHOTOS.umroh} showBack={false} />
        <p className="muted" style={{ margin: 0, fontSize: 12.5 }}>
          Segera hadir — fitur-fitur ini masih dalam pengembangan.
        </p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {ITEMS.map((it) => (
            <div key={it.title} className="card" style={{ display: 'flex', alignItems: 'center', gap: 12, padding: 14, opacity: 0.7 }}>
              <div style={{ width: 40, height: 40, borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, background: 'var(--blue-gray)' }}>
                <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="#3f5c68">
                  <rect x="5" y="5" width="14" height="14" rx="1.3" strokeWidth="1.7" />
                  <path d="M5 9.5h14" strokeWidth="1.7" />
                </svg>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <span style={{ fontSize: 13, fontWeight: 700 }}>{it.title}</span>
                <span style={{ fontSize: 11, color: 'var(--muted)' }}>{it.desc}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
      <BottomNav />
    </div>
  );
}
