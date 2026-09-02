import { useEffect, useState } from 'react';
import { SHOLAT_KEYS, SHOLAT_LABELS, watchAmalanHarian, setSholatDone, setTilawahDone } from '../lib/amalanHarian';
import { watchDzikirStreak, markDzikirDone, isDoneToday } from '../lib/dzikirStreak';

function Chip({ done, label, onClick, disabled }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 5,
        padding: '7px 12px',
        borderRadius: 999,
        fontSize: 11.5,
        fontWeight: 700,
        cursor: disabled ? 'default' : 'pointer',
        border: done ? 'none' : '1px solid var(--border)',
        color: done ? 'var(--on-primary)' : 'var(--ink)',
        background: done ? 'var(--primary)' : 'var(--card)',
      }}
    >
      {done && (
        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M5 12.5 10 17 19 7" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" /></svg>
      )}
      {label}
    </button>
  );
}

// A unified "did I do today's ibadah" checklist for Home — combines
// sholat + tilawah (this component's own manual per-day doc, see
// lib/amalanHarian.js) with Dzikir Pagi/Petang (reusing lib/
// dzikirStreak.js's existing tracking directly — not a separate signal)
// into one glanceable card, instead of someone having to remember to
// check 3 different pages to know whether today's ibadah is done.
export default function AmalanHarianCard({ uid }) {
  const [amalan, setAmalan] = useState({ sholat: {}, tilawah: false });
  const [streaks, setStreaks] = useState({});

  useEffect(() => watchAmalanHarian(uid, setAmalan), [uid]);
  useEffect(() => watchDzikirStreak(uid, setStreaks), [uid]);

  const dzikirPagiDone = isDoneToday(streaks.pagi);
  const dzikirPetangDone = isDoneToday(streaks.petang);
  const sholatDoneCount = SHOLAT_KEYS.filter((k) => amalan.sholat?.[k]).length;
  const totalDone = sholatDoneCount + (dzikirPagiDone ? 1 : 0) + (dzikirPetangDone ? 1 : 0) + (amalan.tilawah ? 1 : 0);
  const totalItems = SHOLAT_KEYS.length + 3;

  return (
    <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: 12, padding: 16 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <span style={{ fontSize: 13, fontWeight: 800 }}>📋 Amalan Harian</span>
        <span style={{ fontSize: 11.5, fontWeight: 700, color: 'var(--primary)' }}>
          {totalDone}/{totalItems} selesai
        </span>
      </div>

      <div style={{ height: 5, borderRadius: 999, background: 'var(--border)', overflow: 'hidden' }}>
        <div
          style={{
            height: '100%',
            width: `${(totalDone / totalItems) * 100}%`,
            background: 'var(--primary)',
            transition: 'width 0.25s ease',
          }}
        />
      </div>

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
        {SHOLAT_KEYS.map((k) => {
          const done = !!amalan.sholat?.[k];
          return (
            <Chip
              key={k}
              done={done}
              label={SHOLAT_LABELS[k]}
              onClick={() => uid && setSholatDone(uid, k, !done)}
            />
          );
        })}
        <Chip
          done={dzikirPagiDone}
          label="Dzikir Pagi"
          disabled={dzikirPagiDone}
          onClick={() => uid && markDzikirDone(uid, 'pagi')}
        />
        <Chip
          done={dzikirPetangDone}
          label="Dzikir Petang"
          disabled={dzikirPetangDone}
          onClick={() => uid && markDzikirDone(uid, 'petang')}
        />
        <Chip done={!!amalan.tilawah} label="Tilawah" onClick={() => uid && setTilawahDone(uid, !amalan.tilawah)} />
      </div>
    </div>
  );
}
