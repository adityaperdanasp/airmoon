import { useEffect, useState } from 'react';
import { doaCategories } from '../data/doaHarian';
import { useLang } from '../context/LangContext';
import { useAuth } from '../context/AuthContext';
import { watchDzikirStreak, markDzikirDone, isDoneToday } from '../lib/dzikirStreak';
import PageHeaderPhoto from '../components/PageHeaderPhoto';
import { PAGE_PHOTOS } from '../data/photos';

// pagi/petang are real daily habits worth a streak; kegiatan (doa per
// situation — makan, keluar rumah, etc.) isn't a once-a-day thing, so it
// gets no streak UI.
const STREAK_CATEGORIES = ['pagi', 'petang'];

export default function DoaHarian() {
  const { t } = useLang();
  const { user } = useAuth();
  const [activeId, setActiveId] = useState('pagi');
  const [streaks, setStreaks] = useState({});
  const [marking, setMarking] = useState(false);
  const active = doaCategories.find((c) => c.id === activeId) ?? doaCategories[0];
  const streak = streaks[activeId];
  const doneToday = isDoneToday(streak);
  const showStreak = STREAK_CATEGORIES.includes(activeId);

  useEffect(() => watchDzikirStreak(user?.uid, setStreaks), [user?.uid]);

  async function handleMarkDone() {
    if (!user || doneToday) return;
    setMarking(true);
    try {
      await markDzikirDone(user.uid, activeId);
    } finally {
      setMarking(false);
    }
  }

  return (
    <div className="screen">
      <div className="screen-content">
        <PageHeaderPhoto title={t('item_doa_harian')} photo={PAGE_PHOTOS.doaHarian} />

        <div style={{ display: 'flex', gap: 8, overflowX: 'auto', paddingBottom: 2 }}>
          {doaCategories.map((c) => {
            const isActive = c.id === active.id;
            return (
              <button
                key={c.id}
                onClick={() => setActiveId(c.id)}
                style={{
                  flexShrink: 0,
                  padding: '9px 16px',
                  borderRadius: 999,
                  border: 'none',
                  fontFamily: 'inherit',
                  fontSize: 12.5,
                  fontWeight: 700,
                  cursor: 'pointer',
                  color: isActive ? 'var(--on-primary)' : 'var(--ink)',
                  background: isActive ? 'var(--primary)' : 'var(--card)',
                }}
              >
                {t(c.labelKey)}
              </button>
            );
          })}
        </div>

        {showStreak && (
          <div
            className="card"
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: 10,
              padding: '14px 16px',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <span style={{ fontSize: 22, lineHeight: 1 }}>🔥</span>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                <span style={{ fontSize: 13, fontWeight: 800 }}>
                  {streak?.current > 0 ? `${streak.current} hari berturut-turut` : 'Belum ada rentetan'}
                </span>
                <span style={{ fontSize: 11, color: 'var(--muted)' }}>
                  {streak?.best > 0 ? `Rekor terbaik: ${streak.best} hari` : 'Tandai selesai tiap hari biar rentetannya jalan'}
                </span>
              </div>
            </div>
            <button
              onClick={handleMarkDone}
              disabled={doneToday || marking}
              style={{
                flexShrink: 0,
                padding: '9px 14px',
                borderRadius: 999,
                border: 'none',
                fontSize: 12,
                fontWeight: 700,
                cursor: doneToday ? 'default' : 'pointer',
                color: doneToday ? 'var(--primary)' : 'var(--on-primary)',
                background: doneToday ? 'var(--mint)' : 'var(--primary)',
              }}
            >
              {doneToday ? 'Selesai ✓' : marking ? '...' : 'Tandai Selesai'}
            </button>
          </div>
        )}

        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {active.items.map((d, i) => (
            <div key={`${active.id}-${i}`} className="card" style={{ display: 'flex', flexDirection: 'column', gap: 10, padding: 16 }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8 }}>
                <span style={{ fontSize: 12.5, fontWeight: 700 }}>{d.title}</span>
                {d.repeat && (
                  <span
                    style={{
                      flexShrink: 0,
                      fontSize: 9.5,
                      fontWeight: 700,
                      padding: '3px 8px',
                      borderRadius: 999,
                      color: 'var(--primary)',
                      background: 'var(--mint)',
                    }}
                  >
                    {d.repeat}
                  </span>
                )}
              </div>
              <div style={{ fontFamily: "'Amiri', serif", fontSize: 19, lineHeight: 1.9, direction: 'rtl', textAlign: 'right' }}>
                {d.arabic}
              </div>
              {d.latin && (
                <p style={{ margin: 0, fontSize: 11.5, lineHeight: 1.55, color: 'var(--muted-soft)', fontStyle: 'italic' }}>{d.latin}</p>
              )}
              <p style={{ margin: 0, fontSize: 12, lineHeight: 1.55, color: 'var(--muted)' }}>{d.translation}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
