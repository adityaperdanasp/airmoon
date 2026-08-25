export default function Logo({ size = 26, showWordmark = true, color = 'var(--primary)' }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: size * 0.32 }}>
      <svg width={size} height={size} viewBox="2.192 -0.883 22.667 22.667" fill="none">
        {/* Two full circles + fill-rule="evenodd" — NOT a stroked single
            outline. An earlier version stroked this whole compound path to
            round the tips, which also stroked the INNER hole's boundary and
            made it look like two crescents stacked together. The two small
            circles below round just the two real corners (the tip points),
            without touching the hole. */}
        <path
          fillRule="evenodd"
          fill={color}
          d="M3.3238250223200936,12.176174977679906 A8.5,8.5 0 1,0 20.323825022320094,12.176174977679906 A8.5,8.5 0 1,0 3.3238250223200936,12.176174977679906 Z M8.907009549925586,7.668369247615666 A7.424621202458749,7.424621202458749 0 1,0 23.756251954843083,7.668369247615666 A7.424621202458749,7.424621202458749 0 1,0 8.907009549925586,7.668369247615666 Z"
        />
        <circle cx="20.113" cy="14.058" r="0.42" fill={color} />
        <circle cx="9.942" cy="3.887" r="0.42" fill={color} />
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
