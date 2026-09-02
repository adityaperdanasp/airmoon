import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useLang } from '../context/LangContext';
import { useTheme } from '../context/ThemeContext';
import { usePrayerTimes } from '../lib/usePrayerTimes';
import { watchActiveDonations, watchMyContributions } from '../lib/donations';
import { watchUserProfile } from '../lib/profile';
import { watchDoas } from '../lib/doa';
import { HEADLINES, todaysHeadlineIndex } from '../data/headlines';
import { todaysHomePhoto } from '../data/photos';
import { formatRupiah } from '../lib/zakat';
import BottomNav from '../components/BottomNav';
import DonationCard from '../components/DonationCard';
import DoaCard from '../components/DoaCard';
import { IconBell, IconSearch, IconMoon } from '../components/icons';
import { QiblaCompassIcon, QuranBookIcon, MosqueIcon, PrayerClockIcon } from '../components/serviceIcons';

const dateFmt = new Intl.DateTimeFormat('id-ID', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });

function Wallet() {
  return (
    <div
      style={{
        width: 40,
        height: 40,
        borderRadius: 14,
        flexShrink: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(160deg, var(--card), var(--mint-soft))',
        boxShadow: '0 6px 14px rgba(15,32,25,0.12), inset 0 1px 0 rgba(255,255,255,0.5)',
      }}
    >
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--primary)">
        <rect x="2.5" y="5.5" width="19" height="13" rx="2.5" strokeWidth="1.7" />
        <path d="M2.5 9.5h19" strokeWidth="1.7" />
      </svg>
    </div>
  );
}

// A tasteful, abstract Islamic-geometric lattice (diamonds + dots), not a
// literal historical arabesque tessellation — used as a low-opacity
// texture layer so the prayer-time card isn't just a flat gradient.
function GeometricPattern({ id }) {
  return (
    <svg aria-hidden="true" style={{ position: 'absolute', inset: 0, opacity: 0.1, pointerEvents: 'none' }} width="100%" height="100%">
      <defs>
        <pattern id={id} width="30" height="30" patternUnits="userSpaceOnUse">
          <path d="M15 1 L29 15 L15 29 L1 15 Z" fill="none" stroke="#fff" strokeWidth="1" />
          <circle cx="15" cy="15" r="1.6" fill="#fff" />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill={`url(#${id})`} />
    </svg>
  );
}

// All 4 are now hand-drawn vectors from components/serviceIcons.jsx (shared
// with the Lainnya grid) — Sholat was the last emoji (⏰) holdout, replaced
// with PrayerClockIcon to match. Qur'an/Cari Masjid were emoji (📖/🕌)
// until an explicit ask to match Kiblat's existing custom-icon treatment
// for consistency (same reasoning as the Lainnya grid's icon pass) instead
// of the mismatched Flaticon-style assets that were also considered and
// declined for the same style-clash reasons.
const SVC = [
  { to: '/quran', node: <QuranBookIcon size={46} />, key: 'nav_quran', bg: 'linear-gradient(160deg, #fdf3df, #fbe4b0)' },
  { to: '/jadwal-sholat', node: <PrayerClockIcon size={46} />, label: 'Sholat', bg: 'linear-gradient(160deg, #e2f1ec, #bfe2d4)' },
  { to: '/lainnya/kiblat', node: <QiblaCompassIcon size={46} />, key: 'item_kiblat', bg: 'linear-gradient(160deg, #fbe6da, #f3c9ab)' },
  { to: '/lainnya/cari-masjid', node: <MosqueIcon size={46} />, label: 'Cari Masjid', bg: 'linear-gradient(160deg, #e3e9ee, #c3d1dc)' },
];

