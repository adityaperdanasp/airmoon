import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useLang } from '../context/LangContext';
import TopBar from '../components/TopBar';
import { getRecentLainnya, markLainnyaVisited } from '../lib/recentLainnya';
import { getPinnedLainnya, togglePinLainnya, MAX_PINS_REACHED } from '../lib/pinnedLainnya';
import { useToast } from '../context/ToastContext';
import { getUnseenNotificationCount } from '../lib/notificationLog';
import { hasUnseenChangelog } from '../lib/changelogSeen';
import { SECTIONS, ALL_ITEMS } from '../components/featureCatalog';


function Tile({ it, label, badge, count, pinned, onTogglePin }) {
  return (
    <Link
      to={it.to}
      onClick={() => markLainnyaVisited(it.to)}
      onMouseEnter={it.prefetch}
      onTouchStart={it.prefetch}
      style={{
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 10,
        padding: '18px 8px',
        borderRadius: 18,
        background: 'var(--card)',
        textDecoration: 'none',
        color: 'inherit',
      }}
    >
      {onTogglePin && (
        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            onTogglePin(it.to);
          }}
          aria-label={pinned ? `Lepas pin ${label}` : `Pin ${label}`}
          style={{
            position: 'absolute',
            top: 6,
            left: 6,
            zIndex: 1,
            width: 20,
            height: 20,
            padding: 0,
            border: 'none',
            borderRadius: '50%',
            background: pinned ? 'var(--primary)' : 'rgba(0,0,0,0.08)',
            color: pinned ? 'var(--on-primary)' : 'var(--muted)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            fontSize: 10,
          }}
        >
          📌
        </button>
      )}
      <div style={{ position: 'relative', width: 48, height: 48, borderRadius: 16, overflow: 'visible', display: 'flex', alignItems: 'center', justifyContent: 'center', background: it.bg }}>
        <div style={{ width: 48, height: 48, borderRadius: 16, overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{it.node}</div>
        {/* A numeric count when there's a real number to show (unseen
            notifications), a plain pulsing dot otherwise (changelog has no
            count) — matching how a messaging app badges its icon. */}
        {count > 0 ? (
          <div
            className="unseen-dot"
            style={{
              position: 'absolute',
              top: -5,
              right: -5,
              minWidth: 17,
              height: 17,
              padding: '0 4px',
              borderRadius: 999,
              background: 'var(--danger)',
              color: '#fff',
              fontSize: 10,
              fontWeight: 800,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              border: '1.5px solid var(--card)',
            }}
          >
            {count > 9 ? '9+' : count}
          </div>
        ) : badge ? (
          <div className="unseen-dot" style={{ position: 'absolute', top: -3, right: -3, width: 9, height: 9, borderRadius: '50%', background: 'var(--danger)', border: '1.5px solid var(--card)' }} />
        ) : null}
      </div>
      <span style={{ fontSize: 11.5, fontWeight: 700, textAlign: 'center' }}>{label}</span>
    </Link>
  );
}

