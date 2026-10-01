// Diagram Visual Pembagian — a plain horizontal stacked bar (each heir's
// own fraction as a colored segment) plus a legend, instead of just a
// list of numbers. Deliberately a stacked bar, not a family tree — a
// tree needs real parent/child positioning logic this data doesn't carry
// (results is a flat list of {label, fraction, amount}), while a stacked
// bar reads the proportions correctly with zero extra layout math.
const COLORS = ['#0d4d47', '#e8b84b', '#a8823c', '#4fbf82', '#6b4f22', '#2f6f67', '#c98a3a', '#8a5a9e'];

export default function WarisShareDiagram({ results }) {
  if (!results.length) return null;
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
      <div style={{ display: 'flex', height: 22, borderRadius: 999, overflow: 'hidden' }}>
        {results.map((r, i) => (
          <div
            key={i}
            title={`${r.label}: ${(r.fraction * 100).toFixed(1)}%`}
            style={{ width: `${Math.max(r.fraction * 100, 0.5)}%`, background: COLORS[i % COLORS.length] }}
          />
        ))}
      </div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
        {results.map((r, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
            <span style={{ width: 9, height: 9, borderRadius: 3, background: COLORS[i % COLORS.length], flexShrink: 0 }} />
            <span style={{ fontSize: 10, color: 'var(--muted)' }}>{r.label} ({(r.fraction * 100).toFixed(1)}%)</span>
          </div>
        ))}
      </div>
    </div>
  );
}
