import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { useAuth } from '../context/AuthContext';
import { fetchSurahList } from '../lib/quranApi';
import BottomNav from '../components/BottomNav';
import PageHeaderPhoto from '../components/PageHeaderPhoto';
import { PAGE_PHOTOS } from '../data/photos';
import { IconMenu, IconSearch } from '../components/icons';
import { SkeletonSurahRow } from '../components/Skeleton';

export default function SurahList() {
  const { user } = useAuth();
  const [surahs, setSurahs] = useState(null);
  const [error, setError] = useState('');
  const [query, setQuery] = useState('');
  const [lastReadAyat, setLastReadAyat] = useState(null);
  const [lastReadMushaf, setLastReadMushaf] = useState(null);

  useEffect(() => {
    fetchSurahList()
      .then(setSurahs)
      .catch(() => setError('Gagal memuat daftar surat. Coba refresh halaman.'));
  }, []);

  useEffect(() => {
    if (!user) return;
    getDoc(doc(db, 'users', user.uid)).then((snap) => {
      const data = snap.data();
      // lastReadAyat replaces the older lastRead field name (split out once
      // Mode Mushaf got its own separate bookmark) — fall back to it so
      // bookmarks saved before that split don't just disappear.
      const ayatBookmark = data?.lastReadAyat || data?.lastRead;
      if (ayatBookmark) setLastReadAyat(ayatBookmark);
      if (data?.lastReadMushaf) setLastReadMushaf(data.lastReadMushaf);
    });
  }, [user]);

  const filtered = useMemo(() => {
    if (!surahs) return null;
    const q = query.trim().toLowerCase();
    if (!q) return surahs;
    return surahs.filter(
      (s) => s.namaLatin.toLowerCase().includes(q) || s.arti.toLowerCase().includes(q)
    );
  }, [surahs, query]);

  return (
    <div className="screen">
      <div className="screen-content">
        <PageHeaderPhoto
          title="Al-Qur'an"
          photo={PAGE_PHOTOS.quran}
          showBack={false}
          subtitle={surahs ? `${surahs.length} Surat` : 'Memuat…'}
          right={
            <div className="icon-btn" style={{ background: 'rgba(255,255,255,0.22)', color: '#fff' }}>
              <IconMenu />
            </div>
          }
        />

        <div className="input-row" style={{ borderRadius: 999 }}>
          <IconSearch style={{ color: 'var(--muted)' }} />
          <input placeholder="Cari surat…" value={query} onChange={(e) => setQuery(e.target.value)} />
        </div>

        <Link
          to="/quran/mushaf/1"
          style={{
            textDecoration: 'none',
            color: 'inherit',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 10,
            padding: '13px 16px',
            borderRadius: 16,
            border: '1px solid var(--border)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ width: 34, height: 34, borderRadius: 11, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, background: 'var(--cream)' }}>
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="var(--gold-ink)"><path d="M4 5.5A2.5 2.5 0 0 1 6.5 3H12v18H6.5A2.5 2.5 0 0 1 4 18.5v-13Z" strokeWidth="1.6" strokeLinejoin="round" /><path d="M20 5.5A2.5 2.5 0 0 0 17.5 3H12v18h5.5a2.5 2.5 0 0 0 2.5-2.5v-13Z" strokeWidth="1.6" strokeLinejoin="round" /></svg>
            </div>
            <span style={{ fontSize: 13, fontWeight: 700 }}>Mode Mushaf</span>
          </div>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--muted)"><path d="m9 6 6 6-6 6" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg>
        </Link>

        <Link
          to="/quran/cari"
          style={{
            textDecoration: 'none',
            color: 'inherit',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 10,
            padding: '13px 16px',
            borderRadius: 16,
            border: '1px solid var(--border)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ width: 34, height: 34, borderRadius: 11, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, background: 'var(--mint)' }}>
              <IconSearch style={{ color: 'var(--primary)' }} />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              <span style={{ fontSize: 13, fontWeight: 700 }}>Cari Ayat</span>
              <span style={{ fontSize: 10.5, color: 'var(--muted)' }}>Cari isi ayat pakai kata kunci</span>
            </div>
          </div>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--muted)"><path d="m9 6 6 6-6 6" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg>
        </Link>

        {lastReadAyat && (
          <Link
            to={`/quran/${lastReadAyat.nomor}`}
            style={{
              textDecoration: 'none',
              color: '#fff',
              position: 'relative',
              overflow: 'hidden',
              borderRadius: 20,
              padding: '16px 18px',
              display: 'flex',
              alignItems: 'center',
              gap: 14,
              background: `linear-gradient(135deg, var(--primary), var(--primary-dark))`,
            }}
          >
            <div style={{ width: 42, height: 42, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, background: 'rgba(255,255,255,0.16)' }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="#fff" stroke="none"><path d="M8 5.5v13l11-6.5-11-6.5Z" /></svg>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
              <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.03em', textTransform: 'uppercase', color: 'var(--accent)' }}>Lanjut Baca &middot; Mode Ayat</span>
              <span style={{ fontSize: 14.5, fontWeight: 800 }}>{lastReadAyat.namaLatin} &middot; Ayat {lastReadAyat.ayat}</span>
            </div>
          </Link>
        )}

        {lastReadMushaf && (
          <Link
            to={`/quran/mushaf/${lastReadMushaf.page}?ayat=${lastReadMushaf.verseKey}`}
            style={{
              textDecoration: 'none',
              color: 'inherit',
              position: 'relative',
              overflow: 'hidden',
              borderRadius: 20,
              padding: '16px 18px',
              display: 'flex',
              alignItems: 'center',
              gap: 14,
              border: '1.5px solid var(--gold-ink)',
              background: 'var(--cream)',
            }}
          >
            <div style={{ width: 42, height: 42, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, background: 'rgba(0,0,0,0.06)' }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--gold-ink)"><path d="M4 5.5A2.5 2.5 0 0 1 6.5 3H12v18H6.5A2.5 2.5 0 0 1 4 18.5v-13Z" strokeWidth="1.6" strokeLinejoin="round" /><path d="M20 5.5A2.5 2.5 0 0 0 17.5 3H12v18h5.5a2.5 2.5 0 0 0 2.5-2.5v-13Z" strokeWidth="1.6" strokeLinejoin="round" /></svg>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
              <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.03em', textTransform: 'uppercase', color: 'var(--gold-ink)' }}>Lanjut Baca &middot; Mode Mushaf</span>
              <span style={{ fontSize: 14.5, fontWeight: 800 }}>{lastReadMushaf.chapterName} &middot; Halaman {lastReadMushaf.page}</span>
            </div>
          </Link>
        )}

        {error && <p className="state-msg">{error}</p>}
        {!surahs && !error && (
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            {Array.from({ length: 8 }).map((_, i) => (
              <SkeletonSurahRow key={i} />
            ))}
          </div>
        )}

        {filtered && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {filtered.map((s) => (
              <Link
                key={s.nomor}
                to={`/quran/${s.nomor}`}
                style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 4px', textDecoration: 'none', color: 'inherit' }}
              >
                <div style={{ width: 36, height: 36, borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, background: 'var(--mint)' }}>
                  <span style={{ fontSize: 12.5, fontWeight: 800, color: 'var(--primary)' }}>{s.nomor}</span>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 2, flex: 1, minWidth: 0 }}>
                  <span style={{ fontSize: 13.5, fontWeight: 700 }}>{s.namaLatin}</span>
                  <span style={{ fontSize: 11, color: 'var(--muted)' }}>{s.tempatTurun} &middot; {s.jumlahAyat} Ayat</span>
                </div>
                <span style={{ fontFamily: "'Amiri', serif", fontSize: 19, fontWeight: 700, flexShrink: 0 }}>{s.nama}</span>
              </Link>
            ))}
          </div>
        )}
      </div>
      <BottomNav />
    </div>
  );
}
