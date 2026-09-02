import { Link } from 'react-router-dom';

// A friendlier "nothing here yet" block — used to replace bare one-line
// text (e.g. "Belum ada doa. Jadilah yang pertama.") with something that
// also tells a first-time user what to actually do next, since a brand
// new account sees several of these at once (no doa posted, no favorites,
// no donation history) and a wall of flat "empty" text reads as a dead
// end rather than an invitation.
export default function EmptyState({ icon, title, subtitle, actionLabel, actionTo, onAction }) {
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
      {icon && <span style={{ fontSize: 28, lineHeight: 1, marginBottom: 4 }}>{icon}</span>}
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
