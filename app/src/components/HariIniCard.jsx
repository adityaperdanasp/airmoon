import { useEffect, useState } from 'react';
import { DAILY_POINTS_MAX, SHOLAT_KEYS, SHOLAT_LABELS, scoreForDay, watchAmalanHarian, setSholatDone } from '../lib/amalanHarian';
import { hapticTick } from '../lib/haptics';
import { ibadahLocks, useMinuteTick, LOCK_HINT } from '../lib/ibadahWindows';
import AmalanHarianCard from './AmalanHarianCard';
import MoodCheckIn from './MoodCheckIn';
import AmalanHeatmap from './AmalanHeatmap';

const INITIAL = { subuh: 'S', dzuhur: 'D', ashar: 'A', maghrib: 'M', isya: 'I' };

// "Hari ini": today's ibadah as one big number, a progress bar and the
// five sholat as tappable dots, sized as a cell of Home's bento grid.
// "Lihat semua" opens the full Amalan Harian card (tilawah, dzikir, share,
// badges) plus the mood check-in and the 5-week heatmap as a full-width
// block at the end of the grid (`order: 99`), so nothing was removed.
// A sholat whose time is over is locked and dimmed (lib/ibadahWindows.js).
export default function HariIniCard({ uid, forceOpen, timings }) {
  const [amalan, setAmalan] = useState({ sholat: {}, tilawah: false });
  const [open, setOpen] = useState(false);
  useEffect(() => watchAmalanHarian(uid, setAmalan), [uid]);
  useEffect(() => {
    if (forceOpen) setOpen(true);
  }, [forceOpen]);

  const now = useMinuteTick();
  const locks = ibadahLocks(timings, now);
  const score = scoreForDay(amalan);

  return (
    <>
      <section id="amalan-harian" className="glass b-card">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span className="b-eyebrow">Hari ini</span>
          <button
            className="b-more"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
          >
            {open ? 'Tutup' : 'Lihat semua'}
          </button>
        </div>
        <div style={{ display: 'flex', alignItems: 'baseline' }}>
          <span className="b-num">{score}</span>
          <span className="b-num-unit">/{DAILY_POINTS_MAX}</span>
        </div>
        <div className="b-bar" role="progressbar" aria-valuenow={score} aria-valuemax={DAILY_POINTS_MAX} aria-label="Progress ibadah hari ini">
          <div style={{ width: `${(score / DAILY_POINTS_MAX) * 100}%` }} />
        </div>
        <div style={{ display: 'flex', gap: 6, marginTop: 'auto' }}>
          {SHOLAT_KEYS.map((k) => {
            const done = !!amalan.sholat?.[k];
            const locked = locks[k];
            return (
              <button
                key={k}
                className="b-dot"
                aria-pressed={done}
                aria-label={SHOLAT_LABELS[k]}
                disabled={locked}
                title={locked ? LOCK_HINT[k] : SHOLAT_LABELS[k]}
                onClick={() => {
                  hapticTick();
                  setSholatDone(uid, k, !done);
                }}
                style={{
                  border: done ? 'none' : '1px dashed var(--border)',
                  background: done ? 'var(--primary)' : 'transparent',
                  color: done ? 'var(--on-primary)' : 'var(--muted)',
                  opacity: locked && !done ? 0.35 : 1,
                  cursor: locked ? 'not-allowed' : 'pointer',
                }}
              >
                {done ? '✓' : INITIAL[k]}
              </button>
            );
          })}
        </div>
      </section>
      {open && (
        <div style={{ gridColumn: '1 / -1', order: 99, display: 'flex', flexDirection: 'column', gap: 14 }}>
          <AmalanHarianCard uid={uid} locks={locks} />
          <MoodCheckIn uid={uid} />
          <AmalanHeatmap uid={uid} />
        </div>
      )}
    </>
  );
}
