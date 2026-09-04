// A "priming" screen shown before the browser's own native permission
// prompt, not instead of it — industry data consistently shows a cold
// `Notification.requestPermission()` (no context, fires the moment
// someone taps a toggle) gets dismissed/denied far more often than one
// where the app explains why first. Only ever shown when
// `Notification.permission === 'default'` (never asked yet) — see
// JadwalSholat.jsx's call site — so someone who already granted or denied
// doesn't get re-primed every time they revisit the toggle. Portalled to
// document.body — see Portal.jsx's own comment for why.
import Portal from './Portal';
import { useEscapeKey } from '../lib/useEscapeKey';
import { useSwipeDismiss } from '../lib/useSwipeDismiss';
import SheetDragHandle from './SheetDragHandle';

export default function NotificationPrimer({ onConfirm, onCancel }) {
  useEscapeKey(onCancel);
  const { dragY, dragging, handlers } = useSwipeDismiss(onCancel);
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
          transition: dragging ? 'none' : 'transform 0.2s ease',
        }}
      >
        <SheetDragHandle />
        <div
          style={{
            width: 60,
            height: 60,
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'var(--mint)',
          }}
        >
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="var(--primary)">
            <path d="M12 2a6 6 0 0 0-6 6v3.09c0 .58-.2 1.14-.57 1.59L4 15h16l-1.43-2.32a2.6 2.6 0 0 1-.57-1.59V8a6 6 0 0 0-6-6Z" strokeWidth="1.6" strokeLinejoin="round" />
            <path d="M9 18a3 3 0 0 0 6 0" strokeWidth="1.6" strokeLinecap="round" />
          </svg>
        </div>
        <h2 style={{ margin: 0, fontSize: 16, fontWeight: 800 }}>Aktifkan Notifikasi Adzan?</h2>
        <p style={{ margin: 0, fontSize: 12.5, lineHeight: 1.6, color: 'var(--muted)' }}>
          airmoon bakal ngingetin kamu 5x sehari pas waktu sholat tiba — jalan otomatis walau aplikasinya ketutup.
          Browser bakal nanya izin sekali, silakan pilih "Izinkan" di situ.
        </p>
        <div style={{ display: 'flex', gap: 10, width: '100%', marginTop: 6 }}>
          <button className="btn-outline" style={{ flex: 1 }} onClick={onCancel}>
            Nanti Aja
          </button>
          <button className="btn" style={{ flex: 1 }} onClick={onConfirm}>
            Aktifkan
          </button>
        </div>
      </div>
    </div>
    </Portal>
  );
}
