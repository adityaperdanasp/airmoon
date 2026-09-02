// Shimmer loading placeholders — see the `.skeleton`/`@keyframes
// skeleton-shimmer` rules in styles/theme.css for the actual animation.
// Used wherever a page previously just showed a spinner or plain "Memuat…"
// text while its own data (not the route chunk — see App.jsx's Suspense
// fallback for that) is still loading.

export function Skeleton({ width = '100%', height = 14, radius = 8, style }) {
  return <div className="skeleton" style={{ width, height, borderRadius: radius, ...style }} />;
}

// Mirrors SurahList.jsx's actual per-surah row shape (number badge +
// two-line text block + Arabic name) so the loading state doesn't jump
// around once real rows swap in.
export function SkeletonSurahRow() {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 4px' }}>
      <Skeleton width={36} height={36} radius={12} />
      <div style={{ display: 'flex', flexDirection: 'column', gap: 6, flex: 1, minWidth: 0 }}>
        <Skeleton width="55%" height={13} />
        <Skeleton width="35%" height={10} />
      </div>
      <Skeleton width={26} height={19} radius={4} />
    </div>
  );
}

// A generic card-shaped block — donation cards, doa cards, anything using
// the app's standard `.card` rounded-rect footprint. `style` is merged in
// last so a caller can add e.g. `{ flex: 1 }` for a flex-row layout — a
// bare div has no intrinsic width, so without that it would collapse to
// near-zero width inside a flex container instead of filling its share.
export function SkeletonCard({ height = 96, radius = 20, style }) {
  return <div className="skeleton" style={{ height, borderRadius: radius, border: '1px solid var(--border)', ...style }} />;
}
