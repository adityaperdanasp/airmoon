import { describe, it, expect } from 'vitest';
import { STREAK_TIERS, highestTier, nextTierNudge } from './badges';

describe('highestTier', () => {
  it('returns null below the first tier', () => {
    expect(highestTier(2)).toBeNull();
  });

  it('returns the highest tier reached, not the closest', () => {
    expect(highestTier(10)).toEqual(STREAK_TIERS[1]); // 7 hari, not 3 hari
  });

  it('returns the top tier when at or above its threshold', () => {
    expect(highestTier(100)).toEqual(STREAK_TIERS[3]);
    expect(highestTier(500)).toEqual(STREAK_TIERS[3]);
  });
});

describe('nextTierNudge', () => {
  it('counts down to the next unreached tier', () => {
    expect(nextTierNudge(5, STREAK_TIERS, ' hari')).toBe('2 hari lagi menuju 🔥 7 Hari');
  });

  it('returns null once every tier is reached', () => {
    expect(nextTierNudge(1000, STREAK_TIERS, ' hari')).toBeNull();
  });
});
