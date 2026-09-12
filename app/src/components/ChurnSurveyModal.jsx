import { useState } from 'react';
import { createPortal } from 'react-dom';
import { useSwipeDismiss } from '../lib/useSwipeDismiss';
import SheetDragHandle from './SheetDragHandle';

const REASONS = [
  'Lupa buka aplikasinya',
  'Fiturnya belum sesuai kebutuhan',
  'Notifikasi kurang/mengganggu',
  'Ada aplikasi lain yang saya pakai',
  'Lainnya',
];

// Survei churn super singkat (2026-09-12) — see lib/churnSurvey.js. Same
// shell as NPSPromptModal/RatingPromptModal, a single multi-choice tap
// instead of a scale or stars — this is diagnosis, not satisfaction
// measurement.
export default function ChurnSurveyModal({ onSubmit, onLater, onNever }) {
  const [submitted, setSubmitted] = useState(false);
  const { dragY, dragging, handlers } = useSwipeDismiss(onLater);

  function handlePick(reason) {
    onSubmit(reason);
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
            <span style={{ fontSize: 14, fontWeight: 800 }}>Makasih udah cerita!</span>
            <span style={{ fontSize: 11.5, color: 'var(--muted)' }}>Masukan kamu bantu founder airmoon jadi lebih baik.</span>
            <button className="btn" style={{ marginTop: 8, width: 'auto', padding: '10px 24px' }} onClick={onLater}>
              Tutup
            </button>
          </div>
        ) : (
          <>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 2, textAlign: 'center' }}>
              <span style={{ fontSize: 14, fontWeight: 800 }}>Udah lama gak buka airmoon — kenapa nih?</span>
              <span style={{ fontSize: 11.5, color: 'var(--muted)' }}>Jawabanmu bantu kami tau apa yang perlu diperbaiki.</span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {REASONS.map((reason) => (
                <button
                  key={reason}
                  onClick={() => handlePick(reason)}
                  className="btn-outline"
                  style={{ textAlign: 'left', padding: '11px 14px' }}
                >
                  {reason}
                </button>
              ))}
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
