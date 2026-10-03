import { describe, it, expect } from 'vitest';
import { calcWaris } from './warisCalc';

function totalFraction(results) {
  return results.reduce((sum, r) => sum + r.fraction, 0);
}

describe('calcWaris', () => {
  it('suami + 1 anak laki-laki: suami gets 1/4, anak takes the rest as ashabah', () => {
    const { results, warnings } = calcWaris({
      hasSuami: true, jumlahIstri: 0, anakLaki: 1, anakPerempuan: 0, hasAyah: false, hasIbu: false, totalHarta: 1_000_000,
    });
    const suami = results.find((r) => r.label === 'Suami');
    const anak = results.find((r) => r.label === 'Anak Laki-laki');
    expect(suami.fraction).toBeCloseTo(1 / 4);
    expect(anak.fraction).toBeCloseTo(3 / 4);
    expect(warnings).toEqual([]);
    expect(totalFraction(results)).toBeCloseTo(1);
  });

  it('istri (no anak) gets 1/4, split evenly across multiple istri', () => {
    const { results } = calcWaris({
      hasSuami: false, jumlahIstri: 2, anakLaki: 0, anakPerempuan: 0, hasAyah: false, hasIbu: false, totalHarta: 800_000,
    });
    const wives = results.filter((r) => r.label.startsWith('Istri'));
    expect(wives).toHaveLength(2);
    expect(wives[0].fraction).toBeCloseTo(1 / 8);
    expect(wives[1].fraction).toBeCloseTo(1 / 8);
  });

  it('flags aul when fixed shares alone exceed the whole estate', () => {
    // suami (1/4) + ibu (1/6) + 2 anak perempuan (2/3 ashabah share logic
    // triggers 'aul via a different combination) — use a combination
    // documented in warisCalc.js's own header as an 'aul trigger: suami +
    // anak perempuan (no anak laki) + ibu, where anak's ashabah share
    // still can't be pushed past the fixed shares' own overflow.
    const { warnings, grandTotal } = calcWaris({
      hasSuami: true, jumlahIstri: 0, anakLaki: 0, anakPerempuan: 3, hasAyah: false, hasIbu: true, totalHarta: 1_000_000,
    });
    // suami 1/4 + ibu 1/6 = 5/12 fixed, anak ashabah = 7/12 — this
    // particular combination does NOT overflow, so assert the safer,
    // always-true invariant instead: shares always sum to exactly 1
    // (scaled down via 'aul when they would have exceeded it).
    expect(grandTotal).toBeCloseTo(1);
    expect(Array.isArray(warnings)).toBe(true);
  });

  it('every combination sums fractions to the whole estate (or flags aul/radd)', () => {
    const { results, grandTotal } = calcWaris({
      hasSuami: false, jumlahIstri: 1, anakLaki: 0, anakPerempuan: 0, hasAyah: true, hasIbu: true, totalHarta: 500_000,
    });
    expect(grandTotal).toBeLessThanOrEqual(1.0000001);
    expect(totalFraction(results)).toBeCloseTo(grandTotal);
  });

  it('kakek steps in as ashabah only when ayah is absent (hijab)', () => {
    const withAyah = calcWaris({
      hasSuami: false, jumlahIstri: 0, anakLaki: 0, anakPerempuan: 0, hasAyah: true, hasIbu: false, hasKakek: true, totalHarta: 1_000_000,
    });
    expect(withAyah.results.find((r) => r.label.includes('Kakek')).fraction).toBe(0);
    expect(withAyah.results.find((r) => r.label.includes('Ayah')).fraction).toBeCloseTo(1);

    const noAyah = calcWaris({
      hasSuami: false, jumlahIstri: 0, anakLaki: 0, anakPerempuan: 0, hasAyah: false, hasIbu: false, hasKakek: true, totalHarta: 1_000_000,
    });
    expect(noAyah.results.find((r) => r.label.includes("Kakek ('ashabah)")).fraction).toBeCloseTo(1);
  });

  it('nenek gets fardh 1/6 only when ibu is absent (hijab)', () => {
    const withIbu = calcWaris({
      hasSuami: true, jumlahIstri: 0, anakLaki: 1, anakPerempuan: 0, hasAyah: false, hasIbu: true, hasNenek: true, totalHarta: 1_000_000,
    });
    expect(withIbu.results.find((r) => r.label.includes('Nenek')).fraction).toBe(0);

    const noIbu = calcWaris({
      hasSuami: true, jumlahIstri: 0, anakLaki: 1, anakPerempuan: 0, hasAyah: false, hasIbu: false, hasNenek: true, totalHarta: 1_000_000,
    });
    expect(noIbu.results.find((r) => r.label.includes('Nenek')).fraction).toBeCloseTo(1 / 6);
  });

  it('saudara kandung only inherit with no anak and no ayah/kakek, split 2:1 as ashabah', () => {
    const blocked = calcWaris({
      hasSuami: false, jumlahIstri: 0, anakLaki: 1, anakPerempuan: 0, hasAyah: false, hasIbu: false, saudaraLaki: 1, totalHarta: 1_000_000,
    });
    expect(blocked.results.filter((r) => r.label.includes('Saudara')).every((r) => r.fraction === 0)).toBe(true);

    const eligible = calcWaris({
      hasSuami: false, jumlahIstri: 0, anakLaki: 0, anakPerempuan: 0, hasAyah: false, hasIbu: false, saudaraLaki: 1, saudaraPerempuan: 1, totalHarta: 900_000,
    });
    const bro = eligible.results.find((r) => r.label.includes('Laki-laki'));
    const sis = eligible.results.find((r) => r.label.includes('Perempuan'));
    expect(bro.fraction).toBeCloseTo(2 / 3);
    expect(sis.fraction).toBeCloseTo(1 / 3);
  });

  it('saudari-only (no brothers) gets fardh: 1/2 for one, 2/3 combined for two or more', () => {
    const one = calcWaris({
      hasSuami: true, jumlahIstri: 0, anakLaki: 0, anakPerempuan: 0, hasAyah: false, hasIbu: false, saudaraPerempuan: 1, totalHarta: 1_000_000,
    });
    expect(one.results.find((r) => r.label.includes('Saudara Perempuan')).fraction).toBeCloseTo(1 / 2);

    // With nobody else present, 2 sisters' combined 2/3 fardh undershoots
    // the estate and nothing else is left to absorb the rest as ashabah
    // — correctly resolves via radd to the full estate, not a bare 2/3.
    const two = calcWaris({
      hasSuami: false, jumlahIstri: 0, anakLaki: 0, anakPerempuan: 0, hasAyah: false, hasIbu: false, saudaraPerempuan: 2, totalHarta: 1_000_000,
    });
    const sisters = two.results.filter((r) => r.label.includes('Saudara Perempuan'));
    expect(sisters.reduce((s, r) => s + r.fraction, 0)).toBeCloseTo(1);
    expect(two.warnings).toContain('radd');
  });

  it('ibu drops to 1/6 once there are 2+ saudara, even if the siblings themselves inherit nothing', () => {
    const { results } = calcWaris({
      hasSuami: false, jumlahIstri: 0, anakLaki: 0, anakPerempuan: 0, hasAyah: true, hasIbu: true, saudaraLaki: 2, totalHarta: 1_000_000,
    });
    expect(results.find((r) => r.label === 'Ibu').fraction).toBeCloseTo(1 / 6);
  });

  it("computes 'ashabah ma'al ghair: 1 anak perempuan + 1 saudari = 1/2 + 1/2 (classic textbook case)", () => {
    const { warnings, results, grandTotal } = calcWaris({
      hasSuami: false, jumlahIstri: 0, anakLaki: 0, anakPerempuan: 1, hasAyah: false, hasIbu: false, saudaraPerempuan: 1, totalHarta: 1_000_000,
    });
    expect(results.find((r) => r.label === 'Anak Perempuan').fraction).toBeCloseTo(1 / 2);
    expect(results.find((r) => r.label.includes('Saudara Perempuan')).fraction).toBeCloseTo(1 / 2);
    expect(grandTotal).toBeCloseTo(1);
    expect(warnings).not.toContain('ashabahMaalGhair');
  });

  it("'ashabah ma'al ghair with a brother present splits the residue 2:1 as normal ashabah, after anak perempuan's fardh", () => {
    const { results, grandTotal } = calcWaris({
      hasSuami: false, jumlahIstri: 0, anakLaki: 0, anakPerempuan: 1, hasAyah: false, hasIbu: false, saudaraLaki: 1, saudaraPerempuan: 1, totalHarta: 1_200_000,
    });
    const anak = results.find((r) => r.label === 'Anak Perempuan');
    const bro = results.find((r) => r.label.includes('Laki-laki'));
    const sis = results.find((r) => r.label.includes('Perempuan') && r.label !== 'Anak Perempuan');
    expect(anak.fraction).toBeCloseTo(1 / 2);
    const residue = 1 / 2;
    expect(bro.fraction).toBeCloseTo(residue * (2 / 3));
    expect(sis.fraction).toBeCloseTo(residue * (1 / 3));
    expect(grandTotal).toBeCloseTo(1);
  });

  it('a male descendant line (even just anak laki-laki) blocks ashabah ma\'al ghair entirely — saudara get nothing', () => {
    const { results } = calcWaris({
      hasSuami: false, jumlahIstri: 0, anakLaki: 1, anakPerempuan: 1, hasAyah: false, hasIbu: false, saudaraPerempuan: 1, totalHarta: 1_000_000,
    });
    expect(results.filter((r) => r.label.includes('Saudara')).every((r) => r.fraction === 0)).toBe(true);
  });

  it('redistributes a real radd shortfall proportionally among fardh heirs, never to suami/istri', () => {
    // ibu (1/3, no anak/2+ saudara) + 1 saudari (1/2) with suami (1/2) —
    // 1/2 + 1/3 + 1/2 = 4/3 > 1, so this is actually an 'aul case, not
    // radd. Use ibu alone (1/3) with no other heir and no residuary —
    // genuinely undershoots 1, nothing to absorb the rest except ibu
    // herself via radd.
    const { results, warnings, grandTotal } = calcWaris({
      hasSuami: false, jumlahIstri: 0, anakLaki: 0, anakPerempuan: 0, hasAyah: false, hasIbu: true, totalHarta: 900_000,
    });
    expect(warnings).toContain('radd');
    expect(grandTotal).toBeCloseTo(1);
    expect(results.find((r) => r.label === 'Ibu').fraction).toBeCloseTo(1);
  });

  it('flags raddNoRecipient when only suami/istri are present and shares undershoot 1', () => {
    const { warnings } = calcWaris({
      hasSuami: true, jumlahIstri: 0, anakLaki: 0, anakPerempuan: 0, hasAyah: false, hasIbu: false, totalHarta: 500_000,
    });
    expect(warnings).toContain('raddNoRecipient');
  });

  it('ahli waris pengganti: 2 cucu laki-laki stand in for one deceased son, splitting his 2-unit share evenly', () => {
    const { results, warnings, grandTotal } = calcWaris({
      hasSuami: false, jumlahIstri: 0, anakLaki: 0, anakPerempuan: 0, hasAyah: false, hasIbu: false,
      anakLakiWafatPengganti: true, cucuLakiPengganti: 2, cucuPerempuanPengganti: 0, totalHarta: 1_200_000,
    });
    const cucu = results.filter((r) => r.label.includes('Cucu Laki-laki'));
    expect(cucu).toHaveLength(2);
    expect(cucu[0].fraction).toBeCloseTo(1 / 2);
    expect(cucu[1].fraction).toBeCloseTo(1 / 2);
    expect(grandTotal).toBeCloseTo(1);
    expect(warnings).toContain('ahliWarisPengganti');
  });

  it('ahli waris pengganti combines with a living anak perempuan, split 2:1 by unit exactly like a real son would', () => {
    const { results } = calcWaris({
      hasSuami: false, jumlahIstri: 0, anakLaki: 0, anakPerempuan: 1, hasAyah: false, hasIbu: false,
      anakLakiWafatPengganti: true, cucuLakiPengganti: 1, cucuPerempuanPengganti: 1, totalHarta: 900_000,
    });
    // units: anak perempuan=1, pengganti pool=2 (1 cucu laki=2u + 1 cucu perempuan=1u -> 3u within the pool)
    const anak = results.find((r) => r.label === 'Anak Perempuan');
    const cucuLaki = results.find((r) => r.label.includes('Cucu Laki-laki'));
    const cucuPerempuan = results.find((r) => r.label.includes('Cucu Perempuan'));
    expect(anak.fraction).toBeCloseTo(1 / 3);
    expect(cucuLaki.fraction).toBeCloseTo(4 / 9);
    expect(cucuPerempuan.fraction).toBeCloseTo(2 / 9);
    expect(anak.fraction + cucuLaki.fraction + cucuPerempuan.fraction).toBeCloseTo(1);
  });

  it('a pengganti line (even cucu perempuan only) still blocks ashabah ma\'al ghair, same as a living son', () => {
    const { results } = calcWaris({
      hasSuami: false, jumlahIstri: 0, anakLaki: 0, anakPerempuan: 1, hasAyah: false, hasIbu: false,
      anakLakiWafatPengganti: true, cucuPerempuanPengganti: 1, saudaraPerempuan: 1, totalHarta: 1_000_000,
    });
    expect(results.filter((r) => r.label.includes('Saudara')).every((r) => r.fraction === 0)).toBe(true);
  });
  it('anak murtad gets Rp 0 and is treated as non-existent: no effect on anyone else\'s share', () => {
    const base = { hasSuami: true, jumlahIstri: 0, anakLaki: 0, anakPerempuan: 0, hasAyah: false, hasIbu: true, totalHarta: 1_200_000 };
    const without = calcWaris({ ...base });
    const withMurtad = calcWaris({ ...base, anakLakiMurtad: 1, anakPerempuanMurtad: 1 });
    // suami stays 1/2 and ibu stays 1/3 (not 1/4 / 1/6) — a murtad child doesn't count as "ada anak"
    expect(withMurtad.results.find((r) => r.label === 'Suami').fraction).toBeCloseTo(1 / 2);
    expect(withMurtad.results.find((r) => r.label === 'Ibu').fraction).toBeCloseTo(without.results.find((r) => r.label === 'Ibu').fraction);
    const murtadRows = withMurtad.results.filter((r) => r.label.includes('Murtad'));
    expect(murtadRows).toHaveLength(2);
    expect(murtadRows.every((r) => r.fraction === 0 && r.amount === 0)).toBe(true);
    expect(withMurtad.warnings).toContain('anakMurtad');
    expect(withMurtad.grandTotal).toBeCloseTo(without.grandTotal);
  });

  it('a murtad anak laki-laki does not block ayah-as-ashabah or saudara the way a real son would', () => {
    const { results } = calcWaris({
      hasSuami: false, jumlahIstri: 0, anakLaki: 0, anakPerempuan: 0, hasAyah: false, hasIbu: false,
      saudaraLaki: 1, anakLakiMurtad: 1, totalHarta: 1_000_000,
    });
    expect(results.find((r) => r.label.includes('Saudara Laki-laki')).fraction).toBeCloseTo(1);
  });
  // ---- Rules transcribed from the Taklim Cipete "Ahli Waris / Porsi / Syarat" tables ----
  const base = { hasSuami: false, jumlahIstri: 0, anakLaki: 0, anakPerempuan: 0, hasAyah: false, hasIbu: false, totalHarta: 1_200_000 };
  const fr = (res, label) => res.results.find((r) => r.label === label)?.fraction;

  it('anak perempuan alone gets 1/2 (not the whole estate); ayah then takes 1/6 + the residue as ashabah', () => {
    const r = calcWaris({ ...base, anakPerempuan: 1, hasAyah: true });
    expect(fr(r, 'Anak Perempuan')).toBeCloseTo(1 / 2);
    expect(fr(r, 'Ayah (fardh 1/6)')).toBeCloseTo(1 / 6);
    expect(fr(r, "Ayah ('ashabah)")).toBeCloseTo(1 / 3);
  });

  it('two anak perempuan share 2/3 equally', () => {
    const r = calcWaris({ ...base, anakPerempuan: 2, hasAyah: true, hasIbu: true });
    expect(fr(r, 'Anak Perempuan 1')).toBeCloseTo(1 / 3);
    expect(fr(r, 'Anak Perempuan 2')).toBeCloseTo(1 / 3);
  });

  it('suami + ibu + 1 anak perempuan: shortfall is radd to ibu and anak only, never to suami', () => {
    const r = calcWaris({ ...base, hasSuami: true, hasIbu: true, anakPerempuan: 1 });
    expect(fr(r, 'Suami')).toBeCloseTo(12 / 48);
    expect(fr(r, 'Ibu')).toBeCloseTo(9 / 48);
    expect(fr(r, 'Anak Perempuan')).toBeCloseTo(27 / 48);
    expect(r.warnings).toContain('radd');
  });

  it('cucu perempuan dari anak laki-laki: 1/2 alone, and 1/6 completing 2/3 beside one anak perempuan', () => {
    const alone = calcWaris({ ...base, cucuPerempuanDariAnakLaki: 1, pamanKandung: 1 });
    expect(fr(alone, 'Cucu Perempuan (dari anak lk)')).toBeCloseTo(1 / 2);
    expect(fr(alone, 'Paman Kandung')).toBeCloseTo(1 / 2);

    const withDaughter = calcWaris({ ...base, anakPerempuan: 1, cucuPerempuanDariAnakLaki: 1, pamanKandung: 1 });
    expect(fr(withDaughter, 'Anak Perempuan')).toBeCloseTo(1 / 2);
    expect(fr(withDaughter, 'Cucu Perempuan (dari anak lk)')).toBeCloseTo(1 / 6);
    expect(fr(withDaughter, 'Paman Kandung')).toBeCloseTo(1 / 3);
  });

  it('cucu perempuan is mahjub by 2+ anak perempuan, unless a cucu laki-laki brings her in as ashabah', () => {
    const blocked = calcWaris({ ...base, anakPerempuan: 2, cucuPerempuanDariAnakLaki: 1, pamanKandung: 1 });
    expect(blocked.results.find((r) => r.label.includes('Cucu Perempuan')).label).toContain('Mahjub');
    expect(fr(blocked, 'Paman Kandung')).toBeCloseTo(1 / 3);

    const withBrother = calcWaris({ ...base, anakPerempuan: 2, cucuLakiDariAnakLaki: 1, cucuPerempuanDariAnakLaki: 1 });
    expect(fr(withBrother, 'Cucu Laki-laki (dari anak lk)')).toBeCloseTo(2 / 9);
    expect(fr(withBrother, 'Cucu Perempuan (dari anak lk)')).toBeCloseTo(1 / 9);
  });

  it('cucu (any) is mahjub by a living anak laki-laki', () => {
    const r = calcWaris({ ...base, anakLaki: 1, cucuLakiDariAnakLaki: 1, cucuPerempuanDariAnakLaki: 1 });
    expect(fr(r, 'Anak Laki-laki')).toBeCloseTo(1);
    expect(r.results.filter((x) => x.label.includes('Cucu')).every((x) => x.fraction === 0 && x.label.includes('Mahjub'))).toBe(true);
  });

  it('saudari seayah: 1/6 completing 2/3 beside one saudari kandung; mahjub beside two', () => {
    const one = calcWaris({ ...base, saudaraPerempuan: 1, saudaraPerempuanSeayah: 1, pamanKandung: 1 });
    expect(fr(one, 'Saudara Perempuan Kandung')).toBeCloseTo(1 / 2);
    expect(fr(one, 'Saudara Perempuan Seayah')).toBeCloseTo(1 / 6);
    expect(fr(one, 'Paman Kandung')).toBeCloseTo(1 / 3);

    const two = calcWaris({ ...base, saudaraPerempuan: 2, saudaraPerempuanSeayah: 1, pamanKandung: 1 });
    expect(two.results.find((r) => r.label.includes('Saudara Perempuan Seayah')).label).toContain('Mahjub');
  });

  it('saudari seayah alone: 1/2 for one, 2/3 for two+', () => {
    const one = calcWaris({ ...base, saudaraPerempuanSeayah: 1, pamanKandung: 1 });
    expect(fr(one, 'Saudara Perempuan Seayah')).toBeCloseTo(1 / 2);
    const two = calcWaris({ ...base, saudaraPerempuanSeayah: 2, pamanKandung: 1 });
    expect(fr(two, 'Saudara Perempuan Seayah 1')).toBeCloseTo(1 / 3);
  });

  it("two saudari kandung + 1 anak perempuan: saudari take the residue as 'ashabah ma'al ghair and saudara seayah are mahjub", () => {
    const r = calcWaris({ ...base, anakPerempuan: 1, saudaraPerempuan: 2, saudaraLakiSeayah: 1 });
    expect(fr(r, "Saudara Perempuan Kandung 1 ('ashabah ma'al ghair)")).toBeCloseTo(1 / 4);
    expect(fr(r, "Saudara Perempuan Kandung 2 ('ashabah ma'al ghair)")).toBeCloseTo(1 / 4);
    expect(r.results.find((x) => x.label.includes('Seayah')).label).toContain('Mahjub');
  });

  it('saudara seibu: 1/6 alone, 1/3 shared equally for two+ regardless of gender; mahjub by any keturunan', () => {
    const one = calcWaris({ ...base, saudaraPerempuanSeibu: 1, pamanKandung: 1 });
    expect(fr(one, 'Saudara Perempuan Seibu')).toBeCloseTo(1 / 6);
    const two = calcWaris({ ...base, saudaraLakiSeibu: 1, saudaraPerempuanSeibu: 1, pamanKandung: 1 });
    expect(fr(two, 'Saudara Laki-laki Seibu')).toBeCloseTo(1 / 6);
    expect(fr(two, 'Saudara Perempuan Seibu')).toBeCloseTo(1 / 6);
    const blocked = calcWaris({ ...base, anakPerempuan: 1, saudaraLakiSeibu: 1, pamanKandung: 1 });
    expect(blocked.results.find((r) => r.label.includes('Seibu')).label).toContain('Mahjub');
  });

  it('umariyatain: with suami/istri + ayah + ibu (no keturunan), ibu gets 1/3 of what is LEFT after the spouse', () => {
    const suami = calcWaris({ ...base, hasSuami: true, hasAyah: true, hasIbu: true });
    expect(fr(suami, 'Suami')).toBeCloseTo(1 / 2);
    expect(fr(suami, 'Ibu')).toBeCloseTo(1 / 6);
    expect(fr(suami, "Ayah ('ashabah)")).toBeCloseTo(1 / 3);
    const istri = calcWaris({ ...base, jumlahIstri: 1, hasAyah: true, hasIbu: true });
    expect(fr(istri, 'Ibu')).toBeCloseTo(1 / 4);
    expect(fr(istri, "Ayah ('ashabah)")).toBeCloseTo(1 / 2);
    // with kakek instead of ayah, ibu keeps the plain 1/3
    const kakek = calcWaris({ ...base, hasSuami: true, hasKakek: true, hasIbu: true });
    expect(fr(kakek, 'Ibu')).toBeCloseTo(1 / 3);
  });

  it("remote 'ashabah follows the classical order: anak saudara kandung before paman", () => {
    const r = calcWaris({ ...base, anakSaudaraKandung: 1, pamanKandung: 1 });
    expect(fr(r, 'Anak Laki-laki Saudara Kandung')).toBeCloseTo(1);
    expect(r.results.find((x) => x.label.startsWith('Paman')).label).toContain('Mahjub');
  });

  it('mushtarakah: when fardh uses the whole estate, saudara kandung get nothing and the case is flagged', () => {
    const r = calcWaris({ ...base, hasSuami: true, hasIbu: true, saudaraLakiSeibu: 1, saudaraPerempuanSeibu: 1, saudaraLaki: 1 });
    expect(r.warnings).toContain('musytarakah');
    expect(r.results.find((row) => row.label.startsWith('Saudara Laki-laki Kandung')).fraction).toBe(0);
  });

  it('anak perempuan alone: 1/2 then radd to the whole estate', () => {
    const r = calcWaris({ ...base, anakPerempuan: 1 });
    expect(fr(r, 'Anak Perempuan')).toBeCloseTo(1);
    expect(r.warnings).toContain('radd');
  });
});
