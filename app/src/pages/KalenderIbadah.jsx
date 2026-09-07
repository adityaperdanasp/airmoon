import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { fetchAmalanHarianForMonth, DAILY_POINTS_MAX } from '../lib/amalanHarian';
import { watchPuasaSunnahLog } from '../lib/puasaSunnahLog';
import PageHeaderPhoto from '../components/PageHeaderPhoto';
import { PAGE_PHOTOS } from '../data/photos';
import EmptyState from '../components/EmptyState';

const MONTH_FMT = new Intl.DateTimeFormat('id-ID', { month: 'long', year: 'numeric' });
const WEEKDAY_LABELS = ['M', 'S', 'S', 'R', 'K', 'J', 'S'];

function pad2(n) {
  return String(n).padStart(2, '0');
}

// Same continuous-opacity scale as AmalanHeatmap.jsx, reused rather than
// re-derived so a day's color always means the same thing whether it's
// seen on Home's 5-week strip or here.
function cellStyle(score, max) {
  if (score === 0) return { background: 'var(--border)', opacity: 1 };
  const opacity = 0.3 + 0.7 * (score / max);
  return { background: 'var(--primary)', opacity };
}

// Kalender Ibadah — a real month-grid view combining sholat/tilawah/dzikir/
// login-poin (via amalanHarian's own daily score) with puasa sunnah days
// overlaid as a small dot, in one calendar someone can actually flip
// through month by month. Distinct from AmalanHeatmap.jsx's rolling
// 5-week strip on Home (always "recent", no navigation) and
// PuasaSunnah.jsx's own calendar (only tracks that one habit) — this is
// the first place all of it shows up together, month by month.
export default function KalenderIbadah() {
  const { user } = useAuth();
  const [viewMonth, setViewMonth] = useState(() => {
    const d = new Date();
    return new Date(d.getFullYear(), d.getMonth(), 1);
  });
  const [days, setDays] = useState(null);
  const [puasaDates, setPuasaDates] = useState([]);

  useEffect(() => {
    if (!user?.uid) return;
    setDays(null);
    fetchAmalanHarianForMonth(user.uid, viewMonth.getFullYear(), viewMonth.getMonth()).then(setDays);
  }, [user?.uid, viewMonth]);

  useEffect(() => watchPuasaSunnahLog(user?.uid, (v) => setPuasaDates(v || [])), [user?.uid]);

  if (!user) {
    return (
      <div className="screen">
        <div className="screen-content">
          <PageHeaderPhoto title="Kalender Ibadah" photo={PAGE_PHOTOS.zakat} />
          <EmptyState icon="🕌" title="Masuk dulu ya" subtitle="Kalender ibadah cuma bisa dilihat setelah kamu masuk akun." />
        </div>
      </div>
    );
  }

  const year = viewMonth.getFullYear();
  const month = viewMonth.getMonth();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDow = new Date(year, month, 1).getDay();
  const scoreByDate = new Map((days || []).map((d) => [d.dateKey, d]));
  const puasaSet = new Set(puasaDates);
  const cells = [...Array(firstDow).fill(null), ...Array.from({ length: daysInMonth }, (_, i) => i + 1)];

  return (
    <div className="screen">
      <div className="screen-content">
        <PageHeaderPhoto title="Kalender Ibadah" photo={PAGE_PHOTOS.zakat} subtitle="Sholat, tilawah, dzikir & puasa sunnah dalam satu kalender" />

        <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: 10, padding: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <button
              onClick={() => setViewMonth((d) => new Date(d.getFullYear(), d.getMonth() - 1, 1))}
              aria-label="Bulan sebelumnya"
              style={{ background: 'none', border: 'none', color: 'var(--muted)', cursor: 'pointer', padding: 6, fontSize: 15 }}
            >
              ←
            </button>
            <span style={{ fontSize: 13, fontWeight: 800 }}>{MONTH_FMT.format(viewMonth)}</span>
            <button
              onClick={() => setViewMonth((d) => new Date(d.getFullYear(), d.getMonth() + 1, 1))}
              aria-label="Bulan berikutnya"
              style={{ background: 'none', border: 'none', color: 'var(--muted)', cursor: 'pointer', padding: 6, fontSize: 15 }}
            >
              →
            </button>
          </div>

          {days === null ? (
            <div className="center" style={{ minHeight: 180 }}>
              <div className="spinner" />
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 5 }}>
              {WEEKDAY_LABELS.map((w, i) => (
                <span key={i} style={{ textAlign: 'center', fontSize: 9.5, fontWeight: 700, color: 'var(--muted)' }}>{w}</span>
              ))}
              {cells.map((day, i) => {
                if (!day) return <span key={i} />;
                const dateKey = `${year}-${pad2(month + 1)}-${pad2(day)}`;
                const entry = scoreByDate.get(dateKey);
                const isPuasa = puasaSet.has(dateKey);
                return (
                  <div
                    key={i}
                    title={entry ? `${dateKey}: ${entry.score}/${entry.max} poin${isPuasa ? ' · Puasa Sunnah' : ''}` : dateKey}
                    style={{
                      position: 'relative',
                      aspectRatio: '1',
                      borderRadius: 8,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: 10,
                      fontWeight: 700,
                      color: 'var(--ink)',
                      ...(entry ? cellStyle(entry.score, entry.max) : { background: 'var(--card)', border: '1px dashed var(--border)' }),
                    }}
                  >
                    {day}
                    {isPuasa && (
                      <span style={{ position: 'absolute', bottom: 2, right: 2, width: 6, height: 6, borderRadius: '50%', background: 'var(--gold-ink)', border: '1px solid #fff' }} />
                    )}
                  </div>
                );
              })}
            </div>
          )}

          <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginTop: 4 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
              <span style={{ width: 10, height: 10, borderRadius: 3, background: 'var(--primary)' }} />
              <span style={{ fontSize: 10, color: 'var(--muted)' }}>Poin harian (dari {DAILY_POINTS_MAX})</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
              <span style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--gold-ink)' }} />
              <span style={{ fontSize: 10, color: 'var(--muted)' }}>Puasa Sunnah</span>
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10, padding: '13px 14px', borderRadius: 14, background: 'var(--card)' }}>
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="var(--muted)" style={{ flexShrink: 0, marginTop: 1 }}>
            <circle cx="12" cy="12" r="9" strokeWidth="1.6" /><path d="M12 11v5.5M12 8v.01" strokeWidth="1.8" strokeLinecap="round" />
          </svg>
          <span style={{ fontSize: 11, lineHeight: 1.5, color: 'var(--muted)' }}>
            Warna sel menunjukkan poin Amalan Harian (sholat, tilawah, dzikir pagi/petang, & poin login) hari itu. Titik kuning menandakan hari kamu puasa sunnah.
          </span>
        </div>
      </div>
    </div>
  );
}
