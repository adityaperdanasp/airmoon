import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { watchFavoriteAyat, removeFavoriteAyat, setFavoriteCollection } from '../lib/favoriteAyat';
import TopBar from '../components/TopBar';
import EmptyState from '../components/EmptyState';
import ConfirmDialog from '../components/ConfirmDialog';
import CollectionPickerSheet from '../components/CollectionPickerSheet';
import { useToast } from '../context/ToastContext';

export default function AyatFavorit() {
  const { user } = useAuth();
  const { showToast } = useToast();
  const [favorites, setFavorites] = useState(null);
  const [pendingRemove, setPendingRemove] = useState(null); // the favorite object awaiting confirmation, or null
  const [pickerFor, setPickerFor] = useState(null); // the favorite object being moved to a collection, or null
  const [activeCollection, setActiveCollection] = useState(null); // null = "Semua"

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
    if (!activeCollection) return favorites;
    return favorites.filter((f) => f.collection === activeCollection);
  }, [favorites, activeCollection]);

  return (
    <div className="screen">
      <div className="screen-content">
        <TopBar title="Ayat Favorit" subtitle={favorites ? `${favorites.length} ayat tersimpan` : 'Memuat…'} />

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
          <div className="center" style={{ minHeight: '30vh' }}>
            <div className="spinner" />
          </div>
        )}

        {favorites && favorites.length > 0 && collections.length > 0 && (
          <div style={{ display: 'flex', gap: 8, overflowX: 'auto' }}>
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

        {favorites && favorites.length > 0 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {filtered.map((f) => (
              <div key={f.id} className="card" style={{ display: 'flex', flexDirection: 'column', gap: 8, padding: 14 }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, minWidth: 0 }}>
                    <Link
                      to={`/quran/${f.chapter}?ayat=${f.verse}`}
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
                      onClick={() => setPickerFor(f)}
                      style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer', color: 'var(--muted-soft)' }}
                      aria-label="Pindahkan ke koleksi"
                      title="Pindahkan ke koleksi"
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                        <path d="M3 7.5A1.5 1.5 0 0 1 4.5 6h4l1.5 2h9.5A1.5 1.5 0 0 1 21 9.5v9A1.5 1.5 0 0 1 19.5 20h-15A1.5 1.5 0 0 1 3 18.5v-11Z" strokeWidth="1.6" strokeLinejoin="round" />
                      </svg>
                    </button>
                    <button
                      onClick={() => setPendingRemove(f)}
                      style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer', color: 'var(--muted-soft)' }}
                      aria-label="Hapus dari favorit"
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                        <path d="M6 7h12M9 7V5a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2m2 0-.8 12.1a2 2 0 0 1-2 1.9H9.8a2 2 0 0 1-2-1.9L7 7" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </button>
                  </div>
                </div>
                <Link to={`/quran/${f.chapter}?ayat=${f.verse}`} style={{ textDecoration: 'none', color: 'inherit', display: 'flex', flexDirection: 'column', gap: 8 }}>
                  <div style={{ fontFamily: "'Amiri', serif", fontSize: 19, lineHeight: 1.8, direction: 'rtl', textAlign: 'right' }}>
                    {f.arabic}
                  </div>
                  <p style={{ margin: 0, fontSize: 12, lineHeight: 1.55, color: 'var(--muted)' }}>{f.translation}</p>
                </Link>
              </div>
            ))}

            {filtered.length === 0 && (
              <p className="state-msg">Gak ada ayat di koleksi "{activeCollection}".</p>
            )}
          </div>
        )}
      </div>

      {pendingRemove && (
        <ConfirmDialog
          title="Hapus dari favorit?"
          message={`${pendingRemove.chapterName} : ${pendingRemove.verse} bakal dihapus dari daftar favoritmu.`}
          confirmLabel="Ya, Hapus"
          danger
          onCancel={() => setPendingRemove(null)}
          onConfirm={() => {
            removeFavoriteAyat(user.uid, pendingRemove.chapter, pendingRemove.verse);
            showToast('Dihapus dari favorit');
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
