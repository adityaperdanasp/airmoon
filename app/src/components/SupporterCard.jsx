import { useState } from 'react';
import { reportSupporterPayment } from '../lib/donations';
import { formatRupiah } from '../lib/zakat';
import { MANUAL_ACCOUNTS } from './DonationCard';

const AMOUNTS = [15000, 30000, 50000];

// "Sahabat airmoon" — a supporter tier (2026-09-12), reusing the exact
// same manual-transfer + Telegram-confirm pipeline DonationCard's own
// ManualTransferSection already uses, just with no campaign attached (see
// lib/donations.js's reportSupporterPayment). Deliberately a one-time
// purchase, not a subscription — real recurring billing needs Midtrans's
// separate Subscription API, not wired up (same honesty stance as
// monthlyPledge elsewhere in this app). Unlocks: the Rose Gold accent
// color (Pengaturan.jsx's own gating), a small badge, and skipping the
// monthly donation-pledge push nag (see check-campaign-deadlines.js).
export default function SupporterCard({ user, isSupporter }) {
  const [open, setOpen] = useState(false);
  const [method, setMethod] = useState('gopay');
  const [amount, setAmount] = useState(AMOUNTS[0]);
  const [submitting, setSubmitting] = useState(false);
  const [status, setStatus] = useState(null);
  const [copied, setCopied] = useState(false);
  const [gifting, setGifting] = useState(false);
  const [giftEmail, setGiftEmail] = useState('');

  async function copyNumber() {
    try {
      await navigator.clipboard.writeText(MANUAL_ACCOUNTS[method].value);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      // Clipboard permission denied/unsupported — the number's still visible to copy by hand.
    }
  }

  async function handleReport() {
    if (!user) {
      setStatus({ kind: 'error', text: 'Masuk dulu buat jadi Sahabat airmoon.' });
      return;
    }
    if (gifting && !giftEmail.trim()) {
      setStatus({ kind: 'error', text: 'Isi email penerima hadiah dulu.' });
      return;
    }
    setSubmitting(true);
    setStatus(null);
    try {
      await reportSupporterPayment(amount, method, user, gifting ? giftEmail.trim() : undefined);
      setStatus({
        kind: 'success',
        text: gifting
          ? `Laporan terkirim! Begitu dikonfirmasi, status Sahabat airmoon bakal aktif buat ${giftEmail.trim()}.`
          : 'Laporan terkirim! Admin bakal cek & konfirmasi manual — status Sahabat airmoon kamu aktif begitu dikonfirmasi.',
      });
    } catch (err) {
      setStatus({ kind: 'error', text: err.message || 'Gagal melapor transfer.' });
    } finally {
      setSubmitting(false);
    }
  }

  if (isSupporter && !open) {
    return (
      <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: 10, padding: 16 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: 16, margin: -16, marginBottom: 0, borderRadius: '12px 12px 0 0', background: 'linear-gradient(135deg, #a8657a, #6e3d4c)' }}>
          <span style={{ fontSize: 22 }}>🌹</span>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
            <span style={{ fontSize: 13, fontWeight: 800, color: '#fff' }}>Kamu Sahabat airmoon</span>
            <span style={{ fontSize: 10.5, color: 'rgba(255,255,255,0.85)' }}>Terima kasih sudah mendukung — warna aksen Rose Gold sudah terbuka.</span>
          </div>
        </div>
        <button className="btn-outline" onClick={() => { setOpen(true); setGifting(true); }}>
          🎁 Hadiahkan ke Teman
        </button>
      </div>
    );
  }

  return (
    <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: 10, padding: 16 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <span style={{ fontSize: 22 }}>🌹</span>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
          <span style={{ fontSize: 13, fontWeight: 800 }}>{isSupporter ? 'Hadiahkan Sahabat airmoon' : 'Jadi Sahabat airmoon'}</span>
          <span style={{ fontSize: 10.5, color: 'var(--muted)' }}>
            {isSupporter
              ? 'Dukungan sekali bayar buat teman/keluarga — mereka yang dapat Rose Gold & bebas pengingat bulanan.'
              : 'Dukungan sekali bayar — buka warna aksen Rose Gold & gak dapet pengingat donasi bulanan lagi.'}
          </span>
        </div>
      </div>

      {!open ? (
        <button className="btn-outline" onClick={() => setOpen(true)}>
          Dukung Sekarang
        </button>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {!isSupporter && (
            <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12, color: 'var(--muted)', cursor: 'pointer' }}>
              <input type="checkbox" checked={gifting} onChange={(e) => setGifting(e.target.checked)} />
              🎁 Hadiahkan ke teman, bukan buat diri sendiri
            </label>
          )}
          {gifting && (
            <div className="input-row">
              <input type="email" placeholder="Email penerima hadiah" value={giftEmail} onChange={(e) => setGiftEmail(e.target.value)} />
            </div>
          )}
          <div style={{ display: 'flex', gap: 8 }}>
            {AMOUNTS.map((amt) => (
              <button
                key={amt}
                onClick={() => setAmount(amt)}
                aria-pressed={amount === amt}
                style={{
                  flex: 1,
                  padding: '9px 0',
                  borderRadius: 10,
                  fontSize: 12,
                  fontWeight: 700,
                  border: amount === amt ? '1.5px solid var(--primary)' : '1px solid var(--border)',
                  background: amount === amt ? 'var(--mint)' : 'transparent',
                  color: amount === amt ? 'var(--primary)' : 'var(--muted)',
                  cursor: 'pointer',
                }}
              >
                {formatRupiah(amt).replace('Rp ', '')}
              </button>
            ))}
          </div>

          <div style={{ display: 'flex', gap: 8 }}>
            {Object.entries(MANUAL_ACCOUNTS).map(([key, acc]) => (
              <button
                key={key}
                onClick={() => setMethod(key)}
                aria-pressed={method === key}
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
            style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 12px', borderRadius: 10, background: 'var(--bg)', cursor: 'pointer' }}
          >
            <span style={{ fontSize: 14, fontWeight: 700, fontFamily: 'monospace' }}>{MANUAL_ACCOUNTS[method].value}</span>
            <span style={{ fontSize: 11, color: 'var(--primary)', fontWeight: 700 }}>{copied ? 'Tersalin!' : 'Salin'}</span>
          </div>
          <span style={{ fontSize: 10.5, color: 'var(--muted)' }}>
            Transfer {formatRupiah(amount)} ke {MANUAL_ACCOUNTS[method].label} nomor di atas, baru lapor.
          </span>

          <button className="btn" disabled={submitting || (gifting && !giftEmail.trim())} onClick={handleReport}>
            {submitting ? 'Mengirim...' : 'Saya sudah transfer'}
          </button>

          {status && (
            <div style={{ fontSize: 11.5, textAlign: 'center', color: status.kind === 'error' ? 'var(--danger)' : 'var(--muted)' }}>
              {status.text}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
