import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import TopBar from '../components/TopBar';
import EmptyState from '../components/EmptyState';
import { SkeletonCard } from '../components/Skeleton';
import SegButton from '../components/SegButton';
import {
  watchQuestions, submitQuestion, watchMyQuestionUpvote, toggleQuestionUpvote,
  watchAnswers, submitAnswer,
} from '../lib/communityQA';

const dateFmt = new Intl.DateTimeFormat('id-ID', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' });

function UpvoteButton({ questionId, upvoteCount }) {
  const { user } = useAuth();
  const [upvoted, setUpvoted] = useState(false);
  const [busy, setBusy] = useState(false);

  useEffect(() => watchMyQuestionUpvote(questionId, user?.uid, setUpvoted), [questionId, user?.uid]);

  async function handleTap() {
    if (!user || busy) return;
    setBusy(true);
    try {
      await toggleQuestionUpvote(questionId, user.uid);
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
        display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2, padding: '8px 12px', borderRadius: 12,
        border: upvoted ? 'none' : '1px solid var(--border)',
        background: upvoted ? 'var(--primary)' : 'transparent',
        color: upvoted ? 'var(--on-primary)' : 'var(--muted)',
        cursor: 'pointer', opacity: busy ? 0.6 : 1, flexShrink: 0,
      }}
    >
      <span style={{ fontSize: 14 }}>▲</span>
      <span style={{ fontSize: 11, fontWeight: 800 }}>{upvoteCount || 0}</span>
    </button>
  );
}

function QuestionDetail({ question, onBack }) {
  const { user } = useAuth();
  const { showToast } = useToast();
  const [answers, setAnswers] = useState(null);
  const [text, setText] = useState('');
  const [posting, setPosting] = useState(false);

  useEffect(() => watchAnswers(question.id, setAnswers), [question.id]);

  async function handlePost(e) {
    e.preventDefault();
    if (!user || posting) return;
    setPosting(true);
    try {
      await submitAnswer(question.id, user, text);
      setText('');
    } catch (err) {
      showToast(err.message || 'Gagal kirim jawaban.', { type: 'danger' });
    } finally {
      setPosting(false);
    }
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
      <button onClick={onBack} style={{ alignSelf: 'flex-start', background: 'none', border: 'none', color: 'var(--primary)', fontSize: 12, fontWeight: 700, cursor: 'pointer', padding: 0 }}>
        ← Semua Pertanyaan
      </button>

      <div className="card" style={{ display: 'flex', gap: 12, padding: 16 }}>
        <UpvoteButton questionId={question.id} upvoteCount={question.upvoteCount} />
        <div style={{ display: 'flex', flexDirection: 'column', gap: 4, flex: 1, minWidth: 0 }}>
          <span style={{ fontSize: 14, fontWeight: 800 }}>{question.title}</span>
          {question.body && <p style={{ margin: 0, fontSize: 12.5, color: 'var(--muted)', lineHeight: 1.55 }}>{question.body}</p>}
          <span style={{ fontSize: 10, color: 'var(--muted-soft)' }}>{question.authorName}</span>
        </div>
      </div>

      <span className="section-label" style={{ color: 'var(--muted)', fontSize: 11.5, letterSpacing: '0.04em', textTransform: 'uppercase' }}>
        Jawaban ({answers?.length ?? 0})
      </span>

      {answers === null ? null : answers.length === 0 ? (
        <EmptyState icon="💬" title="Belum ada jawaban" subtitle="Jadi yang pertama bantu jawab pertanyaan ini." />
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {answers.map((a) => (
            <div key={a.id} className="card" style={{ padding: 14, display: 'flex', flexDirection: 'column', gap: 4 }}>
              <p style={{ margin: 0, fontSize: 13, lineHeight: 1.55 }}>{a.text}</p>
              <span style={{ fontSize: 10, color: 'var(--muted-soft)' }}>
                {a.authorName}{a.createdAt ? ` · ${dateFmt.format(a.createdAt.toDate())}` : ''}
              </span>
            </div>
          ))}
        </div>
      )}

      {user ? (
        <form onSubmit={handlePost} style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <textarea
            placeholder="Tulis jawaban kamu..."
            value={text}
            onChange={(e) => setText(e.target.value)}
            maxLength={1000}
            rows={3}
            style={{ padding: '10px 12px', borderRadius: 12, border: '1px solid var(--border)', background: 'var(--bg)', color: 'var(--ink)', fontSize: 13, fontFamily: 'inherit', resize: 'vertical' }}
          />
          <button className="btn" type="submit" disabled={posting || !text.trim()}>
            {posting ? 'Mengirim...' : 'Kirim Jawaban'}
          </button>
        </form>
      ) : (
        <p className="state-msg">Masuk dulu buat jawab pertanyaan ini.</p>
      )}
    </div>
  );
}

