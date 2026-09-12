// Panduan Sholat Pemula (2026-09-12) — a step-by-step walkthrough of one
// full rakaat cycle (niat through salam), aimed at a muallaf or anyone
// relearning sholat from scratch. Deliberately covers the shared core
// every rakaat has in common rather than all 5 sholat's full rakaat
// counts/specifics — that's a much bigger reference this single guide
// isn't trying to replace.
export const SHOLAT_STEPS = [
  {
    title: 'Niat',
    gerakan: 'Berdiri tegak menghadap kiblat. Niat cukup di dalam hati, gak wajib diucapkan keras-keras — tapi kalau mau lebih mantap, boleh dilafalkan pelan.',
    arabic: 'أُصَلِّي فَرْضَ ... مُسْتَقْبِلَ الْقِبْلَةِ أَدَاءً لِلّٰهِ تَعَالَى',
    latin: "Ushalli fardha ... mustaqbilal qiblati ada'an lillahi ta'ala",
    translation: 'Aku niat sholat fardhu ... menghadap kiblat karena Allah Ta\'ala.',
  },
  {
    title: 'Takbiratul Ihram',
    gerakan: 'Angkat kedua tangan sejajar telinga/bahu, lalu bersedekap. Ini menandai dimulainya sholat — mulai saat ini gak boleh ngobrol atau melakukan hal di luar sholat.',
    arabic: 'اَللّٰهُ أَكْبَرُ',
    latin: 'Allahu Akbar',
    translation: 'Allah Maha Besar.',
  },
  {
    title: 'Al-Fatihah',
    gerakan: 'Tetap berdiri, baca Al-Fatihah — wajib di setiap rakaat. Setelahnya boleh disambung surah pendek lain (di rakaat 1 & 2).',
    arabic: 'بِسْمِ اللّٰهِ الرَّحْمٰنِ الرَّحِيْمِ ۝ اَلْحَمْدُ لِلّٰهِ رَبِّ الْعٰلَمِيْنَ',
    latin: "Bismillahir rahmanir rahim. Alhamdulillahi rabbil 'alamin...",
    translation: 'Dengan nama Allah Yang Maha Pengasih, Maha Penyayang. Segala puji bagi Allah, Tuhan seluruh alam...',
  },
  {
    title: 'Ruku',
    gerakan: 'Badan membungkuk 90°, kedua tangan memegang lutut, punggung & kepala lurus sejajar.',
    arabic: 'سُبْحَانَ رَبِّيَ الْعَظِيْمِ وَبِحَمْدِهِ',
    latin: "Subhaana rabbiyal 'adzimi wa bihamdih",
    translation: 'Maha Suci Tuhanku Yang Maha Agung dan segala puji bagi-Nya. (dibaca 3x)',
  },
  {
    title: "I'tidal",
    gerakan: 'Bangkit dari ruku, berdiri tegak kembali dengan tangan lurus di samping.',
    arabic: 'سَمِعَ اللّٰهُ لِمَنْ حَمِدَهُ، رَبَّنَا لَكَ الْحَمْدُ',
    latin: 'Sami\'allahu liman hamidah, rabbana lakal hamd',
    translation: 'Allah mendengar orang yang memuji-Nya. Ya Tuhan kami, bagi-Mu segala puji.',
  },
  {
    title: 'Sujud (Pertama)',
    gerakan: 'Turun ke lantai — dahi, hidung, kedua telapak tangan, kedua lutut, dan ujung jari kaki menyentuh lantai.',
    arabic: 'سُبْحَانَ رَبِّيَ الْأَعْلَى وَبِحَمْدِهِ',
    latin: "Subhaana rabbiyal a'la wa bihamdih",
    translation: 'Maha Suci Tuhanku Yang Maha Tinggi dan segala puji bagi-Nya. (dibaca 3x)',
  },
  {
    title: 'Duduk Antara Dua Sujud',
    gerakan: 'Duduk sebentar di antara sujud pertama dan kedua, duduk iftirasy (duduk di atas kaki kiri, kaki kanan tegak).',
    arabic: 'رَبِّ اغْفِرْ لِيْ وَارْحَمْنِيْ وَاجْبُرْنِيْ وَارْفَعْنِيْ وَارْزُقْنِيْ وَاهْدِنِيْ وَعَافِنِيْ وَاعْفُ عَنِّيْ',
    latin: "Rabbighfirli warhamni wajburni warfa'ni warzuqni wahdini wa 'aafini wa'fu 'anni",
    translation: 'Ya Tuhanku, ampunilah aku, kasihanilah aku, cukupkanlah kekuranganku, angkatlah derajatku, berilah aku rezeki, berilah aku petunjuk, berilah aku kesehatan, dan maafkanlah aku.',
  },
  {
    title: 'Sujud (Kedua)',
    gerakan: 'Sujud lagi, sama seperti sujud pertama — ini melengkapi satu rakaat penuh.',
    arabic: 'سُبْحَانَ رَبِّيَ الْأَعْلَى وَبِحَمْدِهِ',
    latin: "Subhaana rabbiyal a'la wa bihamdih",
    translation: 'Maha Suci Tuhanku Yang Maha Tinggi dan segala puji bagi-Nya. (dibaca 3x)',
  },
  {
    title: 'Tasyahud Akhir',
    gerakan: 'Di rakaat terakhir, duduk tawarruk (duduk menyamping, telapak kaki kiri keluar dari bawah kaki kanan). Telunjuk kanan diangkat saat membaca "Asyhadu alla ilaha illallah".',
    arabic: 'اَلتَّحِيَّاتُ لِلّٰهِ وَالصَّلَوَاتُ وَالطَّيِّبَاتُ ... أَشْهَدُ أَنْ لَا إِلٰهَ إِلَّا اللّٰهُ وَأَشْهَدُ أَنَّ مُحَمَّدًا رَسُوْلُ اللّٰهِ',
    latin: "Attahiyyatu lillahi wash shalawatu wath thayyibat... Asyhadu alla ilaha illallah wa asyhadu anna Muhammadar rasulullah",
    translation: 'Segala kehormatan, sholawat, dan kebaikan hanya milik Allah... Aku bersaksi tiada Tuhan selain Allah dan aku bersaksi Muhammad adalah utusan Allah.',
  },
  {
    title: 'Salam',
    gerakan: 'Menoleh ke kanan lalu ke kiri, mengucap salam — ini menandai sholat selesai.',
    arabic: 'اَلسَّلَامُ عَلَيْكُمْ وَرَحْمَةُ اللّٰهِ',
    latin: "Assalamu'alaikum wa rahmatullah",
    translation: 'Semoga keselamatan dan rahmat Allah tercurah untukmu.',
  },
];
