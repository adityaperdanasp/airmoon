// A curated, user-facing changelog — deliberately NOT a 1:1 mirror of
// CLAUDE.md's dated technical bullets (those document implementation
// decisions for future development work; this is "what's new" for
// someone using the app). Update this by hand when something worth
// telling a user about ships — not automatically, and not for every
// internal fix. `version` just needs to increase; CURRENT_VERSION below
// is what Pengaturan.jsx/Lainnya.jsx compare against to show an unseen
// dot, same pattern as lib/unseenBadges.js/lib/notificationLog.js.
export const CURRENT_VERSION = 6;

export const CHANGELOG = [
  {
    version: 6,
    date: '2026-09-04',
    title: 'Kalkulator Waris, Pengingat Puasa Sunnah, dan lainnya',
    items: [
      'Kalkulator Waris (Ilmu Faraidh) — baru, di menu Lainnya.',
      'Progress Khatam Qur\'an + waktu baca total, ditampilkan di halaman Al-Qur\'an.',
      'Tafsir ringkas per ayat, tinggal ketuk ikon buku di ayat mana pun.',
      'Koleksi/folder buat Ayat Favorit.',
      'Notifikasi bisa diatur per jenis (adzan, pengingat, komunitas, donasi, konten) di Pengaturan.',
      'Ganti Lokasi manual di Jadwal Sholat (gak harus GPS).',
      'Bisa tambah dzikir sendiri di Tasbih Digital, plus bagikan progress-nya.',
      'Pengingat Puasa Sunnah (Senin/Kamis & Ayyamul Bidh) dan Zakat Fitrah.',
      'Notifikasi otomatis kalau campaign donasi yang kamu dukung berhasil tercapai.',
      'Bisa hapus akun sendiri lewat Pengaturan.',
      'Ekspor & impor data pribadi (dzikir, favorit, tabungan umroh) buat cadangan.',
      'Pusat Notifikasi baru — riwayat semua notifikasi yang pernah masuk.',
    ],
  },
  {
    version: 5,
    date: '2026-09-03',
    title: 'Navigasi baru, tema Ikuti Sistem, dan tracker Umroh',
    items: [
      'Tab "Lainnya" baru di navigasi bawah — Tasbih, Kiblat, Kalkulator Zakat, dan lainnya jadi lebih gampang dijangkau.',
      'Tema "Ikuti Sistem" — otomatis ikut mode terang/gelap HP kamu.',
      'Tarik ke bawah buat refresh di Beranda, Al-Qur\'an, dan Doa.',
      'Tabungan Umroh sekarang beneran nyimpen progress nabung, bukan cuma kalkulator.',
      'Shortcut aplikasi baru (tekan lama ikon airmoon) ke Jadwal Sholat, Tasbih, dan Cari Ayat.',
      'Pengingat Imsak Ramadan dan pengingat kalau rentetan Dzikir Petang bakal putus.',
      'Konfirmasi sebelum aksi yang gak bisa dibatalin (reset, hapus, keluar).',
    ],
  },
  {
    version: 4,
    date: '2026-09-02',
    title: 'Tasbih Digital, Ayat Favorit, dan mode offline',
    items: [
      'Tasbih Digital — hitungan dzikir per kalimat, bukan cuma satu angka.',
      'Ayat Favorit — simpan ayat yang berkesan, terpisah dari bookmark terakhir baca.',
      'Cari Ayat — cari isi ayat pakai kata kunci, gak cuma nama surat.',
      'Bagikan ayat sebagai gambar langsung dari Mode Ayat.',
      'Baca Qur\'an tetap jalan walau koneksi lagi jelek (mode offline).',
      'Terjemahan per kata (word-by-word) di Mode Ayat.',
      'Rentetan (streak) harian buat Dzikir Pagi & Petang.',
      'Amalan Harian — checklist sholat, dzikir, dan tilawah dalam satu kartu di Beranda.',
      'Pengingat Zakat Maal begitu udah lewat 1 haul.',
    ],
  },
  {
    version: 3,
    date: '2026-09-01',
    title: 'Tampilan baru dengan foto arsitektur Islami',
    items: [
      'Header Beranda, halaman Login, dan halaman konten lain sekarang pakai foto asli, bukan pola CSS polos.',
      'Gambar sampul (og-image) muncul kalau link airmoon dibagikan ke WhatsApp/media sosial.',
    ],
  },
];
