import { useState } from 'react';
import { createPortal } from 'react-dom';
import { useSwipeDismiss } from '../lib/useSwipeDismiss';
import SheetDragHandle from './SheetDragHandle';

const STAR_LABELS = ['Kurang', 'Lumayan', 'Cukup', 'Bagus', 'Suka Banget'];

// Real in-app feedback, not a fake "rate us on the store" link — see
// lib/ratingPrompt.js's header comment for why. 1-2 stars gets a text box
// (real complaints are worth reading), 3+ just gets a quick thank-you and
// an optional text box.
export default function RatingPromptModal({ onSubmit, onLater, onNever }) {
  const [stars, setStars] = useState(0);
  const [text, setText] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const { dragY, dragging, handlers } = useSwipeDismiss(onLater);

  function handleStarTap(n) {
    setStars(n);
  }

  function handleSubmit() {
    onSubmit({ stars, text: text.trim() });
    setSubmitted(true);
  }

  return createPortal(
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 55, display: 'flex', alignItems: 'flex-end' }} onClick={onLater}>
      <div
        className="card"
        {...handlers}
        style={{ width: '100%', borderBottomLeftRadius: 0, borderBottomRightRadius: 0, display: 'flex', flexDirection: 'column', gap: 14, padding: '10px 20px calc(20px + env(safe-area-inset-bottom))', transform: `translateY(${dragY}px)`, transition: dragging ? 'none' : 'transform 0.2s ease' }}
        onClick={(e) => e.stopPropagation()}
      >
        <SheetDragHandle />

        {submitted ? (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10, padding: '10px 0 4px', textAlign: 'center' }}>
            <span style={{ fontSize: 32 }}>🤲</span>
            <span style={{ fontSize: 14, fontWeight: 800 }}>Terima kasih atas masukannya!</span>
            <span style={{ fontSize: 11.5, color: 'var(--muted)' }}>Jazakallahu khairan — masukan kamu langsung sampai ke founder airmoon.</span>
            <button className="btn" style={{ marginTop: 8, width: 'auto', padding: '10px 24px' }} onClick={onLater}>
              Tutup
            </button>
          </div>
        ) : (
          <>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 2, textAlign: 'center' }}>
              <span style={{ fontSize: 14, fontWeight: 800 }}>Gimana pengalaman pakai airmoon?</span>
              <span style={{ fontSize: 11.5, color: 'var(--muted)' }}>Masukan kamu bantu founder airmoon terus memperbaiki aplikasi ini.</span>
            </div>

            <div style={{ display: 'flex', justifyContent: 'center', gap: 6 }}>
              {[1, 2, 3, 4, 5].map((n) => (
                <button
                  key={n}
                  onClick={() => handleStarTap(n)}
                  aria-label={`${n} bintang`}
                  style={{ background: 'none', border: 'none', padding: 4, cursor: 'pointer', fontSize: 30, lineHeight: 1, color: n <= stars ? 'var(--gold-ink)' : 'var(--border)' }}
                >
                  {n <= stars ? '★' : '☆'}
                </button>
              ))}
            </div>
            {stars > 0 && (
              <span style={{ fontSize: 11, color: 'var(--muted)', textAlign: 'center' }}>{STAR_LABELS[stars - 1]}</span>
            )}

            {stars > 0 && (
              <textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder={stars <= 2 ? 'Boleh cerita apa yang perlu diperbaiki?' : 'Ada masukan lain? (opsional)'}
                rows={3}
                maxLength={500}
                style={{ padding: '11px 13px', borderRadius: 12, border: '1px solid var(--border)', background: 'var(--bg)', color: 'var(--ink)', fontSize: 13, resize: 'none', fontFamily: 'inherit' }}
              />
            )}

            <div style={{ display: 'flex', gap: 10 }}>
              <button className="btn-outline" style={{ flex: 1 }} onClick={onLater}>
                Nanti Aja
              </button>
              <button className="btn" style={{ flex: 1 }} onClick={handleSubmit} disabled={stars === 0}>
                Kirim
              </button>
            </div>
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
