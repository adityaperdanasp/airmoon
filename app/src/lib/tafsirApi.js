// Tafsir ringkas per ayat — Quran.com's own tafsir API (already used
// elsewhere in this app for Mushaf mode) turns out to carry no Indonesian
// tafsir at all (checked live: `resources/tafsirs` only lists Arabic,
// English, Bengali, Russian, Urdu, and Kurdish). EQuran.id — the same host
// lib/quranApi.js already pulls surah/ayat/audio from — does have one:
// `tafsir/{nomorSurat}` returns the real Kemenag tafsir text per ayat,
// same source as the `teksIndonesia` translation already shown under each
// ayat. Free, no key, confirmed live via curl before wiring this in.
const BASE = 'https://equran.id/api/v2';

// One request per surah gets every ayat's tafsir at once — cached in
// memory per session so re-opening the sheet for a different ayat in the
// same surah (or reopening MushafReader's action sheet) doesn't refetch.
const cache = new Map();

export async function fetchSurahTafsir(nomor) {
  if (cache.has(nomor)) return cache.get(nomor);
  const res = await fetch(`${BASE}/tafsir/${nomor}`);
  if (!res.ok) throw new Error('Gagal memuat tafsir.');
  const json = await res.json();
  const map = {};
  for (const t of json.data.tafsir || []) map[t.ayat] = t.teks;
  cache.set(nomor, map);
  return map;
}
