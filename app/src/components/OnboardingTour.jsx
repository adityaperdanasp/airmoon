import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { ArtWelcome, ArtQuran, ArtAdzan, ArtDonation, ArtMore } from './onboardingArt';
import { useAuth } from '../context/AuthContext';
import { INTEREST_OPTIONS, setInterestTag } from '../lib/interestTag';
import { trackOnboardingEvent } from '../lib/onboardingFunnel';

const SWIPE_THRESHOLD = 50; // px horizontal travel before a touch counts as "swipe to the next/prev slide"

// A short guided intro shown once ever, on a brand-new account's first
// Home visit (see Home.jsx's call site + lib/onboarding.js's seen-flag).
// Deliberately a plain sequential full-screen walkthrough rather than
// spotlighting exact DOM elements (a "coach mark" pointing at the real
// BottomNav tabs) — that needs live getBoundingClientRect measurement
// against a portalled, sometimes-not-yet-mounted nav, which is a lot of
// fragility for a one-time first-run screen; a few clear slides cover the
// same ground (what's here, why it's different) far more robustly.
const SLIDES = [
  {
    art: <ArtWelcome />,
    title: 'Assalamu\'alaikum, selamat datang di airmoon 🌙',
    body: 'Aplikasi Muslim harian kamu — baca Qur\'an, jadwal sholat, dzikir, sampai donasi listrik masjid, semua dalam satu tempat.',
  },
  {
    art: <ArtQuran />,
    title: 'Baca Qur\'an, Mode Ayat atau Mushaf',
    body: 'Pilih Mode Ayat buat baca santai dengan terjemahan, atau Mode Mushaf Madinah buat tampilan asli mushaf cetak — lengkap dengan tajwid warna dan bookmark otomatis.',
  },
  {
    art: <ArtAdzan />,
    title: 'Jadwal Sholat & Notifikasi Adzan',
    body: 'Waktu sholat sesuai lokasimu, plus notifikasi adzan yang beneran bunyi — bukan cuma pengingat diam.',
  },
  {
    art: <ArtDonation />,
    title: 'Donasi Langsung ke Listrik Masjid',
    body: 'Beda dari yang lain — sedekahmu di sini beneran disalurkan ke tagihan listrik PLN masjid, bukan lewat rekening panitia.',
  },
  {
    art: <ArtMore />,
    title: 'Masih banyak lagi di tab "Lainnya"',
    body: 'Tasbih digital, kalkulator zakat & waris, Asmaul Husna, dzikir pagi/petang, dan lebih dari selusin fitur lain nunggu buat dijelajahi.',
  },
];

// [PM 2026-09-12] One more step appended after the 5 content slides — a
// real interactive choice, not a passive slide: pick what you're mainly
// here for, so Home.jsx can put the matching section first instead of
// showing the exact same layout to every user regardless of intent (see
// lib/interestTag.js). Skipping this step (Lewati) is fine — Home just
// keeps its default order, same as before this existed.
const INTEREST_STEP = SLIDES.length;
const TOTAL_STEPS = SLIDES.length + 1;

