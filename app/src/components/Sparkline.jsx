// A small inline trend line — the app's stat dashboards (Ringkasan
// Ibadah, Khatam Progress) only ever showed bare numbers ("65%", "12
// hari"), no sense of whether that number has been climbing or slipping
// lately. `values` is a plain array of numbers, oldest first; `max`
// caps the y-scale (defaults to the data's own max so a flat/low series
// doesn't look like it's already maxed out). Pure SVG, no charting
// library — this is one polyline + one filled area, not worth a dependency.
export default function Sparkline({ values, max, width = 84, height = 28, color = 'var(--primary)' }) {
  if (!values || values.length < 2) return null;
  const top = max ?? Math.max(...values, 1);
  const step = width / (values.length - 1);
  const points = values.map((v, i) => {
    const x = i * step;
    const y = height - (Math.min(v, top) / top) * height;
    return [x, y];
  });
  const line = points.map(([x, y]) => `${x.toFixed(1)},${y.toFixed(1)}`).join(' ');
  const area = `0,${height} ${line} ${width},${height}`;
  const [lastX, lastY] = points[points.length - 1];

  return (
    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} style={{ display: 'block', overflow: 'visible' }}>
      <polygon points={area} fill={color} opacity="0.14" />
      <polyline points={line} fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx={lastX} cy={lastY} r="2.6" fill={color} />
    </svg>
  );
}
