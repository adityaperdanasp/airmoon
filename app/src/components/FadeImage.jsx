import { useState } from 'react';

// A plain <img> that fades in once loaded instead of popping in the
// instant the browser finishes decoding it — used on the app's hero/
// backdrop photos (Login/SignUp, Home's header, PageHeaderPhoto banners,
// the on-screen Kutipan/Sejarah cards), which previously all just
// snapped from blank to fully-visible, a visible "flash" on a slow
// connection. Not applied to small thumbnails (KartuUcapan's photo
// picker row, tile icons) — fading in a dozen small swatches at once
// reads as fussy, not premium.
export default function FadeImage({ style, className, onLoad, ...rest }) {
  const [loaded, setLoaded] = useState(false);
  return (
    <img
      {...rest}
      onLoad={(e) => {
        setLoaded(true);
        onLoad?.(e);
      }}
      // [UI 2026-09-11] `.fade-image` carries the transition, not an
      // inline style — this was previously a plain inline `transition`,
      // which theme.css's shared prefers-reduced-motion rule can't reach
      // (that rule targets classes). Someone with that OS preference set
      // was still getting the animated fade. The opacity itself stays
      // inline (it's per-instance state, not motion) — the image still
      // only appears once actually loaded either way, reduced motion
      // just means no animated crossfade on the way in.
      className={className ? `fade-image ${className}` : 'fade-image'}
      style={{ ...style, opacity: loaded ? 1 : 0 }}
    />
  );
}
