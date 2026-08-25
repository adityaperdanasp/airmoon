export default function Logo({ size = 26, showWordmark = true, color = 'var(--primary)' }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: size * 0.32 }}>
      <svg width={size} height={size} viewBox="1.844 2.519 19.611 19.611" fill="none">
        <path
          d="M20 14.5A8.5 8.5 0 1 1 9.5 4A4.5 4.5 0 1 0 20 14.5Z"
          fill={color}
          stroke={color}
          strokeWidth="1"
          strokeLinejoin="round"
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
