import { useState } from 'react';
import { createMidtransTransaction, loadSnapScript } from '../lib/donations';
import { formatRupiah } from '../lib/zakat';
import { useAuth } from '../context/AuthContext';

const dateFmt = new Intl.DateTimeFormat('id-ID', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });

// Self-contained: owns its own Midtrans Snap flow (loading state + result
// message) so any page can just render one of these per campaign without
// wiring up payment handling itself — used by both Donasi.jsx (full list)
// and Home.jsx (compact widget, but now also a list of every active
// campaign rather than just the single most-recent one).
export default function DonationCard({ donation, amounts = [10000, 25000, 50000] }) {
  const { user } = useAuth();
  const [paying, setPaying] = useState(false);
  const [status, setStatus] = useState(null); // { kind: 'info'|'success'|'error', text }

  const pct = Math.min(100, Math.round((donation.collected / donation.target) * 100));

  async function handleGive(amount) {
    if (!user) {
      setStatus({ kind: 'error', text: 'Masuk dulu buat donasi.' });
      return;
    }
    setPaying(true);
    setStatus(null);
    try {
      await loadSnapScript();
      const { token } = await createMidtransTransaction(donation, amount, user);
      window.snap.pay(token, {
        onSuccess: () => setStatus({ kind: 'success', text: 'Pembayaran berhasil! Terima kasih — angka terkumpul akan update sebentar lagi.' }),
        onPending: () => setStatus({ kind: 'info', text: 'Pembayaran diproses (misal nunggu transfer VA). Angka terkumpul update begitu lunas.' }),
        onError: () => setStatus({ kind: 'error', text: 'Pembayaran gagal. Coba lagi ya.' }),
        onClose: () => setStatus((s) => s || { kind: 'error', text: 'Dibatalkan sebelum bayar.' }),
      });
    } catch (err) {
      setStatus({ kind: 'error', text: err.message || 'Gagal memulai pembayaran.' });
    } finally {
      setPaying(false);
    }
  }

  return (
    <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: 13, padding: 18 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <div style={{ width: 42, height: 42, borderRadius: 14, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, background: 'var(--cream)' }}>
          <svg width="19" height="19" viewBox="0 0 24 24" fill="var(--gold-ink)" stroke="none"><path d="M13 2 4 14h6l-1 8 9-12h-6l1-8Z" /></svg>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <span style={{ fontSize: 14, fontWeight: 700 }}>{donation.title}</span>
          <span style={{ fontSize: 11, color: 'var(--muted)' }}>#PLN-{donation.plnId} · Connect ke PLN Mobile</span>
        </div>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        <div style={{ width: '100%', height: 7, borderRadius: 999, overflow: 'hidden', background: 'var(--mint)' }}>
          <div style={{ width: `${pct}%`, height: '100%', background: 'var(--accent)' }} />
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: 'var(--muted)' }}>
          <span><strong style={{ color: 'var(--ink)' }}>{formatRupiah(donation.collected)}</strong> terkumpul</span>
          <span>dari {formatRupiah(donation.target)}</span>
        </div>
        {donation.deadline && (
          <span style={{ fontSize: 10.5, color: 'var(--muted)' }}>Batas waktu {dateFmt.format(new Date(donation.deadline))}</span>
        )}
      </div>
      <div style={{ display: 'flex', gap: 8 }}>
        {amounts.map((amt) => (
          <button
            key={amt}
            className="btn-outline"
            style={{ flex: 1, padding: '11px 0', fontSize: 12, opacity: paying ? 0.6 : 1 }}
            disabled={paying}
            onClick={() => handleGive(amt)}
          >
            +{formatRupiah(amt).replace('Rp ', '')}
          </button>
        ))}
      </div>
      {status && (
        <div
          style={{
            padding: '8px 10px',
            borderRadius: 10,
            fontSize: 11.5,
            textAlign: 'center',
            color: status.kind === 'error' ? '#c0392b' : 'var(--muted)',
            background: status.kind === 'success' ? 'var(--mint)' : 'var(--bg)',
          }}
        >
          {status.text}
        </div>
      )}
    </div>
  );
}
