// Streak badges — a lightweight reward layer on top of lib/dzikirStreak.js's
// existing best-streak numbers, not a new tracking system. Pure/stateless:
// given a streak length, says which tier (if any) has been earned. Kept
// deliberately simple (4 tiers, no partial progress bar math) matching the
// "sederhana" spirit of the streak feature itself.
export const STREAK_TIERS = [
  { days: 3, icon: '🌱', label: '3 Hari' },
  { days: 7, icon: '🔥', label: '7 Hari' },
  { days: 30, icon: '🏅', label: '30 Hari' },
  { days: 100, icon: '💎', label: '100 Hari' },
];

// Highest tier reached by `days`, or null if none yet (below the first
// tier's threshold).
export function highestTier(days) {
  let earned = null;
  for (const tier of STREAK_TIERS) {
    if (days >= tier.days) earned = tier;
  }
  return earned;
}

// Milestone tiers for lib/puasaSunnahLog.js's lifetime count — a
// COUNT, not a consecutive-day streak (Senin/Kamis/Ayyamul Bidh aren't
// daily habits the way dzikir is, so "days in a row" doesn't apply the
// same way), otherwise the same simple highest-tier-reached idea as
// STREAK_TIERS above.
export const PUASA_TIERS = [
  { count: 10, icon: '🌙', label: '10 Kali' },
  { count: 30, icon: '⭐', label: '30 Kali' },
  { count: 50, icon: '🏅', label: '50 Kali' },
  { count: 100, icon: '💎', label: '100 Kali' },
];

export function highestPuasaTier(count) {
  let earned = null;
  for (const tier of PUASA_TIERS) {
    if (count >= tier.count) earned = tier;
  }
  return earned;
}
