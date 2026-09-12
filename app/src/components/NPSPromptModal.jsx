import { useState } from 'react';
import { createPortal } from 'react-dom';
import { useSwipeDismiss } from '../lib/useSwipeDismiss';
import SheetDragHandle from './SheetDragHandle';

// Survei NPS super ringan (2026-09-12) — see lib/npsPrompt.js. Same shell
// as RatingPromptModal.jsx, a different question shape (single 0-10
// score, no text box) since this is meant to be answerable in one tap,
// not a feedback form.
export default function NPSPromptModal({ onSubmit, onLater, onNever }) {
  const [score, setScore] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const { dragY, dragging, handlers } = useSwipeDismiss(onLater);

  function handleSubmit(n) {
    setScore(n);
    onSubmit(n);
    setSubmitted(true);
  }

  return createPortal(
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 55, display: 'flex', alignItems: 'flex-end' }} onClick={onLater}>
      <div
        className="card"
        {...handlers}
        style={{ width: '100%', borderBottomLeftRadius: 0, borderBottomRightRadius: 0, display: 'flex', flexDirection: 'column', gap: 14, padding: '10px 20px calc(20px + env(safe-area-inset-bottom))', transform: `translateY(${dragY}px)`, transition: dragging ? 'none' : 'transform var(--dur-2) var(--ease)' }}
        onClick={(e) => e.stopPropagation()}
      >
        <SheetDragHandle />

        {submitted ? (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10, padding: '10px 0 4px', textAlign: 'center' }}>
            <span style={{ fontSize: 32 }}>🤲</span>
            <span style={{ fontSize: 14, fontWeight: 800 }}>Makasih udah jawab!</span>
            <span style={{ fontSize: 11.5, color: 'var(--muted)' }}>Jazakallahu khairan — jawaban kamu bantu founder airmoon.</span>
            <button className="btn" style={{ marginTop: 8, width: 'auto', padding: '10px 24px' }} onClick={onLater}>
              Tutup
            </button>
          </div>
        ) : (
          <>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 2, textAlign: 'center' }}>
              <span style={{ fontSize: 14, fontWeight: 800 }}>Seberapa besar kemungkinan kamu rekomendasiin airmoon ke teman?</span>
              <span style={{ fontSize: 11.5, color: 'var(--muted)' }}>0 = gak mungkin sama sekali, 10 = pasti banget</span>
            </div>

            <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 6 }}>
              {Array.from({ length: 11 }, (_, n) => n).map((n) => (
                <button
                  key={n}
                  onClick={() => handleSubmit(n)}
                  aria-label={`Skor ${n}`}
                  style={{
                    width: 30,
                    height: 30,
                    borderRadius: 8,
                    border: score === n ? 'none' : '1px solid var(--border)',
                    background: score === n ? 'var(--primary)' : 'transparent',
                    color: score === n ? 'var(--on-primary)' : 'var(--ink)',
                    fontSize: 12,
                    fontWeight: 700,
                    cursor: 'pointer',
                  }}
                >
                  {n}
                </button>
              ))}
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 10, color: 'var(--muted-soft)' }}>
              <span>Gak mungkin</span>
              <span>Pasti</span>
            </div>

            <button className="btn-outline" onClick={onLater}>
              Nanti Aja
            </button>
            <button
              onClick={onNever}
              style={{ background: 'none', border: 'none', color: 'var(--muted)', fontSize: 10.5, textDecoration: 'underline', cursor: 'pointer', padding: 0, alignSelf: 'center' }}
            >
              Jangan tanya lagi
            </button>
          </>
        )}
      </div>
    </div>,
    document.body
  );
}
