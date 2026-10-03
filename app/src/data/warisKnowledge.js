// Pengetahuan dasar Ilmu Waris (Faraidh) untuk halaman Kalkulator Waris.
// Disusun ulang dengan kata-kata sendiri dari buku "Semua Bisa Ilmu Waris
// (Dasar)" dan tabel Taklim Cipete yang diberikan founder (2026-10-03) —
// bukan salinan teksnya. Isi tabel porsi (HEIR_TABLE) adalah ketentuan
// fiqih yang sama persis dengan yang dipakai lib/warisCalc.js, supaya apa
// yang dibaca user dan apa yang dihitung kalkulator tidak bisa saling
// bertentangan. Tetap berlaku disclaimer lama: untuk kasus rumit, atau
// kalau mazhab/ormas setempat berbeda pandangan, konsultasikan ke ahli
// faraidh/ulama.

export const KNOWLEDGE_SOURCE = "Diringkas dari buku “Semua Bisa Ilmu Waris (Dasar)” dan tabel Taklim Cipete.";

export const KNOWLEDGE_TOPICS = [
  {
    id: 'harta',
    title: 'Harta Orang yang Meninggal: 4 Hak Berurutan',
    intro: 'Harta yang ditinggalkan tidak langsung dibagi ke ahli waris. Ada empat hal yang diselesaikan berurutan:',
    bullets: [
      'Biaya penyelenggaraan jenazah — dari kain kafan sampai penggalian dan pemakaman, didahulukan paling awal.',
      'Melunasi utang-utangnya, banyak atau sedikit, bahkan kalau sampai menghabiskan seluruh harta.',
      'Menunaikan wasiat — paling banyak sepertiga dari harta, dan tidak boleh ditujukan untuk kerabat yang sekaligus ahli waris.',
      'Sisanya baru menjadi warisan: kepemilikannya pindah ke ahli waris walau belum diserahterimakan.',
    ],
    arabic: 'مِنْ بَعْدِ وَصِيَّةٍ يُوصِي بِهَا أَوْ دَيْنٍ',
    arabicNote: 'QS. An-Nisa: 11 — warisan dibagikan setelah wasiat dan utang.',
    arabic2: 'إِنَّ اللَّهَ أَعْطَى كُلَّ ذِي حَقٍّ حَقَّهُ فَلَا وَصِيَّةَ لِوَارِثٍ',
    arabicNote2: 'HR. Abu Dawud — tidak ada wasiat untuk ahli waris, karena hak mereka sudah ditetapkan.',
    calcNote: 'Di kalkulator ini: isi kolom Biaya Jenazah dan Hutang, lalu Wasiat. Wasiat otomatis dibatasi maksimal sepertiga dari sisa.',
  },
  {
    id: 'faraidh',
    title: 'Apa itu Ilmu Faraidh?',
    intro: 'Ilmu yang mengatur perpindahan harta dari orang yang sudah meninggal kepada yang masih hidup, sesuai porsi masing-masing, karena adanya sebab saling mewarisi. Bisa dipelajari dari dua sisi:',
    bullets: [
      'Teori — kedudukan tiap ahli waris terhadap almarhum, syarat dan sebab warisan, serta porsi yang didapat.',
      'Praktik — cara menghitung porsi, saham, dan bagian tiap ahli waris dari harta, mengikuti cara pengerjaan para ulama. Inilah yang dikerjakan kalkulator.',
    ],
  },
  {
    id: 'syarat',
    title: 'Syarat Warisan: Kapan Boleh Dibagi?',
    intro: 'Hukum waris baru berlaku kalau semua syaratnya terpenuhi dan penghalangnya tidak ada. Sebelum harta dibagi, pastikan tiga hal:',
    bullets: [
      'Kematian pewaris sudah pasti.',
      'Ahli waris benar-benar masih hidup saat pewaris wafat.',
      'Hubungan antara ahli waris dan pewaris jelas (suami-istri, nasab, atau wala’).',
    ],
    arabic: 'وَلَا يَتِمُّ الْحُكْمُ حَتَّى تَجْتَمِعَ ... كُلُّ الشُّرُوطِ وَالْمَوَانِعُ تَرْتَفِعُ',
    arabicNote: 'Kaidah Syaikh Abdurrahman bin Nashir As-Sa’di: hukum tidak sempurna sampai semua syarat terkumpul dan semua penghalang hilang.',
  },
  {
    id: 'penghalang',
    title: 'Penghalang Warisan (Mawani’)',
    intro: 'Penghalang membatalkan hak waris seseorang walau syarat-syaratnya terpenuhi. Ada tiga:',
    bullets: [
      'Membunuh pewaris.',
      'Berbeda agama dengan pewaris (termasuk anak yang murtad).',
      'Berstatus budak.',
    ],
    calcNote: 'Untuk anak murtad, kalkulator menampilkan Rp 0 dan menganggapnya tidak ada — jadi tidak mengubah bagian ahli waris lain.',
  },
  {
    id: 'sebab',
    title: 'Sebab Terjadinya Warisan',
    intro: 'Seseorang bisa mewarisi bila ada salah satu dari tiga sebab:',
    bullets: [
      'Pernikahan — hubungan suami dan istri.',
      'Nasab — hubungan kerabat darah.',
      'Wala’ — memerdekakan budak (praktis tidak ada kasusnya hari ini).',
    ],
    calcNote: 'Sebab pernikahan hanya berlaku untuk suami dan istri. Mertua, ipar, anak tiri, dan sejenisnya bukan ahli waris.',
  },
  {
    id: 'jalur',
    title: 'Jalur Kekerabatan (Nasab) & Urutan Prioritas',
    intro: 'Kedudukan ahli waris berbeda sesuai kedekatannya dengan almarhum. Ada empat jalur, diurutkan dari yang paling diprioritaskan:',
    bullets: [
      'Bunuwwah (keturunan) — anak, dan cucu dari jalur anak laki-laki. Prioritas utama.',
      'Ubuwwah (jalur atas) — ayah dan ibu, juga kakek dan nenek ke atas.',
      'Ukhuwwah (saudara) — kandung, seayah, dan seibu. Kalau tidak ada saudara, anak laki-laki dari saudara kandung lalu saudara seayah menggantikannya.',
      'Umuumah (paman) — saudara ayah yang laki-laki. Kalau tidak ada, anak laki-laki paman menggantikannya.',
    ],
    calcNote: 'Kakek dan paman dari pihak ibu serta saudara ayah/ibu yang perempuan tidak termasuk ahli waris, karena hubungannya lewat perempuan (dzawil arham). Suami/istri berdiri sendiri di luar jalur ini.',
  },
  {
    id: 'porsi',
    title: 'Porsi Warisan: Fardh dan Ta’shib',
    intro: 'Pembagian porsi terbagi dua:',
    bullets: [
      'Fardh — porsi yang besarnya sudah ditentukan Al-Qur’an. Hanya ada enam: 1/2, 1/4, 1/8 (kelompok pertama) dan 1/6, 1/3, 2/3 (kelompok kedua).',
      'Ta’shib (ashabah) — porsi yang tidak ditentukan. Ashabah mengambil sisa setelah para pemilik fardh. Kalau tidak ada sisa, ashabah tidak kebagian.',
    ],
    extra: {
      title: 'Sebelas ahli waris pemilik fardh (Shahibul Fardh)',
      items: [
        ['البنت', 'Anak perempuan'],
        ['بنت الابن', 'Cucu perempuan dari anak laki-laki'],
        ['الأب', 'Ayah'],
        ['الجد', 'Kakek'],
        ['الأم', 'Ibu'],
        ['الجدة', 'Nenek'],
        ['الأخت الشقيقة', 'Saudari kandung'],
        ['الأخت لأب', 'Saudari seayah'],
        ['الإخوة لأم', 'Saudara dan saudari seibu'],
        ['الزوج', 'Suami'],
        ['الزوجة', 'Istri'],
      ],
    },
    calcNote: 'Anak laki-laki mendapat 2 bagian dan anak perempuan 1 bagian. Kalau tidak ada anak laki-laki, anak perempuan memakai porsi fardh dan dibagi rata di antara mereka.',
  },
];

