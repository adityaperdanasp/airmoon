import { useState } from 'react';
import { createPortal } from 'react-dom';
import { ArtWelcome, ArtQuran, ArtAdzan, ArtDonation, ArtMore } from './onboardingArt';

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

export default function OnboardingTour({ onFinish }) {
  const [step, setStep] = useState(0);
  const slide = SLIDES[step];
  const isLast = step === SLIDES.length - 1;

  return createPortal(
    <div style={{ position: 'fixed', inset: 0, background: 'var(--bg)', zIndex: 70, display: 'flex', flexDirection: 'column' }}>
      <div style={{ display: 'flex', justifyContent: 'flex-end', padding: 'calc(14px + env(safe-area-inset-top)) 20px 0' }}>
        <button
          onClick={onFinish}
          style={{ background: 'none', border: 'none', color: 'var(--muted)', fontSize: 12.5, fontWeight: 700, cursor: 'pointer', padding: 8 }}
        >
          Lewati
        </button>
      </div>

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 20, padding: '0 32px', textAlign: 'center' }}>
        <div style={{ width: 168, height: 168, borderRadius: 28, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--mint-soft)' }}>
          {slide.art}
        </div>
        <h1 style={{ margin: 0, fontSize: 19, fontWeight: 800, lineHeight: 1.35 }}>{slide.title}</h1>
        <p style={{ margin: 0, fontSize: 13.5, lineHeight: 1.65, color: 'var(--muted)', maxWidth: 320 }}>{slide.body}</p>
      </div>

      <div style={{ display: 'flex', justifyContent: 'center', gap: 6, paddingBottom: 20 }}>
        {SLIDES.map((_, i) => (
          <div
            key={i}
            style={{ width: i === step ? 20 : 6, height: 6, borderRadius: 999, background: i === step ? 'var(--primary)' : 'var(--border)', transition: 'width var(--dur-2) var(--ease)' }}
          />
        ))}
      </div>

      <div style={{ padding: '0 24px calc(24px + env(safe-area-inset-bottom))' }}>
        <button
          className="btn"
          onClick={() => (isLast ? onFinish() : setStep((s) => s + 1))}
        >
          {isLast ? 'Mulai' : 'Lanjut'}
        </button>
      </div>
    </div>,
    document.body
  );
}
