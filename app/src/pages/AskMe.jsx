import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { IconMoon, IconBack } from '../components/icons';
import ConfirmDialog from '../components/ConfirmDialog';
import { shareText } from '../lib/share';
import { useToast } from '../context/ToastContext';
import { loadStarredAnswers, starAnswer, unstarAnswer } from '../lib/starredAnswers';
import StarredAnswersSheet from '../components/StarredAnswersSheet';
import { useVoiceInput } from '../lib/useVoiceInput';

// Filled in after the Vercel deploy — see CLAUDE.md. Absolute URL so this
// works no matter which host (Firebase or Vercel) serves the frontend.
const ASK_ME_ENDPOINT = 'https://airmoon.vercel.app/api/ask-me';

const WELCOME_MESSAGE = { role: 'assistant', content: 'Assalamu\'alaikum! Saya Ust. Rewin. Tanya apa aja seputar Islam — sholat, puasa, zakat, Qur\'an, atau fitur di airmoon.' };

// Shown only on a fresh chat (just the welcome message, nothing sent yet)
// — a blank input with just a placeholder was a real barrier for someone
// who wants to try this out but doesn't know what's reasonable to ask an
// AI about Islam. Tapping one sends it immediately, not just fills the box.
const SUGGESTED_QUESTIONS = [
  'Bagaimana niat sholat witir?',
  'Apa syarat wajib zakat?',
  'Doa buka puasa yang benar?',
  'Rukun umrah apa saja?',
];

// Persisted per-device (localStorage, not Firestore — this is scratch
// conversation history, not something that needs to sync across a
// user's devices) so leaving the page and coming back doesn't lose the
// conversation, which is what happened before this. Capped so someone
// who chats a lot doesn't grow this without bound.
const HISTORY_KEY = 'airmoon-askme-history';
const MAX_HISTORY = 40;

function loadHistory() {
  try {
    const saved = JSON.parse(localStorage.getItem(HISTORY_KEY));
    return Array.isArray(saved) && saved.length ? saved : [WELCOME_MESSAGE];
  } catch {
    return [WELCOME_MESSAGE];
  }
}

// Turns the visible transcript into a plain-text export — the welcome
// message is skipped (it's the same fixed greeting on every chat, not
// something worth including in a shared/saved conversation).
function formatTranscript(messages) {
  const lines = messages
    .filter((m) => m !== WELCOME_MESSAGE)
    .map((m) => `${m.role === 'user' ? 'Saya' : 'Ust. Rewin'}: ${m.content}`);
  return `${lines.join('\n\n')}\n\n— via airmoon (Tanya Ust. Rewin)`;
}

