// Kalkulator Waris (Ilmu Faraidh) — covers the common combination (Suami,
// Istri, Anak, Ayah, Ibu) plus Kakek (ayah dari ayah), Nenek (ibu dari
// ibu), Saudara Kandung (laki-laki/perempuan), and, as of 2026-10-01,
// 'ashabah ma'al ghair (saudara perempuan kandung ikut jadi ashabah
// bersama anak perempuan) and ahli waris pengganti (cucu menggantikan
// posisi SATU anak laki-laki yang wafat lebih dulu). Still does NOT
// cover: saudara seayah/seibu (half-siblings — different fardh rules
// than full siblings), lebih dari satu anak laki-laki yang wafat dengan
// cucu masing-masing berbeda (disederhanakan jadi satu kelompok
// pengganti gabungan), cucu dari anak PEREMPUAN yang wafat (bukan ahli
// waris dalam fiqih Sunni klasik, jadi memang tidak dihitung), wasiat,
// atau hutang jenazah (ditangani di luar fungsi ini, lihat
// KalkulatorWaris.jsx's hutang/wasiat deduction sebelum totalHarta
// dikirim ke sini) — konsultasikan ke ahli faraidh/ulama untuk kasus di
// luar ini.
//
// Aturan bagian tetap (fardh) merujuk QS. An-Nisa 11-12 & 176 (fiqh
// mawaris, pendapat mayoritas mazhab Sunni):
// - Suami: 1/2 bila tidak ada anak, 1/4 bila ada anak.
// - Istri (gabungan semua istri): 1/4 bila tidak ada anak, 1/8 bila ada
//   anak — dibagi rata ke semua istri.
// - Ibu: 1/3 bila tidak ada anak DAN tidak ada 2+ saudara (hijab
//   nuqsan — ibu turun ke 1/6 begitu ada 2 saudara atau lebih, meskipun
//   saudara itu sendiri akhirnya tidak kebagian karena terhijab
//   ayah/kakek); 1/6 bila ada anak atau 2+ saudara.
// - Ayah: 1/6 (fardh) bila ada anak; jadi ashabah (sisa) bila tidak ada
//   anak.
// - Kakek (ayah dari ayah): HANYA berlaku kalau ayah sudah tidak ada
//   (terhijab oleh ayah) — perannya sama seperti ayah. Kakek dari pihak
//   ibu TIDAK termasuk ahli waris (dzawil arham).
// - Nenek (ibu dari ibu): fardh 1/6, HANYA berlaku kalau ibu sudah tidak
//   ada (terhijab oleh ibu).
// - Saudara Kandung: HANYA berlaku kalau tidak ada anak LAKI-LAKI (atau
//   garis pengganti laki-laki, lihat bawah) sama sekali DAN tidak ada
//   ayah/kakek. Kalau ada saudara laki-laki, mereka jadi 'ashabah
//   (dibagi 2:1 dengan saudara perempuan). Kalau cuma saudara perempuan:
//   1 orang fardh 1/2, 2+ orang fardh 2/3 (dibagi rata).
// - 'Ashabah ma'al ghair: kalau yang ada CUMA anak perempuan (tanpa anak
//   laki-laki atau garis pengganti laki-laki) dan tidak ada ayah/kakek,
//   TAPI ada saudara kandung — anak perempuan tetap dapat fardh (1/2
//   untuk 1 orang, 2/3 untuk 2+), dan SISANYA diberikan ke saudara
//   kandung: kalau ada saudara laki-laki, mereka + saudara perempuan
//   jadi 'ashabah (2:1 seperti biasa); kalau cuma saudara perempuan,
//   mereka sendiri jadi 'ashabah ma'al ghair (dibagi rata, bukan fardh
//   1/2 atau 2/3 lagi karena sekarang berperan sebagai ashabah bukan
//   fardh). Ini kasus klasik "anak perempuan + saudari = 1/2 + 1/2".
// - Ahli Waris Pengganti: kalau ada SATU anak laki-laki yang wafat lebih
//   dulu dari pewaris, posisinya (termasuk untuk urusan hijab/fardh
//   pihak lain — dianggap tetap "ada anak laki-laki") bisa digantikan
//   oleh cucunya (laki-laki/perempuan, dibagi 2:1 di antara mereka
//   sendiri) — mengikuti pandangan yang juga dipakai Kompilasi Hukum
//   Islam (KHI) di Indonesia. Kalau ada LEBIH dari satu anak laki-laki
//   yang wafat, kalkulator ini menggabungkan semua cucu pengganti jadi
//   satu kelompok (menerima gabungan 2 unit seperti satu anak laki-laki)
//   — bukan dihitung per garis keturunan masing-masing; flagged lewat
//   warning 'ahliWarisPengganti', bukan dianggap pasti presisi untuk
//   kasus lebih dari satu garis.
// - Anak: sisa harta (ashabah) dibagi laki:perempuan = 2:1 (termasuk
//   kelompok cucu pengganti, yang menerima porsi gabungan setara satu
//   anak laki-laki lalu dibagi lagi 2:1 di antara mereka sendiri). Kalau
//   cuma anak perempuan (tanpa anak laki-laki/pengganti) dan tanpa
//   saudara kandung yang memicu 'ashabah ma'al ghair di atas, mereka
//   tetap mengambil seluruh sisa (bukan fardh 1/2 atau 2/3 klasik) —
//   konsisten karena ayah/suami/istri/ibu di atas semua sudah dihitung
//   sebagai fardh terpisah.
export function calcWaris({
  hasSuami, jumlahIstri, anakLaki, anakPerempuan, hasAyah, hasIbu,
  hasKakek = false, hasNenek = false, saudaraLaki = 0, saudaraPerempuan = 0,
  anakLakiWafatPengganti = false, cucuLakiPengganti = 0, cucuPerempuanPengganti = 0,
  anakLakiMurtad = 0, anakPerempuanMurtad = 0,
  totalHarta,
}) {
  // Anak murtad (keluar dari Islam) terhalang waris — mani' al-irts
  // (beda agama). Menurut pendapat jumhur, ahli waris yang terhalang
  // mani' dianggap TIDAK ADA sama sekali: dia tidak dapat bagian DAN
  // tidak ikut mengubah bagian ahli waris lain (mis. ibu tidak turun
  // ke 1/6, suami tidak turun ke 1/4, ayah tidak jadi fardh, gara-gara
  // dia). Makanya dua param ini sengaja TIDAK dipakai di perhitungan
  // mana pun di bawah — cuma buat ditampilkan sebagai baris Rp 0 +
  // warning 'anakMurtad' di akhir, biar jelas dia memang dihitung
  // terhalang, bukan lupa dimasukkan. Tidak mencakup: cucu dari anak
  // murtad (sama-sama bukan ahli waris kalau garisnya lewat dia —
  // diabaikan), dan harta si murtad sendiri kalau dia yang wafat.
  const hasPenggantiAnak = anakLakiWafatPengganti && (cucuLakiPengganti + cucuPerempuanPengganti) > 0;
  // The pengganti "slot" carries the deceased son's own hijab character
  // regardless of whether his representing children are boys or girls —
  // it's his position being filled, not a fresh male-only check.
  const hasMaleLineage = anakLaki > 0 || hasPenggantiAnak;
  const hasAnak = hasMaleLineage || anakPerempuan > 0;

  const effectiveAyah = hasAyah;
  const effectiveKakek = hasKakek && !hasAyah; // kakek terhijab oleh ayah
  const effectiveNenek = hasNenek && !hasIbu; // nenek (ibu dari ibu) terhijab oleh ibu
  const hasAscendantMale = effectiveAyah || effectiveKakek;

  const siblingsCount = saudaraLaki + saudaraPerempuan;
  // Saudara kandung cuma berhak waris kalau tidak ada anak laki-laki
  // (atau garis pengganti) sama sekali DAN tidak ada ayah/kakek.
  const siblingsEligible = !hasAnak && !hasAscendantMale && siblingsCount > 0;
  // 'Ashabah ma'al ghair: ada anak perempuan (tapi tidak ada garis
  // laki-laki sama sekali) + tidak ada ayah/kakek + ada saudara kandung.
  const onlyDaughtersWithSiblings = hasAnak && !hasMaleLineage && anakPerempuan > 0 && !hasAscendantMale && siblingsCount > 0;

  const fixed = {}; // heir key -> fraction of the WHOLE estate (istri = combined, split further below)

  if (hasSuami) fixed.suami = hasAnak ? 1 / 4 : 1 / 2;
  if (jumlahIstri > 0) fixed.istri = hasAnak ? 1 / 8 : 1 / 4;
  // Hijab nuqsan: ibu turun ke 1/6 begitu ada anak ATAU 2+ saudara.
  if (hasIbu) fixed.ibu = (hasAnak || siblingsCount >= 2) ? 1 / 6 : 1 / 3;
  if (effectiveNenek) fixed.nenek = 1 / 6;
  if (effectiveAyah && hasAnak) fixed.ayah = 1 / 6; // only a fixed share when anak exist — otherwise ayah is 'ashabah below
  if (effectiveKakek && hasAnak) fixed.kakek = 1 / 6; // same role as ayah, only when ayah absent

  if (siblingsEligible && saudaraLaki === 0) {
    // Cuma saudara perempuan, tanpa anak sama sekali: fardh, bukan ashabah.
    fixed.saudari = saudaraPerempuan === 1 ? 1 / 2 : 2 / 3;
  }
  if (onlyDaughtersWithSiblings) {
    // Anak perempuan tetap fardh di sini (bukan ambil semua sisa) —
    // sisanya nanti diberikan ke saudara kandung sebagai 'ashabah
    // ma'al ghair, dihitung setelah fixedTotal di bawah.
    fixed.anakPerempuanFardh = anakPerempuan === 1 ? 1 / 2 : 2 / 3;
  }

  const fixedTotal = Object.values(fixed).reduce((s, v) => s + v, 0);

  let anakShare = 0;
  let ayahAshabah = 0;
  let kakekAshabah = 0;
  let siblingAshabah = 0; // saudara laki-laki + perempuan, 2:1 (dua jalur: saudara-only ATAU 'ashabah ma'al ghair)
  let saudariAshabahGhair = 0; // 'ashabah ma'al ghair, cuma saudara perempuan (tanpa saudara laki-laki)

  if (onlyDaughtersWithSiblings) {
    const residue = Math.max(0, 1 - fixedTotal);
    if (saudaraLaki > 0) siblingAshabah = residue;
    else saudariAshabahGhair = residue;
  } else if (hasAnak) {
    anakShare = Math.max(0, 1 - fixedTotal);
  } else if (effectiveAyah) {
    ayahAshabah = Math.max(0, 1 - fixedTotal);
  } else if (effectiveKakek) {
    kakekAshabah = Math.max(0, 1 - fixedTotal);
  } else if (siblingsEligible && saudaraLaki > 0) {
    siblingAshabah = Math.max(0, 1 - fixedTotal);
  }

  let grandTotal = fixedTotal + anakShare + ayahAshabah + kakekAshabah + siblingAshabah + saudariAshabahGhair;
  const warnings = [];
  if (hasPenggantiAnak) warnings.push('ahliWarisPengganti');

  // 'Aul — every fardh share is fixed by the Qur'an, but nothing stops a
  // real family's combination from summing to more than the whole estate.
  // Classical fiqh's fix is to scale every fardh share down proportionally
  // so they sum to exactly 1, rather than honoring the fractions
  // literally over 100%.
  if (grandTotal > 1.0000001) {
    const scale = 1 / grandTotal;
    for (const k in fixed) fixed[k] *= scale;
    anakShare *= scale;
    ayahAshabah *= scale;
    kakekAshabah *= scale;
    siblingAshabah *= scale;
    saudariAshabahGhair *= scale;
    grandTotal = 1;
    warnings.push('aul');
  }

  // Radd (pengembalian sisa) — when the fardh shares undershoot 1 and
  // there's no residuary heir left to absorb the remainder, classical
  // fiqh redistributes the leftover proportionally among the fardh heirs
  // present EXCEPT suami/istri (spouse shares never grow via radd).
  const hasResiduaryHeir = hasAnak || ayahAshabah > 0 || kakekAshabah > 0 || siblingAshabah > 0 || saudariAshabahGhair > 0;
  if (grandTotal < 0.9999999 && !hasResiduaryHeir && Object.keys(fixed).length > 0) {
    const raddKeys = Object.keys(fixed).filter((k) => k !== 'suami' && k !== 'istri');
    const raddPool = raddKeys.reduce((s, k) => s + fixed[k], 0);
    const shortfall = 1 - grandTotal;
    if (raddPool > 0) {
      for (const k of raddKeys) fixed[k] += shortfall * (fixed[k] / raddPool);
      grandTotal = 1;
      warnings.push('radd');
    } else {
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
  if (fixed.anakPerempuanFardh) {
    const perAnak = fixed.anakPerempuanFardh / anakPerempuan;
    for (let i = 1; i <= anakPerempuan; i++) {
      results.push({ label: anakPerempuan > 1 ? `Anak Perempuan ${i}` : 'Anak Perempuan', fraction: perAnak, amount: totalHarta * perAnak });
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
  if (saudariAshabahGhair > 0) {
    const perSaudari = saudariAshabahGhair / saudaraPerempuan;
    for (let i = 1; i <= saudaraPerempuan; i++) {
      results.push({
        label: saudaraPerempuan > 1 ? `Saudara Perempuan Kandung ${i} ('ashabah ma'al ghair)` : "Saudara Perempuan Kandung ('ashabah ma'al ghair)",
        fraction: perSaudari,
        amount: totalHarta * perSaudari,
      });
    }
  }
  if (anakShare > 0) {
    const unitsPengganti = hasPenggantiAnak ? 2 : 0;
    const units = anakLaki * 2 + anakPerempuan + unitsPengganti;
    const perUnit = units > 0 ? anakShare / units : 0;
    for (let i = 1; i <= anakLaki; i++) {
      results.push({ label: anakLaki > 1 ? `Anak Laki-laki ${i}` : 'Anak Laki-laki', fraction: perUnit * 2, amount: totalHarta * perUnit * 2 });
    }
    for (let i = 1; i <= anakPerempuan; i++) {
      results.push({ label: anakPerempuan > 1 ? `Anak Perempuan ${i}` : 'Anak Perempuan', fraction: perUnit, amount: totalHarta * perUnit });
    }
    if (unitsPengganti > 0) {
      // The pengganti pool (worth exactly one living anak laki-laki's 2
      // units) gets redistributed to the representing cucu themselves,
      // split 2:1 among them the same way any ashabah split works.
      const penggantiPool = perUnit * unitsPengganti;
      const cucuUnits = cucuLakiPengganti * 2 + cucuPerempuanPengganti;
      const perCucuUnit = cucuUnits > 0 ? penggantiPool / cucuUnits : 0;
      for (let i = 1; i <= cucuLakiPengganti; i++) {
        results.push({ label: cucuLakiPengganti > 1 ? `Cucu Laki-laki (Pengganti) ${i}` : 'Cucu Laki-laki (Pengganti)', fraction: perCucuUnit * 2, amount: totalHarta * perCucuUnit * 2 });
      }
      for (let i = 1; i <= cucuPerempuanPengganti; i++) {
        results.push({ label: cucuPerempuanPengganti > 1 ? `Cucu Perempuan (Pengganti) ${i}` : 'Cucu Perempuan (Pengganti)', fraction: perCucuUnit, amount: totalHarta * perCucuUnit });
      }
    }
  }

  if (anakLakiMurtad > 0 || anakPerempuanMurtad > 0) {
    warnings.push('anakMurtad');
    for (let i = 1; i <= anakLakiMurtad; i++) {
      results.push({ label: anakLakiMurtad > 1 ? `Anak Laki-laki ${i} (Murtad — tidak mewarisi)` : 'Anak Laki-laki (Murtad — tidak mewarisi)', fraction: 0, amount: 0 });
    }
    for (let i = 1; i <= anakPerempuanMurtad; i++) {
      results.push({ label: anakPerempuanMurtad > 1 ? `Anak Perempuan ${i} (Murtad — tidak mewarisi)` : 'Anak Perempuan (Murtad — tidak mewarisi)', fraction: 0, amount: 0 });
    }
  }

  return { results, warnings, grandTotal };
}
