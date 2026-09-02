// Per-word Indonesian gloss ("terjemahan per-kata") for Mode Ayat — a
// different, coarser rendering than the full-ayat teksIndonesia already
// shown under each ayat. EQuran.id (this app's main Qur'an source, see
// lib/quranApi.js) has no per-word data at all; Quran.com's public API
// does (api.quran.com/api/v4, same host already used by lib/mushafApi.js
// and lib/quotesApi.js — free, no key), confirmed live by a direct fetch:
// `?words=true&word_fields=text_uthmani&language=id` returns each word's
// own { translation: { text, language_name: 'indonesian' } }.
//
// per_page=300 covers even Al-Baqarah (286 ayat, the longest surah) in a
// single request — checked its own `pagination.total_pages` comes back 1
// at that page size, so there's no need for real pagination here.
const BASE = 'https://api.quran.com/api/v4';

// Fetched lazily per surah (not bundled into fetchSurahDetail) since most
// readers won't turn this mode on every time they open a surah.
export async function fetchWordGloss(chapterNumber) {
  const res = await fetch(
    `${BASE}/verses/by_chapter/${chapterNumber}?words=true&word_fields=text_uthmani&language=id&per_page=300`
  );
  if (!res.ok) throw new Error('Gagal memuat terjemahan per-kata.');
  const json = await res.json();
  const map = {};
  for (const v of json.verses) {
    map[v.verse_number] = v.words
      // Quran.com appends one pseudo-"word" per ayat carrying just the
      // ayat-number glyph (char_type_name: 'end') — not a real word to gloss.
      .filter((w) => w.char_type_name === 'word')
      .map((w) => ({ arab: w.text_uthmani, id: w.translation?.text || '' }));
  }
  return map; // { [ayatNumber]: [{ arab, id }, ...] }
}
