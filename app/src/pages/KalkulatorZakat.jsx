import { useEffect, useState } from 'react';
import { calcZakatPenghasilan, calcZakatMaal, calcZakatFitrah, formatRupiah, NISAB_GOLD_GRAMS } from '../lib/zakat';
import { useLang } from '../context/LangContext';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { watchZakatHaul, startZakatHaul, clearZakatHaul, restoreZakatHaul, daysUntilHaulDue } from '../lib/zakatHaul';
import { watchZakatPenghasilanReminder, setZakatPenghasilanReminder } from '../lib/zakatPenghasilanReminder';
import PageHeaderPhoto from '../components/PageHeaderPhoto';
import ConfirmDialog from '../components/ConfirmDialog';
import { useToast } from '../context/ToastContext';
import { PAGE_PHOTOS } from '../data/photos';
import CountUp from '../components/CountUp';
import { loadZakatHistory, saveZakatHistoryEntry, deleteZakatHistoryEntry } from '../lib/zakatHistory';
import ZakatShareModal from '../components/ZakatShareModal';
import { IconShare } from '../components/icons';
import { useSwipeReveal } from '../lib/useSwipeReveal';
import ProgressRing from '../components/ProgressRing';
import SegButton from '../components/SegButton';
import ToggleSwitch from '../components/ToggleSwitch';

// Includes the time, not just the date — two calculations saved minutes
// apart on the same day used to be indistinguishable in the list.
function formatHistoryDate(ts) {
  return new Date(ts).toLocaleString('id-ID', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });
}

function digitsOnly(v) {
  return v.replace(/\D/g, '');
}

// Radial gauge for how close current assets are to the nisab threshold —
// the text-only "Nisab: RpX" line next to the input told someone the
// number, but not at a glance how close (or far past) they actually are;
// a physical dial reads instantly in a way scanning two rupiah figures
// and subtracting them in your head doesn't.
function NisabGauge({ assets, nisab, reachesNisab }) {
  const pct = nisab > 0 ? Math.min(1, assets / nisab) : 0;
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 16, padding: '14px 16px', borderRadius: 16, background: 'var(--card)' }}>
      <ProgressRing size={108} strokeWidth={10} percent={pct} color={reachesNisab ? 'var(--success)' : 'var(--gold-ink)'} />
      <div style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
        <span style={{ fontSize: 20, fontWeight: 800, color: reachesNisab ? 'var(--success)' : 'var(--ink)' }}>
          {Math.round(pct * 100)}%
        </span>
        <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--ink)' }}>
          {reachesNisab ? 'Sudah mencapai nisab' : 'Menuju nisab'}
        </span>
        <span style={{ fontSize: 10, color: 'var(--muted)', lineHeight: 1.4 }}>
          {reachesNisab ? 'Harta wajib dizakati' : `Butuh ${formatRupiah(Math.max(0, nisab - assets))} lagi`}
        </span>
      </div>
    </div>
  );
}

// [UI 2026-09-11] Swipe-left-to-reveal-delete, same lib/useSwipeReveal.js
// hook AyatFavorit.jsx's rows use — the existing "×" button stays too,
// both funnel into the same setDeleteHistoryId (the row's own caller).
function ZakatHistoryRow({ e, label, detail, onDelete }) {
  const { dragX, close, revealWidth, handlers } = useSwipeReveal();
  return (
    <div style={{ position: 'relative', overflow: 'hidden', borderRadius: 14 }}>
      <button
        onClick={() => {
          close();
          onDelete(e.id);
        }}
        aria-label="Hapus dari riwayat"
        style={{ position: 'absolute', right: 0, top: 0, bottom: 0, width: revealWidth, background: 'var(--danger)', color: 'var(--on-danger)', border: 'none', fontSize: 10, fontWeight: 700, cursor: 'pointer' }}
      >
        Hapus
      </button>
      <div
        {...handlers}
        style={{
          position: 'relative',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 10,
          padding: '12px 14px',
          borderRadius: 14,
          background: 'var(--card)',
          transform: `translateX(${dragX}px)`,
          transition: dragX === 0 || dragX === -revealWidth ? 'transform var(--dur-2) var(--ease)' : 'none',
          touchAction: 'pan-y',
        }}
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: 2, minWidth: 0 }}>
          <span style={{ fontSize: 11.5, fontWeight: 700 }}>
            {label} &middot; {formatHistoryDate(e.at)}
          </span>
          <span style={{ fontSize: 13, fontWeight: 800, color: 'var(--primary)' }}>{formatRupiah(e.amount)}</span>
          <span style={{ fontSize: 10, color: 'var(--muted)' }}>{detail}</span>
        </div>
        <button
          onClick={() => onDelete(e.id)}
          aria-label="Hapus dari riwayat"
          style={{ width: 26, height: 26, borderRadius: '50%', border: 'none', background: 'rgba(0,0,0,0.06)', color: 'var(--muted)', fontSize: 14, cursor: 'pointer', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
        >
          ×
        </button>
      </div>
    </div>
  );
}

