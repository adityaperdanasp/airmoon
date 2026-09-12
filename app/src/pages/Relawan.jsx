import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import TopBar from '../components/TopBar';
import { submitVolunteerLead } from '../lib/leadForms';

const INTEREST_OPTIONS = [
  'Bantu campaign masjid (survei/verifikasi lokasi)',
  'Bantu event Grup Ibadah',
  'Bantu konten/media sosial',
  'Bantu teknis (developer/desain)',
  'Lainnya',
];

// Pendaftaran Relawan (2026-09-12) — same write-and-forget lead-gen shape
// as AjukanMasjid.jsx/the Umroh interest form: no volunteer-coordination
// backend exists yet, this just captures real interest for the founder
// to follow up on directly.
export default function Relawan() {
  const { user } = useAuth();
  const { showToast } = useToast();
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [city, setCity] = useState('');
  const [interest, setInterest] = useState(INTEREST_OPTIONS[0]);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    if (!user || !phone.trim() || submitting) return;
    setSubmitting(true);
    try {
      await submitVolunteerLead(user.uid, { name: name.trim(), phone: phone.trim(), city: city.trim(), interest });
      setSubmitted(true);
      showToast('Pendaftaran terkirim! Tim kami bakal hubungi kamu.');
    } catch (err) {
      showToast(err.message || 'Gagal kirim pendaftaran.', { type: 'danger' });
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="screen">
      <div className="screen-content">
        <TopBar title="Jadi Relawan" />

        <div className="card" style={{ padding: 16 }}>
          <span style={{ fontSize: 12, color: 'var(--muted)', lineHeight: 1.5 }}>
            airmoon jalan berkat orang-orang yang mau bantu lebih dari sekadar donasi — mulai dari survei masjid, bantu acara komunitas, sampai konten. Daftar minat di bawah, tim kami hubungi langsung.
          </span>
        </div>

        {!user ? (
          <p className="state-msg">Masuk dulu buat daftar jadi relawan.</p>
        ) : submitted ? (
          <div className="card" style={{ padding: 16, textAlign: 'center' }}>
            <span style={{ fontSize: 13, fontWeight: 700 }}>Pendaftaran terkirim ✓</span>
            <p style={{ margin: '4px 0 0', fontSize: 12, color: 'var(--muted)' }}>Tim kami bakal hubungi kamu lewat nomor yang dikasih.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="card" style={{ padding: 16, display: 'flex', flexDirection: 'column', gap: 10 }}>
            <div className="input-row">
              <input placeholder="Nama" value={name} onChange={(e) => setName(e.target.value)} maxLength={100} />
            </div>
            <div className="input-row">
              <input required placeholder="No. WA" value={phone} onChange={(e) => setPhone(e.target.value)} />
            </div>
            <div className="input-row">
              <input placeholder="Kota domisili" value={city} onChange={(e) => setCity(e.target.value)} />
            </div>
            <select
              value={interest}
              onChange={(e) => setInterest(e.target.value)}
              style={{ padding: '10px 12px', borderRadius: 12, border: '1px solid var(--border)', background: 'var(--card)', color: 'var(--ink)', fontSize: 13 }}
            >
              {INTEREST_OPTIONS.map((opt) => (
                <option key={opt} value={opt}>{opt}</option>
              ))}
            </select>
            <button type="submit" className="btn" disabled={submitting || !phone.trim()}>
              {submitting ? 'Mengirim...' : 'Daftar Jadi Relawan'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
