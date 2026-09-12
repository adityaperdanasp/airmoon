import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { createMidtransTransaction, loadSnapScript, reportManualPayment } from '../lib/donations';
import { formatRupiah } from '../lib/zakat';
import { useAuth } from '../context/AuthContext';
import { watchUserProfile } from '../lib/profile';
import { isSupporterCrossSellEnabled } from '../lib/remoteConfig';
import { watchGratitude, postGratitude } from '../lib/gratitude';
import { watchDonationUpdates, postDonationUpdate } from '../lib/donationUpdates';

const dateFmt = new Intl.DateTimeFormat('id-ID', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });

// The founder's own accounts — interim path while waiting on Midtrans
// Production approval (see api/report-manual-payment.js). Meant to be
// shown publicly to donors, not a secret. Exported so Pengaturan.jsx's
// "Sahabat airmoon" supporter card (2026-09-12) can reuse the same real
// account numbers rather than risking a second, driftable copy.
export const MANUAL_ACCOUNTS = {
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

      {/* Bulatkan & Sedekahkan (2026-09-12) — a one-tap round-up-to-nearest-
          Rp5.000 suggestion, only shown when the typed amount isn't already
          a round number and is a real positive value. Framing the
          difference as "sedekah tambahan" is the whole point — a proven
          micro-giving pattern (round-up fintech apps), applied honestly
          here since it's purely a one-tap suggestion, never automatic. */}
      {(() => {
        const amountNum = Number(amount);
        if (!Number.isFinite(amountNum) || amountNum <= 0 || amountNum % 5000 === 0) return null;
        const rounded = Math.ceil(amountNum / 5000) * 5000;
        return (
          <button
            type="button"
            onClick={() => setAmount(String(rounded))}
            style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '9px 12px', borderRadius: 10, border: '1px dashed var(--primary)', background: 'var(--mint)', color: 'var(--primary)', fontSize: 11.5, fontWeight: 700, cursor: 'pointer' }}
          >
            <span>🌙 Bulatkan jadi {formatRupiah(rounded)}?</span>
            <span>+{formatRupiah(rounded - amountNum)} sedekah tambahan</span>
          </button>
        );
      })()}

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

