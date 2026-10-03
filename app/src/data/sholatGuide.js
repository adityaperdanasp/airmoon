// Rincian Jumlah Rakaat (2026-09-14) — the 5 daily fardhu counts, plus
// their most commonly prayed sunnah rawatib (before/after), since the
// step-by-step guide below deliberately only ever covered the shared
// rakaat cycle, not "how many of these do I actually do, and when".
export const PRAYER_RAKAAT_INFO = [
  { name: 'Subuh', fardhu: 2, sunnahSebelum: 2, sunnahSesudah: 0, catatan: 'Dua rakaat sebelum Subuh lebih baik dari dunia dan seisinya (HR. Muslim no. 725).' },
  { name: 'Dzuhur', fardhu: 4, sunnahSebelum: 2, sunnahSesudah: 2, catatan: 'Ada riwayat 4 rakaat sebelum Dzuhur (HR. At-Tirmidzi no. 415, Ummu Habibah), dan 2 rakaat (HR. Bukhari no. 1180, Muslim no. 729, Ibnu Umar). Keduanya boleh.' },
  { name: 'Ashar', fardhu: 4, sunnahSebelum: 4, sunnahSesudah: 0, catatan: "Bukan rawatib muakkad, tapi dianjurkan 4 rakaat sebelum Ashar (HR. Abu Dawud no. 1271, At-Tirmidzi no. 430; dinilai hasan oleh Al-Albani)." },
  { name: 'Maghrib', fardhu: 3, sunnahSebelum: 0, sunnahSesudah: 2, catatan: 'Boleh 2 rakaat ringan antara adzan dan iqamah (HR. Bukhari no. 625, Muslim no. 838).' },
  { name: 'Isya', fardhu: 4, sunnahSebelum: 0, sunnahSesudah: 2, catatan: 'Total rawatib muakkad 12 rakaat sehari semalam dijanjikan rumah di surga (HR. Muslim no. 728).' },
];

