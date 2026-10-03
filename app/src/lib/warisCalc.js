// Kalkulator Waris (Ilmu Faraidh). Rewritten 2026-10-03 to follow, row by
// row, the "Ahli Waris / Porsi / Syarat (jika ada, jika tidak ada)"
// tables from the Taklim Cipete handout and the book "Semua Bisa Ilmu
// Waris (Dasar)" that the founder supplied — those tables are the spec.
//
// Heirs covered: suami, istri, anak (L/P), cucu dari anak laki-laki
// (L/P), ayah, ibu, kakek, nenek, saudara kandung / seayah / seibu
// (L/P each), and the remote 'ashabah (anak saudara kandung/seayah,
// paman kandung/seayah, anak paman kandung/seayah). Not covered: mu'tiq
// (yang memerdekakan budak — no practical case today), dzawil arham,
// cucu dari anak PEREMPUAN (bukan ahli waris), anak murtad / pembunuh /
// beda agama (terhalang, shown as Rp 0), wasiat and utang (handled in
// KalkulatorWaris.jsx before totalHarta reaches here).
//
// Vocabulary used below, same as the tables:
//   Keturunan        = anak + cucu dari anak laki-laki
//   Keturunan (lk)   = anak laki-laki / cucu laki-laki dari anak laki-laki
//   Orang tua (lk)   = ayah / kakek
//   Ikhwah           = saudara/i (kandung, seayah, seibu — any mix)
//   Mahjub           = terhalang, fraction 0 (rendered as a "Mahjub" row)
//
// Flow: (1) fixed fardh shares, (2) the single 'ashabah taker for the
// residue, picked in the classical order — anak > cucu > ayah > kakek >
// saudara kandung > saudara seayah > anak saudara > paman > anak paman,
// (3) 'aul if fardh alone exceeds 1, (4) radd if nobody absorbs a
// shortfall (never to suami/istri).
//
// Two documented simplifications:
// - Kakek blocks saudara (like ayah) — the table's "Orang tua (lk)"
//   row, i.e. the Hanafi/Hanbali-style view, not muqasamah.
// - Mushtarakah (suami + ibu + 2 saudara seibu + saudara kandung with no
//   residue) follows the table: saudara kandung get nothing, flagged
//   with a 'musytarakah' note because the schools differ there.
//
// "Ahli waris pengganti" (KHI, one deceased anak laki-laki replaced by
// his own children) is a separate, optional path via anakLakiWafat-
// Pengganti/cucu*Pengganti, unrelated to the classical cucu fields.
export function calcWaris(input) {
  const {
    hasSuami = false, jumlahIstri = 0,
    anakLaki = 0, anakPerempuan = 0,
    cucuLakiDariAnakLaki = 0, cucuPerempuanDariAnakLaki = 0,
    hasAyah = false, hasIbu = false, hasKakek = false, hasNenek = false,
    saudaraLaki = 0, saudaraPerempuan = 0,
    saudaraLakiSeayah = 0, saudaraPerempuanSeayah = 0,
    saudaraLakiSeibu = 0, saudaraPerempuanSeibu = 0,
    anakSaudaraKandung = 0, anakSaudaraSeayah = 0,
    pamanKandung = 0, pamanSeayah = 0, anakPamanKandung = 0, anakPamanSeayah = 0,
    anakLakiWafatPengganti = false, cucuLakiPengganti = 0, cucuPerempuanPengganti = 0,
    anakLakiMurtad = 0, anakPerempuanMurtad = 0,
    totalHarta,
  } = input;

  const hasPengganti = anakLakiWafatPengganti && cucuLakiPengganti + cucuPerempuanPengganti > 0;
  const sonAlive = anakLaki > 0;

  // Classical cucu only inherit when no anak laki-laki and no KHI slot.
  const cucuActive = !sonAlive && !hasPengganti;
  const cucuL = cucuActive ? cucuLakiDariAnakLaki : 0;
  const cucuP = cucuActive ? cucuPerempuanDariAnakLaki : 0;
  const cucuPMahjubByDaughters = cucuP > 0 && cucuL === 0 && anakPerempuan >= 2;

  const keturunanLaki = sonAlive || cucuL > 0 || hasPengganti;
  const keturunanPr = anakPerempuan > 0 || cucuP > 0;
  const keturunanAny = keturunanLaki || keturunanPr;

  const effKakek = hasKakek && !hasAyah;
  const ascMale = hasAyah || hasKakek; // "Orang tua (lk)"
  const effNenek = hasNenek && !hasIbu;

  const ikhwah =
    saudaraLaki + saudaraPerempuan + saudaraLakiSeayah + saudaraPerempuanSeayah + saudaraLakiSeibu + saudaraPerempuanSeibu;
  const seibuCount = saudaraLakiSeibu + saudaraPerempuanSeibu;

  // --- Mahjub per group (also used to hide a blocked group from fardh) ---
  const kandungBlocked = keturunanLaki || ascMale;
  const kandungMaalGhair = saudaraLaki === 0 && saudaraPerempuan > 0 && keturunanPr && !kandungBlocked;
  const seayahBlocked =
    keturunanLaki || ascMale || saudaraLaki > 0 || (saudaraPerempuan > 0 && keturunanPr);
  const seayahSistersBlocked = !seayahBlocked && saudaraLakiSeayah === 0 && saudaraPerempuan >= 2 && !keturunanAny;
  const seibuBlocked = keturunanAny || ascMale;

  // --- 1. Fixed (fardh) shares, as fractions of the WHOLE estate ---
  const fixed = {};
  if (hasSuami) fixed.suami = keturunanAny ? 1 / 4 : 1 / 2;
  if (jumlahIstri > 0) fixed.istri = keturunanAny ? 1 / 8 : 1 / 4;
  const spouseFrac = (fixed.suami || 0) + (fixed.istri || 0);

  if (hasIbu) {
    if (keturunanAny || ikhwah >= 2) fixed.ibu = 1 / 6; // hijab nuqsan
    else if (hasAyah && spouseFrac > 0) fixed.ibu = (1 - spouseFrac) / 3; // umariyatain
    else fixed.ibu = 1 / 3;
  }
  if (effNenek) fixed.nenek = 1 / 6;
  if (hasAyah && keturunanAny) fixed.ayah = 1 / 6;
  if (effKakek && keturunanAny) fixed.kakek = 1 / 6;

  // Anak perempuan: 1/2 alone, 2/3 for two+, only while there is no son.
  if (anakPerempuan > 0 && !sonAlive && !hasPengganti) {
    fixed.anakPerempuan = anakPerempuan === 1 ? 1 / 2 : 2 / 3;
  }
  // Cucu perempuan dari anak laki-laki.
  if (cucuP > 0 && cucuL === 0 && !cucuPMahjubByDaughters) {
    if (anakPerempuan === 0) fixed.cucuPerempuan = cucuP === 1 ? 1 / 2 : 2 / 3;
    else if (anakPerempuan === 1) fixed.cucuPerempuan = 1 / 6; // completes 2/3
  }
  // Saudari kandung fardh: no descendants at all, no ayah/kakek, no brother.
  if (saudaraLaki === 0 && saudaraPerempuan > 0 && !keturunanAny && !ascMale) {
    fixed.saudariKandung = saudaraPerempuan === 1 ? 1 / 2 : 2 / 3;
  }
  // Saudari seayah fardh.
  if (!seayahBlocked && saudaraLakiSeayah === 0 && saudaraPerempuanSeayah > 0) {
    if (saudaraPerempuan === 0) {
      if (!keturunanAny) fixed.saudariSeayah = saudaraPerempuanSeayah === 1 ? 1 / 2 : 2 / 3;
    } else if (saudaraPerempuan === 1 && !keturunanAny) {
      fixed.saudariSeayah = 1 / 6; // completes 2/3 with the one saudari kandung
    }
  }
  // Saudara seibu: 1/6 alone, 1/3 shared equally for two+.
  if (!seibuBlocked && seibuCount > 0) fixed.seibu = seibuCount === 1 ? 1 / 6 : 1 / 3;

  let fixedTotal = Object.values(fixed).reduce((s, v) => s + v, 0);
  const warnings = [];
  if (hasPengganti) warnings.push('ahliWarisPengganti');

  // --- 2. Who takes the residue ('ashabah), classical order ---
  const remoteGroups = [
    ['anakSaudaraKandung', anakSaudaraKandung, 'Anak Laki-laki Saudara Kandung'],
    ['anakSaudaraSeayah', anakSaudaraSeayah, 'Anak Laki-laki Saudara Seayah'],
    ['pamanKandung', pamanKandung, 'Paman Kandung'],
    ['pamanSeayah', pamanSeayah, 'Paman Seayah'],
    ['anakPamanKandung', anakPamanKandung, 'Anak Laki-laki Paman Kandung'],
    ['anakPamanSeayah', anakPamanSeayah, 'Anak Laki-laki Paman Seayah'],
  ];
  const remoteTaker = remoteGroups.find(([, n]) => n > 0);

  let taker = null;
  if (sonAlive || hasPengganti) taker = 'anak';
  else if (cucuL > 0) taker = 'cucu';
  else if (hasAyah) taker = 'ayah';
  else if (effKakek) taker = 'kakek';
  else if (saudaraLaki > 0) taker = 'kandungPool';
  else if (kandungMaalGhair) taker = 'kandungGhair';
  else if (!seayahBlocked && saudaraLakiSeayah > 0) taker = 'seayahPool';
  else if (!seayahBlocked && saudaraPerempuanSeayah > 0 && saudaraPerempuan === 0 && keturunanPr) taker = 'seayahGhair';
  else if (remoteTaker) taker = `remote:${remoteTaker[0]}`;

  // 'Aul — fardh alone exceeds the whole estate: scale proportionally.
  if (fixedTotal > 1.0000001) {
    const scale = 1 / fixedTotal;
    for (const k in fixed) fixed[k] *= scale;
    fixedTotal = 1;
    warnings.push('aul');
  }
  const residue = Math.max(0, 1 - fixedTotal);

  // --- 4. Radd — nobody absorbs a shortfall (never suami/istri) ---
  if (!taker && residue > 0.0000001 && Object.keys(fixed).length > 0) {
    const raddKeys = Object.keys(fixed).filter((k) => k !== 'suami' && k !== 'istri');
    const raddPool = raddKeys.reduce((s, k) => s + fixed[k], 0);
    if (raddPool > 0) {
      for (const k of raddKeys) fixed[k] += residue * (fixed[k] / raddPool);
      warnings.push('radd');
    } else {
      warnings.push('raddNoRecipient');
    }
  }
  const takerShare = taker ? residue : 0;

  if (taker && residue <= 0.0000001) {
    warnings.push('tidakAdaSisa');
    if ((taker === 'kandungPool' || taker === 'kandungGhair') && fixed.seibu) warnings.push('musytarakah');
  }

  // --- Rows ---
  const results = [];
  const addRow = (label, fraction) => results.push({ label, fraction, amount: totalHarta * fraction });
  const addSplit = (base, n, total, suffix = '') => {
    for (let i = 1; i <= n; i++) addRow(n > 1 ? `${base} ${i}${suffix}` : `${base}${suffix}`, total / n);
  };
  // Units pool: weight 2 for males, 1 for females, residue split by unit.
  const addPool = (entries, total) => {
    const units = entries.reduce((s, e) => s + e.n * e.weight, 0);
    const perUnit = units > 0 ? total / units : 0;
    for (const e of entries) addSplit(e.base, e.n, perUnit * e.weight * e.n, '');
  };

  if (fixed.suami) addRow('Suami', fixed.suami);
  if (fixed.istri) addSplit('Istri', jumlahIstri, fixed.istri);
  if (fixed.ibu) addRow('Ibu', fixed.ibu);
  if (fixed.nenek) addRow('Nenek', fixed.nenek);
  if (fixed.ayah) addRow('Ayah (fardh 1/6)', fixed.ayah);
  if (taker === 'ayah' && takerShare > 0) addRow("Ayah ('ashabah)", takerShare);
  if (fixed.kakek) addRow('Kakek (fardh 1/6)', fixed.kakek);
  if (taker === 'kakek' && takerShare > 0) addRow("Kakek ('ashabah)", takerShare);
  if (fixed.anakPerempuan) addSplit('Anak Perempuan', anakPerempuan, fixed.anakPerempuan);
  if (fixed.cucuPerempuan) addSplit('Cucu Perempuan (dari anak lk)', cucuP, fixed.cucuPerempuan);
  if (fixed.saudariKandung) addSplit('Saudara Perempuan Kandung', saudaraPerempuan, fixed.saudariKandung);
  if (fixed.saudariSeayah) addSplit('Saudara Perempuan Seayah', saudaraPerempuanSeayah, fixed.saudariSeayah);
  if (fixed.seibu) {
    const per = fixed.seibu / seibuCount;
    addSplit('Saudara Laki-laki Seibu', saudaraLakiSeibu, per * saudaraLakiSeibu);
    addSplit('Saudara Perempuan Seibu', saudaraPerempuanSeibu, per * saudaraPerempuanSeibu);
  }

  const takerRowsStart = results.length;
  if (taker === 'anak') {
    const unitsPengganti = hasPengganti ? 2 : 0;
    const units = anakLaki * 2 + anakPerempuan + unitsPengganti;
    const perUnit = units > 0 ? takerShare / units : 0;
    addSplit('Anak Laki-laki', anakLaki, perUnit * 2 * anakLaki);
    addSplit('Anak Perempuan', anakPerempuan, perUnit * anakPerempuan);
    if (unitsPengganti > 0) {
      const penggantiPool = perUnit * unitsPengganti;
      const cucuUnits = cucuLakiPengganti * 2 + cucuPerempuanPengganti;
      const perCucuUnit = cucuUnits > 0 ? penggantiPool / cucuUnits : 0;
      addSplit('Cucu Laki-laki (Pengganti)', cucuLakiPengganti, perCucuUnit * 2 * cucuLakiPengganti);
      addSplit('Cucu Perempuan (Pengganti)', cucuPerempuanPengganti, perCucuUnit * cucuPerempuanPengganti);
    }
  } else if (taker === 'cucu') {
    addPool(
      [
        { base: 'Cucu Laki-laki (dari anak lk)', n: cucuL, weight: 2 },
        { base: 'Cucu Perempuan (dari anak lk)', n: cucuP, weight: 1 },
      ],
      takerShare
    );
  } else if (taker === 'kandungPool') {
    addPool(
      [
        { base: 'Saudara Laki-laki Kandung', n: saudaraLaki, weight: 2 },
        { base: 'Saudara Perempuan Kandung', n: saudaraPerempuan, weight: 1 },
      ],
      takerShare
    );
  } else if (taker === 'kandungGhair') {
    addSplit('Saudara Perempuan Kandung', saudaraPerempuan, takerShare, " ('ashabah ma'al ghair)");
  } else if (taker === 'seayahPool') {
    addPool(
      [
        { base: 'Saudara Laki-laki Seayah', n: saudaraLakiSeayah, weight: 2 },
        { base: 'Saudara Perempuan Seayah', n: saudaraPerempuanSeayah, weight: 1 },
      ],
      takerShare
    );
  } else if (taker === 'seayahGhair') {
    addSplit('Saudara Perempuan Seayah', saudaraPerempuanSeayah, takerShare, " ('ashabah ma'al ghair)");
  } else if (taker && taker.startsWith('remote:')) {
    const [, n, label] = remoteGroups.find(([k]) => `remote:${k}` === taker);
    addSplit(label, n, takerShare);
  }

  // A residue taker that ends up with nothing (fardh used the whole estate,
  // or 'aul) is not mahjub — say so, instead of a bare 0% 'ashabah row.
  if (taker && taker !== 'anak' && taker !== 'ayah' && taker !== 'kakek' && residue <= 0.0000001) {
    for (let i = takerRowsStart; i < results.length; i++) results[i].label += ' (tidak kebagian sisa)';
  }

  // --- Mahjub rows: heirs the user selected that are blocked ---
  const addMahjub = (base, n) => {
    for (let i = 1; i <= n; i++) {
      results.push({ label: `${n > 1 ? `${base} ${i}` : base} (Mahjub — terhalang)`, fraction: 0, amount: 0 });
    }
  };
  if (hasNenek && hasIbu) addMahjub('Nenek', 1);
  if (hasKakek && hasAyah) addMahjub('Kakek', 1);
  if (sonAlive) {
    addMahjub('Cucu Laki-laki (dari anak lk)', cucuLakiDariAnakLaki);
    addMahjub('Cucu Perempuan (dari anak lk)', cucuPerempuanDariAnakLaki);
  } else if (cucuPMahjubByDaughters) {
    addMahjub('Cucu Perempuan (dari anak lk)', cucuP);
  }
  if (kandungBlocked) {
    addMahjub('Saudara Laki-laki Kandung', saudaraLaki);
    addMahjub('Saudara Perempuan Kandung', saudaraPerempuan);
  }
  if (seayahBlocked) {
    addMahjub('Saudara Laki-laki Seayah', saudaraLakiSeayah);
    addMahjub('Saudara Perempuan Seayah', saudaraPerempuanSeayah);
  } else if (seayahSistersBlocked) {
    addMahjub('Saudara Perempuan Seayah', saudaraPerempuanSeayah);
  }
  if (seibuBlocked) {
    addMahjub('Saudara Laki-laki Seibu', saudaraLakiSeibu);
    addMahjub('Saudara Perempuan Seibu', saudaraPerempuanSeibu);
  }
  for (const [key, n, label] of remoteGroups) {
    if (n > 0 && taker !== `remote:${key}`) addMahjub(label, n);
  }

  // --- Anak murtad: terhalang (mani' al-irts), treated as non-existent ---
  if (anakLakiMurtad > 0 || anakPerempuanMurtad > 0) {
    warnings.push('anakMurtad');
    for (let i = 1; i <= anakLakiMurtad; i++) {
      results.push({ label: anakLakiMurtad > 1 ? `Anak Laki-laki ${i} (Murtad — tidak mewarisi)` : 'Anak Laki-laki (Murtad — tidak mewarisi)', fraction: 0, amount: 0 });
    }
    for (let i = 1; i <= anakPerempuanMurtad; i++) {
      results.push({ label: anakPerempuanMurtad > 1 ? `Anak Perempuan ${i} (Murtad — tidak mewarisi)` : 'Anak Perempuan (Murtad — tidak mewarisi)', fraction: 0, amount: 0 });
    }
  }

  if (results.some((r) => r.label.includes('Mahjub'))) warnings.push('mahjub');

  const grandTotal = results.reduce((s, r) => s + r.fraction, 0);
  return { results, warnings, grandTotal };
}
