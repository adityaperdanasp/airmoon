// A standard error state — message plus a "Coba Lagi" button — replacing
// the various pages that used to just show `<p className="state-msg">
// {error}</p>` with no way to recover short of a full page refresh.
export default function ErrorRetry({ message, onRetry }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10, padding: '24px 0' }}>
      <p className="state-msg" style={{ padding: 0 }}>{message}</p>
      {onRetry && (
        <button className="btn-outline" style={{ width: 'auto', padding: '9px 20px' }} onClick={onRetry}>
          Coba Lagi
        </button>
      )}
    </div>
  );
}
