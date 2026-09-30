// Tatacara Penanganan Jenazah (2026-10-01) — mengurus jenazah muslim itu
// fardhu kifayah (kewajiban kolektif: kalau udah ada sebagian orang yang
// ngerjain, gugur kewajiban yang lain, tapi kalau gak ada sama sekali
// yang ngerjain, semua orang di lingkungan itu berdosa). 4 fase wajib:
// memandikan, mengkafani, mensholatkan, menguburkan — mengikuti
// pendapat mayoritas mazhab Sunni (fiqh muamalah umum, bukan satu
// mazhab spesifik). Praktik detail (jumlah lipatan kafan, bacaan talqin,
// dll) bisa beda tipis antar daerah/ormas — kalau ragu soal kasus
// spesifik, tetep konsultasi ke ustadz/DKM setempat, sama kayak
// disclaimer lib/warisCalc.js buat kasus waris yang lebih kompleks.
//
// Video id-nya diverifikasi lewat web search dulu (judul + channel
// dicek satu-satu via WebFetch), bukan ditebak — semua dari Buya Yahya
// atau NU Online, dua sumber arus utama yang gak kontroversial.

export const JENAZAH_STEPS = [
  {
    title: 'Memandikan Jenazah',
    hukum: 'Fardhu Kifayah',
    intro: 'Jenazah muslim wajib dimandikan sebelum dikafani, kecuali syuhada perang (mereka dikuburkan dengan pakaian yang melekat saat gugur). Yang paling berhak memandikan: sesama jenis kelamin, atau suami/istri, atau mahram. Dilakukan di tempat tertutup, hanya orang yang memandikan yang boleh ada di ruangan.',
    youtubeId: 'KM9egfrueRA',
    poin: [
      'Niatkan di dalam hati untuk memandikan jenazah karena Allah.',
      'Tutup aurat jenazah dengan kain selama proses (jangan sampai terbuka).',
      'Bersihkan dulu kotoran dari tubuh jenazah (istinja) dengan lembut.',
      'Wudhukan jenazah seperti tata cara wudhu untuk sholat.',
      'Siram seluruh tubuh secara merata, dimulai dari sisi kanan, minimal 3 kali (ganjil — bisa 5 atau 7 kali kalau perlu sampai bersih).',
      'Gunakan air yang dicampur daun bidara atau sabun pada siraman pertama-kedua, lalu bilas dengan air bersih.',
      'Siraman terakhir dicampur sedikit kapur barus atau wewangian.',
      'Keringkan tubuh jenazah dengan handuk/kain bersih setelah selesai.',
    ],
  },
  {
    title: 'Mengkafani Jenazah',
    hukum: 'Fardhu Kifayah',
    intro: 'Kain kafan yang digunakan sebaiknya berwarna putih, bersih, dan menutup seluruh tubuh. Untuk jenazah laki-laki umumnya 3 lapis kain, untuk perempuan 5 lapis (termasuk kerudung dan semacam baju kurung).',
    youtubeId: '6qNf1S-mwFE',
    poin: [
      'Bentangkan kain kafan berlapis-lapis di tempat yang bersih, taburi dengan wewangian di antara lapisannya.',
      'Letakkan jenazah di atas kain yang sudah dibentangkan, dalam posisi terlentang.',
      'Rapikan posisi tangan jenazah (mengikuti kebiasaan setempat — diletakkan lurus di samping badan atau disedekapkan, kedua pendapat ini ada dalam fiqih).',
      'Sumbat lubang-lubang tubuh (hidung, telinga, dll) dengan kapas jika diperlukan.',
      'Lipat kain kafan dari sisi kiri dahulu, baru sisi kanan, sampai seluruh tubuh tertutup rapi.',
      'Ikat kain kafan dengan tali di beberapa titik (kepala, dada, pinggang, lutut, kaki) — tali ini akan dilepas saat jenazah sudah berada di liang lahat.',
    ],
  },
  {
    title: 'Mensholatkan Jenazah',
    hukum: 'Fardhu Kifayah',
    intro: 'Sholat jenazah dilakukan dengan berdiri, tanpa ruku dan sujud — hanya 4 takbir diselingi bacaan tertentu, lalu ditutup salam. Posisi imam: sejajar dengan kepala jenazah untuk laki-laki, sejajar bagian tengah/perut untuk jenazah perempuan.',
    youtubeId: 'QiCMDLM941g',
    takbir: [
      {
        label: 'Takbir Pertama',
        detail: 'Niat sholat jenazah dalam hati, lalu takbiratul ihram, dilanjutkan membaca Al-Fatihah.',
      },
      {
        label: 'Takbir Kedua',
        arabic: 'اَللّٰهُمَّ صَلِّ عَلَى مُحَمَّدٍ وَعَلَى آلِ مُحَمَّدٍ',
        latin: "Allahumma shalli 'ala Muhammad wa 'ala aali Muhammad",
        translation: 'Ya Allah, limpahkanlah sholawat kepada Nabi Muhammad dan keluarganya.',
      },
      {
        label: 'Takbir Ketiga',
        arabic: 'اَللّٰهُمَّ اغْفِرْ لَهُ وَارْحَمْهُ وَعَافِهِ وَاعْفُ عَنْهُ',
        latin: "Allahummaghfir lahu warhamhu wa 'aafihi wa'fu 'anhu",
        translation: 'Ya Allah, ampunilah dia, kasihanilah dia, sejahterakanlah dia, dan maafkanlah dia.',
      },
      {
        label: 'Takbir Keempat',
        arabic: 'اَللّٰهُمَّ لَا تَحْرِمْنَا أَجْرَهُ وَلَا تَفْتِنَّا بَعْدَهُ',
        latin: "Allahumma laa tahrimnaa ajrahu wa laa taftinnaa ba'dahu",
        translation: 'Ya Allah, jangan Engkau halangi kami dari pahalanya, dan jangan Engkau beri kami fitnah sepeninggalnya. Dilanjutkan salam ke kanan dan kiri.',
      },
    ],
    poin: [
      'Untuk jenazah perempuan, ganti dhamir "hu" (dia laki-laki) pada bacaan takbir 3 & 4 menjadi "ha" (dia perempuan).',
      'Sholat jenazah dilakukan berjamaah dengan minimal 1 shaf, semakin banyak shaf semakin dianjurkan.',
      'Boleh dilakukan di masjid, rumah duka, atau langsung di area pemakaman.',
    ],
  },
  {
    title: 'Menguburkan Jenazah',
    hukum: 'Fardhu Kifayah',
    intro: 'Liang lahat digali cukup dalam (umumnya sedalam pinggang hingga dada orang dewasa) agar aman dari galian binatang dan tercium bau, dengan lubang menyamping (lahat) menghadap kiblat untuk meletakkan jenazah.',
    youtubeId: 'UihnvRcUUZo',
    poin: [
      'Masukkan jenazah ke liang lahat dari arah kaki kubur, dimulai dengan mendahulukan bagian kepala.',
      'Baringkan jenazah miring menghadap kiblat, dengan pipi kanan menyentuh tanah (lepaskan tali kafan sebelum ditutup papan/bambu penutup lahat).',
      'Ucapkan: "Bismillahi wa \'ala millati Rasulillah" (Dengan nama Allah dan atas agama Rasulullah) saat meletakkan jenazah.',
      'Tutup liang lahat dengan papan/bambu, lalu timbun dengan tanah hingga membentuk gundukan secukupnya (tidak berlebihan).',
      'Setelah selesai ditimbun, dianjurkan berdoa memohonkan ampun dan keteguhan jawaban bagi jenazah saat ditanya malaikat di alam kubur.',
      'Hindari duduk atau menginjak di atas kuburan orang lain, dan hindari membangun sesuatu yang berlebihan di atas makam.',
    ],
  },
];