export default function KalkulatorZakat() {
  const { t } = useLang();
  const { user } = useAuth();
  const { theme } = useTheme();
  const { showToast } = useToast();
  const [tab, setTab] = useState('penghasilan');
  const [showHaulResetConfirm, setShowHaulResetConfirm] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);

  // Zakat Penghasilan
  const [income, setIncome] = useState('15000000');
  const [needs, setNeeds] = useState('5000000');
  const incomeN = Number(digitsOnly(income)) || 0;
  const needsN = Number(digitsOnly(needs)) || 0;
  const zakatPenghasilan = calcZakatPenghasilan(incomeN, needsN);
  const [penghasilanReminderOn, setPenghasilanReminderOn] = useState(false);
  useEffect(() => watchZakatPenghasilanReminder(user?.uid, setPenghasilanReminderOn), [user?.uid]);

  // Zakat Maal
  const [assets, setAssets] = useState('100000000');
  const [goldPrice, setGoldPrice] = useState('1500000');
  const assetsN = Number(digitsOnly(assets)) || 0;
  const goldPriceN = Number(digitsOnly(goldPrice)) || 0;
  const nisab = NISAB_GOLD_GRAMS * goldPriceN;
  const zakatMaal = calcZakatMaal(assetsN, goldPriceN);
  const reachesNisab = assetsN >= nisab && nisab > 0;

  const [haul, setHaul] = useState(null);
  useEffect(() => watchZakatHaul(user?.uid, setHaul), [user?.uid]);
  const daysLeft = haul?.startDate ? daysUntilHaulDue(haul.startDate) : null;

  // Zakat Fitrah — calcZakatFitrah() already existed in lib/zakat.js but
  // was never actually wired into any tab here (same "built but never
  // shipped" gap the Zakat Maal tab itself once was, per this file's own
  // git history). 2.5 kg is the standard fiqh amount per jiwa (some
  // ulama use 3.5 liter beras instead — close enough in practice that a
  // single fixed constant is fine here, same simplification level as the
  // rest of this calculator).
  const RICE_KG_PER_PERSON = 2.5;
  const [jumlahJiwa, setJumlahJiwa] = useState('1');
  const [ricePricePerKg, setRicePricePerKg] = useState('15000');
  const jumlahJiwaN = Number(digitsOnly(jumlahJiwa)) || 0;
  const ricePricePerKgN = Number(digitsOnly(ricePricePerKg)) || 0;
  const zakatFitrah = calcZakatFitrah(RICE_KG_PER_PERSON, ricePricePerKgN, jumlahJiwaN);

  const [zakatHistory, setZakatHistory] = useState(loadZakatHistory);
  const [showHistory, setShowHistory] = useState(false);
  const [deleteHistoryId, setDeleteHistoryId] = useState(null);
  const [historyFilter, setHistoryFilter] = useState('semua');
  const filteredZakatHistory = historyFilter === 'semua' ? zakatHistory : zakatHistory.filter((e) => e.type === historyFilter);

  function handleSaveHistory() {
    if (tab === 'penghasilan') {
      setZakatHistory(saveZakatHistoryEntry('penghasilan', { income: incomeN, needs: needsN }, zakatPenghasilan));
    } else if (tab === 'maal') {
      setZakatHistory(saveZakatHistoryEntry('maal', { assets: assetsN, goldPrice: goldPriceN }, zakatMaal));
    } else {
      setZakatHistory(saveZakatHistoryEntry('fitrah', { jumlahJiwa: jumlahJiwaN, ricePricePerKg: ricePricePerKgN }, zakatFitrah));
    }
    showToast('Perhitungan disimpan ke riwayat.');
  }

  // Ekspor Riwayat Zakat ke Teks — exports whatever's currently filtered
  // by the type chips (not always all 3 types), same "export what's on
  // screen" reasoning as NotifikasiCenter.jsx's own text export.
  function handleExportZakatHistory() {
    const lines = filteredZakatHistory.map((e) => {
      const typeLabel = e.type === 'penghasilan' ? 'Zakat Penghasilan' : e.type === 'maal' ? 'Zakat Maal' : 'Zakat Fitrah';
      const detail =
        e.type === 'penghasilan'
          ? `Penghasilan ${formatRupiah(e.inputs.income)} · Kebutuhan ${formatRupiah(e.inputs.needs)}`
          : e.type === 'maal'
            ? `Harta ${formatRupiah(e.inputs.assets)} · Emas ${formatRupiah(e.inputs.goldPrice)}/gr`
            : `${e.inputs.jumlahJiwa} jiwa · Beras ${formatRupiah(e.inputs.ricePricePerKg)}/kg`;
      return `[${formatHistoryDate(e.at)}] ${typeLabel}: ${formatRupiah(e.amount)}\n${detail}`;
    });
    const text = `Riwayat Perhitungan Zakat — airmoon\n\n${lines.join('\n\n') || 'Belum ada riwayat.'}`;
    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'riwayat-zakat-airmoon.txt';
    a.click();
    URL.revokeObjectURL(url);
  }

  function currentShareData() {
    if (tab === 'penghasilan') {
      return {
        typeLabel: 'Zakat Penghasilan',
        amountLabel: formatRupiah(zakatPenghasilan),
        formulaLabel: `2.5% × (${formatRupiah(incomeN)} − ${formatRupiah(needsN)})`,
      };
    }
    if (tab === 'maal') {
      return {
        typeLabel: 'Zakat Maal',
        amountLabel: formatRupiah(zakatMaal),
        formulaLabel: reachesNisab ? `2.5% × ${formatRupiah(assetsN)}` : 'Belum mencapai nisab',
      };
    }
    return {
      typeLabel: 'Zakat Fitrah',
      amountLabel: formatRupiah(zakatFitrah),
      formulaLabel: `${RICE_KG_PER_PERSON} kg × ${formatRupiah(ricePricePerKgN)} × ${jumlahJiwaN} jiwa`,
    };
  }

  return (
    <div className="screen">
      <div className="screen-content">
        <PageHeaderPhoto title={t('item_kalkulator_zakat')} photo={PAGE_PHOTOS.zakat} />

        <div style={{ display: 'flex', padding: 3, borderRadius: 999, background: 'var(--mint-soft)' }}>
          <SegButton active={tab === 'penghasilan'} onClick={() => setTab('penghasilan')}>
            {t('zakat_tab_penghasilan')}
          </SegButton>
          <SegButton active={tab === 'maal'} onClick={() => setTab('maal')}>
            {t('zakat_tab_maal')}
          </SegButton>
          <SegButton active={tab === 'fitrah'} onClick={() => setTab('fitrah')}>
            {t('zakat_tab_fitrah')}
          </SegButton>
        </div>

        {tab === 'penghasilan' ? (
          <>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 7 }}>
              <span style={{ fontSize: 12, fontWeight: 700 }}>{t('penghasilan_label')}</span>
              <div className="input-row">
                <span style={{ fontSize: 13.5, fontWeight: 700, color: 'var(--muted)' }}>Rp</span>
                <input inputMode="numeric" value={incomeN.toLocaleString('id-ID')} onChange={(e) => setIncome(e.target.value)} />
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 7 }}>
              <span style={{ fontSize: 12, fontWeight: 700 }}>{t('kebutuhan_label')}</span>
              <div className="input-row">
                <span style={{ fontSize: 13.5, fontWeight: 700, color: 'var(--muted)' }}>Rp</span>
                <input inputMode="numeric" value={needsN.toLocaleString('id-ID')} onChange={(e) => setNeeds(e.target.value)} />
              </div>
            </div>

            <div style={{ borderRadius: 20, padding: 20, textAlign: 'center', background: `linear-gradient(135deg, var(--primary), var(--primary-dark))` }}>
              <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.04em', textTransform: 'uppercase', color: 'var(--accent)' }}>
                {t('zakat_wajib_label')}
              </span>
              <div style={{ fontSize: 30, fontWeight: 800, color: '#fff', marginTop: 8 }}><CountUp value={zakatPenghasilan} formatter={formatRupiah} /></div>
              <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.7)' }}>
                2.5% &times; ({formatRupiah(incomeN)} &minus; {formatRupiah(needsN)})
              </span>
            </div>

            <div style={{ display: 'flex', gap: 10 }}>
              <button className="btn-outline" style={{ flex: 1 }} onClick={handleSaveHistory}>
                📌 Simpan ke Riwayat
              </button>
              <button className="btn-outline" style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }} onClick={() => setShowShareModal(true)}>
                <IconShare /> Bagikan
              </button>
            </div>

            {/* Was a dead button — no onClick at all, so tapping it did
                nothing. No real zakat-payment flow exists in this app
                (Donasi's infra is specifically PLN-direct mosque
                electricity, a different flow) — honest info instead of a
                fake "processing" state or a silently broken tap. */}
            <button className="btn" onClick={() => showToast('Pembayaran zakat online belum tersedia di airmoon — salurkan langsung ke amil/BAZNAS atau masjid terdekat ya.', { duration: 4500 })}>
              {t('bayar_zakat_btn')}
            </button>

            {user && (
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 10, padding: '12px 14px', borderRadius: 14, background: 'var(--card)' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                  <span style={{ fontSize: 12.5, fontWeight: 700 }}>🔔 Pengingat Bulanan</span>
                  <span style={{ fontSize: 10.5, color: 'var(--muted)' }}>Diingatkan tiap bulan buat hitung & bayar zakat penghasilan</span>
                </div>
                <ToggleSwitch checked={penghasilanReminderOn} onChange={(v) => user && setZakatPenghasilanReminder(user.uid, v)} />
              </div>
            )}

            <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10, padding: '13px 14px', borderRadius: 14, background: 'var(--card)' }}>
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="var(--muted)" style={{ flexShrink: 0, marginTop: 1 }}>
                <circle cx="12" cy="12" r="9" strokeWidth="1.6" /><path d="M12 11v5.5M12 8v.01" strokeWidth="1.8" strokeLinecap="round" />
              </svg>
              <span style={{ fontSize: 11, lineHeight: 1.5, color: 'var(--muted)' }}>{t('zakat_info')}</span>
            </div>
          </>
        ) : tab === 'maal' ? (
          <>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 7 }}>
              <span style={{ fontSize: 12, fontWeight: 700 }}>{t('harta_label')}</span>
              <div className="input-row">
                <span style={{ fontSize: 13.5, fontWeight: 700, color: 'var(--muted)' }}>Rp</span>
                <input inputMode="numeric" value={assetsN.toLocaleString('id-ID')} onChange={(e) => setAssets(e.target.value)} />
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 7 }}>
              <span style={{ fontSize: 12, fontWeight: 700 }}>{t('harga_emas_label')}</span>
              <div className="input-row">
                <span style={{ fontSize: 13.5, fontWeight: 700, color: 'var(--muted)' }}>Rp</span>
                <input inputMode="numeric" value={goldPriceN.toLocaleString('id-ID')} onChange={(e) => setGoldPrice(e.target.value)} />
              </div>
              <span style={{ fontSize: 10.5, color: 'var(--muted)' }}>{t('nisab_info')} &middot; {formatRupiah(nisab)}</span>
            </div>

            <NisabGauge assets={assetsN} nisab={nisab} reachesNisab={reachesNisab} />

            <div style={{ borderRadius: 20, padding: 20, textAlign: 'center', background: `linear-gradient(135deg, var(--primary), var(--primary-dark))` }}>
              <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.04em', textTransform: 'uppercase', color: 'var(--accent)' }}>
                {t('zakat_wajib_label')}
              </span>
              <div style={{ fontSize: 30, fontWeight: 800, color: '#fff', marginTop: 8 }}><CountUp value={zakatMaal} formatter={formatRupiah} /></div>
              <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.7)' }}>
                {reachesNisab ? `2.5% × ${formatRupiah(assetsN)}` : t('belum_capai_nisab')}
              </span>
            </div>

            <div style={{ display: 'flex', gap: 10 }}>
              <button className="btn-outline" style={{ flex: 1 }} onClick={handleSaveHistory}>
                📌 Simpan ke Riwayat
              </button>
              <button className="btn-outline" style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }} onClick={() => setShowShareModal(true)}>
                <IconShare /> Bagikan
              </button>
            </div>

            <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: 10, padding: 16 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <span style={{ fontSize: 20, lineHeight: 1 }}>🌙</span>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                  <span style={{ fontSize: 13, fontWeight: 800 }}>{t('haul_label')}</span>
                  <span style={{ fontSize: 10.5, color: 'var(--muted)', lineHeight: 1.4 }}>{t('haul_sub')}</span>
                </div>
              </div>

              {haul?.startDate ? (
                <>
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: 6 }}>
                    <span style={{ fontSize: 22, fontWeight: 800, color: daysLeft <= 0 ? 'var(--danger)' : 'var(--primary)' }}>
                      {daysLeft > 0 ? daysLeft : 0}
                    </span>
                    <span style={{ fontSize: 11.5, color: 'var(--muted)' }}>
                      {daysLeft > 0 ? t('haul_sisa_hari') : t('haul_jatuh_tempo')}
                    </span>
                  </div>
                  <span style={{ fontSize: 10.5, color: 'var(--muted)' }}>
                    {t('haul_tersimpan')}: {new Date(`${haul.startDate}T00:00:00`).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
                  </span>
                  <button className="btn-outline" style={{ padding: '9px' }} onClick={() => setShowHaulResetConfirm(true)}>
                    Reset
                  </button>
                </>
              ) : (
                <button
                  className="btn"
                  style={{ padding: '11px' }}
                  onClick={() => {
                    if (!user) return;
                    startZakatHaul(user.uid);
                    showToast('Haul mulai dihitung dari hari ini');
                  }}
                  disabled={!user}
                >
                  {t('tandai_haul_btn')}
                </button>
              )}
            </div>

            <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10, padding: '13px 14px', borderRadius: 14, background: 'var(--card)' }}>
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="var(--muted)" style={{ flexShrink: 0, marginTop: 1 }}>
                <circle cx="12" cy="12" r="9" strokeWidth="1.6" /><path d="M12 11v5.5M12 8v.01" strokeWidth="1.8" strokeLinecap="round" />
              </svg>
              <span style={{ fontSize: 11, lineHeight: 1.5, color: 'var(--muted)' }}>{t('zakat_info')}</span>
            </div>
          </>
        ) : (
          <>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 7 }}>
              <span style={{ fontSize: 12, fontWeight: 700 }}>{t('jumlah_jiwa_label')}</span>
              <div className="input-row">
                <input inputMode="numeric" value={jumlahJiwaN.toLocaleString('id-ID')} onChange={(e) => setJumlahJiwa(e.target.value)} />
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 7 }}>
              <span style={{ fontSize: 12, fontWeight: 700 }}>{t('harga_beras_label')}</span>
              <div className="input-row">
                <span style={{ fontSize: 13.5, fontWeight: 700, color: 'var(--muted)' }}>Rp</span>
                <input inputMode="numeric" value={ricePricePerKgN.toLocaleString('id-ID')} onChange={(e) => setRicePricePerKg(e.target.value)} />
              </div>
              <span style={{ fontSize: 10.5, color: 'var(--muted)' }}>Standar: {RICE_KG_PER_PERSON} kg beras per jiwa</span>
            </div>

            <div style={{ borderRadius: 20, padding: 20, textAlign: 'center', background: `linear-gradient(135deg, var(--primary), var(--primary-dark))` }}>
              <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.04em', textTransform: 'uppercase', color: 'var(--accent)' }}>
                {t('zakat_wajib_label')}
              </span>
              <div style={{ fontSize: 30, fontWeight: 800, color: '#fff', marginTop: 8 }}><CountUp value={zakatFitrah} formatter={formatRupiah} /></div>
              <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.7)' }}>
                {RICE_KG_PER_PERSON} kg &times; {formatRupiah(ricePricePerKgN)} &times; {jumlahJiwaN} jiwa
              </span>
            </div>

            <div style={{ display: 'flex', gap: 10 }}>
              <button className="btn-outline" style={{ flex: 1 }} onClick={handleSaveHistory}>
                📌 Simpan ke Riwayat
              </button>
              <button className="btn-outline" style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }} onClick={() => setShowShareModal(true)}>
                <IconShare /> Bagikan
              </button>
            </div>

            <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10, padding: '13px 14px', borderRadius: 14, background: 'var(--card)' }}>
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="var(--muted)" style={{ flexShrink: 0, marginTop: 1 }}>
                <circle cx="12" cy="12" r="9" strokeWidth="1.6" /><path d="M12 11v5.5M12 8v.01" strokeWidth="1.8" strokeLinecap="round" />
              </svg>
              <span style={{ fontSize: 11, lineHeight: 1.5, color: 'var(--muted)' }}>{t('fitrah_info')}</span>
            </div>
          </>
        )}

        {zakatHistory.length > 0 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            <button
              onClick={() => setShowHistory((v) => !v)}
              aria-expanded={showHistory}
              style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'none', border: 'none', padding: 0, cursor: 'pointer' }}
            >
              <span className="section-label" style={{ color: 'var(--muted)', fontSize: 11.5, letterSpacing: '0.04em', textTransform: 'uppercase' }}>
                Riwayat Perhitungan ({zakatHistory.length})
              </span>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--muted)" style={{ transform: showHistory ? 'rotate(180deg)' : 'none', transition: 'transform var(--dur-1) var(--ease)' }}>
                <path d="m6 9 6 6 6-6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>

            {showHistory && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                <div style={{ display: 'flex', gap: 6 }}>
                  {[
                    { key: 'semua', label: 'Semua' },
                    { key: 'penghasilan', label: 'Penghasilan' },
                    { key: 'maal', label: 'Maal' },
                    { key: 'fitrah', label: 'Fitrah' },
                  ].map((f) => (
                    <button
                      key={f.key}
                      onClick={() => setHistoryFilter(f.key)}
                      aria-pressed={historyFilter === f.key}
                      style={{ padding: '6px 12px', borderRadius: 999, border: 'none', fontSize: 11, fontWeight: 700, cursor: 'pointer', color: historyFilter === f.key ? 'var(--on-primary)' : 'var(--ink)', background: historyFilter === f.key ? 'var(--primary)' : 'var(--mint-soft)' }}
                    >
                      {f.label}
                    </button>
                  ))}
                </div>
                {filteredZakatHistory.length > 0 && (
                  <button onClick={handleExportZakatHistory} className="btn-outline" style={{ padding: '8px', fontSize: 11.5 }}>
                    ⬇ Ekspor ke Teks
                  </button>
                )}
                {filteredZakatHistory.length === 0 && (
                  <span style={{ fontSize: 11, color: 'var(--muted)' }}>Belum ada riwayat di kategori ini.</span>
                )}
                {filteredZakatHistory.map((e) => (
                  <ZakatHistoryRow
                    key={e.id}
                    e={e}
                    onDelete={setDeleteHistoryId}
                    label={e.type === 'penghasilan' ? 'Zakat Penghasilan' : e.type === 'maal' ? 'Zakat Maal' : 'Zakat Fitrah'}
                    detail={
                      e.type === 'penghasilan'
                        ? `Penghasilan ${formatRupiah(e.inputs.income)} · Kebutuhan ${formatRupiah(e.inputs.needs)}`
                        : e.type === 'maal'
                          ? `Harta ${formatRupiah(e.inputs.assets)} · Emas ${formatRupiah(e.inputs.goldPrice)}/gr`
                          : `${e.inputs.jumlahJiwa} jiwa · Beras ${formatRupiah(e.inputs.ricePricePerKg)}/kg`
                    }
                  />
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {deleteHistoryId && (
        <ConfirmDialog
          title="Hapus dari riwayat?"
          message="Catatan perhitungan zakat ini bakal dihapus dari riwayat di HP ini."
          confirmLabel="Ya, Hapus"
          danger
          onCancel={() => setDeleteHistoryId(null)}
          onConfirm={() => {
            const removed = zakatHistory.find((e) => e.id === deleteHistoryId);
            setZakatHistory(deleteZakatHistoryEntry(deleteHistoryId));
            setDeleteHistoryId(null);
            if (removed) {
              showToast('Riwayat dihapus', {
                        type: 'danger',
                actionLabel: 'Batalkan',
                onAction: () => setZakatHistory(saveZakatHistoryEntry(removed.type, removed.inputs, removed.amount)),
              });
            }
          }}
        />
      )}

      {showShareModal && (
        <ZakatShareModal
          {...currentShareData()}
          theme={theme}
          onClose={() => setShowShareModal(false)}
        />
      )}

      {showHaulResetConfirm && (
        <ConfirmDialog
          title="Reset hitungan haul?"
          message="Countdown haul bakal dihapus dan mulai dari awal lagi kalau kamu tandai ulang nanti."
          confirmLabel="Ya, Reset"
          danger
          onCancel={() => setShowHaulResetConfirm(false)}
          onConfirm={() => {
            const removed = haul;
            if (user) clearZakatHaul(user.uid);
            showToast('Hitungan haul direset', {
              type: 'danger',
              actionLabel: 'Batalkan',
              onAction: () => user && removed && restoreZakatHaul(user.uid, removed),
            });
            setShowHaulResetConfirm(false);
          }}
        />
      )}
    </div>
  );
}
