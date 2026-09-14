import { describe, it, expect } from 'vitest';
import { calcZakatPenghasilan, calcZakatMaal, calcZakatFitrah, calcZakatKorporat, formatRupiah } from './zakat';

describe('calcZakatPenghasilan', () => {
  it('takes 2.5% of income above basic needs', () => {
    expect(calcZakatPenghasilan(10_000_000, 4_000_000)).toBe(150_000);
  });

  it('is zero when income does not exceed basic needs', () => {
    expect(calcZakatPenghasilan(3_000_000, 4_000_000)).toBe(0);
  });
});

describe('calcZakatMaal', () => {
  it('is zero below nisab (85 grams of gold)', () => {
    const goldPrice = 1_000_000;
    const nisab = 85 * goldPrice;
    expect(calcZakatMaal(nisab - 1, goldPrice)).toBe(0);
  });

  it('takes 2.5% of assets at or above nisab', () => {
    const goldPrice = 1_000_000;
    const assets = 100_000_000;
    expect(calcZakatMaal(assets, goldPrice)).toBe(Math.round(assets * 0.025));
  });
});

describe('calcZakatFitrah', () => {
  it('multiplies rice kg, price, and jumlah jiwa', () => {
    expect(calcZakatFitrah(2.5, 12_000, 4)).toBe(120_000);
  });
});

describe('calcZakatKorporat', () => {
  it('nets liabilities against assets before the nisab check', () => {
    const goldPrice = 1_000_000;
    const nisab = 85 * goldPrice;
    // Assets alone equal nisab, but liabilities push net assets below it —
    // the whole point of "net current assets" over a raw assets check.
    expect(calcZakatKorporat(nisab, 10_000_000, goldPrice)).toBe(0);
  });

  it('never goes negative when liabilities exceed assets', () => {
    expect(calcZakatKorporat(1_000_000, 5_000_000, 1_000_000)).toBe(0);
  });
});

describe('formatRupiah', () => {
  it('formats with the Rp prefix and Indonesian thousand separators', () => {
    expect(formatRupiah(1_500_000)).toBe('Rp 1.500.000');
  });

  it('rounds non-integer input', () => {
    expect(formatRupiah(999.6)).toBe('Rp 1.000');
  });
});
