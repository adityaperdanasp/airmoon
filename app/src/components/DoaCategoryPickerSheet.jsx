import Portal from './Portal';
import { useEscapeKey } from '../lib/useEscapeKey';
import { useSwipeDismiss } from '../lib/useSwipeDismiss';

// A bottom-sheet category picker for DoaHarian.jsx — replaces what used
// to be a horizontally-scrollable pill row. That row worked fine back
// when there were only 3-4 categories, but grew to 19 real categories +
// Favorit (20 chips) once the "205 items across 19 categories" expansion
// shipped, at which point "scroll sideways through 20 pills to find one"
// stopped being a reasonable way to pick a category — a single dropdown
// trigger + a real list (same Portal-based bottom sheet shell every
// other picker in this app already uses, e.g. CollectionPickerSheet) is
// easier to scan and one tap away regardless of list length.
export default function DoaCategoryPickerSheet({ categories, activeId, favoriteId, onPick, onClose }) {
  useEscapeKey(onClose);
  const { dragY, dragging, handlers } = useSwipeDismiss(onClose);

  return (
    <Portal>
      <div onClick={onClose} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 52, display: 'flex', alignItems: 'flex-end' }}>
        <div
          onClick={(e) => e.stopPropagation()}
          {...handlers}
          style={{
            width: '100%',
            maxWidth: 480,
            margin: '0 auto',
            background: 'var(--card)',
            borderRadius: '20px 20px 0 0',
            paddingBottom: 16,
            maxHeight: '75vh',
            display: 'flex',
            flexDirection: 'column',
            transform: `translateY(${dragY}px)`,
            transition: dragging ? 'none' : 'transform var(--dur-2) var(--ease)',
          }}
        >
          <div style={{ width: 36, height: 4, borderRadius: 999, background: 'var(--border)', margin: '10px auto 12px', flexShrink: 0 }} />
          <div style={{ padding: '0 20px 12px', textAlign: 'center', fontSize: 12.5, fontWeight: 700, color: 'var(--gold-ink)', flexShrink: 0 }}>
            Pilih Kategori Doa
          </div>

          <div style={{ overflowY: 'auto', padding: '0 8px' }}>
            <button
              onClick={() => onPick(favoriteId)}
              style={{
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                gap: 10,
                padding: '13px 12px',
                borderRadius: 12,
                border: 'none',
                background: activeId === favoriteId ? 'var(--mint)' : 'transparent',
                color: activeId === favoriteId ? 'var(--primary)' : 'inherit',
                fontSize: 13,
                fontWeight: 700,
                textAlign: 'left',
                cursor: 'pointer',
                fontFamily: 'inherit',
              }}
            >
              ⭐ Favorit
            </button>
            {categories.map((c) => (
              <button
                key={c.id}
                onClick={() => onPick(c.id)}
                style={{
                  width: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 10,
                  padding: '13px 12px',
                  borderRadius: 12,
                  border: 'none',
                  background: activeId === c.id ? 'var(--mint)' : 'transparent',
                  color: activeId === c.id ? 'var(--primary)' : 'inherit',
                  fontSize: 13,
                  fontWeight: 700,
                  textAlign: 'left',
                  cursor: 'pointer',
                  fontFamily: 'inherit',
                }}
              >
                {c.label}
                <span style={{ marginLeft: 'auto', fontSize: 10.5, fontWeight: 700, color: 'var(--muted)' }}>{c.count}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </Portal>
  );
}
