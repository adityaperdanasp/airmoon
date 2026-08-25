import { useId } from 'react';

export default function Logo({ size = 26, showWordmark = true, color = 'var(--primary)' }) {
  const maskId = useId();
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: size * 0.32 }}>
      <svg width={size} height={size} viewBox="2.382 2.732 18.861 18.861" fill="none">
        {/* Real <circle> elements + a <mask> to punch the "bite" out of the
            outer circle — NOT hand-rolled two-arc circle paths with
            fill-rule="evenodd". That version (outer circle + inner "bite"
            circle each drawn as two 180° arcs between diametrically
            opposite points) rendered a thin stray sliver trailing off the
            shape in production, reproducible at every margin tried
            (confirmed it wasn't a containment/floating-point issue by
            testing well past any precision tolerance) — the diametric
            split has a genuinely ambiguous large-arc-flag, and apparently
            an unreliable one in at least some renderers. Verified this
            version's actual pixels (canvas + connected-component scan): only
            2 regions at any size threshold, crescent and star, no stray
            island — the earlier "verification" only caught fill-rule bugs,
            not this one, because it filtered out small regions. Inner
            circle stays fully inside the outer one with a real margin
            (not exact tangency) so there's still no sharp corner needing a
            rounding trick, same as before. */}
        <mask id={maskId}>
          <circle cx="11.823825022320094" cy="12.176174977679906" r="8.5" fill="#fff" />
          <circle cx="13.48552595810848" cy="10.51447404189152" r="6" fill="#000" />
        </mask>
        <circle cx="11.823825022320094" cy="12.176174977679906" r="8.5" fill={color} mask={`url(#${maskId})`} />
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
