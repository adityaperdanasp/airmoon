// Global search — before this, Home's "search bar" was really just an
// entry point into AskMe ("Tanya Ust. Rewin"), not an actual search; the
// only real content search anywhere was Cari Ayat, scoped to ayat text
// alone. This runs one query across ayat (Quran.com's search API, same as
// lib/quranSearchApi.js), Asmaul Husna (99 names, searched locally — it's
// small static data, no API needed), and Doa Harian (dzikir pagi/petang +
// doaKegiatan titles/translations, also local).
import { collection, getDocs } from 'firebase/firestore';
import { db } from './firebase';
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

// Ayat Favorit — the one personal (per-user, Firestore-backed) source in
// an otherwise all-static/all-public search. A plain one-shot `getDocs`
// over the whole favoriteAyat subcollection, not a live listener — this
// runs once per search term, same request shape as searchQuran's own
// one-shot HTTP call, and someone's favorite list is small enough (no
// pagination anywhere else in the app either) that fetching it whole each
// search is cheap.
async function searchFavoriteAyat(uid, q) {
  if (!uid) return [];
  const lower = q.toLowerCase();
  try {
    const snap = await getDocs(collection(db, 'users', uid, 'favoriteAyat'));
    return snap.docs
      .map((d) => ({ id: d.id, ...d.data() }))
      .filter((f) => f.translation?.toLowerCase().includes(lower) || f.arabic?.includes(q) || f.chapterName?.toLowerCase().includes(lower))
      .slice(0, 8);
  } catch {
    return [];
  }
}

export async function searchAll(term, { uid } = {}) {
  const q = term.trim();
  if (!q) return { ayat: [], asmaulHusna: [], doa: [], favoriteAyat: [] };

  const asmaulHusnaResults = searchAsmaulHusna(q);
  const doaResults = searchDoa(q);
  const favoriteAyatResults = await searchFavoriteAyat(uid, q);
  let ayatResults = [];
  try {
    ayatResults = await searchQuran(q, { size: 8 });
  } catch {
    // Ayat search failing (offline, API hiccup) shouldn't hide the other
    // result sets, which don't depend on that same network call.
  }

  return { ayat: ayatResults, asmaulHusna: asmaulHusnaResults, doa: doaResults, favoriteAyat: favoriteAyatResults };
}
