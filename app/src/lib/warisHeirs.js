// Single source of truth for the heirs the Kalkulator Waris UI can set —
// the form, the "no heirs" check, saved scenarios and the quick-sim chips
// all read this instead of 15+ hand-copied useState lines. Field names
// match lib/warisCalc.js's parameters, except `khiPengganti`: a UI-only
// toggle that re-routes the cucu steppers to the optional KHI "ahli waris
// pengganti" path (see toCalcParams).
export const DEFAULT_HEIRS = {
  hasSuami: false, jumlahIstri: 0,
  anakLaki: 0, anakPerempuan: 0,
  cucuLakiDariAnakLaki: 0, cucuPerempuanDariAnakLaki: 0,
  anakLakiMurtad: 0, anakPerempuanMurtad: 0,
  hasAyah: false, hasIbu: false, hasKakek: false, hasNenek: false,
  saudaraLaki: 0, saudaraPerempuan: 0,
  saudaraLakiSeayah: 0, saudaraPerempuanSeayah: 0,
  saudaraLakiSeibu: 0, saudaraPerempuanSeibu: 0,
  anakSaudaraKandung: 0, anakSaudaraSeayah: 0,
  pamanKandung: 0, pamanSeayah: 0, anakPamanKandung: 0, anakPamanSeayah: 0,
  khiPengganti: false,
};

// Grouped the way the book groups kinship (jalur nasab), so the form
// teaches the structure while you fill it in.
export const HEIR_GROUPS = [
  {
    id: 'pasangan',
    title: 'Pasangan',
    hint: 'Berdiri sendiri, bukan jalur nasab',
    fields: [
      { key: 'hasSuami', label: 'Suami', type: 'toggle' },
      { key: 'jumlahIstri', label: 'Istri', type: 'stepper', max: 4 },
    ],
  },
  {
    id: 'keturunan',
    title: 'Keturunan',
    hint: 'Bunuwwah — jalur paling utama',
    fields: [
      { key: 'anakLaki', label: 'Anak Laki-laki', type: 'stepper' },
      { key: 'anakPerempuan', label: 'Anak Perempuan', type: 'stepper' },
      { key: 'cucuLakiDariAnakLaki', label: 'Cucu Laki-laki (dari anak laki-laki)', type: 'stepper' },
      { key: 'cucuPerempuanDariAnakLaki', label: 'Cucu Perempuan (dari anak laki-laki)', type: 'stepper' },
      { key: 'anakLakiMurtad', label: 'Anak Laki-laki Murtad', type: 'stepper' },
      { key: 'anakPerempuanMurtad', label: 'Anak Perempuan Murtad', type: 'stepper' },
    ],
  },
  {
    id: 'ortu',
    title: 'Orang Tua & Leluhur',
    hint: 'Ubuwwah — jalur atas',
    fields: [
      { key: 'hasAyah', label: 'Ayah', type: 'toggle' },
      { key: 'hasIbu', label: 'Ibu', type: 'toggle' },
      { key: 'hasKakek', label: 'Kakek (ayah dari ayah)', type: 'toggle' },
      { key: 'hasNenek', label: 'Nenek', type: 'toggle' },
    ],
  },
  {
    id: 'saudara',
    title: 'Saudara',
    hint: 'Ukhuwwah — kandung, seayah, seibu',
    fields: [
      { key: 'saudaraLaki', label: 'Saudara Laki-laki Kandung', type: 'stepper' },
      { key: 'saudaraPerempuan', label: 'Saudara Perempuan Kandung', type: 'stepper' },
      { key: 'saudaraLakiSeayah', label: 'Saudara Laki-laki Seayah', type: 'stepper' },
      { key: 'saudaraPerempuanSeayah', label: 'Saudara Perempuan Seayah', type: 'stepper' },
      { key: 'saudaraLakiSeibu', label: 'Saudara Laki-laki Seibu', type: 'stepper' },
      { key: 'saudaraPerempuanSeibu', label: 'Saudara Perempuan Seibu', type: 'stepper' },
    ],
  },
  {
    id: 'jauh',
    title: 'Kerabat Jauh (Ashabah)',
    hint: 'Umuumah — baru dapat kalau jalur di atas tidak ada',
    collapsed: true,
    fields: [
      { key: 'anakSaudaraKandung', label: 'Anak Laki-laki Saudara Kandung', type: 'stepper' },
      { key: 'anakSaudaraSeayah', label: 'Anak Laki-laki Saudara Seayah', type: 'stepper' },
      { key: 'pamanKandung', label: 'Paman Kandung (saudara ayah)', type: 'stepper' },
      { key: 'pamanSeayah', label: 'Paman Seayah (saudara ayah)', type: 'stepper' },
      { key: 'anakPamanKandung', label: 'Anak Laki-laki Paman Kandung', type: 'stepper' },
      { key: 'anakPamanSeayah', label: 'Anak Laki-laki Paman Seayah', type: 'stepper' },
    ],
  },
];

const HEIR_FIELD_KEYS = HEIR_GROUPS.flatMap((g) => g.fields.map((f) => f.key));
// Murtad children never inherit, so they don't count as "an heir was chosen".
const NON_HEIR_KEYS = new Set(['anakLakiMurtad', 'anakPerempuanMurtad']);

export function hasAnyHeir(heirs) {
  return HEIR_FIELD_KEYS.some((k) => !NON_HEIR_KEYS.has(k) && Boolean(heirs[k]));
}

// UI state -> lib/warisCalc.js params. With khiPengganti on, the cucu
// steppers stand in for ONE deceased anak laki-laki (KHI), via the
// engine's separate pengganti path; off, they are classical cucu.
export function toCalcParams(heirs) {
  const { khiPengganti, ...rest } = heirs;
  if (khiPengganti) {
    return {
      ...rest,
      cucuLakiDariAnakLaki: 0,
      cucuPerempuanDariAnakLaki: 0,
      anakLakiWafatPengganti: true,
      cucuLakiPengganti: heirs.cucuLakiDariAnakLaki,
      cucuPerempuanPengganti: heirs.cucuPerempuanDariAnakLaki,
    };
  }
  return { ...rest, anakLakiWafatPengganti: false };
}

// Saved scenarios come in two shapes: the original flat fields (with
// kakek/nenek/saudara added later, then anakLakiWafatPengganti +
// cucu*Pengganti) and the current heirs object. Both load into heirs;
// anything missing falls back to "not present".
export function normalizeInputs(inputs = {}) {
  const heirs = { ...DEFAULT_HEIRS };
  for (const k of Object.keys(DEFAULT_HEIRS)) {
    if (inputs[k] !== undefined) heirs[k] = inputs[k];
  }
  if (inputs.anakLakiWafatPengganti) {
    heirs.khiPengganti = true;
    heirs.cucuLakiDariAnakLaki = inputs.cucuLakiPengganti ?? 0;
    heirs.cucuPerempuanDariAnakLaki = inputs.cucuPerempuanPengganti ?? 0;
  }
  return heirs;
}
