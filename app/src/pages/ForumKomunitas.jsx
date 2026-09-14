import { useEffect, useRef, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { useLang } from '../context/LangContext';
import TopBar from '../components/TopBar';
import EmptyState from '../components/EmptyState';
import { SkeletonCard } from '../components/Skeleton';
import SegButton from '../components/SegButton';
import ContentActionsMenu from '../components/ContentActionsMenu';
import { hapticTick } from '../lib/haptics';
import { isUserBlocked } from '../lib/blockedUsers';
import {
  watchQuestions, submitQuestion, watchMyQuestionUpvote, toggleQuestionUpvote,
  watchAnswers, submitAnswer,
} from '../lib/communityQA';

const dateFmt = new Intl.DateTimeFormat('id-ID', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' });

function UpvoteButton({ questionId, upvoteCount }) {
  const { user } = useAuth();
  const { t } = useLang();
  const [upvoted, setUpvoted] = useState(false);
  const [busy, setBusy] = useState(false);

  useEffect(() => watchMyQuestionUpvote(questionId, user?.uid, setUpvoted), [questionId, user?.uid]);

  async function handleTap() {
    if (!user || busy) return;
    hapticTick();
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
      aria-label={t('forum_upvote_aria')}
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
  const { t } = useLang();
  const [answers, setAnswers] = useState(null);
  const [text, setText] = useState('');
  const [posting, setPosting] = useState(false);
  const [blockedVersion, setBlockedVersion] = useState(0);
  const answerFieldRef = useRef(null);

  useEffect(() => watchAnswers(question.id, setAnswers), [question.id]);

  async function handlePost(e) {
    e.preventDefault();
    if (!user || posting) return;
    setPosting(true);
    try {
      await submitAnswer(question, user, text);
      setText('');
    } catch (err) {
      showToast(err.message || t('forum_gagal_kirim_jawaban'), { type: 'danger' });
    } finally {
      setPosting(false);
    }
  }

  const visibleAnswers = (answers || []).filter((a) => !isUserBlocked(a.uid));

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }} key={blockedVersion}>
      <button onClick={onBack} style={{ alignSelf: 'flex-start', background: 'none', border: 'none', color: 'var(--primary)', fontSize: 12, fontWeight: 700, cursor: 'pointer', padding: 0 }}>
        {t('forum_semua_pertanyaan')}
      </button>

      <div className="card" style={{ display: 'flex', gap: 12, padding: 16 }}>
        <UpvoteButton questionId={question.id} upvoteCount={question.upvoteCount} />
        <div style={{ display: 'flex', flexDirection: 'column', gap: 4, flex: 1, minWidth: 0 }}>
          <span style={{ fontSize: 14, fontWeight: 800 }}>{question.title}</span>
          {question.body && <p style={{ margin: 0, fontSize: 12.5, color: 'var(--muted)', lineHeight: 1.55 }}>{question.body}</p>}
          <span style={{ fontSize: 10, color: 'var(--muted-soft)' }}>{question.authorName}</span>
        </div>
        <ContentActionsMenu
          contentType="communityQuestion"
          contentPath={`communityQuestions/${question.id}`}
          authorUid={question.uid}
          authorName={question.authorName}
          onBlocked={() => setBlockedVersion((v) => v + 1)}
        />
      </div>

      <span className="section-label" style={{ color: 'var(--muted)', fontSize: 11.5, letterSpacing: '0.04em', textTransform: 'uppercase' }}>
        {t('forum_jawaban_label')} ({visibleAnswers.length})
      </span>

      {answers === null ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <SkeletonCard height={64} radius={14} />
          <SkeletonCard height={64} radius={14} />
        </div>
      ) : visibleAnswers.length === 0 ? (
        <EmptyState
          icon="💬"
          title={t('forum_empty_jawaban_title')}
          subtitle={t('forum_empty_jawaban_subtitle')}
          actionLabel={user ? t('forum_tulis_jawaban') : undefined}
          onAction={user ? () => answerFieldRef.current?.focus() : undefined}
        />
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {visibleAnswers.map((a) => (
            <div key={a.id} className="card" style={{ padding: 14, display: 'flex', flexDirection: 'column', gap: 4 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', gap: 8 }}>
                <p style={{ margin: 0, fontSize: 13, lineHeight: 1.55, flex: 1 }}>{a.text}</p>
                <ContentActionsMenu
                  contentType="communityAnswer"
                  contentPath={`communityQuestions/${question.id}/answers/${a.id}`}
                  authorUid={a.uid}
                  authorName={a.authorName}
                  onBlocked={() => setBlockedVersion((v) => v + 1)}
                />
              </div>
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
            ref={answerFieldRef}
            placeholder={t('forum_placeholder_jawaban')}
            value={text}
            onChange={(e) => setText(e.target.value)}
            maxLength={1000}
            rows={3}
            style={{ padding: '10px 12px', borderRadius: 12, border: '1px solid var(--border)', background: 'var(--bg)', color: 'var(--ink)', fontSize: 13, fontFamily: 'inherit', resize: 'vertical' }}
          />
          <button className="btn" type="submit" disabled={posting || !text.trim()}>
            {posting ? t('mengirim') : t('forum_kirim_jawaban')}
          </button>
        </form>
      ) : (
        <p className="state-msg">{t('forum_masuk_jawab')}</p>
      )}
    </div>
  );
}

// Tanya Jawab Sesama Pengguna (2026-09-12) — a peer Q&A board, distinct
// from AskMe's AI-only chat. See lib/communityQA.js/firestore.rules for
// the data shape. Moderation (2026-09-14): ContentActionsMenu gives
// "Laporkan" (real moderation, lib/contentReports.js — the founder
// reviews via console) and "Blokir" (a personal client-side filter,
// lib/blockedUsers.js — never a server-side action).
export default function ForumKomunitas() {
  const { user } = useAuth();
  const { showToast } = useToast();
  const { t } = useLang();
  const [questions, setQuestions] = useState(null);
  const [sortBy, setSortBy] = useState('terbaru');
  const [activeId, setActiveId] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [blockedVersion, setBlockedVersion] = useState(0);

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
      showToast(t('forum_toast_terkirim'));
    } catch (err) {
      showToast(err.message || t('forum_gagal_kirim_pertanyaan'), { type: 'danger' });
    } finally {
      setSubmitting(false);
    }
  }

  const active = questions?.find((q) => q.id === activeId);
  const visibleQuestions = (questions || []).filter((q) => !isUserBlocked(q.uid));

  return (
    <div className="screen">
      <div className="screen-content">
        <TopBar title={t('forum_title')} subtitle={questions ? `${visibleQuestions.length} ${t('forum_subtitle_pertanyaan')}` : undefined} />

        {active ? (
          <QuestionDetail question={active} onBack={() => setActiveId(null)} />
        ) : (
          <>
            <div style={{ display: 'flex', gap: 8 }}>
              <SegButton active={sortBy === 'terbaru'} onClick={() => setSortBy('terbaru')}>{t('forum_tab_terbaru')}</SegButton>
              <SegButton active={sortBy === 'populer'} onClick={() => setSortBy('populer')}>{t('forum_tab_populer')}</SegButton>
            </div>

            {user ? (
              !showForm ? (
                <button className="btn" onClick={() => setShowForm(true)}>{t('forum_ajukan_pertanyaan_btn')}</button>
              ) : (
                <form onSubmit={handleSubmit} className="card" style={{ padding: 16, display: 'flex', flexDirection: 'column', gap: 10 }}>
                  <div className="input-row">
                    <input required placeholder={t('forum_placeholder_judul')} value={title} onChange={(e) => setTitle(e.target.value)} maxLength={150} />
                  </div>
                  <textarea
                    placeholder={t('forum_placeholder_detail')}
                    value={body}
                    onChange={(e) => setBody(e.target.value)}
                    maxLength={1000}
                    rows={3}
                    style={{ padding: '10px 12px', borderRadius: 12, border: '1px solid var(--border)', background: 'var(--bg)', color: 'var(--ink)', fontSize: 13, fontFamily: 'inherit', resize: 'vertical' }}
                  />
                  <div style={{ display: 'flex', gap: 8 }}>
                    <button type="button" className="btn-outline" style={{ flex: 1 }} onClick={() => setShowForm(false)}>{t('batal')}</button>
                    <button type="submit" className="btn" style={{ flex: 1 }} disabled={submitting || !title.trim()}>
                      {submitting ? t('mengirim') : t('forum_kirim')}
                    </button>
                  </div>
                </form>
              )
            ) : (
              <p className="state-msg">{t('forum_masuk_nanya')}</p>
            )}

            {questions === null && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {Array.from({ length: 4 }).map((_, i) => <SkeletonCard key={i} height={78} radius={16} />)}
              </div>
            )}

            {questions && visibleQuestions.length === 0 && (
              <EmptyState
                icon="💬"
                title={t('forum_empty_pertanyaan_title')}
                subtitle={t('forum_empty_pertanyaan_subtitle')}
                actionLabel={user && !showForm ? t('forum_ajukan_pertanyaan_action') : undefined}
                onAction={user && !showForm ? () => setShowForm(true) : undefined}
              />
            )}

            {visibleQuestions.length > 0 && (
              <div key={blockedVersion} style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {visibleQuestions.map((q) => (
                  <div key={q.id} className="card" style={{ display: 'flex', gap: 12, padding: 14 }}>
                    <UpvoteButton questionId={q.id} upvoteCount={q.upvoteCount} />
                    <div
                      onClick={() => setActiveId(q.id)}
                      role="button"
                      tabIndex={0}
                      onKeyDown={(e) => { if (e.key === 'Enter') setActiveId(q.id); }}
                      style={{ display: 'flex', flexDirection: 'column', gap: 4, flex: 1, minWidth: 0, cursor: 'pointer' }}
                    >
                      <span style={{ fontSize: 13, fontWeight: 700 }}>{q.title}</span>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <span style={{ fontSize: 10, color: 'var(--muted-soft)' }}>{q.authorName}</span>
                        <span style={{ fontSize: 10, color: 'var(--muted-soft)' }}>· {q.answerCount || 0} {t('forum_jawaban_suffix')}</span>
                      </div>
                    </div>
                    <ContentActionsMenu
                      contentType="communityQuestion"
                      contentPath={`communityQuestions/${q.id}`}
                      authorUid={q.uid}
                      authorName={q.authorName}
                      onBlocked={() => setBlockedVersion((v) => v + 1)}
                    />
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
