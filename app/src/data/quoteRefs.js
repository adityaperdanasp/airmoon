// 100 real Qur'an verse references (surah:ayat), the opening ayat of surahs
// 15 through 114 — every one is a guaranteed-valid coordinate (every surah
// has at least a few ayat), so the actual Arabic/translation text is always
// fetched live from Quran.com and never hand-typed/fabricated. Rotated one
// per day in KutipanInspirasi.jsx.
export const QUOTE_REFS = Array.from({ length: 100 }, (_, i) => ({
  surah: i + 15,
  ayat: 1,
}));
