import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import TopBar from '../components/TopBar';
import CountUp from '../components/CountUp';
import { SkeletonCard } from '../components/Skeleton';
import { watchPublicImpactStats } from '../lib/publicStats';
import { formatRupiah } from '../lib/zakat';

function StatCard({ icon, label, value }) {
  return (
    <div className="card" style={{ display: 'flex', alignItems: 'center', gap: 12, padding: 18 }}>
      <span style={{ fontSize: 26 }}>{icon}</span>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
        <span style={{ fontSize: 18, fontWeight: 800 }}>{value}</span>
        <span style={{ fontSize: 11.5, color: 'var(--muted)' }}>{label}</span>
      </div>
    </div>
  );
}

// Dampak airmoon (2026-09-12) — a public stats page, not behind
// ProtectedRoute (same reasoning as /privacy-policy: something worth
// showing signed-out, here for social proof/shareability rather than a
// crawler requirement). Pulls from publicStats/impact, a small daily
// snapshot computed server-side — see lib/publicStats.js for why a real
// user count has no client-side path at all.
export default function DampakAirmoon() {
  const [stats, setStats] = useState(undefined); // undefined = loading, null = no snapshot yet

  useEffect(() => watchPublicImpactStats(setStats), []);

  return (
    <div className="screen">
      <div className="screen-content">
        <TopBar title="Dampak airmoon" />

        <p style={{ margin: 0, fontSize: 12.5, color: 'var(--muted)', lineHeight: 1.6 }}>
          Sekilas dampak nyata dari komunitas airmoon — diperbarui sekali sehari.
        </p>

        {stats === undefined && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {Array.from({ length: 3 }).map((_, i) => <SkeletonCard key={i} height={64} radius={18} />)}
          </div>
        )}

        {stats === null && (
          <p className="state-msg">Data dampak belum tersedia — cek lagi besok.</p>
        )}

        {stats && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            <StatCard icon="💝" label="Total sedekah tersalurkan" value={<CountUp value={stats.totalSedekah} formatter={formatRupiah} />} />
            <StatCard icon="🕌" label="Campaign masjid terbantu" value={<CountUp value={stats.totalMasjid} formatter={(v) => `${v} campaign`} />} />
            <StatCard icon="🌙" label="Pengguna airmoon" value={<CountUp value={stats.totalUsers} formatter={(v) => `${v.toLocaleString('id-ID')} orang`} />} />
          </div>
        )}

        <Link to="/donasi" className="btn" style={{ textAlign: 'center', textDecoration: 'none' }}>
          Ikut Berdonasi
        </Link>
      </div>
    </div>
  );
}