export default function AskMe() {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [messages, setMessages] = useState(loadHistory);
  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const [starred, setStarred] = useState(loadStarredAnswers);
  const [showStarred, setShowStarred] = useState(false);
  const [input, setInput] = useState('');
  const { supported: voiceSupported, listening, start: startVoice, stop: stopVoice } = useVoiceInput({
    onResult: (transcript) => setInput((prev) => (prev.trim() ? `${prev.trim()} ${transcript}` : transcript)),
  });
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const listRef = useRef(null);

  useEffect(() => {
    try {
      localStorage.setItem(HISTORY_KEY, JSON.stringify(messages.slice(-MAX_HISTORY)));
    } catch {
      // Private-browsing/full storage — the conversation just won't
      // survive a reload this session, not fatal.
    }
  }, [messages]);

  function clearHistory() {
    setMessages([WELCOME_MESSAGE]);
    localStorage.removeItem(HISTORY_KEY);
    setShowClearConfirm(false);
  }

  useEffect(() => {
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages, busy]);

  async function send(override) {
    const text = (override ?? input).trim();
    if (!text || busy) return;
    setInput('');
    setError('');
    const next = [...messages, { role: 'user', content: text }];
    setMessages(next);
    setBusy(true);
    try {
      const res = await fetch(ASK_ME_ENDPOINT, {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
          message: text,
          history: next.slice(0, -1).map((m) => ({ role: m.role, content: m.content })),
        }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || 'Gagal dapat jawaban.');
      }

      // The answer streams in as plain text — append each chunk so the
      // bubble fills in as it is written instead of after it is finished.
      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let acc = '';
      let started = false;

      for (;;) {
        const { done, value } = await reader.read();
        if (done) break;
        acc += decoder.decode(value, { stream: true });
        if (!acc) continue;
        if (!started) {
          started = true;
          setMessages((m) => [...m, { role: 'assistant', content: acc }]);
        } else {
          setMessages((m) => [...m.slice(0, -1), { role: 'assistant', content: acc }]);
        }
      }

      if (!started) throw new Error('Gagal dapat jawaban.');
    } catch (err) {
      setError(err.message || 'Gagal menghubungi Ust. Rewin. Coba lagi.');
    } finally {
      setBusy(false);
    }
  }

  function handleToggleStar(index) {
    const answer = messages[index].content;
    const existing = starred.find((e) => e.answer === answer);
    if (existing) {
      setStarred(unstarAnswer(existing.id));
      return;
    }
    const question = messages[index - 1]?.role === 'user' ? messages[index - 1].content : '';
    setStarred(starAnswer(question, answer));
    showToast('Jawaban disimpan.');
  }

  async function handleShareTranscript() {
    const result = await shareText({ text: formatTranscript(messages), title: 'Obrolan dengan Ust. Rewin' });
    if (result === 'copied') showToast('Obrolan disalin ke clipboard.');
  }

  return (
    <div className="screen" style={{ height: '100vh' }}>
      {/* A compact gradient header, not the full-height PageHeaderPhoto
          banner every content page uses now — a chat UI's scrollable
          message area is precious vertical space in a way a browsing page
          isn't, so this deliberately stays a thin strip (matching the
          same var(--primary)→var(--primary-dark) "hero card" language
          JadwalSholat's next-prayer card and others already use — those
          tokens alone resolve to the right per-theme colors, no photo or
          JS theme-check needed) instead of the ~130px photo treatment. */}
      <div style={{ padding: 'calc(16px + env(safe-area-inset-top)) 20px 16px', display: 'flex', alignItems: 'center', gap: 12, background: 'linear-gradient(135deg, var(--primary), var(--primary-dark))' }}>
        <button onClick={() => navigate(-1)} aria-label="Kembali" style={{ background: 'rgba(255,255,255,0.16)', border: 'none', width: 32, height: 32, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--on-primary)', cursor: 'pointer', flexShrink: 0 }}>
          <IconBack />
        </button>
        <div style={{ width: 34, height: 34, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, background: 'rgba(255,255,255,0.16)' }}>
          <IconMoon width="16" height="16" style={{ color: 'var(--on-primary)' }} />
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 1, minWidth: 0, flex: 1 }}>
          <span style={{ fontSize: 14, fontWeight: 800, color: 'var(--on-primary)' }}>Ust. Rewin</span>
          <span style={{ fontSize: 10.5, color: 'var(--on-primary)', opacity: 0.85 }}>Asisten AI seputar Islam</span>
        </div>
        {starred.length > 0 && (
          <button
            onClick={() => setShowStarred(true)}
            aria-label="Jawaban tersimpan"
            style={{ background: 'rgba(255,255,255,0.16)', border: 'none', width: 32, height: 32, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--on-primary)', cursor: 'pointer', flexShrink: 0, fontSize: 14 }}
          >
            ⭐
          </button>
        )}
        {messages.length > 1 && (
          <button
            onClick={handleShareTranscript}
            aria-label="Bagikan obrolan"
            style={{ background: 'rgba(255,255,255,0.16)', border: 'none', width: 32, height: 32, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--on-primary)', cursor: 'pointer', flexShrink: 0 }}
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M18 8a3 3 0 1 0-2.83-4H15a3 3 0 0 0 .05 3.11L8.91 10.7a3 3 0 1 0 0 2.6l6.14 3.59A3 3 0 1 0 15.7 15l-6.14-3.59a3 3 0 0 0 0-1.62l6.13-3.6c.36.4.81.71 1.31.81Z" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" /></svg>
          </button>
        )}
        {messages.length > 1 && (
          <button
            onClick={() => setShowClearConfirm(true)}
            aria-label="Hapus riwayat obrolan"
            style={{ background: 'rgba(255,255,255,0.16)', border: 'none', width: 32, height: 32, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--on-primary)', cursor: 'pointer', flexShrink: 0 }}
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M6 7h12M9 7V5a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2m2 0-.8 12.1a2 2 0 0 1-2 1.9H9.8a2 2 0 0 1-2-1.9L7 7" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" /></svg>
          </button>
        )}
      </div>

      <div ref={listRef} style={{ flex: 1, overflowY: 'auto', padding: '16px 20px', display: 'flex', flexDirection: 'column', gap: 12 }}>
        {messages.map((m, i) => (
          <div
            key={i}
            style={{
              alignSelf: m.role === 'user' ? 'flex-end' : 'flex-start',
              maxWidth: '82%',
              display: 'flex',
              alignItems: 'flex-start',
              gap: 8,
            }}
          >
            {m.role === 'assistant' && (
              <div style={{ width: 26, height: 26, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, background: 'var(--primary)', marginTop: 2 }}>
                <IconMoon width="13" height="13" style={{ color: 'var(--on-primary)' }} />
              </div>
            )}
            <div
              style={{
                padding: '11px 14px',
                borderRadius: 16,
                borderBottomRightRadius: m.role === 'user' ? 4 : 16,
                borderBottomLeftRadius: m.role === 'assistant' ? 4 : 16,
                fontSize: 13.5,
                lineHeight: 1.55,
                background: m.role === 'user' ? 'var(--primary)' : 'var(--card)',
                color: m.role === 'user' ? 'var(--on-primary)' : 'var(--ink)',
                whiteSpace: 'pre-wrap',
              }}
            >
              {m.content}
            </div>
            {m.role === 'assistant' && m !== WELCOME_MESSAGE && !(busy && i === messages.length - 1) && (
              <button
                onClick={() => handleToggleStar(i)}
                aria-label={starred.some((e) => e.answer === m.content) ? 'Hapus dari tersimpan' : 'Simpan jawaban ini'}
                style={{ flexShrink: 0, alignSelf: 'flex-end', background: 'none', border: 'none', color: starred.some((e) => e.answer === m.content) ? 'var(--gold-ink)' : 'var(--muted-soft)', fontSize: 15, cursor: 'pointer', padding: '4px 2px' }}
              >
                {starred.some((e) => e.answer === m.content) ? '⭐' : '☆'}
              </button>
            )}
          </div>
        ))}
        {busy && messages[messages.length - 1]?.role === 'user' && (
          <div style={{ alignSelf: 'flex-start', display: 'flex', alignItems: 'flex-start', gap: 8 }}>
            <div style={{ width: 26, height: 26, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, background: 'var(--primary)', marginTop: 2 }}>
              <IconMoon width="13" height="13" style={{ color: 'var(--on-primary)' }} />
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 4, padding: '13px 16px', borderRadius: 16, borderBottomLeftRadius: 4, background: 'var(--card)' }}>
              <span className="typing-dot" />
              <span className="typing-dot" />
              <span className="typing-dot" />
            </div>
          </div>
        )}
        {messages.length === 1 && !busy && (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, paddingLeft: 34 }}>
            {SUGGESTED_QUESTIONS.map((q) => (
              <button
                key={q}
                onClick={() => send(q)}
                style={{ padding: '8px 13px', borderRadius: 999, fontSize: 12, fontWeight: 600, border: '1px solid var(--border)', background: 'var(--card)', color: 'var(--ink)', cursor: 'pointer' }}
              >
                {q}
              </button>
            ))}
          </div>
        )}

        {error && <p style={{ fontSize: 12, color: 'var(--danger)', textAlign: 'center' }}>{error}</p>}
      </div>

      <div style={{ padding: 16, borderTop: '1px solid var(--border)', display: 'flex', gap: 10 }}>
        <div className="input-row" style={{ flex: 1 }}>
          <input
            placeholder={listening ? 'Mendengarkan…' : 'Tanya seputar Islam…'}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && send()}
          />
          {voiceSupported && (
            <button
              type="button"
              onClick={listening ? stopVoice : startVoice}
              aria-label={listening ? 'Berhenti merekam' : 'Tanya pakai suara'}
              style={{
                background: 'none',
                border: 'none',
                padding: 4,
                cursor: 'pointer',
                color: listening ? 'var(--danger)' : 'var(--muted)',
                flexShrink: 0,
                display: 'flex',
                animation: listening ? 'splash-pulse 1.2s ease-in-out infinite' : 'none',
              }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <rect x="9" y="2" width="6" height="12" rx="3" strokeWidth="1.6" />
                <path d="M5 11a7 7 0 0 0 14 0M12 18v3" strokeWidth="1.6" strokeLinecap="round" />
              </svg>
            </button>
          )}
        </div>
        <button
          onClick={send}
          disabled={busy || !input.trim()}
          style={{
            width: 46,
            height: 46,
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
            border: 'none',
            cursor: 'pointer',
            background: 'var(--primary)',
            opacity: busy || !input.trim() ? 0.5 : 1,
          }}
          aria-label="Kirim"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--on-primary)"><path d="M3 11 20 4l-7 17-3-7-7-3Z" strokeWidth="1.7" strokeLinejoin="round" /></svg>
        </button>
      </div>

      {showClearConfirm && (
        <ConfirmDialog
          title="Hapus riwayat obrolan?"
          message="Semua percakapan dengan Ust. Rewin di perangkat ini bakal dihapus."
          confirmLabel="Ya, Hapus"
          danger
          onCancel={() => setShowClearConfirm(false)}
          onConfirm={clearHistory}
        />
      )}

      {showStarred && (
        <StarredAnswersSheet
          entries={starred}
          onRemove={(id) => setStarred(unstarAnswer(id))}
          onClose={() => setShowStarred(false)}
        />
      )}
    </div>
  );
}
