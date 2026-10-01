// Checklist Dokumen Pengurusan Warisan — localStorage-only (personal
// scratch checklist, same shape as lib/jenazahChecklist.js), biar dokumen
// administratif gak ada yang kelewat sebelum ngurus warisan resmi.
const STORAGE_KEY = 'airmoon-waris-doc-checklist';

export const WARIS_DOC_GROUPS = [
  {
    title: 'Dokumen Kematian',
    items: ['Surat Kematian dari RS/Kelurahan', 'Akta Kematian (Disdukcapil)'],
  },
  {
    title: 'Dokumen Keluarga',
    items: [
      'Kartu Keluarga (KK)',
      'Akta Nikah / Akta Cerai almarhum',
      'Akta Lahir seluruh ahli waris',
      'KTP seluruh ahli waris',
    ],
  },
  {
    title: 'Dokumen Aset',
    items: [
      'Sertifikat tanah/rumah',
      'BPKB & STNK kendaraan',
      'Buku tabungan / rekening bank',
      'Dokumen aset lain (saham, deposito, dll)',
    ],
  },
  {
    title: 'Proses Hukum',
    items: [
      'Surat Keterangan Waris (Kelurahan/Notaris, sesuai golongan)',
      'Fatwa Waris dari Pengadilan Agama (buat yang beragama Islam)',
      'NPWP almarhum (buat lapor pajak warisan kalau perlu)',
    ],
  },
];

export function loadWarisDocChecklist() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY));
    return saved && typeof saved === 'object' ? saved : {};
  } catch {
    return {};
  }
}

export function toggleWarisDocChecklistItem(key) {
  const current = loadWarisDocChecklist();
  const next = { ...current, [key]: !current[key] };
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  } catch {
    // Private browsing / full storage — the toggle just won't persist.
  }
  return next;
}
