import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import TopBar from '../components/TopBar';
import { submitSupportRequest } from '../lib/leadForms';

// Written from the real gaps/behaviors documented across this app's own
// history (donation confirmation delay, account-deletion scope, zakat
// disclaimer, etc.) — not generic filler FAQ copy.
const FAQS = [
  {
    q: 'Kenapa donasi/transfer saya belum masuk ke angka terkumpul?',
    a: 'Transfer manual (GoPay/Mandiri) dicek & dikonfirmasi manual sama admin setelah beneran cek rekening — biasanya beberapa jam, bukan instan. Pembayaran Midtrans (kartu/VA) biasanya lebih cepat begitu status "settlement" diterima.',
  },
  {
    q: 'Kalkulator Zakat & Waris di sini bisa dipakai sebagai patokan resmi?',
    a: 'Kalkulator ini bantu ngitung berdasarkan rumus fiqih umum (2.5% zakat penghasilan/maal, ilmu Faraidh buat Waris) — bagus buat perkiraan awal, tapi kasus yang rumit (misal Waris dengan ahli waris banyak & kombinasi jarang) sebaiknya tetap dikonsultasikan ke ustadz/lembaga amil zakat resmi seperti BAZNAS.',
  },
  {
    q: 'Notifikasi adzan/pengingat saya kadang gak muncul.',
    a: 'Cek dulu: notifikasi aplikasi diizinkan di pengaturan HP, mode "Jam Tenang" di Pengaturan gak lagi aktif buat jenis notifikasi itu, dan koneksi internet stabil pas jam sholat. Kalau masih bermasalah, coba "Tes Notifikasi" di halaman Pengaturan.',
  },
  {
    q: 'Kalau saya hapus akun, semua data saya beneran hilang?',
    a: 'Akun Firebase Auth kamu dihapus permanen. Dokumen profil utama juga dihapus. Tapi karena keterbatasan teknis, sebagian data riwayat kecil di sub-koleksi mungkin masih tersimpan di server dalam keadaan tidak bisa diakses lagi (orphaned) — bukan diproses ulang jadi bisa dibaca siapapun. Ekspor data kamu dulu (Pengaturan → Ekspor Data Saya) sebelum hapus akun kalau mau simpan salinannya.',
  },
  {
    q: 'Apa bedanya jadi "Sahabat airmoon" dengan donasi biasa?',
    a: 'Donasi biasa disalurkan ke campaign tertentu (misal listrik masjid). "Sahabat airmoon" adalah dukungan sekali bayar buat operasional aplikasi sendiri (biaya server, API, dll) — sebagai balasannya kamu dapet warna aksen eksklusif Rose Gold dan gak lagi dapet pengingat donasi bulanan.',
  },
  {
    q: 'Link ajak teman saya kok gak keitung?',
    a: 'Reward baru keitung setelah teman kamu benar-benar mendaftar (bukan cuma buka link), dan diproses lewat cek harian sistem — biasanya kurang dari 24 jam. Pastikan kamu share link dari tombol "Ajak Teman Pakai airmoon" di Pengaturan, bukan link biasa.',
  },
  {
    q: 'Jadwal sholat di HP saya beda beberapa menit sama masjid deket rumah.',
    a: 'Wajar — beda metode perhitungan (Kemenag/MWL/ISNA/dll) bisa geser waktu beberapa menit. Kamu bisa ganti metode perhitungan di halaman Jadwal Sholat kalau mau menyamakan dengan masjid setempat.',
  },
];

export default function Bantuan() {
  const { user } = useAuth();
  const { showToast } = useToast();
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [contact, setContact] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [sent, setSent] = useState(false);
  const [openFaq, setOpenFaq] = useState(null);

  async function handleSubmit(e) {
    e.preventDefault();
    if (!user || !message.trim() || submitting) return;
    setSubmitting(true);
    try {
      await submitSupportRequest(user.uid, { subject: subject.trim(), message: message.trim(), contact: contact.trim() });
      setSent(true);
      showToast('Pesan terkirim, tim kami bakal balas lewat email/kontak yang kamu isi.');
    } catch (err) {
      showToast(err.message || 'Gagal kirim pesan.', { type: 'danger' });
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="screen">
      <div className="screen-content">
        <TopBar title="Bantuan" />

        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <span className="section-label" style={{ color: 'var(--muted)', fontSize: 11.5, letterSpacing: '0.04em', textTransform: 'uppercase' }}>
            Pertanyaan Umum
          </span>
          {FAQS.map((faq, i) => (
            <div key={i} className="card" style={{ padding: 0, overflow: 'hidden' }}>
              <button
                onClick={() => setOpenFaq(openFaq === i ? null : i)}
                aria-expanded={openFaq === i}
                style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 10, padding: 14, border: 'none', background: 'none', textAlign: 'left', cursor: 'pointer', fontFamily: 'inherit', color: 'inherit' }}
              >
                <span style={{ fontSize: 12.5, fontWeight: 700 }}>{faq.q}</span>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--muted)" style={{ flexShrink: 0, transform: openFaq === i ? 'rotate(180deg)' : 'none', transition: 'transform var(--dur-1) var(--ease)' }}>
                  <path d="m6 9 6 6 6-6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
              {openFaq === i && (
                <p style={{ margin: 0, padding: '0 14px 14px', fontSize: 11.5, lineHeight: 1.6, color: 'var(--muted)' }}>{faq.a}</p>
              )}
            </div>
          ))}
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <span className="section-label" style={{ color: 'var(--muted)', fontSize: 11.5, letterSpacing: '0.04em', textTransform: 'uppercase' }}>
            Hubungi Kami
          </span>
          {!user ? (
            <p className="state-msg">Masuk dulu buat kirim pesan ke tim kami.</p>
          ) : sent ? (
            <div className="card" style={{ padding: 16, display: 'flex', flexDirection: 'column', gap: 4 }}>
              <span style={{ fontSize: 13, fontWeight: 800 }}>✅ Pesan terkirim</span>
              <span style={{ fontSize: 11, color: 'var(--muted)' }}>Belum ada sistem tiket otomatis — tim kami balas langsung dalam 1-2 hari kerja lewat kontak yang kamu isi.</span>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="card" style={{ padding: 16, display: 'flex', flexDirection: 'column', gap: 10 }}>
              <div className="input-row">
                <input placeholder="Subjek (opsional)" value={subject} onChange={(e) => setSubject(e.target.value)} maxLength={120} />
              </div>
              <textarea
                required
                placeholder="Ceritakan masalah atau pertanyaan kamu..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                maxLength={1000}
                rows={4}
                style={{ padding: '10px 12px', borderRadius: 12, border: '1px solid var(--border)', background: 'var(--bg)', color: 'var(--ink)', fontSize: 13, fontFamily: 'inherit', resize: 'vertical' }}
              />
              <div className="input-row">
                <input placeholder="Email/WA buat dihubungi balik (opsional)" value={contact} onChange={(e) => setContact(e.target.value)} />
              </div>
              <button className="btn" type="submit" disabled={submitting || !message.trim()}>
                {submitting ? 'Mengirim...' : 'Kirim Pesan'}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
