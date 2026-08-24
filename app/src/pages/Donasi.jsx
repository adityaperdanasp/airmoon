import { useEffect, useState } from 'react';
import { getOrSeedDonation, contribute } from '../lib/donations';
import { formatRupiah } from '../lib/zakat';
import BottomNav from '../components/BottomNav';

export default function Donasi() {
  const [donation, setDonation] = useState(null);

  useEffect(() => {
    getOrSeedDonation().then(setDonation);
  }, []);

  async function handleGive(amount) {
    await contribute(donation.id, amount);
    setDonation((d) => ({ ...d, collected: d.collected + amount }));
  }

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
      </div>
      <BottomNav />
    </div>
  );
}
