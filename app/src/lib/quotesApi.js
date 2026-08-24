import { QUOTE_REFS } from '../data/quoteRefs';

// Quran.com API v4 — public, no key. translations=33 (Kemenag Indonesian),
// 20 (Sahih International English).
export function todaysQuoteIndex() {
  const start = new Date(new Date().getFullYear(), 0, 0);
  const diff = new Date() - start;
  const dayOfYear = Math.floor(diff / 86400000);
  return dayOfYear % QUOTE_REFS.length;
}

export async function fetchQuoteByIndex(index) {
  const ref = QUOTE_REFS[((index % QUOTE_REFS.length) + QUOTE_REFS.length) % QUOTE_REFS.length];
  const key = `${ref.surah}:${ref.ayat}`;
  const res = await fetch(
    `https://api.quran.com/api/v4/verses/by_key/${key}?translations=33,20&fields=text_uthmani`
  );
  if (!res.ok) throw new Error('Gagal memuat kutipan');
  const json = await res.json();
  const v = json.verse;
  const id = v.translations.find((t) => t.resource_id === 33)?.text || '';
  const en = v.translations.find((t) => t.resource_id === 20)?.text || '';
  return {
    arabic: v.text_uthmani,
    id: id.replace(/<[^>]+>/g, ''),
    en: en.replace(/<[^>]+>/g, ''),
    source: `QS. ${key}`,
  };
}
