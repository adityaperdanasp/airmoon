// Kalkulator Waris (Ilmu Faraidh) — sengaja dibatasi ke kombinasi ahli
// waris paling umum: Suami, Istri (bisa lebih dari satu), Anak (laki-laki/
// perempuan), Ayah, Ibu. TIDAK mengcover kasus yang lebih kompleks (kakek/
// nenek, saudara kandung, cucu pengganti, wasiat, hutang jenazah, dll) —
// sama seperti disclaimer konten fiqh lain di app ini (lihat data/
// asmaulHusna.js), untuk kasus di luar kombinasi ini WAJIB konsultasi ke
// ahli faraidh/ulama, jangan andalkan angka dari sini begitu saja.
//
// Aturan bagian tetap (fardh) merujuk QS. An-Nisa 11-12 (fiqh mawaris,
// pendapat mayoritas mazhab Sunni):
// - Suami: 1/2 bila tidak ada anak, 1/4 bila ada anak.
// - Istri (gabungan semua istri): 1/4 bila tidak ada anak, 1/8 bila ada
//   anak — dibagi rata ke semua istri.
// - Ibu: 1/3 bila tidak ada anak, 1/6 bila ada anak.
// - Ayah: 1/6 (fardh) bila ada anak; jadi ashabah (sisa) bila tidak ada
//   anak.
// - Anak: sisa harta (ashabah) dibagi laki:perempuan = 2:1. Kalau cuma
//   anak perempuan (tanpa anak laki-laki) dan tanpa ashabah lain yang
//   bersaing, mereka tetap mengambil seluruh sisa (bukan fardh 1/2 atau
//   2/3 klasik) — itu konsisten karena ayah/suami/istri/ibu di atas semua
//   sudah dihitung sebagai fardh terpisah, dan anak di sini selalu berlaku
//   sebagai ashabah terhadap sisanya.
export function calcWaris({ hasSuami, jumlahIstri, anakLaki, anakPerempuan, hasAyah, hasIbu, totalHarta }) {
  const hasAnak = anakLaki > 0 || anakPerempuan > 0;
  const fixed = {}; // heir key -> fraction of the WHOLE estate (istri = combined, split further below)

  if (hasSuami) fixed.suami = hasAnak ? 1 / 4 : 1 / 2;
  if (jumlahIstri > 0) fixed.istri = hasAnak ? 1 / 8 : 1 / 4;
  if (hasIbu) fixed.ibu = hasAnak ? 1 / 6 : 1 / 3;
  if (hasAyah && hasAnak) fixed.ayah = 1 / 6; // only a fixed share when anak exist — otherwise ayah is 'ashabah below

  const fixedTotal = Object.values(fixed).reduce((s, v) => s + v, 0);

  let anakShare = 0;
  let ayahAshabah = 0;
  if (hasAnak) {
    anakShare = Math.max(0, 1 - fixedTotal);
  } else if (hasAyah) {
    ayahAshabah = Math.max(0, 1 - fixedTotal);
  }

  let grandTotal = fixedTotal + anakShare + ayahAshabah;
  const warnings = [];

  // 'Aul — every fardh share is fixed by the Qur'an, but nothing stops a
  // real family's combination from summing to more than the whole estate
  // (e.g. suami + 2 anak perempuan + ibu can exceed 1). Classical fiqh's
  // fix is to scale every fardh share down proportionally so they sum to
  // exactly 1, rather than honoring the fractions literally over 100%.
  if (grandTotal > 1.0000001) {
    const scale = 1 / grandTotal;
    for (const k in fixed) fixed[k] *= scale;
    anakShare *= scale;
    ayahAshabah *= scale;
    grandTotal = 1;
    warnings.push('aul');
  }

  // Radd (pengembalian sisa) — when the fardh shares undershoot 1 and
  // there's no anak/ayah left to absorb the remainder as 'ashabah,
  // classical fiqh redistributes the leftover back proportionally among
  // specific eligible heirs (never suami/istri). That redistribution math
  // isn't implemented here — flagged instead of guessed, since silently
  // leaving the leftover unassigned (or worse, mis-assigning it) would be
  // a real error on a religious/legal calculation, not just a cosmetic one.
  const hasResiduaryHeir = hasAnak || hasAyah;
  if (grandTotal < 0.9999999 && !hasResiduaryHeir && Object.keys(fixed).length > 0) {
    warnings.push('radd');
  }

  const results = [];
  if (fixed.suami) {
    results.push({ label: 'Suami', fraction: fixed.suami, amount: totalHarta * fixed.suami });
  }
  if (fixed.istri) {
    const perIstri = fixed.istri / jumlahIstri;
    for (let i = 1; i <= jumlahIstri; i++) {
      results.push({ label: jumlahIstri > 1 ? `Istri ${i}` : 'Istri', fraction: perIstri, amount: totalHarta * perIstri });
    }
  }
  if (fixed.ibu) {
    results.push({ label: 'Ibu', fraction: fixed.ibu, amount: totalHarta * fixed.ibu });
  }
  if (fixed.ayah) {
    results.push({ label: 'Ayah (fardh 1/6)', fraction: fixed.ayah, amount: totalHarta * fixed.ayah });
  }
  if (ayahAshabah > 0) {
    results.push({ label: "Ayah ('ashabah)", fraction: ayahAshabah, amount: totalHarta * ayahAshabah });
  }
  if (anakShare > 0) {
    const units = anakLaki * 2 + anakPerempuan;
    const perUnit = units > 0 ? anakShare / units : 0;
    for (let i = 1; i <= anakLaki; i++) {
      results.push({ label: anakLaki > 1 ? `Anak Laki-laki ${i}` : 'Anak Laki-laki', fraction: perUnit * 2, amount: totalHarta * perUnit * 2 });
    }
    for (let i = 1; i <= anakPerempuan; i++) {
      results.push({ label: anakPerempuan > 1 ? `Anak Perempuan ${i}` : 'Anak Perempuan', fraction: perUnit, amount: totalHarta * perUnit });
    }
  }

  return { results, warnings, grandTotal };
}
