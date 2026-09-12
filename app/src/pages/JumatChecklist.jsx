import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import TopBar from '../components/TopBar';
import { JUMAT_ITEMS, todayDateKey, watchJumatChecklist, setJumatChecklistItem } from '../lib/jumatChecklist';

const dateFmt = new Intl.DateTimeFormat('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });

// Checklist Sunnah Jumat (2026-09-12) — a weekly Friday sunnah checklist,
// distinct from check-campaign-deadlines.js's own Al-Kahf-only push
// reminder (checkJumatReminder), which just nudges without a way to
// actually record anything. Always shows today's date regardless of
// whether today is actually Friday — someone catching up on a missed
// Friday, or checking in early, shouldn't be blocked from using it.
export default function JumatChecklist() {
  const { user } = useAuth();
  const dateKey = todayDateKey();
  const [checklist, setChecklist] = useState({});

  useEffect(() => watchJumatChecklist(user?.uid, dateKey, setChecklist), [user?.uid, dateKey]);

  const doneCount = JUMAT_ITEMS.filter((item) => checklist[item.key]).length;
  const isFriday = new Date().getDay() === 5;

  return (
    <div className="screen">
      <div className="screen-content">
        <TopBar title="Checklist Sunnah Jumat" />

        <div className="card" style={{ padding: 16, display: 'flex', flexDirection: 'column', gap: 4 }}>
          <span style={{ fontSize: 13, fontWeight: 700 }}>{dateFmt.format(new Date())}</span>
          <span style={{ fontSize: 11, color: 'var(--muted)' }}>
            {isFriday ? `${doneCount}/${JUMAT_ITEMS.length} sunnah tercatat hari ini` : 'Bukan hari Jumat — checklist ini tetap bisa dicoret kapan aja.'}
          </span>
        </div>

        {!user ? (
          <p className="state-msg">Masuk dulu buat nyimpen checklist Jumat kamu.</p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {JUMAT_ITEMS.map((item) => {
              const checked = !!checklist[item.key];
              return (
                <button
                  key={item.key}
                  onClick={() => setJumatChecklistItem(user.uid, dateKey, item.key, !checked)}
                  className="card"
                  style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '14px 16px', border: 'none', background: 'var(--card)', textAlign: 'left', cursor: 'pointer', font: 'inherit', color: 'inherit', width: '100%' }}
                >
                  <div
                    style={{
                      width: 22, height: 22, borderRadius: 7, flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center',
                      border: checked ? 'none' : '1.5px solid var(--border)',
                      background: checked ? 'var(--primary)' : 'transparent',
                    }}
                  >
                    {checked && (
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#fff"><path d="m4 12 5 5L20 6" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" /></svg>
                    )}
                  </div>
                  <span style={{ fontSize: 13, fontWeight: 700, textDecoration: checked ? 'line-through' : 'none', color: checked ? 'var(--muted)' : 'var(--ink)' }}>
                    {item.label}
                  </span>
                </button>
              );
            })}

            {checklist.alKahfi === false || checklist.alKahfi === undefined ? (
              <Link to="/quran/18" style={{ fontSize: 11.5, color: 'var(--primary)', fontWeight: 700, textAlign: 'center', textDecoration: 'none' }}>
                Buka Surah Al-Kahfi →
              </Link>
            ) : null}

            {doneCount === JUMAT_ITEMS.length && (
              <div className="card" style={{ display: 'flex', alignItems: 'center', gap: 12, padding: 16, background: 'var(--mint)' }}>
                <span style={{ fontSize: 22 }}>🕌</span>
                <span style={{ fontSize: 12.5, fontWeight: 700 }}>Sunnah Jumat lengkap hari ini — barakallahu fiik!</span>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
