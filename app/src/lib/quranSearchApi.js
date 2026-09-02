// Full-text ayat search — SurahList.jsx's own search box only filters the
// 114 surah names/meanings locally, there was never a way to search inside
// the actual ayat text. Quran.com's public search API (api.quran.com/api/v4,
// same host lib/mushafApi.js/lib/quotesApi.js/lib/wordGlossApi.js already
// use — free, no key) covers both Arabic and translation text, confirmed
// live by a direct query.
const BASE = 'https://api.quran.com/api/v4';

// resource_id 33 = "Indonesian Islamic affairs ministry" (Kemenag) — the
// same translation source lib/quotesApi.js already standardized on for
// Indonesian text elsewhere in this app.
const KEMENAG_ID = 33;

function stripHighlightTags(html) {
  // The API wraps matched keywords in <em>...</em> for UI-level emphasis;
  // this app shows results as plain text, so just drop the tags rather
  // than rendering raw markup or building emphasis styling for it.
  return html.replace(/<\/?em>/g, '');
}

export async function searchQuran(keyword, { size = 20 } = {}) {
  const q = keyword.trim();
  if (!q) return [];
  const res = await fetch(`${BASE}/search?q=${encodeURIComponent(q)}&language=id&size=${size}`);
  if (!res.ok) throw new Error('Gagal mencari ayat.');
  const json = await res.json();
  const results = json.search?.results || [];
  return results.map((r) => {
    const [chapter, verse] = r.verse_key.split(':').map(Number);
    const translation = r.translations?.find((t) => t.resource_id === KEMENAG_ID) || r.translations?.[0];
    return {
      verseKey: r.verse_key,
      chapter,
      verse,
      arabic: r.text,
      translation: translation ? stripHighlightTags(translation.text) : '',
    };
  });
}
