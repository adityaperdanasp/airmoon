import { Link } from 'react-router-dom';

// Custom soft-gradient illustrations replacing the platform emoji this
// component used to render bare (🤲💝🕌⭐🔔) — those render wildly
// differently (and glossy/cartoonish on iOS) across devices, same
// inconsistency already fixed for the Home "Layanan" tiles and the
// Lainnya grid (see serviceIcons.jsx's own header comments). Keyed by the
// same emoji strings every call site already passes as `icon`, so no
// call site needs to change — an emoji with no matching illustration
// below still renders as plain text, not a broken layout.
function DoaIllustration() {
  return (
    <svg width="52" height="52" viewBox="0 0 52 52" fill="none">
      <defs>
        <linearGradient id="esHandsG" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#2fa190" />
          <stop offset="1" stopColor="#0a4a43" />
        </linearGradient>
      </defs>
      <circle cx="26" cy="26" r="24" fill="var(--mint-soft)" />
      <path d="M15 30c0-6 4-11 5-15 1 3 1 6 1 8" stroke="url(#esHandsG)" strokeWidth="2.4" strokeLinecap="round" fill="none" />
      <path d="M37 30c0-6-4-11-5-15-1 3-1 6-1 8" stroke="url(#esHandsG)" strokeWidth="2.4" strokeLinecap="round" fill="none" />
      <path d="M15 30c1 5 5 8 11 8s10-3 11-8" stroke="url(#esHandsG)" strokeWidth="2.4" strokeLinecap="round" fill="none" />
      <circle cx="26" cy="15" r="1.6" fill="#e8b84b" />
      <circle cx="19" cy="19" r="1.2" fill="#e8b84b" opacity="0.7" />
      <circle cx="33" cy="19" r="1.2" fill="#e8b84b" opacity="0.7" />
    </svg>
  );
}

function SedekahIllustration() {
  return (
    <svg width="52" height="52" viewBox="0 0 52 52" fill="none">
      <defs>
        <linearGradient id="esHeartG" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#f0c04d" />
          <stop offset="1" stopColor="#c98f22" />
        </linearGradient>
      </defs>
      <circle cx="26" cy="26" r="24" fill="var(--cream)" />
      <rect x="14" y="24" width="24" height="14" rx="3" fill="none" stroke="url(#esHeartG)" strokeWidth="2" />
      <path d="M26 22c-2.5-4-9-3-9 1.5 0 4 6 7 9 9 3-2 9-5 9-9 0-4.5-6.5-5.5-9-1.5Z" fill="url(#esHeartG)" />
    </svg>
  );
}

function MosqueIllustration() {
  return (
    <svg width="52" height="52" viewBox="0 0 52 52" fill="none">
      <defs>
        <linearGradient id="esMosqueG" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#2fa190" />
          <stop offset="1" stopColor="#0a4a43" />
        </linearGradient>
      </defs>
      <circle cx="26" cy="26" r="24" fill="var(--mint-soft)" />
      <path d="M20 34V26c0-3.3 2.7-6 6-6s6 2.7 6 6v8" stroke="url(#esMosqueG)" strokeWidth="2" fill="none" />
      <rect x="15" y="34" width="22" height="4" rx="1" fill="url(#esMosqueG)" />
      <rect x="17" y="27" width="3" height="7" fill="url(#esMosqueG)" />
      <rect x="32" y="27" width="3" height="7" fill="url(#esMosqueG)" />
      <path d="M26 14v6" stroke="#e8b84b" strokeWidth="1.6" strokeLinecap="round" />
      <circle cx="26" cy="12" r="1.6" fill="#e8b84b" />
    </svg>
  );
}

function StarIllustration() {
  return (
    <svg width="52" height="52" viewBox="0 0 52 52" fill="none">
      <defs>
        <linearGradient id="esStarG" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#fff2cf" />
          <stop offset="0.55" stopColor="#f0c04d" />
          <stop offset="1" stopColor="#c98f22" />
        </linearGradient>
      </defs>
      <circle cx="26" cy="26" r="24" fill="var(--cream)" />
      <path d="M26 14l3.5 8 8.5.7-6.5 5.8 2 8.5L26 32.7l-7.5 4.3 2-8.5-6.5-5.8 8.5-.7Z" fill="url(#esStarG)" />
    </svg>
  );
}

function NotificationIllustration() {
  return (
    <svg width="52" height="52" viewBox="0 0 52 52" fill="none">
      <defs>
        <linearGradient id="esBellG" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#2fa190" />
          <stop offset="1" stopColor="#0a4a43" />
        </linearGradient>
      </defs>
      <circle cx="26" cy="26" r="24" fill="var(--mint-soft)" />
      <path d="M26 15c-4 0-7 3.2-7 7.2v4.3c0 1.4-.6 2.7-1.6 3.7l-.9.9h19l-.9-.9c-1-1-1.6-2.3-1.6-3.7v-4.3c0-4-3-7.2-7-7.2Z" fill="none" stroke="url(#esBellG)" strokeWidth="2" strokeLinejoin="round" />
      <path d="M23 34a3 3 0 0 0 6 0" stroke="url(#esBellG)" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

const ILLUSTRATIONS = {
  '🤲': DoaIllustration,
  '💝': SedekahIllustration,
  '🕌': MosqueIllustration,
  '⭐': StarIllustration,
  '🔔': NotificationIllustration,
};

// A friendlier "nothing here yet" block — used to replace bare one-line
// text (e.g. "Belum ada doa. Jadilah yang pertama.") with something that
// also tells a first-time user what to actually do next, since a brand
// new account sees several of these at once (no doa posted, no favorites,
// no donation history) and a wall of flat "empty" text reads as a dead
// end rather than an invitation.
export default function EmptyState({ icon, title, subtitle, actionLabel, actionTo, onAction }) {
  const Illustration = icon && ILLUSTRATIONS[icon];
  return (
    <div
      className="card"
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 6,
        padding: '26px 20px',
        textAlign: 'center',
      }}
    >
      {Illustration ? (
        <div style={{ marginBottom: 4 }}>
          <Illustration />
        </div>
      ) : (
        icon && <span style={{ fontSize: 28, lineHeight: 1, marginBottom: 4 }}>{icon}</span>
      )}
      <span style={{ fontSize: 13, fontWeight: 700 }}>{title}</span>
      {subtitle && <span style={{ fontSize: 11.5, color: 'var(--muted)', lineHeight: 1.5, maxWidth: 280 }}>{subtitle}</span>}
      {actionLabel && actionTo && (
        <Link
          to={actionTo}
          className="btn"
          style={{ marginTop: 10, width: 'auto', padding: '9px 20px', textDecoration: 'none', display: 'inline-block' }}
        >
          {actionLabel}
        </Link>
      )}
      {actionLabel && onAction && !actionTo && (
        <button className="btn" style={{ marginTop: 10, width: 'auto', padding: '9px 20px' }} onClick={onAction}>
          {actionLabel}
        </button>
      )}
    </div>
  );
}
