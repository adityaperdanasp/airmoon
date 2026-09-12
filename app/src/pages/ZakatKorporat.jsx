import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import TopBar from '../components/TopBar';
import { calcZakatKorporat, formatRupiah } from '../lib/zakat';
import { submitCorporateZakatLead } from '../lib/leadForms';

const GOLD_PRICE_PER_GRAM = 1500000; // rough estimate, same fallback KalkulatorZakat.jsx uses when no live gold price API is wired in

// Zakat Korporat (2026-09-12) — B2B lead-gen: a self-service estimate
// (metode aktiva bersih, same 2.5%/nisab-gated shape as calcZakatMaal)
// paired with a "minta dikontak" form, since real corporate zakat needs
// an actual conversation with an accountant, not just a calculator.
export default function ZakatKorporat() {
  const { user } = useAuth();
  const { showToast } = useToast();
  const [currentAssets, setCurrentAssets] = useState('');
  const [liabilities, setLiabilities] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [contact, setContact] = useState('');
  const [notes, setNotes] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const assetsNum = Number(currentAssets) || 0;
  const liabilitiesNum = Number(liabilities) || 0;
  const estimate = calcZakatKorporat(assetsNum, liabilitiesNum, GOLD_PRICE_PER_GRAM);
  const hasEstimate = currentAssets !== '';

  async function handleSubmit(e) {
    e.preventDefault();
    if (!user || !companyName.trim() || !contact.trim() || submitting) return;
    setSubmitting(true);
    try {
      await submitCorporateZakatLead(user.uid, {
        companyName: companyName.trim(),
        contact: contact.trim(),
        estimatedZakat: estimate,
        notes: notes.trim(),
      });
      setSubmitted(true);
      showToast('Terkirim! Tim kami bakal hubungi kamu buat konsultasi lebih lanjut.');
    } catch (err) {
      showToast(err.message || 'Gagal kirim permintaan konsultasi.', { type: 'danger' });
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="screen">
      <div className="screen-content">
        <TopBar title="Zakat Korporat" />

        <div className="card" style={{ padding: 16, display: 'flex', flexDirection: 'column', gap: 10 }}>
          <span style={{ fontSize: 12, color: 'var(--muted)', lineHeight: 1.5 }}>
            Estimasi kasar pakai metode aktiva bersih: (aset lancar − utang jangka pendek) × 2.5%, kalau udah di atas nisab (setara 85 gram emas). Estimasi ini bukan pengganti konsultasi akuntan/ahli fiqih muamalah.
          </span>
          <div className="input-row">
            <input type="number" placeholder="Total aset lancar (kas, piutang, persediaan)" value={currentAssets} onChange={(e) => setCurrentAssets(e.target.value)} />
          </div>
          <div className="input-row">
            <input type="number" placeholder="Total utang jangka pendek" value={liabilities} onChange={(e) => setLiabilities(e.target.value)} />
          </div>
          {hasEstimate && (
            <div style={{ padding: '12px 14px', borderRadius: 12, background: 'var(--mint)', textAlign: 'center' }}>
              <span style={{ fontSize: 11, color: 'var(--muted)' }}>Estimasi Zakat Korporat</span>
              <div style={{ fontSize: 20, fontWeight: 800, color: 'var(--primary)' }}>{formatRupiah(estimate)}</div>
            </div>
          )}
        </div>

        {!user ? (
          <p className="state-msg">Masuk dulu buat minta konsultasi zakat korporat.</p>
        ) : submitted ? (
          <div className="card" style={{ padding: 16, textAlign: 'center' }}>
            <span style={{ fontSize: 13, fontWeight: 700 }}>Permintaan terkirim ✓</span>
            <p style={{ margin: '4px 0 0', fontSize: 12, color: 'var(--muted)' }}>Tim kami bakal hubungi kamu lewat kontak yang dikasih.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="card" style={{ padding: 16, display: 'flex', flexDirection: 'column', gap: 10 }}>
            <span className="section-label" style={{ color: 'var(--muted)', fontSize: 11.5, letterSpacing: '0.04em', textTransform: 'uppercase' }}>
              Minta Konsultasi
            </span>
            <div className="input-row">
              <input required placeholder="Nama Perusahaan" value={companyName} onChange={(e) => setCompanyName(e.target.value)} maxLength={200} />
            </div>
            <div className="input-row">
              <input required placeholder="No. WA / Email kontak" value={contact} onChange={(e) => setContact(e.target.value)} />
            </div>
            <textarea
              placeholder="Catatan tambahan (opsional)"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
              style={{ padding: '10px 12px', borderRadius: 12, border: '1px solid var(--border)', background: 'var(--bg)', color: 'var(--ink)', fontSize: 13, fontFamily: 'inherit', resize: 'vertical' }}
            />
            <button type="submit" className="btn" disabled={submitting || !companyName.trim() || !contact.trim()}>
              {submitting ? 'Mengirim...' : 'Kirim Permintaan Konsultasi'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
