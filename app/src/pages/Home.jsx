import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { doc, onSnapshot } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { useAuth } from '../context/AuthContext';
import { useLang } from '../context/LangContext';
import { usePrayerTimes } from '../lib/usePrayerTimes';
import { watchActiveDonations } from '../lib/donations';
import { formatRupiah } from '../lib/zakat';
import BottomNav from '../components/BottomNav';
import DonationCard from '../components/DonationCard';
import { IconBell, IconSearch, IconMoon } from '../components/icons';
import { QiblaCompassIcon } from '../components/serviceIcons';

function Wallet() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--primary)">
      <rect x="2.5" y="5.5" width="19" height="13" rx="2.5" strokeWidth="1.7" />
      <path d="M2.5 9.5h19" strokeWidth="1.7" />
    </svg>
  );
}
function Star() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--gold-ink)">
      <path d="M12 2.5 14 9l6.5.4-5.1 4.2 1.8 6.4L12 16.7 6.8 20l1.8-6.4L3.5 9.4 10 9 12 2.5Z" strokeWidth="1.5" strokeLinejoin="round" />
    </svg>
  );
}

// quran/jadwal/cari-masjid don't have a matching icon in the pitch deck's
// design system asset pack, so they stay emoji; donasi/kiblat use hand-drawn
// vectors from components/serviceIcons.jsx (shared with the Lainnya grid) so
// they stay crisp at any size instead of a cropped raster.
const SVC = [
  { to: '/quran', emoji: '📖', key: 'nav_quran', bg: 'linear-gradient(160deg, #fdf3df, #fbe4b0)' },
  { to: '/jadwal-sholat', emoji: '⏰', label: 'Sholat', bg: 'linear-gradient(160deg, #e2f1ec, #bfe2d4)' },
  { to: '/lainnya/kiblat', node: <QiblaCompassIcon size={46} />, key: 'item_kiblat', bg: 'linear-gradient(160deg, #fbe6da, #f3c9ab)' },
  { to: '/lainnya/cari-masjid', emoji: '🕌', label: 'Cari Masjid', bg: 'linear-gradient(160deg, #e3e9ee, #c3d1dc)' },
];