export default function Home() {
  const { user } = useAuth();
  const { t, lang } = useLang();
  const { theme } = useTheme();
  const { next, status: prayerStatus } = usePrayerTimes();
  const [donations, setDonations] = useState(null);
  const [myContributions, setMyContributions] = useState([]);
  const [showSedekahHistory, setShowSedekahHistory] = useState(false);
  const [doas, setDoas] = useState(null);
  const [avatarColor, setAvatarColor] = useState(null);

  useEffect(() => watchActiveDonations(setDonations), []);
  useEffect(() => watchUserProfile(user?.uid, (p) => setAvatarColor(p?.avatarColor || null)), [user?.uid]);
  useEffect(() => watchDoas(setDoas), []);

  useEffect(() => {
    if (!user) return;
    return watchMyContributions(user.uid, setMyContributions);
  }, [user]);

  const mySedekahTotal = myContributions.reduce((sum, c) => sum + c.amount, 0);
  const headline = HEADLINES[todaysHeadlineIndex()][lang];
  // A different photo pool per theme (not the same photo just dimmed —
  // an explicit ask), one per day so it isn't the exact same picture
  // every single visit, same day-of-year approach as the headline above.
  const headerPhoto = todaysHomePhoto(theme);

  return (
    <div className="screen">
      <div className="screen-content">
        <div
          style={{
            position: 'relative',
            borderRadius: 26,
            overflow: 'hidden',
            padding: '18px 20px 22px',
            display: 'flex',
            flexDirection: 'column',
            gap: 16,
          }}
        >
          <img
            src={headerPhoto}
            alt=""
            style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center 40%' }}
          />
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background:
                theme === 'dark'
                  ? 'linear-gradient(160deg, rgba(11,12,10,0.55) 0%, rgba(11,12,10,0.88) 100%)'
                  : 'linear-gradient(160deg, rgba(13,77,71,0.62) 0%, rgba(13,77,71,0.85) 100%)',
            }}
          />
          <div className="topbar" style={{ position: 'relative', zIndex: 1 }}>
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
                  background: 'rgba(255,255,255,0.3)',
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
                    background: avatarColor || 'var(--primary)',
                  }}
                >
                  {(user?.displayName || 'A')[0].toUpperCase()}
                </div>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.75)' }}>{t('greeting')}</span>
                <span style={{ fontSize: 15.5, fontWeight: 700, color: '#fff' }}>{user?.displayName || user?.email}</span>
              </div>
            </div>
            <Link
              to="/pengaturan"
              className="icon-btn"
              aria-label={t('pengaturan')}
              style={{ textDecoration: 'none', background: 'rgba(255,255,255,0.2)', color: '#fff' }}
            >
              <IconBell width="17" height="17" />
            </Link>
          </div>

          <h1
            style={{
              position: 'relative',
              zIndex: 1,
              margin: 0,
              // Was 22px — with a 100-line rotating pool (data/headlines.js)
              // some lines wrapped to 3 visual lines at that size and
              // dominated the whole photo card. 18px keeps every headline
              // to its intended 2 lines (each already has its own \n) at
              // this card's width.
              fontSize: 18,
              lineHeight: 1.35,
              fontWeight: 800,
              letterSpacing: '-0.01em',
              whiteSpace: 'pre-line',
              color: '#fff',
              textShadow: '0 2px 10px rgba(0,0,0,0.25)',
            }}
          >
            {headline}
          </h1>
        </div>

        <Link to="/ask-me" className="input-row" style={{ borderRadius: 999, textDecoration: 'none' }}>
          <IconMoon width="16" height="16" style={{ color: 'var(--ink)' }} />
          <span style={{ flex: 1, fontSize: 13, fontWeight: 500, color: 'var(--muted)' }}>Tanya Ust. Rewin…</span>
          <IconSearch style={{ opacity: 0.6, color: 'var(--ink)' }} />
        </Link>

        <button
          onClick={() => setShowSedekahHistory((v) => !v)}
          style={{ display: 'flex', alignItems: 'center', gap: 12, borderRadius: 20, padding: '14px 15px', background: 'var(--mint)', border: 'none', textAlign: 'left', cursor: 'pointer', font: 'inherit', color: 'inherit', width: '100%' }}
        >
          <Wallet />
          <div style={{ display: 'flex', flexDirection: 'column', gap: 2, flex: 1 }}>
            <span style={{ fontSize: 10.5, fontWeight: 600, color: 'var(--muted)' }}>Total Sedekah</span>
            <span style={{ fontSize: 16, fontWeight: 800, color: 'var(--primary)' }}>
              {formatRupiah(mySedekahTotal)}
            </span>
          </div>
          <span style={{ fontSize: 11, color: 'var(--muted)' }}>{showSedekahHistory ? 'Tutup' : 'Rincian'}</span>
        </button>

        {showSedekahHistory && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {myContributions.length === 0 ? (
              <div className="card" style={{ padding: 16, fontSize: 12.5, color: 'var(--muted)', textAlign: 'center' }}>
                Belum ada donasi. Yuk mulai sedekah hari ini.
              </div>
            ) : (
              myContributions.map((c) => (
                <div
                  key={c.id}
                  style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 14px', borderRadius: 14, background: 'var(--card)' }}
                >
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    <span style={{ fontSize: 13, fontWeight: 700 }}>{c.donationTitle}</span>
                    <span style={{ fontSize: 11, color: 'var(--muted)' }}>{c.createdAt ? dateFmt.format(c.createdAt.toDate()) : 'Baru saja'}</span>
                  </div>
                  <span style={{ fontSize: 13.5, fontWeight: 700, color: 'var(--primary)' }}>+{formatRupiah(c.amount)}</span>
                </div>
              ))
            )}
          </div>
        )}

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
          <GeometricPattern id="prayer-pattern" />
          <div style={{ position: 'relative', zIndex: 1 }}>
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
          </div>
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
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span className="section-label">🤲 Doa & Aminkan</span>
            <Link to="/doa" style={{ display: 'flex', alignItems: 'center', gap: 3, fontSize: 11, fontWeight: 700, color: 'var(--primary)', textDecoration: 'none' }}>
              {t('lihat_semua')}
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="var(--primary)"><path d="m9 6 6 6-6 6" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" /></svg>
            </Link>
          </div>
          {doas && doas.length === 0 && (
            <div className="card" style={{ padding: 16, fontSize: 12.5, color: 'var(--muted)', textAlign: 'center' }}>
              Belum ada doa. Jadilah yang pertama.
            </div>
          )}
          {doas && doas.length > 0 && (
            <div style={{ display: 'flex', gap: 10, overflowX: 'auto', scrollSnapType: 'x mandatory', margin: '0 -20px', padding: '0 20px' }}>
              {doas.map((doa) => (
                <DoaCard key={doa.id} doa={doa} compact />
              ))}
            </div>
          )}
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <span className="section-label">🕌 {t('donasi_kamu')}</span>
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
