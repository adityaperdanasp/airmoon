import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { watchPuasaSunnahLog, markPuasaSunnah, unmarkPuasaSunnah, todayDateKey } from '../lib/puasaSunnahLog';
import { highestPuasaTier } from '../lib/badges';
import PageHeaderPhoto from '../components/PageHeaderPhoto';
import { PAGE_PHOTOS } from '../data/photos';
import Confetti from '../components/Confetti';
import { hapticTick, hapticSuccess } from '../lib/haptics';

const MONTH_FMT = new Intl.DateTimeFormat('id-ID', { month: 'long', year: 'numeric' });
const DAY_FMT = new Intl.DateTimeFormat('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });
const CELEBRATED_KEY = 'airmoon-puasa-badge-celebrated-count';
const WEEKDAY_LABELS = ['M', 'S', 'S', 'R', 'K', 'J', 'S'];

function pad2(n) {
  return String(n).padStart(2, '0');
}

// A real month calendar grid — replacing the flat "Riwayat" date list,
// which read fine for a handful of entries but gave no sense of pattern
// (which weeks were consistent, whether Senin/Kamis actually landed on
// Mondays/Thursdays) the way a calendar view does at a glance. Only
// TODAY's cell is tappable (same "only today is editable" rule
// AmalanHeatmap.jsx's read-only design already established) — past days
// are just a record, not something to retroactively edit here.
function PuasaCalendar({ dateSet, viewMonth, onPrevMonth, onNextMonth, today, onToggleToday }) {
  const year = viewMonth.getFullYear();
  const month = viewMonth.getMonth();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDow = new Date(year, month, 1).getDay();
  const cells = [...Array(firstDow).fill(null), ...Array.from({ length: daysInMonth }, (_, i) => i + 1)];

  return (
    <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: 10, padding: 16 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <button onClick={onPrevMonth} aria-label="Bulan sebelumnya" style={{ background: 'none', border: 'none', color: 'var(--muted)', cursor: 'pointer', padding: 6, fontSize: 15 }}>
          ←
        </button>
        <span style={{ fontSize: 12.5, fontWeight: 800 }}>{MONTH_FMT.format(viewMonth)}</span>
        <button onClick={onNextMonth} aria-label="Bulan berikutnya" style={{ background: 'none', border: 'none', color: 'var(--muted)', cursor: 'pointer', padding: 6, fontSize: 15 }}>
          →
        </button>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 4 }}>
        {WEEKDAY_LABELS.map((w, i) => (
          <span key={i} style={{ textAlign: 'center', fontSize: 9.5, fontWeight: 700, color: 'var(--muted)' }}>{w}</span>
        ))}
        {cells.map((day, i) => {
          if (!day) return <span key={i} />;
          const key = `${year}-${pad2(month + 1)}-${pad2(day)}`;
          const isMarked = dateSet.has(key);
          const isToday = key === today;
          return (
            <button
              key={i}
              onClick={isToday ? onToggleToday : undefined}
              disabled={!isToday}
              style={{
                aspectRatio: '1',
                borderRadius: 8,
                border: isToday ? '1.5px solid var(--primary)' : 'none',
                background: isMarked ? 'var(--primary)' : 'var(--border)',
                color: isMarked ? 'var(--on-primary)' : 'var(--muted)',
                fontSize: 10.5,
                fontWeight: 700,
                cursor: isToday ? 'pointer' : 'default',
                opacity: isMarked ? 1 : 0.5,
              }}
            >
              {day}
            </button>
          );
        })}
      </div>
    </div>
  );
}

