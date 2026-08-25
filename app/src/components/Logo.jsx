export default function Logo({ size = 26, showWordmark = true, color = 'var(--primary)' }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: size * 0.32 }}>
      <svg width={size} height={size} viewBox="2.921 3.271 17.801 17.801" fill="none">
        {/* Single connected path (outer arc + inner "bite" arc sharing two
            real endpoints) — no <mask>, no fill-rule="evenodd". The two
            circles genuinely intersect at two points now (the inner circle
            pokes past the outer one), so this is a real lune and the arc
            endpoints are ~50-74° apart on each circle, nowhere near the
            180°-apart case that has an ambiguous large-arc-flag. This is
            the most cross-browser-robust construction: no id references,
            no fill-rule interactions, just one filled path. */}
        <path
          fill={color}
          d="M14.72296282518494,4.185868350271921 A8.5,8.5 0 1,0 19.81413164972808,9.27703717481506 A6.0,6.0 0 1,1 14.72296282518494,4.185868350271921 Z"
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
