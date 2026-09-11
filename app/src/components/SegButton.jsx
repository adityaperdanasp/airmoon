// A segmented-control option — Pengaturan.jsx's language/theme/azan-sound
// pickers and Kalkulator Zakat's Penghasilan/Maal/Fitrah tabs each had
// their own hand-written version of this exact same pill-row pattern
// (Pengaturan's rendered a plain `<div onClick>`, not a real button — no
// keyboard focus, no button semantics at all). One shared, real
// `<button>` with `aria-pressed` for both.
export default function SegButton({ active, onClick, children }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      style={{
        flex: 1,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 6,
        border: 'none',
        padding: '9px 0',
        borderRadius: 999,
        fontSize: 12.5,
        fontWeight: 700,
        cursor: 'pointer',
        fontFamily: 'inherit',
        color: active ? 'var(--on-primary)' : 'var(--muted)',
        background: active ? 'var(--primary)' : 'transparent',
      }}
    >
      {children}
    </button>
  );
}
