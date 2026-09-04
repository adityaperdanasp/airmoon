import { useEffect, useState } from 'react';
import { fetchRecentAmalanHarian, DAILY_POINTS_MAX } from '../lib/amalanHarian';

const DAYS = 35; // 5 full weeks — enough to see a real pattern without the row getting unreadably long

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
  const [days, setDays] = useState(null);

  useEffect(() => {
    if (!uid) return;
    fetchRecentAmalanHarian(uid, DAYS).then(setDays);
  }, [uid]);

  if (!days) return null;

  // Pad the front so the grid always starts on a Sunday column, same
  // convention GitHub's own contribution graph uses.
  const firstDow = new Date(`${days[0].dateKey}T00:00:00`).getDay();
  const padded = [...Array(firstDow).fill(null), ...days];

  const max = days[0]?.max || DAILY_POINTS_MAX;

  return (
    <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: 10, padding: 16, background: 'linear-gradient(155deg, var(--card) 55%, var(--mint-soft) 130%)' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <span style={{ fontSize: 12.5, fontWeight: 800 }}>📅 Konsistensi 5 Minggu Terakhir</span>
        <span style={{ fontSize: 10, color: 'var(--muted)' }}>Poin harian (dari {max})</span>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 4 }}>
        {padded.map((d, i) =>
          d ? (
            <div
              key={d.dateKey}
              title={`${d.dateKey}: ${d.score}/${d.max}`}
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
    </div>
  );
}
