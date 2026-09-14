import { useState } from 'react';
import TopBar from '../components/TopBar';
import { useLang } from '../context/LangContext';
import { SHOLAT_STEPS, PRAYER_RAKAAT_INFO } from '../data/sholatGuide';

// Panduan Sholat Pemula (2026-09-12) — step-by-step for a muallaf or
// anyone relearning sholat from scratch. Deliberately linear (prev/next,
// not a scrollable list) so a beginner follows one gerakan at a time
// instead of being handed a wall of text to figure out the order of.
export default function PanduanSholat() {
  const { t } = useLang();
  const [step, setStep] = useState(0);
  const [showRakaat, setShowRakaat] = useState(false);
  const current = SHOLAT_STEPS[step];
  const isFirst = step === 0;
  const isLast = step === SHOLAT_STEPS.length - 1;

  return (
    <div className="screen">
      <div className="screen-content">
        <TopBar title={t('panduan_sholat_title')} />

        <div className="card" style={{ padding: '10px 14px', display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ flex: 1, height: 6, borderRadius: 999, background: 'var(--border)', overflow: 'hidden' }}>
            <div style={{ width: `${((step + 1) / SHOLAT_STEPS.length) * 100}%`, height: '100%', background: 'var(--primary)', transition: 'width 0.2s ease' }} />
          </div>
          <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--muted)', flexShrink: 0 }}>{step + 1}/{SHOLAT_STEPS.length}</span>
        </div>

        <div className="card" style={{ padding: 20, display: 'flex', flexDirection: 'column', gap: 14 }}>
          <span style={{ fontSize: 10.5, fontWeight: 700, color: 'var(--primary)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
            {t('panduan_sholat_langkah')} {step + 1}
          </span>
          <span style={{ fontSize: 20, fontWeight: 800 }}>{current.title}</span>
          <p style={{ margin: 0, fontSize: 13, lineHeight: 1.6, color: 'var(--muted)' }}>{current.gerakan}</p>

          <div style={{ padding: '14px 16px', borderRadius: 14, background: 'var(--bg)', display: 'flex', flexDirection: 'column', gap: 10 }}>
            <div style={{ fontFamily: "'Amiri', serif", fontSize: 20, lineHeight: 2, direction: 'rtl', textAlign: 'right' }}>
              {current.arabic}
            </div>
            <p style={{ margin: 0, fontSize: 11.5, lineHeight: 1.55, color: 'var(--muted-soft)', fontStyle: 'italic' }}>{current.latin}</p>
            <p style={{ margin: 0, fontSize: 12, lineHeight: 1.55, color: 'var(--muted)' }}>{current.translation}</p>
          </div>
        </div>

        <div style={{ display: 'flex', gap: 8 }}>
          <button className="btn-outline" style={{ flex: 1 }} disabled={isFirst} onClick={() => setStep((s) => Math.max(0, s - 1))}>
            {t('panduan_sholat_sebelumnya')}
          </button>
          {!isLast ? (
            <button className="btn" style={{ flex: 1 }} onClick={() => setStep((s) => Math.min(SHOLAT_STEPS.length - 1, s + 1))}>
              {t('panduan_sholat_selanjutnya')}
            </button>
          ) : (
            <button className="btn" style={{ flex: 1 }} onClick={() => setStep(0)}>
              {t('panduan_sholat_ulangi')}
            </button>
          )}
        </div>

        <span style={{ fontSize: 10.5, color: 'var(--muted-soft)', textAlign: 'center', lineHeight: 1.5 }}>
          {t('panduan_sholat_footer_note')}
        </span>

        <button
          onClick={() => setShowRakaat((v) => !v)}
          className="card"
          style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 16px', border: 'none', cursor: 'pointer', font: 'inherit', color: 'inherit', textAlign: 'left' }}
        >
          <span style={{ fontSize: 12.5, fontWeight: 700 }}>{t('panduan_sholat_rincian_toggle')}</span>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="var(--muted)" style={{ transform: showRakaat ? 'rotate(180deg)' : 'none', transition: 'transform 0.15s ease' }}>
            <path d="m6 9 6 6 6-6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>

        {showRakaat && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {PRAYER_RAKAAT_INFO.map((p) => (
              <div key={p.name} className="card" style={{ padding: '12px 16px', display: 'flex', flexDirection: 'column', gap: 4 }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: 13, fontWeight: 800 }}>{p.name}</span>
                  <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--primary)' }}>{p.fardhu} {t('panduan_sholat_rakaat_unit')}</span>
                </div>
                {(p.sunnahSebelum > 0 || p.sunnahSesudah > 0) && (
                  <span style={{ fontSize: 11, color: 'var(--muted)' }}>
                    {p.sunnahSebelum > 0 && `${t('panduan_sholat_sunnah_sebelum')} ${p.sunnahSebelum} ${t('panduan_sholat_rakaat_unit')}`}
                    {p.sunnahSebelum > 0 && p.sunnahSesudah > 0 && ' · '}
                    {p.sunnahSesudah > 0 && `${t('panduan_sholat_sunnah_sesudah')} ${p.sunnahSesudah} ${t('panduan_sholat_rakaat_unit')}`}
                  </span>
                )}
                {p.catatan && <span style={{ fontSize: 10.5, color: 'var(--muted-soft)', lineHeight: 1.5 }}>{p.catatan}</span>}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
