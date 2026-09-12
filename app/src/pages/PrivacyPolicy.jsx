import TopBar from '../components/TopBar';

function Section({ title, children }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      <h2 style={{ fontSize: 15, fontWeight: 800, margin: 0 }}>{title}</h2>
      <div style={{ fontSize: 13, lineHeight: 1.7, color: 'var(--muted)' }}>{children}</div>
    </div>
  );
}

// [2026-09-12] Expanded from the original version — this predates several
// features that now genuinely need disclosure (avatar photo upload, the
// referral program, Sahabat airmoon supporter purchases, the 3 lead-gen
// forms that relay a submitter's name/contact to the founder via
// Telegram) and didn't yet reference the real self-service data tools
// (Ekspor Data Saya, Hapus Akun) that make most of "Hak Kamu" below
// actually actionable in-app rather than only via email.
export default function PrivacyPolicy() {
  return (
    <div className="screen">
      <div className="screen-content" style={{ gap: 26 }}>
        <TopBar title="Kebijakan Privasi" />

        <p style={{ margin: 0, fontSize: 12, color: 'var(--muted-soft)' }}>Berlaku sejak 12 September 2026</p>

        <Section title="Data apa yang kami kumpulkan">
          <ul style={{ margin: 0, paddingLeft: 18 }}>
            <li>Nama, email, dan (opsional) foto profil — dari pendaftaran manual, dari Google/Facebook kalau kamu masuk pakai itu, atau dari foto yang kamu unggah sendiri di Pengaturan.</li>
            <li>Lokasi perangkat — cuma dipakai buat hitung jadwal sholat dan cari masjid terdekat, gak disimpan permanen.</li>
            <li>Data ibadah &amp; aktivitas di dalam app — poin, riwayat amalan harian, ayat terakhir dibaca, riwayat zakat/waris yang kamu simpan, riwayat donasi.</li>
            <li>Isi percakapan kamu dengan "Ust. Rewin" (fitur tanya-jawab AI) — dikirim ke penyedia AI buat dijawab, gak disimpan permanen di server kami.</li>
            <li>Kalau kamu mengajukan campaign masjid, minat Umroh, usulan fitur, atau menghubungi tim kami lewat form "Bantuan" — isi form itu (termasuk kontak yang kamu tulis) diteruskan ke tim kami buat ditindaklanjuti manual.</li>
            <li>Kalau kamu ikut program referral — kode referral yang kamu bagikan cuma berupa ID akun kamu sendiri, bukan data pribadi tambahan.</li>
          </ul>
        </Section>

        <Section title="Buat apa data ini dipakai">
          <p style={{ margin: 0 }}>
            Data dipakai buat nyediain fitur di dalam app: login &amp; simpan progres kamu, hitung jadwal sholat sesuai lokasi,
            nunjukin masjid terdekat, proses donasi &amp; dukungan Sahabat airmoon, jawab pertanyaan di fitur Ust. Rewin, dan
            menindaklanjuti pengajuan/pertanyaan yang kamu kirim lewat form di dalam app. Kami gak jual data kamu ke pihak
            manapun.
          </p>
        </Section>

        <Section title="Berapa lama data disimpan">
          <p style={{ margin: 0 }}>
            Data akun kamu disimpan selama akun masih aktif. Kalau kamu hapus akun (Pengaturan → Hapus Akun), akun login dan
            profil utama kamu dihapus permanen dari sistem kami. Karena keterbatasan teknis, sebagian riwayat kecil di
            sub-koleksi mungkin tersisa dalam keadaan tidak lagi bisa diakses (orphaned) — bukan terus diproses atau dibaca
            siapapun. Isi percakapan Ust. Rewin gak pernah disimpan permanen di server kami sejak awal.
          </p>
        </Section>

        <Section title="Layanan pihak ketiga yang kami pakai">
          <ul style={{ margin: 0, paddingLeft: 18 }}>
            <li><strong>Firebase (Google)</strong> — autentikasi akun, database, dan hosting.</li>
            <li><strong>Google Sign-In &amp; Facebook Login</strong> — kalau kamu pilih masuk lewat itu, kami cuma terima nama, email, dan foto profil sesuai izin yang kamu kasih.</li>
            <li><strong>Google Maps Places API</strong> — buat nyari masjid terdekat.</li>
            <li><strong>Anthropic (Claude)</strong> — buat jawab pertanyaan di fitur Ust. Rewin.</li>
            <li><strong>Midtrans</strong> — pemroses pembayaran buat donasi lewat kartu/e-wallet/VA (Snap). Kami gak pernah menyimpan nomor kartu/rekening kamu sendiri.</li>
            <li><strong>Telegram</strong> — dipakai secara internal oleh tim kami buat menerima notifikasi laporan transfer manual dan pengajuan/pertanyaan yang kamu kirim lewat form di app (nama/kontak yang kamu isi ikut diteruskan ke sana supaya bisa ditindaklanjuti).</li>
            <li><strong>EQuran.id, Quran.com, Aladhan.com, OpenStreetMap</strong> — buat konten Qur'an, jadwal sholat, dan data masjid. Layanan ini gak nerima data pribadi kamu, cuma koordinat lokasi buat hitung jadwal/cari masjid.</li>
          </ul>
        </Section>

        <Section title="Hak kamu">
          <ul style={{ margin: 0, paddingLeft: 18 }}>
            <li><strong>Akses &amp; portabilitas</strong> — unduh salinan data kamu sendiri kapan aja lewat Pengaturan → Ekspor Data Saya.</li>
            <li><strong>Koreksi</strong> — nama, foto profil, dan sebagian besar data lain bisa kamu ubah sendiri langsung di app.</li>
            <li><strong>Penghapusan</strong> — hapus akun &amp; data kamu kapan aja lewat Pengaturan → Hapus Akun, atau hubungi kami di bawah kalau butuh bantuan.</li>
            <li><strong>Cabut izin lokasi</strong> — kapan aja lewat pengaturan browser/perangkat kamu, gak perlu lewat app.</li>
            <li><strong>Opt-out email</strong> — matikan "Boleh Dihubungi Lewat Email" di Pengaturan kalau gak mau menerima email dari kami di luar notifikasi in-app.</li>
          </ul>
        </Section>

        <Section title="Anak-anak">
          <p style={{ margin: 0 }}>
            airmoon gak ditujukan buat anak di bawah 13 tahun tanpa pengawasan orang tua/wali.
          </p>
        </Section>

        <Section title="Kontak">
          <p style={{ margin: 0 }}>
            Ada pertanyaan soal privasi atau mau minta bantuan hapus data? Pakai halaman{' '}
            <a href="/lainnya/bantuan" className="ext" style={{ color: 'var(--primary)', fontWeight: 700 }}>Bantuan</a> di
            dalam app, atau email ke{' '}
            <a href="mailto:suherman.aditya@gmail.com" className="ext" style={{ color: 'var(--primary)', fontWeight: 700 }}>
              suherman.aditya@gmail.com
            </a>
            .
          </p>
        </Section>
      </div>
    </div>
  );
}
