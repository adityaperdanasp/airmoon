export const NISAB_GOLD_GRAMS = 85;

export function calcZakatPenghasilan(incomePerMonth, basicNeedsPerMonth) {
  const net = Math.max(0, incomePerMonth - basicNeedsPerMonth);
  return Math.round(net * 0.025);
}

export function calcZakatMaal(totalAssets, goldPricePerGram) {
  const nisab = NISAB_GOLD_GRAMS * goldPricePerGram;
  if (totalAssets < nisab) return 0;
  return Math.round(totalAssets * 0.025);
}

export function calcZakatFitrah(riceKgPerPerson, ricePricePerKg, jumlahJiwa) {
  return Math.round(riceKgPerPerson * ricePricePerKg * jumlahJiwa);
}

// Zakat Perusahaan/Korporat (2026-09-12) — treated as zakat maal applied
// to net current assets (kas + piutang lancar + persediaan, dikurangi
// utang jangka pendek), the most common fiqh muamalah approach (metode
// aktiva bersih) and the same 2.5% nisab-gated rate as zakat maal
// individual. This is a rough self-service estimate only — the actual
// page pairs it with a lead-gen consult form since real corporate zakat
// needs a proper akuntan/consultant to look at the full neraca.
export function calcZakatKorporat(currentAssets, shortTermLiabilities, goldPricePerGram) {
  const net = Math.max(0, currentAssets - shortTermLiabilities);
  const nisab = NISAB_GOLD_GRAMS * goldPricePerGram;
  if (net < nisab) return 0;
  return Math.round(net * 0.025);
}

export function formatRupiah(n) {
  return 'Rp ' + Math.round(n).toLocaleString('id-ID');
}
