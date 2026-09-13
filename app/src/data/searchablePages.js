// Fitur/Halaman — a plain-text index for Cari Global (2026-09-13). This
// grid grew to 30+ tiles across Lainnya.jsx's own 6 sections with zero
// way to find one by name outside of scrolling — Cari Global itself only
// ever searched ayat/asmaul husna/doa/favorite ayat, never app pages/
// features. Deliberately a SEPARATE plain-text list from Lainnya.jsx's
// own SECTIONS (which carries JSX icon nodes + prefetch functions this
// plain lib-level search has no use for) rather than importing it — the
// trade-off is this needs manual upkeep alongside Lainnya.jsx when a page
// is added/renamed/removed, same known "two lists, keep in sync by hand"
// class of limitation as a couple of other places in this app.
export const SEARCHABLE_PAGES = [
  { to: '/lainnya/doa-harian', label: "Do'a Harian" },
  { to: '/lainnya/tasbih', label: 'Tasbih Digital' },
  { to: '/lainnya/ayat-favorit', label: 'Ayat Favorit' },
  { to: '/lainnya/puasa-sunnah', label: 'Puasa Sunnah' },
  { to: '/lainnya/jumat-checklist', label: 'Checklist Sunnah Jumat' },
  { to: '/lainnya/mode-ramadan', label: 'Mode Ramadan' },
  { to: '/lainnya/ringkasan-ibadah', label: 'Ringkasan Ibadah' },
  { to: '/lainnya/kalender-ibadah', label: 'Kalender Ibadah' },
  { to: '/lainnya/grup-ibadah', label: 'Grup Ibadah' },
  { to: '/lainnya/doa-bersama', label: 'Doa Bersama' },
  { to: '/lainnya/tantangan-teman', label: 'Tantangan Teman' },
  { to: '/lainnya/koleksi-badge', label: 'Koleksi Badge Saya' },
  { to: '/lainnya/bagikan', label: 'Bagikan' },
  { to: '/lainnya/asmaul-husna', label: 'Asmaul Husna' },
  { to: '/lainnya/sejarah-islam', label: 'Sejarah Islam' },
  { to: '/lainnya/kutipan-inspirasi', label: 'Kutipan Inspirasi' },
  { to: '/lainnya/panduan-sholat', label: 'Panduan Sholat Pemula' },
  { to: '/lainnya/kalkulator-zakat', label: 'Kalkulator Zakat' },
  { to: '/lainnya/zakat-korporat', label: 'Zakat Korporat' },
  { to: '/lainnya/kalkulator-waris', label: 'Kalkulator Waris' },
  { to: '/lainnya/kalender-hijriah', label: 'Kalender Hijriah' },
  { to: '/lainnya/kiblat', label: 'Kompas Kiblat' },
  { to: '/lainnya/makkah-live', label: 'Makkah Live' },
  { to: '/umroh', label: 'Umroh' },
  { to: '/lainnya/kartu-ucapan', label: 'Kartu Ucapan' },
  { to: '/lainnya/usulan-fitur', label: 'Usulkan Fitur' },
  { to: '/lainnya/forum', label: 'Tanya Jawab Sesama Pengguna' },
  { to: '/lainnya/bantuan', label: 'Bantuan' },
  { to: '/lainnya/relawan', label: 'Jadi Relawan' },
  { to: '/jadwal-sholat', label: 'Jadwal Sholat' },
  { to: '/donasi', label: 'Donasi' },
  { to: '/ask-me', label: 'Tanya Ust. Rewin' },
  { to: '/pengaturan', label: 'Pengaturan' },
];

export function searchPages(q) {
  const lower = q.toLowerCase();
  return SEARCHABLE_PAGES.filter((p) => p.label.toLowerCase().includes(lower)).slice(0, 8);
}
