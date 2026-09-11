import { useState } from 'react';

// A plain <img> that fades in once loaded instead of popping in the
// instant the browser finishes decoding it — used on the app's hero/
// backdrop photos (Login/SignUp, Home's header, PageHeaderPhoto banners,
// the on-screen Kutipan/Sejarah cards), which previously all just
// snapped from blank to fully-visible, a visible "flash" on a slow
// connection. Not applied to small thumbnails (KartuUcapan's photo
// picker row, tile icons) — fading in a dozen small swatches at once
// reads as fussy, not premium.
export default function FadeImage({ style, onLoad, ...rest }) {
  const [loaded, setLoaded] = useState(false);
  return (
    <img
      {...rest}
      onLoad={(e) => {
        setLoaded(true);
        onLoad?.(e);
      }}
      style={{
        ...style,
        opacity: loaded ? 1 : 0,
        transition: 'opacity var(--dur-3) var(--ease)',
      }}
    />
  );
}
