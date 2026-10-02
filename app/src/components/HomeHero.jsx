import { Link } from 'react-router-dom';
import PointsBadge from './PointsBadge';
import { IconBell } from './icons';

const GOLD = '#e8b84b';

// Sky per NEXT prayer: what you're counting down to decides the light.
// Subuh = pre-dawn, Dzuhur = bright morning, Ashar = afternoon gold,
// Maghrib = sunset, Isya = dusk/night.
const SKY = {
  Subuh: { g: ['#0f1a45', '#3b3a7a', '#d98a8f', '#f6c39c'], stars: true, orb: { x: 80, y: 86, c: '#ffd9a8', r: 18 }, ground: '#0b1030' },
  Dzuhur: { g: ['#2a78b5', '#6db3e0', '#bfe2f3', '#eaf6fb'], stars: false, orb: { x: 76, y: 16, c: '#fff4c2', r: 22 }, ground: '#14473f' },
  Ashar: { g: ['#2f6fa8', '#7fb0cf', '#f1d9a2', '#f6b96b'], stars: false, orb: { x: 82, y: 40, c: '#ffe3a0', r: 22 }, ground: '#0d2a27' },
  Maghrib: { g: ['#1c2a66', '#8a4f86', '#e5688a', '#f8a24f'], stars: false, orb: { x: 78, y: 82, c: '#ffcf8a', r: 26 }, ground: '#0d2a27' },
  Isya: { g: ['#050818', '#0c1640', '#1a2c66', '#26407f'], stars: true, orb: { x: 84, y: 30, c: '#f3efe0', r: 13 }, ground: '#02040d' },
};
const STARS = [[12, 14], [26, 30], [44, 10], [60, 24], [88, 12], [35, 46], [70, 40], [92, 34], [18, 52], [52, 36]];

// Home's hero. The whole card is one scene: a sky that follows the next
// prayer, a mosque skyline, the countdown set large in a serif (the one
// place the app uses Fraunces), and the day's tip as a single italic line.
export default function HomeHero({ user, avatarPhoto, avatarColor, greeting, settingsLabel, tip, next, status }) {
  const s = SKY[next?.label] || SKY.Isya;
  return (
    <div
      style={{
        position: 'relative',
        overflow: 'hidden',
        borderRadius: '0 0 34px 34px',
        padding: 'calc(18px + env(safe-area-inset-top)) 22px 128px',
        background: `linear-gradient(180deg, ${s.g[0]} 0%, ${s.g[1]} 38%, ${s.g[2]} 72%, ${s.g[3]} 100%)`,
        color: '#fff',
      }}
    >
      <svg aria-hidden="true" width="100%" height="100%" style={{ position: 'absolute', inset: 0 }}>
        {s.stars && STARS.map(([x, y], i) => <circle key={i} cx={`${x}%`} cy={`${y}%`} r={i % 3 === 0 ? 1.6 : 1} fill="#fff" opacity={0.5 + (i % 4) * 0.12} />)}
        <circle cx={`${s.orb.x}%`} cy={`${s.orb.y}%`} r={s.orb.r * 2.4} fill={s.orb.c} opacity="0.16" />
        <circle cx={`${s.orb.x}%`} cy={`${s.orb.y}%`} r={s.orb.r} fill={s.orb.c} opacity="0.95" />
      </svg>
      <svg viewBox="0 0 390 90" preserveAspectRatio="none" width="100%" height="120" style={{ position: 'absolute', left: 0, right: 0, bottom: 0 }} aria-hidden="true">
        <path
          fill={s.ground}
          d="M0 90V70h18V58l6-10 6 10v12h14V62h10V40l3-8 3 8v22h6V70h20V56c0-12 14-22 28-22s28 10 28 22v14h14V60l4-14 4 14v10h18V50l3-12 3 12v20h20V64c0-8 8-14 16-14s16 6 16 14v6h22V54c0-14 14-26 30-26s30 12 30 26v16h16V58l4-16 4 16v12h20V66h22v24Z"
        />
      </svg>

      <div style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 10 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, minWidth: 0 }}>
          <div
            style={{
              width: 40,
              height: 40,
              borderRadius: '50%',
              flexShrink: 0,
              overflow: 'hidden',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 800,
              background: avatarColor || 'var(--primary)',
              boxShadow: `0 0 0 2px ${GOLD}`,
            }}
          >
            {avatarPhoto ? <img src={avatarPhoto} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} /> : (user?.displayName || 'A')[0].toUpperCase()}
          </div>
          <div style={{ lineHeight: 1.25, minWidth: 0 }}>
            <div style={{ fontSize: 11.5, opacity: 0.8 }}>{greeting}</div>
            <div style={{ fontSize: 14.5, fontWeight: 700, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{user?.displayName || user?.email}</div>
          </div>
        </div>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexShrink: 0 }}>
          {user && <PointsBadge uid={user.uid} />}
          <Link to="/pengaturan" className="icon-btn" aria-label={settingsLabel} style={{ textDecoration: 'none', background: 'rgba(255,255,255,0.18)', color: '#fff' }}>
            <IconBell width="17" height="17" />
          </Link>
        </div>
      </div>

      <div style={{ position: 'relative', marginTop: 34 }}>
        {status === 'ready' && next ? (
          <>
            <div style={{ fontSize: 12, letterSpacing: '0.16em', textTransform: 'uppercase', opacity: 0.85, fontWeight: 600 }}>Menuju {next.label}</div>
            <div style={{ fontFamily: "'Fraunces', Georgia, serif", fontSize: 76, lineHeight: 1, fontWeight: 500, letterSpacing: '-0.03em', marginTop: 6 }}>{next.time}</div>
            <div style={{ marginTop: 8, fontSize: 14, opacity: 0.92, fontVariantNumeric: 'tabular-nums' }}>{next.countdown} lagi</div>
          </>
        ) : (
          <>
            <div style={{ fontSize: 12, letterSpacing: '0.16em', textTransform: 'uppercase', opacity: 0.85, fontWeight: 600 }}>Jadwal Sholat</div>
            <div style={{ fontFamily: "'Fraunces', Georgia, serif", fontSize: 76, lineHeight: 1, fontWeight: 500, marginTop: 6, opacity: 0.5 }}>--:--</div>
            <div style={{ marginTop: 8, fontSize: 14, opacity: 0.92 }}>{status === 'denied' ? 'Izinkan akses lokasi buat lihat jadwal sholat' : status === 'error' ? 'Gagal memuat jadwal sholat' : 'Memuat jadwal sholat…'}</div>
          </>
        )}
      </div>

      <div style={{ position: 'relative', marginTop: 26, display: 'flex', gap: 10, alignItems: 'flex-start', maxWidth: 235 }}>
        <span style={{ width: 22, height: 1.5, background: GOLD, marginTop: 9, flexShrink: 0 }} />
        <span style={{ fontSize: 13, lineHeight: 1.5, fontStyle: 'italic', opacity: 0.95, textWrap: 'pretty' }}>{tip}</span>
      </div>
    </div>
  );
}
