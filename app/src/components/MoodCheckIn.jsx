import { useEffect, useState } from 'react';
import { watchAmalanHarian, setMoodCheckIn } from '../lib/amalanHarian';

const MOODS = [
  { key: 'semangat', emoji: '🤩', label: 'Semangat' },
  { key: 'tenang', emoji: '😌', label: 'Tenang' },
  { key: 'biasa', emoji: '🙂', label: 'Biasa aja' },
  { key: 'lelah', emoji: '😮‍💨', label: 'Lelah' },
  { key: 'sedih', emoji: '😔', label: 'Sedih' },
];

// Check-in mood/niat harian (2026-09-12) — an ultra-light daily
// engagement touchpoint on Home, deliberately with zero analysis or
// judgment attached (no "your mood trend" chart, no push based on this)
// — just a reason to tap something small every day, and a personal log
// someone can look back on later if a history view ever gets built.
export default function MoodCheckIn({ uid }) {
  const [today, setToday] = useState(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => watchAmalanHarian(uid, setToday), [uid]);

  async function handlePick(mood) {
    if (!uid || busy) return;
    setBusy(true);
    try {
      await setMoodCheckIn(uid, mood);
    } finally {
      setBusy(false);
    }
  }

  const picked = today?.moodCheckIn;

  return (
    <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: 8, padding: 14 }}>
      <span style={{ fontSize: 11.5, fontWeight: 700, color: 'var(--muted)' }}>
        {picked ? `Tercatat: ${MOODS.find((m) => m.key === picked)?.label}` : 'Gimana perasaan kamu hari ini?'}
      </span>
      <div style={{ display: 'flex', justifyContent: 'space-between', gap: 4 }}>
        {MOODS.map((m) => (
          <button
            key={m.key}
            onClick={() => handlePick(m.key)}
            disabled={busy}
            aria-label={m.label}
            aria-pressed={picked === m.key}
            title={m.label}
            style={{
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 2,
              padding: '8px 2px',
              borderRadius: 12,
              border: 'none',
              background: picked === m.key ? 'var(--mint)' : 'transparent',
              cursor: 'pointer',
              opacity: picked && picked !== m.key ? 0.45 : 1,
            }}
          >
            <span style={{ fontSize: 20 }}>{m.emoji}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
