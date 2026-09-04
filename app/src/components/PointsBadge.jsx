import { useEffect, useState } from 'react';
import { fetchTotalPoints } from '../lib/amalanHarian';
import { highestPointTier, nextPointTier } from '../lib/points';
import Confetti from './Confetti';

const CELEBRATED_KEY = 'airmoon-points-tier-celebrated';

// Poin & Medali — a small badge near Home's profile row showing the
// lifetime point total (lib/amalanHarian.js's fetchTotalPoints) and its
// medal tier, so "how am I doing overall" has an answer at a glance
// without opening a separate dashboard. Tap toggles an inline detail row
// (progress to the next tier) rather than navigating anywhere — this is
// meant to be seen in passing, not a destination of its own.
export default function PointsBadge({ uid }) {
  const [points, setPoints] = useState(null);
  const [expanded, setExpanded] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);

  useEffect(() => {
    if (!uid) return;
    fetchTotalPoints(uid).then(setPoints);
  }, [uid]);

  const tier = points != null ? highestPointTier(points) : null;
  const next = points != null ? nextPointTier(points) : null;

  // Celebrates the moment a NEW tier is actually reached, not every time
  // this badge happens to render with an already-earned tier — same
  // localStorage-tracked-highest-celebrated pattern as this app's other
  // badge celebrations (AmalanHarianCard's dzikir badge, Puasa Sunnah's
  // milestone badge).
  useEffect(() => {
    if (!tier) return;
    const lastCelebrated = Number(localStorage.getItem(CELEBRATED_KEY)) || 0;
    if (tier.points > lastCelebrated) {
      localStorage.setItem(CELEBRATED_KEY, String(tier.points));
      setShowConfetti(true);
    }
  }, [tier]);

  if (points === null) return null;

  return (
    <div style={{ position: 'relative' }}>
      {showConfetti && <Confetti onComplete={() => setShowConfetti(false)} />}
      <button
        onClick={() => setExpanded((v) => !v)}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 5,
          padding: '6px 12px',
          borderRadius: 999,
          border: 'none',
          background: 'rgba(255,255,255,0.2)',
          color: '#fff',
          fontSize: 12,
          fontWeight: 700,
          cursor: 'pointer',
        }}
        aria-label={`${points} poin${tier ? ` — tier ${tier.label}` : ''}`}
      >
        <span style={{ fontSize: 14 }}>{tier?.icon || '⭐'}</span>
        {points}
      </button>

      {expanded && (
        <div
          style={{
            position: 'absolute',
            top: 'calc(100% + 8px)',
            right: 0,
            zIndex: 5,
            width: 220,
            padding: 14,
            borderRadius: 14,
            background: 'var(--card)',
            boxShadow: 'var(--shadow-card)',
            display: 'flex',
            flexDirection: 'column',
            gap: 4,
          }}
        >
          <span style={{ fontSize: 13, fontWeight: 800, color: 'var(--ink)' }}>
            {tier ? `${tier.icon} Tier ${tier.label}` : 'Belum ada tier'}
          </span>
          <span style={{ fontSize: 11, color: 'var(--muted)', lineHeight: 1.5 }}>
            {next
              ? `${next.points - points} poin lagi menuju ${next.icon} ${next.label}`
              : 'Tier tertinggi tercapai — Alhamdulillah!'}
          </span>
          <span style={{ fontSize: 10, color: 'var(--muted-soft)', lineHeight: 1.4, marginTop: 4 }}>
            Poin dari checklist Amalan Harian &amp; login harian.
          </span>
        </div>
      )}
    </div>
  );
}
