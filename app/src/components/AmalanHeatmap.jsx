import { useEffect, useState } from 'react';
import { fetchRecentAmalanHarian, DAILY_POINTS_MAX } from '../lib/amalanHarian';
import { useTheme } from '../context/ThemeContext';
import WeeklyRecapShareModal from './WeeklyRecapShareModal';
import { IconShare } from './icons';
import { SkeletonCard } from './Skeleton';

const DAYS = 35; // 5 full weeks — enough to see a real pattern without the row getting unreadably long

// [UI 2026-09-12] Each cell's tooltip showed the raw dateKey ("2026-09-06:
// 5/9") — a plain ISO string, not the readable Indonesian date format
// every other date-ish thing in this app uses.
const cellDateFmt = new Intl.DateTimeFormat('id-ID', { day: 'numeric', month: 'short' });

// A real per-score gradient (2026-09-04, after a founder question — the
// original 3-bucket version made e.g. 1 and 2, or 3 and 4, render as the
// literal same shade with no way to tell them apart at a glance). Reuses
// var(--primary) itself rather than a hardcoded teal rgba() — this app's
// --primary is teal in light theme but bronze/gold in dark theme (see
// CLAUDE.md's dark-mode redesign note), so scaling that color's own
// opacity keeps the ramp correct in both themes instead of a fixed teal
// clashing with dark mode's bronze accent at the top of the scale.
function cellStyle(score, max) {
  if (score === 0) return { background: 'var(--border)', opacity: 1 };
  // Floors at 0.3 so a lone score of 1 is still clearly visible next to an
  // empty cell, not near-invisible; scales up to a fully solid 1.0 at max.
  const opacity = 0.3 + 0.7 * (score / max);
  return { background: 'var(--primary)', opacity };
}

// A GitHub-contribution-graph-style view of Amalan Harian completion over
// the last 5 weeks — AmalanHarianCard only ever shows *today*, this is the
// pattern-over-time view that answers "have I actually been consistent"
// rather than just "did I do it today". Read-only (no click-to-edit) since
// only today's amalan is ever editable, matching AmalanHarianCard.
//
// Poin & Medali (2026-09-06) — used to cap at 6 (sholat + tilawah only)
// because Dzikir Pagi/Petang's per-day status genuinely didn't exist
// anywhere before this; dzikirStreak.js's markDzikirDone() now also
// writes into the same amalanHarian/{dateKey} doc this reads, and a daily
// login point (lib/amalanHarian.js's markLoginPoint) is scored too — max
// is 9 (see DAILY_POINTS_MAX). A day recorded before this change simply
// has no dzikirPagi/dzikirPetang/loginPoint fields and shows a lower real
// score, not a bug — that data was never captured before now.
export default function AmalanHeatmap({ uid }) {
  const { theme } = useTheme();
  const [days, setDays] = useState(null);
  const [showRecap, setShowRecap] = useState(false);

  useEffect(() => {
    if (!uid) return;
    fetchRecentAmalanHarian(uid, DAYS).then(setDays);
  }, [uid]);

  // [UI 2026-09-11] Was a bare `return null` — Home rendered nothing at
  // all here while this card's own fetch was in flight, then popped the
  // whole thing in at once, a small layout jump on top of nothing to
  // look at in the meantime. A shaped placeholder matches every other
  // card on Home by now.
  if (!days) return <SkeletonCard height={132} radius={20} />;

  // Bagikan Capaian Mingguan — the last 7 entries of the same `days`
  // array this component already fetched (a rolling 5-week strip), no
  // separate query needed.
  const last7 = days.slice(-7);
  const weeklyTotal = last7.reduce((sum, d) => sum + d.score, 0);
  const weeklyMax = last7.reduce((sum, d) => sum + d.max, 0);
  const bestDay = last7.reduce((best, d) => (d.score > best.score ? d : best), last7[0]);

  // Pad the front so the grid always starts on a Sunday column, same
  // convention GitHub's own contribution graph uses.
  const firstDow = new Date(`${days[0].dateKey}T00:00:00`).getDay();
  const padded = [...Array(firstDow).fill(null), ...days];

  const max = days[0]?.max || DAILY_POINTS_MAX;

  return (
    <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: 10, padding: 16, background: 'linear-gradient(155deg, var(--card) 55%, var(--mint-soft) 130%)' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <span style={{ fontSize: 12.5, fontWeight: 800 }}>📅 Konsistensi 5 Minggu Terakhir</span>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ fontSize: 10, color: 'var(--muted)' }}>Poin harian (dari {max})</span>
          <button
            onClick={() => setShowRecap(true)}
            aria-label="Bagikan capaian mingguan"
            title="Bagikan capaian mingguan"
            style={{ width: 24, height: 24, borderRadius: '50%', border: 'none', background: 'var(--mint-soft)', color: 'var(--primary)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
          >
            <IconShare />
          </button>
        </div>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 4 }}>
        {padded.map((d, i) =>
          d ? (
            <div
              key={d.dateKey}
              title={`${cellDateFmt.format(new Date(`${d.dateKey}T00:00:00`))}: ${d.score}/${d.max}`}
              style={{ aspectRatio: '1', borderRadius: 4, ...cellStyle(d.score, d.max) }}
            />
          ) : (
            <div key={`pad-${i}`} style={{ aspectRatio: '1' }} />
          )
        )}
      </div>
      <span style={{ fontSize: 9.5, color: 'var(--muted-soft)', lineHeight: 1.4 }}>
        *Sholat, Tilawah, Dzikir Pagi/Petang, & poin login harian. Hari sebelum fitur ini aktif mungkin kelihatan lebih rendah — datanya emang belum kesimpen dulu.
      </span>

      {showRecap && (
        <WeeklyRecapShareModal
          totalScore={weeklyTotal}
          maxScore={weeklyMax}
          bestDayScore={bestDay.score}
          bestDayMax={bestDay.max}
          theme={theme}
          onClose={() => setShowRecap(false)}
        />
      )}
    </div>
  );
}
