import { useEffect, useState } from 'react';
import { fetchTotalPoints, fetchRecentAmalanHarian, fetchMonthlyPointsComparison } from '../lib/amalanHarian';
import { highestPointTier, nextPointTier } from '../lib/points';
import { useTheme } from '../context/ThemeContext';
import { usePopAnimation } from '../lib/usePopAnimation';
import { MedalIcon } from './serviceIcons';
import Confetti from './Confetti';
import MedalShareModal from './MedalShareModal';
import PointsDetailSheet from './PointsDetailSheet';

const CELEBRATED_KEY = 'airmoon-points-tier-celebrated';

// Poin & Medali — a small badge near Home's profile row showing the
// lifetime point total (lib/amalanHarian.js's fetchTotalPoints) and its
// medal tier, so "how am I doing overall" has an answer at a glance
// without opening a separate dashboard. Tap toggles an inline detail row
// (progress to the next tier) rather than navigating anywhere — this is
// meant to be seen in passing, not a destination of its own.
export default function PointsBadge({ uid }) {
  const { theme } = useTheme();
  const [points, setPoints] = useState(null);
  const [expanded, setExpanded] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [recentDays, setRecentDays] = useState(null);
  const [monthlyCompare, setMonthlyCompare] = useState(null);
  const [showMedalModal, setShowMedalModal] = useState(false);
  const [iconPopStyle, triggerIconPop] = usePopAnimation();

  useEffect(() => {
    if (!uid) return;
    fetchTotalPoints(uid).then(setPoints);
  }, [uid]);

  // Riwayat Poin Harian — a small day-by-day history (not just the
  // lifetime total) so someone can actually see whether they've been
  // trending up or down lately, not just "how many points ever". Loaded
  // lazily on expand, not on mount, since most taps never open this.
  useEffect(() => {
    if (!expanded || !uid || recentDays) return;
    fetchRecentAmalanHarian(uid, 7).then(setRecentDays);
  }, [expanded, uid, recentDays]);

  // Perbandingan Poin Bulan Ini vs Bulan Lalu — same lazy-on-expand
  // loading as the 7-day history above, since most taps never open this.
  useEffect(() => {
    if (!expanded || !uid || monthlyCompare) return;
    fetchMonthlyPointsComparison(uid).then(setMonthlyCompare);
  }, [expanded, uid, monthlyCompare]);

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
      setShowMedalModal(true);
      triggerIconPop();
    }
  }, [tier]);

  // [UI] Was a bare `return null` while the total loaded — a real, if
  // brief, blank gap right next to Home's settings/bell icon since this
  // sits in the header row from first paint. A plain pulsing translucent
  // pill matching the real badge's own dimensions/background (not the
  // shared Skeleton.jsx component — that one's var(--card)/var(--border)
  // shimmer is styled for light-card contexts, not this dark photo
  // header) so nothing jumps in size once the real total resolves.
  if (points === null) {
    return <div className="points-badge-skel" style={{ width: 56, height: 26, borderRadius: 999, background: 'rgba(255,255,255,0.2)' }} />;
  }

  return (
    <div style={{ position: 'relative' }}>
      {showConfetti && (
        <Confetti
          onComplete={() => setShowConfetti(false)}
          colors={tier ? [tier.color, '#ffffff', tier.color, '#f0cd7b'] : undefined}
        />
      )}
      <button
        onClick={() => setExpanded((v) => !v)}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 5,
          padding: '6px 12px',
          borderRadius: 999,
          border: 'none',
          // [UI] Warna aksen tier — a colored underline (inset box-shadow,
          // not a border, so the pill's own rounded shape/size never
          // shifts) hints the current medal tier even collapsed, not just
          // inside the expanded popover which already used tier.color for
          // its border/progress-bar.
          boxShadow: tier ? `inset 0 -2px 0 ${tier.color}` : 'none',
          background: 'rgba(255,255,255,0.2)',
          color: '#fff',
          fontSize: 12,
          fontWeight: 700,
          cursor: 'pointer',
        }}
        aria-label={`${points} poin${tier ? ` — tier ${tier.label}` : ''}`}
      >
        <span style={iconPopStyle}>
          {tier ? (
            <MedalIcon tier={tier.tier} size={16} />
          ) : (
            // Not yet at Perunggu — a plain outline star (not an emoji), so
            // the "no medal yet" state still matches the app's custom-icon
            // language.
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" style={{ display: 'block' }}>
              <path d="M12 3.5l2.6 5.3 5.9.9-4.3 4.1 1 5.8L12 17l-5.2 2.6 1-5.8L3.5 9.7l5.9-.9z" stroke="rgba(255,255,255,0.85)" strokeWidth="1.6" strokeLinejoin="round" />
            </svg>
          )}
        </span>
        {points}
      </button>

      {expanded && (
        <PointsDetailSheet
          points={points}
          tier={tier}
          next={next}
          recentDays={recentDays}
          monthlyCompare={monthlyCompare}
          onShareMedal={() => setShowMedalModal(true)}
          onClose={() => setExpanded(false)}
        />
      )}

      {showMedalModal && tier && (
        <MedalShareModal
          tierId={tier.tier}
          tierLabel={tier.label}
          tierColor={tier.color}
          points={points}
          theme={theme}
          onClose={() => setShowMedalModal(false)}
        />
      )}
    </div>
  );
}
