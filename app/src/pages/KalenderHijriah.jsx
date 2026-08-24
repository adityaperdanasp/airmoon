import { useEffect, useState } from 'react';
import TopBar from '../components/TopBar';

const WEEKDAYS = ['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'];

export default function KalenderHijriah() {
  const [cursor, setCursor] = useState(() => {
    const d = new Date();
    return { month: d.getMonth() + 1, year: d.getFullYear() };
  });
  const [days, setDays] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    setDays(null);
    setError('');
    fetch(`https://api.aladhan.com/v1/gToHCalendar/${cursor.month}/${cursor.year}`)
      .then((r) => r.json())
      .then((json) => setDays(json.data))
      .catch(() => setError('Gagal memuat kalender.'));
  }, [cursor]);

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
        <TopBar title="Kalender Hijriah" />

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 16px', borderRadius: 16, background: 'var(--primary)' }}>
          <button onClick={() => shiftMonth(-1)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#fff' }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#fff"><path d="m15 5-7 7 7 7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
          </button>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <span style={{ fontSize: 15, fontWeight: 800, color: '#fff' }}>
              {monthLabel ? `${monthLabel} ${hijriYear} H` : '…'}
            </span>
            <span style={{ fontSize: 11, color: 'var(--accent)' }}>
              {new Date(cursor.year, cursor.month - 1).toLocaleDateString('id-ID', { month: 'long', year: 'numeric' })}
            </span>
          </div>
          <button onClick={() => shiftMonth(1)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#fff' }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#fff"><path d="m9 5 7 7-7 7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
          </button>
        </div>

        {error && <p className="state-msg">{error}</p>}

        {days && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, minmax(0, 1fr))', gap: 4 }}>
            {WEEKDAYS.map((w) => (
              <div key={w} className="center" style={{ padding: '8px 2px' }}>
                <span style={{ fontSize: 10, fontWeight: 700, color: 'var(--muted-soft)' }}>{w}</span>
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
                  <span style={{ fontSize: 13, fontWeight: isToday ? 800 : 700, color: isToday ? '#fff' : 'var(--ink)' }}>{d.hijri.day}</span>
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
