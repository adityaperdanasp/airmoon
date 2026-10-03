import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import TopBar from '../components/TopBar';
import ToggleSwitch from '../components/ToggleSwitch';
import { useLang } from '../context/LangContext';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { JENAZAH_STEPS, JENAZAH_KASUS_KHUSUS, JENAZAH_HINDARI } from '../data/jenazahGuide';
import { JENAZAH_CHECKLIST_GROUPS, loadJenazahChecklist, toggleJenazahChecklistItem, loadJenazahStepProgress, toggleJenazahStepDone } from '../lib/jenazahChecklist';
import { calcKebutuhanKafan } from '../lib/kafanCalc';
import { hapticTick, hapticSuccess } from '../lib/haptics';
import { loadWasiatCatatan, saveWasiatCatatan } from '../lib/wasiatCatatan';
import { JENAZAH_BUDGET_ITEMS, totalJenazahBudget, defaultJenazahBudgetAmounts } from '../lib/jenazahBudget';
import { exportJenazahPdf } from '../lib/jenazahPdf';
import { formatRupiah } from '../lib/zakat';

// Panduan Jenazah (2026-10-01) — step-by-step tatacara mengurus jenazah
// muslim (fardhu kifayah): memandikan → mengkafani → mensholatkan →
// menguburkan. Mirrors PanduanSholat.jsx's prev/next linear shape (one
// phase at a time, not a wall of text), but each step here is richer —
// intro paragraph, a verified YouTube video demonstrating the practice,
// and an ordered checklist — since a jenazah phase has several distinct
// actions rather than one dzikir. Mensholatkan additionally walks
// through the actual 4-takbir sequence with Arabic/Latin/translation,
// same block style DoaHarian/PanduanSholat already use for religious
// text.
//
// Extended 2026-10-01 (PM batch, "gas kerjain smua") with 5 more
// features: per-step "tandai selesai" progress (localStorage, same
// pattern as the Umroh checklist's done-state), a Mode Dengarkan toggle
// that hides the video and keeps only its audio playing (still the same
// YouTube iframe underneath — there's no real way to strip video data
// out of a YouTube embed without a backend, so this is honestly a visual
// change only, not a bandwidth saving), a deep link to the existing
// "Kematian Seseorang" doa category (which had zero cross-link from here
// before this), and two always-visible utility cards (checklist
// perlengkapan + kalkulator kain kafan) that don't depend on which step
// is active.
//
// Extended again, same day (2nd "gas kerjain smua" batch), with 5 more:
// Catatan Wasiat & Preferensi Pemakaman (a plain personal
// note field, NOT a legal document), Kalkulator Estimasi Biaya (editable
// line items with sensible defaults, clearly not fixed pricing), Panduan
// Kasus Khusus (bayi/anak, kecelakaan, luar kota/negeri — static content
// in data/jenazahGuide.js), and a PDF export of the whole guide +
// checklist + kafan result via the same window.print() approach
// lib/warisPdf.js already established (zero new dependency).
export default function PanduanJenazah() {
  const { t } = useLang();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { showToast } = useToast();
  const [step, setStep] = useState(0);
  const [audioMode, setAudioMode] = useState(false);
  const [progress, setProgress] = useState(loadJenazahStepProgress);
  const [checklist, setChecklist] = useState(loadJenazahChecklist);
  const [showChecklist, setShowChecklist] = useState(false);
  const [showKafan, setShowKafan] = useState(false);
  const [tinggiCm, setTinggiCm] = useState('165');
  const [gender, setGender] = useState('pria');

  const [showWasiat, setShowWasiat] = useState(false);
  const [wasiatText, setWasiatText] = useState('');
  const [wasiatSaving, setWasiatSaving] = useState(false);

  const [showBiaya, setShowBiaya] = useState(false);
  const [biayaAmounts, setBiayaAmounts] = useState(defaultJenazahBudgetAmounts);

  const [showKasusKhusus, setShowKasusKhusus] = useState(false);
  const [showHindari, setShowHindari] = useState(false);

  const current = JENAZAH_STEPS[step];
  const isFirst = step === 0;
  const isLast = step === JENAZAH_STEPS.length - 1;
  const stepDone = !!progress[step];
  const doneCount = Object.values(progress).filter(Boolean).length;

  useEffect(() => {
    if (!user) return;
    loadWasiatCatatan(user.uid).then(setWasiatText);
  }, [user]);

  function handleToggleStepDone() {
    const next = toggleJenazahStepDone(step);
    setProgress(next);
    if (next[step]) hapticSuccess();
  }

  function handleToggleChecklistItem(key) {
    setChecklist(toggleJenazahChecklistItem(key));
    hapticTick();
  }

  async function handleSaveWasiat() {
    if (!user) return;
    setWasiatSaving(true);
    try {
      await saveWasiatCatatan(user.uid, wasiatText);
      showToast('Catatan wasiat disimpan.');
    } finally {
      setWasiatSaving(false);
    }
  }

  const kafanResult = calcKebutuhanKafan({ tinggiCm: Number(tinggiCm) || 0, gender });
  const checklistTotal = JENAZAH_CHECKLIST_GROUPS.reduce((sum, g) => sum + g.items.length, 0);
  const checklistDone = Object.values(checklist).filter(Boolean).length;
  const biayaTotal = totalJenazahBudget(biayaAmounts);

  function handleExportPdf() {
    const ok = exportJenazahPdf({ checklist: JENAZAH_CHECKLIST_GROUPS, kafanResult });
    if (!ok) showToast('Gagal membuka jendela PDF — izinkan pop-up untuk situs ini.');
  }

  return (
    <div className="screen">
      <div className="screen-content">
        <TopBar title={t('panduan_jenazah_title')} />

        <div className="card" style={{ padding: '10px 14px', display: 'flex', flexDirection: 'column', gap: 8 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ flex: 1, height: 6, borderRadius: 999, background: 'var(--border)', overflow: 'hidden' }}>
              <div style={{ width: `${((step + 1) / JENAZAH_STEPS.length) * 100}%`, height: '100%', background: 'var(--primary)', transition: 'width 0.2s ease' }} />
            </div>
            <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--muted)', flexShrink: 0 }}>{step + 1}/{JENAZAH_STEPS.length}</span>
          </div>
          <div style={{ display: 'flex', gap: 6 }}>
            {JENAZAH_STEPS.map((s, i) => (
              <button
                key={s.title}
                onClick={() => setStep(i)}
                aria-label={`${s.title}${progress[i] ? ` — ${t('panduan_jenazah_selesai_badge')}` : ''}`}
                style={{
                  flex: 1,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 4,
                  padding: '5px 4px',
                  borderRadius: 10,
                  border: i === step ? '1px solid var(--primary)' : '1px solid transparent',
                  background: progress[i] ? 'var(--mint-soft)' : 'var(--bg)',
                  cursor: 'pointer',
                  fontSize: 10,
                  fontWeight: 700,
                  color: progress[i] ? 'var(--primary)' : 'var(--muted)',
                }}
              >
                {progress[i] ? '✓' : i + 1}
              </button>
            ))}
          </div>
        </div>

        <div className="card" style={{ padding: 20, display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8 }}>
            <span style={{ fontSize: 10.5, fontWeight: 700, color: 'var(--primary)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              {t('panduan_jenazah_langkah')} {step + 1}
            </span>
            <span style={{ fontSize: 9.5, fontWeight: 700, padding: '3px 9px', borderRadius: 999, color: 'var(--gold-ink-dark)', background: 'var(--cream)' }}>
              {current.hukum}
            </span>
          </div>
          <span style={{ fontSize: 20, fontWeight: 800 }}>{current.title}</span>
          <p style={{ margin: 0, fontSize: 13, lineHeight: 1.6, color: 'var(--muted)' }}>{current.intro}</p>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 10 }}>
            <span style={{ fontSize: 12, fontWeight: 700 }}>🔊 {t('panduan_jenazah_mode_audio')}</span>
            <ToggleSwitch checked={audioMode} onChange={setAudioMode} />
          </div>
          {audioMode && (
            <span style={{ fontSize: 10.5, color: 'var(--muted-soft)', lineHeight: 1.5, marginTop: -8 }}>{t('panduan_jenazah_mode_audio_note')}</span>
          )}

          <div style={{ borderRadius: 16, overflow: 'hidden', aspectRatio: audioMode ? undefined : '16 / 9', height: audioMode ? 64 : undefined, background: '#000', display: 'flex', alignItems: 'center' }}>
            <iframe
              width="100%"
              height={audioMode ? 64 : '100%'}
              src={`https://www.youtube.com/embed/${current.youtubeId}?autoplay=0`}
              title={current.title}
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
          {current.videoSource && (
            <span style={{ fontSize: 10.5, color: 'var(--muted-soft)', lineHeight: 1.5, marginTop: -6 }}>Video: {current.videoSource}</span>
          )}

          {current.takbir && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {current.takbir.map((tb) => (
                <div key={tb.label} style={{ padding: '12px 14px', borderRadius: 14, background: 'var(--bg)', display: 'flex', flexDirection: 'column', gap: 8 }}>
                  <span style={{ fontSize: 11.5, fontWeight: 700, color: 'var(--primary)' }}>{tb.label}</span>
                  {tb.arabic && (
                    <div style={{ fontFamily: "'Amiri', serif", fontSize: 18, lineHeight: 1.9, direction: 'rtl', textAlign: 'right' }}>
                      {tb.arabic}
                    </div>
                  )}
                  {tb.latin && <p style={{ margin: 0, fontSize: 11.5, lineHeight: 1.55, color: 'var(--muted-soft)', fontStyle: 'italic' }}>{tb.latin}</p>}
                  <p style={{ margin: 0, fontSize: 12, lineHeight: 1.55, color: 'var(--muted)' }}>{tb.translation || tb.detail}</p>
                </div>
              ))}
            </div>
          )}

          <ol style={{ margin: 0, paddingLeft: 18, display: 'flex', flexDirection: 'column', gap: 8 }}>
            {current.poin.map((p, i) => (
              <li key={i} style={{ fontSize: 12.5, lineHeight: 1.6, color: 'var(--ink)' }}>{p}</li>
            ))}
          </ol>
          {current.sumber && (
            <span style={{ fontSize: 10.5, color: 'var(--muted-soft)', lineHeight: 1.5 }}>Dalil/rujukan: {current.sumber}</span>
          )}

          <button
            onClick={handleToggleStepDone}
            className={stepDone ? 'btn' : 'btn-outline'}
            style={{ padding: '11px', fontSize: 12.5 }}
          >
            {stepDone ? `✓ ${t('panduan_jenazah_selesai_badge')}` : t('panduan_jenazah_tandai_selesai')}
          </button>

          <button
            onClick={() => navigate('/lainnya/doa-harian', { state: { activeId: 'kematian' } })}
            style={{ background: 'none', border: 'none', color: 'var(--primary)', fontSize: 12, fontWeight: 700, cursor: 'pointer', padding: 0, textAlign: 'left' }}
          >
            {t('panduan_jenazah_lihat_doa')}
          </button>
        </div>

        <button
          onClick={() => setShowChecklist((v) => !v)}
          aria-expanded={showChecklist}
          className="card"
          style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 10, padding: '13px 16px', border: 'none', cursor: 'pointer', fontFamily: 'inherit', color: 'var(--ink)' }}
        >
          <span style={{ fontSize: 12, fontWeight: 800, letterSpacing: '0.03em', textTransform: 'uppercase', color: 'var(--muted)' }}>
            {t('panduan_jenazah_checklist_title')} ({checklistDone}/{checklistTotal})
          </span>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--muted)" style={{ transform: showChecklist ? 'rotate(180deg)' : 'none', transition: 'transform var(--dur-1) var(--ease)' }}>
            <path d="m6 9 6 6 6-6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>

        {showChecklist && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {JENAZAH_CHECKLIST_GROUPS.map((group) => (
              <div key={group.title} className="card" style={{ padding: 16, display: 'flex', flexDirection: 'column', gap: 4 }}>
                <h2 style={{ margin: '0 0 6px', fontSize: 14, fontWeight: 800, color: 'var(--primary)' }}>{group.title}</h2>
                {group.items.map((item) => {
                  const key = `${group.title}:${item}`;
                  const isChecked = !!checklist[key];
                  return (
                    <label key={key} style={{ display: 'flex', alignItems: 'flex-start', gap: 10, padding: '8px 0', cursor: 'pointer' }}>
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={() => handleToggleChecklistItem(key)}
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
          onClick={() => setShowKafan((v) => !v)}
          aria-expanded={showKafan}
          className="card"
          style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 10, padding: '13px 16px', border: 'none', cursor: 'pointer', fontFamily: 'inherit', color: 'var(--ink)' }}
        >
          <span style={{ fontSize: 12, fontWeight: 800, letterSpacing: '0.03em', textTransform: 'uppercase', color: 'var(--muted)' }}>
            {t('panduan_jenazah_kafan_title')}
          </span>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--muted)" style={{ transform: showKafan ? 'rotate(180deg)' : 'none', transition: 'transform var(--dur-1) var(--ease)' }}>
            <path d="m6 9 6 6 6-6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>

        {showKafan && (
          <div className="card" style={{ padding: 16, display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              <span style={{ fontSize: 11.5, fontWeight: 700, color: 'var(--muted)' }}>{t('panduan_jenazah_kafan_tinggi')}</span>
              <input
                inputMode="numeric"
                value={tinggiCm}
                onChange={(e) => setTinggiCm(e.target.value.replace(/\D/g, ''))}
                style={{ padding: '12px 14px', borderRadius: 12, border: '1px solid var(--border)', background: 'var(--bg)', color: 'var(--ink)', fontSize: 15, fontWeight: 700 }}
              />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {[['pria', 'panduan_jenazah_kafan_pria'], ['wanita', 'panduan_jenazah_kafan_wanita'], ['wanita5', 'panduan_jenazah_kafan_wanita5']].map(([key, label]) => (
                <button
                  key={key}
                  onClick={() => setGender(key)}
                  className={gender === key ? 'btn' : 'btn-outline'}
                  style={{ padding: '9px', fontSize: 12 }}
                >
                  {t(label)}
                </button>
              ))}
            </div>
            <div style={{ padding: '12px 14px', borderRadius: 14, background: 'var(--mint-soft)', display: 'flex', flexDirection: 'column', gap: 4 }}>
              <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--muted)' }}>{t('panduan_jenazah_kafan_hasil')}</span>
              <span style={{ fontSize: 20, fontWeight: 800, color: 'var(--primary)' }}>
                {kafanResult.totalMeterDibulatkan.toLocaleString('id-ID', { minimumFractionDigits: 1, maximumFractionDigits: 1 })} meter
              </span>
              <span style={{ fontSize: 10.5, color: 'var(--muted)' }}>
                {kafanResult.jumlahLapis} lapis × {kafanResult.panjangPerLapisM.toFixed(1)}m/lapis
              </span>
            </div>
            <span style={{ fontSize: 10, color: 'var(--muted-soft)', lineHeight: 1.5 }}>{t('panduan_jenazah_kafan_catatan')}</span>
          </div>
        )}

        <button
          onClick={() => setShowWasiat((v) => !v)}
          aria-expanded={showWasiat}
          className="card"
          style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 10, padding: '13px 16px', border: 'none', cursor: 'pointer', fontFamily: 'inherit', color: 'var(--ink)' }}
        >
          <span style={{ fontSize: 12, fontWeight: 800, letterSpacing: '0.03em', textTransform: 'uppercase', color: 'var(--muted)' }}>
            📝 Catatan Wasiat & Preferensi Pemakaman
          </span>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--muted)" style={{ transform: showWasiat ? 'rotate(180deg)' : 'none', transition: 'transform var(--dur-1) var(--ease)' }}>
            <path d="m6 9 6 6 6-6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>

        {showWasiat && (
          <div className="card" style={{ padding: 16, display: 'flex', flexDirection: 'column', gap: 10 }}>
            {!user ? (
              <span style={{ fontSize: 11.5, color: 'var(--muted)' }}>Masuk dulu buat nulis catatan wasiat.</span>
            ) : (
              <>
                <span style={{ fontSize: 10.5, color: 'var(--muted-soft)', lineHeight: 1.5 }}>
                  Catatan personal — bukan dokumen hukum/wasiat syar'i yang mengikat, cuma pesan/preferensi buat keluarga. Boleh dipakai untuk berpesan agar jenazahmu diurus sesuai sunnah.
                </span>
                <textarea
                  value={wasiatText}
                  onChange={(e) => setWasiatText(e.target.value)}
                  placeholder="Misal: preferensi dimakamkan dimana, siapa yang dipercaya mengurus, pesan buat keluarga, dll."
                  rows={5}
                  style={{ padding: '12px 14px', borderRadius: 12, border: '1px solid var(--border)', background: 'var(--bg)', color: 'var(--ink)', fontSize: 12.5, lineHeight: 1.6, resize: 'vertical', fontFamily: 'inherit' }}
                />
                <button className="btn" style={{ fontSize: 12.5 }} disabled={wasiatSaving} onClick={handleSaveWasiat}>
                  {wasiatSaving ? 'Menyimpan…' : 'Simpan Catatan'}
                </button>
              </>
            )}
          </div>
        )}

        <button
          onClick={() => setShowBiaya((v) => !v)}
          aria-expanded={showBiaya}
          className="card"
          style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 10, padding: '13px 16px', border: 'none', cursor: 'pointer', fontFamily: 'inherit', color: 'var(--ink)' }}
        >
          <span style={{ fontSize: 12, fontWeight: 800, letterSpacing: '0.03em', textTransform: 'uppercase', color: 'var(--muted)' }}>
            💰 Estimasi Biaya Pengurusan
          </span>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--muted)" style={{ transform: showBiaya ? 'rotate(180deg)' : 'none', transition: 'transform var(--dur-1) var(--ease)' }}>
            <path d="m6 9 6 6 6-6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>

        {showBiaya && (
          <div className="card" style={{ padding: 16, display: 'flex', flexDirection: 'column', gap: 10 }}>
            {JENAZAH_BUDGET_ITEMS.map((item) => (
              <div key={item.key} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 10 }}>
                <span style={{ fontSize: 12, flex: 1 }}>{item.label}</span>
                <input
                  inputMode="numeric"
                  value={Number(biayaAmounts[item.key] || 0).toLocaleString('id-ID')}
                  onChange={(e) => {
                    const digits = e.target.value.replace(/\D/g, '');
                    setBiayaAmounts((prev) => ({ ...prev, [item.key]: Number(digits) || 0 }));
                  }}
                  style={{ width: 110, padding: '8px 10px', borderRadius: 10, border: '1px solid var(--border)', background: 'var(--bg)', color: 'var(--ink)', fontSize: 12, fontWeight: 700, textAlign: 'right' }}
                />
              </div>
            ))}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: 8, borderTop: '1px solid var(--border)' }}>
              <span style={{ fontSize: 13, fontWeight: 800 }}>Total Estimasi</span>
              <span style={{ fontSize: 16, fontWeight: 800, color: 'var(--primary)' }}>{formatRupiah(biayaTotal)}</span>
            </div>
            <span style={{ fontSize: 10, color: 'var(--muted-soft)', lineHeight: 1.5 }}>
              Angka default cuma perkiraan kasar (bisa beda jauh antar daerah) — edit sesuai kondisi sebenarnya.
            </span>
          </div>
        )}

        <button
          onClick={() => setShowKasusKhusus((v) => !v)}
          aria-expanded={showKasusKhusus}
          className="card"
          style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 10, padding: '13px 16px', border: 'none', cursor: 'pointer', fontFamily: 'inherit', color: 'var(--ink)' }}
        >
          <span style={{ fontSize: 12, fontWeight: 800, letterSpacing: '0.03em', textTransform: 'uppercase', color: 'var(--muted)' }}>
            ℹ️ Panduan Kasus Khusus
          </span>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--muted)" style={{ transform: showKasusKhusus ? 'rotate(180deg)' : 'none', transition: 'transform var(--dur-1) var(--ease)' }}>
            <path d="m6 9 6 6 6-6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>

        {showKasusKhusus && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {JENAZAH_KASUS_KHUSUS.map((kasus) => (
              <div key={kasus.title} className="card" style={{ padding: 16, display: 'flex', flexDirection: 'column', gap: 6 }}>
                <h2 style={{ margin: 0, fontSize: 14, fontWeight: 800, color: 'var(--primary)' }}>{kasus.title}</h2>
                <ul style={{ margin: 0, paddingLeft: 18, display: 'flex', flexDirection: 'column', gap: 6 }}>
                  {kasus.poin.map((p, i) => (
                    <li key={i} style={{ fontSize: 12, lineHeight: 1.6, color: 'var(--ink)' }}>{p}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        )}

        <button
          onClick={() => setShowHindari((v) => !v)}
          aria-expanded={showHindari}
          className="card"
          style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 10, padding: '13px 16px', border: 'none', cursor: 'pointer', fontFamily: 'inherit', color: 'var(--ink)' }}
        >
          <span style={{ fontSize: 12, fontWeight: 800, letterSpacing: '0.03em', textTransform: 'uppercase', color: 'var(--muted)' }}>
            🚫 {JENAZAH_HINDARI.title}
          </span>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--muted)" style={{ transform: showHindari ? 'rotate(180deg)' : 'none', transition: 'transform var(--dur-1) var(--ease)' }}>
            <path d="m6 9 6 6 6-6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>

        {showHindari && (
          <div className="card" style={{ padding: 16, display: 'flex', flexDirection: 'column', gap: 10 }}>
            <p style={{ margin: 0, fontSize: 12, lineHeight: 1.6, color: 'var(--muted)' }}>{JENAZAH_HINDARI.intro}</p>
            <ul style={{ margin: 0, paddingLeft: 18, display: 'flex', flexDirection: 'column', gap: 6 }}>
              {JENAZAH_HINDARI.items.map((it) => (
                <li key={it} style={{ fontSize: 12, lineHeight: 1.6, color: 'var(--ink)' }}>{it}</li>
              ))}
            </ul>
            <div style={{ padding: '10px 12px', borderRadius: 12, background: 'var(--mint-soft)', display: 'flex', flexDirection: 'column', gap: 4 }}>
              <span style={{ fontSize: 11.5, fontWeight: 800, color: 'var(--primary)' }}>{JENAZAH_HINDARI.sunnahTitle}</span>
              <span style={{ fontSize: 11.5, lineHeight: 1.55, color: 'var(--primary)' }}>{JENAZAH_HINDARI.sunnah}</span>
            </div>
            <span style={{ fontSize: 10.5, color: 'var(--muted-soft)', lineHeight: 1.5 }}>Rujukan: {JENAZAH_HINDARI.sumber}</span>
          </div>
        )}

        <button onClick={handleExportPdf} className="btn-outline" style={{ padding: '11px', fontSize: 12.5 }}>
          ⬇ Unduh Ringkasan PDF
        </button>

        <div style={{ display: 'flex', gap: 8 }}>
          <button className="btn-outline" style={{ flex: 1 }} disabled={isFirst} onClick={() => setStep((s) => Math.max(0, s - 1))}>
            {t('panduan_jenazah_sebelumnya')}
          </button>
          {!isLast ? (
            <button className="btn" style={{ flex: 1 }} onClick={() => setStep((s) => Math.min(JENAZAH_STEPS.length - 1, s + 1))}>
              {t('panduan_jenazah_selanjutnya')}
            </button>
          ) : (
            <button className="btn" style={{ flex: 1 }} onClick={() => setStep(0)}>
              {t('panduan_jenazah_ulangi')}
            </button>
          )}
        </div>

        {doneCount === JENAZAH_STEPS.length && (
          <div style={{ textAlign: 'center', fontSize: 11.5, fontWeight: 700, color: 'var(--primary)' }}>
            ✓ Semua tahap sudah ditandai selesai
          </div>
        )}

        <span style={{ fontSize: 10.5, color: 'var(--muted-soft)', textAlign: 'center', lineHeight: 1.5 }}>
          {t('panduan_jenazah_footer_note')}
        </span>
      </div>
    </div>
  );
}
