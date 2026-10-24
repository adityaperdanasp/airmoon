import { Link } from 'react-router-dom';
import PointsBadge from './PointsBadge';
import { IconBell } from './icons';
import { getSeason } from '../lib/seasonal';

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
// Sentuhan musiman di sudut kanan atas hero (hanya hiasan, aria-hidden).
function SeasonOrnament({ id }) {
  if (id === 'ramadhan') {
    const lantern = (x, drop, sc) => (
      <g transform={`translate(${x} 0) scale(${sc})`}>
        <line x1="0" y1="0" x2="0" y2={drop} stroke="#e8b84b" strokeWidth="1.2" opacity=".8" />
        <g transform={`translate(0 ${drop})`}>
          <circle cx="0" cy="22" r="26" fill="#ffd27a" opacity=".16" />
          <path d="M-9 4h18l3 6v20l-3 6h-18l-3-6v-20z" fill="#e8b84b" opacity=".92" />
          <path d="M-5 10h10v20h-10z" fill="#fff3c9" opacity=".85" />
          <rect x="-6" y="0" width="12" height="4" rx="1.5" fill="#b8892a" />
          <rect x="-6" y="36" width="12" height="3" rx="1.5" fill="#b8892a" />
        </g>
      </g>
    );
    return <svg aria-hidden="true" width="150" height="150" viewBox="0 0 150 150" style={{ position: 'absolute', right: 6, top: 58, pointerEvents: 'none' }}>{lantern(34, 14, 0.9)}{lantern(78, 40, 1.1)}{lantern(118, 6, 0.75)}</svg>;
  }
  if (id === 'idulfitri' || id === 'iduladha') {
    return (
      <svg aria-hidden="true" width="150" height="130" viewBox="0 0 150 130" style={{ position: 'absolute', right: 8, top: 4, pointerEvents: 'none' }}>
        {[[20, 18, 2.2], [60, 40, 1.6], [112, 22, 2.4], [132, 70, 1.6], [90, 80, 1.4], [36, 76, 1.8]].map(([x, y, r], i) => (
          <circle key={i} cx={x} cy={y} r={r} fill="#ffe29a" opacity={0.55 + (i % 3) * 0.15} />
        ))}
        <path d="M84 20a26 26 0 1 0 22 42a20 20 0 1 1-22-42z" fill="#f6dc9b" opacity=".92" />
      </svg>
    );
  }
  if (id === 'jumat') {
    return (
      <svg aria-hidden="true" width="190" height="190" viewBox="0 0 190 190" style={{ position: 'absolute', right: -20, top: -20, pointerEvents: 'none' }}>
        <defs>
          <radialGradient id="jr" cx="50%" cy="50%" r="50%">
            <stop offset="0" stopColor="#fff2c2" stopOpacity=".55" />
            <stop offset="1" stopColor="#fff2c2" stopOpacity="0" />
          </radialGradient>
        </defs>
        <circle cx="105" cy="85" r="90" fill="url(#jr)" />
        {[0, 1, 2, 3, 4, 5, 6].map((i) => (
          <line key={i} x1="105" y1="85" x2={105 + 120 * Math.cos((Math.PI / 6) * (i + 1.2))} y2={85 + 120 * Math.sin((Math.PI / 6) * (i + 1.2))} stroke="#fff2c2" strokeOpacity=".16" strokeWidth="6" />
        ))}
      </svg>
    );
  }
  // arafah, asyura: a soft golden glow only
  return (
    <svg aria-hidden="true" width="180" height="180" viewBox="0 0 180 180" style={{ position: 'absolute', right: -10, top: -10, pointerEvents: 'none' }}>
      <defs>
        <radialGradient id="gr" cx="50%" cy="50%" r="50%">
          <stop offset="0" stopColor="#ffd98a" stopOpacity=".5" />
          <stop offset="1" stopColor="#ffd98a" stopOpacity="0" />
        </radialGradient>
      </defs>
      <circle cx="100" cy="80" r="80" fill="url(#gr)" />
    </svg>
  );
}

export default function HomeHero({ user, avatarPhoto, avatarColor, greeting, settingsLabel, tip, next, status, hijri }) {
  const s = SKY[next?.label] || SKY.Isya;
  const season = getSeason(hijri);
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

      {season && <SeasonOrnament id={season.id} />}
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
          <Link to="/cari" className="icon-btn" aria-label="Cari ayat, doa, atau fitur" style={{ textDecoration: 'none', background: 'rgba(255,255,255,0.18)', color: '#fff' }}>
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden="true">
              <circle cx="11" cy="11" r="6.5" strokeWidth="1.8" /><path d="m20 20-4-4" strokeWidth="1.8" strokeLinecap="round" />
            </svg>
          </Link>
          <Link to="/pengaturan" className="icon-btn" aria-label={settingsLabel} style={{ textDecoration: 'none', background: 'rgba(255,255,255,0.18)', color: '#fff' }}>
            <IconBell width="17" height="17" />
          </Link>
        </div>
      </div>

      <div style={{ position: 'relative', marginTop: season ? 22 : 34 }}>
        {season && (
          <span style={{ display: 'inline-block', marginBottom: 12, padding: '5px 12px', borderRadius: 999, fontSize: 11, fontWeight: 700, background: 'rgba(255,255,255,0.16)', border: '1px solid rgba(255,255,255,0.28)', backdropFilter: 'blur(8px)', WebkitBackdropFilter: 'blur(8px)' }}>
            {season.label}
          </span>
        )}
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
