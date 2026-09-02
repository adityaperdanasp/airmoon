import TopBar from '../components/TopBar';

// Content written originally (not copied verbatim) based on the sequence
// published at rumaysho.com/2654-tata-cara-pelaksanaan-umrah333.html
// (Ustadz Muhammad Abduh Tuasikal) — a well-referenced Indonesian Salafi
// site, per the founder's own request to source from Rumaysho/Firanda
// Andirja/Khalid Basalamah/Syafiq Basalamah rather than writing this from
// memory. Same caveat as data/asmaulHusna.js and data/doaHarian.js
// elsewhere in this repo: this needs a human check against a qualified
// pembimbing manasik or the source article itself before being treated
// as the sole/final reference for an actual trip — madzhab-level details
// (e.g. exact ihram prohibitions) can vary and aren't exhaustively
// covered here.
const STAGES = [
  {
    title: '1. Sebelum Ihram',
    items: [
      'Mandi besar (seperti mandi junub) — dianjurkan untuk semua, termasuk yang sedang haid/nifas.',
      'Bagi laki-laki: potong kuku, rapikan kumis, cukur bulu ketiak dan kemaluan.',
      'Pakai wangi-wangian di badan (bukan di kain ihram) sebelum niat ihram — ini yang terakhir kali boleh pakai wangi-wangian sampai tahallul.',
      'Laki-laki memakai 2 lembar kain ihram (tidak berjahit): satu untuk sarung, satu untuk selendang. Perempuan memakai pakaian yang menutup aurat secara sempurna, tidak perlu kain khusus.',
    ],
  },
  {
    title: '2. Niat & Talbiyah di Miqat',
    items: [
      'Sampai di miqat, ucapkan niat: "Labbaikallahumma \'umrah" (Aku penuhi panggilan-Mu ya Allah, untuk umrah).',
      'Kalau khawatir ada halangan (sakit, dsb.) yang bisa menggagalkan umrah, boleh menambahkan syarat: "Fa in habasanii haabisun fa mahillii haitsu habastanii".',
      'Setelah niat, perbanyak baca talbiyah: "Labbaik Allahumma labbaik, labbaika laa syariika laka labbaik..." — laki-laki mengeraskan suara, perempuan cukup pelan.',
      'Talbiyah terus dibaca sampai melihat Ka\'bah / mulai tawaf.',
    ],
  },
  {
    title: '3. Selama Ihram — Yang Dihindari',
    items: [
      'Tidak memakai wangi-wangian baru (setelah niat ihram).',
      'Tidak memotong kuku atau rambut.',
      'Laki-laki: tidak memakai pakaian berjahit yang membentuk badan, tidak menutup kepala langsung.',
      'Perempuan: tidak menutup wajah (cadar) dan telapak tangan (sarung tangan) — tapi tetap harus menutup aurat lainnya.',
      'Tidak akad nikah, tidak berburu, tidak bertengkar/berkata kotor.',
      'Ini ringkasan umum — detail & pengecualian bisa beda tergantung mazhab, tanyakan ke pembimbing manasik.',
    ],
  },
  {
    title: '4. Tawaf (Mengelilingi Ka\'bah)',
    items: [
      'Masuk Masjidil Haram dengan kaki kanan, baca doa masuk masjid.',
      'Mulai dari Hajar Aswad — kalau bisa, sentuh/cium; kalau tidak memungkinkan, cukup isyarat tangan sambil ucapkan "Allahu Akbar".',
      'Tawaf 7 putaran, dimulai dan diakhiri di Hajar Aswad.',
      'Laki-laki: jalan cepat (raml) di 3 putaran pertama, jalan biasa di 4 putaran sisanya.',
      'Setiap melewati Rukun Yamani, sentuh (tanpa mencium) kalau memungkinkan.',
      'Di antara Rukun Yamani dan Hajar Aswad, baca: "Rabbanaa aatinaa fid dun-yaa hasanah wa fil aakhirati hasanah wa qinaa \'adzaaban naar".',
      'Setelah 7 putaran selesai, tutup bahu (laki-laki), lalu sholat sunnah 2 rakaat di dekat/belakang Maqam Ibrahim (surat Al-Kafirun di rakaat 1, Al-Ikhlas di rakaat 2).',
      'Minum air Zamzam sepuasnya.',
    ],
  },
  {
    title: '5. Sa\'i (Shafa – Marwah)',
    items: [
      'Menuju Bukit Shafa, naik ke atasnya, menghadap Ka\'bah, ucapkan takbir dan dzikir/doa.',
      'Sa\'i dimulai dari Shafa menuju Marwah — dihitung sebagai 1 kali perjalanan.',
      'Laki-laki disunnahkan jalan agak cepat (lari-lari kecil) di antara 2 tanda hijau/lampu hijau.',
      'Sampai di Marwah, ulangi seperti di Shafa (menghadap Ka\'bah, takbir, dzikir).',
      'Total 7 kali perjalanan (Shafa→Marwah dihitung 1, Marwah→Shafa dihitung 2, dst.), berakhir di Marwah.',
    ],
  },
  {
    title: '6. Tahallul (Mengakhiri Ihram)',
    items: [
      'Laki-laki: mencukur habis rambut kepala (lebih afdal) atau minimal memendekkan merata.',
      'Perempuan: memotong rambut sepanjang kira-kira 1 ruas jari.',
      'Setelah tahallul, semua larangan ihram sudah tidak berlaku lagi — umrah selesai.',
    ],
  },
];

export default function UmrohManasik() {
  return (
    <div className="screen">
      <div className="screen-content">
        <TopBar title="Panduan Manasik" />
        <p className="muted" style={{ margin: 0, fontSize: 12, lineHeight: 1.6 }}>
          Ringkasan tata cara umrah, ditulis ulang berdasarkan panduan di{' '}
          <a href="https://rumaysho.com/2654-tata-cara-pelaksanaan-umrah333.html" target="_blank" rel="noreferrer" style={{ color: 'var(--primary)', fontWeight: 600 }}>
            Rumaysho.com
          </a>{' '}
          (Ustadz M. Abduh Tuasikal). Ini panduan ringkas — sebaiknya tetap ikut bimbingan manasik resmi dari travel/petugas haji-umrah kamu buat detail sesuai mazhab yang dianut.
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {STAGES.map((stage) => (
            <div key={stage.title} className="card" style={{ padding: 16, display: 'flex', flexDirection: 'column', gap: 10 }}>
              <h2 style={{ margin: 0, fontSize: 14, fontWeight: 800, color: 'var(--primary)' }}>{stage.title}</h2>
              <ul style={{ margin: 0, paddingLeft: 18, display: 'flex', flexDirection: 'column', gap: 6 }}>
                {stage.items.map((item, i) => (
                  <li key={i} style={{ fontSize: 12.5, lineHeight: 1.55, color: 'var(--ink)' }}>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
