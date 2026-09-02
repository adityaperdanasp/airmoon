// Hand-drawn vector icons (not cropped rasters) for the "glossy tile" service
// icons used on Home's Layanan row and the Lainnya grid — shared here since
// both pages need the same mark at different sizes.

export function DonationBoxIcon({ size = 42 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 42 42" fill="none">
      <defs>
        <linearGradient id="svcBoxG" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#1c8577" />
          <stop offset="1" stopColor="#0a4a43" />
        </linearGradient>
        <linearGradient id="svcLidG" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#2fa190" />
          <stop offset="1" stopColor="#186d61" />
        </linearGradient>
        <radialGradient id="svcCoinG" cx="0.35" cy="0.3" r="0.85">
          <stop offset="0" stopColor="#fff2cf" />
          <stop offset="0.55" stopColor="#f0c04d" />
          <stop offset="1" stopColor="#c98f22" />
        </radialGradient>
      </defs>
      <ellipse cx="21" cy="34.5" rx="11" ry="2" fill="#04302b" opacity="0.18" />
      <rect x="10" y="19" width="22" height="14" rx="3.2" fill="url(#svcBoxG)" />
      <rect x="8.5" y="15.5" width="25" height="6.2" rx="2.6" fill="url(#svcLidG)" />
      <rect x="18.3" y="17.3" width="5.4" height="2.2" rx="1.1" fill="#04302b" />
      <path d="M16.6 31 v-3.6 a4.4 4.4 0 0 1 8.8 0 V31" stroke="#e8c877" strokeWidth="1.4" fill="none" strokeLinecap="round" />
      <circle cx="21" cy="9" r="5.1" fill="url(#svcCoinG)" />
      <path d="M18.6 9 h4.8 M21 6.6 v4.8" stroke="#a9701a" strokeWidth="1" strokeLinecap="round" />
      <path d="M31 8.5 32.3 8 31.8 6.4 33.1 7.4 34.2 6 34 7.7 35.6 8.3 33.8 8.7 34.2 10.3 32.9 9.2Z" fill="#f6d879" />
    </svg>
  );
}

// A compass with the Kaaba sitting at its center, in place of a needle —
// the destination it always points to, rather than a generic N marker.
export function QiblaCompassIcon({ size = 42 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 42 42" fill="none">
      <defs>
        <linearGradient id="qRingG" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#2fa190" />
          <stop offset="1" stopColor="#0a4a43" />
        </linearGradient>
        <linearGradient id="qFaceG" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#ffffff" />
          <stop offset="1" stopColor="#f2ede2" />
        </linearGradient>
        <linearGradient id="qKaabaG" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#2b2b2e" />
          <stop offset="1" stopColor="#0c0c0d" />
        </linearGradient>
        <linearGradient id="qGoldG" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#fff2cf" />
          <stop offset="0.55" stopColor="#f0c04d" />
          <stop offset="1" stopColor="#c98f22" />
        </linearGradient>
      </defs>
      <circle cx="21" cy="21" r="18" fill="url(#qFaceG)" stroke="url(#qRingG)" strokeWidth="2.6" />
      <line x1="21" y1="4.5" x2="21" y2="8" stroke="url(#qGoldG)" strokeWidth="2.2" strokeLinecap="round" />
      <line x1="21" y1="34" x2="21" y2="37.5" stroke="#b9c4c0" strokeWidth="1.6" strokeLinecap="round" />
      <line x1="4.5" y1="21" x2="8" y2="21" stroke="#b9c4c0" strokeWidth="1.6" strokeLinecap="round" />
      <line x1="34" y1="21" x2="37.5" y2="21" stroke="#b9c4c0" strokeWidth="1.6" strokeLinecap="round" />
      <rect x="15.5" y="15" width="11" height="11" rx="1.2" fill="url(#qKaabaG)" />
      <rect x="15.5" y="19" width="11" height="2.4" fill="url(#qGoldG)" />
      <rect x="19.3" y="22.4" width="3.4" height="3.6" rx="0.5" fill="url(#qGoldG)" />
    </svg>
  );
}

