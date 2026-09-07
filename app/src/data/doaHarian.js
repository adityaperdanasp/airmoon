// Dzikir Pagi & Petang: transcribed from bekalislam.online/dzikir-doa (a
// curated selection by Syaikh Abdur Razzaq, published by Ustadz Firanda
// Andirja's site) — fetched programmatically from that site's own per-item
// HTML fragments (dzikirdoa_new/dzikir-{pagi,petang}/DzikirN.html, 19 pagi +
// 18 petang items, confirmed exact counts by probing until the SPA's 404
// fallback kicked in) rather than typed from memory, specifically to avoid
// transcription errors in religious text. Two source data-quality issues
// fixed here, not introduced by this transcription:
// - petang item 3's title was left as "Dzikir Pagi 3" in the source (a
//   leftover template artifact) even though its Arabic text is identical to
//   pagi item 14 "Dzikir Mentauhidkan Allāh" — retitled to match.
// - pagi's "Memohon Ampun Atau Istighfar" item had explanatory prose mixed
//   into the transliteration field on the source site; trimmed to just the
//   three transliterated phrases, kept the explanation out.
// Still: verify against Hisnul Muslim or another mu'tabar reference before
// treating as final, same caution as the rest of this file's content.
export const dzikirPagi = [
  {
    title: 'Dzikir Bersyukur Di Atas Nikmat Tauhid',
    arabic: 'أَصْبَحْنَا عَلَى فِطْرَةِ اْلإِسْلاَمِ وَعَلَى كَلِمَةِ اْلإِخْلاَصِ، وَعَلَى دِيْنِ نَبِيِّنَا مُحَمَّدٍ صَلَّى اللهُ عَلَيْهِ وَسَلَّمَ، وَعَلَى مِلَّةِ أَبِيْنَا إِبْرَاهِيْمَ، حَنِيْفًا مُسْلِمًا وَمَا كَانَ مِنَ الْمُشْرِكِيْنَ.',
    latin: 'Ashbahnaa \'alaa fithrotil islam wa \'alaa kalimatil ikhlas wa \'alaa diini nabiyyinaa muhammad shallahu \'alaihi wasallam wa \'alaa millati abiinaa ibrohiim haniifam muslimaw wa maa kaana minal musyrikiin.',
    translation: 'Artinya : "Di waktu pagi kami berada di atas fitrah Islam, di atas kalimat ikhlas (syahadatain), di atas agama Nabi kita Muhammad صلى الله عليه وسلم, dan di atas agama ayah kami Ibrahim, yang berdiri di atas jalan yang lurus, muslim dan tidak tergolong orang-orang musyrik.”(3)',
  },
  {
    title: 'Dzikir Ridha Di Atas Agama Islam',
    repeat: 'Dibaca 3x',
    arabic: 'رَضِيْتُ بِاللهِ رَبًّا، وَبِاْلإِسْلاَمِ دِيْنًا، وَبِمُحَمَّدٍ صَلَّى اللهُ عَلَيْهِ وَسَلَّمَ نَبِيًّا.',
    latin: 'Rodhitubillahi robbaa, wabil islaamidiinaa, wabi muhammadin shollahu\'alaihi wasallam nabiyyaa',
    translation: 'Artinya : Aku ridho/senang Allah sebagai Rabb, Islam sebagai agama, dan Muhammad sebagai nabi (yang diutus oleh Allah).”(4)',
  },
  {
    title: 'Doa Meminta Ilmu Yang Bermanfaat',
    arabic: 'اَللَّهُمَّ إِنِّيْ أَسْأَلُكَ عِلْمًا نَافِعًا، وَرِزْقًا طَيِّبًا، وَعَمَلاً مُتَقَبَّلاً.',
    latin: 'Allahumma inni asaluka \'ilman naafi\'an wa rizkqon toyyiban wa amalan mutaqobbala.',
    translation: 'Artinya : “Ya Allah, sungguh aku memohon kepada-Mu ilmu yang bermanfaat, rizki yang baik, dan amal yang diterima.”(6)',
  },
  {
    title: 'Dzikir Mengingatkan Kita Untuk Kembali Kepada Allāh',
    arabic: 'اللَّهُمَّ بِكَ أَصْبَحْنَا وَبِكَ أَمْسَيْنَا، وَبِكَ نَحْيَا وَبِكَ نَمُوتُ، وَإِلَيْكَ النُّشُوْرُ',
    latin: 'Allahumma bika ashbahnaa, wa bika amsainaa, wa bika nahyaa, wa bika namuutu wa ilaikannusyuur',
    translation: 'Artinya : “Ya Allah, dengan Engkaulah kami memasuki waktu pagi, dan dengan Engkaulah kami memasuki waktu sore. Dengan Engkaulah kami hidup dan dengan Engkaulah kami mati. Dan kepada-Mu kami dibangkitkan.”(7)',
  },
  {
    title: 'Doa Memohon Kebaikan Di Setiap Waktu',
    arabic: 'أَصْبَحْنَا وَأَصْبَحَ الْمُلْكُ لِلَّهِ، وَالْحَمْدُ لِلَّهِ، لاَ إِلَـهَ إِلاَّ اللهُ وَحْدَهُ لاَ شَرِيْكَ لَهُ، لَهُ الْمُلْكُ وَلَهُ الْحَمْدُ وَهُوَ عَلَى كُلِّ شَيْءٍ قَدِيْرُ. رَبِّ أَسْأَلُكَ خَيْرَ مَا فِيْ هَذَا الْيَوْمِ وَخَيْرَ مَا بَعْدَهُ، وَأَعُوْذُ بِكَ مِنْ شَرِّ مَا فِيْ هَذَا الْيَوْمِ وَشَرِّ مَا بَعْدَهُ، رَبِّ أَعُوْذُ بِكَ مِنَ الْكَسَلِ وَسُوْءِ الْكِبَرِ، رَبِّ أَعُوْذُ بِكَ مِنْ عَذَابٍ فِي النَّارِ وَعَذَابٍ فِي الْقَبْرِ',
    latin: 'Ashbahnaa wa ashbahalmulku lillah, walhamdulillah, laa ilaha illallahu wahdahu laa syariikalah, lahulmulku walahulhamdu, wahuwa \'ala kuli syai in qodiir. Robbi asaluka khoiro maa fii hadzaal yaum wa khoiro maa ba\'dahu, wa a\'uudzubika min syarri maa fii hadzal yaum wa syarri maa ba\'dahu. Robbi a\'uudzubika minal kasali wa suu il kibar. Robbi a\'uudzubika min \'adzaabin fiinnaari wa \'adzaabin filqobr',
    translation: 'Artinya : “Kami telah memasuki waktu pagi dan kerajaan hanya milik Allah, segala puji bagi Allah. Tidak ada Tuhan (yang berhak disembah) kecuali Allah Yang Maha Esa, tiada sekutu bagi-Nya. Bagi-Nya kerajaan dan bagi-Nya pujian. Dia-lah Yang Maha Kuasa atas segala sesuatu. Ya Rabb, aku mohon kepada-Mu kebaikan di hari ini dan kebaikan sesudahnya. Aku berlindung kepada-Mu dari kejahatan hari ini dan kejahatan sesudahnya. Ya Rabb, aku berlindung kepada-Mu dari kemalasan dan kejelekan di hari tua. Ya Rabb ku! Aku berlindung kepada-Mu dari siksaan di Neraka dan kubur.” (8)',
  },
  {
    title: 'Sayyidul Istighfar',
    arabic: 'اَللَّهُمَّ أَنْتَ رَبِّيْ لاَ إِلَـهَ إِلاَّ أَنْتَ، خَلَقْتَنِيْ وَأَنَا عَبْدُكَ، وَأَنَا عَلَى عَهْدِكَ وَوَعْدِكَ مَا اسْتَطَعْتُ، أَعُوْذُ بِكَ مِنْ شَرِّ مَا صَنَعْتُ، أَبُوْءُ لَكَ بِنِعْمَتِكَ عَلَيَّ، وَأَبُوْءُ بِذَنْبِيْ فَاغْفِرْ لِيْ فَإِنَّهُ لاَ يَغْفِرُ الذُّنُوْبَ إِلاَّ أَنْتَ',
    latin: 'Allahumma anta rabbi la ilaha illa anta khalaqtani wa ana \'abduka Wa ana \'ala \'ahdika wa wa\'dika mastatha\'tu A\'udzu bika min syarri ma shana\'tu. Abu\'u laka bini\'matika \'alayya wa abu\'u laka bidzanbi Faghfirli innahu la yaghfirudz dzunuba illa anta',
    translation: 'Artinya : “Ya Allah! Engkau adalah Rabb ku, tidak ada Ilah yang berhak disembah kecuali Engkau, Engkaulah yang menciptakanku. Aku adalah hamba-Mu. Aku akan setia pada perjanjianku dengan-Mu semampuku. Aku berlindung kepada-Mu dari kejelekan yang aku perbuat. Aku mengakui nikmat-Mu kepadaku dan aku mengakui memikul dosaku. Karena itu, ampunilah aku, sesungguhnya tiada yang mengampuni dosa kecuali Engkau."(9)',
  },
  {
    title: 'Memohon Kebaikan Dunia Dan Akhirat',
    arabic: 'اَللَّهُمَّ إِنِّيْ أَسْأَلُكَ الْعَافِيَةَ فِي الدُّنْيَا وَاْلآخِرَةِ، اَللَّهُمَّ إِنِّيْ أَسْأَلُكَ الْعَفْوَ وَالْعَافِيَةَ فِي دِيْنِيْ وَدُنْيَايَ وَأَهْلِيْ وَمَالِيْ. اللَّهُمَّ اسْتُرْ عَوْرَاتِى وَآمِنْ رَوْعَاتِى,اَللَّهُمَّ احْفَظْنِيْ مِنْ بَيْنِ يَدَيَّ، وَمِنْ خَلْفِيْ، وَعَنْ يَمِيْنِيْ وَعَنْ شِمَالِيْ، وَمِنْ فَوْقِيْ، وَأَعُوْذُ بِعَظَمَتِكَ أَنْ أُغْتَالَ مِنْ تَحْتِيْ',
    latin: 'Allahumma inni asaluka al\'aafiyata fiiddunyaa wal akhiroh, Allahumma innii asalukal\'afwa wal\'aafiyata fii diinii wa dunyaaya wa ahlii wa maalii, Allahummastur \'aurootii wa aamin rou\'aatii, Allahummahfadznii minbainii yadayya, wamin kholfihii, wa \'anyamiinii, wa\'ansyimaalii, wamin fauqii, wa a\'uudzubi\'adzhomatika an ughtaala min tahtii',
    translation: 'Artinya : “Ya Allah! Sesungguhnya aku mohon keselamatan di dunia dan akhirat. Ya Allah, sesungguhnya aku mohon kepada-Mu ampunan dan keselamatan dalam agamaku, (kehidupan) duniaku, keluargaku dan hartaku. Ya Allah, tutupilah auratku dan berilah ketenteraman dihatiku. Ya Allah! Peliharalah aku dari arah depan, belakang, kanan, kiri dan atasku. Aku berlindung dengan kebesaran-Mu, agar aku tidak mendapat bahaya dari bawahku.” (10)',
  },
  {
    title: 'Memohon Keselamatan Badan',
    repeat: 'Dibaca 3x',
    arabic: 'اَللَّهُمَّ عَافِنِيْ فِيْ بَدَنِيْ، اَللَّهُمَّ عَافِنِيْ فِيْ سَمْعِيْ، اَللَّهُمَّ عَافِنِيْ فِيْ بَصَرِيْ، لاَ إِلَـهَ إِلاَّ أَنْتَ، اَللَّهُمَّ إِنِّي أَعُوْذُ بِكَ مِنَ الْكُفْرِ وَالْفَقْرِ، اَللَّهُمَّ إِنِّي أَعُوْذُ بِكَ مِنْ عَذَابِ الْقَبْرِ، لاَ إِلَـهَ إِلاَّ أَنْتَ.',
    latin: 'Allahumma \'aafinii fii badanii, Allahumma \'aafinii fii sam\'ii, Allahumma \'aafinii fii bashorii, Laa ilaaha illa anta. Allahumma innii a\'uudzubika minal kufri wal faqr, Allahumma innii a\'uudzubika min\'adzabilqobr, Laa ilaha illa anta',
    translation: '“Ya Allah, berilah keselematan pada badanku. Ya Allah, berilah keselamatan pada pendengaranku. Ya Allah berilah keselamatan pada penglihatanku, tiada Ilah (yang berhak disembah) kecuali Engkau. Ya Allah, sesungguhnya aku berlindung kepada-Mu dari kekufuran dan kefakiran. Aku berlindung kepada-Mu dari siksa kubur, tiada Ilah (yang berhak disembah) kecuali Engkau.” (11 )',
  },
  {
    title: 'Memohon Perlindungan Dari Kejahatan Diri',
    arabic: 'للَّهُمَّ فَاطِرَ السَّمَاوَاتِ وَاْلأَرْضِ، عَالِمَ الْغَيْبِ وَالشَّهَادَةِ رَبَّ كُلِّ شَيْءٍ وَمَلِيْكَهُ، أَشْهَدُ أَنْ لاَ إِلَـهَ إِلاَّ أَنْتَ، أَعُوْذُ بِكَ مِنْ شَرِّ نَفْسِيْ، وَمِنْ شَرِّ الشَّيْطَانِ وَشِرْكِهِ، وَأَنْ أَقْتَرِفَ عَلَى نَفْسِيْ سُوْءًا أَوْ أَجُرُّهُ إِلَى مُسْلِمٍ.',
    latin: 'Allahumma faatirossamaawaati wal ard,\'aalimal ghoibi wasysyahaadati robbi kulli syai in wamaliikah. Asyhadu alla ilaha illa anta, a\'uudzubika min syarri nafsii, wamin syarrisysyaithoni wa syirkih, wa an aqtarifa \'ala nafsii suuan au ajurruhu ila muslim',
    translation: 'Artinya : “Ya Allah! Rabb Pencipta langit dan bumi, Yang Maha Mengetahui yang ghaib dan yang nampak, Rabb segala sesuatu dan Pemiliknya. Aku bersaksi bahwa tidak ada Ilah yang berhak disembah kecuali Engkau. Aku berlindung kepada-Mu dari kejahatan diriku, dan setan dan kesyirikannya, atau aku menjalankan kejelekan terhadap diriku atau mendorong orang Islam kepadanya. ”(12)',
  },
  {
    title: 'Dzikir Agar Terhindar Dari Kemudhāratan',
    arabic: 'بِسْمِ اللَّهِ الَّذِى لاَ يَضُرُّ مَعَ اسْمِهِ شَىْءٌ فِى الأَرْضِ وَلاَ فِى السَّمَاءِ وَهُوَ السَّمِيعُ الْعَلِيمُ',
    latin: 'Bismillahi laa yadhurru ma\'asmihi syai un fil ardi wa laa fiissamaai wahuwassamii\'ul \'aliim',
    translation: 'Artinya : “Dengan nama Allah yang dengan nama-Nya segala sesuatu di bumi dan langit tidak akan berbahaya, dan Dia-lah Yang Maha Mendengar lagi Maha Mengetahui.”(13)',
  },
  {
    title: 'Doa Memohon Diperbaiki Segala Urusan',
    arabic: 'يَا حَيُّ يَا قَيُّوْمُ بِرَحْمَتِكَ أَسْتَغِيْثُ، أَصْلِحْ لِيْ شَأْنِيْ كُلَّهُ وَلاَ تَكِلْنِيْ إِلَى نَفْسِيْ طَرْفَةَ عَيْنٍ',
    latin: 'Yaa hayyu yaa qoyyumu birohmatika astaghiitsu, ashlih lii sya\'nii kullahu walaa takilnii ilaa nafsii thorfata \'ain.',
    translation: 'Artinya : “Wahai Tuhan Yang Maha Hidup, wahai Tuhan Yang Maha Tegak, dengan rahmat-Mu aku minta pertolongan-Mu, perbaikilah segala urusanku dan jangan Engkau limpahkan aku kepada diriku walau sekejap mata.”(13)',
  },
  {
    title: 'Membaca Tasbih',
    repeat: 'Dibaca 100x',
    arabic: 'سُبْحَانَ اللهِ وَبِحَمْدِهِ.',
    latin: 'Subhanallahi wabihamdihi.',
    translation: 'Artinya : “Maha Suci Allah dan aku memuji-Nya”(14)',
  },
  {
    title: 'Membaca Tasbih',
    repeat: 'Dibaca 3x',
    arabic: 'سُبْحَانَ اللهِ وَبِحَمْدِهِ: عَدَدَ خَلْقِهِ، وَرِضَا نَفْسِهِ، وَزِنَةَ عَرْشِهِ وَمِدَادَ كَلِمَاتِهِ.',
    latin: 'Subhanallah wa bihamdih \'adada khalqihi wa ridho nafsihi wa zinata \'arsyihi wa midada kalimaatih',
    translation: 'Artinya : “Maha Suci Allah, aku memuji-Nya sebanyak makhluk-Nya, sejauh keridhoan-Nya, seberat timbangan ‘arsy-Nya dan sebanyak tinta tulisan kalimat-Nya.” (15)',
  },
  {
    title: 'Dzikir Mentauhidkan Allāh',
    repeat: 'Dibaca 1x atau 10x atau 100x atau lebih 100x',
    arabic: 'لاَ إِلَـهَ إِلاَّ اللهُ وَحْدَهُ لاَ شَرِيْكَ لَهُ، لَهُ الْمُلْكُ وَلَهُ الْحَمْدُ وَهُوَ عَلَى كُلِّ شَيْءٍ قَدِيْرُ',
    latin: 'Laa ilaaha illallahu wahdahu laa syariikalah, lahul mulku walahul hamdu wahuwa \'alaa kulli syaiin qodiir.',
    translation: 'Artinya : “Tidak ada Ilah yang berhak untuk diibadahi selain Allah Yang Maha Esa, tidak ada sekutu bagi-Nya. Milik-Nya lah kerajaan dan segala pujian. Dia Maha kuasa atas segala sesuatu.” (16)(17)(18)(19)',
  },
  {
    title: 'Memohon Ampun Atau Istighfar',
    repeat: 'Dibaca 100x',
    arabic: 'أسْتَغْفِرُ اللهَ atau أَسْتَغْفِرُ اللهَ وَأَتُوبُ إِلَيْهِ atau رَبِّ اغْفِرْ لي وتُبْ عليَّ إِنَّكَ أَنْتَ التَّوَّابُ الرَّحِيْمُ',
    latin: 'Astaghfirullah, atau Astaghfirullah wa atuubu ilaihi, atau Robbighfirli watub \'alayya innaka antat tawwaaburrahiim',
    translation: 'Artinya : “Aku memohon ampun kepada Allah.”(20) Artinya : "Aku memohon maghiroh Allah dan aku bertaubat kepadaNya."(21 ) Artinya : "Ya Rabbku ampunilah aku dan bimbinglah aku untuk bertaubat (atau terimalah taubatku) sesungguhnya Engkau adalah Maha penerima taubat dan Maha Rahmat."(22)',
  },
  {
    title: 'Ayat Kursi',
    repeat: 'Dibaca 1 x',
    arabic: 'اللَّهُ لا إِلَهَ إِلا هُوَ الْحَيُّ الْقَيُّومُ لا تَأْخُذُهُ سِنَةٌ وَلا نَوْمٌ لَهُ مَا فِي السَّمَاوَاتِ وَمَا فِي الأرْضِ مَنْ ذَا الَّذِي يَشْفَعُ عِنْدَهُ إِلا بِإِذْنِهِ يَعْلَمُ مَا بَيْنَ أَيْدِيهِمْ وَمَا خَلْفَهُمْ وَلا يُحِيطُونَ بِشَيْءٍ مِنْ عِلْمِهِ إِلا بِمَا شَاءَ وَسِعَ كُرْسِيُّهُ السَّمَاوَاتِ وَالأرْضَ وَلا يَئُودُهُ حِفْظُهُمَا وَهُوَ الْعَلِيُّ الْعَظِيمُ',
    latin: 'Allahulaa ilahaaillahuwal hayyul qoyyuum, laa ta khudzuhu sinatuwwalaanauum, lahu maa fissamaawaati wamaa fil ard, man dzalladzii yasy fa\'u \'indahu illaa bi idznih, ya\'lamumaa bayna aydiihim wamaa khulfahum, walaa yuhiithuuna bisyai immin \'ilmihi illa bimaasyaa, wa si\'a kursiyyuhussamaawaati wal ard, walaa yauudhuhu hifdzhuhuma wahuwal \'aliyyul \'adzhiim',
    translation: 'Artinya : “Allah, tidak ada Ilah (yang berhak disembah) melainkan Dia Yang Hidup kekal lagi terus menerus mengurus (makhluk-Nya); tidak mengantuk dan tidak tidur. Kepunyaan-Nya apa yang di langit dan di bumi. Siapakah yang dapat memberi syafa\'at di sisi Allah tanpa izin-Nya. Allah mengetahui apa-apa yang di hadapan mereka dan di belakang mereka, dan mereka tidak mengetahui apa-apa dari ilmu Allah melainkan apa yang dikehendaki-Nya. Kursi Allah meliputi langit dan bumi. Dan Allah tidak merasa berat memelihara keduanya, dan Allah Maha Tinggi lagi Maha Besar.” (QS. Al-Baqarah: 255) (23)',
  },
  {
    title: 'Membaca Surah Al-Ikhlas',
    repeat: 'Dibaca 3x',
    arabic: 'بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيمِ : قُلْ هُوَ اللَّهُ أَحَدٌ ﴿١﴾ اللَّهُ الصَّمَدُ ﴿٢﴾ لَمْ يَلِدْ وَلَمْ يُولَدْ ﴿٣﴾ وَلَمْ يَكُنْ لَهُ كُفُوًا أَحَدٌ ﴿٤﴾',
    latin: 'Bismillahirrohmaanirrohiim, Qul huwallahu ahad, Allahush shomad, Lam yalid walam yuulad, Walam yakullahu kufuwan ahad',
    translation: 'Artinya : "Dengan menyebut nama Allah Yang Maha Pengasih lagi Maha Penyayang.” “Katakanlah: Dialah Allah, Yang Maha Esa. Allah adalah Ilah yang bergantung kepada- Nya segala urusan. Dia tidak beranak dan tiada pula diperanakkan, dan tidak ada seorang pun yang setara dengan Dia.”(QS. Al-Ikhlash: 1-4)(24)',
  },
  {
    title: 'Membaca Surah Al-Falaq',
    repeat: 'Dibaca 3x',
    arabic: 'بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيمِ : قُلْ أَعُوذُ بِرَبِّ الْفَلَقِ (١) مِنْ شَرِّ مَا خَلَقَ (٢) وَمِنْ شَرِّ غَاسِقٍ إِذَا وَقَبَ (٣) وَمِنْ شَرِّ النَّفَّاثَاتِ فِي الْعُقَدِ (٤) وَمِنْ شَرِّ حَاسِدٍ إِذَا حَسَدَ (٥)',
    latin: 'Bismillahirrohmaanirrohiim, Qul a\'uudzu birobbil falaq, Min syarri maa kholaq, Wamin syarri ghoosiqin idzaa waqob, Wamin syarrinnaffaatsaati fil \'uqod, Wamin syarri haasidin idzaa hasad',
    translation: 'Artinya : “Dengan menyebut nama Allah Yang Maha Pengasih lagi Maha Penyayang" “Aku berlindung kepada Rabb yang menguasai Subuh, dari kejahatan makhluk-Nya, dan dari kejahatan malam apabila telah gelap gulita, dan dari kejahatan-kejahatan wanita tukang sihir yang menghembus pada buhul-buhul, dan dari kejahatan orang yang dengki apabila ia dengki.”(QS. Al-Falaq: 1-5) (25)',
  },
  {
    title: 'Membaca Surat An-Nas',
    repeat: 'Dibaca 3x',
    arabic: 'بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيمِ: قُلْ أَعُوذُ بِرَبِّ النَّاسِ ﴿١﴾ مَلِكِ النَّاسِ ﴿٢﴾ إِلَهِ النَّاسِ ﴿٣﴾ مِنْ شَرِّ الْوَسْوَاسِ الْخَنَّاسِ ﴿٤﴾ الَّذِي يُوَسْوِسُ فِي صُدُورِ النَّاسِ ﴿٥﴾ مِنَ الْجِنَّةِ وَالنَّاسِ ﴿٦﴾',
    latin: 'Bismillahirrohmaanirrohiim, Qul a\'uudzu birobbinnaas, Malikinnaas, Ilaahinnaas, Min syarril waswaasil khonnaas, Alladzii yuwaswisu fii shuduurinnaas, Minal jinnati wannaas',
    translation: 'Artinya : “Dengan menyebut nama Allah Yang Maha Pengasih lagi Maha Penyayang.” “Katakanlah: Aku berlindung kepada Rabb manusia. Raja manusia. Sembahan manusia, dari kejahatan (bisikan) syaitan yang biasa bersembunyi, yang membisikkan (kejahatan) ke dalam dada manusia, dari jin dan manusia.” (QS. An-Naas: 1-6) (26)',
  },
];

export const dzikirPetang = [
  {
    title: 'Dzikir Bersyukur Di Atas Nikmat Tauhid',
    repeat: 'Dibaca 1x',
    arabic: 'أَمْسَيْنَا عَلَى فِطْرَةِ اْلإِسْلاَمِ وَعَلَى كَلِمَةِ اْلإِخْلاَصِ، وَعَلَى دِيْنِ نَبِيِّنَا مُحَمَّدٍ صَلَّى اللهُ عَلَيْهِ وَسَلَّمَ، وَعَلَى مِلَّةِ أَبِيْنَا إِبْرَاهِيْمَ، حَنِيْفًا مُسْلِمًا وَمَا كَانَ مِنَ الْمُشْرِكِيْنَ.',
    latin: 'Amsainaa \'alaa fithrotil islam wa \'alaa kalimatil ikhlas wa \'alaa diini nabiyyinaa muhammad shallahu \'alaihi wasallam wa \'alaa millati abiinaa ibrohiim haniifam muslimaw wa maa kaana minal musyrikiin.',
    translation: 'Artinya : "Di waktu petang kami berada di atas fitrah Islam, di atas kalimat ikhlas (syahadatain), di atas agama Nabi kita Muhammad صلى الله عليه وسلم, dan di atas agama ayah kami, Ibrahim, yang berdiri di atas jalan yang lurus, muslim dan tidak tergolong orang-orang musyrik.”(27)',
  },
  {
    title: 'Dzikir Ridha Di Atas Agama Islam',
    repeat: 'Dibaca 3x',
    arabic: 'رَضِيْتُ بِاللهِ رَبًّا، وَبِاْلإِسْلاَمِ دِيْنًا، وَبِمُحَمَّدٍ صَلَّى اللهُ عَلَيْهِ وَسَلَّمَ نَبِيًّا.',
    latin: 'Rodhitubillahi robbaa, wabil islaamidiinaa, wabi muhammadin shollahu\'alaihi wasallam nabiyyaa',
    translation: 'Artinya : Aku rido/senang Allah sebagai Rabb, Islam sebagai agama dan Muhammad sebagai nabi (yang diutus oleh Allah).”',
  },
  {
    title: 'Dzikir Mentauhidkan Allāh',
    repeat: 'Dibaca 1x Atau dibaca 10x Atau dibaca 100 Atau dibaca lebih dari 100 x',
    arabic: 'لاَ إِلَـهَ إِلاَّ اللهُ وَحْدَهُ لاَ شَرِيْكَ لَهُ، لَهُ الْمُلْكُ وَلَهُ الْحَمْدُ وَهُوَ عَلَى كُلِّ شَيْءٍ قَدِيْرُ',
    latin: 'Laa ilaaha illallahu wahdahu laa syariikalah, lahul mulku walahul hamdu wahuwa \'alaa kulli syaiin qodiir.',
    translation: 'Artinya : “Tidak ada Ilah yang berhak untuk diibadahi selain Allah Yang Maha Esa, tidak ada sekutu bagi-Nya. Milik-Nya lah kerajaan dan segala pujian. Dia Maha kuasa atas segala sesuatu.”',
  },
  {
    title: 'Doa Memohon Kebaikan Di Setiap Waktu',
    repeat: 'Dibaca 1x',
    arabic: 'أَمْسَيْنَا وَأَمْسَى الْمُلْكُ لِلَّهِ، وَالْحَمْدُ لِلَّهِ، لاَ إِلَـهَ إِلاَّ اللهُ وَحْدَهُ لاَ شَرِيْكَ لَهُ، لَهُ الْمُلْكُ وَلَهُ الْحَمْدُ وَهُوَ عَلَى كُلِّ شَيْءٍ قَدِيْرُ. رَبِّ أَسْأَلُكَ خَيْرَ مَا فِيْ هَذِهِ اللَّيْلَةِ وَخَيْرَ مَا بَعْدَهَا، وَأَعُوْذُ بِكَ مِنْ شَرِّ مَا فِي هَذِهِ اللَّيْلَةِ وَشَرِّ مَا بَعْدَهَا، رَبِّ أَعُوْذُ بِكَ مِنَ الْكَسَلِ وَسُوْءِ الْكِبَرِ، رَبِّ أَعُوْذُ بِكَ مِنْ عَذَابٍ فِي النَّارِ وَعَذَابٍ فِي الْقَبْرِ',
    latin: 'Amsainaa wa amsalmulku lillah, walhamdulillah, laa ilaha illallahu wahdahu laa syariikalah, lahulmulku walahulhamdu, wahuwa \'ala kuli syai in qodiir. Robbi asaluka khoiro maa fii hadzihil lailah wa khoiro maa ba\'dahaa, wa a\'uudzubika min syarri maa fii hadzihil lailah wa syarri maa ba\'dahaa. Robbi a\'uudzubika minal kasali wa suu il kibar. Robbi a\'uudzubika min \'adzaabin fiinnaari wa \'adzaabin filqobri',
    translation: 'Artinya : “Kami telah memasuki waktu petang dan kerajaan hanya milik Allah, segala puji bagi Allah. Tidak ada Tuhan (yang berhak disembah) kecuali Allah Yang Maha Esa, tiada sekutu bagi-Nya. Bagi-Nya kerajaan dan bagi-Nya pujian. Dia-lah Yang Maha Kuasa atas segala sesuatu. Ya Rabb, aku mohon kepada-Mu kebaikan di hari ini dan kebaikan sesudahnya. Aku berlindung kepada-Mu dari kejahatan hari ini dan kejahatan sesudahnya. Ya Rabb, aku berlindung kepada-Mu dari kemalasan dan kejelekan di hari tua. Ya Rabb ku! Aku berlindung kepada-Mu dari siksaan di Neraka dan kubur.”',
  },
  {
    title: 'Sayyidul Istighfar',
    repeat: 'Dibaca 1x',
    arabic: 'اَللَّهُمَّ أَنْتَ رَبِّيْ لاَ إِلَـهَ إِلاَّ أَنْتَ، خَلَقْتَنِيْ وَأَنَا عَبْدُكَ، وَأَنَا عَلَى عَهْدِكَ وَوَعْدِكَ مَا اسْتَطَعْتُ، أَعُوْذُ بِكَ مِنْ شَرِّ مَا صَنَعْتُ، أَبُوْءُ لَكَ بِنِعْمَتِكَ عَلَيَّ، وَأَبُوْءُ بِذَنْبِيْ فَاغْفِرْ لِيْ فَإِنَّهُ لاَ يَغْفِرُ الذُّنُوْبَ إِلاَّ أَنْتَ',
    latin: 'Allahumma anta robbii laa ilaha illa anta, kholaqtanii wa anaa \'abduka, wa anaa \'ala \'ahdika, wawa\'dika mastatho\'tu. A\'uudzubika min syarri maa shona\'tu, abuu u laka bini\'matika \'alayya, wa abuu u bidzanbi faghfirlii, fainnahu laa yaghfirudz dzunuuba illa anta Catatan : jika yang membaca dzikir adalah wanita maka lafal عَبْدُكَ lebih baik diganti dengan أَمَتُكَ (amatuka), dan jika tidak diganti juga tidak mengapa (sebagaimana penjelasan Ibnu Taimiyyah rahimahullah)',
    translation: 'Artinya : “Ya Allah! Engkau adalah Rabb ku, tidak ada Ilah yang berhak disembah kecuali Engkau, Engkaulah yang menciptakanku. Aku adalah hamba-Mu. Aku akan setia pada perjanjianku dengan-Mu semampuku. Aku berlindung kepada-Mu dari kejelekan yang aku perbuat. Aku mengakui nikmat-Mu kepadaku dan aku mengakui memikul dosaku. Karena itu, ampunilah aku, sesungguhnya tiada yang mengampuni dosa kecuali Engkau.”',
  },
  {
    title: 'Memohon Kebaikan Dunia Dan Akhirat',
    repeat: 'Dibaca 1x',
    arabic: 'اَللَّهُمَّ إِنِّيْ أَسْأَلُكَ الْعَافِيَةَ فِي الدُّنْيَا وَاْلآخِرَةِ، اَللَّهُمَّ إِنِّيْ أَسْأَلُكَ الْعَفْوَ وَالْعَافِيَةَ فِي دِيْنِيْ وَدُنْيَايَ وَأَهْلِيْ وَمَالِيْ. اللَّهُمَّ اسْتُرْ عَوْرَاتِى وَآمِنْ رَوْعَاتِى,اَللَّهُمَّ احْفَظْنِيْ مِنْ بَيْنِ يَدَيَّ، وَمِنْ خَلْفِيْ، وَعَنْ يَمِيْنِيْ وَعَنْ شِمَالِيْ، وَمِنْ فَوْقِيْ، وَأَعُوْذُ بِعَظَمَتِكَ أَنْ أُغْتَالَ مِنْ تَحْتِيْ',
    latin: 'Allahumma inni asaluka al\'aafiyata fiiddunyaa wal akhiroh. Allahumma innii asalukal\'afwa wal\'aafiyata fii diinii wa dunyaaya wa ahlii wa maalii. Allahummastur \'aurootii wa aamin rou\'aatii. Allahummahfadznii minbainii yadayya, wamin kholfihii, wa \'anyamiinii, wa\'ansyimaalii, wamin fauqii, wa a\'uudzubi\'adzhomatika an ughtaala min tahtii',
    translation: 'Artinya : “Ya Allah! Sesungguhnya aku mohon keselamatan di dunia dan akhirat. Ya Allah, sesungguhnya aku mohon kepada-Mu ampunan dan keselamatan dalam agamaku, (kehidupan) duniaku, keluargaku dan hartaku. Ya Allah, tutupilah auratku dan berilah ketenteraman dihatiku. Ya Allah! Peliharalah aku dari arah depan, belakang, kanan, kiri dan atasku. Aku berlindung dengan kebesaran-Mu, agar aku tidak mendapat bahaya dari bawahku.”',
  },
  {
    title: 'Memohon Keselamatan Badan',
    repeat: 'Dibaca 3x',
    arabic: 'اَللَّهُمَّ عَافِنِيْ فِيْ بَدَنِيْ، اَللَّهُمَّ عَافِنِيْ فِيْ سَمْعِيْ، اَللَّهُمَّ عَافِنِيْ فِيْ بَصَرِيْ، لاَ إِلَـهَ إِلاَّ أَنْتَ، اَللَّهُمَّ إِنِّي أَعُوْذُ بِكَ مِنَ الْكُفْرِ وَالْفَقْرِ، اَللَّهُمَّ إِنِّي أَعُوْذُ بِكَ مِنْ عَذَابِ الْقَبْرِ، لاَ إِلَـهَ إِلاَّ أَنْتَ.',
    latin: 'Allahumma \'aafinii fii badanii, Allahumma \'aafinii fii sam\'ii, Allahumma \'aafinii fii bashorii, Laa ilaaha illa anta. Allahumma innii a\'uudzubika minal kufri wal faqr, Allahumma innii a\'uudzubika min\'adzabilqobr, Laa ilaha illa anta',
    translation: '“Ya Allah, berilah keselematan pada badanku. Ya Allah, berilah keselamatan pada pendengaranku. Ya Allah berilah keselamatan pada penglihatanku, tiada Ilah (yang berhak disembah) kecuali Engkau. Ya Allah, sesungguhnya aku berlindung kepada-Mu dari kekufuran dan kefakiran. Aku berlindung kepada-Mu dari siksa kubur, tiada Ilah (yang berhak disembah) kecuali Engkau.”',
  },
  {
    title: 'Memohon Perlindungan Dari Kejahatan Diri',
    repeat: 'Dibaca 1x',
    arabic: 'اَللَّهُمَّ فَاطِرَ السَّمَاوَاتِ وَاْلأَرْضِ، عَالِمَ الْغَيْبِ وَالشَّهَادَةِ رَبَّ كُلِّ شَيْءٍ وَمَلِيْكَهُ، أَشْهَدُ أَنْ لاَ إِلَـهَ إِلاَّ أَنْتَ، أَعُوْذُ بِكَ مِنْ شَرِّ نَفْسِيْ، وَمِنْ شَرِّ الشَّيْطَانِ وَشِرْكِهِ، وَأَنْ أَقْتَرِفَ عَلَى نَفْسِيْ سُوْءًا أَوْ أَجُرُّهُ إِلَى مُسْلِمٍ.',
    latin: 'Allahumma faatirossamaawaati wal ard,\'aalimal ghoibi wasysyahaadati robbi kulli syai in wamaliikah. Asyhadu alla ilaha illa anta, a\'uudzubika min syarri nafsii, wamin syarrisysyaithoni wa syirkih, wa an aqtarifa \'ala nafsii suuan au ajurruhu ila muslim',
    translation: 'Artinya : “Ya Allah! Rabb Pencipta langit dan bumi, Yang Maha Mengetahui yang ghaib dan yang nampak, Rabb segala sesuatu dan Pemiliknya. Aku bersaksi bahwa tidak ada Ilah yang berhak disembah kecuali Engkau. Aku berlindung kepada-Mu dari kejahatan diriku, dan setan dan kesyirikannya, atau aku menjalankan kejelekan terhadap diriku atau mendorong orang Islam kepadanya. ”',
  },
  {
    title: 'Dzikir Agar Terhindar Dari Kemudhāratan',
    repeat: 'Dibaca 3x',
    arabic: 'بِسْمِ اللَّهِ الَّذِى لاَ يَضُرُّ مَعَ اسْمِهِ شَىْءٌ فِى الأَرْضِ وَلاَ فِى السَّمَاءِ وَهُوَ السَّمِيعُ الْعَلِيمُ',
    latin: 'Bismillahi laa yadhurru ma\'asmihi syai un fil ardi wa laa fiissamaa i wahuwassamii\'ul \'aliim',
    translation: 'Artinya : “Dengan nama Allah yang dengan nama-Nya segala sesuatu di bumi dan langit tidak akan berbahaya, dan Dia-lah Yang Maha Mendengar lagi Maha Mengetahui.”',
  },
  {
    title: 'Doa Memohon Diperbaiki Segala Urusan',
    repeat: 'Dibaca 1x',
    arabic: 'يَا حَيُّ يَا قَيُّوْمُ بِرَحْمَتِكَ أَسْتَغِيْثُ، أَصْلِحْ لِيْ شَأْنِيْ كُلَّهُ وَلاَ تَكِلْنِيْ إِلَى نَفْسِيْ طَرْفَةَ عَيْنٍ',
    latin: 'Yaa hayyu yaa qoyyumu birohmatika astaghiitsu, ashlih lii sya\'nii kullahu walaa takilnii ilaa nafsii thorfata \'ain.',
    translation: 'Artinya : “Wahai Tuhan Yang Maha Hidup, wahai Tuhan Yang Maha Tegak, dengan rahmat-Mu aku minta pertolongan-Mu, perbaikilah segala urusanku dan jangan Engkau limpahkan aku kepada diriku walau sekejap mata.”',
  },
  {
    title: 'Membaca Tasbih',
    repeat: 'Dibaca 100x',
    arabic: 'سُبْحَانَ اللهِ وَبِحَمْدِهِ.',
    latin: 'Subhanallahi wabihamdihi.',
    translation: 'Artinya : “Maha Suci Allah dan aku memuji-Nya” (Dibaca 100x)',
  },
  {
    title: 'Membaca Tasbih',
    repeat: 'Dibaca 3x',
    arabic: 'سُبْحَانَ اللهِ وَبِحَمْدِهِ: عَدَدَ خَلْقِهِ، وَرِضَا نَفْسِهِ، وَزِنَةَ عَرْشِهِ وَمِدَادَ كَلِمَاتِهِ.',
    latin: 'Subhanallah wa bihamdih \'adada khalqihi wa ridho nafsihi wa zinata \'arsyihi wa midada kalimaatih',
    translation: 'Artinya : “Maha Suci Allah, aku memuji-Nya sebanyak makhluk-Nya, sejauh keridhoan-Nya, seberat timbangan ‘arsy-Nya dan sebanyak tinta tulisan kalimat-Nya.” (15)',
  },
  {
    title: 'Dzikir Mentauhidkan Allāh',
    repeat: 'Dibaca 1x atau dibaca 10x atau dibaca 100x atau dibaca lebih dari 100x',
    arabic: 'لاَ إِلَـهَ إِلاَّ اللهُ وَحْدَهُ لاَ شَرِيْكَ لَهُ، لَهُ الْمُلْكُ وَلَهُ الْحَمْدُ وَهُوَ عَلَى كُلِّ شَيْءٍ قَدِيْرُ',
    latin: 'Laa ilaaha illallahu wahdahu laa syariikalah, lahul mulku walahul hamdu wahuwa \'alaa kulli syaiin qodiir.',
    translation: 'Artinya : “Tidak ada Ilah yang berhak untuk diibadahi selain Allah Yang Maha Esa, tidak ada sekutu bagi-Nya. Milik-Nya lah kerajaan dan segala pujian. Dia Maha kuasa atas segala sesuatu.”',
  },
  {
    title: 'Membaca Ayat Kursi',
    repeat: 'Dibaca 1x',
    arabic: 'اللَّهُ لا إِلَهَ إِلا هُوَ الْحَيُّ الْقَيُّومُ لا تَأْخُذُهُ سِنَةٌ وَلا نَوْمٌ لَهُ مَا فِي السَّمَاوَاتِ وَمَا فِي الأرْضِ مَنْ ذَا الَّذِي يَشْفَعُ عِنْدَهُ إِلا بِإِذْنِهِ يَعْلَمُ مَا بَيْنَ أَيْدِيهِمْ وَمَا خَلْفَهُمْ وَلا يُحِيطُونَ بِشَيْءٍ مِنْ عِلْمِهِ إِلا بِمَا شَاءَ وَسِعَ كُرْسِيُّهُ السَّمَاوَاتِ وَالأرْضَ وَلا يَئُودُهُ حِفْظُهُمَا وَهُوَ الْعَلِيُّ الْعَظِيمُ',
    latin: 'Allahulaa ilahaaillahuwal hayyul qoyyuum, laa ta khudzuhu sinatuwwalaanauum, lahu maa fissamaawaati wamaa fil ard, man dzalladzii yasy fa\'u \'indahu illaa bi idznih, ya\'lamumaa bayna aydiihim wamaa khulfahum, walaa yuhiithuuna bisyai immin \'ilmihi illa bimaasyaa, wa si\'a kursiyyuhussamaawaati wal ard, walaa yauudhuhu hifdzhuhuma wahuwal \'aliyyul \'adzhiim',
    translation: 'Artinya : “Allah, tidak ada Ilah (yang berhak disembah) melainkan Dia Yang Hidup kekal lagi terus menerus mengurus (makhluk-Nya); tidak mengantuk dan tidak tidur. Kepunyaan-Nya apa yang di langit dan di bumi. Siapakah yang dapat memberi syafa\'at di sisi Allah tanpa izin-Nya. Allah mengetahui apa-apa yang di hadapan mereka dan di belakang mereka, dan mereka tidak mengetahui apa-apa dari ilmu Allah melainkan apa yang dikehendaki-Nya. Kursi Allah meliputi langit dan bumi. Dan Allah tidak merasa berat memelihara keduanya, dan Allah Maha Tinggi lagi Maha Besar.” (QS. Al-Baqarah: 255)',
  },
  {
    title: 'Membaca Surat Al-Ikhlas',
    repeat: 'Dibaca 3x',
    arabic: 'بِبِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيمِ : قُلْ هُوَ اللَّهُ أَحَدٌ ﴿١﴾ اللَّهُ الصَّمَدُ ﴿٢﴾ لَمْ يَلِدْ وَلَمْ يُولَدْ ﴿٣﴾ وَلَمْ يَكُنْ لَهُ كُفُوًا أَحَدٌ ﴿٤﴾',
    latin: 'Bismillahirrohmaanirrohiim, Qul huwallahu ahad, Allahush shomad, Lam yalid walam yuulad, Walam yakullahu kufuwan ahad',
    translation: 'Artinya : "Dengan menyebut nama Allah Yang Maha Pengasih lagi Maha Penyayang.” “Katakanlah: Dialah Allah, Yang Maha Esa. Allah adalah Ilah yang bergantung kepada- Nya segala urusan. Dia tidak beranak dan tiada pula diperanakkan, dan tidak ada seorang pun yang setara dengan Dia.”(QS. Al-Ikhlash: 1-4)',
  },
  {
    title: 'Membaca Surat Al-Falaq',
    repeat: 'Dibaca 3x',
    arabic: 'بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيمِ : قُلْ أَعُوذُ بِرَبِّ الْفَلَقِ ﴿١﴾ مِنْ شَرِّ مَا خَلَقَ ﴿٢﴾ وَمِنْ شَرِّ غَاسِقٍ إِذَا وَقَبَ ﴿٣﴾ وَمِنْ شَرِّ النَّفَّاثَاتِ فِي الْعُقَدِ ﴿٤﴾ وَمِنْ شَرِّ حَاسِدٍ إِذَا حَسَدَ ﴿٥﴾',
    latin: 'Bismillahirrohmaanirrohiim, Qul a\'uudzu birobbil falaq, Min syarri maa kholaq, Wamin syarri ghoosiqin idzaa waqob, Wamin syarrinnaffaatsaati fil \'uqod, Wamin syarri haasidin idzaa hasad',
    translation: 'Artinya : “Dengan menyebut nama Allah Yang Maha Pengasih lagi Maha Penyayang" “Aku berlindung kepada Rabb yang menguasai Subuh, dari kejahatan makhluk-Nya, dan dari kejahatan malam apabila telah gelap gulita, dan dari kejahatan-kejahatan wanita tukang sihir yang menghembus pada buhul-buhul, dan dari kejahatan orang yang dengki apabila ia dengki.”(QS. Al-Falaq: 1-5)',
  },
  {
    title: 'Membaca Surat An-Nas',
    repeat: 'Dibaca 3x',
    arabic: 'بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيمِ: قُلْ أَعُوذُ بِرَبِّ النَّاسِ ﴿١﴾ مَلِكِ النَّاسِ ﴿٢﴾ إِلَهِ النَّاسِ ﴿٣﴾ مِنْ شَرِّ الْوَسْوَاسِ الْخَنَّاسِ ﴿٤﴾ الَّذِي يُوَسْوِسُ فِي صُدُورِ النَّاسِ ﴿٥﴾ مِنَ الْجِنَّةِ وَالنَّاسِ ﴿٦﴾',
    latin: 'Bismillahirrohmaanirrohiim, Qul a\'uudzu birobbinnaas, Malikinnaas, Ilaahinnaas, Min syarril waswaasil khonnaas, Alladzii yuwaswisu fii shuduurinnaas, Minal jinnati wannaas',
    translation: 'Artinya : “Dengan menyebut nama Allah Yang Maha Pengasih lagi Maha Penyayang.” “Katakanlah: Aku berlindung kepada Rabb manusia. Raja manusia. Sembahan manusia, dari kejahatan (bisikan) syaitan yang biasa bersembunyi, yang membisikkan (kejahatan) ke dalam dada manusia, dari jin dan manusia.” (QS. An-Naas: 1-6)',
  },
  {
    title: 'Dzikir Mengingatkan Kita Untuk Kembali Kepada Allāh',
    repeat: 'Dibaca 1x',
    arabic: 'اللَّهُمَّ بِكَ أَمْسَيْنَا وَبِكَ أَصْبَحْنَا ، وَبِكَ نَحْيَا وَبِكَ نَمُوتُ، وَإِلَيْكَ الْمَصِيْرُ',
    latin: 'Allahumma bika amsainaa, wa bika ashbahnaa, wa bika nahyaa, wa bika namuutu wa ilaikal mashiir',
    translation: 'Artinya: "Ya Allah, dengan Engkaulah kami memasuki waktu petang, dan dengan Engkaulah kami memasuki waktu pagi. Dengan Engkaulah kami hidup dan dengan Engkaulah kami mati. Dan kepada-Mu kami kembali."',
  },
];

// Doa Kegiatan Sehari-hari — transcribed programmatically from bekalislam.online/dzikir-doa's
// own per-item HTML fragments (dzikirdoa_new/doa-kegiatan-sehari-hari/*.html), same method as
// dzikirPagi/dzikirPetang above, to avoid transcription errors. A handful of items on
// the source site have no distinct Arabic phrase of their own (a narrative note about
// what the Prophet did, or "no specific dzikir exists for this") — those are kept with
// an empty `arabic` and their note folded into `translation` instead of guessing at a
// verbatim recitation that doesn't exist. Still needs a human check against a mu'tabar
// reference before treating as final, same caution as the rest of this file.
export const doaKegiatan = [
  {
    title: 'Doa bangun tidur',
    arabic: 'اَلْحَمْدُ لِلَّهِ الَّذِيْ أَحْيَانَا بَعْدَ مَا أَمَاتَنَا وَإِلَيْهِ النُّشُوْرِ',
    latin: 'Alhamdulillaahil-ladzii ahyaanaa ba\'da maa amaatanaa wa ilaihin-nusyuur.',
    translation: '“Segala puji bagi Allah, yang membangunkan kami setelah ditidurkanNya dan kepadaNya kami dikumpulkan.” (1)',
  },
  {
    title: 'Doa bangun tidur',
    arabic: 'اَلْحَمْدُ لِلَّهِ الَّذِيْ عَافَانِيْ فِيْ جَسَدِيْ، وَرَدَّ عَلَيَّ رُوْحِيْ، وَأَذِنَ لِيْ بِذِكْرِهِ',
    latin: 'Alhamdulillaahil-ladzii \'aafaanii fii jasadii, wa rodda \'alayya ruuhii, wa adzina lii bidzikrih.',
    translation: '“Segala puji bagi Allah yang telah memberikan kesehatan(2) pada jasadku dan mengembalikan ruhku kepadaku(3) serta mengizinkanku untuk berdzikir kepada-Nya(4).” (5)',
  },
  {
    title: 'Doa bangun tidur',
    arabic: 'إِنَّ فِي خَلْقِ السَّمَاوَاتِ وَالْأَرْضِ وَاخْتِلَافِ الَّيْلِ وَالنَّهَارِ لآيَاتٍ لِّأُولِى الْأَلْبَابِ (١٩٠) الَّذِينَ يَذْكُرُونَ اللَّهَ قِيَامًا وَقُعُودًا وَعَلَى جُنُوبِهِمْ وَيَتَفَكَّرُونَ فِخَلْقِ السَّمَاوَاتِ وَالْأَرْضِ رَبَّنَا مَا خَلَقْتَ هَـٰذَا بَاطِلًا سُبْحَانَكَ فَقِنَا عَذَابَ النَّارِ (١٩١) رَبَّنَآ إِنَّكَ مَن تُدْخِلِ النَّارَ فَقَدْ أَخْزَيْتَهُۥ ۖ وَمَا لِلظَّالِمِينَ مِنْ أَنصَارٍ (١٩٢) رَّبَّنَآ إِنَّنَا سَمِعْنَا مُنَادِيًا يُنَادِى لِلْإِيمَانِ أَنْ ءَامِنُوا بِرَبِّكُمْ فَئَامَنَّا ۚ رَبَّنَا فَاغْفِرْ لَنَا ذُنُوبَنَا وَكَفِّرْ عَنَّا سَيِّئَاتِنَا وَتَوَفَّنَا مَعَ الْأَبْرَارِ (١٩٣) رَبَّنَا وَءَاتِنَا مَا وَعَدتَّنَا عَلَى رُسُلِكَ وَلَا تُخْزِنَا يَوْمَ الْقِيَامَةِ ۗ إِنَّكَ لَا تُخْلِفُ الْمِيعَادَ (١٩٤) فَاسْتَجَابَ لَهُمْ رَبُّهُمْ أَنِّى لَآ أُضِيعُ عَمَلَ عَامِلٍ مِّنكُم مِّن ذَكَرٍ أَوْ أُنثَى ۖ بَعْضُكُم مِّنۢ بَعْضٍ ۖ فَالَّذِينَ هَاجَرُوا وَأُخْرِجُوا مِن دِيَارِهِمْ وَأُوذُوا فِى سَبِيلِى وَقَاتَلُوا وَقُتِلُوا لَأُكَفِّرَنَّ عَنْهُمْ سَيِّئَاتِهِمْ وَلَأُدْخِلَنَّهُمْ جَنَّاتٍ تَجْرِى مِن تَحْتِهَا الْأَنْهَارُ ثَوَابًا مِّنْ عِندِ اللَّهِ ۗ وَاللَّهُ عِندَهُۥ حُسْنُ الثَّوَابِ (١٩٥) لَا يَغُرَّنَّكَ تَقَلُّبُ الَّذِينَ كَفَرُوا فِي الْبِلَادِ (١٩٦) مَتَاعٌ قَلِيلٌ ثُمَّ مَأْوَاهُمْ جَهَنَّمُ ۚ وَبِئْسَ الْمِهَادُ (١٩٧) لَكِنِ الَّذِينَ اتَّقَوْا رَبَّهُمْ لَهُمْ جَنَّاتٌ تَجْرِى مِن تَحْتِهَا الْأَنْهَارُ خَالِدِينَ فِيهَا نُزُلًا مِّنْ عِندِ اللَّهِ ۗ وَمَا عِندَ اللَّهِ خَيْرٌ لِّلْأَبْرَارِ (١٩٨) وَإِنَّ مِنْ أَهْلِ الْكِتَابِ لَمَن يُؤْمِنُ بِاللَّهِ وَمَآ أُنزِلَ إِلَيْكُمْ وَمَآ أُنزِلَ إِلَيْهِمْ خَاشِعِينَ لِلَّهِ لَا يَشْتَرُونَ بِئَايَاتِ اللَّهِ ثَمَنًا قَلِيلًا ۗ أُولَـٰٓئِكَ لَهُمْ أَجْرُهُمْ عِندَ رَبِّهِمْ ۗ إِنَّ اللَّهَ سَرِيعُ الْحِسَابِ (١٩٩) يَآ أَيُّهَا الَّذِينَ ءَامَنُوا اصْبِرُوا وَصَابِرُوا وَرَابِطُوا وَاتَّقُوا اللَّهَ لَعَلَّكُمْ تُفْلِحُونَ (٢٠٠)',
    translation: '“Sesungguhnya dalam penciptaan langit dan bumi silih bergantinya malam dan siang, terdapat tanda-tanda bagi orang-orang yang berakal. (Yaitu) orang-orang yang mengingat Allah dalam keadaan berdiri, duduk atau berbaring, dan mereka memikirkan tentang penciptaan langit dan bumi (seraya berkata): "Ya, Tuhan kami! Tidaklah Engkau menciptakan ini dengan sia-sia. Maha Suci Engkau, maka peliharalah kami dari siksa Neraka. Ya tuhan kami, sesungguhnya barang siapa yang Engkau masukkan ke dalam Neraka, maka sungguh telah Engkau hinakan ia, dan tidak ada bagi orang-orang yang zalim seorang penolong pun. Ya Rob kami, sesungguhnya kami mendengar (seruan) yang menyeru kepada iman, (yaitu): "Berimanlah kamu kepada tuhanmu", maka kami pun beriman. Ya tuhan kami, ampunilah bagi kami dosa-dosa kami dan hapuskanlah dari kami kesalahan-kesalahan kami, dan wafatkanlah kami beserta orang-orang yang berbakti. Ya tuhan kami, berilah kami apa yang telah Engkau janjikan kepada kami dengan perantaraan rasul-rasul Engkau. Dan janganlah Engkau hinakan kami di hari Kiamat. Sesungguhnya Engkau tidak menyalahi janji." Maka tuhan mereka memperkenankan permohonannya (dengan berfirman): "Sesungguhnya Aku tidak menyia-nyiakan amal orang-orang yang beramal di antara kamu, baik laki-laki atau perempuan, (karena) sebagian kamu adalah turunan dari sebagian yang lain. Maka orang-orang yang berhijrah, yang diusir dari kampung halamannya, yang disakiti pada jalan-Ku, yang berperang dan yang dibunuh, pastilah akan Kuhapuskan kesalahan-kesalahan mereka dan pastilah Aku masukkan mereka ke dalam Surga yang mengalir sungai-sungai di bawahnya, sebagai pahala di sisi Allah. Dan Allah pada sisi-Nya pahala yang baik." Janganlah sekali-kali kamu terperdaya oleh kebebasan orang-orang kafir bergerak di dalam negeri. Itu hanyalah kesenangan sementara, kemudian tempat tinggal mereka ialah Jahannam, dan Jahannam itu adalah tempat yang seburuk-buruknya. Akan tetapi orang-orang yang bertaqwa kepada tuhannya, bagi mereka Surga yang mengalir sungai-sungai di dalamnya, sedang mereka kekal di dalamnya sebagai tempat tinggal (anugerah) dari sisi Allah. Dan apa yang di sisi Allah adalah lebih baik bagi orang-orang yang berbakti. Dan sesungguhnya di antara ahli kitab ada orang yang beriman kepada Allah dan kepada apa yang diturunkan kepada kamu dan yang diturunkan kepada mereka sedang mereka merendahkan hati kepada Allah dan mereka tidak menukarkan ayat-ayat Allah dengan harga yang sedikit. Mereka memperoleh pahala di sisi tuhannya. Sesungguhnya Allah amat cepat perhitungan-Nya. Hai orang-orang yang beriman, bersabarlah kamu dan kuatkanlah kesabaranmu dan tetaplah bersiap siaga (di perbatasan negerimu) dan bertaqwalah kepada Allah supaya kamu beruntung.” (QS. Ali Imran: 190-200) (1)',
  },
  {
    title: 'Doa keluar dari wc/kamar mandi',
    arabic: 'غُفْرَانَكَ',
    latin: 'Ghufroonak.',
    translation: '“Aku minta ampun kepadaMu.” ( )',
  },
  {
    title: 'Doa Kegiatan Harian',
    arabic: 'أَعُوْذُ بِكَلِمَاتِ اللَّهِ التَّامَّاتِ مِنْ غَضَبِهِ وَعِقَابِهِ، وَشَرِّ عِبَادِهِ، وَمِنْ هَمَزَاتِ الشَّيَاطِيْنِ وَأَنْ يَحْضُرُوْنِ',
    latin: 'A\'uudzu bikalimaatillaahit-taammaati min ghodhobihi wa \'iqoobihi, wa syarri \'ibaadihi, wa min hamazaatisy-syayaathiini wa an yahdhuruun.',
    translation: '“Aku berlindung dengan kalimat Allah yang sempurna(1) dari kemarahan dan siksaanNya, serta kejahatan hamba-hambaNya, dan dari godaan setan (bisikannya)(2) serta jangan sampai mereka hadir (kepadaku)(3).” (4)',
  },
  {
    title: 'Doa ketika mimpi buruk',
    arabic: 'أَعُوْذُ بِاللهِ مِنَ الشَّيْطَانِ الرَّجِيْمِ',
    translation: 'lalu meludah tipis (meniup disertai sedikit liur) ke sebelah kirinya sebanyak tiga kali. Demikian juga merubah posisi tidur. Bahkan dianjurkan untuk bangun dan shalat.(1)',
  },
  {
    title: 'Doa ketika terjaga dimalam hari',
    arabic: 'لاَ إِلَـٰهَ إِلاَّ اللَّهُ الْوَاحِدُ الْقَهَّارُ، رَبُّ السَّمَاوَاتِ وَاْلأَرْضِ وَمَا بَيْنَهُمَا الْعَزِيْزُ الْغَفَّارُ',
    latin: 'Laa ilaaha illallaahul waahidul qohhaar, robbus-samaawaati wal ardhi wa maa bainahumal \'aziizul ghoffaar.',
    translation: '“Tidak ada sesembahan yang berhak disembah kecuali Allah, Yang Maha Esa, Maha Perkasa, Tuhan yang menguasai langit dan bumi dan apa yang di antara keduanya, Yang Maha Mulia lagi Maha Pengampun.” (1)',
  },
  {
    title: 'Doa masuk wc/kamar mandi',
    arabic: 'اللَّهُمَّ إِنِّي أَعُوذُ بِكَ مِنَ الخُبُثِ وَالخَبَائِثِ',
    latin: 'Allaahumma innii a\'uudzu bika minal khubutsi wal khobaa-its.',
    translation: '“Dengan nama Allah. Ya Allah, sesungguhnya aku berlindung kepada-Mu dari keburukan(1) dan jin(2).” (3)',
  },
  {
    title: 'Doa Terkait Tidur',
    arabic: 'بِسْمِ اللَّهِ الرَّحْمَـٰنِ الرَّحِيمِ قُلْ هُوَ اللَّهُ أَحَدٌ ﴿١﴾ اللَّهُ الصَّمَدُ ﴿٢﴾ لَمْ يَلِدْ وَلَمْ يُولَدْ ﴿٣﴾ وَلَمْ يَكُن لَّهُۥ كُفُوًا أَحَدٌۢ ﴿٤﴾ بِسْمِ اللَّهِ الرَّحْمَـٰنِ الرَّحِيمِ قُلْ أَعُوذُ بِرَبِّ الْفَلَقِ ﴿١﴾ مِن شَرِّ مَا خَلَقَ ﴿٢﴾ وَمِن شَرِّ غَاسِقٍ إِذَا وَقَبَ ﴿٣﴾ وَمِن شَرِّ النَّفَّاثَاتِ فِى الْعُقَدِ ﴿٤﴾ وَمِن شَرِّ حَاسِدٍ إِذَا حَسَدَ ﴿٥﴾ بِسْمِ اللَّهِ الرَّحْمَـٰنِ الرَّحِيمِ قُلْ أَعُوذُ بِرَبِّ النَّاسِ ﴿١﴾ مَلِكِ النَّاسِ ﴿٢﴾ إِلَـٰهِ النَّاسِ ﴿٣﴾ مِن شَرِّ الْوَسْوَاسِ الْخَنَّاسِ ﴿٤﴾ الَّذِى يُوَسْوِسُ فِى صُدُورِ النَّاسِ ﴿٥﴾ مِنَ الْجِنَّةِ وَالنَّاسِ ﴿٦﴾',
    latin: '“Bismillahirrahmaanirrahiim, Qul huwallahu ahad, Allahus somad, Lam yalid walam yuulad, walam yakul lahu kufuwwan ahad” (QS. Al-Ikhlas: 1-4) “Bismillahirrahmaanirrahiim, Qul A’uudzu birabbil falaq, miny syarri maa kholaq, wa miny syarri ghoosiqin idzaa waqob, wa miny syarrin naffaatsaatifil ‘uqod, wa miny syarri haasidin idzaa hasad” (QS. Al-Falaq: 1-5) “Bismillaahirrahmaanirrahiim, Qul a’uudzu birobbin naas, Malikinnaas, ilaahinnaas, miny syarril was waasil khonnaas, alladzi yuwas wisu fii shuduurinnaas, minal jinnaati wannaas” (QS: An-Nas : 1-6)',
    translation: '“Katakanlah: Dialah Allah Yang Maha Esa. Allah adalah Ilah yang bergantung kepada-Nya segala urusan. Dia tidak beranak dan tiada pula diperanakkan. Dan tidak ada seorang pun yang setara dengan Dia.” (QS. Al-Ikhlas: 1-4) “Katakanlah: Aku berlindung kepada Rabb manusia. Raja manusia. Sembahan manusia. Dari kejahatan (bisikan) syaitan yang biasa bersembunyi. Yang membisikkan (kejahatan) ke dalam dada manusia. Dari jin dan manusia.” (QS: An-Nas : 1-6) “Katakanlah: Aku berlindung kepada Rabb yang menguasai Subuh. Dari kejahatan makhluk-Nya. Dan dari kejahatan malam apabila telah gelap gulita. Dan dari kejahatan wanita-wanita tukang sihir yang menghembus pada buhul-buhul. Dan dari kejahatan orang yang dengki apabila ia dengki. (QS. Al-Falaq: 1-5) Kemudian mengusap dengan dua telapak tangan tersebut seluruh tubuh yang dapat dijangkau dengannya. Dimulai dari kepala, wajah dan tubuh bagian depan sebanyak 3x. (1)',
  },
  {
    title: 'Doa Terkait Tidur',
    arabic: 'اللَّهُ لَآ إِلَـٰهَ إِلَّا هُوَ الْحَىُّ الْقَيُّومُ ۚ لَا تَأْخُذُهُۥ سِنَةٌ وَلَا نَوْمٌ ۚ لَّهُۥ مَا فِى السَّمَاوَاتِ وَمَا فِى الْأَرْضِ ۗ مَن ذَا الَّذِى يَشْفَعُ عِندَهُۥٓ إِلَّا بِإِذْنِهِۦ ۚ يَعْلَمُ مَا بَيْنَ أَيْدِيهِمْ وَمَا خَلْفَهُمْ ۖ وَلَا يُحِيطُونَ بِشَىْءٍ مِّنْ عِلْمِهِۦٓ إِلَّا بِمَا شَآءَ ۚ وَسِعَ كُرْسِيُّهُ السَّمَاوَاتِ وَالْأَرْضَ ۖ وَلَا يَئُودُهُۥ حِفْظُهُمَا ۚ وَهُوَ الْعَلِىُّ الْعَظِيمُ ﴿٢٥٥﴾',
    latin: 'Allaahu laa ilaaha illaa huwal hayyul qoyyuum, laa ta’khudzuhu sinatuwwalaa nauum, lahuu maa fis samaawaati wamaa fil ardh, mannd dzalladzi yasy fa’u illaa bi idznih, ya’lamu maa baina aidiihim wamaa kholfahum, walaa yuhiithuuna bi syai in min ‘ilmihi illaa bimaa syaa’, wasi’a kursiyyuhus samaawaati wal ardh, walaa ya uuu duhuu hifdzuhumaa wa huwal ‘aliyyul ‘adziim (Al-Baqarah: 255)',
    translation: '"Allah, tidak ada sesembahan yang berhak disembah kecuali Dia Yang Hidup Kekal lagi terus-menerus mengurus (makhluk-Nya). Tidak mengantuk dan tidak tidur. Kepunyaan-Nya apa yang di langit dan di bumi. Siapakah yang dapat memberi syafa\'at di sisi Allah tanpa izin-Nya? Allah mengetahui apa-apa yang di hadapan dan di belakang mereka, dan mereka tidak mengetahui apa-apa dari ilmu Allah melainkan apa yang dikehendaki-Nya. Kursi Allah meliputi langit dan bumi, dan Allah tidak merasa berat memelihara keduanya. Dan Allah Maha Tinggi lagi Maha Besar." (Al-Baqarah: 255) (2)',
  },
  {
    title: 'Doa sebelum tidur',
    arabic: 'اَللَّهُمَّ أَسْلَمْتُ نَفْسِي إِلَيْكَ، وَوَجَّهْتُ وَجْهِي إِلَيْكَ، وَفَوَّضْتُ أَمْرِي إِلَيْكَ، وَأَلْجَأْتُ ظَهْرِي إِلَيْكَ، رَغْبَةً وَرَهْبَةً إِلَيْكَ، لاَ مَلْجَأَ وَلاَ مَنْجَا مِنْكَ إِلَّا إِلَيْكَ، آمَنْتُ بِكِتَابِكَ الَّذِي أَنْزَلْتَ، وَبِنَبِيِّكَ الَّذِي أَرْسَلْتَ',
    latin: 'Allaahumma aslamtu nafsii ilaika, wa wajjahtu wajhii ilaika, wa fawwadhtu amrii ilaika, wa alja\'tu zhohrii ilaika, roghbatan wa rohbatan ilaika, laa malja-a wa laa manjaa minka illaa ilaika, aamantu bikitaabika-lladzii anzalta, wa binabiyyika-lladzi arsalta.',
    translation: '“Ya Allah, aku serahkan jiwaku kepada-Mu, aku hadapkan wajahku kepada-Mu(3), aku serahkan urusanku kepada-Mu(4), aku sandarkan punggungku kepada-Mu(5), karena mengharapkan (pahala-Mu) dan takut (adzab-Mu)(6). Tiada tempat bersandar dan menyelamatkan diri dari (hukuman)-Mu kecuali kepada-Mu. Aku beriman kepada Kitab-Mu yang Engkau turunkan, dan kepada Nabi-Mu yang Engkau utus.” (7)',
  },
  {
    title: 'Doa sebelum tidur',
    arabic: 'بِاسْمِكَ رَبِّ وَضَعْتُ جَنْبِي وَبِكَ أَرْفَعُهُ، إِنْ أَمْسَكْتَ نَفْسِي فَارْحَمْهَا، وَإِنْ أَرْسَلْتَهَا فَاحْفَظْهَا بِمَا تَحْفَظُ بِهِ عِبَادَكَ الصَّالِحِينَ',
    latin: 'Bismika robbii wa dho\'tu janbii, wa bika arfa\'uhu, in amsakta nafsii farhamhaa, wa in arsaltahaa fahfazhhaa bimaa tahfazhu bihi \'ibaadakash-sholihiin.',
    translation: '“Dengan nama Engkau, wahai Tuhanku, aku meletakkan lambungku. Dan dengan nama-Mu pula aku bangun dari padanya(8). Apabila Engkau menahan rohku maka berilah rahmat padanya(9). Tapi apabila Engkau melepaskannya maka peliharalah(10), sebagaimana Engkau memelihara hamba-hambaMu yang shalih.” (11)',
  },
  {
    title: 'Doa sebelum tidur',
    arabic: 'اَللَّهُمَّ خَلَقْتَ نَفْسِيْ وَأَنْتَ تَوَفَّاهَا، لَكَ مَمَاتُهَا وَمَحْيَاهَا، إِنْ أَحْيَيْتَهَا فَاحْفَظْهَا، وَإِنْ أَمَتَّهَا فَاغْفِرْ لَهَا. اَللَّهُمَّ إِنِّيْ أَسْأَلُكَ الْعَافِيَةَ',
    latin: 'Allaahumma kholaqta nafsii wa anta tawaffaahaa, laka mamaatuhaa wa mah-yaahaa, in ah-yaytahaa fah-fazh-haa, wa in amattahaa fagh-fir lahaa, allaahumma innii as-alukal \'aafiyah.',
    translation: '“Ya Allah, sesungguhnya Engkau menciptakan diriku, dan Engkaulah yang akan mematikannya. Mati dan hidupnya hanya milik-Mu(12). Apabila Engkau menghidupkannya, maka peliharalah. Apabila Engkau mematikannya, maka ampunilah. Ya Allah, sesungguhnya aku memohon kepada-Mu keselamatan(13).” (14)',
  },
  {
    title: 'Doa sebelum tidur',
    arabic: 'اَللَّهُمَّ قِنِيْ عَذَابَكَ يَوْمَ تَبْعَثُ عِبَادَكَ',
    latin: 'Allaahumma qinii \'adzaabaka yauma tab\'atsu \'ibaadak.',
    translation: '“Ya Allah, jauhkanlah aku dari siksaanMu pada hari Engkau membangkitkan hamba-hambaMu.” (15)',
  },
  {
    title: 'Doa sebelum tidur',
    arabic: 'بِاسْمِكَ اللَّهُمَّ أَمُوْتُ وَأَحْيَا',
    latin: 'Bismika-llaahumma amuutu wa ahyaa.',
    translation: '“Dengan Nama-Mu ya Allah, aku mati(16) dan aku hidup.” (17)',
  },
  {
    title: 'Doa sebelum tidur',
    translation: 'Membaca surah As-Sajdah dan Al-Mulk (18)',
  },
  {
    title: 'Doa sebelum tidur',
    arabic: 'اَللَّهُ أَكْبَرُ (34×) اَلْحَمْدُ لِلَّهِ (33×) سُبْحَانَ اللَّهِ (33×)',
    latin: 'Allaahu akbar (34x). Alhamdulillaah (33x). Subhaanallaah (33x).',
    translation: '“Maha suci Allah (33x). Segala puji bagi Allah (33x). Allah Maha Besar (34x).” (19)',
  },
  {
    title: 'Doa sebelum tidur',
    arabic: 'اللهُمَّ رَبَّ السَّمَاوَاتِ وَرَبَّ الْأَرْضِ وَرَبَّ الْعَرْشِ الْعَظِيمِ، رَبَّنَا وَرَبَّ كُلِّ شَيْءٍ، فَالِقَ الْحَبِّ وَالنَّوَى، وَمُنْزِلَ التَّوْرَاةِ وَالْإِنْجِيلِ وَالْفُرْقَانِ، أَعُوذُ بِكَ مِنْ شَرِّ كُلِّ شَيْءٍ أَنْتَ آخِذٌ بِنَاصِيَتِهِ، اللهُمَّ أَنْتَ الْأَوَّلُ فَلَيْسَ قَبْلَكَ شَيْءٌ، وَأَنْتَ الْآخِرُ فَلَيْسَ بَعْدَكَ شَيْءٌ، وَأَنْتَ الظَّاهِرُ فَلَيْسَ فَوْقَكَ شَيْءٌ، وَأَنْتَ الْبَاطِنُ فَلَيْسَ دُونَكَ شَيْءٌ، اقْضِ عَنَّا الدَّيْنَ، وَأَغْنِنَا مِنَ الْفَقْرِ',
    latin: 'Allaahumma robbas-samaawaatis wa robbal ardhi wa robbal \'arsyil \'azhiim, robbanaa wa robba kulli syai-in, faaliqol habbi wan-nawaa, wa munzilat-taurooti wal injiili wal furqoon, a\'uudzu bika min syarri kulli syai-in anta aakhidzun binaashiyatih. Allaahumma antal awwalu falaisa qoblaka syai-un, wa antal aakhiru falaisa ba\'daka syai-un, wa antazh-zhoohiru falaisa fauqoka syai-un, wa antal baathinu falaisa duunaka syai-un, iqdhi \'annad-daina wa aghninaa minal faqr.',
    translation: '“Ya Allah, Tuhan yang menguasai langit dan tuhan penguasa bumi, Tuhan yang menguasai arsy yang agung, Tuhan kami dan Tuhan segala sesuatu. Tuhan yang membelah butir tumbuh-tumbuhan dan biji buah, Tuhan yang menurunkan kitab Taurat, Injil dan Furqan (Al-Qur\'an). Aku berlindung kepadaMu dari kejahatan segala sesuatu yang Engkau memegang ubun-ubunnya(20). Ya Allah, Engkau-lah yang pertama, sebelum-Mu tidak ada sesuatu. Engkau-lah yang terakhir, setelah-Mu tidak ada sesuatu. Engkau-lah yang dzahir, tidak ada sesuatu di atas-Mu(21). Engkau-lah yang Batin, tidak ada sesuatu yang menghalangi-Mu (22), lunasilah hutang kami dan berilah kami kekayaan hingga terlepas dari kefakiran.” (23)',
  },
  {
    title: 'Doa sebelum tidur',
    arabic: 'اَلْحَمْدُ لِلَّهِ الَّذِيْ أَطْعَمَنَا، وَسَقَانَا، وَكَفَانَا، وَآوَانَا، فَكَمْ مِمَّنْ لاَ كَافِيَ لَهُ وَلاَ مُؤْوِيَ',
    latin: 'Alhamdulillaahil-ladzii ath\'amanaa, wa saqoonaa, wa kafaanaa, wa aawaanaa, fakam mimman laa kaafiya lahu wa laa mu\'wiya.',
    translation: '“Segala puji bagi Allah yang memberi kami makan, memberi kami minum, mencukupi kami(24), dan memberi kami tempat berteduh. Betapa banyak orang yang tidak mendapatkan yang bisa memberi kecukupan dan tempat berteduh(25).” (26)',
  },
  {
    title: 'Doa sebelum tidur',
    arabic: 'اَللَّهُمَّ عَالِمَ الْغَيْبِ وَالشَّهَادَةِ، فَاطِرَ السَّمَاوَاتِ وَاْلأَرْضِ، رَبَّ كُلِّ شَيْءٍ وَمَلِيْكَهُ، أَشْهَدُ أَنْ لاَ إِلَـٰهَ إِلاَّ أَنْتَ، أَعُوْذُ بِكَ مِنْ شَرِّ نَفْسِيْ، وَمِنْ شَرِّ الشَّيْطَانِ وَشِرْكِهِ',
    latin: 'Allaahumma \'aalimal ghoibi wasy-syahaadati, faathiros-samaawaati wal ardh, robba kulli syai-in wa maliikahu, asyhadu al-laa ilaaha illaa anta, a\'uudzu bika min syarri nafsii, wa min syarrisy-syaithooni wa syirkih',
    translation: '“Ya Allah, yang Maha Mengetahui yang ghaib dan yang nyata(27), wahai Tuhan pencipta langit dan bumi, Tuhan segala sesuatu dan yang merajainya. Aku bersaksi bahwa tidak ada sesembahan yang berhak disembah kecuali Engkau. Aku berlindung kepadaMu dari kejahatan diriku(28), setan(29) dan balatentaranya.” (30)',
  },
  {
    title: 'Doa Terkait Wudhu',
    arabic: 'بِسْمِ اللَّهِ',
    latin: 'Bismillaah.',
    translation: '“Dengan nama Allah (aku berwudhu).” (1)',
  },
  {
    title: 'Doa Terkait Wudhu',
    arabic: 'أَشْهَدُ أَنْ لَا إِلَهَ إِلَّا اللهُ وَحْدَهُ لَا شَرِيكَ لَهُ وَأَشْهَدُ أَنَّ مُحَمَّدًا عَبْدُهُ وَرَسُولُهُ أَشْهَدُ أَنْ لَا إِلَهَ إِلَّا اللَّهُ وَحْدَهُ لَا شَرِيكَ لَهُ، وَأَشْهَدُ أَنَّ مُحَمَّدًا عَبْدُهُ وَرَسُولُهُ، اللَّهُمَّ اجْعَلْنِي مِنَ التَّوَّابِينَ، وَاجْعَلْنِي مِنَ المُتَطَهِّرِينَ سُبْحَانَكَ اللَّهُمَّ وَبِحَمْدِكَ، أَشْهَدُ أَنْ لاَ إِلَـٰهَ إِلاَّ أَنْتَ، أَسْتَغْفِرُكَ، وَأَتُوْبُ إِلَيْكَ',
    latin: 'Asyhadu al-laa ilaaha illallaah wahdahu laa syariika lah, wa asyhadu anna muhammadan \'abduhu wa rosuuluh. Asyhadu al-laa ilaaha illallaah wahdahu laa syariika lah, wa asyhadu anna muhammadan \'abduhu wa rosuuluh Allaahummaj \'alnii minat-tawwaabiina waj \'alnii minal mutathohhiriin. Subhaanakallaahumma wa bihamdika, asyhadu al-laa ilaaha illaa anta, astaghfiruka, wa atuubu ilaik.',
    translation: '“Aku bersaksi, bahwa tidak ada sesembahan yang berhak disembah kecuali Allah, Yang Maha Esa dan tiada sekutu bagiNya. Aku bersaksi, bahwa Muhammad adalah hamba dan utusanNya.” (1) “Aku bersaksi, bahwa tidak ada sesembahan yang berhak disembah kecuali Allah, Yang Maha Esa dan tiada sekutu bagiNya. Aku bersaksi, bahwa Muhammad adalah hamba dan utusanNya. Ya Allah, jadikanlah aku termasuk orang-orang yang bertaubat(2) dan jadikanlah aku termasuk orang-orang (yang senang) bersuci(3).” (4) “Maha Suci Engkau ya Allah, aku memujiMu. Aku bersaksi bahwa tidak ada sesembahan yang berhak disembah kecuali Engkau, aku minta ampun dan bertaubat kepada-Mu.” (5)',
  },
];

// Doa Haji & Umrah — transcribed programmatically from bekalislam.online/dzikir-doa's
// own per-item HTML fragments (dzikirdoa_new/doa-haji-umrah/*.html), same method as
// dzikirPagi/dzikirPetang above, to avoid transcription errors. A handful of items on
// the source site have no distinct Arabic phrase of their own (a narrative note about
// what the Prophet did, or "no specific dzikir exists for this") — those are kept with
// an empty `arabic` and their note folded into `translation` instead of guessing at a
// verbatim recitation that doesn't exist. Still needs a human check against a mu'tabar
// reference before treating as final, same caution as the rest of this file.
export const doaHajiUmrah = [
  {
    title: 'Niat Haji',
    arabic: 'اَللَّهُمَّ لَبَّيْكَ حَجًّا',
    latin: 'Allahumma labbaika hajjan',
    translation: '"Ya Allah aku memenuhi panggilanmu untuk berhaji" Jika menghajikan orang lain maka setelah mengucapkan lafal di atas maka ditambahkan عَنْ (án) lalu menyebutkan namanya. Contoh menghajikan Faisal bin Ahmad maka ketika di miqot mengucapkan اللَّهُمَّ لَبَّيْكَ حَجًّا عَنْ فَيْصَل بْنِ أَحْمَدَ',
  },
  {
    title: 'Niat Umroh',
    arabic: 'اَللَّهُمَّ لَبَّيْكَ عُمْرَةً',
    latin: 'Allahumma Labbaika Umroh',
    translation: '"Ya Allah aku memenuhi panggilanMu untuk umroh." Jika mengumrohkan orang lain maka setelah mengucapkan lafal di atas maka ditambahkan عَنْ (án) lalu menyebutkan namanya. Contoh mengumrohkan Faisal bin Ahmad maka ketika di miqot mengucapkan اللَّهُمَّ لَبَّيْكَ عُمْرَةً عَنْ فَيْصَل بْنِ أَحْمَدَ',
  },
  {
    title: 'Bacaan Talbiyah',
    arabic: 'لَبَّيْكَ اللَّهُمَّ لَبَّيْكَ، لَبَّيْكَ لاَ شَرِيْكَ لَكَ لَبَّيْكَ، إِنَّ الْحَمْدَ وَالنِّعْمَةَ لَكَ وَالْمُلْكَ لاَ شَرِيْكَ لَكَ',
    latin: 'Labbaikallaahumma labbaik, labbaika laa syariika laka labbaik, innal hamda wan-ni\'mata laka wal mulk, laa syariika lak.',
    translation: '"Ya Allah aku memenuhi panggilanMu untuk umroh." Jika mengumrohkan orang lain maka setelah mengucapkan lafal di atas maka ditambahkan عَنْ (án) lalu menyebutkan namanya. Contoh mengumrohkan Faisal bin Ahmad maka ketika di miqot mengucapkan اللَّهُمَّ لَبَّيْكَ عُمْرَةً عَنْ فَيْصَل بْنِ أَحْمَدَ',
  },
  {
    title: 'Doa masuk masuk kota Mekah, Madinah dan Jedah',
    arabic: 'اَللَّهُمَّ رَبَّ السَّمَاوَاتِ السَّبْعِ وَمَا أَظْلَلْنَ، وَرَبَّ اْلأَرَضِيْنَ السَّبْعِ وَمَا أَقْلَلْنَ، وَرَبَّ الشَّيَاطِيْنِ وَمَا أَضْلَلْنَ، وَرَبَّ الرِّيَاحِ وَمَا ذَرَيْنَ. أَسْأَلُكَ خَيْرَ هَـٰذِهِ الْقَرْيَةِ وَخَيْرَ أَهْلِهَا، وَخَيْرَ مَا فِيْهَا، وَأَعُوْذُ بِكَ مِنْ شَرِّهَا وَشَرِّ أَهْلِهَا وَشَرِّ مَا فِيْهَا',
    latin: 'Allaahumma robbas-samaawaatis-sab\'i wa maa azhlalna, wa robbal arodhiinas-sab\'i wa maa aqlalna, wa robbasy-syayaathiini wa maa adhlalna, wa robbar-riyaahi wa maa dzaroina. As-aluka khoiro haadzihil quryati wa khoiro ahlihaa, wa khoiro maa fiihaa, wa a\'uudzu bika min syarrihaa wa syarri ahlihaa wa syarri maa fiihaa.',
    translation: '"Ya Allah, Tuhan tujuh langit dan apa yang dinaunginya, Tuhan penguasa tujuh bumi dan apa yang di atasnya, Tuhan yang menguasai setan-setan dan apa yang mereka sesatkan, Tuhan yang menguasai angin dan apa yang diterbangkannya. Aku mohon kepadaMu kebaikan desa ini, kebaikan penduduknya dan apa yang ada di dalamnya. Aku berlindung kepadaMu dari kejelekan desa ini, kejelekan penduduknya dan apa yang ada di dalamnya."(2)',
  },
  {
    title: 'Doa Masuk Masjidil Haram',
    arabic: 'أَعُوْذُ بِاللَّهِ الْعَظِيْمِ، وَبِوَجْهِهِ الْكَرِيْمِ، وَسُلْطَانِهِ الْقَدِيْمِ، مِنَ الشَّيْطَانِ الرَّجِيْمِ، (بِسْمِ اللَّهِ، وَالصَّلاَةُ) (وَالسَّلاَمُ عَلَى رَسُوْلِ اللَّهِ) اَللَّهُمَّ افْتَحْ لِيْ أَبْوَابَ رَحْمَتِكَ',
    latin: 'A\'uudzu billaahil \'azhiim, wa biwajhihil kariim, wa sulthoonihil qodiim, minasy-syaithoonir-rojiim, (bismillaah, wash-sholaaatu) (was-salaamu \'alaa rosuulillaah) allaahummaftah lii abwaaba rohmatik.',
    translation: '"Aku berlindung kepada Allah Yang Maha Agung, dengan wajahNya Yang Mulia dan kekuasaanNya yang abadi, dari setan yang terkutuk.(3).Dengan nama Allah dan semoga shalawat.(4).dan salam tercurahkan kepada Rasulullah.(5).Ya Allah, bukalah pintu-pintu rahmatMu untukku(6)."',
  },
  {
    title: 'Doa Ketika Melihat Ka’bah',
    arabic: 'اللهُمَّ أَنْتَ السَّلَامُ وَمِنْكَ السَّلَامُ، فَحَيِّنَا رَبَّنَا بِالسَّلَامِ',
    latin: 'Allahumma antas salaam wa minkas salaam fahayyinaa rabbanaa bis salaam',
    translation: '“Ya Allah sesungguhnya Engkau adalah As-Salaam (Yang suci/selamat dari segala aib dan kekurangan), dan dariMu-lah keselamatan, maka sambutlah kami wahai Rab kami dengan keselamatan” (7)',
  },
  {
    title: 'Bertakbir Setiap Datang Ke Hajar Aswad',
    translation: 'Nabi Shallallahu\'alaihi wasallam melakukan tawaf di Baitullah, di atas unta, setiap datang ke Hajar Aswad (tiang Ka\'bah yang terdapat Hajar Aswad), beliau memberi isyarat dengan sesuatu yang dipegangnya dan bertakbir. (8)',
  },
  {
    title: 'Doa Antara Bacaan Rukun Yamani Dan Hajar Aswad',
    arabic: 'رَبَّنَا آتِنَا فِي الدُّنْيَا حَسَنَةً وَفِي اْلآخِرَةِ حَسَنَةً وَقِنَا عَذَابَ النَّارِ',
    latin: 'Robbanaa aatinaa fid-dunyaa hasanah, wa fil aakhiroti hasanah, wa qinaa \'adzaaban-naar.',
    translation: '"Wahai Tuhan kami, berilah kami kebaikan di dunia, kebaikan di akhirat dan lindungilah kami dari adzab neraka."(9) Peringatan : Selain doa antara rukun yamani dan hajar aswad maka tidak ada doa khusus, maka silahkan bebas untuk berdoa dengan doa apapun, yang penting khusyu’ dan konsentrasi ketika berdoa meminta kebaikan dunia maupun kebaikan akhirat.',
  },
  {
    title: 'Doa Ketika Melewati Dua Lampu Hijau Tatkala Saí',
    arabic: 'اللهُمَّ اغْفِرْ وَارْحَمْ، وَأَنْتَ الْأَعَزُّ الْأَكْرَمُ',
    latin: 'Allahummagh fir warham, wa antal aázzul akrom',
    translation: '“Ya Allah ampuni dan rahmatilah aku, dan Engkau adalah Yang Paling berkuasa dan Yang paling mulia” (10)',
  },
  {
    title: 'Doa Menuju Maqom Ibrahim',
    arabic: 'وَاتَّخِذُوا مِنْ مَقَامِ إِبْرَاهِيمَ مُصَلًّى',
    latin: 'Wattakhidzuu mim maqoomi ibraahiima musholla',
    translation: '“Dan jadikanlah sebahagian maqom Ibrahim sebagai tempat shalat” (QS Al-Baqoroh : 125)',
  },
  {
    title: 'Doa Minum Air Zamzam',
    arabic: 'اللَّهُمَّ إِنِّي أَسْأَلُكَ عِلْمًا نَافِعًا وَرِزْقًا وَاسِعًا وَشِفَاءً مِنْ كُلِّ دَاءٍ',
    latin: 'Allahumma inni as aluka ílman naafián wa rizqon waasián wa syifaan min kulli daa in',
    translation: '“Ya Allah sesungguhnya aku memohon kepadaMu ilmu yang bermanfaat, rizki yang lapang, dan kesembuhan dari segala penyakit”(11)',
  },
  {
    title: 'Doa Di Atas Bukit Shafa Dan Marwah',
    arabic: 'إِنَّ الصَّفَا وَالْمَرْوَةَ مِنْ شَعَآئِرِ اللَّهِ. أَبْدَأُ بِمَا بَدَأَ اللَّهُ بِهِ لاَ إِلَـٰهَ إِلاَّ اللَّهُ وَحْدَهُ لاَ شَرِيْكَ لَهُ، لَهُ الْمُلْكُ وَلَهُ الْحَمْدُ، وَهُوَ عَلَى كُلِّ شَيْءٍ قَدِيْرٌ، لاَ إِلَـٰهَ إِلاَّ اللَّهُ وَحْدَهُ أَنْجَزَ وَعْدَهُ وَنَصَرَ عَبْدَهُ وَهَزَمَ اْلأَحْزَابَ وَحْدَهُ',
    latin: 'Innash-shofaa wal marwata min sya\'aa-irillah. Abda-u bimaa bada-allaahu bih. Laa ilaaha illallaah, wahdahu laa syariika lah, lahul mulku wa lahul hamd, wa huwa \'alaa kulli syai-in qodiir, laa ilaaha illallaahu wahdah, anjaza wa\'dah, wa nashoro \'abdah, wa hazamal ahzaaba wahdah.',
    translation: 'Ketika Nabi Shallallahu\'alaihi wasallam dekat dengan bukit Shafa, beliau membaca:"Sesungguhnya Shafa dan Marwah adalah termasuk sy\'iar agama Allah. Aku memulai sa\'i dengan apa yang didahulukan oleh Allah." Kemudian beliau mulai dengan naik ke bukit Shafa, hingga beliau melihat Ka\'bah. Lalu menghadap kiblat, membaca kalimat tauhid, bertakbir 3x, lalu membaca:"Tidak ada sesembahan yang berhak disembah kecuali Allah, Yang Maha Esa, Tiada sekutu bagiNya. BagiNya kerajaan dan pujian. Dialah Yang Mahakuasa atas segala sesuatu. Tidak ada sesembahan yang berhak disembah kecuali Allah, Yang Maha Esa, yang melaksanakan janjiNya, membela hambaNya (Muhammad) dan mengalahkan golongan musuh sendirian." Kemudian beliau berdoa. Beliau membacanya (dzikir di atas dan doa) sebanyak 3x. Di dalam hadits tersebut dikatakan, Nabi Shallallahu\'alaihi wasallam juga membaca di Marwah sebagaimana beliau membaca di Shafa.(12)',
  },
  {
    title: 'Doa Pada Hari Arafah',
    arabic: 'لاَ إِلَـٰهَ إِلاَّ اللَّهُ، وَحْدَهُ لاَ شَرِيْكَ لَهُ، لَهُ الْمُلْكُ وَلَهُ الْحَمْدُ، وَهُوَ عَلَى كُلِّ شَيْءٍ قَدِيْرٌ',
    latin: 'Laa ilaaha illallaah, wahdahu laa syariika lah, lahul mulku wa lahul hamd, wa huwa \'alaa kulli syai-in qodiir.',
    translation: 'Tidak ada sesembahan yang berhak disembah kecuali Allah, Yang Maha Esa, tiada sekutu bagi-Nya. Bagi-Nya kerajaan dan bagi-Nya pujian. Dan Dia Maha Kuasa atas segala sesuatu. (13)',
  },
  {
    title: 'Bacaan Di Masy\'aril Haram (Muzdalifah)',
    translation: 'Setelah sholat subuh Nabi Shallallahu\'alaihi wasallam menghadap kiblat, berdoa, membaca takbir dan tahlil serta kalimat tauhid. Beliau terus berdoa hingga fajar menyingsing. Kemudian beliau berangkat (ke Mina) sebelum matahari terbit (14)',
  },
];

// Dzikir & Doa Shalat — transcribed programmatically from bekalislam.online/dzikir-doa's
// own per-item HTML fragments (dzikirdoa_new/dzikir-doa-shalat/*.html), same method as
// dzikirPagi/dzikirPetang above, to avoid transcription errors. A handful of items on
// the source site have no distinct Arabic phrase of their own (a narrative note about
// what the Prophet did, or "no specific dzikir exists for this") — those are kept with
// an empty `arabic` and their note folded into `translation` instead of guessing at a
// verbatim recitation that doesn't exist. Still needs a human check against a mu'tabar
// reference before treating as final, same caution as the rest of this file.
export const dzikirDoaShalat = [
  {
    title: 'Takbiratul Ihram',
    arabic: 'اللَّهُ أَكْبَرُ',
    latin: 'Allaahu Akbar',
    translation: 'Artinya ; "Allah maha besar."(1)',
  },
  {
    title: 'Iftiftah',
    arabic: '﴿١﴾ اللَّهُمَّ بَاعِدْ بَيْنِي وَبَيْنَ خَطَايَايَ، كَمَا بَاعَدْتَ بَيْنَ المَشْرِقِ وَالمَغْرِبِ، اللَّهُمَّ نَقِّنِي مِنَ الخَطَايَا كَمَا يُنَقَّى الثَّوْبُ الأَبْيَضُ مِنَ الدَّنَسِ، اللَّهُمَّ اغْسِلْ خَطَايَايَ بِالْمَاءِ وَالثَّلْجِ وَالبَرَدِ ﴿٢﴾ وَجَّهْتُ وَجْهِيَ لِلَّذِي فَطَرَ السَّمَاوَاتِ وَالْأَرْضَ حَنِيفًا، وَمَا أَنَا مِنَ الْمُشْرِكِينَ، إِنَّ صَلَاتِي، وَنُسُكِي، وَمَحْيَايَ، وَمَمَاتِي لِلَّهِ رَبِّ الْعَالَمِينَ، لَا شَرِيكَ لَهُ، وَبِذَلِكَ أُمِرْتُ وَأَنَا مِنَ الْمُسْلِمِينَ، اللهُمَّ أَنْتَ الْمَلِكُ لَا إِلَهَ إِلَّا أَنْتَ أَنْتَ رَبِّي، وَأَنَا عَبْدُكَ، ظَلَمْتُ نَفْسِي، وَاعْتَرَفْتُ بِذَنْبِي، فَاغْفِرْ لِي ذُنُوبِي جَمِيعًا، إِنَّهُ لَا يَغْفِرُ الذُّنُوبَ إِلَّا أَنْتَ، وَاهْدِنِي لِأَحْسَنِ الْأَخْلَاقِ لَا يَهْدِي لِأَحْسَنِهَا إِلَّا أَنْتَ، وَاصْرِفْ عَنِّي سَيِّئَهَا لَا يَصْرِفُ عَنِّي سَيِّئَهَا إِلَّا أَنْتَ، لَبَّيْكَ وَسَعْدَيْكَ وَالْخَيْرُ كُلُّهُ فِي يَدَيْكَ، وَالشَّرُّ لَيْسَ إِلَيْكَ، أَنَا بِكَ وَإِلَيْكَ، تَبَارَكْتَ وَتَعَالَيْتَ، أَسْتَغْفِرُكَ وَأَتُوبُ إِلَيْكَ ﴿٣﴾ وَجَّهْتُ وَجْهِيَ لِلَّذِي فَطَرَ السَّمَوَاتِ وَالْأَرْضَ حَنِيفًا مُسْلِمًا وَمَا أَنَا مِنَ الْمُشْرِكِينَ، إِنَّ صَلَاتِي وَنُسُكِي وَمَحْيَايَ وَمَمَاتِي لِلَّهِ رَبِّ الْعَالَمِينَ لَا شَرِيكَ لَهُ وَبِذَلِكَ أُمِرْتُ وَأَنَا أَوَّلُ الْمُسْلِمِينَ، اللَّهُمَّ أَنْتَ الْمَلِكُ لَا إِلَهَ إِلَّا أَنْتَ سُبْحَانَكَ وَبِحَمْدِكَ ﴿٤﴾ إِنَّ صَلَاتِي وَنُسُكِي وَمَحْيَايَ وَمَمَاتِي لِلَّهِ رَبِّ الْعَالَمِينَ لَا شَرِيكَ لَهُ، وَبِذَلِكَ أُمِرْتُ وَأَنَا مِنَ الْمُسْلِمِينَ. اللَّهُمَّ اهْدِنِي لِأَحْسَنِ الْأَعْمَالِ وَأَحْسَنِ الْأَخْلَاقِ لَا يَهْدِي لِأَحْسَنِهَا إِلَّا أَنْتَ، وَقِنِي سَيِّئَ الْأَعْمَالِ وَسَيِّئَ الْأَخْلَاقِ لَا يَقِي سَيِّئَهَا إِلَّا أَنْتَ ﴿٥﴾ سُبْحَانَكَ اللَّهُمَّ وَبِحَمْدِكَ تَبَارَكَ اسْمُكَ وَتَعَالَى جَدُّكَ وَلَا إِلَهَ غَيْرُكَ ﴿٦﴾ سُبْحَانَكَ اللَّهُمَّ وَبِحَمْدِكَ وَتَبَارَكَ اسْمُكَ، وَتَعَالَى جَدُّكَ، وَلَا إِلَهَ غَيْرَكَ ٣x لَا إِلَهَ إِلَّا اللَّهُ ٣x اللَّهُ أَكْبَرُ كَبِيرًا ﴿٧﴾ اللهُ أَكْبَرُ كَبِيرًا، وَالْحَمْدُ لِلَّهِ كَثِيرًا، وَسُبْحَانَ اللهِ بُكْرَةً وَأَصِيلًا ﴿٨﴾ الْحَمْدُ لِلَّهِ حَمْدًا كَثِيرًا طَيِّبًا مُبَارَكًا فِيهِ ﴿٩﴾ اللَّهُمَّ لَكَ الحَمْدُ أَنْتَ قَيِّمُ السَّمَوَاتِ وَالأَرْضِ وَمَنْ فِيهِنَّ، وَلَكَ الحَمْدُ لَكَ مُلْكُ السَّمَوَاتِ وَالأَرْضِ وَمَنْ فِيهِنَّ، وَلَكَ الحَمْدُ أَنْتَ نُورُ السَّمَوَاتِ وَالأَرْضِ وَمَنْ فِيهِنَّ، وَلَكَ الحَمْدُ أَنْتَ مَلِكُ السَّمَوَاتِ وَالأَرْضِ، وَلَكَ الحَمْدُ أَنْتَ الحَقُّ وَوَعْدُكَ الحَقُّ، وَلِقَاؤُكَ حَقٌّ، وَقَوْلُكَ حَقٌّ، وَالجَنَّةُ حَقٌّ، وَالنَّارُ حَقٌّ، وَالنَّبِيُّونَ حَقٌّ، وَمُحَمَّدٌ صَلَّى اللهُ عَلَيْهِ وَسَلَّمَ حَقٌّ، وَالسَّاعَةُ حَقٌّ، اللَّهُمَّ لَكَ أَسْلَمْتُ، وَبِكَ آمَنْتُ، وَعَلَيْكَ تَوَكَّلْتُ، وَإِلَيْكَ أَنَبْتُ، وَبِكَ خَاصَمْتُ، وَإِلَيْكَ حَاكَمْتُ، فَاغْفِرْ لِي مَا قَدَّمْتُ وَمَا أَخَّرْتُ، وَمَا أَسْرَرْتُ وَمَا أَعْلَنْتُ، أَنْتَ المُقَدِّمُ، وَأَنْتَ المُؤَخِّرُ، لاَ إِلَهَ إِلَّا أَنْتَ ﴿١٠﴾ اللهُمَّ رَبَّ جَبْرَائِيلَ، وَمِيكَائِيلَ، وَإِسْرَافِيلَ، فَاطِرَ السَّمَاوَاتِ وَالْأَرْضِ، عَالِمَ الْغَيْبِ وَالشَّهَادَةِ، أَنْتَ تَحْكُمُ بَيْنَ عِبَادِكَ فِيمَا كَانُوا فِيهِ يَخْتَلِفُونَ، اهْدِنِي لِمَا اخْتُلِفَ فِيهِ مِنَ الْحَقِّ بِإِذْنِكَ، إِنَّكَ تَهْدِي مَنْ تَشَاءُ إِلَى صِرَاطٍ مُسْتَقِيمٍ ١٠x الله اكبر ١٠x الحمد لله ١٠x لا اله الا الله ١٠x استغفر الله ١٠x اللهُمَّ اغْفِرْ لِي ،وَاهْدِنِي، وَارْزُقْنِي وَعَافِنِي ١٠x اللهُمَّ إِنِّي أَعُوذُ بِكَ مِنَ الضِّيقِ يَوْمَ الْحِسَابِ ﴿١٢﴾ اللَّهُ أَكْبَرُ، ذُو الْمَلَكُوتِ، وَالْجَبَرُوتِ وَالْكِبْرِيَاءِ وَالْعَظَمَةِ',
    translation: 'Pertama:“Ya Allah, jauhkanlah antara aku dan kesalahanku sebagaimana Engkau telah menjauhkan antara timur dan barat. Ya Allah, sucikanlah kesalahanku sebagaimana pakaian yang putih disucikan dari kotoran. Ya Allah, cucilah kesalahanku dengan air, salju, dan air dingin.”(1) Kedua :“Aku hadapkan wajahku kepada Dzat yang Maha Pencipta langit dan bumi sebagai muslim yang ikhlas dan aku bukan termasuk orang yang musyrik. Sesungguhnya shalatku, sembelihanku, hidupku dan matiku, hanya semata-mata untuk Allah Rabb semesta alam. Tidak ada sekutu bagiNya. Oleh karena itu aku patuh kepada perintahNya, dan aku termasuk orang yang aku berserah diri. Ya Allah, Engkaulah Maha Penguasa. Tidak ada Ilah yang berhak disembah selain Engkau. Mahasuci Engkau dan Maha Terpuji. Engkaulah Tuhanku dan aku adalah hambaMu. Aku telah menzhalimi diriku sendiri dan ku akui dosa-dosaku. Karena itu ampunilah dosa-dosaku semuanya. Sesungguhnya tidak ada yang bisa mengampuni segala dosa melainkan Engkau. Tunjukilah aku akhlak yang paling terbaik. Tidak ada yang dapat menunjukkannya melainkan hanya Engkau. Jauhkanlah akhlak yang buruk dariku, karena sesungguhnya tidak ada yang sanggup menjauhkannya melainkan hanya Engkau. Aka aku patuhi segala perintah-Mu, dan akan aku tolong agama-Mu. Segala kebaikan berada di tangan-Mu. Sedangkan keburukan tidak datang dari Mu. Orang yang tidak tersesat hanyalah orang yang Engkau beri petunjuk. Aku berpegang teguh dengan-Mu dan kepada-Mu. Tidak ada keberhasilan dan jalan keluar kecuali dari Mu. Maha Suci Engkau dan Maha Tinggi. Kumohon ampunan dariMu dan aku bertobat kepadaMu.”(1) Ketiga:“Aku hadapkan wajahku kepada Dzat yang Maha Pencipta langit dan bumi sebagai muslim yang ikhlas dan aku bukan termasuk orang yang musyrik. Sesungguhnya shalatku, sembelihanku, hidupku dan matiku, hanya semata-mata untuk Allah Rabb semesta alam. Tidak ada sekutu bagi-Nya. Oleh karena itu aku patuh kepada perintahNya, dan aku termasuk orang yang aku berserah diri. Ya Allah, Engkaulah Maha Penguasa. Tidak ada Ilah yang berhak disembah selain Engkau. Mahasuci Engkau dan Maha Terpuji”.(1) Keempat: “Sesungguhnya shalatku, sembelihanku, hidupku dan matiku, hanya semata-mata untuk Allah Rabb semesta alam. Tidak ada sekutu bagi-Nya. Oleh karena itu aku patuh kepada perintahNya, dan aku termasuk orang yang aku berserah diri. Ya Allah, tunjukilah aku amal dan akhlak yang terbaik. Tidak ada yang dapat menujukkanku kepadanya kecuali Engkau. Jauhkanlah aku dari amal dan akhlak yang buruk. Tidak ada yang dapat menjauhkanku darinya kecuali Engkau”.(2) Kelima :“Maha suci Engkau, ya Allah. Ku sucikan nama-Mu dengan memuji-Mu. Nama-Mu penuh berkah. Maha tinggi Engkau. Tidak ilah yang berhak disembah selain Engkau. (1) Keenam:“Maha suci Engkau, ya Allah. Ku sucikan nama-Mu dengan memuji-Mu. Nama-Mu penuh berkah. Maha tinggi Engkau. Tidak ilah yang berhak disembah selain Engkau, Tiada Tuhan yang berhak disembah selain Allah (3x), Allah Maha Besar (3x)” (2) Ketujuh: “Allah Maha Besar dengan segala kebesaran, segala puji bagi Allah dengan pujian yang banyak, Maha Suci Allah, baik waktu pagi dan petang” (1) Kedelapan: “Segala puji bagi Allah dengan pujian yang banyak, pujian yang terbaik dan pujian yang penuh keberkahan di dalamnya” (2) Kesembilan:“Ya Allah, segala puji bagi Engkau. Engkau pemelihara langit dan bumi serta orang-orang yang berada di dalamnya. Segala puji bagi Engkau. Engkau memiliki kerajaan langit, bumi dan siapa saja yang berada di dalamnya. Segala puji bagi Engkau. Engkau adalah cahaya bagi langit, bumi dan siapa saja yang berada di dalamnya. Segala puji bagi Engkau. Engkau Raja langit dan bumi dan Raja bagi siapa saja yang berada di dalamnya. Segala puji bagi Engkau. Engkaulah Al Haq. Janji-Mu pasti benar, firman-Mu pasti benar, pertemuan dengan-Mu pasti benar, firman-Mu pasti benar, surga itu benar adanya, neraka itu benar adanya, para nabi itu membawa kebenaran, dan Muhammad Shallallahu’alaihi Wasallam itu membawa kebenaran, hari kiamat itu benar adanya. Ya Allah, kepada-Mu lah aku berserah diri.Kepada-Mu lah aku beriman. Kepada-Mu lah aku bertawakal. Kepada-Mu lah aku bertaubat. Kepada-Mu lah aku mengadu. Dan kepada-Mu aku berhukum. Maka ampunilah dosa-dosaku. Baik yang telah aku lakukan maupun yang belum aku lakukan. Baik apa yang aku sembunyikan maupun yang aku nyatakan. Engkaulah Al Muqaddim dan Al Muakhir. Tiada Tuhan yang berhak disembah selain Engkau.” (1) Kesepuluh: “Ya Allah, Rabb-nya malaikat Jibril, Mikail, dan Israfil. Pencipta langit dan bumi. Yang mengetahui hal ghaib dan juga nyata. Engkaulah hakim di antara hamba-hamba-Mu dalam hal-hal yang mereka perselisihkan. Tunjukkanlah aku kebenaran dalam apa yang diperselisihkan, dengan izin-Mu. Sesungguhnya Engkau memberi petunjuk menuju jalan yang lurus, kepada siapa saja yang Engkau kehendaki.”(1) Kesebelas: “Allah Maha Besar” 10x “Segala pujian bagi Allah” 10x “Tiada Tuhan yang berhak disembah kecuali Allah” 10x “Aku memohon ampun kepada Allah” 10x “Ya Allah, ampunilah aku, berilah aku petunjuk, berilah aku rizki, dan berilah aku kesehatan” 10x “Ya Allah, aku berlindung dari kesempitan di hari kiamat” 10x.(1) Keduabelas:“Allah Maha Besar. Yang memiliki kerajaan besar, kekuasaan, kebesaran, dan keagungan”(2)',
  },
  {
    title: 'Taáwwudz',
    arabic: '﴿١﴾ أَعُوذُ بِاَللَّهِ مِنَ الشَّيْطَانِ الرَّجِيم ﴿٢﴾ أعوذُ باللهِ السَّمِيعِ العَلِيمِ مِنَ الشيطانِ الرَّجِيم ﴿٣﴾ أعوذ بالله من الشيطان الرجيم؛ من هَمْزِه، ونَفْخِه، ونَفْثِه ﴿٤﴾ أعوذُ باللهِ السَّمِيعِ العَلِيمِ مِنَ الشيطانِ الرَّجِيمِ من هَمْزِه، ونَفْخِه، ونَفْثِه ﴿٥﴾ أعوذُ باللهِ السَّمِيعِ العَلِيمِ مِنَ الشيطانِ الرَّجِيمِ إِنَّهُ هُوَ السَّمِيعُ الْعَلِيم ﴿٦﴾ أَسْتَعِيْذُ بِاَللَّهِ مِنَ الشَّيْطَانِ الرَّجِيم',
    latin: 'Pertama: a’uudzubillaahi minas syaithaanir rajiim. Kedua: "a’uudzubillaahis samii’il ‘aliimi minas syaithaanir rajiim" Ketiga :a’uudzubillaahi minas syaithaanir rajiim wa hamzihi wa nafkhihi wa naftsihi keempat: a’uudzubillaahis samii’il ‘aliimi minas syaithaanir rajiim min hamzihi wa nafkhihi wa naftsihi. Kelima: “a’uudzubillaahis samii’il ‘aliimi minas syaithaanir rajiim, innahu huwas samii’ul’alim” Keenam: “asta’iidzu billahi minas syaithaanirrajiim”',
    translation: 'Pertama: “aku memohon perlindungan kepada Allah dari setan yang terkutuk” (1) Kedua :“aku memohon perlindungan kepada Allah Yang Maha Mendengar lagi Maha Mengetahui, dari setan yang terkutuk.”(1) Ketiga:“aku memohon perlindungan kepada Allah, dari setan yang terkutuk yaitu dari gangguannya, kesombongannya dan sya’irnya.”(2) Keempat:“aku memohon perlindungan kepada Allah Yang Maha Mendengar lagi Maha Mengetahui, dari setan yang terkutuk yaitu dari gangguannya, kesombongannya dan sya’irnya”. (1) Kelima:"Aku berlindung kepada Allah Yang Maha Mendengar lagi Maha Mengetahui dari godaan setan yang terkutuk. Sesungguhnya Dia adalah Yang Maha Mendengar lagi Maha Mengetahui."(2) Keenam: “aku memohon perlindungan kepada Allah dari setan yang terkutuk”(3)',
  },
  {
    title: 'Ruku\'',
    arabic: '﴿١﴾سُبْحَانَ رَبِّىَ الْعَظِيم ﴿٢﴾سُبْحَانَ رَبِّىَ الْعَظِيمِ وَبِحَمْدِه (ثلاث مرات) ﴿٣﴾سُبُّوحٌ قُدُّوسٌ رَبُّ الْمَلاَئِكَةِ وَالرُّوح ﴿٤﴾سُبْحَانَكَ اللَّهُمَّ رَبَّنَا وَبِحَمْدِكَ، اللَّهُمَّ اغْفِرْ لِي ﴿٥﴾اللهُمَّ لَكَ رَكَعْتُ، وَبِكَ آمَنْتُ، وَلَكَ أَسْلَمْتُ، خَشَعَ لَكَ سَمْعِي، وَبَصَرِي، وَمُخِّي، وَعَظْمِي، وَعَصَبِي ﴿٦﴾اللَّهُمَّ لَكَ رَكَعْتُ، وَبِكَ آمَنْتُ، وَلَكَ أَسْلَمْتُ، وَعَلَيْكَ تَوَكَّلْتُ، أَنْتَ رَبِّي، خَشَعَ سَمْعِي وَبَصَرِي، وَدَمِي وَلَحْمِي، وَعَظْمِي وَعَصَبِي لِلَّهِ رَبِّ الْعَالِمِين ﴿٧﴾سُبْحَانَ ذِي الْجَبَرُوتِ وَالْمَلَكُوتِ وَالْكِبْرِيَاءِ وَالْعَظَمَة ﴿٨﴾سُبْحَانَكَ وَبِحَمْدِكَ لَا إِلَهَ إِلَّا أَنْتَ ﴿٩﴾سُبْحَانَكَ اللَّهُمَّ وَ بِحَمْدِكَ، لاَ إِلَـٰهَ إِلاَّ أَنْتَ',
    latin: 'Subḥāna Rabbiyal-‘Aẓīm Subḥāna Rabbiyal-‘Aẓīmi wa biḥamdih (thalātha marrāt) Subbuhun qudduus, robbul malaa-ikati war ruuh. Subhānakallāhumma rabbanā wa bi hamdik. Allāhummaghfir lī. Allahumma laka raka\'tu wa bika aamantu wa laka aslamtu khasya\'a laka sam\'ii wa basharii wa mukhkhii wa \'adzmii wa \'ashabii. Allāhumma laka raka‘tu, wa bika āmantu, wa laka aslamtu, wa ‘alayka tawakkaltu, anta rabbī, khasha‘a sam‘ī wa baṣarī, wa damī wa laḥmī, wa ‘aẓmī wa ‘aṣabī lillāhi rabbil-‘ālamīn. Subḥāna dhil-jabarūti wal-malakūti wal-kibriyā’i wal-‘aẓamah. Subḥānaka wa biḥamdika, lā ilāha illā anta. Subḥānaka wa biḥamdika, lā ilāha illā anta. Subḥānaka Allāhumma wa biḥamdika, lā ilāha illā anta',
    translation: '“Maha Suci Rabbku Yang Maha Agung.”(1) “Maha Suci Rabbku Yang Maha Agung dan pujian untuk-Nya.” Ini dibaca tiga kali. (2) “Maha Suci, Maha Qudus, Rabb-nya para malaikat dan ar-Ruh’ ( yaitu Jibril)”. (3) “Maha Suci Engkau Ya Allah, Rabb kami, pujian untuk-Mu, ampunilah aku”. (1) “Ya Allah, untuk-Mu aku rukuk, kepada-Mu aku beriman, untuk-Mu aku berserah diri, kutundukkan kepada-Mu pendengaranku dan penglihatanku, pikiranku, tulang-tulangku dan urat syarafku”. (2) “Ya Allah, untuk-Mu aku rukuk, kepada-Mu aku beriman, untuk-Mu aku berserah diri, kepada-Mu aku bergantung, Engkau adalah Rabb-ku, kutundukkan kepada-Mu pendengaranku dan penglihatanku, serta darahku, dagingku, tulang-tulangku dan urat syarafku, semua untuk Allah Rabb semesta alam”. (1)“ Maha Suci Dzat yang memiliki Jabarut dan Malakut dan memiliki kedigdayaan dan keagungan”.(2) “Maha Suci Engkau, segala puji bagi Engkau. Tidak ada Tuhan selain Engkau”.(3) “Mahasuci Engkau ya Allah, dan dengan pujian untuk-Mu, tidak ada sesembahan yang berhak disembah kecuali Engkau”. (1)',
  },
  {
    title: 'Iktidal',
    arabic: '﴿١﴾رَبَّنَا لَكَ الْحَمْد ﴿٢﴾رَبَّنَا وَلَكَ الْحَمْد ﴿٣﴾اللَّهُمَّ رَبَّنَا لَكَ الْحَمْد ﴿٤﴾اللَّهُمَّ رَبَّنَا وَلَكَ الْحَمْد ﴿٥﴾رَبَّنَا لَكَ الْحَمْدُ مِلْءَ السَّمَوَاتِ وَمِلْءَ الْأَرْضِ وَمِلْءَ مَا شِئْتَ مِنْ شَيْءٍ بَعْد ﴿٦﴾رَبَّنَا لَكَ الْحَمْدُ مِلْءَ السَّمَوَاتِ وَمِلْءَ الْأَرْضِ وَمِلْءَ مَا شِئْتَ مِنْ شَيْءٍ بَعْدُ، وَلَا يَنْفَعُ ذَا الْجَدِّ مِنْكَ الْجَد ﴿٧﴾اللهُمَّ رَبَّنَا لَكَ الْحَمْدُ مِلْءَ السَّمَوَاتِ، وَمِلْءَ الْأَرْضِ، وَمِلْءَ مَا شِئْتَ مِنْ شَيْءٍ بَعْد ﴿٨﴾اللَّهُمَّ رَبَّنَا وَلَكَ الْحَمْدُ مِلْءُ السَّمَاوَاتِ وَمِلْءُ الْأَرْضِ وَمَا بَيْنَهُمَا وَمِلْءُ مَا شِئْتَ مِنْ شَيْءٍ بَعْدُ، أَهْلَ الثَّنَاءِ وَالْمَجْدِ أَحَقُّ مَا قَالَ الْعَبْدُ، وَكُلُّنَا لَكَ عَبْدٌ، اللَّهُمَّ لَا مَانِعَ لِمَا أَعْطَيْتَ وَلَا مُعْطِيَ لِمَا مَنَعْتَ وَلَا يَنْفَعُ ذَا الْجَدِّ مِنْكَ الْجَدُّ ﴿٩﴾اللهُمَّ رَبَّنَا لَكَ الْحَمْدُ، مِلْءُ السَّمَاوَاتِ وَمِلْءُ الْأَرْضِ، وَمَا بَيْنَهُمَا، وَمِلْءُ مَا شِئْتَ مِنْ شَيْءٍ بَعْدُ، أَهْلَ الثَّنَاءِ وَالْمَجْدِ، لَا مَانِعَ لِمَا أَعْطَيْتَ، وَلَا مُعْطِيَ لِمَا مَنَعْتَ، وَلَا يَنْفَعُ ذَا الْجَدِّ مِنْكَ الْجَدُّ ﴿١٠﴾رَبَّنَا لَكَ الْحَمْدُ مِلْءُ السَّمَاوَاتِ وَالْأَرْضِ، وَمِلْءُ مَا شِئْتَ مِنْ شَيْءٍ بَعْدُ، أَهْلَ الثَّنَاءِ وَالْمَجْدِ، أَحَقُّ مَا قَالَ الْعَبْدُ، وَكُلُّنَا لَكَ عَبْدٌ: اللهُمَّ لَا مَانِعَ لِمَا أَعْطَيْتَ، وَلَا مُعْطِيَ لِمَا مَنَعْتَ، وَلَا يَنْفَعُ ذَا الْجَدِّ مِنْكَ الْجَدُّ ﴿١١﴾لِرَبِّيَ الْحَمْدُ لِرَبِّيَ الْحَمْدُ ﴿١٢﴾رَبَّنَا وَلَكَ الحَمْدُ حَمْدًا كَثِيرًا طَيِّبًا مُبَارَكًا فِيهِ ﴿١٣﴾رَبَّنَا وَلَكَ الْحَمْدُ حَمْدًا كَثِيرًا طَيِّبًا مُبَارَكًا فِيهِ جَزِيلًا ﴿١٤﴾رَبَّنَا وَلَكَ الْحَمْدُ؛ حَمْداً كَثِيْراً طَيِّباً مُبَارَكاً فِيْهِ مُبَاركَاً عَلَيْهِ؛ كَمَا يُحِبُّ رَبُّنَا وَيَرْضَى',
    latin: 'Rabbanaa lakal hamdu Rabbanaa wa lakal hamdu Allahumma rabbanaa lakal hamdu Allahumma rabbanaa wa lakal hamdu Rabbanaaa lakal hamdu mil-as-samaawaati wa mil-al-ardhi wa mil-a maa syik-ta min syai-im ba’du. Rabbanaaa lakal hamdu mil-as-samaawaati wa mil-al-ardhi wa mil-a maa syik-ta min syai-im ba’du wa laa yanfa’u dzal jaddi minkal jaddu. Allahumma rabbanaaa lakal hamdu mil-as-samaawaati wa mil-al-ardhi wa mil-a maa syik-ta min syai-im ba’du. Allahumma rabbanaaa wa lakal hamdu mil-us-samaawaati wa mil-ul-ardhi wa maa bainahumaa wa mil-u maa syik-ta min syai-im ba’du ahlats tsanaa-i wal majdi ahaqqu maa qoolal ‘abdu wa kullunaa ‘abdun, allahumma laa maani’a limaa a’thoita wa laa mu’thiya limaa mana’ta wa laa yanfa’u dzal jaddi minkal jaddu. Allahumma rabbanaaa lakal hamdu mil-us-samaawaati wa mil-ul-ardhi wa maa bainahumaa wa mil-u maa syik-ta min syai-im ba’du ahlats tsanaa-I wal majdi, laa maani’a limaa a’thoita wa laa mu’thiya limaa mana’ta wa laa yanfa’u dzal jaddi minkal jaddu. Rabbanaaa lakal hamdu mil-us-samaawaati wa mil-ul-ardhi wa mil-u maa syik-ta min syai-im ba’du ahlats tsanaa-I wal majdi ahaqqu maa qoolal ‘abdu wa kullunaa laka ‘abdun, allahumma laa maani’a limaa a’thoita wa laa mu’thiya limaa mana’ta wa laa yanfa’u dzal jaddi minkal jaddu Li rabbiyal hamdu… Li rabbiyal hamdu. Rabbanaa wa lakal hamdu hamdan katsiiran thayyiban mubaarakan fiihi mubaarakan ‘alaihi kamaa yuhibbu rabbunaa wa yardhaa. Rabbanaa wa lakal hamdu hamdan katsiiran thayyiban mubaarakan fiihi jaziilan Rabbanaa lakal hamdu hamdan katsiiron thoyyiban mubaarokan fiihi, mubaarokan ‘alaihi kamaa yuhibbu rabbunaa wa yardhoo.',
    translation: '"Wahai Rabb kami, bagi-Mu segala puji".(2) "Wahai Rabb kami, dan bagi-Mu segala puji."(3) "Ya Allah Rabb kami, bagi-Mu segala puji."(4) "Ya Allah Rabb kami, dan bagi-Mu segala puji." (5) "Rabb kami, bagi-Mu segala puji sepenuh langit dan sepenuh bumi, serta sepenuh apa yang ada di antara keduanya dan sepenuh apa yang Engkau inginkan dari sesuatu setelahnya."(1) "Rabb kami, bagi-Mu segala puji sepenuh langit dan sepenuh bumi, serta sepenuh apa yang ada di antara keduanya dan sepenuh apa yang Engkau inginkan dari sesuatu setelahnya, dan tidak bermanfaat bagi-Mu kemuliaan/kedudukan orang yang memiliki kemuliaan."(2) "Ya Allah Rabb kami, bagi-Mu segala puji sepenuh langit dan sepenuh bumi, serta sepenuh apa yang ada di antara keduanya dan sepenuh apa yang Engkau inginkan dari sesuatu setelahnya." (3) "Ya Allah Rabb kami,dan bagi-Mu segala puji sepenuh langit dan sepenuh bumi, dan sepenuh yang ada diantara langit dan bumi, serta sepenuh apa yang Engkau inginkan dari sesuatu setelahnya. Engkau adalah Dzat yang berhak mendapat pujian dan kemuliaan. (Ucapan ini) yang paling pantas diucapkan seorang hamba. Dan semua kami adalah hamba-Mu semata. Ya Allah, tidak ada yang bisa menahan apa yang Engkau berikan. Dan tidak ada yang bisa memberikan apa yang Engkau tahan. Tidak bermanfaat dari-Mu kemuliaan/kedudukan orang yang memiliki kemuliaan."(4) (Ya Allah Rabb kami, bagi-Mu segala puji sepenuh langit dan sepenuh bumi, dan sepenuh yang ada diantara langit dan bumi, serta sepenuh apa yang Engkau inginkan dari sesuatu setelahnya. Engkau adalah Dzat yang berhak mendapat pujian dan kemuliaan. tidak ada yang bisa menahan apa yang Engkau berikan. Dan tidak ada yang bisa memberikan apa yang Engkau tahan. Tidak bermanfaat dari-Mu kemuliaan/kedudukan orang yang memiliki kemuliaan). (1) "Rabb kami, bagi-Mu segala puji sepenuh langit dan sepenuh bumi, serta sepenuh apa yang Engkau inginkan dari sesuatu setelahnya. Engkau adalah Dzat yang berhak mendapat pujian dan kemuliaan. (Ucapan ini) yang paling pantas diucapkan seorang hamba. Dan semua kami adalah hamba-Mu semata. Ya Allah, tidak ada yang bisa menahan apa yang Engkau berikan. Dan tidak ada yang bisa memberikan apa yang Engkau tahan. Tidak bermanfaat dari-Mu kemuliaan/kedudukan orang yang memiliki kemuliaan."(2) "Pujian hanya untuk Rabbku, pujian hanya untuk Rabbku". (3) "Wahai Rabb kami, hanya untuk-Mu segala pujian. Pujian yang banyak, yang baik, yang diberkahi di dalamnya."(4) "Wahai Rabb kami, hanya untuk-Mu segala pujian. Pujian yang banyak, yang baik, yang diberkahi, yang banyak di dalamnya."(1) "Wahai Rabb kami, hanya untuk-Mu segala pujian. Pujian yang banyak, yang baik, yang diberkahi di dalamnya, yang diberkahi atasnya sebagaimana yang dicintai dan diridhoi oleh Rabb kami."(2)',
  },
  {
    title: 'Sujud',
    arabic: '﴿١﴾سُبْحَانَ رَبِّىَ الأَعْلَى ﴿٢﴾سُبْحَانَ رَبِّىَ الأَعْلَى وَبِحَمْدِهِ ﴿٣﴾سُبُّوحٌ قُدُّوسٌ رَبُّ الْمَلاَئِكَةِ وَالرُّوحِ ﴿٤﴾سُبْحَانَكَ اللَّهُمَّ رَبَّنَا وَبِحَمْدِكَ اللَّهُمَّ اغْفِرْ لِي ﴿٥﴾اللهُمَّ لَكَ سَجَدْتُ، وَبِكَ آمَنْتُ، وَلَكَ أَسْلَمْتُ، سَجَدَ وَجْهِي لِلَّذِي خَلَقَهُ، وَصَوَّرَهُ، وَشَقَّ سَمْعَهُ وَبَصَرَهُ، تَبَارَكَ اللهُ أَحْسَنُ الْخَالِقِينَ ﴿٦﴾اَللَّهُمَّ لَكَ سَجَدْتُ، وَبِكَ آمَنْتُ، وَلَكَ أَسْلَمْتُ، وَأَنْتَ رَبِّي، سَجَدَ وَجْهِيْ لِلَّذِيْ خَلَقَهُ وَصَوَّرَهُ، فَأَحْسَنَ صُوَرَهُ، وَشَقَّ سَمْعَهُ وَبَصَرَهُ، تَبَارَكَ اللَّهُ أَحْسَنُ الْخَالِقِيْنَ ﴿٧﴾سُبْحَانَكَ وَبِحَمْدِكَ لَا إِلَهَ إِلَّا أَنْتَ ﴿٨﴾سُبْحَانَكَ اللَّهُمَّ وَبِحَمْدِكَ، لاَ إِلَـٰهَ إِلاَّ أَنْتَ ﴿٩﴾سُبْحَانَ ذِي الْجَبَرُوتِ وَالْمَلَكُوتِ وَالْكِبْرِيَاءِ وَالْعَظَمَةِ',
    latin: 'Subḥāna Rabbiyal-A‘lā Subḥāna Rabbiyal-A‘lā wa biḥamdih Aqrabu mā yakūnu al-‘abdu min rabbihi wa huwa sājidun fa-akthirū ad-du‘ā’. Subḥānaka Allāhumma rabbanā wa biḥamdik, Allāhumma ighfir lī. Allāhumma laka sajadtu, wabika āmentu, walaka aslamtu, sajada wajhī lilladhī khalaqahu, wa ṣawwarahu, wa shakka sam‘ahu wa baṣarahu, tabāraka Allāhu aḥsanu al-khāliqīn. Allāhumma laka sajadtu, wabika āmentu, walaka aslamtu, wa anta rabbī, sajada wajhī lilladhī khalaqahu wa ṣawwarahu, fa-aḥsana ṣūwarahu, wa shakka sam‘ahu wa baṣarahu, tabāraka Allāhu aḥsanu al-khāliqīn. Subḥānaka wa biḥamdik, lā ilāha illā ant. Subḥānaka Allāhumma wa biḥamdik, lā ilāha illā ant. Subḥāna dhī al-jabarūti wa al-malakūti wa al-kibriyā’i wa al-‘aẓamah.',
    translation: '“Maha Suci Rabbku Yang Maha Tinggi”.(3) “Maha Suci Rabbku Yang Maha Tinggi dan pujian untuk-Nya”. Ini dibaca tiga kali. (1) “Mahasuci, Maha Qudus, Rabbnya para malaikat dan ruh -yaitu Jibril-.” (2) “Maha Suci Engkau ya Allah, Tuhan kami, Segala puji bagi Engkau. Ya Allah, ampunilah aku”.(1) “Ya Allah, kepada-Mu aku bersujud, kepada-Mu aku beriman, kepada-Mu aku berserah diri. Telah sujud wajahku kepada Dia yang telah menciptakannya, membentuknya, memisahkan pendengaran dan penglihatannya, Maha Suci Allah Pencipta yang paling baik. (1) “Ya Allah, hanya kepada-Mu aku bersujud, hanya kepada-Mu aku beriman, hanya kepada-Mu aku berserah diri. (Engkau Rabb-ku). Bersujud wajahku kepada Dzat yang menciptakan dan membentuknya, lalu Dia baguskan rupanya, yang membelah pendengaran dan penglihatannya. Mahasuci Allah sebaik-baik Pencipta. (1) “Maha Suci Engkau, segala puji bagi Engkau. Tidak ada Tuhan selain Engkau”. (2) “Mahasuci Engkau ya Allah, dan dengan pujian untuk-Mu, tidak ada sesembahan yang berhak disembah kecuali Engkau”.(3) “Maha Suci Dia yang memiliki kekuasaan, kerajaan, kebesaran dan keagungan”.(4)',
  },
  {
    title: 'Doa Doa Sujud',
    arabic: '﴿١﴾اللهُمَّ اغْفِرْ لِي ذَنْبِي كُلَّهُ دِقَّهُ، وَجِلَّهُ، وَأَوَّلَهُ وَآخِرَهُ وَعَلَانِيَتَهُ وَسِرَّهُ ﴿٢﴾اللَّهُمَّ اغْفِرْ لِي مَا أَسْرَرْتُ وَمَا أَعْلَنْتُ ﴿٣﴾ربِّ اغْفِرْ لِي مَا أَسْرَرْتُ وَمَا أَعْلَنْتُ ﴿٤﴾اللهُمَّ اجْعَلْ فِي قَلْبِي نُورًا، وَفِي سَمْعِي نُورًا، وَفِي بَصَرِي نُورًا، وَعَنْ يَمِينِي نُورًا، وَعَنْ شِمَالِي نُورًا، وَأَمَامِي نُورًا، وَخَلْفِي نُورًا، وَفَوْقِي نُورًا، وَتَحْتِي نُورًا، وَاجْعَلْ لِي نُورًا ﴿٥﴾اَللَّهُمَّ إِنِّيْ أَعُوْذُ بِرِضَاكَ مِنْ سَخَطِكَ، وَبِمُعَافَاتِكَ مِنْ عُقُوْبَتِكَ، وَأَعُوْذُ بِكَ مِنْكَ، لاَ أُحْصِيْ ثَنَاءً عَلَيْكَ، أَنْتَ كَمَا أَثْنَيْتَ عَلَى نَفْسِكَ',
    latin: 'Allahumma ighfirlii dzanbii kullahu, diqqahu, wa jillahu, wa awwalahu wa aakhirahu, wa ‘alaaniyyatahu wa sirrahu’. Allahumma ighfirlii maa asrartu wa maa a’lantu’ Allahumma ij’al fii qalbii nuuraa, wa fii sam’i nuura, wa fii basharii nuuraa, wa ‘an yamiinii nuuraa, wa ‘an syimaalii nuuraa, wa amaamii nuuraa, wa khalfii nuuraa, wa fauqii nuuraa, wa tahtii nuuraa, waj’al lii nuuraa’ Allahumma innii a’udzu bi ridhaaka min sakhatika, wa bi mu’aafaatika min ‘uquubatika, wa a’udzubika minka, laa uhshi tsanaa’an ‘alaika kamaa atsnaita ‘ala nafsika’',
    translation: '“Ya Allah, ampunilah untukku dosaku semuanya, baik yang kecil maupun yang besar, yang awal maupun yang akhir, yang terang-terangan maupun yang sembunyi-sembunyi”.(1) “Ya Allah, ampunilah dosaku yang tersembunyi dan terang-terangan”.(2) “Wahai Rabb-ku, ampunilah aku, apa yang aku rahasiakan dan apa yang aku nyatakan”. (3) “Ya Allah, jadikanlah cahaya di dalam hatiku, cahaya di dalam pendengaranku, cahaya di dalam mataku, cahaya di sebelah kananku, cahaya di sebelah kiriku, cahaya di depanku, cahaya di belakangku, cahaya di atasku, cahaya di bawahku, dan jadikanlah cahaya untukku”.(1) “Ya Allah, sesungguhnya aku berlindung dengan keridhaan-Mu dari kemarahan-Mu, dan dengan keselamatan-Mu dari hukuman-Mu, dan aku berlindung kepada-Mu dari siksa-Mu. Aku tidak mampu menghitung pujian dan sanjungan kepada-Mu, Engkau adalah sebagaimana yang Engkau sanjungkan kepada diri-Mu sendiri”. (3)',
  },
  {
    title: 'Duduk Diantara Dua Sujud',
    arabic: '﴿١﴾رَبِّ اغْفِرْ لِي، رَبِّ اغْفِرْ لِي ﴿٢﴾رَبِّ اغْفِرْ لِي، وَارْحَمْنِي، وَاجْبُرْنِي، وَارْزُقْنِي، وَارْفَعْنِي ﴿٣﴾اللَّهُمَّ اغْفِرْ لِي، وَارْحَمْنِي، وَاجْبُرْنِي، وَاهْدِنِي، وَارْزُقْنِي ﴿٤﴾رَبِّ اغْفِرْ لِي، وَارْحَمْنِي، وَاجْبُرْنِي، وَارْفَعْنِي، وَارْزُقْنِي، وَاهْدِنِي ﴿٥﴾اللَّهُمَّ اغْفِرْ لِي وَارْحَمْنِي وَاهْدِنِي وَعَافِنِي وَارْزُقْنِي',
    latin: 'Rabbi ighfir lī, rabbi ighfir lī. Rabbi ighfir lī, warḥamnī, wajburnī, warzuqnī, warfa‘nī. Allāhumma ighfir lī, warḥamnī, wajburnī, wahdinī, warzuqnī. Rabbi ighfir lī, warḥamnī, wajburnī, warfa‘nī, warzuqnī, wahdinī. 5Allāhumma ighfir lī, warḥamnī, wahdinī, wa‘āfinī, warzuqnī.',
    translation: '“Ya Allah ampuni aku, Ya Allah ampuni aku”. (1) "Ya Allah ampunilah aku, rahmatilah aku, cukupkanlah aku, berilah rezeki dan tinggikanlah derajatku”.(2) “Ya Allah ampunilah aku, rahmatilah aku, cukupkanlah aku, berilah aku petunjuk, dan berilah rezeki”. (3) “Ya Allah ampunilah aku, rahmatilah aku, cukupkanlah aku, tinggikanlah derajatku, berilah rezeki dan petunjuk untukku”. (4) “Ya Allah ampunilah aku, rahmatilah aku, berikanlah aku petunjuk, selamatkanlah aku, dan berilah rezeki”.(5)',
  },
  {
    title: 'Tasyahhud',
    arabic: '﴿١﴾التَّحِيَاتُ لِلَّهِ وَالصَّلَوَاتُ وَالطَّيِّبَاتُ، السَّلَامُ عَلَيْكَ أيُّهَا النَّبِيُّ وَرَحْمَةُ اللهِ وَبَرَكَاتُهُ، اَلسَّلاَمُ عَلَيْنَا وَعَلَى عِبَادِ اللهِ الصَّالِحِيْنَ، أَشْهَدُ أَنْ لَا إِلَهَ إِلَّا اللهُ، وَأَشْهَدُ أَنَّ مُحَمَّدًا عَبْدُهُ وَرَسُوْلُهُ ﴿٢﴾اَلتَّحِيَاتُ المُبَارَكَاتُ، الصَلَوَاتُ الطَّيِّبَاتُ لله، اَلسَّلَامُ عَلَيْكَ أيُّهَا النَّبِيُّ وَرَحْمَةُ اللهِ وَبَرَكَاتُهُ، السَّلَامُ عَلَينَا وَعَلَى عِبَادِ اللهِ الصَالِحِين، أَشْهَدُ أَن لَّا إِلَهَ إِلّا الله، وَأَشْهَدُ أنَّ مُحَمَّدًا رَسُوْلُ الله ﴿٣﴾اَلتَّحِيَاتُ الطَّيِّبَاتُ الصَّلَوَاتُ لله السَّلَامُ عَلَيْكَ أيُّهَا النَّبِيُّ وَرَحْمَةُ اللهِ وَبَرَكَاتُه، السَّلاَمُ عَلَيْنَا وَعَلَى عِبَادِ اللهِ الصَّالِحِينَ، أَشْهَدُ أَن لَّا إِلَهَ إِلّا الله، وَأَشْهَدُ أَن مُحَمَّدًا عَبْدُهُ وُرَسُوْلُهُ ﴿٤﴾بِسْمِ الله التَّحِيَّاتُ للهِ، وَالصَّلَوَاتُ للهِ، الزَّاكِيَاتُ للهِ، السَّلَامُ عَلَى النَّبِيِّ وَرَحْمَةُ الله وَبرَكَاتُهُ، السَّلَامُ عَلَيْنَا وَعَلَى عِبَادِ اللهِ الصَّالِحِيْنَ، أَشْهَدُ أَنْ لَا إِلَهَ إِلَّا اللهُ، شَهِدْتُ أَنْ لَا إِلَهَ إِلَّا الله وَشَهِدْتُ أَنَّ مُحَمَّدًا رَسُولُ الله ﴿٥﴾التَّحِيَّاتُ لِلَّهِ، الزَّاكِيَاتُ لِلَّهِ، الطَّيِّبَاتُ الصَّلَوَاتُ لِلَّهِ، السَّلَامُ عَلَيْكَ أَيُّهَا النَّبِيُّ وَرَحْمَةُ اللَّهِ وَبَرَكَاتُهُ، السَّلَامُ عَلَيْنَا وَعَلَى عِبَادِ اللَّهِ الصَّالِحِينَ، أَشْهَدُ أَنْ لَا إِلَهَ إِلَّا اللَّهُ. وَأَشْهَدُ أَنَّ مُحَمَّدًا عَبْدُهُ وَرَسُولُهُ ﴿٦﴾التَّحِيَّاتُ الطَّيِّبَاتُ، الصَّلَوَاتُ الزَّاكِيَاتُ لِلَّهِ، أَشْهَدُ أَنْ لَا إِلَهَ إِلَّا اللَّهُ وَحْدَهُ لَا شَرِيكَ لَهُ، وَأَنَّ مُحَمَّدًا عَبْدُهُ وَرَسُولُهُ، السَّلَامُ عَلَيْكَ أَيُّهَا النَّبِيُّ وَرَحْمَةُ اللَّهِ وَبَرَكَاتُهُ، السَّلَامُ عَلَيْنَا وَعَلَى عِبَادِ اللَّهِ الصَّالِحِينَ، السَّلَامُ عَلَيْكُمْ',
    translation: '“Segala ucapan selamat, salawat, dan kebaikan hanya milik Allah. Mudah-mudahan salawat serta salam terlimpahkan kepadamu wahai engkau wahai Nabi beserta rahmat Allah dan berkah-Nya. Mudah-mudahan salawat dan salam terlimpahkan pula kepada kami dan kepada seluruh hamba Allah yang saleh. Aku bersaksi bahwa tidak ada sesembahan yang berhak disembah melainkan Allah, dan aku bersaksi bahwa Muhammad itu adalah hamba-Nya dan utusan-Nya”. (1) “Segala ucapan selamat, shalawat, dan kebaikan hanya milik Allah. Mudah-mudahan shalawat dan salam terlimpahkan kepadamu wahai Nabi beserta rahmat Allah dan barakah-Nya. Mudah-mudahan shalawat dan salam terlimpah pula kepada kami dan kepada seluruh hamba Allah yang shalih. Aku bersaksi bahwa tidak ada sesembahan yang berhak disembah melainkan Allah, dan aku bersaksi bahwa Muhammad itu adalah utusan Allah. (1) “Segala penghormatan, kebaikan dan shalawat hanya milik Allah. Mudah-mudahan salam terlimpahkan kepadamu wahai Nabi beserta rahmat Allah dan barakah-Nya. Mudah-mudahan salam terlimpah pula kepada kami dan kepada seluruh hamba Allah yang shalih. Aku bersaksi bahwa tidak ada sesembahan yang berhak disembah melainkan Allah, dan aku bersaksi bahwa Muhammad itu adalah hamba-Nya dan utusan-Nya”.(2) Dengan nama Allah, segala penghormatan dan shalawat hanya milik Allah, amal-amal shalih hanya bagi Allah. Mudah-mudahan salam terlimpahkan kepadamu wahai Nabi beserta rahmat Allah dan barakah-Nya. Mudah-mudahan salam terlimpah pula kepada kami dan kepada seluruh hamba Allah yang shalih. Aku bersaksi bahwa tidak ada sesembahan yang berhak disembah melainkan Allah, dan aku bersaksi bahwa Muhammad itu adalah utusan-Nya (3) Segala penghormatan dan amal-amal shalih hanya bagi Allah. Segala kebaikan dan shalawat hanya milik Allah. Mudah-mudahan salam terlimpahkan kepadamu wahai Nabi beserta rahmat Allah dan barakah-Nya. Mudah-mudahan salam terlimpah pula kepada kami dan kepada seluruh hamba Allah yang shalih. Aku bersaksi bahwa tidak ada sesembahan yang berhak disembah melainkan Allah, dan aku bersaksi bahwa Muhammad itu adalah hamba-Nya dan utusan-Nya (4) Segala penghormatan, kebaikan, shalawat, dan amal shalih hanya bagi Allah. Aku bersaksi bahwa tidak ada sesembahan yang berhak disembah melainkan Allah tiada sekutu bagiNya, dan aku bersaksi bahwa Muhammad itu adalah hamba-Nya dan utusan-Nya. Mudah-mudahan salam terlimpahkan kepadamu wahai Nabi beserta rahmat Allah dan barakah-Nya. Mudah-mudahan salam terlimpah pula kepada kami dan kepada seluruh hamba Allah yang shalih. Keselamatan atas kalian. (1)',
  },
  {
    title: 'Doa Doa Sebelum Salam',
    arabic: '﴿١﴾اللهُمَّ إِنِّي أَعُوذُ بِكَ مِنْ عَذَابِ جَهَنَّمَ، وَمِنْ عَذَابِ الْقَبْرِ، وَمِنْ فِتْنَةِ الْمَحْيَا وَالْمَمَاتِ، وَمِنْ شَرِّ فِتْنَةِ الْمَسِيحِ الدَّجَّالِ ﴿٢﴾اللَّهُمَّ إِنِّي ظَلَمْتُ نَفْسِي ظُلْمًا كَثِيرًا، وَلاَ يَغْفِرُ الذُّنُوبَ إِلَّا أَنْتَ، فَاغْفِرْ لِي مَغْفِرَةً مِنْ عِنْدِكَ، وَارْحَمْنِي إِنَّكَ أَنْتَ الغَفُورُ الرَّحِيمُ ﴿٣﴾اللهُمَّ حَاسِبْنِي حِسَابًا يَسِيرًا ﴿٤﴾اللَّهُمَّ إِنِّي أَعُوذُ بِكَ مِنْ شَرِّ مَا عَمِلْتُ، وَمِنْ شَرِّ مَا لَمْ أَعْمَلْ بَعْدُ ﴿٥﴾اللَّهُمَّ إِنِّي أَسْأَلُكَ يَا اللهُ بِأَنَّكَ الْوَاحِدُ الْأَحَدُ الصَّمَدُ الَّذِي لَمْ يَلِدْ وَلَمْ يُولَدْ وَلَمْ يَكُنْ لَهُ كُفُوًا أَحَدٌ أَنْ تَغْفِرَ لِي ذُنُوبِي إِنَّكَ أَنْتَ الْغَفُورُ الرَّحِيمُ ﴿٦﴾اللَّهُمَّ إِنِّي أَسْأَلُكَ بِأَنَّ لَكَ الْحَمْدُ، لَا إِلَهَ إِلَّا أَنْتَ الْمَنَّانُ، بَدِيعُ السَّمَوَاتِ وَالْأَرْضِ، يَا ذَا الْجَلَالِ وَالْإِكْرَامِ، يَا حَيُّ يَا قَيُّومُ ﴿٧﴾اللَّهُمَّ بِعِلْمِكَ الْغَيْبَ , وَقُدْرَتِكَ عَلَى الْخَلْقِ , أَحْيِنِي مَا عَلِمْتَ الْحَيَاةَ خَيْرًا لِي , وَتَوَفَّنِي إِذَا عَلِمْتَ الْوَفَاةَ خَيْرًا لِي , اللَّهُمَّ وَأَسْأَلُكَ خَشْيَتَكَ فِي الْغَيْبِ وَالشَّهَادَةِ , وَأَسْأَلُكَ كَلِمَةَ الْحَقِّ فِي الرِّضَا وَالْغَضَبِ , وَأَسْأَلُكَ الْقَصْدَ فِي الْفَقْرِ وَالْغِنَى , وَأَسْأَلُكَ نَعِيمًا لَا يَنْفَدُ , وَأَسْأَلُكَ قُرَّةَ عَيْنٍ لَا تَنْقَطِعُ , وَأَسْأَلُكَ الرِّضَاءَ بَعْدَ الْقَضَاءِ , وَبَرْدَ الْعَيْشِ بَعْدَ الْمَوْتِ , وَأَسْأَلُكَ لَذَّةَ النَّظَرِ إِلَى وَجْهِكَ , وَالشَّوْقَ إِلَى لِقَائِكَ , فِي غَيْرِ ضَرَّاءَ مُضِرَّةٍ , وَلَا فِتْنَةٍ مُضِلَّةٍ , اللَّهُمَّ زَيِّنَّا بِزِينَةِ الْإِيمَانِ , وَاجْعَلْنَا هُدَاةً مُهْتَدِينَ ﴿٨﴾اللَّهُمَّ اغْفِرْ لِي مَا قَدَّمْتُ وَمَا أَخَّرْتُ، وَمَا أَسْرَرْتُ وَمَا أَعْلَنْتُ، وَمَا أَنْتَ أَعْلَمُ بِهِ مِنِّي، أَنْتَ الْمُقَدِّمُ، وَأَنْتَ الْمُؤَخِّرُ، لاَ إِلَهَ إِلاَّ أَنْتَ ﴿٩﴾اللَّهُمَّ إِنِّي أَسْأَلُكَ مِنَ الْخَيْرِ كُلِّهِ عَاجِلِهِ وَآجِلِهِ مَا عَلِمْتُ مِنْهُ وَمَا لَمْ أَعْلَمْ وَأَعُوذُ بِكَ مِنَ الشَّرِّ كُلِّهِ عَاجِلِهِ وَآجِلِهِ مَا عَلِمْتُ مِنْهُ وَمَا لَمْ أَعْلَمُ اللَّهُمَّ إِنِّي أَسْأَلُكَ الْجَنَّةَ وَمَا قَرَّبَ إِلَيْهَا مِنْ قَوْلٍ أَوْ عَمَلٍ وَأَعُوذُ بِكَ مِنَ النَّارِ وَمَا قَرَّبَ إِلَيْهَا مِنْ قَوْلٍ أَوْ عَمَلٍ اللَّهُمَّ إِنِّي أَسْأَلُكَ مِمَّا سَأَلَكَ مِنْهُ مَحَمَّدٌ وَأَعُوذُ بِكَ مِمَّا اسْتَعَاذَ مِنْهُ مُحَمَّدٌ صَلَّى اللهُ عَلَيْهِ وَسَلَّمَ اللَّهُمَّ مَا قَضَيْتَ لِي مِنْ قَضَاءٍ فَاجْعَلْ عَاقِبَتَهُ لِي رُشْدًا',
    latin: '1. Allahumma inni a\'udhu bika min \'adhabi Jahannam, wa min \'adhabil-qabri, wa min fitnatil-mahya wal-mamat, wa min sharri fitnatil-masihid-dajjal. 2. Allahumma inni zalamtu nafsi zulman kathiran, wa la yaghfirudh-dhunuba illa anta, faghfir li maghfiratan min \'indika, warhamni innaka antal-Ghafurur-Rahim. 3. Allahumma hasibni hisaban yasira. 4. Allahumma inni a\'udhu bika min sharri ma \'amiltu, wa min sharri ma lam a\'mal ba\'d. 5. Allahumma inni as\'aluka ya Allahu bi\'annaka Al-Wahid, Al-Ahad, As-Samad, alladhi lam yalid wa lam yulad wa lam yakun lahu kufuwan ahad, an taghfira li dhunubi, innaka Antal-Ghafurur-Rahim. 6. Allahumma inni as\'aluka bi\'anna laka al-hamda, la ilaha illa anta, Al-Mannan, Badi\'us-samawati wal-ard, ya Dhal-Jalali wal-Ikram, ya Hayyu ya Qayyum. 7. Allahumma bi\'ilmikal-ghayba, wa qudratika \'alal-khalq, ahini ma \'alimtal-hayata khayran li, wa tawaffani idha \'alimtal-wafata khayran li. Allahumma wa as\'aluka khashyatika fil-ghaybi wash-shahadah, wa as\'aluka kalimat al-haqqi fir-ridha wal-ghadab, wa as\'aluka al-qasda fil-faqri wal-ghina, wa as\'aluka na\'iman la yanfad, wa as\'aluka qurrata \'aynin la tanqati\', wa as\'aluka ar-ridha ba\'dal-qadha, wa barda al-\'ayshi ba\'dal-mawt, wa as\'aluka ladhdhatan-nadhari ila wajhika, wash-shawqa ila liqa\'ik, fi ghayri dharra\'a mudirrah, wa la fitnatin mudillah. Allahumma zayyinna bi zinatil-iman, waj\'alna hudatan muhtadin. 8. Allahumma ighfir li ma qaddamtu wa ma akhkhartu, wa ma asrartu wa ma a\'lantu, wa ma anta a\'lamu bihi minni, anta al-muqaddimu wa anta al-mu\'akhkhiru, la ilaha illa anta. 9. Allahumma inni as\'aluka minal-khayri kullihi \'ajilihi wa ajilihi, ma \'alimtu minhu wa ma lam a\'lam, wa a\'udhu bika minash-sharri kullihi \'ajilihi wa ajilihi, ma \'alimtu minhu wa ma lam a\'lam. Allahumma inni as\'alukal-jannata wa ma qarraba ilayha min qawlin aw \'amal, wa a\'udhu bika minan-nari wa ma qarraba ilayha min qawlin aw \'amal. Allahumma inni as\'aluka mimma sa\'alaka minhu Muhammadun sallallahu \'alayhi wasallam, wa a\'udhu bika mimma ista\'adha minhu Muhammadun sallallahu \'alayhi wasallam. Allahumma ma qadayta li min qada\'in faj\'al \'aqibatahu li rushda.',
    translation: '“Ya Allah, sesungguhnya aku berlindung kepada-Mu dari siksa kubur, dari azab neraka, dari fitnah kehidupan dan sesudah mati, dan dari fitnah Al-Masih Dajjal”. (1) “Ya Allah, sesungguhnya aku telah banyak berbuat zalim terhadap diriku sendiri. Tidak ada yang akan mengampuni dosa-dosa itu kecuali Engkau. Karena itu (Ya Allah), ampunilah diriku dengan ampunan-Mu dan kasih-sayangilah aku. Sesungguhnya Engkau adalah Maha Pengampun lagi Maha Penyayang”. (1) “Ya Allah, hisablah (lakukan perhitungan) pada diriku dengan perhitungan (hisab) yang mudah”. (2) “Ya Allah sesungguhnya aku mohon perlindungan kepada-Mu dari kejahatan yang pernah aku perbuat dan dari kejahatan yang belum aku perbuat”. (1) “Ya Allah, sesungguhnya aku memohon kepada-Mu ya Allah, Yang Maha Esa lagi tempat bergantungnya seluruh makhluk, Yang tidak beranak, tidak pula diperanakkan, dan tidak ada yang setara dengan-Nya, agar engkau mengampuni dosa-dosaku. Sesungguhnya Engkau Maha Pengampun lagi Maha Penyayang”. (2) “Ya Allah, aku meminta pada-Mu karena segala puji hanya untuk-Mu, tidak ada sesembahan yang berhak disembah kecuali Engkau, Yang Banyak Memberi Karunia, Yang Menciptakan langit dan bumi, Wahai Allah yang Maha Mulia dan Penuh Kemuliaan, Yang Maha Hidup dan Tidak Bergantung pada Makhluk-Nya”. (1) “Ya Allah, dengan ilmu-Mu atas yang gaib dan dengan kemahakuasaan-Mu atas seluruh makhluk, perpanjanglah hidupku, bila Engkau mengetahui bahwa kehidupan selanjutnya lebih baik bagiku. Dan matikan aku dengan segera, bila Engkau mengetahui bahwa kematian lebih baik bagiku. Ya Allah, sesungguhnya aku mohon kepada-Mu agar aku takut kepada-Mu dalam keadaan tersembunyi maupun terang-terangan. Aku mohon kepada-Mu, agar dapat berpegang dengan kalimat yang haq di waktu ridha atau marah. Aku minta kepada-Mu, agar aku bisa sederhana dalam keadaan kaya atau fakir, aku mohon kepada-Mu agar diberi nikmat yang tidak akan habis dan aku minta kepada-Mu agar diberi penyejuk mata yang tak terputus. Aku mohon kepada-Mu, agar aku dapat ridha setelah qadha-Mu. Aku mohon kepada-Mu, kehidupan yang menyenangkan setelah aku meninggal dunia. Aku mohon kepada-Mu kenikmatan memandang wajah-Mu, rindu bertemu dengan-Mu tanpa penderitaan yang membahayakan dan fitnah yang menyesatkan. Ya Allah, hiasilah kami dengan keimanan dan jadikanlah kami sebagai penunjuk jalan yang memperoleh bimbingan dari-Mu”. (2) “Yaa Allâh, ampunilah dosaku yang telah aku lakukan dan yang telah aku tinggalkan, yang aku rahasiakan dan yang aku lakukan dengan terang-terangan, serta segala dosa yang Engkau lebih mengetahuinya daripada aku. Engkau adalah al Muqaddim (Dzat Yang memajukan orang yang Engkau kehendaki) dan Engkau adalah al Muakhkhir (Yang memundurkan orang yang Engkau kehendaki). Tidak ada yang berhak disembah kecuali Engkau”. (1) “Ya Allah, sesungguhnya aku meminta kepada-Mu segala kebaikan, baik yang segera atau akan datang, yang aku ketahui atau yang tidak aku ketahui. Dan aku berlindung kepada-Mu dari segala kejelekan, baik yang segera atau akan datang, yang aku ketahui atau yang tidak aku ketahui. Aku meminta surga kepada-Mu serta segala perkara yang mendekatkan kepadanya, baik dari ucapan atau perbuatan. Dan aku berlidung kepada-Mu dari neraka serta segala perkara yang mendekatkan kepadanya, baik dari ucapan atau perbuatan. Aku meminta kepada-Mu sebagaimana apa yang diminta oleh Muhammad. Dan aku berlindung kepada-Mu dari apa yang berlindung darinya Muhammad sallallahu \'alaihi wa sallam. Ya Allah apa yang Engkau putuskan kepadaku dari suatu perkara, maka jadikanlah akhirnya baik”. (1)',
  },
  {
    title: 'Shalawat Kepada Nabi',
    arabic: '﴿١﴾اللهُمَّ صَلِّ عَلَى مُحَمَّدٍ وَعَلَى آلِ مُحَمَّدٍ، كَمَا صَلَّيْتَ عَلَى إِبْرَاهِيمَ، وَعَلَى آلِ إِبْرَاهِيمَ إِنَّكَ حَمِيدٌ مَجِيدٌ، وَبَارِكْ عَلَى مُحَمَّدٍ، وَعَلَى آلِ مُحَمَّدٍ كَمَا بَارَكْتَ عَلَى إِبْرَاهِيمَ وَعَلَى آلِ إِبْرَاهِيمَ إِنَّكَ حَمِيدٌ مَجِيدٌ ﴿٢﴾اللهُمَّ صَلِّ عَلَى مُحَمَّدٍ وَعَلَى أَهْلِ بَيْتِهِ، وَعَلَى أَزْوَاجِهِ وَذُرِّيَّتِهِ، كَمَا صَلَّيْتَ عَلَى آلِ إِبْرَاهِيمَ إِنَّكَ حَمِيدٌ، وَبَارِكْ عَلَى مُحَمَّدٍ وَعَلَى أَهْلِ بَيْتِهِ، وَعَلَى أَزْوَاجِهِ وَذُرِّيَّتِهِ، كَمَا بَارَكْتَ عَلَى آلِ إِبْرَاهِيمَ إِنَّكَ حَمِيدٌ مَجِيدٌ ﴿٣﴾اللَّهُمَّ صَلِّ عَلَى مُحَمَّدٍ عَبْدِكَ وَرَسُولِكَ، كَمَا صَلَّيْتَ عَلَى آلِ إِبْرَاهِيمَ، وَبَارِكْ عَلَى مُحَمَّدٍ، وَعَلَى آلِ مُحَمَّدٍ، كَمَا بَارَكْتَ عَلَى إِبْرَاهِيمَ ﴿٤﴾اللَّهُمَّ صَلِّ عَلَى مُحَمَّدٍ، وَعَلَى أَزْوَاجِهِ وَذُرِّيَّتِهِ، كَمَا صَلَّيْتَ عَلَى إِبْرَاهِيمَ، وَبَارِكْ عَلَى مُحَمَّدٍ، وَعَلَى أَزْوَاجِهِ وَذُرِّيَّتِهِ، كَمَا بَارَكْتَ عَلَى إِبْرَاهِيمَ، إِنَّكَ حَمِيدٌ مَجِيدٌ ﴿٥﴾اللَّهُمَّ صَلِّ عَلَى مُحَمَّدٍ النَّبِيِّ الْأُمِّيِّ وَعَلَى آلِ مُحَمَّدٍ، كَمَا صَلَّيْتَ عَلَى إِبْرَاهِيمَ وَآلِ إِبْرَاهِيمَ، وَبَارِكْ عَلَى مُحَمَّدٍ النَّبِيِّ الْأُمِّيِّ، كَمَا بَارَكْتَ عَلَى إِبْرَاهِيمَ وَعَلَى آلِ إِبْرَاهِيمَ، إِنَّكَ حَمِيدٌ مَجِيدٌ ﴿٦﴾اللهُمَّ صَلِّ عَلَى مُحَمَّدٍ وَعَلَى آلِ مُحَمَّدٍ، وَبَارِكْ عَلَى مُحَمَّدٍ، وَعَلَى آلِ مُحَمَّدٍ، كَمَا بَارَكْتَ عَلَى إِبْرَاهِيمَ فِي الْعَالَمِينَ، إِنَّكَ حَمِيدٌ مَجِيدٌ',
    latin: '1. “Allahumma sholli ‘ala Muhammad wa ‘ala aali Muhammad kamaa shollaita ‘ala Ibroohim wa ‘ala aali Ibrohim, innaka hamidun majiid. Allahumma baarik ‘ala Muhammad wa ‘ala aali Muhammad kamaa baarokta ‘ala Ibrohim wa ‘ala aali Ibrohimm innaka hamidun majiid" 2. Allahumma shalli ‘ala muhammad wa ‘ala ahli baitihii, wa ‘ala azwaajihii wa dzurriyatihii, kamaa shallaita ‘ala aali ibrahim innaka hamiidum majiid. Wa baarik ‘ala muhammad wa ‘ala ahli baitihii, wa ‘ala azwaajihii wa dzurriyatihii, kamaa baarakta ‘ala aali ibrahim innaka hamiidum majiid. 3.Allaahumma sholli ‘alaa Muhammadin ‘abdika wa rosuulika kamaa shollaita ‘alaa aali ibroohiim, wa baarik ‘alaa Muhammad wa ‘alaa aali Muhammad kamaa baarokta ‘alaa ibroohiim. 4. Allaahumma sholli ‘alaa Muhammadin wa ‘alaa azwaajihi wa dzurriyyatihi kamaa shol laita ‘alaa ibroohiim, wa baarik ‘alaa Muhammadin wa ‘alaa azwaajihi wa dzurriyyatihi kamaa baarokta ‘ala ibroohiim innaka hamiidum majiid. 5.Allahumma shalli ‘ala muhammad an-nabiyyil ummiyi wa ‘ala aali muhammad, kamaa shallaita ‘ala aali ibrahim. Wa baarik ‘ala muhammad an-nabiyyil ummiyi wa ‘ala aali muhammad, kamaa baarakta ‘ala aali ibrahim, fil ‘aalamiina innaka hamiidum majiid. 6. “Allahumma sholli ‘ala Muhammad wa ‘ala aali, wa baarik ‘ala Muhammad wa ‘ala aali, kamaa baarokta ‘ala Ibrohim wa ‘ala aali Ibrohimm fil ‘aalamiina innaka hamidun majiid"',
    translation: 'artinya: Ya Allah, semoga shalawat tercurah kepada Muhammad dan keluarga Muhammad sebagaimana tercurah pada Ibrahim dan keluarga Ibrahim, sesungguhnya Engkau Maha Terpuji lagi Maha Mulia. Ya Allah, semoga berkah tercurah kepada Muhammad dan keluarga Muhammad sebagaimana tercurah pada Ibrahim dan keluarga Ibrahim, sesungguhnya Engkau Maha Terpuji lagi Maha Mulia. (2) artinya: Ya Allah, semoga shalawat tercurah kepada Muhammad dan keluarganya, istri-istrinys, serta keturunannya, sebagaimana tercurah pada Ibrahim, sesungguhnya Engkau Maha Terpuji lagi Maha Mulia. Ya Allah, semoga berkah tercurah kepada Muhammad dan keluarganya, istri-istrinya, serta keturunannya, sebagaimana tercurah pada Ibrahim, sesungguhnya Engkau Maha Terpuji lagi Maha Mulia. (1) artinya: Ya Allah berilah shalawat kepada Muhammad hambaMu dan RasulMu, sebagaimana Engkau telah bershalawat kepada Ibrahim. Dan berkahilah Muhammad dan keluarga Muhammad, sebagaimana Engkau telah memberkahi Ibrahim. (2) artinya: Ya Allah azza wa jalla, berilah shalawat kepada Muhammad dan kepada isteri-isteri beliau dan keturunannya, sebagaimana Engkau telah bershalawat kepada Ibrahim. Ya Allah, Berkahilah Muhammad dan isteri-isteri dan keturunannya, sebagaimana Engkau telah memberkahi. (3) artinya: Ya Allah berilah shalawat kepada Muhammad yang ummi (tidak membaca dan tidak menulis) dan kepada keluarga Muhammad, sebagaimana Engkau telah memberi bershalawat kepada Ibrahim dan keluarga Ibrahim.Dan berkahilah Muhammad Nabi yang ummi (tidak membaca dan tidak menulis) dan keluarga Muhammad sebagaimana Engkau telah memberkahi keluarga Ibrahim dan keluarga Ibrahim, Sesungguhnya Engkau Maha Terpuji (lagi) Maha Mulia” (1) artinya: Ya Allah, semoga shalawat tercurah kepada Muhammad dan keluarga Muhammad, dan semoga berkah tercurah kepada Muhammad dan keluarga Muhammad sebagaimana tercurah pada Ibrahim dan keluarga Ibrahim di alam semesta, sesungguhnya Engkau Maha Terpuji lagi Maha Mulia. (2)(3)',
  },
  {
    title: 'Salam',
    arabic: '﴿١﴾السَّلَامُ عَلَيْكُمْ ﴿٢﴾السَّلَامُ عَلَيْكُمْ وَرَحْمَةُ اللَّهِ ﴿٣﴾السَّلَامُ عَلَيْكُمْ وَرَحْمَةُ اللَّهِ ﴿٤﴾السَّلَامُ عَلَيْكُمْ وَرَحْمَةُ اللهِ وَبَرَكَاتُهُ ﴿٥﴾السَّلَامُ عَلَيْكُمْ وَرَحْمَةُ اللهِ وَبَرَكَاتُه',
    latin: '1. As-salamu \'alaykum. 2. As-salamu \'alaykum wa rahmatullah. 3. As-salamu \'alaykum wa rahmatullah. 4. As-salamu \'alaykum wa rahmatullahi wa barakatuh. 5. As-salamu \'alaykum wa rahmatullahi wa barakatuh.',
    translation: '“Semoga keselamatan tercurahkan atas kalian”. Dibaca sekali ketika menoleh ke kanan. (1) “Semoga keselamatan serta rahmat Allah tercurahkan atas kalian.” Dibaca ketika menoleh ke kanan dan ke kiri. (2)',
  },
  {
    title: 'Doa Doa Qunut',
    arabic: '﴿١﴾«اللهُمَّ اهْدِنَا فِيمَنْ هَدَيْتَ، وَعَافِنَا فِيمَنَ عَافَيْتَ، وتَوَلَّنَا فِيمَنْ تَوَلَّيْتَ، وَبَارِكْ لَنَا فِيمَا أَعْطَيْتَ، وَقِنَا شَرَّ مَا قَضَيْتَ؛ إِنَّكَ تَقْضِي وَلَا يُقْضَى عَلَيْكَ، وَإِنَّهُ لَا يَذِلُّ مَنْ وَالَيْتَ، تَبَارَكْتَ وَتَعَالَيْتَ» ﴿٢﴾«اللَّهُمَّ إِنِّي أَعُوذُ بِرِضَاكَ مِنْ سَخَطِكَ، وَأَعُوذُ بِمُعَافَاتِكَ مِنْ عُقُوبَتِكَ، وَأَعُوذُ بِكَ مِنْكَ، لَا أُحْصِي ثَنَاءً عَلَيْكَ، أَنْتَ كَمَا أَثْنَيْتَ عَلَى نَفْسِكَ» ﴿٣﴾«اللَّهُمَّ إِنَّا نَسْتَعِينُكَ وَنَسْتَغْفِرُكَ وَنُؤْمِنُ بِكَ وَنَخْضَعُ لَكَ، وَنَخْلَعُ وَنَتْرُكُ مَنْ يَكْفُرُكَ، اللَّهُمَّ إِيَّاكَ نَعْبُدُ وَلَكَ نُصَلِّي وَنَسْجُدُ، وَإِلَيْكَ نَسْعَى وَنَحْفِدُ نَرْجُو رَحْمَتَكَ وَنُخَافُ عَذَابَكَ الْجَدَّ، إِنَّ عَذَابَكَ بِالْكُفَّارِ مُلْحِقٌ»',
    latin: '“Allahummahdinaa fiiman hadait, wa’aafinaa fiiman ‘aafait, watawallanaa fiiman tawallait, wabaarik lanaa fiimaa a’thait, waqinaa syarra maa qadhait, innaka taqdhii walaa yuqdhoo ‘alaik, wa innahuu laa yadzillu man waalait, tabaarakta wa ta’aalait. 2."Allahumma innii a’uudzu bi ridhooka min sakhotik, wa a’uudzu bi mu’aafaatika min ‘uquubatik, wa a’uudzu bika minka, laa uhshii tsanaa an ‘alaika, anta kamaa atsnaita ‘alaa nafsika” 3.Allahumma inna nasta\'inuka wa nastaghfiruka wa nu’minu bika wa nakhda\'u laka, wa nakhla\'u wa natruku man yakfuruk, Allahumma iyyaka na’budu wa laka nusalli wa nasjud, wa ilayka nas\'a wa nahfid, narju rahmataka wa nakhafu \'adhabakal-jadd, inna \'adhabaka bil-kuffari mulhiq.',
    translation: 'Artinya : Ya Allah, berilah kami petunjuk di antara orang-orang yang Engkau beri petunjuk, dan berilah kami keselamatan di antara orang-orang yang telah Engkau beri keselamatan, uruslah diri kami di antara orang-orang yang telah Engkau urus, berkahilah untuk kami apa yang telah Engkau berikan kepada kami, lindungilah kami dari keburukan apa yang telah Engkau tetapkan, sesungguhnya Engkau Yang memutuskan dan tidak ada yang dapat merubah keputusan-Mu, sesungguhnya tidak akan hina orang yang telah Engkau jaga dan Engkau tolong. Maha Suci Engkau wahai Rabb kami dan Maha Tinggi”(1) “Ya Allah sesungguhnya aku berlindung dengan keridlaan-Mu dari kemurkaan-Mu, dan aku berlindung dengan maaf-Mu dari siksaan-Mu, dan aku berlindung kepada-Mu dari-Mu, aku tidak bisa menghitung pujian kepada-Mu, Engkau sebagaimana Engkau memuji pada diri-Mu." (1) “Ya Allah, sesungguhnya kami meminta pertolongan dan memohon ampunan kepada-Mu, dan kami beriman kepada-Mu dan tunduk kepada-Mu, dan kami berlepas diri dan meninggalkan orang yang mengkufuri-Mu. Ya Allah, hanya kepada-Mu kami beribadah, kepada-Mu semata kami melaksanakan shalat dan sujud, untuk-Mu semata kami bersegera dan beramal, kami mengharapkan kasih sayang-Mu dan takut kepada adzab-Mu yang keras, sesungguhnya adzab-Mu pasti menimpa orang-orang kafir.”(1)',
  },
  {
    title: 'Sujud Sahwi',
    translation: 'Tidak ada dzikir khusus yang shahih untuk sujud sahwi, maka ketika sujud sahwi cukup membaca dzikir yang dibaca ketika sujud seperti biasa',
  },
  {
    title: 'Sujud Tilawah',
    arabic: '﴿١﴾سَجَدَ وَجْهِي لِلَّذِي خَلَقَهُ وَصَوَّرَهُ، وَشَقَّ سَمْعَهُ وَبَصَرَهُ، بِحَوْلِهِ وَقُوَّتِهِ ﴿٢﴾اللَّهُمَّ اكْتُبْ لِي بِهَا عِنْدَكَ أَجْرًا، وَاجْعَلْهَا لِي عِنْدَكَ ذُخْرًا، وَضَعْ عَنِّي بِهَا وِزْرًا، وَاقْبَلْهَا مِنِّي، كَمَا قَبِلْتَهَا مِنْ عَبْدِكِ دَاوُدَ',
    latin: '1.Sajada wajhi lilladzi kholaqohu wa showwarohu wa syaqqo sam áhu wa bashorohu bihaulihi wa quwwatihi. 2.Allahummak tub li bihaa índaka ajron, waj álhaa lii índaka dzukhron, wa dho’ ánnii bihaa wizron, waqbalhaa minnii kamaa qobiltahaa min ábdika Dawuda',
    translation: '"Wajahku bersujud kepada (Allah) yang telah menciptakannya, membentuknya, dan memberikan pendengaran serta penglihatannya dengan kekuasaan dan kekuatan-Nya."(1) 2. "Ya Allah, tuliskanlah untukku dengan sujud ini pahala di sisi-Mu, jadikanlah ia sebagai simpanan bagiku di sisi-Mu, hapuslah dengannya dosa-dosaku, dan terimalah sujud ini dariku sebagaimana Engkau menerimanya dari hamba-Mu, Dawud (Nabi Dawud ‘alaihis-salam)."(1)',
  },
  {
    title: 'Doa Istikhoroh',
    arabic: 'اللَّهُمَّ إِنِّي أَسْتَخِيرُكَ بِعِلْمِكَ وَأَسْتَقْدِرُكَ بِقُدْرَتِكَ، وَأَسْأَلُكَ مِنْ فَضْلِكَ فَإِنَّكَ تَقْدِرُ وَلاَ أَقْدِرُ، وَتَعْلَمُ وَلاَ أَعْلَمُ، وَأَنْتَ عَلَّامُ الغُيُوبِ، اللَّهُمَّ فَإِنْ كُنْتَ تَعْلَمُ هَذَا الأَمْرَ',
    latin: '“Allahumma inni astakhiruka bi ‘ilmika, wa astaqdiruka bi qudratika, wa as-aluka min fadhlika, fa innaka taqdiru wa laa aqdiru, wa ta’lamu wa laa a’lamu, wa anta ‘allaamul ghuyub. Allahumma fa-in kunta ta’lamu hadzal amro',
    translation: 'Artinya : Ya Allah, sesungguhnya aku beristikharah pada-Mu dengan ilmu-Mu, aku memohon kepada-Mu kekuatan dengan kekuatan-Mu, aku meminta kepada-Mu dari karunia-Mu. Sesungguhnya Engkau yang mampu dan aku tidaklah mampu melakukannya. Engkau yang Maha Tahu, sedangkan aku tidak tahu. Engkaulah yang mengetahui perkara yang gaib. Ya Allah, jika Engkau mengetahui bahwa perkara ini',
  },
];

// Bacaan Ruqyah — transcribed programmatically from bekalislam.online/dzikir-doa's
// own per-item HTML fragments (dzikirdoa_new/bacaan-ruqyah/*.html), same method as
// dzikirPagi/dzikirPetang above, to avoid transcription errors. A handful of items on
// the source site have no distinct Arabic phrase of their own (a narrative note about
// what the Prophet did, or "no specific dzikir exists for this") — those are kept with
// an empty `arabic` and their note folded into `translation` instead of guessing at a
// verbatim recitation that doesn't exist. Still needs a human check against a mu'tabar
// reference before treating as final, same caution as the rest of this file.
export const bacaanRuqyah = [
  {
    title: 'Ruqyah 1',
    arabic: 'بِسْمِ اللّٰهِ الرَّحْمٰنِ الرَّحِيْمِ اَلْحَمْدُ لِلّٰهِ رَبِّ الْعٰلَمِيْنَۙ الرَّحْمٰنِ الرَّحِيْمِۙ مٰلِكِ يَوْمِ الدِّيْنِۗ اِيَّاكَ نَعْبُدُ وَاِيَّاكَ نَسْتَعِيْنُۗ اِهْدِنَا الصِّرَاطَ الْمُسْتَقِيْمَ ۙ صِرَاطَ الَّذِيْنَ اَنْعَمْتَ عَلَيْهِمْ ەۙ غَيْرِ الْمَغْضُوْبِ عَلَيْهِمْ وَلَا الضَّاۤلِّيْنَ',
    latin: 'bismillāhir-raḥmānir-raḥīm al-ḥamdu lillāhi rabbil-\'ālamīn ar-raḥmānir-raḥīm māliki yaumid-dīn iyyāka na\'budu wa iyyāka nasta\'īn ihdinaṣ-ṣirāṭal-mustaqīm ṣirāṭallażīna an\'amta \'alaihim gairil-magḍụbi \'alaihim wa laḍ-ḍāllīn',
    translation: '“Dengan nama Allah Yang Maha Pengasih, Maha Penyayang. Segala puji bagi Allah, Tuhan seluruh alam, Yang Maha Pengasih, Maha Penyayang, Pemilik hari pembalasan. Hanya kepada Engkaulah kami menyembah dan hanya kepada Engkaulah kami mohon pertolongan. Tunjukilah kami jalan yang lurus, (yaitu) jalan orang-orang yang telah Engkau beri nikmat kepadanya; bukan (jalan) mereka yang dimurkai, dan bukan (pula jalan) mereka yang sesat.” QS. Al-Fatihah: 1-7',
  },
  {
    title: 'Ruqyah 2',
    arabic: 'اللَّهُ لَآ إِلَـٰهَ إِلَّا هُوَ الْحَىُّ الْقَيُّومُ ۚ لَا تَأْخُذُهُۥ سِنَةٌ وَلَا نَوْمٌ ۚ لَّهُۥ مَا فِى السَّمَاوَاتِ وَمَا فِى الْأَرْضِ ۗ مَن ذَا الَّذِى يَشْفَعُ عِندَهُۥٓ إِلَّا بِإِذْنِهِۦ ۚ يَعْلَمُ مَا بَيْنَ أَيْدِيهِمْ وَمَا خَلْفَهُمْ ۖ وَلَا يُحِيطُونَ بِشَىْءٍ مِّنْ عِلْمِهِۦٓ إِلَّا بِمَا شَآءَ ۚ وَسِعَ كُرْسِيُّهُ السَّمَاوَاتِ وَالْأَرْضَ ۖ وَلَا يَئُودُهُۥ حِفْظُهُمَا ۚ وَهُوَ الْعَلِىُّ الْعَظِيمُ ﴿٢٥٥﴾',
    latin: 'allāhu lā ilāha illā huw, al-ḥayyul-qayyụm, lā ta`khużuhụ sinatuw wa lā na`ụm, lahụ mā fis-samāwāti wa mā fil-arḍ, man żallażī yasyfa\'u \'indahū illā bi`iżnih, ya\'lamu mā baina aidīhim wa mā khalfahum, wa lā yuḥīṭụna bisyai`im min \'ilmihī illā bimā syā`, wasi\'a kursiyyuhus-samāwāti wal-arḍ, wa lā ya`ụduhụ ḥifẓuhumā, wa huwal-\'aliyyul-\'aẓīm',
    translation: '“Allah, tidak ada Tuhan (yang berhak disembah) melainkan Dia Yang Hidup kekal lagi terus menerus mengurus (makhluk-Nya); tidak mengantuk dan tidak tidur. Kepunyaan-Nya apa yang di langit dan di bumi. Tiada yang dapat memberi syafa\'at di sisi Allah tanpa izin-Nya? Allah mengetahui apa-apa yang di hadapan mereka dan di belakang mereka, dan mereka tidak mengetahui apa-apa dari ilmu Allah melainkan apa yang dikehendaki-Nya. Kursi Allah meliputi langit dan bumi. Dan Allah tidak merasa berat memelihara keduanya, dan Allah Maha Tinggi lagi Maha Besar.” QS. Al-Baqarah: 255.(24)',
  },
  {
    title: 'Bacaan Ruqyah 3',
    arabic: 'قُلْ هُوَ اللَّهُ أَحَدٌ ﴿١﴾ اللَّهُ الصَّمَدُ ﴿٢﴾ لَمْ يَلِدْ وَلَمْ يُولَدْ ﴿٣﴾ وَلَمْ يَكُن لَّهُۥ كُفُوًا أَحَدٌۢ ﴿٤﴾ بِسْمِ اللَّهِ الرَّحْمَـٰنِ الرَّحِيمِ قُلْ أَعُوذُ بِرَبِّ الْفَلَقِ ﴿١﴾ مِن شَرِّ مَا خَلَقَ ﴿٢﴾ وَمِن شَرِّ غَاسِقٍ إِذَا وَقَبَ ﴿٣﴾ وَمِن شَرِّ النَّفَّاثَاتِ فِى الْعُقَدِ ﴿٤﴾ وَمِن شَرِّ حَاسِدٍ إِذَا حَسَدَ ﴿٥﴾ بِسْمِ اللَّهِ الرَّحْمَـٰنِ الرَّحِيمِ قُلْ أَعُوذُ بِرَبِّ النَّاسِ ﴿١﴾ مَلِكِ النَّاسِ ﴿٢﴾ إِلَـٰهِ النَّاسِ ﴿٣﴾ مِن شَرِّ الْوَسْوَاسِ الْخَنَّاسِ ﴿٤﴾ الَّذِى يُوَسْوِسُ فِى صُدُورِ النَّاسِ ﴿٥﴾ مِنَ الْجِنَّةِ وَالنَّاسِ ﴿٦',
    latin: 'Bismillāhir-raḥmānir-raḥīm 1. Qul huwallāhu aḥad 2. Allāhuṣ-ṣamad 3. Lam yalid wa lam yūlad 4. Wa lam yakul lahū kufuwan aḥad Bismillāhir-raḥmānir-raḥīm 1. Qul a‘ụżu birabbil-falaq 2. Min syarri mā khalaq 3. Wa min syarri gāsiqin iżā waqab 4. Wa min syarri an-naffāṡāti fil-‘uqad 5. Wa min syarri ḥāsidin iżā ḥasad Bismillāhir-raḥmānir-raḥīm 1. Qul a‘ụżu birabbin-nās 2. Malikin-nās 3. Ilāhin-nās 4. Min syarril-waswāsil-khannās 5. Allażī yuwaswisu fī ṣudụrin-nās 6. Minal-jinnati wan-nās',
    translation: '“Katakanlah: Dialah Allah Yang Maha Esa. Allah adalah Ilah yang bergantung kepada-Nya segala urusan. Dia tidak beranak dan tiada pula diperanakkan. Dan tidak ada seorang pun yang setara dengan Dia.” (QS. Al-Ikhlas: 1-4) “Katakanlah: Aku berlindung kepada Rabb yang menguasai Subuh. Dari kejahatan makhluk-Nya. Dan dari kejahatan malam apabila telah gelap gulita. Dan dari kejahatan wanita-wanita tukang sihir yang menghembus pada buhul-buhul. Dan dari kejahatan orang yang dengki apabila ia dengki. (QS. Al-Falaq: 1-5) “Katakanlah: Aku berlindung kepada Rabb manusia. Raja manusia. Sembahan manusia. Dari kejahatan (bisikan) syaitan yang biasa bersembunyi. Yang membisikkan (kejahatan) ke dalam dada manusia. Dari jin dan manusia.” (QS: An-Nas : 1-6)',
  },
  {
    title: 'Bacaan Ruqyah 4',
    translation: 'Membaca surah Al-Baqarah (26)',
  },
  {
    title: 'Bacaan Ruqyah 5',
    arabic: 'وَأَوْحَيْنَا إِلَى مُوسَى أَنْ أَلْقِ عَصَاكَ فَإِذَا هِيَ تَلْقَفُ مَا يَأْفِكُونَ * فَوَقَعَ الْحَقُّ وَبَطَلَ مَا كَانُوا يَعْمَلُونَ * فَغُلِبُوا هُنَالِكَ وَانْقَلَبُوا صَاغِرِينَ وَقَالَ فِرْعَوْنُ ائْتُونِي بِكُلِّ سَاحِرٍ عَلِيمٍ * فَلَمَّا جَاءَ السَّحَرَةُ قَالَ لَهُمْ مُوسَى أَلْقُوا مَا أَنْتُمْ مُلْقُونَ * فَلَمَّا أَلْقَوْا قَالَ مُوسَى مَا جِئْتُمْ بِهِ السِّحْرُ إِنَّ اللَّهَ سَيُبْطِلُهُ إِنَّ اللَّهَ لا يُصْلِحُ عَمَلَ الْمُفْسِدِينَ * وَيُحِقُّ اللَّهُ الْحَقَّ بِكَلِمَاتِهِ وَلَوْ كَرِهَ الْمُجْرِمُونَ قَالُوا يَا مُوسَىٰ إِمَّا أَنْ تُلْقِيَ وَإِمَّا أَنْ نَكُونَ أَوَّلَ مَنْ أَلْقَىٰ قَالَ بَلْ أَلْقُوا ۖ فَإِذَا حِبَالُهُمْ وَعِصِيُّهُمْ يُخَيَّلُ إِلَيْهِ مِنْ سِحْرِهِمْ أَنَّهَا تَسْعَىٰ فَأَوْجَسَ فِي نَفْسِهِ خِيفَةً مُوسَىٰ قُلْنَا لَا تَخَفْ إِنَّكَ أَنْتَ الْأَعْلَىٰ وَأَلْقِ مَا فِي يَمِينِكَ تَلْقَفْ مَا صَنَعُوا ۖ إِنَّمَا صَنَعُوا كَيْدُ سَاحِرٍ ۖ وَلَا يُفْلِحُ السَّاحِرُ حَيْثُ أَتَىٰ',
    latin: 'Wa auḥainā ilā mụsā an alqi ‘aṣāk, fa iżā hiya talqafu mā ya`fikụn Fa waqa‘al-ḥaqqu wa baṭala mā kānụ ya‘malụn Fa ghulibụ hunālika wanqalabụ ṣāghirīn Wa qāla fir‘awnu`ktụnī bikulli sāḥiriny ‘alīm Falammā jā`aṣ-saḥaratu qāla lahum mụsā alqụ mā antum mulqụn Falammā alqau qāla mụsā mā ji`tum bihis-siḥru, innallāha sayubṭiluh, innallāha lā yuṣliḥu ‘amalal-mufsidīn Wa yuḥiqqullāhul-ḥaqqa bikalimātihī wa law karihal-mujrimụn Qālụ yā mụsā immā an tulqiya wa immā an nakụna awwala man alqā Qāla bal alqụ, fa iżā ḥibāluhum wa ‘iṣiyyuhum yukhayyalu ilaihi min siḥrihim annahā tas‘ā Fa aujasa fī nafsihī khīfata mụsā Qulnā lā takhaf innaka antal-a‘lā Wa alqi mā fī yamīnika talqaf mā ṣana‘ụ, innamā ṣana‘ụ kaidu sāḥir, wa lā yuf’liḥus-sāḥiru ḥaiṡu atā',
    translation: '“Dan Kami wahyukan kepada Musa: "Lemparkanlah tongkatmu!". Maka sekonyong-konyong tongkat itu menelan apa yang mereka sulapkan. Karena itu nyatalah yang benar dan batallah yang selalu mereka kerjakan. Maka mereka kalah di tempat itu dan jadilah mereka orang-orang yang hina.” (Al-A’raf 117-119) “Fir\'aun berkata (kepada pemuka kaumnya): "Datangkanlah kepadaku semua ahli-ahli sihir yang pandai!" Maka tatkala ahli-ahli sihir itu datang, Musa berkata kepada mereka: "Lemparkanlah apa yang hendak kamu lemparkan". Maka setelah mereka lemparkan, Musa berkata: "Apa yang kamu lakukan itu, itulah yang sihir, sesungguhnya Allah akan menampakkan ketidak benarannya" Sesungguhnya Allah tidak akan membiarkan terus berlangsungnya pekerjaan orang-yang membuat kerusakan. Dan Allah akan mengokohkan yang benar dengan ketetapan-Nya, walaupun orang-orang yang berbuat dosa tidak menyukai(nya).” (Yunus 79-82) (Setelah mereka berkumpul) mereka berkata: "Hai Musa (pilihlah), apakah kamu yang melemparkan (dahulu) atau kamikah orang yang mula-mula melemparkan?" Berkata Musa: "Silahkan kamu sekalian melemparkan". Maka tiba-tiba tali-tali dan tongkat-tongkat mereka, terbayang kepada Musa seakan-akan ia merayap cepat, lantaran sihir mereka. Maka Musa merasa takut dalam hatinya. Kami berkata: "janganlah kamu takut, sesungguhnya kamulah yang paling unggul (menang). Dan lemparkanlah apa yang ada ditangan kananmu, niscaya ia akan menelan apa yang mereka perbuat. "Sesungguhnya apa yang mereka perbuat itu adalah tipu daya tukang sihir (belaka). Dan tidak akan menang tukang sihir itu, dari mana saja ia datang". (Thaha 65-69)(27)',
  },
  {
    title: 'Bacaan Ruqyah 6',
    arabic: 'بِاسْمِ اللهِ أَرْقِيكَ، مِنْ كُلِّ شَيْءٍ يُؤْذِيكَ، مِنْ شَرِّ كُلِّ نَفْسٍ أَوْ عَيْنِ حَاسِدٍ، اللهُ يَشْفِيكَ بِاسْمِ اللهِ أَرْقِيكَ',
    latin: 'Bismillaahi arqiika, min kulli syai-in yu\'dziika, min syarri kulli nafsin au \'ainin haasidin, allaahu yasyfiika, bismillaahi arqiika.',
    translation: '“Dengan nama Allah aku meruqyah-mu, dari semua yang menyakitimu, dari kejahatan setiap jiwa dan mata hasad, semoga Allah menyembuhkanmu, Dengan nama Allah aku meruqyah-mu.” (28)',
  },
  {
    title: 'Bacaan Ruqyah 7',
    arabic: 'اللَّهُمَّ رَبَّ النَّاسِ أَذْهِبِ البَاسَ، اشْفِهِ وَأَنْتَ الشَّافِي، لاَ شِفَاءَ إِلَّا شِفَاؤُكَ، شِفَاءً لاَ يُغَادِرُ سَقَمًا',
    latin: 'Allaahumma robban-naas, adz-hibil ba’s(29) isyfihii wa antasy-syaafii(30) laa syifaa-a illaa syifaa-uka, syifaa-an laa yughoodiru saqoman.',
    translation: '“Ya Allah, Tuhan seluruh manusia, hilangkanlah sakit ini, sembuhkanlah dia dan Engkaulah As-Syafi (Sang Penyembuh), tidak ada kesembuhan kecuali kesembuhan dari-Mu, kesembuhan yang tidak meninggalkan penyakit.”(31)',
  },
  {
    title: 'Bacaan Ruqyah 8',
    arabic: 'أَعُوذُ بِكَلِمَاتِ اللَّهِ التَّامَّةِ، مِنْ كُلِّ شَيْطَانٍ وَهَامَّةٍ، وَمِنْ كُلِّ عَيْنٍ لاَمَّةٍ',
    latin: 'A’uudzu bikalimaatillaahit taammati min kulli syaithoonin wa haammatin wa min kulli ‘ainin laammatin',
    translation: '“aku berlindung dengan kalimat-kalimat Allah yang sempurna(34) dari semua gangguan setan, binatang yang mengganggu(35)dan pandangan mata yang jahat(36)."(37)',
  },
  {
    title: 'Bacaan Ruqyah 9',
    arabic: 'بِسْمِ اللَّهِ، تُرْبَةُ أَرْضِنَا، بِرِيقَةِ بَعْضِنَا، يُشْفَى سَقِيمُنَا، بِإِذْنِ رَبِّنَا',
    latin: 'Bismillaah, turbatu ardhinaa, biriiqoti ba\'dhinaa, yusyfaa bihi saqiimunaa, bi-idzni robbinaa.',
    translation: '“Dengan nama Allah, debu tanah kami(38) dengan sedikit ludah kami, bisa menjadi sebab sembuhnya sakit kami, dengan izin Rabb kami.”(39)',
  },
];

// Doa Karena Sebab — transcribed programmatically from bekalislam.online/dzikir-doa's
// own per-item HTML fragments (dzikirdoa_new/doa-karena-sebab/*.html), same method as
// dzikirPagi/dzikirPetang above, to avoid transcription errors. A handful of items on
// the source site have no distinct Arabic phrase of their own (a narrative note about
// what the Prophet did, or "no specific dzikir exists for this") — those are kept with
// an empty `arabic` and their note folded into `translation` instead of guessing at a
// verbatim recitation that doesn't exist. Still needs a human check against a mu'tabar
// reference before treating as final, same caution as the rest of this file.
export const doaKarenaSebab = [
  {
    title: 'Doa Ketika Sedih Atau Galau',
    arabic: 'اَللَّهُمَّ إِنِّيْ عَبْدُكَ، وَابْنُ عَبْدِكَ، وَابْنُ أَمَتِكَ(أَمَتُكَ وَابْنَةُ عَبْدِكَ وَابْنَةُ أَمَتِكَ) ، نَاصِيَتِيْ بِيَدِكَ، مَاضٍ فِيَّ حُكْمُكَ، عَدْلٌ فِيَّ قَضَاؤُكَ، أَسْأَلُكَ بِكُلِّ اسْمٍ هُوَ لَكَ، سَمَّيْتَ بِهِ نَفْسَكَ، أَوْ أَنْزَلْتَهُ فِيْ كِتَابِكَ، أَوْ عَلَّمْتَهُ أَحَدًا مِنْ خَلْقِكَ، أَوِ اسْتَأْثَرْتَ بِهِ فِيْ عِلْمِ الْغَيْبِ عِنْدَكَ، أَنْ تَجْعَلَ الْقُرْآنَ رَبِيْعَ قَلْبِيْ، وَنُوْرَ صَدْرِيْ، وَجَلاَءَ حُزْنِيْ، وَذَهَابَ هَمِّيْ ـ',
    latin: '“Allaahumma innii \'abduka, wabnu \'abdika, wabnu amatika (jika yang berdoa wanita maka diganti dengan : amatuka wabnatu ábdika wabnatu amatika)(54), naashiyatii biyadika, maadhin fiyya hukmuka, \'adlun fiyya qodhoo-uka, as-aluka bikullismin huwa laka, sammaita bihi nafsaka, au anzaltahu fii kitaabika, au \'allamtahu ahadan min kholqika, awista\'tsarta bihi fii \'ilmil ghoibi \'indaka, an taj\'alal qur-aana robii\'a qolbii, wa nuuro shodrii, wa jalaa-a huznii, wa dzahaaba hammii.”',
    translation: '“Ya Allah, sesungguhnya aku adalah hambaMu, anak hambaMu, dan anak hamba perempuanMu(55)ubun-ubunku berada di tanganMu(56)hukumMu berlaku terhadap diriku(57) dan ketetapanMu adil pada diriku(58) Aku memohon kepadaMu dengan segala Nama yang menjadi milikMu, yang Engkau namai diriMu dengannya, atau yang Engkau turunkan di dalam kitabMu, atau yang Engkau ajarkan kepada seseorang dari makhlukMu, atau yang Engkau rahasiakan dalam ilmu ghaib yang ada di sisiMu, maka aku mohon dengan itu agar Engkau jadikan Al-Qur\'an sebagai penyejuk hatiku, cahaya bagi dadaku, pelipur kesedihanku, dan penghilang bagi kesusahanku.”(59)',
  },
  {
    title: 'Doa Terkait Jenazah',
    arabic: 'اَللَّهُمَّ اغْفِرْ لَهُ وَارْحَمْهُ وَعَافِهِ وَاعْفُ عَنْهُ، وَأَكْرِمْ نُزُلَهُ، وَوَسِّعْ مَدْخَلَهُ، وَاغْسِلْهُ بِالْمَاءِ وَالثَّلْجِ وَالْبَرَدِ، وَنَقِّهِ مِنَ الْخَطَايَا كَمَا نَقَّيْتَ الثَّوْبَ اْلأَبْيَضَ مِنَ الدَّنَسِ، وَأَبْدِلْهُ دَارًا خَيْرًا مِنْ دَارِهِ، وَأَهْلاً خَيْرًا مِنْ أَهْلِهِ، وَزَوْجًا خَيْرًا مِنْ زَوْجِهِ، وَأَدْخِلْهُ الْجَنَّةَ، وَأَعِذْهُ مِنْ عَذَابِ الْقَبْرِ (وَعَذَابِ النَّارِ) اَللَّهُمَّ اغْفِرْ لِحَيِّنَا وَمَيِّتِنَا وَشَاهِدِنَا وَغَائِبِنَا وَصَغِيْرِنَا وَكَبِيْرِنَا وَذَكَرِنَا وَأُنْثَانَا. اَللَّهُمَّ مَنْ أَحْيَيْتَهُ مِنَّا فَأَحْيِهِ عَلَى اْلإِسْلاَمِ، وَمَنْ تَوَفَّيْتَهُ مِنَّا فَتَوَفَّهُ عَلَى اْلإِيْمَانِ، اَللَّهُمَّ لاَ تَحْرِمْنَا أَجْرَهُ وَلاَ تُضِلَّنَا بَعْدَهُ اَللَّهُمَّ إِنَّ فُلاَنَ بْنَ فُلاَنٍ فِيْ ذِمَّتِكَ، وَحَبْلِ جِوَارِكَ، فَقِهِ مِنْ فِتْنَةِ الْقَبْرِ وَعَذَابِ النَّارِ، وَأَنْتَ أَهْلُ الْوَفَاءِ وَالْحَقِّ. فَاغْفِرْ لَهُ وَارْحَمْهُ إِنَّكَ أَنْتَ الْغَفُوْرُ الرَّحِيْمُ اَللَّهُمَّ عَبْدُكَ وَابْنُ أَمَتِكَ اِحْتَاجَ إِلَى رَحْمَتِكَ، وَأَنْتَ غَنِيٌّ عَنْ عَذَابِهِ، إِنْ كَانَ مُحْسِنًا فَزِدْ فِيْ حَسَنَاتِهِ، وَإِنْ كَانَ مُسِيْئًا فَتَجَاوَزْ عَنْهُ',
    latin: '“Allaahummaghfir lahu warhamhu wa \'aafihi wa\'fu \'anhu, wa akrim nuzulahu, wa wassi\' madkholahu, waghsilhu bilmaa-i wats-tsalji wal barod, wa naqqihi minal khothooyaa kamaa naqqoitats-tsaubal abyadho minad-danas, wa abdilhu daaron khoiron min daarihi, wa ahlan khoiron min ahlihi, wa zaujan khoiron min zaujihi, wa adkhilhul jannata, wa a\'idzhu min \'adzaabil qobri (wa \'adzaabin-naar).” “Allaahummaghfir lihayyinaa wa mayyitinaa wa syaahidinaa wa ghoo-ibinaa wa shoghiirinaa wa kabiirinaa wa dzakarinaa wa untsaanaa. Allaahumma man ahyaytahu minnaa fa-ahyihi \'alaal islaam, wa man tawaffaytahu minnaa fatawaffahu \'alaal iimaan. Allaahumma laa tahrimnaa ajrohu wa laa tudhillanaa ba\'dahu.” “Allaahumma inna fulaanabna fulaanin (sebut nama mayat fulan bin fulan) fii dzimmatika, wa habli jiwaarika, faqihi min fitnatil qobri wa \'adzaabin-naar, wa anta ahlul wafaa-i wal haqq. Faghfir lahu warhamhu innaka antal ghofuurur-rohiim.” “Allaahumma \'abduka wabnu amatika ihtaaja ilaa rohmatik, wa anta ghoniyyun \'an \'adzaabih, in kaana muhsinan fazid fii hasanaatih, wa in kaana musii-an fatajaawaz \'anhu.”',
    translation: '“Ya Allah, ampunilah dia (mayit) (1), berilah rahmat kepadanya(2), selamatkanlah dia (dari beberapa hal yang tidak disukai) (3), maafkanlah dia(4) dan tempatkanlah di tempat yang mulia(5), luaskan tempat masuknya(6), mandikan dia dengan air, salju dan air es(7). Bersihkan dia dari segala kesalahan, sebagaimana Engkau membersihkan baju yang putih dari kotoran(8). Gantikanlah rumah yang lebih baik dari rumahnya (di dunia), keluarga (atau istri di Surga) yang lebih baik daripada keluarganya (di dunia), pasangan yang lebih baik daripada pasangannya di dunia(9), dan masukkan dia ke Surga, jagalah dia dari siksa kubur dan Neraka.”(10) “Ya Allah, ampunilah orang yang hidup dan yang mati di antara kami, orang yang hadir dan yang tidak hadir, yang masih kecil dan yang sudah dewasa, laki-laki maupun perempuan. Ya Allah, orang yang Engkau hidupkan di antara kami, hidupkan dengan memegang ajaran Islam, dan orang yang Engkau matikan di antara kami, maka matikan dengan memegang keimanan. Ya Allah, jangan halangi kami untuk memperoleh pahalanya dan jangan sesatkan kami sepeninggalnya.”(11) “Ya, Allah, sesungguhnya Fulan bin Fulan (sebut nama mayit) dalam tanggunganMu dan jaminan keamananMu. Peliharalah dia dari fitnah kubur dan siksa Neraka(12). Engkau adalah Maha Menepati janji dan Maha Benar. Ampunilah dan kasihanilah dia. Sesungguhnya Engkau Maha Pengampun lagi Maha Penyayang.”(13) “Ya Allah, ini hambaMu, anak hambaMu perempuan (Hawa) membutuhkan rahmatMu, sedang Engkau tidak membutuhkan untuk menyiksanya. Jika ia berbuat baik, tambahkanlah dalam amalan baiknya, dan jika dia orang yang berbuat buruk, maafkanlah keburukannya.”(14)',
  },
  {
    title: 'Doa Terkait Janazah',
    arabic: 'إِنَّ لِلَّهِ مَا أَخَذَ، وَلَهُ مَا أَعْطَى وَكُلُّ شَيْءٍ عِنْدَهُ بِأَجَلٍ مُسَمًّى، فَلْتَصْبِرْ وَلْتَحْتَسِبْ',
    latin: '“Inna lillaahi maa akhodza, wa lahu maa a\'thoo wa kullu syai-in \'indahu bi-ajalin musamman, faltashbir wal tahtasib.”',
    translation: '“Sesungguhnya hak Allah adalah mengambil sesuatu(1) dan memberikan sesuatu(2). Segala sesuatu yang di sisi-Nya dibatasi dengan ajal yang ditentukan(3). Oleh karena itu, bersabarlah dan carilah ridha Allah.”(4)',
  },
  {
    title: 'Doa bila ada yang menyenangkan atau tidak menyenangkan',
    arabic: 'اَللَّهُ أَكْبَرُ، اَللَّهُمَّ أَهِلَّهُ عَلَيْنَا بِالأَمْنِ وَالإِيْمَانِ، وَالسَّلَامَةِ وَالإِسْلَامِ، وَالتَّوْفِيقِ لِمَا تُحِبُّ وَتَرْضَى، رَبُّنَا وَرَبُّكَ اللَّهُ',
    latin: 'Allaahu akbar, allaahumma ahillahu \'alainaa bil amni wal iimaan, was-salaamati wal islaam, wat-taufiiqi limaa tuhibbu wa tardhoo, robbunaa wa robbukallaah.',
    translation: '"Allah Maha Besar, Ya Allah, munculkanlah hilal itu kepada kami dengan membawa keamanan dan keimanan, keselamatan dan islam, dan membawa taufiq kepada apa yang Engkau cintai dan Engkau ridhai. Rabb kami dan Rabb kamu (wahai bulan) adalah Allah(1)".',
  },
  {
    title: 'Doa bila ada yang menyenangkan atau tidak menyenangkan',
    arabic: 'اَللَّهُمَّ بَارِكْ لَنَا فِيْ ثَمَرِنَا، وَبَارِكْ لَنَا فِيْ مَدِيْنَتِنَا، وَبَارِكْ لَنَا فِيْ صَاعِنَا، وَبَارِكْ لَنَا فِيْ مُدِّنَا',
    latin: 'Allaahumma baarik lanaa fii tsamarinaa, wa baarik lanaa fii madiinatinaa, wa baarik lanaa fii shoo\'inaa, wa baarik lanaa fii muddinaa.',
    translation: '“Ya Allah, berilah berkah buah-buahan kami, berilah berkah kota kami, berilah berkah sha’(1) dan berilah berkah mud(2) kami”(3).',
  },
  {
    title: 'Doa Terkait Janazah',
    arabic: 'بِسْمِ اللَّهِ وَعَلَى سُنَّةِ رَسُوْلِ اللَّهِ بِسْمِ اللَّهِ وَعَلَى مِلَّةِ رَسُوْلِ اللَّهِ',
    latin: '“Bismillaahi wa \'alaa sunnati rosuulillaah.” “Bismillaahi wa \'alaa millati rosuulillaah.”',
    translation: '“Dengan nama Allah dan sesuai petunjuk Rasulullah.”(1) “Dengan nama Allah dan sesuai petunjuk Rasulullah.”(2)',
  },
  {
    title: 'Doa Terkait Janazah',
    arabic: 'اَللَّهُمَّ اغْفِرْ لِفُلاَنٍ وَارْفَعْ دَرَجَتَهُ فِي الْمَهْدِيِّيْنَ، وَاخْلُفْهُ فِيْ عَقِبِهِ فِي الْغَابِرِيْنَ، وَاغْفِرْ لَنَا وَلَهُ يَا رَبَّ الْعَالَمِيْنَ، وَافْسَحْ لَهُ فِيْ قَبْرِهِ وَنَوِّرْ لَهُ فِيْهِ',
    latin: '“Allaahummaghfir li fulaan (sebut nama mayatnya), warfa\' darojatahu fiil mahdiyyiin, wakhlufhu fii \'aqibihi fiil ghoobiriin, waghfir lanaa wa lahu, yaa robbal \'aalamiin, wafsah lahu fii qobrihi wa nawwir lahu fiihi.”',
    translation: '“Ya Allah, ampunilah si Fulan (hendaklah menyebut namanya), angkatlah derajatnya bersama orang-orang yang mendapat petunjuk(1), berilah pengganti bagi orang-orang yang ditinggalkan sesudahnya(2) yang masih hidup. Dan ampunilah kami dan dia, wahai Rabb semesta alam. Lebarkan kuburannya dan berilah cahaya di dalamnya.”(3)',
  },
  {
    title: 'Doa Bertemu Musuh dan Penguasa Dzalim',
    arabic: 'اَللَّهُمَّ رَبَّ جِبْرَائِيْلَ وَمِيْكَائِيْلَ وَإِسْرَافِيْلَ، فَاطِرَ السَّمَاوَاتِ وَاْلَأرْضِ، عَالِمَ الْغَيْبِ وَالشَّهَادَةِ، أَنْتَ تَحْكُمُ بَيْنَ عِبَادِكَ فِيْمَا كَانُوْا فِيْهِ يَخْتَلِفُوْنَ، اِهْدِنِيْ لِمَا اخْتُلِفَ فِيْهِ مِنَ الْحَقِّ بِإِذْنِكَ؛ إِنَّكَ تَهْدِيْ مَنْ تَشَاءُ إِلَى صِرَاطٍ مُسْتَقِيْمٍ',
    latin: 'Allaahumma rabba jibraa’iila wa miikaa’iila wa israafiil, faathiras samaawati wal ardh, ‘aalimal ghaibi wasy syahaadah, anta tahkumu baina ‘ibaadika fiimaa kaanuu fiihii yakhtalifuun, ihdinii limakhtulifa fiihi minal haqqi bi idznik, innaka tahdii man tasyaa’u ilaa shiraathin mustaqiim',
    translation: '“Ya Allah Rabb Jibril, Mikail, dan Isrofil(1), Pencipta langit dan bumi yang maha mengetahui yang gaib dan yang nyata, Engkaulah yang memutuskan apa yang diperselisihkan oleh hamba-hambamu. Tunjukilah aku kepada kebenaran dalam apa yang diperselisihkan itu atas izinmu Sesungguhnya engkau menunjuki Siapa yang Engkau kehendaki ke jalan yang lurus”.(2)',
  },
  {
    title: 'Doa Pengantin',
    arabic: 'اَللَّهُمَّ إِنِّيْ أَسْأَلُكَ خَيْرَهَا وَخَيْرَ مَا جَبَلْتَهَا عَلَيْهِ، وَأَعُوْذُ بِكَ مِنْ شَرِّهَا وَشَرِّ مَا جَبَلْتَهَا عَلَيْهِ',
    latin: 'Allaahumma innii as-aluka khoirohaa, wa khoiro maa jabaltahaa \'alaihi, wa a\'uudzu bika min syarrihaa, wa syarri maa jabaltahaa \'alaihi.',
    translation: '“Ya Allah, sesungguhnya aku mohon kepadaMu kebaikan perempuan atau budak ini dan apa yang telah Engkau ciptakan dalam wataknya. Dan aku mohon perlindungan kepadaMu dari kejelekan perempuan atau budak ini dan apa yang telah Engkau ciptakan dalam wataknya.” (1)',
  },
  {
    title: 'Doa Terkait Janazah',
    arabic: 'اَللَّهُمَّ أَعِذْهُ مِنْ عَذَابِ الْقَبْرِ اَللَّهُمَّ اجْعَلْهُ لَنَا فَرَطًا وَسَلَفًا وَأَجْرًا',
    latin: '“Allaahumma a\'idz-hu min \'adzaabil qobr.” “Allaahummaj \'alhu lanaa farothon wa salafan wa ajron.”',
    translation: '“Ya Allah, lindungilah dia dari siksa kubur.”(1) “Ya Allah, jadikanlah kematian anak ini sebagai pahala yang didahulukan, simpanan, dan pahala bagi kami.”(2)',
  },
  {
    title: 'Doa Pengantin',
    arabic: 'اَللَّهُمَّ إِنِّي أُعِيذُهُ بِكَ وَذُرِّيَّتَهُ مِنَ الشَّيْطَانِ الرَّجِيمِ',
    latin: 'Jika bayinya laki-laki, maka lafalnya: “Allaahumma innii u\'iidzuhu bika wa dzurriyyatahu minasy-syaithoonir-rojiim.”“Baarokallaahu laka fil mauhuubi laka, wa syakartal waahiba, wa balagho asyuddahu, wa ruziqta birroh.”',
    translation: 'Doa ibunya maryam untuk maryam (bayinya wanita) “Aku mohon perlindungan untuknya serta anak-anak keturunannya kepada (pemeliharaan) Engkau daripada setan yang terkutuk.” (QS. Ali Imran [3]: 36).',
  },
  {
    title: 'Doa Pengantin',
    arabic: 'إِنِّي أُعِيذُهَا بِكَ وَذُرِّيَّتَهَا مِنَ الشَّيْطَانِ الرَّجِيمِ',
    latin: 'Jika bayinya laki-laki, maka lafalnya: “Allaahumma innii u\'iidzuhu bika wa dzurriyyatahu minasy-syaithoonir-rojiim.”“Baarokallaahu laka fil mauhuubi laka, wa syakartal waahiba, wa balagho asyuddahu, wa ruziqta birroh.”',
    translation: 'Doa ibunya maryam untuk maryam (bayinya wanita) “Aku mohon perlindungan untuknya serta anak-anak keturunannya kepada (pemeliharaan) Engkau daripada setan yang terkutuk.” (QS. Ali Imran [3]: 36).',
  },
  {
    title: 'Doa Pengantin',
    arabic: 'بَارَكَ اللَّهُ لَكَ فِي الْمَوْهُوْبِ لَكَ ، وَشَكَرْتَ الْوَاهِبَ، وَبَلَغَ أَشُدَّهُ، وَرُزِقْتَ بِرَّهُ Balas dengan mengucapkan: بَارَكَ اللَّهُ لَكَ وَبَارَكَ عَلَيْكَ، وَجَزَاكَ اللَّهُ خَيْرًا، وَرَزَقَكَ اللَّهُ مِثْلَهُ، وَأَجْزَلَ ثَوَابَكَ',
    latin: '“Baarokallaahu laka fil mauhuubi laka, wa syakartal waahiba, wa balagho asyuddahu, wa ruziqta birroh.” Sedang orang yang diberi ucapan selamat membalas dengan mengucapkan: “Baarokallaahu laka wa baaroka \'alaika, wa jazaakallaahu khoiron, wa rozaqokallaahu mitslahu, wa ajzala tsawaabak.”',
    translation: '“Semoga Allah memberkahimu dalam anak yang diberikan kepadamu. Semoga kamu bersyukur kepada Sang Pemberi, dan dia dapat mencapai dewasa, serta kamu dikaruniai kebaikannya.” Sedang orang yang diberi ucapan selamat membalas dengan mengucapkan: “Semoga Allah juga memberkahimu dan melimpahkan kebahagiaan untukmu. Semoga Allah membalasmu dengan sebaik-baik balasan, mengaruniakan kepadamu seperti itu dan melipatgandakan pahalamu.”(1)',
  },
  {
    title: 'Doa Terkait Janazah',
    arabic: 'اَلسَّلَامُ عَلَى أَهْلِ الدِّيَارِ مِنَ الْمُؤْمِنِيْنَ وَالْمُسْلِمِيْنَ، وَيَرْحَمُ اللَّهُ الْمُسْتَقْدِمِيْنَ مِنَّا وَالْمُسْتَأْخِرِيْنَ وَإِنَّا إِنْ شَاءَ اللَّهُ بِكُمْ لَلَاحِقُوْنَ',
    latin: '“As-salaamu \'alaikum ahlad-diyaari minal mu\'miniina wal muslimiin. Wa yarhamullaahul mustaqdimiina minnaa wal musta\'khiriin. Wa innaa in syaa-allaahu bikum lalaa hiquun.”',
    translation: '“Semoga keselamatan atas kalian, wahai penghuni kubur, dari kaum mukminin dan muslimin. Semoga Allah merahmati orang-orang yang mendahului kita dan yang datang belakangan(1). Sesungguhnya kami insya Allah akan menyusul kalian.”(2)',
  },
  {
    title: 'Doa Terkait Janazah',
    arabic: 'لاَ إِلَـٰهَ إِلاَّ اللَّهُ',
    latin: '“Laa ilaaha illallah.”',
    translation: '“Tidak ada sesembahan (yang berhak untuk disembah) kecuali Allah.”(1)',
  },
  {
    title: 'Bacaan Terkait Hari Raya',
    arabic: 'تَقَبَّلَ اللَّهُ مِنَّا وَمِنْكُمْ',
    latin: 'Taqabbalallaahu minnaa wa minkum.',
    translation: '“Semoga Allah menerima amal kami dan amal kalian.” (1)',
  },
  {
    title: 'Doa bila ada yang menyenangkan atau tidak menyenangkan',
    arabic: 'اَلْحَمْدُ لِلَّهِ الَّذِي بِنِعْمَتِهِ تَتِمُّ الصَّالِحَاتُ',
    latin: '“Alhamdulillaahil-ladzii bini matihi tatimmush-shoolihaat.”',
    translation: '“Segala puji bagi Allah yang dengan nikmat-Nya(1) segala amal saleh sempurna(2).”',
  },
  {
    title: 'Doa Terkait Hutang',
    arabic: 'اَللَّهُمَّ اكْفِنِيْ بِحَلاَلِكَ عَنْ حَرَامِكَ وَأَغْنِنِيْ بِفَضْلِكَ عَمَّنْ سِوَاكَ',
    latin: '“Allaahummakfinii bihalaalika \'an haroomika, wa aghninii bifadhlika \'amman siwaak.”',
    translation: '“Ya Allah, cukupilah aku dengan rezeki-Mu yang halal (hingga aku terhindar) dari yang haram. Jadikanlah aku kaya dengan karuniaMu (hingga aku tidak minta) kepada selainMu.”(1)',
  },
  {
    title: 'Doa Terkait Hutang',
    arabic: 'اَللَّهُمَّ مَالِكَ الْمُلْكِ تُؤْتِي الْمُلْكَ مَنْ تَشَاءُ، وَتَنْزِعُ الْمُلكَ مِمَّنْ تَشَاءُ، وُتُعِزُّ مَنْ تَشَاءُ، وَتُذِلُّ مَنْ تَشَاءُ، بِيَدِكَ الخَيْرُ، إِنَّكَ عَلَى كُلِّ شَيْءٍ قَدِيرٌ، رَحْمَانَ الدُّنْيَا وَالآخِرَةِ وَرَحِيْمَهُمَا، تُعْطِيهِمَا مَنْ تَشَاءُ وَتَمْنَعُ مِنْهُمَا مَنْ تَشَاءُ، اِرْحَمْنِي رَحْمَةً تُغْنِينِي بِهَا عَنْ رَحْمَةِ مَنْ سِوَاكَ',
    latin: '“Allaahumma maalikal mulki tu\'til mulka man tasyaa\', wa tanzi\'ul mulka mimman tasyaa\', wa tu\'izzu man tasyaa\', wa tudzillu man tasyaa\', biyadikal khoir, innaka \'alaa kulli syai-in qodiir, rohmaanad-dunyaa wal aakhiroti wa rohiimahumaa, tu\'thiihimaa man tasyaa\' wa tamna\'u minhumaa man tasyaa\', irhamnii rohmatan tughniinii bihaa \'an rohmati man siwaak.”',
    translation: '“Ya Allah, Pemilik Seluruh Kekuasaan. Engkau beri kekuasaan kepada siapa yang Engkau kehendaki, dan Engkau mencabutnya dari siapa yang Engkau kehendaki. Engkau memuliakan siapa yang Engkau kehendaki, dan Engkau menghinakan siapa yang Engkau kehendaki. Di tangan-Mu-lah segala kebaikan, dan Engkau Maha Berkuasa Atas Segala Sesuatu. Wahai Maha Pengasih di Dunia dan Akhirat dan Penyayang di keduanya, Engkau memberikan keduanya (dunia dan akhirat) kepada siapa saja yang Engkau kehendaki, dan menahan keduanya dari siapa saja yang Engkau kehendaki. Rahmatilah aku dengan rahmat-Mu yang menjadikanku tak lagi memerlukan belas kasih selain-Mu.”(1)',
  },
  {
    title: 'Doa Terkait Hutang',
    arabic: 'اَللَّهُمَّ رَبَّ السَّمَاوَاتِ وَرَبَّ اْلَأرْضِ وَرَبَّ الْعَرْشِ الْعَظِيْمِ، رَبَّنَا وَرَبَّ كُلِّ شَيْءٍ، فَالِقُ الْحَبِّ وَالنَّوَى، وَمُنْزِلَ التَّوْرَاةَ وَالِإنْجِيْلَ وَاْلفُرْقَانَ، أَعُوْذُ بِكَ مِنْ شَرِّ كُلِّ شَيْءٍ أَنْتَ آخِذٌ بِنَاصِيَتِهِ، اَللَّهُمَّ أَنْتَ اْلَأوَّلُ فَلَيْسَ قَبْلَكَ شَيْءٌ، وَأَنْتَ اْلآخِرُ فَلَيْسَ بَعْدَكَ شَيْءٌ، وَأَنْتَ الظَّاهِرُ فَلَيْسَ فَوْقَكَ شَيْءٌ، وَأَنْتَ الْبَاطِنُ فَلَيْسَ دُوْنَكَ شَيْءٌ، اِقْضِ عَنَّا الدَّيْنَ وَأَغْنِنَا مِنَ الْفَقْرِ',
    latin: 'Allaahumma rabbas samaawaati wa rabbal ardhi wa rabbal ‘arsyil ‘adziim, rabbanaa wa rabba kulli syai’, faaliqul habbi wan nawaa, wa munzilat tauraata wal injiili wal furqaan, a’uudzubika min syarri kulli syai’in anta aakhidzun bi naashiyatih, Allaahumma antal awwalu falaisa qablaka syai’, wa antal aakhiru falaisa ba’daka syai’, wa antadz dzaahiru falaisa fauqaka syai’, wa antal baathinu falaisa duunaka syai’, iqdhi ‘annad daina wa aghninaa minal faqr',
    translation: '“Ya Allah, Rabb langit dan bumi, Rabb Arsy yang agung, Rabb kami dan Rabb segala sesuatu, Yang membelah biji-bijian, dan Yang menurunkan Taurat, Injil, dan Al Furqan (Al Quran). Aku berlindung kepada-Mu dari keburukan segala sesuatu yang Engkau pegang ubun-ubunnya. Ya Allah, Engkaulah Yang Maha Pertama dan tidak ada satu pun sebelum-Mu, Engkaulah Yang Maha Terakhir tidak ada satu pun setelah-Mu, Engkau Ad-Dzahir dan tidak ada satu pun yang diatas-Mu dan Engkau adalah Al-Bathin dan tidak ada satu pun yang lebih (dekat) ilmunya dari pada Engkau(1), bayarkanlah utang kami dan cukupkanlah kami dari kefakiran"(2).',
  },
  {
    title: 'Doa Bertemu Musuh dan Penguasa Dzalim',
    arabic: 'اَللَّهُمَّ إِنَّا نَجْعَلُكَ فِيْ نُحُوْرِهِمْ وَنَعُوْذُ بِكَ مِنْ شُرُوْرِهِمْ اللَّهُمَّ أَنْتَ عَضُدِيْ، وَأَنْتَ نَصِيْرِيْ، بِكَ أَجُوْلُ، وَبِكَ أَصُوْلُ، وَبِكَ أُقَاتِلُ اللَّهُمَّ أَنْتَ عَضُدِيْ، وَأَنْتَ نَصِيْرِيْ، بِكَ أَجُوْلُ، وَبِكَ أَصُوْلُ، وَبِكَ أُقَاتِلُ حَسْبُنَا اللَّهُ وَنِعْمَ الْوَكِيلُ اَللَّهُمَّ مُنْزِلَ الْكِتَابِ، سَرِيْعَ الْحِسَابِ، اِهْزِمِ اْلأَحْزَابَ، اَللَّهُمَّ اهْزِمْهُمْ وَزَلْزِلْهُمْ',
    latin: 'Allaahumma innaa naj’aluka fii nuhuurihim, wa na’uudzu bika min syuruurihim. Allaahumma anta \'adhudii, wa anta nashiirii, bika ajuulu, wa bika ashuulu, wa bika uqootil. Hasbunallaah wa ni\'mal wakiil. Allaahumma munzilal kitaab, sarii\'al hisaab, ihzimil ahzaab, allaahummah-zimhum wa zalzilhum.',
    translation: '“Ya Allah, sesungguhnya aku menjadikan Engkau di leher mereka (agar kekuatan mereka tidak berdaya dalam berhadapan dengan kami). Dan aku berlindung kepadaMu dari kejelekan mereka”(1). "Ya Allah, Engkau adalah lenganku (pertolonganMu yang kuandalkan dalam menghadapi lawanku). Engkau adalah pembelaku. Dengan pertolongan-Mu aku bergerak, dengan pertolongan-Mu aku menyergap dan dengan pertolongan-Mu aku berperang”(2). “Cukuplah Allah menjadi Penolong kami, dan Allah adalah sebaik-baik Pelindung”(3). “Ya Allah, yang menurunkan Kitab Suci, yang menghisab perbuatan manusia dengan cepat. Ya Allah, cerai beraikanlah golongan musuh dan goncangkan mereka”(4).',
  },
  {
    title: 'Doa Bertemu Musuh dan Penguasa Dzalim',
    arabic: 'اَللَّهُمَّ رَبَّ السَّمَاوَاتِ السَّبْعِ، وَرَبَّ الْعَرْشِ الْعَظِيْمِ، كُنْ لِيْ جَارًا مِنْ (فُلاَنٍ بْنِ فُلاَنٍ)، وَأَحْزَابِهِ مِنْ خَلاَئِقِكَ، أَنْ يَفْرُطَ عَلَيَّ أَحَدٌ مِنْهُمْ أَوْ يَطْغَى، عَزَّ جَارُكَ، وَجَلَّ ثَنَاؤُكَ، وَلاَ إِلَـٰهَ إِلاَّ أَنْتَ اَللَّهُ أَكْبَرُ، اَللَّهُ أَعَزُّ مِنْ خَلْقِهِ جَمِيْعًا، اَللَّهُ أَعَزُّ مِمَّا أَخَافُ وَأَحْذَرُ، وَأَعُوْذُ بِاللَّهِ الَّذِيْ لاَ إِلَـٰهَ إِلاَّ هُوَ، اَلْمُمْسِكِ السَّمَاوَاتِ السَّبْعِ أَنْ يَقَعْنَ عَلَى اْلأَرْضِ إِلاَّ بِإِذْنِهِ، مِنْ شَرِّ عَبْدِكَ (فُلاَنٍ)، وَجُنُوْدِهِ وَأَتْبَاعِهِ وَأَشْيَاعِهِ، مِنَ الْجِنِّ وَاْلإِنْسِ، اَللَّهُمَّ كُنْ لِيْ جَارًا مِنْ شَرِّهِمْ، وَجَلَّ ثَنَاؤُكَ وَعَزَّ جَارُكَ، وَتَبَارَكَ اسْمُكَ، وَلاَ إِلَـٰهَ غَيْرُكَ',
    latin: 'Allaahumma robbas-samaawaatis-sab\'i, wa robbal \'arsyil \'azhiim, kun lii jaaron min (fulaanibni fulaan yaitu sebut nama penguasa tersebut fulan bin fulan), wa ahzaabihi min kholaa-iqika, an yafrutho \'alayya ahadun minhum au yath-ghoo, \'azza jaaruka, wa jalla tsanaa-uka, wa laa ilaaha illa anta. Allaahu akbar, allaahu a\'azzu min kholqihi jamii\'an, allaahu a\'azzu mimmaa akhoofu wa ahdzar, wa a\'uudzu billaahi-lladzii laa ilaaha illaa huu, al mumsikis-samaawaatis-sab\'i an yaqo\'na \'alal ardhi illaa bi-idznih, min syarri \'abdika fulaan (yaitu sebut namanya), wa junuudihi wa atbaa\'ihi wa asy-yaa\'ih, minal jinni wal ins, allaahumma kun lii jaaron min syarrihim, wa jalla tsanaa-uka wa \'azza jaaruka, wa tabaarokasmuka, wa laa ilaaha ghoiruk (3x).',
    translation: '“Ya Allah, Tuhan Penguasa tujuh langit, Tuhan Penguasa \'Arsy yang agung. Jadilah Engkau pelindung bagiku dari “Fulan bin Fulan” (yaitu nama penguasa tersebut), dan para kelompoknya dari makhlukMu. Jangan ada seorang pun dari mereka menyakitiku atau melampaui batas terhadapku. Sungguh kuat perlindunganMu, dan agunglah pujiMu. Tidak ada sesembahan yang berhak disembah kecuali Engkau”(1). “Allah Maha Besar. Allah Maha Perkasa dari segala makhlukNya. Allah Maha Perkasa dari apa yang aku takutkan dan khawatirkan. Aku berlindung kepada Allah, yang tidak ada sesembahan yang berhak disembah kecuali Dia, yang menahan tujuh langit agar tidak menjatuhi bumi kecuali dengan izinNya, dari kejahatan hambaMu Fulan, serta para pembantunya, pengikutnya dan pendukungnya, dari jenis jin dan manusia. Ya Allah, jadilah Engkau pelindungku dari kejahatan mereka. Agunglah pujiMu, kuatlah perlindunganMu dan Maha Suci asma-Mu. Tidak ada sesembahan yang berhak disembah kecuali Engkau (3x)(2).',
  },
  {
    title: 'Doa Terkait Hutang',
    arabic: 'بَارَكَ اللَّهُ لَكَ فِيْ أَهْلِكَ وَمَالِكَ',
    latin: '“Baarokallaahu laka fii ahlika wa maalika.”',
    translation: '“Semoga Allah memberkahimu dalam keluarga dan hartamu.”(1)',
  },
  {
    title: 'Doa Pengantin',
    arabic: 'بَارَكَ اللَّهُ لَكَ وَبَارَكَ عَلَيْكَ وَجَمَعَ بَيْنَكُمَا فِيْ خَيْرٍ',
    latin: 'Baarokallaahu laka(1) wa baaroka \'alaika(2) wa jama\'a bainakumaa fii khoirin(3).',
    translation: '“Semoga Allah memberkahimu di waktu bahagia dan memberkahimu di waktu susah, dan semoga Allah menyatukan kalian berdua dalam kebaikan.” (4)',
  },
  {
    title: 'Doa bila ada yang menyenangkan atau tidak menyenangkan',
    arabic: 'اللَّهُمَّ إِنَّا نَجْعَلُكَ فِي نُحُورِهِمْ وَنَعُوذُ بِكَ مِنْ شُرُورِهِمْ',
    latin: 'Allaahumma Inna naj’aluka fi nuhurihim wa na’udzu bika min syururihim',
    translation: '“Ya Allah sesungguhnya kami menjadikan engkau (sebagai pelindung kami) dihadapan mereka dan kami berlindung kepadamu dari keburukan mereka”(1).',
  },
  {
    title: 'Doa bila ada yang menyenangkan atau tidak menyenangkan',
    arabic: 'قَدَرُ اللَّهِ وَمَا شَاءَ فَعَلَ اَلْحَمْدُ لِلَّهِ عَلَى كُلِّ حَالٍ إِنَّا لِلَّهِ وَإِنَّا إِلَيْهِ رَاجِعُوْنَ، اَللَّهُمَّ أْجُرْنِيْ فِيْ مُصِيْبَتِيْ وَأَخْلِفْ لِيْ خَيْرًا مِنْهَا',
    latin: '“Qodarullaahi wa maa syaa-a fa\'ala.” “Alhamdulillaahi \'alaa kulli haal.” (2) “Innaa lillaahi wa innaa ilaihi rooji\'uun, allaahumma ujurnii fii mushiibatii wa akhlif lii khoiron minhaa.”',
    translation: '“Ini taqdir Allah, dan apa yang Dia kehendaki, Dia lakukan.”(1) “Segala puji bagi Allah atas segala keadaan.”(3) “Sesungguhnya kami milik Allah(4) dan kepadaNya kami akan kembali(5). Ya Allah, berilah pahala kepadaku(6) dan gantilah untukku dengan yang lebih baik (dari musibahku) (7).”(8)',
  },
  {
    title: 'Doa Terkait Janazah',
    arabic: 'اَللَّهُمَّ اغْفِرْ لَهُ اَللَّهُمَّ ثَبِّتْهُ',
    latin: '“Allaahummaghfir lahu, allaahumma tsabbit-hu.”',
    translation: '“Ya Allah ampunilah dia, Ya Allah teguhkanlah dia (untuk menjawab pertanyaan malaikat).”(1)',
  },
  {
    title: 'Doa Terkait Hutang',
    arabic: 'اَللَّهُمَّ إِنِّي أَسْأَلُكَ مِنْ فَضْلِكَ وَرَحْمَتِكَ، فَإِنَّهُ لاَ يَمْلِكُهَا إِلاَّ أَنْتَ',
    latin: '“Allaahumma innii as-aluka min fadhlika wa rohmatik, fa-innahu laa yamlikuhaa illaa anta.”',
    translation: '“Ya Allah, aku memohon kepada-Mu tambahan karunia-Mu dan rahmat-Mu, karena sesungguhnya tidak ada yang memilikinya kecuali Engkau.”(1)',
  },
  {
    title: 'Doa bila ada yang menyenangkan atau tidak menyenangkan',
    arabic: 'اَلْحَمْدُ لِلَّهِ الَّذِيْ عَافَانِيْ مِمَّا ابْتَلَاكَ بِهِ، وَفَضَّلَنِيْ عَلَى كَثِيْرٍ مِمَّنْ خَلَقَ تَفْضِيْلاً',
    latin: '“Alhamdulillaahil-ladzii \'aafaanii mimmabtalaaka bihi, wa fadh-dholanii \'alaa katsiirin mimman kholaqo tafdhiilan.”',
    translation: '“Segala puji bagi Allah yang telah menghindarkanku dari musibah yang menimpamu, serta memberikan kelebihan kepadaku atas sekian banyak ciptaan-Nya.”(1)',
  },
  {
    title: 'Doa Terkait Hutang',
    arabic: 'بَارَكَ اللَّهُ لَكَ فِيْ أَهْلِكَ وَمَالِكَ',
    latin: '“Baarokallaahu laka fii ahlika wa maalika”',
    translation: '“Semoga Allah memberikan berkah kepadamu pada keluarga dan hartamu”(1)',
  },
  {
    title: 'Doa Terkait Janazah',
    arabic: 'اَللَّهُمَّ لاَ سَهْلَ إِلاَّ مَا جَعَلْتَهُ سَهْلاً، وَأَنْتَ تَجْعَلُ الْحَزْنَ إِذَا شِئْتَ سَهْلاً اَللَّهُمَّ رَحْمَتَكَ أَرْجُو، فَلاَ تَكِلْنِيْ إِلَى نَفْسِيْ طَرْفَةَ عَيْنٍ، وَأَصْلِحْ لِيْ شَأْنِيْ كُلَّهُ، لاَ إِلَـٰهَ إِلاَّ أَنْتَ لاَ إِلَـٰهَ إِلاَّ أَنْتَ سُبْحَانَكَ إِنِّيْ كُنْتُ مِنَ الظَّالِمِيْنَ اَللَّهُ اللَّهُ رَبِّي، لاَ أُشْرِكُ بِهِ شَيْئًا لاَ إِلَـٰهَ إِلاَّ اللَّهُ الْعَظِيْمُ الْحَلِيْمُ، لاَ إِلَـٰهَ إِلاَّ اللَّهُ رَبُّ الْعَرْشِ الْعَظِيْمِ، لاَ إِلَـٰهَ إِلاَّ اللَّهُ رَبُّ السَّمَاوَاتِ وَرَبُّ اْلأَرْضِ وَرَبُّ الْعَرْشِ الْكَرِيْمِ',
    latin: '“Allahumma laa sahla illaa maa ja\'altahu sahlan, wa anta taj\'alul hazna idzaa syi\'ta “Allaahumma rohmataka arjuu, falaa takilnii ilaa nafsii thorfata \'ain, wa ashlih lii sya\'nii kullah, laa ilaaha illaa anta.” “Laa ilaaha illaa anta, subhaanaka, innii kuntu minazh-zhoolimiin.” “Allaah Allaah robbii, laa usyriku bihi syai-an.” “Laa ilaaha illallaahul \'azhiimul haliim, laa ilaaha illallaahu robbul \'arsyil \'azhim, laa ilaaha illallaahu robbus-samaawaati wa robbul ardhi wa robbul \'arsyil kariim.”',
    translation: '“Ya Allah, tidak ada kemudahan kecuali apa yang Engkau jadikan mudah. Sedang yang susah bisa Engkau jadikan mudah, apabila Engkau menghendakinya.”(1) “Ya Allah, rahmatMu yang aku harapkan, maka jangan Engkau serahkan urusanku kepada diriku meskipun sekejap mata (tanpa pertolongan atau rahmat dariMu). Perbaikilah seluruh urusanku, tidak ada sesembahan yang berhak disembah kecuali Engkau.”(2) “Tidak ada sesembahan yang berhak disembah kecuali Engkau. Maha Suci Engkau. Sesungguhnya aku termasuk orang-orang yang zalim.”(3) “Allah, Allah adalah Tuhanku. Aku tidak menyekutukanNya dengan sesuatupun.”(4) “Tidak ada sesembahan yang berhak disembah kecuali Allah Yang Maha Agung dan Maha Lembut. Tidak ada sesembahan yang berhak disembah kecuali Allah, Tuhan yang menguasai arsy, yang Maha Agung. Tidak ada sesembahan yang berhak disembah kecuali Allah, Tuhan yang menguasai langit dan bumi. Tuhan Yang menguasai arsy, lagi Maha Mulia.”(5)',
  },
  {
    title: 'Bacaan Terkait Hari Raya',
    arabic: 'بِاسْمِ اللهِ وَاللهُ أَكْبَرُ إِنِّي وَجَّهْتُ وَجْهِيَ لِلَّذِي فَطَرَ السَّمَاوَاتِ وَالْأَرْضَ حَنِيفًا وَمَا أَنَا مِنَ الْمُشْرِكِينَ إِنَّ صَلَاتِي وَنُسُكِي وَمَحْيَايَ وَمَمَاتِي لِلَّهِ رَبِّ الْعَالَمِينَ لَا شَرِيكَ لَهُ وَبِذَلِكَ أُمِرْتُ وَأَنَا أَوَّلُ الْمُسْلِمِينَ بِسْمِ اللَّهِ اللَّهُ أَكْبَرُ اللَّهُمَّ مِنْكَ وَلَكَ مِنْ مُحَمَّدٍ وَأُمَّتِهِ',
    latin: 'Bismillaah, wallaahu akbar. Innī wajjahtu waj-hiya lillażī faṭaras-samāwāti wal-arḍa ḥanīfaw wa mā ana minal-musyrikīn, inna ṣalātī wa nusukī wa maḥyāya wa mamātī lillāhi rabbil-\'ālamīn, Lā syarīka lah, wa biżālika umirtu wa ana awwalul-muslimīn Bismillaah, wallaahu akbar. Allahumma minka wa laka min Muhammadin wa ummatihi',
    translation: '“Dengan nama Allah (aku menyembelih), Allah Maha Besar.” (1) “Sesungguhnya aku menghadapkan diriku kepada Rabb yang menciptakan langit dan bumi, dengan cenderung kepada agama yang benar, dan aku bukanlah termasuk orang-orang yang mempersekutukan Tuhan. Sesungguhnya sembahyangku, ibadatku, hidupku dan matiku hanyalah untuk Allah, Tuhan semesta alam. Tiada sekutu bagi-Nya; dan demikian itulah yang diperintahkan kepadaku dan aku adalah orang yang pertama-tama menyerahkan diri (kepada Allah)". Dengan nama Allah (aku menyembelih), Allah Maha Besar. Ya Allah (ini adalah) dari-Mu dan untuk-Mu(2), dari Muhammad dan ummatnya.” (3)',
  },
];

// Dzikir Setiap Saat — transcribed programmatically from bekalislam.online/dzikir-doa's
// own per-item HTML fragments (dzikirdoa_new/dzikir-setiap-saat/*.html), same method as
// dzikirPagi/dzikirPetang above, to avoid transcription errors. A handful of items on
// the source site have no distinct Arabic phrase of their own (a narrative note about
// what the Prophet did, or "no specific dzikir exists for this") — those are kept with
// an empty `arabic` and their note folded into `translation` instead of guessing at a
// verbatim recitation that doesn't exist. Still needs a human check against a mu'tabar
// reference before treating as final, same caution as the rest of this file.
export const dzikirSetiapSaat = [
  {
    title: 'Bacaan Tahlil',
    arabic: '﴿١﴾لَا إِلَهَ إِلَّا اللهُ ﴿٢﴾لاَ إِلَهَ إِلَّا اللَّهُ، وَحْدَهُ لاَ شَرِيكَ لَهُ، لَهُ المُلْكُ وَلَهُ الحَمْدُ، وَهُوَ عَلَى كُلِّ شَيْءٍ قَدِيرٌ',
    latin: '1.“laa ilaaha illaallah.” (1) 2. laa ilaaha illallahu wahdahuu laa syariika lahuu, lahul mulku wa lahul hamdu wa huwa \'alaa kulli syai\'in qodir',
    translation: '(1) Tiada Tuhan selain Allah (2) "Tidak ada Tuhan selain Allah, Dia satu-satunya, tidak ada sekutu bagi-Nya. Milik-Nya segala kerajaan, dan bagi-Nya segala pujian, dan Dia Maha Kuasa atas segala sesuatu."',
  },
  {
    title: 'Bacaan Takbir',
    arabic: '﴿١﴾اَللهُ أَكْبَرُ ﴿٢﴾اللَّهُ أَكْبَرُ، اللَّهُ أَكْبَرُ، اللَّهُ أَكْبَرُ، لَا إِلَهَ إِلَّا اللَّهُ، وَاللَّهُ أَكْبَرُ، اللَّهُ أَكْبَرُ، وَلِلَّهِ الْحَمْدُ ﴿٣﴾اللَّهُ أَكْبَرُ، اللَّهُ أَكْبَرُ، لَا إِلَهَ إِلا اللَّهُ، وَ اللَّهُ أَكْبَرُ، اللَّهُ أَكْبَرُ، وَلِلَّهِ الْحَمْدُ اللَّهُ أَكْبَرُ اللَّهُ أَكْبَرُ اللَّهُ أَكْبَرُ وَلِلَّهِ الْحَمْدُ اللَّهُ أَكْبَرُ وَأَجَلُّ اللَّهُ أَكْبَرُ عَلَى مَا هَدَانَا ﴿٤﴾تَكْبِيرًا اللَّهُمَّ أَنْتَ أَعْلَى وَأَجَلُّ مِنْ أَنْ تَكُونَ لَكَ صَاحِبَةٌ أَوْ يَكُونَ لَكَ وَلَدٌ أَوْ يَكُونَ لَكَ شَرِيكٌ فِي الْمُلْكِ أَوْ يَكُونَ لَكَ وَلِيٍّ مِنَ الذُّلِّ وَكَبِّرْهُ تَكْبِيرًا، اللَّهُمَّ اغْفِرْ لَنَا، اللَّهُمَّ ارْحَمْنَا ﴿٥(اللَّهُ أَكْبَرُ كَبِيرًا، وَالْحَمْدُ لِلَّهِ كَثِيرًا، وَسُبْحَانَ اللَّهِ بُكْرَةً وَأَصِيلًا اللَّهُ أَكْبَرُ، وَلَا نَعْبُدُ إلَّا اللَّهَ مُخْلِصِينَ لَهُ الدَّيْنَ، وَلَوْ كَرِهَ الْكَافِرُونَ لَا إلَهَ إلَّا اللَّهُ وَحْدَهُ صَدَقَ وَعْدَهُ، وَنَصَرَ عَبْدَهُ، وَهَزَمَ الْأَحْزَابَ وَحْدَهُ لَا إلَهَ إلَّا اللَّهُ، وَاَللَّهُ أَكْبَرُ ﴿٦﴾اللَّهُ أَكْبَرُ اللَّهُ أَكْبَرُ، لَا إلَهَ إلَّا اللَّهُ، وَاَللَّهُ أَكْبَرُ اللَّهُ أَكْبَرُ، وَلِلَّهِ الْحَمْدُ عَلَى مَا هَدَانَا اللَّهُمَّ اجْعَلْنَا لَك مِنْ الشَّاكِرِينَ اللَّهُ أَكْبَرُ كَبِيرًا، وَالْحَمْدُ لِلَّهِ كَثِيرًا، وَسُبْحَانَ اللَّهِ بُكْرَةً وَأَصِيلًا، وَلَا حَوْلَ وَلَا قُوَّةَ إلَّا بِاَللَّهِ',
    latin: '1. Allahu akbar 2. Allaahu akbar, allaahu akbar, allaahu akbar, laa ilaaha illallaahu wallaahu akbar, allaahu akbar wa lillaahil hamd (1) 3. Allaahu akbar, allaahu akbar, laa ilaaha illallaahu wallaahu akbar, allaahu akbar wa lillaahil hamd (2) 4. Allaahu akbar, allaahu akbar, allaahu akbar, wa lillaahil hamd, allaahu akbar wa ajallu, allaahu akbar ‘alaa maa hadaanaa (3) 5. Takbiiron allaahumma anta a’laa wa ajallu min an takuuna laka shoohibatun aw yakuuna laka waladun, aw yakuuna laka syariikun fil mulki aw yakuuna laka waliyyun minadz dzulli wa kabbirhu takbiiron, allaahummaghfir lanaa, allaahummarhamnaa (4) 5.Allaahu akbar kabiiro, wal hamdu lillaahi katsiiro, wa subhanallahi bukrotan wa ashiila, allaahu akbar, wa laa na’budu ilallahu mukhlishiina lahud diin, w alau karihal kaafiruun, laa ilaaha illallaahu wahdahu, shodaqo wa’dah, wa nashoro ‘abdah, wa hazamal ahzaaba wahdah, laa ilaaha illallaahu wallaahu akbar (1) 6. Allahu akbar, allaahu akbar, laa ilaaha illallaahu wallaahu akbar, allaahu akbar wa lillaahil hamdu ‘alaa maa hadaanaa, allaahummaj’alnaa laka minasy syaakiriin Allaahu akbar kabiiron wal hamdulillaahi katsiiron, wa subhanallahi bukrotan wa ashiilaa, wa laa haul awa laa quwwata ilaa billaah (2)',
    translation: '"Allah Maha Besar." "Allah Maha Besar, Allah Maha Besar, Allah Maha Besar. Tidak ada Tuhan selain Allah, dan Allah Maha Besar, Allah Maha Besar, dan segala puji bagi Allah." "Allah Maha Besar, Allah Maha Besar, tidak ada Tuhan selain Allah, dan Allah Maha Besar, Allah Maha Besar, dan segala puji bagi Allah." "Allah Maha Besar, Allah Maha Besar, Allah Maha Besar, dan segala puji bagi Allah. Allah Maha Besar dan Maha Agung. Allah Maha Besar atas petunjuk yang telah diberikan-Nya kepada kita." "Sebesar-besarnya pengagungan. Ya Allah, Engkau Maha Tinggi dan Maha Agung, jauh dari memiliki istri atau anak, atau memiliki sekutu dalam kerajaan-Mu, atau memiliki pelindung karena kelemahan. Maka agungkanlah Dia dengan sebenar-benarnya pengagungan. Ya Allah, ampunilah kami, Ya Allah, rahmatilah kami." "Allah Maha Besar dengan kebesaran yang agung. Segala puji bagi Allah dengan pujian yang banyak. Maha Suci Allah di waktu pagi dan petang." "Allah Maha Besar, dan kami tidak menyembah selain Allah dengan keikhlasan dalam beragama kepada-Nya, meskipun orang-orang kafir membenci." Tidak ada Tuhan selain Allah, satu-satunya. Dia telah menepati janji-Nya, menolong hamba-Nya, dan mengalahkan pasukan musuh sendirian." "Tidak ada Tuhan selain Allah, dan Allah Maha Besar." Allah Maha Besar, Allah Maha Besar. Tidak ada Tuhan selain Allah, dan Allah Maha Besar, Allah Maha Besar, dan segala puji bagi Allah atas petunjuk yang telah diberikan-Nya kepada kita. Ya Allah, jadikanlah kami termasuk orang-orang yang bersyukur kepada-Mu." "Allah Maha Besar dengan kebesaran yang agung, segala puji bagi Allah dengan pujian yang banyak, Maha Suci Allah di waktu pagi dan petang, dan tidak ada daya dan kekuatan kecuali dengan pertolongan Allah."',
  },
  {
    title: 'Bacaan Tahmid',
    arabic: '﴿١(الْحَمْدُ لِلَّهِ ﴿٢﴾الْحَمْدُ لِلَّهِ رَبِّ الْعَالَمِينَ ﴿٣﴾الْحَمْدُ لِلَّهِ حَمْدًا كَثِيرًا طَيِّبًا مُبَارَكًا فِيهِ ﴿٤﴾رَبَّنَا لَكَ الْحَمْدُ ﴿٥﴾اللَّهُمَّ رَبَّنَا وَلَكَ الْحَمْد',
    latin: '“alhamdu lillah.”(2) “alhamdu lillahi robbil ‘alamin.” (QS. Al-Fatihah: 2) (3) “alhamdu lillaahi katsiiron thoyyiban mubaarokan fiih.” (1) "Rabbanaa lakal hamdu" (2) "Allahumma rabbanaa wa lakal hamdu" (3)',
    translation: '"Segala puji bagi Allah." "Segala puji bagi Allah, Tuhan seluruh alam." "Segala puji bagi Allah dengan pujian yang banyak, baik, dan penuh keberkahan di dalamnya." "Wahai Tuhan kami, bagi-Mu segala puji." "Ya Allah, wahai Tuhan kami, bagi-Mu segala puji."',
  },
  {
    title: 'Bacaan Tasbih',
    arabic: '﴿١﴾سُبْحَانَ اللَّهِ ﴿٢﴾سُبْحَانَ رَبِّىَ الْعَظِيم ﴿٣﴾سُبُّوحٌ قُدُّوسٌ رَبُّ الْمَلاَئِكَةِ وَالرُّوح ﴿٤﴾سُبْحَانَ ذِي الْجَبَرُوتِ وَالْمَلَكُوتِ وَالْكِبْرِيَاءِ وَالْعَظَمَة ﴿٥﴾سُبْحَانَ رَبِّىَ الأَعْلَى',
    latin: '“subhanallah.” “Subhanaa robbiyal ‘azhim” (1) “Subbuhun qudduus, robbul malaa-ikati war ruuh“ (2) “subhaana dzil jabaruut wal malakuut wal kibriyaa’ wa ‘azhomah” (3) ‘subhanaa robbiyal a’laa (4)',
    translation: '"Maha Suci Allah." "Maha Suci Tuhanku yang Maha Agung." "Maha Suci, Maha Suci (Allah), Tuhan para malaikat dan Ruh (Jibril)." "Maha Suci Dzat yang memiliki keperkasaan, kerajaan, keagungan, dan kebesaran." "Maha Suci Tuhanku yang Maha Tinggi."',
  },
  {
    title: 'Bacaan Hauqqolah',
    arabic: '﴿١﴾لَا حَوْلَ وَلَا قُوَّةَ إِلَّا بِاللهِ ﴿٢﴾لَا حَوْلَ وَلَا قُوَّةَ إِلَّا بِاللَّهِ الْعَلِيِّ الْعَظِيمِ',
    latin: '“laa haul awa laa quwwata illaa billaah” “laa haul awa laa quwwata illaa billaahil ‘aliyyil ‘azhiim” (7)',
    translation: '',
  },
  {
    title: 'Bacaan Istigfar',
    arabic: '﴿١﴾أسْتَغْفِرُ اللهَ ﴿٢﴾أَسْتَغْفِرُ اللهَ وَأَتُوبُ إِلَيْهِ ﴿٣﴾أَسْتَغْفِرُ اللهَ الَّذِي لاَ إِلَهَ إِلاَّ هُوَ الحَيُّ الْقَيُّوْمُ وَأَتُوْبُ إِلَيْهِ ﴿٤﴾رَبِّ اغْفِرْ لي وتُبْ عليَّ إِنَّكَ أَنْتَ التَّوَّابُ الرَّحِيْمُ',
    latin: 'Astaghfirullah Astaghfirullah wa atuubu ilaihi Astaghfirullah alladzii laa ilaaha illaa huwal hayyuul qoyyuum wa atuubu ilaiih Robbighfirli watub ‘alaiyya innak antat tawwaburrahiim',
    translation: 'Artinya : “Aku memohon ampun kepada Allah.” Artinya : Aku memohon maghiroh Allah dan aku bertaubat kepadaNya(6) “Aku memohon ampunan kepada Allah yang tidak ada sesembahan yang berhak disembah kecuali Dia, yang maha hidup dan maha tegak dan aku bertaubat kepadaNya” (1) Artinya : Ya Rabbku ampunilah aku dan bimbinglah aku untuk bertaubat (atau terimalah taubatku) sesungguhnya Engkau adalah Maha penerima taubat dan Maha Rahmat(2)',
  },
  {
    title: 'Bacaan Shalawat',
    arabic: '﴿١﴾صَلَّى اللهُ عَلَيْهِ وَسَلَّمَ ﴿٢﴾اللَّهُمَّ صَلِّ وَسَلِّمْ عَلَيْهِ ﴿٣﴾الصَّلاَةُ وَالسَّلاَمُ عَلَيْهِ ﴿٤﴾اللهُمَّ صَلِّ عَلَى مُحَمَّدٍ وَعَلَى آلِ مُحَمَّدٍ، كَمَا صَلَّيْتَ عَلَى إِبْرَاهِيمَ، وَعَلَى آلِ إِبْرَاهِيمَ إِنَّكَ حَمِيدٌ مَجِيدٌ، وَبَارِكْ عَلَى مُحَمَّدٍ، وَعَلَى آلِ مُحَمَّدٍ كَمَا بَارَكْتَ عَلَى إِبْرَاهِيمَ وَعَلَى آلِ إِبْرَاهِيمَ إِنَّكَ حَمِيدٌ مَجِيدٌ ﴿٥﴾اللهُمَّ صَلِّ عَلَى مُحَمَّدٍ وَعَلَى أَهْلِ بَيْتِهِ، وَعَلَى أَزْوَاجِهِ وَذُرِّيَّتِهِ، كَمَا صَلَّيْتَ عَلَى آلِ إِبْرَاهِيمَ إِنَّكَ حَمِيدٌ، وَبَارِكْ عَلَى مُحَمَّدٍ وَعَلَى أَهْلِ بَيْتِهِ، وَعَلَى أَزْوَاجِهِ وَذُرِّيَّتِهِ، كَمَا بَارَكْتَ عَلَى آلِ إِبْرَاهِيمَ إِنَّكَ حَمِيدٌ مَجِيدٌ ﴿٦﴾اللَّهُمَّ صَلِّ عَلَى مُحَمَّدٍ عَبْدِكَ وَرَسُولِكَ، كَمَا صَلَّيْتَ عَلَى آلِ إِبْرَاهِيمَ، وَبَارِكْ عَلَى مُحَمَّدٍ، وَعَلَى آلِ مُحَمَّدٍ، كَمَا بَارَكْتَ عَلَى إِبْرَاهِيمَ ﴿٧﴾اللَّهُمَّ صَلِّ عَلَى مُحَمَّدٍ، وَعَلَى أَزْوَاجِهِ وَذُرِّيَّتِهِ، كَمَا صَلَّيْتَ عَلَى إِبْرَاهِيمَ، وَبَارِكْ عَلَى مُحَمَّدٍ، وَعَلَى أَزْوَاجِهِ وَذُرِّيَّتِهِ، كَمَا بَارَكْتَ عَلَى إِبْرَاهِيمَ، إِنَّكَ حَمِيدٌ مَجِيدٌ ﴿٨﴾ اللَّهُمَّ صَلِّ عَلَى مُحَمَّدٍ النَّبِيِّ الْأُمِّيِّ وَعَلَى آلِ مُحَمَّدٍ، كَمَا صَلَّيْتَ عَلَى إِبْرَاهِيمَ وَآلِ إِبْرَاهِيمَ، وَبَارِكْ عَلَى مُحَمَّدٍ النَّبِيِّ الْأُمِّيِّ، كَمَا بَارَكْتَ عَلَى إِبْرَاهِيمَ وَعَلَى آلِ إِبْرَاهِيمَ، إِنَّكَ حَمِيدٌ مَجِيدٌ ﴿٩﴾اللهُمَّ صَلِّ عَلَى مُحَمَّدٍ وَعَلَى آلِ مُحَمَّدٍ، وَبَارِكْ عَلَى مُحَمَّدٍ، وَعَلَى آلِ مُحَمَّدٍ، كَمَا بَارَكْتَ عَلَى إِبْرَاهِيمَ فِي الْعَالَمِينَ، إِنَّكَ حَمِيدٌ مَجِيدٌ',
    latin: 'Shollollahu álaihi wasallam Allahumma sholli wa sallim álaihi Assholaatu wassalaamu álaihi Allahumma sholli ‘ala Muhammad wa ‘ala aali Muhammad kamaa shollaita ‘ala Ibroohim wa ‘ala aali Ibrohim, innaka hamidun majiid. Allahumma baarik ‘ala Muhammad wa ‘ala aali Muhammad kamaa baarokta ‘ala Ibrohim wa ‘ala aali Ibrohimm innaka hamidun majiid Allahumma shalli ‘ala muhammad wa ‘ala ahli baitihii, wa ‘ala azwaajihii wa dzurriyatihii, kamaa shallaita ‘ala aali ibrahim innaka hamiidum majiid. Wa baarik ‘ala muhammad wa ‘ala ahli baitihii, wa ‘ala azwaajihii wa dzurriyatihii, kamaa baarakta ‘ala aali ibrahim innaka hamiidum majiid. Allaahumma sholli ‘alaa Muhammadin ‘abdika wa rosuulika kamaa shol laita ‘alaa aali ibroohiim, wa baarik ‘alaa Muhammad wa ‘alaa aali Muhammad kamaa baarokta ‘alaa ibroohiim. Allaahumma sholli ‘alaa Muhammadin wa ‘alaa azwaajihi wa dzurriyyatihi kamaa shol laita ‘alaa ibroohiim, wa baarik ‘alaa Muhammadin wa ‘alaa azwaajihi wa dzurriyyatihi kamaa baarokta ‘alaa ibroohiim innaka hamiidum majiid. Allahumma shalli ‘ala muhammad an-nabiyyil ummiyi wa ‘ala aali muhammad, kamaa shallaita ‘ala aali ibrahim. Wa baarik ‘ala muhammad an-nabiyyil ummiyi wa ‘ala aali muhammad, kamaa baarakta ‘ala aali ibrahim, fil ‘aalamiina innaka hamiidum majiid. “Allahumma sholli ‘ala Muhammad wa ‘ala aali, wa baarik ‘ala Muhammad wa ‘ala aali, kamaa baarokta ‘ala Ibrohim wa ‘ala aali Ibrohimm fil ‘aalamiina innaka hamidun majiid"',
    translation: '“Ya Allah, semoga shalawat tercurah kepada Muhammad dan keluarga Muhammad sebagaimana tercurah pada Ibrahim dan keluarga Ibrahim, sesungguhnya Engkau Maha Terpuji lagi Maha Mulia. Ya Allah, semoga berkah tercurah kepada Muhammad dan keluarga Muhammad sebagaimana tercurah pada Ibrahim dan keluarga Ibrahim, sesungguhnya Engkau Maha Terpuji lagi Maha Mulia.” (1) “Ya Allah, semoga shalawat tercurah kepada Muhammad dan keluarganya,istri-istrinys, serta keturunannya, sebagaimana tercurah pada Ibrahim, sesungguhnya Engkau Maha Terpuji lagi Maha Mulia. Ya Allah, semoga berkah tercurah kepada Muhammad dan keluarganya, istri-istrinya, serta keturunannya, sebagaimana tercurah pada Ibrahim, sesungguhnya Engkau Maha Terpuji lagi Maha Mulia.” (2) “Ya Allah berilah shalawat kepada Muhammad hambaMu dan RasulMu, sebagaimana Engkau telah bershalawat kepada Ibrahim. Dan berkahilah Muhammad dan keluarga Muhammad, sebagaimana Engkau telah memberkahi Ibrahim.” (3) “Ya Allah,berilah shalawat kepada Muhammad dan kepada isteri-isteri beliau dan keturunannya, sebagaimana Engkau telah bershalawat kepada Ibrahim. Ya Allah, Berkahilah Muhammad dan isteri-isteri dan keturunannya, sebagaimana Engkau telah memberkahi.” (1) “Ya Allah berilah shalawat kepada Muhammad yang ummi dan kepada keluarga Muhammad, sebagaimana Engkau telah memberi bershalawat kepada Ibrahim dan keluarga Ibrahim.Dan berkahilah Muhammad Nabi yang ummi dan keluarga Muhammad sebagaimana Engkau telah memberkahi keluarga Ibrahim dan keluarga Ibrahim, Sesungguhnya Engkau Maha Terpuji (lagi) Maha Mulia” (2) “ya Allah, semoga shalawat tercurah kepada Muhammad dan keluarga Muhammad, dan semoga berkah tercurah kepada Muhammad dan keluarga Muhammad sebagaimana tercurah pada Ibrahim dan keluarga Ibrahim di alam semesta, sesungguhnya Engkau Maha Terpuji lagi Maha Mulia.” (1)',
  },
];

// Dzikir Setelah Sholat — transcribed programmatically from bekalislam.online/dzikir-doa's
// own per-item HTML fragments (dzikirdoa_new/dzikir-setelah-sholat/*.html), same method as
// dzikirPagi/dzikirPetang above, to avoid transcription errors. A handful of items on
// the source site have no distinct Arabic phrase of their own (a narrative note about
// what the Prophet did, or "no specific dzikir exists for this") — those are kept with
// an empty `arabic` and their note folded into `translation` instead of guessing at a
// verbatim recitation that doesn't exist. Still needs a human check against a mu'tabar
// reference before treating as final, same caution as the rest of this file.
export const dzikirSetelahSholat = [
  {
    title: 'Dzikir Setelah Sholat 1',
    arabic: 'أَسْتَغْفِرُ اللهَ اَللَّهُمَّ أَنْتَ السَّلاَمُ، وَمِنْكَ السَّلاَمُ، تَبَارَكْتَ يَا ذَا الْجَلاَلِ وَاْلإِكْرَامِ',
    latin: 'Astagh-firullah Allahumma antas salaam wa minkas salaam tabaarokta yaa dzal jalaali wal ikrom.',
    translation: 'Artinya : “Aku minta ampun kepada Allah,” “Ya Allah, Engkau Maha Selamat, dan dariMu keselamatan, Maha Suci Engkau, wahai Tuhan Yang Pemilik Keagungan dan Kemuliaan.” (2)',
  },
  {
    title: 'Dzikir Sholat 2',
    arabic: 'لاَ إِلَـهَ إِلاَّ اللهُ وَحْدَهُ لاَ شَرِيْكَ لَهُ، لَهُ الْمُلْكُ وَلَهُ الْحَمْدُ وَهُوَ عَلَى كُلِّ شَيْءٍ قَدِيْرُ، اَللَّهُمَّ لاَ مَانِعَ لِمَا أَعْطَيْتَ، وَلاَ مُعْطِيَ لِمَا مَنَعْتَ، وَلاَ يَنْفَعُ ذَا الْجَدِّ مِنْكَ الْجَدُّ',
    latin: 'Laa ilaha illallah wahdahu laa syarika lah, lahul mulku wa lahul hamdu wa huwa ‘ala kulli syai-in qodiir, Allahumma laa maani’a limaa a’thoyta wa laa mu’thiya limaa mana’ta wa laa yanfa’u dzal jaddi minkal jaddu.',
    translation: 'Artinya: “Tiada Rabb yang berhak disembah selain Allah Yang Maha Esa, tidak ada sekutu bagi-Nya. Bagi-Nya puji dan bagi-Nya kerajaan. Dia Maha Kuasa atas segala sesuatu. Ya Allah, tidak ada yang mencegah apa yang Engkau berikan dan tidak ada yang memberi apa yang Engkau cegah. Tidak berguna kekayaan dan kemuliaan itu bagi pemiliknya (selain iman dan amal shalihnya yang menyelamatkan dari siksaan). Hanya dari-Mu kekayaan dan kemuliaan” (1)',
  },
  {
    title: 'Dzikir Sholat 3',
    arabic: 'لاَ إِلَـهَ إِلاَّ اللهُ وَحْدَهُ لاَ شَرِيْكَ لَهُ، لَهُ الْمُلْكُ وَلَهُ الْحَمْدُ وَهُوَ عَلَى كُلِّ شَيْءٍ قَدِيْرُ. لاَ حَوْلَ وَلاَ قُوَّةَ إِلاَّ بِاللهِ، لاَ إِلَـهَ إِلاَّ اللهُ، وَلاَ نَعْبُدُ إِلاَّ إِيَّاهُ، لَهُ النِّعْمَةُ وَلَهُ الْفَضْلُ وَلَهُ الثَّنَاءُ الْحَسَنُ، لاَ إِلَـهَ إِلاَّ اللهُ مُخْلِصِيْنَ لَهُ الدِّيْنَ وَلَوْ كَرِهَ الْكَافِرُوْنَ',
    latin: 'Laa ilaha illallah wahdahu laa syarika lah. Lahul mulku wa lahul hamdu wa huwa ‘ala kulli syai-in qodiir. Laa hawla wa laa quwwata illa billah. Laa ilaha illallah wa laa na’budu illa iyyaah. Lahun ni’mah wa lahul fadhlu wa lahuts tsanaaul hasan. Laa ilaha illallah mukhlishiina lahud diin wa law karihal kaafiruun.',
    translation: 'Artinya: “Tiada sesembahan (yang berhak disembah) kecuali Allah, Yang Maha Esa, tidak ada sekutu bagi-Nya. Bagi-Nya kerajaan dan pujaan. Dia Mahakuasa atas segala sesuatu. Tidak ada daya dan kekuatan kecuali (dengan pertolongan) Allah. Tiada sesembahan (yang hak disembah) kecuali Allah. Kami tidak menyembah kecuali kepada-Nya. Hanya milik-Nya segal nikmat, anugerah dan pujaan yang baik. Tiada sesembahan (yang hak disembah) kecuali Allah, dengan memurnikan ibadah kepadaNya, sekalipun orang-orang kafir sama benci.” (1)',
  },
  {
    title: 'Dzikir Setelah Sholat 4',
    arabic: 'لاَ إِلَهَ إِلاَّ اللهُ وَحْدَهُ لاَ شَرِيْكَ لَهُ، لَهُ الْمُلْكُ وَلَهُ الْحَمْدُ يُحْيِيْ وَيُمِيْتُ وَهُوَ عَلَى كُلِّ شَيْءٍ قَدِيْرٌ',
    latin: 'Laa ilaha illallah wahdahu laa syarika lah. Lahul mulku wa lahul hamdu yuhyi wa yumiit wa huwa ‘ala kulli syai-in qodiir .',
    translation: '“Tiada Rabb yang berhak disembah kecuali Allah Yang Maha Esa, tiada sekutu bagiNya, bagiNya kerajaan, bagi-Nya segala puja. Dia-lah yang menghidupkan (orang yang sudah mati atau memberi roh janin yang akan dilahirkan) dan yang mematikan. Dia-lah Yang Mahakuasa atas segala sesuatu.” (1)',
  },
  {
    title: 'Dzikir Setelah Sholat 5',
    arabic: 'سُبْحَانَ اللهِ اَلْحَمْدُ لِلَّهِ اَللهُ أَكْبَرُ لاَ إِلَـهَ إِلاَّ اللهُ وَحْدَهُ لاَ شَرِيْكَ لَهُ، لَهُ الْمُلْكُ وَلَهُ الْحَمْدُ وَهُوَ عَلَى كُلِّ شَيْءٍ قَدِيْرُ',
    latin: 'Subhanallah (33x) Al hamdulillah (33x) Allahu akbar (33 x) Laa ilaha illallah wahdahu laa syarika lah. Lahul mulku wa lahul hamdu wa huwa ‘ala kulli syai-in qodiir.',
    translation: '"Maha Suci Allah." "Segala puji bagi Allah." "Allah Maha Besar." "Tidak ada Tuhan selain Allah, Dia satu-satunya, tidak ada sekutu bagi-Nya. Milik-Nya segala kerajaan dan bagi-Nya segala pujian, dan Dia Maha Kuasa atas segala sesuatu."',
  },
  {
    title: 'Dzikir Setelah Sholat 6',
    arabic: 'اللَّهُمَّ أَعِنِّيْ عَلَى ذِكْرِكَ وَشُكْرِكَ وَحُسْنِ عِبَادَتِكَ',
    latin: 'Allahumma a-’inniy ’ala dzikrika wa syukrika wa husni ’ibaadatika.',
    translation: '“Ya Allah, tolonglah aku untuk berdzikir kepada-Mu, bersyukur kepada-Mu, serta beribadah dengan baik kepada-Mu.” (2)',
  },
  {
    title: 'Dzikir Sholat 7',
    arabic: 'اللَّهُ لَا إِلَهَ إِلَّا هُوَ الْحَيُّ الْقَيُّومُ لَا تَأْخُذُهُ سِنَةٌ وَلَا نَوْمٌ لَهُ مَا فِي السَّمَاوَاتِ وَمَا فِي الْأَرْضِ مَنْ ذَا الَّذِي يَشْفَعُ عِنْدَهُ إِلَّا بِإِذْنِهِ يَعْلَمُ مَا بَيْنَ أَيْدِيهِمْ وَمَا خَلْفَهُمْ وَلَا يُحِيطُونَ بِشَيْءٍ مِنْ عِلْمِهِ إِلَّا بِمَا شَاءَ وَسِعَ كُرْسِيُّهُ السَّمَاوَاتِ وَالْأَرْضَ وَلَا يَئُودُهُ حِفْظُهُمَا وَهُوَ الْعَلِيُّ الْعَظِيمُ',
    latin: 'Allahu laa ilaaha illaa huwal hayyul qoyyuum, laa ta’khudzuhuu sinatuw walaa naum. Lahuu maa fissamaawaati wa maa fil ardli man dzal ladzii yasyfa’u ‘indahuu illaa biidznih, ya’lamu maa baina aidiihim wamaa kholfahum wa laa yuhiithuuna bisyai’im min ‘ilmihii illaa bimaa syaa’ wasi’a kursiyyuhus samaawaati wal ardlo walaa ya’uuduhuu hifdhuhumaa wahuwal ‘aliyyul ‘adhiim.',
    translation: '“Allah, tidak ada ilah (yang berhak disembah) melainkan Dia, yang hidup kekal lagi terus menerus mengurus (makhluk-Nya). Dia tidak mengantuk dan tidak tidur. Kepunyaan-Nya apa yang di langit dan di bumi. Tiada yang dapat memberi syafa’at di sisi-Nya tanpa seizin-Nya. Dia mengetahui apa-apa yang di hadapan mereka dan di belakang mereka. Mereka tidak mengetahui apa-apa dari ilmu Allah melainkan apa yang dikehendaki-Nya. Kursi Allah meliputi langit dan bumi. Dia tidak merasa berat memelihara keduanya. Dan Dia Maha Tinggi lagi Maha besar.” (1)',
  },
  {
    title: 'Dzikir Setelah Sholat 8',
    arabic: 'Membaca surat Al-Ikhlas, Al-Falaq dan An-Naas setiap selesai shalat (fardhu)',
    latin: 'sebagaimana yang diriwayatkan oleh shahabat uqbah ibn ‘amir عَنْ عُقْبَةَ بْنِ عَامِرٍ، أَنَّهُ قَالَ: " أَمَرَنِي رَسُولُ اللهِ صَلَّى اللهُ عَلَيْهِ وَسَلَّمَ أَنْ أَقْرَأَ بِالْمُعَوِّذَاتِ فِي دُبُرِ كُلِّ صَلَاةٍ " dari uqbah ibn ‘amir bahwasanya rasulullah -shallallahu ‘alaihi wa sallam- memerintahkanku untuk membaca mu’awwidzaat (al ikhlas, al falaq, dan an nas) setiap selesai sholat. ([() HR. Ahmad Dalam Musnadnya 28/634 No. 1741.])',
    translation: 'sebagaimana yang diriwayatkan oleh shahabat uqbah ibn ‘amir عَنْ عُقْبَةَ بْنِ عَامِرٍ، أَنَّهُ قَالَ: " أَمَرَنِي رَسُولُ اللهِ صَلَّى اللهُ عَلَيْهِ وَسَلَّمَ أَنْ أَقْرَأَ بِالْمُعَوِّذَاتِ فِي دُبُرِ كُلِّ صَلَاةٍ " dari uqbah ibn ‘amir bahwasanya rasulullah -shallallahu ‘alaihi wa sallam- memerintahkanku untuk membaca mu’awwidzaat (al ikhlas, al falaq, dan an nas) setiap selesai sholat. ([() HR. Ahmad Dalam Musnadnya 28/634 No. 1741.])',
  },
  {
    title: 'Dzikir Setelah Sholat 9',
    arabic: 'اَللَّهُمَّ إِنِّيْ أَسْأَلُكَ عِلْمًا نَافِعًا، وَرِزْقًا طَيِّبًا، وَعَمَلاً مُتَقَبَّلاً',
    latin: 'Allahumma inni as-aluka ‘ilman naafi’a, wa rizqon thoyyiba, wa ‘amalan mutaqobbala',
    translation: 'Artinya: “Ya Allah, sungguh aku memohon kepada-Mu ilmu yang bermanfaat (bagi diriku dan orang lain), rizki yang halal dan amal yang diterima (di sisi-Mu dan mendapatkan ganjaran yang baik)” (2)',
  },
  {
    title: 'Bacaan Setelah Sholat Witir',
    arabic: 'سُبْحَانَ الْمَلِكِ الْقُدُّوسِ، سُبْحَانَ الْمَلِكِ الْقُدُّوسِ، سُبْحَانَ الْمَلِكِ الْقُدُّوسِ',
    latin: 'Subhaanal Malikil qudduus',
    translation: 'Maha suci Allah, Sang Raja, Maha Suci (1)',
  },
  {
    title: 'Dzikir Setelah Dhuha',
    arabic: 'اللَّهُمَّ اغْفِرْ لِي، وَتُبْ عَلَيَّ، إِنَّكَ أَنْتَ التَّوَّابُ الرَّحِيمُ',
    latin: 'Allahummagh fir lii wa tub álayya, innaka antat tawwaabur rohiim',
    translation: '“Ya Allah ampunilah aku dan terimalah taubatku, sesungguhnya Engkau adalah maha penerima taubat dan maha penyayang” (2)',
  },
  {
    title: 'Dzikir Sholat Sunah',
    translation: 'Hadits Ibnu ‘Abbas beliau berkata: سَمِعْتُ رَسُولَ اللهِ صَلَّى اللَّهُ عَلَيْهِ وَسَلَّمَ يَقُولُ لَيْلَةً حِينَ فَرَغَ مِنْ صَلاَتِهِ: اللَّهُمَّ إِنِّي أَسْأَلُكَ رَحْمَةً مِنْ عِنْدِكَ تَهْدِي بِهَا قَلْبِي، وَتَجْمَعُ بِهَا أَمْرِي، وَتَلُمُّ بِهَا شَعَثِي، وَتُصْلِحُ بِهَا غَائِبِي، وَتَرْفَعُ بِهَا شَاهِدِي، وَتُزَكِّي بِهَا عَمَلِي، وَتُلْهِمُنِي بِهَا رُشْدِي، وَتَرُدُّ بِهَا أُلْفَتِي، وَتَعْصِمُنِي بِهَا مِنْ كُلِّ سُوءٍ، اللَّهُمَّ أَعْطِنِي إِيمَانًا وَيَقِينًا لَيْسَ بَعْدَهُ كُفْرٌ، وَرَحْمَةً أَنَالُ بِهَا شَرَفَ كَرَامَتِكَ فِي الدُّنْيَا وَالآخِرَةِ، اللَّهُمَّ إِنِّي أَسْأَلُكَ الفَوْزَ فِي الْقَضَاءِ، وَنُزُلَ الشُّهَدَاءِ، وَعَيْشَ السُّعَدَاءِ، وَالنَّصْرَ عَلَى الأَعْدَاءِ، اللَّهُمَّ إِنِّي أُنْزِلُ بِكَ حَاجَتِي، وَإِنْ قَصُرَ رَأْيِي وَضَعُفَ عَمَلِي، افْتَقَرْتُ إِلَى رَحْمَتِكَ، فَأَسْأَلُكَ يَا قَاضِيَ الأُمُورِ، وَيَا شَافِيَ الصُّدُورِ، كَمَا تُجِيرُ بَيْنَ البُحُورِ أَنْ تُجِيرَنِي مِنْ عَذَابِ السَّعِيرِ، وَمِنْ دَعْوَةِ الثُّبُورِ، وَمِنْ فِتْنَةِ القُبُورِ، اللَّهُمَّ مَا قَصُرَ عَنْهُ رَأْيِي، وَلَمْ تَبْلُغْهُ نِيَّتِي، وَلَمْ تَبْلُغْهُ مَسْأَلَتِي مِنْ خَيْرٍ وَعَدْتَهُ أَحَدًا مِنْ خَلْقِكَ، أَوْ خَيْرٍ أَنْتَ مُعْطِيهِ أَحَدًا مِنْ عِبَادِكَ، فَإِنِّي أَرْغَبُ إِلَيْكَ فِيهِ، وَأَسْأَلُكَهُ بِرَحْمَتِكَ رَبَّ العَالَمِينَ، اللَّهُمَّ ذَا الحَبْلِ الشَّدِيدِ، وَالأَمْرِ الرَّشِيدِ، أَسْأَلُكَ الأَمْنَ يَوْمَ الوَعِيدِ، وَالجَنَّةَ يَوْمَ الخُلُودِ، مَعَ الْمُقَرَّبِينَ الشُّهُودِ الرُّكَّعِ، السُّجُودِ الْمُوفِينَ بِالعُهُودِ، إِنَّكَ رَحِيمٌ وَدُودٌ، وإِنَّكَ تَفْعَلُ مَا تُرِيدُ، اللَّهُمَّ اجْعَلْنَا هَادِينَ مُهْتَدِينَ، غَيْرَ ضَالِّينَ وَلاَ مُضِلِّينَ، سِلْمًا لأَوْلِيَائِكَ، وَعَدُوًّا لأَعْدَائِكَ، نُحِبُّ بِحُبِّكَ مَنْ أَحَبَّكَ، وَنُعَادِي بِعَدَاوَتِكَ مَنْ خَالَفَكَ، اللَّهُمَّ هَذَا الدُّعَاءُ وَعَلَيْكَ الإِجَابَةُ، وَهَذَا الجُهْدُ وَعَلَيْكَ التُّكْلاَنُ، اللَّهُمَّ اجْعَلْ لِي نُورًا فِي قَلْبِي، وَنُورًا فِي قَبْرِي، وَنُورًا مِنْ بَيْنِ يَدَيَّ، وَنُورًا مِنْ خَلْفِي، وَنُورًا عَنْ يَمِينِي، وَنُورًا عَنْ شِمَالِي، وَنُورًا مِنْ فَوْقِي، وَنُورًا مِنْ تَحْتِي، وَنُورًا فِي سَمْعِي، وَنُورًا فِي بَصَرِي، وَنُورًا فِي شَعْرِي، وَنُورًا فِي بَشَرِي، وَنُورًا فِي لَحْمِي، وَنُورًا فِي دَمِي، وَنُورًا فِي عِظَامِي، اللَّهُمَّ أَعْظِمْ لِي نُورًا، وَأَعْطِنِي نُورًا، وَاجْعَلْ لِي نُورًا، سُبْحَانَ الَّذِي تَعَطَّفَ العِزَّ وَقَالَ بِهِ، سُبْحَانَ الَّذِي لَبِسَ الْمَجْدَ وَتَكَرَّمَ بِهِ، سُبْحَانَ الَّذِي لاَ يَنْبَغِي التَّسْبِيحُ إِلاَّ لَهُ، سُبْحَانَ ذِي الفَضْلِ وَالنِّعَمِ، سُبْحَانَ ذِي الْمَجْدِ وَالكَرَمِ، سُبْحَانَ ذِي الجَلاَلِ وَالإِكْرَامِ. “Ya Allah, aku memohon rahmat dari sisiMu, dengannya Engkau memberikan petunjuk kepada hatiku, dan dengannya Engkau kumpulkan urusanku, dengannya Engkau cela kekacauanku, dan dengannya Engkau perbaiki apa yang tidak nampak dariku, dan dengannya Engkau angkat apa yang nampak padaku, dengannya Engkau mensucikan amalanku, dengannya Engkau mengilhami pikiranku, dan dengannya Engkau kembali kelembutanku, dengannya Engkau melindungiku dari segala keburukan. Ya Allah, berikan kepadaku keimanan dan keyakinan yang tidak ada kekafiran setelahnya, serta rahmat yang dengannya aku peroleh kemuliaan-Mu di dunia dan akhirat. Ya Allah, aku memohon kepadaMu keberuntungan mendapatkan pemberianMu, serta hidangan orang-orang yang mati syahid, kehidupan orang-orang yang berbahagia, dan kemenangan atas musuh. Ya Allah kepadaMu aku sampaikan hajatku, walaupun terbatas penglihatanku, serta lemah amalanku. Aku butuh kepada rahmatMu, maka aku memohon kepadaMu wahai Dzat Yang Maha Mampu menyelesaikan segala perkara, wahai Dzat yang mengobati hatiku, sebagaimana Engkau melindungi diantara lautan aku mohon agar Engkau lindungi aku dari adzab Neraka Sa\'ir, serta seruan kebinasaan, serta fitnah kubur. Ya Allah, apa yang tidak mampu terlihat oleh pandanganku, dan tidak dicapai oleh niatku, serta tidak sampai permintaanku dari kebaikan yang telah Engkau janjikan kepada seseorang diantara makhlukMu, atau kebaikan yang Engkau berikan kepada seseorang diantara hamba-hambaMu, maka menginginkan dan memohonnya kepadaMu dengan rahmatMu, wahai Tuhan semesta alam. Ya Allah Yang memiliki tali (agama) yang kuat, dan perkara yang lurus, aku memohon kepadaMu keamanan pada hari yang penuh dengan ancaman, serta Surga pada hari yang kekal bersama orang-orang yang dekat, yang mati syahid, yang banyak melakukan ruku\' dan sujud, serta yang senantiasa memenuhi janji, sesungguhnya Engkau Maha Pengasih dan Penyayang. Engkau mampu melakukan apa yang Engkau kehendaki. Ya Allah, jadikanlah kami orang-orang yang memberi petunjuk dan mendapatkan petunjuk, yang tidak tersesat dan menyesatkan, menyerah kepada para waliMu dan memusuhi musuh-musuhMu. Kami mencintai dengan kecintaanMu kepada orang yang mencintaiMu dan memusuhi dengan permusuhanMu kepada orang yang menyelisihiMu. Ya Allah, inilah doa yang mampu aku panjatkan dan kabulkanlah doa tersebut, dan inilah usahaku dan kepadaMu aku bersandar. Ya Allah berikanlah cahaya dalam hatiku dan cayaha dalam kuburku, cahaya di hadapanku, cahaya dari belakangku, cahaya dari kananku, cahaya dari kiriku, cahaya dari atasku, atasku, cahaya dari bawahku, cahaya dalam pendengaranku, cahaya dalam penglihatanku, cahaya dalam rambutku, cahaya dalam kulitku, cahaya dalam dagingku, cahaya dalam darahku, dan cahaya dalam tulangku. Ya Allah, perbesarkan cahaya untukku, berilah aku cahaya dan jadikan untukku cahaya. Maha Suci Dzat Yang memberikan kemuliaan dan berfirman dengan kemuliaan. Maha Suci dzat yang memiliki keagungan, dan memberi dengan keagungan. Maha Suci Dzat yang tidak sepantas untuk memuji kecuali kepadaNya, Dzat Yang memiliki karunia dan kenikmatan. Maha Suci Dzat yang memiliki keagungan dan kemurahan, Maha Suci Dzat Yang memiliki kebesaran dan kemuliaan”(H.R. Attirmidzi No.3419). Hadits ini dinyatakan bathil oleh imam Ibnu Hibban (Al Majruhin, Ibnu Hibban, 5/276) dan dinyatakan munkar oleh imam Adz-Dzahabi (Siyar A’lam Annubala, 5/444), serta dinyatakan dho’if oleh Syaikh Al Albani. (Silsilah Ahadits Ad-Dho’ifah No.2916) ]) dan setelah shalat ba’diyah maghrib([() Hadits Ummu Salamah beliau berkata: كَانَ رَسُولُ اللَّهِ صَلَّى اللهُ عَلَيْهِ وَسَلَّمَ إِذَا انْصَرَفَ مِنْ صَلَاةِ الْمَغْرِبِ يَدْخُلُ فَيُصَلِّي رَكْعَتَيْنِ، ثُمَّ يَقُولُ فِيمَا يَدْعُو: «يَا مُقَلِّبَ الْقُلُوبِ، ثَبِّتْ قُلُوبَنَا عَلَى دِينِكَ». فَقُلْتُ: يَا رَسُولَ اللَّهِ، أَتَخْشَى عَلَى قُلُوبِنَا مِنْ شَيْءٍ؟ قَالَ: «مَا مِنْ إِنْسَانٍ إِلَّا قَلْبُهُ بَيْنَ أُصْبُعَيْنِ مِنْ أَصَابِعِ اللَّهِ عَزَّ وَجَلَّ، فَإِنِ اسْتَقَامَ أَقَامَهُ، وَإِنْ أَزَاغَ أَزَاغَهُ» “Adalah Rasulullah shallallahu \'alaihi wasallam apabila selesai dari shalat maghrib beliau masuk dan shalat dua rakaat kemudian berdo’a: “Wahai dzat yang membolak balikkan hati, kokohkanlah hati kami di atas agamaMu” kemudian aku bertanya kepada beliau: “Wahai Rasulullah shallallahu \'alaihi wasallam apakah engkau khawatir sesuatu akan mengenai (mengganggu) hati kita? Beliau menjawab: “tidak ada satu orangpun dari kalangan manusia kecuali hatinya berada di antara dua jemari Allah azza wa jalla apabila ia lurus maka Allah azza wa jalla luruskan dan apabila melenceng maka Allah azza wa jalla palingkan” (H.R. Ibnu Assunni, ‘Amalul Yaumi Wa Allailah No.658). Hadits ini maudhu’ (palsu), karena ada perowi yang bernama ‘Atho’ bin ‘Ajlan, dan dia adalah perowi yang matruk. Berkata imam Ibnu Hajar Al ‘Asqolani: عطاء بن عَجْلان الحَنَفي، أبو محمدٍ البصري، العَطّار: متروكٌ، بل أَطلَقَ عليه ابنُ مَعِين والفَلّاس وغيرُهما الكَذبَ، “‘Atho’ bin ‘Ajlan Al Hanafi, Abu Muhammad Al Bashri Al ‘Atthor: Matruk, bahkan Ibnu Ma’in dan Al Fallas memuthlaqkan shifat dusta kepadanya” (Taqrib Attahdzib, Ibnu Hajar, No.4594). Dan beliau berkata: “Dan ‘Atho’, mereka (para ahli hadits) menyatakan bahwa dia pendusta. Dan telah sampai kepadaku dari jalur yang lain dengan sanad yang hasan dari Ummu Salamah tanpa ada penjelasan waktu beliau membacanya”. (Nataij Al Afkar, Ibnu Hajar, 3/13) Karenanya untuk shalat-shalat sunnah yang lainnya (selain witir dan dhuha), maka para ulama berpeda pendapat tentang dzikir yang dibaca setelahnya. Pendapat pertama: Tidak ada satupun bacaan khusus yang disunnahkan setelah shalat sunnah. Dan ini adalah pendapat yang dipegang oleh syaikh Muhammad bin shalih Al ‘Utsaimin. Asy-Syaikh Al ‘Utsaimin berkata: الذي يظهر لي من السنة أن الاستغفار وقول اللهم أنت السلام ومنك السلام وبقية الأذكار إنما تكون في الفريضة فقط لأن الذين صلوا مع النبي صلى الله عليه وسلم صلاة الليل لم يذكروا إنه فعل ذلك بعد أن ختم صلاته لكن جاء حديث ورد عن النبي صلى الله عليه وسلم إذا سلم من الوتر أن يقول سبحان الملك القدوس ثلاث مرات يمد صوته في الثالثة. “Yang nampak bagi saya dari hadits-hadits yang ada bahwa istighfar dan ucapan “Allahumma antassalam waminkassalam” dan dzikir-dzikir yang lain hanya untuk shalat fardhu saja, karena para sahabat yang shalat bersama Rasulullah shallallahu \'alaihi wasallam di malam hari tidak menyebutkan hal itu (Rasulullah shallallahu \'alaihi wasallam membaca dzikir-dzikir tertentu) setelah selesai mengerjakan shalat beliau. Hanya saja di sana terdapat hadits yang menyebutkan bahwa Rasulullah shallallahu \'alaihi wasallam ketika selesai dari shalat witir beliau membaca (subahanal Malikil Quddus) sebanyak tiga kali dan beliau memanjangkan suaranya di kali yang ketiga”. ([() Fatawa Nur ‘Ala Addarbi, Ibnu ‘Utsimin, 8/2]) Dan Syaikh Muhammad bin Shalih Al ‘Utsaimin berpendapat demikian karena menafsiran semua hadits yang menerangkan bahwa Rasulullah shallallahu \'alaihi wasallam membaca dzikir-dzikir tertentu setelah shalat adalah shalat fardhu bukan umum semua shalat. Pendapat kedua: Disunnahkan membaca “istighfar dan dzikir “Allahumma Antassalam Waminkassalam Tabarokta Ya Dzal Jalali Wal Ikrom” saja, dan tidak ada yang lainnya. Dan ini adalah pendapat yang dipegang oleh Syaikh Ibnu Bazz. Beliau berkata: أما بعد النوافل ليس هناك إلا الاستغفار، إذا سلم في النافلة يقول: أستغفر الله، أستغفر الله، أستغفر الله، اللهم أنت السلام ومنك السلام، تباركت يا ذا الجلال والإكرام. أما الأذكار الأخرى كلها جاءت بعد الفريضة، أما هذا بعد الفرض والنفل “Adapun setelah shalat sunnah, maka tidak ada bacaan khusus kecuali istighfar, jika ia selesai dari shalatnya maka ia membaca: “Astaghfirullah 3x, Allahumma Antassalam Waminkassalam Tabarokta Ya Dzal Jalali Wal Ikrom” adapun dzikir-dzikir yang lainnya, maka hadits-hadits yang sampai semuanya untuk setelah shlat fardhu, adapun dzikir ini maka untuk shalat fardhu dan sunnah”. ([() Fatawa Nur ‘Ala Addarbi, Ibnu Baz, 9/113]) Dan Syaikh Ibnu Baz berdalil dengan keumuman hadits Tsauban: كَانَ رَسُولُ اللهِ صَلَّى اللهُ عَلَيْهِ وَسَلَّمَ، إِذَا انْصَرَفَ مِنْ صَلَاتِهِ اسْتَغْفَرَ ثَلَاثًا وَقَالَ: «اللهُمَّ أَنْتَ السَّلَامُ وَمِنْكَ السَّلَامُ، تَبَارَكْتَ ذَا الْجَلَالِ وَالْإِكْرَامِ» قَالَ الْوَلِيدُ: فَقُلْتُ لِلْأَوْزَاعِيِّ: " كَيْفَ الْاسْتِغْفَارُ؟ قَالَ: تَقُولُ: أَسْتَغْفِرُ اللهَ، أَسْتَغْفِرُ اللهَ " “Adalah Rasulullah shallallahu \'alaihi wasallam apabila beliau selesai dari salam ketika selesai shalat beliau beristighfar 3x dan mengucapkan “Allahumma Antassalam Waminkassalam Tabarokta Ya Dzal Jalali Wal Ikrom” Al Walid berkata: dan aku bertanya kepada Al Auza’i: bagaimana istighfarnya? Beliau menjawab: engkau membaca: “Astaghfirullah, Astaghfirullah”. ([() H.R. Muslim No.591]) Pendapat yang lebih kuat -menurut penulis- adalah pendapat syaikh al-Utsaimin bahwasanya untuk shalat-shalat sunnah (selain shalat dhuha dan shalat witir) maka tidak ada dzikir khusus setelah shalat. Hal ini dikuatkan bahwa ada beberapa riwayat tentang dizkir-dizkir setelah shalat yang secara dzhahir lafalnya bisa dipahami bahwa boleh dibaca setelah shalat fardu dan shalat sunnah, akan tetapi para ulama tetap memahaminya bahwa dzikir-dzikir tersebut dibaca setelah shalat wajib([() Diantara riwayat-riwayat tersebut : Pertama : Hadits Abu Huroiroh: «أَفَلاَ أُخْبِرُكُمْ بِأَمْرٍ تُدْرِكُونَ مَنْ كَانَ قَبْلَكُمْ، وَتَسْبِقُونَ مَنْ جَاءَ بَعْدَكُمْ، وَلاَ يَأْتِي أَحَدٌ بِمِثْلِ مَا جِئْتُمْ بِهِ إِلَّا مَنْ جَاءَ بِمِثْلِهِ؟ تُسَبِّحُونَ فِي دُبُرِ كُلِّ صَلاَةٍ عَشْرًا، وَتَحْمَدُونَ عَشْرًا، وَتُكَبِّرُونَ عَشْرًا» “Maukah kalian aku kabarkan tentang sesuatu yang mana dengannya kalian bisa mengimbangi orang yang telah mendahului kalian dan kalian bisa mengungguli orang yang datang setelah kalian dan tidak akan ada yang bisa mengimbangi kalian kecuali jika orang tersebut melakukan apa yang kalian? Hendaklah di setiap setelah shalat kalian membaca tasbih 10x dan hamdalah 10x dan takbir 10x”. (H.R. Bukhari No.6329, Muslim No.595) Kedua : Hadits Mu’adz bin Jabal: " أُوصِيكَ يَا مُعَاذُ لَا تَدَعَنَّ فِي دُبُرِ كُلِّ صَلَاةٍ تَقُولُ: اللَّهُمَّ أَعِنِّي عَلَى ذِكْرِكَ، وَشُكْرِكَ، وَحُسْنِ عِبَادَتِكَ " “Wahai Mu’adz, sungguh aku mewasiatkan kepadamu agar engkau tidak pernah meninggalkan bacaan: “Ya Allah azza wa jalla tolonglah aku untuk selalu mengingatMu, dan bersyukur kepadaMu dan selalu memperbaiki ibadahku kepadaMu” (H.R. Abu Dawud No.1522 dan dishohihkan oleh syaikh Al Albani.) Ketiga : Hadits A’isyah: مَا جَلَسَ رَسُولُ اللهِ صَلَّى اللهُ عَلَيْهِ وَسَلَّمَ مَجْلِسًا قَطُّ، وَلَا تَلَا قُرْآنًا، وَلَا صَلَّى صَلَاةً إِلَّا خَتَمَ ذَلِكَ بِكَلِمَاتٍ قَالَتْ: فَقُلْتُ: يَا رَسُولَ اللهِ، أَرَاكَ مَا تَجْلِسُ مَجْلِسًا، وَلَا تَتْلُو قُرْآنًا، وَلَا تُصَلِّي صَلَاةً إِلَّا خَتَمْتَ بِهَؤُلَاءِ الْكَلِمَاتِ؟ قَالَ: " نَعَمْ، مَنْ قَالَ خَيْرًا خُتِمَ لَهُ طَابَعٌ عَلَى ذَلِكَ الْخَيْرِ، وَمَنْ قَالَ شَرًّا كُنَّ لَهُ كَفَّارَةً: سُبْحَانَكَ وَبِحَمْدِكَ، لَا إِلَهَ إِلَّا أَنْتَ، أَسْتَغْفِرُكَ وَأَتُوبُ إِلَيْكَ " “Tidaklah Rasulullah shallallahu \'alaihi wasallam duduk di suatu majlis dan tidaklah beliau membaca Al quran, dan tidaklah beliau shalat kecuali beliau mengakhirinya dengan bacaan, lalu aku bertanya kepadanya: Wahai Rasulullah shallallahu \'alaihi wasallam tidaklah aku melihatmu setiap kali duduk di suatu majlis, dan membaca Al quran dan shalat kecuali engkau membaca bacaan tersebut? Beliau menjawab: Ya, barang siapa mengucapkan kebaikan maka ditulis baginya kebaikan tersebut, dan barang siapa yang mengucapkan yang tidak baik maka bacaan itu menjadi kaffarohnya: Subhanaka Wabihamdika La Ilaha Illa Anta Astaghfiruka Wa Atubu Ilaika” (Sunan Al Kubro Annasai No.10067 dan dishohihkan oleh imam Ibnu Hajar Al ‘Asqolani di dalam kitab Annukat ‘Ala Kitab Ibni Sholah, 2/733, syaikh Al Albani di dalam kitab Silsilah Ahadits Shohihah No.3164 dan beliau menukilakn bahwa Syaikh Robi’ menghasankan hadits ini, dan juga dishohihkan oleh syaikh Muqbil bin Hadi Al Wadi’I di dalam kitab Al Jami’ Asshohih Mimma Laisa Fisshohihain No.995). Dan hadits ini termaasuk hadits yang paling kuat di antara hadits-hadits yang menunjukkan bahwa Rasulullah shallallahu \'alaihi wasallam membaca dzikir khusus setelah shalat sunnah, karena A’isyah tidak menyaksikan shalat wajibnya Rasulullah shallallahu \'alaihi wasallam, kecuali jika hadits ini dibawa kepada pemahaman bahwa Rasulullah shallallahu \'alaihi wasallam selalu mengeraskan dzikirnya setiap setelah shalat fardhu sehingga A’isyah dapat mendengarnya karena dekatnya rumah Rasulullah shallallahu \'alaihi wasallam dengan masjid. Keempat : Hadits ‘Uqbah bin ‘Amir: «أَمَرَنِي رَسُولُ اللَّهِ صَلَّى اللهُ عَلَيْهِ وَسَلَّمَ أَنْ أَقْرَأَ بِالْمُعَوِّذَاتِ دُبُرَ كُلِّ صَلَاةٍ» “Sesungguhnya Rasulullah shallallahu \'alaihi wasallam memerintahkanku agar aku senantiasa membaca Al Mu’awwidzat setiap kali selesai shalat”(H.R. Abu Dawud No.1523) Kelima : Hadits Mush’ab bin Sa’d dan ‘Amr bin Maimun: كَانَ سَعْدٌ، يُعَلِّمُ بَنِيهِ هَؤُلاَءِ الكَلِمَاتِ كَمَا يُعَلِّمُ الْمُكَتِّبُ الغِلْمَانَ وَيَقُولُ: إِنَّ رَسُولَ اللهِ صَلَّى اللَّهُ عَلَيْهِ وَسَلَّمَ كَانَ يَتَعَوَّذُ بِهِنَّ دُبُرَ الصَّلاَةِ: اللَّهُمَّ إِنِّي أَعُوذُ بِكَ مِنَ الجُبْنِ، وَأَعُوذُ بِكَ مِنَ البُخْلِ، وَأَعُوذُ بِكَ مِنْ أَرْذَلِ العُمُرِ، وَأَعُوذُ بِكَ مِنْ فِتْنَةِ الدُّنْيَا، وَعَذَابِ القَبْرِ. “Adalah Sa’d mengajari anak-anaknya bacaan ini sebagaimana guru mengajarkan anak-anak kecil dan beliau berkata: Sesungguhnya Rasulullah shallallahu \'alaihi wasallam senantiasa berlindung dari hal-hal tersebut setiap kali selesai shalat: “Ya Allah azza wa jalla sesunggunya aku berlindung kepadaMu dari sifat pengecut dan aku berlindung kepadaMu dari sifat kikir dan aku berlindung kepadaMu dari ‘umur yang hina dan aku berlindung kepadaMu dari fitnah dunia dan ‘adzab qubur” (H.R. Attirmidzi No.3567). Dan di sana ada ayat yang bisa dipahami secara umum: وَمِنَ اللَّيْلِ فَسَبِّحْهُ وَأَدْبَارَ السُّجُودِ “Dan bertasbihlah di Waktu malam dan setiap kali setelah shalat”(Q.S. Qaf: 40) Akan tetapi imam Ibnu Katsir berkata: Oleh karenanya Sunnah menganjurkan tasbih tahmid dan takbir setiap kali selesai shalat wajib. (Tafsir Ibnu Katsir, 1/505) Dan selain hadits-hadits di atas yang kontekasnya umum untuk setiap kali selesai shalat. Akan tetapi kebanyakan ‘Ulama menafsirkan bahwa semua hadits ini di pahami tentang bacaan setelah shalat fardhu dan bukan shalat sunnah, sebagimana yang dilakukan oleh imam Ibnu Hajar ketika beliau mensyarah sub judul Shohih Bukhori “bab doa setelah shalat” kemudian beliau mengatakan: yaitu shalat fardhu. (Fath Al Bari, Ibnu Hajar, 11/133 dan diantara hadits yang dibawakan adalah hadits wasiat Rasulullah shallallahu \'alaihi wasallam kepada Mu’adz.). Begitu juga yang dilakukan oleh Badruddin Al ‘Aini dan pensyarah kitab-kitab hadits selain mereka. Karenanya pendalilan Syaikh Ibnu Baz dengan keumuman dalil tersebut seharusnya berlaku juga pada semua hadits yang bermakna umum kecuali jika ada hadits yang mentaqyid. Namun kenyataannya para ulama memahami bahwa dzikir-dzikir tersebut hanya berlaku untuk selesai shalat fardlu. Dan termasuk dalil yang mengatakan tidak ada dzikir tertentu adalah semua hadits ini datang secara muthlaq dan kita kembalikan kepada tafsiran Rasulullah shallallahu \'alaihi wasallam dengan amalan beliau, dan ternyata beliau mengamalkannya hanya pada shalat-shalat wajib dan tidak pada shalat-shalat sunnah.]). Karenanya jika seseorang selesai shalat sunnah ia bebas untuk berdzikir dengan dzikir apapun tanpa harus melanggengkan dzikir tersebut, karena tidak ada dalil yang menunjukan dzikir khusus setelah shalat sunnah. Wallahu a’lam.',
  },
];

// Ketika Dalam Perjalanan — transcribed programmatically from bekalislam.online/dzikir-doa's
// own per-item HTML fragments (dzikirdoa_new/ketika-dalam-perjalanan/*.html), same method as
// dzikirPagi/dzikirPetang above, to avoid transcription errors. A handful of items on
// the source site have no distinct Arabic phrase of their own (a narrative note about
// what the Prophet did, or "no specific dzikir exists for this") — those are kept with
// an empty `arabic` and their note folded into `translation` instead of guessing at a
// verbatim recitation that doesn't exist. Still needs a human check against a mu'tabar
// reference before treating as final, same caution as the rest of this file.
export const doaPerjalanan = [
  {
    title: 'Doa Pulang Dari Pergi',
    arabic: 'اَللَّهُ أَكْبَرُ، اَللَّهُ أَكْبَرُ، اَللَّهُ أَكْبَرُ. لاَ إِلَـٰهَ إِلاَّ اللَّهُ وَحْدَهُ لاَ شَرِيْكَ لَهُ، لَهُ الْمُلْكُ وَلَهُ الْحَمْدُ وَهُوَ عَلَى كُلِّ شَيْءٍ قَدِيْرٌ. آيِبُوْنَ تَائِبُوْنَ عَابِدُوْنَ لِرَبِّنَا حَامِدُوْنَ، صَدَقَ اللَّهُ وَعْدَهُ وَنَصَرَ عَبْدَهُ وَهَزَمَ اْلأَحْزَابَ وَحْدَهُ',
    latin: '"Allaahu akbar (3x). Laa ilaaha illallaah, wahdahu laa syariika lah, lahul mulku wa lahul hamdu, wa huwa \'alaa kulli syai-in qodiir. Aayibuuna taa-ibuuna \'aabiduuna lirobbinaa haamiduun, shodaqollaahu wa\'dah, wa nashoro \'abdah, wa hazamal ahzaaba wahdah."',
    translation: '"Allah Maha Besar (3x). Tidak ada sesembahan yang berhak disembah kecuali Allah, Yang Maha Esa, tiada sekutu bagiNya. Bagi-Nya kerajaan dan pujaan. Dia-lah Yang Mahakuasa atas segala sesuatu. Kami kembali dengan bertaubat, beribadah dan memuji kepada Tuhan kami. Allah telah menepati janjiNya, membela hambaNya (Muhammad) dan mengalahkan golongan musuh dengan sendirian."',
  },
  {
    title: 'Doa Masuk Pasar (Pusat Keramaian)',
    arabic: 'لاَ إِلَـٰهَ إِلاَّ اللَّهُ وَحْدَهُ لاَ شَرِيْكَ لَهُ، لَهُ الْمُلْكُ وَلَهُ الْحَمْدُ يُحْيِيْ وَيُمِيْتُ وَهُوَ حَيٌّ لاَ يَمُوْتُ، بِيَدِهِ الْخَيْرُ، وَهُوَ عَلَى كُلِّ شَيْءٍ قَدِيْرٌ',
    latin: '"Laa ilaaha illallaah, wahdahu laa syariika lah, lahul mulku wa lahul hamd, yuhyii wa yumiit, wa huwa hayyun laa yamuut, biyadihil khoir, wa huwa \'alaa kulli syai-in qodiir."',
    translation: '"Tidak ada sesembahan yang berhak disembah kecuali Allah, Yang Maha Esa, tiada sekutu bagiNya. BagiNya kerajaan, bagiNya segala pujian. Dia-lah Yang Menghidupkan dan Yang Mematikan. Dia-lah Yang Hidup, tidak akan mati. Di tanganNya kebaikan. Dia-lah Yang Maha kuasa atas segala sesuatu."',
  },
  {
    title: 'Doa Musafir Menjelang Subuh',
    arabic: 'سَمَّعَ سَامِعٌ بِحَمْدِ اللَّهِ، وَحُسْنِ بَلاَئِهِ عَلَيْنَا. رَبَّنَا صَاحِبْنَا، وَأَفْضِلْ عَلَيْنَا عَائِذًا بِاللَّهِ مِنَ النَّارِ',
    latin: '"Samma\'a saami\'un bihamdillaah, wa husni balaa-ihi \'alainaa. robbanaa shoohibnaa, wa afdhil \'alainaa \'aa-idzan billaahi minan-naar."',
    translation: '"Hendaknya mendengar dan menyaksikan yang sampai kepadanya suara pujian kami kepada Allah (atas nikmat) dan pemberian yang baik bagi kami. Wahai Tuhan kami, peliharalah kami dan berilah karunia kepada kami dengan berlindung kepada Allah dari api neraka."',
  },
  {
    title: 'Doa Naik Kendaraan',
    arabic: 'بِسْمِ اللَّهِ، اَلْحَمْدُ لِلَّهِ (سُبْحَانَ الَّذِيْ سَخَّرَ لَنَا هَـٰذَا وَمَا كُنَّا لَهُ مُقْرِنِيْنَ. وَإِنَّا إِلَى رَبِّنَا لَمُنْقَلِبُوْنَ) اَلْحَمْدُ لِلَّهِ، اَلْحَمْدُ لِلَّهِ، اَلْحَمْدُ لِلَّهِ، اَللَّهُ أَكْبَرُ، اَللَّهُ أَكْبَرُ، اَللَّهُ أَكْبَرُ، سُبْحَانَكَ اللَّهُمَّ إِنِّيْ ظَلَمْتُ نَفْسِيْ فَاغْفِرْ لِيْ، فَإِنَّهُ لاَ يَغْفِرُ الذُّنُوْبَ إِلاَّ أَنْتَ',
    latin: '"Bismillaah, alhamdulillaah, (subhaanal-ladzii sakh-khoro lanaa haadzaa wa maa kunnaa lahu muqriniin. Wa innaa ilaa robbinaa lamunqolibuun), alhamdulillaah (3x), allaahu akbar (3x), subhaanakallaahumma innii zholamtu nafsii faghfir lii, fa-innahu laa yaghfirudz-dzunuuba illaa anta."',
    translation: '"Dengan nama Allah, segala puji bagi Allah, (Maha Suci Tuhan yang menundukkan kendaraan ini untuk kami, padahal kami sebelumnya tidak mampu menguasainya. Dan sesungguhnya kami akan kembali kepada Tuhan kami (di hari Kiamat)). Segala puji bagi Allah (3x), Allah Maha Besar (3x), Maha Suci Engkau ya Allah, sesungguhnya aku menganiaya diriku, maka ampunilah aku. Sesungguhnya tidak ada yang mengampuni dosa-dosa kecuali Engkau."',
  },
  {
    title: 'Doa Muqim (yang ditinggal) Kepada Musafir',
    arabic: 'زَوَّدَكَ اللَّهُ التَّقْوَى، وَغَفَرَ ذَنْبَكَ، وَيَسَّرَ لَكَ الْخَيْرَ حَيْثُ مَا كُنْتَ',
    latin: '"Zawwadakallaahut-taqwaa, wa ghofara dzanbaka, wa yassaro lakal khoiro haitsu maa kunta."',
    translation: '"Semoga Allah memberi bekal taqwa kepadamu, mengampuni dosamu dan memudahkan kebaikan kepadamu di mana saja kamu berada."',
  },
  {
    title: 'Doa Musafir Ditinggal',
    arabic: 'أَسْتَوْدِعُكُمُ اللهَ الَّذِي لاَ تَضِيعُ وَدَائِعُهُ',
    latin: '"Astaudi\'ukumullaahal-ladzii laa tadhii\'u wa daa-i\'uh."',
    translation: '"Aku menitipkan kalian kepada Allah yang tidak akan hilang titipan (yang dititipkan kepada)Nya."',
  },
];

// Musibah & Kesempitan — transcribed programmatically from bekalislam.online/dzikir-doa's
// own per-item HTML fragments (dzikirdoa_new/musibah-dan-kesempitan/*.html), same method as
// dzikirPagi/dzikirPetang above, to avoid transcription errors. A handful of items on
// the source site have no distinct Arabic phrase of their own (a narrative note about
// what the Prophet did, or "no specific dzikir exists for this") — those are kept with
// an empty `arabic` and their note folded into `translation` instead of guessing at a
// verbatim recitation that doesn't exist. Still needs a human check against a mu'tabar
// reference before treating as final, same caution as the rest of this file.
export const doaMusibah = [
  {
    title: 'Doa Ketika Mengalami Kesulitan',
    arabic: 'اَللَّهُمَّ لاَ سَهْلَ إِلاَّ مَا جَعَلْتَهُ سَهْلاً، وَأَنْتَ تَجْعَلُ الْحَزْنَ إِذَا شِئْتَ سَهْلاً اَللَّهُمَّ رَحْمَتَكَ أَرْجُو، فَلاَ تَكِلْنِيْ إِلَى نَفْسِيْ طَرْفَةَ عَيْنٍ، وَأَصْلِحْ لِيْ شَأْنِيْ كُلَّهُ، لاَ إِلَـٰهَ إِلاَّ أَنْتَ لاَ إِلَـٰهَ إِلاَّ أَنْتَ سُبْحَانَكَ إِنِّيْ كُنْتُ مِنَ الظَّالِمِيْنَ اَللَّهُ اللَّهُ رَبِّي، لاَ أُشْرِكُ بِهِ شَيْئًا لاَ إِلَـٰهَ إِلاَّ اللَّهُ الْعَظِيْمُ الْحَلِيْمُ، لاَ إِلَـٰهَ إِلاَّ اللَّهُ رَبُّ الْعَرْشِ الْعَظِيْمِ، لاَ إِلَـٰهَ إِلاَّ اللَّهُ رَبُّ السَّمَاوَاتِ وَرَبُّ اْلأَرْضِ وَرَبُّ الْعَرْشِ الْكَرِيْمِ',
    latin: '“Allahumma laa sahla illaa maa ja\'altahu sahlan, wa anta taj\'alul hazna idzaa syi\'ta “Allaahumma rohmataka arjuu, falaa takilnii ilaa nafsii thorfata \'ain, wa ashlih lii sya\'nii kullah, laa ilaaha illaa anta.” “Laa ilaaha illaa anta, subhaanaka, innii kuntu minazh-zhoolimiin.” “Allaah Allaah robbii, laa usyriku bihi syai-an.” “Laa ilaaha illallaahul \'azhiimul haliim, laa ilaaha illallaahu robbul \'arsyil \'azhim, laa ilaaha illallaahu robbus-samaawaati wa robbul ardhi wa robbul \'arsyil kariim.”',
    translation: '“Ya Allah, tidak ada kemudahan kecuali apa yang Engkau jadikan mudah. Sedang yang susah bisa Engkau jadikan mudah, apabila Engkau menghendakinya.”(1) “Ya Allah, rahmatMu yang aku harapkan, maka jangan Engkau serahkan urusanku kepada diriku meskipun sekejap mata (tanpa pertolongan atau rahmat dariMu). Perbaikilah seluruh urusanku, tidak ada sesembahan yang berhak disembah kecuali Engkau.”(2) “Tidak ada sesembahan yang berhak disembah kecuali Engkau. Maha Suci Engkau. Sesungguhnya aku termasuk orang-orang yang zalim.”(3) “Allah, Allah adalah Tuhanku. Aku tidak menyekutukanNya dengan sesuatupun.”(4) “Tidak ada sesembahan yang berhak disembah kecuali Allah Yang Maha Agung dan Maha Lembut. Tidak ada sesembahan yang berhak disembah kecuali Allah, Tuhan yang menguasai arsy, yang Maha Agung. Tidak ada sesembahan yang berhak disembah kecuali Allah, Tuhan yang menguasai langit dan bumi. Tuhan Yang menguasai arsy, lagi Maha Mulia.”(5)',
  },
  {
    title: 'Doa Ketika Sedih Atau Galau',
    arabic: 'اَللَّهُمَّ إِنِّيْ عَبْدُكَ، وَابْنُ عَبْدِكَ، وَابْنُ أَمَتِكَ(أَمَتُكَ وَابْنَةُ عَبْدِكَ وَابْنَةُ أَمَتِكَ) ، نَاصِيَتِيْ بِيَدِكَ، مَاضٍ فِيَّ حُكْمُكَ، عَدْلٌ فِيَّ قَضَاؤُكَ، أَسْأَلُكَ بِكُلِّ اسْمٍ هُوَ لَكَ، سَمَّيْتَ بِهِ نَفْسَكَ، أَوْ أَنْزَلْتَهُ فِيْ كِتَابِكَ، أَوْ عَلَّمْتَهُ أَحَدًا مِنْ خَلْقِكَ، أَوِ اسْتَأْثَرْتَ بِهِ فِيْ عِلْمِ الْغَيْبِ عِنْدَكَ، أَنْ تَجْعَلَ الْقُرْآنَ رَبِيْعَ قَلْبِيْ، وَنُوْرَ صَدْرِيْ، وَجَلاَءَ حُزْنِيْ، وَذَهَابَ هَمِّيْ ـ',
    latin: '“Allaahumma innii \'abduka, wabnu \'abdika, wabnu amatika (jika yang berdoa wanita maka diganti dengan : amatuka wabnatu ábdika wabnatu amatika)(54), naashiyatii biyadika, maadhin fiyya hukmuka, \'adlun fiyya qodhoo-uka, as-aluka bikullismin huwa laka, sammaita bihi nafsaka, au anzaltahu fii kitaabika, au \'allamtahu ahadan min kholqika, awista\'tsarta bihi fii \'ilmil ghoibi \'indaka, an taj\'alal qur-aana robii\'a qolbii, wa nuuro shodrii, wa jalaa-a huznii, wa dzahaaba hammii.”',
    translation: '“Ya Allah, sesungguhnya aku adalah hambaMu, anak hambaMu, dan anak hamba perempuanMu(55)ubun-ubunku berada di tanganMu(56)hukumMu berlaku terhadap diriku(57) dan ketetapanMu adil pada diriku(58) Aku memohon kepadaMu dengan segala Nama yang menjadi milikMu, yang Engkau namai diriMu dengannya, atau yang Engkau turunkan di dalam kitabMu, atau yang Engkau ajarkan kepada seseorang dari makhlukMu, atau yang Engkau rahasiakan dalam ilmu ghaib yang ada di sisiMu, maka aku mohon dengan itu agar Engkau jadikan Al-Qur\'an sebagai penyejuk hatiku, cahaya bagi dadaku, pelipur kesedihanku, dan penghilang bagi kesusahanku.”(59)',
  },
  {
    title: 'Doa Ketika Melihat Orang Lain Yang Terkena Musibah/Cobaan',
    arabic: 'اَلْحَمْدُ لِلَّهِ الَّذِيْ عَافَانِيْ مِمَّا ابْتَلَاكَ بِهِ، وَفَضَّلَنِيْ عَلَى كَثِيْرٍ مِمَّنْ خَلَقَ تَفْضِيْلاً',
    latin: '“Alhamdulillaahil-ladzii \'aafaanii mimmabtalaaka bihi, wa fadh-dholanii \'alaa katsiirin mimman kholaqo tafdhiilan.”',
    translation: '“Segala puji bagi Allah yang telah menghindarkanku dari musibah yang menimpamu, serta memberikan kelebihan kepadaku atas sekian banyak ciptaan-Nya.”(1)',
  },
  {
    title: 'Doa Ketika Ditimpa Musibah Atau Yang Tidak Diharapkan',
    arabic: 'قَدَرُ اللَّهِ وَمَا شَاءَ فَعَلَ اَلْحَمْدُ لِلَّهِ عَلَى كُلِّ حَالٍ إِنَّا لِلَّهِ وَإِنَّا إِلَيْهِ رَاجِعُوْنَ، اَللَّهُمَّ أْجُرْنِيْ فِيْ مُصِيْبَتِيْ وَأَخْلِفْ لِيْ خَيْرًا مِنْهَا',
    latin: '“Qodarullaahi wa maa syaa-a fa\'ala.” “Alhamdulillaahi \'alaa kulli haal.” (2) “Innaa lillaahi wa innaa ilaihi rooji\'uun, allaahumma ujurnii fii mushiibatii wa akhlif lii khoiron minhaa.”',
    translation: '“Ini taqdir Allah, dan apa yang Dia kehendaki, Dia lakukan.”(1) “Segala puji bagi Allah atas segala keadaan.”(3) “Sesungguhnya kami milik Allah(4) dan kepadaNya kami akan kembali(5). Ya Allah, berilah pahala kepadaku(6) dan gantilah untukku dengan yang lebih baik (dari musibahku) (7).”(8)',
  },
  {
    title: 'Doa kepada Orang Yang Menawarkan/Memberi Bantuan Harta',
    arabic: 'بَارَكَ اللَّهُ لَكَ فِيْ أَهْلِكَ وَمَالِكَ',
    latin: '“Baarokallaahu laka fii ahlika wa maalika.”',
    translation: '“Semoga Allah memberkahimu dalam keluarga dan hartamu.”(1)',
  },
  {
    title: 'Doa Ketika Sedang Dalam Kesulitan Rizki',
    arabic: 'اَللَّهُمَّ إِنِّي أَسْأَلُكَ مِنْ فَضْلِكَ وَرَحْمَتِكَ، فَإِنَّهُ لاَ يَمْلِكُهَا إِلاَّ أَنْتَ',
    latin: '“Allaahumma innii as-aluka min fadhlika wa rohmatik, fa-innahu laa yamlikuhaa illaa anta.”',
    translation: '“Ya Allah, aku memohon kepada-Mu tambahan karunia-Mu dan rahmat-Mu, karena sesungguhnya tidak ada yang memilikinya kecuali Engkau.”(1)',
  },
  {
    title: 'Doa ketika Membayar Hutang',
    arabic: 'بَارَكَ اللَّهُ لَكَ فِيْ أَهْلِكَ وَمَالِكَ',
    latin: '“Baarokallaahu laka fii ahlika wa maalika”',
    translation: '“Semoga Allah memberikan berkah kepadamu pada keluarga dan hartamu”(1)',
  },
  {
    title: 'Doa Agar Hutang Lunas',
    arabic: 'اَللَّهُمَّ مَالِكَ الْمُلْكِ تُؤْتِي الْمُلْكَ مَنْ تَشَاءُ، وَتَنْزِعُ الْمُلكَ مِمَّنْ تَشَاءُ، وُتُعِزُّ مَنْ تَشَاءُ، وَتُذِلُّ مَنْ تَشَاءُ، بِيَدِكَ الخَيْرُ، إِنَّكَ عَلَى كُلِّ شَيْءٍ قَدِيرٌ، رَحْمَانَ الدُّنْيَا وَالآخِرَةِ وَرَحِيْمَهُمَا، تُعْطِيهِمَا مَنْ تَشَاءُ وَتَمْنَعُ مِنْهُمَا مَنْ تَشَاءُ، اِرْحَمْنِي رَحْمَةً تُغْنِينِي بِهَا عَنْ رَحْمَةِ مَنْ سِوَاكَ',
    latin: '“Allaahumma maalikal mulki tu\'til mulka man tasyaa\', wa tanzi\'ul mulka mimman tasyaa\', wa tu\'izzu man tasyaa\', wa tudzillu man tasyaa\', biyadikal khoir, innaka \'alaa kulli syai-in qodiir, rohmaanad-dunyaa wal aakhiroti wa rohiimahumaa, tu\'thiihimaa man tasyaa\' wa tamna\'u minhumaa man tasyaa\', irhamnii rohmatan tughniinii bihaa \'an rohmati man siwaak.”',
    translation: '“Ya Allah, Pemilik Seluruh Kekuasaan. Engkau beri kekuasaan kepada siapa yang Engkau kehendaki, dan Engkau mencabutnya dari siapa yang Engkau kehendaki. Engkau memuliakan siapa yang Engkau kehendaki, dan Engkau menghinakan siapa yang Engkau kehendaki. Di tangan-Mu-lah segala kebaikan, dan Engkau Maha Berkuasa Atas Segala Sesuatu. Wahai Maha Pengasih di Dunia dan Akhirat dan Penyayang di keduanya, Engkau memberikan keduanya (dunia dan akhirat) kepada siapa saja yang Engkau kehendaki, dan menahan keduanya dari siapa saja yang Engkau kehendaki. Rahmatilah aku dengan rahmat-Mu yang menjadikanku tak lagi memerlukan belas kasih selain-Mu.”(1)',
  },
];

// Ketika Ramadhan — transcribed programmatically from bekalislam.online/dzikir-doa's
// own per-item HTML fragments (dzikirdoa_new/ketika-ramadhan/*.html), same method as
// dzikirPagi/dzikirPetang above, to avoid transcription errors. A handful of items on
// the source site have no distinct Arabic phrase of their own (a narrative note about
// what the Prophet did, or "no specific dzikir exists for this") — those are kept with
// an empty `arabic` and their note folded into `translation` instead of guessing at a
// verbatim recitation that doesn't exist. Still needs a human check against a mu'tabar
// reference before treating as final, same caution as the rest of this file.
export const doaKetikaRamadhan = [
  {
    title: 'Doa Ketika Malam Lailatul Qodar',
    arabic: 'اَللَّهُمَّ إِنَّكَ عَفُوٌّ، تُحِبُّ العَفْوَ فَاعْفُ عَنِّي',
    latin: 'Allaahumma innaka \'afuwwun, tuhibbul \'afwa fa\'fu \'annii.',
    translation: '"Ya Allah, sesungguhnya Engkau Maha Pemaaf, menyukai permintaan maaf, maka maafkanlah aku."',
  },
  {
    title: 'Doa Berbuka Puasa',
    arabic: 'اللَّهُمَّ إِنِّي أَسْأَلُكَ بِرَحْمَتِكَ الَّتِي وَسِعَتْ كُلَّ شَيْءٍ، أَنْ تَغْفِرَ لِي',
    latin: 'Allaahumma innii as-aluka birohmatikal-latii wasi\'at kulla syai-in an taghfiro lii.',
    translation: '"Ya Allah, sesungguhnya aku memohon kepadaMu dengan rahmatMu yang meliputi segala sesuatu, supaya memberi ampunan atasku."',
  },
];

// Kematian Seseorang — transcribed programmatically from bekalislam.online/dzikir-doa's
// own per-item HTML fragments (dzikirdoa_new/kematian-seseorang/*.html), same method as
// dzikirPagi/dzikirPetang above, to avoid transcription errors. A handful of items on
// the source site have no distinct Arabic phrase of their own (a narrative note about
// what the Prophet did, or "no specific dzikir exists for this") — those are kept with
// an empty `arabic` and their note folded into `translation` instead of guessing at a
// verbatim recitation that doesn't exist. Still needs a human check against a mu'tabar
// reference before treating as final, same caution as the rest of this file.
export const doaKematian = [
  {
    title: 'Doa Ziarah Kubur',
    arabic: 'اَلسَّلَامُ عَلَى أَهْلِ الدِّيَارِ مِنَ الْمُؤْمِنِيْنَ وَالْمُسْلِمِيْنَ، وَيَرْحَمُ اللَّهُ الْمُسْتَقْدِمِيْنَ مِنَّا وَالْمُسْتَأْخِرِيْنَ وَإِنَّا إِنْ شَاءَ اللَّهُ بِكُمْ لَلَاحِقُوْنَ',
    latin: '“As-salaamu \'alaikum ahlad-diyaari minal mu\'miniina wal muslimiin. Wa yarhamullaahul mustaqdimiina minnaa wal musta\'khiriin. Wa innaa in syaa-allaahu bikum lalaa hiquun.”',
    translation: '“Semoga keselamatan atas kalian, wahai penghuni kubur, dari kaum mukminin dan muslimin. Semoga Allah merahmati orang-orang yang mendahului kita dan yang datang belakangan(1). Sesungguhnya kami insya Allah akan menyusul kalian.”(2)',
  },
  {
    title: 'Doa Ketika Janazah Telah Dikuburkan',
    arabic: 'اَللَّهُمَّ اغْفِرْ لَهُ اَللَّهُمَّ ثَبِّتْهُ',
    latin: '“Allaahummaghfir lahu, allaahumma tsabbit-hu.”',
    translation: '“Ya Allah ampunilah dia, Ya Allah teguhkanlah dia (untuk menjawab pertanyaan malaikat).”(1)',
  },
  {
    title: 'Doa Memasukan Janazah ke Liang Lahat',
    arabic: 'بِسْمِ اللَّهِ وَعَلَى سُنَّةِ رَسُوْلِ اللَّهِ بِسْمِ اللَّهِ وَعَلَى مِلَّةِ رَسُوْلِ اللَّهِ',
    latin: '“Bismillaahi wa \'alaa sunnati rosuulillaah.” “Bismillaahi wa \'alaa millati rosuulillaah.”',
    translation: '“Dengan nama Allah dan sesuai petunjuk Rasulullah.”(1) “Dengan nama Allah dan sesuai petunjuk Rasulullah.”(2)',
  },
  {
    title: 'Doa Ketika Ta’ziyah (Belasungkawa)',
    arabic: 'إِنَّ لِلَّهِ مَا أَخَذَ، وَلَهُ مَا أَعْطَى وَكُلُّ شَيْءٍ عِنْدَهُ بِأَجَلٍ مُسَمًّى، فَلْتَصْبِرْ وَلْتَحْتَسِبْ',
    latin: '“Inna lillaahi maa akhodza, wa lahu maa a\'thoo wa kullu syai-in \'indahu bi-ajalin musamman, faltashbir wal tahtasib.”',
    translation: '“Sesungguhnya hak Allah adalah mengambil sesuatu(1) dan memberikan sesuatu(2). Segala sesuatu yang di sisi-Nya dibatasi dengan ajal yang ditentukan(3). Oleh karena itu, bersabarlah dan carilah ridha Allah.”(4)',
  },
  {
    title: 'Doa Ketika Shalat Janazah',
    arabic: 'اَللَّهُمَّ اغْفِرْ لَهُ وَارْحَمْهُ وَعَافِهِ وَاعْفُ عَنْهُ، وَأَكْرِمْ نُزُلَهُ، وَوَسِّعْ مَدْخَلَهُ، وَاغْسِلْهُ بِالْمَاءِ وَالثَّلْجِ وَالْبَرَدِ، وَنَقِّهِ مِنَ الْخَطَايَا كَمَا نَقَّيْتَ الثَّوْبَ اْلأَبْيَضَ مِنَ الدَّنَسِ، وَأَبْدِلْهُ دَارًا خَيْرًا مِنْ دَارِهِ، وَأَهْلاً خَيْرًا مِنْ أَهْلِهِ، وَزَوْجًا خَيْرًا مِنْ زَوْجِهِ، وَأَدْخِلْهُ الْجَنَّةَ، وَأَعِذْهُ مِنْ عَذَابِ الْقَبْرِ (وَعَذَابِ النَّارِ) اَللَّهُمَّ اغْفِرْ لِحَيِّنَا وَمَيِّتِنَا وَشَاهِدِنَا وَغَائِبِنَا وَصَغِيْرِنَا وَكَبِيْرِنَا وَذَكَرِنَا وَأُنْثَانَا. اَللَّهُمَّ مَنْ أَحْيَيْتَهُ مِنَّا فَأَحْيِهِ عَلَى اْلإِسْلاَمِ، وَمَنْ تَوَفَّيْتَهُ مِنَّا فَتَوَفَّهُ عَلَى اْلإِيْمَانِ، اَللَّهُمَّ لاَ تَحْرِمْنَا أَجْرَهُ وَلاَ تُضِلَّنَا بَعْدَهُ اَللَّهُمَّ إِنَّ فُلاَنَ بْنَ فُلاَنٍ فِيْ ذِمَّتِكَ، وَحَبْلِ جِوَارِكَ، فَقِهِ مِنْ فِتْنَةِ الْقَبْرِ وَعَذَابِ النَّارِ، وَأَنْتَ أَهْلُ الْوَفَاءِ وَالْحَقِّ. فَاغْفِرْ لَهُ وَارْحَمْهُ إِنَّكَ أَنْتَ الْغَفُوْرُ الرَّحِيْمُ اَللَّهُمَّ عَبْدُكَ وَابْنُ أَمَتِكَ اِحْتَاجَ إِلَى رَحْمَتِكَ، وَأَنْتَ غَنِيٌّ عَنْ عَذَابِهِ، إِنْ كَانَ مُحْسِنًا فَزِدْ فِيْ حَسَنَاتِهِ، وَإِنْ كَانَ مُسِيْئًا فَتَجَاوَزْ عَنْهُ',
    latin: '“Allaahummaghfir lahu warhamhu wa \'aafihi wa\'fu \'anhu, wa akrim nuzulahu, wa wassi\' madkholahu, waghsilhu bilmaa-i wats-tsalji wal barod, wa naqqihi minal khothooyaa kamaa naqqoitats-tsaubal abyadho minad-danas, wa abdilhu daaron khoiron min daarihi, wa ahlan khoiron min ahlihi, wa zaujan khoiron min zaujihi, wa adkhilhul jannata, wa a\'idzhu min \'adzaabil qobri (wa \'adzaabin-naar).” “Allaahummaghfir lihayyinaa wa mayyitinaa wa syaahidinaa wa ghoo-ibinaa wa shoghiirinaa wa kabiirinaa wa dzakarinaa wa untsaanaa. Allaahumma man ahyaytahu minnaa fa-ahyihi \'alaal islaam, wa man tawaffaytahu minnaa fatawaffahu \'alaal iimaan. Allaahumma laa tahrimnaa ajrohu wa laa tudhillanaa ba\'dahu.” “Allaahumma inna fulaanabna fulaanin (sebut nama mayat fulan bin fulan) fii dzimmatika, wa habli jiwaarika, faqihi min fitnatil qobri wa \'adzaabin-naar, wa anta ahlul wafaa-i wal haqq. Faghfir lahu warhamhu innaka antal ghofuurur-rohiim.” “Allaahumma \'abduka wabnu amatika ihtaaja ilaa rohmatik, wa anta ghoniyyun \'an \'adzaabih, in kaana muhsinan fazid fii hasanaatih, wa in kaana musii-an fatajaawaz \'anhu.”',
    translation: '“Ya Allah, ampunilah dia (mayit) (1), berilah rahmat kepadanya(2), selamatkanlah dia (dari beberapa hal yang tidak disukai) (3), maafkanlah dia(4) dan tempatkanlah di tempat yang mulia(5), luaskan tempat masuknya(6), mandikan dia dengan air, salju dan air es(7). Bersihkan dia dari segala kesalahan, sebagaimana Engkau membersihkan baju yang putih dari kotoran(8). Gantikanlah rumah yang lebih baik dari rumahnya (di dunia), keluarga (atau istri di Surga) yang lebih baik daripada keluarganya (di dunia), pasangan yang lebih baik daripada pasangannya di dunia(9), dan masukkan dia ke Surga, jagalah dia dari siksa kubur dan Neraka.”(10) “Ya Allah, ampunilah orang yang hidup dan yang mati di antara kami, orang yang hadir dan yang tidak hadir, yang masih kecil dan yang sudah dewasa, laki-laki maupun perempuan. Ya Allah, orang yang Engkau hidupkan di antara kami, hidupkan dengan memegang ajaran Islam, dan orang yang Engkau matikan di antara kami, maka matikan dengan memegang keimanan. Ya Allah, jangan halangi kami untuk memperoleh pahalanya dan jangan sesatkan kami sepeninggalnya.”(11) “Ya, Allah, sesungguhnya Fulan bin Fulan (sebut nama mayit) dalam tanggunganMu dan jaminan keamananMu. Peliharalah dia dari fitnah kubur dan siksa Neraka(12). Engkau adalah Maha Menepati janji dan Maha Benar. Ampunilah dan kasihanilah dia. Sesungguhnya Engkau Maha Pengampun lagi Maha Penyayang.”(13) “Ya Allah, ini hambaMu, anak hambaMu perempuan (Hawa) membutuhkan rahmatMu, sedang Engkau tidak membutuhkan untuk menyiksanya. Jika ia berbuat baik, tambahkanlah dalam amalan baiknya, dan jika dia orang yang berbuat buruk, maafkanlah keburukannya.”(14)',
  },
  {
    title: 'Doa Memejamkan Mata Janazah',
    arabic: 'اَللَّهُمَّ اغْفِرْ لِفُلاَنٍ وَارْفَعْ دَرَجَتَهُ فِي الْمَهْدِيِّيْنَ، وَاخْلُفْهُ فِيْ عَقِبِهِ فِي الْغَابِرِيْنَ، وَاغْفِرْ لَنَا وَلَهُ يَا رَبَّ الْعَالَمِيْنَ، وَافْسَحْ لَهُ فِيْ قَبْرِهِ وَنَوِّرْ لَهُ فِيْهِ',
    latin: '“Allaahummaghfir li fulaan (sebut nama mayatnya), warfa\' darojatahu fiil mahdiyyiin, wakhlufhu fii \'aqibihi fiil ghoobiriin, waghfir lanaa wa lahu, yaa robbal \'aalamiin, wafsah lahu fii qobrihi wa nawwir lahu fiihi.”',
    translation: '“Ya Allah, ampunilah si Fulan (hendaklah menyebut namanya), angkatlah derajatnya bersama orang-orang yang mendapat petunjuk(1), berilah pengganti bagi orang-orang yang ditinggalkan sesudahnya(2) yang masih hidup. Dan ampunilah kami dan dia, wahai Rabb semesta alam. Lebarkan kuburannya dan berilah cahaya di dalamnya.”(3)',
  },
  {
    title: 'Mentalqin Orang Yang Akan Meninggal Dunia',
    arabic: 'لاَ إِلَـٰهَ إِلاَّ اللَّهُ',
    latin: '“Laa ilaaha illallah.”',
    translation: '“Tidak ada sesembahan (yang berhak untuk disembah) kecuali Allah.”(1)',
  },
  {
    title: 'Doa Menjelang Meninggal Dunia',
    arabic: 'اَللَّهُمَّ اغْفِرْ لِيْ وَارْحَمْنِيْ وَأَلْحِقْنِيْ بِالرَّفِيْقِ',
    latin: '"Allaahummagh-fir lii warhamnii wa alhiqnii bir-rofiiq."',
    translation: '"Ya Allah, ampunilah aku, rahmatilah aku, dan kumpulkanlah aku bersama para nabi dan orang-orang saleh."',
  },
  {
    title: 'Doa Sakit Menjelang Kematian',
    arabic: 'لَا إِلَهَ إِلَّا اللهُ',
    latin: 'Laa ilaaha illallah',
    translation: '"Tiada sesembahan yang berhak untuk disembah kecuali Allah"',
  },
];

// Ketika Menuntut Ilmu — transcribed programmatically from bekalislam.online/dzikir-doa's
// own per-item HTML fragments (dzikirdoa_new/ketika-menuntut-ilmu/*.html), same method as
// dzikirPagi/dzikirPetang above, to avoid transcription errors. A handful of items on
// the source site have no distinct Arabic phrase of their own (a narrative note about
// what the Prophet did, or "no specific dzikir exists for this") — those are kept with
// an empty `arabic` and their note folded into `translation` instead of guessing at a
// verbatim recitation that doesn't exist. Still needs a human check against a mu'tabar
// reference before treating as final, same caution as the rest of this file.
export const doaMenuntutIlmu = [
  {
    title: 'Doa Memohon Manfaat Ilmu',
    arabic: 'رَبِّ زِدْنِي عِلْمًا',
    latin: 'Robbi zidnii \'ilman.',
    translation: '"Wahai Rabb-ku, tambahkanlah ilmu kepadaku". (QS.Thaha [20]: 114).',
  },
  {
    title: 'Doa Di Tengah Majelis',
    arabic: 'رَبِّ اغْفِرْ لِيْ وَتُبْ عَلَيَّ إِنَّكَ أَنْتَ التَّوَّابُ الْغَفُوْرُ',
    latin: 'Robbighfir lii wa tub \'alayya, innaka antat-tawwaabul ghofuur.',
    translation: '"Wahai Tuhanku! Ampunilah aku dan terimalah taubatku, sesungguhnya Engkau Maha Menerima taubat lagi Maha Pengampun"',
  },
];

// Pernikahan & Walimah — transcribed programmatically from bekalislam.online/dzikir-doa's
// own per-item HTML fragments (dzikirdoa_new/pernikahan-walimah/*.html), same method as
// dzikirPagi/dzikirPetang above, to avoid transcription errors. A handful of items on
// the source site have no distinct Arabic phrase of their own (a narrative note about
// what the Prophet did, or "no specific dzikir exists for this") — those are kept with
// an empty `arabic` and their note folded into `translation` instead of guessing at a
// verbatim recitation that doesn't exist. Still needs a human check against a mu'tabar
// reference before treating as final, same caution as the rest of this file.
export const doaPernikahan = [
  {
    title: 'Doa Pengantin',
    arabic: 'بَارَكَ اللَّهُ لَكَ وَبَارَكَ عَلَيْكَ وَجَمَعَ بَيْنَكُمَا فِيْ خَيْرٍ',
    latin: 'Baarokallaahu laka(1) wa baaroka \'alaika(2) wa jama\'a bainakumaa fii khoirin(3).',
    translation: '“Semoga Allah memberkahimu di waktu bahagia dan memberkahimu di waktu susah, dan semoga Allah menyatukan kalian berdua dalam kebaikan.” (4)',
  },
  {
    title: 'Doa Sebelum Bersetubuh',
    arabic: 'بِسْمِ اللَّهِ، اَللَّهُمَّ جَنِّبْنَا الشَّيْطَانَ وَجَنِّبِ الشَّيْطَانَ مَا رَزَقْتَنَا',
    latin: 'Bismillaah. Allaahumma jannibnasy-syaithoona wa jannibisy-syaithoona maa rozaqtanaa.',
    translation: '"Dengan nama Allah. Ya Allah, jauhkan kami dari setan, dan jauhkan setan untuk mengganggu apa yang Engkau rezekikan kepada kami."',
  },
];

// Idul Fitri & Idul Adha — transcribed programmatically from bekalislam.online/dzikir-doa's
// own per-item HTML fragments (dzikirdoa_new/idul-fitri-idul-adha/*.html), same method as
// dzikirPagi/dzikirPetang above, to avoid transcription errors. A handful of items on
// the source site have no distinct Arabic phrase of their own (a narrative note about
// what the Prophet did, or "no specific dzikir exists for this") — those are kept with
// an empty `arabic` and their note folded into `translation` instead of guessing at a
// verbatim recitation that doesn't exist. Still needs a human check against a mu'tabar
// reference before treating as final, same caution as the rest of this file.
export const doaIdulFitriAdha = [
  {
    title: 'Doa ketika menyembelih kurban',
    arabic: 'بِاسْمِ اللهِ وَاللهُ أَكْبَرُ إِنِّي وَجَّهْتُ وَجْهِيَ لِلَّذِي فَطَرَ السَّمَاوَاتِ وَالْأَرْضَ حَنِيفًا وَمَا أَنَا مِنَ الْمُشْرِكِينَ إِنَّ صَلَاتِي وَنُسُكِي وَمَحْيَايَ وَمَمَاتِي لِلَّهِ رَبِّ الْعَالَمِينَ لَا شَرِيكَ لَهُ وَبِذَلِكَ أُمِرْتُ وَأَنَا أَوَّلُ الْمُسْلِمِينَ بِسْمِ اللَّهِ اللَّهُ أَكْبَرُ اللَّهُمَّ مِنْكَ وَلَكَ مِنْ مُحَمَّدٍ وَأُمَّتِهِ',
    latin: 'Bismillaah, wallaahu akbar. Innī wajjahtu waj-hiya lillażī faṭaras-samāwāti wal-arḍa ḥanīfaw wa mā ana minal-musyrikīn, inna ṣalātī wa nusukī wa maḥyāya wa mamātī lillāhi rabbil-\'ālamīn, Lā syarīka lah, wa biżālika umirtu wa ana awwalul-muslimīn Bismillaah, wallaahu akbar. Allahumma minka wa laka min Muhammadin wa ummatihi',
    translation: '“Dengan nama Allah (aku menyembelih), Allah Maha Besar.” (1) “Sesungguhnya aku menghadapkan diriku kepada Rabb yang menciptakan langit dan bumi, dengan cenderung kepada agama yang benar, dan aku bukanlah termasuk orang-orang yang mempersekutukan Tuhan. Sesungguhnya sembahyangku, ibadatku, hidupku dan matiku hanyalah untuk Allah, Tuhan semesta alam. Tiada sekutu bagi-Nya; dan demikian itulah yang diperintahkan kepadaku dan aku adalah orang yang pertama-tama menyerahkan diri (kepada Allah)". Dengan nama Allah (aku menyembelih), Allah Maha Besar. Ya Allah (ini adalah) dari-Mu dan untuk-Mu(2), dari Muhammad dan ummatnya.” (3)',
  },
  {
    title: 'Ucapan Selamat Hari Raya',
    arabic: 'تَقَبَّلَ اللَّهُ مِنَّا وَمِنْكُمْ',
    latin: 'Taqabbalallaahu minnaa wa minkum.',
    translation: '“Semoga Allah menerima amal kami dan amal kalian.” (1)',
  },
];

// Terkait Fenomena Alam — transcribed programmatically from bekalislam.online/dzikir-doa's
// own per-item HTML fragments (dzikirdoa_new/terkait-fenomena-alam/*.html), same method as
// dzikirPagi/dzikirPetang above, to avoid transcription errors. A handful of items on
// the source site have no distinct Arabic phrase of their own (a narrative note about
// what the Prophet did, or "no specific dzikir exists for this") — those are kept with
// an empty `arabic` and their note folded into `translation` instead of guessing at a
// verbatim recitation that doesn't exist. Still needs a human check against a mu'tabar
// reference before treating as final, same caution as the rest of this file.
export const doaFenomenaAlam = [
  {
    title: 'Doa Melihat Permulaan Buah',
    arabic: 'اَللَّهُمَّ بَارِكْ لَنَا فِيْ ثَمَرِنَا، وَبَارِكْ لَنَا فِيْ مَدِيْنَتِنَا، وَبَارِكْ لَنَا فِيْ صَاعِنَا، وَبَارِكْ لَنَا فِيْ مُدِّنَا',
    latin: 'Allaahumma baarik lanaa fii tsamarinaa, wa baarik lanaa fii madiinatinaa, wa baarik lanaa fii shoo\'inaa, wa baarik lanaa fii muddinaa.',
    translation: '“Ya Allah, berilah berkah buah-buahan kami, berilah berkah kota kami, berilah berkah sha’(1) dan berilah berkah mud(2) kami”(3).',
  },
  {
    title: 'Doa Melihat Hilal (Awal Bulan Hijriyah)',
    arabic: 'اَللَّهُ أَكْبَرُ، اَللَّهُمَّ أَهِلَّهُ عَلَيْنَا بِالأَمْنِ وَالإِيْمَانِ، وَالسَّلَامَةِ وَالإِسْلَامِ، وَالتَّوْفِيقِ لِمَا تُحِبُّ وَتَرْضَى، رَبُّنَا وَرَبُّكَ اللَّهُ',
    latin: 'Allaahu akbar, allaahumma ahillahu \'alainaa bil amni wal iimaan, was-salaamati wal islaam, wat-taufiiqi limaa tuhibbu wa tardhoo, robbunaa wa robbukallaah.',
    translation: '"Allah Maha Besar, Ya Allah, munculkanlah hilal itu kepada kami dengan membawa keamanan dan keimanan, keselamatan dan islam, dan membawa taufiq kepada apa yang Engkau cintai dan Engkau ridhai. Rabb kami dan Rabb kamu (wahai bulan) adalah Allah(1)".',
  },
  {
    title: 'Doa Ketika Hujan Sangat Lebat',
    arabic: 'اَللَّهُمَّ حَوَالَيْنَا وَلاَ عَلَيْنَا، اَللَّهُمَّ عَلَى اْلآكَامِ وَالظِّرَابِ، وَبُطُوْنِ اْلأَوْدِيَةِ وَمَنَابِتِ الشَّجَرِ',
    latin: 'Allaahumma hawaalainaa wa laa \'alainaa, allaahumma \'alal aakaami wazh-zhiroobi, wa buthuunil audiyati wa manaabitisy-syajari.',
    translation: '"Ya Allah, turunkanlah hujan di sekitar kami, bukan menimpa kami. Ya Allah, berilah hujan ke dataran tinggi, beberapa anak bukit, perut lembah dan beberapa tanah yang menumbuhkan pepohonan."',
  },
  {
    title: 'Doa Saat Hujan Turun',
    arabic: 'اَللَّهُمَّ صَيِّبًا نَافِعًا',
    latin: 'Allaahumma shoyyiban naafi\'an.',
    translation: '"Ya Allah, turunkanlah hujan yang bermanfaat (untuk manusia, tanaman dan binatang)."',
  },
  {
    title: 'Doa Meminta Hujan',
    arabic: 'اَللَّهُمَّ اسْقِنَا غَيْثًا مُغِيْثًا مَرِيْئًا مَرِيْعًا، نَافِعًا غَيْرَ ضَارٍّ، عَاجِلاً غَيْرَ آجِلٍ',
    latin: 'Allaahummasqinaa ghoitsan mughiitsan marii-an marii\'an, naafi\'an ghoiro dhorrin, \'aajilan ghoiro aajilin.',
    translation: '"Ya Allah, berilah kami hujan yang merata, menyegarkan tubuh dan menyuburkan tanaman, bermanfaat, tidak membahayakan. Kami mohon hujan secepatnya, tidak ditunda-tunda."',
  },
  {
    title: 'Doa Jika Mendengar Halilintar',
    arabic: 'سُبْحَانَ الَّذِي سَبَّحَتْ لَهُ',
    latin: 'Subhaanal-ladzii sabbahat lahu.',
    translation: '"Maha Suci Allah subhanahu wa ta\'ala yang halilintar bertasbih kepada-Nya."',
  },
  {
    title: 'Doa Ketika Angin Ribut',
    arabic: 'اَللَّهُمَّ إِنِّيْ أَسْأَلُكَ خَيْرَهَا وَأَعُوْذُ بِكَ مِنْ شَرِّهَا',
    latin: 'Allaahumma innii as-aluka khoirohaa wa a\'uudzu bika min syarrihaa.',
    translation: '"Ya Allah, sesungguhnya aku mohon kepadaMu kebaikan angin ini, dan aku berlindung kepadaMu dari kejelekannya."',
  },
];

// Kebaikan Dalam Keluarga — transcribed programmatically from bekalislam.online/dzikir-doa's
// own per-item HTML fragments (dzikirdoa_new/kebaikan-dalam-keluarga/*.html), same method as
// dzikirPagi/dzikirPetang above, to avoid transcription errors. A handful of items on
// the source site have no distinct Arabic phrase of their own (a narrative note about
// what the Prophet did, or "no specific dzikir exists for this") — those are kept with
// an empty `arabic` and their note folded into `translation` instead of guessing at a
// verbatim recitation that doesn't exist. Still needs a human check against a mu'tabar
// reference before treating as final, same caution as the rest of this file.
export const doaKeluarga = [
  {
    title: 'Doa Untuk Anak Yang Baru Lahir (Laki-Laki)',
    arabic: 'اَللَّهُمَّ إِنِّي أُعِيذُهُ بِكَ وَذُرِّيَّتَهُ مِنَ الشَّيْطَانِ الرَّجِيمِ',
    latin: 'Jika bayinya laki-laki, maka lafalnya: “Allaahumma innii u\'iidzuhu bika wa dzurriyyatahu minasy-syaithoonir-rojiim.”“Baarokallaahu laka fil mauhuubi laka, wa syakartal waahiba, wa balagho asyuddahu, wa ruziqta birroh.”',
    translation: 'Doa ibunya maryam untuk maryam (bayinya wanita) “Aku mohon perlindungan untuknya serta anak-anak keturunannya kepada (pemeliharaan) Engkau daripada setan yang terkutuk.” (QS. Ali Imran [3]: 36).',
  },
  {
    title: 'Doa Untuk Yang Baru Kelahiran',
    arabic: 'بَارَكَ اللَّهُ لَكَ فِي الْمَوْهُوْبِ لَكَ ، وَشَكَرْتَ الْوَاهِبَ، وَبَلَغَ أَشُدَّهُ، وَرُزِقْتَ بِرَّهُ',
    latin: '“Baarokallaahu laka fil mauhuubi laka, wa syakartal waahiba, wa balagho asyuddahu, wa ruziqta birroh.” Sedang orang yang diberi ucapan selamat membalas dengan mengucapkan: “Baarokallaahu laka wa baaroka \'alaika, wa jazaakallaahu khoiron, wa rozaqokallaahu mitslahu, wa ajzala tsawaabak.”',
    translation: '“Semoga Allah memberkahimu dalam anak yang diberikan kepadamu. Semoga kamu bersyukur kepada Sang Pemberi, dan dia dapat mencapai dewasa, serta kamu dikaruniai kebaikannya.” Sedang orang yang diberi ucapan selamat membalas dengan mengucapkan: “Semoga Allah juga memberkahimu dan melimpahkan kebahagiaan untukmu. Semoga Allah membalasmu dengan sebaik-baik balasan, mengaruniakan kepadamu seperti itu dan melipatgandakan pahalamu.”(1)',
  },
  {
    title: 'Doa Untuk Perlindungan Anak',
    arabic: 'أُعِيذُكُمَا بِكَلِمَاتِ اللَّهِ التَّامَّةِ، مِنْ كُلِّ شَيْطَانٍ وَهَامَّةٍ، وَمِنْ كُلِّ عَيْنٍ لَامَّةٍ',
    latin: '"U\'iidzu kumaa bikalimaatillaahit-taammah, min kulli syaithoonin wa haammah, wa min kulli \'ainin laammah."',
    translation: '"Aku memohon perlindungan untuk kalian berdua, dengan kalimat-kalimat Allah yang sempurna, dari semua godaan setan dan binatang pengganggu, dan dari pandangan mata buruk."',
  },
  {
    title: 'Doa memohon anak shalih',
    arabic: '﴿١﴾رَبِّ هَبْ لِي مِنَ الصَّالِحِينَ ﴿٢﴾رَبِّ هَبْ لِي مِنْ لَدُنْكَ ذُرِّيَّةً طَيِّبَةً إِنَّكَ سَمِيعُ الدُّعَاءِ ﴿٣﴾رَبِّ لَا تَذَرْنِي فَرْدًا وَأَنتَ خَيْرُ الْوَارِثِينَ ﴿٤﴾رَبِّ أَوْزِعْنِي أَنْ أَشْكُرَ نِعْمَتَكَ الَّتِي أَنْعَمْتَ عَلَيَّ وَعَلَى وَالِدَيَّ وَأَنْ أَعْمَلَ صَالِحًا تَرْضَاهُ وَأَصْلِحْ لِي فِي ذُرِّيَّتِي إِنِّي تُبْتُ إِلَيْكَ وَإِنِّي مِنَ الْمُسْلِمِينَ',
    latin: '1.“Robbi hab lii minash-shoolihiin.” 2.“Robbi hab lii mil-ladunka dzurriyyatan thoyyibah, innaka samii\'ud-du\'aa\'.” 3.“Robbi laa tadzarnii fardan, wa anta khoirul waaritsiin.” 4.“Robbi auzi\'nii an asykuro ni\'matakallatii an\'amta \'alayya wa \'alaa waalidayya wa an a\'mala shoolihan tardhoohu, wa ashlih lii fii dzurriyyatii, innii tubtu ilaika wa innii minal muslimiin.”',
    translation: '“Ya Rabb-ku, anugerahkanlah kepadaku (seorang anak) yang termasuk orang-orang yang saleh.” (QS. Ash-Shaffat [37]: 100). “Ya Rabb-ku, berilah aku dari sisi Engkau seorang anak yang baik. Sesungguhnya Engkau Maha Mendengar doa.” (QS. Ali Imran [3]: 38) (63) “Ya Rabb-ku, janganlah Engkau biarkan aku hidup seorang diri (tanpa keturunan), dan Engkaulah ahli waris yang terbaik.” (QS. Al-Anbiya\' [21]: 89) “Ya Rabbku, tunjukilah aku untuk mensyukuri nikmat-Mu yang telah Engkau berikan kepadaku dan kepada ibu bapakku, dan supaya aku dapat berbuat amal saleh yang Engkau ridhai. Berilah kebaikan kepadaku dengan (memberi kebaikan) kepada keturunanku. Sesungguhnya aku bertaubat kepada-Mu dan sesungguhnya aku termasuk orang-orang yang berserah diri.” (QS. Al-Ahqaf [46]: 15) (64)',
  },
  {
    title: 'Doa Agar Banyak Harta Dan Anak',
    arabic: 'اَللَّهُمَّ أَكْثِرْ مَالِي، وَوَلَدِي، وَبَارِكْ لِي فِيمَا أَعْطَيْتَنِي',
    latin: '“Allaahumma ak-tsir maalii wa waladii, wa baarik lii fiimaa a\'thoitanii.”',
    translation: '“Ya Allah, perbanyaklah harta dan anakku, serta berkahilah karunia yang Engkau beri.”(62)',
  },
  {
    title: 'Doa Memohon Istri Dan Anak Menjadi Penyejuk Mata',
    arabic: 'رَبَّنَا هَبْ لَنَا مِنْ أَزْوَاجِنَا وَذُرِّيَّاتِنَا قُرَّةَ أَعْيُنٍ وَاجْعَلْنَا لِلْمُتَّقِينَ إِمَامًا',
    latin: '“Robbanaa hab lanaa min azwaajinaa wa dzurriyyaatinaa qurrota a\'yun, waj\'alnaa lil muttaqiina imaamaa.”',
    translation: '“Ya Rabb kami, anugerahkanlah kepada kami istri-istri kami dan keturunan kami sebagai penyenang hati (kami), dan jadikanlah kami imam bagi orang-orang yang bertakwa.” (QS. Al-Furqan [25]: 74) (61)',
  },
  {
    title: 'Doa Agar Diri Dan Keluarga Tetap Mendirikan Shalat (Doa Nabi Ibrahim)',
    arabic: 'رَبِّ اجْعَلْنِي مُقِيمَ الصَّلاَةِ وَمِنْ ذُرِّيَّتِي رَبَّنَا وَتَقَبَّلْ دُعَاءِ',
    latin: 'Robbij\'alnii muqiimash-sholaati wa min dzurriyyatii, robbanaa wa taqobbal du\'aa\'.',
    translation: '“Ya Rabb-ku, jadikanlah aku dan anak cucuku orang-orang yang tetap mendirikan shalat(41), ya Tuhan kami, perkenankanlah doaku”. (QS.Ibrahim [14]: 40).',
  },
  {
    title: 'Doa Untuk Orang Tua',
    arabic: '﴿١﴾رَبَّنَا اغْفِرْ لِي وَلِوَالِدَيَّ وَلِلْمُؤْمِنِينَ يَوْمَ يَقُومُ الْحِسَابُ ﴿٢﴾رَّبِّ اغْفِرْ لِي وَلِوَالِدَيَّ وَلِمَن دَخَلَ بَيْتِيَ مُؤْمِنًا وَلِلْمُؤْمِنِينَ وَالْمُؤْمِنَاتِ وَلَا تَزِدِ الظَّالِمِينَ إِلَّا تَبَارًا ﴿٣﴾ رَّبِّ ارْحَمْهُمَا كَمَا رَبَّيَانِي صَغِيرًا',
    latin: '1. “Robbanagh-fir lii wa liwaalidayya wa lil mu\'miniina yauma yaquumul hisaab.” 2. “Robbigh-fir lii wa liwaalidayya wa liman dakhola baitiya mu\'minan wa lil mu\'miniina wal mu\'minaati wa laa tazidizh-zhoolimiina illaa tabaaroo.” 3.“Robbir-hamhumaa kamaa robbayaanii shoghiiroo.”',
    translation: '“Ya Tuhan kami, berikanlah ampunan kepadaku dan kedua ibu bapakku dan orang-orang yang beriman pada hari terjadinya hisab (hari kiamat).” (QS. Ibrahim [14]: 41) “Ya Tuhanku! Ampunilah aku, ibu bapakku, orang yang masuk ke rumahku dengan beriman dan semua orang yang beriman laki-laki dan perempuan. Dan janganlah Engkau tambahkan bagi orang-orang yang zalim itu selain kebinasaan.” (QS. Nuh [71]: 28) “Wahai Tuhanku, kasihilah mereka keduanya, sebagaimana mereka berdua telah mendidik aku waktu kecil.” (QS. Al-Isra\' [17]: 24) (40)',
  },
];

// Kebaikan Agama & Akhlak — transcribed programmatically from bekalislam.online/dzikir-doa's
// own per-item HTML fragments (dzikirdoa_new/kebaikan-agama-akhlak/*.html), same method as
// dzikirPagi/dzikirPetang above, to avoid transcription errors. A handful of items on
// the source site have no distinct Arabic phrase of their own (a narrative note about
// what the Prophet did, or "no specific dzikir exists for this") — those are kept with
// an empty `arabic` and their note folded into `translation` instead of guessing at a
// verbatim recitation that doesn't exist. Still needs a human check against a mu'tabar
// reference before treating as final, same caution as the rest of this file.
export const doaAkhlak = [
  {
    title: 'Doa Memohon Keistikamahan Dan Tekad Yang Terbimbing',
    arabic: 'اللهُمَّ إِنِّي أَسْأَلُكَ الثَّبَاتَ فِي الْأَمْرِ، وَالْعَزِيمَةَ عَلَى الرُّشْدِ، وَأَسْأَلُكَ شُكْرَ نِعْمَتِكَ، وَأَسْأَلُكَ حُسْنَ عِبَادَتِكَ، وَأَسْأَلُكَ قَلْبًا سَلِيمًا، وَأَسْأَلُكَ لِسَانًا صَادِقًا، وَأَسْأَلُكَ مِنْ خَيْرِ مَا تَعْلَمُ، وَأَعُوذُ بِكَ مِنْ شَرِّ مَا تَعْلَمُ، وَأَسْتَغْفِرُكَ لِمَا تَعْلَمُ، إِنَّكَ أَنْتَ عَلَّامُ الْغُيُوبِ',
    latin: 'Allaahumma innii as\'alukats tsabaata fil amri wal \'aziimati \'alar rusydi, wa as\'aluka syukra ni\'matika wa husna \'ibaadatik, wa as\'aluka qalban saliiman wa lisaanan shaadiqan, wa as\'aluka min khairi maa ta\'lam, wa a\'uudzu bika min syarri maa ta\'lam, wa astaghfiruka limaa ta\'lam, innaka anta \'allaamul ghuyuub',
    translation: '"Ya Allah, aku minta kepada-Mu keteguhan dalam perkara dan tekad kuat di atas kebenaran, aku minta kepada-Mu (agar aku) mensyukuri nikmat-Mu dan baik dalam beribadah kepada-Mu, aku minta kepada-Mu hati yang selamat dan lisan yang jujur, aku minta kepada-Mu semua kebaikan yang Engkau ketahui dan aku berlindung kepada-Mu dari semua kejelekan yang engkau ketahui, dan aku memohon ampun kepada-Mu terhadap dosa yang Engkau ketahui, sesungguhnya Engkau Maha mengetahui yang ghaib."',
  },
  {
    title: 'Doa Perlindungan dari Akhlak Buruk',
    arabic: 'اللَّهُمَّ جَنِّبْنِي مُنْكَرَاتِ الْأَخْلَاقِ وَالْأَعْمَالِ وَالْأَهْوَاءِ وَالْأَدْوَاءِ',
    latin: 'Allahumma jannibnii munkarootil akhlaaq wal ahwaa wal aswaa\' wal adwaa\'',
    translation: '"Ya Allah jauhkanlah aku dari akhlak-akhlak yang munkar, perbuatan yang mungkar, hawa nafsu, dan penyakit-penyakit yang mungkar (diantaranya virus corona)"',
  },
  {
    title: 'Doa Memohon Kecintaan Kepada Allah Dan Orang-orang Miskin',
    arabic: 'اَللَّهُمَّ إِنِّى أَسْأَلُكَ فِعْلَ الْخَيْرَاتِ، وَتَرْكَ الْمُنْكَرَاتِ، وَحُبَّ الْمَسَاكِينِ، وَإِذَا أَرَدْتَ بِعِبَادِكَ فِتْنَةً، فَاقْبِضْنِى إِلَيْكَ غَيْرَ مَفْتُونٍ، وَأَسْأَلُكَ حُبَّكَ، وَحُبَّ مَنْ يُحِبُّكَ، وَحُبَّ عَمَلٍ يُقَرِّبُنِي إِلَى حُبِّكَ',
    latin: '"Allaahumma innii as-aluka fi\'lal khoiroot, wa tarkal munkaroot, wa hubbal masaakiin. Wa idzaa arod-ta bi\'ibaadika fitnatan, faq-bidh-nii ilaika ghoiro maftuun wa asaluka hubbaka wa hubba man yuhibbuka wa hubba \'amalin yuqorribuny ila hubbika"',
    translation: '"Ya Allah, aku memohon kepada-Mu taufiq agar bisa mengamalkan semua kebaikan, meninggalkan semua kemungkaran dan bisa mencintai orang miskin. Jika Engkau menghendaki bagi hamba-hamba-Mu ujian (fitnah), maka wafatkanlah aku tanpa terkena fitnah itu, dan aku meminta kecintaan-Mu dan kecintaan orang-orang yang mencintai-Mu dan kecintaan kepada suatu amalan yang mendekatkanku kepada cinta-Mu"',
  },
  {
    title: 'Doa Agar Dapat Senantiasa Bersyukur',
    arabic: 'اللَّهُمَّ أَعِنِّيْ عَلَى ذِكْرِكَ وَشُكْرِكَ وَحُسْنِ عِبَادَتِكَ',
    latin: 'Allahumma a-\'inniy \'ala dzikrika wa syukrika wa husni \'ibaadatika.',
    translation: '"Ya Allah, tolonglah aku untuk berdzikir kepada-Mu, bersyukur kepada-Mu, serta beribadah dengan baik kepada-Mu."',
  },
  {
    title: 'Doa Memohon Ketegaran Hati',
    arabic: '﴿١﴾يَا مُقَلِّبَ الْقُلُوبِ، ثَبِّتْ قلبي عَلَى دِينِكَ ﴿٢﴾اَللَّهُمَّ مُصَرِّفَ الْقُلُوبِ، صَرِّفْ قُلُوبَنَا عَلَى طَاعَتِكَ',
    latin: '1.“Yaa muqollibal quluub, tsabbit qolbii \'alaa diinik.” 2. “Allaahumma mushorrifal quluub, shorrif quluubanaa \'alaa thoo\'atik.”',
    translation: '“Wahai Dzat yang Maha Membolak-balikkan hati, teguhkanlah hatiku di atas agama-Mu.”(35) “Ya Allah, Dzat yang memalingkan hati, palingkanlah hati kami kepada ketaatan beribadah kepada-Mu.”(36)',
  },
  {
    title: 'Doa Agar Hidup Menjadi Lebih Baik',
    arabic: 'اَللَّهُمَّ لِى دِينِىَ الَّذِى هُوَ عِصْمَةُ أَمْرِى، وَأَصْلِحْ لِى دُنْيَاىَ الَّتِى فِيهَا مَعَاشِى، وَأَصْلِحْ لِى آخِرَتِى الَّتِى فِيهَا مَعَادِى، وَاجْعَلِ الْحَيَاةَ زِيَادَةً لِى فِى كُلِّ خَيْرٍ، وَاجْعَلِ الْمَوْتَ رَاحَةً لِى مِنْ كُلِّ شَرٍّ',
    latin: 'Allaahumma ashlih lii diiniyalladzii huwa \'ishmatu amrii, wa ashlih lii dunyaayallatii fiihaa ma\'aasyii, wa ashlih lii aakhirotillatii fiihaa ma\'aadii, waj\'alil hayaata ziyaadatan lii fii kulli khoirin, waj\'alil mauta roohatan lii min kulli syarrin.',
    translation: '“Ya Allah, perbaikilah agamaku sebagai benteng urusanku, perbaikilah duniaku yang menjadi tempat kehidupanku, perbaikilah akhiratku yang menjadi tempat kembaliku. Dan jadikanlah kehidupan ini mempunyai nilai tambah bagiku dalam segala kebaikan, dan jadikanlah kematianku sebagai peristirahatan bagiku dari segala kejahatan(50)."(51)',
  },
  {
    title: 'Doa Memohon Bimbingan',
    arabic: 'اللَّهُمَّ إِنِّيْ أَسْأَلُكَ الْهُدَى وَالسَّدَادَ',
    latin: 'Allaahumma innii as-alukal hudaa was-sadaad.',
    translation: '"Ya Allah, aku memohon kepada-Mu petunjuk dan kebenaran.”(70)',
  },
  {
    title: 'Doa Memohon Takwa, Hidayah, Kehormatan Diri, Dan Qana\'ah',
    arabic: 'اَللَّهُمَّ إنِّي أَسْأَلُكَ الهُدَى، وَالتُّقَى، وَالعَفَافَ، وَالغِنَى',
    latin: 'Allaahumma innii as-alukal hudaa, wat-tuqoo, wal \'afaaf, wal ghinaa.',
    translation: '"Ya Allah, sesungguhnya aku mohon kepada-Mu petunjuk, ketakwaan, diberikan sifat \'afaf dan ghina"',
  },
  {
    title: 'Doa Memperbaiki Urusan Agama Dan Dunia',
    arabic: 'اَللَّهُمَّ لِى دِينِىَ الَّذِى هُوَ عِصْمَةُ أَمْرِى، وَأَصْلِحْ لِى دُنْيَاىَ الَّتِى فِيهَا مَعَاشِى، وَأَصْلِحْ لِى آخِرَتِى الَّتِى فِيهَا مَعَادِى، وَاجْعَلِ الْحَيَاةَ زِيَادَةً لِى فِى كُلِّ خَيْرٍ، وَاجْعَلِ الْمَوْتَ رَاحَةً لِى مِنْ كُلِّ شَرٍّ',
    latin: 'Allaahumma ashlih lii diiniyalladzii huwa \'ishmatu amrii, wa ashlih lii dunyaayallatii fiihaa ma\'aasyii, wa ashlih lii aakhirotillatii fiihaa ma\'aadii, waj\'alil hayaata ziyaadatan lii fii kulli khoirin, waj\'alil mauta roohatan lii min kulli syarrin.',
    translation: '“Ya Allah, perbaikilah agamaku sebagai benteng urusanku, perbaikilah duniaku yang menjadi tempat kehidupanku, perbaikilah akhiratku yang menjadi tempat kembaliku. Dan jadikanlah kehidupan ini mempunyai nilai tambah bagiku dalam segala kebaikan, dan jadikanlah kematianku sebagai peristirahatan bagiku dari segala kejahatan(50)."(51)',
  },
  {
    title: 'Doa Meminta Agar Dicatat Bersama Orang-orang Bersaksi Akan Keesaan Allah Subhanahu Wa Ta\'ala Dan Membenarkan Rasul-Nya',
    arabic: 'رَبَّنَا آمَنَّا بِمَا أَنْزَلْتَ وَاتَّبَعْنَا الرَّسُولَ فَاكْتُبْنَا مَعَ الشَّاهِدِينَ',
    latin: 'Rabbanā āmannā bimā anzalta wattaba\'nar-rasụla faktubnā ma\'asy-syāhidīn',
    translation: '"Ya Tuhan kami, kami telah beriman kepada apa yang telah Engkau turunkan dan telah kami ikuti rasul, karena itu masukanlah kami ke dalam golongan orang-orang yang menjadi saksi (tentang keesaan Allah)."',
  },
];

export const doaCategories = [
  { id: 'pagi', labelKey: 'doa_kategori_pagi', items: dzikirPagi },
  { id: 'petang', labelKey: 'doa_kategori_petang', items: dzikirPetang },
  { id: 'kegiatan', labelKey: 'doa_kategori_kegiatan', items: doaKegiatan },
  { id: 'haji-umrah', labelKey: 'doa_kategori_haji_umrah', items: doaHajiUmrah },
  { id: 'shalat', labelKey: 'doa_kategori_shalat', items: dzikirDoaShalat },
  { id: 'ruqyah', labelKey: 'doa_kategori_ruqyah', items: bacaanRuqyah },
  { id: 'karena-sebab', labelKey: 'doa_kategori_karena_sebab', items: doaKarenaSebab },
  { id: 'setiap-saat', labelKey: 'doa_kategori_setiap_saat', items: dzikirSetiapSaat },
  { id: 'setelah-sholat', labelKey: 'doa_kategori_setelah_sholat', items: dzikirSetelahSholat },
  { id: 'perjalanan', labelKey: 'doa_kategori_perjalanan', items: doaPerjalanan },
  { id: 'musibah', labelKey: 'doa_kategori_musibah', items: doaMusibah },
  { id: 'ramadhan', labelKey: 'doa_kategori_ramadhan', items: doaKetikaRamadhan },
  { id: 'kematian', labelKey: 'doa_kategori_kematian', items: doaKematian },
  { id: 'menuntut-ilmu', labelKey: 'doa_kategori_menuntut_ilmu', items: doaMenuntutIlmu },
  { id: 'pernikahan', labelKey: 'doa_kategori_pernikahan', items: doaPernikahan },
  { id: 'idul-fitri-adha', labelKey: 'doa_kategori_idul_fitri_adha', items: doaIdulFitriAdha },
  { id: 'fenomena-alam', labelKey: 'doa_kategori_fenomena_alam', items: doaFenomenaAlam },
  { id: 'keluarga', labelKey: 'doa_kategori_keluarga', items: doaKeluarga },
  { id: 'akhlak', labelKey: 'doa_kategori_akhlak', items: doaAkhlak },
];

