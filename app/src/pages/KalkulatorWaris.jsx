import { useState } from 'react';
import { calcWaris } from '../lib/warisCalc';
import { formatRupiah } from '../lib/zakat';
import PageHeaderPhoto from '../components/PageHeaderPhoto';
import { PAGE_PHOTOS } from '../data/photos';

function digitsOnly(v) {
  return v.replace(/\D/g, '');
}

function Stepper({ label, value, onChange, max = 20 }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 10 }}>
      <span style={{ fontSize: 13, fontWeight: 700 }}>{label}</span>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <button
          onClick={() => onChange(Math.max(0, value - 1))}
          style={{ width: 30, height: 30, borderRadius: '50%', border: '1px solid var(--border)', background: 'var(--card)', color: 'var(--ink)', fontWeight: 800, cursor: 'pointer' }}
        >
          −
        </button>
        <span style={{ fontSize: 14, fontWeight: 800, minWidth: 18, textAlign: 'center' }}>{value}</span>
        <button
          onClick={() => onChange(Math.min(max, value + 1))}
          style={{ width: 30, height: 30, borderRadius: '50%', border: '1px solid var(--border)', background: 'var(--card)', color: 'var(--ink)', fontWeight: 800, cursor: 'pointer' }}
        >
          +
        </button>
      </div>
    </div>
  );
}

function ToggleRow({ label, value, onChange }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 10 }}>
      <span style={{ fontSize: 13, fontWeight: 700 }}>{label}</span>
      <div
        onClick={() => onChange(!value)}
        style={{ width: 46, height: 26, borderRadius: 999, background: value ? 'var(--primary)' : 'var(--border)', cursor: 'pointer', display: 'flex', alignItems: 'center', padding: 3 }}
      >
        <div style={{ width: 20, height: 20, borderRadius: '50%', background: '#fff', transform: value ? 'translateX(20px)' : 'translateX(0)', transition: 'transform 0.15s ease' }} />
      </div>
    </div>
  );
}

const WARNING_TEXT = {
  aul: "⚠️ Total bagian fardh melebihi harta (kasus 'aul) — semua bagian di bawah sudah diskalakan proporsional sesuai ketentuan fiqh.",
  radd: '⚠️ Total bagian fardh tidak mencapai keseluruhan harta dan tidak ada ahli waris ashabah (anak/ayah) di sini yang menghabiskan sisanya — kasus ini butuh perhitungan radd (pengembalian sisa) yang belum dihitung otomatis. Sebaiknya konsultasikan ke ahli faraidh/ulama.',
};

// Kalkulator Waris (Ilmu Faraidh) — lihat lib/warisCalc.js untuk cakupan
// dan batasan lengkapnya (sengaja dibatasi ke kombinasi ahli waris paling
// umum). Reuses PAGE_PHOTOS.zakat — belum ada foto khusus buat halaman
// ini, dan temanya (fiqh muamalah/harta) cukup dekat dengan Zakat.
export default function KalkulatorWaris() {
  const [hasSuami, setHasSuami] = useState(false);
  const [jumlahIstri, setJumlahIstri] = useState(0);
  const [anakLaki, setAnakLaki] = useState(0);
  const [anakPerempuan, setAnakPerempuan] = useState(0);
  const [hasAyah, setHasAyah] = useState(false);
  const [hasIbu, setHasIbu] = useState(false);
  const [harta, setHarta] = useState('500000000');
  const hartaN = Number(digitsOnly(harta)) || 0;

  const noHeirs = !hasSuami && jumlahIstri === 0 && anakLaki === 0 && anakPerempuan === 0 && !hasAyah && !hasIbu;
  const { results, warnings } = noHeirs
    ? { results: [], warnings: [] }
    : calcWaris({ hasSuami, jumlahIstri, anakLaki, anakPerempuan, hasAyah, hasIbu, totalHarta: hartaN });

  return (
    <div className="screen">
      <div className="screen-content">
        <PageHeaderPhoto title="Kalkulator Waris" photo={PAGE_PHOTOS.zakat} subtitle="Ilmu Faraidh" />

        <div style={{ padding: '10px 14px', borderRadius: 12, background: 'var(--cream)', fontSize: 11, color: 'var(--gold-ink-dark)', lineHeight: 1.5 }}>
          Mengcover kombinasi ahli waris paling umum (suami/istri, anak, ayah/ibu). Kasus lebih kompleks (kakek/nenek, saudara kandung, cucu, wasiat, hutang jenazah) tidak tercakup — konsultasikan ke ahli faraidh/ulama untuk kasus itu.
        </div>

        <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: 14, padding: 16 }}>
          <span className="section-label" style={{ color: 'var(--muted)', fontSize: 11.5, letterSpacing: '0.04em', textTransform: 'uppercase' }}>
            Total Harta Warisan
          </span>
          <input
            inputMode="numeric"
            value={Number(harta).toLocaleString('id-ID')}
            onChange={(e) => setHarta(digitsOnly(e.target.value))}
            style={{ padding: '12px 14px', borderRadius: 12, border: '1px solid var(--border)', background: 'var(--bg)', color: 'var(--ink)', fontSize: 15, fontWeight: 700 }}
          />
        </div>

        <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: 16, padding: 16 }}>
          <span className="section-label" style={{ color: 'var(--muted)', fontSize: 11.5, letterSpacing: '0.04em', textTransform: 'uppercase' }}>
            Ahli Waris
          </span>
          <ToggleRow label="Suami" value={hasSuami} onChange={setHasSuami} />
          <Stepper label="Istri" value={jumlahIstri} onChange={setJumlahIstri} max={4} />
          <Stepper label="Anak Laki-laki" value={anakLaki} onChange={setAnakLaki} />
          <Stepper label="Anak Perempuan" value={anakPerempuan} onChange={setAnakPerempuan} />
          <ToggleRow label="Ayah" value={hasAyah} onChange={setHasAyah} />
          <ToggleRow label="Ibu" value={hasIbu} onChange={setHasIbu} />
        </div>

        {noHeirs && (
          <p className="state-msg">Pilih setidaknya satu ahli waris buat lihat pembagiannya.</p>
        )}

        {!noHeirs && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            <span className="section-label" style={{ color: 'var(--muted)', fontSize: 11.5, letterSpacing: '0.04em', textTransform: 'uppercase' }}>
              Pembagian
            </span>
            {warnings.map((w) => (
              <div key={w} style={{ padding: '10px 14px', borderRadius: 12, background: 'var(--cream)', fontSize: 11, color: 'var(--gold-ink-dark)', lineHeight: 1.5 }}>
                {WARNING_TEXT[w]}
              </div>
            ))}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {results.map((r, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 14px', borderRadius: 14, background: 'var(--card)' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    <span style={{ fontSize: 13, fontWeight: 700 }}>{r.label}</span>
                    <span style={{ fontSize: 10.5, color: 'var(--muted)' }}>{(r.fraction * 100).toFixed(2)}% bagian</span>
                  </div>
                  <span style={{ fontSize: 13.5, fontWeight: 700, color: 'var(--primary)' }}>{formatRupiah(r.amount)}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
