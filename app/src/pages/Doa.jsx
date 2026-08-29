import { useEffect, useState } from 'react';
import { watchDoas, createDoa, watchMyAmin, toggleAmin } from '../lib/doa';
import { useAuth } from '../context/AuthContext';
import TopBar from '../components/TopBar';
import BottomNav from '../components/BottomNav';

const dateFmt = new Intl.DateTimeFormat('id-ID', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' });
const MAX_LENGTH = 500;

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

function DoaCard({ doa }) {
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

// Collapsed by default — reading & aminkan is the primary reason someone
// opens this page (per the founder's own framing), so a big always-open
// compose box pushing the feed down would work against that. Same
// collapse-to-reveal pattern as DonationCard's manual-transfer section.
function ComposeDoa({ user, onPosted }) {
  const [open, setOpen] = useState(false);
  const [text, setText] = useState('');
  const [anonymous, setAnonymous] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  async function handleSubmit() {
    if (!user) {
      setError('Masuk dulu buat kirim doa.');
      return;
    }
    setSubmitting(true);
    setError('');
    try {
      await createDoa(text, anonymous, user);
      setText('');
      setOpen(false);
      onPosted?.();
    } catch (err) {
      setError(err.message || 'Gagal kirim doa.');
    } finally {
      setSubmitting(false);
    }
  }

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="btn-outline"
        style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}
      >
        <span>✍️</span> Tulis Doa
      </button>
    );
  }

  return (
    <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: 10, padding: 16 }}>
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Tulis doa yang ingin kamu minta diaminkan…"
        maxLength={MAX_LENGTH}
        rows={3}
        autoFocus
        style={{
          resize: 'none',
          padding: '10px 12px',
          borderRadius: 12,
          border: '1px solid var(--border)',
          background: 'var(--bg)',
          color: 'var(--ink)',
          fontSize: 13.5,
          fontFamily: 'inherit',
        }}
      />
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <label style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: 'var(--muted)', cursor: 'pointer' }}>
          <input type="checkbox" checked={anonymous} onChange={(e) => setAnonymous(e.target.checked)} />
          Kirim sebagai anonim
        </label>
        <span style={{ fontSize: 10.5, color: 'var(--muted)' }}>{text.length}/{MAX_LENGTH}</span>
      </div>
      <div style={{ display: 'flex', gap: 8 }}>
        <button className="btn-outline" style={{ flex: 1 }} onClick={() => setOpen(false)}>Batal</button>
        <button
          className="btn"
          style={{ flex: 2, opacity: submitting || !text.trim() ? 0.6 : 1 }}
          disabled={submitting || !text.trim()}
          onClick={handleSubmit}
        >
          {submitting ? 'Mengirim...' : 'Kirim Doa'}
        </button>
      </div>
      {error && <span style={{ fontSize: 11.5, color: '#c0392b', textAlign: 'center' }}>{error}</span>}
    </div>
  );
}

export default function Doa() {
  const { user } = useAuth();
  const [doas, setDoas] = useState(null);

  useEffect(() => watchDoas(setDoas), []);

  return (
    <div className="screen">
      <div className="screen-content">
        <TopBar title="Doa & Aminkan" subtitle="Baca & aminkan doa sahabat lain" />

        <ComposeDoa user={user} />

        {!doas && <div className="center" style={{ minHeight: 150 }}><div className="spinner" /></div>}

        {doas && doas.length === 0 && (
          <div className="card" style={{ padding: 16, fontSize: 12.5, color: 'var(--muted)', textAlign: 'center' }}>
            Belum ada doa. Jadilah yang pertama.
          </div>
        )}

        {doas && doas.length > 0 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {doas.map((doa) => (
              <DoaCard key={doa.id} doa={doa} />
            ))}
          </div>
        )}
      </div>
      <BottomNav />
    </div>
  );
}