export default function Lainnya() {
  const { t } = useLang();
  const { showToast } = useToast();
  const [recent, setRecent] = useState([]);
  const [pinned, setPinned] = useState([]);
  const [unseenNotifCount, setUnseenNotifCount] = useState(0);
  const [hasUnseenNews, setHasUnseenNews] = useState(false);
  const [query, setQuery] = useState('');
  const [collapsed, setCollapsed] = useState({});

  useEffect(() => setRecent(getRecentLainnya()), []);
  useEffect(() => setPinned(getPinnedLainnya()), []);
  useEffect(() => {
    getUnseenNotificationCount().then(setUnseenNotifCount);
    setHasUnseenNews(hasUnseenChangelog());
  }, []);

  const recentItems = recent.map((to) => ALL_ITEMS.find((it) => it.to === to)).filter(Boolean);
  const pinnedItems = pinned.map((to) => ALL_ITEMS.find((it) => it.to === to)).filter(Boolean);
  const labelFor = (it) => (it.key ? t(it.key) : it.label);
  const badgeFor = (it) => it.to === '/yang-baru' && hasUnseenNews;
  const countFor = (it) => (it.to === '/notifikasi' ? unseenNotifCount : 0);

  function handleTogglePin(to) {
    const result = togglePinLainnya(to);
    if (result === MAX_PINS_REACHED) {
      showToast('Maksimal 6 favorit — lepas satu dulu buat pin yang baru.', { type: 'danger' });
      return;
    }
    setPinned(result);
  }

  // Search filters across every section by displayed label (translated
  // where applicable) — this grid grew to 30+ tiles across 6 sections
  // (see this file's own header comment), scanning the whole page to
  // find one feature stopped being reasonable a while ago.
  const trimmedQuery = query.trim().toLowerCase();
  const searching = trimmedQuery.length > 0;
  const filteredSections = searching
    ? SECTIONS.map((section) => ({
        ...section,
        items: section.items.filter((it) => labelFor(it).toLowerCase().includes(trimmedQuery)),
      })).filter((section) => section.items.length > 0)
    : SECTIONS;

  return (
    <div className="screen">
      <div className="screen-content">
        <TopBar title={t('lainnya_title')} />

        <div className="input-row" style={{ borderRadius: 999 }}>
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" style={{ opacity: 0.6, flexShrink: 0 }}>
            <circle cx="11" cy="11" r="7" strokeWidth="1.8" /><path d="m20 20-3.5-3.5" strokeWidth="1.8" strokeLinecap="round" />
          </svg>
          <input
            placeholder="Cari fitur di sini..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            aria-label="Cari fitur di halaman Lainnya"
          />
          {query && (
            <button onClick={() => setQuery('')} aria-label="Hapus pencarian" style={{ background: 'none', border: 'none', color: 'var(--muted)', fontSize: 16, cursor: 'pointer', padding: 0, lineHeight: 1 }}>
              ×
            </button>
          )}
        </div>

        {!searching && pinnedItems.length > 0 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            <span className="section-label" style={{ color: 'var(--muted)', fontSize: 11.5, letterSpacing: '0.04em', textTransform: 'uppercase' }}>
              Favorit Kamu
            </span>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              {pinnedItems.map((it) => (
                <Tile key={it.to} it={it} label={labelFor(it)} badge={badgeFor(it)} count={countFor(it)} pinned onTogglePin={handleTogglePin} />
              ))}
            </div>
          </div>
        )}

        {!searching && recentItems.length > 0 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            <span className="section-label" style={{ color: 'var(--muted)', fontSize: 11.5, letterSpacing: '0.04em', textTransform: 'uppercase' }}>
              Terakhir Dibuka
            </span>
            <div className="hide-scrollbar" style={{ display: 'flex', gap: 8, overflowX: 'auto' }}>
              {recentItems.map((it) => (
                <Link
                  key={it.to}
                  to={it.to}
                  onClick={() => markLainnyaVisited(it.to)}
                  onMouseEnter={it.prefetch}
                  onTouchStart={it.prefetch}
                  style={{
                    flexShrink: 0,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 8,
                    padding: '8px 14px 8px 8px',
                    borderRadius: 999,
                    background: 'var(--card)',
                    border: '1px solid var(--border)',
                    textDecoration: 'none',
                    color: 'inherit',
                  }}
                >
                  <div style={{ width: 28, height: 28, borderRadius: '50%', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, background: it.bg }}>
                    {it.node}
                  </div>
                  <span style={{ fontSize: 11.5, fontWeight: 700, whiteSpace: 'nowrap' }}>{labelFor(it)}</span>
                </Link>
              ))}
            </div>
          </div>
        )}

        {searching && filteredSections.length === 0 && (
          <p className="state-msg">Gak ada fitur yang cocok dengan "{query}".</p>
        )}

        {filteredSections.map((section) => {
          // Collapse only applies when NOT searching — a search result
          // hiding behind a collapsed section would be a confusing dead
          // end, so `searching` always forces every matching section open.
          const isCollapsed = !searching && collapsed[section.title];
          return (
            <div key={section.title} style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              <button
                onClick={() => setCollapsed((c) => ({ ...c, [section.title]: !c[section.title] }))}
                aria-expanded={!isCollapsed}
                style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'none', border: 'none', padding: 0, cursor: 'pointer', alignSelf: 'flex-start' }}
              >
                <span className="section-label" style={{ color: 'var(--muted)', fontSize: 11.5, letterSpacing: '0.04em', textTransform: 'uppercase' }}>
                  {section.title}
                </span>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="var(--muted)" style={{ transform: isCollapsed ? 'rotate(-90deg)' : 'none', transition: 'transform 0.15s ease' }}>
                  <path d="m6 9 6 6 6-6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
              {!isCollapsed && (
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                  {section.items.map((it) => (
                    <Tile
                      key={it.to}
                      it={it}
                      label={labelFor(it)}
                      badge={badgeFor(it)}
                      count={countFor(it)}
                      pinned={pinned.includes(it.to)}
                      onTogglePin={handleTogglePin}
                    />
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
