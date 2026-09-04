import { useEffect, useState } from 'react';
import { doaCategories } from '../data/doaHarian';
import { useLang } from '../context/LangContext';
import { useAuth } from '../context/AuthContext';
import { watchDzikirStreak, markDzikirDone, isDoneToday } from '../lib/dzikirStreak';
import PageHeaderPhoto from '../components/PageHeaderPhoto';
import { PAGE_PHOTOS } from '../data/photos';
import { IconSearch } from '../components/icons';
import StickyMiniHeader from '../components/StickyMiniHeader';
import { loadFavoriteDoa, doaKey, toggleFavoriteDoa } from '../lib/favoriteDoa';

// pagi/petang are real daily habits worth a streak; kegiatan (doa per
// situation — makan, keluar rumah, etc.) isn't a once-a-day thing, so it
// gets no streak UI.
const STREAK_CATEGORIES = ['pagi', 'petang'];

// A pseudo-category, not a real entry in data/doaHarian.js's
// doaCategories — its "items" are pulled live from every real category
// (below), filtered by what's actually favorited, rather than being its
// own static list.
const FAVORITE_ID = 'favorit';

// Every real item, tagged with which category it actually lives in — a
// favorited item from Pagi and one from Petang can share a title (see
// favoriteDoa.js's own header note on why the favorite key needs the
// category too), so the Favorit tab needs to know each item's home
// category to build the right key and to keep "Tandai Selesai" scoped
// correctly if someone switches back to a real tab.
const ALL_ITEMS = doaCategories.flatMap((c) => c.items.map((it) => ({ ...it, categoryId: c.id })));

export default function DoaHarian() {
  const { t } = useLang();
  const { user } = useAuth();
  const [activeId, setActiveId] = useState('pagi');
  const [streaks, setStreaks] = useState({});
  const [marking, setMarking] = useState(false);
  const [query, setQuery] = useState('');
  const [favorites, setFavorites] = useState(loadFavoriteDoa);
  const isFavoriteTab = activeId === FAVORITE_ID;
  const active = isFavoriteTab
    ? { id: FAVORITE_ID, labelKey: null }
    : doaCategories.find((c) => c.id === activeId) ?? doaCategories[0];
  const streak = streaks[activeId];
  const doneToday = isDoneToday(streak);
  const showStreak = STREAK_CATEGORIES.includes(activeId);

  const baseItems = isFavoriteTab
    ? ALL_ITEMS.filter((it) => favorites.includes(doaKey(it.categoryId, it.title)))
    : active.items.map((it) => ({ ...it, categoryId: active.id }));

  // Lists this long (19 dzikir pagi, 18 dzikir petang) didn't have any way
  // to jump straight to a specific one — a plain title/translation filter,
  // same pattern SurahList.jsx's local search already uses, rather than a
  // separate "jump to" index that would need its own numbered UI.
  const q = query.trim().toLowerCase();
  const filteredItems = q
    ? baseItems.filter((d) => d.title.toLowerCase().includes(q) || d.translation.toLowerCase().includes(q))
    : baseItems;

  function handleToggleFavorite(it) {
    setFavorites(toggleFavoriteDoa(doaKey(it.categoryId, it.title)));
  }

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
      <StickyMiniHeader title={t('item_doa_harian')} subtitle={isFavoriteTab ? '⭐ Favorit' : t(active.labelKey)} />
      <div className="screen-content">
        <PageHeaderPhoto title={t('item_doa_harian')} photo={PAGE_PHOTOS.doaHarian} />

        <div className="hide-scrollbar" style={{ display: 'flex', gap: 8, overflowX: 'auto', paddingBottom: 2 }}>
          {doaCategories.map((c) => {
            const isActive = c.id === active.id;
            return (
              <button
                key={c.id}
                onClick={() => {
                  setActiveId(c.id);
                  setQuery('');
                }}
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
          <button
            onClick={() => {
              setActiveId(FAVORITE_ID);
              setQuery('');
            }}
            style={{
              flexShrink: 0,
              padding: '9px 16px',
              borderRadius: 999,
              border: 'none',
              fontFamily: 'inherit',
              fontSize: 12.5,
              fontWeight: 700,
              cursor: 'pointer',
              color: isFavoriteTab ? 'var(--on-primary)' : 'var(--ink)',
              background: isFavoriteTab ? 'var(--primary)' : 'var(--card)',
            }}
          >
            ⭐ Favorit
          </button>
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

        {baseItems.length > 6 && (
          <div className="input-row" style={{ borderRadius: 999 }}>
            <IconSearch style={{ color: 'var(--muted)' }} />
            <input placeholder="Cari judul dzikir…" value={query} onChange={(e) => setQuery(e.target.value)} />
          </div>
        )}

        {q && filteredItems.length === 0 && <p className="state-msg">Gak ketemu dzikir yang cocok dengan "{query}".</p>}

        {isFavoriteTab && baseItems.length === 0 && (
          <p className="state-msg">Belum ada dzikir favorit. Tap ikon ☆ di kartu dzikir buat menyimpannya di sini.</p>
        )}

        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {filteredItems.map((d, i) => {
            const isFav = favorites.includes(doaKey(d.categoryId, d.title));
            return (
            <div key={`${d.categoryId}-${d.title}-${i}`} className="card" style={{ display: 'flex', flexDirection: 'column', gap: 10, padding: 16 }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8 }}>
                <span style={{ fontSize: 12.5, fontWeight: 700, flex: 1 }}>{d.title}</span>
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
                <button
                  onClick={() => handleToggleFavorite(d)}
                  aria-label={isFav ? `Hapus ${d.title} dari favorit` : `Simpan ${d.title} sebagai favorit`}
                  style={{ flexShrink: 0, width: 26, height: 26, borderRadius: '50%', border: 'none', background: 'transparent', color: isFav ? 'var(--gold-ink)' : 'var(--muted-soft)', fontSize: 15, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                >
                  {isFav ? '⭐' : '☆'}
                </button>
              </div>
              <div style={{ fontFamily: "'Amiri', serif", fontSize: 19, lineHeight: 1.9, direction: 'rtl', textAlign: 'right' }}>
                {d.arabic}
              </div>
              {d.latin && (
                <p style={{ margin: 0, fontSize: 11.5, lineHeight: 1.55, color: 'var(--muted-soft)', fontStyle: 'italic' }}>{d.latin}</p>
              )}
              <p style={{ margin: 0, fontSize: 12, lineHeight: 1.55, color: 'var(--muted)' }}>{d.translation}</p>
            </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