export const TABLE_LEGEND = [
  ['Keturunan', 'anak dan cucu dari anak laki-laki'],
  ['Keturunan (lk) / (pr)', 'yang laki-laki / yang perempuan'],
  ['Orang tua (lk)', 'ayah atau kakek'],
  ['Saudaranya / Saudarinya', 'yang laki-laki / perempuan, satu tingkat dan sejenis'],
  ['Ikhwah', 'saudara dan saudari (kandung, seayah, seibu)'],
  ['Mahjub', 'terhalang, tidak mendapat bagian'],
  ['Ashabah bil ghair', 'menjadi ashabah karena ada saudara laki-lakinya'],
  ["Ashabah ma'al ghair", 'menjadi ashabah bersama keturunan perempuan'],
];

// porsi / ada = kondisi yang HARUS ada / tidak = kondisi yang HARUS tidak ada
export const HEIR_TABLE = [
  {
    id: 'anakPerempuan', nama: 'Anak Perempuan', arab: 'بنت',
    rows: [
      { porsi: '1/2', ada: [], tidak: ['Anak perempuan lain', 'Anak laki-laki'] },
      { porsi: '2/3', ada: ['Anak perempuan lain'], tidak: ['Anak laki-laki'] },
      { porsi: 'Ashabah bil ghair', ada: ['Anak laki-laki'], tidak: [], catatan: 'Laki-laki 2 bagian, perempuan 1 bagian.' },
    ],
  },
  {
    id: 'cucuPerempuan', nama: 'Cucu Perempuan dari Anak Laki-laki', arab: 'بنت الابن',
    rows: [
      { porsi: '1/2', ada: [], tidak: ['Keturunan yang lebih tinggi', 'Cucu perempuan lain', 'Cucu laki-laki sederajat'] },
      { porsi: '2/3', ada: ['Cucu perempuan lain'], tidak: ['Keturunan yang lebih tinggi', 'Cucu laki-laki sederajat'] },
      { porsi: 'Ashabah', ada: ['Cucu laki-laki sederajat'], tidak: ['Keturunan yang lebih tinggi'] },
      { porsi: '1/6', ada: ['Satu anak perempuan'], tidak: ['Anak laki-laki', 'Cucu laki-laki sederajat'], catatan: 'Menggenapi 2/3 bersama anak perempuan.' },
      { porsi: 'Mahjub', ada: ['Lebih dari satu anak perempuan'], tidak: ['Cucu laki-laki sederajat yang menjadikannya ashabah'] },
      { porsi: 'Mahjub', ada: ['Anak laki-laki'], tidak: [] },
    ],
  },
  {
    id: 'saudariKandung', nama: 'Saudari Kandung', arab: 'أخت شقيقة',
    rows: [
      { porsi: '1/2', ada: [], tidak: ['Keturunan', 'Orang tua (lk)', 'Saudaranya', 'Saudarinya'] },
      { porsi: '2/3', ada: ['Saudarinya'], tidak: ['Keturunan', 'Orang tua (lk)', 'Saudaranya'] },
      { porsi: 'Ashabah bil ghair', ada: ['Saudaranya'], tidak: ['Keturunan', 'Orang tua (lk)'] },
      { porsi: "Ashabah ma'al ghair", ada: ['Keturunan (pr)'], tidak: ['Keturunan (lk)', 'Orang tua (lk)'] },
      { porsi: 'Mahjub', ada: ['Keturunan (lk)', 'Orang tua (lk)'], tidak: [], catatan: 'Salah satu saja sudah cukup menghalangi.' },
    ],
  },
  {
    id: 'saudariSeayah', nama: 'Saudari Seayah', arab: 'أخت لأب',
    rows: [
      { porsi: '1/2', ada: [], tidak: ['Keturunan', 'Orang tua (lk)', 'Saudaranya', 'Saudarinya', 'Saudari kandung'] },
      { porsi: '2/3', ada: ['Saudarinya'], tidak: ['Keturunan', 'Orang tua (lk)', 'Saudaranya', 'Saudari kandung'] },
      { porsi: '1/6', ada: ['Satu saudari kandung'], tidak: ['Keturunan', 'Orang tua (lk)', 'Saudaranya'], catatan: 'Menggenapi 2/3 bersama satu saudari kandung.' },
      { porsi: 'Ashabah bil ghair', ada: ['Saudaranya'], tidak: ['Keturunan', 'Orang tua (lk)', 'Saudari kandung'] },
      { porsi: "Ashabah ma'al ghair", ada: ['Keturunan (pr)'], tidak: ['Keturunan (lk)', 'Orang tua (lk)', 'Saudaranya', 'Saudari kandung'] },
      { porsi: 'Mahjub', ada: ['Keturunan (lk)', 'Orang tua (lk)', 'Saudara kandung', "Saudari kandung yang ashabah ma'al ghair"], tidak: [], catatan: 'Salah satu saja sudah cukup menghalangi.' },
      { porsi: 'Mahjub', ada: ['Lebih dari satu saudari kandung'], tidak: [] },
    ],
  },
  {
    id: 'seibu', nama: 'Saudara / Saudari Seibu', arab: 'أخ لأم',
    rows: [
      { porsi: '1/3', ada: ['Saudara/saudari seibu lainnya'], tidak: ['Keturunan', 'Orang tua (lk)'], catatan: 'Dibagi rata, laki-laki dan perempuan sama.' },
      { porsi: '1/6', ada: [], tidak: ['Keturunan', 'Orang tua (lk)', 'Saudara/saudari seibu lainnya'] },
      { porsi: 'Mahjub', ada: ['Keturunan', 'Orang tua (lk)'], tidak: [] },
    ],
  },
  {
    id: 'ibu', nama: 'Ibu', arab: 'أم',
    rows: [
      { porsi: '1/6', ada: ['Keturunan atau lebih dari satu saudara/i'], tidak: [] },
      { porsi: '1/3', ada: [], tidak: ['Keturunan', 'Lebih dari satu saudara/i', 'Suami/istri (kasus Umariyatain)'] },
      { porsi: '1/3 dari sisa suami/istri', ada: ['Suami/istri', 'Ayah'], tidak: ['Keturunan', 'Lebih dari satu saudara/i'], catatan: 'Kasus Umariyatain: ibu mengambil sepertiga dari sisa setelah bagian suami/istri.' },
    ],
  },
  {
    id: 'nenek', nama: 'Nenek', arab: 'جدة',
    rows: [
      { porsi: '1/6', ada: [], tidak: ['Ibu'] },
      { porsi: 'Mahjub', ada: ['Ibu'], tidak: [] },
    ],
  },
  {
    id: 'istri', nama: 'Istri', arab: 'زوجة',
    rows: [
      { porsi: '1/4', ada: [], tidak: ['Keturunan'] },
      { porsi: '1/8', ada: ['Keturunan'], tidak: [], catatan: 'Kalau istri lebih dari satu, porsi dibagi rata.' },
    ],
  },
  {
    id: 'suami', nama: 'Suami', arab: 'زوج',
    rows: [
      { porsi: '1/2', ada: [], tidak: ['Keturunan'] },
      { porsi: '1/4', ada: ['Keturunan'], tidak: [] },
    ],
  },
  {
    id: 'ayah', nama: 'Ayah', arab: 'أب',
    rows: [
      { porsi: '1/6', ada: ['Keturunan (lk)'], tidak: [] },
      { porsi: 'Ashabah', ada: [], tidak: ['Keturunan'] },
      { porsi: '1/6 + Ashabah', ada: ['Keturunan (pr)'], tidak: ['Keturunan (lk)'] },
    ],
  },
  {
    id: 'kakek', nama: 'Kakek', arab: 'جد',
    rows: [
      { porsi: '1/6', ada: ['Keturunan (lk)'], tidak: ['Ayah'] },
      { porsi: 'Ashabah', ada: [], tidak: ['Ayah', 'Keturunan'] },
      { porsi: '1/6 + Ashabah', ada: ['Keturunan (pr)'], tidak: ['Ayah', 'Keturunan (lk)'] },
      { porsi: 'Mahjub', ada: ['Ayah'], tidak: [] },
    ],
  },
];
