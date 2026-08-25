const MASK_ID = 'airmoon-logo-crescent-mask';

export default function Logo({ size = 26, showWordmark = true, color = 'var(--primary)' }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: size * 0.32 }}>
      <svg width={size} height={size} viewBox="2.382 2.732 18.861 18.861" fill="none">
        {/* Real <circle> elements + a <mask> to punch the "bite" out of the
            outer circle. Uses a static id, not React's useId() — useId()
            produces colon-containing ids (":r0:") and Safari/WebKit fails to
            resolve url(#:r0:) mask references (silently renders unmasked),
            while Chromium resolves it fine — that mismatch is what made this
            look correct in a Chromium check but show as a plain solid circle
            on an actual iPhone. A static id is safe here since every Logo
            instance on a page renders the exact same shape, so an id
            collision (if Logo ever appears twice at once) is harmless. */}
        <mask id={MASK_ID}>
          <circle cx="11.823825022320094" cy="12.176174977679906" r="8.5" fill="#fff" />
          <circle cx="13.48552595810848" cy="10.51447404189152" r="6" fill="#000" />
        </mask>
        <circle cx="11.823825022320094" cy="12.176174977679906" r="8.5" fill={color} mask={`url(#${MASK_ID})`} />
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
