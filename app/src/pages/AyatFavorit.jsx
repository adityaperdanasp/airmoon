import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { watchFavoriteAyat, removeFavoriteAyat } from '../lib/favoriteAyat';
import TopBar from '../components/TopBar';
import EmptyState from '../components/EmptyState';
import ConfirmDialog from '../components/ConfirmDialog';
import { useToast } from '../context/ToastContext';

export default function AyatFavorit() {
  const { user } = useAuth();
  const { showToast } = useToast();
  const [favorites, setFavorites] = useState(null);
  const [pendingRemove, setPendingRemove] = useState(null); // the favorite object awaiting confirmation, or null

  useEffect(() => watchFavoriteAyat(user?.uid, setFavorites), [user?.uid]);

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

        {favorites && favorites.length > 0 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {favorites.map((f) => (
              <div key={f.id} className="card" style={{ display: 'flex', flexDirection: 'column', gap: 8, padding: 14 }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8 }}>
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
                    }}
                  >
                    {f.chapterName} : {f.verse}
                  </Link>
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
                <Link to={`/quran/${f.chapter}?ayat=${f.verse}`} style={{ textDecoration: 'none', color: 'inherit', display: 'flex', flexDirection: 'column', gap: 8 }}>
                  <div style={{ fontFamily: "'Amiri', serif", fontSize: 19, lineHeight: 1.8, direction: 'rtl', textAlign: 'right' }}>
                    {f.arabic}
                  </div>
                  <p style={{ margin: 0, fontSize: 12, lineHeight: 1.55, color: 'var(--muted)' }}>{f.translation}</p>
                </Link>
              </div>
            ))}
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
    </div>
  );
}
