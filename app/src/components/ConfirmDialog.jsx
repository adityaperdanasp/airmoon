import { useState } from 'react';
import Portal from './Portal';
import { useEscapeKey } from '../lib/useEscapeKey';
import { useSwipeDismiss } from '../lib/useSwipeDismiss';
import SheetDragHandle from './SheetDragHandle';

// A reusable "are you sure?" bottom sheet — Reset Tasbih, Reset Zakat
// Haul, Hapus Ayat Favorit, and Keluar (logout) used to fire immediately
// on tap with no way to back out of an accidental press. Same bottom-
// sheet shape as NotificationPrimer.jsx (local state + conditional render
// at each call site, not a global context/provider — matches how
// AyatCardModal/NotificationPrimer are already used in this codebase).
// Portalled to document.body — see Portal.jsx's own comment for why.
export default function ConfirmDialog({ title, message, confirmLabel = 'Ya, Lanjutkan', cancelLabel = 'Batal', danger = false, onConfirm, onCancel }) {
  useEscapeKey(onCancel);
  const { dragY, dragging, handlers } = useSwipeDismiss(onCancel);
  // [UI 2026-09-11] Several onConfirm handlers (delete account, delete a
  // Firestore-backed deposit/entry) actually await a network write before
  // the caller closes this dialog — until now the confirm button gave no
  // feedback at all during that wait, so a slow connection just looked
  // unresponsive. Only shows the busy state for a real Promise-returning
  // handler; a plain synchronous onConfirm (most callers) resolves this
  // in the same tick and never visibly spins.
  const [confirming, setConfirming] = useState(false);

  async function handleConfirm() {
    if (confirming) return;
    const result = onConfirm?.();
    if (result && typeof result.then === 'function') {
      setConfirming(true);
      try {
        await result;
      } finally {
        setConfirming(false);
      }
    }
  }
  return (
    <Portal>
    <div
      onClick={onCancel}
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(0,0,0,0.5)',
        zIndex: 50,
        display: 'flex',
        alignItems: 'flex-end',
        justifyContent: 'center',
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        {...handlers}
        style={{
          width: '100%',
          maxWidth: 480,
          background: 'var(--bg)',
          borderTopLeftRadius: 24,
          borderTopRightRadius: 24,
          padding: '10px 24px 32px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 14,
          textAlign: 'center',
          transform: `translateY(${dragY}px)`,
          transition: dragging ? 'none' : 'transform var(--dur-2) var(--ease)',
        }}
      >
        <SheetDragHandle />
        <div
          style={{
            width: 56,
            height: 56,
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: danger ? 'rgba(217,45,45,0.12)' : 'var(--mint)',
          }}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={danger ? 'var(--danger)' : 'var(--primary)'}>
            <circle cx="12" cy="12" r="9" strokeWidth="1.6" />
            <path d="M12 8v5M12 15.5v.01" strokeWidth="2" strokeLinecap="round" />
          </svg>
        </div>
        <h2 style={{ margin: 0, fontSize: 16, fontWeight: 800 }}>{title}</h2>
        {message && <p style={{ margin: 0, fontSize: 12.5, lineHeight: 1.6, color: 'var(--muted)' }}>{message}</p>}
        <div style={{ display: 'flex', gap: 10, width: '100%', marginTop: 6 }}>
          <button className="btn-outline" style={{ flex: 1 }} onClick={onCancel} disabled={confirming}>
            {cancelLabel}
          </button>
          <button
            className="btn"
            style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', background: danger ? 'var(--danger)' : 'var(--primary)', color: danger ? 'var(--on-danger)' : 'var(--on-primary)' }}
            onClick={handleConfirm}
            disabled={confirming}
          >
            {confirming ? <div className="spinner" style={{ width: 16, height: 16, borderTopColor: danger ? 'var(--on-danger)' : 'var(--on-primary)' }} /> : confirmLabel}
          </button>
        </div>
      </div>
    </div>
    </Portal>
  );
}
