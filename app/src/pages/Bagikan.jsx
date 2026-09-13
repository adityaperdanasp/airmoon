import { Link } from 'react-router-dom';
import TopBar from '../components/TopBar';

// Bagikan (2026-09-13) — 9 different shareable cards had grown across
// 9 different pages over this app's history (Ringkasan Ibadah, Mode
// Ramadan, Kartu Pencapaian, struk donasi, Kalkulator Zakat, Kalkulator
// Waris, Asmaul Husna, Sejarah Islam, Tasbih), each with its own
// icon-button entry point nobody could discover without already being on
// that exact page. This is a discoverability hub, not a technical
// merge — each card below still opens on its own source page (where the
// live data it draws from already lives), not a duplicated modal here.
const SHARE_OPTIONS = [
  { to: '/lainnya/ringkasan-ibadah', icon: '📊', title: 'Ringkasan Ibadah', subtitle: 'Kartu progres khatam, streak, sedekah, puasa, dan hafalan' },
  { to: '/lainnya/mode-ramadan', icon: '🏮', title: 'Progress Ramadan', subtitle: 'Kartu puasa & tarawih bulan ini' },
  { to: '/pengaturan', icon: '🏅', title: 'Kartu Pencapaian', subtitle: 'Ringkasan pencapaian ibadahmu, dari Pengaturan' },
  { to: '/donasi', icon: '🧾', title: 'Struk Donasi', subtitle: 'Bukti sedekah yang udah kamu berikan' },
  { to: '/lainnya/kalkulator-zakat', icon: '🕌', title: 'Hasil Kalkulator Zakat', subtitle: 'Zakat penghasilan, maal, atau fitrah yang udah dihitung' },
  { to: '/lainnya/kalkulator-waris', icon: '⚖️', title: 'Hasil Kalkulator Waris', subtitle: 'Pembagian warisan yang udah dihitung' },
  { to: '/lainnya/asmaul-husna', icon: '📿', title: 'Asmaul Husna', subtitle: 'Nama Allah pilihanmu jadi kartu' },
  { to: '/lainnya/sejarah-islam', icon: '📜', title: 'Sejarah Islam', subtitle: 'Momen sejarah Islam favoritmu' },
  { to: '/lainnya/tasbih', icon: '📿', title: 'Progress Tasbih', subtitle: 'Total hitungan dzikir hari ini' },
];

export default function Bagikan() {
  return (
    <div className="screen">
      <div className="screen-content">
        <TopBar title="Bagikan" subtitle="Semua kartu yang bisa kamu bagikan, satu tempat" />

        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {SHARE_OPTIONS.map((opt) => (
            <Link
              key={opt.to + opt.title}
              to={opt.to}
              className="card"
              style={{ display: 'flex', alignItems: 'center', gap: 12, padding: 14, textDecoration: 'none', color: 'inherit' }}
            >
              <span style={{ fontSize: 24, flexShrink: 0 }}>{opt.icon}</span>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 1, flex: 1, minWidth: 0 }}>
                <span style={{ fontSize: 13, fontWeight: 700 }}>{opt.title}</span>
                <span style={{ fontSize: 11, color: 'var(--muted)' }}>{opt.subtitle}</span>
              </div>
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="var(--muted)" style={{ flexShrink: 0 }}><path d="m9 6 6 6-6 6" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg>
            </Link>
          ))}
        </div>

        <span style={{ fontSize: 10.5, color: 'var(--muted-soft)', textAlign: 'center', lineHeight: 1.5 }}>
          Tap salah satu buat masuk ke halamannya, lalu cari tombol bagikan di sana.
        </span>
      </div>
    </div>
  );
}
