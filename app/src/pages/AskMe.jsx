import { useEffect, useRef, useState } from 'react';
import TopBar from '../components/TopBar';
import { IconMoon } from '../components/icons';

// Filled in after the Vercel deploy — see CLAUDE.md. Absolute URL so this
// works no matter which host (Firebase or Vercel) serves the frontend.
const ASK_ME_ENDPOINT = 'https://airmoon.vercel.app/api/ask-me';

export default function AskMe() {
  const [messages, setMessages] = useState([
    { role: 'assistant', content: 'Assalamu\'alaikum! Tanya apa aja seputar Islam — sholat, puasa, zakat, Qur\'an, atau fitur di airmoon.' },
  ]);
  const [input, setInput] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const listRef = useRef(null);

  useEffect(() => {
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages, busy]);

  async function send() {
    const text = input.trim();
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
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Gagal dapat jawaban.');
      setMessages((m) => [...m, { role: 'assistant', content: data.reply }]);
    } catch (err) {
      setError(err.message || 'Gagal menghubungi Ask me. Coba lagi.');
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="screen" style={{ height: '100vh' }}>
      <div style={{ padding: '28px 20px 12px' }}>
        <TopBar title="Ask me" subtitle="Asisten AI seputar Islam" />
      </div>

      <div ref={listRef} style={{ flex: 1, overflowY: 'auto', padding: '0 20px', display: 'flex', flexDirection: 'column', gap: 12 }}>
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
                <IconMoon width="13" height="13" style={{ color: '#fff' }} />
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
                color: m.role === 'user' ? '#fff' : 'var(--ink)',
                whiteSpace: 'pre-wrap',
              }}
            >
              {m.content}
            </div>
          </div>
        ))}
        {busy && (
          <div style={{ alignSelf: 'flex-start', display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={{ width: 26, height: 26, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, background: 'var(--primary)' }}>
              <IconMoon width="13" height="13" style={{ color: '#fff' }} />
            </div>
            <div className="spinner" style={{ width: 16, height: 16 }} />
          </div>
        )}
        {error && <p style={{ fontSize: 12, color: 'var(--danger)', textAlign: 'center' }}>{error}</p>}
      </div>

      <div style={{ padding: 16, borderTop: '1px solid var(--border)', display: 'flex', gap: 10 }}>
        <div className="input-row" style={{ flex: 1 }}>
          <input
            placeholder="Tanya seputar Islam…"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && send()}
          />
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
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#fff"><path d="M3 11 20 4l-7 17-3-7-7-3Z" strokeWidth="1.7" strokeLinejoin="round" /></svg>
        </button>
      </div>
    </div>
  );
}
