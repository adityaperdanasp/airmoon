// Tatacara Penanganan Jenazah — dirombak 2026-10-03 atas permintaan
// founder: semua harus sesuai sunnah dan manhaj salaf, video hanya dari
// Yufid / Ust. Firanda Andirja / Ust. Khalid Basalamah / Ust. Nuzul
// Dzikri. Rujukan teks yang dibaca langsung saat menyusun ulang:
// Muslim.or.id ("Fikih Pengurusan Jenazah" 1 & 2), Al-Manhaj ("Ringkasan
// Cara Pelaksanaan Jenazah" — ringkasan Syaikh Al-Albani, dan "Janin
// Keguguran, Apakah Harus Dishalatkan?"), Rumaysho ("Tata Cara Shalat
// Jenazah"), serta Asy-Syariah. Fardhu kifayah: kalau sebagian sudah
// mengerjakan, gugur kewajiban yang lain; kalau tidak ada yang
// mengerjakan, semua yang mampu berdosa.
//
// Hal yang SENGAJA tidak dimasukkan karena tidak ada tuntunannya dari
// Nabi ﷺ menurut rujukan di atas: talqin mayit setelah dikubur,
// selamatan/tahlilan hari ke-3/7/40/100 (termasuk pengingatnya), meratap,
// dan keluarga duka menjamu tamu — lihat JENAZAH_HINDARI di bawah.
//
// Dua titik yang di sumbernya sendiri memang ada khilaf, dan ditulis
// netral (tidak diputuskan sepihak): jumlah lapis kafan perempuan dan
// posisi tangan jenazah.
//
// Video (semua kanal resmi Yufid.TV, diverifikasi lewat pencarian YouTube
// + oEmbed + playableInEmbed + iframe nyata, bukan ditebak):
//   ZFPbPaQ9BzQ  Serial Fikih Islam (45): Merawat Jenazah (memandikan dan
//                mengkafani) — Ust. Abduh Tuasikal
//   KsDZ0yCG_zE  Tata Cara Mengkafani Jenazah: Posisi Tangan Jenazah yang
//                Benar — Poster Dakwah Yufid TV
//   CxPy-MZrF8w  Serial Fikih Islam (46): Sholat Jenazah — Ust. Abduh Tuasikal
//   FXbxDUlz5mE  Serial Fikih Islam (47): Mengubur Jenazah — Ust. Abduh Tuasikal

