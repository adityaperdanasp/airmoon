import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import TopBar from '../components/TopBar';
import EmptyState from '../components/EmptyState';
import ConfirmDialog from '../components/ConfirmDialog';
import { getNotificationLog, clearNotificationLog, routeForTag, markNotificationsSeen } from '../lib/notificationLog';

const dateFmt = new Intl.DateTimeFormat('id-ID', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' });

// A real gap this fills: every push this app sends (adzan, doa broadcasts,
// zakat haul, Jumat Al-Kahf, Imsak, dzikir streak) only ever showed once
// in the OS notification tray — swipe it away, or have the phone
// silenced, and it was gone with no way to see what was said. This page
// reads lib/notificationLog.js's IndexedDB log, which both
// firebase-messaging-sw.js's background handler and
// NotificationForegroundListener's foreground handler write into.
export default function NotifikasiCenter() {
  const navigate = useNavigate();
  const [log, setLog] = useState(null);
  const [showClearConfirm, setShowClearConfirm] = useState(false);

  useEffect(() => {
    getNotificationLog().then(setLog);
    markNotificationsSeen();
  }, []);

  async function handleClear() {
    await clearNotificationLog();
    setLog([]);
    setShowClearConfirm(false);
  }

  return (
    <div className="screen">
      <div className="screen-content">
        <TopBar
          title="Notifikasi"
          right={
            log?.length > 0 && (
              <button
                onClick={() => setShowClearConfirm(true)}
                className="icon-btn"
                aria-label="Hapus semua notifikasi"
              >
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path d="M6 7h12M9 7V5a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2m2 0-.8 12.1a2 2 0 0 1-2 1.9H9.8a2 2 0 0 1-2-1.9L7 7" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
            )
          }
        />

        {log === null && (
          <div className="center" style={{ minHeight: '30vh' }}>
            <div className="spinner" />
          </div>
        )}

        {log?.length === 0 && (
          <EmptyState
            icon="🔔"
            title="Belum ada notifikasi"
            subtitle="Notifikasi yang masuk ke perangkat ini (adzan, doa, pengingat, dll) bakal muncul di sini."
          />
        )}

        {log && log.length > 0 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {log.map((n) => (
              <button
                key={n.id}
                onClick={() => navigate(routeForTag(n.tag))}
                className="card"
                style={{ display: 'flex', flexDirection: 'column', gap: 4, padding: 14, textAlign: 'left', border: 'none', cursor: 'pointer', color: 'inherit', fontFamily: 'inherit' }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8 }}>
                  <span style={{ fontSize: 13, fontWeight: 700 }}>{n.title}</span>
                  <span style={{ fontSize: 10.5, color: 'var(--muted)', flexShrink: 0 }}>{dateFmt.format(new Date(n.receivedAt))}</span>
                </div>
                {n.body && <span style={{ fontSize: 12, color: 'var(--muted)', lineHeight: 1.5 }}>{n.body}</span>}
              </button>
            ))}
          </div>
        )}
      </div>

      {showClearConfirm && (
        <ConfirmDialog
          title="Hapus semua notifikasi?"
          message="Seluruh riwayat notifikasi di perangkat ini bakal dihapus."
          confirmLabel="Ya, Hapus"
          danger
          onCancel={() => setShowClearConfirm(false)}
          onConfirm={handleClear}
        />
      )}
    </div>
  );
}
