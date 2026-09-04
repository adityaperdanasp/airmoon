import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { doc, onSnapshot } from 'firebase/firestore';
import { usePrayerTimes } from '../lib/usePrayerTimes';
import { useAuth } from '../context/AuthContext';
import { enablePrayerNotifications, disablePrayerNotifications, isNativeApp, LEAD_MINUTE_OPTIONS, setNotifLeadMinutes } from '../lib/notifications';
import { db } from '../lib/firebase';
import PageHeaderPhoto from '../components/PageHeaderPhoto';
import { PAGE_PHOTOS } from '../data/photos';
import BottomNav from '../components/BottomNav';
import NotificationPrimer from '../components/NotificationPrimer';
import { SkeletonCard } from '../components/Skeleton';
import LocationSearch from '../components/LocationSearch';
import { PRAYER_METHODS } from '../lib/prayerMethod';

// Background push (works with the app closed) — Firestore's notifEnabled
// flag is the source of truth, kept live via onSnapshot so a toggle flipped
// on another device shows up here too. See lib/notifications.js for the
// FCM registration itself and api/send-prayer-notifications.js for the
// server side that actually fires the push at prayer time.
function useNotifyToggle(uid, location) {
  const [enabled, setEnabled] = useState(false);
  const [leadMinutes, setLeadMinutes] = useState(0);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!uid) return;
    return onSnapshot(doc(db, 'users', uid), (snap) => {
      setEnabled(!!snap.data()?.notifEnabled);
      setLeadMinutes(snap.data()?.notifLeadMinutes || 0);
    });
  }, [uid]);

  async function toggle() {
    if (!uid || busy) return;
    setBusy(true);
    setError('');
    try {
      if (enabled) {
        await disablePrayerNotifications(uid);
      } else {
        if (!location) throw new Error('Tunggu lokasi kedeteksi dulu ya.');
        await enablePrayerNotifications(uid, location);
      }
    } catch (err) {
      setError(err.message || 'Gagal mengubah notifikasi.');
    } finally {
      setBusy(false);
    }
  }

  return { enabled, toggle, busy, error, leadMinutes };
}