export default function Home() {
  const { user } = useAuth();
  const { t } = useLang();
  const { next, status: prayerStatus } = usePrayerTimes();
  const [profile, setProfile] = useState(null);
  const [donations, setDonations] = useState(null);

  useEffect(() => {
    if (!user) return;
    const ref = doc(db, 'users', user.uid);
    return onSnapshot(ref, (snap) => setProfile(snap.data()));
  }, [user]);

  useEffect(() => watchActiveDonations(setDonations), []);

  return (
    <div className="screen">
      <div className="screen-content">
        <div className="topbar">
          <div style={{ display: 'flex', alignItems: 'center', gap: 11 }}>
            <div
              style={{
                width: 46,
                height: 46,
                borderRadius: '50%',
                padding: 2.5,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: `conic-gradient(from 180deg, var(--primary), var(--accent), var(--primary))`,
              }}
            >
              <div
                style={{
                  width: '100%',
                  height: '100%',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 800,
                  fontSize: 16,
                  color: '#fff',
                  background: 'var(--primary)',
                }}
              >
                {(user?.displayName || 'A')[0].toUpperCase()}
              </div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <span style={{ fontSize: 12, color: 'var(--muted)' }}>{t('greeting')}</span>
              <span style={{ fontSize: 15.5, fontWeight: 700 }}>{user?.displayName || user?.email}</span>
            </div>
          </div>
          <Link to="/pengaturan" className="icon-btn" aria-label={t('pengaturan')} style={{ textDecoration: 'none' }}>
            <IconBell width="17" height="17" />
          </Link>
        </div>

        <h1 style={{ margin: 0, fontSize: 25, fontWeight: 800, letterSpacing: '-0.01em', whiteSpace: 'pre-line' }}>
          {t('headline')}
        </h1>

        <Link to="/ask-me" className="input-row" style={{ borderRadius: 999, textDecoration: 'none' }}>
          <IconMoon width="16" height="16" style={{ color: 'var(--ink)' }} />
          <span style={{ flex: 1, fontSize: 13, fontWeight: 500, color: 'var(--muted)' }}>Tanya Ust. Rewin…</span>
          <IconSearch style={{ opacity: 0.6, color: 'var(--ink)' }} />
        </Link>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 7, borderRadius: 20, padding: '14px 15px', background: 'var(--mint)' }}>
            <Wallet />
            <span style={{ fontSize: 10.5, fontWeight: 600, color: 'var(--muted)' }}>{t('wallet_sedekah')}</span>
            <span style={{ fontSize: 14.5, fontWeight: 800, color: 'var(--primary)' }}>
              {formatRupiah(profile?.walletBalance ?? 0)}
            </span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 7, borderRadius: 20, padding: '14px 15px', background: 'var(--cream)' }}>
            <Star />
            <span style={{ fontSize: 10.5, fontWeight: 600, color: 'var(--gold-ink)' }}>{t('poin_ibadah')}</span>
            <span style={{ fontSize: 14.5, fontWeight: 800, color: 'var(--gold-ink-dark)' }}>
              {(profile?.points ?? 0).toLocaleString('id-ID')} pts
            </span>
          </div>
        </div>

        <Link
          to="/jadwal-sholat"
          style={{
            textDecoration: 'none',
            color: 'inherit',
            position: 'relative',
            overflow: 'hidden',
            borderRadius: 22,
            padding: '18px 20px',
            background: `linear-gradient(135deg, var(--primary), var(--primary-dark))`,
            color: '#fff',
          }}
        >
          <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.05em', textTransform: 'uppercase', color: 'var(--accent)' }}>
            {t('jadwal_sholat')}
          </div>
          {prayerStatus === 'ready' && next ? (
            <>
              <div style={{ fontSize: 22, fontWeight: 800, marginTop: 6 }}>
                {next.label} &middot; {next.time}
              </div>
              <div style={{ fontSize: 12, opacity: 0.75, marginTop: 2 }}>{next.countdown} lagi</div>
            </>
          ) : prayerStatus === 'denied' ? (
            <div style={{ fontSize: 12, opacity: 0.8, marginTop: 8 }}>Izinkan akses lokasi buat lihat jadwal sholat</div>
          ) : (
            <div style={{ fontSize: 12, opacity: 0.8, marginTop: 8 }}>Memuat jadwal sholat…</div>
          )}
        </Link>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span className="section-label">{t('layanan')}</span>
            <Link to="/lainnya" style={{ display: 'flex', alignItems: 'center', gap: 3, fontSize: 11, fontWeight: 700, color: 'var(--primary)', textDecoration: 'none' }}>
              {t('lihat_semua')}
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="var(--primary)"><path d="m9 6 6 6-6 6" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" /></svg>
            </Link>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, minmax(0, 1fr))', gap: 8 }}>
            {SVC.map((s) => (
              <Link key={s.to} to={s.to} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, textDecoration: 'none', color: 'inherit' }}>
                <div
                  style={{
                    width: 68,
                    height: 68,
                    borderRadius: 22,
                    overflow: 'hidden',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    background: s.bg,
                    boxShadow: '0 8px 16px rgba(15,32,25,0.14), inset 0 1px 0 rgba(255,255,255,0.5)',
                    fontSize: 32,
                    lineHeight: 1,
                  }}
                >
                  {s.node ?? (s.icon ? <img src={s.icon} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : s.emoji)}
                </div>
                <span style={{ fontSize: 10.5, fontWeight: 700, textAlign: 'center' }}>{s.label || t(s.key)}</span>
              </Link>
            ))}
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <span className="section-label">{t('donasi_kamu')}</span>
          {donations && donations.length === 0 && (
            <div className="card" style={{ padding: 16, fontSize: 12.5, color: 'var(--muted)', textAlign: 'center' }}>
              Belum ada campaign aktif saat ini.
            </div>
          )}
          {donations && donations.length > 0 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {donations.map((donation) => (
                <DonationCard key={donation.id} donation={donation} />
              ))}
            </div>
          )}
        </div>
      </div>
      <BottomNav />
    </div>
  );
}
