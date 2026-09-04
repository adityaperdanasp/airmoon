import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { watchKhatamProgress, TOTAL_MUSHAF_PAGES, TOTAL_JUZ } from '../lib/khatamProgress';
import { watchDzikirStreak } from '../lib/dzikirStreak';
import { watchMyContributions } from '../lib/donations';
import { watchPuasaSunnahLog } from '../lib/puasaSunnahLog';
import { watchReadingStats } from '../lib/readingTime';
import { highestTier } from '../lib/badges';
import { formatRupiah } from '../lib/zakat';
import PageHeaderPhoto from '../components/PageHeaderPhoto';
import { PAGE_PHOTOS } from '../data/photos';
import CountUp from '../components/CountUp';
import EmptyState from '../components/EmptyState';

function StatCard({ icon, label, value, sub }) {
  return (
    <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: 4, padding: 16 }}>
      <span style={{ fontSize: 20, lineHeight: 1 }}>{icon}</span>
      <span style={{ fontSize: 22, fontWeight: 800, color: 'var(--primary)' }}>{value}</span>
      <span style={{ fontSize: 11.5, fontWeight: 700 }}>{label}</span>
      {sub && <span style={{ fontSize: 10, color: 'var(--muted)' }}>{sub}</span>}
    </div>
  );
}

// A real dashboard combining every ibadah tracker this app has grown over
// time (Progress Khatam, dzikir streaks, lifetime sedekah, puasa sunnah,
// waktu baca) into one place — distinct from Kartu Pencapaian
// (AchievementShareModal.jsx), which is a point-in-time shareable image
// snapshot of just 3 of these; this is a real, always-current in-app page
// you'd actually revisit to check "how am I doing overall lately."
export default function RingkasanIbadah() {
  const { user } = useAuth();
  const [khatam, setKhatam] = useState({ pages: [], juz: [] });
  const [streaks, setStreaks] = useState({});
  const [contributions, setContributions] = useState([]);
  const [puasaDates, setPuasaDates] = useState(null);
  const [readingStats, setReadingStats] = useState({ totalMinutes: 0 });

  useEffect(() => watchKhatamProgress(user?.uid, setKhatam), [user?.uid]);
  useEffect(() => watchDzikirStreak(user?.uid, setStreaks), [user?.uid]);
  useEffect(() => {
    if (!user?.uid) return;
    return watchMyContributions(user.uid, setContributions);
  }, [user?.uid]);
  useEffect(() => watchPuasaSunnahLog(user?.uid, setPuasaDates), [user?.uid]);
  useEffect(() => watchReadingStats(user?.uid, setReadingStats), [user?.uid]);

  if (!user) {
    return (
      <div className="screen">
        <div className="screen-content">
          <PageHeaderPhoto title="Ringkasan Ibadah" photo={PAGE_PHOTOS.zakat} />
          <EmptyState icon="🕌" title="Masuk dulu ya" subtitle="Ringkasan ibadah cuma bisa dilihat setelah kamu masuk akun." />
        </div>
      </div>
    );
  }

  const khatamPct = Math.round((khatam.pages.length / TOTAL_MUSHAF_PAGES) * 100);
  const bestStreak = Math.max(streaks?.pagi?.best || 0, streaks?.petang?.best || 0);
  const badgeTier = highestTier(bestStreak);
  const totalSedekah = contributions.reduce((sum, c) => sum + (c.amount || 0), 0);
  const totalMinutes = readingStats.totalMinutes || 0;
  const hours = Math.floor(totalMinutes / 60);
  const mins = totalMinutes % 60;

  return (
    <div className="screen">
      <div className="screen-content">
        <PageHeaderPhoto title="Ringkasan Ibadah" photo={PAGE_PHOTOS.zakat} subtitle="Semua progres kamu, satu tempat" />

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
          <StatCard icon="📖" label="Progress Khatam" value={<CountUp value={khatamPct} formatter={(v) => `${v}%`} />} sub={`${khatam.pages.length}/${TOTAL_MUSHAF_PAGES} halaman · ${khatam.juz.length}/${TOTAL_JUZ} juz`} />
          <StatCard
            icon="🔥"
            label="Rentetan Dzikir Terbaik"
            value={<CountUp value={bestStreak} formatter={(v) => `${v} hari`} />}
            sub={badgeTier ? `${badgeTier.icon} Badge ${badgeTier.label}` : 'Belum ada badge'}
          />
          <StatCard icon="💝" label="Total Sedekah" value={<CountUp value={totalSedekah} formatter={formatRupiah} />} sub={`${contributions.length} kali berdonasi`} />
          <StatCard icon="🌙" label="Puasa Sunnah" value={puasaDates === null ? '…' : <CountUp value={puasaDates.length} formatter={(v) => `${v}x`} />} sub="Senin/Kamis & Ayyamul Bidh" />
        </div>

        <div className="card" style={{ display: 'flex', alignItems: 'center', gap: 14, padding: 16 }}>
          <span style={{ fontSize: 28, lineHeight: 1 }}>⏱️</span>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
            <span style={{ fontSize: 15, fontWeight: 800 }}>{hours > 0 ? `${hours} jam ${mins} menit` : `${mins} menit`}</span>
            <span style={{ fontSize: 11, color: 'var(--muted)' }}>Total waktu baca Qur'an (Mode Ayat + Mushaf)</span>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10, padding: '13px 14px', borderRadius: 14, background: 'var(--card)' }}>
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="var(--muted)" style={{ flexShrink: 0, marginTop: 1 }}>
            <circle cx="12" cy="12" r="9" strokeWidth="1.6" /><path d="M12 11v5.5M12 8v.01" strokeWidth="1.8" strokeLinecap="round" />
          </svg>
          <span style={{ fontSize: 11, lineHeight: 1.5, color: 'var(--muted)' }}>
            Rentetan dzikir dihitung dari yang terbaik antara Dzikir Pagi & Petang. Mau bagikan angka-angka ini sebagai kartu? Buka Pengaturan → Kartu Pencapaian.
          </span>
        </div>
      </div>
    </div>
  );
}