// Update dari Masjid + Wall of Gratitude (2026-09-12) — collapsed by
// default so it doesn't bloat this same component's compact rendering on
// Home. See lib/donationUpdates.js/lib/gratitude.js for the two
// underlying features; kept in one collapsible section since they're
// both "extra context about this specific campaign", not core to the
// give-money flow above.
function UpdatesAndGratitude({ donation, user }) {
  const [open, setOpen] = useState(false);
  const [updates, setUpdates] = useState(null);
  const [gratitude, setGratitude] = useState(null);
  const [text, setText] = useState('');
  const [posting, setPosting] = useState(false);
  const [updateText, setUpdateText] = useState('');
  const [postingUpdate, setPostingUpdate] = useState(false);
  const isFunded = donation.collected >= donation.target;
  const isSubmitter = !!user && !!donation.submitterUid && user.uid === donation.submitterUid;

  useEffect(() => {
    if (!open) return;
    const unsubUpdates = watchDonationUpdates(donation.id, setUpdates);
    const unsubGratitude = watchGratitude(donation.id, setGratitude);
    return () => {
      unsubUpdates();
      unsubGratitude();
    };
  }, [open, donation.id]);

  async function handlePost(e) {
    e.preventDefault();
    if (!user || posting) return;
    setPosting(true);
    try {
      await postGratitude(donation.id, text, user);
      setText('');
    } finally {
      setPosting(false);
    }
  }

  async function handlePostUpdate(e) {
    e.preventDefault();
    if (!user || postingUpdate) return;
    setPostingUpdate(true);
    try {
      await postDonationUpdate(donation.id, updateText, user);
      setUpdateText('');
    } finally {
      setPostingUpdate(false);
    }
  }

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        style={{ background: 'none', border: 'none', color: 'var(--muted)', fontSize: 11.5, textDecoration: 'underline', cursor: 'pointer', padding: 0 }}
      >
        Update & Ucapan Masjid
      </button>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
      {updates?.length > 0 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          <span style={{ fontSize: 10.5, fontWeight: 700, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.03em' }}>Update dari Masjid</span>
          {updates.map((u) => (
            <p key={u.id} style={{ margin: 0, fontSize: 12, lineHeight: 1.5, padding: '8px 10px', borderRadius: 10, background: 'var(--bg)' }}>{u.text}</p>
          ))}
        </div>
      )}

      {gratitude?.length > 0 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          <span style={{ fontSize: 10.5, fontWeight: 700, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.03em' }}>Ucapan Terima Kasih</span>
          {gratitude.map((g) => (
            <div key={g.id} style={{ padding: '8px 10px', borderRadius: 10, background: 'var(--cream)' }}>
              <span style={{ fontSize: 12, lineHeight: 1.5 }}>{g.text}</span>
              <div style={{ fontSize: 10, color: 'var(--muted)', marginTop: 2 }}>— {g.authorName}</div>
            </div>
          ))}
        </div>
      )}

      {isSubmitter && (
        <form onSubmit={handlePostUpdate} style={{ display: 'flex', gap: 8 }}>
          <div className="input-row" style={{ flex: 1 }}>
            <input placeholder="Tulis update progress campaign..." value={updateText} onChange={(e) => setUpdateText(e.target.value)} maxLength={500} />
          </div>
          <button className="btn" type="submit" style={{ width: 'auto', padding: '0 16px' }} disabled={postingUpdate || !updateText.trim()}>Post</button>
        </form>
      )}

      {isFunded && user && (
        <form onSubmit={handlePost} style={{ display: 'flex', gap: 8 }}>
          <div className="input-row" style={{ flex: 1 }}>
            <input placeholder="Tulis ucapan terima kasih..." value={text} onChange={(e) => setText(e.target.value)} maxLength={300} />
          </div>
          <button className="btn" type="submit" style={{ width: 'auto', padding: '0 16px' }} disabled={posting || !text.trim()}>Kirim</button>
        </form>
      )}

      {!updates?.length && !gratitude?.length && (
        <span style={{ fontSize: 11, color: 'var(--muted-soft)' }}>Belum ada update atau ucapan buat campaign ini.</span>
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
  const [isSupporter, setIsSupporter] = useState(false);
  // [PM 2026-09-12] A one-time cross-sell moment right after a real
  // payment succeeds — someone who just donated has both intent and
  // trust in this exact moment, unlike a cold prompt shown out of
  // context elsewhere. Only for non-supporters, and only via the real
  // Midtrans onSuccess callback: the manual-transfer path is confirmed
  // later by the founder tapping a Telegram link, outside this client
  // session entirely, so there's no equivalent live moment to hook there.
  const [showSupporterCrossSell, setShowSupporterCrossSell] = useState(false);

  useEffect(() => watchUserProfile(user?.uid, (p) => setIsSupporter(p?.isSupporter || false)), [user?.uid]);

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
        onSuccess: () => {
          setStatus({ kind: 'success', text: 'Pembayaran berhasil! Terima kasih — angka terkumpul akan update sebentar lagi.' });
          if (!isSupporter && isSupporterCrossSellEnabled()) setShowSupporterCrossSell(true);
        },
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

      {/* [PM 2026-09-12] Originally scoped as a "verified" filter badge,
          re-scoped after checking api/approve-masjid.js: every single
          live campaign is ALREADY only ever created via that manually-
          reviewed pipeline (donations/{id} has been fully server-write-
          only for a while now — see firestore.rules) — there's no
          "unverified" tier to actually distinguish from. A plain trust
          signal instead, shown on all of them equally, honestly
          reflecting what's actually true rather than implying a filter
          that doesn't exist. */}
      <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, alignSelf: 'flex-start', fontSize: 10, fontWeight: 700, color: 'var(--success)' }}>
        <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="m4 12 5 5L20 6" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" /></svg>
        Direview Tim airmoon
      </span>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        <div style={{ width: '100%', height: 7, borderRadius: 999, overflow: 'hidden', background: 'var(--mint)' }}>
          <div style={{ width: `${pct}%`, height: '100%', background: 'var(--accent)' }} />
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: 'var(--muted)' }}>
          <span><strong style={{ color: 'var(--ink)' }}>{formatRupiah(donation.collected)}</strong> terkumpul</span>
          <span>dari {formatRupiah(donation.target)}</span>
        </div>
        {donation.deadline && (() => {
          const daysLeft = Math.ceil((new Date(donation.deadline) - Date.now()) / 86400000);
          // Urgency only kicks in inside a real, close window (≤7 days,
          // still in the future) — a deadline months away shouldn't read
          // as alarming, and one already passed is a different state
          // entirely (not this card's job to handle).
          const urgent = daysLeft >= 0 && daysLeft <= 7;
          return (
            <span style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 10.5, fontWeight: urgent ? 700 : 400, color: urgent ? 'var(--danger)' : 'var(--muted)' }}>
              {urgent && <span style={{ width: 5, height: 5, borderRadius: '50%', background: 'var(--danger)', flexShrink: 0 }} />}
              Batas waktu {dateFmt.format(new Date(donation.deadline))}
              {urgent && ` · ${daysLeft === 0 ? 'hari ini!' : `${daysLeft} hari lagi`}`}
            </span>
          );
        })()}
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

      {showSupporterCrossSell && (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 10, padding: '10px 12px', borderRadius: 12, background: 'linear-gradient(135deg, #a8657a, #6e3d4c)' }}>
          <span style={{ fontSize: 11.5, color: '#fff', fontWeight: 700 }}>🌹 Sekalian jadi Sahabat airmoon?</span>
          <div style={{ display: 'flex', gap: 6, flexShrink: 0 }}>
            <Link to="/pengaturan" style={{ fontSize: 11, fontWeight: 700, color: '#fff', textDecoration: 'underline' }}>Lihat</Link>
            <button
              onClick={() => setShowSupporterCrossSell(false)}
              aria-label="Tutup"
              style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.8)', fontSize: 14, cursor: 'pointer', padding: 0, lineHeight: 1 }}
            >
              ×
            </button>
          </div>
        </div>
      )}

      <ManualTransferSection donation={donation} user={user} amounts={amounts} />
      <UpdatesAndGratitude donation={donation} user={user} />
    </div>
  );
}
