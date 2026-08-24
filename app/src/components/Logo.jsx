export default function Logo({ size = 26, showWordmark = true, color = 'var(--primary)' }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: size * 0.32 }}>
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
        <path
          d="M20 14.5A8.5 8.5 0 1 1 9.5 4a7 7 0 1 0 10.5 10.5Z"
          stroke={color}
          strokeWidth="1.6"
          strokeLinejoin="round"
        />
        <path
          d="M6.4 1.8 7 3.4 8.6 4 7 4.6 6.4 6.2 5.8 4.6 4.2 4 5.8 3.4Z"
          fill={color}
          stroke="none"
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
