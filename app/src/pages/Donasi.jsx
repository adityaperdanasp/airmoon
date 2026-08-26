import { useEffect, useState } from 'react';
import { getOrSeedDonation, contribute, recordContribution, watchMyContributions } from '../lib/donations';
import { formatRupiah } from '../lib/zakat';
import { useAuth } from '../context/AuthContext';
import BottomNav from '../components/BottomNav';

const dateFmt = new Intl.DateTimeFormat('id-ID', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });

export default function Donasi() {
  const { user } = useAuth();
  const [donation, setDonation] = useState(null);
  const [myContributions, setMyContributions] = useState([]);

  useEffect(() => {
    getOrSeedDonation().then(setDonation);
  }, []);

  useEffect(() => {
    if (!user) return;
    return watchMyContributions(user.uid, setMyContributions);
  }, [user]);

  async function handleGive(amount) {
    await contribute(donation.id, amount);
    setDonation((d) => ({ ...d, collected: d.collected + amount }));
    if (user) await recordContribution(user.uid, donation, amount);
  }

  const myTotal = myContributions.reduce((sum, c) => sum + c.amount, 0);

  const pct = donation ? Math.min(100, Math.round((donation.collected / donation.target) * 100)) : 0;

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
          MENUNGGU ARAHAN MAMAS
        </div>

        {!donation && <div className="center" style={{ minHeight: 200 }}><div className="spinner" /></div>}

        {donation && (
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
            </div>
            <div style={{ display: 'flex', gap: 8 }}>
              {[10000, 25000, 50000].map((amt) => (
                <button key={amt} className="btn-outline" style={{ flex: 1, padding: '11px 0', fontSize: 12 }} onClick={() => handleGive(amt)}>
                  +{formatRupiah(amt).replace('Rp ', '')}
                </button>
              ))}
            </div>
          </div>
        )}

        {user && donation && (
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
