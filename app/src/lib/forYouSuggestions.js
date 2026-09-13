// "Untuk Kamu" (2026-09-13) — Home's Layanan grid already reorders by
// interestTag (reorderSvcByInterest), but that's a fixed 4-tile grid,
// not a place to surface the ~30 features living under Lainnya. This is
// a short row combining the SAME interestTag with recentLainnya.js's
// per-device "recently opened" list, so it's part personalized-by-intent
// and part personalized-by-actual-behavior — two different signals
// already collected elsewhere in this app, just never combined. Reuses
// data/searchablePages.js's plain-text {to,label} index rather than
// Lainnya.jsx's own SECTIONS (which carries JSX icon nodes and
// translation keys this text-only row has no use for).
import { SEARCHABLE_PAGES } from '../data/searchablePages';

const INTEREST_SUGGESTIONS = {
  quran: [{ to: '/quran', label: "Baca Qur'an" }, { to: '/lainnya/ayat-favorit', label: 'Ayat Favorit' }],
  sholat: [{ to: '/jadwal-sholat', label: 'Jadwal Sholat' }, { to: '/lainnya/panduan-sholat', label: 'Panduan Sholat' }],
  donasi: [{ to: '/donasi', label: 'Donasi' }, { to: '/lainnya/zakat-korporat', label: 'Zakat Korporat' }],
  semua: [{ to: '/lainnya/ringkasan-ibadah', label: 'Ringkasan Ibadah' }, { to: '/lainnya/forum', label: 'Tanya Jawab' }],
};

export function getForYouSuggestions(interestTag, recentTos) {
  const recentSuggestions = recentTos
    .map((to) => SEARCHABLE_PAGES.find((p) => p.to === to))
    .filter(Boolean)
    .slice(0, 2);

  const interestPool = INTEREST_SUGGESTIONS[interestTag] || INTEREST_SUGGESTIONS.semua;
  const usedTos = new Set(recentSuggestions.map((s) => s.to));
  const interestSuggestions = interestPool.filter((s) => !usedTos.has(s.to));

  return [...recentSuggestions, ...interestSuggestions].slice(0, 4);
}
