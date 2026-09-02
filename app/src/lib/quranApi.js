const BASE = 'https://equran.id/api/v2';

// EQuran.id v2 — public, no API key needed.
// Reciter ids used by the /surat/{nomor} `audio` map:
export const RECITERS = [
  { id: '01', name: 'Abdullah Al-Juhany' },
  { id: '02', name: 'Abdul Muhsin Al-Qasim' },
  { id: '03', name: 'Abdurrahman As-Sudais' },
  { id: '04', name: 'Ibrahim Al-Dossari' },
  { id: '05', name: 'Misyari Rasyid Al-Afasy' },
];

export async function fetchSurahList() {
  const res = await fetch(`${BASE}/surat`);
  if (!res.ok) throw new Error('Gagal memuat daftar surat');
  const json = await res.json();
  return json.data; // [{ nomor, nama, namaLatin, jumlahAyat, tempatTurun, arti, ... }]
}

export async function fetchSurahDetail(nomor) {
  const res = await fetch(`${BASE}/surat/${nomor}`);
  if (!res.ok) throw new Error('Gagal memuat surat');
  const json = await res.json();
  return json.data; // { nomor, nama, namaLatin, ayat: [{ nomorAyat, teksArab, teksLatin, teksIndonesia, audio }] }
}
