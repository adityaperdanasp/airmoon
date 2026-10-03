// Kalkulator Estimasi Biaya Pengurusan Jenazah — angka default cuma
// perkiraan kasar (bisa beda jauh antar daerah), bukan harga pasti.
// Setiap item bisa diedit manual sebelum ditotal, karena ini memang
// meant to be a starting point, bukan tabel harga baku.
export const JENAZAH_BUDGET_ITEMS = [
  { key: 'kainKafan', label: 'Kain Kafan', default: 300000 },
  { key: 'perlengkapanMandi', label: 'Perlengkapan Memandikan (sabun, kapur barus, dll)', default: 100000 },
  { key: 'ambulans', label: 'Ambulans Jenazah', default: 500000 },
  { key: 'penggaliKubur', label: 'Jasa Penggalian Kubur', default: 500000 },
  { key: 'lahanMakam', label: 'Lahan Makam (kalau bukan tanah wakaf/keluarga)', default: 1500000 },
];

export function totalJenazahBudget(amounts) {
  return JENAZAH_BUDGET_ITEMS.reduce((sum, item) => sum + (Number(amounts[item.key]) || 0), 0);
}

export function defaultJenazahBudgetAmounts() {
  return JENAZAH_BUDGET_ITEMS.reduce((acc, item) => ({ ...acc, [item.key]: item.default }), {});
}