export default function JadwalSholat() {
  const { user } = useAuth();
  const { status, data, next, prayerOrder, prayerLabel, override, setOverride, method, setMethod } = usePrayerTimes();
  const [methodOpen, setMethodOpen] = useState(false);
  const location = data ? { lat: data.lat, lng: data.lng } : null;
  const { enabled, toggle, busy, error: notifError, leadMinutes } = useNotifyToggle(user?.uid, location);
  const adzanSound = localStorage.getItem('airmoon-adzan-sound') || 'Adzan Makkah';
  const [showPrimer, setShowPrimer] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  // Prime before the browser's own permission prompt, but only the very
  // first time — once `Notification.permission` is anything other than
  // 'default' (already granted or denied), the OS-level dialog won't fire
  // again anyway, so re-explaining would just be an extra tap for nothing.
  // isNativeApp() has its own separate native permission flow (Android's
  // POST_NOTIFICATIONS, requested by MainActivity.kt, not this JS path) —
  // this priming screen has nothing to gate there.
  function handleToggleClick() {
    const needsPriming =
      !enabled &&
      !isNativeApp() &&
      typeof Notification !== 'undefined' &&
      Notification.permission === 'default';
    if (needsPriming) {
      setShowPrimer(true);
      return;
    }
    toggle();
  }

  return (
    <div className="screen">
      <div className="screen-content">
        <PageHeaderPhoto
          title="Jadwal Sholat"
          photo={PAGE_PHOTOS.jadwalSholat}
          subtitle={
            <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.85)">
                <path d="M12 21s-6.5-6.1-6.5-11A6.5 6.5 0 0 1 18.5 10c0 4.9-6.5 11-6.5 11Z" strokeWidth="1.7" strokeLinejoin="round" />
              </svg>
              <span>{data ? data.locationLabel : status === 'denied' ? 'Lokasi tidak diizinkan' : 'Mendeteksi lokasi…'}</span>
              {data && (
                <span style={{ fontSize: 9, fontWeight: 700, padding: '2px 6px', borderRadius: 999, color: '#0d4d47', background: '#fff' }}>
                  {override ? 'Manual' : 'GPS'}
                </span>
              )}
            </div>
          }
        />

        {!searchOpen ? (
          <button
            onClick={() => setSearchOpen(true)}
            style={{ background: 'none', border: 'none', color: 'var(--primary)', fontSize: 11.5, fontWeight: 700, cursor: 'pointer', padding: 0, alignSelf: 'flex-start' }}
          >
            📍 Ganti Lokasi
          </button>
        ) : (
          <LocationSearch
            onPick={(loc) => {
              setOverride(loc);
              setSearchOpen(false);
            }}
            onUseGps={() => {
              setOverride(null);
              setSearchOpen(false);
            }}
            onClose={() => setSearchOpen(false)}
          />
        )}

        {!methodOpen ? (
          <button
            onClick={() => setMethodOpen(true)}
            style={{ background: 'none', border: 'none', color: 'var(--primary)', fontSize: 11.5, fontWeight: 700, cursor: 'pointer', padding: 0, alignSelf: 'flex-start' }}
          >
            🕌 Metode: {PRAYER_METHODS.find((m) => m.id === method)?.label || 'Kemenag RI'}
          </button>
        ) : (
          <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: 8, padding: 14 }}>
            <span style={{ fontSize: 11.5, fontWeight: 700 }}>Metode Perhitungan</span>
            {PRAYER_METHODS.map((m) => (
              <button
                key={m.id}
                onClick={() => {
                  setMethod(m.id);
                  setMethodOpen(false);
                }}
                style={{
                  textAlign: 'left',
                  padding: '10px 12px',
                  borderRadius: 10,
                  border: 'none',
                  background: method === m.id ? 'var(--mint)' : 'transparent',
                  cursor: 'pointer',
                  fontFamily: 'inherit',
                }}
              >
                <div style={{ fontSize: 12.5, fontWeight: 700, color: method === m.id ? 'var(--primary)' : 'var(--ink)' }}>{m.label}</div>
                <div style={{ fontSize: 10.5, color: 'var(--muted)' }}>{m.sub}</div>
              </button>
            ))}
            <button className="btn-outline" style={{ marginTop: 4 }} onClick={() => setMethodOpen(false)}>
              Tutup
            </button>
          </div>
        )}

        {status === 'denied' && (
          <div className="card" style={{ padding: 16, fontSize: 12.5, lineHeight: 1.5 }}>
            Akses lokasi ditolak. Izinkan lokasi di pengaturan browser buat lihat jadwal sholat sesuai posisi kamu.
          </div>
        )}

        {status === 'error' && (
          <div className="card" style={{ padding: 16, fontSize: 12.5, lineHeight: 1.5 }}>
            Gagal memuat jadwal sholat. Coba refresh halaman.
          </div>
        )}

        {status === 'ready' && data && next && (
          <>
            <div style={{ borderRadius: 22, padding: '22px 20px', textAlign: 'center', background: `linear-gradient(135deg, var(--primary), var(--primary-dark))` }}>
              <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.04em', textTransform: 'uppercase', color: 'var(--accent)' }}>
                {next.label} dalam
              </div>
              <div style={{ fontSize: 34, fontWeight: 800, color: '#fff', marginTop: 6 }}>{next.countdown}</div>
              <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.75)', marginTop: 6 }}>
                {data.hijri.day} {data.hijri.month.en} {data.hijri.year} H
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {prayerOrder.map((key) => {
                const isNext = key === next.key;
                return (
                  <div
                    key={key}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '13px 16px',
                      borderRadius: 16,
                      background: isNext ? 'var(--primary)' : 'var(--card)',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      {isNext && <div style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--accent)' }} />}
                      <span style={{ fontSize: 13.5, fontWeight: 700, color: isNext ? 'var(--on-primary)' : 'var(--ink)' }}>{prayerLabel[key]}</span>
                    </div>
                    <span style={{ fontSize: 14, fontWeight: 700, color: isNext ? 'var(--on-primary)' : 'var(--ink)' }}>{data.timings[key]}</span>
                  </div>
                );
              })}
            </div>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, padding: '14px 16px', borderRadius: 18, border: '1px solid var(--border)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{ width: 36, height: 36, borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, background: 'var(--mint)' }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--primary)">
                    <path d="M12 2a6 6 0 0 0-6 6v3.09c0 .58-.2 1.14-.57 1.59L4 15h16l-1.43-2.32a2.6 2.6 0 0 1-.57-1.59V8a6 6 0 0 0-6-6Z" strokeWidth="1.6" strokeLinejoin="round" />
                  </svg>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                  <span style={{ fontSize: 13, fontWeight: 700 }}>Notifikasi Adzan</span>
                  <span style={{ fontSize: 11, color: 'var(--muted)' }}>
                    {busy ? 'Memproses…' : enabled ? '5x sehari, jalan walau app ketutup' : 'Nonaktif'}
                  </span>
                </div>
              </div>
              <button
                onClick={handleToggleClick}
                disabled={busy}
                style={{
                  width: 42,
                  height: 24,
                  borderRadius: 999,
                  padding: 2,
                  display: 'flex',
                  justifyContent: enabled ? 'flex-end' : 'flex-start',
                  flexShrink: 0,
                  background: enabled ? 'var(--primary)' : 'var(--border)',
                  border: 'none',
                  cursor: busy ? 'default' : 'pointer',
                  opacity: busy ? 0.6 : 1,
                }}
                aria-label="Toggle notifikasi adzan"
              >
                <div style={{ width: 20, height: 20, borderRadius: '50%', background: '#fff' }} />
              </button>
            </div>

            {enabled && (
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 10, padding: '12px 16px', borderRadius: 18, border: '1px solid var(--border)' }}>
                <span style={{ fontSize: 12, color: 'var(--muted)' }}>Ingatkan berapa menit sebelum waktu sholat?</span>
                <div style={{ display: 'flex', gap: 6 }}>
                  {LEAD_MINUTE_OPTIONS.map((m) => (
                    <button
                      key={m}
                      onClick={() => user && setNotifLeadMinutes(user.uid, m)}
                      style={{
                        padding: '6px 10px',
                        borderRadius: 999,
                        fontSize: 11,
                        fontWeight: 700,
                        border: leadMinutes === m ? 'none' : '1px solid var(--border)',
                        background: leadMinutes === m ? 'var(--primary)' : 'var(--card)',
                        color: leadMinutes === m ? 'var(--on-primary)' : 'var(--ink)',
                        cursor: 'pointer',
                      }}
                    >
                      {m === 0 ? 'Pas waktu' : `${m}m`}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {notifError && (
              <p style={{ margin: 0, fontSize: 11.5, color: 'var(--danger)' }}>{notifError}</p>
            )}

            <Link
              to="/jadwal-sholat/adzan"
              style={{ textDecoration: 'none', color: 'inherit', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, padding: '14px 16px', borderRadius: 18, border: '1px solid var(--border)' }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{ width: 36, height: 36, borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, background: 'var(--cream)' }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--gold-ink)">
                    <path d="M11 5 6 9H3v6h3l5 4V5Z" strokeWidth="1.6" strokeLinejoin="round" />
                    <path d="M15.5 9a4.5 4.5 0 0 1 0 6" strokeWidth="1.6" strokeLinecap="round" />
                  </svg>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                  <span style={{ fontSize: 13, fontWeight: 700 }}>Suara Adzan</span>
                  <span style={{ fontSize: 11, color: 'var(--muted)' }}>{adzanSound}</span>
                </div>
              </div>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--muted)"><path d="m9 6 6 6-6 6" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg>
            </Link>
          </>
        )}

        {status === 'loading' && (
          <>
            <SkeletonCard height={112} radius={22} />
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {Array.from({ length: 5 }).map((_, i) => (
                <SkeletonCard key={i} height={48} radius={16} />
              ))}
            </div>
          </>
        )}
      </div>
      <BottomNav />

      {showPrimer && (
        <NotificationPrimer
          onCancel={() => setShowPrimer(false)}
          onConfirm={() => {
            setShowPrimer(false);
            toggle();
          }}
        />
      )}
    </div>
  );
}
