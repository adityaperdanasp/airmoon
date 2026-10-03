import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { calcWaris } from '../lib/warisCalc';
import { DEFAULT_HEIRS, HEIR_GROUPS, hasAnyHeir, toCalcParams, normalizeInputs } from '../lib/warisHeirs';
import WarisKnowledge from '../components/WarisKnowledge';
import ToggleSwitch from '../components/ToggleSwitch';
import { formatRupiah } from '../lib/zakat';
import PageHeaderPhoto from '../components/PageHeaderPhoto';
import { PAGE_PHOTOS } from '../data/photos';
import WarisShareModal from '../components/WarisShareModal';
import WarisShareDiagram from '../components/WarisShareDiagram';
import ConfirmDialog from '../components/ConfirmDialog';
import { loadWarisScenarios, saveWarisScenario, deleteWarisScenario } from '../lib/warisScenarios';
import { exportWarisPdf } from '../lib/warisPdf';
import { WARIS_DOC_GROUPS, loadWarisDocChecklist, toggleWarisDocChecklistItem } from '../lib/warisDocChecklist';
import { loadWarisHistory, saveWarisHistoryEntry, deleteWarisHistoryEntry } from '../lib/warisHistory';
import { useToast } from '../context/ToastContext';

function digitsOnly(v) {
  return v.replace(/\D/g, '');
}

// Scenario names alone can't tell apart two saves made minutes apart the
// same day — shown as a tooltip on the chip itself, and as a real visible
// line in the side-by-side compare view where there's actually room.
const scenarioSavedAtFmt = new Intl.DateTimeFormat('id-ID', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });

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
      <ToggleSwitch checked={value} onChange={onChange} />
    </div>
  );
}

// Hutang/biaya/wasiat come off the gross estate BEFORE any heir is
// computed (QS. An-Nisa 11): biaya jenazah first, then utang, then wasiat
// capped at one third of what is left. Shared by the live calculator and
// saved-scenario recomputation so the two can never drift.
function netEstate(harta, biaya, hutang, wasiat) {
  const num = (v) => Number(String(v ?? '0').replace(/\D/g, '')) || 0;
  const gross = num(harta);
  const biayaN = num(biaya);
  const hutangN = num(hutang);
  const wasiatN = num(wasiat);
  const setelahBiaya = Math.max(0, gross - biayaN);
  const setelahHutang = Math.max(0, setelahBiaya - hutangN);
  const wasiatMaks = setelahHutang / 3;
  const wasiatEfektif = Math.min(wasiatN, wasiatMaks);
  return {
    gross, biayaN, hutangN, wasiatN, wasiatMaks, wasiatEfektif,
    wasiatDibatasi: wasiatN > wasiatMaks + 0.0001,
    net: Math.max(0, setelahHutang - wasiatEfektif),
  };
}

const WARNING_TEXT = {
  aul: "⚠️ Total bagian fardh melebihi harta (kasus 'aul) — semua bagian di bawah sudah diskalakan proporsional sesuai ketentuan fiqh.",
  radd: '⚠️ Total bagian fardh tidak mencapai keseluruhan harta dan tidak ada ahli waris ashabah yang menghabiskan sisanya — sisa sudah dikembalikan (radd) secara proporsional ke ahli waris fardh yang ada (selain suami/istri), sesuai ketentuan fiqh.',
  raddNoRecipient: '⚠️ Total bagian fardh tidak mencapai keseluruhan harta dan tidak ada ahli waris lain (selain suami/istri) untuk menerima pengembalian sisa (radd) — kasus ini butuh konsultasi ke ahli faraidh/ulama.',
  anakMurtad: 'ℹ️ Anak yang murtad (keluar dari Islam) terhalang menerima warisan (mani\' al-irts: beda agama) — dihitung Rp 0, dan menurut pendapat jumhur dia dianggap tidak ada sehingga tidak mengubah bagian ahli waris lain. Cucu dari garis anak murtad tidak dihitung di sini; kalau ada kasus itu, konsultasikan ke ahli faraidh/ulama.',
  mahjub: 'ℹ️ Ahli waris yang tampil "Mahjub" terhalang oleh ahli waris yang lebih dekat atau lebih kuat (hijab), jadi tidak mendapat bagian. Lihat "Pengetahuan Waris" di atas untuk tabel alasannya.',
  tidakAdaSisa: 'ℹ️ Harta sudah habis dibagi ke ahli waris pemilik fardh, jadi penerima sisa (ashabah) tidak kebagian.',
  musytarakah: '⚠️ Kasus musytarakah: saudara kandung tidak kebagian karena fardh sudah menghabiskan harta (suami, ibu, dan dua saudara seibu atau lebih). Mengikuti tabel yang dipakai di sini mereka tidak mendapat bagian; sebagian mazhab justru menyertakan mereka berbagi sepertiga bersama saudara seibu. Konsultasikan ke ahli faraidh/ulama sesuai mazhab setempat.',
  ahliWarisPengganti: 'ℹ️ Cucu di atas menggantikan posisi anak laki-laki yang telah wafat (ahli waris pengganti) — mengikuti pandangan yang juga dipakai Kompilasi Hukum Islam (KHI) di Indonesia; sebagian mazhab fiqih klasik punya pandangan berbeda soal ini. Kalkulator ini menggabungkan semua cucu pengganti jadi satu kelompok — kalau ada lebih dari satu anak laki-laki yang wafat dengan cucu masing-masing berbeda jumlah, konsultasikan ke ahli faraidh untuk presisi penuh.',
};

