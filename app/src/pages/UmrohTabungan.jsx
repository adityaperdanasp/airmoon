import { useState } from 'react';
import TopBar from '../components/TopBar';
import { formatRupiah } from '../lib/zakat';

// A real calculator (target ÷ months = monthly savings), not just a
// static tips list — but deliberately NOT a persistent balance tracker
// (that would need its own Firestore collection + a "add sedekah"-style
// entry flow, a bigger feature to scope separately if wanted later).
// Being upfront about that scope limit here rather than implying more
// than what's actually built.
export default function UmrohTabungan() {
  const [target, setTarget] = useState('30000000');
  const [months, setMonths] = useState('12');

  const targetNum = Number(target) || 0;
  const monthsNum = Number(months) || 0;
  const perMonth = monthsNum > 0 ? Math.ceil(targetNum / monthsNum) : 0;

  return (
    <div className="screen">
      <div className="screen-content">
        <TopBar title="Tabungan Umroh" />

        <div className="card" style={{ padding: 18, display: 'flex', flexDirection: 'column', gap: 14 }}>
          <h2 style={{ margin: 0, fontSize: 14, fontWeight: 800 }}>Hitung Tabungan Bulanan</h2>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            <span style={{ fontSize: 12, fontWeight: 700 }}>Target biaya umroh (Rp)</span>
            <div className="input-row">
              <input
                type="number"
                inputMode="numeric"
                value={target}
                onChange={(e) => setTarget(e.target.value)}
                placeholder="30000000"
              />
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            <span style={{ fontSize: 12, fontWeight: 700 }}>Target waktu (bulan)</span>
            <div className="input-row">
              <input
                type="number"
                inputMode="numeric"
                value={months}
                onChange={(e) => setMonths(e.target.value)}
                placeholder="12"
              />
            </div>
          </div>

          <div style={{ borderRadius: 16, padding: '16px', textAlign: 'center', background: `linear-gradient(135deg, var(--primary), var(--primary-dark))` }}>
            <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.04em', textTransform: 'uppercase', color: 'var(--accent)' }}>
              Perlu ditabung tiap bulan
            </div>
            <div style={{ fontSize: 26, fontWeight: 800, color: '#fff', marginTop: 6 }}>
              {formatRupiah(perMonth)}
            </div>
          </div>
        </div>

        <div className="card" style={{ padding: 16, display: 'flex', flexDirection: 'column', gap: 10 }}>
          <h2 style={{ margin: 0, fontSize: 14, fontWeight: 800, color: 'var(--primary)' }}>Tips Menabung untuk Umroh</h2>
          <ul style={{ margin: 0, paddingLeft: 18, display: 'flex', flexDirection: 'column', gap: 6 }}>
            <li style={{ fontSize: 12.5, lineHeight: 1.55 }}>Pisahkan rekening/tabungan khusus umroh dari rekening harian, biar gak kepakai buat kebutuhan lain.</li>
            <li style={{ fontSize: 12.5, lineHeight: 1.55 }}>Autodebet di awal bulan (pas gajian) lebih konsisten daripada nabung sisa di akhir bulan.</li>
            <li style={{ fontSize: 12.5, lineHeight: 1.55 }}>Hindari produk tabungan/pinjaman berbasis riba (bunga) — cari yang syariah kalau mau ikut program tabungan travel.</li>
            <li style={{ fontSize: 12.5, lineHeight: 1.55 }}>Sedekah tetap jalan meski lagi nabung — bukan menunda kebaikan, insyaallah dimudahkan rezekinya.</li>
            <li style={{ fontSize: 12.5, lineHeight: 1.55 }}>Cek juga kurs & waktu keberangkatan — harga paket umroh biasanya naik musim liburan/Ramadan.</li>
          </ul>
        </div>

        <p className="muted" style={{ margin: 0, fontSize: 11, lineHeight: 1.5 }}>
          Kalkulator ini cuma bantu hitung, belum nyimpen progress tabungan kamu di akun — kalau butuh fitur pencatatan tabungan beneran (nyimpen histori setoran), kasih tau ya, itu fitur terpisah.
        </p>
      </div>
    </div>
  );
}
