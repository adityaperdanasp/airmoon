// A circular progress ring — the same circle+stroke-dasharray math was
// hand-written separately in Tasbih.jsx (the big tap-to-count ring) and
// KalkulatorZakat.jsx's NisabGauge (a small ring next to a stat), with
// no shared component even though it's the exact same SVG underneath.
// Renders just the ring (track + progress arc); `children`, if given, is
// centered on top via absolute positioning — the surrounding layout
// (icon-and-label row, or a big tappable button) stays the caller's own.
export default function ProgressRing({
  size = 108,
  strokeWidth = 10,
  percent, // 0-1
  color = 'var(--primary)',
  trackColor = 'var(--border)',
  rotateDeg = -90,
  transitionDuration = 'var(--dur-3)',
  children,
}) {
  const r = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * r;
  const offset = circumference * (1 - Math.min(1, Math.max(0, percent || 0)));

  return (
    <div style={{ position: 'relative', width: size, height: size, flexShrink: 0 }}>
      <svg width={size} height={size} style={{ position: 'absolute', inset: 0, transform: `rotate(${rotateDeg}deg)` }}>
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={trackColor} strokeWidth={strokeWidth} />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          style={{ transition: `stroke-dashoffset ${transitionDuration} var(--ease), stroke ${transitionDuration} var(--ease)` }}
        />
      </svg>
      {children && (
        <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{children}</div>
      )}
    </div>
  );
}
