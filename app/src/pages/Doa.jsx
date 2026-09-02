import { useEffect, useState } from 'react';
import { watchDoas, createDoa } from '../lib/doa';
import { useAuth } from '../context/AuthContext';
import TopBar from '../components/TopBar';
import BottomNav from '../components/BottomNav';
import DoaCard from '../components/DoaCard';
import { SkeletonCard } from '../components/Skeleton';
import EmptyState from '../components/EmptyState';
import { markSeen } from '../lib/unseenBadges';
import PullToRefresh from '../components/PullToRefresh';

const MAX_LENGTH = 500;

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

  useEffect(() => {
    return () => markSeen('doa');
  }, []);

  // watchDoas() above is already a live onSnapshot listener — there's no
  // stale data to actually re-fetch here. A short resolved delay still
  // gives the pull gesture its expected "did something" completion beat
  // instead of the indicator snapping back instantly, which would read as
  // broken rather than "already up to date".
  function handlePullRefresh() {
    return new Promise((resolve) => setTimeout(resolve, 400));
  }

  return (
    <div className="screen">
      <div className="screen-content">
      <PullToRefresh onRefresh={handlePullRefresh}>
        <TopBar title="Doa & Aminkan" subtitle="Baca & aminkan doa sahabat lain" />

        <ComposeDoa user={user} />

        {!doas && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            <SkeletonCard height={110} />
            <SkeletonCard height={110} />
            <SkeletonCard height={110} />
          </div>
        )}

        {doas && doas.length === 0 && (
          <EmptyState icon="🤲" title="Belum ada doa" subtitle='Tulis doamu lewat tombol "Tulis Doa" di atas — jadilah yang pertama.' />
        )}

        {doas && doas.length > 0 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {doas.map((doa) => (
              <DoaCard key={doa.id} doa={doa} />
            ))}
          </div>
        )}
      </PullToRefresh>
      </div>
      <BottomNav />
    </div>
  );
}
