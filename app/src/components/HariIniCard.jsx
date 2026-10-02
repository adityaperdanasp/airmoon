import { useEffect, useState } from 'react';
import { DAILY_POINTS_MAX, SHOLAT_KEYS, SHOLAT_LABELS, scoreForDay, watchAmalanHarian, setSholatDone } from '../lib/amalanHarian';
import { hapticTick } from '../lib/haptics';
import AmalanHarianCard from './AmalanHarianCard';
import MoodCheckIn from './MoodCheckIn';
import AmalanHeatmap from './AmalanHeatmap';

function Ring({ value, max }) {
  const r = 30;
  const c = 2 * Math.PI * r;
  return (
    <svg width="76" height="76" viewBox="0 0 76 76" aria-label={`${value} dari ${max} selesai`}>
      <circle cx="38" cy="38" r={r} fill="none" stroke="var(--border)" strokeWidth="7" />
      <circle cx="38" cy="38" r={r} fill="none" stroke="var(--primary)" strokeWidth="7" strokeLinecap="round" strokeDasharray={c} strokeDashoffset={c * (1 - value / max)} transform="rotate(-90 38 38)" style={{ transition: 'stroke-dashoffset var(--dur-3) var(--ease)' }} />
      <text x="38" y="43" textAnchor="middle" fontSize="17" fontWeight="800" fill="var(--ink)">{value}/{max}</text>
    </svg>
  );
}

// "Hari ini": today's ibadah as one ring + the five sholat as tappable
// chips. "Lihat semua" opens the full Amalan Harian card (tilawah, dzikir,
// share, badges) plus the mood check-in and the 5-week heatmap — they
// moved in here from Home's main column, nothing was removed.
export default function HariIniCard({ uid, forceOpen }) {
  const [amalan, setAmalan] = useState({ sholat: {}, tilawah: false });
  const [open, setOpen] = useState(false);
  useEffect(() => watchAmalanHarian(uid, setAmalan), [uid]);
  useEffect(() => {
    if (forceOpen) setOpen(true);
  }, [forceOpen]);

  const score = scoreForDay(amalan);
  const left = DAILY_POINTS_MAX - score;

  return (
    <section id="amalan-harian">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 12 }}>
        <h2 style={{ margin: 0, fontSize: 17, fontWeight: 800 }}>Hari ini</h2>
        <button onClick={() => setOpen((v) => !v)} aria-expanded={open} style={{ background: 'none', border: 'none', padding: 0, fontSize: 12, fontFamily: 'inherit', color: 'var(--primary)', fontWeight: 700, cursor: 'pointer' }}>
          {open ? 'Tutup' : 'Lihat semua'}
        </button>
      </div>
      <div style={{ background: 'var(--card)', borderRadius: 24, padding: 18, display: 'flex', gap: 16, alignItems: 'center' }}>
        <Ring value={score} max={DAILY_POINTS_MAX} />
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 14.5, fontWeight: 700, lineHeight: 1.35 }}>{left === 0 ? 'Alhamdulillah, semua beres hari ini' : `Tinggal ${left} lagi, lanjut yuk`}</div>
          <div style={{ display: 'flex', gap: 6, marginTop: 10, flexWrap: 'wrap' }}>
            {SHOLAT_KEYS.map((k) => {
              const done = !!amalan.sholat?.[k];
              return (
                <button
                  key={k}
                  aria-pressed={done}
                  onClick={() => {
                    hapticTick();
                    setSholatDone(uid, k, !done);
                  }}
                  style={{ fontSize: 10.5, fontFamily: 'inherit', fontWeight: 700, padding: '4px 9px', borderRadius: 999, cursor: 'pointer', background: done ? 'var(--mint-soft)' : 'transparent', color: done ? 'var(--primary)' : 'var(--muted)', border: done ? '1px solid transparent' : '1px dashed var(--border)' }}
                >
                  {done ? '✓ ' : ''}{SHOLAT_LABELS[k]}
                </button>
              );
            })}
          </div>
        </div>
      </div>
      {open && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14, marginTop: 14 }}>
          <AmalanHarianCard uid={uid} />
          <MoodCheckIn uid={uid} />
          <AmalanHeatmap uid={uid} />
        </div>
      )}
    </section>
  );
}
