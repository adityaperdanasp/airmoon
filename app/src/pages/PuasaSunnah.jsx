import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { watchPuasaSunnahLog, markPuasaSunnah, unmarkPuasaSunnah, todayDateKey } from '../lib/puasaSunnahLog';
import PageHeaderPhoto from '../components/PageHeaderPhoto';
import { PAGE_PHOTOS } from '../data/photos';

const MONTH_FMT = new Intl.DateTimeFormat('id-ID', { month: 'long', year: 'numeric' });
const DAY_FMT = new Intl.DateTimeFormat('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });

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
  const today = todayDateKey();
  const isMarkedToday = dates?.includes(today);

  useEffect(() => watchPuasaSunnahLog(user?.uid, setDates), [user?.uid]);

  async function handleToggleToday() {
    if (!user) return;
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
  const totalCount = dates?.length || 0;

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
          <div className="card" style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 3, padding: 16, alignItems: 'center' }}>
            <span style={{ fontSize: 22, fontWeight: 800, color: 'var(--gold-ink)' }}>{totalCount}</span>
            <span style={{ fontSize: 10.5, color: 'var(--muted)', textAlign: 'center' }}>Total Sepanjang Waktu</span>
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

        {dates && dates.length > 0 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <span className="section-label" style={{ color: 'var(--muted)', fontSize: 11.5, letterSpacing: '0.04em', textTransform: 'uppercase' }}>
              Riwayat
            </span>
            {dates.slice(0, 30).map((d) => (
              <div key={d} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 14px', borderRadius: 12, background: 'var(--card)' }}>
                <span style={{ fontSize: 12.5, fontWeight: 600 }}>{DAY_FMT.format(new Date(`${d}T00:00:00`))}</span>
                {d === today && (
                  <button
                    onClick={handleToggleToday}
                    style={{ background: 'none', border: 'none', color: 'var(--danger)', fontSize: 11, textDecoration: 'underline', cursor: 'pointer', padding: 0 }}
                  >
                    Batal
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