// A literal pocket calculator, not the abacus emoji (🧮) — Unicode has no
// widely-supported "calculator" emoji (the closest, 🖩, isn't reliably
// rendered across devices), so this is drawn rather than gambled on a glyph.
export function CalculatorIcon({ size = 42 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 42 42" fill="none">
      <defs>
        <linearGradient id="calcBodyG" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#2fa190" />
          <stop offset="1" stopColor="#0a4a43" />
        </linearGradient>
        <linearGradient id="calcScreenG" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#eaf6f0" />
          <stop offset="1" stopColor="#cfe9db" />
        </linearGradient>
        <linearGradient id="calcGoldG" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#fff2cf" />
          <stop offset="0.55" stopColor="#f0c04d" />
          <stop offset="1" stopColor="#c98f22" />
        </linearGradient>
      </defs>
      <rect x="8" y="4" width="26" height="34" rx="5" fill="url(#calcBodyG)" />
      <rect x="11.5" y="7.5" width="19" height="8" rx="1.6" fill="url(#calcScreenG)" />
      <g fill="#e9f4ef">
        <rect x="11.5" y="19" width="4.6" height="4" rx="1" />
        <rect x="17.2" y="19" width="4.6" height="4" rx="1" />
        <rect x="22.9" y="19" width="4.6" height="4" rx="1" />
        <rect x="11.5" y="24.5" width="4.6" height="4" rx="1" />
        <rect x="17.2" y="24.5" width="4.6" height="4" rx="1" />
        <rect x="22.9" y="24.5" width="4.6" height="4" rx="1" />
        <rect x="11.5" y="30" width="4.6" height="4" rx="1" />
        <rect x="17.2" y="30" width="4.6" height="4" rx="1" />
      </g>
      <rect x="22.9" y="30" width="4.6" height="4" rx="1" fill="url(#calcGoldG)" />
    </svg>
  );
}

// An open Qur'an — replaces the 📖 emoji on Home's Layanan row, same
// reasoning as the Lainnya icons: consistent hand-drawn style instead of
// a platform-rendered glyph.
export function QuranBookIcon({ size = 42 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 42 42" fill="none">
      <defs>
        <linearGradient id="quranPageG" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#fdf8ec" />
          <stop offset="1" stopColor="#f0e3bf" />
        </linearGradient>
        <linearGradient id="quranGoldG" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#fff2cf" />
          <stop offset="0.55" stopColor="#f0c04d" />
          <stop offset="1" stopColor="#c98f22" />
        </linearGradient>
      </defs>
      <path d="M21 10c-3-2-8-3-13-2v22c5-1 10 0 13 2Z" fill="url(#quranPageG)" stroke="url(#quranGoldG)" strokeWidth="1.2" />
      <path d="M21 10c3-2 8-3 13-2v22c-5-1-10 0-13 2Z" fill="url(#quranPageG)" stroke="url(#quranGoldG)" strokeWidth="1.2" />
      <path d="M21 10v22" stroke="url(#quranGoldG)" strokeWidth="1.4" />
      <g stroke="#a9761f" strokeWidth="1" strokeLinecap="round">
        <line x1="11" y1="14" x2="17" y2="13.4" />
        <line x1="11" y1="18" x2="17" y2="17.4" />
        <line x1="11" y1="22" x2="17" y2="21.4" />
        <line x1="25" y1="13.4" x2="31" y2="14" />
        <line x1="25" y1="17.4" x2="31" y2="18" />
        <line x1="25" y1="21.4" x2="31" y2="22" />
      </g>
    </svg>
  );
}