// Catatan Puasa Sunnah — the reminder push (check-campaign-deadlines.js's
// checkPuasaSunnahReminder) previously had nowhere to send someone to
// actually log the fast, so its notification tag routed to plain Home.
// This page is that destination. Deliberately reuses PAGE_PHOTOS.zakat —
// same "no dedicated photo shoot exists yet, borrow a thematically close
// one" precedent as Kalkulator Waris.
export default function PuasaSunnah() {
  const { user } = useAuth();
  const { showToast } = useToast();
  const [dates, setDates] = useState(null);
  const [marking, setMarking] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [viewMonth, setViewMonth] = useState(() => {
    const d = new Date();
    return new Date(d.getFullYear(), d.getMonth(), 1);
  });
  const today = todayDateKey();
  const isMarkedToday = dates?.includes(today);
  const totalCount = dates?.length || 0;
  const badgeTier = highestPuasaTier(totalCount);

  useEffect(() => watchPuasaSunnahLog(user?.uid, setDates), [user?.uid]);

  // Celebrates the moment a NEW milestone is actually reached, not every
  // time this page happens to render with an already-earned tier —
  // same localStorage-tracked-highest-celebrated pattern as
  // AmalanHarianCard.jsx's own dzikir-badge celebration.
  useEffect(() => {
    if (!badgeTier) return;
    const lastCelebrated = Number(localStorage.getItem(CELEBRATED_KEY)) || 0;
    if (badgeTier.count > lastCelebrated) {
      localStorage.setItem(CELEBRATED_KEY, String(badgeTier.count));
      hapticSuccess();
      setShowConfetti(true);
    }
  }, [badgeTier]);

  async function handleToggleToday() {
    if (!user) return;
    hapticTick();
    setMarking(true);
    try {
      if (isMarkedToday) {
        await unmarkPuasaSunnah(user.uid, today);
      } else {
        await markPuasaSunnah(user.uid, today);
        showToast('Alhamdulillah, tercatat 🌙');
      }
    } finally {
      setMarking(false);
    }
  }

  const thisMonthPrefix = today.slice(0, 7);
  const thisMonthCount = dates?.filter((d) => d.startsWith(thisMonthPrefix)).length || 0;

  return (
    <div className="screen">
      <div className="screen-content">
        <PageHeaderPhoto title="Puasa Sunnah" photo={PAGE_PHOTOS.zakat} subtitle="Senin/Kamis & Ayyamul Bidh" />

        <div style={{ borderRadius: 20, padding: 22, textAlign: 'center', background: 'linear-gradient(135deg, var(--primary), var(--primary-dark))' }}>
          <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.04em', textTransform: 'uppercase', color: 'var(--accent)' }}>
            {DAY_FMT.format(new Date())}
          </span>
          <div style={{ marginTop: 10 }}>
            <button
              className="btn"
              onClick={handleToggleToday}
              disabled={!user || marking}
              style={{
                background: isMarkedToday ? 'var(--on-primary)' : '#fff',
                color: isMarkedToday ? 'var(--primary-dark)' : 'var(--primary-dark)',
                padding: '11px 24px',
                width: 'auto',
                opacity: marking ? 0.7 : 1,
              }}
            >
              {marking ? (
                <div className="spinner" style={{ width: 16, height: 16, borderTopColor: 'var(--primary-dark)' }} />
              ) : isMarkedToday ? (
                '✓ Puasa Hari Ini Tercatat'
              ) : (
                'Tandai Puasa Hari Ini'
              )}
            </button>
          </div>
          {!user && <span style={{ display: 'block', marginTop: 10, fontSize: 11, color: 'rgba(255,255,255,0.75)' }}>Masuk dulu buat mulai mencatat.</span>}
        </div>

        <div style={{ display: 'flex', gap: 10 }}>
          <div className="card" style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 3, padding: 16, alignItems: 'center' }}>
            <span style={{ fontSize: 22, fontWeight: 800, color: 'var(--primary)' }}>{thisMonthCount}</span>
            <span style={{ fontSize: 10.5, color: 'var(--muted)', textAlign: 'center' }}>Kali Bulan {MONTH_FMT.format(new Date())}</span>
          </div>
          <div className="card" style={{ position: 'relative', flex: 1, display: 'flex', flexDirection: 'column', gap: 3, padding: 16, alignItems: 'center' }}>
            {showConfetti && <Confetti onComplete={() => setShowConfetti(false)} />}
            <span style={{ fontSize: 22, fontWeight: 800, color: 'var(--gold-ink)' }}>{totalCount}</span>
            <span style={{ fontSize: 10.5, color: 'var(--muted)', textAlign: 'center' }}>Total Sepanjang Waktu</span>
            {badgeTier && (
              <span style={{ marginTop: 2, fontSize: 10, fontWeight: 700, padding: '3px 9px', borderRadius: 999, color: 'var(--primary)', background: 'var(--mint)' }}>
                {badgeTier.icon} {badgeTier.label}
              </span>
            )}
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10, padding: '13px 14px', borderRadius: 14, background: 'var(--card)' }}>
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="var(--muted)" style={{ flexShrink: 0, marginTop: 1 }}>
            <circle cx="12" cy="12" r="9" strokeWidth="1.6" /><path d="M12 11v5.5M12 8v.01" strokeWidth="1.8" strokeLinecap="round" />
          </svg>
          <span style={{ fontSize: 11, lineHeight: 1.5, color: 'var(--muted)' }}>
            Pencatatan manual — tandai sendiri tiap kali puasa sunnah (Senin/Kamis, Ayyamul Bidh, atau puasa sunnah lainnya). Kamu bakal diingatkan lewat notifikasi, tapi yang mencatat tetap kamu.
          </span>
        </div>

        {dates === null && (
          <div className="center" style={{ minHeight: 100 }}>
            <div className="spinner" />
          </div>
        )}

        {dates && (
          <PuasaCalendar
            dateSet={new Set(dates)}
            viewMonth={viewMonth}
            onPrevMonth={() => setViewMonth((d) => new Date(d.getFullYear(), d.getMonth() - 1, 1))}
            onNextMonth={() => setViewMonth((d) => new Date(d.getFullYear(), d.getMonth() + 1, 1))}
            today={today}
            onToggleToday={handleToggleToday}
          />
        )}
      </div>
    </div>
  );
}
