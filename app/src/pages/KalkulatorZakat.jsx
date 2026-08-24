import { useState } from 'react';
import { calcZakatPenghasilan, formatRupiah } from '../lib/zakat';
import TopBar from '../components/TopBar';

export default function KalkulatorZakat() {
  const [income, setIncome] = useState('15000000');
  const [needs, setNeeds] = useState('5000000');

  const incomeN = Number(income.replace(/\D/g, '')) || 0;
  const needsN = Number(needs.replace(/\D/g, '')) || 0;
  const zakat = calcZakatPenghasilan(incomeN, needsN);

  return (
    <div className="screen">
      <div className="screen-content">
        <TopBar title="Kalkulator Zakat" />

        <div style={{ display: 'flex', flexDirection: 'column', gap: 7 }}>
          <span style={{ fontSize: 12, fontWeight: 700 }}>Penghasilan per Bulan</span>
          <div className="input-row">
            <span style={{ fontSize: 13.5, fontWeight: 700, color: 'var(--muted)' }}>Rp</span>
            <input inputMode="numeric" value={Number(income).toLocaleString('id-ID')} onChange={(e) => setIncome(e.target.value)} />
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 7 }}>
          <span style={{ fontSize: 12, fontWeight: 700 }}>Kebutuhan Pokok per Bulan</span>
          <div className="input-row">
            <span style={{ fontSize: 13.5, fontWeight: 700, color: 'var(--muted)' }}>Rp</span>
            <input inputMode="numeric" value={Number(needs).toLocaleString('id-ID')} onChange={(e) => setNeeds(e.target.value)} />
          </div>
        </div>

        <div style={{ borderRadius: 20, padding: 20, textAlign: 'center', background: `linear-gradient(135deg, var(--primary), var(--primary-dark))` }}>
          <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.04em', textTransform: 'uppercase', color: 'var(--accent)' }}>
            Zakat yang Wajib Dibayar
          </span>
          <div style={{ fontSize: 30, fontWeight: 800, color: '#fff', marginTop: 8 }}>{formatRupiah(zakat)}</div>
          <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.7)' }}>
            2.5% &times; ({formatRupiah(incomeN)} &minus; {formatRupiah(needsN)})
          </span>
        </div>

        <button className="btn">Bayar Zakat Sekarang</button>

        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10, padding: '13px 14px', borderRadius: 14, background: 'var(--card)' }}>
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="var(--muted)" style={{ flexShrink: 0, marginTop: 1 }}>
            <circle cx="12" cy="12" r="9" strokeWidth="1.6" /><path d="M12 11v5.5M12 8v.01" strokeWidth="1.8" strokeLinecap="round" />
          </svg>
          <span style={{ fontSize: 11, lineHeight: 1.5, color: 'var(--muted)' }}>
            Perhitungan zakat penghasilan pakai standar 2.5% dari sisa penghasilan setelah kebutuhan pokok. Konsultasikan ke amil zakat buat kondisi khusus.
          </span>
        </div>
      </div>
    </div>
  );
}
