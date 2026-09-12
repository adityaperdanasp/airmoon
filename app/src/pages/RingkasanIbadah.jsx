import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { watchKhatamProgress, TOTAL_MUSHAF_PAGES, TOTAL_JUZ } from '../lib/khatamProgress';
import { watchDzikirStreak } from '../lib/dzikirStreak';
import { watchMyContributions } from '../lib/donations';
import { watchPuasaSunnahLog } from '../lib/puasaSunnahLog';
import { watchReadingStats } from '../lib/readingTime';
import { watchReadingStreak } from '../lib/readingStreak';
import { highestTier, highestHafalanTier } from '../lib/badges';
import { watchHafalanProgress } from '../lib/hafalanProgress';
import { formatRupiah } from '../lib/zakat';
import { fetchRecentAmalanHarian } from '../lib/amalanHarian';
import PageHeaderPhoto from '../components/PageHeaderPhoto';
import { PAGE_PHOTOS } from '../data/photos';
import CountUp from '../components/CountUp';
import EmptyState from '../components/EmptyState';
import { SkeletonCard } from '../components/Skeleton';
import Sparkline from '../components/Sparkline';
import RingkasanIbadahShareModal from '../components/RingkasanIbadahShareModal';

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
  const { theme } = useTheme();
  const [showShareModal, setShowShareModal] = useState(false);
  const [khatam, setKhatam] = useState({ pages: [], juz: [] });
  const [streaks, setStreaks] = useState({});
  const [contributions, setContributions] = useState([]);
  const [puasaDates, setPuasaDates] = useState(null);
  const [readingStats, setReadingStats] = useState({ totalMinutes: 0 });
  const [readingStreak, setReadingStreak] = useState({ current: 0, best: 0 });
  // [UI 2026-09-11] "Tren 7 Hari" — every stat here was a bare number with
  // no sense of direction (climbing or slipping lately). Reuses the same
  // daily amalanHarian score PointsBadge's own 7-day chart already fetches
  // (see components/PointsDetailSheet.jsx), just rendered as a compact
  // sparkline instead of a full bar-per-day breakdown — this dashboard
  // already has 5+ stat tiles, no room for another full chart.
  const [recentDays, setRecentDays] = useState(null);
  // Every stat card used to flash "0" for a moment before its own
  // Firestore listener delivered its first snapshot — a real, if brief,
  // gap since none of these default states (empty arrays, zeroed
  // objects) can be told apart from "actually zero" at a glance. Tracks
  // each source's first-callback separately (rather than one combined
  // guess) since they resolve at genuinely different times.
  const [hafalanVerses, setHafalanVerses] = useState([]);
  const [loaded, setLoaded] = useState({ khatam: false, streaks: false, contributions: false, puasa: false, readingStats: false, readingStreak: false, hafalan: false });
  const markLoaded = (key) => setLoaded((prev) => (prev[key] ? prev : { ...prev, [key]: true }));
  const allLoaded = Object.values(loaded).every(Boolean);

  useEffect(() => watchKhatamProgress(user?.uid, (v) => { setKhatam(v); markLoaded('khatam'); }), [user?.uid]);
  useEffect(() => watchDzikirStreak(user?.uid, (v) => { setStreaks(v); markLoaded('streaks'); }), [user?.uid]);
  useEffect(() => {
    if (!user?.uid) return;
    return watchMyContributions(user.uid, (v) => { setContributions(v); markLoaded('contributions'); });
  }, [user?.uid]);
  useEffect(() => watchPuasaSunnahLog(user?.uid, (v) => { setPuasaDates(v); markLoaded('puasa'); }), [user?.uid]);
  useEffect(() => watchReadingStats(user?.uid, (v) => { setReadingStats(v); markLoaded('readingStats'); }), [user?.uid]);
  useEffect(() => watchReadingStreak(user?.uid, (v) => { setReadingStreak(v); markLoaded('readingStreak'); }), [user?.uid]);
  useEffect(() => watchHafalanProgress(user?.uid, (v) => { setHafalanVerses(v); markLoaded('hafalan'); }), [user?.uid]);
  useEffect(() => {
    if (!user?.uid) return;
    // [PM 2026-09-12] Widened from 7 to 28 days — the sparkline below only
    // ever needed the last 7, but "hari paling konsisten kamu" (which day
    // of the week you actually show up most) needs a real sample size a
    // single week can't give; one extra month of the same already-cheap
    // per-day getDoc reads (see fetchRecentAmalanHarian's own note on why
    // this isn't a range query) covers both without a second fetch.
    fetchRecentAmalanHarian(user.uid, 28).then(setRecentDays);
  }, [user?.uid]);

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

  // [PM 2026-09-12] "Hari paling konsisten kamu" — a small personal
  // insight computed entirely client-side from the same 28-day fetch the
  // sparkline above already made, no new backend call. Averages each
  // weekday's score across however many occurrences of it fell in the
  // window (4 or 5, depending on the exact date range) rather than
  // summing, so a weekday that happened to land 5 times isn't unfairly
  // favored over one that landed 4. Needs at least 2 real (non-zero)
  // days logged before showing anything — otherwise "paling konsisten"
  // on a near-empty history is just noise, not a real insight.
  const WEEKDAY_LABELS = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
  let bestWeekday = null;
  if (recentDays && recentDays.some((d) => d.score > 0)) {
    const totals = Array(7).fill(0);
    const counts = Array(7).fill(0);
    recentDays.forEach((d) => {
      const dow = new Date(`${d.dateKey}T00:00:00`).getDay();
      totals[dow] += d.score;
      counts[dow] += 1;
    });
    const averages = totals.map((t, i) => (counts[i] ? t / counts[i] : 0));
    const bestIdx = averages.reduce((best, v, i) => (v > averages[best] ? i : best), 0);
    if (averages[bestIdx] > 0) bestWeekday = { label: WEEKDAY_LABELS[bestIdx], avg: averages[bestIdx] };
  }
  const totalMinutes = readingStats.totalMinutes || 0;
  const hours = Math.floor(totalMinutes / 60);
  const mins = totalMinutes % 60;

  // Ekspor Ringkasan Ibadah ke Teks — a plain readable .txt of the same 6
  // stats this page shows, separate from the image-share card (which is
  // meant to be posted, not archived/re-read as text).
  function handleExportText() {
    const lines = [
      `Progress Khatam Qur'an: ${khatamPct}% (${khatam.pages.length}/${TOTAL_MUSHAF_PAGES} halaman · ${khatam.juz.length}/${TOTAL_JUZ} juz)`,
      `Rentetan Dzikir Terbaik: ${bestStreak} hari${badgeTier ? ` (${badgeTier.icon} Badge ${badgeTier.label})` : ''}`,
      `Total Sedekah: ${formatRupiah(totalSedekah)} (${contributions.length} kali berdonasi)`,
      `Puasa Sunnah: ${puasaDates?.length || 0}x (Senin/Kamis & Ayyamul Bidh)`,
      `Streak Baca Qur'an: ${readingStreak.current} hari${readingStreak.best > readingStreak.current ? ` (rekor ${readingStreak.best} hari)` : ''}`,
      `Total Waktu Baca Qur'an: ${hours > 0 ? `${hours} jam ${mins} menit` : `${mins} menit`}`,
    ];
    const text = `Ringkasan Ibadah — airmoon\n${new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}\n\n${lines.join('\n')}`;
    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'ringkasan-ibadah-airmoon.txt';
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="screen">
      <div className="screen-content">
        <PageHeaderPhoto
          title="Ringkasan Ibadah"
          photo={PAGE_PHOTOS.zakat}
          subtitle="Semua progres kamu, satu tempat"
          right={
            allLoaded && (
              <div style={{ display: 'flex', gap: 6 }}>
                <button className="icon-btn" onClick={handleExportText} aria-label="Ekspor ke teks" title="Ekspor ke teks">
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path d="M12 3v13m0 0-4-4m4 4 4-4M5 19h14" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </button>
                <button className="icon-btn" onClick={() => setShowShareModal(true)} aria-label="Bagikan ringkasan" title="Bagikan ringkasan">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <circle cx="18" cy="5" r="3" strokeWidth="1.6" /><circle cx="6" cy="12" r="3" strokeWidth="1.6" /><circle cx="18" cy="19" r="3" strokeWidth="1.6" />
                    <path d="M8.6 10.5 15.4 6.5M8.6 13.5 15.4 17.5" strokeWidth="1.6" />
                  </svg>
                </button>
              </div>
            )
          }
        />

        {!allLoaded && (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
            {Array.from({ length: 5 }).map((_, i) => (
              <SkeletonCard key={i} height={92} radius={16} />
            ))}
          </div>
        )}

        {allLoaded && (
        <>
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
          <StatCard icon="📚" label="Streak Baca Qur'an" value={<CountUp value={readingStreak.current} formatter={(v) => `${v} hari`} />} sub={readingStreak.best > readingStreak.current ? `Rekor ${readingStreak.best} hari` : 'Buka Qur\'an tiap hari buat jaga streak'} />
          <StatCard
            icon="🧠"
            label="Ayat Dihafal"
            value={<CountUp value={hafalanVerses.length} formatter={(v) => `${v}`} />}
            sub={highestHafalanTier(hafalanVerses.length) ? `${highestHafalanTier(hafalanVerses.length).icon} Badge ${highestHafalanTier(hafalanVerses.length).label}` : 'Tandai ayat yang udah dihafal di Qur\'an'}
          />
        </div>

        {recentDays && (
          <div className="card" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 14, padding: 16 }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              <span style={{ fontSize: 13, fontWeight: 800 }}>📈 Tren 7 Hari</span>
              <span style={{ fontSize: 10.5, color: 'var(--muted)' }}>Poin Amalan Harian, per hari</span>
            </div>
            <Sparkline values={recentDays.slice(-7).map((d) => d.score)} max={recentDays[0]?.max} />
          </div>
        )}

        {bestWeekday && (
          <div className="card" style={{ display: 'flex', alignItems: 'center', gap: 12, padding: 16 }}>
            <span style={{ fontSize: 22 }}>⭐</span>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              <span style={{ fontSize: 13, fontWeight: 800 }}>Kamu paling konsisten di hari {bestWeekday.label}</span>
              <span style={{ fontSize: 10.5, color: 'var(--muted)' }}>Rata-rata {bestWeekday.avg.toFixed(1)} poin, dari 4 minggu terakhir</span>
            </div>
          </div>
        )}

        <div className="card" style={{ display: 'flex', alignItems: 'center', gap: 14, padding: 16 }}>
          <span style={{ fontSize: 28, lineHeight: 1 }}>⏱️</span>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
            <span style={{ fontSize: 15, fontWeight: 800 }}>{hours > 0 ? `${hours} jam ${mins} menit` : `${mins} menit`}</span>
            <span style={{ fontSize: 11, color: 'var(--muted)' }}>Total waktu baca Qur'an (Mode Ayat + Mushaf)</span>
          </div>
        </div>
        </>
        )}

        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10, padding: '13px 14px', borderRadius: 14, background: 'var(--card)' }}>
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="var(--muted)" style={{ flexShrink: 0, marginTop: 1 }}>
            <circle cx="12" cy="12" r="9" strokeWidth="1.6" /><path d="M12 11v5.5M12 8v.01" strokeWidth="1.8" strokeLinecap="round" />
          </svg>
          <span style={{ fontSize: 11, lineHeight: 1.5, color: 'var(--muted)' }}>
            Rentetan dzikir dihitung dari yang terbaik antara Dzikir Pagi & Petang. Mau bagikan angka-angka ini sebagai kartu? Buka Pengaturan → Kartu Pencapaian.
          </span>
        </div>
      </div>

      {showShareModal && (
        <RingkasanIbadahShareModal
          displayName={user.displayName || 'Sahabat airmoon'}
          khatamPct={khatamPct}
          badgeLabel={badgeTier ? `${badgeTier.icon} ${badgeTier.label}` : 'Belum ada badge'}
          totalSedekah={formatRupiah(totalSedekah)}
          puasaCount={puasaDates?.length || 0}
          readingStreakDays={readingStreak.current}
          readingTimeLabel={hours > 0 ? `${hours} jam ${mins} menit` : `${mins} menit`}
          theme={theme}
          onClose={() => setShowShareModal(false)}
        />
      )}
    </div>
  );
}
