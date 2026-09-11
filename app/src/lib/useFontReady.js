import { useEffect, useState } from 'react';

// Waits for a specific font to actually be usable (Font Loading API)
// before flipping to true. Used to gate a page's Arabic-text render so
// the first paint doesn't show the fallback serif and then visibly
// reflow a beat later once Amiri/Scheherazade New swaps in — Google
// Fonts' own `display=swap` (index.html) guarantees exactly that swap,
// and Arabic ligature widths differ enough from the fallback that the
// jump is genuinely visible, not a subtle sub-pixel thing. Mode Mushaf's
// MushafReader already solved the equivalent problem for its own QCF
// glyph fonts (re-running its shrink-to-fit loop once `FontFace().load()`
// resolves); this is the same idea for Mode Ayat's plain Unicode text.
export function useFontReady(fontSpec) {
  const [ready, setReady] = useState(false);
  useEffect(() => {
    setReady(false);
    if (typeof document === 'undefined' || !('fonts' in document)) {
      setReady(true); // no Font Loading API to gate on — just render
      return;
    }
    let cancelled = false;
    // Race against a plain timeout — a slow/broken connection shouldn't
    // hold the skeleton up forever; worse case, this just falls back to
    // the old "fallback font, then swap" behavior for that one visit.
    Promise.race([document.fonts.load(fontSpec), new Promise((resolve) => setTimeout(resolve, 2500))])
      .catch(() => {})
      .then(() => {
        if (!cancelled) setReady(true);
      });
    return () => {
      cancelled = true;
    };
  }, [fontSpec]);
  return ready;
}
