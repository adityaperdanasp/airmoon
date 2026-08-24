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

export function formatRupiah(n) {
  return 'Rp ' + Math.round(n).toLocaleString('id-ID');
}
