// A real switch — Pengaturan.jsx's notification-category toggles + Jam
// Tenang toggle, and Kalkulator Zakat's monthly-reminder toggle, each had
// their own hand-copied `<div onClick>` pill+knob. None of them were a
// real button at all: no keyboard focus, no `role="switch"`, no
// `aria-checked` — the exact same gap SegButton.jsx already fixed for
// segmented pickers, just missed here.
export default function ToggleSwitch({ checked, onChange, disabled = false }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => !disabled && onChange(!checked)}
      disabled={disabled}
      style={{
        width: 42,
        height: 24,
        borderRadius: 999,
        border: 'none',
        background: checked ? 'var(--primary)' : 'var(--border)',
        cursor: disabled ? 'default' : 'pointer',
        display: 'flex',
        alignItems: 'center',
        padding: 3,
        flexShrink: 0,
        opacity: disabled ? 0.6 : 1,
      }}
    >
      <div
        style={{
          width: 18,
          height: 18,
          borderRadius: '50%',
          background: '#fff',
          transform: checked ? 'translateX(18px)' : 'translateX(0)',
          transition: 'transform var(--dur-1) var(--ease)',
        }}
      />
    </button>
  );
}
