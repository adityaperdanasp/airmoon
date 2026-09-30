import { useState } from 'react';
import TopBar from '../components/TopBar';
import { useLang } from '../context/LangContext';
import { JENAZAH_STEPS } from '../data/jenazahGuide';

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
export default function PanduanJenazah() {
  const { t } = useLang();
  const [step, setStep] = useState(0);
  const current = JENAZAH_STEPS[step];
  const isFirst = step === 0;
  const isLast = step === JENAZAH_STEPS.length - 1;

  return (
    <div className="screen">
      <div className="screen-content">
        <TopBar title={t('panduan_jenazah_title')} />

        <div className="card" style={{ padding: '10px 14px', display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ flex: 1, height: 6, borderRadius: 999, background: 'var(--border)', overflow: 'hidden' }}>
            <div style={{ width: `${((step + 1) / JENAZAH_STEPS.length) * 100}%`, height: '100%', background: 'var(--primary)', transition: 'width 0.2s ease' }} />
          </div>
          <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--muted)', flexShrink: 0 }}>{step + 1}/{JENAZAH_STEPS.length}</span>
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

          <div style={{ borderRadius: 16, overflow: 'hidden', aspectRatio: '16 / 9', background: '#000' }}>
            <iframe
              width="100%"
              height="100%"
              src={`https://www.youtube.com/embed/${current.youtubeId}?autoplay=0`}
              title={current.title}
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>

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
        </div>

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

        <span style={{ fontSize: 10.5, color: 'var(--muted-soft)', textAlign: 'center', lineHeight: 1.5 }}>
          {t('panduan_jenazah_footer_note')}
        </span>
      </div>
    </div>
  );
}
