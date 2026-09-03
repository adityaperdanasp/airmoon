import { useEffect, useState } from 'react';
import { fetchRecentAmalanHarian } from '../lib/amalanHarian';

const DAYS = 35; // 5 full weeks — enough to see a real pattern without the row getting unreadably long

function cellColor(score, max) {
  if (score === 0) return 'var(--border)';
  const pct = score / max;
  if (pct < 0.4) return 'rgba(47, 161, 144, 0.35)';
  if (pct < 0.8) return 'rgba(47, 161, 144, 0.65)';
  return 'var(--primary)';
}

// A GitHub-contribution-graph-style view of sholat/tilawah completion over
// the last 5 weeks — AmalanHarianCard only ever shows *today*, this is the
// pattern-over-time view that answers "have I actually been consistent"
// rather than just "did I do it today". Read-only (no click-to-edit) since
// only today's amalan is ever editable, matching AmalanHarianCard.
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

  const max = days[0]?.max || 6;

  return (
    <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: 10, padding: 16 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <span style={{ fontSize: 12.5, fontWeight: 800 }}>📅 Konsistensi 5 Minggu Terakhir</span>
        <span style={{ fontSize: 10, color: 'var(--muted)' }}>Sholat &amp; Tilawah (dari {max})</span>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 4 }}>
        {padded.map((d, i) =>
          d ? (
            <div
              key={d.dateKey}
              title={`${d.dateKey}: ${d.score}/${d.max}`}
              style={{ aspectRatio: '1', borderRadius: 4, background: cellColor(d.score, d.max) }}
            />
          ) : (
            <div key={`pad-${i}`} style={{ aspectRatio: '1' }} />
          )
        )}
      </div>
      {/* This grid's max is 6 (5 sholat + tilawah), not the 8 shown on
          Amalan Harian's card above — Dzikir Pagi/Petang aren't counted
          here on purpose. dzikirStreak only ever remembers the *current*
          streak's last-done date, not a full daily history, so a past
          day's dzikir completion genuinely can't be recovered to color
          these cells with. */}
      <span style={{ fontSize: 9.5, color: 'var(--muted-soft)', lineHeight: 1.4 }}>
        *Dzikir Pagi/Petang gak ikut dihitung di sini — histori dzikir harian gak tersimpan, cuma rentetan (streak) yang aktif.
      </span>
    </div>
  );
}
