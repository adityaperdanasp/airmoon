// "Hari Ini dalam Sejarah Islam" — a rotating pool of well-known events
// from early Islamic history, shown one per day (same day-of-year rotation
// idea as data/headlines.js's todaysHeadlineIndex() / lib/quotesApi.js's
// todaysQuoteIndex()). This is NOT tied to the real Hijri calendar date —
// there's no reliable free API for "what happened on this exact Hijri
// date" at the depth this app would need, so it's presented honestly as
// "hari ini kita mengenang..." (today we're remembering...) rather than a
// false claim that the event actually occurred on today's Hijri date.
//
// Deliberately kept to widely-agreed, uncontroversial events (Sunni
// mainstream historical record) with approximate Hijri years, not exact
// dates — same "needs a human check against a mu'tabar source before
// being treated as final" caveat this app already applies to
// data/asmaulHusna.js and data/doaHarian.js's doaKegiatan section.
export const ISLAMIC_HISTORY = [
  { title: 'Hijrah Nabi Muhammad ﷺ', year: '1 H', text: 'Nabi Muhammad ﷺ berhijrah dari Makkah ke Madinah bersama Abu Bakar ash-Shiddiq, menandai titik awal penanggalan Hijriah dan berdirinya masyarakat Muslim pertama di Madinah.' },
  { title: 'Perang Badar', year: '2 H', text: 'Pertempuran besar pertama umat Islam melawan kaum Quraisy Makkah di dekat sumur Badar — kemenangan yang disebut Al-Qur\'an sebagai "Yaumul Furqan", hari pembeda antara yang haq dan batil.' },
  { title: 'Peristiwa Isra Mi\'raj', year: '~1-2 H sebelum Hijrah', text: 'Perjalanan malam Nabi Muhammad ﷺ dari Masjidil Haram ke Masjidil Aqsa, lalu naik ke langit — peristiwa inilah asal-usul kewajiban sholat lima waktu.' },
  { title: 'Perang Uhud', year: '3 H', text: 'Pertempuran di kaki Bukit Uhud, Madinah — sarat pelajaran tentang disiplin dan ketaatan, setelah sebagian pasukan pemanah meninggalkan pos yang sudah ditentukan Nabi ﷺ.' },
  { title: 'Perang Khandaq (Ahzab)', year: '5 H', text: 'Madinah dikepung koalisi besar suku-suku Arab dan Yahudi. Atas usul Salman Al-Farisi, umat Islam menggali parit (khandaq) mengelilingi kota — strategi yang belum pernah dipakai bangsa Arab sebelumnya.' },
  { title: 'Perjanjian Hudaibiyah', year: '6 H', text: 'Perjanjian damai antara Nabi ﷺ dan kaum Quraisy yang secara lahiriah tampak merugikan umat Islam, namun oleh Al-Qur\'an disebut sebagai "kemenangan yang nyata" (fathan mubina) karena membuka jalan dakwah lebih luas.' },
  { title: 'Fathu Makkah (Pembebasan Makkah)', year: '8 H', text: 'Makkah dibebaskan tanpa pertumpahan darah berarti. Nabi ﷺ memaafkan hampir seluruh penduduk Makkah yang dulu memusuhinya, lalu membersihkan Ka\'bah dari berhala.' },
  { title: 'Haji Wada\' (Haji Perpisahan)', year: '10 H', text: 'Satu-satunya haji yang dilaksanakan Nabi ﷺ, disertai khutbah terakhir di Arafah yang menegaskan persamaan derajat manusia, hak-hak perempuan, dan larangan riba serta pertumpahan darah.' },
  { title: 'Wafatnya Nabi Muhammad ﷺ', year: '11 H', text: 'Nabi Muhammad ﷺ wafat di Madinah setelah menyempurnakan risalah Islam, meninggalkan Al-Qur\'an dan Sunnah sebagai pedoman bagi umatnya.' },
  { title: 'Abu Bakar ash-Shiddiq diangkat menjadi Khalifah', year: '11 H', text: 'Sepeninggal Nabi ﷺ, para sahabat di Saqifah Bani Sa\'idah membai\'at Abu Bakar sebagai khalifah pertama, memulai era Khulafaur Rasyidin.' },
  { title: 'Perang Yamamah & awal kodifikasi Al-Qur\'an', year: '12 H', text: 'Banyak penghafal Al-Qur\'an gugur dalam perang melawan nabi palsu Musailamah al-Kadzdzab, mendorong Umar bin Khattab mengusulkan pengumpulan mushaf Al-Qur\'an secara resmi kepada Abu Bakar.' },
  { title: 'Umar bin Khattab menjadi Khalifah', year: '13 H', text: 'Umar bin Khattab menggantikan Abu Bakar, memimpin ekspansi Islam yang pesat ke Syam, Mesir, dan Persia, serta merintis banyak sistem administrasi negara.' },
  { title: 'Pembebasan Baitul Maqdis (Yerusalem)', year: '15-16 H', text: 'Yerusalem diserahkan secara damai kepada Khalifah Umar bin Khattab, yang datang langsung dan menjamin keamanan penduduk serta tempat ibadah semua agama di kota itu.' },
  { title: 'Penetapan Kalender Hijriah', year: '17 H', text: 'Atas usulan dalam musyawarah di masa Khalifah Umar, peristiwa Hijrah Nabi ﷺ ditetapkan sebagai titik awal (tahun 1) penanggalan Islam.' },
  { title: 'Utsman bin Affan menjadi Khalifah', year: '23 H', text: 'Utsman bin Affan terpilih menjadi khalifah ketiga melalui musyawarah enam sahabat senior (Ahlul Syura) yang ditunjuk Umar sebelum wafat.' },
  { title: 'Kodifikasi Mushaf Utsmani', year: '~25-30 H', text: 'Khalifah Utsman bin Affan menugaskan Zaid bin Tsabit dan tim menyusun mushaf Al-Qur\'an standar dan menyebarkannya ke berbagai wilayah, menyatukan bacaan umat Islam.' },
  { title: 'Ali bin Abi Thalib menjadi Khalifah', year: '35 H', text: 'Ali bin Abi Thalib menjadi khalifah keempat menggantikan Utsman, memimpin di masa penuh gejolak politik internal umat Islam.' },
  { title: 'Berdirinya Dinasti Umayyah', year: '41 H', text: 'Mu\'awiyah bin Abi Sufyan mendirikan kekhalifahan Umayyah berpusat di Damaskus, mengakhiri era Khulafaur Rasyidin dan memulai sistem kekhalifahan turun-temurun.' },
  { title: 'Peristiwa Karbala', year: '61 H', text: 'Husain bin Ali, cucu Nabi ﷺ, gugur bersama keluarga dan pengikutnya di Karbala — peristiwa yang menjadi salah satu titik penting sejarah perpecahan politik umat Islam.' },
  { title: 'Pembangunan Kubah Shakhrah (Dome of the Rock)', year: '72 H', text: 'Khalifah Abdul Malik bin Marwan menyelesaikan pembangunan Qubbatus Shakhrah di Baitul Maqdis, salah satu monumen arsitektur Islam tertua yang masih berdiri.' },
  { title: 'Islam masuk ke Andalusia (Spanyol)', year: '92 H', text: 'Pasukan Muslim di bawah Thariq bin Ziyad menyeberangi selat yang kini disebut Selat Gibraltar (Jabal Thariq), membuka era hampir 8 abad kehadiran Islam di Andalusia.' },
  { title: 'Umar bin Abdul Aziz menjadi Khalifah', year: '99 H', text: 'Dikenal sebagai khalifah yang paling adil di masa Umayyah, sering disebut sebagai "khalifah kelima" Khulafaur Rasyidin karena keteladanan dan kesalehannya.' },
  { title: 'Berdirinya Dinasti Abbasiyah', year: '132 H', text: 'Dinasti Abbasiyah menggantikan Umayyah, memindahkan pusat kekhalifahan ke Baghdad dan mengawali era keemasan ilmu pengetahuan Islam.' },
  { title: 'Berdirinya kota Baghdad', year: '145 H', text: 'Khalifah Abbasiyah Al-Manshur mendirikan Baghdad sebagai ibu kota baru, yang kelak berkembang menjadi pusat peradaban dan ilmu pengetahuan dunia selama berabad-abad.' },
  { title: 'Imam Abu Hanifah wafat', year: '150 H', text: 'Wafatnya Imam Abu Hanifah an-Nu\'man, pendiri mazhab fiqh Hanafi, salah satu dari empat mazhab besar fiqh Ahlus Sunnah.' },
  { title: 'Imam Malik menulis Al-Muwaththa', year: '~150 H', text: 'Imam Malik bin Anas menyusun Al-Muwaththa, salah satu kitab hadits dan fiqh tertua yang menjadi rujukan mazhab Maliki.' },
  { title: 'Berdirinya Baitul Hikmah di Baghdad', year: '~170-200 H', text: 'Pusat penerjemahan dan riset ilmiah di Baghdad ini menjadi motor penerjemahan karya-karya Yunani, Persia, dan India, mendorong lahirnya sains Islam klasik.' },
  { title: 'Imam Syafi\'i wafat', year: '204 H', text: 'Wafatnya Imam Muhammad bin Idris asy-Syafi\'i di Mesir, pendiri mazhab Syafi\'i dan peletak dasar ilmu ushul fiqh melalui kitabnya Ar-Risalah.' },
  { title: 'Imam Ahmad bin Hanbal wafat', year: '241 H', text: 'Wafatnya Imam Ahmad bin Hanbal, pendiri mazhab Hanbali dan penyusun Musnad Ahmad, salah satu kumpulan hadits terbesar, dikenal karena keteguhannya menolak paham Mu\'tazilah.' },
  { title: 'Imam Bukhari wafat', year: '256 H', text: 'Wafatnya Imam Muhammad bin Ismail al-Bukhari, penyusun Shahih Bukhari — kitab hadits yang oleh mayoritas ulama dianggap sumber tersahih setelah Al-Qur\'an.' },
  { title: 'Imam Muslim wafat', year: '261 H', text: 'Wafatnya Imam Muslim bin Hajjaj, penyusun Shahih Muslim, kitab hadits shahih kedua yang paling diakui setelah Shahih Bukhari.' },
  { title: 'Al-Khawarizmi mengembangkan aljabar', year: '~200 H', text: 'Ilmuwan Muslim Al-Khawarizmi menulis Al-Jabr wal-Muqabalah, karya yang menjadi dasar ilmu aljabar modern — kata "algoritma" sendiri diambil dari namanya.' },
  { title: 'Ibnu Sina menyusun Al-Qanun fi ath-Thibb', year: '~400 H', text: 'Ibnu Sina (Avicenna) menulis Al-Qanun fi ath-Thibb, ensiklopedia kedokteran yang menjadi rujukan utama di dunia Islam dan Eropa selama berabad-abad.' },
  { title: 'Perang Salib pertama dimulai', year: '490 H', text: 'Pasukan Salib dari Eropa memulai serangan ke wilayah Muslim di Syam, mengawali rangkaian perang Salib yang berlangsung hampir 2 abad.' },
  { title: 'Imam Al-Ghazali wafat', year: '505 H', text: 'Wafatnya Imam Abu Hamid Al-Ghazali, penulis Ihya\' Ulumuddin, salah satu ulama paling berpengaruh dalam sejarah pemikiran dan tasawuf Islam.' },
  { title: 'Pembebasan kembali Baitul Maqdis oleh Shalahuddin', year: '583 H', text: 'Sultan Shalahuddin Al-Ayyubi merebut kembali Yerusalem dari pasukan Salib setelah hampir 90 tahun, dengan sikap pengampunan yang dikenang luas, berbeda dari penaklukan Salib sebelumnya.' },
  { title: 'Kejatuhan Baghdad', year: '656 H', text: 'Pasukan Mongol di bawah Hulagu Khan menghancurkan Baghdad, mengakhiri Dinasti Abbasiyah dan menandai salah satu masa paling kelam dalam sejarah peradaban Islam klasik.' },
  { title: 'Berdirinya Kesultanan Utsmaniyah', year: '699 H', text: 'Utsman bin Ertugrul mendirikan kerajaan kecil di Anatolia yang kelak berkembang menjadi Kesultanan Utsmaniyah (Ottoman), salah satu kekhalifahan terlama dalam sejarah Islam.' },
  { title: 'Penaklukan Konstantinopel', year: '857 H', text: 'Sultan Muhammad Al-Fatih menaklukkan Konstantinopel, mengakhiri Kekaisaran Romawi Timur dan menggenapi kabar gembira yang disampaikan Nabi ﷺ berabad-abad sebelumnya.' },
  { title: 'Runtuhnya Kesultanan Utsmaniyah', year: '1342 H / 1924 M', text: 'Kekhalifahan Utsmaniyah resmi dibubarkan, mengakhiri era kekhalifahan sebagai institusi politik yang telah berlangsung sejak masa Khulafaur Rasyidin.' },
  { title: 'Wali Songo menyebarkan Islam di Nusantara', year: '~800-900 H', text: 'Para wali (Wali Songo) berdakwah di tanah Jawa dengan pendekatan budaya dan akulturasi, menjadikan Islam berkembang pesat dan berakar kuat di Nusantara.' },
];

export function todaysHistoryIndex() {
  const now = new Date();
  const start = new Date(now.getFullYear(), 0, 0);
  const diff = now - start;
  const dayOfYear = Math.floor(diff / 86400000);
  return dayOfYear % ISLAMIC_HISTORY.length;
}
