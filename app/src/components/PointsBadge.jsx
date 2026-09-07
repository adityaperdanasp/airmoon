import { useEffect, useState } from 'react';
import { fetchTotalPoints, fetchRecentAmalanHarian, fetchMonthlyPointsComparison } from '../lib/amalanHarian';
import { highestPointTier, nextPointTier } from '../lib/points';
import { useTheme } from '../context/ThemeContext';
import { usePopAnimation } from '../lib/usePopAnimation';
import Confetti from './Confetti';
import MedalShareModal from './MedalShareModal';

const CELEBRATED_KEY = 'airmoon-points-tier-celebrated';
const DAY_LABEL_FMT = new Intl.DateTimeFormat('id-ID', { weekday: 'short' });

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
        <span style={{ ...iconPopStyle, fontSize: 14 }}>{tier?.icon || '⭐'}</span>
        {points}
      </button>

      {expanded && (
        <div
          style={{
            position: 'absolute',
            top: 'calc(100% + 8px)',
            right: 0,
            zIndex: 5,
            width: 250,
            padding: 14,
            borderRadius: 14,
            background: 'var(--card)',
            border: tier ? `1.5px solid ${tier.color}` : '1px solid var(--border)',
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

          {/* Mini progress bar menuju tier berikutnya — was text-only
              before, telling the number but not, at a glance, how close.
              Same current-tier-floor → next-tier-ceiling math as
              KalkulatorZakat.jsx's NisabGauge, just a bar instead of a
              radial dial. */}
          <div style={{ height: 6, borderRadius: 999, background: 'var(--border)', overflow: 'hidden', marginTop: 2 }}>
            <div
              style={{
                height: '100%',
                borderRadius: 999,
                width: next
                  ? `${Math.min(100, ((points - (tier?.points || 0)) / (next.points - (tier?.points || 0))) * 100)}%`
                  : '100%',
                background: tier?.color || 'var(--primary)',
                transition: 'width 0.3s ease',
              }}
            />
          </div>
          <span style={{ fontSize: 10, color: 'var(--muted-soft)', lineHeight: 1.4, marginTop: 4 }}>
            Poin dari checklist Amalan Harian &amp; login harian.
          </span>

          <div style={{ marginTop: 8, paddingTop: 8, borderTop: '1px solid var(--border)', display: 'flex', flexDirection: 'column', gap: 6 }}>
            <span style={{ fontSize: 9.5, fontWeight: 700, letterSpacing: '0.04em', textTransform: 'uppercase', color: 'var(--muted)' }}>
              Riwayat 7 Hari
            </span>
            {!recentDays ? (
              <div className="spinner" style={{ width: 14, height: 14, margin: '2px auto' }} />
            ) : (
              <div style={{ display: 'flex', gap: 3, justifyContent: 'space-between' }}>
                {recentDays.map((d) => {
                  const dayDate = new Date(`${d.dateKey}T00:00:00`);
                  const pct = d.max > 0 ? d.score / d.max : 0;
                  return (
                    <div key={d.dateKey} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3, flex: 1 }} title={`${d.score}/${d.max} poin`}>
                      <div style={{ width: '100%', height: 32, borderRadius: 5, background: 'var(--border)', display: 'flex', alignItems: 'flex-end', overflow: 'hidden' }}>
                        <div style={{ width: '100%', height: `${Math.max(pct * 100, d.score > 0 ? 12 : 0)}%`, background: 'var(--primary)', borderRadius: 5 }} />
                      </div>
                      <span style={{ fontSize: 8.5, color: 'var(--muted)' }}>{DAY_LABEL_FMT.format(dayDate)}</span>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {monthlyCompare && (
            <div style={{ marginTop: 8, paddingTop: 8, borderTop: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ fontSize: 10.5, color: 'var(--muted)' }}>Bulan ini vs bulan lalu</span>
              <span
                style={{
                  fontSize: 11,
                  fontWeight: 800,
                  color: monthlyCompare.thisMonth >= monthlyCompare.lastMonth ? 'var(--success)' : 'var(--danger)',
                }}
              >
                {monthlyCompare.thisMonth} vs {monthlyCompare.lastMonth}{' '}
                {monthlyCompare.thisMonth >= monthlyCompare.lastMonth ? '▲' : '▼'}
              </span>
            </div>
          )}

          {tier && (
            <button
              onClick={() => setShowMedalModal(true)}
              className="btn-outline"
              style={{ marginTop: 6, padding: '7px 0', fontSize: 11.5 }}
            >
              Bagikan Medali
            </button>
          )}
        </div>
      )}

      {showMedalModal && tier && (
        <MedalShareModal
          tierIcon={tier.icon}
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
