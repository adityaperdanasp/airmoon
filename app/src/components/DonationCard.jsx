import { useState } from 'react';
import { createMidtransTransaction, loadSnapScript, reportManualPayment } from '../lib/donations';
import { formatRupiah } from '../lib/zakat';
import { useAuth } from '../context/AuthContext';

const dateFmt = new Intl.DateTimeFormat('id-ID', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });

// The founder's own accounts — interim path while waiting on Midtrans
// Production approval (see api/report-manual-payment.js). Meant to be
// shown publicly to donors, not a secret.
const MANUAL_ACCOUNTS = {
  gopay: { label: 'GoPay', value: '08129347661' },
  mandiri: { label: 'Mandiri', value: '60014629962' },
};

function ManualTransferSection({ donation, user, amounts }) {
  const [open, setOpen] = useState(false);
  const [method, setMethod] = useState('gopay');
  const [amount, setAmount] = useState(amounts[0]);
  const [submitting, setSubmitting] = useState(false);
  const [status, setStatus] = useState(null);
  const [copied, setCopied] = useState(false);

  async function copyNumber() {
    try {
      await navigator.clipboard.writeText(MANUAL_ACCOUNTS[method].value);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      // clipboard permission denied or unsupported — the number is still
      // visible on screen to copy by hand, so this isn't fatal.
    }
  }

  async function handleReport() {
    if (!user) {
      setStatus({ kind: 'error', text: 'Masuk dulu buat lapor transfer.' });
      return;
    }
    const amountNum = Number(amount);
    if (!Number.isFinite(amountNum) || amountNum <= 0) {
      setStatus({ kind: 'error', text: 'Isi jumlah yang valid dulu.' });
      return;
    }
    setSubmitting(true);
    setStatus(null);
    try {
      await reportManualPayment(donation, amountNum, method, user);
      setStatus({ kind: 'success', text: 'Laporan terkirim! Admin bakal cek & konfirmasi manual — angka terkumpul update begitu dikonfirmasi.' });
    } catch (err) {
      setStatus({ kind: 'error', text: err.message || 'Gagal melapor transfer.' });
    } finally {
      setSubmitting(false);
    }
  }

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        style={{ background: 'none', border: 'none', color: 'var(--muted)', fontSize: 11.5, textDecoration: 'underline', cursor: 'pointer', padding: 0 }}
      >
        atau transfer manual (GoPay/Mandiri)
      </button>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10, padding: '12px 14px', borderRadius: 12, background: 'var(--bg)' }}>
      <div style={{ display: 'flex', gap: 8 }}>
        {Object.entries(MANUAL_ACCOUNTS).map(([key, acc]) => (
          <button
            key={key}
            onClick={() => setMethod(key)}
            style={{
              flex: 1,
              padding: '8px 0',
              borderRadius: 10,
              fontSize: 12,
              fontWeight: 700,
              border: method === key ? '1.5px solid var(--primary)' : '1px solid var(--border)',
              background: method === key ? 'var(--mint)' : 'transparent',
              color: method === key ? 'var(--primary)' : 'var(--muted)',
              cursor: 'pointer',
            }}
          >
            {acc.label}
          </button>
        ))}
      </div>

      <div
        onClick={copyNumber}
        style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 12px', borderRadius: 10, background: 'var(--card)', cursor: 'pointer' }}
      >
        <span style={{ fontSize: 14, fontWeight: 700, fontFamily: 'monospace' }}>{MANUAL_ACCOUNTS[method].value}</span>
        <span style={{ fontSize: 11, color: 'var(--primary)', fontWeight: 700 }}>{copied ? 'Tersalin!' : 'Salin'}</span>
      </div>
      <span style={{ fontSize: 10.5, color: 'var(--muted)' }}>
        Transfer ke {MANUAL_ACCOUNTS[method].label} nomor di atas, isi jumlah yang beneran ditransfer, baru lapor.
      </span>

      <input
        type="number"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        placeholder="Jumlah transfer (Rp)"
        style={{ padding: '10px 12px', borderRadius: 10, border: '1px solid var(--border)', background: 'var(--card)', color: 'var(--ink)', fontSize: 13 }}
      />

      <button className="btn-outline" disabled={submitting} onClick={handleReport} style={{ opacity: submitting ? 0.6 : 1 }}>
        {submitting ? 'Mengirim...' : 'Saya sudah transfer'}
      </button>

      {status && (
        <div style={{ fontSize: 11.5, textAlign: 'center', color: status.kind === 'error' ? '#c0392b' : 'var(--muted)' }}>
          {status.text}
        </div>
      )}
    </div>
  );
}

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

      <ManualTransferSection donation={donation} user={user} amounts={amounts} />
    </div>
  );
}
