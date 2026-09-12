import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import TopBar from '../components/TopBar';
import EmptyState from '../components/EmptyState';
import { SkeletonCard } from '../components/Skeleton';
import { watchFeatureRequests, submitFeatureRequest, watchMyUpvote, toggleUpvote } from '../lib/featureRequests';
import SegButton from '../components/SegButton';

// Roadmap (2026-09-12) — the same public collection, just grouped by
// status instead of sorted flat by upvotes. 'baru' (freshly submitted,
// not yet triaged) is deliberately left out of the roadmap view — it's
// the "Usulan" tab's own raw pile, not a commitment yet.
const ROADMAP_STATUSES = ['dipertimbangkan', 'dikerjakan', 'selesai'];

const STATUS_LABEL = { baru: 'Baru', dipertimbangkan: 'Dipertimbangkan', dikerjakan: 'Sedang Dikerjakan', selesai: 'Selesai' };
const STATUS_COLOR = { baru: 'var(--muted)', dipertimbangkan: 'var(--gold-ink-dark)', dikerjakan: 'var(--primary)', selesai: 'var(--success)' };

function UpvoteButton({ requestId, upvoteCount }) {
  const { user } = useAuth();
  const [upvoted, setUpvoted] = useState(false);
  const [busy, setBusy] = useState(false);

  useEffect(() => watchMyUpvote(requestId, user?.uid, setUpvoted), [requestId, user?.uid]);

  async function handleTap() {
    if (!user || busy) return;
    setBusy(true);
    try {
      await toggleUpvote(requestId, user.uid);
    } finally {
      setBusy(false);
    }
  }

  return (
    <button
      onClick={handleTap}
      disabled={busy}
      aria-pressed={upvoted}
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 2,
        padding: '8px 12px',
        borderRadius: 12,
        border: upvoted ? 'none' : '1px solid var(--border)',
        background: upvoted ? 'var(--primary)' : 'transparent',
        color: upvoted ? 'var(--on-primary)' : 'var(--muted)',
        cursor: 'pointer',
        opacity: busy ? 0.6 : 1,
        flexShrink: 0,
      }}
    >
      <span style={{ fontSize: 14 }}>▲</span>
      <span style={{ fontSize: 11, fontWeight: 800 }}>{upvoteCount || 0}</span>
    </button>
  );
}

