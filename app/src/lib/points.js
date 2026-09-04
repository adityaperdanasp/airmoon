// Poin & Medali — a lifetime total (lib/amalanHarian.js's fetchTotalPoints,
// summed from every day's Amalan Harian + login-point score, see that
// file's own header) converts into a medal tier so a user can see "how
// far along am I" at a glance instead of just a bare number. Pure/
// stateless tier lookup, same simple highest-tier-reached shape as
// lib/badges.js's own STREAK_TIERS/PUASA_TIERS.
export const POINT_TIERS = [
  { points: 50, tier: 'perunggu', icon: '🥉', label: 'Perunggu' },
  { points: 150, tier: 'perak', icon: '🥈', label: 'Perak' },
  { points: 300, tier: 'emas', icon: '🥇', label: 'Emas' },
  { points: 500, tier: 'platinum', icon: '💎', label: 'Platinum' },
];

export function highestPointTier(points) {
  let earned = null;
  for (const tier of POINT_TIERS) {
    if (points >= tier.points) earned = tier;
  }
  return earned;
}

// The next tier still to reach, or null once Platinum is already earned —
// used to show "N poin lagi menuju Emas" style progress.
export function nextPointTier(points) {
  return POINT_TIERS.find((t) => points < t.points) || null;
}
