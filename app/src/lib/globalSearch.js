// Global search — before this, Home's "search bar" was really just an
// entry point into AskMe ("Tanya Ust. Rewin"), not an actual search; the
// only real content search anywhere was Cari Ayat, scoped to ayat text
// alone. This runs one query across ayat (Quran.com's search API, same as
// lib/quranSearchApi.js), Asmaul Husna (99 names, searched locally — it's
// small static data, no API needed), and Doa Harian (dzikir pagi/petang +
// doaKegiatan titles/translations, also local).
import { searchQuran } from './quranSearchApi';
import { asmaulHusna } from '../data/asmaulHusna';
import { dzikirPagi, dzikirPetang, doaKegiatan } from '../data/doaHarian';

const DOA_SOURCES = [
  ...dzikirPagi.map((d) => ({ ...d, category: 'pagi' })),
  ...dzikirPetang.map((d) => ({ ...d, category: 'petang' })),
  ...doaKegiatan.map((d) => ({ ...d, category: 'kegiatan' })),
];

function searchAsmaulHusna(q) {
  const lower = q.toLowerCase();
  return asmaulHusna.filter((n) => n.latin.toLowerCase().includes(lower) || n.meaning.toLowerCase().includes(lower)).slice(0, 8);
}

function searchDoa(q) {
  const lower = q.toLowerCase();
  return DOA_SOURCES.filter((d) => d.title.toLowerCase().includes(lower) || d.translation.toLowerCase().includes(lower)).slice(0, 8);
}

export async function searchAll(term) {
  const q = term.trim();
  if (!q) return { ayat: [], asmaulHusna: [], doa: [] };

  const asmaulHusnaResults = searchAsmaulHusna(q);
  const doaResults = searchDoa(q);
  let ayatResults = [];
  try {
    ayatResults = await searchQuran(q, { size: 8 });
  } catch {
    // Ayat search failing (offline, API hiccup) shouldn't hide the two
    // local result sets above, which never needed a network call at all.
  }

  return { ayat: ayatResults, asmaulHusna: asmaulHusnaResults, doa: doaResults };
}
