import { useEffect, useState } from 'react';
import { SHOLAT_KEYS, SHOLAT_LABELS, watchAmalanHarian, setSholatDone, setTilawahDone } from '../lib/amalanHarian';
import { watchDzikirStreak, markDzikirDone, isDoneToday } from '../lib/dzikirStreak';
import { highestTier } from '../lib/badges';
import { usePopAnimation } from '../lib/usePopAnimation';
import { hapticTick, hapticSuccess } from '../lib/haptics';
import AmalanShareModal from './AmalanShareModal';
import Confetti from './Confetti';

const BADGE_CELEBRATED_KEY = 'airmoon-badge-celebrated-days';

// Tracks the false→true transition specifically (not just "is it
// currently done") so the checkmark's draw-in animation plays exactly
// once, right when someone actually taps a chip to complete it — not
// every time this card mounts/re-renders showing already-done items from
// earlier today.
function Chip({ done, label, onClick, disabled }) {
  const [justChecked, setJustChecked] = useState(false);
  const [wasDone, setWasDone] = useState(done);
  const [popStyle, triggerPop] = usePopAnimation();

  useEffect(() => {
    if (done && !wasDone) {
      setJustChecked(true);
      triggerPop();
      const t = setTimeout(() => setJustChecked(false), 400);
      setWasDone(true);
      return () => clearTimeout(t);
    }
    setWasDone(done);
    // eslint-disable-next-line react-hooks/exhaustive-deps -- only re-run on `done` itself changing, wasDone is just this effect's own memory
  }, [done]);

  return (
    <button
      onClick={() => {
        hapticTick();
        onClick();
      }}
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
        ...popStyle,
      }}
    >
      {done && (
        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" className={justChecked ? 'checkmark-draw' : undefined}>
          <path d="M5 12.5 10 17 19 7" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
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
  const [showShare, setShowShare] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);

  useEffect(() => watchAmalanHarian(uid, setAmalan), [uid]);
  useEffect(() => watchDzikirStreak(uid, setStreaks), [uid]);

  const dzikirPagiDone = isDoneToday(streaks.pagi);
  const dzikirPetangDone = isDoneToday(streaks.petang);
  const sholatDoneCount = SHOLAT_KEYS.filter((k) => amalan.sholat?.[k]).length;
  const totalDone = sholatDoneCount + (dzikirPagiDone ? 1 : 0) + (dzikirPetangDone ? 1 : 0) + (amalan.tilawah ? 1 : 0);
  const totalItems = SHOLAT_KEYS.length + 3;

  // Badges are keyed off dzikir streaks specifically (the one thing here
  // that's actually a consecutive-day count) — the sholat/tilawah checklist
  // resets to 0 every midnight with no "best streak" of its own to badge.
  const pagiTier = highestTier(streaks.pagi?.best || 0);
  const petangTier = highestTier(streaks.petang?.best || 0);

  // Celebrates the moment a NEW badge tier is actually reached, not every
  // time this card happens to render with an already-earned tier —
  // tracked via the highest tier-days already celebrated (localStorage,
  // not per-render state, since this card remounts on every Home visit).
  useEffect(() => {
    const highestReached = Math.max(pagiTier?.days || 0, petangTier?.days || 0);
    if (highestReached === 0) return;
    const lastCelebrated = Number(localStorage.getItem(BADGE_CELEBRATED_KEY)) || 0;
    if (highestReached > lastCelebrated) {
      localStorage.setItem(BADGE_CELEBRATED_KEY, String(highestReached));
      hapticSuccess();
      setShowConfetti(true);
    }
  }, [pagiTier?.days, petangTier?.days]);

  return (
    <div
      className="card"
      style={{ position: 'relative', display: 'flex', flexDirection: 'column', gap: 12, padding: 16, background: 'linear-gradient(155deg, var(--card) 55%, var(--mint-soft) 130%)' }}
    >
      {showConfetti && <Confetti onComplete={() => setShowConfetti(false)} />}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <span style={{ fontSize: 13, fontWeight: 800 }}>📋 Amalan Harian</span>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <span style={{ fontSize: 11.5, fontWeight: 700, color: 'var(--primary)' }}>
            {totalDone}/{totalItems} selesai
          </span>
          <button
            onClick={() => setShowShare(true)}
            aria-label="Bagikan progress"
            title="Bagikan progress"
            style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer', color: 'var(--muted-soft)', display: 'flex' }}
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path d="M12 3v13M12 3 8 7M12 3l4 4" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M5 14v4.5A2.5 2.5 0 0 0 7.5 21h9a2.5 2.5 0 0 0 2.5-2.5V14" strokeWidth="1.6" strokeLinecap="round" />
            </svg>
          </button>
        </div>
      </div>

      {(pagiTier || petangTier) && (
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
          {pagiTier && (
            <span style={{ fontSize: 10.5, fontWeight: 700, padding: '4px 9px', borderRadius: 999, background: 'var(--cream)', color: 'var(--gold-ink)' }}>
              {pagiTier.icon} Dzikir Pagi {pagiTier.label}
            </span>
          )}
          {petangTier && (
            <span style={{ fontSize: 10.5, fontWeight: 700, padding: '4px 9px', borderRadius: 999, background: 'var(--cream)', color: 'var(--gold-ink)' }}>
              {petangTier.icon} Dzikir Petang {petangTier.label}
            </span>
          )}
        </div>
      )}

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

      {showShare && (
        <AmalanShareModal totalDone={totalDone} totalItems={totalItems} onClose={() => setShowShare(false)} />
      )}
    </div>
  );
}