// Panduan Sholat Pemula (2026-09-12) — a step-by-step walkthrough of one
// full rakaat cycle (takbir through salam; niat is a heart action, not recited — see step 1), aimed at a muallaf or anyone
// relearning sholat from scratch. Deliberately covers the shared core
// every rakaat has in common rather than all 5 sholat's full rakaat
// counts/specifics — that's a much bigger reference this single guide
// isn't trying to replace. PRAYER_RAKAAT_INFO above now covers the "how
// many rakaat, kapan" part that was missing.
export const SHOLAT_STEPS = [
  {
    title: 'Niat',
    gerakan: 'Berdiri tegak menghadap kiblat. Niat itu amalan hati: cukup tekadkan di dalam hati sholat apa yang akan kamu kerjakan. Tidak ada contoh dari Nabi ﷺ maupun para sahabat untuk melafalkannya (seperti "Ushalli..."), jadi tidak perlu diucapkan.',
    arabic: '',
    latin: '',
    translation: 'Dalil: "Sesungguhnya amal itu tergantung niatnya." (HR. Bukhari no. 1, Muslim no. 1907)',
  },
  {
    title: 'Takbiratul Ihram',
    gerakan: 'Angkat kedua tangan setinggi bahu atau telinga (HR. Bukhari no. 735, Muslim no. 391), lalu letakkan tangan kanan di atas tangan kiri di dada (HR. Ibnu Khuzaimah no. 479). Mulai saat ini diharamkan hal di luar sholat.',
    arabic: 'اَللّٰهُ أَكْبَرُ',
    latin: 'Allahu Akbar',
    translation: 'Allah Maha Besar.',
  },
  {
    title: 'Doa Istiftah (Sunnah)',
    gerakan: 'Setelah takbir dan sebelum Al-Fatihah, di rakaat pertama. Hukumnya sunnah. Ada beberapa bacaan yang shahih; ini salah satunya.',
    arabic: 'اَللّٰهُمَّ بَاعِدْ بَيْنِيْ وَبَيْنَ خَطَايَايَ كَمَا بَاعَدْتَ بَيْنَ الْمَشْرِقِ وَالْمَغْرِبِ، اَللّٰهُمَّ نَقِّنِيْ مِنَ الْخَطَايَا كَمَا يُنَقَّى الثَّوْبُ الْأَبْيَضُ مِنَ الدَّنَسِ، اَللّٰهُمَّ اغْسِلْ خَطَايَايَ بِالْمَاءِ وَالثَّلْجِ وَالْبَرَدِ',
    latin: "Allahumma ba'id baini wa baina khathayaya kama ba'adta bainal masyriqi wal maghrib. Allahumma naqqini minal khathaya kama yunaqqats tsaubul abyadhu minad danas. Allahummaghsil khathayaya bilma'i wats tsalji wal barad.",
    translation: 'Ya Allah, jauhkanlah antara aku dan dosa-dosaku sebagaimana Engkau jauhkan timur dan barat. Ya Allah, bersihkanlah aku dari dosa sebagaimana kain putih dibersihkan dari kotoran. Ya Allah, cucilah dosa-dosaku dengan air, salju dan embun. (HR. Bukhari no. 744, Muslim no. 598)',
  },
  {
    title: 'Al-Fatihah',
    gerakan: 'Tetap berdiri, baca Al-Fatihah (rukun di setiap rakaat; HR. Bukhari no. 756, Muslim no. 394). Akhiri dengan "Aamiin". Di rakaat 1 dan 2 disambung surah atau ayat lain dari Al-Qur\'an.',
    arabic: 'بِسْمِ اللّٰهِ الرَّحْمٰنِ الرَّحِيْمِ ۝ اَلْحَمْدُ لِلّٰهِ رَبِّ الْعٰلَمِيْنَ',
    latin: "Bismillahir rahmanir rahim. Alhamdulillahi rabbil 'alamin...",
    translation: 'Dengan nama Allah Yang Maha Pengasih, Maha Penyayang. Segala puji bagi Allah, Tuhan seluruh alam...',
  },
  {
    title: 'Ruku',
    gerakan: "Membungkuk, kedua telapak tangan memegang lutut dengan jari terbuka, punggung lurus. Bacaan ini shahih tanpa tambahan (HR. Muslim no. 772). Tambahan \"wa bihamdih\" juga diriwayatkan (HR. Abu Dawud no. 870) dan dinilai hasan oleh Al-Albani, meski sebagian ulama mendhaifkannya — keduanya boleh.",
    arabic: 'سُبْحَانَ رَبِّيَ الْعَظِيْمِ',
    latin: "Subhaana rabbiyal 'adzim",
    translation: 'Maha Suci Tuhanku Yang Maha Agung. (dibaca 3x)',
  },
  {
    title: "I'tidal",
    gerakan: 'Bangkit dari ruku sampai berdiri tegak. Imam dan orang yang sholat sendiri mengucapkan "Sami\'allahu liman hamidah", lalu semuanya "Rabbana wa lakal hamd" (HR. Bukhari no. 689, Muslim no. 409).',
    arabic: 'سَمِعَ اللّٰهُ لِمَنْ حَمِدَهُ، رَبَّنَا وَلَكَ الْحَمْدُ',
    latin: "Sami'allahu liman hamidah, rabbana wa lakal hamd",
    translation: 'Allah mendengar orang yang memuji-Nya. Ya Tuhan kami, bagi-Mu segala puji.',
  },
  {
    title: 'Sujud (Pertama)',
    gerakan: 'Turun sujud dengan tujuh anggota menempel: dahi (termasuk hidung), kedua telapak tangan, kedua lutut, dan ujung kedua kaki (HR. Bukhari no. 812, Muslim no. 490).',
    arabic: 'سُبْحَانَ رَبِّيَ الْأَعْلَى',
    latin: "Subhaana rabbiyal a'la",
    translation: 'Maha Suci Tuhanku Yang Maha Tinggi. (dibaca 3x; HR. Muslim no. 772)',
  },
  {
    title: 'Duduk Antara Dua Sujud',
    gerakan: 'Duduk iftirasy: duduk di atas telapak kaki kiri, kaki kanan ditegakkan. Bacaan yang lebih ringkas juga shahih: "Rabbighfirli" (HR. Ibnu Majah no. 897).',
    arabic: 'رَبِّ اغْفِرْ لِيْ وَارْحَمْنِيْ وَاجْبُرْنِيْ وَارْفَعْنِيْ وَارْزُقْنِيْ وَاهْدِنِيْ وَعَافِنِيْ',
    latin: "Rabbighfirli warhamni wajburni warfa'ni warzuqni wahdini wa 'afini",
    translation: 'Ya Tuhanku, ampunilah aku, rahmatilah aku, cukupkanlah kekuranganku, tinggikanlah derajatku, berilah aku rezeki, berilah aku petunjuk, dan berilah aku kesehatan. (HR. Abu Dawud no. 850, At-Tirmidzi no. 284)',
  },
  {
    title: 'Sujud (Kedua)',
    gerakan: 'Sujud lagi seperti sujud pertama. Ini melengkapi satu rakaat. Kalau masih ada rakaat berikutnya, bangkit berdiri; di rakaat ke-2 duduk tasyahud awal.',
    arabic: 'سُبْحَانَ رَبِّيَ الْأَعْلَى',
    latin: "Subhaana rabbiyal a'la",
    translation: 'Maha Suci Tuhanku Yang Maha Tinggi. (dibaca 3x)',
  },
  {
    title: 'Tasyahud Akhir',
    gerakan: 'Di rakaat terakhir, duduk tawarruk (pantat menyentuh lantai, kaki kiri keluar dari bawah kaki kanan). Telunjuk kanan diisyaratkan saat tasyahud (HR. Muslim no. 580). Setelah tasyahud, baca shalawat Ibrahimiyyah, lalu berlindung dari empat perkara.',
    arabic: 'اَلتَّحِيَّاتُ لِلّٰهِ وَالصَّلَوَاتُ وَالطَّيِّبَاتُ، اَلسَّلَامُ عَلَيْكَ أَيُّهَا النَّبِيُّ وَرَحْمَةُ اللّٰهِ وَبَرَكَاتُهُ، اَلسَّلَامُ عَلَيْنَا وَعَلَى عِبَادِ اللّٰهِ الصَّالِحِيْنَ، أَشْهَدُ أَنْ لَا إِلٰهَ إِلَّا اللّٰهُ وَأَشْهَدُ أَنَّ مُحَمَّدًا عَبْدُهُ وَرَسُوْلُهُ',
    latin: "Attahiyyatu lillahi wash shalawatu wath thayyibat. Assalamu 'alaika ayyuhan nabiyyu wa rahmatullahi wa barakatuh. Assalamu 'alaina wa 'ala 'ibadillahish shalihin. Asyhadu alla ilaha illallah wa asyhadu anna Muhammadan 'abduhu wa rasuluh.",
    translation: 'Segala penghormatan, shalawat dan kebaikan hanya milik Allah. Semoga keselamatan, rahmat dan berkah Allah tercurah kepadamu wahai Nabi. Semoga keselamatan tercurah kepada kami dan hamba-hamba Allah yang shalih. Aku bersaksi tiada sesembahan yang berhak disembah selain Allah, dan aku bersaksi Muhammad adalah hamba dan utusan-Nya. (HR. Bukhari no. 831, Muslim no. 402)',
  },
  {
    title: 'Shalawat & Perlindungan',
    gerakan: 'Lanjutan tasyahud akhir. Shalawat Ibrahimiyyah (HR. Bukhari no. 3370), lalu berlindung dari empat perkara: siksa Jahannam, siksa kubur, fitnah hidup dan mati, dan fitnah Dajjal (HR. Muslim no. 588).',
    arabic: 'اَللّٰهُمَّ صَلِّ عَلَى مُحَمَّدٍ وَعَلَى آلِ مُحَمَّدٍ كَمَا صَلَّيْتَ عَلَى إِبْرَاهِيْمَ وَعَلَى آلِ إِبْرَاهِيْمَ إِنَّكَ حَمِيْدٌ مَجِيْدٌ، اَللّٰهُمَّ بَارِكْ عَلَى مُحَمَّدٍ وَعَلَى آلِ مُحَمَّدٍ كَمَا بَارَكْتَ عَلَى إِبْرَاهِيْمَ وَعَلَى آلِ إِبْرَاهِيْمَ إِنَّكَ حَمِيْدٌ مَجِيْدٌ',
    latin: "Allahumma shalli 'ala Muhammad wa 'ala ali Muhammad kama shallaita 'ala Ibrahim wa 'ala ali Ibrahim innaka hamidum majid. Allahumma barik 'ala Muhammad wa 'ala ali Muhammad kama barakta 'ala Ibrahim wa 'ala ali Ibrahim innaka hamidum majid.",
    translation: 'Ya Allah, limpahkan shalawat kepada Muhammad dan keluarga Muhammad sebagaimana Engkau limpahkan kepada Ibrahim dan keluarga Ibrahim, sesungguhnya Engkau Maha Terpuji lagi Maha Mulia. Ya Allah, berkahilah Muhammad dan keluarga Muhammad sebagaimana Engkau berkahi Ibrahim dan keluarga Ibrahim, sesungguhnya Engkau Maha Terpuji lagi Maha Mulia.',
  },
  {
    title: 'Salam',
    gerakan: 'Menoleh ke kanan lalu ke kiri sambil mengucap salam (HR. Abu Dawud no. 996, At-Tirmidzi no. 295; dishahihkan Al-Albani). Dengan salam, sholat selesai.',
    arabic: 'اَلسَّلَامُ عَلَيْكُمْ وَرَحْمَةُ اللّٰهِ',
    latin: "Assalamu'alaikum wa rahmatullah",
    translation: 'Semoga keselamatan dan rahmat Allah tercurah untuk kalian.',
  },
];
