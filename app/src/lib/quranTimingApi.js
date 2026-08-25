// Word-by-word highlight sync — needs per-word timestamps tied to one
// specific recording. EQuran.id (lib/quranApi.js, the app's main Qur'an
// text/audio source) only has ayat-level audio with no word timestamps.
// Quran.com's public API (already used elsewhere in this app for daily
// quotes) has a real endpoint for this: chapter_recitations/{reciter}/{surah}
// ?segments=true returns one audio file for the whole surah plus, per verse,
// a segments array of [word_index, start_ms, end_ms] triplets — verified
// live, no API key needed.
//
// Only wired up for reciters that have a clean 1:1 match between EQuran.id's
// 5 reciters and Quran.com's recitation list (checked against Quran.com's
// /resources/recitations): Al-Afasy and As-Sudais. The other 3 EQuran.id
// reciters don't have a Quran.com recitation to borrow timing from, so they
// keep the existing whole-ayat highlight instead of a fake/wrong word sync.
const QC_RECITER_ID = {
  '03': 3, // Abdurrahman As-Sudais
  '05': 7, // Misyari Rasyid Al-Afasy
};

export function hasWordSync(eQuranReciterId) {
  return eQuranReciterId in QC_RECITER_ID;
}

// { audioUrl, verses: { [verseNumber]: { fromMs, toMs, words: [{ index, fromMs, toMs }] } } }
export async function fetchChapterTiming(eQuranReciterId, surahNumber) {
  const qcId = QC_RECITER_ID[eQuranReciterId];
  if (!qcId) return null;

  const res = await fetch(`https://api.quran.com/api/v4/chapter_recitations/${qcId}/${surahNumber}?segments=true`);
  if (!res.ok) throw new Error('Gagal memuat data sinkronisasi kata.');
  const json = await res.json();
  const file = json.audio_file;
  if (!file?.audio_url) throw new Error('Data audio sinkronisasi tidak lengkap.');

  const verses = {};
  for (const t of file.timestamps || []) {
    const verseNumber = Number(t.verse_key.split(':')[1]);
    const words = (t.segments || [])
      .filter((seg) => seg.length === 3)
      .map(([index, fromMs, toMs]) => ({ index, fromMs, toMs }));
    verses[verseNumber] = { fromMs: t.timestamp_from, toMs: t.timestamp_to, words };
  }

  const audioUrl = file.audio_url.startsWith('http') ? file.audio_url : `https://download.quranicaudio.com/qdc/${file.audio_url}`;
  return { audioUrl, verses };
}