// A mosque silhouette (dome + two minarets) — replaces the 🕌 emoji for
// Cari Masjid, same style as QuranBookIcon above and the QiblaCompassIcon
// already used for Arah Kiblat on this same row.
export function MosqueIcon({ size = 42 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 42 42" fill="none">
      <defs>
        <linearGradient id="mosqueBodyG" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#2fa190" />
          <stop offset="1" stopColor="#0a4a43" />
        </linearGradient>
        <linearGradient id="mosqueGoldG" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#fff2cf" />
          <stop offset="0.55" stopColor="#f0c04d" />
          <stop offset="1" stopColor="#c98f22" />
        </linearGradient>
      </defs>
      <rect x="4" y="18" width="4" height="18" rx="1" fill="url(#mosqueBodyG)" />
      <path d="M4 18c0-3 1-5 2-5s2 2 2 5Z" fill="url(#mosqueBodyG)" />
      <rect x="34" y="18" width="4" height="18" rx="1" fill="url(#mosqueBodyG)" />
      <path d="M34 18c0-3 1-5 2-5s2 2 2 5Z" fill="url(#mosqueBodyG)" />
      <rect x="7" y="26" width="28" height="10" rx="1.5" fill="url(#mosqueBodyG)" />
      <path d="M14 26c0-5 3-9 7-9s7 4 7 9Z" fill="url(#mosqueBodyG)" />
      <circle cx="21" cy="14" r="1.6" fill="url(#mosqueGoldG)" />
      <path d="M21 8v6" stroke="url(#mosqueGoldG)" strokeWidth="1.6" strokeLinecap="round" />
      <rect x="18" y="29" width="6" height="7" rx="0.8" fill="url(#mosqueGoldG)" />
    </svg>
  );
}

// A ring of tasbih beads with a tassel — replaces the 📿 emoji, matching
// the same hand-drawn gradient style as the icons above rather than
// mixing in a platform-rendered glyph (whose look varies wildly between
// iOS/Android and doesn't carry the brand's teal/gold palette at all).
export function TasbihIcon({ size = 42 }) {
  const beadPositions = Array.from({ length: 11 }, (_, i) => {
    const a = (i / 11) * Math.PI * 2 - Math.PI / 2;
    return [21 + 13 * Math.cos(a), 17.5 + 13 * Math.sin(a)];
  });
  return (
    <svg width={size} height={size} viewBox="0 0 42 42" fill="none">
      <defs>
        <radialGradient id="tasbihBeadG" cx="0.35" cy="0.3" r="0.85">
          <stop offset="0" stopColor="#fff2cf" />
          <stop offset="0.55" stopColor="#f0c04d" />
          <stop offset="1" stopColor="#c98f22" />
        </radialGradient>
      </defs>
      {beadPositions.map(([cx, cy], i) => (
        <circle key={i} cx={cx} cy={cy} r="3.1" fill="url(#tasbihBeadG)" />
      ))}
      <path d="M21 31v6" stroke="#c98f22" strokeWidth="1.6" strokeLinecap="round" />
      <path d="M17.5 38q3.5-3.5 7 0" stroke="#c98f22" strokeWidth="1.4" fill="none" strokeLinecap="round" />
    </svg>
  );
}

// A calendar with a crescent-moon corner accent — the Hijri (lunar
// calendar) angle, not just a generic Gregorian grid.
export function HijriCalendarIcon({ size = 42 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 42 42" fill="none">
      <defs>
        <linearGradient id="calBodyG" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#2fa190" />
          <stop offset="1" stopColor="#0a4a43" />
        </linearGradient>
        <linearGradient id="calGoldG" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#fff2cf" />
          <stop offset="0.55" stopColor="#f0c04d" />
          <stop offset="1" stopColor="#c98f22" />
        </linearGradient>
      </defs>
      <rect x="12" y="4" width="3" height="8" rx="1.5" fill="#0a4a43" />
      <rect x="27" y="4" width="3" height="8" rx="1.5" fill="#0a4a43" />
      <rect x="7" y="9" width="28" height="26" rx="4" fill="url(#calBodyG)" />
      <rect x="7" y="9" width="28" height="8" rx="4" fill="url(#calGoldG)" />
      <rect x="7" y="13" width="28" height="4" fill="url(#calGoldG)" />
      <g fill="#eaf6f0">
        <rect x="11" y="21" width="5" height="4.5" rx="1" />
        <rect x="18.5" y="21" width="5" height="4.5" rx="1" />
        <rect x="26" y="21" width="5" height="4.5" rx="1" />
        <rect x="11" y="27.5" width="5" height="4.5" rx="1" />
        <rect x="18.5" y="27.5" width="5" height="4.5" rx="1" />
      </g>
      <path d="M29.5 32.3a3.3 3.3 0 1 1 0-6.6 2.6 2.6 0 1 0 0 6.6Z" fill="url(#calGoldG)" />
    </svg>
  );
}

