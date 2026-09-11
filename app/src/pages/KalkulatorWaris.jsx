import { useState } from 'react';
import { calcWaris } from '../lib/warisCalc';
import { formatRupiah } from '../lib/zakat';
import PageHeaderPhoto from '../components/PageHeaderPhoto';
import { PAGE_PHOTOS } from '../data/photos';
import WarisShareModal from '../components/WarisShareModal';
import ConfirmDialog from '../components/ConfirmDialog';
import { loadWarisScenarios, saveWarisScenario, deleteWarisScenario } from '../lib/warisScenarios';
import { useToast } from '../context/ToastContext';

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
        <div style={{ width: 20, height: 20, borderRadius: '50%', background: '#fff', transform: value ? 'translateX(20px)' : 'translateX(0)', transition: 'transform var(--dur-1) var(--ease)' }} />
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
  const { showToast } = useToast();
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
  const [showScenarios, setShowScenarios] = useState(false);
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

  // Ekspor semua Skenario Waris tersimpan ke satu file Teks — the
  // WarisShareModal's own text export only ever covers the ONE result
  // currently on screen; this dumps every saved scenario (recomputed
  // fresh from its own saved inputs, same as scenarioResult above) into
  // one readable .txt someone can keep or forward without re-opening
  // each scenario one at a time.
  function handleExportAllScenarios() {
    const blocks = scenarios.map((s) => {
      const r = scenarioResult(s);
      const lines = [`— ${s.name} —`, `Total Harta: ${formatRupiah(r.totalHarta)}`];
      if (r.results.length === 0) {
        lines.push('Tidak ada ahli waris.');
      } else {
        r.results.forEach((row) => lines.push(`${row.label}: ${formatRupiah(row.amount)} (${(row.fraction * 100).toFixed(2)}%)`));
      }
      if (r.warnings?.length) lines.push(...r.warnings.map((w) => WARNING_TEXT[w]));
      return lines.join('\n');
    });
    const text = `Skenario Waris — airmoon\n\n${blocks.join('\n\n')}`;
    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'skenario-waris-airmoon.txt';
    a.click();
    URL.revokeObjectURL(url);
  }

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

        {/* [UI 2026-09-10] Skenario & Perbandingan moved below the
            calculator + result (was above the form) and tucked into a
            collapsible — it's a power-user feature; a first-time user
            should reach "atur ahli waris -> lihat pembagian" without
            scrolling past an empty scenario manager first. */}
        <button
          onClick={() => setShowScenarios((v) => !v)}
          className="card"
          style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 10, padding: '13px 16px', border: 'none', cursor: 'pointer', fontFamily: 'inherit', color: 'var(--ink)' }}
        >
          <span style={{ fontSize: 12, fontWeight: 800, letterSpacing: '0.03em', textTransform: 'uppercase', color: 'var(--muted)' }}>
            Skenario &amp; Perbandingan{scenarios.length > 0 ? ` (${scenarios.length})` : ''}
          </span>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--muted)" style={{ transform: showScenarios ? 'rotate(180deg)' : 'none', transition: 'transform var(--dur-1) var(--ease)' }}>
            <path d="m6 9 6 6 6-6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>

        {showScenarios && (
        <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: 12, padding: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span className="section-label" style={{ color: 'var(--muted)', fontSize: 11.5, letterSpacing: '0.04em', textTransform: 'uppercase' }}>
              Skenario Tersimpan
            </span>
            <div style={{ display: 'flex', gap: 12 }}>
              {scenarios.length > 0 && (
                <button
                  onClick={handleExportAllScenarios}
                  style={{ background: 'none', border: 'none', color: 'var(--primary)', fontSize: 11, fontWeight: 700, cursor: 'pointer', padding: 0 }}
                >
                  ⬇ Ekspor Semua
                </button>
              )}
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
            // [UI] Was a bare one-line muted text — same "nothing here yet"
            // gap EmptyState.jsx already fixed elsewhere, but that
            // component renders its own `.card` wrapper which would nest
            // awkwardly inside this section's existing card, so this is a
            // lighter inline version of the same icon+title+subtitle shape
            // rather than reusing the component directly.
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4, padding: '14px 10px', textAlign: 'center' }}>
              <span style={{ fontSize: 26, lineHeight: 1 }}>👪</span>
              <span style={{ fontSize: 12, fontWeight: 700 }}>Belum ada skenario tersimpan</span>
              <span style={{ fontSize: 11, color: 'var(--muted)', lineHeight: 1.5, maxWidth: 260 }}>
                Atur ahli waris di bawah, lalu simpan buat dibandingkan nanti.
              </span>
            </div>
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
              {compareA && compareB && (
                <button
                  onClick={() => {
                    const block = (s, r) => {
                      const lines = [`— ${s.name} —`, `Total Harta: ${formatRupiah(r.totalHarta)}`];
                      if (r.results.length === 0) lines.push('Tidak ada ahli waris.');
                      else r.results.forEach((row) => lines.push(`${row.label}: ${formatRupiah(row.amount)} (${(row.fraction * 100).toFixed(2)}%)`));
                      return lines.join('\n');
                    };
                    const text = `Perbandingan Skenario Waris — airmoon\n\n${block(compareA, compareAResult)}\n\n${block(compareB, compareBResult)}`;
                    const blob = new Blob([text], { type: 'text/plain' });
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = 'perbandingan-skenario-waris.txt';
                    a.click();
                    URL.revokeObjectURL(url);
                  }}
                  className="btn-outline"
                  style={{ padding: '9px', fontSize: 11.5 }}
                >
                  ⬇ Ekspor Perbandingan ke Teks
                </button>
              )}
            </div>
          )}
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
            const removed = scenarios.find((s) => s.id === deleteScenarioId);
            setScenarios(deleteWarisScenario(deleteScenarioId));
            setDeleteScenarioId(null);
            if (removed) {
              showToast('Skenario dihapus', {
                type: 'danger',
                actionLabel: 'Batalkan',
                onAction: () => setScenarios(saveWarisScenario(removed.name, removed.inputs)),
              });
            }
          }}
        />
      )}
    </div>
  );
}