export const JENAZAH_STEPS = [
  {
    title: 'Memandikan Jenazah',
    hukum: 'Fardhu Kifayah',
    intro:
      'Jenazah muslim wajib dimandikan, kecuali yang gugur di medan perang (syahid). Jenazah laki-laki dimandikan laki-laki dan perempuan oleh perempuan; suami dan istri boleh saling memandikan. Sebaiknya yang memandikan orang yang paham tata caranya dan amanah, kerabat lebih utama.',
    youtubeId: 'ZFPbPaQ9BzQ',
    videoSource: 'Yufid.TV — Serial Fikih Islam (45): Merawat Jenazah, Ust. Abduh Tuasikal',
    poin: [
      'Lakukan di tempat tertutup, aurat jenazah ditutup, dan hanya yang memandikan dan yang membantu yang ada di sana.',
      'Bersihkan kotoran dari tubuh jenazah dengan kain atau sarung tangan, jaga agar aurat tidak dilihat atau disentuh langsung.',
      'Wudhukan jenazah seperti wudhu untuk sholat, mulai dari sisi kanan.',
      'Mandikan dengan air yang dicampur daun bidara (kalau tidak ada, boleh sabun atau sampo), dimulai dari sisi kanan.',
      'Yang wajib satu kali siraman yang merata; disunnahkan tiga kali, atau lima, atau tujuh (ganjil) bila perlu supaya bersih.',
      'Pada siraman terakhir campurkan kapur barus.',
      'Rambut perempuan boleh disisir dan dikepang tiga, lalu diletakkan di belakang.',
      'Keringkan dengan kain bersih sebelum dikafani.',
    ],
    sumber: 'HR. Bukhari dan Muslim dari Ummu ‘Athiyyah radhiyallahu ‘anha (memandikan putri Nabi ﷺ).',
  },
  {
    title: 'Mengkafani Jenazah',
    hukum: 'Fardhu Kifayah',
    intro:
      'Kafan yang disunnahkan berupa kain putih yang bersih, tanpa berlebihan. Untuk laki-laki: tiga lembar kain putih, tanpa gamis dan tanpa serban. Untuk perempuan para ulama berbeda pendapat: sebagian menganjurkan lima lembar (sarung, gamis, kerudung, dan dua lembar), tetapi haditsnya dinilai lemah oleh sebagian ahli hadits, sehingga tiga lembar seperti laki-laki juga dibolehkan. Yang wajib minimal satu lembar yang menutup seluruh tubuh.',
    youtubeId: 'KsDZ0yCG_zE',
    videoSource: 'Yufid.TV — Poster Dakwah: Tata Cara Mengkafani Jenazah, Posisi Tangan yang Benar',
    poin: [
      'Bentangkan lembar-lembar kain bertumpuk dan beri wewangian (bukhur/dupa atau minyak wangi) pada kain, disunnahkan tiga kali.',
      'Letakkan jenazah telentang di atas kain.',
      'Posisi tangan: ulama berbeda pendapat, sebagian meletakkannya bersedekap, sebagian di samping badan seperti orang tidur. Lihat penjelasan di video, atau tanyakan ke ustadz sunnah setempat.',
      'Kalau dikhawatirkan keluar cairan, lubang-lubang tubuh boleh disumbat kapas.',
      'Lipat kain dari sisi kiri ke kanan, lalu dari kanan ke kiri; kelebihan kain di bagian kepala dikumpulkan.',
      'Ikat dengan tali agar tidak terbuka. Tali dilepas ketika jenazah sudah diletakkan di liang lahat.',
      'Jangan berlebihan dalam harga dan jumlah lapis; menambah lebih dari tiga lembar menyalahi cara kafan Nabi ﷺ dan menyia-nyiakan harta.',
    ],
    sumber: 'HR. Bukhari dan Muslim dari ‘Aisyah radhiyallahu ‘anha (kafan Nabi ﷺ tiga lembar putih tanpa gamis dan serban).',
  },
  {
    title: 'Mensholatkan Jenazah',
    hukum: 'Fardhu Kifayah',
    intro:
      'Sholat jenazah dikerjakan berdiri, tanpa ruku, sujud, adzan, dan iqamah: empat takbir lalu salam. Imam berdiri sejajar dengan kepala jenazah laki-laki dan di bagian tengah jenazah perempuan. Disunnahkan mengangkat tangan pada setiap takbir dan membaca bacaan dengan pelan. Semakin banyak yang menyholatkan, semakin baik.',
    youtubeId: 'CxPy-MZrF8w',
    videoSource: 'Yufid.TV — Serial Fikih Islam (46): Sholat Jenazah, Ust. Abduh Tuasikal',
    takbir: [
      {
        label: 'Takbir Pertama',
        detail: 'Takbiratul ihram sambil mengangkat tangan, membaca ta’awudz, lalu Al-Fatihah (dibaca pelan). Boleh ditambah satu surat pendek.',
      },
      {
        label: 'Takbir Kedua — Sholawat',
        arabic: 'اللَّهُمَّ صَلِّ عَلَى مُحَمَّدٍ وَعَلَى آلِ مُحَمَّدٍ كَمَا صَلَّيْتَ عَلَى إِبْرَاهِيمَ وَعَلَى آلِ إِبْرَاهِيمَ إِنَّكَ حَمِيدٌ مَجِيدٌ، اللَّهُمَّ بَارِكْ عَلَى مُحَمَّدٍ وَعَلَى آلِ مُحَمَّدٍ كَمَا بَارَكْتَ عَلَى إِبْرَاهِيمَ وَعَلَى آلِ إِبْرَاهِيمَ إِنَّكَ حَمِيدٌ مَجِيدٌ',
        latin: "Allahumma shalli 'ala Muhammad wa 'ala aali Muhammad kamaa shallaita 'ala Ibraahiim wa 'ala aali Ibraahiim, innaka hamiidum majiid. Allahumma baarik 'ala Muhammad wa 'ala aali Muhammad kamaa baarakta 'ala Ibraahiim wa 'ala aali Ibraahiim, innaka hamiidum majiid.",
        translation: 'Ya Allah, limpahkan sholawat kepada Muhammad dan keluarga Muhammad sebagaimana Engkau limpahkan kepada Ibrahim dan keluarga Ibrahim, sesungguhnya Engkau Maha Terpuji lagi Maha Mulia. Ya Allah, berkahilah Muhammad dan keluarga Muhammad sebagaimana Engkau berkahi Ibrahim dan keluarga Ibrahim, sesungguhnya Engkau Maha Terpuji lagi Maha Mulia. (Minimal: Allahumma shalli ‘ala Muhammad.)',
      },
      {
        label: 'Takbir Ketiga — Doa untuk Jenazah',
        arabic: 'اللَّهُمَّ اغْفِرْ لَهُ وَارْحَمْهُ وَعَافِهِ وَاعْفُ عَنْهُ، وَأَكْرِمْ نُزُلَهُ وَوَسِّعْ مُدْخَلَهُ، وَاغْسِلْهُ بِالْمَاءِ وَالثَّلْجِ وَالْبَرَدِ، وَنَقِّهِ مِنَ الْخَطَايَا كَمَا نَقَّيْتَ الثَّوْبَ الْأَبْيَضَ مِنَ الدَّنَسِ، وَأَبْدِلْهُ دَارًا خَيْرًا مِنْ دَارِهِ، وَأَهْلًا خَيْرًا مِنْ أَهْلِهِ، وَزَوْجًا خَيْرًا مِنْ زَوْجِهِ، وَأَدْخِلْهُ الْجَنَّةَ، وَأَعِذْهُ مِنْ عَذَابِ الْقَبْرِ وَمِنْ عَذَابِ النَّارِ',
        latin: "Allahummaghfir lahu warhamhu wa 'aafihi wa'fu 'anhu, wa akrim nuzulahu wa wassi' mudkhalahu, waghsilhu bil maa-i wats-tsalji wal barad, wa naqqihi minal khathaayaa kamaa naqqaitats-tsaubal abyadha minad-danas, wa abdilhu daaran khairan min daarihi, wa ahlan khairan min ahlihi, wa zaujan khairan min zaujihi, wa adkhilhul jannata, wa a'idzhu min 'adzaabil qabri wa min 'adzaabin-naar.",
        translation: 'Ya Allah, ampuni dan rahmatilah dia, selamatkan dan maafkan dia, muliakan tempat tinggalnya, luaskan tempat masuknya, cucilah dia dengan air, salju, dan embun; bersihkan dia dari kesalahan sebagaimana Engkau membersihkan kain putih dari kotoran; gantilah rumahnya dengan yang lebih baik, keluarganya dengan yang lebih baik, dan pasangannya dengan yang lebih baik; masukkan dia ke surga dan lindungi dia dari adzab kubur dan adzab neraka. (HR. Muslim) Untuk perempuan, ganti dhamir “hu” menjadi “ha”.',
      },
      {
        label: 'Takbir Keempat',
        arabic: 'اللَّهُمَّ لَا تَحْرِمْنَا أَجْرَهُ وَلَا تَفْتِنَّا بَعْدَهُ وَاغْفِرْ لَنَا وَلَهُ',
        latin: "Allahumma laa tahrimnaa ajrahu wa laa taftinnaa ba'dahu waghfir lanaa wa lahu.",
        translation: 'Ya Allah, jangan halangi kami dari pahalanya, jangan Engkau uji kami sepeninggalnya, dan ampunilah kami dan dia. (HR. Ibnu Majah) Boleh juga diam sejenak setelah takbir keempat.',
      },
      {
        label: 'Salam',
        detail: 'Salam ke kanan (ini rukunnya), dan disunnahkan juga salam ke kiri: “Assalamu’alaikum wa rahmatullah”.',
      },
    ],
    poin: [
      'Untuk jenazah perempuan, ganti dhamir “hu” (dia laki-laki) menjadi “ha” (dia perempuan) pada doa takbir ketiga dan keempat.',
      'Minimal satu shaf. Semakin banyak jamaah yang tulus mendoakan, semakin besar harapan doa dikabulkan.',
      'Boleh dikerjakan di masjid atau di tempat lain yang layak.',
    ],
    sumber: 'Muslim.or.id (Fikih Pengurusan Jenazah 2), Rumaysho, dan ringkasan Al-Albani di Al-Manhaj.',
  },
  {
    title: 'Menguburkan Jenazah',
    hukum: 'Fardhu Kifayah',
    intro:
      'Liang lahat (lubang menyamping ke arah kiblat) lebih utama daripada lubang lurus (syaqq). Galian cukup dalam agar bau dan binatang tidak mengganggu. Segerakan penguburan setelah selesai disholatkan.',
    youtubeId: 'FXbxDUlz5mE',
    videoSource: 'Yufid.TV — Serial Fikih Islam (47): Mengubur Jenazah, Ust. Abduh Tuasikal',
    poin: [
      'Masukkan jenazah ke liang kubur dari arah belakang (kaki) kubur, sambil mengucapkan: “Bismillahi wa ‘ala millati Rasulillah” (بِسْمِ اللَّهِ وَعَلَى مِلَّةِ رَسُولِ اللَّهِ).',
      'Baringkan di sisi kanan menghadap kiblat, lalu lepaskan ikatan kafan.',
      'Tutup lahat dengan papan, bambu, atau bata, lalu timbun dengan tanah.',
      'Tinggikan kuburan kira-kira sejengkal dari permukaan tanah, tidak diratakan dan tidak berlebihan.',
      'Setelah selesai, berdiri di dekat kubur dan mohonkan ampunan serta keteguhan bagi jenazah: “Istaghfiru li akhikum, wa sal lahu bit-tatsbit, fa innahu al-aana yus-al” (Mohonkan ampun untuk saudaramu, dan mintakan keteguhan untuknya, karena sekarang dia sedang ditanya).',
      'Jangan duduk atau menginjak kuburan, jangan menembok, membangun, atau menulisi nama dan tanggal di atasnya.',
    ],
    sumber: 'HR. Abu Dawud dan At-Tirmidzi (bacaan saat memasukkan jenazah), HR. Abu Dawud dan Al-Hakim (doa setelah penguburan), HR. Muslim (larangan membangun dan duduk di atas kubur).',
  },
];

