import { useEffect, useState } from 'react';
import { watchMyContributions, watchActiveDonations, watchMonthlyPledge, setMonthlyPledge, cancelMonthlyPledge } from '../lib/donations';
import { formatRupiah } from '../lib/zakat';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import BottomNav from '../components/BottomNav';
import DonationCard from '../components/DonationCard';
import { markSeen } from '../lib/unseenBadges';
import EmptyState from '../components/EmptyState';
import { SkeletonCard } from '../components/Skeleton';
import ReceiptShareModal from '../components/ReceiptShareModal';

const PLEDGE_AMOUNTS = [25000, 50000, 100000];

// A monthly REMINDER, not real recurring billing — see lib/donations.js's
// own comment on watchMonthlyPledge for why that distinction matters here
// specifically (no saved payment method, no auto-charge — every month
// still needs a real tap-through Midtrans/manual-transfer confirmation).
function MonthlyPledgeCard({ user }) {
  const { showToast } = useToast();
  const [pledge, setPledge] = useState(null);
  const [amount, setAmount] = useState(PLEDGE_AMOUNTS[0]);
  const [saving, setSaving] = useState(false);

  useEffect(() => watchMonthlyPledge(user?.uid, setPledge), [user?.uid]);

  if (!user) return null;

  async function handleSet(amt) {
    setSaving(true);
    try {
      await setMonthlyPledge(user.uid, amt);
      showToast('Pengingat donasi bulanan diaktifkan');
    } finally {
      setSaving(false);
    }
  }

  async function handleCancel() {
    setSaving(true);
    try {
      await cancelMonthlyPledge(user.uid);
      showToast('Pengingat donasi bulanan dimatikan');
    } finally {
      setSaving(false);
    }
  }

  if (pledge?.active) {
    return (
      <div className="card" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 10, padding: '14px 16px' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <span style={{ fontSize: 13, fontWeight: 700 }}>🔔 Pengingat Donasi Bulanan Aktif</span>
          <span style={{ fontSize: 11, color: 'var(--muted)' }}>Diingatkan tiap bulan buat donasi {formatRupiah(pledge.amount)}</span>
        </div>
        <button className="btn-outline" style={{ padding: '8px 12px', fontSize: 11.5, flexShrink: 0 }} disabled={saving} onClick={handleCancel}>
          Matikan
        </button>
      </div>
    );
  }

  return (
    <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: 10, padding: '14px 16px' }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        <span style={{ fontSize: 13, fontWeight: 700 }}>🔔 Pengingat Donasi Bulanan</span>
        <span style={{ fontSize: 11, color: 'var(--muted)' }}>
          Diingatkan tiap bulan buat sedekah rutin — bukan auto-debit, kamu tetap konfirmasi bayar sendiri tiap kali.
        </span>
      </div>
      <div style={{ display: 'flex', gap: 8 }}>
        {PLEDGE_AMOUNTS.map((amt) => (
          <button
            key={amt}
            onClick={() => setAmount(amt)}
            style={{
              flex: 1,
              padding: '8px 0',
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
      <button className="btn-outline" disabled={saving} onClick={() => handleSet(amount)}>
        Aktifkan Pengingat
      </button>
    </div>
  );
}

const dateFmt = new Intl.DateTimeFormat('id-ID', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });

// Set once the real Google Form exists (see CLAUDE.md's "Daftarkan Masjid"
// note) — VITE_MASJID_FORM_URL is the form's public URL, and
// VITE_MASJID_FORM_EMAIL_ENTRY is the `entry.<id>` query param name for its
// email field (from Google Forms' own "Get pre-filled link" feature), so
// the CTA below can open it with the logged-in user's email already
// filled in. Both are Vite build-time env vars — missing either just hides
// the CTA instead of linking to a broken/unprefillable form.
const MASJID_FORM_URL = import.meta.env.VITE_MASJID_FORM_URL;
const MASJID_FORM_EMAIL_ENTRY = import.meta.env.VITE_MASJID_FORM_EMAIL_ENTRY;

function DaftarkanMasjidCard({ user }) {
  if (!MASJID_FORM_URL) return null;

  if (!user) {
    return (
      <div className="card" style={{ padding: 16, fontSize: 12.5, color: 'var(--muted)', textAlign: 'center' }}>
        Punya masjid/mushola yang butuh bantuan listrik? <a href="/login" style={{ color: 'var(--primary)', fontWeight: 700 }}>Masuk dulu</a> buat daftarkan.
      </div>
    );
  }

  const href = MASJID_FORM_EMAIL_ENTRY
    ? `${MASJID_FORM_URL}${MASJID_FORM_URL.includes('?') ? '&' : '?'}${MASJID_FORM_EMAIL_ENTRY}=${encodeURIComponent(user.email)}`
    : MASJID_FORM_URL;

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="card"
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 10,
        padding: '14px 16px',
        textDecoration: 'none',
        color: 'inherit',
        border: '1.5px dashed var(--gold-ink)',
      }}
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        <span style={{ fontSize: 13.5, fontWeight: 700 }}>Daftarkan Masjid Anda</span>
        <span style={{ fontSize: 11, color: 'var(--muted)' }}>Butuh bantuan listrik untuk masjid/musholamu? Ajukan di sini.</span>
      </div>
      <span style={{ fontSize: 18, color: 'var(--gold-ink)' }}>→</span>
    </a>
  );
}

