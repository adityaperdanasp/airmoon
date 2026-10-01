// Kalkulator Waris (Ilmu Faraidh) — covers the common combination (Suami,
// Istri, Anak, Ayah, Ibu) plus, as of 2026-10-01, Kakek (ayah dari ayah),
// Nenek (ibu dari ibu), and Saudara Kandung (laki-laki/perempuan). Still
// does NOT cover: saudara seayah/seibu (half-siblings — different fardh
// rules than full siblings), cucu pengganti ahli waris, wasiat, or hutang
// jenazah — same disclaimer stance as the rest of this app's fiqh content
// (see data/asmaulHusna.js): for cases outside this, consult an ahli
// faraidh/ulama, don't rely on these numbers alone.
//
// Aturan bagian tetap (fardh) merujuk QS. An-Nisa 11-12 & 176 (fiqh
// mawaris, pendapat mayoritas mazhab Sunni):
// - Suami: 1/2 bila tidak ada anak, 1/4 bila ada anak.
// - Istri (gabungan semua istri): 1/4 bila tidak ada anak, 1/8 bila ada
//   anak — dibagi rata ke semua istri.
// - Ibu: 1/3 bila tidak ada anak DAN tidak ada 2+ saudara (dari jenis
//   apa pun — "hijab nuqsan", ibu turun ke 1/6 begitu ada 2 saudara atau
//   lebih, meskipun saudara itu sendiri akhirnya tidak kebagian karena
//   terhijab ayah/kakek); 1/6 bila ada anak atau 2+ saudara.
// - Ayah: 1/6 (fardh) bila ada anak; jadi ashabah (sisa) bila tidak ada
//   anak.
// - Kakek (ayah dari ayah): HANYA berlaku kalau ayah sudah tidak ada
//   (terhijab oleh ayah) — perannya sama seperti ayah: fardh 1/6 bila
//   ada anak, 'ashabah bila tidak ada anak. Kakek dari pihak ibu TIDAK
//   termasuk ahli waris dalam fiqih Sunni (dzawil arham), makanya toggle
//   ini secara eksplisit diberi label "Ayah dari Ayah".
// - Nenek (ibu dari ibu): fardh 1/6, HANYA berlaku kalau ibu sudah tidak
//   ada (terhijab oleh ibu). Nenek dari pihak ayah punya aturan hijab
//   yang sedikit beda (terhijab ayah, bukan ibu) — di luar cakupan toggle
//   tunggal ini, makanya labelnya eksplisit "Ibu dari Ibu".
// - Saudara Kandung (laki-laki/perempuan): HANYA berlaku kalau tidak ada
//   anak sama sekali DAN tidak ada ayah/kakek (QS. An-Nisa 176, kasus
//   kalalah) — ayah/kakek/anak menghijab saudara kandung sepenuhnya.
//   Kalau ada saudara laki-laki, mereka jadi 'ashabah (sisa, dibagi
//   laki:perempuan = 2:1 dengan saudara perempuan). Kalau cuma saudara
//   perempuan (tanpa saudara laki-laki): 1 orang dapat fardh 1/2, 2 orang
//   atau lebih dapat fardh 2/3 (dibagi rata).
//   PERHATIAN: kalau ada anak perempuan (tanpa anak laki-laki) DAN ada
//   saudara kandung, secara fiqh ada kemungkinan kasus 'ashabah ma'al
//   ghair (saudara perempuan ikut jadi ashabah bersama anak perempuan) —
//   kasus ini TIDAK dihitung di sini (saudara akan tampak tidak dapat
//   bagian), flag peringatan 'ashabahMaalGhair akan muncul, WAJIB
//   konsultasi ke ahli faraidh untuk kasus ini.
// - Anak: sisa harta (ashabah) dibagi laki:perempuan = 2:1. Kalau cuma
//   anak perempuan (tanpa anak laki-laki) dan tanpa ashabah lain yang
//   bersaing, mereka tetap mengambil seluruh sisa (bukan fardh 1/2 atau
//   2/3 klasik) — itu konsisten karena ayah/suami/istri/ibu di atas semua
//   sudah dihitung sebagai fardh terpisah, dan anak di sini selalu berlaku
//   sebagai ashabah terhadap sisanya.
export function calcWaris({
  hasSuami, jumlahIstri, anakLaki, anakPerempuan, hasAyah, hasIbu,
  hasKakek = false, hasNenek = false, saudaraLaki = 0, saudaraPerempuan = 0,
  totalHarta,
}) {
  const hasAnak = anakLaki > 0 || anakPerempuan > 0;
  const effectiveAyah = hasAyah;
  const effectiveKakek = hasKakek && !hasAyah; // kakek terhijab oleh ayah
  const effectiveNenek = hasNenek && !hasIbu; // nenek (ibu dari ibu) terhijab oleh ibu
  const hasAscendantMale = effectiveAyah || effectiveKakek;

  const siblingsCount = saudaraLaki + saudaraPerempuan;
  // Saudara kandung cuma berhak waris kalau tidak ada anak sama sekali
  // DAN tidak ada ayah/kakek yang menghijab (QS. An-Nisa 176).
  const siblingsEligible = !hasAnak && !hasAscendantMale && siblingsCount > 0;

  const fixed = {}; // heir key -> fraction of the WHOLE estate (istri = combined, split further below)

  if (hasSuami) fixed.suami = hasAnak ? 1 / 4 : 1 / 2;
  if (jumlahIstri > 0) fixed.istri = hasAnak ? 1 / 8 : 1 / 4;
  // Hijab nuqsan: ibu turun ke 1/6 begitu ada anak ATAU 2+ saudara —
  // berlaku berdasarkan keberadaan saudara, bukan apakah saudara itu
  // sendiri akhirnya kebagian warisan.
  if (hasIbu) fixed.ibu = (hasAnak || siblingsCount >= 2) ? 1 / 6 : 1 / 3;
  if (effectiveNenek) fixed.nenek = 1 / 6;
  if (effectiveAyah && hasAnak) fixed.ayah = 1 / 6; // only a fixed share when anak exist — otherwise ayah is 'ashabah below
  if (effectiveKakek && hasAnak) fixed.kakek = 1 / 6; // same role as ayah, only when ayah absent

  let saudariFardh = 0;
  if (siblingsEligible && saudaraLaki === 0) {
    // Cuma saudara perempuan (tanpa saudara laki-laki): fardh, bukan ashabah.
    saudariFardh = saudaraPerempuan === 1 ? 1 / 2 : 2 / 3;
    fixed.saudari = saudariFardh;
  }

  const fixedTotal = Object.values(fixed).reduce((s, v) => s + v, 0);

  let anakShare = 0;
  let ayahAshabah = 0;
  let kakekAshabah = 0;
  let siblingAshabah = 0;
  if (hasAnak) {
    anakShare = Math.max(0, 1 - fixedTotal);
  } else if (effectiveAyah) {
    ayahAshabah = Math.max(0, 1 - fixedTotal);
  } else if (effectiveKakek) {
    kakekAshabah = Math.max(0, 1 - fixedTotal);
  } else if (siblingsEligible && saudaraLaki > 0) {
    siblingAshabah = Math.max(0, 1 - fixedTotal);
  }

  let grandTotal = fixedTotal + anakShare + ayahAshabah + kakekAshabah + siblingAshabah;
  const warnings = [];

  // Kemungkinan 'ashabah ma'al ghair yang tidak dihitung di sini: anak
  // perempuan (tanpa anak laki-laki) + saudara kandung, tanpa
  // ayah/kakek. Saudara di skenario ini TIDAK dihitung dapat bagian oleh
  // kode di atas (siblingsEligible = false karena hasAnak true) —
  // tandai dengan jelas, jangan biarkan diam-diam tampak "tidak dapat".
  if (hasAnak && anakLaki === 0 && anakPerempuan > 0 && !hasAscendantMale && siblingsCount > 0) {
    warnings.push('ashabahMaalGhair');
  }

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
    kakekAshabah *= scale;
    siblingAshabah *= scale;
    grandTotal = 1;
    warnings.push('aul');
  }

  // Radd (pengembalian sisa) — when the fardh shares undershoot 1 and
  // there's no residuary heir (anak/ayah/kakek/saudara-as-ashabah) left
  // to absorb the remainder, classical fiqh redistributes the leftover
  // proportionally among the fardh heirs present EXCEPT suami/istri
  // (spouse shares are always fixed, never grow via radd — majority
  // view). Distributed in proportion to each eligible heir's own
  // existing fardh fraction.
  const hasResiduaryHeir = hasAnak || ayahAshabah > 0 || kakekAshabah > 0 || siblingAshabah > 0;
  if (grandTotal < 0.9999999 && !hasResiduaryHeir && Object.keys(fixed).length > 0) {
    const raddKeys = Object.keys(fixed).filter((k) => k !== 'suami' && k !== 'istri');
    const raddPool = raddKeys.reduce((s, k) => s + fixed[k], 0);
    const shortfall = 1 - grandTotal;
    if (raddPool > 0) {
      for (const k of raddKeys) fixed[k] += shortfall * (fixed[k] / raddPool);
      grandTotal = 1;
      warnings.push('radd');
    } else {
      // Shortfall exists but only suami/istri are present (no blood-
      // relative fardh heir to redistribute to) — a genuinely rare edge
      // case; flag it rather than silently leaving the estate short.
      warnings.push('raddNoRecipient');
    }
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
  if (fixed.nenek) {
    results.push({ label: 'Nenek (Ibu dari Ibu)', fraction: fixed.nenek, amount: totalHarta * fixed.nenek });
  }
  if (fixed.ayah) {
    results.push({ label: 'Ayah (fardh 1/6)', fraction: fixed.ayah, amount: totalHarta * fixed.ayah });
  }
  if (ayahAshabah > 0) {
    results.push({ label: "Ayah ('ashabah)", fraction: ayahAshabah, amount: totalHarta * ayahAshabah });
  }
  if (fixed.kakek) {
    results.push({ label: 'Kakek (fardh 1/6)', fraction: fixed.kakek, amount: totalHarta * fixed.kakek });
  }
  if (kakekAshabah > 0) {
    results.push({ label: "Kakek ('ashabah)", fraction: kakekAshabah, amount: totalHarta * kakekAshabah });
  }
  if (fixed.saudari) {
    const perSaudari = fixed.saudari / saudaraPerempuan;
    for (let i = 1; i <= saudaraPerempuan; i++) {
      results.push({ label: saudaraPerempuan > 1 ? `Saudara Perempuan Kandung ${i}` : 'Saudara Perempuan Kandung', fraction: perSaudari, amount: totalHarta * perSaudari });
    }
  }
  if (siblingAshabah > 0) {
    const units = saudaraLaki * 2 + saudaraPerempuan;
    const perUnit = units > 0 ? siblingAshabah / units : 0;
    for (let i = 1; i <= saudaraLaki; i++) {
      results.push({ label: saudaraLaki > 1 ? `Saudara Laki-laki Kandung ${i}` : 'Saudara Laki-laki Kandung', fraction: perUnit * 2, amount: totalHarta * perUnit * 2 });
    }
    for (let i = 1; i <= saudaraPerempuan; i++) {
      results.push({ label: saudaraPerempuan > 1 ? `Saudara Perempuan Kandung ${i}` : 'Saudara Perempuan Kandung', fraction: perUnit, amount: totalHarta * perUnit });
    }
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