// Hal-hal yang sering dilakukan tapi tidak ada tuntunannya dari Nabi ﷺ
// menurut rujukan di atas, plus yang justru disunnahkan buat keluarga duka.
export const JENAZAH_HINDARI = {
  title: 'Yang Tidak Ada Tuntunannya',
  intro: 'Beberapa kebiasaan ini tidak ada contohnya dari Nabi ﷺ dan para sahabat, sehingga tidak dimasukkan ke panduan ini:',
  items: [
    'Meratap: menangis berlebihan dengan berteriak, memukul pipi, atau merobek pakaian. (Menangis karena sedih tanpa meratap dibolehkan.)',
    'Talqin mayit setelah dikubur (menuntun mayit dengan kalimat tertentu).',
    'Selamatan atau tahlilan pada hari ke-3, 7, 40, 100, dan seterusnya, termasuk berkumpul di rumah duka dan keluarga duka yang menyiapkan jamuan.',
    'Membangun, menembok, atau menulisi kuburan, dan shalat menghadap kubur.',
  ],
  sunnahTitle: 'Yang Disunnahkan untuk Keluarga yang Berduka',
  sunnah: 'Tetangga dan kerabat membuatkan makanan untuk keluarga yang berduka, karena mereka sedang tersibukkan oleh musibah. Ini kebalikan dari keluarga duka yang menjamu tamu. (HR. Abu Dawud dan At-Tirmidzi, hadits tentang keluarga Ja’far)',
  sumber: 'Al-Manhaj (ringkasan cara pelaksanaan jenazah) dan Muslim.or.id.',
};

