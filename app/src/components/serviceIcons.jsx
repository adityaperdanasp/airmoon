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
