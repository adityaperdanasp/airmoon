import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { watchFavoriteAyat, removeFavoriteAyat, addFavoriteAyat, setFavoriteCollection, setTadabburNote } from '../lib/favoriteAyat';
import EmptyState from '../components/EmptyState';
import ConfirmDialog from '../components/ConfirmDialog';
import CollectionPickerSheet from '../components/CollectionPickerSheet';
import { useToast } from '../context/ToastContext';
import PageHeaderPhoto from '../components/PageHeaderPhoto';
import { PAGE_PHOTOS } from '../data/photos';
import PullToRefresh from '../components/PullToRefresh';
import { useSwipeReveal } from '../lib/useSwipeReveal';
import { SkeletonCard } from '../components/Skeleton';

// [UI 2026-09-11] Swipe-left-to-reveal-delete — this list only ever had a
// small trash icon to tap, missing the near-universal mobile list
// gesture. Own component (not inlined in the .map() below) since
// useSwipeReveal's drag state is per-row. The existing trash icon stays
// too — swipe is additive, not a replacement, and both funnel into the
// exact same onRemove (the existing confirm + undo-toast flow further
// down this file, not duplicated here).
function FavoriteAyatRow({ f, onMove, onRemove, user }) {
  const { dragX, revealed, close, revealWidth, handlers } = useSwipeReveal();
  const [showNote, setShowNote] = useState(!!f.tadabbur);
  const [noteText, setNoteText] = useState(f.tadabbur || '');
  const [savingNote, setSavingNote] = useState(false);

  async function handleSaveNote() {
    if (savingNote) return;
    setSavingNote(true);
    try {
      await setTadabburNote(user.uid, f.chapter, f.verse, noteText);
    } finally {
      setSavingNote(false);
    }
  }
  const guardNav = (e) => {
    if (revealed) {
      e.preventDefault();
      close();
    }
  };

  return (
    <div style={{ position: 'relative', overflow: 'hidden', borderRadius: 20 }}>
      <button
        onClick={() => {
          close();
          onRemove(f);
        }}
        aria-label={`Hapus ${f.chapterName} ayat ${f.verse} dari favorit`}
        style={{
          position: 'absolute',
          right: 0,
          top: 0,
          bottom: 0,
          width: revealWidth,
          background: 'var(--danger)',
          color: 'var(--on-danger)',
          border: 'none',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 3,
          fontSize: 10,
          fontWeight: 700,
          cursor: 'pointer',
        }}
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <path d="M6 7h12M9 7V5a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2m2 0-.8 12.1a2 2 0 0 1-2 1.9H9.8a2 2 0 0 1-2-1.9L7 7" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        Hapus
      </button>

      <div
        {...handlers}
        className="card"
        style={{
          position: 'relative',
          display: 'flex',
          flexDirection: 'column',
          gap: 8,
          padding: 14,
          background: 'var(--card)',
          transform: `translateX(${dragX}px)`,
          transition: dragX === 0 || dragX === -revealWidth ? 'transform var(--dur-2) var(--ease)' : 'none',
          touchAction: 'pan-y',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, minWidth: 0 }}>
            <Link
              to={`/quran/${f.chapter}?ayat=${f.verse}`}
              onClick={guardNav}
              style={{
                fontSize: 10.5,
                fontWeight: 700,
                padding: '3px 9px',
                borderRadius: 999,
                color: 'var(--primary)',
                background: 'var(--mint)',
                textDecoration: 'none',
                flexShrink: 0,
              }}
            >
              {f.chapterName} : {f.verse}
            </Link>
            {f.collection && (
              <span style={{ fontSize: 10, color: 'var(--muted)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                📁 {f.collection}
              </span>
            )}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexShrink: 0 }}>
            <button
              onClick={() => setShowNote((v) => !v)}
              style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer', color: f.tadabbur ? 'var(--primary)' : 'var(--muted-soft)' }}
              aria-label="Catatan tadabbur"
              title="Catatan tadabbur"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path d="M4 19.5V5.5A1.5 1.5 0 0 1 5.5 4h9.5l5 5v10.5a1.5 1.5 0 0 1-1.5 1.5h-13A1.5 1.5 0 0 1 4 19.5Z" strokeWidth="1.5" strokeLinejoin="round" />
                <path d="M8 12h8M8 16h5" strokeWidth="1.4" strokeLinecap="round" />
              </svg>
            </button>
            <button
              onClick={() => onMove(f)}
              style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer', color: 'var(--muted-soft)' }}
              aria-label="Pindahkan ke koleksi"
              title="Pindahkan ke koleksi"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path d="M3 7.5A1.5 1.5 0 0 1 4.5 6h4l1.5 2h9.5A1.5 1.5 0 0 1 21 9.5v9A1.5 1.5 0 0 1 19.5 20h-15A1.5 1.5 0 0 1 3 18.5v-11Z" strokeWidth="1.6" strokeLinejoin="round" />
              </svg>
            </button>
            <button
              onClick={() => onRemove(f)}
              style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer', color: 'var(--muted-soft)' }}
              aria-label="Hapus dari favorit"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path d="M6 7h12M9 7V5a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2m2 0-.8 12.1a2 2 0 0 1-2 1.9H9.8a2 2 0 0 1-2-1.9L7 7" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          </div>
        </div>
        <Link to={`/quran/${f.chapter}?ayat=${f.verse}`} onClick={guardNav} style={{ textDecoration: 'none', color: 'inherit', display: 'flex', flexDirection: 'column', gap: 8 }}>
          <div style={{ fontFamily: "'Amiri', serif", fontSize: 19, lineHeight: 1.8, direction: 'rtl', textAlign: 'right' }}>{f.arabic}</div>
          <p style={{ margin: 0, fontSize: 12, lineHeight: 1.55, color: 'var(--muted)' }}>{f.translation}</p>
        </Link>

        {showNote && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            <span style={{ fontSize: 10.5, fontWeight: 700, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.03em' }}>Catatan Tadabbur</span>
            <textarea
              placeholder="Apa yang kamu pelajari/rasakan dari ayat ini?"
              value={noteText}
              onChange={(e) => setNoteText(e.target.value)}
              onBlur={handleSaveNote}
              maxLength={500}
              rows={2}
              style={{ padding: '8px 10px', borderRadius: 10, border: '1px solid var(--border)', background: 'var(--bg)', color: 'var(--ink)', fontSize: 12, fontFamily: 'inherit', resize: 'vertical' }}
            />
          </div>
        )}
      </div>
    </div>
  );
}

export default function AyatFavorit() {
  const { user } = useAuth();
  const { showToast } = useToast();
  const [favorites, setFavorites] = useState(null);
  const [pendingRemove, setPendingRemove] = useState(null); // the favorite object awaiting confirmation, or null
  const [pickerFor, setPickerFor] = useState(null); // the favorite object being moved to a collection, or null
  const [activeCollection, setActiveCollection] = useState(null); // null = "Semua"
  const [sortBy, setSortBy] = useState('terbaru'); // 'terbaru' | 'surah'

  useEffect(() => watchFavoriteAyat(user?.uid, setFavorites), [user?.uid]);

  // Distinct collection names actually in use — derived from the
  // favorites themselves rather than a separate synced list, so a
  // collection can never exist "empty" or reference something deleted.
  const collections = useMemo(() => {
    const names = new Set((favorites || []).map((f) => f.collection).filter(Boolean));
    return [...names].sort();
  }, [favorites]);

  const filtered = useMemo(() => {
    if (!favorites) return favorites;
    const byCollection = activeCollection ? favorites.filter((f) => f.collection === activeCollection) : favorites;
    // 'terbaru' is already the query's own order (createdAt desc from
    // watchFavoriteAyat) — only 'surah' needs an actual client-side sort.
    if (sortBy !== 'surah') return byCollection;
    return [...byCollection].sort((a, b) => a.chapter - b.chapter || a.verse - b.verse);
  }, [favorites, activeCollection, sortBy]);

  // Export ke Teks — a plain-text file listing every favorite (grouped by
  // collection where set), so someone can keep/print/back up their
  // favorites outside the app instead of them only ever existing as a
  // Firestore doc. Kept deliberately separate from lib/exportData.js's
  // JSON backup — that's a machine-readable full-account backup meant to
  // be re-imported later, this is a human-readable reading list.
  function handleExportText() {
    const grouped = new Map();
    for (const f of filtered) {
      const key = f.collection || 'Tanpa Koleksi';
      if (!grouped.has(key)) grouped.set(key, []);
      grouped.get(key).push(f);
    }
    const lines = ['Ayat Favorit — airmoon', ''];
    for (const [name, items] of grouped) {
      lines.push(`## ${name}`, '');
      for (const f of items) {
        lines.push(`${f.chapterName} : ${f.verse}`, f.arabic, `"${f.translation}"`, '');
      }
    }
    const blob = new Blob([lines.join('\n')], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'ayat-favorit-airmoon.txt';
    a.click();
    URL.revokeObjectURL(url);
  }

  // favorites is already `onSnapshot`-live (watchFavoriteAyat) — nothing
  // to actually re-fetch, so this just resolves after a short delay for
  // the gesture's expected completion feel, same as Doa.jsx's own
  // handlePullRefresh.
  function refresh() {
    return new Promise((resolve) => setTimeout(resolve, 400));
  }

  return (
    <div className="screen">
      <div className="screen-content">
      <PullToRefresh onRefresh={refresh}>
        <PageHeaderPhoto title="Ayat Favorit" photo={PAGE_PHOTOS.ayatFavorit} subtitle={favorites ? `${favorites.length} ayat tersimpan` : 'Memuat…'} />

        {favorites?.length === 0 && (
          <EmptyState
            icon="⭐"
            title="Belum ada ayat favorit"
            subtitle="Tap ikon bintang di bawah ayat saat baca Mode Ayat buat menyimpannya di sini."
            actionLabel="Baca Qur'an"
            actionTo="/quran"
          />
        )}

        {favorites === null && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {Array.from({ length: 3 }).map((_, i) => (
              <SkeletonCard key={i} height={128} radius={20} />
            ))}
          </div>
        )}

        {favorites && favorites.length > 0 && collections.length > 0 && (
          <div className="hide-scrollbar" style={{ display: 'flex', gap: 8, overflowX: 'auto' }}>
            {[null, ...collections].map((name) => (
              <button
                key={name || '__all__'}
                onClick={() => setActiveCollection(name)}
                style={{
                  flexShrink: 0,
                  padding: '8px 14px',
                  borderRadius: 999,
                  fontSize: 11.5,
                  fontWeight: 700,
                  border: activeCollection === name ? 'none' : '1px solid var(--border)',
                  background: activeCollection === name ? 'var(--primary)' : 'var(--card)',
                  color: activeCollection === name ? 'var(--on-primary)' : 'var(--ink)',
                  cursor: 'pointer',
                  whiteSpace: 'nowrap',
                }}
              >
                {name || 'Semua'}
              </button>
            ))}
          </div>
        )}

        {favorites && favorites.length > 1 && (
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 6 }}>
            <button
              onClick={handleExportText}
              style={{ display: 'flex', alignItems: 'center', gap: 4, background: 'none', border: 'none', color: 'var(--primary)', fontSize: 11, fontWeight: 700, cursor: 'pointer', padding: 0 }}
            >
              ↓ Ekspor ke Teks
            </button>
            <div style={{ display: 'flex', gap: 6 }}>
              {[
                { key: 'terbaru', label: 'Terbaru' },
                { key: 'surah', label: 'Per Surah' },
              ].map((opt) => (
                <button
                  key={opt.key}
                  onClick={() => setSortBy(opt.key)}
                  style={{
                    padding: '6px 12px',
                    borderRadius: 999,
                    fontSize: 10.5,
                    fontWeight: 700,
                    border: sortBy === opt.key ? 'none' : '1px solid var(--border)',
                    background: sortBy === opt.key ? 'var(--mint)' : 'transparent',
                    color: sortBy === opt.key ? 'var(--primary)' : 'var(--muted)',
                    cursor: 'pointer',
                  }}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>
        )}

        {favorites && favorites.length > 0 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {filtered.map((f) => (
              <FavoriteAyatRow key={f.id} f={f} onMove={setPickerFor} onRemove={setPendingRemove} user={user} />
            ))}

            {filtered.length === 0 && (
              <p className="state-msg">Gak ada ayat di koleksi "{activeCollection}".</p>
            )}
          </div>
        )}
      </PullToRefresh>
      </div>

      {pendingRemove && (
        <ConfirmDialog
          title="Hapus dari favorit?"
          message={`${pendingRemove.chapterName} : ${pendingRemove.verse} bakal dihapus dari daftar favoritmu.`}
          confirmLabel="Ya, Hapus"
          danger
          onCancel={() => setPendingRemove(null)}
          onConfirm={() => {
            const removed = pendingRemove;
            removeFavoriteAyat(user.uid, removed.chapter, removed.verse);
            showToast('Dihapus dari favorit', {
              actionLabel: 'Batalkan',
              onAction: () => {
                addFavoriteAyat(user.uid, {
                  chapter: removed.chapter,
                  chapterName: removed.chapterName,
                  verse: removed.verse,
                  arabic: removed.arabic,
                  translation: removed.translation,
                }).then(() => {
                  if (removed.collection) setFavoriteCollection(user.uid, removed.chapter, removed.verse, removed.collection);
                });
              },
            });
            setPendingRemove(null);
          }}
        />
      )}

      {pickerFor && (
        <CollectionPickerSheet
          existingCollections={collections}
          current={pickerFor.collection || null}
          onClose={() => setPickerFor(null)}
          onPick={(name) => {
            setFavoriteCollection(user.uid, pickerFor.chapter, pickerFor.verse, name);
            showToast(name ? `Dipindahkan ke "${name}"` : 'Dipindahkan ke Semua');
            setPickerFor(null);
          }}
        />
      )}
    </div>
  );
}
