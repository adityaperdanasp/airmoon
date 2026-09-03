import { createContext, useCallback, useContext, useState } from 'react';
import Portal from '../components/Portal';

const ToastContext = createContext(null);

// A single shared toast stack — feedback for quick actions (favorit
// dihapus, hitungan direset, warna avatar disimpan) used to be
// inconsistent: some had inline text that appeared/disappeared next to
// the button, most had nothing at all. One provider, one stack, so every
// page gets the same look instead of reinventing its own "saved!" text.
export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const showToast = useCallback((message, { type = 'default', duration = 2400 } = {}) => {
    const id = `${Date.now()}-${Math.random()}`;
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, duration);
  }, []);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <Portal>
      <div
        style={{
          position: 'fixed',
          left: '50%',
          transform: 'translateX(-50%)',
          bottom: 'calc(96px + env(safe-area-inset-bottom))', // clears BottomNav's floating pill (bottom: 22px + its own height + safe area)
          zIndex: 60,
          display: 'flex',
          flexDirection: 'column',
          gap: 8,
          width: 'calc(100% - 32px)',
          maxWidth: 448,
          alignItems: 'center',
          pointerEvents: 'none',
        }}
      >
        {toasts.map((t) => (
          <div
            key={t.id}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              padding: '11px 18px',
              borderRadius: 999,
              fontSize: 12.5,
              fontWeight: 600,
              color: t.type === 'danger' ? 'var(--on-danger)' : 'var(--on-primary)',
              background: t.type === 'danger' ? 'var(--danger)' : 'var(--primary)',
              boxShadow: 'var(--shadow-pill)',
              animation: 'toast-in 0.2s ease',
              maxWidth: '100%',
            }}
          >
            {t.message}
          </div>
        ))}
      </div>
      </Portal>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used inside ToastProvider');
  return ctx;
}
