import { useEffect, useState } from 'react';
import { contribute, recordContribution, watchMyContributions, watchActiveDonations } from '../lib/donations';
import { formatRupiah } from '../lib/zakat';
import { useAuth } from '../context/AuthContext';
import BottomNav from '../components/BottomNav';

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

function DonationCard({ donation, onGive }) {
  const pct = Math.min(100, Math.round((donation.collected / donation.target) * 100));
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
        {[10000, 25000, 50000].map((amt) => (
          <button key={amt} className="btn-outline" style={{ flex: 1, padding: '11px 0', fontSize: 12 }} onClick={() => onGive(donation, amt)}>
            +{formatRupiah(amt).replace('Rp ', '')}
          </button>
        ))}
      </div>
    </div>
  );
}

export default function Donasi() {
  const { user } = useAuth();
  const [donations, setDonations] = useState(null);
  const [myContributions, setMyContributions] = useState([]);

  useEffect(() => watchActiveDonations(setDonations), []);

  useEffect(() => {
    if (!user) return;
    return watchMyContributions(user.uid, setMyContributions);
  }, [user]);

  async function handleGive(donation, amount) {
    await contribute(donation.id, amount);
    if (user) await recordContribution(user.uid, donation, amount);
  }

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

        {!donations && <div className="center" style={{ minHeight: 200 }}><div className="spinner" /></div>}

        {donations && donations.length === 0 && (
          <div className="card" style={{ padding: 16, fontSize: 12.5, color: 'var(--muted)', textAlign: 'center' }}>
            Belum ada campaign aktif saat ini.
          </div>
        )}

        {donations && donations.length > 0 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {donations.map((donation) => (
              <DonationCard key={donation.id} donation={donation} onGive={handleGive} />
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
              <div className="card" style={{ padding: 16, fontSize: 12.5, color: 'var(--muted)', textAlign: 'center' }}>
                Belum ada donasi. Yuk mulai sedekah hari ini.
              </div>
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
                    <span style={{ fontSize: 13.5, fontWeight: 700, color: 'var(--primary)' }}>+{formatRupiah(c.amount)}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
      <BottomNav />
    </div>
  );
}
