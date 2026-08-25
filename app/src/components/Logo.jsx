export default function Logo({ size = 26, showWordmark = true, color = 'var(--primary)' }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: size * 0.32 }}>
      <svg width={size} height={size} viewBox="2.382 1.732 18.861 18.861" fill="none">
        {/* Two full circles + fill-rule="evenodd", with the inner "bite"
            circle sized/positioned so it's fully INSIDE the outer one
            (internally tangent: offset + innerRadius == outerRadius,
            checked, not eyeballed). An earlier version let the inner circle
            poke outside the outer one — evenodd fills anything inside the
            inner circle but outside the outer one too, which showed up as
            a second crescent-shaped sliver stacked on top (reported and
            reproduced before this fix). Full containment also means this
            shape has no sharp corners anywhere (the inner circle just
            touches the outer one at a single tangent point), so unlike the
            star below it needs no corner-rounding trick at all. */}
        <path
          fillRule="evenodd"
          fill={color}
          d="M3.3238250223200936,12.176174977679906 A8.5,8.5 0 1,0 20.323825022320094,12.176174977679906 A8.5,8.5 0 1,0 3.3238250223200936,12.176174977679906 Z M7.5915919752864625,10.408408024713538 A6.0,6.0 0 1,0 19.591591975286462,10.408408024713538 A6.0,6.0 0 1,0 7.5915919752864625,10.408408024713538 Z"
        />
        <path
          d="M14.22,8.34 14.69,9.29 15.74,9.45 14.98,10.19 15.16,11.23 14.22,10.74 13.28,11.23 13.46,10.19 12.7,9.45 13.75,9.29Z"
          fill={color}
          stroke={color}
          strokeWidth="0.55"
          strokeLinejoin="round"
        />
      </svg>
      {showWordmark && (
        <span
          style={{
            fontFamily: "'Fredoka', 'Poppins', sans-serif",
            fontWeight: 600,
            fontSize: size * 0.85,
            letterSpacing: '-0.01em',
            color,
          }}
        >
          airmoon
        </span>
      )}
    </div>
  );
}
