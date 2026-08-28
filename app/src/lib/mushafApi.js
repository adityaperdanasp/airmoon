// Real Madani Mushaf page layout — Quran.com's public API (api.quran.com/api/v4,
// free, no key needed) is the only free source found with the actual page/line
// breaks matching the standard 604-page printed Mushaf, not an approximation.
//
// Important: per-word `text` is a private-use-area glyph code meant for
// Quran.com's own proprietary Mushaf font (QCF) — a normal font renders it as
// tofu. `text_uthmani` is real Unicode Arabic text and is what's used here,
// rendered with Amiri (already loaded for Arabic elsewhere in this app), which
// supports Uthmani/Quranic script properly.

const BASE = 'https://api.quran.com/api/v4';

export const TOTAL_MUSHAF_PAGES = 604;

let chaptersCache = null;

// Chapter (surah) metadata: Arabic name, Indonesian name, verse count, and
// which Mushaf pages it spans — needed to know when to render a surah-name
// banner / Bismillah while paging through, and whether that surah has one
// at all (At-Tawbah doesn't; Al-Fatihah's own ayah 1 already is one).
export async function fetchChapters() {
  if (chaptersCache) return chaptersCache;
  const res = await fetch(`${BASE}/chapters?language=id`);
  if (!res.ok) throw new Error('Gagal memuat data surat.');
  const json = await res.json();
  chaptersCache = json.chapters;
  return chaptersCache;
}

export async function fetchMushafPage(pageNumber) {
  // `code_v1` (not the ambiguous `text` field — its default encoding shifts
  // depending on which other word_fields are requested, confirmed by
  // testing the same endpoint with/without word_fields=text_uthmani side by
  // side) is the QCF v1 private-use glyph code matching the
  // public/fonts/mushaf/QCF_P*.woff2 fonts.
  const url = `${BASE}/verses/by_page/${pageNumber}?words=true&word_fields=code_v1,text_uthmani&fields=text_uthmani,juz_number`;
  const res = await fetch(url);
  if (!res.ok) throw new Error('Gagal memuat halaman mushaf.');
  const json = await res.json();
  return json.verses; // [{ verse_key, verse_number, juz_number, words: [{ text_uthmani, line_number, char_type_name, position }] }]
}

// Groups a page's words into { lineNumber: [{ word, verseKey, verseNumber, chapterId, isFirstOfSurah }] }
// and separately flags which lines need a surah banner inserted above them.
export function layoutPage(verses) {
  const lines = new Map();
  const surahStarts = []; // { beforeLine, chapterId }

  for (const v of verses) {
    const chapterId = Number(v.verse_key.split(':')[0]);
    if (v.verse_number === 1) {
      const firstLine = Math.min(...v.words.map((w) => w.line_number));
      surahStarts.push({ beforeLine: firstLine, chapterId });
    }
    for (const w of v.words) {
      if (!lines.has(w.line_number)) lines.set(w.line_number, []);
      lines.get(w.line_number).push({ ...w, verseKey: v.verse_key, verseNumber: v.verse_number, chapterId });
    }
  }

  return { lines, surahStarts };
}