export default function OnboardingTour({ onFinish }) {
  const { user } = useAuth();
  const [step, setStep] = useState(0);
  const isInterestStep = step === INTEREST_STEP;
  const slide = isInterestStep ? null : SLIDES[step];
  const isLast = step === TOTAL_STEPS - 1;
  const touchX = useRef(null);

  // [PM 2026-09-12] Onboarding funnel telemetry — this app has no
  // product-analytics suite, so a plain per-step view counter (see
  // lib/onboardingFunnel.js) is the cheapest real substitute for "where
  // do people actually drop off". Fires once per step actually reached,
  // not per render.
  useEffect(() => {
    trackOnboardingEvent(`step_${step}_view`);
  }, [step]);

  function finish(interestKey) {
    if (interestKey && user) setInterestTag(user.uid, interestKey);
    trackOnboardingEvent(interestKey ? 'completed' : 'skipped');
    onFinish();
  }

  // [UI 2026-09-11] This reads as a slideshow but could only ever be
  // tapped through via the Lanjut button — a real, missing gesture for
  // something presented as slides. Plain left/right swipe, no axis-lock
  // needed (this modal has no vertical scroll to conflict with).
  function onTouchStart(e) {
    touchX.current = e.touches[0].clientX;
  }
  function onTouchEnd(e) {
    if (touchX.current == null) return;
    const dx = e.changedTouches[0].clientX - touchX.current;
    touchX.current = null;
    if (dx <= -SWIPE_THRESHOLD && !isLast) setStep((s) => s + 1);
    else if (dx >= SWIPE_THRESHOLD && step > 0) setStep((s) => s - 1);
  }

  return createPortal(
    <div
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
      style={{ position: 'fixed', inset: 0, background: 'var(--bg)', zIndex: 70, display: 'flex', flexDirection: 'column' }}
    >
      <div style={{ display: 'flex', justifyContent: 'flex-end', padding: 'calc(14px + env(safe-area-inset-top)) 20px 0' }}>
        <button
          onClick={() => finish(null)}
          style={{ background: 'none', border: 'none', color: 'var(--muted)', fontSize: 12.5, fontWeight: 700, cursor: 'pointer', padding: 8 }}
        >
          Lewati
        </button>
      </div>

      {isInterestStep ? (
        <div key={step} className="onboarding-slide" style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 20, padding: '0 32px', textAlign: 'center' }}>
          <h1 style={{ margin: 0, fontSize: 19, fontWeight: 800, lineHeight: 1.35 }}>Terakhir, kamu ke sini mau ngapain?</h1>
          <p style={{ margin: 0, fontSize: 13.5, lineHeight: 1.5, color: 'var(--muted)' }}>Biar tampilan Home lebih pas buat kamu — bisa diganti kapan aja di Pengaturan.</p>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, width: '100%', maxWidth: 320 }}>
            {INTEREST_OPTIONS.map((opt) => (
              <button
                key={opt.key}
                onClick={() => finish(opt.key)}
                style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, padding: '18px 10px', borderRadius: 18, border: '1px solid var(--border)', background: 'var(--card)', cursor: 'pointer' }}
              >
                <span style={{ fontSize: 26 }}>{opt.icon}</span>
                <span style={{ fontSize: 12, fontWeight: 700, textAlign: 'center' }}>{opt.label}</span>
              </button>
            ))}
          </div>
        </div>
      ) : (
        <div key={step} className="onboarding-slide" style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 20, padding: '0 32px', textAlign: 'center' }}>
          <div style={{ width: 168, height: 168, borderRadius: 28, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--mint-soft)' }}>
            {slide.art}
          </div>
          <h1 style={{ margin: 0, fontSize: 19, fontWeight: 800, lineHeight: 1.35 }}>{slide.title}</h1>
          <p style={{ margin: 0, fontSize: 13.5, lineHeight: 1.65, color: 'var(--muted)', maxWidth: 320 }}>{slide.body}</p>
        </div>
      )}

      <div style={{ display: 'flex', justifyContent: 'center', gap: 6, paddingBottom: 20 }}>
        {Array.from({ length: TOTAL_STEPS }).map((_, i) => (
          <button
            key={i}
            onClick={() => setStep(i)}
            aria-label={`Slide ${i + 1} dari ${TOTAL_STEPS}`}
            aria-current={i === step}
            style={{ width: i === step ? 20 : 6, height: 6, padding: 0, border: 'none', borderRadius: 999, background: i === step ? 'var(--primary)' : 'var(--border)', transition: 'width var(--dur-2) var(--ease)', cursor: 'pointer' }}
          />
        ))}
      </div>

      {!isInterestStep && (
        <div style={{ padding: '0 24px calc(24px + env(safe-area-inset-bottom))' }}>
          <button className="btn" onClick={() => setStep((s) => s + 1)}>
            Lanjut
          </button>
        </div>
      )}
    </div>,
    document.body
  );
}