// An envelope with a heart, for greeting cards — deliberately not a
// generic "mail" icon, since these are warm/personal cards, not letters.
export function GreetingCardIcon({ size = 42 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 42 42" fill="none">
      <defs>
        <linearGradient id="envBodyG" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#2fa190" />
          <stop offset="1" stopColor="#0a4a43" />
        </linearGradient>
        <radialGradient id="envHeartG" cx="0.35" cy="0.3" r="0.9">
          <stop offset="0" stopColor="#fff2cf" />
          <stop offset="0.55" stopColor="#f0c04d" />
          <stop offset="1" stopColor="#c98f22" />
        </radialGradient>
      </defs>
      <rect x="5" y="10" width="32" height="24" rx="4" fill="url(#envBodyG)" />
      <path d="M5 12 21 25 37 12" stroke="#eaf6f0" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M21 17c-2-3-7-2-7 1.5 0 3.5 7 7 7 7s7-3.5 7-7c0-3.5-5-4.5-7-1.5Z" fill="url(#envHeartG)" />
    </svg>
  );
}

// Cupped hands (a bowl shape + fingertip dots along the rim) for daily
// doa — an abstraction deliberately simplified from real hand anatomy
// (an early attempt at literal fingers read as an unrecognizable dark
// blob at this size); this reads clearly as "hands raised/cupped" at
// tile size instead.
export function CuppedHandsIcon({ size = 42 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 42 42" fill="none">
      <defs>
        <linearGradient id="handsG" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#2fa190" />
          <stop offset="1" stopColor="#0a4a43" />
        </linearGradient>
      </defs>
      <path
        d="M6 23c0-2.2 2-3.4 4.2-2.4C12.3 12.3 17.6 7 21 7s8.7 5.3 10.8 13.6c2.2-1 4.2.2 4.2 2.4 0 6.6-8.5 13-15 13S6 29.6 6 23Z"
        fill="url(#handsG)"
      />
      <g fill="#eaf6f0">
        <circle cx="10.5" cy="19" r="1.5" />
        <circle cx="15" cy="14" r="1.5" />
        <circle cx="21" cy="12" r="1.5" />
        <circle cx="27" cy="14" r="1.5" />
        <circle cx="31.5" cy="19" r="1.5" />
      </g>
    </svg>
  );
}

// A scroll with a few text lines, for daily quotes — evokes an actual
// written passage rather than a generic document icon.
export function ScrollIcon({ size = 42 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 42 42" fill="none">
      <defs>
        <linearGradient id="scrollPaperG" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#fdf8ec" />
          <stop offset="1" stopColor="#f0e3bf" />
        </linearGradient>
        <linearGradient id="scrollGoldG" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#fff2cf" />
          <stop offset="0.55" stopColor="#f0c04d" />
          <stop offset="1" stopColor="#c98f22" />
        </linearGradient>
      </defs>
      <rect x="9" y="9" width="24" height="24" rx="2" fill="url(#scrollPaperG)" />
      <rect x="6" y="8" width="4" height="26" rx="2" fill="url(#scrollGoldG)" />
      <rect x="32" y="8" width="4" height="26" rx="2" fill="url(#scrollGoldG)" />
      <g stroke="#a9761f" strokeWidth="1.4" strokeLinecap="round">
        <line x1="13" y1="16" x2="29" y2="16" />
        <line x1="13" y1="21" x2="29" y2="21" />
        <line x1="13" y1="26" x2="23" y2="26" />
      </g>
    </svg>
  );
}

// A Kaaba silhouette with a red "live" play badge — for the Makkah live
// stream, not a generic camera/video icon.
export function LiveKaabaIcon({ size = 42 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 42 42" fill="none">
      <defs>
        <linearGradient id="liveKaabaG" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#2b2b2e" />
          <stop offset="1" stopColor="#0c0c0d" />
        </linearGradient>
        <linearGradient id="liveGoldG" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#fff2cf" />
          <stop offset="0.55" stopColor="#f0c04d" />
          <stop offset="1" stopColor="#c98f22" />
        </linearGradient>
      </defs>
      <rect x="8" y="12" width="24" height="22" rx="2" fill="url(#liveKaabaG)" />
      <rect x="8" y="18" width="24" height="4" fill="url(#liveGoldG)" />
      <rect x="17.5" y="22" width="5" height="7" rx="0.8" fill="url(#liveGoldG)" />
      <circle cx="31" cy="10" r="6.4" fill="#e6423f" stroke="#0c0c0d" strokeWidth="1.6" />
      <path d="M29.1 7v6l5-3Z" fill="#fff" />
    </svg>
  );
}

// A traditional fanoos (Ramadan lantern) — not the 🌙 emoji alone, since
// the lantern is the more specific/recognizable Ramadan visual motif.
export function LanternIcon({ size = 42 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 42 42" fill="none">
      <defs>
        <linearGradient id="lantGoldG" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#fff2cf" />
          <stop offset="0.55" stopColor="#f0c04d" />
          <stop offset="1" stopColor="#c98f22" />
        </linearGradient>
        <linearGradient id="lantBodyG" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#f6d879" />
          <stop offset="1" stopColor="#b8862e" />
        </linearGradient>
      </defs>
      <path d="M21 3v4" stroke="url(#lantGoldG)" strokeWidth="2" strokeLinecap="round" />
      <path d="M15 7h12l2.5 5h-17Z" fill="url(#lantGoldG)" />
      <rect x="12" y="12" width="18" height="17" rx="2" fill="url(#lantBodyG)" stroke="url(#lantGoldG)" strokeWidth="1.4" />
      <g stroke="#8a5f1c" strokeWidth="1">
        <line x1="16.5" y1="12" x2="16.5" y2="29" />
        <line x1="21" y1="12" x2="21" y2="29" />
        <line x1="25.5" y1="12" x2="25.5" y2="29" />
      </g>
      <path d="M17 33l4 6 4-6Z" fill="url(#lantGoldG)" />
    </svg>
  );
}

// A travel bag with a gold Kaaba-door accent, for Umroh Needs — replaces
// a stray `/icons-3d/umroh-needs.png` raster that didn't match this
// icon set's style at all.
export function UmrohIcon({ size = 42 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 42 42" fill="none">
      <defs>
        <linearGradient id="umrohBagG" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#2fa190" />
          <stop offset="1" stopColor="#0a4a43" />
        </linearGradient>
        <linearGradient id="umrohGoldG" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#fff2cf" />
          <stop offset="0.55" stopColor="#f0c04d" />
          <stop offset="1" stopColor="#c98f22" />
        </linearGradient>
      </defs>
      <path d="M15 12a6 6 0 0 1 12 0v3h-12Z" fill="none" stroke="url(#umrohGoldG)" strokeWidth="2.4" />
      <rect x="8" y="15" width="26" height="21" rx="4" fill="url(#umrohBagG)" />
      <rect x="17" y="22" width="8" height="8" rx="1" fill="url(#umrohGoldG)" />
    </svg>
  );
}