// Tanya Jawab Sesama Pengguna (2026-09-12) — a peer Q&A board, distinct
// from AskMe's AI-only chat. See lib/communityQA.js/firestore.rules for
// the data shape; this is genuinely user-generated content with no
// moderation UI built (the founder moderates via the Firestore console
// if something needs removing — same trust level `doas`' public wall
// already operates at).
export default function ForumKomunitas() {
  const { user } = useAuth();
  const { showToast } = useToast();
  const [questions, setQuestions] = useState(null);
  const [sortBy, setSortBy] = useState('terbaru');
  const [activeId, setActiveId] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => watchQuestions(sortBy, setQuestions), [sortBy]);

  async function handleSubmit(e) {
    e.preventDefault();
    if (!user || submitting) return;
    setSubmitting(true);
    try {
      await submitQuestion(user, title, body);
      setTitle('');
      setBody('');
      setShowForm(false);
      showToast('Pertanyaan kamu terkirim!');
    } catch (err) {
      showToast(err.message || 'Gagal kirim pertanyaan.', { type: 'danger' });
    } finally {
      setSubmitting(false);
    }
  }

  const active = questions?.find((q) => q.id === activeId);

  return (
    <div className="screen">
      <div className="screen-content">
        <TopBar title="Tanya Jawab Sesama Pengguna" subtitle={questions ? `${questions.length} pertanyaan` : undefined} />

        {active ? (
          <QuestionDetail question={active} onBack={() => setActiveId(null)} />
        ) : (
          <>
            <div style={{ display: 'flex', gap: 8 }}>
              <SegButton active={sortBy === 'terbaru'} onClick={() => setSortBy('terbaru')}>Terbaru</SegButton>
              <SegButton active={sortBy === 'populer'} onClick={() => setSortBy('populer')}>Populer</SegButton>
            </div>

            {user ? (
              !showForm ? (
                <button className="btn" onClick={() => setShowForm(true)}>+ Ajukan Pertanyaan</button>
              ) : (
                <form onSubmit={handleSubmit} className="card" style={{ padding: 16, display: 'flex', flexDirection: 'column', gap: 10 }}>
                  <div className="input-row">
                    <input required placeholder="Judul pertanyaan kamu" value={title} onChange={(e) => setTitle(e.target.value)} maxLength={150} />
                  </div>
                  <textarea
                    placeholder="Detail tambahan (opsional)"
                    value={body}
                    onChange={(e) => setBody(e.target.value)}
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
              <p className="state-msg">Masuk dulu buat nanya atau jawab.</p>
            )}

            {questions === null && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {Array.from({ length: 4 }).map((_, i) => <SkeletonCard key={i} height={78} radius={16} />)}
              </div>
            )}

            {questions?.length === 0 && (
              <EmptyState icon="💬" title="Belum ada pertanyaan" subtitle="Jadi yang pertama nanya sesuatu ke sesama pengguna airmoon." />
            )}

            {questions && questions.length > 0 && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {questions.map((q) => (
                  <button
                    key={q.id}
                    onClick={() => setActiveId(q.id)}
                    className="card"
                    style={{ display: 'flex', gap: 12, padding: 14, border: 'none', textAlign: 'left', cursor: 'pointer', font: 'inherit', color: 'inherit', width: '100%' }}
                  >
                    <UpvoteButton questionId={q.id} upvoteCount={q.upvoteCount} />
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 4, flex: 1, minWidth: 0 }}>
                      <span style={{ fontSize: 13, fontWeight: 700 }}>{q.title}</span>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <span style={{ fontSize: 10, color: 'var(--muted-soft)' }}>{q.authorName}</span>
                        <span style={{ fontSize: 10, color: 'var(--muted-soft)' }}>· {q.answerCount || 0} jawaban</span>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
