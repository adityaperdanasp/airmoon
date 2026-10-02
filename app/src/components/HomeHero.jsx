import { Link } from 'react-router-dom';
import FadeImage from './FadeImage';
import PointsBadge from './PointsBadge';
import { IconBell } from './icons';

const GOLD = '#e8b84b';

// Home's top card (2026-10-02 redesign). One composition instead of a
// photo header with a tip panel stuck on: the photo runs full-bleed, a
// bottom-weighted gradient carries the text, and the day's tip is set as
// the card's typographic centrepiece (gold rule + label + pull-quote),
// not a separate widget. The gold hairline frame and the lattice texture
// are the same two devices the share cards and the Jadwal Sholat card
// below already use, so this reads as part of the same family.
export default function HomeHero({ theme, photo, user, avatarPhoto, avatarColor, greeting, settingsLabel, tip }) {
  const dark = theme === 'dark';
  return (
    <div
      style={{
        position: 'relative',
        borderRadius: 28,
        overflow: 'hidden',
        padding: '18px 20px 22px',
        minHeight: 272,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        gap: 28,
      }}
    >
      <FadeImage
        src={photo}
        alt=""
        style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center 30%' }}
      />

      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          inset: 0,
          background: dark
            ? 'linear-gradient(180deg, rgba(11,12,10,0.45) 0%, rgba(11,12,10,0.2) 22%, rgba(11,12,10,0.82) 55%, rgba(8,9,7,0.97) 100%)'
            : 'linear-gradient(180deg, rgba(10,54,48,0.45) 0%, rgba(10,54,48,0.15) 22%, rgba(8,44,40,0.84) 55%, rgba(6,34,30,0.97) 100%)',
        }}
      />

      <svg
        aria-hidden="true"
        width="100%"
        height="100%"
        style={{
          position: 'absolute',
          inset: 0,
          opacity: 0.12,
          pointerEvents: 'none',
          WebkitMaskImage: 'linear-gradient(180deg, transparent 40%, #000 100%)',
          maskImage: 'linear-gradient(180deg, transparent 40%, #000 100%)',
        }}
      >
        <defs>
          <pattern id="hero-lattice" width="30" height="30" patternUnits="userSpaceOnUse">
            <path d="M15 1 L29 15 L15 29 L1 15 Z" fill="none" stroke="#fff" strokeWidth="1" />
            <circle cx="15" cy="15" r="1.6" fill="#fff" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#hero-lattice)" />
      </svg>

      <div
        aria-hidden="true"
        style={{ position: 'absolute', inset: 0, borderRadius: 28, boxShadow: `inset 0 0 0 1px ${GOLD}55`, pointerEvents: 'none' }}
      />

      <div className="topbar" style={{ position: 'relative', zIndex: 1 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 11, minWidth: 0 }}>
          <div
            style={{
              width: 44,
              height: 44,
              borderRadius: '50%',
              padding: 2,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: `linear-gradient(135deg, ${GOLD}, rgba(255,255,255,0.35))`,
              flexShrink: 0,
            }}
          >
            {avatarPhoto ? (
              <img src={avatarPhoto} alt="" style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover', display: 'block' }} />
            ) : (
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
            )}
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', minWidth: 0 }}>
            <span style={{ fontSize: 11.5, color: 'rgba(255,255,255,0.78)', letterSpacing: '0.01em' }}>{greeting}</span>
            <span style={{ fontSize: 15.5, fontWeight: 700, color: '#fff', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {user?.displayName || user?.email}
            </span>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
          {user && <PointsBadge uid={user.uid} />}
          <Link
            to="/pengaturan"
            className="icon-btn"
            aria-label={settingsLabel}
            style={{ textDecoration: 'none', background: 'rgba(255,255,255,0.18)', color: '#fff' }}
          >
            <IconBell width="17" height="17" />
          </Link>
        </div>
      </div>

      <div style={{ position: 'relative', zIndex: 1, display: 'flex', flexDirection: 'column', gap: 10 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <span style={{ width: 26, height: 1.5, borderRadius: 2, background: GOLD }} />
          <span style={{ fontSize: 10, fontWeight: 700, color: GOLD, textTransform: 'uppercase', letterSpacing: '0.18em' }}>Tips Hari Ini</span>
        </div>
        <p
          style={{
            margin: 0,
            fontSize: 17,
            lineHeight: 1.5,
            fontWeight: 600,
            color: '#fff',
            letterSpacing: '-0.005em',
            textWrap: 'pretty',
            textShadow: '0 1px 12px rgba(0,0,0,0.35)',
          }}
        >
          {tip}
        </p>
      </div>
    </div>
  );
}
