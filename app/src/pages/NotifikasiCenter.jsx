import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import EmptyState from '../components/EmptyState';
import ConfirmDialog from '../components/ConfirmDialog';
import PageHeaderPhoto from '../components/PageHeaderPhoto';
import { PAGE_PHOTOS } from '../data/photos';
import { getNotificationLog, clearNotificationLog, routeForTag, markNotificationsSeen, categoryForTag } from '../lib/notificationLog';
import { NOTIF_CATEGORIES } from '../lib/notifPrefs';
import PullToRefresh from '../components/PullToRefresh';
import ScrollToTopButton from '../components/ScrollToTopButton';
import { IconSearch } from '../components/icons';

const dateFmt = new Intl.DateTimeFormat('id-ID', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' });

const FILTER_ALL = 'semua';

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
  const [filter, setFilter] = useState(FILTER_ALL);
  const [query, setQuery] = useState('');

  const byCategory = log && (filter === FILTER_ALL ? log : log.filter((n) => categoryForTag(n.tag) === filter));
  const q = query.trim().toLowerCase();
  const filteredLog = byCategory && (q ? byCategory.filter((n) => n.title?.toLowerCase().includes(q) || n.body?.toLowerCase().includes(q)) : byCategory);
  // Only show a category chip if the log actually has an entry for it —
  // no point offering to filter by "Konten Harian" if nothing of that
  // category has ever arrived on this device.
  const presentCategories = log ? NOTIF_CATEGORIES.filter((c) => log.some((n) => categoryForTag(n.tag) === c.key)) : [];

  useEffect(() => {
    getNotificationLog().then(setLog);
    markNotificationsSeen();
  }, []);

  function refresh() {
    return getNotificationLog().then(setLog);
  }

  async function handleClear() {
    await clearNotificationLog();
    setLog([]);
    setShowClearConfirm(false);
  }

  return (
    <div className="screen">
      <div className="screen-content">
      <PullToRefresh onRefresh={refresh}>
        <PageHeaderPhoto
          title="Notifikasi"
          photo={PAGE_PHOTOS.notifikasi}
          right={
            log?.length > 0 && (
              <button
                onClick={() => setShowClearConfirm(true)}
                className="icon-btn"
                aria-label="Hapus semua notifikasi"
                style={{ background: 'rgba(255,255,255,0.22)', color: '#fff' }}
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

        {log && log.length > 3 && (
          <div className="input-row" style={{ borderRadius: 999 }}>
            <IconSearch style={{ color: 'var(--muted)' }} />
            <input placeholder="Cari notifikasi…" value={query} onChange={(e) => setQuery(e.target.value)} />
          </div>
        )}

        {log && log.length > 0 && presentCategories.length > 1 && (
          <div className="hide-scrollbar" style={{ display: 'flex', gap: 8, overflowX: 'auto' }}>
            <button
              onClick={() => setFilter(FILTER_ALL)}
              style={{ flexShrink: 0, padding: '7px 14px', borderRadius: 999, border: 'none', fontSize: 12, fontWeight: 700, cursor: 'pointer', color: filter === FILTER_ALL ? 'var(--on-primary)' : 'var(--ink)', background: filter === FILTER_ALL ? 'var(--primary)' : 'var(--card)' }}
            >
              Semua
            </button>
            {presentCategories.map((c) => (
              <button
                key={c.key}
                onClick={() => setFilter(c.key)}
                style={{ flexShrink: 0, padding: '7px 14px', borderRadius: 999, border: 'none', fontSize: 12, fontWeight: 700, cursor: 'pointer', color: filter === c.key ? 'var(--on-primary)' : 'var(--ink)', background: filter === c.key ? 'var(--primary)' : 'var(--card)' }}
              >
                {c.label}
              </button>
            ))}
          </div>
        )}

        {log && log.length > 0 && filteredLog.length === 0 && (
          <p className="state-msg">{q ? `Gak ketemu notifikasi yang cocok dengan "${query}".` : 'Gak ada notifikasi di kategori ini.'}</p>
        )}

        {log && filteredLog?.length > 0 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {filteredLog.map((n) => (
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
      </PullToRefresh>
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
      <ScrollToTopButton />
    </div>
  );
}
