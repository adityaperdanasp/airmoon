// Hukum tajwid dasar dengan contoh yang lazim dipakai di buku pelajaran.
// Ini ringkasan untuk belajar awal; belajar tajwid yang benar tetap lewat
// guru (talaqqi). Perlu dicek guru tajwid sebelum diubah atau ditambah.
export const TAJWID = [
  { id: 'idzhar', name: 'Idzhar Halqi', rule: 'Nun sukun atau tanwin bertemu salah satu huruf tenggorokan: ء ه ع ح غ خ. Dibaca jelas, tanpa dengung.', ex: 'مَنْ آمَنَ' },
  { id: 'idgham-bi', name: 'Idgham Bighunnah', rule: 'Nun sukun atau tanwin bertemu ي ن م و. Dilebur dengan dengung.', ex: 'مَنْ يَقُولُ' },
  { id: 'idgham-bila', name: 'Idgham Bilaghunnah', rule: 'Nun sukun atau tanwin bertemu ل atau ر. Dilebur tanpa dengung.', ex: 'مِنْ رَبِّهِمْ' },
  { id: 'iqlab', name: 'Iqlab', rule: 'Nun sukun atau tanwin bertemu huruf ب. Diubah menjadi bunyi mim dengan dengung.', ex: 'مِنْ بَعْدِ' },
  { id: 'ikhfa', name: 'Ikhfa Haqiqi', rule: 'Nun sukun atau tanwin bertemu salah satu dari 15 huruf sisanya. Dibaca samar dengan dengung.', ex: 'مِنْ كُلِّ' },
  { id: 'idgham-mimi', name: 'Idgham Mimi', rule: 'Mim sukun bertemu huruf م. Dilebur dengan dengung.', ex: 'لَهُمْ مَا' },
  { id: 'ikhfa-syafawi', name: 'Ikhfa Syafawi', rule: 'Mim sukun bertemu huruf ب. Dibaca samar di bibir dengan dengung.', ex: 'تَرْمِيهِمْ بِحِجَارَةٍ' },
  { id: 'idzhar-syafawi', name: 'Idzhar Syafawi', rule: 'Mim sukun bertemu huruf selain م dan ب. Dibaca jelas.', ex: 'هُمْ فِيهَا' },
  { id: 'qalqalah', name: 'Qalqalah', rule: 'Huruf ق ط ب ج د yang sukun dibaca memantul. Huruf-hurufnya terkumpul dalam "qutbu jadin".', ex: 'يَجْعَلُونَ' },
  { id: 'mad-thabii', name: "Mad Thabi'i", rule: 'Mad asli, dibaca 2 harakat, tidak bertemu hamzah atau sukun setelahnya.', ex: 'قَالَ' },
  { id: 'mad-muttasil', name: 'Mad Wajib Muttasil', rule: 'Mad bertemu hamzah dalam satu kata. Dibaca panjang (4 sampai 5 harakat).', ex: 'جَاءَ' },
];