// Usulan Fitur (2026-09-12) — 150+ features have shipped across this
// app's history on founder intuition alone; this is the first real
// channel for users to say what they actually want next, with an upvote
// signal instead of a guess. See lib/featureRequests.js/firestore.rules
// for why this is public-read/narrow-create like Doa & Aminkan's own
// wall — no money/fraud stakes here either.
export default function UsulanFitur() {
  const { user } = useAuth();
  const { showToast } = useToast();
  const [requests, setRequests] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [tab, setTab] = useState('usulan');

  useEffect(() => watchFeatureRequests(setRequests), []);

  async function handleSubmit(e) {
    e.preventDefault();
    if (!user || submitting) return;
    setSubmitting(true);
    try {
      await submitFeatureRequest(title, description, user);
      setTitle('');
      setDescription('');
      setShowForm(false);
      showToast('Usulan kamu terkirim, makasih!');
    } catch (err) {
      showToast(err.message || 'Gagal kirim usulan.', { type: 'danger' });
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="screen">
      <div className="screen-content">
        <TopBar title="Usulkan Fitur" subtitle={requests ? `${requests.length} usulan` : undefined} />

        <div style={{ display: 'flex', gap: 8 }}>
          <SegButton active={tab === 'usulan'} onClick={() => setTab('usulan')}>Usulan</SegButton>
          <SegButton active={tab === 'roadmap'} onClick={() => setTab('roadmap')}>Roadmap</SegButton>
        </div>

        {requests === null && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {Array.from({ length: 4 }).map((_, i) => <SkeletonCard key={i} height={78} radius={16} />)}
          </div>
        )}

        {tab === 'usulan' && requests && (
          <>
            {user ? (
              !showForm ? (
                <button className="btn" onClick={() => setShowForm(true)}>+ Usulkan Fitur Baru</button>
              ) : (
                <form onSubmit={handleSubmit} className="card" style={{ padding: 16, display: 'flex', flexDirection: 'column', gap: 10 }}>
                  <div className="input-row">
                    <input required placeholder="Judul singkat usulan kamu" value={title} onChange={(e) => setTitle(e.target.value)} maxLength={120} />
                  </div>
                  <textarea
                    placeholder="Penjelasan (opsional) — kenapa fitur ini berguna buat kamu?"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    maxLength={1000}
                    rows={3}
                    style={{ padding: '10px 12px', borderRadius: 12, border: '1px solid var(--border)', background: 'var(--bg)', color: 'var(--ink)', fontSize: 13, fontFamily: 'inherit', resize: 'vertical' }}
                  />
                  <div style={{ display: 'flex', gap: 8 }}>
                    <button type="button" className="btn-outline" style={{ flex: 1 }} onClick={() => setShowForm(false)}>Batal</button>
                    <button type="submit" className="btn" style={{ flex: 1 }} disabled={submitting || !title.trim()}>
                      {submitting ? 'Mengirim...' : 'Kirim'}
                    </button>
                  </div>
                </form>
              )
            ) : (
              <p className="state-msg">Masuk dulu buat usulkan fitur atau upvote.</p>
            )}

            {requests.length === 0 && (
              <EmptyState icon="💡" title="Belum ada usulan" subtitle="Jadi yang pertama kasih tau fitur apa yang kamu mau lihat di airmoon." />
            )}

            {requests.length > 0 && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {requests.map((r) => (
                  <div key={r.id} className="card" style={{ display: 'flex', gap: 12, padding: 14 }}>
                    <UpvoteButton requestId={r.id} upvoteCount={r.upvoteCount} />
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 4, flex: 1, minWidth: 0 }}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8 }}>
                        <span style={{ fontSize: 13, fontWeight: 700 }}>{r.title}</span>
                        <span style={{ flexShrink: 0, fontSize: 9.5, fontWeight: 700, padding: '3px 8px', borderRadius: 999, color: '#fff', background: STATUS_COLOR[r.status] || 'var(--muted)' }}>
                          {STATUS_LABEL[r.status] || r.status}
                        </span>
                      </div>
                      {r.description && <p style={{ margin: 0, fontSize: 11.5, color: 'var(--muted)', lineHeight: 1.5 }}>{r.description}</p>}
                      <span style={{ fontSize: 10, color: 'var(--muted-soft)' }}>{r.authorName}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}

        {tab === 'roadmap' && requests && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
            {ROADMAP_STATUSES.map((status) => {
              const items = requests.filter((r) => r.status === status);
              if (!items.length) return null;
              return (
                <div key={status} style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  <span className="section-label" style={{ color: STATUS_COLOR[status], fontSize: 11.5, letterSpacing: '0.04em', textTransform: 'uppercase' }}>
                    {STATUS_LABEL[status]} ({items.length})
                  </span>
                  {items.map((r) => (
                    <div key={r.id} className="card" style={{ padding: 14, display: 'flex', flexDirection: 'column', gap: 2 }}>
                      <span style={{ fontSize: 13, fontWeight: 700 }}>{r.title}</span>
                      {r.description && <p style={{ margin: 0, fontSize: 11.5, color: 'var(--muted)', lineHeight: 1.5 }}>{r.description}</p>}
                    </div>
                  ))}
                </div>
              );
            })}
            {ROADMAP_STATUSES.every((s) => !requests.some((r) => r.status === s)) && (
              <EmptyState icon="🗺️" title="Roadmap masih kosong" subtitle="Belum ada usulan yang lagi dipertimbangkan atau dikerjakan." />
            )}
          </div>
        )}
      </div>
    </div>
  );
}
