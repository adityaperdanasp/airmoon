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
  // public/fonts/mushaf/QCF_P*.woff2 fonts. `text_uthmani_tajweed` is real
  // Unicode text with <rule class=X>...</rule> spans — only used in tajwid
  // mode (see TAJWEED_COLORS below), rendered with a normal font (Amiri)
  // since QCF's glyphs are whole pre-shaped words and can't be recolored
  // per letter.
  const url = `${BASE}/verses/by_page/${pageNumber}?words=true&word_fields=code_v1,text_uthmani,text_uthmani_tajweed&fields=text_uthmani,juz_number`;
  const res = await fetch(url);
  if (!res.ok) throw new Error('Gagal memuat halaman mushaf.');
  const json = await res.json();
  return json.verses; // [{ verse_key, verse_number, juz_number, words: [{ text_uthmani, line_number, char_type_name, position }] }]
}

// Standard tajweed rule colors — matches the legend published at
// alquran.cloud/tajweed-guide for this exact rule taxonomy (same underlying
// dataset Quran.com's API uses; verified the full set of 18 rule classes
// that actually appear by scanning real pages across the Mushaf, not just
// the couple visible in Al-Fatihah). `madda_obligatory_monfasel` isn't
// listed separately there — it's the same "necessary madd" family as
// `madda_obligatory_mottasel` (connected vs. separated across a word
// boundary), just reusing that color. `custom` has no fixed rule/color.
export const TAJWEED_COLORS = {
  ham_wasl: '#AAAAAA',
  slnt: '#AAAAAA',
  laam_shamsiyah: '#AAAAAA',
  madda_normal: '#537FFF',
  madda_permissible: '#4050FF',
  madda_necessary: '#000EBC',
  qalaqah: '#DD0008',
  madda_obligatory_mottasel: '#2144C1',
  madda_obligatory_monfasel: '#2144C1',
  ikhafa_shafawi: '#D500B7',
  ikhafa: '#9400A8',
  idgham_shafawi: '#58B800',
  iqlab: '#26BFFD',
  idgham_ghunnah: '#169777',
  idgham_wo_ghunnah: '#169200',
  idgham_mutajanisayn: '#A1A1A1',
  idgham_mutaqaribayn: '#A1A1A1',
  ghunnah: '#FF7E1E',
};

// Parses the `<rule class=X>...</rule>` markup into plain segments so it can
// be rendered as styled <span>s instead of dangerouslySetInnerHTML — the
// source is a trusted API, but this also lets each segment carry its own
// React key/style cleanly.
export function parseTajweedHtml(html) {
  if (!html) return [];
  // A proper stack-based parse, not a flat regex match: <rule> tags nest
  // (e.g. `<rule class=madda_normal><rule class=custom-alef-maksora>ٰ</rule></rule>`
  // — found by scanning every 7th page across the whole Mushaf, not just a
  // couple of early surahs). A non-nested regex leaves the outer </rule>
  // unmatched and leaks raw tag markup as visible text. Innermost active
  // rule wins for any given span of text. Class names can also contain
  // hyphens ("custom-alef-maksora"), so \w alone isn't enough either.
  const parts = [];
  const tokenRegex = /<rule class=([\w-]+)>|<\/rule>|([^<]+)/g;
  const stack = [];
  let match;
  while ((match = tokenRegex.exec(html))) {
    if (match[1]) {
      stack.push(match[1]);
    } else if (match[0] === '</rule>') {
      stack.pop();
    } else if (match[2]) {
      parts.push({ text: match[2], ruleClass: stack[stack.length - 1] || null });
    }
  }
  return parts;
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