// Panduan Kasus Khusus — ringkas dan merujuk balik ke tahapan di atas.
export const JENAZAH_KASUS_KHUSUS = [
  {
    title: 'Jenazah Bayi / Janin Gugur',
    poin: [
      'Bayi yang lahir hidup (menangis atau bergerak) lalu wafat: diurus seperti jenazah dewasa — dimandikan, dikafani, dishalatkan, dan dikuburkan.',
      'Janin gugur yang usianya sudah 4 bulan atau lebih (ruh sudah ditiupkan): dimandikan, dikafani, dishalatkan, diberi nama, dan dikuburkan di pemakaman kaum muslimin. (Pendapat Lajnah Daimah, Syaikh Ibnu Baz, dan Syaikh Al-Utsaimin; dalilnya hadits Mughirah bin Syu’bah bahwa janin gugur dishalatkan.)',
      'Janin gugur yang usianya kurang dari 4 bulan: tidak dimandikan, tidak dishalatkan, dan tidak diberi nama; cukup dibungkus kain dan dikuburkan di mana saja.',
    ],
  },
  {
    title: 'Jenazah Kecelakaan (Kondisi Tidak Utuh)',
    poin: [
      'Kalau tubuh rusak sehingga tidak mungkin dimandikan tanpa menghancurkannya, jenazah ditayammumkan (atau cukup dikafani) sebagai ganti mandi; tidak perlu memaksakan.',
      'Kafani seluruh bagian tubuh yang ada dan bungkus serapi mungkin.',
      'Tetap dishalatkan dan dikuburkan seperti biasa; kerusakan fisik tidak menghilangkan hak jenazah muslim.',
      'Kalau identitas belum pasti (misal korban kecelakaan massal), tunggu proses identifikasi resmi dari pihak berwenang sebelum dimakamkan.',
    ],
  },
  {
    title: 'Meninggal Jauh dari Kampung Halaman / di Luar Negeri',
    poin: [
      'Yang lebih utama jenazah dikuburkan di tempat wafatnya dan disegerakan; memindahkannya jauh biasanya memperlambat penguburan dan berisiko merusak kondisi jenazah.',
      'Kalau keluarga tetap ingin memulangkan jenazah dari luar negeri, hubungi KBRI atau Konsulat setempat untuk dokumennya (surat kematian internasional, izin angkut, peti khusus). Ini urusan administrasi, terpisah dari tata cara di atas.',
      'Kalau perjalanan makan waktu lama, pertimbangkan anjuran menyegerakan penguburan, dan tanyakan ke ustadz sunnah setempat mana yang lebih diutamakan untuk situasi keluarga.',
    ],
  },
];