export default function Donasi() {
  const { user } = useAuth();
  const [donations, setDonations] = useState(null);
  const [myContributions, setMyContributions] = useState([]);
  const [receiptFor, setReceiptFor] = useState(null); // the contribution being shared as a receipt image, or null

  useEffect(() => watchActiveDonations(setDonations), []);

  useEffect(() => {
    if (!user) return;
    return watchMyContributions(user.uid, setMyContributions);
  }, [user]);

  useEffect(() => {
    return () => markSeen('donasi');
  }, []);

  const myTotal = myContributions.reduce((sum, c) => sum + c.amount, 0);

  return (
    <div className="screen">
      <div className="screen-content">
        <h1 style={{ margin: 0, fontSize: 22, fontWeight: 800 }}>Donasi</h1>

        <div
          style={{
            padding: '10px 14px',
            borderRadius: 12,
            border: '1px dashed var(--border)',
            fontSize: 11,
            fontWeight: 700,
            letterSpacing: '0.02em',
            color: 'var(--muted)',
            textAlign: 'center',
          }}
        >
          Gimana mas udah ok gak?
        </div>

        <DaftarkanMasjidCard user={user} />
        <MonthlyPledgeCard user={user} />

        {!donations && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <SkeletonCard height={140} />
            <SkeletonCard height={140} />
          </div>
        )}

        {donations && donations.length === 0 && (
          <EmptyState icon="🕌" title="Belum ada campaign aktif" subtitle="Campaign donasi listrik masjid baru bakal muncul di sini begitu ada yang disetujui." />
        )}

        {donations && donations.length > 0 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {donations.map((donation) => (
              <DonationCard key={donation.id} donation={donation} />
            ))}
          </div>
        )}

        {user && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ fontSize: 14, fontWeight: 800 }}>Donasi Kamu</span>
              {myContributions.length > 0 && (
                <span style={{ fontSize: 12, color: 'var(--muted)' }}>
                  Total <strong style={{ color: 'var(--primary)' }}>{formatRupiah(myTotal)}</strong>
                </span>
              )}
            </div>

            {myContributions.length === 0 ? (
              <EmptyState icon="💝" title="Belum ada riwayat sedekah" subtitle="Yuk mulai sedekah hari ini, sekecil apapun — pilih salah satu campaign di atas." />
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {myContributions.map((c) => (
                  <div
                    key={c.id}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '12px 14px',
                      borderRadius: 14,
                      background: 'var(--card)',
                    }}
                  >
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                      <span style={{ fontSize: 13, fontWeight: 700 }}>{c.donationTitle}</span>
                      <span style={{ fontSize: 11, color: 'var(--muted)' }}>{c.createdAt ? dateFmt.format(c.createdAt.toDate()) : 'Baru saja'}</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <span style={{ fontSize: 13.5, fontWeight: 700, color: 'var(--primary)' }}>+{formatRupiah(c.amount)}</span>
                      <button
                        onClick={() => setReceiptFor(c)}
                        aria-label="Bagikan bukti sedekah"
                        title="Bagikan bukti sedekah"
                        style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer', color: 'var(--muted-soft)', display: 'flex' }}
                      >
                        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                          <path d="M12 3v13M12 3 8 7M12 3l4 4" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                          <path d="M5 14v4.5A2.5 2.5 0 0 0 7.5 21h9a2.5 2.5 0 0 0 2.5-2.5V14" strokeWidth="1.6" strokeLinecap="round" />
                        </svg>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
      <BottomNav />

      {receiptFor && <ReceiptShareModal contribution={receiptFor} onClose={() => setReceiptFor(null)} />}
    </div>
  );
}
