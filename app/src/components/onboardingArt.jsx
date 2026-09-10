// Themed illustrations for the 5-slide OnboardingTour — bigger, more
// characteristic scenes than the small Lainnya-grid service icons the
// tour used to borrow. Flat two-tone (brand teal + gold) on transparent
// so they sit on either theme's background; ~160 viewBox, drawn to read
// at ~150px. Decorative only.

const TEAL = '#1c8577';
const TEAL_DEEP = '#0a4a43';
const GOLD = '#e8b84b';
const GOLD_SOFT = '#f3d999';

function Frame({ children }) {
  return (
    <svg width="150" height="150" viewBox="0 0 160 160" fill="none" aria-hidden="true">
      {children}
    </svg>
  );
}

// 1 — Welcome: a lantern-lit arch with a crescent
export function ArtWelcome() {
  return (
    <Frame>
      <path d="M40 132 V70 a40 40 0 0 1 80 0 V132 Z" fill={TEAL} />
      <path d="M52 132 V72 a28 28 0 0 1 56 0 V132 Z" fill={TEAL_DEEP} />
      <path d="M96 44 a20 20 0 1 0 6 30 a16 16 0 1 1 -6 -30 Z" fill={GOLD} />
      <circle cx="112" cy="52" r="3.2" fill={GOLD_SOFT} />
      <rect x="34" y="130" width="92" height="8" rx="3" fill={GOLD} />
      <path d="M62 132 v-30 a18 18 0 0 1 36 0 v30" fill={GOLD_SOFT} opacity="0.35" />
    </Frame>
  );
}

// 2 — Qur'an: an open book with light rising from the gutter
export function ArtQuran() {
  return (
    <Frame>
      <g stroke={GOLD} strokeWidth="3" strokeLinecap="round" opacity="0.8">
        <line x1="80" y1="38" x2="80" y2="20" />
        <line x1="58" y1="44" x2="48" y2="28" />
        <line x1="102" y1="44" x2="112" y2="28" />
      </g>
      <path d="M80 60 C64 48 40 48 28 56 V118 C40 110 64 110 80 122 Z" fill={TEAL} />
      <path d="M80 60 C96 48 120 48 132 56 V118 C120 110 96 110 80 122 Z" fill={TEAL_DEEP} />
      <g stroke={GOLD_SOFT} strokeWidth="2.4" strokeLinecap="round" opacity="0.6">
        <line x1="40" y1="70" x2="66" y2="70" />
        <line x1="40" y1="82" x2="66" y2="82" />
        <line x1="40" y1="94" x2="60" y2="94" />
        <line x1="94" y1="70" x2="120" y2="70" />
        <line x1="94" y1="82" x2="120" y2="82" />
        <line x1="100" y1="94" x2="120" y2="94" />
      </g>
      <rect x="76" y="58" width="8" height="66" rx="2" fill={GOLD} />
    </Frame>
  );
}

// 3 — Prayer times / adzan: a minaret sounding
export function ArtAdzan() {
  return (
    <Frame>
      <rect x="66" y="52" width="20" height="80" rx="4" fill={TEAL} />
      <path d="M62 52 h28 l-6 -12 h-16 Z" fill={TEAL_DEEP} />
      <path d="M76 22 a10 10 0 0 0 4 16 a8 8 0 1 1 -4 -16 Z" fill={GOLD} />
      <rect x="60" y="128" width="32" height="8" rx="3" fill={GOLD} />
      <g stroke={GOLD} strokeWidth="3.4" strokeLinecap="round" fill="none">
        <path d="M96 66 a22 22 0 0 1 0 40" />
        <path d="M106 58 a38 38 0 0 1 0 56" opacity="0.55" />
      </g>
    </Frame>
  );
}

// 4 — PLN-direct donation: a mosque wired to a spark
export function ArtDonation() {
  return (
    <Frame>
      <path d="M36 128 V78 h56 v50 Z" fill={TEAL} />
      <path d="M32 78 L64 52 L96 78 Z" fill={TEAL_DEEP} />
      <path d="M60 40 a9 9 0 0 0 4 15 a7 7 0 1 1 -4 -15 Z" fill={GOLD} />
      <rect x="30" y="126" width="68" height="8" rx="3" fill={GOLD} />
      <path d="M104 60 l-14 22 h10 l-6 20 18 -26 h-10 Z" fill={GOLD} />
      <path d="M92 92 h22" stroke={GOLD_SOFT} strokeWidth="3" strokeLinecap="round" strokeDasharray="2 6" />
    </Frame>
  );
}

// 5 — More features: a constellation grid
export function ArtMore() {
  return (
    <Frame>
      {[
        [46, 52],
        [80, 44],
        [114, 56],
        [40, 92],
        [80, 84],
        [120, 96],
        [58, 122],
        [100, 120],
      ].map(([cx, cy], i) => (
        <g key={i}>
          <circle cx={cx} cy={cy} r="13" fill={i % 2 ? TEAL_DEEP : TEAL} />
          <path
            d={`M${cx} ${cy - 6} l1.6 3.4 3.8.5 -2.7 2.6 .7 3.8 -3.4 -1.8 -3.4 1.8 .7 -3.8 -2.7 -2.6 3.8 -.5 Z`}
            fill={i === 4 ? GOLD : GOLD_SOFT}
            opacity={i === 4 ? 1 : 0.7}
          />
        </g>
      ))}
    </Frame>
  );
}
