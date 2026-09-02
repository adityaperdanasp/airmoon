import { useEffect, useState } from 'react';
import { useLang } from '../context/LangContext';
import PageHeaderPhoto from '../components/PageHeaderPhoto';
import { PAGE_PHOTOS } from '../data/photos';
import ErrorRetry from '../components/ErrorRetry';

const WEEKDAY_KEYS = ['weekday_min', 'weekday_sen', 'weekday_sel', 'weekday_rab', 'weekday_kam', 'weekday_jum', 'weekday_sab'];

export default function KalenderHijriah() {
  const { t, lang } = useLang();
  const [cursor, setCursor] = useState(() => {
    const d = new Date();
    return { month: d.getMonth() + 1, year: d.getFullYear() };
  });
  const [days, setDays] = useState(null);
  const [error, setError] = useState('');
  const [retryTick, setRetryTick] = useState(0);

  useEffect(() => {
    setDays(null);
    setError('');
    // Routed through /api/aladhan (Vercel) — api.aladhan.com's IPv6 endpoint
    // hangs/times out for clients on IPv6-preferring networks (verified with
    // curl -6 vs -4); the proxy calls it from Vercel's own network instead.
    fetch(`https://airmoon.vercel.app/api/aladhan?type=hijri-calendar&month=${cursor.month}&year=${cursor.year}`)
      .then((r) => r.json())
      .then((json) => setDays(json.data))
      // eslint-disable-next-line react-hooks/exhaustive-deps -- t() is re-created every
      // render (LangContext doesn't memoize it); including it here would refire this
      // fetch on every render instead of only when the month/year cursor changes.
      .catch(() => setError(t('kalender_error')));
  }, [cursor, retryTick]);

  function shiftMonth(delta) {
    setCursor(({ month, year }) => {
      let m = month + delta;
      let y = year;
      if (m > 12) { m = 1; y += 1; }
      if (m < 1) { m = 12; y -= 1; }
      return { month: m, year: y };
    });
  }

  const today = new Date();
  const isCurrentMonth = today.getMonth() + 1 === cursor.month && today.getFullYear() === cursor.year;
  const leadingBlanks = days ? new Date(cursor.year, cursor.month - 1, 1).getDay() : 0;
  const monthLabel = days?.[0]?.hijri?.month?.en;
  const hijriYear = days?.[0]?.hijri?.year;

  return (
    <div className="screen">
      <div className="screen-content">
        <PageHeaderPhoto title={t('item_kalender_hijriah')} photo={PAGE_PHOTOS.kalenderHijriah} />

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 16px', borderRadius: 16, background: 'var(--primary)' }}>
          <button onClick={() => shiftMonth(-1)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--on-primary)' }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--on-primary)"><path d="m15 5-7 7 7 7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
          </button>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <span style={{ fontSize: 15, fontWeight: 800, color: 'var(--on-primary)' }}>
              {monthLabel ? `${monthLabel} ${hijriYear} H` : '…'}
            </span>
            <span style={{ fontSize: 11, color: 'var(--accent)' }}>
              {new Date(cursor.year, cursor.month - 1).toLocaleDateString(lang === 'en' ? 'en-US' : 'id-ID', { month: 'long', year: 'numeric' })}
            </span>
          </div>
          <button onClick={() => shiftMonth(1)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--on-primary)' }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--on-primary)"><path d="m9 5 7 7-7 7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
          </button>
        </div>

        {error && <ErrorRetry message={error} onRetry={() => setRetryTick((n) => n + 1)} />}

        {days && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, minmax(0, 1fr))', gap: 4 }}>
            {WEEKDAY_KEYS.map((wk) => (
              <div key={wk} className="center" style={{ padding: '8px 2px' }}>
                <span style={{ fontSize: 10, fontWeight: 700, color: 'var(--muted-soft)' }}>{t(wk)}</span>
              </div>
            ))}
            {Array.from({ length: leadingBlanks }).map((_, i) => <div key={`b${i}`} />)}
            {days.map((d) => {
              const gDay = Number(d.gregorian.day);
              const isToday = isCurrentMonth && gDay === today.getDate();
              return (
                <div
                  key={d.gregorian.date}
                  className="center"
                  style={{
                    flexDirection: 'column',
                    gap: 2,
                    padding: '8px 2px',
                    borderRadius: 10,
                    background: isToday ? 'var(--primary)' : 'var(--card)',
                  }}
                >
                  <span style={{ fontSize: 13, fontWeight: isToday ? 800 : 700, color: isToday ? 'var(--on-primary)' : 'var(--ink)' }}>{d.hijri.day}</span>
                  <span style={{ fontSize: 8.5, color: isToday ? 'var(--accent)' : 'var(--muted-soft)' }}>{gDay} {d.gregorian.month.en.slice(0, 3)}</span>
                </div>
              );
            })}
          </div>
        )}

        {!days && !error && <div className="center" style={{ minHeight: 200 }}><div className="spinner" /></div>}
      </div>
    </div>
  );
}
