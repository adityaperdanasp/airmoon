import { useEffect, useState } from 'react';
import { useLang } from '../context/LangContext';
import { useAuth } from '../context/AuthContext';
import { usePrayerTimes } from '../lib/usePrayerTimes';
import { useRamadanTracker } from '../lib/useRamadanTracker';
import { isRamadan, nextRamadanYear, fetchRamadanStart, daysBetween } from '../lib/ramadan';
import TopBar from '../components/TopBar';

function Toggle({ checked, onChange }) {
  return (
    <button
      onClick={() => onChange(!checked)}
      style={{
        width: 42,
        height: 24,
        borderRadius: 999,
        padding: 2,
        display: 'flex',
        justifyContent: checked ? 'flex-end' : 'flex-start',
        flexShrink: 0,
        background: checked ? 'var(--primary)' : 'var(--border)',
        border: 'none',
        cursor: 'pointer',
      }}
      aria-label="toggle"
    >
      <div style={{ width: 20, height: 20, borderRadius: '50%', background: '#fff' }} />
    </button>
  );
}

function parseTimeToday(hhmm) {
  const [h, m] = hhmm.split(':').map(Number);
  const d = new Date();
  d.setHours(h, m, 0, 0);
  return d;
}

function useCountdown() {
  const [now, setNow] = useState(new Date());
  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);
  return now;
}

function RamadanCountdown({ hijri, t }) {
  const [state, setState] = useState('loading'); // loading | error | ready
  const [info, setInfo] = useState(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const year = nextRamadanYear(hijri.month.number, Number(hijri.year));
        const start = await fetchRamadanStart(year);
        if (cancelled) return;
        setInfo({ year, start, days: daysBetween(new Date(), start) });
        setState('ready');
      } catch {
        if (!cancelled) setState('error');
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [hijri.month.number, hijri.year]);

  if (state === 'loading') {
    return (
      <div className="center" style={{ minHeight: 160 }}>
        <div className="spinner" />
      </div>
    );
  }

  if (state === 'error') {
    return (
      <div className="card" style={{ padding: 16, fontSize: 12.5, lineHeight: 1.5 }}>
        {t('ramadan_countdown_error')}
      </div>
    );
  }

  return (
    <div style={{ borderRadius: 22, padding: '26px 20px', textAlign: 'center', background: `linear-gradient(135deg, var(--primary), var(--primary-dark))` }}>
      <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.04em', textTransform: 'uppercase', color: 'var(--accent)' }}>
        {t('ramadan_menuju')} {info.year}H
      </div>
      <div style={{ fontSize: 40, fontWeight: 800, color: '#fff', marginTop: 8 }}>{info.days}</div>
      <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.75)', marginTop: 4 }}>{t('ramadan_hari_lagi')}</div>
      <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.6)', marginTop: 10 }}>
        {info.start.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
      </div>
    </div>
  );
}

export default function ModeRamadan() {
  const { t } = useLang();
  const { user } = useAuth();
  const { status, data } = usePrayerTimes();
  const now = useCountdown();

  const inRamadan = data ? isRamadan(data.hijri.month.number) : false;
  const hijriYear = data ? Number(data.hijri.year) : null;
  const tracker = useRamadanTracker(inRamadan ? user?.uid : null, hijriYear);

  let imsakBukaLabel = null;
  let imsakBukaCountdown = null;
  if (inRamadan && data) {
    const imsak = parseTimeToday(data.timings.Imsak);
    const maghrib = parseTimeToday(data.timings.Maghrib);
    if (now < imsak) {
      imsakBukaLabel = t('ramadan_menuju_imsak');
      imsakBukaCountdown = imsak;
    } else if (now < maghrib) {
      imsakBukaLabel = t('ramadan_menuju_buka');
      imsakBukaCountdown = maghrib;
    }
  }

  let countdownText = null;
  if (imsakBukaCountdown) {
    const diff = Math.max(0, imsakBukaCountdown - now);
    const h = Math.floor(diff / 3600000);
    const m = Math.floor((diff % 3600000) / 60000);
    const s = Math.floor((diff % 60000) / 1000);
    countdownText = `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  }

  const monthDays = data?.hijri.month.days || 30;
  const today = data ? Number(data.hijri.day) : null;

  return (
    <div className="screen">
      <div className="screen-content">
        <TopBar title={t('ramadan_title')} />

        {status === 'loading' && (
          <div className="center" style={{ minHeight: 240 }}>
            <div className="spinner" />
          </div>
        )}

        {status === 'denied' && (
          <div className="card" style={{ padding: 16, fontSize: 12.5, lineHeight: 1.5 }}>
            {t('ramadan_loc_denied')}
          </div>
        )}

        {status === 'error' && (
          <div className="card" style={{ padding: 16, fontSize: 12.5, lineHeight: 1.5 }}>
            {t('ramadan_loc_error')}
          </div>
        )}

        {status === 'ready' && data && !inRamadan && <RamadanCountdown hijri={data.hijri} t={t} />}

        {status === 'ready' && data && inRamadan && (
          <>
            <div style={{ borderRadius: 22, padding: '22px 20px', textAlign: 'center', background: `linear-gradient(135deg, var(--primary), var(--primary-dark))` }}>
              <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.04em', textTransform: 'uppercase', color: 'var(--accent)' }}>
                {t('ramadan_hari_ke')} {today} / {monthDays}
              </div>
              {countdownText ? (
                <>
                  <div style={{ fontSize: 30, fontWeight: 800, color: '#fff', marginTop: 8 }}>{countdownText}</div>
                  <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.75)', marginTop: 4 }}>{imsakBukaLabel}</div>
                </>
              ) : (
                <div style={{ fontSize: 16, fontWeight: 700, color: '#fff', marginTop: 8 }}>{t('ramadan_buka_lewat')}</div>
              )}
            </div>

            <div style={{ display: 'flex', gap: 10 }}>
              <div className="card" style={{ flex: 1, padding: 14, textAlign: 'center' }}>
                <div style={{ fontSize: 10, fontWeight: 700, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.03em' }}>{t('imsak')}</div>
                <div style={{ fontSize: 20, fontWeight: 800, marginTop: 4 }}>{data.timings.Imsak}</div>
              </div>
              <div className="card" style={{ flex: 1, padding: 14, textAlign: 'center' }}>
                <div style={{ fontSize: 10, fontWeight: 700, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.03em' }}>{t('buka_puasa')}</div>
                <div style={{ fontSize: 20, fontWeight: 800, marginTop: 4 }}>{data.timings.Maghrib}</div>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '13px 16px', borderRadius: 16, background: 'var(--card)' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                  <span style={{ fontSize: 13, fontWeight: 700 }}>{t('ramadan_puasa_hari_ini')}</span>
                  <span style={{ fontSize: 11, color: 'var(--muted)' }}>{t('ramadan_puasa_tercatat')} {tracker.puasaCount}/{monthDays}</span>
                </div>
                <Toggle checked={!!tracker.puasa[today]} onChange={(v) => tracker.setDay('puasa', today, v)} />
              </div>

              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '13px 16px', borderRadius: 16, background: 'var(--card)' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                  <span style={{ fontSize: 13, fontWeight: 700 }}>{t('ramadan_tarawih_malam_ini')}</span>
                  <span style={{ fontSize: 11, color: 'var(--muted)' }}>{t('ramadan_tarawih_tercatat')} {tracker.tarawihCount}/{monthDays}</span>
                </div>
                <Toggle checked={!!tracker.tarawih[today]} onChange={(v) => tracker.setDay('tarawih', today, v)} />
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
