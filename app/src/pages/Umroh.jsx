import { useState } from 'react';
import { Link } from 'react-router-dom';
import BottomNav from '../components/BottomNav';
import PageHeaderPhoto from '../components/PageHeaderPhoto';
import { PAGE_PHOTOS } from '../data/photos';
import { ManasikIcon, BadalUmrahIcon, ChecklistIcon, SavingsJarIcon } from '../components/serviceIcons';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { submitUmrohLead } from '../lib/leadForms';

const BUDGET_OPTIONS = ['< Rp 25 juta', 'Rp 25-35 juta', 'Rp 35-50 juta', '> Rp 50 juta'];

// Minat Umroh (2026-09-12) — a lead-gen form, not a booking flow. No
// travel-agency partnership exists yet; the Tabungan Umroh page right
// next to this one exists specifically because someone's actively saving
// toward this, so the intent is already real — this just captures it
// (name/phone/budget/target bulan) for the founder to manually follow up
// with a licensed agency later, once real demand numbers justify that
// conversation. See lib/leadForms.js / firestore.rules for why this
// never auto-books anything.
function MinatUmrohForm() {
  const { user } = useAuth();
  const { showToast } = useToast();
  const [open, setOpen] = useState(false);
  const [name, setName] = useState(user?.displayName || '');
  const [phone, setPhone] = useState('');
  const [budgetRange, setBudgetRange] = useState(BUDGET_OPTIONS[0]);
  const [targetMonth, setTargetMonth] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [sent, setSent] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    if (!user || !phone.trim() || submitting) return;
    setSubmitting(true);
    try {
      await submitUmrohLead(user.uid, { name: name.trim(), phone: phone.trim(), budgetRange, targetMonth });
      setSent(true);
      showToast('Minat kamu udah kecatat, tim kami bakal hubungi lewat WA/telepon');
    } catch {
      showToast('Gagal kirim, coba lagi.', { type: 'danger' });
    } finally {
      setSubmitting(false);
    }
  }

  if (sent) {
    return (
      <div className="card" style={{ padding: 16, display: 'flex', flexDirection: 'column', gap: 4 }}>
        <span style={{ fontSize: 13, fontWeight: 800 }}>✅ Minat kamu udah kecatat</span>
        <span style={{ fontSize: 11, color: 'var(--muted)' }}>Tim kami bakal hubungi kamu lewat WA/telepon yang tadi diisi.</span>
      </div>
    );
  }

  return (
    <div className="card" style={{ padding: 16, display: 'flex', flexDirection: 'column', gap: 10 }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        <span style={{ fontSize: 13, fontWeight: 800 }}>✈️ Berencana Umroh?</span>
        <span style={{ fontSize: 11, color: 'var(--muted)' }}>Kasih tau minat kamu, tim kami bantu carikan agen travel umroh terpercaya.</span>
      </div>
      {!open ? (
        <button className="btn-outline" onClick={() => (user ? setOpen(true) : showToast('Masuk dulu ya.', { type: 'danger' }))}>
          Saya Berminat
        </button>
      ) : (
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <div className="input-row">
            <input placeholder="Nama" value={name} onChange={(e) => setName(e.target.value)} />
          </div>
          <div className="input-row">
            <input required placeholder="No. WA/Telepon" value={phone} onChange={(e) => setPhone(e.target.value)} />
          </div>
          <select
            value={budgetRange}
            onChange={(e) => setBudgetRange(e.target.value)}
            aria-label="Perkiraan budget"
            style={{ padding: '10px 12px', borderRadius: 10, border: '1px solid var(--border)', background: 'var(--bg)', color: 'var(--ink)', fontSize: 12.5 }}
          >
            {BUDGET_OPTIONS.map((b) => (
              <option key={b} value={b}>{b}</option>
            ))}
          </select>
          <div className="input-row">
            <input placeholder="Target bulan berangkat (opsional)" value={targetMonth} onChange={(e) => setTargetMonth(e.target.value)} />
          </div>
          <button className="btn" type="submit" disabled={submitting}>
            {submitting ? 'Mengirim...' : 'Kirim Minat'}
          </button>
        </form>
      )}
    </div>
  );
}

// All 4 now real pages (content written/sourced per an explicit ask to
// fill these in — was 4 flat "segera hadir" cards before). Manasik/Badal
// carry real fiqh content (sourced from Rumaysho.com, see those files'
// own header comments for the sourcing/verification caveat); Checklist
// is a real interactive checklist; Tabungan is a real calculator.
//
// [UI 2026-09-11] All 4 rows used to share the one UmrohIcon (the travel
// bag — kept as the hub tab's own icon, not reused here) with only the
// text telling them apart. Each row now gets its own mark.
const ITEMS = [
  { to: '/umroh/manasik', title: 'Panduan Manasik', desc: 'Tata cara umroh dari niat sampai tahallul.', bg: 'var(--mint)', icon: <ManasikIcon size={26} /> },
  { to: '/umroh/badal', title: 'Badal Umrah', desc: 'Hukum & ketentuan mengumrohkan orang lain.', bg: 'var(--peach)', icon: <BadalUmrahIcon size={26} /> },
  { to: '/umroh/checklist', title: 'Checklist Persiapan', desc: 'Dokumen, vaksin, dan barang bawaan sebelum berangkat.', bg: 'var(--cream)', icon: <ChecklistIcon size={26} /> },
  { to: '/umroh/tabungan', title: 'Tabungan Umroh', desc: 'Hitung target nabung bulanan buat biaya umroh.', bg: 'var(--blue-gray)', icon: <SavingsJarIcon size={26} /> },
];

export default function Umroh() {
  return (
    <div className="screen">
      <div className="screen-content">
        <PageHeaderPhoto title="Umroh Needs" photo={PAGE_PHOTOS.umroh} showBack={false} />
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {ITEMS.map((it) => (
            <Link
              key={it.to}
              to={it.to}
              className="card"
              style={{ display: 'flex', alignItems: 'center', gap: 12, padding: 14, textDecoration: 'none', color: 'inherit' }}
            >
              <div style={{ width: 44, height: 44, borderRadius: 13, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, background: it.bg }}>
                {it.icon}
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 2, flex: 1 }}>
                <span style={{ fontSize: 13, fontWeight: 700 }}>{it.title}</span>
                <span style={{ fontSize: 11, color: 'var(--muted)' }}>{it.desc}</span>
              </div>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--muted)">
                <path d="m9 6 6 6-6 6" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </Link>
          ))}
        </div>
        <MinatUmrohForm />
      </div>
      <BottomNav />
    </div>
  );
}
