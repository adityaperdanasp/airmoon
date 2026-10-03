import { describe, it, expect } from 'vitest';
import { ibadahLocks } from './ibadahWindows';

const timings = { Fajr: '04:30', Sunrise: '05:45', Dhuhr: '11:55', Asr: '15:10', Maghrib: '17:50', Isha: '19:00' };
const at = (h, m = 0) => {
  const d = new Date();
  d.setHours(h, m, 0, 0);
  return d;
};

describe('ibadahLocks', () => {
  it('locks nothing without prayer times', () => {
    expect(Object.values(ibadahLocks(null, at(23))).some(Boolean)).toBe(false);
  });
  it('mid-morning: only Subuh is over', () => {
    const l = ibadahLocks(timings, at(9));
    expect(l.subuh).toBe(true);
    expect(l.dzuhur || l.ashar || l.maghrib || l.isya || l.dzikirPagi).toBe(false);
  });
  it('after Maghrib adhan: Subuh, Dzuhur, Ashar and dzikir pagi are locked, Maghrib and Isya open', () => {
    const l = ibadahLocks(timings, at(17, 51));
    expect(l).toMatchObject({ subuh: true, dzuhur: true, ashar: true, dzikirPagi: true, maghrib: false, isya: false });
  });
  it('after Isya adhan Maghrib closes, Isya stays open until midnight', () => {
    const l = ibadahLocks(timings, at(22));
    expect(l.maghrib).toBe(true);
    expect(l.isya).toBe(false);
  });
});
