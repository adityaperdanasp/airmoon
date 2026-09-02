import { useEffect, useState } from 'react';
import { watchMyAmin, toggleAmin } from '../lib/doa';
import { useAuth } from '../context/AuthContext';

const dateFmt = new Intl.DateTimeFormat('id-ID', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' });

function AminButton({ doaId, aminCount, compact }) {
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
        padding: compact ? '6px 12px' : '7px 14px',
        borderRadius: 999,
        border: amined ? 'none' : '1px solid var(--border)',
        background: amined ? 'var(--primary)' : 'transparent',
        color: amined ? 'var(--on-primary)' : 'var(--muted)',
        fontSize: compact ? 11 : 12,
        fontWeight: 700,
        cursor: 'pointer',
        opacity: busy ? 0.6 : 1,
        alignSelf: compact ? 'flex-start' : undefined,
      }}
    >
      <span>🤲</span>
      <span>Aminkan{aminCount > 0 ? ` · ${aminCount}` : ''}</span>
    </button>
  );
}

// Used both on the dedicated /doa feed (full-size, vertical list) and as a
// compact horizontal-scroll preview on Home (`compact` — fixed width,
// clamped to 3 lines so a long doa can't balloon the card and eat the
// whole row) — reading & aminkan shouldn't need an extra click to reach,
// so Home renders real DoaCards inline rather than just a link to the page.
export default function DoaCard({ doa, compact }) {
  return (
    <div
      className="card"
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: 10,
        padding: compact ? 14 : 16,
        // Compact (Home's carousel) gets a warm cream tint instead of the
        // neutral card background — a deliberate bit of color variety per
        // section (mint for Total Sedekah, cream for doa, ...) rather than
        // every card on the page looking identical. The full /doa feed
        // stays neutral since it's the page's only content, not one
        // section among several.
        ...(compact ? { width: 220, flexShrink: 0, scrollSnapAlign: 'start', background: 'var(--cream)', border: 'none' } : {}),
      }}
    >
      <p
        style={{
          margin: 0,
          fontSize: compact ? 13 : 14,
          lineHeight: 1.5,
          color: 'var(--ink)',
          ...(compact ? { display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' } : {}),
        }}
      >
        {doa.text}
      </p>
      <span style={{ fontSize: 10.5, color: 'var(--muted)' }}>
        {doa.anonymous ? 'Hamba Allah' : doa.authorName || 'Sahabat airmoon'}
        {doa.createdAt && !compact && ` · ${dateFmt.format(doa.createdAt.toDate())}`}
      </span>
      <AminButton doaId={doa.id} aminCount={doa.aminCount || 0} compact={compact} />
    </div>
  );
}