// Kalkulator Waris (Ilmu Faraidh) — lihat lib/warisCalc.js untuk cakupan
// dan batasan lengkapnya (sengaja dibatasi ke kombinasi ahli waris paling
// umum). Reuses PAGE_PHOTOS.zakat — belum ada foto khusus buat halaman
// ini, dan temanya (fiqh muamalah/harta) cukup dekat dengan Zakat.
export default function KalkulatorWaris() {
  const { showToast } = useToast();
  const navigate = useNavigate();
  // One object for every heir (lib/warisHeirs.js) instead of 20 useStates.
  const [heirs, setHeirs] = useState(DEFAULT_HEIRS);
  const setHeir = (key, value) => setHeirs((h) => ({ ...h, [key]: value }));
  const [showJauh, setShowJauh] = useState(false);
  const [harta, setHarta] = useState('500000000');
  const [biayaJenazah, setBiayaJenazah] = useState('0');
  const [hutang, setHutang] = useState('0');
  const [wasiat, setWasiat] = useState('0');
  const est = netEstate(harta, biayaJenazah, hutang, wasiat);
  const hartaUntukWaris = est.net;
  const [showShare, setShowShare] = useState(false);
  const [scenarios, setScenarios] = useState(loadWarisScenarios);
  const [scenarioName, setScenarioName] = useState('');
  const [showSaveScenario, setShowSaveScenario] = useState(false);
  const [deleteScenarioId, setDeleteScenarioId] = useState(null);
  const [showScenarios, setShowScenarios] = useState(false);
  const [showCompare, setShowCompare] = useState(false);
  const [compareAId, setCompareAId] = useState(null);
  const [compareBId, setCompareBId] = useState(null);
  const [showDocChecklist, setShowDocChecklist] = useState(false);
  const [docChecklist, setDocChecklist] = useState(loadWarisDocChecklist);
  const [showHistory, setShowHistory] = useState(false);
  const [history, setHistory] = useState(loadWarisHistory);
  const [deleteHistoryId, setDeleteHistoryId] = useState(null);

  function applyScenario(s) {
    // normalizeInputs handles every saved shape (flat fields from before
    // kakek/saudara/pengganti existed, the pengganti fields, and the
    // current heirs fields) — missing means "not present".
    setHeirs(normalizeInputs(s.inputs));
    setHarta(s.inputs.harta);
    setBiayaJenazah(s.inputs.biayaJenazah ?? '0');
    setHutang(s.inputs.hutang ?? '0');
    setWasiat(s.inputs.wasiat ?? '0');
  }

  function handleSaveScenario() {
    const name = scenarioName.trim() || `Skenario ${scenarios.length + 1}`;
    setScenarios(saveWarisScenario(name, { ...heirs, harta, biayaJenazah, hutang, wasiat }));
    setScenarioName('');
    setShowSaveScenario(false);
  }

  const noHeirs = !hasAnyHeir(heirs);
  const calcParams = toCalcParams(heirs);
  const { results, warnings } = noHeirs
    ? { results: [], warnings: [] }
    : calcWaris({ ...calcParams, totalHarta: hartaUntukWaris });

  // Riwayat Perhitungan Otomatis (2026-10-01) — tersimpan otomatis tiap
  // kali hasil berubah, beda dari Skenario Tersimpan yang butuh tekan
  // "+ Simpan Ini" dulu. Debounced (1.5s) biar gak nyimpen tiap
  // keystroke/toggle, dan saveWarisHistoryEntry sendiri dedup terhadap
  // entry paling baru.
  const historyTimerRef = useRef(null);
  const heirsSignature = JSON.stringify(heirs);
  useEffect(() => {
    if (noHeirs) return;
    clearTimeout(historyTimerRef.current);
    historyTimerRef.current = setTimeout(() => {
      setHistory(saveWarisHistoryEntry(calcParams, hartaUntukWaris, results));
    }, 1500);
    return () => clearTimeout(historyTimerRef.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps -- calcParams/results are derived from heirsSignature + hartaUntukWaris, already listed
  }, [heirsSignature, hartaUntukWaris, noHeirs]);

  // Bandingkan 2 Skenario Berdampingan — computes both results fresh from
  // the saved inputs, side by side, without touching the live form.
  function scenarioResult(s) {
    if (!s) return null;
    const sh = normalizeInputs(s.inputs);
    const e = netEstate(s.inputs.harta, s.inputs.biayaJenazah, s.inputs.hutang, s.inputs.wasiat);
    return hasAnyHeir(sh)
      ? { ...calcWaris({ ...toCalcParams(sh), totalHarta: e.net }), totalHarta: e.net }
      : { results: [], warnings: [], totalHarta: e.net };
  }

  // Simulasi Cepat — one-tap +1 chips right where the result already is,
  // so testing "kalau ada anak laki-laki" doesn't mean scrolling back up
  // to the form every time. Same state as the form below, not a copy.
  const QUICK_SIM_CHIPS = [
    { label: '+ Suami', onTap: () => setHeir('hasSuami', true) },
    { label: '+ Istri', onTap: () => setHeir('jumlahIstri', Math.min(4, heirs.jumlahIstri + 1)) },
    { label: '+ Anak L', onTap: () => setHeir('anakLaki', heirs.anakLaki + 1) },
    { label: '+ Anak P', onTap: () => setHeir('anakPerempuan', heirs.anakPerempuan + 1) },
    { label: '+ Ayah', onTap: () => setHeir('hasAyah', true) },
    { label: '+ Ibu', onTap: () => setHeir('hasIbu', true) },
  ];
  function handleResetSimulation() {
    setHeirs(DEFAULT_HEIRS);
  }

  function handleKonsultasi() {
    const lines = [
      'Tolong bantu jelaskan hasil perhitungan waris ini:',
      `Total Harta Waris Bersih: ${formatRupiah(hartaUntukWaris)}`,
      ...results.map((r) => `${r.label}: ${formatRupiah(r.amount)} (${(r.fraction * 100).toFixed(2)}%)`),
    ];
    if (warnings.length) lines.push('', 'Catatan dari kalkulator:', ...warnings.map((w) => WARNING_TEXT[w]));
    navigate('/ask-me', { state: { prefill: lines.join('\n') } });
  }

  function handleExportPdf() {
    const ok = exportWarisPdf({ totalHarta: hartaUntukWaris, results, warningTexts: warnings.map((w) => WARNING_TEXT[w]) });
    if (!ok) showToast('Gagal membuka jendela PDF — izinkan pop-up untuk situs ini.');
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
          Mengikuti tabel porsi dan syarat Ilmu Faraidh: pasangan, anak dan cucu dari anak laki-laki, orang tua, kakek/nenek, saudara kandung/seayah/seibu, dan ashabah jauh (paman dan keturunannya), plus biaya jenazah, hutang, dan wasiat. Tidak mencakup mu'tiq, dzawil arham, atau kasus yang sangat rumit — konsultasikan ke ahli faraidh/ulama untuk itu.
        </div>

        <WarisKnowledge />

        <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: 14, padding: 16 }}>
          <span className="section-label" style={{ color: 'var(--muted)', fontSize: 11.5, letterSpacing: '0.04em', textTransform: 'uppercase' }}>
            Total Harta Warisan (Kotor)
          </span>
          <input
            inputMode="numeric"
            value={Number(harta).toLocaleString('id-ID')}
            onChange={(e) => setHarta(digitsOnly(e.target.value))}
            style={{ padding: '12px 14px', borderRadius: 12, border: '1px solid var(--border)', background: 'var(--bg)', color: 'var(--ink)', fontSize: 15, fontWeight: 700 }}
          />

          <span className="section-label" style={{ color: 'var(--muted)', fontSize: 11.5, letterSpacing: '0.04em', textTransform: 'uppercase', marginTop: 4 }}>
            1. Biaya Pengurusan Jenazah (Opsional)
          </span>
          <input
            inputMode="numeric"
            value={Number(biayaJenazah).toLocaleString('id-ID')}
            onChange={(e) => setBiayaJenazah(digitsOnly(e.target.value))}
            style={{ padding: '12px 14px', borderRadius: 12, border: '1px solid var(--border)', background: 'var(--bg)', color: 'var(--ink)', fontSize: 15, fontWeight: 700 }}
          />

          <span className="section-label" style={{ color: 'var(--muted)', fontSize: 11.5, letterSpacing: '0.04em', textTransform: 'uppercase', marginTop: 4 }}>
            2. Hutang Almarhum (Opsional)
          </span>
          <input
            inputMode="numeric"
            value={Number(hutang).toLocaleString('id-ID')}
            onChange={(e) => setHutang(digitsOnly(e.target.value))}
            style={{ padding: '12px 14px', borderRadius: 12, border: '1px solid var(--border)', background: 'var(--bg)', color: 'var(--ink)', fontSize: 15, fontWeight: 700 }}
          />

          <span className="section-label" style={{ color: 'var(--muted)', fontSize: 11.5, letterSpacing: '0.04em', textTransform: 'uppercase', marginTop: 4 }}>
            3. Wasiat (Opsional, Maks. 1/3 Sisa)
          </span>
          <input
            inputMode="numeric"
            value={Number(wasiat).toLocaleString('id-ID')}
            onChange={(e) => setWasiat(digitsOnly(e.target.value))}
            style={{ padding: '12px 14px', borderRadius: 12, border: '1px solid var(--border)', background: 'var(--bg)', color: 'var(--ink)', fontSize: 15, fontWeight: 700 }}
          />
          <span style={{ fontSize: 10.5, color: 'var(--muted-soft)', lineHeight: 1.5 }}>
            Wasiat tidak boleh ditujukan untuk kerabat yang menjadi ahli waris (HR. Abu Dawud). Urutan hak atas harta: biaya jenazah, hutang, wasiat, baru warisan.
          </span>

          {(est.biayaN > 0 || est.hutangN > 0 || est.wasiatN > 0) && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6, padding: '10px 12px', borderRadius: 12, background: 'var(--mint-soft)', fontSize: 11.5 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}><span>Harta Kotor</span><span style={{ fontWeight: 700 }}>{formatRupiah(est.gross)}</span></div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}><span>− Biaya Jenazah</span><span style={{ fontWeight: 700 }}>{formatRupiah(est.biayaN)}</span></div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}><span>− Hutang</span><span style={{ fontWeight: 700 }}>{formatRupiah(est.hutangN)}</span></div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}><span>− Wasiat (efektif)</span><span style={{ fontWeight: 700 }}>{formatRupiah(est.wasiatEfektif)}</span></div>
              <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: 6, borderTop: '1px solid rgba(0,0,0,0.08)' }}>
                <span style={{ fontWeight: 800 }}>Harta Waris Bersih</span><span style={{ fontWeight: 800, color: 'var(--primary)' }}>{formatRupiah(hartaUntukWaris)}</span>
              </div>
              {est.wasiatDibatasi && (
                <span style={{ fontSize: 10, color: 'var(--gold-ink-dark)', lineHeight: 1.5, marginTop: 2 }}>
                  ⚠️ Wasiat yang diminta ({formatRupiah(est.wasiatN)}) melebihi 1/3 sisa harta setelah hutang — dibatasi otomatis ke {formatRupiah(est.wasiatMaks)} sesuai ketentuan fiqh (maksimal 1/3).
                </span>
              )}
            </div>
          )}
        </div>

        <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: 20, padding: 16 }}>
          <span className="section-label" style={{ color: 'var(--muted)', fontSize: 11.5, letterSpacing: '0.04em', textTransform: 'uppercase' }}>
            Ahli Waris
          </span>
          {HEIR_GROUPS.map((group) => {
            const open = !group.collapsed || showJauh;
            return (
              <div key={group.id} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                {group.collapsed ? (
                  <button
                    onClick={() => setShowJauh((v) => !v)}
                    aria-expanded={open}
                    style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 10, padding: 0, background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'inherit', color: 'var(--ink)', textAlign: 'left' }}
                  >
                    <span>
                      <span style={{ display: 'block', fontSize: 13.5, fontWeight: 800 }}>{group.title}</span>
                      <span style={{ display: 'block', fontSize: 10.5, color: 'var(--muted)', marginTop: 1 }}>{group.hint}</span>
                    </span>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--muted)" style={{ transform: open ? 'rotate(180deg)' : 'none', transition: 'transform var(--dur-1) var(--ease)' }}>
                      <path d="m6 9 6 6 6-6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </button>
                ) : (
                  <div>
                    <span style={{ display: 'block', fontSize: 13.5, fontWeight: 800 }}>{group.title}</span>
                    <span style={{ display: 'block', fontSize: 10.5, color: 'var(--muted)', marginTop: 1 }}>{group.hint}</span>
                  </div>
                )}
                {open && group.fields.map((f) =>
                  f.type === 'toggle' ? (
                    <ToggleRow key={f.key} label={f.label} value={heirs[f.key]} onChange={(v) => setHeir(f.key, v)} />
                  ) : (
                    <Stepper key={f.key} label={f.label} value={heirs[f.key]} onChange={(v) => setHeir(f.key, v)} max={f.max} />
                  )
                )}
                {group.id === 'keturunan' && open && (heirs.cucuLakiDariAnakLaki > 0 || heirs.cucuPerempuanDariAnakLaki > 0) && (
                  <ToggleRow label="Terapkan ahli waris pengganti (KHI)" value={heirs.khiPengganti} onChange={(v) => setHeir('khiPengganti', v)} />
                )}
                {group.id === 'keturunan' && (heirs.anakLakiMurtad > 0 || heirs.anakPerempuanMurtad > 0) && (
                  <span style={{ fontSize: 10.5, color: 'var(--muted-soft)', lineHeight: 1.5 }}>
                    Anak murtad tidak mewarisi dan dianggap tidak ada. Isi baris murtad HANYA untuk anak yang murtad; anak muslim tetap diisi di Anak Laki-laki/Perempuan.
                  </span>
                )}
                {group.id === 'keturunan' && (heirs.cucuLakiDariAnakLaki > 0 || heirs.cucuPerempuanDariAnakLaki > 0) && (
                  <span style={{ fontSize: 10.5, color: 'var(--muted-soft)', lineHeight: 1.5 }}>
                    {heirs.khiPengganti
                      ? 'Mode KHI: cucu menggantikan SATU anak laki-laki yang sudah wafat dan mengambil porsinya, walau anak-anak lain masih ada.'
                      : 'Mode klasik: cucu dari anak laki-laki hanya mewarisi kalau tidak ada anak laki-laki (lihat tabel di Pengetahuan Waris).'}
                  </span>
                )}
              </div>
            );
          })}
          <span style={{ fontSize: 10.5, color: 'var(--muted-soft)', lineHeight: 1.5 }}>
            Ahli waris yang terhalang (mahjub) tetap ditampilkan di hasil dengan bagian Rp 0, lengkap dengan statusnya.
          </span>
        </div>

        {!noHeirs && (
          <div className="hide-scrollbar" style={{ display: 'flex', gap: 6, overflowX: 'auto', padding: '2px 0' }}>
            {QUICK_SIM_CHIPS.map((chip) => (
              <button
                key={chip.label}
                onClick={chip.onTap}
                style={{ flexShrink: 0, padding: '7px 12px', borderRadius: 999, border: '1px solid var(--border)', background: 'var(--card)', color: 'var(--ink)', fontSize: 11, fontWeight: 700, cursor: 'pointer' }}
              >
                {chip.label}
              </button>
            ))}
            <button
              onClick={handleResetSimulation}
              style={{ flexShrink: 0, padding: '7px 12px', borderRadius: 999, border: '1px solid var(--border)', background: 'none', color: 'var(--muted)', fontSize: 11, fontWeight: 700, cursor: 'pointer' }}
            >
              ↺ Reset
            </button>
          </div>
        )}

        {noHeirs && (
          <p className="state-msg">Pilih setidaknya satu ahli waris buat lihat pembagiannya.</p>
        )}

        {!noHeirs && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span className="section-label" style={{ color: 'var(--muted)', fontSize: 11.5, letterSpacing: '0.04em', textTransform: 'uppercase' }}>
                Pembagian
              </span>
              <div style={{ display: 'flex', gap: 12 }}>
                <button
                  onClick={handleExportPdf}
                  style={{ background: 'none', border: 'none', color: 'var(--primary)', fontSize: 11, fontWeight: 700, cursor: 'pointer', padding: 0 }}
                >
                  ⬇ PDF
                </button>
                <button
                  onClick={() => setShowShare(true)}
                  style={{ background: 'none', border: 'none', color: 'var(--primary)', fontSize: 11, fontWeight: 700, cursor: 'pointer', padding: 0 }}
                >
                  ↗ Bagikan
                </button>
              </div>
            </div>
            {warnings.map((w) => (
              <div key={w} style={{ padding: '10px 14px', borderRadius: 12, background: 'var(--cream)', fontSize: 11, color: 'var(--gold-ink-dark)', lineHeight: 1.5 }}>
                {WARNING_TEXT[w]}
              </div>
            ))}
            <WarisShareDiagram results={results} />
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
            <button onClick={handleKonsultasi} className="btn-outline" style={{ padding: '10px', fontSize: 12 }}>
              💬 Konsultasi Hasil ke Ust. Rewin
            </button>
          </div>
        )}

        <button
          onClick={() => setShowDocChecklist((v) => !v)}
          aria-expanded={showDocChecklist}
          className="card"
          style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 10, padding: '13px 16px', border: 'none', cursor: 'pointer', fontFamily: 'inherit', color: 'var(--ink)' }}
        >
          <span style={{ fontSize: 12, fontWeight: 800, letterSpacing: '0.03em', textTransform: 'uppercase', color: 'var(--muted)' }}>
            📋 Checklist Dokumen Pengurusan Warisan
          </span>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--muted)" style={{ transform: showDocChecklist ? 'rotate(180deg)' : 'none', transition: 'transform var(--dur-1) var(--ease)' }}>
            <path d="m6 9 6 6 6-6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>

        {showDocChecklist && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {WARIS_DOC_GROUPS.map((group) => (
              <div key={group.title} className="card" style={{ padding: 16, display: 'flex', flexDirection: 'column', gap: 4 }}>
                <h2 style={{ margin: '0 0 6px', fontSize: 14, fontWeight: 800, color: 'var(--primary)' }}>{group.title}</h2>
                {group.items.map((item) => {
                  const key = `${group.title}:${item}`;
                  const isChecked = !!docChecklist[key];
                  return (
                    <label key={key} style={{ display: 'flex', alignItems: 'flex-start', gap: 10, padding: '8px 0', cursor: 'pointer' }}>
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={() => setDocChecklist(toggleWarisDocChecklistItem(key))}
                        style={{ marginTop: 3, width: 16, height: 16, accentColor: 'var(--primary)', flexShrink: 0 }}
                      />
                      <span style={{ fontSize: 12.5, lineHeight: 1.5, color: isChecked ? 'var(--muted)' : 'var(--ink)', textDecoration: isChecked ? 'line-through' : 'none' }}>
                        {item}
                      </span>
                    </label>
                  );
                })}
              </div>
            ))}
          </div>
        )}

        <button
          onClick={() => setShowHistory((v) => !v)}
          aria-expanded={showHistory}
          className="card"
          style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 10, padding: '13px 16px', border: 'none', cursor: 'pointer', fontFamily: 'inherit', color: 'var(--ink)' }}
        >
          <span style={{ fontSize: 12, fontWeight: 800, letterSpacing: '0.03em', textTransform: 'uppercase', color: 'var(--muted)' }}>
            🕓 Riwayat Perhitungan{history.length > 0 ? ` (${history.length})` : ''}
          </span>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--muted)" style={{ transform: showHistory ? 'rotate(180deg)' : 'none', transition: 'transform var(--dur-1) var(--ease)' }}>
            <path d="m6 9 6 6 6-6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>

        {showHistory && (
          <div className="card" style={{ padding: 16, display: 'flex', flexDirection: 'column', gap: 10 }}>
            <span style={{ fontSize: 10.5, color: 'var(--muted-soft)', lineHeight: 1.5 }}>
              Tersimpan otomatis tiap kali hasil berubah — beda dari Skenario Tersimpan di bawah yang butuh disimpan manual.
            </span>
            {history.length === 0 ? (
              <span style={{ fontSize: 12, color: 'var(--muted)' }}>Belum ada riwayat.</span>
            ) : (
              history.map((entry) => (
                <div key={entry.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 10, padding: '10px 12px', borderRadius: 12, background: 'var(--card)' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    <span style={{ fontSize: 11.5, fontWeight: 700 }}>{formatRupiah(entry.totalHarta)}</span>
                    <span style={{ fontSize: 10, color: 'var(--muted)' }}>
                      {new Intl.DateTimeFormat('id-ID', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' }).format(new Date(entry.at))} · {entry.results.length} ahli waris
                    </span>
                  </div>
                  <button
                    onClick={() => setDeleteHistoryId(entry.id)}
                    aria-label="Hapus entri riwayat"
                    style={{ width: 22, height: 22, borderRadius: '50%', border: 'none', background: 'rgba(0,0,0,0.08)', color: 'var(--muted)', fontSize: 13, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}
                  >
                    ×
                  </button>
                </div>
              ))
            )}
          </div>
        )}

        {/* [UI 2026-09-10] Skenario & Perbandingan moved below the
            calculator + result (was above the form) and tucked into a
            collapsible — it's a power-user feature; a first-time user
            should reach "atur ahli waris -> lihat pembagian" without
            scrolling past an empty scenario manager first. */}
        <button
          onClick={() => setShowScenarios((v) => !v)}
          aria-expanded={showScenarios}
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
                  <button
                    onClick={() => applyScenario(s)}
                    title={s.savedAt ? `Disimpan ${scenarioSavedAtFmt.format(new Date(s.savedAt))}` : undefined}
                    style={{ background: 'none', border: 'none', color: 'var(--ink)', fontSize: 12, fontWeight: 700, cursor: 'pointer', padding: 0, whiteSpace: 'nowrap' }}
                  >
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
                  aria-label="Pilih Skenario A"
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
                  aria-label="Pilih Skenario B"
                  style={{ flex: 1, padding: '9px 10px', borderRadius: 10, border: '1px solid var(--border)', background: 'var(--bg)', color: 'var(--ink)', fontSize: 12 }}
                >
                  <option value="">Pilih Skenario B</option>
                  {scenarios.map((s) => (
                    <option key={s.id} value={s.id}>{s.name}</option>
                  ))}
                </select>
              </div>

              {compareA && compareB && (
                // [UI 2026-09-11] Switching either dropdown swapped this grid's
                // content with a hard cut — no loading skeleton needed here
                // (scenarioResult() is a pure sync calculation on already-loaded
                // localStorage scenarios, nothing to actually wait on), but a
                // remount-keyed fade makes the swap read as a deliberate
                // transition instead of a flicker. Same .onboarding-slide class
                // OnboardingTour already uses for the same "fresh element per
                // selection" fade-in shape.
                <div key={`${compareAId}-${compareBId}`} className="onboarding-slide" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                  {[{ s: compareA, r: compareAResult }, { s: compareB, r: compareBResult }].map(({ s, r }, colIdx) => (
                    <div key={colIdx} style={{ display: 'flex', flexDirection: 'column', gap: 6, padding: 10, borderRadius: 12, background: 'var(--mint-soft)' }}>
                      <span style={{ fontSize: 11.5, fontWeight: 800, color: 'var(--ink)' }}>{s.name}</span>
                      {s.savedAt && (
                        <span style={{ fontSize: 9, color: 'var(--muted-soft)' }}>{scenarioSavedAtFmt.format(new Date(s.savedAt))}</span>
                      )}
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

      {showShare && <WarisShareModal totalHarta={hartaUntukWaris} results={results} onClose={() => setShowShare(false)} />}

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

      {deleteHistoryId && (
        <ConfirmDialog
          title="Hapus entri riwayat ini?"
          message="Entri riwayat perhitungan yang tersimpan di HP ini bakal dihapus."
          confirmLabel="Ya, Hapus"
          danger
          onCancel={() => setDeleteHistoryId(null)}
          onConfirm={() => {
            setHistory(deleteWarisHistoryEntry(deleteHistoryId));
            setDeleteHistoryId(null);
          }}
        />
      )}
    </div>
  );
}
