import { useState } from 'react';
import TopBar from '../components/TopBar';
import { SHOLAT_STEPS } from '../data/sholatGuide';

// Panduan Sholat Pemula (2026-09-12) — step-by-step for a muallaf or
// anyone relearning sholat from scratch. Deliberately linear (prev/next,
// not a scrollable list) so a beginner follows one gerakan at a time
// instead of being handed a wall of text to figure out the order of.
export default function PanduanSholat() {
  const [step, setStep] = useState(0);
  const current = SHOLAT_STEPS[step];
  const isFirst = step === 0;
  const isLast = step === SHOLAT_STEPS.length - 1;

  return (
    <div className="screen">
      <div className="screen-content">
        <TopBar title="Panduan Sholat Pemula" />

        <div className="card" style={{ padding: '10px 14px', display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ flex: 1, height: 6, borderRadius: 999, background: 'var(--border)', overflow: 'hidden' }}>
            <div style={{ width: `${((step + 1) / SHOLAT_STEPS.length) * 100}%`, height: '100%', background: 'var(--primary)', transition: 'width 0.2s ease' }} />
          </div>
          <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--muted)', flexShrink: 0 }}>{step + 1}/{SHOLAT_STEPS.length}</span>
        </div>

        <div className="card" style={{ padding: 20, display: 'flex', flexDirection: 'column', gap: 14 }}>
          <span style={{ fontSize: 10.5, fontWeight: 700, color: 'var(--primary)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
            Langkah {step + 1}
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
            ← Sebelumnya
          </button>
          {!isLast ? (
            <button className="btn" style={{ flex: 1 }} onClick={() => setStep((s) => Math.min(SHOLAT_STEPS.length - 1, s + 1))}>
              Selanjutnya →
            </button>
          ) : (
            <button className="btn" style={{ flex: 1 }} onClick={() => setStep(0)}>
              Ulangi dari Awal
            </button>
          )}
        </div>

        <span style={{ fontSize: 10.5, color: 'var(--muted-soft)', textAlign: 'center', lineHeight: 1.5 }}>
          Panduan ini nunjukin satu siklus rakaat lengkap (niat sampai salam) — jumlah rakaat & detail tiap sholat (Subuh/Dzuhur/dst) beda-beda, cek Jadwal Sholat buat waktu & jumlah rakaatnya.
        </span>
      </div>
    </div>
  );
}
