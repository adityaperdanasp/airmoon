import { useEffect, useState } from 'react';
import { watchMyAmin, toggleAmin } from '../lib/doa';
import { useAuth } from '../context/AuthContext';

const dateFmt = new Intl.DateTimeFormat('id-ID', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' });

function AminButton({ doaId, aminCount }) {
  const { user } = useAuth();
  const [amined, setAmined] = useState(false);
  const [busy, setBusy] = useState(false);

  useEffect(() => watchMyAmin(doaId, user?.uid, setAmined), [doaId, user?.uid]);

  async function handleTap() {
    if (!user || busy) return;
    setBusy(true);
    try {
      await toggleAmin(doaId, user.uid);
    } catch {
      // A denied/failed toggle just leaves the button in its last known
      // state — watchMyAmin's live listener is the source of truth, not
      // local optimistic state, so nothing to roll back here.
    } finally {
      setBusy(false);
    }
  }

  return (
    <button
      onClick={handleTap}
      disabled={busy}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 6,
        padding: '7px 14px',
        borderRadius: 999,
        border: amined ? 'none' : '1px solid var(--border)',
        background: amined ? 'var(--primary)' : 'transparent',
        color: amined ? '#fff' : 'var(--muted)',
        fontSize: 12,
        fontWeight: 700,
        cursor: 'pointer',
        opacity: busy ? 0.6 : 1,
      }}
    >
      <span>🤲</span>
      <span>Aminkan{aminCount > 0 ? ` · ${aminCount}` : ''}</span>
    </button>
  );
}

// Used both on the dedicated /doa feed and as a live preview directly on
// Home — reading & aminkan shouldn't need an extra click to reach, so
// Home renders real DoaCards inline rather than just a link to the page.
export default function DoaCard({ doa }) {
  return (
    <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: 10, padding: 16 }}>
      <p style={{ margin: 0, fontSize: 14, lineHeight: 1.6, color: 'var(--ink)' }}>{doa.text}</p>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <span style={{ fontSize: 11, color: 'var(--muted)' }}>
          {doa.anonymous ? 'Hamba Allah' : doa.authorName || 'Sahabat airmoon'}
          {doa.createdAt && ` · ${dateFmt.format(doa.createdAt.toDate())}`}
        </span>
        <AminButton doaId={doa.id} aminCount={doa.aminCount || 0} />
      </div>
    </div>
  );
}
