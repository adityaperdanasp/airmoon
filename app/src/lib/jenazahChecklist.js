// Checklist Perlengkapan Jenazah — localStorage-only (per-device scratch
// list, same shape as the Umroh Checklist pattern), supaya keluarga yang
// mendadak harus siapkan semua bisa centang apa yang udah ada.
const STORAGE_KEY = 'airmoon-jenazah-checklist';
const PROGRESS_KEY = 'airmoon-jenazah-step-progress';

export const JENAZAH_CHECKLIST_GROUPS = [
  {
    title: 'Perlengkapan Memandikan',
    items: [
      'Air bersih secukupnya',
      'Sabun / sampo',
      'Daun bidara (atau sabun kalau tidak ada)',
      'Kapur barus',
      'Sarung tangan',
      'Handuk / kain pengering',
      'Kapas',
      'Meja / dipan memandikan',
      'Gayung',
    ],
  },
  {
    title: 'Kain Kafan & Pengikat',
    items: [
      'Kain kafan putih (3 lapis pria / 5 lapis wanita)',
      'Tali pengikat kafan',
      'Kapas tambahan untuk menyumbat',
      'Wewangian (kapur barus / minyak wangi non-alkohol)',
    ],
  },
  {
    title: 'Sholat & Penguburan',
    items: [
      'Tempat sholat jenazah (masjid / rumah duka)',
      'Keranda / tandu jenazah',
      'Alat gali kubur',
      'Papan / bambu penutup liang lahat',
    ],
  },
  {
    title: 'Administrasi',
    items: [
      'Surat kematian dari RS / kelurahan',
      'Kartu identitas jenazah',
      'Kontak penggali kubur / DKM setempat',
    ],
  },
];

export function loadJenazahChecklist() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY));
    return saved && typeof saved === 'object' ? saved : {};
  } catch {
    return {};
  }
}

export function toggleJenazahChecklistItem(key) {
  const current = loadJenazahChecklist();
  const next = { ...current, [key]: !current[key] };
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  } catch {
    // Private browsing / full storage — the toggle just won't persist.
  }
  return next;
}

export function loadJenazahStepProgress() {
  try {
    const saved = JSON.parse(localStorage.getItem(PROGRESS_KEY));
    return saved && typeof saved === 'object' ? saved : {};
  } catch {
    return {};
  }
}

export function toggleJenazahStepDone(stepIndex) {
  const current = loadJenazahStepProgress();
  const next = { ...current, [stepIndex]: !current[stepIndex] };
  try {
    localStorage.setItem(PROGRESS_KEY, JSON.stringify(next));
  } catch {
    // Same best-effort storage as above.
  }
  return next;
}
