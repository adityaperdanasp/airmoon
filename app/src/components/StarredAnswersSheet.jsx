import { createPortal } from 'react-dom';
import { useEscapeKey } from '../lib/useEscapeKey';
import { useSwipeDismiss } from '../lib/useSwipeDismiss';
import SheetDragHandle from './SheetDragHandle';

// Lists every Q&A pair starred from AskMe.jsx — see lib/starredAnswers.js
// for why these are snapshots, not live message references.
export default function StarredAnswersSheet({ entries, onRemove, onClose }) {
  useEscapeKey(onClose);
  const { dragY, dragging, handlers } = useSwipeDismiss(onClose);
  return createPortal(
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 55, display: 'flex', alignItems: 'flex-end' }} onClick={onClose}>
      <div
        className="card"
        {...handlers}
        style={{ width: '100%', maxHeight: '75vh', borderBottomLeftRadius: 0, borderBottomRightRadius: 0, display: 'flex', flexDirection: 'column', gap: 12, padding: '10px 18px calc(18px + env(safe-area-inset-bottom))', transform: `translateY(${dragY}px)`, transition: dragging ? 'none' : 'transform 0.2s ease' }}
        onClick={(e) => e.stopPropagation()}
      >
        <SheetDragHandle />
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span style={{ fontSize: 14, fontWeight: 800 }}>⭐ Jawaban Tersimpan</span>
          <button onClick={onClose} aria-label="Tutup" style={{ background: 'none', border: 'none', color: 'var(--muted)', fontSize: 20, cursor: 'pointer', padding: 0, lineHeight: 1 }}>
            &times;
          </button>
        </div>

        {entries.length === 0 && (
          <p className="state-msg">Belum ada jawaban tersimpan. Tap ikon ☆ di bawah jawaban Ust. Rewin buat menyimpannya.</p>
        )}

        <div style={{ display: 'flex', flexDirection: 'column', gap: 10, overflowY: 'auto' }}>
          {entries.map((e) => (
            <div key={e.id} style={{ display: 'flex', flexDirection: 'column', gap: 6, padding: 12, borderRadius: 14, background: 'var(--bg)' }}>
              {e.question && <span style={{ fontSize: 11.5, fontWeight: 700, color: 'var(--primary)' }}>Q: {e.question}</span>}
              <span style={{ fontSize: 12.5, lineHeight: 1.55, color: 'var(--ink)', whiteSpace: 'pre-wrap' }}>{e.answer}</span>
              <button
                onClick={() => onRemove(e.id)}
                style={{ alignSelf: 'flex-end', background: 'none', border: 'none', color: 'var(--muted)', fontSize: 11, textDecoration: 'underline', cursor: 'pointer', padding: 0 }}
              >
                Hapus
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>,
    document.body
  );
}
