import { useState } from 'react';
import { calcWaris } from '../lib/warisCalc';
import { formatRupiah } from '../lib/zakat';
import PageHeaderPhoto from '../components/PageHeaderPhoto';
import { PAGE_PHOTOS } from '../data/photos';
import WarisShareModal from '../components/WarisShareModal';
import ConfirmDialog from '../components/ConfirmDialog';
import { loadWarisScenarios, saveWarisScenario, deleteWarisScenario } from '../lib/warisScenarios';

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
  const [showShare, setShowShare] = useState(false);
  const [scenarios, setScenarios] = useState(loadWarisScenarios);
  const [scenarioName, setScenarioName] = useState('');
  const [showSaveScenario, setShowSaveScenario] = useState(false);
  const [deleteScenarioId, setDeleteScenarioId] = useState(null);
  const [showCompare, setShowCompare] = useState(false);
  const [compareAId, setCompareAId] = useState(null);
  const [compareBId, setCompareBId] = useState(null);

  function applyScenario(s) {
    setHasSuami(s.inputs.hasSuami);
    setJumlahIstri(s.inputs.jumlahIstri);
    setAnakLaki(s.inputs.anakLaki);
    setAnakPerempuan(s.inputs.anakPerempuan);
    setHasAyah(s.inputs.hasAyah);
    setHasIbu(s.inputs.hasIbu);
    setHarta(s.inputs.harta);
  }

  function handleSaveScenario() {
    const name = scenarioName.trim() || `Skenario ${scenarios.length + 1}`;
    setScenarios(saveWarisScenario(name, { hasSuami, jumlahIstri, anakLaki, anakPerempuan, hasAyah, hasIbu, harta }));
    setScenarioName('');
    setShowSaveScenario(false);
  }

  const noHeirs = !hasSuami && jumlahIstri === 0 && anakLaki === 0 && anakPerempuan === 0 && !hasAyah && !hasIbu;
  const { results, warnings } = noHeirs
    ? { results: [], warnings: [] }
    : calcWaris({ hasSuami, jumlahIstri, anakLaki, anakPerempuan, hasAyah, hasIbu, totalHarta: hartaN });

  // Bandingkan 2 Skenario Berdampingan — previously scenarios could only
  // be applied one at a time, overwriting the form; comparing two meant
  // manually remembering the first result while looking at the second.
  // This computes both results fresh from the saved inputs, side by side,
  // without touching the live form state above at all.
  function scenarioResult(s) {
    if (!s) return null;
    const { hasSuami: hs, jumlahIstri: ji, anakLaki: al, anakPerempuan: ap, hasAyah: ha, hasIbu: hi, harta: h } = s.inputs;
    const totalHarta = Number(digitsOnly(String(h))) || 0;
    const noH = !hs && ji === 0 && al === 0 && ap === 0 && !ha && !hi;
    return noH ? { results: [], warnings: [], totalHarta } : { ...calcWaris({ hasSuami: hs, jumlahIstri: ji, anakLaki: al, anakPerempuan: ap, hasAyah: ha, hasIbu: hi, totalHarta }), totalHarta };
  }
  const compareA = scenarios.find((s) => s.id === compareAId);
  const compareB = scenarios.find((s) => s.id === compareBId);
  const compareAResult = scenarioResult(compareA);
  const compareBResult = scenarioResult(compareB);

  return (
    <div className="screen">
      <div className="screen-content">
        <PageHeaderPhoto title="Kalkulator Waris" photo={PAGE_PHOTOS.zakat} subtitle="Ilmu Faraidh" />

        <div style={{ padding: '10px 14px', borderRadius: 12, background: 'var(--cream)', fontSize: 11, color: 'var(--gold-ink-dark)', lineHeight: 1.5 }}>
          Mengcover kombinasi ahli waris paling umum (suami/istri, anak, ayah/ibu). Kasus lebih kompleks (kakek/nenek, saudara kandung, cucu, wasiat, hutang jenazah) tidak tercakup — konsultasikan ke ahli faraidh/ulama untuk kasus itu.
        </div>

        <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: 12, padding: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span className="section-label" style={{ color: 'var(--muted)', fontSize: 11.5, letterSpacing: '0.04em', textTransform: 'uppercase' }}>
              Skenario Tersimpan
            </span>
            <div style={{ display: 'flex', gap: 12 }}>
              {scenarios.length >= 2 && (
                <button
                  onClick={() => setShowCompare((v) => !v)}
                  style={{ background: 'none', border: 'none', color: 'var(--primary)', fontSize: 11, fontWeight: 700, cursor: 'pointer', padding: 0 }}
                >
                  ⇄ Bandingkan
                </button>
              )}
              <button
                onClick={() => setShowSaveScenario((v) => !v)}
                style={{ background: 'none', border: 'none', color: 'var(--primary)', fontSize: 11, fontWeight: 700, cursor: 'pointer', padding: 0 }}
              >
                + Simpan Ini
              </button>
            </div>
          </div>

          {showSaveScenario && (
            <div style={{ display: 'flex', gap: 8 }}>
              <input
                autoFocus
                value={scenarioName}
                onChange={(e) => setScenarioName(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSaveScenario()}
                placeholder="Nama skenario, misal 'Ada anak laki-laki'"
                style={{ flex: 1, padding: '10px 12px', borderRadius: 10, border: '1px solid var(--border)', background: 'var(--bg)', color: 'var(--ink)', fontSize: 13 }}
              />
              <button className="btn" onClick={handleSaveScenario} style={{ padding: '0 16px' }}>Simpan</button>
            </div>
          )}

          {scenarios.length === 0 ? (
            <span style={{ fontSize: 11.5, color: 'var(--muted)' }}>Belum ada skenario tersimpan. Atur ahli waris di bawah, lalu simpan buat dibandingkan nanti.</span>
          ) : (
            <div className="hide-scrollbar" style={{ display: 'flex', gap: 8, overflowX: 'auto' }}>
              {scenarios.map((s) => (
                <div key={s.id} style={{ flexShrink: 0, display: 'flex', alignItems: 'center', gap: 6, padding: '8px 6px 8px 12px', borderRadius: 999, background: 'var(--mint-soft)' }}>
                  <button onClick={() => applyScenario(s)} style={{ background: 'none', border: 'none', color: 'var(--ink)', fontSize: 12, fontWeight: 700, cursor: 'pointer', padding: 0, whiteSpace: 'nowrap' }}>
                    {s.name}
                  </button>
                  <button
                    onClick={() => setDeleteScenarioId(s.id)}
                    aria-label={`Hapus skenario ${s.name}`}
                    style={{ width: 20, height: 20, borderRadius: '50%', border: 'none', background: 'rgba(0,0,0,0.08)', color: 'var(--muted)', fontSize: 12, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          )}

          {showCompare && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12, paddingTop: 4 }}>
              <div style={{ display: 'flex', gap: 8 }}>
                <select
                  value={compareAId || ''}
                  onChange={(e) => setCompareAId(e.target.value || null)}
                  style={{ flex: 1, padding: '9px 10px', borderRadius: 10, border: '1px solid var(--border)', background: 'var(--bg)', color: 'var(--ink)', fontSize: 12 }}
                >
                  <option value="">Pilih Skenario A</option>
                  {scenarios.map((s) => (
                    <option key={s.id} value={s.id}>{s.name}</option>
                  ))}
                </select>
                <select
                  value={compareBId || ''}
                  onChange={(e) => setCompareBId(e.target.value || null)}
                  style={{ flex: 1, padding: '9px 10px', borderRadius: 10, border: '1px solid var(--border)', background: 'var(--bg)', color: 'var(--ink)', fontSize: 12 }}
                >
                  <option value="">Pilih Skenario B</option>
                  {scenarios.map((s) => (
                    <option key={s.id} value={s.id}>{s.name}</option>
                  ))}
                </select>
              </div>

              {compareA && compareB && (
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                  {[{ s: compareA, r: compareAResult }, { s: compareB, r: compareBResult }].map(({ s, r }, colIdx) => (
                    <div key={colIdx} style={{ display: 'flex', flexDirection: 'column', gap: 6, padding: 10, borderRadius: 12, background: 'var(--mint-soft)' }}>
                      <span style={{ fontSize: 11.5, fontWeight: 800, color: 'var(--ink)' }}>{s.name}</span>
                      <span style={{ fontSize: 9.5, color: 'var(--muted)' }}>{formatRupiah(r.totalHarta)}</span>
                      {r.results.length === 0 ? (
                        <span style={{ fontSize: 10, color: 'var(--muted)' }}>Tidak ada ahli waris.</span>
                      ) : (
                        r.results.map((row, i) => (
                          <div key={i} style={{ display: 'flex', justifyContent: 'space-between', gap: 6 }}>
                            <span style={{ fontSize: 10.5, color: 'var(--ink)' }}>{row.label}</span>
                            <span style={{ fontSize: 10.5, fontWeight: 700, color: 'var(--primary)', whiteSpace: 'nowrap' }}>{formatRupiah(row.amount)}</span>
                          </div>
                        ))
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
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
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span className="section-label" style={{ color: 'var(--muted)', fontSize: 11.5, letterSpacing: '0.04em', textTransform: 'uppercase' }}>
                Pembagian
              </span>
              <button
                onClick={() => setShowShare(true)}
                style={{ background: 'none', border: 'none', color: 'var(--primary)', fontSize: 11, fontWeight: 700, cursor: 'pointer', padding: 0 }}
              >
                ↗ Bagikan
              </button>
            </div>
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

      {showShare && <WarisShareModal totalHarta={hartaN} results={results} onClose={() => setShowShare(false)} />}

      {deleteScenarioId && (
        <ConfirmDialog
          title="Hapus skenario ini?"
          message="Skenario yang tersimpan di HP ini bakal dihapus."
          confirmLabel="Ya, Hapus"
          danger
          onCancel={() => setDeleteScenarioId(null)}
          onConfirm={() => {
            setScenarios(deleteWarisScenario(deleteScenarioId));
            setDeleteScenarioId(null);
          }}
        />
      )}
    </div>
  );
}
