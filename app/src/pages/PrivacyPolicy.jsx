import TopBar from '../components/TopBar';

function Section({ title, children }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      <h2 style={{ fontSize: 15, fontWeight: 800, margin: 0 }}>{title}</h2>
      <div style={{ fontSize: 13, lineHeight: 1.7, color: 'var(--muted)' }}>{children}</div>
    </div>
  );
}

export default function PrivacyPolicy() {
  return (
    <div className="screen">
      <div className="screen-content" style={{ gap: 26 }}>
        <TopBar title="Kebijakan Privasi" />

        <p style={{ margin: 0, fontSize: 12, color: 'var(--muted-soft)' }}>Berlaku sejak 25 Agustus 2026</p>

        <Section title="Data apa yang kami kumpulkan">
          <ul style={{ margin: 0, paddingLeft: 18 }}>
            <li>Nama, email, dan foto profil — dari pendaftaran manual, atau dari Google/Facebook kalau kamu masuk pakai itu.</li>
            <li>Lokasi perangkat — cuma dipakai buat hitung jadwal sholat dan cari masjid terdekat, gak disimpan permanen.</li>
            <li>Data ibadah &amp; donasi di dalam app — saldo wallet, poin, ayat terakhir dibaca, riwayat donasi.</li>
            <li>Isi percakapan kamu dengan "Ust. Rewin" (fitur tanya-jawab AI) — dikirim ke penyedia AI buat dijawab, gak disimpan permanen di server kami.</li>
          </ul>
        </Section>

        <Section title="Buat apa data ini dipakai">
          <p style={{ margin: 0 }}>
            Data dipakai buat nyediain fitur di dalam app: login &amp; simpan progres kamu, hitung jadwal sholat sesuai lokasi,
            nunjukin masjid terdekat, proses donasi, dan jawab pertanyaan di fitur Ust. Rewin. Kami gak jual data kamu ke pihak
            manapun.
          </p>
        </Section>

        <Section title="Layanan pihak ketiga yang kami pakai">
          <ul style={{ margin: 0, paddingLeft: 18 }}>
            <li><strong>Firebase (Google)</strong> — autentikasi akun, database, dan hosting.</li>
            <li><strong>Google Sign-In &amp; Facebook Login</strong> — kalau kamu pilih masuk lewat itu, kami cuma terima nama, email, dan foto profil sesuai izin yang kamu kasih.</li>
            <li><strong>Google Maps Places API</strong> — buat nyari masjid terdekat.</li>
            <li><strong>Anthropic (Claude)</strong> — buat jawab pertanyaan di fitur Ust. Rewin.</li>
            <li><strong>EQuran.id, Quran.com, Aladhan.com, OpenStreetMap</strong> — buat konten Qur'an, jadwal sholat, dan data masjid. Layanan ini gak nerima data pribadi kamu, cuma koordinat lokasi buat hitung jadwal/cari masjid.</li>
          </ul>
        </Section>

        <Section title="Hak kamu">
          <p style={{ margin: 0 }}>
            Kamu bisa minta akun &amp; data kamu dihapus kapan aja dengan menghubungi kami (kontak di bawah). Kamu juga bisa
            cabut izin akses lokasi lewat pengaturan browser/perangkat kapan aja.
          </p>
        </Section>

        <Section title="Anak-anak">
          <p style={{ margin: 0 }}>
            airmoon gak ditujukan buat anak di bawah 13 tahun tanpa pengawasan orang tua/wali.
          </p>
        </Section>

        <Section title="Kontak">
          <p style={{ margin: 0 }}>
            Ada pertanyaan soal privasi atau mau minta data dihapus? Email ke{' '}
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
