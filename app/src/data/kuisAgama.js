// Kuis Agama Harian: soal dasar yang kebenarannya sudah umum dan disepakati,
// masing-masing dengan dalil singkat yang ditampilkan setelah menjawab.
// Sengaja TIDAK memuat masalah khilaf ulama. Perlu dicek ustadz sunnah
// sebelum ditambah atau diubah.
export const KUIS = [
  { q: 'Rukun Islam ada berapa?', o: ['3', '4', '5', '6'], a: 2, d: 'HR. Bukhari dan Muslim: "Islam dibangun di atas lima perkara."' },
  { q: 'Rukun iman ada berapa?', o: ['4', '5', '6', '7'], a: 2, d: 'HR. Muslim (hadits Jibril): iman kepada Allah, malaikat, kitab, rasul, hari akhir, dan takdir.' },
  { q: 'Berapa sholat fardhu dalam sehari semalam?', o: ['3', '4', '5', '6'], a: 2, d: 'Lima sholat, diwajibkan pada peristiwa Isra Mi\'raj (HR. Bukhari dan Muslim).' },
  { q: 'Surat pertama dalam mushaf Al-Qur\'an?', o: ['Al-Baqarah', 'Al-Fatihah', 'An-Nas', 'Al-Ikhlas'], a: 1, d: 'Al-Fatihah, dibaca di setiap rakaat sholat.' },
  { q: 'Berapa jumlah surat dalam Al-Qur\'an?', o: ['100', '110', '114', '120'], a: 2, d: 'Al-Qur\'an terdiri dari 114 surat.' },
  { q: 'Surat terpanjang dalam Al-Qur\'an?', o: ['Ali Imran', 'An-Nisa', 'Al-Baqarah', 'Al-Maidah'], a: 2, d: 'Al-Baqarah, 286 ayat.' },
  { q: 'Ayat Kursi terdapat dalam surat apa?', o: ['Al-Baqarah', 'Ali Imran', 'Yasin', 'Al-Kahfi'], a: 0, d: 'QS. Al-Baqarah ayat 255.' },
  { q: 'Pada bulan apa puasa wajib dikerjakan?', o: ['Rajab', 'Sya\'ban', 'Ramadhan', 'Syawal'], a: 2, d: 'QS. Al-Baqarah: 185.' },
  { q: 'Zakat fitrah ditunaikan sebelum...', o: ['Sholat Id', 'Sholat Tarawih', 'Malam Nuzulul Qur\'an', 'Akhir Syawal'], a: 0, d: 'HR. Bukhari: dibayarkan sebelum orang-orang keluar untuk sholat Id.' },
  { q: 'Nisab zakat maal emas kira-kira berapa gram?', o: ['20 gram', '50 gram', '85 gram', '100 gram'], a: 2, d: 'Dua puluh dinar, sekitar 85 gram emas murni.' },
  { q: 'Berapa rakaat sholat fardhu Subuh?', o: ['2', '3', '4', '5'], a: 0, d: 'Subuh 2 rakaat. Dzuhur, Ashar, Isya 4 rakaat. Maghrib 3 rakaat.' },
  { q: 'Berapa rakaat sholat fardhu Maghrib?', o: ['2', '3', '4', '5'], a: 1, d: 'Maghrib 3 rakaat.' },
  { q: 'Bacaan yang wajib di setiap rakaat sholat?', o: ['Surat An-Nas', 'Al-Fatihah', 'Ayat Kursi', 'Al-Ikhlas'], a: 1, d: 'HR. Bukhari dan Muslim: tidak sah sholat orang yang tidak membaca Al-Fatihah.' },
  { q: 'Surat yang dianjurkan dibaca di hari Jumat?', o: ['Al-Kahfi', 'Al-Waqi\'ah', 'Yasin', 'Ar-Rahman'], a: 0, d: 'Keutamaan membaca Al-Kahfi di hari Jumat (HR. Al-Hakim, dishahihkan Al-Albani).' },
  { q: 'Siapa nabi terakhir?', o: ['Isa', 'Musa', 'Muhammad ﷺ', 'Ibrahim'], a: 2, d: 'QS. Al-Ahzab: 40: penutup para nabi.' },
  { q: 'Malaikat yang menyampaikan wahyu kepada para nabi?', o: ['Mikail', 'Jibril', 'Israfil', 'Izrail'], a: 1, d: 'QS. Al-Baqarah: 97.' },
  { q: 'Kitab yang diturunkan kepada Nabi Dawud?', o: ['Taurat', 'Injil', 'Zabur', 'Shuhuf'], a: 2, d: 'QS. An-Nisa: 163.' },
  { q: 'Arah kiblat umat Islam saat sholat?', o: ['Masjid Nabawi', 'Ka\'bah di Masjidil Haram', 'Masjidil Aqsa', 'Gunung Uhud'], a: 1, d: 'QS. Al-Baqarah: 144.' },
  { q: 'Puncak ibadah haji adalah wukuf di...', o: ['Mina', 'Muzdalifah', 'Arafah', 'Makkah'], a: 2, d: 'HR. At-Tirmidzi dan lainnya: "Haji itu Arafah."' },
  { q: 'Puasa sunnah setelah Ramadhan, enam hari di bulan...', o: ['Syawal', 'Dzulhijjah', 'Muharram', 'Rajab'], a: 0, d: 'HR. Muslim: puasa Ramadhan lalu enam hari di bulan Syawal.' },
  { q: 'Malam Lailatul Qadar lebih baik dari...', o: ['Seratus bulan', 'Seribu bulan', 'Sepuluh tahun', 'Seribu hari'], a: 1, d: 'QS. Al-Qadr: 3.' },
  { q: 'Surat yang tidak diawali dengan Basmalah?', o: ['Al-Anfal', 'At-Taubah', 'Yunus', 'Hud'], a: 1, d: 'Surat At-Taubah (Bara\'ah).' },
  { q: 'Siapa orang yang paling berhak dibaktikan?', o: ['Ayah', 'Ibu', 'Guru', 'Tetangga'], a: 1, d: 'HR. Bukhari dan Muslim: "Ibumu, ibumu, ibumu, lalu ayahmu."' },
  { q: 'Hukum sholat Jumat bagi laki-laki muslim yang mukim?', o: ['Sunnah', 'Wajib', 'Mubah', 'Makruh'], a: 1, d: 'QS. Al-Jumu\'ah: 9.' },
  { q: 'Idul Fitri jatuh pada tanggal...', o: ['1 Ramadhan', '10 Ramadhan', '1 Syawal', '10 Dzulhijjah'], a: 2, d: '1 Syawal. Idul Adha 10 Dzulhijjah.' },
  { q: 'Puasa dilarang pada hari...', o: ['Senin', 'Jumat', 'Idul Fitri dan Idul Adha', 'Ayyamul Bidh'], a: 2, d: 'HR. Bukhari dan Muslim: larangan puasa di dua hari raya.' },
  { q: 'Amal pertama yang dihisab pada hari kiamat?', o: ['Zakat', 'Sholat', 'Puasa', 'Haji'], a: 1, d: 'HR. At-Tirmidzi dan Abu Dawud (dishahihkan Al-Albani): yang pertama dihisab dari amal adalah sholatnya.' },
  { q: 'Berapa kali sujud dalam satu rakaat?', o: ['1', '2', '3', '4'], a: 1, d: 'Dua kali sujud dalam setiap rakaat.' },
  { q: 'Surat yang menjadi sepertiga Al-Qur\'an (keutamaannya)?', o: ['Al-Ikhlas', 'Al-Falaq', 'An-Nas', 'Al-Kafirun'], a: 0, d: 'HR. Bukhari: Qul Huwallahu Ahad setara sepertiga Al-Qur\'an.' },
  { q: 'Dalam wudhu, yang dibasuh pertama kali setelah niat dan basmalah adalah...', o: ['Wajah', 'Kedua telapak tangan', 'Kaki', 'Kepala'], a: 1, d: 'Sunnah mencuci kedua telapak tangan lebih dulu (HR. Bukhari dan Muslim, sifat wudhu Nabi ﷺ).' },
];

// Tiga soal per hari, tetap sama di hari yang sama.
export function todaysQuiz(date = new Date()) {
  const start = new Date(date.getFullYear(), 0, 0);
  const day = Math.floor((date - start) / 86400000);
  return [0, 1, 2].map((i) => KUIS[(day * 3 + i) % KUIS.length]);
}
